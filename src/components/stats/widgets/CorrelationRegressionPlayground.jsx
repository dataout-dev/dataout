import { useMemo, useState } from 'react'
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Line, ComposedChart } from 'recharts'
import { WidgetCard, Slider, Stat } from './WidgetChrome'
import { mulberry32, pearsonR, linregress } from '../../../lib/statsMath'

function generatePoints(r, seed) {
  const rng = mulberry32(seed)
  const n = 40
  const xs = []
  const ys = []
  for (let i = 0; i < n; i++) {
    const x = rng() * 20 - 10
    const noise = rng() * 20 - 10
    const y = r * x + Math.sqrt(Math.max(1 - r * r, 0)) * noise
    xs.push(x)
    ys.push(y)
  }
  return { xs, ys, points: xs.map((x, i) => ({ x, y: ys[i] })) }
}

function CorrelationRegressionPlayground({ mode = 'correlation' }) {
  const [r, setR] = useState(0.7)
  const [seed, setSeed] = useState(1)
  const { xs, ys, points } = useMemo(() => generatePoints(r, seed), [r, seed])
  const actualR = pearsonR(xs, ys)
  const { slope, intercept, r2 } = useMemo(() => linregress(xs, ys), [xs, ys])

  const lineData = useMemo(() => {
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept },
    ]
  }, [xs, slope, intercept])

  return (
    <WidgetCard title={mode === 'regression' ? 'Regression line playground' : 'Correlation playground'}>
      <Slider label="Target correlation strength" value={r} onChange={setR} min={-1} max={1} step={0.05} format={(v) => v.toFixed(2)} />
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          {mode === 'regression' ? (
            <ComposedChart margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#1c1c1a" strokeOpacity={0.06} />
              <XAxis dataKey="x" type="number" domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
              <YAxis dataKey="y" type="number" domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
              <Scatter data={points} dataKey="y" fill="#1c1c1a" fillOpacity={0.6} />
              <Line data={lineData} dataKey="y" stroke="#b86c3a" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          ) : (
            <ScatterChart margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#1c1c1a" strokeOpacity={0.06} />
              <XAxis dataKey="x" type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="y" type="number" tick={{ fontSize: 11 }} />
              <Scatter data={points} fill="#1c1c1a" fillOpacity={0.65} />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat label="Actual r in this sample" value={actualR.toFixed(2)} />
        {mode === 'regression' ? <Stat label="R² (fit quality)" value={r2.toFixed(2)} /> : (
          <button
            type="button"
            onClick={() => setSeed((s) => s + 1)}
            className="rounded-xl border border-heading/10 bg-cream px-4 py-3 text-sm font-semibold text-heading hover:bg-heading/5"
          >
            New random draw
          </button>
        )}
      </div>
      <p className="mt-3 text-xs text-body-text">
        {mode === 'regression'
          ? 'R² is just r squared: the fraction of the variation in y that the line explains. Push r toward ±1 and R² climbs toward 1.'
          : 'r = 1 or -1 is a perfect line; r = 0 is a shapeless cloud. The sign tells you the direction, not the steepness.'}
      </p>
    </WidgetCard>
  )
}

export default CorrelationRegressionPlayground
