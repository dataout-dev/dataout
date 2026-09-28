Window functions compute something from a **neighbourhood** of rows around each point — a moving average, a running total, a change since last time — rather than from the whole column or a single row.

You will learn:

- `rolling` (a fixed-size moving window) and `min_periods`
- `expanding` (a window that always starts from the beginning)
- `ewm` (exponentially weighted, favouring recent values)
- `shift` and `diff`

## rolling

```python
import pandas as pd

s = pd.Series([1.0, 2.0, 3.0, 4.0, 5.0])
print(s.rolling(3).mean())
```

`rolling(3).mean()` averages each value with the 2 before it; the first 2 rows do not have enough history yet, so they are `NaN` by default.

## min_periods

```python
import pandas as pd

s = pd.Series([1.0, 2.0, 3.0, 4.0, 5.0])
print(s.rolling(3, min_periods=1).mean())
```

`min_periods=1` allows the window to compute from whatever is actually available so far, instead of insisting on a full window — the first row is just itself, the second is the average of the first two, and so on.

## centre

```python
import pandas as pd

s = pd.Series([1.0, 2.0, 3.0, 4.0, 5.0])
print(s.rolling(3, center=True).mean())
```

By default a rolling window looks **backwards**; `center=True` instead centres the window on each point, looking both ways.

## expanding

```python
import pandas as pd

s = pd.Series([1.0, 2.0, 3.0, 4.0])
print(s.expanding().sum())
print(s.cumsum())
```

An expanding window always starts from the very first row and grows by one each step — `.expanding().sum()` and `.cumsum()` compute the same running total here, though `.expanding()` also supports `.mean()`, `.std()` and other reductions a plain cumulative function does not.

## ewm: exponentially weighted

```python
import pandas as pd

s = pd.Series([1.0, 1.0, 1.0, 10.0])
print(s.ewm(span=3).mean())
```

An exponentially weighted mean gives more weight to **recent** values and progressively less to older ones, so a sudden change (the `10.0` here) pulls the average toward it faster than a plain rolling mean would.

## shift and diff

```python
import pandas as pd

s = pd.Series([10, 12, 15, 11])
print(s.shift(1))
print(s.diff())
print(s.pct_change())
```

`.shift(1)` moves every value down by one position (the first becomes `NaN`). `.diff()` is exactly `s - s.shift(1)` — the change from the previous row. `.pct_change()` expresses that same change as a fraction of the previous value.

## Watch out: rolling over unsorted data

```python
import pandas as pd

df = pd.DataFrame({"day": [3, 1, 2], "value": [30, 10, 20]})
sorted_df = df.sort_values("day")
print(sorted_df["value"].rolling(2).mean())
```

A rolling (or expanding, or `ewm`) window only makes sense over data that is already in the right **order** — sort by the time or sequence column first, or "the last 3 rows" silently means "whatever 3 rows happened to be sitting there", not "the last 3 in time".

## Common mistakes

- Forgetting `min_periods=1` (or an equivalent) when the first few rows should still produce a value.
- Running a rolling/expanding/`ewm` calculation on data that has not been sorted by the relevant time or sequence column.
- Confusing `.diff()` (an absolute change) with `.pct_change()` (a relative, fractional change).
- Assuming `.rolling(n)` looks forward, when it defaults to looking backward from each row.

## Recap

- `.rolling(n)` computes over a fixed window of the last `n` rows; `min_periods` relaxes the "need a full window" requirement.
- `.expanding()` always starts from row one; `.ewm()` weights recent rows more heavily.
- `.shift`/`.diff`/`.pct_change` compare a row to an earlier one, absolutely or relatively.
- Sort by the relevant order first — a window function is only meaningful over data in the right sequence.

## Your turn

In the **Practice** tab you write `rolling7(s)`. Then three challenges use real flight data.
