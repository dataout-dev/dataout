Real data is rarely complete. pandas represents "missing" with `NaN` (for numbers), `None` (often, for objects/text) or `pd.NA` (for the nullable dtypes) — and gives you explicit tools for finding, dropping, and filling it.

You will learn:

- `isna`/`notna`
- `dropna` options
- `fillna` with a value, a method, or a per-column dict
- `interpolate`, and when missing is actually meaningful

## isna and notna

```python
import pandas as pd

s = pd.Series([1.0, None, 3.0])
print(s.isna())
print(s.notna())
print(s.isna().sum())
```

`.isna()` (and its opposite, `.notna()`) is the only reliable way to check for missing values — `== None` or `== float("nan")` will not work, because a comparison against a missing value is always `False`.

## dropna

```python
import pandas as pd

df = pd.DataFrame({"a": [1.0, None, 3.0], "b": [4.0, 5.0, None]})
print(df.dropna())
print(df.dropna(subset=["a"]))
print(df.dropna(how="all"))
```

Plain `dropna()` drops a row if **any** column is missing. `subset=` restricts the check to specific columns. `how="all"` only drops a row where **every** column is missing.

## fillna

```python
import pandas as pd

df = pd.DataFrame({"a": [1.0, None, 3.0], "b": [None, 5.0, 6.0]})
print(df.fillna(0))
print(df.fillna({"a": 0, "b": -1}))
print(df["a"].fillna(df["a"].median()))
```

A single value fills everywhere; a dict fills each named column differently. Filling with a statistic computed **from the column itself** (its mean, median, or most common value) is a common, reasonable default — but always a choice, never automatically "correct".

## Watch out: filling with the mean before splitting data

If you are building any kind of model or evaluation later in this tier, filling missing values using a statistic computed from the **whole** dataset, before separating training data from test data, leaks a little information from the test set into training. The safe order is: split first, then compute the fill value from the training portion only, and apply that same value to both.

## interpolate

```python
import pandas as pd

s = pd.Series([1.0, None, None, 4.0])
print(s.interpolate())
```

`.interpolate()` fills gaps by estimating a smooth path between the surrounding known values (linear, by default) — often more sensible than a flat fill value for genuinely ordered data, like a time series.

## When missing is meaningful

Not every gap should be filled at all. A missing survey answer might mean "chose not to answer", which is itself informative — filling it with the average response would erase that distinction. Deciding whether "missing" is noise to smooth over or a signal to keep is a judgement call about the data, not a default pandas makes for you.

## Common mistakes

- Comparing to `None`/`NaN` with `==` instead of `.isna()`.
- Filling with a statistic from the full dataset before splitting into training and test data.
- Dropping every row with any missing value, when only one column actually mattered for the task at hand.
- Filling a genuinely meaningful "missing" (like "declined to answer") as if it were noise.

## Recap

- `.isna()`/`.notna()` are the only correct way to detect missing values.
- `dropna` can target specific columns (`subset`) or require every column to be missing (`how="all"`).
- `fillna` accepts a single value, a per-column dict, or (via `.interpolate()`) a smooth estimate between neighbours.
- Whether to fill, and with what, is a judgement about the data — not a mechanical default.

## Your turn

In the **Practice** tab you write `fill_median(df, col)`. Then three challenges use real, genuinely missing flight data.
