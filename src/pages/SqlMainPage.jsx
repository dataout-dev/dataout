import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { useCompletedLessons } from '../lib/useCompletedLessons'
import { isLessonUnlocked } from '../lib/lessonAccess'
import { sqlPlayground } from '../data/playgrounds'
import { ArrowLeft, ArrowRight, Database, Check, Lock, Terminal } from '../components/icons'

const upcomingTopics = [
  {
    title: 'Selecting and sorting data',
    desc: 'Choose columns and organize results with ORDER BY.',
  },
]

function SqlMainPage() {
  const sqlLessons = lessons.filter((l) => l.subject === 'sql')
  const { completedIds } = useCompletedLessons()
  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className="bg-cream">
      <div className="border-b border-heading/10">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-caption hover:text-heading transition-colors">
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
              <span className="text-heading/50">Learn SQL</span>
              <br />
              <span className="text-primary-accent/50">by querying.</span>
            </h1>

            <p className="text-body-text max-w-lg leading-relaxed">
              A practical path from your first SELECT to answering the questions teams ask.
            </p>
          </div>

          <Link
            to={sqlPlayground.path}
            className="group rounded-2xl border border-heading/10 bg-surface p-6 shadow-sm transition-colors hover:border-heading/25"
          >
            <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-heading/10 text-heading">
              <Terminal className="h-5 w-5" />
            </span>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary-accent">SQL playground</p>
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
        <p className="text-xs font-semibold text-primary-accent tracking-widest uppercase mb-3">Your curriculum</p>
        <h2 className="font-display font-semibold text-3xl md:text-4xl text-heading mb-2">Start with the fundamentals.</h2>
        <p className="text-body-text mb-8">Short lessons, real tables, and a query editor to practice as you go.</p>

        <div className="flex flex-col gap-4">
          {sqlLessons.map((lesson, i) => {
            const completed = completedIds.has(lesson.id)
            const unlocked = isLessonUnlocked(sqlLessons, i, completedIds)

            const body = (
              <>
                <div className="flex items-start gap-4">
                  {completed ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-correct/10 text-correct mt-1 shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-heading/15 text-caption text-[10px] font-medium mt-1 shrink-0">
                      {pad(i + 1)}
                    </span>
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-heading">
                        {lesson.title} {lesson.titleAccent}
                      </p>
                      {completed ? (
                        <span className="text-[10px] font-semibold tracking-widest text-correct uppercase">Completed</span>
                      ) : unlocked ? (
                        <span className="text-[10px] font-semibold tracking-widest text-primary-accent uppercase">Available</span>
                      ) : (
                        <span className="text-[10px] font-semibold tracking-widest text-caption bg-cream rounded-full px-2 py-0.5 uppercase">Locked</span>
                      )}
                    </div>
                    <p className="text-sm text-body-text">
                      {unlocked ? lesson.blurb : 'Complete the previous lesson to unlock this one.'}
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

          {upcomingTopics.map((topic, i) => (
            <div
              key={topic.title}
              className="flex items-center justify-between gap-4 bg-surface rounded-2xl border border-heading/10 p-6 cursor-not-allowed"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream text-heading text-sm font-medium shrink-0">
                  {pad(sqlLessons.length + i + 1)}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-heading">{topic.title}</p>
                    <span className="text-[10px] font-semibold tracking-widest text-caption bg-cream rounded-full px-2 py-0.5 uppercase">
                      Coming soon
                    </span>
                  </div>
                  <p className="text-sm text-body-text">{topic.desc}</p>
                </div>
              </div>
              <Lock className="h-4 w-4 text-placeholder shrink-0" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default SqlMainPage
