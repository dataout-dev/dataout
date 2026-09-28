"Tidy" data has one row per observation and one column per variable. Real data often arrives the opposite way — one column *per year*, say — and reshaping between the two shapes is a skill on its own.

You will learn:

- tidy data, informally
- `melt` with `id_vars` and `value_vars`
- `stack` and `unstack`
- choosing wide versus long for a given task

## Wide versus long

```python
import pandas as pd

wide = pd.DataFrame({"country": ["US", "UK"], "2022": [10, 5], "2023": [12, 6]})
print(wide)
```

`wide` has one row per country but spreads years across columns — convenient to *read*, awkward to *compute on* (grouping or plotting "by year" needs year to be a genuine column of values, not a set of separate columns).

## melt: wide to long

```python
import pandas as pd

wide = pd.DataFrame({"country": ["US", "UK"], "2022": [10, 5], "2023": [12, 6]})
long = wide.melt(id_vars=["country"], var_name="year", value_name="sales")
print(long)
```

`id_vars` names the column(s) to keep as-is; every **other** column becomes two long-form columns instead: `var_name` (which original column a row came from) and `value_name` (that column's value).

## Choosing value_vars

```python
import pandas as pd

wide = pd.DataFrame({"id": [1], "2022": [10], "2023": [12], "note": ["x"]})
print(wide.melt(id_vars=["id"], value_vars=["2022", "2023"], var_name="year", value_name="sales"))
```

`value_vars` restricts *which* columns get melted, when only some of them (here, the year columns, not `note`) should turn into rows.

## stack and unstack

```python
import pandas as pd

wide = pd.DataFrame({"2022": [10, 5], "2023": [12, 6]}, index=["US", "UK"])
long = wide.stack()
print(long)
print(long.unstack())
```

`.stack()` moves columns down into an extra index level, turning a wide frame into a long Series (or frame, if starting from a MultiIndex). `.unstack()` reverses it, moving the innermost index level back out to columns.

## Watch out: losing column meaning

```python
import pandas as pd

wide = pd.DataFrame({"id": [1], "height_cm": [170], "weight_kg": [65]})
long = wide.melt(id_vars=["id"], var_name="measurement", value_name="value")
print(long)
```

After melting, `height_cm` and `weight_kg` (which carried their **units** in the name) are now just two rows of a generic `measurement` column — the units are still there in the text, but no longer structurally distinguishing anything; downstream code has to know to check the `measurement` column's text if it needs to treat them differently.

## When each shape helps

Wide is usually better for **reading** a small table by eye, and for feeding some plotting or statistical functions that expect one column per series. Long is usually better for **grouping**, **filtering**, and general computation, because the thing you might want to group or filter by (like "year") is a genuine column, not baked into the table's structure.

## Common mistakes

- Forgetting `id_vars`, and melting a column that should have stayed fixed.
- Assuming `.stack()` always produces a Series; starting from a frame with a MultiIndex, it can produce a frame instead.
- Losing track of units or meaning that used to live in a wide column's name.
- Reshaping back and forth repeatedly instead of picking the shape the next step actually needs.

## Recap

- `melt` turns selected columns into two long-form columns: which one (`var_name`) and its value (`value_name`).
- `id_vars`/`value_vars` control which columns stay fixed and which get melted.
- `.stack()`/`.unstack()` move data between the columns and an extra index level.
- Long form usually suits computation; wide form usually suits reading and certain plotting functions.

## Your turn

In the **Practice** tab you write `to_long(df)`. Then three challenges use real data.
