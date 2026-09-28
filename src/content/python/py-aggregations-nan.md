Aggregations collapse an array down to a summary: a sum, a mean, a maximum. The `axis` argument controls **which dimension disappears**, and NumPy's `nan`-aware versions let missing data skip itself instead of poisoning the whole result.

You will learn:

- `sum`, `mean`, `std`, `min`, `max`, `argmin`, `argmax` with `axis=`
- `keepdims`
- `cumsum` and `cumprod`
- the `nan`-aware versions, and `percentile`/`median`

## axis names what disappears

```python
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6]])
print(a.sum())
print(a.sum(axis=0))
print(a.sum(axis=1))
```

`a.sum()` collapses everything to one number. `axis=0` collapses the **rows**, leaving one result per column (`[5, 7, 9]`). `axis=1` collapses the **columns**, leaving one result per row (`[6, 15]`). A useful way to remember it: "axis=0" removes axis 0 (the rows), "axis=1" removes axis 1 (the columns).

## keepdims

```python
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6]])
print(a.sum(axis=1).shape)
print(a.sum(axis=1, keepdims=True).shape)
```

`keepdims=True` keeps the collapsed axis as a length-1 dimension instead of dropping it, which is exactly the shape you need to broadcast the result back against the original array (for example, to compute a percentage of a row's total).

## argmin, argmax, cumsum, cumprod

```python
import numpy as np

a = np.array([3, 1, 4, 1, 5])
print(a.argmin(), a.argmax())
print(np.cumsum(a))
print(np.cumprod(a))
```

`argmin`/`argmax` return the **position** of the smallest/largest value (the first one, if there is a tie), not the value itself. `cumsum`/`cumprod` return a running total/product, the same length as the input.

## NaN-aware aggregations

```python
import numpy as np

a = np.array([1.0, np.nan, 3.0, 4.0])
print(np.mean(a))
print(np.nanmean(a))
print(np.nanstd(a))
print(np.nanmax(a))
```

Plain `np.mean` propagates `nan`: a single missing value makes the **whole** result `nan`. Every `nan`-prefixed function (`nanmean`, `nanstd`, `nanvar`, `nanmax`, `nanmin`, `nansum`, ...) instead skips missing values and aggregates over what remains.

## percentile and median

```python
import numpy as np

a = np.array([7, 1, 5, 3, 9])
print(np.median(a))
print(np.percentile(a, 25))
print(np.percentile(a, [25, 50, 75]))
```

`np.percentile` accepts a single percentile or a list of them at once.

## Common mistakes

- Using plain `mean`/`std`/`max` on data that might contain `nan`, and getting a silent `nan` result instead of an error to notice.
- Mixing up `axis=0` and `axis=1`; when unsure, check the **shape** of the result against what you expected.
- Forgetting `keepdims=True` when the aggregated result needs to broadcast back against the original array.
- Confusing `argmax` (a position) with `max` (a value).

## Recap

- `axis=0` collapses rows (one result per column); `axis=1` collapses columns (one result per row).
- `keepdims=True` keeps the reduced axis as length 1, ready for broadcasting.
- `argmin`/`argmax` return positions; `cumsum`/`cumprod` return running totals.
- The `nan`-prefixed functions skip missing values instead of propagating `nan`.

## Your turn

In the **Practice** tab you write `row_means(a)`, a NaN-aware row-wise mean. Then three challenges use real, genuinely missing data.
