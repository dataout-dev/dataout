`groupby` is pandas' single most powerful idea: split the rows into groups by one or more keys, compute something for each group, and combine the results back into one answer. Almost every real analysis leans on it.

You will learn:

- how groupby works: split, apply, combine
- grouping by one key or several
- iterating over groups directly
- `size` versus `count`, and `as_index`/`reset_index`

## The basic pattern

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "B", "A", "B", "A"], "score": [10, 20, 30, 15, 25]})
print(df.groupby("team")["score"].mean())
print(df.groupby("team")["score"].sum())
```

`groupby("team")` splits the rows into one group per distinct team; `["score"].mean()` computes the mean within each group, then combines the per-group results into one Series, indexed by team.

## Grouping by several keys

```python
import pandas as pd

df = pd.DataFrame({
    "team": ["A", "A", "B", "B"],
    "quarter": ["Q1", "Q2", "Q1", "Q2"],
    "score": [10, 20, 30, 40],
})
print(df.groupby(["team", "quarter"])["score"].sum())
```

Grouping by a list of columns produces one result per **combination** of the keys, with a two-level index.

## Iterating over groups

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "B", "A"], "score": [10, 20, 30]})
for team, group in df.groupby("team"):
    print(team, "->", len(group), "rows")
```

Directly looping over a `groupby` object yields `(key, sub-DataFrame)` pairs — useful for exploring what each group actually contains, though most real work uses `.agg`/`.transform` (a later lesson) instead of an explicit loop.

## size versus count

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [10, None, 20]})
print(df.groupby("team").size())
print(df.groupby("team")["score"].count())
```

`.size()` counts **rows** per group, regardless of missing values. `.count()` on a specific column counts only the **non-missing** values in that column — the two can legitimately disagree when a group has some missing data.

## as_index and reset_index

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "B", "A"], "score": [10, 20, 30]})
grouped = df.groupby("team")["score"].mean()
print(grouped.reset_index())
print(df.groupby("team", as_index=False)["score"].mean())
```

By default, the group key becomes the **index** of the result, which is often exactly what you want for further lookups, but not always convenient for output. `reset_index()` turns it back into an ordinary column; `as_index=False` skips that step entirely, from the start.

## Watch out: dropna in keys

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", None, "A"], "score": [10, 20, 30]})
print(df.groupby("team")["score"].sum())
print(df.groupby("team", dropna=False)["score"].sum())
```

By default, a row with a **missing group key** is silently dropped from the result entirely; `dropna=False` keeps it as its own group instead.

## Common mistakes

- Confusing `.size()` (rows per group) with `.count()` (non-missing values in one column, per group).
- Forgetting that rows with a missing group key vanish silently unless `dropna=False` is passed.
- Grouping by several keys and forgetting the result now has a multi-level index.
- Looping over groups by hand for something `.agg`/`.transform` would express more directly (covered in the next two lessons).

## Recap

- `groupby(key)[col].agg_method()` is the core pattern: split by key, aggregate a column, combine into one result.
- A list of keys groups by every combination; iterating a `groupby` yields `(key, sub-frame)` pairs.
- `.size()` counts rows; `.count()` counts non-missing values in a specific column.
- `as_index=False` (or `.reset_index()` afterwards) keeps the group key as an ordinary column.

## Your turn

In the **Practice** tab you write `avg_delay_by_carrier(df)`. Then three challenges use real flight data.
