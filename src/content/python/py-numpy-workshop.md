A workshop lesson: no new functions, just putting the whole toolkit to work on two small, self-contained problems — a grayscale-image-like array, and a random walk.

You will learn:

- treating a 2-D array as a grayscale image
- flipping, cropping and thresholding with slicing
- simulating and inspecting a random walk
- a first look at `np.testing`

## An image as an array

A grayscale image is just a 2-D array of brightness values. Every idea from this section applies directly:

```python
import numpy as np

image = np.array([
    [10, 20, 30, 40],
    [50, 60, 70, 80],
    [90, 100, 110, 120],
])
print(image.shape)
print(image[::-1])
print(image[:, ::-1])
print(image[0:2, 1:3])
```

`image[::-1]` flips it vertically (reversing the row order); `image[:, ::-1]` flips it horizontally; a slice on both axes crops it.

## Thresholding

```python
import numpy as np

image = np.array([[10, 200, 30], [180, 60, 220]])
bright = (image > 100).astype(int)
print(bright)
```

A boolean mask, cast to `int`, turns a grayscale image into a black-and-white one in a single vectorised line.

## A simple 3x3 blur, by hand

```python
import numpy as np

def blur(a):
    a = np.asarray(a, dtype=float)
    out = np.zeros_like(a)
    rows, cols = a.shape
    for i in range(rows):
        for j in range(cols):
            r0, r1 = max(0, i - 1), min(rows, i + 2)
            c0, c1 = max(0, j - 1), min(cols, j + 2)
            out[i, j] = a[r0:r1, c0:c1].mean()
    return out

image = np.array([[10.0, 20.0, 30.0], [40.0, 50.0, 60.0], [70.0, 80.0, 90.0]])
print(blur(image))
```

Every cell becomes the average of its real, in-bounds neighbours — corners and edges naturally average a smaller block than interior cells, because the slice simply cannot reach outside the array.

## Simulating a random walk

```python
import numpy as np

rng = np.random.default_rng(0)
steps = rng.choice([-1, 1], size=20)
position = np.cumsum(steps)
print(position)
print(position.max(), position.min())
```

Each step is `+1` or `-1`; `cumsum` turns the sequence of steps into the sequence of positions after each one. `position.max()`/`.min()` show how far the walk wandered in each direction.

## A glance at np.testing

```python
import numpy as np

a = np.array([0.1 + 0.2, 1.0])
b = np.array([0.3, 1.0])
np.testing.assert_allclose(a, b, atol=1e-9)
print("matches within tolerance")
```

`np.testing.assert_allclose` is built for exactly the situation you meet constantly with floating-point results: two arrays that should be "the same" mathematically, but might differ in the last few bits from rounding. Comparing with `==` would be too strict; `assert_allclose` raises only if the difference is bigger than the given tolerance.

## Common mistakes

- Flipping only one axis when the task needed both (vertical **and** horizontal).
- Forgetting that a threshold mask needs `.astype(int)` (or similar) to become plain 0s and 1s rather than `True`/`False`.
- Comparing floating-point simulation results with `==` instead of `np.testing.assert_allclose` or `math.isclose`.
- Simulating a random walk without a seed, then being unable to reproduce a specific run to debug it.

## Your turn

In the **Practice** tab you write `blur(a)`, the same edge-aware 3x3 filter shown above. Then three challenges use real data.
