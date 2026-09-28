import { dataModelLessonsA } from './datamodel-a.js'
import { dataModelLessonsB } from './datamodel-b.js'

export const dataModel = {
  id: 'the-python-data-model',
  title: 'The Python data model',
  intro: 'Special methods that make your objects feel built-in.',
  lessons: [...dataModelLessonsA, ...dataModelLessonsB],
  checkpoint: [],
}
