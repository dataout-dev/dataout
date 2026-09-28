NumPy's modern random API is built around explicit **Generator** objects, seeded once, so that "random" results are actually reproducible whenever you need them to be — for testing, grading, or a repeatable simulation.

You will learn:

- `default_rng` and seeds
- `integers`, `random`, `normal`, `choice`, `shuffle`, `permutation`
- reproducibility, and why the exact sequence of calls matters
- a first Monte Carlo simulation

## default_rng and seeds

```python
import numpy as np

rng = np.random.default_rng(0)
print(rng.random(3))

rng_again = np.random.default_rng(0)
print(rng_again.random(3))
```

The same seed always produces the same sequence of draws. A `Generator` is **stateful**: each call consumes more of its internal random stream, so calling `rng.random(3)` twice on the *same* generator gives two *different* triplets, while two *fresh* generators built with the same seed start from scratch identically.

## The main drawing methods

```python
import numpy as np

rng = np.random.default_rng(1)
print(rng.integers(0, 10, size=5))
print(rng.random(3))
print(rng.normal(loc=0, scale=1, size=3))
print(rng.choice(["a", "b", "c"], size=4, replace=True))
```

`integers(low, high, size)` draws whole numbers (`high` excluded, like `range`). `random(size)` draws floats in `[0, 1)`. `normal(loc, scale, size)` draws from a normal distribution. `choice(options, size, replace)` samples from an existing sequence, with or without replacement.

## shuffle versus permutation

```python
import numpy as np

rng = np.random.default_rng(2)
a = np.array([1, 2, 3, 4, 5])
rng.shuffle(a)
print(a)

rng2 = np.random.default_rng(2)
order = rng2.permutation(5)
print(order)
```

`shuffle` reorders an array **in place** and returns nothing; `permutation` returns a **new** shuffled array (or, given a single integer `n`, a shuffled `arange(n)`) without touching the original.

## Watch out: legacy np.random.seed

Older code (and plenty of tutorials) use a single, global `np.random.seed(...)` followed by calls like `np.random.rand(...)`. That still works, but shares one hidden, global state across your whole program, which can cause surprising interactions between unrelated pieces of code. Prefer an explicit `Generator` from `default_rng`, passed around or created fresh where it is needed.

## A first Monte Carlo simulation

```python
import numpy as np

rng = np.random.default_rng(0)
points = rng.random((10000, 2))
inside = (points[:, 0] ** 2 + points[:, 1] ** 2) <= 1
pi_estimate = 4 * inside.sum() / 10000
print(round(pi_estimate, 3))
```

This is the classic "throw darts at a square, count how many land inside the inscribed circle" estimate of pi: the circle's area is `pi * r^2` and the square's is `(2r)^2`, so the ratio of points landing inside approximates `pi / 4`.

## Common mistakes

- Calling a generator's drawing method twice when the task expects **one** call of a specific shape — the two approaches consume the random stream differently and will not match, even with the same seed.
- Using `shuffle` when you needed the original array left alone (`permutation` instead).
- Relying on the legacy global `np.random.seed`, then being surprised that some other piece of code advanced the same shared state first.
- Forgetting that `high` in `integers(low, high)` is **excluded**, exactly like `range`.

## Recap

- `default_rng(seed)` creates a reproducible, independent random generator.
- `integers`, `random`, `normal` and `choice` cover most sampling needs; `shuffle` mutates in place, `permutation` does not.
- The exact sequence and shape of calls matters for reproducing a specific result with a given seed.
- A Monte Carlo simulation turns a probability question into a counting exercise over random samples.

## Your turn

In the **Practice** tab you write `estimate_pi(n, seed=0)`. Then three challenges use real data.
