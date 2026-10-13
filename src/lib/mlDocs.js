import { mlLessons } from '../data/ml/index.js'

const docLoaders = import.meta.glob('../content/ml/*.md', { query: '?raw', import: 'default' })

const docKey = (id) => `../content/ml/${id}.md`

export function loadMlDoc(id) {
  const loader = docLoaders[docKey(id)]
  return loader ? loader() : Promise.resolve(null)
}

if (import.meta.env.DEV) {
  const files = Object.keys(docLoaders).map((path) => path.split('/').pop().replace(/\.md$/, ''))
  const ids = mlLessons.map((lesson) => lesson.id)

  for (const id of ids) {
    if (!files.includes(id)) console.warn(`[mlDocs] No doc for lesson "${id}". Expected src/content/ml/${id}.md`)
  }
  for (const file of files) {
    if (!ids.includes(file)) console.warn(`[mlDocs] "${file}.md" matches no lesson id.`)
  }
}
