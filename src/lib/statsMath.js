// Small, dependency-free statistics helpers shared by the Statistics path's
// interactive widgets. Nothing here needs to be graded or deterministic across
// sessions — it only drives live visual exploration.

export function mean(xs) {
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

export function variance(xs, ddof = 0) {
  const m = mean(xs)
  return xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - ddof)
}

export function std(xs, ddof = 0) {
  return Math.sqrt(variance(xs, ddof))
}

export function median(xs) {
  const sorted = [...xs].sort((a, b) => a - b)
  const n = sorted.length
  return n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2
}

export function percentile(xs, p) {
  const sorted = [...xs].sort((a, b) => a - b)
  const idx = (p / 100) * (sorted.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) return sorted[lo]
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
}

// Abramowitz-Stegun erf approximation (max error ~1.5e-7) — plenty for a visual.
export function erf(x) {
  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  const t = 1 / (1 + p * x)
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x)
  return sign * y
}

export function normalPdf(x, mu = 0, sigma = 1) {
  const z = (x - mu) / sigma
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI))
}

export function normalCdf(x, mu = 0, sigma = 1) {
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))))
}

function logFactorial(n) {
  let sum = 0
  for (let i = 2; i <= n; i++) sum += Math.log(i)
  return sum
}

export function binomialPmf(k, n, p) {
  if (k < 0 || k > n) return 0
  const logCoeff = logFactorial(n) - logFactorial(k) - logFactorial(n - k)
  const logP = k * Math.log(Math.max(p, 1e-12)) + (n - k) * Math.log(Math.max(1 - p, 1e-12))
  return Math.exp(logCoeff + logP)
}

export function poissonPmf(k, lambda) {
  if (k < 0) return 0
  return Math.exp(k * Math.log(lambda) - lambda - logFactorial(k))
}

export function pearsonR(xs, ys) {
  const mx = mean(xs)
  const my = mean(ys)
  let num = 0
  let dx2 = 0
  let dy2 = 0
  for (let i = 0; i < xs.length; i++) {
    const dx = xs[i] - mx
    const dy = ys[i] - my
    num += dx * dy
    dx2 += dx * dx
    dy2 += dy * dy
  }
  return num / Math.sqrt(dx2 * dy2)
}

export function linregress(xs, ys) {
  const mx = mean(xs)
  const my = mean(ys)
  let num = 0
  let den = 0
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - mx) * (ys[i] - my)
    den += (xs[i] - mx) ** 2
  }
  const slope = num / den
  const intercept = my - slope * mx
  const r = pearsonR(xs, ys)
  return { slope, intercept, r2: r * r }
}

// A small seeded PRNG (mulberry32) so a widget can regenerate "random-looking"
// data that stays stable across re-renders until the user asks for a new draw.
export function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Box-Muller, driven by a given uniform RNG so it stays reproducible.
export function randomNormal(rng, mu = 0, sigma = 1) {
  const u1 = Math.max(rng(), 1e-12)
  const u2 = rng()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mu + sigma * z
}
