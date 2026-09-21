import { Link } from 'react-router-dom'
import { playgrounds } from '../data/playgrounds'
import { ArrowRight, CodeIcon, Database, Lock, Sparkles } from '../components/icons'

const playgroundIcons = {
  sql: Database,
  python: CodeIcon,
}

function PlaygroundHome() {
  return (
    <div className="bg-cream">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-8 pb-16 pt-20">
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-heading/10 bg-surface px-3 py-1.5 text-xs font-medium text-heading shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary-accent" />
            Playgrounds
          </span>
          <h1 className="mb-6 font-display text-5xl font-semibold leading-[1.05] text-heading md:text-6xl">
            Practice with<br />
            <span className="text-primary-accent">real data.</span>
          </h1>
          <p className="max-w-lg leading-relaxed text-body-text">
            Open a notebook, load a dataset or bring your own file, and try things out. Nothing to install, and
            everything runs in your browser.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-8 pb-24">
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-accent">Playgrounds</p>
          <h2 className="font-display text-3xl font-semibold text-heading">Pick a place to experiment.</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {playgrounds.map((playground) => {
            const Icon = playgroundIcons[playground.id]
            const inner = (
              <>
                <div className="mb-10 flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-heading/10 text-heading">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-heading/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-body-text">
                    {playground.available ? 'AVAILABLE' : 'SOON'}
                  </span>
                </div>
                <p className="mb-1.5 text-lg font-semibold text-heading">{playground.name} playground</p>
                <p className="mb-5 text-sm leading-relaxed text-body-text">{playground.description}</p>
                {playground.available ? (
                  <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-heading">
                    Open notebook <ArrowRight className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="mt-auto flex items-center gap-1.5 text-sm text-body-text">
                    <Lock className="h-3.5 w-3.5" /> In the works
                  </span>
                )}
              </>
            )

            return playground.available ? (
              <Link
                key={playground.id}
                to={playground.path}
                className="flex min-h-[240px] flex-col rounded-2xl border border-heading/10 bg-surface p-6 transition-colors hover:border-heading/25"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={playground.id}
                className="flex min-h-[240px] cursor-not-allowed flex-col rounded-2xl border border-heading/10 bg-surface p-6"
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

export default PlaygroundHome
