matplotlib's **object-oriented interface** — explicit `Figure` and `Axes` objects — is the version worth learning first: it is unambiguous about which chart you are drawing on, which matters the moment more than one chart is involved.

You will learn:

- `fig, ax = plt.subplots()`, and why to prefer it
- `ax.plot`, `ax.bar`, `ax.scatter`
- titles, labels and legends
- reading data back off a chart, and why to avoid the `pyplot` state machine

## The object-oriented interface

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [10, 20, 15])
print(type(fig), type(ax))
```

`plt.subplots()` returns a `Figure` (the whole image) and one or more `Axes` (the actual plotting area, with its own x/y scales) — every drawing call goes through a specific `ax`, never ambiguous about which chart it affects.

`matplotlib.use("Agg")` selects a backend that renders to an image buffer with no on-screen window — the right choice for a script or notebook that never calls `plt.show()`, exactly like every example in this tier.

## plot, bar and scatter

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
print(len(ax.get_lines()))

fig2, ax2 = plt.subplots()
ax2.bar(["a", "b", "c"], [3, 7, 2])
print(len(ax2.patches))

fig3, ax3 = plt.subplots()
ax3.scatter([1, 2, 3], [3, 1, 2])
print(len(ax3.collections))
```

`ax.plot` draws connected lines; `ax.bar` draws rectangles (each one added to `ax.patches`); `ax.scatter` draws individual points as a `PathCollection` (added to `ax.collections`) — three different kinds of artist, each queryable afterwards.

## Titles, labels and legends

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3], label="series A")
ax.set_title("A simple chart")
ax.set_xlabel("x")
ax.set_ylabel("y")
ax.legend()
print(ax.get_title())
```

## Reading data back off a chart

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [10, 20, 30])
line = ax.get_lines()[0]
print(list(line.get_xdata()), list(line.get_ydata()))
```

Every drawing call creates an **artist** object that remembers what it drew; `get_xdata()`/`get_ydata()` (for a line), `get_height()` (for a bar), `get_offsets()` (for a scatter collection) all let you confirm afterwards exactly what ended up on the chart — the same technique this tier's exercises use to check a plot without needing to look at a rendered image.

## Watch out: mixing pyplot and axes calls

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig1, ax1 = plt.subplots()
fig2, ax2 = plt.subplots()
plt.plot([1, 2, 3])
print(len(ax1.get_lines()), len(ax2.get_lines()))
```

`plt.plot(...)` (the older, implicit "state machine" interface) draws onto pyplot's *own* idea of the "current axes" — here, `ax2`, simply because it was created most recently, even if the intent was to keep adding to `ax1`. Once more than one figure is in play, mixing the two styles is a common source of "why didn't my chart show up where I expected" confusion. Stick to calling methods on an explicit `ax` throughout.

## Common mistakes

- Calling `plt.plot`/`plt.bar`/etc. after already creating a named `ax`, instead of calling the method on `ax` directly.
- Forgetting `matplotlib.use("Agg")` (or an equivalent) in a headless environment and hitting a backend error.
- Assuming `ax.get_lines()` includes bars or scatter points; each artist type has its own way of being read back.
- Building several figures without keeping track of which `ax` belongs to which, once there is more than one.

## Recap

- `fig, ax = plt.subplots()` is the standard, unambiguous way to start any matplotlib chart.
- `ax.plot`/`ax.bar`/`ax.scatter` each create their own kind of artist (lines, patches, collections).
- Reading data back with `get_xdata()`/`get_height()`/`get_offsets()` confirms what a chart actually drew.
- Avoid mixing the implicit `plt.*` calls with an explicit `ax` once you have one.

## Your turn

In the **Practice** tab you write `line_chart(x, ys)`. Then three challenges cover lines, bars and a scatter plot on real data.
