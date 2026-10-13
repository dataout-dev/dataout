import { lessons, tiers, tierLessons, examId, tierProjects } from '../data/lessons'
import { pyLessons, pyLiveTiers, pyTierLessons, pyExamId } from '../data/python/index.js'
import { gitLessons, gitLiveTiers, gitTierLessons, gitExamId } from '../data/git/index.js'
import { statsLessons, statsTiers, statsTierLessons, statsExamId } from '../data/stats/index.js'
import { edaLessons, edaProjects } from '../data/eda/index.js'
import { mlLessons, mlProjects } from '../data/ml/index.js'

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

export function computeStatsBadges(completedIds) {
  return buildBadges({
    prefix: 'stats',
    subjectLessons: statsLessons,
    liveTiers: statsTiers,
    tierLessonsFn: statsTierLessons,
    examIdFn: statsExamId,
    completedIds,
    firstTitle: 'First distribution',
    firstDescription: 'Complete your first Statistics lesson.',
    graduateTitle: 'Statistics graduate',
    graduateDescription: `Finish every lesson and pass all ${statsTiers.length} tier exams.`,
  })
}

// EDA and Predictive Modeling have no tiers or exams — just a flat run of
// lessons followed by a flat list of guided/unguided projects — so they use
// their own, simpler badge shape instead of buildBadges.
function buildWorkshopBadges({
  prefix,
  subjectLessons,
  projects,
  completedIds,
  firstTitle,
  firstDescription,
  workflowTitle,
  workflowDescription,
  graduateTitle,
  graduateDescription,
}) {
  const done = (id) => completedIds.has(id)
  const doneLessons = subjectLessons.filter((l) => done(l.id)).length
  const doneProjects = projects.filter((p) => done(p.id)).length
  const badges = []

  badges.push({
    id: `${prefix}-first-step`,
    icon: 'sparkles',
    title: firstTitle,
    description: firstDescription,
    earned: doneLessons >= 1,
    progress: [Math.min(doneLessons, 1), 1],
  })

  badges.push({
    id: `${prefix}-workflow`,
    icon: 'award',
    title: workflowTitle,
    description: workflowDescription,
    earned: subjectLessons.length > 0 && doneLessons === subjectLessons.length,
    progress: [doneLessons, subjectLessons.length],
  })

  for (const project of projects) {
    badges.push({
      id: `${prefix}-project-${project.id}`,
      icon: 'folder',
      color: project.kind === 'guided' ? '#cfe3f5' : '#d7f0e6',
      title: project.title,
      description: project.kind === 'guided' ? 'Finish this guided project.' : 'Mark this project complete.',
      earned: done(project.id),
      progress: [done(project.id) ? 1 : 0, 1],
    })
  }

  const allDone = subjectLessons.length > 0 && doneLessons === subjectLessons.length && doneProjects === projects.length
  badges.push({
    id: `${prefix}-graduate`,
    icon: 'trophy',
    title: graduateTitle,
    description: graduateDescription,
    earned: allDone,
    progress: [doneLessons + doneProjects, subjectLessons.length + projects.length],
  })

  return badges
}

export function computeEdaBadges(completedIds) {
  return buildWorkshopBadges({
    prefix: 'eda',
    subjectLessons: edaLessons,
    projects: edaProjects,
    completedIds,
    firstTitle: 'First look',
    firstDescription: 'Complete your first EDA lesson.',
    workflowTitle: 'EDA workflow',
    workflowDescription: `Finish all ${edaLessons.length} EDA lessons.`,
    graduateTitle: 'EDA graduate',
    graduateDescription: `Finish every lesson and all ${edaProjects.length} projects.`,
  })
}

export function computeMlBadges(completedIds) {
  return buildWorkshopBadges({
    prefix: 'ml',
    subjectLessons: mlLessons,
    projects: mlProjects,
    completedIds,
    firstTitle: 'First model',
    firstDescription: 'Complete your first Predictive Modeling lesson.',
    workflowTitle: 'Modeling workflow',
    workflowDescription: `Finish all ${mlLessons.length} Predictive Modeling lessons.`,
    graduateTitle: 'Predictive Modeling graduate',
    graduateDescription: `Finish every lesson and all ${mlProjects.length} projects.`,
  })
}
