import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const styled = (Tag, baseClass) =>
  function Styled({ node: _node, ...props }) {
    return <Tag className={baseClass} {...props} />
  }

const components = {
  h1: styled('h1', 'font-display font-semibold text-3xl text-heading leading-tight mt-10 mb-4 first:mt-0'),
  h2: styled('h2', 'font-display font-semibold text-2xl text-heading leading-tight mt-10 mb-3 first:mt-0'),
  h3: styled('h3', 'font-display font-semibold text-lg text-heading mt-7 mb-2'),
  h4: styled('h4', 'font-semibold text-heading mt-5 mb-2'),
  p: styled('p', 'text-body-text leading-relaxed mb-4'),
  ul: styled('ul', 'list-disc pl-6 mb-4 space-y-1.5 text-body-text marker:text-caption'),
  ol: styled('ol', 'list-decimal pl-6 mb-4 space-y-1.5 text-body-text marker:text-caption'),
  li: styled('li', 'leading-relaxed'),
  strong: styled('strong', 'font-semibold text-heading'),
  em: styled('em', 'italic'),
  hr: styled('hr', 'my-8 border-heading/10'),
  blockquote: styled(
    'blockquote',
    'my-5 rounded-r-xl border-l-4 border-primary-accent bg-badge px-4 py-3 text-body-text [&>p]:mb-0 [&>p+p]:mt-2'
  ),

  a: function Anchor({ node: _node, href, ...props }) {
    const external = /^https?:\/\//.test(href ?? '')
    return (
      <a
        href={href}
        className="text-primary-accent underline underline-offset-2 hover:opacity-80"
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...props}
      />
    )
  },

  code: styled('code', 'rounded-md bg-heading/10 px-1.5 py-0.5 font-mono text-[0.9em] text-heading'),
  pre: styled(
    'pre',
    'my-5 overflow-x-auto rounded-xl border border-heading/10 bg-surface p-4 font-mono text-sm leading-relaxed text-heading ' +
      '[&_code]:rounded-none [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[1em]'
  ),

    table: function Table({ node: _node, ...props }) {
    return (
      <div className="my-5 overflow-x-auto rounded-xl border border-heading/10 bg-surface">
        <table className="w-full text-sm" {...props} />
      </div>
    )
  },
  th: styled('th', 'bg-cream px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-caption'),
  td: styled('td', 'border-t border-heading/5 px-3 py-2.5 text-body-text'),
}

function Markdown({ children }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  )
}

export default Markdown
