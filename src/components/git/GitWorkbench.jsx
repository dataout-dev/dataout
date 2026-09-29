import { useEffect, useRef, useState } from 'react'
import Markdown from '../Markdown'
import { ATTEMPTS_TO_GIVE_UP } from '../../lib/exerciseProgress'
import { CircleAlert, CircleCheck, Folder, RotateCcw, Terminal as TerminalIcon } from '../icons'

function describeSteps(steps) {
  const lines = []
  for (const step of steps ?? []) {
    if (typeof step === 'string') lines.push(`$ ${step}`)
    else if (step.write) {
      for (const [path, content] of Object.entries(step.write)) {
        lines.push(`(edit ${path})`)
        lines.push(...content.replace(/\n$/, '').split('\n').map((l) => `    ${l}`))
      }
    } else if (step.rm) {
      lines.push(`(delete ${step.rm})`)
    }
  }
  return lines.join('\n')
}

function Terminal({ history, onRun, busy, disabled }) {
  const [value, setValue] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [history])

  const submit = (e) => {
    e.preventDefault()
    if (!value.trim() || busy || disabled) return
    onRun(value)
    setValue('')
  }

  return (
    <div className="bg-surface rounded-2xl border border-heading/10 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-heading/10 text-sm text-body-text">
        <TerminalIcon className="h-4 w-4 text-heading/60" />
        terminal
      </div>
      <div ref={scrollRef} className="bg-[#14161c] px-5 py-4 font-mono text-xs leading-relaxed text-white/85 max-h-80 overflow-y-auto">
        {history.length === 0 && <p className="text-white/40">Type a git command below and press Enter.</p>}
        {history.map((entry, i) => (
          <div key={i} className="mb-3 last:mb-0">
            <p className="text-white/95">
              <span className="text-primary-accent">$</span> {entry.command}
            </p>
            {entry.stdout && <pre className="whitespace-pre-wrap text-white/70">{entry.stdout}</pre>}
            {entry.stderr && <pre className="whitespace-pre-wrap text-[#ff9b8a]">{entry.stderr}</pre>}
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-heading/10 px-4 py-3">
        <span className="font-mono text-sm text-heading/50">$</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          placeholder="git status"
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent font-mono text-sm text-heading outline-none placeholder:text-placeholder disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={busy === 'running' || disabled || !value.trim()}
          className="rounded-lg bg-heading px-3 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-heading/90 disabled:opacity-40"
        >
          Run
        </button>
      </form>
    </div>
  )
}

function FilePanel({ files, readFile, writeFile, disabled }) {
  const [active, setActive] = useState(null)
  const [content, setContent] = useState('')
  const [newPath, setNewPath] = useState('')
  const [saved, setSaved] = useState(false)

  const open = async (path) => {
    setActive(path)
    setSaved(false)
    setContent((await readFile(path)) ?? '')
  }

  const save = async () => {
    if (!active) return
    await writeFile(active, content)
    setSaved(true)
  }

  const createFile = async (e) => {
    e.preventDefault()
    const path = newPath.trim()
    if (!path) return
    await writeFile(path, '')
    setNewPath('')
    open(path)
  }

  return (
    <div className="bg-surface rounded-2xl border border-heading/10 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-heading/10 text-sm text-body-text">
        <Folder className="h-4 w-4 text-heading/60" />
        working directory
      </div>
      <div className="flex divide-x divide-heading/10">
        <div className="w-40 shrink-0 py-2">
          {files.length === 0 && <p className="px-4 py-2 text-xs text-caption">No files yet</p>}
          {files.map((path) => (
            <button
              key={path}
              type="button"
              onClick={() => open(path)}
              className={`block w-full truncate px-4 py-1.5 text-left font-mono text-xs transition-colors ${
                active === path ? 'bg-badge text-heading' : 'text-body-text hover:bg-heading/5'
              }`}
            >
              {path}
            </button>
          ))}
          <form onSubmit={createFile} className="mt-1 px-3">
            <input
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              disabled={disabled}
              placeholder="+ new file"
              spellCheck={false}
              autoComplete="off"
              className="w-full rounded border border-dashed border-heading/15 bg-transparent px-2 py-1 font-mono text-xs text-heading outline-none placeholder:text-placeholder"
            />
          </form>
        </div>
        <div className="min-w-0 flex-1">
          {active ? (
            <>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  setSaved(false)
                }}
                disabled={disabled}
                spellCheck={false}
                rows={8}
                className="w-full resize-none bg-transparent px-4 py-3 font-mono text-xs text-heading outline-none"
              />
              <div className="flex items-center justify-between px-4 pb-3">
                <span className="text-xs text-body-text">{saved ? 'Saved.' : 'Edits are not saved until you press Save.'}</span>
                <button
                  type="button"
                  onClick={save}
                  disabled={disabled}
                  className="rounded-lg border border-heading/10 px-3 py-1.5 text-xs font-semibold text-heading hover:bg-heading/5"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <p className="px-4 py-6 text-sm text-body-text">Select a file to view or edit it.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function GitWorkbench({ challenge }) {
  const { history, files, busy, ready, run, readFile, writeFile, reset } = challenge
  const disabled = !ready || !!busy

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={reset}
          disabled={!!busy}
          className="flex items-center gap-1.5 text-sm font-medium text-heading border border-heading/10 rounded-lg px-3.5 py-2 hover:bg-heading/5 transition-colors disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset repo
        </button>
      </div>
      <Terminal history={history} onRun={run} busy={busy} disabled={disabled} />
      <FilePanel files={files} readFile={readFile} writeFile={writeFile} disabled={disabled} />
    </div>
  )
}

export function GitFeedback({ challenge }) {
  const { error, results, progress, attemptsLeft } = challenge
  const allPassed = results ? results.every((r) => r.passed) : false

  return (
    <>
      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-wrong/20 bg-wrong/5 p-5">
          <CircleAlert className="h-5 w-5 text-wrong shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-heading mb-1">Something went wrong.</p>
            <p className="text-sm text-body-text break-words">{error}</p>
          </div>
        </div>
      )}

      {results && !error && (
        <div className="mt-6 rounded-2xl border border-heading/10 bg-surface p-6">
          <div className="flex items-start gap-3 mb-4">
            {allPassed ? (
              <CircleCheck className="h-5 w-5 text-correct shrink-0 mt-0.5" />
            ) : (
              <CircleAlert className="h-5 w-5 text-wrong shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-heading">{allPassed ? 'All checks passed.' : 'Not quite yet.'}</p>
              <p className="text-sm text-body-text mt-1">
                {allPassed
                  ? `It took ${progress.attempts} ${progress.attempts === 1 ? 'attempt' : 'attempts'}.`
                  : attemptsLeft > 0
                    ? `Attempt ${progress.attempts}. The walkthrough unlocks after ${ATTEMPTS_TO_GIVE_UP} attempts.`
                    : 'You can open the walkthrough below whenever you want.'}
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
        </div>
      )}
    </>
  )
}

export function GitWalkthrough({ challenge, walkthrough, reference }) {
  const { progress, canOpenWalkthrough, updateProgress } = challenge
  const shown = progress.solved || progress.revealed

  if (shown) {
    return (
      <div className="mt-6 rounded-2xl border border-heading/10 bg-surface p-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-accent-dark mb-3">Walkthrough</p>
        <Markdown>{walkthrough}</Markdown>
        {progress.solved ? (
          <>
            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide text-body-text">One way to do it</p>
            <Markdown>{'```text\n' + describeSteps(reference) + '\n```'}</Markdown>
          </>
        ) : (
          <p className="mt-6 text-sm text-body-text">The finished command sequence stays hidden until you solve this yourself.</p>
        )}
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-2xl border border-heading/10 bg-surface p-5">
      <p className="text-sm text-body-text">
        {canOpenWalkthrough
          ? "Stuck? You can read the walkthrough now. This won't count as solved."
          : `The walkthrough unlocks when you solve this, or after ${ATTEMPTS_TO_GIVE_UP} attempts.`}
      </p>
      {canOpenWalkthrough && (
        <button
          onClick={() => updateProgress({ revealed: true })}
          className="mt-3 rounded-lg border border-heading/15 px-4 py-2 text-sm font-semibold text-heading transition-colors hover:bg-heading/5"
        >
          Show the walkthrough
        </button>
      )}
    </div>
  )
}
