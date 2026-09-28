import { pandasLessonsA } from './pandas-a.js'
import { pandasLessonsB } from './pandas-b.js'
import { pandasLessonsC } from './pandas-c.js'
import { pandasLessonsD } from './pandas-d.js'

export const pandasSection = {
  id: 'pandas',
  title: 'pandas',
  intro: 'The workhorse for tabular data, built up from Series to full analyses.',
  lessons: [...pandasLessonsA, ...pandasLessonsB, ...pandasLessonsC, ...pandasLessonsD],
  checkpoint: [],
}
