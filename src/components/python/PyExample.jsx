import { useState } from 'react'
import PythonEditor from '../editor/PythonEditor'
import PythonOutput from './PythonOutput'
import { runSnippet } from '../../lib/pythonGrading'
import { sharedPython } from '../../lib/pythonClient'
import { isStopped } from '../../lib/workerClient'
import { Play, RotateCcw } from '../icons'

let runCounter = 0

function PyExample({ code: original, session }) {
  const [code, setCode] = useState(original)
  const [output, setOutput] = useState(null)
  const [running, setRunning] = useState(false)

  const changed = code !== original
  const lines = Math.max(code.split('\n').length, 2)

  const run = async () => {
    if (running || !code.trim()) return
    setRunning(true)
    try {
      const count = ++runCounter
      const result = await runSnippet(session, code, `<example ${count}>`)
      setOutput(result)
    } catch (err) {
      if (isStopped(err)) setOutput({ failed: 'Stopped. Python was restarted, so earlier examples in this lesson need to run again.' })
      else setOutput({ failed: err.message })
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-heading/10 bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-heading/10 px-4 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-caption">Try it</span>
        <div className="flex items-center gap-2">
          {changed && !running && (
            <button
              type="button"
              onClick={() => setCode(original)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-body-text transition-colors hover:bg-heading/5 hover:text-heading"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          )}
          {running && (
            <button
              type="button"
              onClick={() => sharedPython().stop()}
              className="rounded-md border border-wrong/30 px-2 py-1 text-xs font-medium text-wrong transition-colors hover:bg-wrong/5"
            >
              Stop
            </button>
          )}
          <button
            type="button"
            onClick={run}
            disabled={running || !code.trim()}
            className="flex items-center gap-1.5 rounded-md bg-heading px-3 py-1 text-xs font-semibold text-cream transition-colors hover:bg-heading/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {running ? 'Running...' : 'Run'} <Play className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      <div className="flex bg-[#14161c]">
        <PythonEditor
          value={code}
          onChange={setCode}
          onRun={run}
          showLineNumbers={false}
          fontSize="14px"
          padding="14px 16px 14px 4px"
          minLines={lines}
          minHeight={`${lines * 24.5 + 28}px`}
          ariaLabel="Python example you can edit and run"
        />
      </div>

      {output && (
        <div className="border-t border-heading/10 bg-cream/40 px-4 pb-4">
          <PythonOutput output={output} />
        </div>
      )}
    </div>
  )
}

export default PyExample
