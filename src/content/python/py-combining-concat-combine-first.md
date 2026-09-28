`merge` combines tables side-by-side, matched on a key. `concat` instead stacks tables end-to-end (or side-by-side), and `combine_first` fills gaps in one table using another as a fallback.

You will learn:

- `pd.concat` along rows and columns
- `keys=` for tracking where each piece came from
- aligning columns automatically
- `combine_first`, and the "building in a loop" trap

## concat along rows

```python
import pandas as pd

jan = pd.DataFrame({"day": [1, 2], "count": [10, 12]})
feb = pd.DataFrame({"day": [1, 2], "count": [8, 9]})
print(pd.concat([jan, feb]))
print(pd.concat([jan, feb], ignore_index=True))
```

Without `ignore_index=True`, the combined frame keeps each piece's **original** index, which can repeat (both frames have day `1`, `2` here); `ignore_index=True` builds a fresh `0..n-1` index instead.

## concat along columns

```python
import pandas as pd

a = pd.DataFrame({"x": [1, 2]})
b = pd.DataFrame({"y": [3, 4]})
print(pd.concat([a, b], axis=1))
```

`axis=1` places frames side-by-side instead of stacking them, aligning by index.

## keys: tracking where a row came from

```python
import pandas as pd

jan = pd.DataFrame({"count": [10, 12]})
feb = pd.DataFrame({"count": [8, 9]})
combined = pd.concat([jan, feb], keys=["jan", "feb"])
print(combined)
print(combined.loc["feb"])
```

`keys=` adds an extra, outer level to the index naming which original piece each row belongs to — handy for combining several groups without losing track of where they came from.

## Aligning columns automatically

```python
import pandas as pd

a = pd.DataFrame({"x": [1], "y": [2]})
b = pd.DataFrame({"y": [3], "z": [4]})
print(pd.concat([a, b]))
```

`concat` lines up columns by **name**, filling `NaN` wherever a piece is missing a column the others have — it does not require every piece to share the exact same columns.

## combine_first

```python
import pandas as pd

primary = pd.Series([1.0, None, 3.0])
backup = pd.Series([10.0, 20.0, 30.0])
print(primary.combine_first(backup))
```

`combine_first` keeps every value that already exists in `primary`, and only reaches into `backup` for the positions where `primary` was missing — the opposite of a plain overwrite.

## Watch out: repeated concat inside a loop

```python
import pandas as pd

pieces = []
for i in range(3):
    pieces.append(pd.DataFrame({"x": [i]}))
result = pd.concat(pieces, ignore_index=True)
print(result)
```

Building a **list** of small frames and calling `pd.concat` **once** at the end (as above) is the right pattern. Calling `pd.concat` repeatedly inside the loop, growing one frame a little bit each time, re-copies the whole growing frame on every iteration — fine for 3 pieces, painfully slow for thousands.

## Common mistakes

- Forgetting `ignore_index=True` and ending up with a repeated, confusing index.
- Calling `pd.concat` once per loop iteration instead of collecting pieces and concatenating once.
- Assuming `combine_first` overwrites `primary`'s real values; it never does, only fills genuine gaps.
- Concatenating frames with different columns and being surprised by the resulting `NaN`s, instead of expecting them.

## Recap

- `pd.concat` stacks along rows (`axis=0`, the default) or places side-by-side (`axis=1`), aligning by label.
- `keys=` tags each piece's rows with an extra index level.
- `combine_first` fills gaps from a fallback Series or frame, without disturbing existing values.
- Collect pieces in a list and concatenate once; avoid growing a frame with `concat` inside a loop.

## Your turn

In the **Practice** tab you write `stack_months(frames)`. Then three challenges use real flight data.
