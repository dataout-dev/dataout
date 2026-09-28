Most of the time, writing clear vectorised NumPy code is already fast enough. This lesson is about the handful of ideas worth knowing once you *do* need to go further: how arrays sit in memory, how to avoid unnecessary temporaries, and `einsum` as a compact notation for many linear-algebra operations at once.

You will learn:

- C order versus Fortran order
- strides, informally
- temporary arrays, and in-place operations
- `einsum`, and when NumPy alone is not enough

## C order versus Fortran order

```python
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6]])
print(a.flags["C_CONTIGUOUS"])
b = np.asfortranarray(a)
print(b.flags["F_CONTIGUOUS"])
```

In C (row-major) order, an entire row sits next to itself in memory before the next row begins; in Fortran (column-major) order, it is columns that are contiguous. Most NumPy arrays default to C order. The choice mostly matters for performance: operating along the contiguous direction is faster than "jumping around" memory.

## Strides, informally

```python
import numpy as np

a = np.arange(12).reshape(3, 4)
print(a.strides)
```

`strides` says how many bytes to skip to move one step along each axis. Reshape, transpose and many slices are implemented purely by changing the shape and strides of a **view**, without touching the underlying data at all — part of why they can be so cheap.

## Temporary arrays

```python
import numpy as np

a = np.arange(1_000_000, dtype=float)
b = a * 2 + 1
```

`a * 2` allocates one new temporary array; adding `1` to it allocates another. For huge arrays or tight loops, this adds up. In-place operators reuse existing memory instead:

```python
import numpy as np

a = np.arange(10, dtype=float)
a *= 2
a += 1
print(a)
```

## einsum, briefly

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])
print(np.einsum("ij,jk->ik", a, b))
print(a @ b)
```

The subscript string names each array's axes and says which ones are summed over; `"ij,jk->ik"` is exactly ordinary matrix multiplication, spelled out explicitly. `einsum` can express many reductions, transposes and products in one compact, often faster call, once you are comfortable reading the notation.

## When NumPy is not enough

For code that stays slow even after vectorising properly, the usual next steps are: check whether the *algorithm* itself is the bottleneck first; consider whether pandas or a purpose-built library already does it faster; and, outside this browser-based playground, tools like Numba or Cython can compile genuinely custom numeric loops. Numba specifically is not available in this browser build, so it is mentioned here only so the name is familiar if you meet it elsewhere.

## Watch out: premature optimisation

Rewriting clear code into a dense `einsum` expression, or chasing in-place operations everywhere "just in case", trades away readability for a speed difference that may not even be measurable for your actual data size. Profile or time the real bottleneck first; optimise what the numbers say to optimise, not what looks slow.

## Recap

- C order keeps rows contiguous in memory; Fortran order keeps columns contiguous.
- Reshape, transpose and many slices are cheap because they just describe a different view over the same memory.
- Chained operations create temporary arrays; in-place operators (`+=`, `*=`) can avoid some of them.
- `einsum` expresses sums-and-products over named axes compactly, covering many linear-algebra operations at once.
