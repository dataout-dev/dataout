import { Link } from 'react-router-dom'
import { edaLessons, edaGuidedProjects, edaUnguidedProjects } from '../../data/eda/index.js'
import { allLessonsDone, isLessonUnlocked } from '../../lib/edaAccess'
import { useCompletedLessons } from '../../lib/useCompletedLessons'
import { useSubscription } from '../../lib/useSubscription'
import { isPremiumKeyLocked, isPremiumKey, edaProjectKey } from '../../lib/premiumAccess'
import PremiumBadge from '../../components/PremiumBadge'
import { ArrowLeft, ArrowRight, Check, Eye, Lock } from '../../components/icons'

const pad = (n) => String(n).padStart(2, '0')

function StatusTag({ completed, unlocked }) {
  if (completed) return <span className="text-[10px] font-semibold tracking-widest text-correct uppercase">Completed</span>
  if (unlocked) return <span className="text-[10px] font-semibold tracking-widest text-accent-dark uppercase">Available</span>
  return <span className="text-[10px] font-semibold tracking-widest text-body-text bg-cream rounded-full px-2 py-0.5 uppercase">Locked</span>
}

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
            {pad(lesson.number)}
          </span>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="font-semibold text-heading">{lesson.title}</p>
            <StatusTag completed={completed} unlocked={unlocked} />
          </div>
          <p className="text-sm text-body-text">{unlocked ? lesson.blurb : 'Complete the earlier lessons to unlock this one.'}</p>
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
    <Link to={`/learn/eda/${lesson.id}`} className="group flex items-center justify-between gap-4 bg-surface rounded-xl border border-heading/10 px-5 py-4 hover:border-heading/20 transition-colors">
      {body}
    </Link>
  ) : (
    <div aria-disabled="true" className="flex items-center justify-between gap-4 bg-surface rounded-xl border border-heading/10 px-5 py-4 cursor-not-allowed">
      {body}
    </div>
  )
}

function ProjectCard({ project, completed, unlocked, premiumLocked, isPremium }) {
  const body = (
    <>
      <div className="flex items-center gap-2 flex-wrap mb-1.5">
        <p className="font-semibold text-heading">{project.title}</p>
        {isPremium && <PremiumBadge />}
        <StatusTag completed={completed} unlocked={unlocked} />
      </div>
      <p className="text-sm text-body-text mb-3">{unlocked ? project.tagline : premiumLocked ? 'Subscribers only.' : 'Finish all 5 lessons to unlock the projects.'}</p>
      <p className="text-xs text-caption">{project.blurb}</p>
    </>
  )

  const className = 'block bg-surface rounded-2xl border border-heading/10 p-5 transition-colors hover:border-heading/20'

  if (unlocked) return <Link to={`/learn/eda/project/${project.id}`} className={className}>{body}</Link>
  if (premiumLocked) return <Link to="/subscribe" className={className}>{body}</Link>
  return <div aria-disabled="true" className={`${className} cursor-not-allowed opacity-80`}>{body}</div>
}

function ProjectSection({ title, description, projects, completedIds, lessonsDone, subscriptionActive }) {
  return (
    <div>
      <h3 className="font-display font-semibold text-2xl text-heading mb-2">{title}</h3>
      <p className="text-body-text mb-5">{description}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => {
          const completed = completedIds.has(project.id)
          const premiumLocked = lessonsDone && !completed && isPremiumKeyLocked(edaProjectKey(project.id), subscriptionActive)
          const unlocked = subscriptionActive || (lessonsDone && !premiumLocked)
          return (
            <ProjectCard
              key={project.id}
              project={project}
              completed={completed}
              unlocked={unlocked}
              premiumLocked={premiumLocked}
              isPremium={isPremiumKey(edaProjectKey(project.id))}
            />
          )
        })}
      </div>
    </div>
  )
}

function EdaPath() {
  const { completedIds } = useCompletedLessons()
  const subscription = useSubscription()
  const lessonsDone = allLessonsDone(completedIds)
  const doneLessonCount = edaLessons.filter((l) => completedIds.has(l.id)).length

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
            <Eye className="h-3.5 w-3.5 text-primary-accent" />
            Exploratory Data Analysis
          </span>

          <h1 className="font-display font-semibold text-5xl md:text-6xl leading-[1.05] mb-6">
            <span className="text-heading/60">Open a dataset</span>
            <br />
            <span className="text-primary-accent">you've never seen before.</span>
          </h1>

          <p className="text-body-text max-w-lg leading-relaxed mb-6">
            5 short lessons on the workflow, then straight into 8 real, deliberately messy datasets — 4 with
            step-by-step guidance, 4 fully open. You mark your own projects complete, with an optional way to check a
            few key numbers against ours.
          </p>

          <p className="text-sm text-body-text">
            <span className="font-semibold text-heading">{doneLessonCount}</span> of {edaLessons.length} lessons complete
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-8 pb-12">
        <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-3">Start here</p>
        <h2 className="font-display font-semibold text-3xl text-heading mb-6">The workflow, in 5 lessons.</h2>
        <div className="flex flex-col gap-3">
          {edaLessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              completed={completedIds.has(lesson.id)}
              unlocked={subscription.isActive || isLessonUnlocked(lesson.id, completedIds)}
            />
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-8 pb-24 flex flex-col gap-14">
        <ProjectSection
          title="Guided projects"
          description="Numbered steps to follow, on real data — not auto-graded, just structured guidance. Mark each one complete yourself."
          projects={edaGuidedProjects}
          completedIds={completedIds}
          lessonsDone={lessonsDone}
          subscriptionActive={subscription.isActive}
        />
        <ProjectSection
          title="Unguided projects"
          description="An open brief and a few starting questions. Pick your own angle, investigate in a notebook, and write up what you found."
          projects={edaUnguidedProjects}
          completedIds={completedIds}
          lessonsDone={lessonsDone}
          subscriptionActive={subscription.isActive}
        />
      </section>
    </div>
  )
}

export default EdaPath
