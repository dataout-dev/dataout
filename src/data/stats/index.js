import { statsTiers, statsTierById } from './tiers.js'
import { descriptiveSections } from './descriptive/index.js'
import { probabilitySections } from './probability/index.js'
import { inferentialSections } from './inferential/index.js'
import { relationshipsSections } from './relationships/index.js'

export { statsTiers, statsTierById }

const sectionsByTier = {
  descriptive: descriptiveSections,
  probability: probabilitySections,
  inferential: inferentialSections,
  relationships: relationshipsSections,
}

let counter = 0
export const statsSections = statsTiers.flatMap((tier) =>
  (sectionsByTier[tier.id] ?? []).map((section, sectionIndex) => ({
    ...section,
    tier: tier.id,
    number: `${tier.number}.${sectionIndex + 1}`,
    lessons: section.lessons.map((lesson) => ({ ...lesson, tier: tier.id, section: section.id })),
  }))
)

export const statsLessons = statsSections.flatMap((section) => {
  return section.lessons.map((lesson) => ({
    ...lesson,
    subject: 'stats',
    kind: lesson.kind ?? 'learn',
    number: ++counter,
    check: lesson.check ?? [],
  }))
})

const perTier = {}
for (const lesson of statsLessons) {
  perTier[lesson.tier] = (perTier[lesson.tier] ?? 0) + 1
  lesson.numberInTier = perTier[lesson.tier]
}

export const statsLessonById = Object.fromEntries(statsLessons.map((l) => [l.id, l]))
export const statsTierLessons = (tierId) => statsLessons.filter((l) => l.tier === tierId)
export const statsExamId = (tierId) => `exam-stats-${tierId}`
