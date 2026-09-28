Adding and transforming columns is where a lot of everyday pandas work happens. `.assign` is the version that never mutates the original — the habit worth building first.

You will learn:

- `.assign`, and arithmetic on columns
- `map` and `replace`
- `apply`, and why it is usually the slow option
- `np.where`/`np.select`, `clip` and `rank`

## assign

```python
import pandas as pd

df = pd.DataFrame({"price": [10.0, 20.0], "qty": [3, 5]})
with_total = df.assign(total=df["price"] * df["qty"])
print(with_total)
print(df)
```

`.assign` returns a **new** DataFrame with the extra column; `df` itself is never touched. Writing `df["total"] = ...` instead works too, but mutates `df` in place — reach for `.assign` by default, especially inside a function, so callers are never surprised by a changed input.

## map and replace

```python
import pandas as pd

df = pd.DataFrame({"grade": ["A", "B", "C"]})
lookup = {"A": 4, "B": 3, "C": 2}
print(df["grade"].map(lookup))
print(df["grade"].replace({"A": "Excellent"}))
```

`.map` looks every value up in a dict (or applies a function); anything not found becomes `NaN`. `.replace` substitutes specific values and leaves everything else exactly as it was.

## apply, and why it is slow

```python
import pandas as pd

df = pd.DataFrame({"price": [10.0, 20.0, 30.0]})
print(df["price"].apply(lambda x: x * 1.1))
print(df["price"] * 1.1)
```

Both lines compute the same thing, but `.apply` calls a Python function once per row, the same per-element overhead a plain loop would pay; the vectorised expression on the right runs in one pass. Reach for `.apply` only when there genuinely is no vectorised way to express the computation.

## np.where, clip and rank

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({"score": [95, 40, 70, 100]})
print(np.where(df["score"] >= 60, "pass", "fail"))
print(df["score"].clip(50, 90))
print(df["score"].rank())
```

`np.where` picks between two values based on a condition, across a whole column at once. `.clip(low, high)` caps values into a range. `.rank()` returns each value's rank within the column (by default, tied values share the average rank).

## Renaming and reordering columns

```python
import pandas as pd

df = pd.DataFrame({"a": [1], "b": [2], "c": [3]})
print(df.rename(columns={"a": "alpha"}))
print(df[["c", "a", "b"]])
```

## Watch out: modifying a slice of another frame

```python
import pandas as pd

df = pd.DataFrame({"price": [10.0, 20.0, 30.0]})
sub = df[df["price"] > 15]
sub = sub.assign(price=sub["price"] * 2)
print(df)
print(sub)
```

Because `sub.assign(...)` builds a brand-new frame rather than editing `sub` in place, `df` is never at risk here — this is exactly why `.assign` (over direct column assignment on a filtered slice) avoids the whole class of "did that actually change the original?" bugs.

## Common mistakes

- Reaching for `.apply` with a lambda that could have been a plain vectorised expression instead.
- Forgetting that `.map` turns an unmatched value into `NaN`, when `.replace` (which leaves it alone) was what was actually wanted.
- Mutating the input DataFrame inside a function that callers expect to be read-only.
- Assuming `.rank()`'s default tie-breaking (the average rank) is always what is wanted.

## Recap

- `.assign` adds columns without mutating the original frame; plain `df["x"] = ...` does mutate it.
- `.map` looks values up (missing → `NaN`); `.replace` substitutes specific values and leaves the rest untouched.
- `.apply` is a last resort — a genuinely vectorised expression is almost always faster and no harder to read.
- `np.where`, `.clip` and `.rank` cover common conditional, capping and ranking needs without a loop.

## Your turn

In the **Practice** tab you write `add_speed(df)`. Then three challenges use real flight data.
