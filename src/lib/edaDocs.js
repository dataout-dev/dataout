import { edaLessons } from '../data/eda/index.js'

const docLoaders = import.meta.glob('../content/eda/*.md', { query: '?raw', import: 'default' })

const docKey = (id) => `../content/eda/${id}.md`

export function loadEdaDoc(id) {
  const loader = docLoaders[docKey(id)]
  return loader ? loader() : Promise.resolve(null)
}

if (import.meta.env.DEV) {
  const files = Object.keys(docLoaders).map((path) => path.split('/').pop().replace(/\.md$/, ''))
  const ids = edaLessons.map((lesson) => lesson.id)

  for (const id of ids) {
    if (!files.includes(id)) console.warn(`[edaDocs] No doc for lesson "${id}". Expected src/content/eda/${id}.md`)
  }
  for (const file of files) {
    if (!ids.includes(file)) console.warn(`[edaDocs] "${file}.md" matches no lesson id.`)
  }
}
