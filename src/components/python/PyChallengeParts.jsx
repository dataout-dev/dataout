import PythonEditor from '../editor/PythonEditor'
import PythonOutput from './PythonOutput'
import Markdown from '../Markdown'
import { failureMessages } from '../../lib/pythonGrading'
import { ATTEMPTS_TO_GIVE_UP } from '../../lib/exerciseProgress'
import { CircleAlert, CircleCheck, Play, RotateCcw, Terminal } from '../icons'

const statusStyles = {
  READY: 'bg-cream text-body-text',
  RUNNING: 'bg-cream text-body-text',
  CHECKING: 'bg-cream text-body-text',
  SOLVED: 'bg-correct/10 text-correct',
  RETRY: 'bg-wrong/10 text-wrong',
  ERROR: 'bg-wrong/10 text-wrong',
  PASSED: 'bg-correct/10 text-correct',
  'SAMPLE OK': 'bg-cream text-accent-dark',
}

export function StatusPill({ status }) {
  return (
    <span className={`text-[10px] font-semibold tracking-wide rounded-full px-2.5 py-1 ${statusStyles[status] ?? statusStyles.READY}`}>
      {status}
    </span>
  )
}

export function PyCodePanel({ challenge, given, minLines = 12, fileName = 'answer.py' }) {
  const { code, setCode, ready, busy, status, run, submit, stop, reset } = challenge

  return (
    <div className="bg-surface rounded-2xl border border-heading/10 shadow-sm overflow-hidden mb-6">
      <div className="flex items-center justify-between px-5 py-3 border-b border-heading/10">
        <div className="flex items-center gap-2 text-sm text-body-text">
          <Terminal className="h-4 w-4 text-heading/60" />
          {fileName}
        </div>
        <StatusPill status={status} />
      </div>

      {given && (
        <div className="border-b border-white/10 bg-[#101218] px-5 py-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">Already done for you</p>
          <pre className="overflow-x-auto font-mono text-sm leading-6 text-white/60">{given}</pre>
        </div>
      )}

      <div className="flex bg-[#14161c]">
        <PythonEditor
          value={code}
          onChange={setCode}
          onRun={run}
          minLines={minLines}
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
              onClick={stop}
              className="flex items-center gap-1.5 text-sm font-medium text-wrong border border-wrong/30 rounded-lg px-3.5 py-2 hover:bg-wrong/5 transition-colors"
            >
              Stop
            </button>
          )}
          <button
            onClick={run}
            disabled={!ready || !!busy || !code.trim()}
            className="flex items-center gap-1.5 text-sm font-medium text-heading border border-heading/10 rounded-lg px-3.5 py-2 hover:bg-heading/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Run <Play className="h-3 w-3" />
          </button>
          <button
            onClick={submit}
            disabled={!ready || !!busy || !code.trim()}
            className="flex items-center gap-1.5 text-sm font-semibold bg-heading text-cream rounded-lg px-4 py-2 hover:bg-heading/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {busy === 'submit' ? 'Checking...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function PyFeedback({ challenge, mode = 'practice' }) {
  const { error, verdict, result, progress, attemptsLeft } = challenge
  const exam = mode === 'exam'

  return (
    <>
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-wrong/20 bg-wrong/5 p-5">
          <CircleAlert className="h-5 w-5 text-wrong shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-heading mb-1">Your code couldn't run.</p>
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
                  : 'Change your code and submit again. There is no limit on attempts.'
                : verdict.passed
                  ? `Your answer is exactly what was asked for. It took ${progress.attempts} ${progress.attempts === 1 ? 'attempt' : 'attempts'}. The walkthrough is below.`
                  : (failureMessages[verdict.reason] ?? failureMessages.value)(verdict)}
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

      {result && !error && (
        <div className="mb-6">
          <PythonOutput
            output={{
              stdout: result.stdout,
              result: result.answer,
              error: result.error,
            }}
            resultLabel="answer"
            showTime={false}
          />
          {result.defined === false && !result.error && (
            <p className="mt-3 text-sm text-body-text">
              Your code ran, but there is no variable called <code className="rounded bg-heading/10 px-1 font-mono">answer</code> yet.
            </p>
          )}
        </div>
      )}
    </>
  )
}

export function PyWalkthrough({ challenge, walkthrough, reference, subject = 'question' }) {
  const { progress, canOpenWalkthrough, updateProgress } = challenge
  const shown = progress.solved || progress.revealed

  if (shown) {
    return (
      <div className="rounded-2xl border border-heading/10 bg-surface p-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-accent-dark mb-3">Walkthrough</p>
        <Markdown>{walkthrough}</Markdown>
        {progress.solved ? (
          <>
            <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide text-body-text">One way to write it</p>
            <Markdown>{'```text\n' + reference + '\n```'}</Markdown>
          </>
        ) : (
          <p className="mt-6 text-sm text-body-text">The finished code stays hidden until you solve the {subject} yourself.</p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-heading/10 bg-surface p-5">
      <p className="text-sm text-body-text">
        {canOpenWalkthrough
          ? `Stuck? You can read the walkthrough now. This ${subject} won't count as solved.`
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
