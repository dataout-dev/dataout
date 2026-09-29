import { gitTiers, gitTierById } from './tiers.js'
import { foundationsSections } from './foundations/index.js'

export { gitTiers, gitTierById }

const sectionsByTier = { foundations: foundationsSections }

let counter = 0
export const gitSections = gitTiers.flatMap((tier) =>
  (sectionsByTier[tier.id] ?? []).map((section, sectionIndex) => ({
    ...section,
    tier: tier.id,
    number: `${tier.number}.${sectionIndex + 1}`,
    open: section.open === true,
    lessons: section.lessons.map((lesson) => ({ ...lesson, tier: tier.id, section: section.id })),
  }))
)

export const gitLessons = gitSections.flatMap((section) => {
  return section.lessons.map((lesson) => ({
    ...lesson,
    subject: 'git',
    sectionOpen: section.open,
    kind: lesson.kind ?? 'code',
    number: ++counter,
    check: lesson.check ?? [],
    real: lesson.real ?? [],
  }))
})

const perTier = {}
for (const lesson of gitLessons) {
  perTier[lesson.tier] = (perTier[lesson.tier] ?? 0) + 1
  lesson.numberInTier = perTier[lesson.tier]
}
const perSection = {}
for (const lesson of gitLessons) {
  perSection[lesson.section] = (perSection[lesson.section] ?? 0) + 1
  lesson.numberInSection = perSection[lesson.section]
}

export const gitLessonById = Object.fromEntries(gitLessons.map((l) => [l.id, l]))
export const gitTierLessons = (tierId) => gitLessons.filter((l) => l.tier === tierId)
export const gitSectionLessons = (sectionId) => gitLessons.filter((l) => l.section === sectionId)
export const gitExamId = (tierId) => `exam-git-${tierId}`
export const gitLiveTiers = gitTiers.filter((t) => !t.soon)
