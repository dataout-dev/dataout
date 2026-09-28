Beyond a single default chart, matplotlib lets you control size, layout, annotations and overall look — the difference between "a chart" and "a chart that reads clearly at the size it will actually be shown".

You will learn:

- figure size and dpi
- subplots for several charts in a grid
- `annotate` and reference lines
- style sheets and `rcParams`

## Figure size and dpi

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 3), dpi=100)
print(fig.get_size_inches(), fig.dpi)
```

`figsize=(width, height)` is in inches; `dpi` (dots per inch) determines the actual pixel dimensions of a saved image — `figsize=(8, 3)` at `dpi=100` saves as 800×300 pixels.

## Subplots

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2)
print(axes.shape)
axes[0, 0].plot([1, 2, 3])
axes[1, 1].bar(["a", "b"], [3, 5])
```

`plt.subplots(rows, cols)` returns a 2-D array of axes when both are greater than 1 (a plain 1-D array when only one is), indexed exactly like a NumPy array.

## Shared axes

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, sharey=True)
axes[0].plot([1, 2, 3], [10, 50, 20])
axes[1].plot([1, 2, 3], [15, 25, 45])
print(axes[0].get_ylim() == axes[1].get_ylim())
```

`sharey=True` (or `sharex=True`) forces subplots to use the same scale, which matters whenever two panels are meant to be compared directly.

## annotate and reference lines

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3, 4], [10, 40, 15, 30])
ax.annotate("peak", xy=(2, 40), xytext=(2.5, 42))
ax.axhline(20, linestyle="--", color="gray")
print(len(ax.texts), len(ax.lines))
```

`annotate(text, xy, xytext)` draws a label at `xytext`, optionally with an arrow pointing at `xy`. `axhline`/`axvline` draw a horizontal/vertical reference line all the way across the axes — useful for marking a threshold or a target.

## Style sheets and rcParams

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

print(plt.style.available[:3])
with plt.style.context("dark_background"):
    fig, ax = plt.subplots()
    ax.plot([1, 2, 3])
```

A style sheet changes many defaults (colours, grid lines, fonts) at once; `plt.style.context(...)` applies one temporarily, without affecting charts drawn outside the `with` block. `plt.rcParams` exposes the same settings individually, for a one-off tweak instead of a whole style.

## Watch out: overlapping labels

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.bar(["Very Long Category Name A", "Very Long Category Name B"], [3, 5])
fig.autofmt_xdate(rotation=30)
```

Long category labels on a shared axis tend to overlap; rotating them (`autofmt_xdate`, or `plt.setp(ax.get_xticklabels(), rotation=...)`) is usually the quickest real fix.

## Common mistakes

- Choosing a `figsize` without considering the actual size the chart will be displayed at.
- Forgetting `sharex`/`sharey` when two subplots really need to be compared on the same scale.
- Adding an annotation but never checking `xy`/`xytext` actually land where intended.
- Applying a style sheet globally when a `with plt.style.context(...)` block would have kept the change local.

## Recap

- `figsize` and `dpi` together determine a saved image's real pixel dimensions.
- `plt.subplots(rows, cols)` returns a 2-D array of axes, indexed like NumPy.
- `annotate` labels a specific point; `axhline`/`axvline` draw a full reference line.
- Style sheets change many defaults at once; `plt.style.context(...)` scopes that change to a `with` block.

## Your turn

In the **Practice** tab you write `grid_fig()`. Then three challenges use real flight data.
