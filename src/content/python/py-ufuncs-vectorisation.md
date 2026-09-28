A **ufunc** (universal function) is a NumPy function that applies element-by-element across an entire array, in compiled code, with no Python-level loop. `sqrt`, `exp`, `log`, `sin` and even the ordinary `+`/`*` operators are all ufuncs.

You will learn:

- common ufuncs, and that operators are ufuncs too
- writing whole formulas as vectorised expressions
- `out=` and `where=`
- why `np.vectorize` is not a speed tool

## ufuncs

```python
import numpy as np

a = np.array([1.0, 4.0, 9.0, 16.0])
print(np.sqrt(a))
print(np.exp(np.array([0.0, 1.0, 2.0])))
print(np.log(np.array([1.0, np.e, np.e ** 2])))
print(np.sin(np.array([0.0, np.pi / 2])))
```

Each call applies the function to every element in one vectorised pass.

## Whole formulas, vectorised

Because `+`, `-`, `*`, `/` and `**` are themselves ufuncs, an entire mathematical formula written on arrays runs without any explicit loop:

```python
import numpy as np

x = np.array([1.0, 2.0, 3.0])
y = np.array([4.0, 5.0, 6.0])
distance = np.sqrt((x - y) ** 2)
print(distance)
```

This is the core habit of NumPy code: think in terms of "the whole array at once", not "for each element".

## out= and where=

```python
import numpy as np

a = np.array([1.0, 4.0, 9.0])
result = np.zeros_like(a)
np.sqrt(a, out=result)
print(result)

b = np.array([-1.0, 4.0, -9.0])
safe = np.full_like(b, np.nan)
np.sqrt(b, out=safe, where=b >= 0)
print(safe)
```

`out=` writes the result into an existing array instead of allocating a new one — useful for avoiding temporaries in a tight loop. `where=` restricts which positions are computed at all, leaving the rest as whatever `out` already held (here, `nan`, since `sqrt` of a negative number is undefined).

## Watch out: np.vectorize is not speed

```python
import numpy as np

slow = np.vectorize(lambda x: x * 2)
print(slow(np.array([1, 2, 3])))
```

`np.vectorize` exists for convenience — turning an ordinary Python function into something that accepts arrays — but underneath it still calls the Python function once per element. It is **not** a way to make a loop fast; a genuine ufunc, or a vectorised expression built from real ufuncs, is what actually runs in compiled code.

## Common mistakes

- Reaching for `np.vectorize` expecting a real speedup; it mainly buys convenience, not performance.
- Writing a Python `for` loop to apply `sqrt`/`exp`/`log` element by element, when the ufunc already handles the whole array.
- Forgetting that `out=` requires an array of the right shape and dtype already sitting there.
- Passing `where=` without also passing `out=`; the unfilled positions would otherwise be left uninitialised.

## Recap

- A ufunc runs element-by-element across a whole array in compiled code; operators like `+` and `*` are ufuncs too.
- Writing a formula directly on arrays vectorises the whole thing at once.
- `out=` reuses memory instead of allocating a new array; `where=` limits which positions are computed.
- `np.vectorize` is a convenience wrapper around a Python loop, not a performance tool.

## Your turn

In the **Practice** tab you write `distances(p, q)`, the Euclidean distance between arrays of points. Then three challenges use real data.
