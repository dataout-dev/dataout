Polars is a newer DataFrame library built for speed, with its own expression-based API that reads differently from pandas even where the underlying idea is the same.

You will learn:

- the expression API: `pl.col(...)`
- `select`, `filter`, `with_columns`, `group_by`
- lazy frames and query plans
- converting between Polars and pandas

## The expression API

```python
import polars as pl

df = pl.DataFrame({"name": ["Ada", "Grace", "Alan"], "score": [95, 88, 91]})
print(df.select(pl.col("name"), (pl.col("score") * 2).alias("doubled")))
```

`pl.col("score")` refers to a column as an **expression**, which can be combined with arithmetic and other expressions before being evaluated — the whole computation is described first, then run, rather than executing each operation immediately the way pandas usually does.

## select, filter, with_columns

```python
import polars as pl

df = pl.DataFrame({"name": ["Ada", "Grace", "Alan"], "score": [95, 60, 91]})
print(df.filter(pl.col("score") > 70))
print(df.with_columns((pl.col("score") >= 90).alias("top")))
```

`filter` keeps matching rows (like a pandas boolean mask); `with_columns` adds or replaces columns (like pandas' `.assign`), both taking one or more expressions.

## group_by

```python
import polars as pl

df = pl.DataFrame({"team": ["A", "A", "B", "B"], "score": [10, 20, 5, 15]})
print(df.group_by("team").agg(pl.col("score").mean().alias("avg_score")))
```

`group_by(...).agg(...)` mirrors pandas' `groupby(...).agg(...)`, with expressions instead of function names or lambdas.

## Lazy frames and query plans

```python
import polars as pl

df = pl.DataFrame({"team": ["A", "A", "B", "B"], "score": [10, 20, 5, 15]})
lazy = df.lazy()
plan = lazy.filter(pl.col("score") > 8).group_by("team").agg(pl.col("score").mean())
print(plan.collect())
```

A `LazyFrame` builds up the whole query as a **plan** first, and only actually runs it at `.collect()` — this gives Polars a chance to optimise the entire pipeline together (for example, filtering before grouping, or skipping columns never used), rather than executing each step immediately and separately the way an eager DataFrame does.

## Comparing with pandas

```python
import pandas as pd
import polars as pl

data = {"team": ["A", "A", "B"], "score": [10, 20, 5]}
pandas_result = pd.DataFrame(data).groupby("team")["score"].mean()
polars_result = pl.DataFrame(data).group_by("team").agg(pl.col("score").mean())
print(pandas_result)
print(polars_result)
```

The two produce the same underlying answer, in noticeably different shapes: pandas returns a Series indexed by `team`; Polars returns a DataFrame with `team` as an ordinary column — a small but real difference to expect whenever moving between the two.

## Converting between them

```python
import pandas as pd
import polars as pl

pandas_df = pd.DataFrame({"x": [1, 2, 3]})
polars_df = pl.from_pandas(pandas_df)
back_again = polars_df.to_pandas()
print(type(polars_df), type(back_again))
```

## Watch out: pandas habits that do not translate

There is no `.loc`/`.iloc` in Polars, no implicit index to align on, and boolean combination uses `&`/`|` inside `filter` rather than chained bracket indexing — reaching for a pandas idiom by muscle memory is one of the more common early frustrations, and usually has a direct, if differently-spelled, Polars equivalent.

## Common mistakes

- Expecting an index-based `.loc` lookup to exist; Polars has no index concept the way pandas does.
- Calling `.collect()` too early (or never), losing the whole-pipeline optimisation a `LazyFrame` offers.
- Mixing pandas and Polars objects in the same expression without converting explicitly first.
- Assuming a group-by result's shape matches pandas' exactly; check whether the key ends up as an index or an ordinary column.

## Recap

- Polars expressions (`pl.col(...)`) describe a computation, evaluated inside `select`/`filter`/`with_columns`/`agg`.
- `group_by(...).agg(...)` mirrors pandas' groupby, with a different result shape.
- A `LazyFrame` builds a query plan and only runs it at `.collect()`, enabling whole-pipeline optimisation.
- `pl.from_pandas`/`.to_pandas()` convert between the two libraries when needed.

## Your turn

In the **Practice** tab you write `polars_avg(rows)`. Then three challenges use real data.
