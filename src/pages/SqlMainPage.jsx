import { Link } from 'react-router-dom'
import { lessons, tierLessons, tiers, examId } from '../data/lessons'
import { exams } from '../data/curriculum/exams'
import { useCompletedLessons } from '../lib/useCompletedLessons'
import { isStepUnlocked } from '../lib/lessonAccess'
import { sqlPlayground } from '../data/playgrounds'
import { ArrowLeft, ArrowRight, Database, Check, Lock, Terminal } from '../components/icons'

const pad = (n) => String(n).padStart(2, '0')

function StatusTag({ completed, unlocked }) {
  if (completed) return <span className="text-[10px] font-semibold tracking-widest text-correct uppercase">Completed</span>
  if (unlocked) return <span className="text-[10px] font-semibold tracking-widest text-accent-dark uppercase">Available</span>
  return <span className="text-[10px] font-semibold tracking-widest text-body-text bg-cream rounded-full px-2 py-0.5 uppercase">Locked</span>
}

function SqlMainPage() {
  const { completedIds } = useCompletedLessons()
  const doneCount = lessons.filter((l) => completedIds.has(l.id)).length

  return (
    <div className="bg-cream">
      <div className="border-b border-heading/10">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-body-text hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> All learning paths
          </Link>
        </div>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-8 pt-16 pb-16 grid gap-10 lg:grid-cols-[1fr_300px] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-heading bg-surface border border-heading/10 px-3 py-1.5 rounded-full mb-8 shadow-sm">
              <Database className="h-3.5 w-3.5 text-primary-accent" />
              SQL foundations
            </span>

            <h1 className="font-display font-semibold text-5xl md:text-6xl leading-[1.05] mb-6">
              <span className="text-heading/60">Learn SQL</span>
              <br />
              <span className="text-primary-accent">by querying.</span>
            </h1>

            <p className="text-body-text max-w-lg leading-relaxed mb-6">
              A practical path from your first SELECT to answering the questions teams ask. Every lesson ends on real
              data.
            </p>

            <p className="text-sm text-body-text">
              <span className="font-semibold text-heading">{doneCount}</span> of {lessons.length} lessons complete
            </p>
          </div>

          <Link
            to={sqlPlayground.path}
            className="group rounded-2xl border border-heading/10 bg-surface p-6 shadow-sm transition-colors hover:border-heading/25"
          >
            <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-heading/10 text-heading">
              <Terminal className="h-5 w-5" />
            </span>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent-dark">SQL playground</p>
            <p className="mb-2 font-display text-xl font-semibold text-heading">Try it on real data.</p>
            <p className="mb-5 text-sm leading-relaxed text-body-text">
              Open a notebook, query real datasets, or upload your own CSV file.
            </p>
            <span className="flex items-center gap-1 text-sm font-semibold text-heading">
              Open playground
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-8 pb-24">
        <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-3">Your curriculum</p>
        <h2 className="font-display font-semibold text-3xl md:text-4xl text-heading mb-2">Four tiers, one step at a time.</h2>
        <p className="text-body-text mb-10">
          Finish a tier's lessons to unlock its exam. Pass the exam to open the next tier.
        </p>

        <div className="flex flex-col gap-14">
          {tiers.map((tier, tierIndex) => {
            const tierItems = tierLessons(tier.id)
            const done = tierItems.filter((l) => completedIds.has(l.id)).length
            const percent = Math.round((done / tierItems.length) * 100)
            const questions = exams[tier.id] ?? []
            const points = questions.reduce((sum, q) => sum + q.points, 0)
            const examStepId = examId(tier.id)
            const examUnlocked = isStepUnlocked(examStepId, completedIds)
            const examPassed = completedIds.has(examStepId)
            const previousTier = tiers[tierIndex - 1]

            return (
              <div key={tier.id} id={tier.id}>
                <div className="mb-5 rounded-2xl p-6" style={{ backgroundColor: tier.color }}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#57534e]">
                        Tier {tier.number}
                      </p>
                      <h3 className="font-display text-3xl font-semibold text-[#1c1c1a]">{tier.name}</h3>
                      <p className="mt-1 text-sm text-[#3f3b37]">{tier.tagline}</p>
                      <p className="mt-3 text-xs text-[#57534e]">
                        {tier.audience} Data: {tier.datasetNote}
                      </p>
                    </div>
                    <div className="w-full sm:w-48">
                      <p className="mb-1.5 text-xs font-semibold text-[#1c1c1a]">
                        {done} / {tierItems.length} lessons
                      </p>
                      <div className="h-2 overflow-hidden rounded-full bg-white/60">
                        <div className="h-full rounded-full bg-[#1c1c1a]" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {tierItems.map((lesson) => {
                    const completed = completedIds.has(lesson.id)
                    const unlocked = isStepUnlocked(lesson.id, completedIds)
                    const isFirstOfTier = lesson.numberInTier === 1

                    const body = (
                      <>
                        <div className="flex items-start gap-4">
                          {completed ? (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-correct/10 text-correct mt-1 shrink-0">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          ) : (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-heading/15 text-body-text text-[10px] font-medium mt-1 shrink-0">
                              {pad(lesson.number)}
                            </span>
                          )}
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-semibold text-heading">
                                {lesson.title} {lesson.titleAccent}
                              </p>
                              <StatusTag completed={completed} unlocked={unlocked} />
                            </div>
                            <p className="text-sm text-body-text">
                              {unlocked
                                ? lesson.blurb
                                : isFirstOfTier && previousTier
                                  ? `Pass the ${previousTier.name} exam to unlock this tier.`
                                  : 'Complete the previous lesson to unlock this one.'}
                            </p>
                          </div>
                        </div>
                        {unlocked ? (
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-heading text-cream shrink-0 group-hover:bg-heading/90 transition-colors">
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        ) : (
                          <Lock className="h-4 w-4 text-placeholder shrink-0" />
                        )}
                      </>
                    )

                    return unlocked ? (
                      <Link
                        key={lesson.id}
                        to={`/learn/sql/${lesson.id}`}
                        className="group flex items-center justify-between gap-4 bg-surface rounded-2xl border border-heading/10 p-6 hover:border-heading/20 transition-colors"
                      >
                        {body}
                      </Link>
                    ) : (
                      <div
                        key={lesson.id}
                        aria-disabled="true"
                        className="flex items-center justify-between gap-4 bg-surface rounded-2xl border border-heading/10 p-6 cursor-not-allowed"
                      >
                        {body}
                      </div>
                    )
                  })}

                  {(() => {
                    const body = (
                      <>
                        <div className="flex items-start gap-4">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-[#1c1c1a]"
                            style={{ backgroundColor: tier.color }}
                          >
                            {examPassed ? <Check className="h-4 w-4" /> : '★'}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-semibold text-heading">{tier.name} tier exam</p>
                              <StatusTag completed={examPassed} unlocked={examUnlocked} />
                            </div>
                            <p className="text-sm text-body-text">
                              {examUnlocked
                                ? `${questions.length} questions on real data · ${points} points · pass at ${tier.examPassPercent}%`
                                : `Finish all ${tierItems.length} lessons in this tier to unlock the exam.`}
                            </p>
                          </div>
                        </div>
                        {examUnlocked ? (
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-heading text-cream shrink-0 group-hover:bg-heading/90 transition-colors">
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        ) : (
                          <Lock className="h-4 w-4 text-placeholder shrink-0" />
                        )}
                      </>
                    )

                    return examUnlocked ? (
                      <Link
                        to={`/learn/sql/exam/${tier.id}`}
                        className="group flex items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-heading/15 bg-surface p-6 hover:border-heading/30 transition-colors"
                      >
                        {body}
                      </Link>
                    ) : (
                      <div
                        aria-disabled="true"
                        className="flex items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-heading/10 bg-surface p-6 cursor-not-allowed"
                      >
                        {body}
                      </div>
                    )
                  })()}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default SqlMainPage
