// src/pages/Lesson.jsx
import { useState, useEffect, useRef } from 'react'
import { loadSql } from '../lib/sqlEngine'
import { lessons } from '../data/lessons'
import { formatQueryResult, resultsMatch, evaluateSubmission } from '../lib/sqlHelpers'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { useCompletedLessons } from '../lib/useCompletedLessons'
import { isLessonUnlocked } from '../lib/lessonAccess'
import { loadLessonDoc } from '../lib/lessonDocs'
import Markdown from '../components/Markdown'
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Terminal,
  Play,
  RotateCcw,
  Table,
  Lightbulb,
  CircleCheck,
  CircleAlert,
} from '../components/icons'

const subjectLabels = {
  sql: 'SQL',
  python: 'Python',
  de: 'Data engineering',
}

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
]

function LessonHeading({ subjectLabel, number, lesson, large = false }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#cfe3f5] text-[#2f6f9e]">
          <Database className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-primary-accent">
            {subjectLabel} / Lesson {number}
          </p>
          <p className="text-sm text-caption">{lesson.topic}</p>
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

function LessonView() {
  const { lessonType, lessonId } = useParams()
  const subjectLessons = lessons.filter((l) => l.subject === lessonType)
  const lessonIndex = subjectLessons.findIndex((l) => l.id === lessonId)
  const lesson = lessonIndex === -1 ? null : subjectLessons[lessonIndex]
  const nextLesson = lessonIndex === -1 ? null : subjectLessons[lessonIndex + 1]

  const { session } = useAuth()
  const { completedIds, loaded, markCompleted } = useCompletedLessons()
  const dbRef = useRef(null)
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isCorrect, setIsCorrect] = useState(null)
  const [schema, setSchema] = useState([])
  const [submitResults, setSubmitResults] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [tab, setTab] = useState('learn')
  const [doc, setDoc] = useState(undefined) // undefined = still loading, null = no doc for this lesson

  async function intializeDb() {
    const SQL = await loadSql()
    dbRef.current?.close()
    const db = new SQL.Database()
    db.run(lesson.testCases[0].setupSQL)
    dbRef.current = db

    const tablesResult = db.exec("SELECT name FROM sqlite_master where type='table';")
    const tableNames = tablesResult.length > 0
      ? tablesResult[0].values.map((row) => row[0])
      : []

    const newSchema = tableNames.map((tableName) => {
      const infoResult = db.exec(`PRAGMA table_info(${tableName});`)
      const columns = infoResult.length > 0
        ? infoResult[0].values.map((row) => ({ name: row[1], type: row[2] }))
        : []

      return { tableName, columns }
    })

    setSchema(newSchema)
  }

  useEffect(() => {
    if (!lesson) return
    intializeDb()
  }, [lesson])

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

  if (!isLessonUnlocked(subjectLessons, lessonIndex, completedIds)) {
    return <Navigate to={`/learn/${lessonType}`} replace />
  }

  // Run: fast feedback against the visible sample only. Never saves progress.
  const runQuery = () => {
    setError('')
    setResult(null)
    setIsCorrect(null)
    setSubmitResults(null)
    try {
      const execResult = dbRef.current.exec(query)
      const formattedResult = formatQueryResult(execResult)
      setResult(formattedResult)
      setIsCorrect(resultsMatch(formattedResult, lesson.testCases[0].expectedResult))
    } catch (err) {
      setError(err.message)
    }
  }

  // Submit: the current query against every test case, each on its own fresh database.
  // Progress is saved only if all of them pass.
  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    setResult(null)
    setIsCorrect(null)
    setSubmitResults(null)
    try {
      const SQL = await loadSql()
      const results = evaluateSubmission(SQL, lesson.testCases, query)
      setSubmitResults(results)

      if (results.every((r) => r.passed)) {
        markCompleted(lesson.id)

        if (session) {
          const { error: saveError } = await supabase.from('progress').upsert({
            user_id: session.user.id,
            lesson_id: lesson.id
          })
          if (saveError) console.error('Failed to save progress:', saveError)
        }
      }
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
    intializeDb()
  }

  const pad = (n) => String(n).padStart(2, '0')
  const subjectLabel = subjectLabels[lessonType] || lessonType.toUpperCase()
  const canProceed = completedIds.has(lesson.id)

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
    READY: 'bg-cream text-caption',
    CHECKING: 'bg-cream text-caption',
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
          <Link to={`/learn/${lessonType}`} className="flex items-center gap-2 text-caption hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> {subjectLabel} path
          </Link>
          <p className="text-caption hidden sm:block">
            Lesson {pad(lessonIndex + 1)} · {lesson.title}
          </p>
          <p className="text-caption">
            {pad(lessonIndex + 1)} / {pad(subjectLessons.length)}
          </p>
        </div>
      </div>

      <div className="border-b border-heading/10">
        <div role="tablist" aria-label="Lesson sections" className="max-w-[1600px] mx-auto px-8 flex gap-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 py-3.5 text-sm font-semibold transition-colors ${
                tab === t.id
                  ? 'border-primary-accent text-heading'
                  : 'border-transparent text-caption hover:text-heading'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Learn tab */}
      <div
        id="panel-learn"
        role="tabpanel"
        aria-labelledby="tab-learn"
        hidden={tab !== 'learn'}
        className="flex-1 max-w-[1600px] mx-auto px-8 py-12 w-full"
      >
        <div className="max-w-3xl">
          <LessonHeading subjectLabel={subjectLabel} number={pad(lessonIndex + 1)} lesson={lesson} large />

          {doc === undefined ? (
            <p className="text-sm text-caption">Loading lesson…</p>
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

      {/* Practice tab */}
      <div
        id="panel-practice"
        role="tabpanel"
        aria-labelledby="tab-practice"
        hidden={tab !== 'practice'}
        className="flex-1 max-w-[1600px] mx-auto px-8 py-12 grid lg:grid-cols-[340px_1fr] gap-10 w-full items-start"
      >
        {/* Left column */}
        <div className="text-left">
          <LessonHeading subjectLabel={subjectLabel} number={pad(lessonIndex + 1)} lesson={lesson} />

          <p className="text-body-text leading-relaxed mb-8">
            <InlineText text={lesson.concept} />
          </p>

          {schema.map((table) => (
            <div key={table.tableName} className="bg-surface rounded-2xl border border-heading/10 p-5 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Table className="h-4 w-4 text-caption" />
                <p className="text-sm font-semibold text-heading">Schema: {table.tableName}</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-cream">
                    <th className="text-left font-medium text-caption text-xs uppercase tracking-wide px-3 py-2 rounded-l-lg">Column</th>
                    <th className="text-left font-medium text-caption text-xs uppercase tracking-wide px-3 py-2 rounded-r-lg">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((col) => (
                    <tr key={col.name} className="border-t border-heading/5">
                      <td className="px-3 py-2.5 text-heading">{col.name}</td>
                      <td className="px-3 py-2.5 text-caption">{col.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="flex items-start gap-3 bg-surface rounded-2xl border border-heading/10 p-5">
            <Lightbulb className="h-4 w-4 text-primary-accent mt-0.5 shrink-0" />
            <p className="text-sm text-body-text">
              <span className="font-semibold text-heading">Your task: </span>
              {lesson.prompt}
            </p>
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="bg-surface rounded-2xl border border-heading/10 shadow-sm overflow-hidden mb-6">
            <div className="flex items-center justify-between px-5 py-3 border-b border-heading/10">
              <div className="flex items-center gap-2 text-sm text-caption">
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
                  if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault()
                    runQuery()
                  }
                }}
                rows={16}
                spellCheck={false}
                placeholder="-- write your SQL query here"
                className="flex-1 resize-none bg-transparent py-5 pr-5 text-base leading-7 text-white font-mono placeholder:text-white/30 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 border-t border-heading/10">
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-caption">
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
            <div className="flex items-start gap-3 rounded-2xl border border-wrong/20 bg-wrong/5 p-5">
              <CircleAlert className="h-5 w-5 text-wrong shrink-0" />
              <div>
                <p className="font-semibold text-heading mb-1">Something went wrong.</p>
                <p className="text-sm text-body-text">{error}</p>
              </div>
            </div>
          )}

          {!error && result && (
            <div className="rounded-2xl border border-heading/10 bg-surface p-6">
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
                <table className="mt-5 w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-cream">
                      {Object.keys(result[0]).map((col) => (
                        <th key={col} className="text-left text-xs uppercase tracking-wide font-medium text-caption px-3 py-2 first:rounded-l-lg last:rounded-r-lg">
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
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-heading/10">
        <div className="max-w-[1600px] mx-auto px-8 py-5 flex items-center justify-between text-sm">
          <Link to={`/learn/${lessonType}`} className="flex items-center gap-2 text-caption hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to lessons
          </Link>

          <Link
            to={nextLesson ? `/learn/${lessonType}/${nextLesson.id}` : `/learn/${lessonType}`}
            aria-disabled={!canProceed}
            onClick={(e) => { if (!canProceed) e.preventDefault() }}
            className={`flex items-center gap-2 font-semibold transition-colors ${
              canProceed ? 'text-heading hover:text-primary-accent' : 'text-placeholder cursor-not-allowed'
            }`}
          >
            {nextLesson ? 'Next lesson' : 'Back to path'} <ArrowRight className="h-4 w-4" />
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
