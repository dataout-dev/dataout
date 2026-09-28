A few statistical plots are worth building "by hand" from NumPy and matplotlib directly, both because they come up often and because building them clarifies exactly what they show.

You will learn:

- fitting and drawing a regression line by hand
- correlation heat maps
- pair plots, built from a grid of subplots
- ECDF plots

## A regression line by hand

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
y = np.array([2.1, 3.9, 6.2, 7.8, 10.1])
a, b = np.polyfit(x, y, 1)
fig, ax = plt.subplots()
ax.scatter(x, y)
ax.plot(x, a * x + b)
print(round(a, 2), round(b, 2))
```

`np.polyfit(x, y, 1)` fits a straight line by least squares, returning its slope and intercept; plotting `a * x + b` over the same x-range draws the fitted line directly on top of the scatter.

## Correlation heat maps

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3, 4], "b": [2, 4, 6, 8], "c": [4, 3, 2, 1]})
corr = df.corr()
fig, ax = plt.subplots()
im = ax.imshow(corr.values)
fig.colorbar(im)
print(corr.round(2))
```

`.corr()` computes every pairwise correlation at once; `ax.imshow` draws it as a grid of colours, with `fig.colorbar` adding the scale that turns colour back into a number.

## Pair plots from subplots

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

cols = ["a", "b", "c"]
data = {"a": [1, 2, 3], "b": [3, 2, 1], "c": [1, 1, 2]}
fig, axes = plt.subplots(len(cols), len(cols))
for i, row_col in enumerate(cols):
    for j, col_col in enumerate(cols):
        axes[i, j].scatter(data[col_col], data[row_col])
print(axes.shape)
```

A "pair plot" is really just an `n`×`n` grid of scatter plots, one per pair of columns — nothing beyond subplots and a double loop, though dedicated libraries add axis labels and diagonal histograms automatically.

## ECDF plots

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

values = np.array([5, 1, 9, 3, 7])
sorted_values = np.sort(values)
y = np.arange(1, len(sorted_values) + 1) / len(sorted_values)
fig, ax = plt.subplots()
ax.plot(sorted_values, y)
print(y[-1])
```

An empirical cumulative distribution function (ECDF) plots, for every value in sorted order, the fraction of the data at or below it — unlike a histogram, it needs no bin choice at all, and every individual data point is represented exactly once.

## Watch out: plotting summaries without showing the data

A bar chart of group means alone can hide the fact that one group has 3 data points and another has 3,000 — or that a "typical" value is nothing like any real observation, because the group is actually bimodal. Overlaying (or replacing) a summary bar with the individual points, or a box/violin plot showing the real spread, is usually worth the extra step.

## Common mistakes

- Fitting a straight line (`polyfit` degree 1) to data that is clearly curved, and reporting the fit as if it were a good one.
- Forgetting `fig.colorbar` on a heat map, leaving the reader with colours but no scale to read them against.
- Building a pair plot grid without keeping axis labels straight, once there is more than a couple of variables.
- Presenting only a summary statistic's chart when the underlying spread or sample size actually mattered to the conclusion.

## Recap

- `np.polyfit(x, y, 1)` fits a line by least squares; plotting it over the scatter shows the fit directly.
- A correlation heat map is `.corr()` plus `ax.imshow`, always paired with a colour scale.
- A pair plot is an `n`×`n` grid of scatter plots; an ECDF needs no bins and represents every point exactly once.
- A summary chart alone can hide sample size or a distribution's real shape — show the data, not just its average, when that matters.

## Your turn

In the **Practice** tab you write `corr_heatmap(df)`. Then three challenges use real data.
