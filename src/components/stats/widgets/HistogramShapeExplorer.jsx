import { useMemo, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts'
import { WidgetCard, Slider, Stat } from './WidgetChrome'

const BINS = 20

// Builds a histogram shape from a skew parameter in [-1, 1] using a simple
// asymmetric triangular-ish density — purely for visual intuition, not grading.
function buildHistogram(skew) {
  const bins = []
  for (let i = 0; i < BINS; i++) {
    const x = i / (BINS - 1) // 0..1
    const peak = 0.5 - skew * 0.3
    const spreadLeft = 0.35 + skew * 0.2
    const spreadRight = 0.35 - skew * 0.2
    const spread = x < peak ? Math.max(spreadLeft, 0.1) : Math.max(spreadRight, 0.1)
    const z = (x - peak) / spread
    const height = Math.exp(-0.5 * z * z) * (1 + Math.abs(skew) * (x > peak ? 1.2 : 0.3) * (1 - x))
    bins.push({ x, height: Math.max(height, 0) })
  }
  const total = bins.reduce((a, b) => a + b.height, 0)
  return bins.map((b) => ({ x: b.x, value: b.height / total }))
}

function weightedMean(bins) {
  return bins.reduce((a, b) => a + b.x * b.value, 0)
}

function weightedMedian(bins) {
  let cum = 0
  for (const b of bins) {
    cum += b.value
    if (cum >= 0.5) return b.x
  }
  return bins[bins.length - 1].x
}

function HistogramShapeExplorer({ mode = 'shape' }) {
  const [skew, setSkew] = useState(0)
  const bins = useMemo(() => buildHistogram(skew), [skew])
  const m = weightedMean(bins)
  const med = weightedMedian(bins)

  return (
    <WidgetCard title={mode === 'skew' ? 'Skewness explorer' : 'Histogram shape explorer'}>
      <Slider
        label={mode === 'skew' ? 'Skew (negative = left tail, positive = right tail)' : 'Reshape the distribution'}
        value={skew}
        onChange={setSkew}
        min={-0.9}
        max={0.9}
        step={0.05}
        format={(v) => v.toFixed(2)}
      />
      <div className="mt-4 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#1c1c1a" strokeOpacity={0.06} />
            <XAxis dataKey="x" hide />
            <YAxis hide />
            <ReferenceLine x={m} stroke="#b86c3a" strokeWidth={2} />
            <ReferenceLine x={med} stroke="#2a7d55" strokeWidth={2} strokeDasharray="4 3" />
            <Bar dataKey="value" fill="#8a7bb8" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat label="Mean (orange)" value={(m * 100).toFixed(0)} />
        <Stat label="Median (green)" value={(med * 100).toFixed(0)} />
      </div>
      <p className="mt-3 text-xs text-body-text">
        {skew > 0.15
          ? 'A right-skewed (positive) shape: a long tail stretches right, and the mean gets pulled above the median.'
          : skew < -0.15
            ? 'A left-skewed (negative) shape: a long tail stretches left, and the mean gets pulled below the median.'
            : 'Roughly symmetric — the mean and median sit close together.'}
      </p>
    </WidgetCard>
  )
}

export default HistogramShapeExplorer
