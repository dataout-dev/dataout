import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { loadSql } from '../lib/sqlEngine'
import { lessonById, pathIndex, pathUrl, sqlPath, tierById } from '../data/lessons'
import { formatQueryResult, resultsMatch } from '../lib/sqlHelpers'
import { evaluateLesson, expectedFor, openCase } from '../lib/lessonGrading'
import { useChallenge } from '../lib/useChallenge'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { useCompletedLessons } from '../lib/useCompletedLessons'
import { isStepUnlocked } from '../lib/lessonAccess'
import { loadExerciseProgress } from '../lib/exerciseProgress'
import { loadLessonDoc } from '../lib/lessonDocs'
import Markdown from '../components/Markdown'
import { Feedback, QueryPanel, SchemaCard, WalkthroughPanel } from '../components/challenge/ChallengeParts'
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Terminal,
  Play,
  RotateCcw,
  Table,
  Lightbulb,
  Check,
  CircleCheck,
  CircleAlert,
} from '../components/icons'

function InlineText({ text }) {
  const parts = text.split(/`([^`]+)`/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className="inline-block bg-[#f1e4cd] text-[#1c1c1a] rounded-md px-1.5 py-0.5 text-[0.9em] font-mono">
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

const tabs = [
  { id: 'learn', label: 'Learn' },
  { id: 'practice', label: 'Practice' },
  { id: 'real', label: 'On real data' },
]

function LessonHeading({ tier, lesson, large = false }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#1c1c1a]"
          style={{ backgroundColor: tier.color }}
        >
          <Database className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-primary-accent">
            SQL · {tier.name} / Lesson {String(lesson.number).padStart(2, '0')}
          </p>
          <p className="text-sm text-body-text">{lesson.topic}</p>
        </div>
      </div>

      <h1
        className={`font-display font-semibold text-heading leading-[1.15] mb-5 ${
          large ? 'text-4xl md:text-5xl' : 'text-3xl'
        }`}
      >
        {lesson.title}
        {lesson.titleAccent && (
          <>
            <br />
            <span className="text-primary-accent">{lesson.titleAccent}</span>
          </>
        )}
      </h1>
    </>
  )
}

const realProgressId = (lessonId, index) => (index === 0 ? `lesson-real:${lessonId}` : `lesson-real:${lessonId}:${index + 1}`)

function RealChallenge({ lesson, index, challenge: real, total, onSolved }) {
  const challenge = useChallenge({
    datasetId: real.dataset,
    reference: real.reference,
    orderMatters: real.orderMatters,
    progressId: realProgressId(lesson.id, index),
    onSolved,
  })

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-10 w-full items-start">
      <div className="text-left">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary-accent mb-3">
          On real data{total > 1 ? ` · Challenge ${index + 1} of ${total}` : ''}
        </p>
        <h2 className="font-display font-semibold text-3xl text-heading leading-[1.15] mb-5">{real.title}</h2>

        <div className="flex items-start gap-3 bg-surface rounded-2xl border border-heading/10 p-5 mb-6">
          <Lightbulb className="h-4 w-4 text-primary-accent mt-1 shrink-0" />
          <div className="min-w-0 text-sm [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:text-sm">
            <Markdown>{real.brief}</Markdown>
          </div>
        </div>

        <SchemaCard challenge={challenge} />
      </div>

      <div className="min-w-0">
        {challenge.progress.solved && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-correct/25 bg-correct/10 px-5 py-3 text-sm font-semibold text-correct">
            <CircleCheck className="h-4 w-4 shrink-0" /> You solved this on real data.
          </div>
        )}
        <QueryPanel challenge={challenge} />
        <Feedback challenge={challenge} />
        <WalkthroughPanel challenge={challenge} walkthrough={real.walkthrough} reference={real.reference} subject="challenge" />
      </div>
    </div>
  )
}

function RealChallenges({ lesson }) {
  const challenges = lesson.challenges
  const [active, setActive] = useState(0)
  const [solved, setSolved] = useState(() =>
    challenges.map((_, i) => loadExerciseProgress(realProgressId(lesson.id, i)).solved)
  )

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
                active === i
                  ? 'border-primary-accent bg-badge text-heading'
                  : 'border-heading/10 text-body-text hover:bg-heading/5 hover:text-heading'
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
  const { lessonType, lessonId } = useParams()
  const lesson = lessonType === 'sql' ? lessonById[lessonId] : undefined
  const tier = lesson ? tierById[lesson.tier] : null
  const stepIndex = lesson ? pathIndex(lesson.id) : -1
  const nextStep = stepIndex === -1 ? null : sqlPath[stepIndex + 1]
  const totalLessons = Object.keys(lessonById).length

  const { session } = useAuth()
  const { completedIds, loaded, markCompleted } = useCompletedLessons()
  const dbRef = useRef(null)
  const sampleExpectedRef = useRef([])
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isCorrect, setIsCorrect] = useState(null)
  const [schema, setSchema] = useState([])
  const [submitResults, setSubmitResults] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [tab, setTab] = useState('learn')
  const [realOpened, setRealOpened] = useState(false)
  const [doc, setDoc] = useState(undefined)
  const [choice, setChoice] = useState(null)
  const [answer, setAnswer] = useState(null)

  const isMcq = lesson?.kind === 'mcq'

  const initializeDb = useCallback(async () => {
    const SQL = await loadSql()
    dbRef.current?.close()
    const first = lesson.testCases[0]
    const db = openCase(SQL, lesson, first)
    dbRef.current = db
    sampleExpectedRef.current = expectedFor(SQL, lesson, first)

    const tablesResult = db.exec("SELECT name FROM sqlite_master where type='table';")
    const tableNames = tablesResult.length > 0 ? tablesResult[0].values.map((row) => row[0]) : []

    setSchema(
      tableNames.map((tableName) => {
        const infoResult = db.exec(`PRAGMA table_info(${tableName});`)
        const columns = infoResult.length > 0 ? infoResult[0].values.map((row) => ({ name: row[1], type: row[2] })) : []
        return { tableName, columns }
      })
    )
  }, [lesson])

  useEffect(() => {
    if (!lesson || isMcq) return
    initializeDb()
    return () => {
      dbRef.current?.close()
      dbRef.current = null
    }
  }, [lesson, isMcq, initializeDb])

  useEffect(() => {
    if (!lesson) return
    let cancelled = false
    loadLessonDoc(lesson.id)
      .then((text) => { if (!cancelled) setDoc(text) })
      .catch(() => { if (!cancelled) setDoc(null) })
    return () => { cancelled = true }
  }, [lesson])

  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-12">
        <p className="text-body-text">Lesson not found.</p>
      </div>
    )
  }

  if (!loaded) return null

  if (!isStepUnlocked(lesson.id, completedIds)) {
    return <Navigate to="/learn/sql" replace />
  }

  const complete = async () => {
    markCompleted(lesson.id)

    if (session) {
      const { error: saveError } = await supabase.from('progress').upsert({
        user_id: session.user.id,
        lesson_id: lesson.id,
      })
      if (saveError) console.error('Failed to save progress:', saveError)
    }
  }

  const runQuery = () => {
    setError('')
    setResult(null)
    setIsCorrect(null)
    setSubmitResults(null)
    try {
      const rows = formatQueryResult(dbRef.current.exec(query))
      setResult(rows)
      setIsCorrect(resultsMatch(rows, sampleExpectedRef.current, lesson.orderMatters))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    setResult(null)
    setIsCorrect(null)
    setSubmitResults(null)
    try {
      const SQL = await loadSql()
      const results = evaluateLesson(SQL, lesson, query)
      setSubmitResults(results)
      if (results.every((r) => r.passed)) await complete()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setError('')
    setResult(null)
    setIsCorrect(null)
    setSubmitResults(null)
    setQuery('')
    initializeDb()
  }

  const submitChoice = async () => {
    if (!choice) return
    if (choice === lesson.correct) {
      setAnswer('correct')
      await complete()
    } else {
      setAnswer('wrong')
    }
  }

  const canProceed = completedIds.has(lesson.id)
  const nextUrl = nextStep ? pathUrl(nextStep) : '/learn/sql'
  const nextLabel = !nextStep ? 'Back to path' : nextStep.kind === 'exam' ? `Take the ${tier.name} exam` : 'Next lesson'

  const allPassed = submitResults ? submitResults.every((r) => r.passed) : false

  const status = error
    ? 'ERROR'
    : submitting
      ? 'CHECKING'
      : submitResults
        ? (allPassed ? 'PASSED' : 'RETRY')
        : isCorrect === true
          ? 'SAMPLE OK'
          : isCorrect === false
            ? 'RETRY'
            : 'READY'
  const statusStyles = {
    READY: 'bg-cream text-body-text',
    CHECKING: 'bg-cream text-body-text',
    'SAMPLE OK': 'bg-cream text-primary-accent',
    PASSED: 'bg-correct/10 text-correct',
    RETRY: 'bg-wrong/10 text-wrong',
    ERROR: 'bg-wrong/10 text-wrong',
  }

  const gutterLines = Math.max(query.split('\n').length, 16)

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="border-b border-heading/10">
        <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between text-sm">
          <Link to="/learn/sql" className="flex items-center gap-2 text-body-text hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> SQL path
          </Link>
          <p className="text-body-text hidden sm:block">
            {tier.name} · Lesson {String(lesson.number).padStart(2, '0')} · {lesson.title} {lesson.titleAccent}
          </p>
          <p className="text-body-text">
            {String(lesson.number).padStart(2, '0')} / {totalLessons}
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
                tab === t.id
                  ? 'border-primary-accent text-heading'
                  : 'border-transparent text-body-text hover:text-heading'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div
        id="panel-learn"
        role="tabpanel"
        aria-labelledby="tab-learn"
        hidden={tab !== 'learn'}
        className="flex-1 max-w-[1600px] mx-auto px-8 py-12 w-full"
      >
        <div className="max-w-3xl">
          <LessonHeading tier={tier} lesson={lesson} large />

          {doc === undefined ? (
            <p className="text-sm text-body-text">Loading lesson…</p>
          ) : doc === null ? (
            <p className="text-body-text leading-relaxed">
              There is no written lesson for this topic yet. Switch to Practice to get started.
            </p>
          ) : (
            <Markdown>{doc}</Markdown>
          )}

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
        </div>
      </div>

      <div
        id="panel-practice"
        role="tabpanel"
        aria-labelledby="tab-practice"
        hidden={tab !== 'practice'}
        className="flex-1 max-w-[1600px] mx-auto px-8 py-12 grid lg:grid-cols-[340px_1fr] gap-10 w-full items-start"
      >
        <div className="text-left">
          <LessonHeading tier={tier} lesson={lesson} />

          <p className="text-body-text leading-relaxed mb-8">
            <InlineText text={lesson.concept} />
          </p>

          {!isMcq &&
            schema.map((table) => (
              <div key={table.tableName} className="bg-surface rounded-2xl border border-heading/10 p-5 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Table className="h-4 w-4 text-body-text" />
                  <p className="text-sm font-semibold text-heading">Schema: {table.tableName}</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cream">
                      <th className="text-left font-medium text-body-text text-xs uppercase tracking-wide px-3 py-2 rounded-l-lg">Column</th>
                      <th className="text-left font-medium text-body-text text-xs uppercase tracking-wide px-3 py-2 rounded-r-lg">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.map((col) => (
                      <tr key={col.name} className="border-t border-heading/5">
                        <td className="px-3 py-2.5 text-heading">{col.name}</td>
                        <td className="px-3 py-2.5 text-body-text">{col.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

          <div className="flex items-start gap-3 bg-surface rounded-2xl border border-heading/10 p-5">
            <Lightbulb className="h-4 w-4 text-primary-accent mt-0.5 shrink-0" />
            <p className="text-sm text-body-text">
              <span className="font-semibold text-heading">{isMcq ? 'Your question: ' : 'Your task: '}</span>
              {isMcq ? <InlineText text={lesson.question} /> : lesson.prompt}
            </p>
          </div>
        </div>

        {isMcq ? (
          <div>
            <fieldset className="bg-surface rounded-2xl border border-heading/10 shadow-sm p-6 mb-6">
              <legend className="sr-only">Choose an answer</legend>
              <div className="flex flex-col gap-3">
                {lesson.options.map((option, i) => {
                  const letter = 'ABCD'[i]
                  const selected = choice === letter
                  return (
                    <label
                      key={letter}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors ${
                        selected ? 'border-primary-accent bg-badge' : 'border-heading/10 hover:bg-heading/[0.02]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={letter}
                        checked={selected}
                        onChange={() => {
                          setChoice(letter)
                          setAnswer(null)
                        }}
                        className="mt-0.5 accent-[var(--color-primary-accent)]"
                      />
                      <span className="text-body-text">
                        <span className="mr-2 font-semibold text-heading">{letter}.</span>
                        <InlineText text={option} />
                      </span>
                    </label>
                  )
                })}
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  onClick={submitChoice}
                  disabled={!choice}
                  className="rounded-lg bg-heading px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-heading/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Check answer
                </button>
              </div>
            </fieldset>

            {answer && (
              <div
                className={`flex items-start gap-3 rounded-2xl border p-6 ${
                  answer === 'correct' ? 'border-correct/25 bg-correct/10' : 'border-wrong/20 bg-wrong/5'
                }`}
              >
                {answer === 'correct' ? (
                  <CircleCheck className="h-5 w-5 text-correct shrink-0 mt-0.5" />
                ) : (
                  <CircleAlert className="h-5 w-5 text-wrong shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-heading">{answer === 'correct' ? 'Correct.' : 'Not quite.'}</p>
                  <p className="mt-1 text-sm text-body-text">
                    {answer === 'correct' ? (
                      <>
                        <InlineText text={lesson.why} /> {lesson.successNote}
                      </>
                    ) : (
                      'Think about what the database has to do, then try another answer.'
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="bg-surface rounded-2xl border border-heading/10 shadow-sm overflow-hidden mb-6">
              <div className="flex items-center justify-between px-5 py-3 border-b border-heading/10">
                <div className="flex items-center gap-2 text-sm text-body-text">
                  <Terminal className="h-4 w-4 text-heading/60" />
                  query.sql
                </div>
                <span className={`text-[10px] font-semibold tracking-wide rounded-full px-2.5 py-1 ${statusStyles[status]}`}>
                  {status}
                </span>
              </div>

              <div className="flex bg-[#14161c]">
                <div className="select-none text-right pl-5 pr-3 py-5 text-sm leading-7 text-white/25 font-mono">
                  {Array.from({ length: gutterLines }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault()
                      runQuery()
                    }
                  }}
                  rows={16}
                  spellCheck={false}
                  aria-label="SQL query"
                  placeholder="-- write your SQL query here"
                  className="flex-1 min-w-0 resize-none bg-transparent py-5 pr-5 text-base leading-7 text-white font-mono placeholder:text-white/30 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between px-5 py-3.5 border-t border-heading/10">
                <span className="hidden sm:flex items-center gap-1.5 text-xs text-body-text">
                  Ctrl + Enter to run
                </span>
                <div className="flex items-center gap-2.5 ml-auto">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-sm font-medium text-heading border border-heading/10 rounded-lg px-3.5 py-2 hover:bg-heading/5 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset
                  </button>
                  <button
                    onClick={runQuery}
                    className="flex items-center gap-1.5 text-sm font-medium text-heading border border-heading/10 rounded-lg px-3.5 py-2 hover:bg-heading/5 transition-colors"
                  >
                    Run <Play className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !query.trim()}
                    className="flex items-center gap-1.5 text-sm font-semibold bg-heading text-cream rounded-lg px-4 py-2 hover:bg-heading/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting…' : 'Submit'}
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

            {!error && result && (
              <div className="rounded-2xl border border-heading/10 bg-surface p-6 mb-6">
                <div className="flex items-start gap-3 mb-1">
                  {isCorrect ? (
                    <CircleCheck className="h-5 w-5 text-correct shrink-0 mt-0.5" />
                  ) : (
                    <CircleAlert className="h-5 w-5 text-wrong shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-heading">
                      {isCorrect
                        ? `Matches the sample — query returned ${result.length} row${result.length === 1 ? '' : 's'}.`
                        : 'Not quite — check your results.'}
                    </p>
                    <p className="text-sm text-body-text mt-1">
                      {isCorrect
                        ? 'Press Submit to check it against every test case.'
                        : 'Compare your output with the task above and try again.'}
                    </p>
                  </div>
                </div>

                {result.length === 0 ? (
                  <p className="mt-4 text-sm text-body-text pl-8">Query ran successfully, but returned no rows.</p>
                ) : (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-cream">
                          {Object.keys(result[0]).map((col) => (
                            <th key={col} className="text-left text-xs uppercase tracking-wide font-medium text-body-text px-3 py-2 first:rounded-l-lg last:rounded-r-lg">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.map((row, i) => (
                          <tr key={i} className="border-t border-heading/5">
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="px-3 py-2.5 text-body-text">
                                {val === null ? <span className="italic text-placeholder">NULL</span> : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {!error && submitResults && (
              <div className="rounded-2xl border border-heading/10 bg-surface p-6">
                <div className="flex items-start gap-3 mb-4">
                  {allPassed ? (
                    <CircleCheck className="h-5 w-5 text-correct shrink-0 mt-0.5" />
                  ) : (
                    <CircleAlert className="h-5 w-5 text-wrong shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-heading">
                      {allPassed ? 'All test cases passed — lesson complete.' : 'Not quite — some test cases failed.'}
                    </p>
                    <p className="text-sm text-body-text mt-1">
                      {allPassed
                        ? (lesson.successNote || 'Your query worked on every case.')
                        : 'The data behind each case stays hidden. Re-read the task, think about what else your query should handle, and try again.'}
                    </p>
                  </div>
                </div>

                <ul className="divide-y divide-heading/5 border-t border-heading/5">
                  {submitResults.map((r) => (
                    <li key={r.label} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-heading">{r.label}</span>
                      <span
                        aria-label={r.passed ? 'Passed' : 'Failed'}
                        className={`font-semibold ${r.passed ? 'text-correct' : 'text-wrong'}`}
                      >
                        {r.passed ? '✓' : '✗'}
                      </span>
                    </li>
                  ))}
                </ul>

                {allPassed && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab('real')
                      setRealOpened(true)
                      window.scrollTo({ top: 0 })
                    }}
                    className="mt-5 flex items-center gap-2 rounded-lg border border-heading/15 px-4 py-2 text-sm font-semibold text-heading transition-colors hover:bg-heading/5"
                  >
                    Try it on real data <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        id="panel-real"
        role="tabpanel"
        aria-labelledby="tab-real"
        hidden={tab !== 'real'}
        className="flex-1"
      >
        {lesson.challenges.length > 0 ? (
          realOpened && <RealChallenges lesson={lesson} />
        ) : (
          <div className="max-w-2xl mx-auto px-8 py-12">
            <p className="text-body-text leading-relaxed">
              This lesson is about ideas rather than a query, so it has no real-data challenge. Move on to the next
              lesson when you're ready.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-heading/10">
        <div className="max-w-[1600px] mx-auto px-8 py-5 flex items-center justify-between text-sm">
          <Link to="/learn/sql" className="flex items-center gap-2 text-body-text hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to lessons
          </Link>

          <Link
            to={nextUrl}
            aria-disabled={!canProceed}
            onClick={(e) => { if (!canProceed) e.preventDefault() }}
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

function Lesson() {
  const { lessonType, lessonId } = useParams()
  return <LessonView key={`${lessonType}/${lessonId}`} />
}

export default Lesson
