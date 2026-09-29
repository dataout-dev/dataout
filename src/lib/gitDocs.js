import { gitLessons } from '../data/git/index.js'

const docLoaders = import.meta.glob('../content/git/*.md', { query: '?raw', import: 'default' })

const docKey = (id) => `../content/git/${id}.md`

export function loadGitDoc(id) {
  const loader = docLoaders[docKey(id)]
  return loader ? loader() : Promise.resolve(null)
}

if (import.meta.env.DEV) {
  const files = Object.keys(docLoaders).map((path) => path.split('/').pop().replace(/\.md$/, ''))
  const ids = gitLessons.map((lesson) => lesson.id)

  for (const id of ids) {
    if (!files.includes(id)) console.warn(`[gitDocs] No doc for lesson "${id}". Expected src/content/git/${id}.md`)
  }
  for (const file of files) {
    if (!ids.includes(file)) console.warn(`[gitDocs] "${file}.md" matches no lesson id.`)
  }
}
