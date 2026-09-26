import { useEffect, useRef } from 'react'
import { Compartment, EditorState, Prec } from '@codemirror/state'
import { EditorView, drawSelection, highlightActiveLine, keymap, lineNumbers, placeholder as placeholderExt } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { HighlightStyle, syntaxHighlighting, bracketMatching } from '@codemirror/language'
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { SQLite, sql } from '@codemirror/lang-sql'
import { tags as t } from '@lezer/highlight'

const palettes = {
  dark: {
    text: '#e6e6e6',
    background: '#14161c',
    gutter: 'rgba(255,255,255,0.25)',
    selection: 'rgba(130,170,255,0.28)',
    activeLine: 'rgba(255,255,255,0.04)',
    caret: '#ffffff',
    placeholder: 'rgba(255,255,255,0.3)',
    keyword: '#c792ea',
    string: '#a5e075',
    number: '#f78c6c',
    comment: '#7d8590',
    fn: '#82aaff',
    operator: '#89ddff',
    tooltipBg: '#1e222b',
    tooltipText: '#e6e6e6',
    tooltipBorder: 'rgba(255,255,255,0.12)',
    tooltipSelected: 'rgba(130,170,255,0.25)',
  },
  theme: {
    text: 'var(--color-heading)',
    background: 'transparent',
    gutter: 'var(--color-caption)',
    selection: 'color-mix(in srgb, var(--color-primary-accent) 25%, transparent)',
    activeLine: 'transparent',
    caret: 'var(--color-heading)',
    placeholder: 'var(--color-placeholder)',
    keyword: 'var(--color-accent-dark)',
    string: 'var(--color-correct)',
    number: 'var(--color-primary-accent)',
    comment: 'var(--color-caption)',
    fn: 'var(--color-heading)',
    operator: 'var(--color-body-text)',
    tooltipBg: 'var(--color-surface)',
    tooltipText: 'var(--color-heading)',
    tooltipBorder: 'color-mix(in srgb, var(--color-heading) 15%, transparent)',
    tooltipSelected: 'color-mix(in srgb, var(--color-primary-accent) 22%, transparent)',
  },
}

function buildTheme(palette, { fontSize, minHeight, padding }) {
  const p = palettes[palette]
  const view = EditorView.theme(
    {
      '&': { color: p.text, backgroundColor: p.background, fontSize, minWidth: 0 },
      '&.cm-focused': { outline: 'none' },
      '.cm-scroller': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', lineHeight: '1.75', overflow: 'auto' },
      '.cm-content': { caretColor: p.caret, padding, minHeight },
      '.cm-line': { padding: '0 0 0 12px' },
      '.cm-cursor': { borderLeftColor: p.caret },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': { backgroundColor: p.selection },
      '.cm-activeLine': { backgroundColor: p.activeLine },
      '.cm-gutters': { backgroundColor: 'transparent', color: p.gutter, border: 'none', paddingLeft: '12px' },
      '.cm-lineNumbers .cm-gutterElement': { padding: '0 12px 0 8px', minWidth: '2ch' },
      '.cm-placeholder': { color: p.placeholder },
      '.cm-matchingBracket, .cm-nonmatchingBracket': { backgroundColor: 'transparent', outline: `1px solid ${p.gutter}` },
      '.cm-tooltip': {
        backgroundColor: p.tooltipBg,
        color: p.tooltipText,
        border: `1px solid ${p.tooltipBorder}`,
        borderRadius: '10px',
        overflow: 'hidden',
      },
      '.cm-tooltip.cm-tooltip-autocomplete > ul': { fontFamily: 'inherit', maxHeight: '15em' },
      '.cm-tooltip-autocomplete ul li': { padding: '2px 10px' },
      '.cm-tooltip-autocomplete ul li[aria-selected]': { backgroundColor: p.tooltipSelected, color: p.tooltipText },
      '.cm-completionDetail': { opacity: 0.6, fontStyle: 'normal', marginLeft: '0.8em' },
    },
    { dark: palette === 'dark' }
  )

  const highlight = HighlightStyle.define([
    { tag: [t.keyword, t.operatorKeyword, t.modifier], color: p.keyword, fontWeight: '600' },
    { tag: [t.string, t.special(t.string)], color: p.string },
    { tag: [t.number, t.bool, t.null, t.atom], color: p.number },
    { tag: [t.lineComment, t.blockComment, t.comment], color: p.comment, fontStyle: 'italic' },
    { tag: [t.function(t.variableName), t.standard(t.name), t.typeName, t.className], color: p.fn },
    { tag: [t.operator, t.punctuation, t.separator, t.paren, t.squareBracket], color: p.operator },
  ])

  return [view, syntaxHighlighting(highlight)]
}

export function schemaToCompletion(tables = []) {
  const schema = {}
  for (const table of tables) {
    const name = table.tableName ?? table.name
    if (name) schema[name] = (table.columns ?? []).map((c) => c.name)
  }
  return schema
}

const sqlExtension = (schema) => sql({ dialect: SQLite, schema, upperCaseKeywords: true })

function CodeMirrorSql({
  value,
  onChange,
  onRun,
  onRunAndAdvance,
  schema,
  placeholder = '',
  ariaLabel = 'SQL query',
  elementId,
  autoFocus = false,
  variant = 'dark',
  showLineNumbers = true,
  minLines = 1,
  fontSize = '16px',
  padding = '20px 20px 20px 0',
  minHeight,
}) {
  const host = useRef(null)
  const view = useRef(null)
  const latest = useRef({})
  const schemaCompartment = useRef(new Compartment())

  useEffect(() => {
    latest.current = { onChange, onRun, onRunAndAdvance }
  })

  useEffect(() => {
    const keys = [
      {
        key: 'Mod-Enter',
        run: () => {
          latest.current.onRun?.()
          return true
        },
      },
      {
        key: 'Shift-Enter',
        run: () => {
          if (!latest.current.onRunAndAdvance) return false
          latest.current.onRunAndAdvance()
          return true
        },
      },
    ]

    const attrs = { 'aria-label': ariaLabel, spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off' }
    if (elementId) attrs.id = elementId

    const state = EditorState.create({
      doc: value,
      extensions: [
        Prec.highest(keymap.of(keys)),
        history(),
        drawSelection(),
        EditorView.lineWrapping,
        closeBrackets(),
        bracketMatching(),
        autocompletion({ activateOnTyping: true, icons: false }),
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, ...completionKeymap]),
        schemaCompartment.current.of(sqlExtension(schemaToCompletion(schema))),
        buildTheme(variant, { fontSize, padding, minHeight: minHeight ?? `${minLines * 28 + 40}px` }),
        ...(showLineNumbers ? [lineNumbers(), highlightActiveLine()] : []),
        ...(placeholder ? [placeholderExt(placeholder)] : []),
        EditorView.contentAttributes.of(attrs),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) latest.current.onChange?.(update.state.doc.toString())
        }),
      ],
    })

    const editor = new EditorView({ state, parent: host.current })
    view.current = editor
    if (autoFocus) editor.focus()

    return () => {
      editor.destroy()
      view.current = null
    }
  }, [])

  useEffect(() => {
    const editor = view.current
    if (!editor) return
    const current = editor.state.doc.toString()
    if (current !== value) editor.dispatch({ changes: { from: 0, to: current.length, insert: value } })
  }, [value])

  useEffect(() => {
    view.current?.dispatch({ effects: schemaCompartment.current.reconfigure(sqlExtension(schemaToCompletion(schema))) })
  }, [schema])

  return <div ref={host} className="min-w-0 flex-1" data-sql-editor />
}

export default CodeMirrorSql
