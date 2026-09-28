Before any test or model, a good habit is describing the data itself: where it centres, how spread out it is, and whether a few extreme values might be distorting the simplest summaries.

You will learn:

- location: mean, median, and when they disagree
- spread: standard deviation, percentiles and the IQR
- skew and kurtosis, briefly
- robust statistics, and correlation as a first relationship check

## Location: mean versus median

```python
import numpy as np

typical = np.array([48, 50, 52, 49, 51])
skewed = np.array([48, 50, 52, 49, 500])
print(typical.mean(), np.median(typical))
print(skewed.mean(), np.median(skewed))
```

The mean is pulled hard toward the one extreme value (`500`); the median barely moves. Whenever a distribution might be skewed, or a few outliers might exist, the median is usually the more representative "typical value".

## Spread: standard deviation

```python
import numpy as np

a = np.array([48, 50, 52, 49, 51])
print(a.std())
print(a.std(ddof=1))
```

`ddof=0` (the default) computes the **population** standard deviation, dividing by `n`; `ddof=1` computes the **sample** standard deviation, dividing by `n - 1` — very slightly larger, and the conventional choice when the data is treated as a sample from some larger population.

## Percentiles and the IQR

```python
import numpy as np

a = np.array([1, 3, 5, 7, 9, 11, 13])
q25, q75 = np.percentile(a, [25, 75])
print(q25, q75, q75 - q25)
```

The **interquartile range** (75th percentile minus 25th) covers the middle half of the data — a measure of spread that, like the median, is not thrown off by a few extreme values.

## Skew and kurtosis, briefly

```python
from scipy import stats
import numpy as np

skewed = np.array([1, 2, 2, 3, 3, 3, 20])
print(stats.skew(skewed))
print(stats.kurtosis(skewed))
```

**Skew** measures asymmetry (positive skew means a longer tail toward large values, as here); **kurtosis** measures how heavy the tails are compared to a normal distribution. Both are useful quick checks before assuming a distribution is roughly symmetric or normal.

## Watch out: mean versus median under outliers

```python
import numpy as np

salaries = np.array([40000, 42000, 45000, 43000, 41000, 500000])
print(salaries.mean())
print(np.median(salaries))
```

A single unusually large value (one very high salary here) can make the mean a genuinely misleading summary of "what is typical" — always worth checking the median alongside it, especially for anything money- or size-related, which tends to be right-skewed in practice.

## Correlation as a first relationship check

```python
import numpy as np

x = np.array([1, 2, 3, 4, 5])
y = np.array([2, 4, 5, 4, 5])
print(np.corrcoef(x, y)[0, 1])
```

`np.corrcoef` returns the full correlation matrix; `[0, 1]` picks out the correlation between the two variables — a quick first look at whether two numeric columns move together, before any formal test.

## Common mistakes

- Reporting only the mean when the data might be skewed, hiding a very different median.
- Confusing `ddof=0` and `ddof=1`, especially when comparing a result against a formula or another tool with a different default.
- Treating the IQR as if it were the full range of the data, rather than just the middle half.
- Reading a single correlation number as proof of causation, rather than just an observed association.

## Recap

- Mean and median can disagree substantially under skew or outliers; check both.
- `ddof=0` (population) versus `ddof=1` (sample) standard deviation differ slightly, by convention, not by correctness.
- The IQR (75th minus 25th percentile) is a robust measure of spread.
- `np.corrcoef` gives a quick first read on whether two variables move together.

## Your turn

In the **Practice** tab you write `describe(a)`. Then three challenges use real data.
