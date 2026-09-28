**Broadcasting** is the rule NumPy uses to combine arrays of different shapes without you writing a loop or copying data to match sizes. Once it clicks, whole classes of loops disappear from your code.

You will learn:

- the broadcasting rules, informally
- adding a row (or column) to every row of a matrix
- `np.newaxis` for turning a 1-D array into a column
- reading a broadcasting error message

## The rule, informally

To combine two arrays, NumPy compares their shapes **from the right**. Two dimensions are compatible when they are equal, or when one of them is `1` (in which case it is stretched to match). Missing leading dimensions are treated as `1`.

```python
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6]])
row = np.array([10, 20, 30])
print(a + row)
```

`a` has shape `(2, 3)`; `row` has shape `(3,)`, treated as `(1, 3)`. The `1` stretches to match `2`, so `row` is conceptually added to every row of `a`, without ever actually copying it twice.

## A column vector with newaxis

To broadcast down the **rows** instead, you need a column shape, `(n, 1)`, which `np.newaxis` builds from a plain 1-D array:

```python
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6]])
col = np.array([100, 200])
print(a + col[:, np.newaxis])
```

`col[:, np.newaxis]` has shape `(2, 1)`; the `1` stretches across the 3 columns, adding `100` to the whole first row and `200` to the whole second.

## Centring columns: a real use

```python
import numpy as np

a = np.array([[1.0, 100.0], [3.0, 300.0], [5.0, 200.0]])
means = a.mean(axis=0)
print(means)
print(a - means)
```

`a.mean(axis=0)` has shape `(2,)`, one mean per column; subtracting it from `a` (shape `(3, 2)`) broadcasts those two means down all three rows in one expression — the same idea used throughout the rest of this tier.

## Reading a broadcasting error

<!-- expect-error -->
```python
import numpy as np

a = np.ones((3, 4))
b = np.ones((3,))
a + b
```

Comparing shapes from the right: `4` versus `3` — neither is `1` and they are not equal, so NumPy raises `ValueError: operands could not be broadcast together`. The fix is usually `b[:, np.newaxis]` (giving `b` shape `(3, 1)`) if you meant "one value per row", or making `b` length 4 if you meant "one value per column".

## Watch out: (3,) plus (3,1) makes a (3,3)

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([[10], [20], [30]])
print(a + b)
```

`a` has shape `(3,)` (treated as `(1, 3)`); `b` has shape `(3, 1)`. Both dimensions have a `1` to stretch, so the result broadcasts to `(3, 3)` — every combination of the two, which is easy to trigger by accident when you meant simple, same-shape addition.

## Common mistakes

- Forgetting that shapes are compared from the **right**, not the left.
- Adding a 1-D array to a 2-D one when you meant to broadcast down columns, and getting rows instead (or vice versa) — check with `np.newaxis`.
- Being surprised by an accidental `(n, n)` result when two differently-shaped 1-D-ish arrays both have a `1` to stretch.
- Reaching for a loop the moment two shapes do not match exactly, instead of reshaping one side.

## Recap

- Shapes are compared from the right; a `1` in either shape stretches to match the other.
- `np.newaxis` turns a 1-D array into an explicit row or column so it broadcasts the way you intend.
- A broadcasting `ValueError` names the two shapes that could not be matched — read it literally.
- `(n,)` plus `(n, 1)` broadcasts to `(n, n)`, which is rarely what was intended.

## Your turn

In the **Practice** tab you write `centre(a)`, subtracting each column's mean by broadcasting. Then three challenges use real data.
