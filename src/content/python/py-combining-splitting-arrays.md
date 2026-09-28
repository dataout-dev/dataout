Building bigger arrays out of smaller ones, and breaking big ones apart, comes up constantly once you are working with real, messy data pulled from several places.

You will learn:

- `concatenate`, `stack`, `vstack`, `hstack`
- `split` and `array_split`
- `tile` and `repeat`
- `meshgrid`

## concatenate, stack and the "v"/"h" helpers

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(np.concatenate([a, b]))
print(np.stack([a, b]))
print(np.vstack([a, b]))
print(np.hstack([a, b]))
```

`concatenate` joins along an **existing** axis (1-D `a` and `b` end up as one longer 1-D array). `stack` creates a **new** axis, turning two 1-D arrays into one 2-D array. `vstack`/`hstack` are convenience wrappers: stack as new rows, or join side-by-side as columns.

## Watch out: shapes must agree except along the joining axis

<!-- expect-error -->
```python
import numpy as np

a = np.zeros((2, 3))
b = np.zeros((2, 4))
np.vstack([a, b])
```

Stacking as rows (`vstack`) requires every array to already agree on the number of **columns**; here `3` and `4` do not match, so it raises `ValueError`.

## split and array_split

```python
import numpy as np

a = np.arange(9)
print(np.split(a, 3))
print(np.array_split(np.arange(10), 3))
```

`np.split` requires the array to divide **evenly** into the requested number of pieces, and raises otherwise; `np.array_split` is the forgiving version, spreading any remainder across the first few pieces.

## tile and repeat

```python
import numpy as np

a = np.array([1, 2, 3])
print(np.tile(a, 2))
print(np.repeat(a, 2))
```

`tile` repeats the **whole array** end to end; `repeat` repeats **each element** where it stands. They read very differently: `tile([1,2,3], 2)` is `1 2 3 1 2 3`, while `repeat([1,2,3], 2)` is `1 1 2 2 3 3`.

## meshgrid

`meshgrid` builds coordinate grids from two 1-D arrays, which is the standard way to evaluate a function over every combination of two ranges:

```python
import numpy as np

x = np.array([1, 2, 3])
y = np.array([10, 20])
xx, yy = np.meshgrid(x, y)
print(xx)
print(yy)
print(xx + yy)
```

`xx` repeats `x` down every row; `yy` repeats `y` across every column. Combining them element-wise (`xx + yy` here) evaluates a two-variable function at every `(x, y)` pair in one vectorised step.

## Common mistakes

- Confusing `concatenate` (joins along an existing axis) with `stack` (creates a new one).
- Reaching for `np.split` on data that does not divide evenly, and hitting a `ValueError` that `array_split` would have avoided.
- Mixing up `tile` (repeats the whole sequence) and `repeat` (repeats each element).
- Forgetting that `meshgrid`'s two outputs must be combined together (as in `xx + yy`) to actually evaluate something over the grid.

## Recap

- `concatenate` joins along an existing axis; `stack` adds a new one; `vstack`/`hstack` are shortcuts for the common row/column cases.
- `split` needs an even division; `array_split` handles remainders.
- `tile` repeats the whole array; `repeat` repeats each element in place.
- `meshgrid` builds coordinate grids for evaluating a function over every combination of two ranges.

## Your turn

In the **Practice** tab you write `mult_table(n)` with `meshgrid`. Then three challenges use real data.
