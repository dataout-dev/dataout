pandas gives you several ways to select data, and picking the right one avoids a whole category of bugs. The short version: `loc` means **labels** (and includes both ends of a slice); `iloc` means **positions** (and excludes the end, like ordinary Python slicing).

You will learn:

- selecting one or several columns with `[]`
- `loc` (label-based, inclusive) versus `iloc` (position-based, exclusive)
- boolean `loc`
- `at`/`iat` for single values, and setting values safely

## Column selection with []

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6], "c": [7, 8, 9]})
print(df["a"])
print(df[["a", "c"]])
```

A single column name returns a Series; a **list** of names returns a DataFrame, even if the list has only one name.

## loc: label-based, inclusive

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3, 4, 5]}, index=[10, 20, 30, 40, 50])
print(df.loc[20:40])
print(df.loc[20:40, "a"])
```

`loc[20:40]` means "every row whose **label** is between `20` and `40`, inclusive of both ends" — not positions 20 to 40. Because it includes the final label, `loc[20:40]` returns 3 rows here, not 2.

## iloc: position-based, exclusive

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3, 4, 5]}, index=[10, 20, 30, 40, 50])
print(df.iloc[1:3])
```

`iloc` ignores the labels entirely and always counts plain positions, `0` to `len(df) - 1`, with the usual Python slicing rule (the end is excluded).

## Boolean loc

`loc` also accepts a boolean mask, which is how filtering (covered fully in the next lesson) and column selection combine in one safe call:

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3], "b": [10, 20, 30]})
print(df.loc[df["a"] > 1, "b"])
```

## at and iat

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3]}, index=[10, 20, 30])
print(df.at[20, "a"])
print(df.iat[1, 0])
```

`at`/`iat` are the label/position equivalents of `loc`/`iloc`, restricted to a **single** value — slightly faster when you know you only need one cell.

## Setting values safely

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3]})
df.loc[df["a"] > 1, "a"] = 0
print(df)
```

Writing through `.loc[rows, cols] = value` in one call is always safe. Writing through two separate steps (`df[mask]["a"] = 0`) risks the chained-indexing trap from the previous lesson.

## Watch out: copy-on-write and SettingWithCopy

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3]})
sub = df[df["a"] > 1]
sub.loc[:, "a"] = 0
print(df)
```

`sub` is a filtered copy; changing it never touches `df`. Older pandas versions could sometimes let a write like this leak back unpredictably (raising the well-known `SettingWithCopyWarning`); pandas' copy-on-write behaviour makes the safe outcome (the original is untouched) the guaranteed one, but the fix is the same either way: if you intend to keep editing a filtered subset, call `.copy()` on it explicitly, so the intent is unambiguous.

## Common mistakes

- Using `loc` with a slice and forgetting the end label is **included**.
- Using `iloc` with row/column **labels** instead of positions (it does not understand labels at all).
- Writing through a chained `df[mask]["col"] = value` instead of one `.loc[mask, "col"] = value` call.
- Reaching for `at`/`iat` with a slice or a list; they only ever address one cell.

## Recap

- `loc` selects by label and includes the end of a slice; `iloc` selects by position and excludes it.
- A boolean mask works directly inside `loc`, combined with a column selection in one call.
- `at`/`iat` are fast single-value versions of `loc`/`iloc`.
- Assign through one `.loc[...] = value` call, never through two chained lookups.

## Your turn

In the **Practice** tab you write `block(df)`. Then three challenges use real data.
