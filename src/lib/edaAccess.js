import { edaLessons, edaProjects } from '../data/eda/index.js'

export function isLessonUnlocked(lessonId, completedIds) {
  const index = edaLessons.findIndex((l) => l.id === lessonId)
  if (index === -1) return false
  if (completedIds.has(lessonId)) return true
  if (index === 0) return true
  return completedIds.has(edaLessons[index - 1].id)
}

export function allLessonsDone(completedIds) {
  return edaLessons.every((l) => completedIds.has(l.id))
}

export function isProjectUnlocked(projectId, completedIds) {
  if (!edaProjects.some((p) => p.id === projectId)) return false
  return allLessonsDone(completedIds)
}

export function nextLessonAfter(lessonId) {
  const index = edaLessons.findIndex((l) => l.id === lessonId)
  return edaLessons[index + 1] ?? null
}
