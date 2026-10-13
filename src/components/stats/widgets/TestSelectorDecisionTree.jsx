import { useState } from 'react'
import { WidgetCard } from './WidgetChrome'

const TREE = {
  start: {
    q: 'What are you comparing?',
    options: [
      { label: 'A sample mean to a known value', next: 'oneGroup' },
      { label: 'Two group means', next: 'twoGroups' },
      { label: 'More than two group means', next: 'result-anova' },
      { label: 'Relationship between two numeric variables', next: 'result-correlation' },
      { label: 'Relationship between two categorical variables', next: 'result-chisquare' },
    ],
  },
  oneGroup: {
    q: 'Do you know the population standard deviation?',
    options: [
      { label: 'Yes', next: 'result-ztest' },
      { label: 'No (the usual case)', next: 'result-onesamplet' },
    ],
  },
  twoGroups: {
    q: 'Are the two groups independent, or the same subjects measured twice?',
    options: [
      { label: 'Independent groups', next: 'result-twosamplet' },
      { label: 'Same subjects, before/after', next: 'result-pairedt' },
    ],
  },
  'result-ztest': { result: 'One-sample z-test', why: 'Known population σ lets you use the normal distribution directly.' },
  'result-onesamplet': { result: 'One-sample t-test', why: 'Unknown σ means you estimate it from the sample, which widens the tails — hence the t-distribution.' },
  'result-twosamplet': { result: 'Two-sample (independent) t-test', why: 'Comparing two separate groups\' means, each with its own estimated variance.' },
  'result-pairedt': { result: 'Paired t-test', why: 'Before/after on the same subjects removes a lot of noise — you test the differences directly.' },
  'result-anova': { result: 'One-way ANOVA', why: 'Comparing 3+ group means with many t-tests inflates false positives; ANOVA tests them all at once.' },
  'result-correlation': { result: 'Pearson correlation / linear regression', why: 'Both variables are numeric, so you can ask how they move together.' },
  'result-chisquare': { result: 'Chi-square test of independence', why: 'Categorical-by-categorical relationships are tested on counts in a contingency table, not means.' },
}

function TestSelectorDecisionTree() {
  const [path, setPath] = useState(['start'])
  const current = TREE[path[path.length - 1]]

  const choose = (next) => setPath((p) => [...p, next])
  const reset = () => setPath(['start'])
  const back = () => setPath((p) => (p.length > 1 ? p.slice(0, -1) : p))

  return (
    <WidgetCard title="Which test should I use?">
      {path.length > 1 && (
        <button type="button" onClick={back} className="mb-4 text-xs font-semibold text-accent-dark hover:underline">
          ← Back
        </button>
      )}

      {current.result ? (
        <div className="rounded-xl border border-correct/25 bg-correct/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-correct">Recommended test</p>
          <p className="mt-1 font-display text-xl font-semibold text-heading">{current.result}</p>
          <p className="mt-2 text-sm text-body-text">{current.why}</p>
          <button type="button" onClick={reset} className="mt-4 rounded-lg bg-heading px-4 py-2 text-sm font-semibold text-cream hover:bg-heading/90">
            Start over
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-3 font-semibold text-heading">{current.q}</p>
          <div className="flex flex-col gap-2">
            {current.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => choose(opt.next)}
                className="rounded-xl border border-heading/10 bg-cream px-4 py-3 text-left text-sm font-medium text-heading transition-colors hover:border-primary-accent hover:bg-badge"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </WidgetCard>
  )
}

export default TestSelectorDecisionTree
