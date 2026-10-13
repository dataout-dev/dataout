import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Markdown from '../../components/Markdown'
import PythonCell from '../../components/notebook/PythonCell'
import { PyCodePanel, PyFeedback } from '../../components/python/PyChallengeParts'
import { mlProjectById } from '../../data/ml/index.js'
import { isProjectUnlocked } from '../../lib/mlAccess'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../supabaseClient'
import { useSubscription } from '../../lib/useSubscription'
import { isPremiumKeyLocked, mlProjectKey } from '../../lib/premiumAccess'
import { useCompletedLessons } from '../../lib/useCompletedLessons'
import { usePythonChallenge } from '../../lib/usePythonChallenge'
import { mountDataset, resetSession, runSnippet, warmUpPython } from '../../lib/pythonGrading'
import { isStopped } from '../../lib/workerClient'
import { MAX_CELLS, newCell } from '../../lib/notebook'
import { parsePyNotebook, serializePyNotebook } from '../../lib/pythonNotebook'
import { ArrowLeft, Check, ChevronDown, CircleCheck, Lightbulb, Plus } from '../../components/icons'

const notebookKey = (projectId) => `dataout-notebook-ml-project:${projectId}`

function loadProjectNotebook(project) {
  try {
    const saved = localStorage.getItem(notebookKey(project.id))
    if (saved) return parsePyNotebook(saved)
  } catch {
    // fall through to a fresh starter notebook
  }
  return {
    version: 1,
    datasetId: project.dataset,
    cells: [
      newCell(
        'markdown',
        `Investigate here. The **${project.dataset}** dataset is already loaded — write Python in a cell and press ` +
          `Shift+Enter to run it and add a new cell. \`rows('${project.dataset}')\` returns its rows as a list of dictionaries.`
      ),
      newCell('python', ''),
    ],
  }
}

function saveProjectNotebook(project, notebook) {
  try {
    localStorage.setItem(notebookKey(project.id), serializePyNotebook(notebook))
  } catch {
    // best-effort only
  }
}

async function saveCompletion(project, session, markCompleted) {
  markCompleted(project.id)
  if (session) {
    const { error } = await supabase.from('progress').upsert({ user_id: session.user.id, lesson_id: project.id })
    if (error) console.error('Failed to save project progress:', error)
  }
}

function VerifyChallenge({ project, item, number }) {
  const challenge = usePythonChallenge({
    datasetId: project.dataset,
    given: item.given,
    starter: item.starter ?? 'answer = ',
    reference: item.reference,
    progressId: `ml-verify:${project.id}:${item.id}`,
  })

  return (
    <div className="rounded-2xl border border-heading/10 bg-cream p-5">
      <p className="mb-3 text-sm font-semibold text-heading">
        {number}. {item.label}
      </p>
      <div className="mb-4 text-sm text-body-text [&_p]:mb-2 [&_p:last-child]:mb-0">
        <Markdown>{item.task}</Markdown>
      </div>
      <PyCodePanel challenge={challenge} given={item.given} />
      <PyFeedback challenge={challenge} mode="exam" />
    </div>
  )
}

function VerifyPanel({ project }) {
  const [open, setOpen] = useState(false)
  if (!project.verify?.length) return null

  return (
    <div className="mt-10 rounded-2xl border border-heading/10 bg-surface p-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-heading">Check a few key numbers (optional)</p>
          <p className="mt-1 text-xs text-body-text">
            Entirely voluntary — this never affects whether you can mark the project complete. These check
            deterministic facts about the data (baselines, row counts) rather than your exact model's results, since
            two valid modeling approaches can reasonably disagree.
          </p>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-caption transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-5 flex flex-col gap-4">
          {project.verify.map((item, i) => (
            <VerifyChallenge key={item.id} project={project} item={item} number={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function Notebook({ project }) {
  const [notebook, setNotebook] = useState(() => loadProjectNotebook(project))
  const [kernel, setKernel] = useState({ status: 'starting' })
  const [outputs, setOutputs] = useState({})
  const [runningId, setRunningId] = useState(null)
  const session = `ml-project:${project.id}`

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        warmUpPython()
        await mountDataset(project.dataset)
        if (cancelled) return
        await resetSession(session)
        if (cancelled) return
        setKernel({ status: 'ready' })
      } catch (err) {
        if (!cancelled && !isStopped(err)) setKernel({ status: 'error', error: err.message })
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id])

  useEffect(() => {
    const timer = setTimeout(() => saveProjectNotebook(project, notebook), 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notebook])

  const ready = kernel.status === 'ready'
  const running = runningId !== null

  const runCell = async (cell) => {
    if (!ready || running || cell.type !== 'python' || !cell.source.trim()) return
    setRunningId(cell.id)
    try {
      const result = await runSnippet(session, cell.source, `<cell>`)
      setOutputs((prev) => ({ ...prev, [cell.id]: result }))
    } catch (err) {
      if (!isStopped(err)) setOutputs((prev) => ({ ...prev, [cell.id]: { failed: err.message } }))
    } finally {
      setRunningId(null)
    }
  }

  const focusCell = (id) => {
    setTimeout(() => document.getElementById(`cell-input-${id}`)?.focus(), 0)
  }

  const updateCell = (id, patch) => setNotebook((nb) => ({ ...nb, cells: nb.cells.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))

  const addCellAfter = (afterId, type = 'python', source = '') => {
    if (notebook.cells.length >= MAX_CELLS) return null
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

  return (
    <div>
      {kernel.status === 'starting' && <p className="mb-4 text-sm text-caption">Loading {project.dataset}...</p>}
      {kernel.status === 'error' && (
        <div className="mb-4 rounded-xl border border-wrong/20 bg-wrong/5 px-4 py-3 text-sm text-body-text">
          <p className="font-semibold text-heading">The dataset couldn't load.</p>
          <p className="mt-1">{kernel.error}</p>
        </div>
      )}

      <div className="space-y-4">
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
            onRun={() => runCell(cell)}
            onRunAndAdvance={() => {
              runCell(cell)
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
          onClick={() => addCellAfter(null, 'python')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-heading/10 px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-heading/5"
        >
          <Plus className="h-3.5 w-3.5" /> Python cell
        </button>
        <button
          type="button"
          onClick={() => addCellAfter(null, 'markdown')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-heading/10 px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-heading/5"
        >
          <Plus className="h-3.5 w-3.5" /> Markdown cell
        </button>
      </div>
    </div>
  )
}

function ProjectView({ project, completedIds, markCompleted, session }) {
  const [activeStep, setActiveStep] = useState(0)
  const [checked, setChecked] = useState(() => new Set())
  const alreadyCompleted = completedIds.has(project.id)
  const isGuided = project.kind === 'guided'

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
          <Link to="/learn/ml" className="flex items-center gap-2 text-body-text hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> Predictive Modeling path
          </Link>
          <p className="text-body-text">{isGuided ? 'Guided project' : 'Unguided project'}</p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-12 w-full">
        <div className="mb-8 rounded-2xl p-6" style={{ backgroundColor: '#cfe3f5' }}>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#57534e]">
            {isGuided ? 'Guided project' : 'Unguided project'}
          </p>
          <h1 className="font-display text-3xl font-semibold text-[#1c1c1a] md:text-4xl">{project.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#3f3b37]">{project.tagline}</p>
        </div>

        {alreadyCompleted && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-correct/25 bg-correct/10 px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-correct">
              <CircleCheck className="h-5 w-5 shrink-0" /> Project complete.
            </p>
            <Link to="/learn/ml" className="flex items-center gap-2 rounded-lg bg-heading px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-heading/90">
              Back to the path
            </Link>
          </div>
        )}

        <div className="mb-8 flex items-start gap-3 bg-surface rounded-2xl border border-heading/10 p-5">
          <Lightbulb className="h-4 w-4 text-primary-accent mt-1 shrink-0" />
          <div className="min-w-0 text-sm [&_p]:mb-3 [&_p:last-child]:mb-0">
            <Markdown>{isGuided ? 'Follow the steps below in your own notebook, at your own pace.' : project.intro}</Markdown>
          </div>
        </div>

        {isGuided && (
          <>
            <div role="tablist" aria-label="Project steps" className="mb-6 flex flex-wrap gap-2">
              {project.steps.map((step, i) => (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-selected={activeStep === i}
                  onClick={() => setActiveStep(i)}
                  className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors ${
                    activeStep === i ? 'border-primary-accent bg-badge text-heading' : 'border-heading/10 text-body-text hover:bg-heading/5 hover:text-heading'
                  }`}
                >
                  Step {i + 1}
                </button>
              ))}
            </div>
            <div className="mb-8 rounded-2xl border border-heading/10 bg-surface p-5">
              <p className="mb-2 font-semibold text-heading">{project.steps[activeStep].title}</p>
              <div className="text-sm text-body-text [&_p]:mb-2 [&_p:last-child]:mb-0">
                <Markdown>{project.steps[activeStep].body}</Markdown>
              </div>
            </div>
          </>
        )}

        <Notebook project={project} />

        <VerifyPanel project={project} />

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
                    className="mt-0.5 accent-primary-accent"
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
          <p className="mb-4 text-xs text-caption">
            This checklist is for you — it isn't graded. Mark the project done whenever you're satisfied with your
            model.
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

function MlProjectView() {
  const { projectId } = useParams()
  const project = mlProjectById[projectId]
  const { session } = useAuth()
  const { completedIds, loaded, markCompleted } = useCompletedLessons()
  const subscription = useSubscription()

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-12">
        <p className="text-body-text">Project not found.</p>
      </div>
    )
  }

  if (!loaded || !subscription.loaded) return null
  if (!subscription.isActive && !isProjectUnlocked(project.id, completedIds)) return <Navigate to="/learn/ml" replace />
  if (!completedIds.has(project.id) && isPremiumKeyLocked(mlProjectKey(project.id), subscription.isActive)) {
    return <Navigate to="/subscribe" replace />
  }

  return <ProjectView project={project} completedIds={completedIds} markCompleted={markCompleted} session={session} />
}

function MlProject() {
  const { projectId } = useParams()
  return <MlProjectView key={projectId} />
}

export default MlProject
