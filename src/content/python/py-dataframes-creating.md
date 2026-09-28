A **DataFrame** is a table: a collection of Series that share one index, each with its own name and dtype. Almost everything from here on operates on a DataFrame.

You will learn:

- building a DataFrame from dicts, lists and records
- `shape`, `dtypes`, `head`, `tail`, `info`
- `describe`, `value_counts`, `nunique`
- the chained-indexing trap

## Building a DataFrame

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Grace", "Alan"], "score": [95, 88, 91]})
print(df)

records = [{"name": "Ada", "score": 95}, {"name": "Grace", "score": 88}]
print(pd.DataFrame(records))
```

A dict of equal-length lists becomes columns; a list of dicts ("records") becomes rows — both are common shapes for real data.

## Inspecting a frame

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Grace", "Alan"], "score": [95, 88, 91]})
print(df.shape)
print(df.dtypes)
print(df.head(2))
print(df.tail(1))
```

`shape` is `(rows, columns)`. `dtypes` lists each column's type. `head`/`tail` preview the first/last rows (default 5).

## describe, value_counts, nunique

```python
import pandas as pd

df = pd.DataFrame({"grade": ["A", "B", "A", "A", "C"], "score": [95, 82, 91, 88, 60]})
print(df["score"].describe())
print(df["grade"].value_counts())
print(df["grade"].nunique())
```

`describe()` on a numeric Series gives count, mean, std, min, quartiles and max in one call. `value_counts()` counts how often each distinct value appears, sorted from most to least common. `nunique()` just counts the distinct values.

## Watch out: chained indexing

```python
import pandas as pd

df = pd.DataFrame({"score": [1, 2, 3]})
df[df["score"] > 1]["score"] = 99
print(df)
```

This looks like it should set the filtered rows' `score` to `99`, but it silently does **nothing** to `df` — `df[df["score"] > 1]` builds a temporary copy, and the assignment lands on that throwaway copy, not the original. The safe form uses a single `.loc` call for both the row filter and the column:

```python
import pandas as pd

df = pd.DataFrame({"score": [1, 2, 3]})
df.loc[df["score"] > 1, "score"] = 99
print(df)
```

## Common mistakes

- Chaining two separate `[...]` lookups when assigning, instead of one `.loc[rows, cols] = value`.
- Using `len(df)` when a column has missing values and the **count of present values** was actually wanted (`.count()` instead).
- Forgetting that `describe()` only covers numeric columns by default.
- Reading `dtypes` once and assuming it never changes, even after operations that silently upcast a column.

## Recap

- A dict of columns or a list of row-records both build a DataFrame; pick whichever shape the data is already in.
- `shape`, `dtypes`, `head`/`tail` are the first things to check about an unfamiliar frame.
- `describe`, `value_counts` and `nunique` summarise a column's numbers, distribution, or diversity.
- Chained indexing (`df[mask]["col"] = ...`) can silently fail to write; use one `.loc[...]` call instead.

## Your turn

In the **Practice** tab you write `summarise(df, col)`. Then three challenges use real data.
