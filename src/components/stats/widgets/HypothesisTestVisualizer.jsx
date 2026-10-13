import { useMemo, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ReferenceArea } from 'recharts'
import { WidgetCard, Slider, Stat } from './WidgetChrome'
import { normalPdf, normalCdf } from '../../../lib/statsMath'

function curve(mu, lo = -5, hi = 5) {
  const pts = []
  for (let x = lo; x <= hi; x += (hi - lo) / 120) pts.push({ x: Number(x.toFixed(2)), y: normalPdf(x, mu, 1) })
  return pts
}

function PValueMode() {
  const [z, setZ] = useState(1.5)
  const data = useMemo(() => curve(0), [])
  const twoTailed = 2 * (1 - normalCdf(Math.abs(z)))
  const critical = 1.96

  return (
    <>
      <Slider label="Observed z-statistic" value={z} onChange={setZ} min={-4} max={4} step={0.05} />
      <div className="mt-4 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#1c1c1a" strokeOpacity={0.06} />
            <XAxis dataKey="x" tick={{ fontSize: 11 }} />
            <YAxis hide />
            <ReferenceArea x1={-5} x2={-critical} fill="#c4482f" fillOpacity={0.15} />
            <ReferenceArea x1={critical} x2={5} fill="#c4482f" fillOpacity={0.15} />
            <ReferenceLine x={z} stroke="#1c1c1a" strokeWidth={2} />
            <Line type="monotone" dataKey="y" stroke="#1c1c1a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat label="Two-tailed p-value" value={twoTailed.toFixed(4)} />
        <Stat label="Significant at α = 0.05?" value={twoTailed < 0.05 ? 'Yes' : 'No'} />
      </div>
      <p className="mt-3 text-xs text-body-text">
        The shaded red tails are the rejection region at α = 0.05. The p-value is the total area beyond your observed
        statistic, on both sides — slide past ±1.96 and it drops under 0.05.
      </p>
    </>
  )
}

function ErrorRegionsMode() {
  const [effect, setEffect] = useState(2.5)
  const critical = 1.645
  const nullCurve = useMemo(() => curve(0, -5, 7), [])
  const altCurve = useMemo(() => curve(effect, -5, 7), [effect])
  const merged = nullCurve.map((p, i) => ({ x: p.x, nullY: p.y, altY: altCurve[i]?.y ?? 0 }))
  const beta = normalCdf(critical, effect)

  return (
    <>
      <Slider label="True effect size (distance between distributions)" value={effect} onChange={setEffect} min={0} max={5} step={0.25} />
      <div className="mt-4 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={merged} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#1c1c1a" strokeOpacity={0.06} />
            <XAxis dataKey="x" tick={{ fontSize: 11 }} />
            <YAxis hide />
            <ReferenceArea x1={critical} x2={7} fill="#c4482f" fillOpacity={0.15} />
            <ReferenceArea x1={-5} x2={critical} fill="#2f6fa3" fillOpacity={0.1} />
            <ReferenceLine x={critical} stroke="#1c1c1a" strokeDasharray="4 3" />
            <Line type="monotone" dataKey="nullY" stroke="#1c1c1a" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="altY" stroke="#b86c3a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat label="α (Type I, red)" value="0.05" />
        <Stat label="β (Type II, blue)" value={beta.toFixed(3)} />
      </div>
      <p className="mt-3 text-xs text-body-text">
        Black = the null distribution, orange = the true (alternative) distribution. Red is the Type I error region
        (reject a true null); blue is the Type II error region (fail to reject a false null). A bigger effect size
        separates the curves and shrinks β.
      </p>
    </>
  )
}

function HypothesisTestVisualizer({ mode = 'p-value' }) {
  return (
    <WidgetCard title={mode === 'error-regions' ? 'Type I & Type II errors' : 'p-value visualizer'}>
      {mode === 'error-regions' ? <ErrorRegionsMode /> : <PValueMode />}
    </WidgetCard>
  )
}

export default HypothesisTestVisualizer
