import { Link } from 'react-router-dom'
import { exerciseSubjects } from '../data/exerciseSubjects'
import { trackColors } from '../data/trackColors'
import { dayNumber, formatCountdown, msUntilNextExercise, todaysExercise } from '../lib/exercises'
import { loadExerciseProgress } from '../lib/exerciseProgress'
import { ArrowRight, Check, CodeIcon, Database, GitBranch, Lock, Sparkles } from '../components/icons'

const subjectIcons = {
  sql: Database,
  python: CodeIcon,
  de: GitBranch,
}

function ExerciseHome() {
  const now = new Date()

  return (
    <div className="bg-cream">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-8 pb-16 pt-20">
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-heading/10 bg-surface px-3 py-1.5 text-xs font-medium text-heading shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary-accent" />
            Daily exercise
          </span>
          <h1 className="mb-6 font-display text-5xl font-semibold leading-[1.05] text-heading md:text-6xl">
            One real question<br />
            <span className="text-primary-accent">every day.</span>
          </h1>
          <p className="max-w-lg leading-relaxed text-body-text">
            Lessons teach you a concept. Exercises test you on the job: a plain-English request, real data and no
            hints. Solve today’s, then come back tomorrow.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-8 pb-24">
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-accent">Today’s exercises</p>
          <h2 className="font-display text-3xl font-semibold text-heading">Pick a subject.</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {exerciseSubjects.map((subject) => {
            const Icon = subjectIcons[subject.id]
            const today = subject.available ? todaysExercise(subject.id, now) : null
            const solved = today ? loadExerciseProgress(today.id).solved : false

            const inner = (
              <>
                <div className="mb-10 flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-[#1c1c1a]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#57534e]">
                    {subject.available ? (solved ? 'SOLVED' : 'NEW TODAY') : 'SOON'}
                  </span>
                </div>
                <p className="mb-1.5 text-lg font-semibold text-[#1c1c1a]">{subject.name}</p>
                <p className="mb-5 text-sm leading-relaxed text-[#57534e]">
                  {today ? (
                    <>
                      <span className="font-semibold text-[#1c1c1a]">Day {dayNumber(now) + 1}:</span> {today.title}
                    </>
                  ) : (
                    subject.description
                  )}
                </p>
                {subject.available ? (
                  <span className="mt-auto flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-xs text-[#57534e]">
                      {solved ? (
                        <>
                          <Check className="h-4 w-4 text-[#1c1c1a]" /> Next in {formatCountdown(msUntilNextExercise(now))}
                        </>
                      ) : (
                        today && <span className="capitalize">{today.difficulty}</span>
                      )}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#1c1c1a]">
                      {solved ? 'Review' : 'Start'} <ArrowRight className="h-4 w-4" />
                    </span>
                  </span>
                ) : (
                  <span className="mt-auto flex items-center gap-1.5 text-sm text-[#57534e]">
                    <Lock className="h-3.5 w-3.5" /> In the works
                  </span>
                )}
              </>
            )

            return subject.available ? (
              <Link
                key={subject.id}
                to={subject.path}
                className={`flex min-h-[240px] flex-col rounded-2xl p-6 transition hover:brightness-[0.98] ${trackColors[subject.id]}`}
              >
                {inner}
              </Link>
            ) : (
              <div
                key={subject.id}
                className={`flex min-h-[240px] cursor-not-allowed flex-col rounded-2xl p-6 ${trackColors[subject.id]}`}
              >
                {inner}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default ExerciseHome
