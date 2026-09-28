Filtering a DataFrame uses the same boolean-mask idea as NumPy, with a few pandas-specific tools layered on top: `query`, `isin`, and `between`.

You will learn:

- boolean masks, and combining them with `&`, `|`, `~`
- `isin` and `between`
- `query` strings
- how `NaN` behaves in comparisons

## Boolean masks

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Grace", "Alan"], "score": [95, 60, 88]})
mask = df["score"] >= 80
print(df[mask])
```

## Combining conditions

Exactly like NumPy, `&`/`|`/`~` combine masks, with parentheses around each comparison:

```python
import pandas as pd

df = pd.DataFrame({"score": [95, 60, 88, 40], "active": [True, True, False, True]})
print(df[(df["score"] >= 80) & df["active"]])
print(df[(df["score"] < 50) | (df["score"] > 90)])
```

## isin and between

```python
import pandas as pd

df = pd.DataFrame({"grade": ["A", "B", "C", "D"], "score": [95, 82, 71, 55]})
print(df[df["grade"].isin(["A", "B"])])
print(df[df["score"].between(70, 90)])
```

`isin` checks membership in a list; `between(low, high)` is inclusive of both ends by default, equivalent to `(s >= low) & (s <= high)`.

## query strings

```python
import pandas as pd

df = pd.DataFrame({"score": [95, 60, 88], "active": [True, False, True]})
print(df.query("score >= 80 and active"))

threshold = 80
print(df.query("score >= @threshold"))
```

`query` reads like plain English (`and`/`or` work directly, unlike `&`/`|` on masks) and can reference a Python variable with an `@` prefix.

## Watch out: NaN never satisfies a comparison

```python
import pandas as pd

df = pd.DataFrame({"score": [95.0, None, 60.0]})
print(df[df["score"] > 50])
print(df[df["score"].isna()])
```

The missing row simply disappears from `df["score"] > 50` — `NaN > 50` is `False`, not an error and not "unknown", so a row with a missing value silently drops out of **every** ordinary comparison. If you need to check for missing values themselves, use `.isna()`/`.notna()` explicitly, never `== None` or `== float("nan")`.

## str accessor in filters

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada Lovelace", "Grace Hopper", "Alan Turing"]})
print(df[df["name"].str.contains("Hopper")])
```

The `.str` accessor (covered in depth in a later lesson) lets string methods run across a whole column; `NaN` entries pass through safely rather than raising.

## Common mistakes

- Writing `df[mask1 and mask2]` instead of `df[mask1 & mask2]` (Python's `and` cannot combine two Series).
- Expecting `df[df["x"] > 5]` to include rows where `x` is missing; it never does.
- Forgetting parentheses around each comparison before combining with `&`/`|`.
- Using `query` with a column name that is not a valid Python identifier, without the extra backtick syntax `query` needs for that case.

## Recap

- Boolean masks and `&`/`|`/`~` filter a DataFrame exactly like a NumPy array.
- `isin` and `between` cover two very common filter shapes concisely.
- `query` strings read naturally and can reference Python variables with `@`.
- A comparison against a missing value is always `False`; check for missingness with `.isna()` instead.

## Your turn

In the **Practice** tab you write `long_delays(df, minutes)`. Then three challenges use real flight data.
