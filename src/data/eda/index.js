import { edaLessons as rawLessons } from './lessons.js'
import { edaProjects as rawProjects } from './projects.js'

export const edaLessons = rawLessons.map((lesson, i) => ({ ...lesson, number: i + 1, check: lesson.check ?? [] }))
export const edaProjects = rawProjects.map((project, i) => ({ ...project, number: i + 1 }))

export const edaLessonById = Object.fromEntries(edaLessons.map((l) => [l.id, l]))
export const edaProjectById = Object.fromEntries(edaProjects.map((p) => [p.id, p]))

export const edaGuidedProjects = edaProjects.filter((p) => p.kind === 'guided')
export const edaUnguidedProjects = edaProjects.filter((p) => p.kind === 'unguided')
