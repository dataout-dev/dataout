import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchManifest, fetchDatasetBytes } from '../lib/datasets'
import { NO_SESSION, isStopped } from '../lib/workerClient'
import { PYTHON_STARTUP_TIMEOUT_MS, createPythonClient } from '../lib/pythonClient'
import { MAX_CELLS, MAX_IMPORT_BYTES, newCell } from '../lib/notebook'
import {
  DEFAULT_PY_DATASET_ID,
  loadSavedPyNotebook,
  parsePyNotebook,
  savePyNotebook,
  serializePyNotebook,
  starterPyNotebook,
} from '../lib/pythonNotebook'
import PythonCell from '../components/notebook/PythonCell'
import { ArrowLeft, ChevronDown, Database, Download, Play, Plus, RotateCcw, Upload, X } from '../components/icons'

const button =
  'inline-flex items-center gap-1.5 rounded-lg border border-heading/10 px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-heading/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'
const link = 'font-medium text-heading underline underline-offset-2 hover:opacity-80'

const KERNEL = 'kernel'
const PACKAGE_TIMEOUT_MS = 180000
const LIBRARY_RUN_TIMEOUT_MS = 120000

async function bootKernel(datasetId, datasets, ctx) {
  const bootId = ++ctx.bootIdRef.current
  const stale = () => bootId !== ctx.bootIdRef.current
  const client = ctx.clientRef.current

  try {
    await client.call('py.init', {}, { timeout: PYTHON_STARTUP_TIMEOUT_MS })
    if (stale()) return false

    if (ctx.mountedRef.current) client.forget(ctx.mountedRef.current)
    ctx.mountedRef.current = null

    if (datasetId) {
      const dataset = datasets.find((d) => d.id === datasetId)
      if (!dataset) throw new Error(`The dataset "${datasetId}" isn't available.`)
      const bytes = await fetchDatasetBytes(dataset)
      if (stale()) return false
      const key = `mount:${datasetId}`
      await client.call('py.mount', { id: datasetId, bytes }, { remember: key })
      ctx.mountedRef.current = key
    }

    await client.call('py.reset', { session: KERNEL })
    if (stale()) return false

    ctx.counterRef.current = 0
    ctx.setOutputs({})
    ctx.setKernel({ status: 'ready' })
    return true
  } catch (err) {
    if (!stale() && !isStopped(err)) ctx.setKernel({ status: 'error', error: err.message })
    return false
  }
}

function PythonPlayground() {
  const [notebook, setNotebook] = useState(() => loadSavedPyNotebook() ?? starterPyNotebook(DEFAULT_PY_DATASET_ID))
  const [datasets, setDatasets] = useState([])
  const [kernel, setKernel] = useState({ status: 'starting' })
  const [outputs, setOutputs] = useState({})
  const [runningId, setRunningId] = useState(null)
  const [notice, setNotice] = useState(null)
  const [saved, setSaved] = useState(true)

  const clientRef = useRef(null)
  const bootIdRef = useRef(0)
  const counterRef = useRef(0)
  const mountedRef = useRef(null)
  const initialDatasetId = useRef(notebook.datasetId)
  const fileInputRef = useRef(null)

  const dataset = datasets.find((d) => d.id === notebook.datasetId) ?? null
  const ready = kernel.status === 'ready'
  const running = runningId !== null

  const bootContext = { bootIdRef, clientRef, counterRef, mountedRef, setOutputs, setKernel }

  useEffect(() => {
    const client = createPythonClient()
    clientRef.current = client
    return () => {
      client.dispose()
      clientRef.current = null
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      let list = []
      try {
        list = await fetchManifest()
      } catch (err) {
        if (!cancelled) setNotice(`${err.message} You can still use Python without a dataset.`)
      }
      if (cancelled) return

      setDatasets(list)
      const wanted = initialDatasetId.current
      const available = wanted && list.some((d) => d.id === wanted)
      if (wanted && !available) {
        setNotebook((nb) => ({ ...nb, datasetId: null }))
        setNotice((prev) => prev ?? `The dataset "${wanted}" isn't available, so this notebook opened without one.`)
      }
      await bootKernel(available ? wanted : null, list, bootContext)
    })()

    return () => {
      cancelled = true
      bootIdRef.current += 1
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setSaved(savePyNotebook(notebook)), 400)
    return () => clearTimeout(timer)
  }, [notebook])

  const restart = async ({ datasetId = notebook.datasetId, cells = notebook.cells, runAll = false } = {}) => {
    setKernel({ status: 'starting' })
    setNotice(null)
    const ok = await bootKernel(datasetId, datasets, bootContext)
    if (ok && runAll) await runAllCells(cells)
  }

  const kernelLost = async (err) => {
    const lost =
      err?.code === NO_SESSION || isStopped(err) || err?.name === 'SqlTimeout' || /stopped unexpectedly/.test(err?.message ?? '')
    if (!lost) {
      setNotice(err.message)
      return
    }
    const why = isStopped(err) ? 'Stopped.' : err.message
    await restart()
    setNotice(`${why} Python was restarted, so the variables from earlier cells are gone. Run the cells again to rebuild them.`)
  }

  const runOnKernel = async (cells, { stopOnError = false } = {}) => {
    const client = clientRef.current
    if (!client || running) return

    const toRun = cells.filter((c) => c.type === 'python' && c.source.trim())
    if (toRun.length === 0) return

    if (stopOnError) setOutputs({})

    for (const cell of toRun) {
      setRunningId(cell.id)
      const count = counterRef.current + 1
      counterRef.current = count
      try {
        const { heavy } = await client.call('py.prepare', { source: cell.source }, { timeout: PACKAGE_TIMEOUT_MS })
        const result = await client.call(
          'py.run',
          { session: KERNEL, source: cell.source, filename: `<cell ${count}>` },
          heavy ? { timeout: LIBRARY_RUN_TIMEOUT_MS } : {}
        )
        setOutputs((prev) => ({ ...prev, [cell.id]: { ...result, count } }))
        if (result.error && stopOnError) break
      } catch (err) {
        if (isStopped(err) || err?.name === 'SqlTimeout' || err?.code === NO_SESSION) {
          setRunningId(null)
          await kernelLost(err)
          return
        }
        setOutputs((prev) => ({ ...prev, [cell.id]: { failed: err.message, count } }))
        if (stopOnError) break
      }
    }
    setRunningId(null)
  }

  const runAllCells = (cells = notebook.cells) => runOnKernel(cells, { stopOnError: true })

  const runOneCell = (cell) => {
    if (!ready) return
    return runOnKernel([cell])
  }

  const stopRunning = () => clientRef.current?.stop()

  const focusCell = (id) => {
    setTimeout(() => document.getElementById(`cell-input-${id}`)?.focus(), 0)
  }

  const updateCell = (id, patch) => {
    setNotebook((nb) => ({ ...nb, cells: nb.cells.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  }

  const addCellAfter = (afterId, type = 'python', source = '') => {
    if (notebook.cells.length >= MAX_CELLS) {
      setNotice(`A notebook can have at most ${MAX_CELLS} cells.`)
      return null
    }
    const cell = newCell(type, source)
    setNotebook((nb) => {
      const cells = [...nb.cells]
      const at = afterId ? cells.findIndex((c) => c.id === afterId) + 1 : cells.length
      cells.splice(at, 0, cell)
      return { ...nb, cells }
    })
    focusCell(cell.id)
    return cell
  }

  const deleteCell = (id) => {
    setNotebook((nb) => {
      const cells = nb.cells.filter((c) => c.id !== id)
      return { ...nb, cells: cells.length ? cells : [newCell('python')] }
    })
    setOutputs((prev) => {
      const { [id]: _removed, ...rest } = prev
      return rest
    })
  }

  const moveCell = (id, delta) => {
    setNotebook((nb) => {
      const from = nb.cells.findIndex((c) => c.id === id)
      const to = from + delta
      if (from === -1 || to < 0 || to >= nb.cells.length) return nb
      const cells = [...nb.cells]
      ;[cells[from], cells[to]] = [cells[to], cells[from]]
      return { ...nb, cells }
    })
  }

  const advanceFrom = (cell) => {
    const at = notebook.cells.findIndex((c) => c.id === cell.id)
    const next = notebook.cells.slice(at + 1).find((c) => c.type === 'python')
    if (next) focusCell(next.id)
    else addCellAfter(notebook.cells[notebook.cells.length - 1].id)
  }

  const changeDataset = async (value) => {
    const datasetId = value || null
    if (datasetId === notebook.datasetId) return
    if (!window.confirm('Switching datasets restarts the Python session. Your cells are kept.')) return
    setNotebook((nb) => ({ ...nb, datasetId }))
    await restart({ datasetId })
  }

  const startNewNotebook = async () => {
    if (!window.confirm('Start a new notebook? This replaces the cells in this one. Export first if you want to keep them.')) return
    const fresh = starterPyNotebook(notebook.datasetId)
    setNotebook(fresh)
    await restart({ cells: fresh.cells })
  }

  const exportNotebook = () => {
    const blob = new Blob([serializePyNotebook(notebook)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'dataout-python-notebook.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const importNotebook = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      if (file.size > MAX_IMPORT_BYTES) throw new Error('That file is too large to be a notebook.')
      const imported = parsePyNotebook(await file.text())
      const known = imported.datasetId && datasets.some((d) => d.id === imported.datasetId)
      const next = { ...imported, datasetId: known ? imported.datasetId : null }

      setNotebook(next)
      await restart({ datasetId: next.datasetId, cells: next.cells })
      if (imported.datasetId && !known) {
        setNotice(`That notebook used the dataset "${imported.datasetId}", which isn't available here, so it opened without one.`)
      }
    } catch (err) {
      setNotice(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-5xl px-8 py-10">
        <Link
          to="/playground"
          className="mb-8 inline-flex items-center gap-2 text-sm text-caption transition-colors hover:text-heading"
        >
          <ArrowLeft className="h-4 w-4" /> All playgrounds
        </Link>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-dark">Python playground</p>
        <h1 className="mb-3 font-display text-4xl font-semibold leading-[1.1] text-heading md:text-5xl">
          Your Python notebook.
        </h1>
        <p className="mb-8 max-w-xl text-body-text">
          Write Python in cells, run them one by one, and keep notes in between. Libraries like pandas and numpy load
          the first time you import them. Everything runs in your browser and nothing is sent anywhere.
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          <label className="flex items-center gap-2 rounded-lg border border-heading/10 bg-surface py-1.5 pl-3 pr-1.5 text-sm text-caption">
            <Database className="h-4 w-4" />
            <span className="sr-only">Dataset</span>
            <select
              value={notebook.datasetId ?? ''}
              onChange={(e) => changeDataset(e.target.value)}
              aria-label="Dataset"
              className="rounded-md bg-transparent py-1 pr-1 text-sm font-medium text-heading focus:outline-none"
            >
              <option value="">No dataset</option>
              {datasets.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>

          <button type="button" onClick={() => runAllCells()} disabled={!ready || running} className={button}>
            <Play className="h-3 w-3" /> Run all
          </button>
          {running && (
            <button type="button" onClick={stopRunning} className={`${button} border-wrong/30 text-wrong`}>
              <X className="h-3.5 w-3.5" /> Stop
            </button>
          )}
          <button type="button" onClick={() => restart()} disabled={kernel.status === 'starting' || running} className={button}>
            <RotateCcw className="h-3.5 w-3.5" /> Restart
          </button>
          <button
            type="button"
            onClick={() => restart({ runAll: true })}
            disabled={kernel.status === 'starting' || running}
            className={button}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Restart &amp; run all
          </button>

          <div className="ml-auto flex flex-wrap items-center gap-2.5">
            <button type="button" onClick={exportNotebook} className={button} title="Save this notebook as a file">
              <Download className="h-3.5 w-3.5" /> Export notebook
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={button}
              title="Open a notebook file you exported earlier"
            >
              <Upload className="h-3.5 w-3.5" /> Import notebook
            </button>
            <button type="button" onClick={startNewNotebook} className={button}>
              New
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={importNotebook}
              className="hidden"
              aria-label="Import a notebook file"
            />
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className="mb-4 flex items-start justify-between gap-4 rounded-xl border border-heading/10 bg-badge px-4 py-3 text-sm text-body-text"
          >
            <p>{notice}</p>
            <button type="button" onClick={() => setNotice(null)} className="shrink-0 font-medium text-heading hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {kernel.status === 'starting' && (
          <p className="mb-4 text-sm text-caption">Starting Python... the first visit downloads a few megabytes, so it can take a moment.</p>
        )}
        {kernel.status === 'error' && (
          <div className="mb-4 rounded-xl border border-wrong/20 bg-wrong/5 px-4 py-3 text-sm text-body-text">
            <p className="font-semibold text-heading">Python couldn't start.</p>
            <p className="mt-1">{kernel.error}</p>
            <button type="button" onClick={() => restart()} className={`${button} mt-3`}>
              Try again
            </button>
          </div>
        )}

        {dataset && (
          <div className="mb-4 rounded-2xl border border-heading/10 bg-surface p-5">
            <p className="text-sm font-semibold text-heading">{dataset.name}</p>
            <p className="mt-1 text-xs text-body-text">
              Load it with{' '}
              <code className="rounded bg-heading/10 px-1 py-0.5 font-mono text-heading">rows('{dataset.id}')</code>
              {dataset.id === 'chinook' || dataset.id === 'nycflights13'
                ? ` (pass a table name, for example rows('${dataset.id}', '${dataset.id === 'chinook' ? 'Track' : 'flights'}')), or use sql() and tables().`
                : ' to get a list of dictionaries.'}
            </p>
            <p className="mt-2 text-xs text-body-text">
              Data by {dataset.author}, from{' '}
              <a href={dataset.source.url} target="_blank" rel="noreferrer noopener" className={link}>
                {dataset.source.name}
              </a>
              . Licensed under{' '}
              <a href={dataset.license.url} target="_blank" rel="noreferrer noopener" className={link}>
                {dataset.license.name}
              </a>
              . Modified from the original.
            </p>

            <details className="group mt-3">
              <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-heading [&::-webkit-details-marker]:hidden">
                About this dataset
                <ChevronDown className="h-3.5 w-3.5 text-caption transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-body-text">
                <p>{dataset.description}</p>
                <p>
                  <span className="font-semibold text-heading">What we changed: </span>
                  {dataset.changes}
                </p>
              </div>
            </details>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {notebook.cells.map((cell, index) => (
            <PythonCell
              key={cell.id}
              cell={cell}
              index={index}
              total={notebook.cells.length}
              output={outputs[cell.id]}
              running={runningId === cell.id}
              kernelReady={ready && !running}
              onChange={(source) => updateCell(cell.id, { source })}
              onChangeType={(type) => updateCell(cell.id, { type })}
              onRun={() => runOneCell(cell)}
              onRunAndAdvance={() => {
                runOneCell(cell)
                advanceFrom(cell)
              }}
              onAdvance={() => advanceFrom(cell)}
              onMove={(delta) => moveCell(cell.id, delta)}
              onAddBelow={() => addCellAfter(cell.id)}
              onDelete={() => deleteCell(cell.id)}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2.5 pl-[68px]">
          <button type="button" onClick={() => addCellAfter(null, 'python')} className={button}>
            <Plus className="h-3.5 w-3.5" /> Python cell
          </button>
          <button type="button" onClick={() => addCellAfter(null, 'markdown')} className={button}>
            <Plus className="h-3.5 w-3.5" /> Markdown cell
          </button>
        </div>

        <p className="mt-10 pl-[68px] text-xs text-caption">
          Shift+Enter runs a cell and moves to the next one. Ctrl+Enter runs it and stays. Tab indents. Cells are saved in
          this browser
          {saved ? '.' : ', but this browser is refusing to save right now, so use Export to keep your work.'} The
          input() function isn't available yet.
        </p>
      </div>
    </div>
  )
}

export default PythonPlayground
