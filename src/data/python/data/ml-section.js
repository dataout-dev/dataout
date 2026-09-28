import { mlLessonsA } from './ml-a.js'
import { mlLessonsB } from './ml-b.js'

export const mlSection = {
  id: 'machine-learning-with-scikit-learn',
  title: 'Machine learning with scikit-learn',
  intro: 'The full loop from data to a validated model.',
  lessons: [...mlLessonsA, ...mlLessonsB],
  checkpoint: [],
}
