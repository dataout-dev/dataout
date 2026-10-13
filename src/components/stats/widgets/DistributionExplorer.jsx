import { useMemo, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceArea } from 'recharts'
import { WidgetCard, Slider, ModeTabs, Stat } from './WidgetChrome'
import { normalPdf, binomialPmf, poissonPmf } from '../../../lib/statsMath'

function NormalPanel() {
  const [mu, setMu] = useState(0)
  const [sigma, setSigma] = useState(1)
  const data = useMemo(() => {
    const pts = []
    for (let x = mu - 4 * sigma - 2; x <= mu + 4 * sigma + 2; x += (8 * sigma + 4) / 80) {
      pts.push({ x: Number(x.toFixed(2)), y: normalPdf(x, mu, sigma) })
    }
    return pts
  }, [mu, sigma])

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider label="Mean (μ)" value={mu} onChange={setMu} min={-10} max={10} step={0.5} />
        <Slider label="Standard deviation (σ)" value={sigma} onChange={setSigma} min={0.5} max={5} step={0.25} />
      </div>
      <div className="mt-4 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#1c1c1a" strokeOpacity={0.06} />
            <XAxis dataKey="x" tick={{ fontSize: 11 }} />
            <YAxis hide />
            <ReferenceArea x1={mu - sigma} x2={mu + sigma} fill="#8a7bb8" fillOpacity={0.25} />
            <ReferenceArea x1={mu - 2 * sigma} x2={mu - sigma} fill="#8a7bb8" fillOpacity={0.12} />
            <ReferenceArea x1={mu + sigma} x2={mu + 2 * sigma} fill="#8a7bb8" fillOpacity={0.12} />
            <Line type="monotone" dataKey="y" stroke="#1c1c1a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-body-text">
        The darker band is μ ± 1σ (~68% of the area), the lighter bands extend it to μ ± 2σ (~95%). That is the
        empirical rule.
      </p>
    </>
  )
}

function BinomialPanel() {
  const [n, setN] = useState(20)
  const [p, setP] = useState(0.5)
  const data = useMemo(() => Array.from({ length: n + 1 }, (_, k) => ({ x: k, y: binomialPmf(k, n, p) })), [n, p])
  const expected = n * p

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider label="Trials (n)" value={n} onChange={setN} min={1} max={50} />
        <Slider label="Success probability (p)" value={p} onChange={setP} min={0.05} max={0.95} step={0.05} format={(v) => v.toFixed(2)} />
      </div>
      <div className="mt-4 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#1c1c1a" strokeOpacity={0.06} />
            <XAxis dataKey="x" tick={{ fontSize: 10 }} />
            <YAxis hide />
            <Bar dataKey="y" fill="#8a7bb8" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Stat label="Expected successes (n × p)" value={expected.toFixed(1)} />
    </>
  )
}

function PoissonPanel() {
  const [lambda, setLambda] = useState(4)
  const upper = Math.max(12, Math.ceil(lambda * 3))
  const data = useMemo(() => Array.from({ length: upper + 1 }, (_, k) => ({ x: k, y: poissonPmf(k, lambda) })), [lambda, upper])

  return (
    <>
      <Slider label="Average rate (λ)" value={lambda} onChange={setLambda} min={0.5} max={20} step={0.5} />
      <div className="mt-4 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#1c1c1a" strokeOpacity={0.06} />
            <XAxis dataKey="x" tick={{ fontSize: 10 }} />
            <YAxis hide />
            <Bar dataKey="y" fill="#8a7bb8" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-body-text">λ is both the mean and the variance of a Poisson distribution — watch the peak track it.</p>
    </>
  )
}

function UniformPanel() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(10)
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  const height = 1 / Math.max(hi - lo, 0.5)
  const data = [
    { x: lo - 1, y: 0 },
    { x: lo, y: 0 },
    { x: lo, y: height },
    { x: hi, y: height },
    { x: hi, y: 0 },
    { x: hi + 1, y: 0 },
  ]

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider label="Lower bound (a)" value={a} onChange={setA} min={-10} max={9} />
        <Slider label="Upper bound (b)" value={b} onChange={setB} min={1} max={20} />
      </div>
      <div className="mt-4 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#1c1c1a" strokeOpacity={0.06} />
            <XAxis dataKey="x" type="number" domain={[lo - 2, hi + 2]} tick={{ fontSize: 11 }} />
            <YAxis hide />
            <Line type="linear" dataKey="y" stroke="#1c1c1a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-body-text">Every value between a and b is equally likely — that is why the density is a flat rectangle.</p>
    </>
  )
}

const PANELS = { normal: NormalPanel, binomial: BinomialPanel, poisson: PoissonPanel, uniform: UniformPanel }
const LABELS = { normal: 'Normal', binomial: 'Binomial', poisson: 'Poisson', uniform: 'Uniform' }

function DistributionExplorer({ mode = 'normal' }) {
  const [active, setActive] = useState(mode)
  const Panel = PANELS[active] ?? NormalPanel

  return (
    <WidgetCard title="Distribution explorer">
      <ModeTabs options={Object.keys(PANELS).map((k) => ({ value: k, label: LABELS[k] }))} value={active} onChange={setActive} />
      <Panel key={active} />
    </WidgetCard>
  )
}

export default DistributionExplorer
