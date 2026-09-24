import { useState } from 'react'
import Markdown from '../Markdown'
import ResultTable from '../notebook/ResultTable'
import { failureMessages } from '../../lib/exerciseGrading'
import { ATTEMPTS_TO_GIVE_UP } from '../../lib/exerciseProgress'
import { MAX_ROWS } from '../../lib/notebook'
import { ChevronDown, CircleAlert, CircleCheck, Play, Table, Terminal } from '../icons'

export function SchemaCard({ challenge }) {
  const { data, retry, ready } = challenge
  const [open, setOpen] = useState(() => window.matchMedia?.('(min-width: 1024px)').matches ?? true)

  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="bg-surface rounded-2xl border border-heading/10 p-5"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden">
        <Table className="h-4 w-4 shrink-0 text-body-text" />
        <span className="text-sm font-semibold text-heading">{ready ? data.meta.name : 'Dataset'}</span>
        <ChevronDown className={`ml-auto h-4 w-4 shrink-0 text-body-text transition-transform ${open ? 'rotate-180' : ''}`} />
      </summary>

      {data.status === 'loading' && <p className="mt-3 text-sm text-body-text">Loading the data…</p>}

      {data.status === 'error' && (
        <div className="mt-3">
          <p className="text-sm text-wrong">{data.message}</p>
          <button onClick={retry} className="mt-3 text-sm font-semibold text-heading underline">
            Try again
          </button>
        </div>
      )}

      {ready && (
        <>
          <p className="mt-2 mb-4 text-xs text-body-text">
            {data.meta.author} · {data.meta.source.name} ·{' '}
            <a
              href={data.meta.license.url}
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-heading underline"
            >
              {data.meta.license.name}
            </a>
          </p>
          {data.schema.map((table) => (
            <div key={table.tableName} className="mb-3 last:mb-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body-text">
                Table: <span className="font-mono normal-case text-heading">{table.tableName}</span>
              </p>
              <div className="max-h-56 overflow-auto rounded-lg border border-heading/10">
                <table className="w-full text-sm">
                  <tbody>
                    {table.columns.map((col) => (
                      <tr key={col.name} className="border-t border-heading/5 first:border-t-0">
                        <td className="px-3 py-1.5 font-mono text-xs text-heading">{col.name}</td>
                        <td className="px-3 py-1.5 text-xs text-body-text">{col.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      )}
    </details>
  )
}

const statusStyles = {
  READY: 'bg-cream text-body-text',
  RUNNING: 'bg-cream text-body-text',
  CHECKING: 'bg-cream text-body-text',
  SOLVED: 'bg-correct/10 text-correct',
  RETRY: 'bg-wrong/10 text-wrong',
  ERROR: 'bg-wrong/10 text-wrong',
}

export function QueryPanel({ challenge, rows = 14 }) {
  const { query, setQuery, ready, busy, status, run, submit } = challenge
  const gutterLines = Math.max(query.split('\n').length, rows)

  return (
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
              run()
            }
          }}
          rows={rows}
          spellCheck={false}
          aria-label="SQL query"
          placeholder="-- write your SQL query here"
          className="flex-1 min-w-0 resize-none bg-transparent py-5 pr-5 text-base leading-7 text-white font-mono placeholder:text-white/30 focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between px-5 py-3.5 border-t border-heading/10">
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-body-text">Ctrl + Enter to run</span>
        <div className="flex items-center gap-2.5 ml-auto">
          <button
            onClick={run}
            disabled={!ready || !!busy || !query.trim()}
            className="flex items-center gap-1.5 text-sm font-medium text-heading border border-heading/10 rounded-lg px-3.5 py-2 hover:bg-heading/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Run <Play className="h-3 w-3" />
          </button>
          <button
            onClick={submit}
            disabled={!ready || !!busy || !query.trim()}
            className="flex items-center gap-1.5 text-sm font-semibold bg-heading text-cream rounded-lg px-4 py-2 hover:bg-heading/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {busy === 'submit' ? 'Checking…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function Feedback({ challenge, mode = 'practice' }) {
  const { error, verdict, result, progress, attemptsLeft } = challenge
  const shownRows = result ? result.rows.slice(0, MAX_ROWS) : []
  const exam = mode === 'exam'

  return (
    <>
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-wrong/20 bg-wrong/5 p-5">
          <CircleAlert className="h-5 w-5 text-wrong shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-heading mb-1">Your query couldn’t run.</p>
            <p className="text-sm text-body-text break-words">{error}</p>
          </div>
        </div>
      )}

      {verdict && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-2xl border p-5 ${
            verdict.passed ? 'border-correct/25 bg-correct/10' : 'border-wrong/20 bg-wrong/5'
          }`}
        >
          {verdict.passed ? (
            <CircleCheck className="h-5 w-5 text-correct shrink-0" />
          ) : (
            <CircleAlert className="h-5 w-5 text-wrong shrink-0" />
          )}
          <div>
            <p className="font-semibold text-heading mb-1">
              {verdict.passed ? (exam ? 'Correct.' : 'Solved.') : exam ? 'Not correct.' : 'Not quite.'}
            </p>
            <p className="text-sm text-body-text">
              {exam
                ? verdict.passed
                  ? 'This question is done.'
                  : 'Change your query and submit again. There is no limit on attempts.'
                : verdict.passed
                  ? `Your query returns exactly what was asked for. It took ${progress.attempts} ${progress.attempts === 1 ? 'attempt' : 'attempts'}. The walkthrough is below.`
                  : failureMessages[verdict.reason](verdict.expectedColumns)}
            </p>
            {!exam && !verdict.passed && (
              <p className="mt-2 text-xs text-body-text">
                {attemptsLeft > 0
                  ? `Attempt ${progress.attempts}. The walkthrough unlocks after ${ATTEMPTS_TO_GIVE_UP} attempts.`
                  : 'You can open the walkthrough below whenever you want.'}
              </p>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="mb-6">
          {result.columns.length === 0 ? (
            <p className="text-sm text-body-text">The query ran, but it didn’t return a result set.</p>
          ) : (
            <ResultTable
              columns={result.columns}
              rows={shownRows}
              totalRows={result.rows.length}
              truncated={result.rows.length > MAX_ROWS}
            />
          )}
        </div>
      )}
    </>
  )
}

export function WalkthroughPanel({ challenge, walkthrough, reference, subject = 'question' }) {
  const { progress, canOpenWalkthrough, updateProgress } = challenge
  const shown = progress.solved || progress.revealed

  if (shown) {
    return (
      <div className="rounded-2xl border border-heading/10 bg-surface p-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary-accent mb-3">Walkthrough</p>
        <Markdown>{walkthrough}</Markdown>
        {progress.solved ? (
          <>
            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide text-body-text">One way to write it</p>
            <Markdown>{'```sql\n' + reference + '\n```'}</Markdown>
          </>
        ) : (
          <p className="mt-6 text-sm text-body-text">
            The finished query stays hidden until you solve the {subject} yourself.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-heading/10 bg-surface p-5">
      <p className="text-sm text-body-text">
        {canOpenWalkthrough
          ? `Stuck? You can read the walkthrough now. This ${subject} won’t count as solved.`
          : `The walkthrough unlocks when you solve the ${subject}, or after ${ATTEMPTS_TO_GIVE_UP} attempts.`}
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
