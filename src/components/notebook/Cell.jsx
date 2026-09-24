import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Markdown from '../Markdown'
import ResultTable from './ResultTable'
import { Play, ArrowUp, ArrowDown, Plus, Trash, Pencil, Check, CircleAlert } from '../icons'

const iconButton =
  'flex h-7 w-7 items-center justify-center rounded-md text-caption transition-colors hover:bg-heading/5 hover:text-heading disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent'

const formatDuration = (ms) => (ms < 1000 ? `${Math.max(1, Math.round(ms))} ms` : `${(ms / 1000).toFixed(1)} s`)

function CellOutput({ output }) {
  if (!output) return null

  if (!output.ok) {
    return (
      <div className="mt-3 flex items-start gap-3 rounded-xl border border-wrong/20 bg-wrong/5 p-4">
        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-wrong" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-heading">SQL error</p>
          <p className="mt-1 break-words font-mono text-sm text-body-text">{output.error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 space-y-3">
      {output.results.map((set, i) => (
        <ResultTable key={i} {...set} />
      ))}

      {output.results.length === 0 && (
        <p className="text-sm text-body-text">
          {output.changes > 0
            ? `${output.changes.toLocaleString()} row${output.changes === 1 ? '' : 's'} changed.`
            : 'Ran successfully. No rows returned.'}
        </p>
      )}

      <p className="text-xs text-caption">Ran in {formatDuration(output.ms)}</p>
    </div>
  )
}

function Cell({
  cell,
  index,
  total,
  output,
  kernelReady,
  onChange,
  onChangeType,
  onRun,
  onRunAndAdvance,
  onAdvance,
  onMove,
  onAddBelow,
  onDelete,
}) {
  const textareaRef = useRef(null)
  const [editing, setEditing] = useState(() => cell.source.trim() === '')
  const isSql = cell.type === 'sql'
  const showEditor = isSql || editing

  const fitHeight = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [])

  useLayoutEffect(fitHeight, [cell.source, showEditor, fitHeight])

  useEffect(() => {
    const el = textareaRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    let lastWidth = el.clientWidth
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === lastWidth) return
      lastWidth = el.clientWidth
      fitHeight()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [showEditor, fitHeight])

  const changeType = (type) => {
    if (type === 'markdown') setEditing(true)
    onChangeType(type)
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' || !(event.shiftKey || event.ctrlKey || event.metaKey)) return
    event.preventDefault()

    if (isSql) {
      if (event.shiftKey) onRunAndAdvance()
      else onRun()
      return
    }

    setEditing(false)
    if (event.shiftKey) onAdvance()
  }

  return (
    <div>
      <div className="flex gap-3">
        <div className="w-14 shrink-0 pt-3.5 text-right font-mono text-xs text-caption" aria-hidden="true">
          {isSql ? `[${output?.count ?? ' '}]` : ''}
        </div>

        <div className="min-w-0 flex-1">
          <div className="rounded-xl border border-heading/10 bg-surface transition-colors focus-within:border-primary-accent/50">
            <div className="flex items-center justify-between border-b border-heading/5 px-2 py-1.5">
              <select
                value={cell.type}
                onChange={(e) => changeType(e.target.value)}
                aria-label={`Cell ${index + 1} type`}
                className="rounded-md bg-transparent px-1.5 py-1 text-xs font-semibold uppercase tracking-wide text-caption hover:bg-heading/5 focus:outline-none"
              >
                <option value="sql">SQL</option>
                <option value="markdown">Markdown</option>
              </select>

              <div className="flex items-center gap-0.5">
                {isSql ? (
                  <button
                    type="button"
                    onClick={onRun}
                    disabled={!kernelReady}
                    aria-label="Run cell"
                    title="Run cell (Ctrl+Enter)"
                    className={iconButton}
                  >
                    <Play className="h-3 w-3" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditing((value) => !value)}
                    aria-label={editing ? 'Show rendered text' : 'Edit text'}
                    title={editing ? 'Show rendered text' : 'Edit text'}
                    className={iconButton}
                  >
                    {editing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onMove(-1)}
                  disabled={index === 0}
                  aria-label="Move cell up"
                  title="Move up"
                  className={iconButton}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(1)}
                  disabled={index === total - 1}
                  aria-label="Move cell down"
                  title="Move down"
                  className={iconButton}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={onAddBelow} aria-label="Add cell below" title="Add cell below" className={iconButton}>
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={onDelete} aria-label="Delete cell" title="Delete cell" className={iconButton}>
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {showEditor ? (
              <textarea
                ref={textareaRef}
                id={`cell-input-${cell.id}`}
                value={cell.source}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label={`${isSql ? 'SQL' : 'Markdown'} cell ${index + 1}`}
                spellCheck={!isSql}
                rows={1}
                placeholder={isSql ? '-- write SQL here, then press Shift+Enter' : 'Write notes in Markdown...'}
                className={`block w-full resize-none overflow-hidden bg-transparent px-4 py-3 text-sm leading-6 text-heading placeholder:text-placeholder focus:outline-none ${
                  isSql ? 'font-mono' : ''
                }`}
              />
            ) : (
              <div className="cursor-text px-4 py-3 [&>:last-child]:mb-0" onDoubleClick={() => setEditing(true)}>
                <Markdown>{cell.source}</Markdown>
              </div>
            )}
          </div>

          {isSql && <CellOutput output={output} />}
        </div>
      </div>
    </div>
  )
}

export default Cell
