import { statsLessons } from '../data/stats/index.js'

const docLoaders = import.meta.glob('../content/stats/*.md', { query: '?raw', import: 'default' })

const docKey = (id) => `../content/stats/${id}.md`

export function loadStatsDoc(id) {
  const loader = docLoaders[docKey(id)]
  return loader ? loader() : Promise.resolve(null)
}

if (import.meta.env.DEV) {
  const files = Object.keys(docLoaders).map((path) => path.split('/').pop().replace(/\.md$/, ''))
  const ids = statsLessons.map((lesson) => lesson.id)

  for (const id of ids) {
    if (!files.includes(id)) console.warn(`[statsDocs] No doc for lesson "${id}". Expected src/content/stats/${id}.md`)
  }
  for (const file of files) {
    if (!ids.includes(file)) console.warn(`[statsDocs] "${file}.md" matches no lesson id.`)
  }
}
