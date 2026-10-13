import { mlLessons, mlProjects } from '../data/ml/index.js'

export function isLessonUnlocked(lessonId, completedIds) {
  const index = mlLessons.findIndex((l) => l.id === lessonId)
  if (index === -1) return false
  if (completedIds.has(lessonId)) return true
  if (index === 0) return true
  return completedIds.has(mlLessons[index - 1].id)
}

export function allLessonsDone(completedIds) {
  return mlLessons.every((l) => completedIds.has(l.id))
}

export function isProjectUnlocked(projectId, completedIds) {
  if (!mlProjects.some((p) => p.id === projectId)) return false
  return allLessonsDone(completedIds)
}

export function nextLessonAfter(lessonId) {
  const index = mlLessons.findIndex((l) => l.id === lessonId)
  return mlLessons[index + 1] ?? null
}
