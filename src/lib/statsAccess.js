import { statsExamId, statsLessonById, statsLessons, statsTierById, statsTierLessons, statsTiers } from '../data/stats/index.js'

export function isTierUnlocked(tierId, completedIds) {
  const index = statsTiers.findIndex((t) => t.id === tierId)
  if (index === -1) return false
  const tier = statsTiers[index]
  if (tier.entry) return true
  return completedIds.has(statsExamId(statsTiers[index - 1].id))
}

export function isLessonUnlocked(lessonId, completedIds) {
  const lesson = statsLessonById[lessonId]
  if (!lesson) return false
  if (completedIds.has(lessonId)) return true
  if (!isTierUnlocked(lesson.tier, completedIds)) return false
  if (statsTierById[lesson.tier].openLessons) return true

  const before = statsTierLessons(lesson.tier).slice(0, lesson.numberInTier - 1)
  return before.every((l) => completedIds.has(l.id))
}

export function isExamUnlocked(tierId, completedIds) {
  if (!statsTierById[tierId] || !isTierUnlocked(tierId, completedIds)) return false
  return statsTierLessons(tierId).every((l) => completedIds.has(l.id))
}

export function nextLessonAfter(lessonId) {
  const index = statsLessons.findIndex((l) => l.id === lessonId)
  const next = statsLessons[index + 1]
  return next && next.tier === statsLessons[index].tier ? next : null
}
