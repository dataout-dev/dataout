import { statsLessonsA } from './stats-a.js'
import { statsLessonsB } from './stats-b.js'

export const statsSection = {
  id: 'statistics-and-scientific-computing',
  title: 'Statistics and scientific computing',
  intro: 'Reasoning from data with SciPy, statsmodels and simulation.',
  lessons: [...statsLessonsA, ...statsLessonsB],
  checkpoint: [],
}
