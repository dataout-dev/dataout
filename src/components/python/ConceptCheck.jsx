import { useState } from 'react'
import Markdown from '../Markdown'
import { CircleAlert, CircleCheck } from '../icons'

export const CHECK_PASS_RATIO = 0.8

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

function Question({ number, question, choice, onChoose, revealed }) {
  const correct = revealed && choice === question.answer

  return (
    <fieldset className="rounded-2xl border border-heading/10 bg-surface p-5">
      <legend className="sr-only">Question {number}</legend>
      <div className="mb-3 text-sm text-heading [&_p]:mb-2 [&_p]:text-sm [&_p]:text-heading [&_p:last-child]:mb-0">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-caption">Question {number}</span>
        <Markdown>{question.q}</Markdown>
      </div>
      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => {
          const selected = choice === i
          const isAnswer = revealed && i === question.answer
          const isWrongPick = revealed && selected && i !== question.answer
          return (
            <label
              key={i}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                isAnswer
                  ? 'border-correct/40 bg-correct/10'
                  : isWrongPick
                    ? 'border-wrong/40 bg-wrong/5'
                    : selected
                      ? 'border-primary-accent bg-badge'
                      : 'border-heading/10 hover:bg-heading/[0.02]'
              }`}
            >
              <input
                type="radio"
                name={`q-${number}`}
                checked={selected}
                onChange={() => onChoose(i)}
                disabled={revealed}
                className="mt-0.5 accent-primary-accent"
              />
              <span className="min-w-0 text-body-text">
                <InlineText text={option} />
              </span>
            </label>
          )
        })}
      </div>
      {revealed && (
        <div className={`mt-3 flex items-start gap-2 text-sm ${correct ? 'text-correct' : 'text-body-text'}`}>
          {correct ? <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" /> : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-wrong" />}
          <div className="min-w-0 [&_p]:mb-0 [&_p]:text-sm">
            <Markdown>{`${correct ? '**Correct.** ' : '**Not quite.** '}${question.why}`}</Markdown>
          </div>
        </div>
      )}
    </fieldset>
  )
}

function ConceptCheck({ questions, alreadyPassed, onPass, required }) {
  const [choices, setChoices] = useState({})
  const [revealed, setRevealed] = useState(false)

  const score = questions.filter((q, i) => choices[i] === q.answer).length
  const needed = Math.ceil(questions.length * CHECK_PASS_RATIO)
  const passed = revealed && score >= needed
  const allAnswered = questions.every((_, i) => choices[i] !== undefined)

  const check = () => {
    setRevealed(true)
    if (score >= needed) onPass?.()
  }

  const again = () => {
    setChoices({})
    setRevealed(false)
  }

  return (
    <section className="mt-12 border-t border-heading/10 pt-8" aria-labelledby="concept-check">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-dark">Concept check</p>
      <h2 id="concept-check" className="mb-2 font-display text-2xl font-semibold text-heading">
        Check your understanding
      </h2>
      <p className="mb-6 text-sm text-body-text">
        {questions.length} questions.{' '}
        {required
          ? `Get ${needed} right to complete this lesson. You can try again as often as you like.`
          : 'This is for you: it does not block the lesson.'}
        {alreadyPassed && ' You have already passed this check.'}
      </p>

      <div className="flex flex-col gap-4">
        {questions.map((question, i) => (
          <Question
            key={i}
            number={i + 1}
            question={question}
            choice={choices[i]}
            onChoose={(choice) => setChoices((prev) => ({ ...prev, [i]: choice }))}
            revealed={revealed}
          />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!revealed ? (
          <button
            type="button"
            onClick={check}
            disabled={!allAnswered}
            className="rounded-lg bg-heading px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-heading/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check answers
          </button>
        ) : (
          <>
            <p className={`text-sm font-semibold ${passed ? 'text-correct' : 'text-wrong'}`}>
              {score} of {questions.length} correct{passed ? '. Well done.' : `. You need ${needed} to pass.`}
            </p>
            <button
              type="button"
              onClick={again}
              className="rounded-lg border border-heading/10 px-4 py-2 text-sm font-medium text-heading transition-colors hover:bg-heading/5"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </section>
  )
}

export default ConceptCheck
