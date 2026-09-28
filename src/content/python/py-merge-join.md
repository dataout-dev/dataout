`merge` is pandas' SQL-style join: combine two tables on a shared key, choosing exactly what happens to rows that do not match on the other side.

You will learn:

- `how=` — inner, left, right, outer, cross
- `on`, `left_on`/`right_on`, and joining on the index
- `suffixes` for overlapping column names
- `validate=`, and detecting accidental row multiplication

## The four main hows

```python
import pandas as pd

left = pd.DataFrame({"id": [1, 2, 3], "name": ["Ada", "Grace", "Alan"]})
right = pd.DataFrame({"id": [2, 3, 4], "score": [90, 85, 70]})

print(left.merge(right, on="id", how="inner"))
print(left.merge(right, on="id", how="left"))
print(left.merge(right, on="id", how="right"))
print(left.merge(right, on="id", how="outer"))
```

`inner` keeps only rows with a match on **both** sides. `left`/`right` keep every row of one side, filling `NaN` for anything missing on the other. `outer` keeps everything from both, filling `NaN` on whichever side lacks a match.

## A cross join

```python
import pandas as pd

sizes = pd.DataFrame({"size": ["S", "M", "L"]})
colors = pd.DataFrame({"color": ["red", "blue"]})
print(sizes.merge(colors, how="cross"))
```

`how="cross"` pairs **every** row of one side with **every** row of the other — useful for building every combination of two small option sets.

## Different key names, and joining on the index

```python
import pandas as pd

orders = pd.DataFrame({"customer_id": [1, 2], "total": [50, 75]})
customers = pd.DataFrame({"id": [1, 2], "name": ["Ada", "Grace"]})
print(orders.merge(customers, left_on="customer_id", right_on="id"))
```

`left_on`/`right_on` are needed when the two sides call the same idea by different column names. Passing `left_index=True`/`right_index=True` joins on the index instead of a column.

## suffixes for overlapping names

```python
import pandas as pd

a = pd.DataFrame({"id": [1], "value": [10]})
b = pd.DataFrame({"id": [1], "value": [20]})
print(a.merge(b, on="id"))
print(a.merge(b, on="id", suffixes=("_left", "_right")))
```

When both sides have a same-named column that is *not* the join key, pandas appends `_x`/`_y` by default; `suffixes=` lets you choose something clearer.

## Watch out: unexpected row multiplication

```python
import pandas as pd

orders = pd.DataFrame({"customer_id": [1, 1, 2]})
customers = pd.DataFrame({"customer_id": [1, 1, 2]})
print(orders.merge(customers, on="customer_id"))
```

If the join key is **repeated** on either side, a merge produces one output row for **every combination** of matching rows — here, customer `1` appears twice on both sides, producing 4 rows instead of the 2 you might expect. `validate="one_to_many"` (or `"many_to_one"`, `"one_to_one"`) makes `merge` raise instead of silently multiplying rows, whenever your assumption about the relationship turns out to be wrong:

<!-- expect-error -->
```python
import pandas as pd

orders = pd.DataFrame({"customer_id": [1, 1, 2]})
customers = pd.DataFrame({"customer_id": [1, 1, 2]})
orders.merge(customers, on="customer_id", validate="one_to_one")
```

## Common mistakes

- Assuming a join key is unique on both sides, and being surprised by extra rows when it is not.
- Using `how="inner"` when rows without a match actually needed to be kept.
- Forgetting `suffixes=` and later reading `_x`/`_y` columns without remembering which was which.
- Merging on columns of different dtypes (e.g. one side text, the other numeric) and getting zero matches with no error.

## Recap

- `how=` controls which unmatched rows survive: inner (neither), left/right (one side), outer (both).
- `left_on`/`right_on` join on differently-named columns; `left_index`/`right_index` join on the index.
- `suffixes=` names overlapping non-key columns clearly.
- `validate=` catches an unexpectedly repeated join key before it silently multiplies rows.

## Your turn

In the **Practice** tab you write `with_airline(flights, airlines)`. Then three challenges use real flight data.
