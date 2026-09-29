import { Link } from 'react-router-dom'
import { gitExamId, gitLessons, gitSections, gitTierLessons, gitTiers } from '../../data/git/index.js'
import { gitExams } from '../../data/git/exams/index.js'
import { isExamUnlocked, isLessonUnlocked, isTierUnlocked } from '../../lib/gitAccess'
import { useCompletedLessons } from '../../lib/useCompletedLessons'
import { ArrowLeft, ArrowRight, Check, ChevronDown, GitBranch, Lock } from '../../components/icons'

const pad = (n) => String(n).padStart(2, '0')

function StatusTag({ completed, unlocked }) {
  if (completed) return <span className="text-[10px] font-semibold tracking-widest text-correct uppercase">Completed</span>
  if (unlocked) return <span className="text-[10px] font-semibold tracking-widest text-accent-dark uppercase">Available</span>
  return <span className="text-[10px] font-semibold tracking-widest text-body-text bg-cream rounded-full px-2 py-0.5 uppercase">Locked</span>
}

const kindLabel = { learn: 'Learn-heavy', read: 'Reading', code: 'Practice' }

function LessonRow({ lesson, completed, unlocked }) {
  const body = (
    <>
      <div className="flex items-start gap-4 min-w-0">
        {completed ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-correct/10 text-correct mt-0.5 shrink-0">
            <Check className="h-3.5 w-3.5" />
          </span>
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-heading/15 text-body-text text-[10px] font-medium mt-0.5 shrink-0">
            {pad(lesson.numberInTier)}
          </span>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="font-semibold text-heading">{lesson.title}</p>
            <StatusTag completed={completed} unlocked={unlocked} />
          </div>
          <p className="text-sm text-body-text">
            {unlocked ? lesson.blurb : 'Complete the earlier lessons to unlock this one.'}
            <span className="text-caption"> · {kindLabel[lesson.kind]}</span>
          </p>
        </div>
      </div>
      {unlocked ? (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-heading text-cream shrink-0 group-hover:bg-heading/90 transition-colors">
          <ArrowRight className="h-4 w-4" />
        </span>
      ) : (
        <Lock className="h-4 w-4 text-placeholder shrink-0" />
      )}
    </>
  )

  return unlocked ? (
    <Link
      to={`/learn/git/${lesson.id}`}
      className="group flex items-center justify-between gap-4 bg-surface rounded-xl border border-heading/10 px-5 py-4 hover:border-heading/20 transition-colors"
    >
      {body}
    </Link>
  ) : (
    <div aria-disabled="true" className="flex items-center justify-between gap-4 bg-surface rounded-xl border border-heading/10 px-5 py-4 cursor-not-allowed">
      {body}
    </div>
  )
}

function ExamRow({ tier, completedIds }) {
  const questions = gitExams[tier.id] ?? []
  const points = questions.reduce((sum, q) => sum + q.points, 0)
  const unlocked = isExamUnlocked(tier.id, completedIds) && questions.length > 0
  const passed = completedIds.has(gitExamId(tier.id))
  const lessonCount = gitTierLessons(tier.id).length

  const body = (
    <>
      <div className="flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-[#1c1c1a]" style={{ backgroundColor: tier.color }}>
          {passed ? <Check className="h-4 w-4" /> : '★'}
        </span>
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-semibold text-heading">{tier.name} tier exam</p>
            <StatusTag completed={passed} unlocked={unlocked} />
          </div>
          <p className="text-sm text-body-text">
            {questions.length === 0
              ? 'The exam for this tier is being written.'
              : unlocked
                ? `${questions.length} questions · ${points} points · pass at ${tier.examPassPercent}%`
                : `Finish all ${lessonCount} lessons in this tier to unlock the exam.`}
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
      to={`/learn/git/exam/${tier.id}`}
      className="group flex items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-heading/15 bg-surface p-6 hover:border-heading/30 transition-colors"
    >
      {body}
    </Link>
  ) : (
    <div aria-disabled="true" className="flex items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-heading/10 bg-surface p-6 cursor-not-allowed">
      {body}
    </div>
  )
}

function GitPath() {
  const { completedIds } = useCompletedLessons()
  const doneCount = gitLessons.filter((l) => completedIds.has(l.id)).length

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
        <div className="relative max-w-4xl mx-auto px-8 pt-16 pb-16">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-heading bg-surface border border-heading/10 px-3 py-1.5 rounded-full mb-8 shadow-sm">
            <GitBranch className="h-3.5 w-3.5 text-primary-accent" />
            Git
          </span>

          <h1 className="font-display font-semibold text-5xl md:text-6xl leading-[1.05] mb-6">
            <span className="text-heading/60">Learn Git</span>
            <br />
            <span className="text-primary-accent">by actually using it.</span>
          </h1>

          <p className="text-body-text max-w-lg leading-relaxed mb-6">
            Real git commands, run against real repositories, right in your browser — init, add, commit, undo mistakes,
            and eventually branch, merge and collaborate. No terminal to install, nothing to break for real.
          </p>

          <p className="text-sm text-body-text">
            <span className="font-semibold text-heading">{doneCount}</span> of {gitLessons.length} available lessons complete
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-8 pb-24">
        <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-3">Your curriculum</p>
        <h2 className="font-display font-semibold text-3xl md:text-4xl text-heading mb-2">Four tiers, from your first commit to real workflows.</h2>
        <p className="text-body-text mb-10">
          Git Foundations is open from the start, so you can begin right away. Finish all of a tier's lessons to unlock
          its exam, and pass the exam to open the next tier.
        </p>

        <div className="flex flex-col gap-14">
          {gitTiers.map((tier) => {
            if (tier.soon) {
              return (
                <div key={tier.id} id={tier.id} className="rounded-2xl p-6 opacity-80" style={{ backgroundColor: tier.color }}>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#57534e]">Tier {tier.number} · Coming soon</p>
                  <h3 className="font-display text-2xl font-semibold text-[#1c1c1a]">{tier.name}</h3>
                  <p className="mt-1 text-sm text-[#3f3b37]">{tier.tagline}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-[#57534e]">
                    <Lock className="h-3.5 w-3.5" /> {tier.audience}
                  </p>
                </div>
              )
            }

            const tierItems = gitTierLessons(tier.id)
            const done = tierItems.filter((l) => completedIds.has(l.id)).length
            const percent = tierItems.length ? Math.round((done / tierItems.length) * 100) : 0
            const tierSections = gitSections.filter((s) => s.tier === tier.id)
            const tierUnlocked = isTierUnlocked(tier.id, completedIds)
            const tierStartOpen = !(tierItems.length > 0 && done === tierItems.length)

            return (
              <details key={tier.id} id={tier.id} open={tierStartOpen} className="group">
                <summary className="mb-5 flex cursor-pointer list-none rounded-2xl p-6 [&::-webkit-details-marker]:hidden" style={{ backgroundColor: tier.color }}>
                  <div className="flex w-full flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#57534e]">
                        Tier {tier.number}
                        {tier.entry ? ' · Open from the start' : ''}
                      </p>
                      <h3 className="font-display text-3xl font-semibold text-[#1c1c1a]">{tier.name}</h3>
                      <p className="mt-1 text-sm text-[#3f3b37]">{tier.tagline}</p>
                      <p className="mt-3 text-xs text-[#57534e]">{tier.audience}</p>
                    </div>
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                      <div className="flex-1 sm:w-48">
                        <p className="mb-1.5 text-xs font-semibold text-[#1c1c1a]">
                          {done} / {tierItems.length} lessons
                        </p>
                        <div className="h-2 overflow-hidden rounded-full bg-white/60">
                          <div className="h-full rounded-full bg-[#1c1c1a]" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                      <ChevronDown className="h-5 w-5 shrink-0 text-[#57534e] transition-transform duration-200 group-open:rotate-180" />
                    </div>
                  </div>
                </summary>

                <div className="flex flex-col gap-5">
                  {tierSections.length === 0 && (
                    <p className="rounded-2xl border border-heading/10 bg-surface p-6 text-sm text-body-text">
                      The lessons for this tier are being written. Check back soon.
                    </p>
                  )}

                  {tierSections.map((section) => {
                    const sectionDone = section.lessons.filter((l) => completedIds.has(l.id)).length
                    const startOpen = section.lessons.some((l) => isLessonUnlocked(l.id, completedIds) && !completedIds.has(l.id))
                    return (
                      <details key={section.id} open={startOpen} className="group rounded-2xl border border-heading/10 bg-cream/50">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 [&::-webkit-details-marker]:hidden">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs font-semibold text-caption">{section.number}</p>
                              <p className="font-display text-lg font-semibold text-heading">{section.title}</p>
                              {section.open && tierUnlocked && (
                                <span className="rounded-full bg-badge px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent-dark">
                                  Start directly
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-sm text-body-text">{section.intro}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <p className="text-xs font-semibold text-body-text">
                              {sectionDone} / {section.lessons.length}
                            </p>
                            <ChevronDown className="h-4 w-4 text-body-text transition-transform duration-200 group-open:rotate-180" />
                          </div>
                        </summary>
                        <div className="flex flex-col gap-3 px-3 pb-3">
                          {section.lessons.map((lesson) => (
                            <LessonRow
                              key={lesson.id}
                              lesson={gitLessons.find((l) => l.id === lesson.id)}
                              completed={completedIds.has(lesson.id)}
                              unlocked={isLessonUnlocked(lesson.id, completedIds)}
                            />
                          ))}
                        </div>
                      </details>
                    )
                  })}

                  <ExamRow tier={tier} completedIds={completedIds} />
                </div>
              </details>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default GitPath
