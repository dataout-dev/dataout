SciPy's `stats` module implements dozens of probability distributions, each with the same consistent interface: `pdf`/`pmf`, `cdf`, `ppf` and `rvs` — once you know these four, you know how to use any of them.

You will learn:

- the normal, binomial, Poisson, exponential and uniform distributions
- `pdf`/`pmf`, `cdf`, `ppf` and `rvs`
- fitting a distribution to data
- choosing a distribution from the data's shape

## The four core methods

```python
from scipy import stats

dist = stats.norm(loc=0, scale=1)
print(dist.pdf(0))
print(dist.cdf(0))
print(dist.ppf(0.5))
print(dist.rvs(size=3, random_state=0))
```

`pdf(x)` (or `pmf` for a discrete distribution) is the density/probability **at** `x`. `cdf(x)` is `P(X <= x)`. `ppf(q)` is the **inverse** of `cdf` — "what value has this proportion below it?". `rvs(size, random_state)` draws random samples.

## Binomial and Poisson: discrete counts

```python
from scipy import stats

print(stats.binom.pmf(3, n=10, p=0.5))
print(stats.binom.cdf(3, n=10, p=0.5))
print(stats.poisson.pmf(2, mu=3))
```

Binomial models the count of successes in a fixed number of independent yes/no trials; Poisson models the count of rare, independent events over a fixed interval, given just their average rate.

## Normal, exponential and uniform: continuous values

```python
from scipy import stats

print(stats.norm.pdf(1, loc=0, scale=1))
print(stats.expon.cdf(2, scale=1))
print(stats.uniform.cdf(0.5, loc=0, scale=1))
```

The normal distribution is the familiar bell curve; exponential models the time between independent events happening at a constant rate; uniform gives every value in a range equal density.

## "At least k" with the survival function

```python
from scipy import stats

k = 3
n, p = 10, 0.5
print(1 - stats.binom.cdf(k - 1, n, p))
print(stats.binom.sf(k - 1, n, p))
```

`sf(x)` ("survival function") is exactly `1 - cdf(x)`, computed with better numerical precision for very small probabilities — both give "at least `k`" once the off-by-one (`k - 1`, since `cdf` is `P(X <= x)`) is accounted for.

## Fitting a distribution to data

```python
from scipy import stats
import numpy as np

data = np.array([48, 50, 52, 49, 51, 50, 49, 52])
mu, sigma = stats.norm.fit(data)
print(round(mu, 2), round(sigma, 2))
```

`stats.norm.fit(data)` finds the normal distribution's parameters that best match the data — the maximum-likelihood mean and standard deviation, here matching the sample's own values closely.

## Choosing a distribution from shape

A count of rare events (customer complaints per day) suggests Poisson; a naturally bounded yes/no outcome repeated `n` times suggests binomial; a roughly symmetric, bell-shaped continuous measurement suggests normal; a "time until the next event" suggests exponential. This is a starting guess, not a proof — checking the fit (a QQ plot, or comparing observed and theoretical quantiles) matters before relying on it.

## Watch out: assuming normality

```python
from scipy import stats
import numpy as np

skewed = np.array([1, 1, 2, 2, 3, 3, 3, 50])
mu, sigma = stats.norm.fit(skewed)
print(stats.norm.cdf(0, loc=mu, scale=sigma))
```

Fitting a normal distribution to clearly skewed data (like this one, with a single large outlier) still returns *some* numbers, but they describe a bell curve that does not actually resemble the real data — always worth checking the shape first, not just trusting that a fit "worked" because it ran without an error.

## Common mistakes

- Forgetting the `k - 1` adjustment when translating "at least k" into a `cdf` call.
- Using `pdf` (a density) where `pmf` (an actual probability, for a discrete distribution) was needed, or the reverse.
- Fitting a normal distribution to data that is visibly skewed or bounded, without checking the fit makes sense.
- Confusing a distribution's parameters (like binomial's `n`, `p`) with the *result* being computed.

## Recap

- Every SciPy distribution shares the same `pdf`/`pmf`, `cdf`, `ppf`, `rvs` interface.
- `sf(x)` is `1 - cdf(x)`; "at least k" needs `cdf(k - 1)` or `sf(k - 1)`.
- `.fit(data)` estimates a distribution's parameters from data, but does not check the shape actually matches.
- Match the distribution to the real-world shape of the question — counts, times, bounded rates, or continuous measurements — before fitting.

## Your turn

In the **Practice** tab you write `at_least(n, p, k)`. Then three challenges use real data.
