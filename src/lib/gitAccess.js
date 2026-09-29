import { gitExamId, gitLessonById, gitLessons, gitLiveTiers, gitTierById, gitTierLessons } from '../data/git/index.js'

export function isTierUnlocked(tierId, completedIds) {
  const index = gitLiveTiers.findIndex((t) => t.id === tierId)
  if (index === -1) return false
  const tier = gitLiveTiers[index]
  if (tier.entry) return true
  return completedIds.has(gitExamId(gitLiveTiers[index - 1].id))
}

export function isLessonUnlocked(lessonId, completedIds) {
  const lesson = gitLessonById[lessonId]
  if (!lesson) return false
  if (completedIds.has(lessonId)) return true
  if (!isTierUnlocked(lesson.tier, completedIds)) return false
  if (gitTierById[lesson.tier].openLessons) return true

  const before = gitTierLessons(lesson.tier).slice(0, lesson.numberInTier - 1)
  if (lesson.sectionOpen) {
    return before.filter((l) => l.section === lesson.section).every((l) => completedIds.has(l.id))
  }
  return before.filter((l) => !l.sectionOpen).every((l) => completedIds.has(l.id))
}

export function isExamUnlocked(tierId, completedIds) {
  if (!gitTierById[tierId] || !isTierUnlocked(tierId, completedIds)) return false
  return gitTierLessons(tierId).every((l) => completedIds.has(l.id))
}

export function nextLessonAfter(lessonId) {
  const index = gitLessons.findIndex((l) => l.id === lessonId)
  const next = gitLessons[index + 1]
  return next && next.tier === gitLessons[index].tier ? next : null
}
