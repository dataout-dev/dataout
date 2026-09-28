pandas objects can plot themselves directly — `Series.plot()`/`DataFrame.plot()` are thin wrappers around matplotlib, convenient for a quick look without building the axes by hand every time.

You will learn:

- `DataFrame.plot` and its `kind=` options
- plotting several groups at once
- date axes, and where a resample fits in
- when a secondary axis helps, and when it misleads

## DataFrame.plot and kinds

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

df = pd.DataFrame({"score": [95, 40, 88, 60]}, index=["Ada", "Bo", "Cy", "Di"])
ax = df["score"].plot(kind="bar")
print(len(ax.patches))
```

`kind="line"` (the default), `"bar"`, `"hist"`, `"box"`, `"scatter"` and more all route through the same `.plot()` call, choosing which matplotlib method actually gets used underneath.

## Plotting groups

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

df = pd.DataFrame({"month": [1, 1, 2, 2], "team": ["A", "B", "A", "B"], "score": [10, 20, 15, 25]})
pivoted = df.pivot(index="month", columns="team", values="score")
ax = pivoted.plot()
print(len(ax.get_lines()))
```

Reshaping to wide form first (one column per group, as covered in an earlier lesson) means `.plot()` draws one line **per column** automatically, with a legend built from the column names.

## Date axes

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

s = pd.Series([1, 3, 2], index=pd.date_range("2024-01-01", periods=3))
ax = s.plot()
print(ax.get_lines()[0].get_xdata())
```

When the index is already a `DatetimeIndex`, `.plot()` automatically formats the x-axis to read as dates, without any extra configuration.

## Where resample fits in

```python
import pandas as pd

idx = pd.date_range("2024-01-01", periods=48, freq="h")
s = pd.Series(range(48), index=idx)
daily = s.resample("D").mean()
print(len(s), len(daily))
```

Resampling **before** plotting turns 48 hourly points into 2 daily ones — deciding the right granularity for the chart is a data question, answered before the chart is even drawn, not something the plotting call itself should be doing.

## Rolling overlays

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

s = pd.Series([5, 8, 3, 9, 4, 7, 6], index=pd.date_range("2024-01-01", periods=7))
ax = s.plot()
s.rolling(3, min_periods=1).mean().plot(ax=ax)
print(len(ax.get_lines()))
```

Passing `ax=ax` to a second `.plot()` call draws it onto the **same** axes as the first, rather than creating a new figure — the pandas equivalent of matplotlib's `ax.plot(...)` called twice.

## Watch out: the index used as x by accident

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

df = pd.DataFrame({"value": [10, 20, 30]})
ax = df["value"].plot()
print(ax.get_lines()[0].get_xdata())
```

Without a meaningful index, `.plot()` still runs — using the default `0, 1, 2, ...` positions as x, which is easy to mistake for "the real x-axis" if the intended x values were actually meant to come from a different column entirely.

## Common mistakes

- Plotting before resampling, then wondering why a chart looks noisier than expected.
- Forgetting `ax=ax` and getting a second, separate figure instead of an overlay.
- Assuming the plotted x-axis is meaningful without checking what the index actually contains.
- Reaching for `kind="bar"`/`"hist"`/etc. without checking pandas' `.plot` actually supports the exact option needed, and falling back to matplotlib directly when it does not.

## Recap

- `.plot(kind=...)` is a convenient wrapper; it still ultimately calls matplotlib underneath.
- Reshaping to wide form first lets `.plot()` draw one line per group automatically.
- A `DatetimeIndex` formats the x-axis as dates automatically; resample **before** plotting to choose the right granularity.
- Pass `ax=ax` to overlay a second pandas plot onto an existing chart.

## Your turn

In the **Practice** tab you write `series_plot(s)`. Then three challenges use real flight data.
