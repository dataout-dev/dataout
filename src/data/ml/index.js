import { mlLessons as rawLessons } from './lessons.js'
import { mlProjects as rawProjects } from './projects.js'

export const mlLessons = rawLessons.map((lesson, i) => ({ ...lesson, number: i + 1, check: lesson.check ?? [] }))
export const mlProjects = rawProjects.map((project, i) => ({ ...project, number: i + 1 }))

export const mlLessonById = Object.fromEntries(mlLessons.map((l) => [l.id, l]))
export const mlProjectById = Object.fromEntries(mlProjects.map((p) => [p.id, p]))

export const mlGuidedProjects = mlProjects.filter((p) => p.kind === 'guided')
export const mlUnguidedProjects = mlProjects.filter((p) => p.kind === 'unguided')
