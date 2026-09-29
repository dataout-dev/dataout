import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Markdown from '../../components/Markdown'
import { GitFeedback, GitWorkbench } from '../../components/git/GitWorkbench'
import { gitExams } from '../../data/git/exams/index.js'
import { gitExamId, gitTierById } from '../../data/git/index.js'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../supabaseClient'
import { isExamUnlocked } from '../../lib/gitAccess'
import { loadExerciseProgress, saveExerciseProgress } from '../../lib/exerciseProgress'
import { useGitChallenge } from '../../lib/useGitChallenge'
import { useCompletedLessons } from '../../lib/useCompletedLessons'
import { ArrowLeft, ArrowRight, Check, CircleAlert, CircleCheck, Lightbulb } from '../../components/icons'

const progressKey = (tierId, questionId) => `git-exam:${tierId}:${questionId}`

function InlineText({ text }) {
  return text.split(/`([^`]+)`/g).map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className="rounded bg-heading/10 px-1 font-mono text-[0.9em] text-heading">
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

function CodeQuestion({ tier, question, number, onSolved }) {
  const challenge = useGitChallenge({
    session: `exam:${tier.id}:${question.id}`,
    seed: question.seed,
    cases: question.cases,
    progressId: progressKey(tier.id, question.id),
    onSolved,
  })

  return (
    <div className="grid gap-10 lg:grid-cols-[380px_1fr] items-start">
      <div className="text-left">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-dark">
          Question {number} · {question.points} points
        </p>
        <div className="flex items-start gap-3 bg-surface rounded-2xl border border-heading/10 p-5 mb-6">
          <Lightbulb className="h-4 w-4 text-primary-accent mt-1 shrink-0" />
          <div className="min-w-0 text-sm [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:text-sm">
            <Markdown>{question.task}</Markdown>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        {challenge.progress.solved && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-correct/25 bg-correct/10 px-5 py-3 text-sm font-semibold text-correct">
            <CircleCheck className="h-4 w-4 shrink-0" /> You answered this question correctly.
          </div>
        )}
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
      </div>
    </div>
  )
}

function ChoiceQuestion({ tier, question, number, onSolved }) {
  const id = progressKey(tier.id, question.id)
  const [solved, setSolved] = useState(() => loadExerciseProgress(id).solved)
  const [choice, setChoice] = useState(null)
  const [answer, setAnswer] = useState(null)

  const check = () => {
    if (choice === null) return
    if (choice === question.answer) {
      setAnswer('correct')
      setSolved(true)
      saveExerciseProgress(id, { ...loadExerciseProgress(id), solved: true, revealed: true })
      onSolved()
    } else {
      setAnswer('wrong')
    }
  }

  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-dark">
        Question {number} · {question.points} points
      </p>
      <div className="mb-6 rounded-2xl border border-heading/10 bg-surface p-5 text-sm [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:text-sm">
        <Markdown>{question.q}</Markdown>
      </div>

      {solved && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-correct/25 bg-correct/10 px-5 py-3 text-sm font-semibold text-correct">
          <CircleCheck className="h-4 w-4 shrink-0" /> You answered this question correctly.
        </div>
      )}

      <fieldset className="rounded-2xl border border-heading/10 bg-surface p-5 shadow-sm">
        <legend className="sr-only">Choose an answer</legend>
        <div className="flex flex-col gap-2">
          {question.options.map((option, i) => (
            <label
              key={i}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                choice === i ? 'border-primary-accent bg-badge' : 'border-heading/10 hover:bg-heading/[0.02]'
              }`}
            >
              <input type="radio" name="choice" checked={choice === i} onChange={() => setChoice(i)} className="mt-0.5 accent-primary-accent" />
              <span className="min-w-0 text-body-text">
                <InlineText text={option} />
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={check}
            disabled={choice === null}
            className="rounded-lg bg-heading px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-heading/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check answer
          </button>
        </div>
      </fieldset>

      {answer && (
        <div className={`mt-5 flex items-start gap-3 rounded-2xl border p-5 ${answer === 'correct' ? 'border-correct/25 bg-correct/10' : 'border-wrong/20 bg-wrong/5'}`}>
          {answer === 'correct' ? <CircleCheck className="h-5 w-5 text-correct shrink-0" /> : <CircleAlert className="h-5 w-5 text-wrong shrink-0" />}
          <p className="text-sm text-body-text">{answer === 'correct' ? 'Correct. This question is done.' : 'Not correct. Read the options again and try another answer.'}</p>
        </div>
      )}
    </div>
  )
}

function ExamView({ tier, questions, alreadyPassed, onPass }) {
  const [active, setActive] = useState(0)
  const [solved, setSolved] = useState(() => new Set(questions.filter((q) => loadExerciseProgress(progressKey(tier.id, q.id)).solved).map((q) => q.id)))

  const total = questions.reduce((sum, q) => sum + q.points, 0)
  const passMark = Math.ceil((total * tier.examPassPercent) / 100)
  const earned = questions.filter((q) => solved.has(q.id)).reduce((sum, q) => sum + q.points, 0)
  const passed = alreadyPassed || earned >= passMark

  const handleSolved = (questionId) => {
    const next = new Set(solved).add(questionId)
    setSolved(next)
    const nextEarned = questions.filter((q) => next.has(q.id)).reduce((sum, q) => sum + q.points, 0)
    if (nextEarned >= passMark && !alreadyPassed) onPass()
  }

  const question = questions[active]

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="border-b border-heading/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between text-sm">
          <Link to="/learn/git" className="flex items-center gap-2 text-body-text hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> Git path
          </Link>
          <p className="text-body-text">Tier {tier.number} exam</p>
        </div>
      </div>

      <div className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-8 py-10 sm:py-12 w-full">
        <div className="mb-8 rounded-2xl p-6" style={{ backgroundColor: tier.color }}>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#57534e]">Tier {tier.number} exam</p>
          <h1 className="font-display text-3xl font-semibold text-[#1c1c1a] md:text-4xl">{tier.name} exam</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#3f3b37]">
            {questions.length} questions, with no hints. Get {passMark} of {total} points ({tier.examPassPercent}%) to pass. You can retry any
            question as often as you like, and your progress is saved in this browser.
          </p>

          <div className="mt-5 max-w-md">
            <div className="mb-1.5 flex justify-between text-xs font-semibold text-[#1c1c1a]">
              <span>
                {earned} / {total} points
              </span>
              <span>Pass mark {passMark}</span>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-white/60">
              <div className="h-full rounded-full bg-[#1c1c1a]" style={{ width: `${(earned / total) * 100}%` }} />
              <div className="absolute inset-y-0 w-0.5 bg-[#1c1c1a]/50" style={{ left: `${(passMark / total) * 100}%` }} />
            </div>
          </div>
        </div>

        {passed && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-correct/25 bg-correct/10 px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-correct">
              <CircleCheck className="h-5 w-5 shrink-0" /> You passed the {tier.name} exam.
            </p>
            <Link
              to="/learn/git"
              className="flex items-center gap-2 rounded-lg bg-heading px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-heading/90"
            >
              Back to the path <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div role="tablist" aria-label="Exam questions" className="mb-8 flex flex-wrap gap-2">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors ${
                active === i ? 'border-primary-accent bg-badge text-heading' : 'border-heading/10 text-body-text hover:bg-heading/5 hover:text-heading'
              }`}
            >
              {solved.has(q.id) && <Check className="h-3.5 w-3.5 text-correct" />}
              Question {i + 1}
            </button>
          ))}
        </div>

        {question.kind === 'mcq' ? (
          <ChoiceQuestion key={question.id} tier={tier} question={question} number={active + 1} onSolved={() => handleSolved(question.id)} />
        ) : (
          <CodeQuestion key={question.id} tier={tier} question={question} number={active + 1} onSolved={() => handleSolved(question.id)} />
        )}

        <div className="mt-10 flex items-center justify-between border-t border-heading/10 pt-6 text-sm">
          <button
            type="button"
            onClick={() => setActive((i) => Math.max(0, i - 1))}
            disabled={active === 0}
            className="flex items-center gap-2 font-semibold text-heading transition-colors hover:text-primary-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Previous question
          </button>
          <button
            type="button"
            onClick={() => setActive((i) => Math.min(questions.length - 1, i + 1))}
            disabled={active === questions.length - 1}
            className="flex items-center gap-2 font-semibold text-heading transition-colors hover:text-primary-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next question <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function GitExam() {
  const { tier: tierId } = useParams()
  const tier = gitTierById[tierId]
  const { session } = useAuth()
  const { completedIds, loaded, markCompleted } = useCompletedLessons()

  if (!tier || tier.soon) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-12">
        <p className="text-body-text">Exam not found.</p>
      </div>
    )
  }

  if (!loaded) return null

  const questions = gitExams[tier.id] ?? []
  const stepId = gitExamId(tier.id)
  if (questions.length === 0 || !isExamUnlocked(tier.id, completedIds)) return <Navigate to="/learn/git" replace />

  const onPass = async () => {
    markCompleted(stepId)
    if (session) {
      const { error } = await supabase.from('progress').upsert({ user_id: session.user.id, lesson_id: stepId })
      if (error) console.error('Failed to save exam progress:', error)
    }
  }

  return <ExamView key={tier.id} tier={tier} questions={questions} alreadyPassed={completedIds.has(stepId)} onPass={onPass} />
}

export default GitExam
