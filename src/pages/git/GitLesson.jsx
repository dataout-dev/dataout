import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { gitLessonById, gitSections, gitTierById, gitTierLessons } from '../../data/git/index.js'
import { isLessonUnlocked, nextLessonAfter } from '../../lib/gitAccess'
import { loadGitDoc } from '../../lib/gitDocs'
import { useGitChallenge } from '../../lib/useGitChallenge'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../supabaseClient'
import { useCompletedLessons } from '../../lib/useCompletedLessons'
import Markdown from '../../components/Markdown'
import ConceptCheck from '../../components/python/ConceptCheck'
import { GitFeedback, GitWalkthrough, GitWorkbench } from '../../components/git/GitWorkbench'
import { ArrowLeft, ArrowRight, GitBranch, Lightbulb } from '../../components/icons'

const pad = (n) => String(n).padStart(2, '0')

const practiceProgressId = (lessonId) => `git-practice:${lessonId}`

function LessonHeading({ tier, lesson, section, large = false }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl text-[#1c1c1a]" style={{ backgroundColor: tier.color }}>
          <GitBranch className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-accent-dark">
            Git · {tier.name} / Lesson {pad(lesson.number)}
          </p>
          <p className="text-sm text-body-text">{section.title}</p>
        </div>
      </div>
      <h1 className={`font-display font-semibold text-heading leading-[1.15] mb-5 ${large ? 'text-4xl md:text-5xl' : 'text-3xl'}`}>{lesson.title}</h1>
    </>
  )
}

function PracticeTab({ lesson, tier, section, onPassed }) {
  const practice = lesson.practice
  const challenge = useGitChallenge({
    session: `practice:${lesson.id}`,
    seed: practice.seed,
    cases: practice.cases,
    progressId: practiceProgressId(lesson.id),
    onSolved: onPassed,
  })

  return (
    <div className="flex-1 max-w-[1600px] mx-auto px-8 py-12 grid lg:grid-cols-[360px_1fr] gap-10 w-full items-start">
      <div className="text-left">
        <LessonHeading tier={tier} lesson={lesson} section={section} />
        <div className="flex items-start gap-3 bg-surface rounded-2xl border border-heading/10 p-5">
          <Lightbulb className="h-4 w-4 text-primary-accent mt-1 shrink-0" />
          <div className="min-w-0 text-sm [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:text-sm">
            <p className="mb-2 text-sm font-semibold text-heading">Your task</p>
            <Markdown>{practice.prompt}</Markdown>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <GitWorkbench challenge={challenge} />

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={challenge.check}
            disabled={!challenge.ready || !!challenge.busy}
            className="flex items-center gap-1.5 text-sm font-semibold bg-heading text-cream rounded-lg px-4 py-2 hover:bg-heading/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {challenge.busy === 'checking' ? 'Checking...' : 'Check my work'}
          </button>
        </div>

        <GitFeedback challenge={challenge} />
        <GitWalkthrough challenge={challenge} walkthrough={practice.walkthrough} reference={practice.reference} />
      </div>
    </div>
  )
}

function LessonView() {
  const { lessonId } = useParams()
  const lesson = gitLessonById[lessonId]
  const tier = lesson ? gitTierById[lesson.tier] : null
  const section = lesson ? gitSections.find((s) => s.id === lesson.section) : null

  const { session } = useAuth()
  const { completedIds, loaded, markCompleted } = useCompletedLessons()
  const [tab, setTab] = useState('learn')
  const [doc, setDoc] = useState(undefined)

  useEffect(() => {
    if (!lesson) return
    let cancelled = false
    loadGitDoc(lesson.id)
      .then((text) => {
        if (!cancelled) setDoc(text)
      })
      .catch(() => {
        if (!cancelled) setDoc(null)
      })
    return () => {
      cancelled = true
    }
  }, [lesson])

  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-12">
        <p className="text-body-text">Lesson not found.</p>
      </div>
    )
  }

  if (!loaded) return null
  if (!isLessonUnlocked(lesson.id, completedIds)) return <Navigate to="/learn/git" replace />

  const hasPractice = Boolean(lesson.practice)
  const tabs = [{ id: 'learn', label: 'Learn' }, ...(hasPractice ? [{ id: 'practice', label: 'Practice' }] : [])]

  const complete = async () => {
    markCompleted(lesson.id)
    if (session) {
      const { error } = await supabase.from('progress').upsert({ user_id: session.user.id, lesson_id: lesson.id })
      if (error) console.error('Failed to save progress:', error)
    }
  }

  const next = nextLessonAfter(lesson.id)
  const nextUrl = next ? `/learn/git/${next.id}` : `/learn/git/exam/${tier.id}`
  const nextLabel = next ? 'Next lesson' : `Take the ${tier.name} exam`
  const canProceed = completedIds.has(lesson.id) || tier.openLessons === true
  const total = gitTierLessons(tier.id).length

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="border-b border-heading/10">
        <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between text-sm">
          <Link to="/learn/git" className="flex items-center gap-2 text-body-text hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> Git path
          </Link>
          <p className="text-body-text hidden sm:block">
            {tier.name} · Lesson {pad(lesson.numberInTier)} · {lesson.title}
          </p>
          <p className="text-body-text">
            {pad(lesson.numberInTier)} / {total}
          </p>
        </div>
      </div>

      <div className="border-b border-heading/10">
        <div role="tablist" aria-label="Lesson sections" className="max-w-[1600px] mx-auto px-8 flex gap-8 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`-mb-px whitespace-nowrap border-b-2 py-3.5 text-sm font-semibold transition-colors ${
                tab === t.id ? 'border-primary-accent text-heading' : 'border-transparent text-body-text hover:text-heading'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div id="panel-learn" role="tabpanel" aria-labelledby="tab-learn" hidden={tab !== 'learn'} className="flex-1 max-w-[1600px] mx-auto px-8 py-12 w-full">
        <div className="max-w-3xl">
          <LessonHeading tier={tier} lesson={lesson} section={section} large />

          {doc === undefined ? (
            <p className="text-sm text-body-text">Loading lesson...</p>
          ) : doc === null ? (
            <p className="text-body-text leading-relaxed">There is no written lesson for this topic yet.</p>
          ) : (
            <Markdown>{doc}</Markdown>
          )}

          {lesson.check.length > 0 && (
            <ConceptCheck
              key={lesson.id}
              questions={lesson.check}
              alreadyPassed={!hasPractice && completedIds.has(lesson.id)}
              required={!hasPractice}
              onPass={() => {
                if (!hasPractice) complete()
              }}
            />
          )}

          {hasPractice && (
            <div className="mt-10 border-t border-heading/10 pt-6">
              <button
                type="button"
                onClick={() => {
                  setTab('practice')
                  window.scrollTo({ top: 0 })
                }}
                className="flex items-center gap-2 rounded-lg bg-heading px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-heading/90"
              >
                Start practicing <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {hasPractice && (
        <div id="panel-practice" role="tabpanel" aria-labelledby="tab-practice" hidden={tab !== 'practice'} className="flex-1 flex flex-col">
          <PracticeTab lesson={lesson} tier={tier} section={section} onPassed={complete} />
        </div>
      )}

      <div className="border-t border-heading/10">
        <div className="max-w-[1600px] mx-auto px-8 py-5 flex items-center justify-between text-sm">
          <Link to="/learn/git" className="flex items-center gap-2 text-body-text hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to lessons
          </Link>

          <Link
            to={nextUrl}
            aria-disabled={!canProceed}
            onClick={(e) => {
              if (!canProceed) e.preventDefault()
            }}
            className={`flex items-center gap-2 font-semibold transition-colors ${
              canProceed ? 'text-heading hover:text-primary-accent' : 'text-body-text opacity-50 cursor-not-allowed'
            }`}
          >
            {nextLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function GitLesson() {
  const { lessonId } = useParams()
  return <LessonView key={lessonId} />
}

export default GitLesson
