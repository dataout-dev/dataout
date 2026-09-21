import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadSql } from '../lib/sqlEngine'
import { fetchManifest, fetchDatasetBytes } from '../lib/datasets'
import { importCsv, MAX_UPLOAD_BYTES } from '../lib/csvImport'
import {
  MAX_TOTAL_UPLOAD_BYTES,
  MAX_UPLOADS,
  deleteUpload,
  listUploads,
  saveUpload,
} from '../lib/uploadStore'
import {
  DEFAULT_DATASET_ID,
  MAX_CELLS,
  MAX_IMPORT_BYTES,
  describeDb,
  loadSavedNotebook,
  newCell,
  newId,
  parseNotebook,
  runCells,
  saveNotebook,
  serializeNotebook,
  starterNotebook,
} from '../lib/notebook'
import Cell from '../components/notebook/Cell'
import {
  ArrowLeft,
  ChevronDown,
  Database,
  Download,
  Play,
  Plus,
  RotateCcw,
  Table,
  Trash,
  Upload,
} from '../components/icons'

const button =
  'inline-flex items-center gap-1.5 rounded-lg border border-heading/10 px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-heading/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'
// Attribution is a license requirement, so it uses the high-contrast text tokens (the accent
// color is too faint for small text on some themes).
const link = 'font-medium text-heading underline underline-offset-2 hover:opacity-80'


async function bootKernel(datasetId, datasets, ctx) {
  const bootId = ++ctx.bootIdRef.current
  try {
    const SQL = await loadSql()
    let db
    if (datasetId) {
      const dataset = datasets.find((d) => d.id === datasetId)
      if (!dataset) throw new Error(`The dataset "${datasetId}" isn't available.`)
      db = new SQL.Database(await fetchDatasetBytes(dataset))
    } else {
      db = new SQL.Database()
    }

    if (bootId !== ctx.bootIdRef.current) {
      db.close()
      return false
    }

    // Load the CSV files the user uploaded earlier (kept in this browser) into the fresh database.
    const problems = []
    const loaded = ctx.uploadsRef.current.map((upload) => {
      try {
        const summary = importCsv(db, upload.bytes, { fileName: upload.fileName, tableName: upload.tableName })
        if (summary.renamed) {
          problems.push(
            `The uploaded table "${upload.tableName}" was renamed "${summary.tableName}" because this database already has a table with that name.`
          )
        }
        return { id: upload.id, fileName: upload.fileName, tableName: summary.tableName }
      } catch (err) {
        problems.push(`Couldn't reload "${upload.fileName}": ${err.message}`)
        return { id: upload.id, fileName: upload.fileName, tableName: null }
      }
    })

    ctx.dbRef.current?.close()
    ctx.dbRef.current = db
    ctx.counterRef.current = 0
    ctx.setOutputs({})
    ctx.setUploads(loaded)
    if (problems.length) ctx.setNotice(problems.join(' '))
    ctx.setTables(describeDb(db))
    ctx.setKernel({ status: 'ready' })
    return true
  } catch (err) {
    if (bootId === ctx.bootIdRef.current) ctx.setKernel({ status: 'error', error: err.message })
    return false
  }
}

function Playground() {
  const [notebook, setNotebook] = useState(() => loadSavedNotebook() ?? starterNotebook(DEFAULT_DATASET_ID))
  const [datasets, setDatasets] = useState([])
  const [kernel, setKernel] = useState({ status: 'starting' })
  const [tables, setTables] = useState([])
  const [outputs, setOutputs] = useState({})
  const [notice, setNotice] = useState(null)
  const [saved, setSaved] = useState(true)
  const [uploads, setUploads] = useState([])

  const dbRef = useRef(null)
  const bootIdRef = useRef(0)
  const counterRef = useRef(0)
  const uploadsRef = useRef([])
  const csvInputRef = useRef(null)
  const initialDatasetId = useRef(notebook.datasetId)
  const fileInputRef = useRef(null)

  const dataset = datasets.find((d) => d.id === notebook.datasetId) ?? null
  const ready = kernel.status === 'ready'

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      let list = []
      try {
        list = await fetchManifest()
      } catch (err) {
        if (!cancelled) setNotice(`${err.message} You can still use an empty database.`)
      }
      if (cancelled) return

      try {
        uploadsRef.current = await listUploads()
      } catch {
        // Browser storage unavailable: uploads still work for this visit, they just won't be kept.
      }
      if (cancelled) return

      setDatasets(list)
      const wanted = initialDatasetId.current
      const available = wanted && list.some((d) => d.id === wanted)
      if (wanted && !available) {
        setNotebook((nb) => ({ ...nb, datasetId: null }))
        setNotice((prev) => prev ?? `The dataset "${wanted}" isn't available, so this notebook opened with an empty database.`)
      }
      await bootKernel(available ? wanted : null, list, {
        bootIdRef,
        dbRef,
        counterRef,
        uploadsRef,
        setOutputs,
        setTables,
        setKernel,
        setUploads,
        setNotice,
      })
    })()

    return () => {
      cancelled = true
      bootIdRef.current += 1
    }
  }, [])

  useEffect(
    () => () => {
      dbRef.current?.close()
      dbRef.current = null
    },
    []
  )

  useEffect(() => {
    const timer = setTimeout(() => setSaved(saveNotebook(notebook)), 400)
    return () => clearTimeout(timer)
  }, [notebook])

  // ------------------------------------------------------------------ kernel

  const restart = async ({ datasetId = notebook.datasetId, cells = notebook.cells, runAll = false } = {}) => {
    setKernel({ status: 'starting' })
    setNotice(null)
    const ok = await bootKernel(datasetId, datasets, {
      bootIdRef,
      dbRef,
      counterRef,
      uploadsRef,
      setOutputs,
      setTables,
      setKernel,
      setUploads,
      setNotice,
    })
    if (ok && runAll) runAllCells(cells)
  }

  const runAllCells = (cells = notebook.cells) => {
    if (!dbRef.current) return
    const { outputs: results, count } = runCells(dbRef.current, cells, counterRef.current, { stopOnError: true })
    counterRef.current = count
    setOutputs(results)
    setTables(describeDb(dbRef.current))
  }

  const runOneCell = (cell) => {
    if (!dbRef.current || !ready) return
    const { outputs: results, count } = runCells(dbRef.current, [cell], counterRef.current)
    counterRef.current = count
    setOutputs((prev) => ({ ...prev, ...results }))
    setTables(describeDb(dbRef.current))
  }

  // ------------------------------------------------------------------- cells

  const focusCell = (id) => {
    setTimeout(() => document.getElementById(`cell-input-${id}`)?.focus(), 0)
  }

  const updateCell = (id, patch) => {
    setNotebook((nb) => ({ ...nb, cells: nb.cells.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  }

  const addCellAfter = (afterId, type = 'sql', source = '') => {
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
      return { ...nb, cells: cells.length ? cells : [newCell('sql')] }
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

  // Moves focus to the next SQL cell, skipping rendered notes (they have no text box to type in).
  // At the end of the notebook it adds a new SQL cell.
  const advanceFrom = (cell) => {
    const at = notebook.cells.findIndex((c) => c.id === cell.id)
    const next = notebook.cells.slice(at + 1).find((c) => c.type === 'sql')
    if (next) focusCell(next.id)
    else addCellAfter(notebook.cells[notebook.cells.length - 1].id)
  }

  // ------------------------------------------------- dataset, export, import

  const changeDataset = async (value) => {
    const datasetId = value || null
    if (datasetId === notebook.datasetId) return
    if (!window.confirm('Switching datasets restarts the notebook database. Your cells are kept.')) return
    setNotebook((nb) => ({ ...nb, datasetId }))
    await restart({ datasetId })
  }

  const startNewNotebook = async () => {
    if (!window.confirm('Start a new notebook? This replaces the cells in this one. Export first if you want to keep them.')) return
    const fresh = starterNotebook(notebook.datasetId)
    setNotebook(fresh)
    await restart({ cells: fresh.cells })
  }

  const exportNotebook = () => {
    const blob = new Blob([serializeNotebook(notebook)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'dataout-notebook.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  // ------------------------------------------------------- uploaded CSV files

  const uploadCsv = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !dbRef.current || !ready) return

    try {
      if (uploads.length >= MAX_UPLOADS) {
        throw new Error(`You can keep up to ${MAX_UPLOADS} uploaded files. Remove one first.`)
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        throw new Error(`That file is too large (the limit is ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB).`)
      }

      const bytes = new Uint8Array(await file.arrayBuffer())
      const keptBytes = uploadsRef.current.reduce((sum, u) => sum + u.bytes.length, 0)
      if (keptBytes + bytes.length > MAX_TOTAL_UPLOAD_BYTES) {
        throw new Error('Your uploaded files would take up too much space. Remove one first.')
      }

      const summary = importCsv(dbRef.current, bytes, { fileName: file.name })
      const record = { id: newId(), tableName: summary.tableName, fileName: file.name, bytes, addedAt: Date.now() }

      let kept = true
      try {
        await saveUpload(record)
      } catch {
        kept = false
      }

      uploadsRef.current = [...uploadsRef.current, record]
      setUploads((prev) => [...prev, { id: record.id, fileName: file.name, tableName: summary.tableName }])
      setTables(describeDb(dbRef.current))
      addCellAfter(notebook.cells[notebook.cells.length - 1].id, 'sql', `SELECT *\nFROM ${summary.tableName}\nLIMIT 10;`)

      const parts = [`Loaded ${summary.rowCount.toLocaleString()} rows into ${summary.tableName} (${summary.columns.length} columns).`]
      if (summary.nullTokens > 0) {
        parts.push(`${summary.nullTokens.toLocaleString()} values written as NaN or null were stored as NULL.`)
      }
      if (summary.encoding !== 'UTF-8') parts.push(`The file wasn't UTF-8, so it was read as ${summary.encoding}.`)
      parts.push('A starter query was added at the end of the notebook.')
      if (!kept) parts.push("This browser couldn't save the file, so it will be gone after you reload.")
      setNotice(parts.join(' '))
    } catch (err) {
      setNotice(err.message)
    }
  }

  const removeUpload = async (upload) => {
    const label = upload.tableName ?? upload.fileName
    if (!window.confirm(`Remove "${label}"? Cells that use it will stop working.`)) return

    if (upload.tableName && dbRef.current) {
      dbRef.current.run(`DROP TABLE IF EXISTS "${upload.tableName.replace(/"/g, '""')}"`)
    }
    try {
      await deleteUpload(upload.id)
    } catch {
      // It was never saved, or storage is unavailable; removing it from this session is enough.
    }
    uploadsRef.current = uploadsRef.current.filter((u) => u.id !== upload.id)
    setUploads((prev) => prev.filter((u) => u.id !== upload.id))
    if (dbRef.current) setTables(describeDb(dbRef.current))
  }

  const importNotebook = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      if (/\.(csv|tsv)$/i.test(file.name)) {
        throw new Error('That looks like a data file, not a notebook. Use "Upload CSV" to load it as a table.')
      }
      if (file.size > MAX_IMPORT_BYTES) throw new Error('That file is too large to be a notebook.')
      const imported = parseNotebook(await file.text())
      const known = imported.datasetId && datasets.some((d) => d.id === imported.datasetId)
      const next = { ...imported, datasetId: known ? imported.datasetId : null }

      setNotebook(next)
      await restart({ datasetId: next.datasetId, cells: next.cells })
      if (imported.datasetId && !known) {
        setNotice(`That notebook used the dataset "${imported.datasetId}", which isn't available here, so it opened with an empty database.`)
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
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-accent">SQL playground</p>
        <h1 className="mb-3 font-display text-4xl font-semibold leading-[1.1] text-heading md:text-5xl">
          Your SQL notebook.
        </h1>
        <p className="mb-8 max-w-xl text-body-text">
          Write SQL in cells, run them one by one, and keep notes in between. Bring your own data by uploading a CSV
          file. Everything runs in your browser and your files never leave your device.
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
              <option value="">Empty database</option>
              {datasets.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => csvInputRef.current?.click()}
            disabled={!ready}
            title="Load a CSV file from your computer as a table"
            className={button}
          >
            <Table className="h-3.5 w-3.5" /> Upload CSV
          </button>
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv,.tsv,text/csv,text/tab-separated-values"
            onChange={uploadCsv}
            className="hidden"
            aria-label="Upload a CSV file"
          />

          <button type="button" onClick={() => runAllCells()} disabled={!ready} className={button}>
            <Play className="h-3 w-3" /> Run all
          </button>
          <button type="button" onClick={() => restart()} disabled={kernel.status === 'starting'} className={button}>
            <RotateCcw className="h-3.5 w-3.5" /> Restart
          </button>
          <button
            type="button"
            onClick={() => restart({ runAll: true })}
            disabled={kernel.status === 'starting'}
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
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="shrink-0 font-medium text-heading hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {kernel.status === 'starting' && <p className="mb-4 text-sm text-caption">Loading the database...</p>}
        {kernel.status === 'error' && (
          <div className="mb-4 rounded-xl border border-wrong/20 bg-wrong/5 px-4 py-3 text-sm text-body-text">
            <p className="font-semibold text-heading">The database couldn't start.</p>
            <p className="mt-1">{kernel.error}</p>
            <button type="button" onClick={() => restart({ datasetId: null })} className={`${button} mt-3`}>
              Use an empty database instead
            </button>
          </div>
        )}

        {dataset && (
          <div className="mb-4 rounded-2xl border border-heading/10 bg-surface p-5">
            <p className="text-sm font-semibold text-heading">{dataset.name}</p>
            <p className="mt-1 text-xs text-body-text">
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
                {dataset.notes?.length > 0 && (
                  <ul className="list-disc space-y-1 pl-5 marker:text-caption">
                    {dataset.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          </div>
        )}

        {ready && (
          <details className="group mb-8 rounded-2xl border border-heading/10 bg-surface p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-heading [&::-webkit-details-marker]:hidden">
              Tables in this database ({tables.length})
              <ChevronDown className="h-4 w-4 text-caption transition-transform group-open:rotate-180" />
            </summary>

            {tables.length === 0 ? (
              <p className="mt-3 text-sm text-body-text">No tables yet. Create one with a CREATE TABLE cell.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {tables.map((table) => {
                  const upload = uploads.find((u) => u.tableName === table.name)
                  return (
                  <div key={table.name}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-heading">
                        <span className="font-mono font-semibold">{table.name}</span>
                        <span className="text-body-text">
                          {' '}
                          · {table.rowCount.toLocaleString()} row{table.rowCount === 1 ? '' : 's'} · {table.columns.length} column
                          {table.columns.length === 1 ? '' : 's'}
                          {upload && ` · uploaded from ${upload.fileName}`}
                        </span>
                      </p>
                      {upload && (
                        <button
                          type="button"
                          onClick={() => removeUpload(upload)}
                          className="flex shrink-0 items-center gap-1 text-xs font-medium text-body-text hover:text-wrong"
                        >
                          <Trash className="h-3 w-3" /> Remove
                        </button>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {table.columns.map((column) => (
                        <span
                          key={column.name}
                          className="rounded-md bg-heading/10 px-1.5 py-0.5 font-mono text-xs text-heading"
                        >
                          {column.name} <span className="text-caption">{column.type}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  )
                })}

                {uploads.filter((u) => u.tableName === null).map((upload) => (
                  <div key={upload.id} className="flex items-start justify-between gap-3 text-sm text-body-text">
                    <p>
                      <span className="font-semibold text-heading">{upload.fileName}</span> couldn't be loaded into this
                      database.
                    </p>
                    <button
                      type="button"
                      onClick={() => removeUpload(upload)}
                      className="flex shrink-0 items-center gap-1 text-xs font-medium text-body-text hover:text-wrong"
                    >
                      <Trash className="h-3 w-3" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-4 text-xs text-body-text">
              Uploaded files are kept in this browser until you remove them. They are never sent to a server.
            </p>
          </details>
        )}

        <div className="space-y-4">
          {notebook.cells.map((cell, index) => (
            <Cell
              key={cell.id}
              cell={cell}
              index={index}
              total={notebook.cells.length}
              output={outputs[cell.id]}
              kernelReady={ready}
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
          <button type="button" onClick={() => addCellAfter(null, 'sql')} className={button}>
            <Plus className="h-3.5 w-3.5" /> SQL cell
          </button>
          <button type="button" onClick={() => addCellAfter(null, 'markdown')} className={button}>
            <Plus className="h-3.5 w-3.5" /> Markdown cell
          </button>
        </div>

        <p className="mt-10 pl-[68px] text-xs text-caption">
          Shift+Enter runs a cell and moves to the next one. Ctrl+Enter runs it and stays. Cells are saved in this
          browser{saved ? '.' : ', but this browser is refusing to save right now, so use Export to keep your work.'}
        </p>
      </div>
    </div>
  )
}

export default Playground
