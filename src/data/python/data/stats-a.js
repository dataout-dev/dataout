import { dat, py } from './common.js'

const num = (c) => dat({ ...c, hidden: 'import numpy as np\n' + (c.hidden ?? '') })
const sci = (c) => dat({ ...c, hidden: 'import numpy as np\nfrom scipy import stats\n' + (c.hidden ?? '') })

export const statsLessonsA = [
  {
    id: 'py-descriptive-statistics',
    title: 'Descriptive statistics',
    blurb: 'Location and spread, percentiles and IQR, and robust statistics.',
    kind: 'code',
    practice: {
      prompt: 'Write `describe(a)`: return a dict with `"mean"`, `"median"`, `"std"` (population standard deviation, `ddof=0`) and `"iqr"` (the interquartile range, 75th minus 25th percentile) of array `a`, all as plain floats.',
      starter: 'import numpy as np\n\ndef describe(a):\n    ...\n',
      solution: py`import numpy as np

def describe(a):
    a = np.asarray(a, dtype=float)
    q75, q25 = np.percentile(a, [75, 25])
    return {
        "mean": float(a.mean()),
        "median": float(np.median(a)),
        "std": float(a.std()),
        "iqr": float(q75 - q25),
    }`,
      samples: ['describe([1.0, 2.0, 3.0, 4.0, 5.0])'],
      cases: [
        ['A simple symmetric array', 'describe([1.0, 2.0, 3.0, 4.0, 5.0])'],
        ['A skewed array, mean differs from median', 'describe([1.0, 2.0, 3.0, 100.0])'],
        ['All the same value', 'describe([5.0, 5.0, 5.0])'],
        ['Negative numbers', 'describe([-3.0, -1.0, 1.0, 3.0])'],
      ],
      traps: [
        py`import numpy as np

def describe(a):
    a = np.asarray(a, dtype=float)
    q75, q25 = np.percentile(a, [75, 25])
    return {
        "mean": float(a.mean()),
        "median": float(np.median(a)),
        "std": float(a.std(ddof=1)),
        "iqr": float(q75 - q25),
    }`,
        py`import numpy as np

def describe(a):
    a = np.asarray(a, dtype=float)
    q75, q25 = np.percentile(a, [75, 25])
    return {
        "mean": float(a.mean()),
        "median": float(np.median(a)),
        "std": float(a.std()),
        "iqr": float(q25 - q75),
    }`,
        py`import numpy as np

def describe(a):
    a = np.asarray(a, dtype=float)
    q75, q25 = np.percentile(a, [75, 25])
    return {
        "mean": float(np.median(a)),
        "median": float(a.mean()),
        "std": float(a.std()),
        "iqr": float(q75 - q25),
    }`,
      ],
    },
    real: [
      num({
        title: 'Delay statistics for one carrier',
        use: ['flights'],
        starter: 'sample = [f["dep_delay"] for f in flights if f["dep_delay"] is not None and f["carrier"] == "AA"][:100]\nanswer = ...\n',
        given: '# flights is a list of dictionaries. sample already holds up to 100 real, non-missing delays for carrier AA.',
        brief: 'Compute the same four statistics as `describe` for `sample`. Store the dict in `answer`.',
        reference: py`sample = [f["dep_delay"] for f in flights if f["dep_delay"] is not None and f["carrier"] == "AA"][:100]
a = np.asarray(sample, dtype=float)
q75, q25 = np.percentile(a, [75, 25])
answer = {"mean": float(a.mean()), "median": float(np.median(a)), "std": float(a.std()), "iqr": float(q75 - q25)}`,
        walkthrough: 'Real delay data is usually right-skewed (a few very late flights pull the mean up more than the median), which is exactly the kind of thing comparing `mean` and `median` reveals.',
        traps: [py`sample = [f["dep_delay"] for f in flights if f["dep_delay"] is not None and f["carrier"] == "AA"][:100]
a = np.asarray(sample, dtype=float)
q75, q25 = np.percentile(a, [75, 25])
answer = {"mean": float(a.mean()), "median": float(np.median(a)), "std": float(a.std(ddof=1)), "iqr": float(q75 - q25)}`],
      }),
      num({
        title: 'Mean versus median streams',
        use: ['songs'],
        starter: 'sample = [s["spotify_streams"] for s in songs if s["spotify_streams"] is not None][:200]\nanswer = ...\n',
        given: '# songs is a list of dictionaries. sample already holds 200 real, non-missing stream counts.',
        brief: 'Compute the mean and median of `sample`, rounded to 1 decimal, as `(mean, median)`, in `answer`.',
        reference: py`sample = [s["spotify_streams"] for s in songs if s["spotify_streams"] is not None][:200]
a = np.asarray(sample, dtype=float)
answer = (round(float(a.mean()), 1), round(float(np.median(a)), 1))`,
        walkthrough: 'Streaming counts are typically dominated by a few huge hits, so the mean usually sits noticeably above the median.',
        traps: [py`sample = [s["spotify_streams"] for s in songs if s["spotify_streams"] is not None][:200]
a = np.asarray(sample, dtype=float)
answer = (round(float(np.median(a)), 1), round(float(a.mean()), 1))`],
      }),
      num({
        title: 'Penguin mass by species',
        use: ['penguins'],
        starter: 'gentoo = [p["body_mass_g"] for p in penguins if p["species"] == "Gentoo" and p["body_mass_g"] is not None]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. gentoo already holds every real, non-missing Gentoo mass.',
        brief: 'Compute the standard deviation (population, `ddof=0`) of `gentoo`, rounded to 2 decimals, in `answer`.',
        reference: py`gentoo = [p["body_mass_g"] for p in penguins if p["species"] == "Gentoo" and p["body_mass_g"] is not None]
answer = round(float(np.asarray(gentoo, dtype=float).std()), 2)`,
        walkthrough: 'Population standard deviation (`ddof=0`, the default) divides by `n`; the sample version (`ddof=1`) divides by `n - 1`, giving a slightly larger number for a finite sample.',
        traps: [py`gentoo = [p["body_mass_g"] for p in penguins if p["species"] == "Gentoo" and p["body_mass_g"] is not None]
answer = round(float(np.asarray(gentoo, dtype=float).std(ddof=1)), 2)`],
      }),
    ],
  },
  {
    id: 'py-probability-simulation',
    title: 'Probability with simulation',
    blurb: 'Independence, conditional probability, and Monte Carlo estimates like the birthday problem.',
    kind: 'code',
    practice: {
      prompt: 'Write `birthday(n, trials=10000, seed=0)`: draw `trials` simulated rooms of `n` people\'s birthdays (days `0` to `364`) with **one call** `rng.integers(0, 365, size=(trials, n))`, and return the fraction of rooms where at least two people share a birthday.',
      starter: 'import numpy as np\n\ndef birthday(n, trials=10000, seed=0):\n    ...\n',
      solution: py`import numpy as np

def birthday(n, trials=10000, seed=0):
    rng = np.random.default_rng(seed)
    days = rng.integers(0, 365, size=(trials, n))
    has_match = [len(set(row)) < n for row in days]
    return float(np.mean(has_match))`,
      samples: ['round(birthday(23, trials=2000, seed=0), 3)'],
      cases: [
        ['A classic case, n=23', 'round(birthday(23, trials=2000, seed=0), 3)'],
        ['A different seed', 'round(birthday(23, trials=2000, seed=1), 3)'],
        ['A larger n gives a higher chance', 'birthday(50, trials=2000, seed=0) > birthday(5, trials=2000, seed=0)'],
        ['n=1 can never match', 'birthday(1, trials=100, seed=0)'],
        ['Returns a fraction between 0 and 1', '0.0 <= birthday(10, trials=500, seed=0) <= 1.0'],
      ],
      traps: [
        py`import numpy as np

def birthday(n, trials=10000, seed=0):
    rng = np.random.default_rng(seed)
    days = rng.integers(0, 366, size=(trials, n))
    has_match = [len(set(row)) < n for row in days]
    return float(np.mean(has_match))`,
        py`import numpy as np

def birthday(n, trials=10000, seed=0):
    rng = np.random.default_rng(seed)
    days = rng.integers(0, 365, size=(trials, n))
    has_match = [len(set(row)) < n for row in days]
    return float(np.sum(has_match))`,
        py`import numpy as np

def birthday(n, trials=10000, seed=0):
    rng = np.random.default_rng(seed)
    days = rng.integers(0, 365, size=(trials, n))
    has_match = [len(set(row)) <= n for row in days]
    return float(np.mean(has_match))`,
      ],
    },
    real: [
      num({
        title: 'Do two flights share a departure hour?',
        use: ['flights'],
        starter: 'sample = [f["hour"] for f in flights[:24]]\nanswer = ...\n',
        given: '# flights is a list of dictionaries. sample already holds the real departure hour of the first 24 flights.',
        brief: 'Using a set, check whether `sample` has **any** repeated hour at all (not every hour need be distinct in 24 flights). Store `True`/`False` in `answer`.',
        reference: py`sample = [f["hour"] for f in flights[:24]]
answer = len(set(sample)) < len(sample)`,
        walkthrough: 'This is the same "collision" idea as the birthday problem, just checked once on real data instead of simulated thousands of times.',
        traps: [py`sample = [f["hour"] for f in flights[:24]]
answer = len(set(sample)) == len(sample)`],
      }),
      num({
        title: 'Simulating shared countries among customers',
        use: ['customers'],
        starter: 'countries = [c["Country"] for c in customers]\nanswer = ...\n',
        given: '# customers is a list of dictionaries. countries already holds every real customer\'s country.',
        brief: 'Using `rng = np.random.default_rng(0)` and **one call** `rng.choice(countries, size=(3000, 5), replace=True)`, estimate the fraction of groups of 5 randomly chosen countries (with replacement) that contain at least one repeat. Round to 3 decimals, in `answer`.',
        reference: py`countries = [c["Country"] for c in customers]
rng = np.random.default_rng(0)
groups = rng.choice(countries, size=(3000, 5), replace=True)
has_match = [len(set(row)) < 5 for row in groups]
answer = round(float(np.mean(has_match)), 3)`,
        walkthrough: 'With real countries (many customers sharing a small set of common countries), a repeat within a group of 5 is actually quite likely.',
        traps: [py`countries = [c["Country"] for c in customers]
rng = np.random.default_rng(1)
groups = rng.choice(countries, size=(3000, 5), replace=True)
has_match = [len(set(row)) < 5 for row in groups]
answer = round(float(np.mean(has_match)), 3)`],
      }),
      num({
        title: 'Estimating a conditional probability from real genres',
        use: ['tracks'],
        starter: 'genre_ids = [t["GenreId"] for t in tracks[:500]]\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. genre_ids already holds 500 real genre ids.',
        brief: 'Estimate `P(GenreId == 1)` among `genre_ids`, as the plain fraction of matches, rounded to 3 decimals, in `answer`.',
        reference: py`genre_ids = [t["GenreId"] for t in tracks[:500]]
answer = round(sum(1 for g in genre_ids if g == 1) / len(genre_ids), 3)`,
        walkthrough: 'A probability estimated from data is just a fraction: count the outcomes you care about, divide by the total.',
        traps: [py`genre_ids = [t["GenreId"] for t in tracks[:500]]
answer = round(sum(1 for g in genre_ids if g != 1) / len(genre_ids), 3)`],
      }),
    ],
  },
  {
    id: 'py-probability-distributions-scipy',
    title: 'Probability distributions with SciPy',
    blurb: 'Normal, binomial, Poisson, exponential and uniform; pdf, cdf, ppf and rvs.',
    kind: 'code',
    practice: {
      prompt: 'Write `at_least(n, p, k)`: return the probability of **at least** `k` successes in `n` independent trials with success probability `p` (a binomial distribution), as a plain float.',
      starter: 'from scipy import stats\n\ndef at_least(n, p, k):\n    ...\n',
      solution: py`from scipy import stats

def at_least(n, p, k):
    return float(1 - stats.binom.cdf(k - 1, n, p))`,
      samples: ['round(at_least(10, 0.5, 5), 4)'],
      cases: [
        ['A fair coin, at least half heads', 'round(at_least(10, 0.5, 5), 4)'],
        ['At least 0 is certain', 'round(at_least(10, 0.3, 0), 4)'],
        ['At least n+1 is impossible', 'round(at_least(5, 0.5, 6), 4)'],
        ['A low-probability event', 'round(at_least(20, 0.05, 3), 4)'],
      ],
      traps: [
        py`from scipy import stats

def at_least(n, p, k):
    return float(1 - stats.binom.cdf(k, n, p))`,
        py`from scipy import stats

def at_least(n, p, k):
    return float(stats.binom.sf(k, n, p))`,
        py`from scipy import stats

def at_least(n, p, k):
    return float(stats.binom.cdf(k - 1, n, p))`,
      ],
    },
    real: [
      sci({
        title: 'At least one delayed flight among a small sample',
        use: ['flights'],
        starter: 'sample = [f["dep_delay"] for f in flights if f["dep_delay"] is not None][:2000]\np = sum(1 for d in sample if d > 15) / len(sample)\nanswer = ...\n',
        given: '# flights is a list of dictionaries. p already holds the real observed fraction of "late" (dep_delay > 15) flights.',
        brief: 'Treating `p` as a per-flight probability of being late, use the binomial distribution to find the probability that **at least 3 of 10** flights are late. Round to 4 decimals, in `answer`.',
        reference: py`sample = [f["dep_delay"] for f in flights if f["dep_delay"] is not None][:2000]
p = sum(1 for d in sample if d > 15) / len(sample)
answer = round(float(1 - stats.binom.cdf(2, 10, p)), 4)`,
        walkthrough: 'This treats each flight as an independent trial with the observed real late-rate as its probability — a simplification (real delays cluster by weather and route), but a useful first estimate.',
        traps: [py`sample = [f["dep_delay"] for f in flights if f["dep_delay"] is not None][:2000]
p = sum(1 for d in sample if d > 15) / len(sample)
answer = round(float(1 - stats.binom.cdf(3, 10, p)), 4)`],
      }),
      sci({
        title: "How unusual is a penguin's mass?",
        use: ['penguins'],
        starter: 'masses = [p["body_mass_g"] for p in penguins if p["species"] == "Adelie" and p["body_mass_g"] is not None]\nimport numpy as np\nmu, sigma = np.mean(masses), np.std(masses)\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. mu and sigma already hold the real mean and std of Adelie mass.',
        brief: 'Modelling Adelie mass as normal with mean `mu` and std `sigma`, find `P(mass > 4000)` using `stats.norm.sf`. Round to 4 decimals, in `answer`.',
        reference: py`masses = [p["body_mass_g"] for p in penguins if p["species"] == "Adelie" and p["body_mass_g"] is not None]
import numpy as np
mu, sigma = np.mean(masses), np.std(masses)
answer = round(float(stats.norm.sf(4000, loc=mu, scale=sigma)), 4)`,
        walkthrough: '`stats.norm.sf(x, loc, scale)` is `1 - cdf(x)`, the probability of exceeding `x` under a normal distribution with the given mean and standard deviation.',
        traps: [py`masses = [p["body_mass_g"] for p in penguins if p["species"] == "Adelie" and p["body_mass_g"] is not None]
import numpy as np
mu, sigma = np.mean(masses), np.std(masses)
answer = round(float(stats.norm.cdf(4000, loc=mu, scale=sigma)), 4)`],
      }),
      sci({
        title: "Modelling Amazon playlist counts as Poisson",
        use: ['songs'],
        starter: 'counts = [s["amazon_playlist_count"] for s in songs if s["amazon_playlist_count"] is not None][:500]\nimport numpy as np\nrate = float(np.mean(counts))\nanswer = ...\n',
        given: '# songs is a list of dictionaries. rate already holds the real average playlist count.',
        brief: "Modelling the counts as Poisson with mean `rate`, find `P(X > rate)` (the probability a song exceeds the average) using `stats.poisson.sf`. Round to 4 decimals, in `answer`.",
        reference: py`counts = [s["amazon_playlist_count"] for s in songs if s["amazon_playlist_count"] is not None][:500]
import numpy as np
rate = float(np.mean(counts))
answer = round(float(stats.poisson.sf(rate, rate)), 4)`,
        walkthrough: 'The Poisson distribution models counts of independent events over a fixed interval, parameterised by just their mean rate; `sf` (the survival function) gives the probability of exceeding a value directly.',
        traps: [py`counts = [s["amazon_playlist_count"] for s in songs if s["amazon_playlist_count"] is not None][:500]
import numpy as np
rate = float(np.mean(counts))
answer = round(float(stats.poisson.cdf(rate, rate)), 4)`],
      }),
    ],
  },
  {
    id: 'py-sampling-ci-bootstrap',
    title: 'Sampling, confidence intervals and the bootstrap',
    blurb: 'Standard error, confidence intervals by formula and by bootstrap resampling.',
    kind: 'code',
    practice: {
      prompt: 'Write `bootstrap_ci(a, seed=0)`: using `rng = np.random.default_rng(seed)`, draw **2000 bootstrap resamples** with **one call** `rng.choice(a, size=(2000, len(a)), replace=True)`, compute each resample\'s mean, and return the `(2.5th, 97.5th)` percentile of those means as a 95% confidence interval, each rounded to 3 decimals.',
      starter: 'import numpy as np\n\ndef bootstrap_ci(a, seed=0):\n    ...\n',
      solution: py`import numpy as np

def bootstrap_ci(a, seed=0):
    a = np.asarray(a, dtype=float)
    rng = np.random.default_rng(seed)
    samples = rng.choice(a, size=(2000, len(a)), replace=True)
    means = samples.mean(axis=1)
    lo, hi = np.percentile(means, [2.5, 97.5])
    return (round(float(lo), 3), round(float(hi), 3))`,
      samples: ['bootstrap_ci([1.0, 2.0, 3.0, 4.0, 5.0], seed=0)'],
      cases: [
        ['A small sample', 'bootstrap_ci([1.0, 2.0, 3.0, 4.0, 5.0], seed=0)'],
        ['A different seed', 'bootstrap_ci([1.0, 2.0, 3.0, 4.0, 5.0], seed=1)'],
        ['The interval contains the sample mean', 'lo, hi = bootstrap_ci([10.0, 12.0, 11.0, 13.0, 9.0], seed=0)\nlo <= 11.0 <= hi'],
        ['A tighter sample gives a tighter interval', 'lo1, hi1 = bootstrap_ci([10.0] * 20, seed=0)\n(hi1 - lo1) < 0.01'],
      ],
      traps: [
        py`import numpy as np

def bootstrap_ci(a, seed=0):
    a = np.asarray(a, dtype=float)
    rng = np.random.default_rng(seed)
    samples = rng.choice(a, size=(2000, len(a)), replace=False)
    means = samples.mean(axis=1)
    lo, hi = np.percentile(means, [2.5, 97.5])
    return (round(float(lo), 3), round(float(hi), 3))`,
        py`import numpy as np

def bootstrap_ci(a, seed=0):
    a = np.asarray(a, dtype=float)
    rng = np.random.default_rng(seed)
    samples = rng.choice(a, size=(2000, len(a)), replace=True)
    means = samples.mean(axis=1)
    lo, hi = np.percentile(means, [5, 95])
    return (round(float(lo), 3), round(float(hi), 3))`,
      ],
    },
    real: [
      num({
        title: 'A bootstrap interval for average delay',
        use: ['flights'],
        starter: 'sample = [f["dep_delay"] for f in flights if f["dep_delay"] is not None and f["carrier"] == "DL"][:80]\nanswer = ...\n',
        given: '# flights is a list of dictionaries. sample already holds up to 80 real Delta delays.',
        brief: 'Compute a 95% bootstrap confidence interval for the mean of `sample`, seeded with `0`, using the same approach as the practice. Store it in `answer`.',
        reference: py`sample = [f["dep_delay"] for f in flights if f["dep_delay"] is not None and f["carrier"] == "DL"][:80]
a = np.asarray(sample, dtype=float)
rng = np.random.default_rng(0)
samples = rng.choice(a, size=(2000, len(a)), replace=True)
means = samples.mean(axis=1)
lo, hi = np.percentile(means, [2.5, 97.5])
answer = (round(float(lo), 3), round(float(hi), 3))`,
        walkthrough: 'The bootstrap approximates the sampling distribution of the mean by resampling the data itself, with replacement, many times.',
        traps: [py`sample = [f["dep_delay"] for f in flights if f["dep_delay"] is not None and f["carrier"] == "DL"][:80]
a = np.asarray(sample, dtype=float)
rng = np.random.default_rng(0)
samples = rng.choice(a, size=(2000, len(a)), replace=False)
means = samples.mean(axis=1)
lo, hi = np.percentile(means, [2.5, 97.5])
answer = (round(float(lo), 3), round(float(hi), 3))`],
      }),
      num({
        title: 'CI for a difference in penguin mass',
        use: ['penguins'],
        starter: 'adelie = np.array([p["body_mass_g"] for p in penguins if p["species"] == "Adelie" and p["body_mass_g"] is not None], dtype=float)\ngentoo = np.array([p["body_mass_g"] for p in penguins if p["species"] == "Gentoo" and p["body_mass_g"] is not None], dtype=float)\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. adelie and gentoo already hold every real, non-missing mass for each species.',
        brief: "Using `rng = np.random.default_rng(0)`, bootstrap **2000** resampled differences of means (`gentoo_resample.mean() - adelie_resample.mean()`), each resample drawn with its own `rng.choice(..., size=len(...), replace=True)` call (Gentoo first, then Adelie, in that order, inside one loop of 2000 iterations). Store the 95% interval, rounded to 1 decimal, in `answer`.",
        reference: py`adelie = np.array([p["body_mass_g"] for p in penguins if p["species"] == "Adelie" and p["body_mass_g"] is not None], dtype=float)
gentoo = np.array([p["body_mass_g"] for p in penguins if p["species"] == "Gentoo" and p["body_mass_g"] is not None], dtype=float)
rng = np.random.default_rng(0)
diffs = []
for _ in range(2000):
    g_sample = rng.choice(gentoo, size=len(gentoo), replace=True)
    a_sample = rng.choice(adelie, size=len(adelie), replace=True)
    diffs.append(g_sample.mean() - a_sample.mean())
lo, hi = np.percentile(diffs, [2.5, 97.5])
answer = (round(float(lo), 1), round(float(hi), 1))`,
        walkthrough: 'Bootstrapping a **difference** just means resampling both groups independently, many times, and looking at the distribution of the differences between their resampled means.',
        traps: [py`adelie = np.array([p["body_mass_g"] for p in penguins if p["species"] == "Adelie" and p["body_mass_g"] is not None], dtype=float)
gentoo = np.array([p["body_mass_g"] for p in penguins if p["species"] == "Gentoo" and p["body_mass_g"] is not None], dtype=float)
rng = np.random.default_rng(0)
diffs = []
for _ in range(2000):
    a_sample = rng.choice(adelie, size=len(adelie), replace=True)
    g_sample = rng.choice(gentoo, size=len(gentoo), replace=True)
    diffs.append(g_sample.mean() - a_sample.mean())
lo, hi = np.percentile(diffs, [2.5, 97.5])
answer = (round(float(lo), 1), round(float(hi), 1))`],
      }),
      num({
        title: 'Comparing an explicit mean-fill to the bootstrap width',
        use: ['songs'],
        starter: 'sample = [s["spotify_streams"] for s in songs if s["spotify_streams"] is not None][:60]\nanswer = ...\n',
        given: '# songs is a list of dictionaries. sample already holds 60 real stream counts.',
        brief: 'Compute a 95% bootstrap CI for the mean of `sample` (seed `0`, same method as the practice). Store the **width** of the interval (`hi - lo`), rounded to 1 decimal, in `answer`.',
        reference: py`sample = [s["spotify_streams"] for s in songs if s["spotify_streams"] is not None][:60]
a = np.asarray(sample, dtype=float)
rng = np.random.default_rng(0)
samples = rng.choice(a, size=(2000, len(a)), replace=True)
means = samples.mean(axis=1)
lo, hi = np.percentile(means, [2.5, 97.5])
answer = round(float(hi - lo), 1)`,
        walkthrough: 'The width of a bootstrap interval reflects how much the mean could plausibly vary if the same sampling process were repeated — wider for more variable or smaller samples.',
        traps: [py`sample = [s["spotify_streams"] for s in songs if s["spotify_streams"] is not None][:60]
a = np.asarray(sample, dtype=float)
rng = np.random.default_rng(0)
samples = rng.choice(a, size=(2000, len(a)), replace=True)
means = samples.mean(axis=1)
lo, hi = np.percentile(means, [5, 95])
answer = round(float(hi - lo), 1)`],
      }),
    ],
  },
  {
    id: 'py-hypothesis-testing',
    title: 'Hypothesis testing: t-tests, chi-square and ANOVA',
    blurb: 'Null and alternative hypotheses, t-tests, chi-square, one-way ANOVA and effect sizes.',
    kind: 'code',
    practice: {
      prompt: 'Write `two_sample_t(a, b)`: run an independent two-sample t-test (equal variances assumed, the default) and return `(statistic, p_value)`, each rounded to 4 decimals.',
      starter: 'from scipy import stats\n\ndef two_sample_t(a, b):\n    ...\n',
      solution: py`from scipy import stats

def two_sample_t(a, b):
    result = stats.ttest_ind(a, b)
    return (round(float(result.statistic), 4), round(float(result.pvalue), 4))`,
      samples: ['two_sample_t([1.0, 2.0, 3.0], [4.0, 5.0, 6.0])'],
      cases: [
        ['Two clearly different groups', 'two_sample_t([1.0, 2.0, 3.0], [4.0, 5.0, 6.0])'],
        ['Identical groups give t near zero', 'two_sample_t([1.0, 2.0, 3.0], [1.0, 2.0, 3.0])'],
        ['Order affects the sign of t, not the p-value', 't1, p1 = two_sample_t([1.0, 2.0, 3.0], [4.0, 5.0, 6.0])\nt2, p2 = two_sample_t([4.0, 5.0, 6.0], [1.0, 2.0, 3.0])\n(round(t1, 2) == round(-t2, 2), round(p1, 4) == round(p2, 4))'],
        ['Groups with very different variances and sizes', 'two_sample_t([1.0, 10.0, 20.0, 30.0, 2.0, 15.0], [10.0, 10.1, 9.9, 10.0])'],
      ],
      traps: [
        py`from scipy import stats

def two_sample_t(a, b):
    result = stats.ttest_ind(a, b, equal_var=False)
    return (round(float(result.statistic), 4), round(float(result.pvalue), 4))`,
        py`from scipy import stats

def two_sample_t(a, b):
    result = stats.ttest_ind(b, a)
    return (round(float(result.statistic), 4), round(float(result.pvalue), 4))`,
      ],
    },
    real: [
      sci({
        title: 'Do Adelie and Gentoo differ in mass?',
        use: ['penguins'],
        starter: 'adelie = [p["body_mass_g"] for p in penguins if p["species"] == "Adelie" and p["body_mass_g"] is not None]\ngentoo = [p["body_mass_g"] for p in penguins if p["species"] == "Gentoo" and p["body_mass_g"] is not None]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. adelie and gentoo already hold every real, non-missing mass for each species.',
        brief: 'Run a two-sample t-test between `adelie` and `gentoo`. Store `(statistic, p_value)`, each rounded to 4 decimals, in `answer`.',
        reference: py`adelie = [p["body_mass_g"] for p in penguins if p["species"] == "Adelie" and p["body_mass_g"] is not None]
gentoo = [p["body_mass_g"] for p in penguins if p["species"] == "Gentoo" and p["body_mass_g"] is not None]
result = stats.ttest_ind(adelie, gentoo)
answer = (round(float(result.statistic), 4), round(float(result.pvalue), 4))`,
        walkthrough: 'Gentoo penguins are substantially heavier than Adelie in this dataset, so the test should find an extremely small p-value here.',
        traps: [py`adelie = [p["body_mass_g"] for p in penguins if p["species"] == "Adelie" and p["body_mass_g"] is not None]
gentoo = [p["body_mass_g"] for p in penguins if p["species"] == "Gentoo" and p["body_mass_g"] is not None]
result = stats.ttest_ind(gentoo, adelie)
answer = (round(float(result.statistic), 4), round(float(result.pvalue), 4))`],
      }),
      sci({
        title: 'Weekday versus weekend delays',
        use: ['flights'],
        starter: 'import pandas as pd\nweekday_names = pd.to_datetime([f["flight_date"] for f in flights[:3000]]).day_name()\ndelays = [f["dep_delay"] for f in flights[:3000]]\nweekday = [d for d, name in zip(delays, weekday_names) if d is not None and name not in ("Saturday", "Sunday")]\nweekend = [d for d, name in zip(delays, weekday_names) if d is not None and name in ("Saturday", "Sunday")]\nanswer = ...\n',
        given: '# flights is a list of dictionaries. weekday and weekend already hold real, non-missing delays split by day type.',
        brief: 'Run a two-sample t-test between `weekday` and `weekend` delays. Store `(statistic, p_value)`, each rounded to 4 decimals, in `answer`.',
        reference: py`import pandas as pd
weekday_names = pd.to_datetime([f["flight_date"] for f in flights[:3000]]).day_name()
delays = [f["dep_delay"] for f in flights[:3000]]
weekday = [d for d, name in zip(delays, weekday_names) if d is not None and name not in ("Saturday", "Sunday")]
weekend = [d for d, name in zip(delays, weekday_names) if d is not None and name in ("Saturday", "Sunday")]
result = stats.ttest_ind(weekday, weekend)
answer = (round(float(result.statistic), 4), round(float(result.pvalue), 4))`,
        walkthrough: 'A t-test does not care how the two groups were defined — splitting by weekday versus weekend is just another two-sample comparison.',
        traps: [py`import pandas as pd
weekday_names = pd.to_datetime([f["flight_date"] for f in flights[:3000]]).day_name()
delays = [f["dep_delay"] for f in flights[:3000]]
weekday = [d for d, name in zip(delays, weekday_names) if d is not None and name not in ("Saturday", "Sunday")]
weekend = [d for d, name in zip(delays, weekday_names) if d is not None and name in ("Saturday", "Sunday")]
result = stats.ttest_ind(weekday, weekend, equal_var=False)
answer = (round(float(result.statistic), 4), round(float(result.pvalue), 4))`],
      }),
      sci({
        title: 'Explicit versus clean song lengths',
        use: ['songs'],
        starter: 'explicit = [s["spotify_streams"] for s in songs if s["explicit_track"] == 1 and s["spotify_streams"] is not None][:200]\nclean = [s["spotify_streams"] for s in songs if s["explicit_track"] == 0 and s["spotify_streams"] is not None][:200]\nanswer = ...\n',
        given: '# songs is a list of dictionaries. explicit and clean already hold up to 200 real stream counts each.',
        brief: 'Run a two-sample t-test comparing `explicit` and `clean` stream counts. Store `(statistic, p_value)`, each rounded to 4 decimals, in `answer`.',
        reference: py`explicit = [s["spotify_streams"] for s in songs if s["explicit_track"] == 1 and s["spotify_streams"] is not None][:200]
clean = [s["spotify_streams"] for s in songs if s["explicit_track"] == 0 and s["spotify_streams"] is not None][:200]
result = stats.ttest_ind(explicit, clean)
answer = (round(float(result.statistic), 4), round(float(result.pvalue), 4))`,
        walkthrough: 'A large p-value here would mean the data does not give strong evidence of a real difference — a legitimate, informative result, not a failed test.',
        traps: [py`explicit = [s["spotify_streams"] for s in songs if s["explicit_track"] == 1 and s["spotify_streams"] is not None][:200]
clean = [s["spotify_streams"] for s in songs if s["explicit_track"] == 0 and s["spotify_streams"] is not None][:200]
result = stats.ttest_ind(clean, explicit)
answer = (round(float(result.statistic), 4), round(float(result.pvalue), 4))`],
      }),
    ],
  },
]
