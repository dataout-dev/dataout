Dates need their own tools: parsing text into real dates, pulling out parts of them, doing arithmetic, and — for a whole time series — resampling to a different frequency.

You will learn:

- `pd.to_datetime` and common formats
- the `.dt` accessor
- date arithmetic
- `resample` and `asfreq`
- a first look at time zones

## Parsing dates

```python
import pandas as pd

s = pd.Series(["2024-01-05", "2024-02-14", "2024-03-01"])
dates = pd.to_datetime(s)
print(dates)
print(dates.dtype)
```

## The .dt accessor

```python
import pandas as pd

dates = pd.to_datetime(pd.Series(["2024-01-05", "2024-07-14"]))
print(dates.dt.year)
print(dates.dt.month)
print(dates.dt.day_name())
print(dates.dt.is_month_start)
```

`.dt` unlocks a whole family of date-aware properties and methods, the same way `.str` does for text.

## Date arithmetic

```python
import pandas as pd

dates = pd.to_datetime(pd.Series(["2024-01-05", "2024-01-20"]))
print(dates + pd.Timedelta(days=7))
print(dates.diff())
```

`pd.Timedelta` represents a span of time, which can be added to or subtracted from a date; `.diff()` on a Series of dates gives the gap between consecutive entries.

## resample and asfreq

`resample` groups a **time-indexed** Series or DataFrame into buckets (daily, weekly, monthly, ...) and lets you aggregate each one, similar in spirit to `groupby` but for time:

```python
import pandas as pd

idx = pd.date_range("2024-01-01", periods=6, freq="D")
s = pd.Series([1, 2, 3, 4, 5, 6], index=idx)
print(s.resample("2D").sum())
print(s.asfreq("D"))
```

`resample("2D").sum()` buckets every 2 days and sums within each bucket. `asfreq` instead just re-samples onto a new fixed frequency, without aggregating — useful for filling gaps in an already-regular series.

## period versus timestamp

```python
import pandas as pd

p = pd.Period("2024-03", freq="M")
print(p, p.start_time, p.end_time)
```

A `Timestamp` is a single instant; a `Period` represents a whole **span** (like "the month of March 2024") and knows its own start and end.

## Time zones

```python
import pandas as pd

naive = pd.Timestamp("2024-01-01 12:00")
aware = naive.tz_localize("UTC")
print(aware)
print(aware.tz_convert("US/Eastern"))
```

`tz_localize` attaches a time zone to a "naive" timestamp that did not have one; `tz_convert` reinterprets an already-aware timestamp in a different zone, without changing the actual instant in time.

## Watch out: parsing day-first dates

```python
import pandas as pd

print(pd.to_datetime("03/04/2024"))
print(pd.to_datetime("03/04/2024", dayfirst=True))
```

`"03/04/2024"` is genuinely ambiguous between month-first and day-first conventions; without `dayfirst=True`, pandas assumes month-first (US-style) by default, which silently swaps the day and month for data written the other way.

## Common mistakes

- Assuming an ambiguous date string like `"03/04/2024"` parses the way you expect, without checking `dayfirst`.
- Calling `.dt` on a column that has not actually been converted with `pd.to_datetime` yet.
- Confusing `resample` (which aggregates into new time buckets) with `asfreq` (which just re-samples onto a frequency).
- Comparing a timezone-aware timestamp with a naive one, which pandas refuses rather than guessing.

## Recap

- `pd.to_datetime` parses text into real dates; `.dt` then exposes year/month/weekday and more.
- `resample` groups by time and aggregates; `asfreq` just changes the frequency.
- A `Period` represents a span of time and knows its own start and end; a `Timestamp` is a single instant.
- Ambiguous date formats need `dayfirst=True` (or an explicit `format=`) to parse correctly.

## Your turn

In the **Practice** tab you write `per_weekday(df, col)`. Then three challenges use real flight dates.
