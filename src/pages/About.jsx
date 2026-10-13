import { Link } from 'react-router-dom'
import { ArrowLeft, Lightbulb, Database, CodeIcon, GitBranch, BarChart, Eye, Award, Check } from '../components/icons'

const paths = [
  { name: 'SQL', desc: 'Ask better questions of data, one query at a time.', icon: Database },
  { name: 'Python', desc: 'From the first line to real data work, with lessons you can run.', icon: CodeIcon },
  { name: 'Git', desc: 'Real commands, run against real repositories, in your browser.', icon: GitBranch },
  { name: 'Statistics', desc: 'Build intuition by watching distributions and p-values move.', icon: BarChart },
  { name: 'Exploratory Data Analysis', desc: '8 real, messy datasets — 4 guided, 4 open — to practice on.', icon: Eye },
  { name: 'Predictive Modeling', desc: 'The same datasets, now with a target: split, fit, evaluate honestly.', icon: Award },
]

const principles = [
  { title: 'Learn by building', desc: 'Short lessons, real datasets, and projects that look like the work.' },
  { title: 'Understand the why', desc: 'Build the mental models that make tools easier to pick up and use well.' },
  { title: 'Ship with confidence', desc: 'Go from notebook to dependable systems with production-minded guidance.' },
]

function About() {
  return (
    <div className="bg-cream min-h-screen">
      <section className="relative overflow-hidden border-b border-heading/10">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-8 pt-10 pb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-caption hover:text-heading transition-colors mb-10">
            <ArrowLeft className="h-4 w-4" /> Back to DataOut
          </Link>

          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-3">About</p>
              <h1 className="font-display font-semibold text-4xl md:text-5xl text-heading leading-[1.1] mb-3">
                The practical data education we wished existed.
              </h1>
              <p className="text-body-text max-w-md">
                DataOut teaches data skills the way they're actually used: real datasets, real tools, and projects
                that look like the work instead of toy exercises.
              </p>
            </div>
            <span className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-badge text-accent-dark shrink-0">
              <Lightbulb className="h-6 w-6" />
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-8 py-14 flex flex-col gap-12">
        <div className="flex flex-col gap-4 text-body-text leading-relaxed">
          <p>
            Most data courses teach syntax in isolation and call it a day. DataOut is built around the opposite bet:
            that you learn a tool fastest by using it on something real, with a clear reason to care about the
            answer. Every lesson runs live in your browser, and every project uses a dataset with real messiness —
            missing values, inconsistent categories, and the kind of surprises you'd actually hit on the job.
          </p>
          <p>
            There's no auto-grader deciding whether you're "done." Guided projects walk you through a workflow;
            unguided ones hand you a dataset and a goal. You mark your own work complete, and if you want a second
            opinion, an optional check is there — never required.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-4">How we think about it</p>
          <div className="border-t border-heading/10 grid md:grid-cols-3 md:divide-x divide-heading/10">
            {principles.map((p) => (
              <div key={p.title} className="pt-6 md:px-8 first:md:pl-0 last:md:pr-0">
                <p className="text-base font-semibold text-heading mb-2">{p.title}</p>
                <p className="text-sm text-body-text leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-4">What's on DataOut today</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {paths.map((p) => (
              <div key={p.name} className="rounded-2xl border border-heading/10 bg-surface p-5 flex items-start gap-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-heading/5 text-heading shrink-0">
                  <p.icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-heading mb-1">{p.name}</p>
                  <p className="text-sm text-body-text leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-heading/10 bg-surface p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-correct/10 text-correct shrink-0 mt-0.5">
              <Check className="h-3 w-3" />
            </span>
            <p className="text-sm text-body-text">
              Have a question, a bug to report, or an idea for what we should build next?
            </p>
          </div>
          <Link
            to="/contact"
            className="text-sm font-semibold px-4 py-2.5 rounded-lg bg-heading text-cream hover:bg-heading/90 transition-colors whitespace-nowrap"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About
