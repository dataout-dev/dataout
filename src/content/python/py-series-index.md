pandas builds everything on top of one idea: a **Series**, a one-dimensional, labelled array. The label attached to each value is its **index**, and that index is what makes pandas arithmetic so different from NumPy's.

You will learn:

- Series as a labelled array
- creating a Series from a list, a dict, or an array
- index alignment on arithmetic
- label versus position

## A Series is a labelled array

```python
import pandas as pd

s = pd.Series([10, 20, 30])
print(s)
print(s.index)
print(s.values)
```

Without an explicit index, pandas numbers the entries `0, 1, 2, ...` — but any labels can be used:

```python
import pandas as pd

prices = pd.Series([1.29, 0.99, 1.49], index=["apple", "pear", "plum"])
print(prices["pear"])
print(prices.loc["plum"])
```

## Creating from a dict

Building a Series from a dict uses the keys as the index automatically:

```python
import pandas as pd

counts = pd.Series({"Rock": 120, "Jazz": 45, "Pop": 200})
print(counts)
```

## dtype and name

```python
import pandas as pd

s = pd.Series([1, 2, 3], name="scores")
print(s.dtype, s.name)
```

Like a NumPy array, a Series has one `dtype` for every value; `name` is optional and becomes the column name if the Series later joins a DataFrame.

## Watch out: automatic alignment on arithmetic

This is the single biggest difference from a plain NumPy array. Adding two Series does not add by *position* — it adds by **label**:

```python
import pandas as pd

a = pd.Series([1, 2, 3], index=["x", "y", "z"])
b = pd.Series([100, 200, 300], index=["z", "y", "x"])
print(a + b)
```

Even though `b` is "in a different order", `a + b` correctly matches `x` with `x`, `y` with `y`, `z` with `z` — pandas looks at the **labels**, never the raw position.

When a label exists on only one side, plain `+` produces `NaN` for it:

```python
import pandas as pd

a = pd.Series([1, 2, 3], index=["a", "b", "c"])
b = pd.Series([10, 20], index=["a", "b"])
print(a + b)
```

`c` has no partner in `b`, so the result for `c` is `NaN`. The `.add()` method's `fill_value` argument treats a missing side as a given value (often `0`) instead:

```python
import pandas as pd

a = pd.Series([1, 2, 3], index=["a", "b", "c"])
b = pd.Series([10, 20], index=["a", "b"])
print(a.add(b, fill_value=0))
```

## Label versus position

```python
import pandas as pd

s = pd.Series([10, 20, 30], index=[5, 6, 7])
print(s[5])
print(s.iloc[0])
```

`s[5]` looks up the **label** `5`; `s.iloc[0]` looks up **position** `0`. They happen to differ here, which is exactly the kind of confusion label-based indexing can cause when the index is itself made of numbers — `loc`/`iloc` (covered properly in a later lesson) make the intent explicit.

## Common mistakes

- Assuming `a + b` lines up by position, the way two NumPy arrays would.
- Forgetting that a label present on only one side becomes `NaN`, silently, unless `fill_value` is used.
- Confusing `s[5]` (label lookup here) with position, when the index happens to contain integers.

## Recap

- A Series pairs values with labels (its index); arithmetic aligns by label, not position.
- A label missing from one side produces `NaN` under plain `+`; `.add(..., fill_value=...)` avoids that.
- `s[label]` and `.loc[label]` look up by label; `.iloc[position]` looks up by position.

## Your turn

In the **Practice** tab you write `add_series(a, b)`, aligned addition with a fill value. Then three challenges use real data.
