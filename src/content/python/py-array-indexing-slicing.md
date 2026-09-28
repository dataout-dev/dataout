NumPy extends Python's slicing to any number of dimensions, and adds one crucial wrinkle: most slices are **views**, not copies.

You will learn:

- basic slicing in N dimensions
- negative indices and negative steps
- views versus copies, and `np.shares_memory`
- assigning into a slice

## Slicing in N dimensions

```python
import numpy as np

a = np.arange(12).reshape(3, 4)
print(a[0])
print(a[0, 2])
print(a[:, 1])
print(a[0:2, 1:3])
```

A comma separates axes: `a[rows, columns]`. `a[:, 1]` means "every row, column 1", giving a whole column back as a 1-D array. `a[0:2, 1:3]` slices both axes at once.

## Negative indices and steps

```python
import numpy as np

a = np.arange(10)
print(a[-1])
print(a[-3:])
print(a[::-1])
print(a[::2])
```

Negative indices count from the end, exactly like plain Python sequences. A step of `-1` reverses the array; any other step skips elements.

## Views versus copies

Basic slicing (using `:` and integers, not a list or a boolean mask) never copies data — it returns a **view** onto the same memory:

```python
import numpy as np

a = np.arange(6)
view = a[1:4]
view[0] = 99
print(a)
print(np.shares_memory(a, view))
```

`np.shares_memory` confirms it: `view` and `a` occupy the same underlying buffer. If you need an independent copy, ask for one explicitly with `.copy()`:

```python
import numpy as np

a = np.arange(6)
safe = a[1:4].copy()
safe[0] = 99
print(a)
print(np.shares_memory(a, safe))
```

## Assigning into a slice

```python
import numpy as np

a = np.zeros(6)
a[2:4] = [7, 8]
print(a)

grid = np.zeros((3, 3))
grid[1, :] = 5
print(grid)
```

Assigning into a slice writes in place; the right-hand side just needs a compatible shape (or a single value, which broadcasts).

## Common mistakes

- Assuming `a[1:4]` is independent of `a`, then being surprised when editing one changes the other.
- Forgetting the comma between axes and writing `a[0][2]` instead of `a[0, 2]` (both work, but `a[0, 2]` avoids building an intermediate array).
- Using a positive step when a reversed order was intended.
- Calling `.copy()` "just in case" everywhere, which is safe but can waste memory when a view would have been fine.

## Recap

- `a[rows, columns, ...]` slices every axis at once, using the same `start:stop:step` syntax as plain Python.
- Basic slicing returns a **view**; `np.shares_memory` can confirm it, and `.copy()` breaks the connection when you need it.
- Assigning into a slice writes in place, and a single value broadcasts across the whole selection.

## Your turn

In the **Practice** tab you write `corners(a)`, returning the four corners of a 2-D array. Then three challenges use real data.
