import { useEffect, useRef, useState } from 'react'
import { fetchDatasetBytes, fetchManifest } from './datasets'
import { gradeResult, runExerciseQuery } from './exerciseGrading'
import { ATTEMPTS_TO_GIVE_UP, loadExerciseProgress, saveExerciseProgress } from './exerciseProgress'
import { loadSql } from './sqlEngine'

export function useDatasetData(datasetId) {
  const [attempt, setAttempt] = useState(0)
  const [data, setData] = useState({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [SQL, datasets] = await Promise.all([loadSql(), fetchManifest()])
        const meta = datasets.find((d) => d.id === datasetId)
        if (!meta) throw new Error(`The dataset "${datasetId}" isn't available.`)
        const bytes = await fetchDatasetBytes(meta)

        const db = new SQL.Database(bytes)
        let schema
        try {
          const names = db.exec("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
          schema = (names[0]?.values ?? []).map(([tableName]) => {
            const info = db.exec(`PRAGMA table_info("${tableName}")`)
            return { tableName, columns: (info[0]?.values ?? []).map((row) => ({ name: row[1], type: row[2] })) }
          })
        } finally {
          db.close()
        }

        if (!cancelled) setData({ status: 'ready', SQL, bytes, meta, schema })
      } catch (err) {
        if (!cancelled) setData({ status: 'error', message: err.message })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [datasetId, attempt])

  const retry = () => {
    setData({ status: 'loading' })
    setAttempt((n) => n + 1)
  }

  return [data, retry]
}

export function useChallenge({ datasetId, reference, orderMatters, progressId, onSolved }) {
  const [data, retry] = useDatasetData(datasetId)

  const [progress, setProgress] = useState(() => loadExerciseProgress(progressId))
  const progressRef = useRef(progress)
  const [query, setQuery] = useState(progress.draft)

  const [busy, setBusy] = useState(null)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [verdict, setVerdict] = useState(null)

  const updateProgress = (patch) => {
    const next = { ...progressRef.current, ...patch }
    progressRef.current = next
    setProgress(next)
    saveExerciseProgress(progressId, next)
  }

  useEffect(() => {
    const id = setTimeout(() => {
      if (progressRef.current.draft === query) return
      progressRef.current = { ...progressRef.current, draft: query }
      saveExerciseProgress(progressId, progressRef.current)
    }, 400)
    return () => clearTimeout(id)
  }, [query, progressId])

  const ready = data.status === 'ready'

  const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0))

  const clearFeedback = () => {
    setError('')
    setResult(null)
    setVerdict(null)
  }

  const run = async () => {
    if (!ready || busy || !query.trim()) return
    setBusy('run')
    clearFeedback()
    await nextTick()
    try {
      setResult(runExerciseQuery(data.SQL, data.bytes, query))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(null)
    }
  }

  const submit = async () => {
    if (!ready || busy || !query.trim()) return
    setBusy('submit')
    clearFeedback()
    await nextTick()
    try {
      const actual = runExerciseQuery(data.SQL, data.bytes, query)
      const expected = runExerciseQuery(data.SQL, data.bytes, reference)
      const graded = gradeResult(actual, expected, orderMatters)

      setResult(actual)
      setVerdict({ ...graded, expectedColumns: expected.columns.length })

      const attempts = progressRef.current.attempts + 1
      if (graded.passed) {
        updateProgress({ solved: true, revealed: true, attempts, draft: query })
        onSolved?.()
      } else {
        updateProgress({ attempts, draft: query })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(null)
    }
  }

  const status = error
    ? 'ERROR'
    : busy
      ? busy === 'run'
        ? 'RUNNING'
        : 'CHECKING'
      : verdict
        ? verdict.passed
          ? 'SOLVED'
          : 'RETRY'
        : progress.solved
          ? 'SOLVED'
          : 'READY'

  return {
    data,
    retry,
    ready,
    query,
    setQuery,
    busy,
    error,
    result,
    verdict,
    status,
    progress,
    updateProgress,
    run,
    submit,
    canOpenWalkthrough: progress.solved || progress.attempts >= ATTEMPTS_TO_GIVE_UP,
    attemptsLeft: Math.max(0, ATTEMPTS_TO_GIVE_UP - progress.attempts),
  }
}
