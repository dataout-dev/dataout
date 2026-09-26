import { Suspense, lazy } from 'react'

const CodeMirrorSql = lazy(() => import('./CodeMirrorSql'))

function Fallback({ value, onChange, onRun, onRunAndAdvance, placeholder, ariaLabel, elementId, variant, minLines = 1, fontSize = '16px' }) {
  const dark = variant === 'dark'
  return (
    <textarea
      id={elementId}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onKeyDown={(e) => {
        if (e.key !== 'Enter') return
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          onRun?.()
        } else if (e.shiftKey && onRunAndAdvance) {
          e.preventDefault()
          onRunAndAdvance()
        }
      }}
      rows={Math.max(minLines, 1)}
      spellCheck={false}
      aria-label={ariaLabel}
      placeholder={placeholder}
      style={{ fontSize }}
      className={`block w-full min-w-0 flex-1 resize-none bg-transparent px-5 py-5 font-mono leading-7 focus:outline-none ${
        dark ? 'text-white placeholder:text-white/30' : 'text-heading placeholder:text-placeholder'
      }`}
    />
  )
}

function SqlEditor(props) {
  return (
    <Suspense fallback={<Fallback {...props} />}>
      <CodeMirrorSql {...props} />
    </Suspense>
  )
}

export default SqlEditor
