import { CircleAlert } from '../icons'

const outputBox =
  'max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-heading/10 bg-surface px-4 py-3 font-mono text-sm leading-6'

const formatDuration = (ms) => (ms < 1000 ? `${Math.max(1, Math.round(ms))} ms` : `${(ms / 1000).toFixed(1)} s`)

function PythonOutput({ output, resultLabel = 'Out', showTime = true }) {
  if (!output) return null

  if (output.failed) {
    return (
      <div className="mt-3 flex items-start gap-3 rounded-xl border border-wrong/20 bg-wrong/5 p-4">
        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-wrong" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-heading">Couldn't run this code</p>
          <p className="mt-1 break-words text-sm text-body-text">{output.failed}</p>
        </div>
      </div>
    )
  }

  const empty = !output.stdout && !output.stderr && output.result == null && !output.error

  return (
    <div className="mt-3 space-y-3">
      {output.stdout && <pre className={`${outputBox} text-heading`}>{output.stdout}</pre>}
      {output.stderr && <pre className={`${outputBox} text-caption`}>{output.stderr}</pre>}
      {output.result != null && (
        <div className="flex gap-2">
          <span className="mt-3 shrink-0 font-mono text-xs text-caption" aria-hidden="true">
            {resultLabel}
          </span>
          <pre className={`${outputBox} min-w-0 flex-1 text-heading`}>{output.result}</pre>
        </div>
      )}
      {output.error && (
        <div className="flex items-start gap-3 rounded-xl border border-wrong/20 bg-wrong/5 p-4">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-wrong" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-heading">Python error</p>
            <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-6 text-body-text">
              {output.error}
            </pre>
          </div>
        </div>
      )}
      {empty && <p className="text-sm text-body-text">Ran successfully. Nothing to show.</p>}
      {showTime && output.ms != null && <p className="text-xs text-caption">Ran in {formatDuration(output.ms)}</p>}
    </div>
  )
}

export default PythonOutput
