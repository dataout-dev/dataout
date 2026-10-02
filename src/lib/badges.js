import { lessons, tiers, tierLessons, examId, tierProjects } from '../data/lessons'
import { pyLessons, pyLiveTiers, pyTierLessons, pyExamId } from '../data/python/index.js'
import { gitLessons, gitLiveTiers, gitTierLessons, gitExamId } from '../data/git/index.js'

function buildBadges({
  prefix,
  subjectLessons,
  liveTiers,
  tierLessonsFn,
  examIdFn,
  completedIds,
  firstTitle,
  firstDescription,
  graduateTitle,
  graduateDescription,
}) {
  const done = (id) => completedIds.has(id)
  const doneCount = subjectLessons.filter((l) => done(l.id)).length
  const badges = []

  badges.push({
    id: `${prefix}-first-step`,
    icon: 'sparkles',
    title: firstTitle,
    description: firstDescription,
    earned: doneCount >= 1,
    progress: [Math.min(doneCount, 1), 1],
  })

  for (const tier of liveTiers) {
    const tl = tierLessonsFn(tier.id)
    const count = tl.filter((l) => done(l.id)).length
    badges.push({
      id: `${prefix}-tier-${tier.id}`,
      icon: 'award',
      color: tier.color,
      title: `${tier.name} lessons`,
      description: `Complete all ${tl.length} ${tier.name} lessons.`,
      earned: tl.length > 0 && count === tl.length,
      progress: [count, tl.length],
    })
  }

  for (const tier of liveTiers) {
    const passed = done(examIdFn(tier.id))
    badges.push({
      id: `${prefix}-exam-${tier.id}`,
      icon: 'check',
      color: tier.color,
      title: `${tier.name} exam`,
      description: `Pass the ${tier.name} tier exam.`,
      earned: passed,
      progress: [passed ? 1 : 0, 1],
    })
  }

  const half = Math.ceil(subjectLessons.length / 2)
  badges.push({
    id: `${prefix}-halfway`,
    icon: 'sparkles',
    title: 'Halfway there',
    description: `Complete ${half} of ${subjectLessons.length} lessons.`,
    earned: doneCount >= half,
    progress: [Math.min(doneCount, half), half],
  })

  const examsPassed = liveTiers.filter((t) => done(examIdFn(t.id))).length
  const allDone = subjectLessons.length > 0 && doneCount === subjectLessons.length && examsPassed === liveTiers.length
  badges.push({
    id: `${prefix}-graduate`,
    icon: 'trophy',
    title: graduateTitle,
    description: graduateDescription,
    earned: allDone,
    progress: [doneCount + examsPassed, subjectLessons.length + liveTiers.length],
  })

  return badges
}

export function computeBadges(completedIds) {
  const sqlLessons = lessons.filter((l) => l.subject === 'sql')
  const badges = buildBadges({
    prefix: 'sql',
    subjectLessons: sqlLessons,
    liveTiers: tiers,
    tierLessonsFn: tierLessons,
    examIdFn: examId,
    completedIds,
    firstTitle: 'First query',
    firstDescription: 'Complete your first SQL lesson.',
    graduateTitle: 'SQL graduate',
    graduateDescription: `Finish every lesson and pass all ${tiers.length} tier exams.`,
  })

  for (const tier of tiers) {
    for (const project of tierProjects(tier.id)) {
      badges.push({
        id: `sql-project-${project.id}`,
        icon: 'folder',
        color: project.kind === 'guided' ? '#cfe3f5' : '#d7f0e6',
        title: project.title,
        description:
          project.kind === 'guided' ? `Finish all ${project.parts.length} parts of this project.` : 'Mark this project complete.',
        earned: completedIds.has(project.id),
        progress: [completedIds.has(project.id) ? 1 : 0, 1],
      })
    }
  }

  return badges
}

export function computePythonBadges(completedIds) {
  return buildBadges({
    prefix: 'python',
    subjectLessons: pyLessons,
    liveTiers: pyLiveTiers,
    tierLessonsFn: pyTierLessons,
    examIdFn: pyExamId,
    completedIds,
    firstTitle: 'First script',
    firstDescription: 'Complete your first Python lesson.',
    graduateTitle: 'Python graduate',
    graduateDescription: `Finish every lesson and pass all ${pyLiveTiers.length} tier exams.`,
  })
}

export function computeGitBadges(completedIds) {
  return buildBadges({
    prefix: 'git',
    subjectLessons: gitLessons,
    liveTiers: gitLiveTiers,
    tierLessonsFn: gitTierLessons,
    examIdFn: gitExamId,
    completedIds,
    firstTitle: 'First commit',
    firstDescription: 'Complete your first Git lesson.',
    graduateTitle: 'Git graduate',
    graduateDescription: `Finish every lesson and pass all ${gitLiveTiers.length} tier exams.`,
  })
}
