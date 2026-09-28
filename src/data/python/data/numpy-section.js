import { numpyLessonsA } from './numpy-a.js'
import { numpyLessonsB } from './numpy-b.js'

export const numpySection = {
  id: 'numpy',
  title: 'NumPy',
  intro: 'Fast numerical arrays: the foundation of the data stack.',
  lessons: [...numpyLessonsA, ...numpyLessonsB],
  checkpoint: [],
}
