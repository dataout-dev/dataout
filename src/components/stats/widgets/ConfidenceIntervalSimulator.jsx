import { useMemo, useState } from 'react'
import { WidgetCard, Slider, Stat } from './WidgetChrome'
import { mulberry32, mean, std, randomNormal } from '../../../lib/statsMath'

const TRUE_MEAN = 50
const TRUE_SD = 10
const Z95 = 1.96

function CoverageMode({ n, onChangeN, seed, onRedraw }) {
  const intervals = useMemo(() => {
    const rng = mulberry32(seed)
    const rows = []
    for (let i = 0; i < 50; i++) {
      const sample = Array.from({ length: n }, () => randomNormal(rng, TRUE_MEAN, TRUE_SD))
      const m = mean(sample)
      const se = std(sample, 1) / Math.sqrt(n)
      const lo = m - Z95 * se
      const hi = m + Z95 * se
      rows.push({ lo, hi, captures: lo <= TRUE_MEAN && hi >= TRUE_MEAN })
    }
    return rows
  }, [n, seed])

  const captured = intervals.filter((i) => i.captures).length
  const domainLo = TRUE_MEAN - 30
  const domainHi = TRUE_MEAN + 30
  const scale = (v) => ((v - domainLo) / (domainHi - domainLo)) * 100

  return (
    <>
      <Slider label="Sample size (n)" value={n} onChange={onChangeN} min={5} max={100} />
      <div className="relative mt-4 h-64 overflow-y-auto rounded-xl border border-heading/10 bg-cream p-3">
        <div className="absolute inset-y-0 w-px bg-primary-accent" style={{ left: `${scale(TRUE_MEAN)}%` }} />
        {intervals.map((iv, i) => (
          <div key={i} className="relative mb-1.5 h-2">
            <div
              className={`absolute h-1.5 rounded-full ${iv.captures ? 'bg-heading/50' : 'bg-wrong'}`}
              style={{ left: `${scale(iv.lo)}%`, width: `${Math.max(scale(iv.hi) - scale(iv.lo), 0.5)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat label="Intervals capturing the true mean" value={`${captured} / 50`} />
        <button
          type="button"
          onClick={onRedraw}
          className="rounded-xl border border-heading/10 bg-cream px-4 py-3 text-sm font-semibold text-heading hover:bg-heading/5"
        >
          Draw 50 new samples
        </button>
      </div>
      <p className="mt-3 text-xs text-body-text">
        The vertical line is the true population mean (unknown in real life — here we're peeking). Each horizontal bar
        is one sample's 95% confidence interval. Red bars miss it — over many redraws, roughly 95% of bars should hit.
      </p>
    </>
  )
}

function SampleSizeMode({ n, onChange }) {
  const se = TRUE_SD / Math.sqrt(n)
  const margin = Z95 * se
  const domainLo = TRUE_MEAN - 30
  const domainHi = TRUE_MEAN + 30
  const scale = (v) => ((v - domainLo) / (domainHi - domainLo)) * 100

  return (
    <>
      <Slider label="Sample size (n)" value={n} onChange={onChange} min={2} max={200} />
      <div className="relative mt-6 h-16 rounded-xl border border-heading/10 bg-cream">
        <div className="absolute inset-y-0 w-px bg-primary-accent" style={{ left: `${scale(TRUE_MEAN)}%` }} />
        <div
          className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-heading/50"
          style={{ left: `${scale(TRUE_MEAN - margin)}%`, width: `${scale(TRUE_MEAN + margin) - scale(TRUE_MEAN - margin)}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat label="Margin of error (±)" value={margin.toFixed(2)} />
        <Stat label="Standard error" value={se.toFixed(2)} />
      </div>
      <p className="mt-3 text-xs text-body-text">
        The margin of error shrinks with the square root of n — to cut it in half, you need roughly 4× the sample
        size, not 2×.
      </p>
    </>
  )
}

function ConfidenceIntervalSimulator({ mode = 'coverage' }) {
  const [n, setN] = useState(20)
  const [seed, setSeed] = useState(1)

  return (
    <WidgetCard title={mode === 'sample-size' ? 'Margin of error vs. sample size' : 'Confidence interval coverage'}>
      {mode === 'sample-size' ? (
        <SampleSizeMode n={n} onChange={setN} />
      ) : (
        <CoverageMode n={n} onChangeN={setN} seed={seed} onRedraw={() => setSeed((s) => s + 1)} />
      )}
    </WidgetCard>
  )
}

export default ConfidenceIntervalSimulator
