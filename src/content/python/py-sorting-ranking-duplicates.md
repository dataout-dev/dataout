Sorting a DataFrame extends naturally from sorting a Series; ranking, top-N shortcuts and duplicate detection round out the everyday toolkit.

You will learn:

- `sort_values` with multiple keys, and `sort_index`
- `rank`
- `nlargest`/`nsmallest`
- `duplicated` and `drop_duplicates`

## sort_values

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Grace", "Alan"], "score": [95, 88, 91]})
print(df.sort_values("score"))
print(df.sort_values("score", ascending=False))
```

## Multiple keys

```python
import pandas as pd

df = pd.DataFrame({"team": ["B", "A", "A", "B"], "score": [10, 20, 5, 30]})
print(df.sort_values(["team", "score"], ascending=[True, False]))
```

Sorting by a list of columns breaks ties in the first column using the second, and so on; a matching list of booleans sets the direction independently for each key.

## sort_index

```python
import pandas as pd

df = pd.DataFrame({"x": [1, 2, 3]}, index=[30, 10, 20])
print(df.sort_index())
```

## rank

```python
import pandas as pd

s = pd.Series([50, 90, 90, 30])
print(s.rank())
print(s.rank(method="min"))
print(s.rank(ascending=False))
```

`rank()` gives each value its rank, `1` being the smallest by default. Tied values share the **average** of the ranks they would have occupied, unless a different `method` (like `"min"`, giving every tied value the lowest of those ranks) is specified.

## nlargest and nsmallest

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Grace", "Alan", "Bo"], "score": [95, 88, 91, 99]})
print(df.nlargest(2, "score"))
print(df.nsmallest(1, "score"))
```

`nlargest`/`nsmallest` are shortcuts for "sort by this column, then take the top/bottom `n`" — clearer to read, and can be faster since pandas does not need to fully sort the rest.

## duplicated and drop_duplicates

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Grace", "Ada", "Ada"]})
print(df.duplicated())
print(df.duplicated(keep=False))
print(df.drop_duplicates())
```

`.duplicated()` marks every occurrence **after** the first as `True` by default. `keep=False` instead marks **every** occurrence of a value that appears more than once, including the first. `.drop_duplicates()` keeps only the first occurrence of each distinct row (or of specific `subset` columns, if given).

## Watch out: sort stability

```python
import pandas as pd

df = pd.DataFrame({"score": [1, 1, 1], "id": ["a", "b", "c"]})
print(df.sort_values("score", kind="stable"))
```

When many rows tie on the sort key, the **order they end up in** among themselves depends on the sort algorithm; pass `kind="stable"` whenever that original relative order needs to be preserved exactly.

## Common mistakes

- Forgetting that `.duplicated()`'s default `keep="first"` does **not** flag the first occurrence of a repeated value.
- Assuming ties always keep their original order without passing `kind="stable"`.
- Confusing `nlargest`/`nsmallest` (which sort by a column's value) with `head`/`tail` (which just take rows by position, in whatever order the frame is already in).
- Sorting by several columns but supplying only one `ascending` direction, applying it (by mistake) to every key.

## Recap

- `sort_values` accepts a list of columns and a matching list of `ascending` directions for multi-key sorts.
- `rank` assigns positions within a Series, with several tie-breaking `method` options.
- `nlargest`/`nsmallest` combine sorting and slicing in one clear call.
- `duplicated`/`drop_duplicates` detect and remove repeats, with `keep` controlling which occurrence(s) count.

## Your turn

In the **Practice** tab you write `top_n(df, col, n)`. Then three challenges use real data.
