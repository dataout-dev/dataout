A **MultiIndex** lets a Series or DataFrame be indexed by more than one key at once — exactly what `groupby` on several columns naturally produces, and worth knowing how to navigate directly.

You will learn:

- how grouping by several columns creates a MultiIndex
- selecting with `.loc` and `.xs`
- `.swaplevel()` and `sort_index()`
- resetting back to plain columns

## Where a MultiIndex comes from

```python
import pandas as pd

df = pd.DataFrame({"team": ["A", "A", "B"], "player": ["Ada", "Bo", "Cy"], "score": [10, 20, 30]})
grouped = df.groupby(["team", "player"])["score"].sum()
print(grouped)
print(grouped.index)
```

Grouping by two columns produces one result per **combination**, indexed by both — a MultiIndex, with one "level" per grouping column.

## Selecting with .loc

```python
import pandas as pd

grouped = pd.Series(
    [10, 20, 30],
    index=pd.MultiIndex.from_tuples([("A", "Ada"), ("A", "Bo"), ("B", "Cy")], names=["team", "player"]),
)
print(grouped.loc["A"])
print(grouped.loc[("A", "Bo")])
```

A single outer-level key (`"A"`) selects everything under it; a full tuple key selects one exact combination.

## .xs for cross-sections

```python
import pandas as pd

grouped = pd.Series(
    [10, 20, 30],
    index=pd.MultiIndex.from_tuples([("A", "Ada"), ("A", "Bo"), ("B", "Ada")], names=["team", "player"]),
)
print(grouped.xs("Ada", level="player"))
```

`.xs(key, level=...)` selects by an **inner** level directly — something `.loc` cannot do as cleanly, since `.loc` normally expects keys from the outside in.

## swaplevel and sort_index

```python
import pandas as pd

grouped = pd.Series(
    [10, 20],
    index=pd.MultiIndex.from_tuples([("A", "Ada"), ("B", "Bo")], names=["team", "player"]),
)
print(grouped.swaplevel())
print(grouped.swaplevel().sort_index())
```

`.swaplevel()` reorders which level comes first; `.sort_index()` then sorts by the (now-different) level order.

## Watch out: unsorted MultiIndex slicing errors

<!-- expect-error -->
```python
import pandas as pd

grouped = pd.Series(
    [10, 20, 30],
    index=pd.MultiIndex.from_tuples([("B", "x"), ("A", "y"), ("A", "z")]),
)
grouped.loc["A":"B"]
```

Slicing a MultiIndex by a range of outer-level labels requires the index to be **sorted** first (`sort_index()`), or pandas cannot guarantee the slice means what it looks like it means.

## Back to plain columns

```python
import pandas as pd

grouped = pd.Series(
    [10, 20],
    index=pd.MultiIndex.from_tuples([("A", "Ada"), ("B", "Bo")], names=["team", "player"]),
)
print(grouped.reset_index(name="score"))
```

`.reset_index()` turns every index level back into an ordinary column — often the last step before displaying or exporting a grouped result.

## Common mistakes

- Trying to slice a MultiIndex by a range of labels before sorting it.
- Forgetting `.xs(..., level=...)` exists, and fighting `.loc` to select by an inner level instead.
- Losing track of which level is which after a `.swaplevel()`.
- Forgetting `reset_index(name=...)` on a Series, and getting a generic `0` column name instead of something meaningful.

## Recap

- Grouping by several columns naturally produces a MultiIndex, one level per key.
- `.loc` selects by outer levels (or an exact full tuple); `.xs(..., level=...)` selects by any level directly.
- `.swaplevel()` reorders levels; sort first if you need to slice by a label range.
- `.reset_index()` turns index levels back into plain columns.

## Your turn

In the **Practice** tab you write `totals(df)`. Then three challenges use real flight data.
