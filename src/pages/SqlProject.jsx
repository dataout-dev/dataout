import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Markdown from '../components/Markdown'
import { Feedback, QueryPanel, SchemaCard, WalkthroughPanel } from '../components/challenge/ChallengeParts'
import Cell from '../components/notebook/Cell'
import { pathIndex, pathUrl, projectById, sqlPath, tierById } from '../data/lessons'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { isStepUnlocked } from '../lib/lessonAccess'
import { loadExerciseProgress } from '../lib/exerciseProgress'
import { useChallenge } from '../lib/useChallenge'
import { useCompletedLessons } from '../lib/useCompletedLessons'
import { fetchDatasetBytes, fetchManifest } from '../lib/datasets'
import { createSqlClient, isStopped } from '../lib/sqlWorkerClient'
import { loadSavedNotebook, newCell, saveNotebook } from '../lib/notebook'
import { ArrowLeft, ArrowRight, Check, CircleCheck, Lightbulb, Plus, RotateCcw } from '../components/icons'

const partProgressId = (projectId, partId) => `project:${projectId}:${partId}`

async function saveCompletion(project, session, markCompleted) {
  markCompleted(project.id)
  if (session) {
    const { error } = await supabase.from('progress').upsert({ user_id: session.user.id, lesson_id: project.id })
    if (error) console.error('Failed to save project progress:', error)
  }
}

function ProjectPart({ project, part, index, total, onSolved }) {
  const challenge = useChallenge({
    datasetId: part.dataset,
    reference: part.reference,
    orderMatters: part.orderMatters,
    progressId: partProgressId(project.id, part.id),
    onSolved,
  })

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-10 items-start">
      <div className="text-left">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-dark">
          Part {index + 1} of {total}
        </p>
        <h2 className="font-display font-semibold text-3xl text-heading leading-[1.15] mb-5">{part.title}</h2>

        <div className="flex items-start gap-3 bg-surface rounded-2xl border border-heading/10 p-5 mb-6">
          <Lightbulb className="h-4 w-4 text-primary-accent mt-1 shrink-0" />
          <div className="min-w-0 text-sm [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:text-sm">
            <Markdown>{part.brief}</Markdown>
          </div>
        </div>

        <SchemaCard challenge={challenge} />
      </div>

      <div className="min-w-0">
        {challenge.progress.solved && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-correct/25 bg-correct/10 px-5 py-3 text-sm font-semibold text-correct">
            <CircleCheck className="h-4 w-4 shrink-0" /> This part is done.
          </div>
        )}
        <QueryPanel challenge={challenge} />
        <Feedback challenge={challenge} />
        <WalkthroughPanel challenge={challenge} walkthrough={part.walkthrough} reference={part.reference} subject="part" />
      </div>
    </div>
  )
}

function GuidedProjectView({ project, tier, completedIds, markCompleted, session }) {
  const [active, setActive] = useState(0)
  const [solved, setSolved] = useState(
    () => new Set(project.parts.filter((p) => loadExerciseProgress(partProgressId(project.id, p.id)).solved).map((p) => p.id))
  )

  const stepIndex = pathIndex(project.id)
  const next = sqlPath[stepIndex + 1]
  const alreadyCompleted = completedIds.has(project.id)
  const allDone = project.parts.every((p) => solved.has(p.id))

  const handleSolved = (partId) => {
    setSolved((prev) => {
      const nextSet = new Set(prev).add(partId)
      if (project.parts.every((p) => nextSet.has(p.id)) && !completedIds.has(project.id)) {
        saveCompletion(project, session, markCompleted)
      }
      return nextSet
    })
  }

  const part = project.parts[active]
  const doneCount = solved.size

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="border-b border-heading/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between text-sm">
          <Link to="/learn/sql" className="flex items-center gap-2 text-body-text hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> SQL path
          </Link>
          <p className="text-body-text">{tier.name} project</p>
        </div>
      </div>

      <div className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-8 py-10 sm:py-12 w-full">
        <div className="mb-8 rounded-2xl p-6" style={{ backgroundColor: tier.color }}>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#57534e]">Guided project</p>
          <h1 className="font-display text-3xl font-semibold text-[#1c1c1a] md:text-4xl">{project.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#3f3b37]">{project.tagline}</p>

          <div className="mt-5 max-w-md">
            <div className="mb-1.5 flex justify-between text-xs font-semibold text-[#1c1c1a]">
              <span>
                {doneCount} / {project.parts.length} parts
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/60">
              <div className="h-full rounded-full bg-[#1c1c1a]" style={{ width: `${(doneCount / project.parts.length) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-start gap-3 bg-surface rounded-2xl border border-heading/10 p-5">
          <Lightbulb className="h-4 w-4 text-primary-accent mt-1 shrink-0" />
          <div className="min-w-0 text-sm [&_p]:mb-3 [&_p:last-child]:mb-0">
            <Markdown>{project.intro}</Markdown>
          </div>
        </div>

        {(allDone || alreadyCompleted) && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-correct/25 bg-correct/10 px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-correct">
              <CircleCheck className="h-5 w-5 shrink-0" /> Project complete.{next && ' The next step is open.'}
            </p>
            <Link
              to={next ? pathUrl(next) : '/learn/sql'}
              className="flex items-center gap-2 rounded-lg bg-heading px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-heading/90"
            >
              {next ? 'Continue' : 'Back to the path'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div role="tablist" aria-label="Project parts" className="mb-8 flex flex-wrap gap-2">
          {project.parts.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors ${
                active === i
                  ? 'border-primary-accent bg-badge text-heading'
                  : 'border-heading/10 text-body-text hover:bg-heading/5 hover:text-heading'
              }`}
            >
              {solved.has(p.id) && <Check className="h-3.5 w-3.5 text-correct" />}
              Part {i + 1}
            </button>
          ))}
        </div>

        <ProjectPart
          key={part.id}
          project={project}
          part={part}
          index={active}
          total={project.parts.length}
          onSolved={() => handleSolved(part.id)}
        />

        <div className="mt-10 flex items-center justify-between border-t border-heading/10 pt-6 text-sm">
          <button
            type="button"
            onClick={() => setActive((i) => Math.max(0, i - 1))}
            disabled={active === 0}
            className="flex items-center gap-2 font-semibold text-heading transition-colors hover:text-primary-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Previous part
          </button>
          <button
            type="button"
            onClick={() => setActive((i) => Math.min(project.parts.length - 1, i + 1))}
            disabled={active === project.parts.length - 1}
            className="flex items-center gap-2 font-semibold text-heading transition-colors hover:text-primary-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next part <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

const KERNEL_TIMEOUT_MS = 30000

function UnguidedProjectView({ project, tier, completedIds, markCompleted, session }) {
  const storageKey = `dataout-notebook-project:${project.id}`
  const kernelId = `project-kernel:${project.id}`

  const [notebook, setNotebook] = useState(
    () =>
      loadSavedNotebook(storageKey) ?? {
        version: 1,
        datasetId: project.dataset,
        cells: [
          newCell(
            'markdown',
            `Investigate here. The **${project.dataset}** dataset is already loaded below — write SQL in a cell and press Ctrl+Enter to run it, or Shift+Enter to run it and add a new cell.`
          ),
        ],
      }
  )
  const [kernel, setKernel] = useState({ status: 'starting' })
  const [tables, setTables] = useState([])
  const [outputs, setOutputs] = useState({})
  const [running, setRunning] = useState(false)
  const [checked, setChecked] = useState(() => new Set())

  const clientRef = useRef(null)
  const counterRef = useRef(0)
  const ready = kernel.status === 'ready'

  const stepIndex = pathIndex(project.id)
  const next = sqlPath[stepIndex + 1]
  const alreadyCompleted = completedIds.has(project.id)

  useEffect(() => {
    const client = createSqlClient({ timeoutMs: KERNEL_TIMEOUT_MS })
    clientRef.current = client
    let cancelled = false

    ;(async () => {
      try {
        const list = await fetchManifest()
        const meta = list.find((d) => d.id === project.dataset)
        if (!meta) throw new Error(`The dataset "${project.dataset}" isn't available.`)
        const bytes = await fetchDatasetBytes(meta)
        if (cancelled) return
        await client.call('db.open', { id: kernelId, bytes })
        if (cancelled) return
        setTables(await client.call('db.describe', { id: kernelId }))
        setKernel({ status: 'ready' })
      } catch (err) {
        if (!cancelled && !isStopped(err)) setKernel({ status: 'error', error: err.message })
      }
    })()

    return () => {
      cancelled = true
      client.call('db.close', { id: kernelId }).catch(() => {})
      client.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.dataset])

  useEffect(() => {
    const timer = setTimeout(() => saveNotebook(notebook, storageKey), 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notebook])

  const runOnKernel = async (cells) => {
    const client = clientRef.current
    const sqlCells = cells.filter((c) => c.type === 'sql' && c.source.trim())
    if (!client || !ready || running || sqlCells.length === 0) return
    setRunning(true)
    try {
      const { outputs: results, count } = await client.call('db.runCells', {
        id: kernelId,
        cells: sqlCells.map(({ id, type, source }) => ({ id, type, source })),
        startCount: counterRef.current,
      })
      counterRef.current = count
      setOutputs((prev) => ({ ...prev, ...results }))
      setTables(await client.call('db.describe', { id: kernelId }))
    } catch (err) {
      if (!isStopped(err)) setKernel({ status: 'error', error: err.message })
    } finally {
      setRunning(false)
    }
  }

  const focusCell = (id) => {
    setTimeout(() => document.getElementById(`cell-input-${id}`)?.focus(), 0)
  }

  const updateCell = (id, patch) => {
    setNotebook((nb) => ({ ...nb, cells: nb.cells.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  }

  const addCellAfter = (afterId, type = 'sql', source = '') => {
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

  const advanceFrom = (cell) => {
    const at = notebook.cells.findIndex((c) => c.id === cell.id)
    const nextCell = notebook.cells.slice(at + 1).find((c) => c.type === 'sql')
    if (nextCell) focusCell(nextCell.id)
    else addCellAfter(notebook.cells[notebook.cells.length - 1].id)
  }

  const toggleCheck = (i) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const markComplete = () => saveCompletion(project, session, markCompleted)

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="border-b border-heading/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between text-sm">
          <Link to="/learn/sql" className="flex items-center gap-2 text-body-text hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> SQL path
          </Link>
          <p className="text-body-text">{tier.name} project</p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-12 w-full">
        <div className="mb-8 rounded-2xl p-6" style={{ backgroundColor: tier.color }}>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#57534e]">Unguided project</p>
          <h1 className="font-display text-3xl font-semibold text-[#1c1c1a] md:text-4xl">{project.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#3f3b37]">{project.tagline}</p>
        </div>

        {alreadyCompleted && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-correct/25 bg-correct/10 px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-correct">
              <CircleCheck className="h-5 w-5 shrink-0" /> Project complete.{next && ' The next step is open.'}
            </p>
            <Link
              to={next ? pathUrl(next) : '/learn/sql'}
              className="flex items-center gap-2 rounded-lg bg-heading px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-heading/90"
            >
              {next ? 'Continue' : 'Back to the path'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="mb-8 flex items-start gap-3 bg-surface rounded-2xl border border-heading/10 p-5">
          <Lightbulb className="h-4 w-4 text-primary-accent mt-1 shrink-0" />
          <div className="min-w-0 text-sm [&_p]:mb-3 [&_p:last-child]:mb-0">
            <Markdown>{project.brief}</Markdown>
          </div>
        </div>

        {kernel.status === 'starting' && <p className="mb-4 text-sm text-caption">Loading the database…</p>}
        {kernel.status === 'error' && (
          <div className="mb-4 rounded-xl border border-wrong/20 bg-wrong/5 px-4 py-3 text-sm text-body-text">
            <p className="font-semibold text-heading">The database couldn't start.</p>
            <p className="mt-1">{kernel.error}</p>
          </div>
        )}

        {ready && (
          <p className="mb-4 text-xs text-caption">
            {tables.length} table{tables.length === 1 ? '' : 's'} loaded: {tables.map((t) => t.name).join(', ')}
          </p>
        )}

        <div className="space-y-4">
          {notebook.cells.map((cell, index) => (
            <Cell
              key={cell.id}
              cell={cell}
              index={index}
              total={notebook.cells.length}
              output={outputs[cell.id]}
              kernelReady={ready && !running}
              schema={tables}
              onChange={(source) => updateCell(cell.id, { source })}
              onChangeType={(type) => updateCell(cell.id, { type })}
              onRun={() => runOnKernel([cell])}
              onRunAndAdvance={() => {
                runOnKernel([cell])
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
          <button
            type="button"
            onClick={() => addCellAfter(null, 'sql')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-heading/10 px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-heading/5"
          >
            <Plus className="h-3.5 w-3.5" /> SQL cell
          </button>
          <button
            type="button"
            onClick={() => addCellAfter(null, 'markdown')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-heading/10 px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-heading/5"
          >
            <Plus className="h-3.5 w-3.5" /> Markdown cell
          </button>
          <button
            type="button"
            onClick={() => setNotebook((nb) => ({ ...nb }))}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-heading/10 px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-heading/5"
            title="Your notebook is saved automatically in this browser"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Saved automatically
          </button>
        </div>

        <div className="mt-10 rounded-2xl border border-heading/10 bg-surface p-6">
          <p className="mb-4 text-sm font-semibold text-heading">Self-check before you mark this done</p>
          <ul className="mb-5 flex flex-col gap-2.5">
            {project.checklist.map((item, i) => (
              <li key={i}>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-body-text">
                  <input
                    type="checkbox"
                    checked={checked.has(i)}
                    onChange={() => toggleCheck(i)}
                    className="mt-0.5 accent-[var(--color-primary-accent)]"
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
          <p className="mb-4 text-xs text-caption">
            This checklist is for you — it isn't graded. Mark the project done whenever you're satisfied with your
            investigation.
          </p>
          <button
            type="button"
            onClick={markComplete}
            disabled={alreadyCompleted}
            className="flex items-center gap-2 rounded-lg bg-heading px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-heading/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check className="h-4 w-4" /> {alreadyCompleted ? 'Marked complete' : 'Mark project complete'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SqlProjectView() {
  const { projectId } = useParams()
  const project = projectById[projectId]
  const tier = project ? tierById[project.tier] : null

  const { session } = useAuth()
  const { completedIds, loaded, markCompleted } = useCompletedLessons()

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-12">
        <p className="text-body-text">Project not found.</p>
      </div>
    )
  }

  if (!loaded) return null
  if (!isStepUnlocked(project.id, completedIds)) return <Navigate to="/learn/sql" replace />

  return project.kind === 'guided' ? (
    <GuidedProjectView project={project} tier={tier} completedIds={completedIds} markCompleted={markCompleted} session={session} />
  ) : (
    <UnguidedProjectView project={project} tier={tier} completedIds={completedIds} markCompleted={markCompleted} session={session} />
  )
}

function SqlProject() {
  const { projectId } = useParams()
  return <SqlProjectView key={projectId} />
}

export default SqlProject
