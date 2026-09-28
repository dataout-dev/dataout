An array's **shape** is the tuple of its sizes along each axis. Reshaping lets you look at the same data through a different shape, without moving anything in memory.

You will learn:

- `shape`, `ndim` and `size`
- `reshape`, `ravel`, `flatten` and `transpose`
- using `-1` to let NumPy work out one dimension
- axes, and why reshape can return a view

## shape, ndim, size

```python
import numpy as np

a = np.arange(12).reshape(3, 4)
print(a.shape, a.ndim, a.size)
```

`shape` is `(3, 4)`: 3 rows, 4 columns. `ndim` is how many axes there are (2 here). `size` is the total number of elements (`3 * 4 = 12`), regardless of shape.

## reshape and -1

```python
import numpy as np

flat = np.arange(12)
print(flat.reshape(3, 4))
print(flat.reshape(4, 3))
print(flat.reshape(-1, 6))
```

`reshape` requires the new shape to hold exactly as many elements as before; NumPy will happily work out one dimension for you if you pass `-1` in its place — `reshape(-1, 6)` means "as many rows as needed to make 6 columns work".

<!-- expect-error -->
```python
import numpy as np

np.arange(10).reshape(3, 4)
```

10 elements cannot fill a 3×4 (12-element) shape, so this raises `ValueError`.

## ravel, flatten and transpose

```python
import numpy as np

a = np.arange(6).reshape(2, 3)
print(a.T)
print(a.flatten())
print(a.ravel())
```

`.T` (or `np.transpose`) swaps the axes, turning rows into columns. `flatten()` always returns an independent 1-D copy; `ravel()` returns a flattened view when possible (a copy only when the data cannot be viewed that way), which is faster but means changes to the result can sometimes leak back into the original.

## newaxis

`np.newaxis` inserts a new axis of length 1, which is useful for turning a 1-D array into a row or column for broadcasting later:

```python
import numpy as np

a = np.array([1, 2, 3])
print(a[np.newaxis, :].shape)
print(a[:, np.newaxis].shape)
```

## Watch out: reshape can return a view

```python
import numpy as np

a = np.arange(6)
b = a.reshape(2, 3)
b[0, 0] = 99
print(a)
```

`b` is a view of the same data as `a`, just read through a different shape, so writing into `b` changed `a` too.

## Common mistakes

- Confusing `size` (total element count) with `shape` (the tuple of per-axis lengths).
- Using more than one `-1` in a single `reshape` call, which is not allowed since it would be ambiguous.
- Assuming `reshape` always copies; often it does not.
- Forgetting that `.T` also returns a view, not a new array.

## Recap

- `shape`, `ndim` and `size` describe an array's structure.
- `reshape` reinterprets the same data with a new shape; `-1` fills in a dimension automatically.
- `flatten()` always copies; `ravel()` and `.T` usually return views.
- Because reshape can return a view, changes to the reshaped array can affect the original.

## Your turn

In the **Practice** tab you write `to_rows(a)`, reshaping a flat array into rows of three. Then three challenges use real data.
