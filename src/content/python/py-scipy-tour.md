Beyond `scipy.stats`, SciPy covers optimisation, integration, interpolation and sparse linear algebra — a broad toolbox worth knowing exists, even before you need the specifics of any one corner of it.

You will learn:

- `minimize` and `curve_fit`
- numerical integration
- interpolation
- sparse matrices, briefly

## curve_fit

```python
from scipy.optimize import curve_fit
import numpy as np

def model(x, a, b):
    return a * np.exp(b * x)

x = np.array([0, 1, 2, 3, 4])
y = np.array([1.0, 2.7, 7.4, 20.1, 54.6])
popt, pcov = curve_fit(model, x, y)
print(popt.round(2))
```

`curve_fit` finds the parameters of **any** function you define that best fit the data by least squares — not limited to straight lines, as this exponential example shows.

## minimize

```python
from scipy.optimize import minimize

def cost(params):
    x, y = params
    return (x - 3) ** 2 + (y + 1) ** 2

result = minimize(cost, x0=[0, 0])
print(result.x.round(2))
```

`minimize` finds the input that produces the smallest output of a general function, starting its search from `x0` — useful whenever a problem can be phrased as "find the parameters that minimise this cost".

## minimize_scalar

```python
from scipy.optimize import minimize_scalar

result = minimize_scalar(lambda x: (x - 5) ** 2)
print(round(result.x, 2))
```

`minimize_scalar` is the same idea specialised for a single variable, without needing a starting guess.

## Numerical integration

```python
from scipy import integrate
import numpy as np

value, error = integrate.quad(lambda x: np.sin(x), 0, np.pi)
print(round(value, 4))
```

`integrate.quad` numerically computes a definite integral of a function over a range — here recovering the well-known exact answer, `2`, for `sin(x)` from `0` to `pi`.

## Interpolation

```python
from scipy.interpolate import interp1d

x = [0, 1, 2, 3]
y = [0, 10, 40, 90]
f = interp1d(x, y)
print(f(1.5))
```

`interp1d` builds a function estimating values **between** known data points — linear by default, with other options (`kind="cubic"`, say) for a smoother curve through the same points.

## Sparse matrices, briefly

```python
from scipy import sparse
import numpy as np

dense = np.zeros((1000, 1000))
dense[0, 0] = 1
dense[999, 999] = 2
sparse_version = sparse.csr_matrix(dense)
print(sparse_version.nnz, dense.size)
```

A sparse matrix stores only the non-zero entries (`nnz`, here just 2, versus a million total entries in the dense version) — essential once a matrix is both large and mostly zeros, which happens often in real applications like text data or graphs.

## Watch out: local minima

```python
from scipy.optimize import minimize

def wavy(x):
    return x[0] ** 2 * 0.01 + 2 * (x[0] % 3 - 1.5) ** 2

result_a = minimize(wavy, x0=[0])
result_b = minimize(wavy, x0=[20])
print(round(result_a.x[0], 1), round(result_b.x[0], 1))
```

`minimize`'s default methods find a **local** minimum near the starting guess, not necessarily the global one — different starting points can land in genuinely different places for a function with more than one "valley". Checking with several starting points (or a global-optimisation method, for a harder problem) is worth doing whenever this matters.

## Common mistakes

- Assuming `minimize` found the global minimum without checking from more than one starting point.
- Extrapolating with `interp1d` far outside the original data range, where it raises by default rather than guessing.
- Building a dense array for genuinely large, mostly-zero data instead of a sparse one.
- Forgetting `curve_fit` needs a reasonable model function and can fail to converge for a badly chosen one.

## Recap

- `curve_fit` fits any function's parameters to data; `minimize`/`minimize_scalar` find a function's smallest output.
- `integrate.quad` computes a definite integral numerically; `interp1d` estimates values between known points.
- Sparse matrices store only non-zero entries, essential for large, mostly-zero data.
- `minimize` finds a local minimum near its starting point — try more than one starting point when that matters.

## Your turn

In the **Practice** tab you write `fit_line(x, y)` with `curve_fit`. Then three challenges use real data.
