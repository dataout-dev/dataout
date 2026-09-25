import { tiers, tierById } from './tiers.js'
import { beginner } from './beginner.js'
import { intermediate } from './intermediate.js'
import { advanced } from './advanced.js'
import { expert } from './expert.js'
import { realExtras } from './extras/index.js'

export { tiers, tierById }

const byTier = { beginner, intermediate, advanced, expert }

let counter = 0
export const lessons = tiers.flatMap((tier) =>
  byTier[tier.id].map((lesson, index) => ({
    ...lesson,
    subject: 'sql',
    tier: tier.id,
    number: ++counter,
    numberInTier: index + 1,
    kind: lesson.kind ?? 'query',
    orderMatters: lesson.orderMatters ?? false,
    testCases: (lesson.cases ?? []).map(([label, data]) => ({ label, data })),
    challenges: lesson.real ? [lesson.real, ...(realExtras[lesson.id] ?? [])] : [],
  }))
)

export const lessonById = Object.fromEntries(lessons.map((l) => [l.id, l]))
export const tierLessons = (tierId) => lessons.filter((l) => l.tier === tierId)

export const examId = (tierId) => `exam-${tierId}`

export const sqlPath = tiers.flatMap((tier) => [
  ...tierLessons(tier.id).map((lesson) => ({ kind: 'lesson', id: lesson.id, tier: tier.id })),
  { kind: 'exam', id: examId(tier.id), tier: tier.id },
])

export const pathIndex = (id) => sqlPath.findIndex((step) => step.id === id)

export function pathUrl(step) {
  return step.kind === 'exam' ? `/learn/sql/exam/${step.tier}` : `/learn/sql/${step.id}`
}
