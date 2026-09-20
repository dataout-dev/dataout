import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowUpRight,
  Play,
  CodeIcon,
  Database,
  GitBranch,
  ExternalLink,
  Users,
  Prompt,
  Share,
} from '../components/icons'

const pillars = [
  {
    n: '01',
    title: 'Learn by building',
    desc: 'Short lessons, real datasets, and projects that look like the work.',
  },
  {
    n: '02',
    title: 'Understand the why',
    desc: 'Build the mental models that make tools easier to pick up and use well.',
  },
  {
    n: '03',
    title: 'Ship with confidence',
    desc: 'Go from notebook to dependable systems with production-minded guidance.',
  },
]

function Home() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-8 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-heading bg-surface border border-heading/10 px-3 py-1.5 rounded-full mb-7 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary-accent" />
              A better way to learn data
            </span>

            <h1 className="font-display font-semibold text-5xl md:text-6xl text-heading leading-[1.05] mb-6">
              Learn to build.<br />
              <span className="text-primary-accent">Ship what matters.</span>
            </h1>

            <p className="text-body-text mb-9 max-w-md leading-relaxed">
              A mapped, hands-on path through SQL, Python, and data engineering —
              with SQL available now and the rest coming soon. Built by someone
              shipping data pipelines in production, not just teaching from tutorials.
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-12">
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 bg-heading text-cream text-sm font-semibold px-5 py-3.5 rounded-xl hover:bg-heading/90 transition-colors"
              >
                Start learning
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/learn" className="inline-flex items-center gap-2.5 text-sm font-medium text-heading">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-heading/15">
                  <Play className="h-3 w-3 ml-0.5" />
                </span>
                See the path
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex avatar-stack">
                <span className="h-8 w-8 rounded-full bg-[#e8735a] flex items-center justify-center text-white text-xs font-semibold">A</span>
                <span className="h-8 w-8 rounded-full bg-[#4caf82] flex items-center justify-center text-white text-xs font-semibold">M</span>
                <span className="h-8 w-8 rounded-full bg-[#5b9bd5] flex items-center justify-center text-white text-xs font-semibold">R</span>
              </div>
              <span className="text-sm text-caption">Early access</span>
            </div>
          </div>

          <div className="relative">
            <div className="hidden sm:flex absolute -top-4 -right-3 z-20 items-center gap-1.5 bg-surface border border-heading/10 rounded-full pl-2.5 pr-3.5 py-1.5 shadow-sm text-xs font-display italic text-heading">
              <Prompt className="h-3.5 w-3.5 text-primary-accent" />
              hands-on only
            </div>

            <div className="absolute -bottom-3 left-3 right-3 h-12 bg-surface/70 border border-heading/10 rounded-2xl" />

            <div className="relative z-10 bg-surface rounded-2xl border border-heading/10 shadow-sm p-6">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium tracking-wide text-caption">YOUR LEARNING PATH</p>
                <span className="text-xs text-caption bg-cream border border-heading/10 rounded-full px-3 py-1">3 stages</span>
              </div>
              <p className="text-sm font-medium text-heading mb-5">From first query to production</p>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#f4e2d0] rounded-xl p-3.5 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface/70 text-heading">
                      <CodeIcon className="h-4 w-4" />
                    </span>
                    <span className="text-[9px] font-medium tracking-wide text-caption bg-surface/70 rounded-full px-2 py-0.5">SOON</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1c1c1a] mb-0.5">Python</p>
                  <p className="text-[11px] text-[#a8a29e]">Coming soon</p>
                </div>

                <Link to="/learn/sql" className="bg-[#cfe3f5] rounded-xl p-3.5 flex flex-col hover:brightness-[0.98] transition">
                  <div className="flex items-start justify-between mb-6">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface/70 text-heading">
                      <Database className="h-4 w-4" />
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-[#1c1c1a]/70" />
                  </div>
                  <p className="text-sm font-semibold text-[#1c1c1a] mb-0.5">SQL</p>
                  <p className="text-[11px] text-[#c2410c] font-medium">Available now</p>
                </Link>

                <div className="bg-[#dcead9] rounded-xl p-3.5 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface/70 text-heading">
                      <GitBranch className="h-4 w-4" />
                    </span>
                    <span className="text-[9px] font-medium tracking-wide text-caption bg-surface/70 rounded-full px-2 py-0.5">SOON</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1c1c1a] mb-0.5">Data engineering</p>
                  <p className="text-[11px] text-[#a8a29e]">Coming soon</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between bg-cream rounded-xl px-4 py-3.5 text-sm text-body-text">
                <span>Build your sql foundation</span>
                <ArrowUpRight className="h-4 w-4 text-heading" />
              </div>
            </div>

            <div className="absolute -bottom-4 left-6 z-20 flex items-center gap-1.5 bg-surface border border-heading/10 rounded-full pl-2.5 pr-3.5 py-1.5 shadow-sm text-xs font-display italic text-heading">
              <Share className="h-3.5 w-3.5 text-primary-accent" />
              learn in public
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <div className="border-y border-heading/10 bg-heading/[0.02]">
        <div className="max-w-6xl mx-auto px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface border border-heading/10 text-heading">
              <Users className="h-4 w-4" />
            </span>
            <p className="text-sm text-heading">A place for people who want to go deeper.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-caption">
            <span>Real projects</span>
            <span>Clear thinking</span>
            <span>Helpful community</span>
            <span>Zero fluff</span>
          </div>
        </div>
      </div>

      {/* Coming soon */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="flex items-start justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold text-primary-accent tracking-widest uppercase mb-4">Coming soon</p>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-heading leading-tight max-w-2xl">
              The practical data education you wish existed.
            </h2>
          </div>
          <Link to="/signup" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-heading whitespace-nowrap mt-2">
            Get early access
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="border-t border-heading/10 grid md:grid-cols-3 md:divide-x divide-heading/10">
          {pillars.map((p) => (
            <div key={p.n} className="pt-8 md:px-8 first:md:pl-0 last:md:pr-0">
              <p className="text-sm text-primary-accent mb-4">{p.n}</p>
              <p className="text-base font-semibold text-heading mb-2">{p.title}</p>
              <p className="text-sm text-body-text leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-heading/10">
        <div className="max-w-6xl mx-auto px-8 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-heading text-cream text-[10px] font-semibold font-display">do</span>
            <span className="font-display font-semibold text-heading">DataOut</span>
          </div>
          <p className="text-xs text-caption">© 2026 DataOut. Built for the curious.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
