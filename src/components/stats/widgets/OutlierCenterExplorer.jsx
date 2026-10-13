import { useMemo, useState } from 'react'
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ReferenceLine, CartesianGrid } from 'recharts'
import { WidgetCard, Slider, Stat } from './WidgetChrome'
import { mean, median, percentile } from '../../../lib/statsMath'

const BASE = [12, 14, 15, 16, 18, 20]

function CenterMode({ outlier, onChange }) {
  const data = useMemo(() => [...BASE, outlier], [outlier])
  const m = mean(data)
  const med = median(data)
  const points = data.map((v) => ({ x: v, y: 0 }))

  return (
    <>
      <Slider label="Drag the 7th point" value={outlier} onChange={onChange} min={10} max={60} />
      <div className="mt-4 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <CartesianGrid horizontal={false} stroke="#1c1c1a" strokeOpacity={0.08} />
            <XAxis type="number" dataKey="x" domain={[5, 65]} tick={{ fontSize: 11 }} />
            <YAxis type="number" dataKey="y" hide domain={[-1, 1]} />
            <ReferenceLine x={m} stroke="#b86c3a" strokeWidth={2} label={{ value: 'mean', position: 'top', fontSize: 11, fill: '#b86c3a' }} />
            <ReferenceLine x={med} stroke="#2a7d55" strokeWidth={2} strokeDasharray="4 3" label={{ value: 'median', position: 'bottom', fontSize: 11, fill: '#2a7d55' }} />
            <Scatter data={points} fill="#1c1c1a" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat label="Mean" value={m.toFixed(1)} />
        <Stat label="Median" value={med.toFixed(1)} />
      </div>
      <p className="mt-3 text-xs text-body-text">
        Drag the slider past 40 or so and watch the mean chase the outlier while the median barely moves — that is what
        "robust to outliers" means in practice.
      </p>
    </>
  )
}

function BoxplotMode({ outlier, onChange }) {
  const data = useMemo(() => [...BASE, outlier], [outlier])
  const lo = Math.min(...data)
  const hi = Math.max(...data)
  const q1 = percentile(data, 25)
  const q3 = percentile(data, 75)
  const med = median(data)
  const scale = (v) => ((v - 5) / 60) * 100

  return (
    <>
      <Slider label="Move the outlier" value={outlier} onChange={onChange} min={10} max={60} />
      <div className="relative mt-8 h-16">
        <div className="absolute top-1/2 h-px w-full bg-heading/15" />
        <div className="absolute top-1/2 h-px bg-heading/40" style={{ left: `${scale(lo)}%`, width: `${Math.max(scale(q1) - scale(lo), 0)}%` }} />
        <div
          className="absolute top-1/2 h-8 -translate-y-1/2 rounded-md border-2 border-heading/60 bg-badge"
          style={{ left: `${scale(q1)}%`, width: `${Math.max(scale(q3) - scale(q1), 1)}%` }}
        />
        <div className="absolute top-1/2 h-8 w-0.5 -translate-y-1/2 bg-primary-accent" style={{ left: `${scale(med)}%` }} />
        <div className="absolute top-1/2 h-px bg-heading/40" style={{ left: `${scale(q3)}%`, width: `${Math.max(scale(hi) - scale(q3), 0)}%` }} />
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        <Stat label="Min" value={lo} />
        <Stat label="Q1" value={q1.toFixed(1)} />
        <Stat label="Median" value={med.toFixed(1)} />
        <Stat label="Q3 / Max" value={`${q3.toFixed(1)} / ${hi}`} />
      </div>
      <p className="mt-3 text-xs text-body-text">
        The box covers the middle 50% of the data (Q1 to Q3). Push the outlier far enough and only the right whisker
        stretches — the box itself barely notices.
      </p>
    </>
  )
}

function OutlierCenterExplorer({ mode = 'center' }) {
  const [outlier, setOutlier] = useState(20)

  return (
    <WidgetCard title={mode === 'boxplot' ? 'Box plot explorer' : 'Mean, median & an outlier'}>
      {mode === 'boxplot' ? <BoxplotMode outlier={outlier} onChange={setOutlier} /> : <CenterMode outlier={outlier} onChange={setOutlier} />}
    </WidgetCard>
  )
}

export default OutlierCenterExplorer
