import { useEffect, useRef, useState } from 'react'
import { ATTEMPTS_TO_GIVE_UP, loadExerciseProgress, saveExerciseProgress } from './exerciseProgress'
import { isStopped } from './workerClient'
import { sharedPython } from './pythonClient'
import { mountDataset, runChallenge } from './pythonGrading'

export function usePythonChallenge({ datasetId, given, starter = '', reference, unordered, progressId, onSolved }) {
  const [meta, setMeta] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [attempt, setAttempt] = useState(0)

  const [progress, setProgress] = useState(() => loadExerciseProgress(progressId))
  const progressRef = useRef(progress)
  const [code, setCode] = useState(() => progress.draft || starter)

  const [busy, setBusy] = useState(null)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [verdict, setVerdict] = useState(null)

  useEffect(() => {
    if (!datasetId) return
    let cancelled = false
    mountDataset(datasetId)
      .then((m) => {
        if (!cancelled) setMeta(m)
      })
      .catch((err) => {
        if (!cancelled && !isStopped(err)) setLoadError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [datasetId, attempt])

  const retry = () => {
    setLoadError('')
    setAttempt((n) => n + 1)
  }

  const updateProgress = (patch) => {
    const next = { ...progressRef.current, ...patch }
    progressRef.current = next
    setProgress(next)
    saveExerciseProgress(progressId, next)
  }

  useEffect(() => {
    const id = setTimeout(() => {
      if (progressRef.current.draft === code) return
      progressRef.current = { ...progressRef.current, draft: code }
      saveExerciseProgress(progressId, progressRef.current)
    }, 400)
    return () => clearTimeout(id)
  }, [code, progressId])

  const ready = !datasetId || meta !== null

  const clearFeedback = () => {
    setError('')
    setResult(null)
    setVerdict(null)
  }

  const execute = async (grade) => {
    if (!ready || busy || !code.trim()) return
    setBusy(grade ? 'submit' : 'run')
    clearFeedback()
    try {
      const res = await runChallenge({ given, code, reference: grade ? reference : undefined, unordered })
      setResult(res)
      if (!grade) return
      setVerdict(res)
      const attempts = progressRef.current.attempts + 1
      if (res.passed) {
        updateProgress({ solved: true, revealed: true, attempts, draft: code })
        onSolved?.()
      } else {
        updateProgress({ attempts, draft: code })
      }
    } catch (err) {
      if (!isStopped(err)) setError(err.message)
    } finally {
      setBusy(null)
    }
  }

  const run = () => execute(false)
  const submit = () => execute(true)
  const stop = () => sharedPython().stop()
  const reset = () => {
    setCode(starter)
    clearFeedback()
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
    meta,
    loadError,
    retry,
    ready,
    code,
    setCode,
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
    reset,
    canOpenWalkthrough: progress.solved || progress.attempts >= ATTEMPTS_TO_GIVE_UP,
    attemptsLeft: Math.max(0, ATTEMPTS_TO_GIVE_UP - progress.attempts),
  }
}
