Sorting an array often matters less than knowing **where** something belongs, or **which positions** would sort it. NumPy separates these ideas cleanly.

You will learn:

- `sort` versus `argsort`
- `unique`, with counts and an inverse mapping
- `searchsorted` for fast lookups in sorted data
- `isin`, `intersect1d`, `union1d`, and top-k with `argpartition`

## sort versus argsort

```python
import numpy as np

a = np.array([30, 10, 20])
print(np.sort(a))
print(np.argsort(a))
print(a[np.argsort(a)])
```

`np.sort` returns the **values**, sorted. `np.argsort` returns the **positions** that would sort the array — often more useful, because you can use those positions to sort a second, related array the same way (for example, sorting names by a matching array of scores).

## unique, with counts and inverse

```python
import numpy as np

a = np.array(["b", "a", "b", "c", "a", "a"])
values, counts = np.unique(a, return_counts=True)
print(values, counts)

values, inverse = np.unique(a, return_inverse=True)
print(values, inverse)
```

`return_counts=True` reports how many times each distinct value occurred, aligned with `values`. `return_inverse=True` instead returns, for every original element, the index into `values` it came from — useful for turning labels into compact integer codes.

## searchsorted

```python
import numpy as np

sorted_a = np.array([10, 20, 30, 40])
print(np.searchsorted(sorted_a, 25))
print(np.searchsorted(sorted_a, 20))
print(np.searchsorted(sorted_a, 20, side="right"))
```

`searchsorted` runs binary search — much faster than scanning — but only works correctly on an **already sorted** array. `side="left"` (the default) returns the position before any equal element; `side="right"` returns the position after.

## isin, intersect1d, union1d

```python
import numpy as np

a = np.array([1, 2, 3, 4, 5])
b = np.array([3, 4, 5, 6, 7])
print(np.isin(a, b))
print(np.intersect1d(a, b))
print(np.union1d(a, b))
```

`isin` checks membership element-by-element; `intersect1d`/`union1d` return the sorted, de-duplicated overlap or combination of two arrays.

## Top-k with argpartition

Fully sorting an array to find just the top few values does more work than necessary. `argpartition` only guarantees the top `k` are on one side, in no particular order within that side — faster for large arrays, at the cost of needing an extra sort if the **order** of the top `k` also matters:

```python
import numpy as np

a = np.array([5, 1, 9, 3, 7, 2])
k = 3
top_k = np.argpartition(a, -k)[-k:]
print(sorted(a[top_k], reverse=True))
```

## Watch out: sorting along the wrong axis

```python
import numpy as np

a = np.array([[3, 1], [2, 4]])
print(np.sort(a, axis=0))
print(np.sort(a, axis=1))
```

Both are valid, but they sort completely different things — each **column** independently versus each **row** independently. Always check which axis you actually meant.

## Common mistakes

- Using `sort` when you actually needed the **positions** (`argsort`) to reorder a second array in step.
- Calling `searchsorted` on data that is not actually sorted, and getting a meaningless answer with no error.
- Assuming `argpartition`'s top-`k` slice comes out in sorted order; it does not, by design.
- Sorting along the default (or wrong) axis without checking.

## Recap

- `argsort` gives positions, which is usually more useful than `sort`'s values alone.
- `unique` can report counts or an inverse mapping back to the original data.
- `searchsorted` is a fast binary search, valid only on already-sorted data.
- `argpartition` finds the top `k` faster than a full sort, but does not sort them.

## Your turn

In the **Practice** tab you write `top_k_idx(a, k)`. Then three challenges use real data.
