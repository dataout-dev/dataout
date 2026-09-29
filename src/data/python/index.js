import { pyTiers, pyTierById } from './tiers.js'
import { foundationsSections } from './foundations/index.js'
import { coreSections } from './core/index.js'
import { oopSections } from './oop/index.js'
import { dataSections } from './data/index.js'
import { proSections } from './pro/index.js'
import { algoSections } from './algo/index.js'

export { pyTiers, pyTierById }

const sectionsByTier = { foundations: foundationsSections, core: coreSections, oop: oopSections, data: dataSections, pro: proSections, algo: algoSections }

let counter = 0
export const pySections = pyTiers.flatMap((tier) =>
  (sectionsByTier[tier.id] ?? []).map((section, sectionIndex) => ({
    ...section,
    tier: tier.id,
    number: `${tier.number}.${sectionIndex + 1}`,
    open: section.open === true,
    lessons: section.lessons.map((lesson) => ({ ...lesson, tier: tier.id, section: section.id })),
  }))
)

export const pyLessons = pySections.flatMap((section) => {
  return section.lessons.map((lesson) => ({
    ...lesson,
    subject: 'python',
    sectionOpen: section.open,
    kind: lesson.kind ?? 'code',
    number: ++counter,
    check: lesson.check ?? [],
    real: lesson.real ?? [],
  }))
})

const perTier = {}
for (const lesson of pyLessons) {
  perTier[lesson.tier] = (perTier[lesson.tier] ?? 0) + 1
  lesson.numberInTier = perTier[lesson.tier]
}
const perSection = {}
for (const lesson of pyLessons) {
  perSection[lesson.section] = (perSection[lesson.section] ?? 0) + 1
  lesson.numberInSection = perSection[lesson.section]
}

export const pyLessonById = Object.fromEntries(pyLessons.map((l) => [l.id, l]))
export const pyTierLessons = (tierId) => pyLessons.filter((l) => l.tier === tierId)
export const pySectionLessons = (sectionId) => pyLessons.filter((l) => l.section === sectionId)
export const pyExamId = (tierId) => `exam-py-${tierId}`
export const pyLiveTiers = pyTiers.filter((t) => !t.soon)
