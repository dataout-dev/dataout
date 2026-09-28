Beyond a single aggregation like `.mean()`, groupby offers three more precise tools: `.agg` for several summaries at once, `.transform` for a per-group value broadcast back onto every row, and `.filter` for keeping or dropping whole groups.

You will learn:

- `.agg` with several functions at once, and named aggregation
- custom aggregation functions
- `.transform`, and how it differs from `.agg`
- `.filter` for whole-group conditions

## agg with several functions

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [10, 30, 20]})
print(df.groupby("team")["score"].agg(["mean", "max", "count"]))
```

Passing a list of function names to `.agg` computes every one of them per group, in one call, as separate columns.

## Named aggregation

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [10, 30, 20]})
result = df.groupby("team").agg(
    avg_score=("score", "mean"),
    top_score=("score", "max"),
)
print(result)
```

Named aggregation lets you choose the **output column names** directly, which reads far more clearly than pandas' default multi-level column names from a plain list of functions.

## A custom aggregation function

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [10, 30, 20]})
print(df.groupby("team")["score"].agg(lambda s: s.max() - s.min()))
```

Any function that reduces a Series to a single value works, not just the built-in names.

## transform: same shape as the input

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [10, 30, 20]})
df["team_avg"] = df.groupby("team")["score"].transform("mean")
print(df)
```

Unlike `.agg` (one row per group), `.transform` returns a value **for every original row**, broadcasting the group's summary back to each of its members — exactly the shape needed to add a new column, or to compute something relative to the group (like a share or a z-score).

## Watch out: transform must return the same length

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "score": [10, 30, 20]})
df["rank_in_team"] = df.groupby("team")["score"].transform(lambda s: s.rank())
print(df)
```

The function passed to `.transform` must return something the same length as its input group — `.rank()` naturally does; a reducing function like `.mean()` also works, because pandas broadcasts the single resulting value across the whole group automatically.

## filter: keeping or dropping whole groups

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B", "B", "B"], "score": [10, 30, 20, 25, 15]})
print(df.groupby("team").filter(lambda g: len(g) >= 3))
```

`.filter` decides, group by group, whether the **whole group** survives — unlike a plain boolean mask, which can only look at one row at a time and cannot ask "how many rows share this key in total?".

## Common mistakes

- Reaching for `.apply` as a catch-all when `.agg` or `.transform` already express the same thing more directly (and usually faster).
- Forgetting that `.agg` returns one row **per group**, while `.transform` returns one row **per original row**.
- Writing a `.transform` function that reduces to a single value without checking pandas actually broadcasts it back correctly for the specific operation.
- Using a plain mask when the real condition depends on the whole group (a job for `.filter`).

## Recap

- `.agg` computes one or more summaries per group; named aggregation controls the resulting column names.
- `.transform` returns a value for every original row, ready to become a new column or a group-relative calculation.
- `.filter` keeps or drops entire groups based on a group-level condition.
- Prefer `.agg`/`.transform`/`.filter` over `.apply` whenever they express the same computation.

## Your turn

In the **Practice** tab you write `add_share(df)`. Then three challenges use real flight data.
