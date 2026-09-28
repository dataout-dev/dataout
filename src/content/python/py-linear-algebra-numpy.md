`numpy.linalg` covers the standard linear-algebra toolkit: matrix multiplication, solving systems of equations, inverses, determinants and more.

You will learn:

- `dot`, `matmul` and `@`
- transpose, inverse and determinant
- solving linear systems directly, instead of inverting
- norms, and a glance at eigenvalues and SVD

## dot, matmul and @

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])
print(a @ b)
print(np.matmul(a, b))
print(np.dot(a, b))
```

For 2-D arrays, `@`, `matmul` and `dot` all compute the same matrix product. `@` is usually the clearest to read. (They can differ for higher-dimensional or 1-D inputs, which is why `@`/`matmul` are generally preferred for matrices specifically.)

## transpose, inverse, determinant

```python
import numpy as np

a = np.array([[4.0, 7.0], [2.0, 6.0]])
print(a.T)
print(np.linalg.inv(a))
print(np.linalg.det(a))
```

`np.linalg.inv` computes the matrix inverse; `np.linalg.det` computes the determinant (which is `0` exactly when a matrix has no inverse).

## Solving a system directly

Given `A x = b`, you could compute `x = inv(A) @ b` — but `np.linalg.solve` is the numerically preferred way, because it avoids computing a full inverse just to immediately multiply it away:

```python
import numpy as np

A = np.array([[2.0, 1.0], [1.0, 3.0]])
b = np.array([5.0, 10.0])
x = np.linalg.solve(A, b)
print(x)
print(A @ x)
```

The last line checks the answer: multiplying `A` by the solution `x` reproduces `b`.

## Watch out: inverting matrices instead of solving

```python
import numpy as np

A = np.array([[2.0, 1.0], [1.0, 3.0]])
b = np.array([5.0, 10.0])
via_inverse = np.linalg.inv(A) @ b
via_solve = np.linalg.solve(A, b)
print(via_inverse, via_solve)
```

Both give (approximately) the same answer for a small, well-behaved system like this one. The real issue shows up on larger or nearly-singular matrices, where computing a full inverse is slower and less numerically stable than `solve`, which is specialised for exactly this problem.

## Norms

```python
import numpy as np

v = np.array([3.0, 4.0])
print(np.linalg.norm(v))
print(np.linalg.norm(v, ord=1))
```

The default norm is the familiar Euclidean length (`sqrt(sum(v**2))`); `ord=1` gives the sum of absolute values instead.

## Eigenvalues and SVD, at a glance

```python
import numpy as np

a = np.array([[2.0, 0.0], [0.0, 3.0]])
values, vectors = np.linalg.eig(a)
print(values)

u, s, vt = np.linalg.svd(np.array([[1.0, 0.0], [0.0, 1.0]]))
print(s)
```

`eig` returns a matrix's eigenvalues and eigenvectors. `svd` (singular value decomposition) factors any matrix into three parts and underlies techniques like PCA, covered later in this tier — for now, just know these exist and where to find them.

## Common mistakes

- Solving a system by inverting the matrix by hand, when `np.linalg.solve` is faster and more numerically stable.
- Confusing `*` (element-wise multiplication) with `@` (matrix multiplication) on 2-D arrays.
- Forgetting that `np.linalg.solve` requires a square, non-singular `A`.
- Assuming a determinant of exactly `0` only happens in "made up" examples; nearly-singular real data can produce a determinant close enough to zero to cause real numerical trouble.

## Recap

- `@` (or `matmul`) is matrix multiplication; `*` is element-wise.
- `np.linalg.solve(A, b)` solves `A x = b` directly, and is preferred over inverting `A` by hand.
- `np.linalg.norm`, `eig` and `svd` cover lengths, eigen-decomposition and singular value decomposition.

## Your turn

In the **Practice** tab you write `solve2(A, b)`. Then three challenges use real data.
