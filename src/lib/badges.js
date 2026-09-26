import { lessons, tiers, tierLessons, examId } from '../data/lessons'

const sqlLessons = lessons.filter((l) => l.subject === 'sql')

export function computeBadges(completedIds) {
  const done = (id) => completedIds.has(id)
  const doneCount = sqlLessons.filter((l) => done(l.id)).length
  const badges = []

  badges.push({
    id: 'first-step',
    icon: 'sparkles',
    title: 'First query',
    description: 'Complete your first SQL lesson.',
    earned: doneCount >= 1,
    progress: [Math.min(doneCount, 1), 1],
  })

  for (const tier of tiers) {
    const tl = tierLessons(tier.id)
    const count = tl.filter((l) => done(l.id)).length
    badges.push({
      id: `tier-${tier.id}`,
      icon: 'award',
      color: tier.color,
      title: `${tier.name} lessons`,
      description: `Complete all ${tl.length} ${tier.name} lessons.`,
      earned: count === tl.length,
      progress: [count, tl.length],
    })
  }

  for (const tier of tiers) {
    const passed = done(examId(tier.id))
    badges.push({
      id: `exam-${tier.id}`,
      icon: 'check',
      color: tier.color,
      title: `${tier.name} exam`,
      description: `Pass the ${tier.name} tier exam.`,
      earned: passed,
      progress: [passed ? 1 : 0, 1],
    })
  }

  const half = Math.ceil(sqlLessons.length / 2)
  badges.push({
    id: 'halfway',
    icon: 'sparkles',
    title: 'Halfway there',
    description: `Complete ${half} of ${sqlLessons.length} lessons.`,
    earned: doneCount >= half,
    progress: [Math.min(doneCount, half), half],
  })

  const examsPassed = tiers.filter((t) => done(examId(t.id))).length
  const allDone = doneCount === sqlLessons.length && examsPassed === tiers.length
  badges.push({
    id: 'sql-graduate',
    icon: 'trophy',
    title: 'SQL graduate',
    description: 'Finish every lesson and pass all four tier exams.',
    earned: allDone,
    progress: [doneCount + examsPassed, sqlLessons.length + tiers.length],
  })

  return badges
}
