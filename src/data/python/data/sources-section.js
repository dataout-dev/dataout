import { sourcesLessonsA } from './sources-a.js'
import { sourcesLessonsB } from './sources-b.js'

export const sourcesSection = {
  id: 'data-sources-and-data-engineering',
  title: 'Data sources and data engineering',
  intro: 'SQL, other dataframe engines, the web and pipelines.',
  lessons: [...sourcesLessonsA, ...sourcesLessonsB],
  checkpoint: [],
}
