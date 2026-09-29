import { complexityAndMeasurement } from './complexity.js'
import { dataStructuresLessonsA } from './data-structures-a.js'
import { dataStructuresLessonsB } from './data-structures-b.js'

export const dataStructures = {
  id: 'data-structures',
  title: 'Data structures',
  intro: 'Building and using the classics.',
  lessons: [...dataStructuresLessonsA, ...dataStructuresLessonsB],
  checkpoint: [],
}

export const algoSections = [complexityAndMeasurement, dataStructures]
