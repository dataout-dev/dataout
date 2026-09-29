import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { pyLessonById, pyTierById, pyTierLessons, pySections } from '../../data/python/index.js'
import { isLessonUnlocked, nextLessonAfter } from '../../lib/pythonAccess'
import { loadPythonDoc } from '../../lib/pythonDocs'
import { gradePractice, resetSession, runSamples, runSnippet, warmUpPython } from '../../lib/pythonGrading'
import { usePythonChallenge } from '../../lib/usePythonChallenge'
import { sharedPython } from '../../lib/pythonClient'
import { isStopped } from '../../lib/workerClient'
import { loadExerciseProgress, saveExerciseProgress } from '../../lib/exerciseProgress'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../supabaseClient'
import { useCompletedLessons } from '../../lib/useCompletedLessons'
import Markdown from '../../components/Markdown'
import PyMarkdown from '../../components/python/PyMarkdown'
import PythonOutput from '../../components/python/PythonOutput'
import ConceptCheck from '../../components/python/ConceptCheck'
import PythonEditor from '../../components/editor/PythonEditor'
import { PyCodePanel, PyFeedback, PyWalkthrough, StatusPill } from '../../components/python/PyChallengeParts'
import { ArrowLeft, ArrowRight, Check, CircleAlert, CircleCheck, CodeIcon, Lightbulb, Play, RotateCcw, Terminal } from '../../components/icons'

const pad = (n) => String(n).padStart(2, '0')

const realProgressId = (lessonId, index) => `py-real:${lessonId}:${index + 1}`
const practiceProgressId = (lessonId) => `py-practice:${lessonId}`

function LessonHeading({ tier, lesson, section, large = false }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl text-[#1c1c1a]" style={{ backgroundColor: tier.color }}>
          <CodeIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-accent-dark">
            Python · {tier.name} / Lesson {pad(lesson.number)}
          </p>
          <p className="text-sm text-body-text">{section.title}</p>
        </div>
      </div>
      <h1 className={`font-display font-semibold text-heading leading-[1.15] mb-5 ${large ? 'text-4xl md:text-5xl' : 'text-3xl'}`}>
        {lesson.title}
      </h1>
    </>
  )
}

function PracticeTab({ lesson, tier, section, onPassed, onOpenReal }) {
  const practice = lesson.practice
  const draftId = practiceProgressId(lesson.id)
  const [code, setCode] = useState(() => loadExerciseProgress(draftId).draft || practice.starter)
  const [busy, setBusy] = useState(null)
  const [output, setOutput] = useState(null)
  const [samples, setSamples] = useState(null)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const codeRef = useRef(code)

  useEffect(() => {
    codeRef.current = code
    const id = setTimeout(() => {
      const saved = loadExerciseProgress(draftId)
      saveExerciseProgress(draftId, { ...saved, draft: code })
    }, 400)
    return () => clearTimeout(id)
  }, [code, draftId])

  const clear = () => {
    setError('')
    setOutput(null)
    setSamples(null)
    setResults(null)
  }

  const handleError = (err) => {
    if (!isStopped(err)) setError(err.message)
  }

  const run = async () => {
    if (busy || !code.trim()) return
    setBusy('run')
    clear()
    try {
      const session = `practice:${lesson.id}`
      await resetSession(session)
      // Variables-mode lessons rely on pre-given values (e.g. `a`, `b`) that only exist via a
      // case's `setup` string during grading — without it, a plain Run would always NameError
      // before the student's own code ever runs. Preview with the first sample's setup instead.
      const setup = practice.mode === 'variables' ? (practice.samples?.[0]?.setup ?? practice.cases?.[0]?.setup ?? '') : ''
      const source = setup ? `${setup}\n${code}` : code
      const ran = await runSnippet(session, source, '<your code>')
      setOutput(ran)
      if (!ran.error && practice.samples?.length) setSamples(await runSamples(practice, code))
    } catch (err) {
      handleError(err)
    } finally {
      setBusy(null)
    }
  }

  const submit = async () => {
    if (busy || !code.trim()) return
    setBusy('submit')
    clear()
    try {
      const graded = await gradePractice(practice, code)
      setResults(graded)
      if (graded.every((r) => r.passed)) onPassed()
    } catch (err) {
      handleError(err)
    } finally {
      setBusy(null)
    }
  }

  const reset = () => {
    setCode(practice.starter)
    clear()
  }

  const allPassed = results ? results.every((r) => r.passed) : false
  const samplesOk = samples ? samples.every((s) => s.passed) : null

  const status = error
    ? 'ERROR'
    : busy
      ? busy === 'run'
        ? 'RUNNING'
        : 'CHECKING'
      : results
        ? allPassed
          ? 'PASSED'
          : 'RETRY'
        : output?.error
          ? 'ERROR'
          : samplesOk === true
            ? 'SAMPLE OK'
            : samplesOk === false
              ? 'RETRY'
              : 'READY'

  return (
    <div className="flex-1 max-w-[1600px] mx-auto px-8 py-12 grid lg:grid-cols-[360px_1fr] gap-10 w-full items-start">
      <div className="text-left">
        <LessonHeading tier={tier} lesson={lesson} section={section} />
        <div className="flex items-start gap-3 bg-surface rounded-2xl border border-heading/10 p-5">
          <Lightbulb className="h-4 w-4 text-primary-accent mt-1 shrink-0" />
          <div className="min-w-0 text-sm [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:text-sm">
            <p className="mb-2 text-sm font-semibold text-heading">Your task</p>
            <Markdown>{practice.prompt}</Markdown>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <div className="bg-surface rounded-2xl border border-heading/10 shadow-sm overflow-hidden mb-6">
          <div className="flex items-center justify-between px-5 py-3 border-b border-heading/10">
            <div className="flex items-center gap-2 text-sm text-body-text">
              <Terminal className="h-4 w-4 text-heading/60" />
              practice.py
            </div>
            <StatusPill status={status} />
          </div>

          <div className="flex bg-[#14161c]">
            <PythonEditor
              value={code}
              onChange={setCode}
              onRun={run}
              minLines={14}
              placeholder="# write your Python here"
              ariaLabel="Python code"
            />
          </div>

          <div className="flex items-center justify-between px-5 py-3.5 border-t border-heading/10">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-body-text">Ctrl + Enter to run</span>
            <div className="flex items-center gap-2.5 ml-auto">
              <button
                onClick={reset}
                disabled={!!busy}
                className="flex items-center gap-1.5 text-sm font-medium text-heading border border-heading/10 rounded-lg px-3.5 py-2 hover:bg-heading/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              {busy && (
                <button
                  onClick={() => sharedPython().stop()}
                  className="flex items-center gap-1.5 text-sm font-medium text-wrong border border-wrong/30 rounded-lg px-3.5 py-2 hover:bg-wrong/5 transition-colors"
                >
                  Stop
                </button>
              )}
              <button
                onClick={run}
                disabled={!!busy || !code.trim()}
                className="flex items-center gap-1.5 text-sm font-medium text-heading border border-heading/10 rounded-lg px-3.5 py-2 hover:bg-heading/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Run <Play className="h-3 w-3" />
              </button>
              <button
                onClick={submit}
                disabled={!!busy || !code.trim()}
                className="flex items-center gap-1.5 text-sm font-semibold bg-heading text-cream rounded-lg px-4 py-2 hover:bg-heading/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {busy === 'submit' ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-wrong/20 bg-wrong/5 p-5 mb-6">
            <CircleAlert className="h-5 w-5 text-wrong shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-heading mb-1">Something went wrong.</p>
              <p className="text-sm text-body-text break-words">{error}</p>
            </div>
          </div>
        )}

        {!error && output && (
          <div className="mb-6 rounded-2xl border border-heading/10 bg-surface p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent-dark">Output</p>
            <PythonOutput output={output} showTime={false} />
          </div>
        )}

        {!error && samples && (
          <div className="mb-6 rounded-2xl border border-heading/10 bg-surface p-6">
            <div className="flex items-start gap-3 mb-4">
              {samplesOk ? (
                <CircleCheck className="h-5 w-5 text-correct shrink-0 mt-0.5" />
              ) : (
                <CircleAlert className="h-5 w-5 text-wrong shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-heading">
                  {samplesOk ? 'Matches the samples.' : 'Not quite. Compare your results with the expected ones.'}
                </p>
                <p className="text-sm text-body-text mt-1">
                  {samplesOk
                    ? 'Press Submit to check it against the hidden test cases too.'
                    : 'These are examples. Submit also runs cases you have not seen.'}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-cream">
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-body-text">
                      {practice.mode === 'variables' ? 'Given' : 'Call'}
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-body-text">Expected</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-body-text">Yours</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {samples.map((s, i) => (
                    <tr key={i} className="border-t border-heading/5 align-top">
                      <td className="px-3 py-2.5 font-mono text-xs text-heading whitespace-pre-wrap">{s.expr}</td>
                      <td className="px-3 py-2.5 font-mono text-xs text-body-text whitespace-pre-wrap">{s.expected}</td>
                      <td className={`px-3 py-2.5 font-mono text-xs whitespace-pre-wrap ${s.passed ? 'text-body-text' : 'text-wrong'}`}>{s.got}</td>
                      <td className={`px-3 py-2.5 font-semibold ${s.passed ? 'text-correct' : 'text-wrong'}`} aria-label={s.passed ? 'Passed' : 'Failed'}>
                        {s.passed ? '✓' : '✗'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!error && results && (
          <div className="rounded-2xl border border-heading/10 bg-surface p-6">
            <div className="flex items-start gap-3 mb-4">
              {allPassed ? (
                <CircleCheck className="h-5 w-5 text-correct shrink-0 mt-0.5" />
              ) : (
                <CircleAlert className="h-5 w-5 text-wrong shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-heading">
                  {allPassed ? 'All test cases passed. Lesson complete.' : 'Not quite. Some test cases failed.'}
                </p>
                <p className="text-sm text-body-text mt-1">
                  {allPassed
                    ? 'Your code worked on every case.'
                    : 'The inputs behind each case stay hidden. Re-read the task, think about what else your code has to handle, and try again.'}
                </p>
              </div>
            </div>

            <ul className="divide-y divide-heading/5 border-t border-heading/5">
              {results.map((r) => (
                <li key={r.label} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-heading">{r.label}</span>
                  <span aria-label={r.passed ? 'Passed' : 'Failed'} className={`font-semibold ${r.passed ? 'text-correct' : 'text-wrong'}`}>
                    {r.passed ? '✓' : '✗'}
                  </span>
                </li>
              ))}
            </ul>

            {allPassed && lesson.real.length > 0 && (
              <button
                type="button"
                onClick={onOpenReal}
                className="mt-5 flex items-center gap-2 rounded-lg border border-heading/15 px-4 py-2 text-sm font-semibold text-heading transition-colors hover:bg-heading/5"
              >
                Try it on real data <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function RealChallenge({ lesson, index, challenge: real, total, onSolved }) {
  const challenge = usePythonChallenge({
    datasetId: real.dataset,
    given: real.hidden ? `${real.hidden}\n${real.given ?? ''}` : real.given,
    starter: real.starter ?? '# write your code here\nanswer = ',
    reference: real.reference,
    unordered: real.unordered,
    progressId: realProgressId(lesson.id, index),
    onSolved,
  })

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-10 w-full items-start">
      <div className="text-left">
        <p className="text-xs font-semibold tracking-widest uppercase text-accent-dark mb-3">
          On real data{total > 1 ? ` · Challenge ${index + 1} of ${total}` : ''}
        </p>
        <h2 className="font-display font-semibold text-3xl text-heading leading-[1.15] mb-5">{real.title}</h2>

        <div className="flex items-start gap-3 bg-surface rounded-2xl border border-heading/10 p-5 mb-6">
          <Lightbulb className="h-4 w-4 text-primary-accent mt-1 shrink-0" />
          <div className="min-w-0 text-sm [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:text-sm">
            <Markdown>{real.brief}</Markdown>
          </div>
        </div>

        {challenge.loadError && (
          <div className="rounded-2xl border border-wrong/20 bg-wrong/5 p-4 text-sm text-body-text">
            <p>{challenge.loadError}</p>
            <button onClick={challenge.retry} className="mt-2 font-semibold text-heading underline">
              Try again
            </button>
          </div>
        )}
      </div>

      <div className="min-w-0">
        {challenge.progress.solved && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-correct/25 bg-correct/10 px-5 py-3 text-sm font-semibold text-correct">
            <CircleCheck className="h-4 w-4 shrink-0" /> You solved this on real data.
          </div>
        )}
        <PyCodePanel challenge={challenge} given={real.given} />
        <PyFeedback challenge={challenge} />
        <PyWalkthrough challenge={challenge} walkthrough={real.walkthrough} reference={real.reference} subject="challenge" />
      </div>
    </div>
  )
}

function RealChallenges({ lesson }) {
  const challenges = lesson.real
  const [active, setActive] = useState(0)
  const [solved, setSolved] = useState(() => challenges.map((_, i) => loadExerciseProgress(realProgressId(lesson.id, i)).solved))

  return (
    <div className="flex-1 max-w-[1600px] mx-auto px-8 py-12 w-full">
      {challenges.length > 1 && (
        <div role="tablist" aria-label="Real-data challenges" className="mb-8 flex flex-wrap gap-2">
          {challenges.map((c, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors ${
                active === i ? 'border-primary-accent bg-badge text-heading' : 'border-heading/10 text-body-text hover:bg-heading/5 hover:text-heading'
              }`}
            >
              {solved[i] && <Check className="h-3.5 w-3.5 text-correct" />}
              Challenge {i + 1}
            </button>
          ))}
        </div>
      )}

      <RealChallenge
        key={active}
        lesson={lesson}
        index={active}
        challenge={challenges[active]}
        total={challenges.length}
        onSolved={() => setSolved((prev) => prev.map((value, i) => (i === active ? true : value)))}
      />
    </div>
  )
}

function LessonView() {
  const { lessonId } = useParams()
  const lesson = pyLessonById[lessonId]
  const tier = lesson ? pyTierById[lesson.tier] : null
  const section = lesson ? pySections.find((s) => s.id === lesson.section) : null

  const { session } = useAuth()
  const { completedIds, loaded, markCompleted } = useCompletedLessons()
  const [tab, setTab] = useState('learn')
  const [realOpened, setRealOpened] = useState(false)
  const [doc, setDoc] = useState(undefined)

  useEffect(() => {
    if (!lesson) return
    warmUpPython()
    let cancelled = false
    loadPythonDoc(lesson.id)
      .then((text) => {
        if (!cancelled) setDoc(text)
      })
      .catch(() => {
        if (!cancelled) setDoc(null)
      })
    return () => {
      cancelled = true
      sharedPython().call('py.reset', { session: `lesson:${lesson.id}` }).catch(() => {})
    }
  }, [lesson])

  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-12">
        <p className="text-body-text">Lesson not found.</p>
      </div>
    )
  }

  if (!loaded) return null
  if (!isLessonUnlocked(lesson.id, completedIds)) return <Navigate to="/learn/python" replace />

  const hasPractice = Boolean(lesson.practice)
  const hasReal = lesson.real.length > 0
  const tabs = [
    { id: 'learn', label: 'Learn' },
    ...(hasPractice ? [{ id: 'practice', label: 'Practice' }] : []),
    ...(hasReal ? [{ id: 'real', label: 'On real data' }] : []),
  ]

  const complete = async () => {
    markCompleted(lesson.id)
    if (session) {
      const { error } = await supabase.from('progress').upsert({ user_id: session.user.id, lesson_id: lesson.id })
      if (error) console.error('Failed to save progress:', error)
    }
  }

  const next = nextLessonAfter(lesson.id)
  const nextUrl = next ? `/learn/python/${next.id}` : `/learn/python/exam/${tier.id}`
  const nextLabel = next ? 'Next lesson' : `Take the ${tier.name} exam`
  const canProceed = completedIds.has(lesson.id) || tier.openLessons === true
  const total = pyTierLessons(tier.id).length

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="border-b border-heading/10">
        <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between text-sm">
          <Link to="/learn/python" className="flex items-center gap-2 text-body-text hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> Python path
          </Link>
          <p className="text-body-text hidden sm:block">
            {tier.name} · Lesson {pad(lesson.numberInTier)} · {lesson.title}
          </p>
          <p className="text-body-text">
            {pad(lesson.numberInTier)} / {total}
          </p>
        </div>
      </div>

      <div className="border-b border-heading/10">
        <div role="tablist" aria-label="Lesson sections" className="max-w-[1600px] mx-auto px-8 flex gap-8 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => {
                setTab(t.id)
                if (t.id === 'real') setRealOpened(true)
              }}
              className={`-mb-px whitespace-nowrap border-b-2 py-3.5 text-sm font-semibold transition-colors ${
                tab === t.id ? 'border-primary-accent text-heading' : 'border-transparent text-body-text hover:text-heading'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div id="panel-learn" role="tabpanel" aria-labelledby="tab-learn" hidden={tab !== 'learn'} className="flex-1 max-w-[1600px] mx-auto px-8 py-12 w-full">
        <div className="max-w-3xl">
          <LessonHeading tier={tier} lesson={lesson} section={section} large />

          {doc === undefined ? (
            <p className="text-sm text-body-text">Loading lesson...</p>
          ) : doc === null ? (
            <p className="text-body-text leading-relaxed">There is no written lesson for this topic yet.</p>
          ) : (
            <PyMarkdown lessonId={lesson.id}>{doc}</PyMarkdown>
          )}

          {lesson.check.length > 0 && (
            <ConceptCheck
              key={lesson.id}
              questions={lesson.check}
              alreadyPassed={!hasPractice && completedIds.has(lesson.id)}
              required={!hasPractice}
              onPass={() => {
                if (!hasPractice) complete()
              }}
            />
          )}

          {hasPractice && (
            <div className="mt-10 border-t border-heading/10 pt-6">
              <button
                type="button"
                onClick={() => {
                  setTab('practice')
                  window.scrollTo({ top: 0 })
                }}
                className="flex items-center gap-2 rounded-lg bg-heading px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-heading/90"
              >
                Start practicing <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {hasPractice && (
        <div id="panel-practice" role="tabpanel" aria-labelledby="tab-practice" hidden={tab !== 'practice'} className="flex-1 flex flex-col">
          <PracticeTab
            lesson={lesson}
            tier={tier}
            section={section}
            onPassed={complete}
            onOpenReal={() => {
              setTab('real')
              setRealOpened(true)
              window.scrollTo({ top: 0 })
            }}
          />
        </div>
      )}

      {hasReal && (
        <div id="panel-real" role="tabpanel" aria-labelledby="tab-real" hidden={tab !== 'real'} className="flex-1">
          {realOpened && <RealChallenges lesson={lesson} />}
        </div>
      )}

      <div className="border-t border-heading/10">
        <div className="max-w-[1600px] mx-auto px-8 py-5 flex items-center justify-between text-sm">
          <Link to="/learn/python" className="flex items-center gap-2 text-body-text hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to lessons
          </Link>

          <Link
            to={nextUrl}
            aria-disabled={!canProceed}
            onClick={(e) => {
              if (!canProceed) e.preventDefault()
            }}
            className={`flex items-center gap-2 font-semibold transition-colors ${
              canProceed ? 'text-heading hover:text-primary-accent' : 'text-body-text opacity-50 cursor-not-allowed'
            }`}
          >
            {nextLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function PythonLesson() {
  const { lessonId } = useParams()
  return <LessonView key={lessonId} />
}

export default PythonLesson
