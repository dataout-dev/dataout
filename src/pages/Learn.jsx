import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { trackColors } from '../data/trackColors'
import { Sparkles, Database, CodeIcon, GitBranch, Check, ArrowRight } from '../components/icons'

const trackIcons = {
  sql: Database,
  python: CodeIcon,
  de: GitBranch,
}

function Learn() {
  const subjects = [
    {
      id: 'sql',
      name: 'SQL',
      available: true,
      color: trackColors.sql,
      desc: 'Learn to ask better questions of data, one query at a time.',
      lessonCount: lessons.filter((l) => l.subject === 'sql').length,
    },
    {
      id: 'python',
      name: 'Python',
      available: false,
      color: trackColors.python,
      desc: 'Use Python to clean, explore, and automate your data work.',
    },
    {
      id: 'de',
      name: 'Data engineering',
      available: false,
      color: trackColors.de,
      desc: 'Build reliable pipelines that move data from source to insight.',
    },
  ]

  return (
    <div className="bg-cream">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-8 pt-20 pb-16">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-heading bg-surface border border-heading/10 px-3 py-1.5 rounded-full mb-7 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary-accent" />
            Choose your path
          </span>
          <h1 className="font-display font-semibold text-5xl md:text-6xl text-heading leading-[1.05] mb-6">
            Learn data<br />
            <span className="text-primary-accent">by doing.</span>
          </h1>
          <p className="text-body-text max-w-lg leading-relaxed">
            Start with the skill you need today. Follow a mapped, hands-on path built
            for people who want to understand the tools they use, not just copy the syntax.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-semibold text-primary-accent tracking-widest uppercase mb-3">Learning tracks</p>
            <h2 className="font-display font-semibold text-3xl text-heading">Pick a place to start.</h2>
          </div>
          <p className="hidden sm:block text-sm text-caption whitespace-nowrap mb-1">One skill at a time.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {subjects.map((subject) => {
            const Icon = trackIcons[subject.id]
            const content = (
              <>
                <div className="flex items-start justify-between mb-10">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-[#1c1c1a]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-semibold tracking-wide text-[#57534e] bg-white/70 rounded-full px-2.5 py-1">
                    {subject.available ? 'AVAILABLE' : 'SOON'}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#1c1c1a] mb-1.5">{subject.name}</p>
                  <p className="text-sm text-[#57534e] mb-5">{subject.desc}</p>
                  {subject.available ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-[#a8360a] font-medium">
                        <Check className="h-4 w-4" /> {subject.lessonCount} lesson{subject.lessonCount === 1 ? '' : 's'}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[#1c1c1a]">
                        Explore <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-[#57534e]">In the works</p>
                  )}
                </div>
              </>
            )

            return subject.available ? (
              <Link
                key={subject.id}
                to={`/learn/${subject.id}`}
                className={`group flex flex-col justify-between rounded-2xl p-6 min-h-[220px] hover:brightness-[0.98] transition ${subject.color}`}
              >
                {content}
              </Link>
            ) : (
              <div
                key={subject.id}
                className={`flex flex-col justify-between rounded-2xl p-6 min-h-[220px] cursor-not-allowed ${subject.color}`}
              >
                {content}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Learn
