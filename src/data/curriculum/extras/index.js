import { beginnerExtras } from './beginner.js'
import { intermediateExtras } from './intermediate.js'
import { advancedExtras } from './advanced.js'
import { expertExtras } from './expert.js'

export const realExtras = { ...beginnerExtras, ...intermediateExtras, ...advancedExtras, ...expertExtras }
