import { regexFirst } from './regex-a.js'
import { regexSecond } from './regex-b.js'

export const regexSection = {
  id: 'regular-expressions',
  title: 'Regular expressions in depth',
  intro: 'A full course on regex: from literals to lookbehind, performance and real-world recipes.',
  open: true,
  lessons: [...regexFirst, ...regexSecond],
  checkpoint: [],
}
