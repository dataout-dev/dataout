import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Markdown from '../Markdown'
import PythonEditor from '../editor/PythonEditor'
import PythonOutput from '../python/PythonOutput'
import { Play, ArrowUp, ArrowDown, Plus, Trash, Pencil, Check } from '../icons'

const iconButton =
  'flex h-7 w-7 items-center justify-center rounded-md text-caption transition-colors hover:bg-heading/5 hover:text-heading disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent'

function PythonCell({
  cell,
  index,
  total,
  output,
  running,
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
  const isCode = cell.type === 'python'
  const showEditor = isCode || editing

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

  const handleMarkdownKeyDown = (event) => {
    if (event.key !== 'Enter' || !(event.shiftKey || event.ctrlKey || event.metaKey)) return
    event.preventDefault()
    setEditing(false)
    if (event.shiftKey) onAdvance()
  }

  return (
    <div>
      <div className="flex gap-3">
        <div className="w-14 shrink-0 pt-3.5 text-right font-mono text-xs text-caption" aria-hidden="true">
          {isCode ? (running ? '[*]' : `[${output?.count ?? ' '}]`) : ''}
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
                <option value="python">Python</option>
                <option value="markdown">Markdown</option>
              </select>

              <div className="flex items-center gap-0.5">
                {isCode ? (
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
                <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move cell up" title="Move up" className={iconButton}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Move cell down" title="Move down" className={iconButton}>
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

            {showEditor && isCode ? (
              <div className="flex">
                <PythonEditor
                  value={cell.source}
                  onChange={onChange}
                  onRun={onRun}
                  onRunAndAdvance={onRunAndAdvance}
                  variant="theme"
                  showLineNumbers={false}
                  fontSize="14px"
                  padding="12px 16px 12px 4px"
                  minHeight="48px"
                  elementId={`cell-input-${cell.id}`}
                  ariaLabel={`Python cell ${index + 1}`}
                  placeholder="# write Python here, then press Shift+Enter"
                />
              </div>
            ) : showEditor ? (
              <textarea
                ref={textareaRef}
                id={`cell-input-${cell.id}`}
                value={cell.source}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleMarkdownKeyDown}
                aria-label={`Markdown cell ${index + 1}`}
                rows={1}
                placeholder="Write notes in Markdown..."
                className="block w-full resize-none overflow-hidden bg-transparent px-4 py-3 text-sm leading-6 text-heading placeholder:text-placeholder focus:outline-none"
              />
            ) : (
              <div className="cursor-text px-4 py-3 [&>:last-child]:mb-0" onDoubleClick={() => setEditing(true)}>
                <Markdown>{cell.source}</Markdown>
              </div>
            )}
          </div>

          {isCode && <PythonOutput output={output} />}
        </div>
      </div>
    </div>
  )
}

export default PythonCell
