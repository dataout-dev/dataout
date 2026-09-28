import { pyExamId, pyLessonById, pyLessons, pyLiveTiers, pyTierById, pyTierLessons } from '../data/python/index.js'

export function isTierUnlocked(tierId, completedIds) {
  const index = pyLiveTiers.findIndex((t) => t.id === tierId)
  if (index === -1) return false
  const tier = pyLiveTiers[index]
  if (tier.entry) return true
  return completedIds.has(pyExamId(pyLiveTiers[index - 1].id))
}

export function isLessonUnlocked(lessonId, completedIds) {
  const lesson = pyLessonById[lessonId]
  if (!lesson) return false
  if (completedIds.has(lessonId)) return true
  if (!isTierUnlocked(lesson.tier, completedIds)) return false
  if (pyTierById[lesson.tier].openLessons) return true

  const before = pyTierLessons(lesson.tier).slice(0, lesson.numberInTier - 1)
  if (lesson.sectionOpen) {
    return before.filter((l) => l.section === lesson.section).every((l) => completedIds.has(l.id))
  }
  return before.filter((l) => !l.sectionOpen).every((l) => completedIds.has(l.id))
}

export function isExamUnlocked(tierId, completedIds) {
  if (!pyTierById[tierId] || !isTierUnlocked(tierId, completedIds)) return false
  return pyTierLessons(tierId).every((l) => completedIds.has(l.id))
}

export function nextLessonAfter(lessonId) {
  const index = pyLessons.findIndex((l) => l.id === lessonId)
  const next = pyLessons[index + 1]
  return next && next.tier === pyLessons[index].tier ? next : null
}
