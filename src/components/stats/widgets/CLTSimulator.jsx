import { useMemo, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { WidgetCard, Slider, ModeTabs, Stat } from './WidgetChrome'
import { mulberry32, mean, std } from '../../../lib/statsMath'

const POPULATIONS = {
  skewed: (rng) => -Math.log(Math.max(rng(), 1e-9)) * 10, // exponential-ish, right-skewed
  uniform: (rng) => rng() * 40,
  bimodal: (rng) => (rng() < 0.5 ? 10 + rng() * 6 : 30 + rng() * 6),
}

const BINS = 16

function histogram(values, lo, hi) {
  const width = (hi - lo) / BINS
  const counts = Array.from({ length: BINS }, (_, i) => ({ bin: (lo + (i + 0.5) * width).toFixed(0), count: 0 }))
  for (const v of values) {
    const idx = Math.min(BINS - 1, Math.max(0, Math.floor((v - lo) / width)))
    counts[idx].count += 1
  }
  return counts
}

function CLTSimulator() {
  const [population, setPopulation] = useState('skewed')
  const [n, setN] = useState(2)
  const [seed, setSeed] = useState(1)

  const { sampleMeans, popLo, popHi } = useMemo(() => {
    const rng = mulberry32(seed)
    const draw = POPULATIONS[population]
    const trials = 1000
    const means = []
    for (let t = 0; t < trials; t++) {
      const sample = Array.from({ length: n }, () => draw(rng))
      means.push(mean(sample))
    }
    return { sampleMeans: means, popLo: 0, popHi: 40 }
  }, [population, n, seed])

  const bins = useMemo(() => histogram(sampleMeans, popLo, popHi), [sampleMeans, popLo, popHi])
  const spread = std(sampleMeans)

  return (
    <WidgetCard title="Central Limit Theorem simulator">
      <ModeTabs
        options={[
          { value: 'skewed', label: 'Skewed population' },
          { value: 'uniform', label: 'Uniform population' },
          { value: 'bimodal', label: 'Bimodal population' },
        ]}
        value={population}
        onChange={setPopulation}
      />
      <Slider label="Sample size (n) per draw" value={n} onChange={setN} min={1} max={50} />
      <p className="mb-2 text-xs text-caption">1,000 samples of size {n} are drawn from a {population} population. Each bar is the mean of one sample.</p>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#1c1c1a" strokeOpacity={0.06} />
            <XAxis dataKey="bin" tick={{ fontSize: 10 }} interval={2} />
            <YAxis hide />
            <Bar dataKey="count" fill="#8a7bb8" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat label="Spread of sample means" value={spread.toFixed(2)} />
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-xl border border-heading/10 bg-cream px-4 py-3 text-sm font-semibold text-heading hover:bg-heading/5"
        >
          Redraw 1,000 samples
        </button>
      </div>
      <p className="mt-3 text-xs text-body-text">
        At n = 1 the shape of the sampling distribution just copies the population's own shape. Push n up to 20-50 and
        watch it become a narrow, symmetric bell — no matter how skewed the population was.
      </p>
    </WidgetCard>
  )
}

export default CLTSimulator
