A **boolean mask** is an array of `True`/`False` values, usually built from a comparison, used to select or change exactly the elements that matter.

You will learn:

- building masks with comparisons
- combining masks with `&`, `|` and `~`
- using a mask to select or assign
- `np.where` and `np.select`

## Building and using a mask

```python
import numpy as np

a = np.array([3, -1, 4, -5, 9])
mask = a > 0
print(mask)
print(a[mask])
```

`a > 0` compares every element at once and returns a same-shaped boolean array. Indexing `a` with that mask keeps only the `True` positions.

## Watch out: `and`/`or` do not work on arrays

<!-- expect-error -->
```python
import numpy as np

a = np.array([1, 2, 3])
a > 0 and a < 10
```

Python's `and`/`or` expect a single `True`/`False`, but a multi-element array cannot be reduced to one without saying how. Use `&`, `|` and `~` instead, **with parentheses around each comparison**, because `&` binds tighter than `>`:

```python
import numpy as np

a = np.array([-2, 1, 5, 8, -3])
print(a[(a > -3) & (a < 6)])
print(a[(a < 0) | (a > 5)])
print(a[~(a > 0)])
```

## Assigning through a mask

```python
import numpy as np

a = np.array([3, -1, 4, -5, 9])
a[a < 0] = 0
print(a)
```

This is the idiomatic, vectorised way to replace values that meet a condition, with no loop.

## Fancy indexing with integer arrays

Besides boolean masks, you can index with an array of **positions**:

```python
import numpy as np

a = np.array([10, 20, 30, 40, 50])
idx = np.array([0, 0, 3])
print(a[idx])
```

Unlike a slice, fancy indexing always returns a **copy**, and can repeat or reorder elements freely.

## np.where and np.select

```python
import numpy as np

a = np.array([-2, 5, -8, 3])
print(np.where(a > 0, a, 0))

scores = np.array([45, 72, 88, 60])
grades = np.select(
    [scores >= 80, scores >= 60],
    ["A", "B"],
    default="C",
)
print(grades)
```

`np.where(condition, if_true, if_false)` picks element-by-element between two arrays (or an array and a scalar). `np.select` extends this to several conditions, checked in order, with a `default` for anything that matches none of them.

## Common mistakes

- Writing `a > 0 and a < 10` instead of `(a > 0) & (a < 10)`, and getting a confusing error about the truth value of an array.
- Forgetting the parentheses around each comparison when combining with `&`/`|`.
- Expecting fancy indexing (a list or array of positions) to return a view; it always copies.
- Listing `np.select`'s conditions in an order where an earlier, broader condition accidentally shadows a later, more specific one.

## Recap

- A boolean mask is built from a comparison and used to select (`a[mask]`) or assign (`a[mask] = value`).
- Combine conditions with `&`, `|`, `~`, always with parentheses; plain `and`/`or` do not work element-wise.
- `np.where` picks between two alternatives; `np.select` checks several conditions in order.

## Your turn

In the **Practice** tab you write `relu(a)`, replacing negative values with zero. Then three challenges use real flight data.
