import { useEffect, useRef, useState } from 'react'
import { ATTEMPTS_TO_GIVE_UP, loadExerciseProgress, saveExerciseProgress } from './exerciseProgress'
import { isStopped } from './workerClient'
import { checkCases, execCommand, listWorkingFiles, readWorkingFile, seedSession, writeWorkingFile } from './gitGrading'

export function useGitChallenge({ session, seed, cases, progressId, onSolved }) {
  const [progress, setProgress] = useState(() => loadExerciseProgress(progressId))
  const progressRef = useRef(progress)
  const [history, setHistory] = useState([])
  const [files, setFiles] = useState([])
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState('seeding')
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)

  const updateProgress = (patch) => {
    const next = { ...progressRef.current, ...patch }
    progressRef.current = next
    setProgress(next)
    saveExerciseProgress(progressId, next)
  }

  const refreshFiles = async () => {
    try {
      setFiles(await listWorkingFiles(session))
    } catch {
      /* worker may be mid-restart; the next action will surface any real error */
    }
  }

  const seedNow = async () => {
    setBusy('seeding')
    setError('')
    setResults(null)
    setHistory([])
    setReady(false)
    try {
      await seedSession(session, seed)
      await refreshFiles()
      setReady(true)
    } catch (err) {
      if (!isStopped(err)) setError(err.message)
    } finally {
      setBusy(null)
    }
  }

  useEffect(() => {
    seedNow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const run = async (line) => {
    if (busy || !line.trim()) return
    setBusy('running')
    setError('')
    try {
      const result = await execCommand(session, line)
      setHistory((h) => [...h, { command: line, ...result }])
      await refreshFiles()
    } catch (err) {
      if (!isStopped(err)) setError(err.message)
    } finally {
      setBusy(null)
    }
  }

  const check = async () => {
    if (busy) return
    setBusy('checking')
    setError('')
    try {
      const graded = await checkCases(session, cases)
      setResults(graded)
      const attempts = progressRef.current.attempts + 1
      if (graded.every((r) => r.passed)) {
        updateProgress({ solved: true, revealed: true, attempts })
        onSolved?.()
      } else {
        updateProgress({ attempts })
      }
    } catch (err) {
      if (!isStopped(err)) setError(err.message)
    } finally {
      setBusy(null)
    }
  }

  const readFile = (path) => readWorkingFile(session, path)
  const writeFile = async (path, content) => {
    await writeWorkingFile(session, path, content)
    await refreshFiles()
  }

  return {
    history,
    files,
    ready,
    busy,
    error,
    results,
    progress,
    updateProgress,
    run,
    check,
    reset: seedNow,
    readFile,
    writeFile,
    canOpenWalkthrough: progress.solved || progress.attempts >= ATTEMPTS_TO_GIVE_UP,
    attemptsLeft: Math.max(0, ATTEMPTS_TO_GIVE_UP - progress.attempts),
  }
}
