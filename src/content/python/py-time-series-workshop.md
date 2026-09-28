A workshop lesson: no new functions, just combining dates, resampling, rolling windows and grouping to answer real questions about how something changes over time.

You will learn:

- building and using a DatetimeIndex
- resampling to daily and weekly views
- spotting a rolling trend
- seasonality by hour and weekday

## Building a DatetimeIndex

```python
import pandas as pd

dates = pd.date_range("2024-01-01", periods=10, freq="D")
s = pd.Series(range(10), index=dates)
print(s)
print(s["2024-01-03":"2024-01-05"])
```

Once dates are the **index** (rather than a plain column), slicing by a date range reads almost like plain English.

## Resampling to daily and weekly

```python
import pandas as pd

dates = pd.date_range("2024-01-01", periods=14, freq="D")
s = pd.Series(range(14), index=dates)
print(s.resample("W").sum())
```

## A rolling trend

```python
import pandas as pd

dates = pd.date_range("2024-01-01", periods=10, freq="D")
s = pd.Series([5, 6, 4, 20, 5, 6, 7, 4, 5, 6], index=dates)
print(s.rolling(3, min_periods=1).mean())
```

A short rolling average smooths out a single unusual day (like the `20` here) enough to see the underlying trend more clearly, without hiding it entirely the way a single overall average would.

## Seasonality by hour and weekday

```python
import pandas as pd

dates = pd.date_range("2024-01-01", periods=48, freq="h")
s = pd.Series(range(48), index=dates)
by_hour = s.groupby(s.index.hour).mean()
print(by_hour)
```

Grouping a time-indexed Series by `.index.hour` (or `.index.day_name()` for weekday) reveals patterns that repeat on a cycle — busier mornings, quieter weekends — which a plain trend line would average away.

## Comparing periods

```python
import pandas as pd

dates = pd.date_range("2024-01-01", periods=4, freq="ME")
s = pd.Series([100, 120, 90, 130], index=dates)
print(s.pct_change())
```

`.pct_change()` on a resampled series is a quick way to compare each period to the one before it, as a percentage.

## Handling gaps and time zones

```python
import pandas as pd

dates = pd.to_datetime(["2024-01-01", "2024-01-03"])
s = pd.Series([1, 2], index=dates)
print(s.asfreq("D"))
```

`asfreq("D")` reveals the gap explicitly (`2024-01-02` appears with `NaN`) rather than the data silently pretending every day was covered.

## Common mistakes

- Slicing or resampling a Series whose index is not actually a proper `DatetimeIndex` yet.
- Averaging over a whole series when the real pattern only shows up by hour or weekday.
- Comparing periods with `.diff()` when a relative `.pct_change()` was the more meaningful comparison (or the reverse).
- Assuming a time series has no gaps without checking with `asfreq`.

## Recap

- A `DatetimeIndex` makes date-range slicing and resampling read naturally.
- `resample` aggregates into new time buckets; a short rolling window reveals a trend without one outlier dominating it.
- Grouping by `.index.hour`/`.index.day_name()` surfaces cyclical seasonality that a plain trend hides.
- `asfreq` exposes gaps in an otherwise-assumed-complete time series.

## Your turn

In the **Practice** tab you write `busiest_day(df)`. Then three challenges use real flight, weather and Spotify data.
