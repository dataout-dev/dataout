A sample's mean is an estimate, not the truth — a different sample would give a slightly different number. A confidence interval expresses that uncertainty directly; the bootstrap estimates it without needing a formula for the specific statistic involved.

You will learn:

- sampling error and standard error
- a confidence interval by formula
- the bootstrap: resampling the data itself
- interpreting a confidence interval correctly

## Sampling error and standard error

```python
import numpy as np

rng = np.random.default_rng(0)
population = rng.normal(loc=50, scale=10, size=100000)
sample = rng.choice(population, size=30, replace=False)
print(population.mean(), sample.mean())
```

The sample mean is close to, but not exactly, the true population mean — that gap is sampling error, unavoidable whenever you only see part of the data.

The **standard error** of the mean estimates how much the sample mean would typically vary from sample to sample, from the formula `std / sqrt(n)`:

```python
import numpy as np

sample = np.array([48, 52, 50, 49, 51, 53, 47])
se = sample.std(ddof=1) / np.sqrt(len(sample))
print(round(se, 3))
```

## A confidence interval by formula

```python
import numpy as np
from scipy import stats

sample = np.array([48, 52, 50, 49, 51, 53, 47])
mean = sample.mean()
se = sample.std(ddof=1) / np.sqrt(len(sample))
margin = stats.t.ppf(0.975, df=len(sample) - 1) * se
print(round(mean - margin, 2), round(mean + margin, 2))
```

This formula-based interval uses the t-distribution (appropriate for a small sample with an unknown true standard deviation) to find how many standard errors wide a 95% interval should be.

## The bootstrap

The bootstrap sidesteps needing a formula for the statistic's exact sampling distribution: resample the data itself, **with replacement**, many times, and look at the spread of the resulting statistic across those resamples.

```python
import numpy as np

sample = np.array([48, 52, 50, 49, 51, 53, 47])
rng = np.random.default_rng(0)
resamples = rng.choice(sample, size=(2000, len(sample)), replace=True)
means = resamples.mean(axis=1)
lo, hi = np.percentile(means, [2.5, 97.5])
print(round(lo, 2), round(hi, 2))
```

Because it only needs a way to compute the statistic (mean, median, a correlation, anything), the bootstrap applies to situations with no convenient formula at all.

## Why replacement matters

```python
import numpy as np

sample = np.array([1, 2, 3, 4, 5])
rng = np.random.default_rng(0)
print(rng.choice(sample, size=5, replace=True))
```

Sampling **with** replacement means the same original value can appear more than once (or not at all) in a resample — essential to the bootstrap, since a resample drawn *without* replacement, the same size as the original, would just be the original data shuffled, with no actual variation to measure.

## Interpreting a confidence interval correctly

A 95% confidence interval does **not** mean "there is a 95% probability the true mean lies in this specific interval" — the true mean is a fixed (if unknown) number, not a random variable. The correct interpretation: if you repeated this whole sampling-and-interval process many times, about 95% of the resulting intervals would contain the true value. It is a statement about the **procedure's** reliability, not a probability about this one particular interval.

## Common mistakes

- Sampling without replacement for a bootstrap, which produces no real resampling variation.
- Interpreting a 95% CI as "95% probability the true value is in here".
- Using the formula-based interval's normal-distribution assumption on a small, clearly non-normal sample, where a bootstrap would be safer.
- Forgetting that a narrower interval from a larger sample reflects more precision, not a "better" true value.

## Recap

- Standard error estimates how much a sample statistic would vary across repeated samples.
- A bootstrap resamples the actual data, with replacement, to estimate a confidence interval for any statistic.
- The correct interpretation of a 95% CI is about the reliability of the *procedure*, not a probability about one specific interval.

## Your turn

In the **Practice** tab you write `bootstrap_ci(a, seed=0)`. Then three challenges use real data.
