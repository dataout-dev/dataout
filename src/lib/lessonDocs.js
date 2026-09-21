import { lessons } from '../data/lessons'

const docLoaders = import.meta.glob('../content/lessons/*.md', { query: '?raw', import: 'default' })

const docKey = (id) => `../content/lessons/${id}.md`

export function loadLessonDoc(id) {
  const loader = docLoaders[docKey(id)]
  return loader ? loader() : Promise.resolve(null)
}

if (import.meta.env.DEV) {
  const files = Object.keys(docLoaders).map((path) => path.split('/').pop().replace(/\.md$/, ''))
  const ids = lessons.map((lesson) => lesson.id)

  for (const id of ids) {
    if (!files.includes(id)) {
      console.warn(`[lessonDocs] No doc for lesson "${id}". Expected src/content/lessons/${id}.md (exact letter case).`)
    }
  }
  for (const file of files) {
    if (!ids.includes(file)) {
      console.warn(`[lessonDocs] "${file}.md" matches no lesson id. Check the spelling and letter case.`)
    }
  }
}
