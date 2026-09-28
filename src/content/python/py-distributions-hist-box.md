A single summary number (a mean) can hide a lot. Histograms, box plots and violin plots each show the **shape** of a distribution instead — where values cluster, how spread out they are, and whether there are outliers.

You will learn:

- histograms, and how bin choice changes the picture
- box plot anatomy
- violin and strip plots as alternatives
- comparing distributions across groups, and log scales

## Histograms and bins

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

values = [1, 2, 2, 3, 3, 3, 4, 4, 8, 9]
fig, ax = plt.subplots()
counts, edges, patches = ax.hist(values, bins=4)
print(counts.tolist())
print(edges.tolist())
```

`ax.hist` both draws the chart **and** returns the counts and bin edges it used — the same numbers `np.histogram` alone would compute.

## Watch out: choosing bins to fit a story

```python
import numpy as np

values = [1, 2, 2, 3, 3, 3, 4, 4, 8, 9]
print(np.histogram(values, bins=2)[0])
print(np.histogram(values, bins=10)[0])
```

Very few bins can hide real structure (multiple bumps merged into one); very many bins can turn a smooth distribution into visual noise from small-sample randomness. There is no single "correct" bin count — but the choice should be driven by what actually reveals the data's shape, not by which version happens to support a point you want to make.

## Box plot anatomy

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
result = ax.boxplot([2, 4, 4, 5, 5, 5, 6, 6, 20])
print(list(result.keys()))
print(result["medians"][0].get_ydata()[0])
```

A box plot's box spans the 25th to 75th percentile (the interquartile range), with a line at the median; the "whiskers" typically extend to the most extreme point within 1.5× the interquartile range, and anything beyond that is drawn as a separate outlier point — here, the `20` stands out clearly as one.

## Violin and strip plots

A violin plot draws a smoothed density curve (mirrored, for a symmetric shape) instead of the box plot's five discrete summary numbers — closer to a histogram's shape, but easier to compare side-by-side across several groups. A strip plot instead shows every individual point (usually jittered sideways slightly, to reduce overlap), trading a summary shape for full transparency about the actual, individual data. matplotlib's `violinplot` covers the first; a strip plot is easiest built with a scatter of the real values against a categorical position.

## Comparing groups

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

group_a = [10, 12, 11, 13, 12]
group_b = [20, 22, 19, 25, 21]
fig, ax = plt.subplots()
ax.boxplot([group_a, group_b], tick_labels=["A", "B"])
```

Passing a **list of lists** draws one box per group, side by side on the same axes — the natural way to compare distributions rather than just their averages.

## Log scales

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.hist([1, 2, 3, 4, 5, 1000], bins=5)
ax.set_yscale("log")
```

A distribution with a long tail (a few very large values among many small ones) often crowds most of a histogram's bars down near the axis; a log-scaled y-axis makes the smaller bars visible again without changing the underlying counts.

## Common mistakes

- Choosing a bin count that happens to support a preferred conclusion, rather than one that reveals the data's real shape.
- Reading a box plot's whiskers as "the minimum and maximum", when outliers beyond them are drawn separately.
- Comparing group averages by eye on a bar chart, when a box or violin plot would show the (possibly very different) spreads too.
- Forgetting a log scale exists, and drawing a nearly-empty-looking histogram because one tail dominates the linear axis.

## Recap

- `ax.hist` returns the counts and edges it drew; bin choice materially changes what a histogram appears to show.
- A box plot's box is the interquartile range, with a median line and separately-drawn outliers beyond the whiskers.
- Violin plots show a smoothed shape; strip plots show every individual point.
- A log-scaled axis reveals detail hidden by a long tail dominating a linear one.

## Your turn

In the **Practice** tab you write `hist_counts(values, edges)`. Then three challenges use real data.
