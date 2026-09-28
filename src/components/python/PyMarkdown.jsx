import { Children, isValidElement, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { markdownComponents } from '../Markdown'
import PyExample from './PyExample'

const StaticPre = markdownComponents.pre

function PyMarkdown({ children, lessonId }) {
  const components = useMemo(
    () => ({
      ...markdownComponents,
      pre: function Pre({ node, children: preChildren, ...props }) {
        const child = Children.toArray(preChildren)[0]
        const className = isValidElement(child) ? (child.props.className ?? '') : ''
        if (className.includes('language-python')) {
          const source = String(child.props.children ?? '').replace(/\n$/, '')
          return <PyExample code={source} session={`lesson:${lessonId}`} />
        }
        return (
          <StaticPre node={node} {...props}>
            {preChildren}
          </StaticPre>
        )
      },
    }),
    [lessonId]
  )

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  )
}

export default PyMarkdown
