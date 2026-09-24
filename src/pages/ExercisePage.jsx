import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Markdown from '../components/Markdown'
import { Feedback, QueryPanel, SchemaCard, WalkthroughPanel } from '../components/challenge/ChallengeParts'
import { exerciseSubjects } from '../data/exerciseSubjects'
import { dayNumber, formatCountdown, msUntilNextExercise, todaysExercise } from '../lib/exercises'
import { useChallenge } from '../lib/useChallenge'
import { ArrowLeft, CircleCheck, Lightbulb } from '../components/icons'

const difficultyStyles = {
  easy: 'bg-[#dcead9]',
  medium: 'bg-[#f4e2d0]',
  hard: 'bg-[#f5d3d3]',
}

function useNow(intervalMs) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

function ExerciseView({ subject, exercise, day, msLeft }) {
  const challenge = useChallenge({
    datasetId: exercise.dataset,
    reference: exercise.referenceQuery,
    orderMatters: exercise.orderMatters,
    progressId: exercise.id,
  })

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <div className="border-b border-heading/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between text-sm">
          <Link to="/exercise" className="flex items-center gap-2 text-body-text hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> All exercises
          </Link>
          <p className="text-body-text">
            Day {day + 1} · next question in {formatCountdown(msLeft)}
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-8 py-10 sm:py-12 grid lg:grid-cols-[380px_1fr] gap-10 w-full items-start">
        <div className="text-left">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary-accent mb-3">
            {subject.name} · Daily exercise
          </p>
          <h1 className="font-display font-semibold text-3xl text-heading leading-[1.15] mb-4">{exercise.title}</h1>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#1c1c1a] ${difficultyStyles[exercise.difficulty]}`}
            >
              {exercise.difficulty}
            </span>
            {exercise.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-heading/10 px-2.5 py-1 text-[10px] font-medium text-body-text">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-start gap-3 bg-surface rounded-2xl border border-heading/10 p-5 mb-6">
            <Lightbulb className="h-4 w-4 text-primary-accent mt-1 shrink-0" />
            <div className="min-w-0 text-sm [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:text-sm">
              <Markdown>{exercise.brief}</Markdown>
            </div>
          </div>

          <SchemaCard challenge={challenge} />
        </div>

        <div className="min-w-0">
          {challenge.progress.solved && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl border border-correct/25 bg-correct/10 px-5 py-3 text-sm font-semibold text-correct">
              <CircleCheck className="h-4 w-4 shrink-0" /> You solved today’s question. A new one arrives at 00:00 UTC.
            </div>
          )}

          <QueryPanel challenge={challenge} />
          <Feedback challenge={challenge} />
          <WalkthroughPanel challenge={challenge} walkthrough={exercise.walkthrough} reference={exercise.referenceQuery} />
        </div>
      </div>
    </div>
  )
}

function ExercisePage() {
  const { subject: subjectId } = useParams()
  const subject = exerciseSubjects.find((s) => s.id === subjectId)
  const now = useNow(30000)

  if (!subject?.available) return <Navigate to="/exercise" replace />

  const exercise = todaysExercise(subject.id, now)
  if (!exercise) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-12">
        <p className="text-body-text">There are no {subject.name} exercises yet.</p>
      </div>
    )
  }

  return (
    <ExerciseView
      key={exercise.id}
      subject={subject}
      exercise={exercise}
      day={dayNumber(now)}
      msLeft={msUntilNextExercise(now)}
    />
  )
}

export default ExercisePage
