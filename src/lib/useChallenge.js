import { useEffect, useRef, useState } from 'react'
import { fetchDatasetBytes, fetchManifest } from './datasets'
import { gradeResult } from './exerciseGrading'
import { ATTEMPTS_TO_GIVE_UP, loadExerciseProgress, saveExerciseProgress } from './exerciseProgress'
import { isStopped, sharedSql } from './sqlWorkerClient'

export function useDatasetData(datasetId) {
  const [attempt, setAttempt] = useState(0)
  const [data, setData] = useState({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const datasets = await fetchManifest()
        const meta = datasets.find((d) => d.id === datasetId)
        if (!meta) throw new Error(`The dataset "${datasetId}" isn't available.`)
        const bytes = await fetchDatasetBytes(meta)
        const schema = await sharedSql().call('dataset.load', { id: meta.id, bytes }, { remember: `dataset:${meta.id}` })

        if (!cancelled) setData({ status: 'ready', meta, schema })
      } catch (err) {
        if (!cancelled && !isStopped(err)) setData({ status: 'error', message: err.message })
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

  const clearFeedback = () => {
    setError('')
    setResult(null)
    setVerdict(null)
  }

  const run = async () => {
    if (!ready || busy || !query.trim()) return
    setBusy('run')
    clearFeedback()
    try {
      setResult(await sharedSql().call('dataset.query', { id: data.meta.id, query }))
    } catch (err) {
      if (!isStopped(err)) setError(err.message)
    } finally {
      setBusy(null)
    }
  }

  const submit = async () => {
    if (!ready || busy || !query.trim()) return
    setBusy('submit')
    clearFeedback()
    try {
      const { actual, expected } = await sharedSql().call('dataset.grade', { id: data.meta.id, query, reference })
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
      if (!isStopped(err)) setError(err.message)
    } finally {
      setBusy(null)
    }
  }

  const stop = () => sharedSql().stop()

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
    stop,
    canOpenWalkthrough: progress.solved || progress.attempts >= ATTEMPTS_TO_GIVE_UP,
    attemptsLeft: Math.max(0, ATTEMPTS_TO_GIVE_UP - progress.attempts),
  }
}
