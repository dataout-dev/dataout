A pivot table reshapes long data into a wide summary: one key becomes rows, another becomes columns, and a chosen aggregation fills the cells. `crosstab` is the same idea specialised for plain counts.

You will learn:

- `pivot` (no aggregation) versus `pivot_table` (with one)
- `aggfunc` and `fill_value`
- `margins` for row/column totals
- `pd.crosstab`, and normalisation

## pivot versus pivot_table

```python
import pandas as pd

df = pd.DataFrame({"day": [1, 1, 2, 2], "city": ["NY", "LA", "NY", "LA"], "temp": [30, 70, 32, 68]})
print(df.pivot(index="day", columns="city", values="temp"))
```

`.pivot` reshapes without aggregating — it requires **exactly one** value per `(index, column)` combination, and raises if there is more than one (a real, common failure once the data has duplicates).

```python
import pandas as pd

df = pd.DataFrame({"day": [1, 1, 1, 2], "city": ["NY", "NY", "LA", "NY"], "temp": [30, 34, 70, 32]})
print(df.pivot_table(index="day", columns="city", values="temp", aggfunc="mean"))
```

`.pivot_table` is the general version: whenever a cell would receive more than one value, `aggfunc` (`"mean"` by default) combines them.

## fill_value

```python
import pandas as pd

df = pd.DataFrame({"day": [1, 2], "city": ["NY", "LA"], "temp": [30, 70]})
print(df.pivot_table(index="day", columns="city", values="temp"))
print(df.pivot_table(index="day", columns="city", values="temp", fill_value=0))
```

A combination that never occurred in the data becomes `NaN` by default; `fill_value` replaces that with a chosen value instead.

## margins: row and column totals

```python
import pandas as pd

df = pd.DataFrame({"day": [1, 1, 2], "city": ["NY", "LA", "NY"], "sales": [10, 20, 15]})
print(df.pivot_table(index="day", columns="city", values="sales", aggfunc="sum", margins=True))
```

`margins=True` adds an `"All"` row and column with the overall totals.

## crosstab

```python
import pandas as pd

df = pd.DataFrame({"grade": ["A", "A", "B", "B"], "pass": [True, True, True, False]})
print(pd.crosstab(df["grade"], df["pass"]))
print(pd.crosstab(df["grade"], df["pass"], normalize="index"))
```

`pd.crosstab` counts how often each combination of two columns occurs — the plain-counting special case of a pivot table. `normalize="index"` turns each row into fractions that sum to 1, useful for comparing proportions across groups of different sizes.

## Watch out: pivot fails on duplicate index/column pairs

<!-- expect-error -->
```python
import pandas as pd

df = pd.DataFrame({"day": [1, 1], "city": ["NY", "NY"], "temp": [30, 34]})
df.pivot(index="day", columns="city", values="temp")
```

Two rows share the same `(day, city)` pair with different temperatures, and `.pivot` has no way to combine them — this is exactly the situation `.pivot_table`'s `aggfunc` exists to resolve.

## Common mistakes

- Reaching for `.pivot` on data that might have duplicate `(index, column)` pairs, and hitting a confusing error.
- Forgetting `fill_value`, then treating a resulting `NaN` as "zero" without checking.
- Confusing `pd.crosstab(a, b)`'s argument order (rows, then columns) with `pivot_table`'s `index=`/`columns=` naming.
- Leaving `margins=True` in a result that then gets fed into further calculations, accidentally including the totals row/column.

## Recap

- `.pivot` reshapes without aggregating and needs unique `(index, column)` pairs; `.pivot_table` aggregates when they repeat.
- `fill_value` replaces missing combinations; `margins=True` adds totals.
- `pd.crosstab` is the plain-counting special case, with `normalize=` for proportions.

## Your turn

In the **Practice** tab you write `delay_pivot(df)`. Then three challenges use real data.
