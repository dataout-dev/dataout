import { pyLessons } from '../data/python/index.js'

const docLoaders = import.meta.glob('../content/python/*.md', { query: '?raw', import: 'default' })

const docKey = (id) => `../content/python/${id}.md`

export function loadPythonDoc(id) {
  const loader = docLoaders[docKey(id)]
  return loader ? loader() : Promise.resolve(null)
}

if (import.meta.env.DEV) {
  const files = Object.keys(docLoaders).map((path) => path.split('/').pop().replace(/\.md$/, ''))
  const ids = pyLessons.map((lesson) => lesson.id)

  for (const id of ids) {
    if (!files.includes(id)) console.warn(`[pythonDocs] No doc for lesson "${id}". Expected src/content/python/${id}.md`)
  }
  for (const file of files) {
    if (!ids.includes(file)) console.warn(`[pythonDocs] "${file}.md" matches no lesson id.`)
  }
}
