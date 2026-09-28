import { dat, py } from './common.js'

const num = (c) => dat({ ...c, hidden: 'import numpy as np\n' + (c.hidden ?? '') })

export const numpyLessonsA = [
  {
    id: 'py-numpy-vs-lists',
    title: 'Why NumPy: arrays versus lists, dtypes and creating arrays',
    blurb: 'The ndarray, speed and memory versus lists, dtype, and the main ways to build an array.',
    kind: 'code',
    practice: {
      prompt: 'Write `border_array()`: return a 5×5 integer array with 1s all around the border and 0s everywhere inside.',
      starter: 'import numpy as np\n\ndef border_array():\n    ...\n',
      solution: py`import numpy as np

def border_array():
    a = np.zeros((5, 5), dtype=int)
    a[0, :] = 1
    a[-1, :] = 1
    a[:, 0] = 1
    a[:, -1] = 1
    return a`,
      samples: ['border_array().tolist()', 'border_array().shape'],
      cases: [
        ['The result as nested lists', 'border_array().tolist()'],
        ['The shape is 5x5', 'border_array().shape'],
        ['The dtype is an integer kind', 'border_array().dtype.kind'],
        ['The centre is 0', 'int(border_array()[2, 2])'],
        ['A corner is 1', 'int(border_array()[0, 0])'],
        ['The total of all values', 'int(border_array().sum())'],
      ],
      traps: [
        py`import numpy as np

def border_array():
    return np.ones((5, 5), dtype=int)`,
        py`import numpy as np

def border_array():
    a = np.ones((5, 5), dtype=int)
    a[0, :] = 0
    a[-1, :] = 0
    a[:, 0] = 0
    a[:, -1] = 0
    return a`,
        py`import numpy as np

def border_array():
    a = np.zeros((5, 5), dtype=int)
    a[1, :] = 1
    a[-2, :] = 1
    a[:, 1] = 1
    a[:, -2] = 1
    return a`,
        py`import numpy as np

def border_array():
    a = np.zeros((5, 5))
    a[0, :] = 1
    a[-1, :] = 1
    a[:, 0] = 1
    a[:, -1] = 1
    return a`,
      ],
    },
    real: [
      num({
        title: 'Track lengths as an array',
        use: ['tracks'],
        starter: 'ms = np.array([t["Milliseconds"] for t in tracks[:20]])\nminutes = ...\nanswer = [round(x, 2) for x in minutes.tolist()]\n',
        given: '# tracks is a list of dictionaries. ms is already a numpy array of the first 20 tracks\' lengths in milliseconds.',
        brief: 'Compute `minutes`, an array of the same lengths converted to minutes (`ms / 60000`), without a Python loop.',
        reference: py`ms = np.array([t["Milliseconds"] for t in tracks[:20]])
minutes = ms / 60000
answer = [round(x, 2) for x in minutes.tolist()]`,
        walkthrough: 'Dividing an array by a plain number applies to every element at once; no explicit loop is needed.',
        traps: [py`ms = np.array([t["Milliseconds"] for t in tracks[:20]])
minutes = ms // 60000
answer = [round(x, 2) for x in minutes.tolist()]`],
      }),
      num({
        title: 'Bill lengths with missing values',
        use: ['penguins'],
        starter: 'lengths = np.array([p["bill_length_mm"] for p in penguins], dtype=float)\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. A few have bill_length_mm equal to None, which becomes nan in a float array.',
        brief: 'Count how many entries of `lengths` are `nan`, using `np.isnan`. Store the count as an `int` in `answer`.',
        reference: py`lengths = np.array([p["bill_length_mm"] for p in penguins], dtype=float)
answer = int(np.isnan(lengths).sum())`,
        walkthrough: '`np.isnan` returns a boolean array the same shape as `lengths`; summing booleans counts how many are `True`.',
        traps: [py`lengths = np.array([p["bill_length_mm"] for p in penguins], dtype=float)
answer = int((lengths == None).sum())`],
      }),
      num({
        title: 'Mixed types silently upcast',
        use: ['songs'],
        starter: 'streams = [s["spotify_streams"] for s in songs[:5]]\nwith_missing = streams + [None]\narr = np.array(with_missing, dtype=float)\nanswer = ...\n',
        given: '# songs is a list of dictionaries. with_missing appends a single None to five real stream counts.',
        brief: 'Report the dtype **kind** of `arr` (a one-character string, from `arr.dtype.kind`) in `answer`, to see what an integer-looking list with a missing value actually becomes.',
        reference: py`streams = [s["spotify_streams"] for s in songs[:5]]
with_missing = streams + [None]
arr = np.array(with_missing, dtype=float)
answer = arr.dtype.kind`,
        walkthrough: 'Because one entry cannot be a whole number (`None` becomes `nan`), the whole array is upcast to a floating-point kind (`"f"`), even though every other value looked like an integer.',
        traps: [py`streams = [s["spotify_streams"] for s in songs[:5]]
with_missing = streams + [None]
arr = np.array(with_missing, dtype=float)
answer = "i"`],
      }),
    ],
  },
  {
    id: 'py-array-shape-reshape',
    title: 'Shape, dimensions and reshaping',
    blurb: 'shape, ndim, size, reshape, ravel, flatten, transpose and -1 in reshape.',
    kind: 'code',
    practice: {
      prompt: 'Write `to_rows(a)`: reshape the 1-D array `a` into a 2-D array with 3 columns. If `len(a)` is not a multiple of 3, raise `ValueError("length must be a multiple of 3")`.',
      starter: 'import numpy as np\n\ndef to_rows(a):\n    ...\n',
      solution: py`import numpy as np

def to_rows(a):
    if len(a) % 3 != 0:
        raise ValueError("length must be a multiple of 3")
    return a.reshape(-1, 3)`,
      samples: ['to_rows(np.array([1, 2, 3, 4, 5, 6])).tolist()'],
      cases: [
        ['Two rows of three', 'to_rows(np.array([1, 2, 3, 4, 5, 6])).tolist()'],
        ['The shape', 'to_rows(np.array([1, 2, 3, 4, 5, 6])).shape'],
        ['One row', 'to_rows(np.array([1, 2, 3])).tolist()'],
        ['Four rows', 'to_rows(np.arange(12)).tolist()'],
        ['Raises when not a multiple of three', 'to_rows(np.array([1, 2, 3, 4]))'],
        ['Raises on another bad length', 'to_rows(np.array([1, 2]))'],
      ],
      traps: [
        py`import numpy as np

def to_rows(a):
    if len(a) % 3 != 0:
        raise TypeError("length must be a multiple of 3")
    return a.reshape(-1, 3)`,
        py`import numpy as np

def to_rows(a):
    if len(a) % 3 != 0:
        raise ValueError("length must be a multiple of 3")
    return a.reshape(3, -1)`,
        py`import numpy as np

def to_rows(a):
    if len(a) % 3 == 0:
        raise ValueError("length must be a multiple of 3")
    return a.reshape(-1, 3)`,
      ],
    },
    real: [
      num({
        title: 'Reshaping penguin measurements into pairs',
        use: ['penguins'],
        starter: 'lengths = np.array([p["bill_length_mm"] for p in penguins if p["bill_length_mm"] is not None][:20])\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. lengths already holds 20 real measurements.',
        brief: 'Reshape `lengths` into a `(10, 2)` array — 10 pairs of two, read in order — and store it as nested lists in `answer`.',
        reference: py`lengths = np.array([p["bill_length_mm"] for p in penguins if p["bill_length_mm"] is not None][:20])
pairs = lengths.reshape(10, 2)
answer = pairs.tolist()`,
        walkthrough: '`reshape(10, 2)` reinterprets the same 20 values, read in order, as 10 rows of 2 columns.',
        traps: [py`lengths = np.array([p["bill_length_mm"] for p in penguins if p["bill_length_mm"] is not None][:20])
pairs = lengths.reshape(2, 10)
answer = pairs.tolist()`],
      }),
      num({
        title: 'Track durations reshaped with -1',
        use: ['tracks'],
        starter: 'ms = np.array([t["Milliseconds"] for t in tracks[:24]])\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. ms already holds 24 real durations.',
        brief: 'Reshape `ms` into an array with 4 columns, letting numpy work out the row count with `-1`. Store it as nested lists in `answer`.',
        reference: py`ms = np.array([t["Milliseconds"] for t in tracks[:24]])
answer = ms.reshape(-1, 4).tolist()`,
        walkthrough: '`-1` tells reshape to compute that dimension automatically from the total size and the other dimension you gave (24 / 4 = 6 rows).',
        traps: [py`ms = np.array([t["Milliseconds"] for t in tracks[:24]])
answer = ms.reshape(-1, 6).tolist()`],
      }),
      num({
        title: 'Flattening a reshaped array back',
        use: ['tracks'],
        starter: 'ms = np.array([t["Milliseconds"] for t in tracks[:12]]).reshape(3, 4)\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. ms is already reshaped to (3, 4).',
        brief: 'Flatten `ms` back into a 1-D array, in row-major order, and store it as a list in `answer`.',
        reference: py`ms = np.array([t["Milliseconds"] for t in tracks[:12]]).reshape(3, 4)
answer = ms.flatten().tolist()`,
        walkthrough: '`flatten()` reads the array back out in row-major (C) order, undoing the reshape.',
        traps: [py`ms = np.array([t["Milliseconds"] for t in tracks[:12]]).reshape(3, 4)
answer = ms.flatten(order="F").tolist()`],
      }),
    ],
  },
  {
    id: 'py-array-indexing-slicing',
    title: 'Indexing, slicing, views and copies',
    blurb: 'Basic slicing in N dimensions, negative steps, and views versus copies.',
    kind: 'code',
    practice: {
      prompt: 'Write `corners(a)`: return the four corner elements of a 2-D array `a`, as a 1-D array, in the order top-left, top-right, bottom-left, bottom-right.',
      starter: 'import numpy as np\n\ndef corners(a):\n    ...\n',
      solution: py`import numpy as np

def corners(a):
    return np.array([a[0, 0], a[0, -1], a[-1, 0], a[-1, -1]])`,
      samples: ['corners(np.arange(9).reshape(3, 3)).tolist()'],
      cases: [
        ['A 3x3 array', 'corners(np.arange(9).reshape(3, 3)).tolist()'],
        ['A non-square array', 'corners(np.arange(12).reshape(3, 4)).tolist()'],
        ['Return type is an array', 'type(corners(np.arange(9).reshape(3, 3))).__name__'],
        ['A single row', 'corners(np.arange(4).reshape(1, 4)).tolist()'],
        ['A single column', 'corners(np.arange(3).reshape(3, 1)).tolist()'],
      ],
      traps: [
        py`import numpy as np

def corners(a):
    return np.array([a[0, 0], a[-1, 0], a[0, -1], a[-1, -1]])`,
        py`import numpy as np

def corners(a):
    return np.array([a[0, 0], a[0, 2], a[2, 0], a[2, 2]])`,
        py`import numpy as np

def corners(a):
    return [a[0, 0], a[0, -1], a[-1, 0], a[-1, -1]]`,
      ],
    },
    real: [
      num({
        title: 'The corner airports of a route grid',
        use: ['flights'],
        starter: 'sample = np.array([f["distance"] for f in flights[:12]]).reshape(3, 4)\nanswer = ...\n',
        given: '# flights is a list of dictionaries. sample is already a (3, 4) grid of distances.',
        brief: 'Return the top row and the bottom row of `sample` **without a loop**, as a 2-D array (shape `(2, 4)`), stored as nested lists in `answer`.',
        reference: py`sample = np.array([f["distance"] for f in flights[:12]]).reshape(3, 4)
answer = sample[[0, -1], :].tolist()`,
        walkthrough: 'Fancy indexing with a list of row positions, `[0, -1]`, picks exactly those two rows, keeping every column.',
        traps: [py`sample = np.array([f["distance"] for f in flights[:12]]).reshape(3, 4)
answer = sample[0:-1, :].tolist()`],
      }),
      num({
        title: 'A view shares memory with the original',
        use: ['tracks'],
        starter: 'ms = np.array([t["Milliseconds"] for t in tracks[:6]])\nview = ms[:3]\nview[0] = 0\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. view is a slice of the first 3 elements of ms.',
        brief: 'A basic slice like `ms[:3]` is a **view**, not a copy. Report whether changing `view` also changed `ms`: store `(ms[0], np.shares_memory(ms, view))` in `answer`.',
        reference: py`ms = np.array([t["Milliseconds"] for t in tracks[:6]])
view = ms[:3]
view[0] = 0
answer = (int(ms[0]), bool(np.shares_memory(ms, view)))`,
        walkthrough: 'Basic slicing never copies data; `view` and `ms` point at the same memory, so writing through `view` changes `ms` too, and `np.shares_memory` confirms it.',
        traps: [py`ms = np.array([t["Milliseconds"] for t in tracks[:6]])
view = ms[:3].copy()
view[0] = 0
answer = (int(ms[0]), bool(np.shares_memory(ms, view)))`],
      }),
      num({
        title: 'Reversing with a negative step',
        use: ['songs'],
        starter: 'streams = np.array([s["spotify_streams"] for s in songs[:5]])\nanswer = ...\n',
        given: '# songs is a list of dictionaries. streams already holds 5 real stream counts.',
        brief: 'Return `streams` reversed, using a negative-step slice (not a function like `reversed` or `flip`), as a list, in `answer`.',
        reference: py`streams = np.array([s["spotify_streams"] for s in songs[:5]])
answer = streams[::-1].tolist()`,
        walkthrough: 'A step of `-1` walks the array from the end to the start, producing a reversed view.',
        traps: [py`streams = np.array([s["spotify_streams"] for s in songs[:5]])
answer = streams[::1].tolist()`],
      }),
    ],
  },
  {
    id: 'py-boolean-masks-fancy-indexing',
    title: 'Boolean masks and fancy indexing',
    blurb: 'Conditions producing masks, combining with & | ~, and np.where and np.select.',
    kind: 'code',
    practice: {
      prompt: 'Write `relu(a)`: return a new array where every negative value in `a` is replaced by zero, and every other value is unchanged, without a Python loop.',
      starter: 'import numpy as np\n\ndef relu(a):\n    ...\n',
      solution: py`import numpy as np

def relu(a):
    return np.where(a < 0, 0, a)`,
      samples: ['relu(np.array([-3, -1, 0, 2, 5])).tolist()'],
      cases: [
        ['Mixed positive and negative', 'relu(np.array([-3, -1, 0, 2, 5])).tolist()'],
        ['All positive stays the same', 'relu(np.array([1, 2, 3])).tolist()'],
        ['All negative becomes zero', 'relu(np.array([-1, -2, -3])).tolist()'],
        ['Floats', 'relu(np.array([-1.5, 2.5])).tolist()'],
        ['Does not mutate the input', 'a = np.array([-1, 2])\nrelu(a)\na.tolist()'],
        ['Returns an array', 'type(relu(np.array([1, -1]))).__name__'],
      ],
      traps: [
        py`import numpy as np

def relu(a):
    a[a < 0] = 0`,
        py`import numpy as np

def relu(a):
    return np.abs(a)`,
        py`import numpy as np

def relu(a):
    return np.maximum(a, a.mean())`,
      ],
    },
    real: [
      num({
        title: 'Flights delayed more than an hour',
        use: ['flights'],
        starter: 'delays = np.array([f["dep_delay"] for f in flights if f["dep_delay"] is not None][:200])\nanswer = ...\n',
        given: '# flights is a list of dictionaries. delays already holds 200 real, non-missing departure delays.',
        brief: 'Using a boolean mask (no loop), count how many values in `delays` are greater than 60 minutes. Store the count as an `int` in `answer`.',
        reference: py`delays = np.array([f["dep_delay"] for f in flights if f["dep_delay"] is not None][:200])
mask = delays > 60
answer = int(mask.sum())`,
        walkthrough: '`delays > 60` produces a boolean array the same shape as `delays`; summing booleans counts how many are `True`.',
        traps: [py`delays = np.array([f["dep_delay"] for f in flights if f["dep_delay"] is not None][:200])
mask = delays < 60
answer = int(mask.sum())`],
      }),
      num({
        title: 'Clipping outlier air times',
        use: ['flights'],
        starter: 'air = np.array([f["air_time"] for f in flights if f["air_time"] is not None][:100])\nanswer = ...\n',
        given: '# flights is a list of dictionaries. air already holds 100 real air times in minutes.',
        brief: 'Using `np.where` (not `np.clip`), cap every value in `air` above 300 down to exactly 300. Store the result as a list in `answer`.',
        reference: py`air = np.array([f["air_time"] for f in flights if f["air_time"] is not None][:100])
capped = np.where(air > 300, 300, air)
answer = capped.tolist()`,
        walkthrough: '`np.where(condition, a, b)` picks `a` where the mask is `True` and `b` elsewhere, in one vectorised pass.',
        traps: [py`air = np.array([f["air_time"] for f in flights if f["air_time"] is not None][:100])
capped = np.where(air > 300, air, 300)
answer = capped.tolist()`],
      }),
      num({
        title: 'Categorising delays with np.select',
        use: ['flights'],
        starter: 'delays = np.array([f["dep_delay"] for f in flights if f["dep_delay"] is not None][:50])\nanswer = ...\n',
        given: '# flights is a list of dictionaries. delays already holds 50 real, non-missing departure delays.',
        brief: 'Using `np.select`, categorise each value in `delays` as `"early"` (below 0), `"on time"` (0 up to and including 15), or `"late"` (above 15). Store the list of category strings in `answer`.',
        reference: py`delays = np.array([f["dep_delay"] for f in flights if f["dep_delay"] is not None][:50])
conditions = [delays < 0, delays <= 15]
choices = ["early", "on time"]
categories = np.select(conditions, choices, default="late")
answer = categories.tolist()`,
        walkthrough: '`np.select` checks each condition in order and uses the matching choice, falling back to `default` when none match.',
        traps: [py`delays = np.array([f["dep_delay"] for f in flights if f["dep_delay"] is not None][:50])
conditions = [delays < 0, delays <= 15]
choices = ["on time", "early"]
categories = np.select(conditions, choices, default="late")
answer = categories.tolist()`],
      }),
    ],
  },
  {
    id: 'py-ufuncs-vectorisation',
    title: 'Universal functions and vectorisation',
    blurb: 'ufuncs like sqrt, exp and log; vectorised expressions; avoiding Python loops.',
    kind: 'code',
    practice: {
      prompt: 'Write `distances(p, q)`: given two arrays of 2-D (or more) points with the same shape, return the Euclidean distance between each corresponding pair of points, without a loop.',
      starter: 'import numpy as np\n\ndef distances(p, q):\n    ...\n',
      solution: py`import numpy as np

def distances(p, q):
    return np.sqrt(np.sum((p - q) ** 2, axis=1))`,
      samples: ['distances(np.array([[0, 0]]), np.array([[3, 4]])).tolist()'],
      cases: [
        ['Two simple 2D points', 'distances(np.array([[0, 0]]), np.array([[3, 4]])).tolist()'],
        ['Multiple points', 'distances(np.array([[0, 0], [1, 1]]), np.array([[3, 4], [1, 4]])).tolist()'],
        ['Identical points give zero', 'distances(np.array([[2, 2]]), np.array([[2, 2]])).tolist()'],
        ['3D points', 'distances(np.array([[0, 0, 0]]), np.array([[1, 2, 2]])).tolist()'],
        ['Return type', 'type(distances(np.array([[0, 0]]), np.array([[1, 1]]))).__name__'],
      ],
      traps: [
        py`import numpy as np

def distances(p, q):
    return np.sqrt(np.sum((p - q) ** 2))`,
        py`import numpy as np

def distances(p, q):
    return np.sum((p - q) ** 2, axis=1)`,
        py`import numpy as np

def distances(p, q):
    return np.sqrt(np.sum((p - q) ** 2, axis=0))`,
      ],
    },
    real: [
      num({
        title: 'A variance-stabilising transform on track lengths',
        use: ['tracks'],
        starter: 'ms = np.array([t["Milliseconds"] for t in tracks[:30]], dtype=float)\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. ms already holds 30 real durations.',
        brief: 'Take the square root of every value in `ms` with a single ufunc call. Round each to 2 decimals and store the list in `answer`.',
        reference: py`ms = np.array([t["Milliseconds"] for t in tracks[:30]], dtype=float)
answer = [round(x, 2) for x in np.sqrt(ms).tolist()]`,
        walkthrough: '`np.sqrt` is a ufunc: it applies element-by-element across the whole array in one vectorised call, with no explicit loop.',
        traps: [py`ms = np.array([t["Milliseconds"] for t in tracks[:30]], dtype=float)
answer = [round(x, 2) for x in np.log(ms).tolist()]`],
      }),
      num({
        title: 'Distance from the origin, for real measurements',
        use: ['penguins'],
        starter: 'pts = np.array([[p["bill_length_mm"], p["bill_depth_mm"]] for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None][:5])\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. pts already holds 5 real (length, depth) points.',
        brief: 'Compute the Euclidean distance of each of the 5 points in `pts` from the origin `(0, 0)`, without a loop, rounded to 2 decimals, as a list, in `answer`.',
        reference: py`pts = np.array([[p["bill_length_mm"], p["bill_depth_mm"]] for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None][:5])
d = np.sqrt(np.sum(pts ** 2, axis=1))
answer = [round(x, 2) for x in d.tolist()]`,
        walkthrough: 'The same pattern as the practice: square every coordinate, sum across each row (`axis=1`), then take the square root — all vectorised.',
        traps: [py`pts = np.array([[p["bill_length_mm"], p["bill_depth_mm"]] for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None][:5])
d = np.sqrt(np.sum(pts ** 2, axis=0))
answer = [round(x, 2) for x in d.tolist()]`],
      }),
      num({
        title: 'Decay-weighting the top songs by rank',
        use: ['songs'],
        starter: 'top = songs[:10]\nranks = np.arange(1, len(top) + 1, dtype=float)\nanswer = ...\n',
        given: '# songs is a list of dictionaries. top holds the first 10, and ranks is 1..10 as a float array.',
        brief: 'A simple decay model scores rank `r` as `exp(-r / 5)`. Compute this for every value in `ranks`, rounded to 4 decimals, as a list, in `answer`.',
        reference: py`top = songs[:10]
ranks = np.arange(1, len(top) + 1, dtype=float)
scores = np.exp(-ranks / 5)
answer = [round(x, 4) for x in scores.tolist()]`,
        walkthrough: 'Both the division and `np.exp` are ufuncs, so the whole formula applies to all 10 ranks in one vectorised expression.',
        traps: [py`top = songs[:10]
ranks = np.arange(1, len(top) + 1, dtype=float)
scores = np.exp(-ranks) / 5
answer = [round(x, 4) for x in scores.tolist()]`],
      }),
    ],
  },
  {
    id: 'py-broadcasting',
    title: 'Broadcasting',
    blurb: 'The broadcasting rules, adding a row to a matrix, and common broadcasting errors.',
    kind: 'code',
    practice: {
      prompt: 'Write `centre(a)`: given a 2-D array, subtract each **column\'s** mean from that column, in one broadcasted expression (no loop). Every column of the result should then have mean (approximately) zero.',
      starter: 'import numpy as np\n\ndef centre(a):\n    ...\n',
      solution: py`import numpy as np

def centre(a):
    return a - a.mean(axis=0)`,
      samples: ['centre(np.array([[1.0, 10.0], [3.0, 30.0]])).tolist()'],
      cases: [
        ['A simple 2x2 array', 'centre(np.array([[1.0, 10.0], [3.0, 30.0]])).tolist()'],
        ['A column of equal values becomes zero', 'centre(np.array([[5.0, 1.0], [5.0, 3.0]])).tolist()'],
        ['The shape is unchanged', 'centre(np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])).shape'],
        ['Negative numbers', 'centre(np.array([[-2.0, 4.0], [2.0, -4.0]])).tolist()'],
        ['Three columns', 'centre(np.array([[1.0, 2.0, 3.0], [3.0, 4.0, 9.0]])).tolist()'],
        ['A skewed column, mean not median', 'centre(np.array([[1.0, 1.0], [2.0, 2.0], [9.0, 9.0]])).tolist()'],
      ],
      traps: [
        py`import numpy as np

def centre(a):
    return a - a.mean(axis=1, keepdims=True)`,
        py`import numpy as np

def centre(a):
    return a - a.mean()`,
        py`import numpy as np

def centre(a):
    return a - np.median(a, axis=0)`,
      ],
    },
    real: [
      num({
        title: 'Centring two penguin measurements at once',
        use: ['penguins'],
        starter: 'pts = np.array([[p["bill_length_mm"], p["bill_depth_mm"]] for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None][:10])\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. pts already holds 10 real (length, depth) rows.',
        brief: "Subtract each column's mean from `pts` (10 rows, 2 columns) in one broadcasted expression. Round to 2 decimals and store as nested lists in `answer`.",
        reference: py`pts = np.array([[p["bill_length_mm"], p["bill_depth_mm"]] for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None][:10])
centred = pts - pts.mean(axis=0)
answer = [[round(x, 2) for x in row] for row in centred.tolist()]`,
        walkthrough: '`pts.mean(axis=0)` has shape `(2,)`, one mean per column. Subtracting it from `pts` (shape `(10, 2)`) broadcasts that row of two means down every one of the 10 rows.',
        traps: [py`pts = np.array([[p["bill_length_mm"], p["bill_depth_mm"]] for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None][:10])
centred = pts - pts.mean(axis=1, keepdims=True)
answer = [[round(x, 2) for x in row] for row in centred.tolist()]`],
      }),
      num({
        title: 'Standardising two track features together',
        use: ['tracks'],
        starter: 'feats = np.array([[t["Milliseconds"], t["UnitPrice"] * 100] for t in tracks[:8]], dtype=float)\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. feats already holds 8 rows of (milliseconds, price-in-cents).',
        brief: "Standardise `feats` by column: subtract each column's mean and divide by that column's standard deviation, all by broadcasting. Round to 3 decimals and store as nested lists in `answer`.",
        reference: py`feats = np.array([[t["Milliseconds"], t["UnitPrice"] * 100] for t in tracks[:8]], dtype=float)
z = (feats - feats.mean(axis=0)) / feats.std(axis=0)
answer = [[round(x, 3) for x in row] for row in z.tolist()]`,
        walkthrough: 'Both `feats.mean(axis=0)` and `feats.std(axis=0)` have shape `(2,)`, broadcasting down all 8 rows, so each column is standardised independently in one expression.',
        traps: [py`feats = np.array([[t["Milliseconds"], t["UnitPrice"] * 100] for t in tracks[:8]], dtype=float)
overall = (feats - feats.mean()) / feats.std()
answer = [[round(x, 3) for x in row] for row in overall.tolist()]`],
      }),
      num({
        title: 'Adding a per-column adjustment',
        use: ['flights'],
        starter: 'sample = np.array([[f["dep_delay"], f["arr_delay"]] for f in flights if f["dep_delay"] is not None and f["arr_delay"] is not None][:6])\nadjust = np.array([5, -5])\nanswer = ...\n',
        given: '# flights is a list of dictionaries. sample already holds 6 real (dep_delay, arr_delay) rows.',
        brief: 'Add `adjust` (shape `(2,)`, one correction per column) to every row of `sample` using broadcasting. Store the result as nested lists in `answer`.',
        reference: py`sample = np.array([[f["dep_delay"], f["arr_delay"]] for f in flights if f["dep_delay"] is not None and f["arr_delay"] is not None][:6])
adjust = np.array([5, -5])
adjusted = sample + adjust
answer = adjusted.tolist()`,
        walkthrough: '`adjust`, shape `(2,)`, is broadcast against every one of the 6 rows of `sample`, adding 5 to the first column and subtracting 5 from the second in every row at once.',
        traps: [py`sample = np.array([[f["dep_delay"], f["arr_delay"]] for f in flights if f["dep_delay"] is not None and f["arr_delay"] is not None][:6])
adjust = np.array([5, -5])
adjusted = sample + adjust[::-1]
answer = adjusted.tolist()`],
      }),
    ],
  },
  {
    id: 'py-aggregations-nan',
    title: 'Aggregations and axis reductions; NaN-aware functions',
    blurb: 'sum, mean, std with axis=, keepdims, and the NaN-aware versions.',
    kind: 'code',
    practice: {
      prompt: 'Write `row_means(a)`: return the mean of each row of the 2-D array `a`, ignoring any `nan` values.',
      starter: 'import numpy as np\n\ndef row_means(a):\n    ...\n',
      solution: py`import numpy as np

def row_means(a):
    return np.nanmean(a, axis=1)`,
      samples: ['row_means(np.array([[1.0, np.nan, 3.0]])).tolist()'],
      cases: [
        ['A row with no NaN', 'row_means(np.array([[1.0, 2.0, 3.0]])).tolist()'],
        ['A row with one NaN', 'row_means(np.array([[1.0, np.nan, 3.0]])).tolist()'],
        ['Two rows', 'row_means(np.array([[1.0, 2.0], [np.nan, 4.0]])).tolist()'],
        ['No NaN at all', 'row_means(np.array([[2.0, 4.0], [6.0, 8.0]])).tolist()'],
        ['One value per row', 'row_means(np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])).shape'],
      ],
      traps: [
        py`import numpy as np

def row_means(a):
    return np.mean(a, axis=1)`,
        py`import numpy as np

def row_means(a):
    return np.nanmean(a, axis=0)`,
        py`import numpy as np

def row_means(a):
    return np.nansum(a, axis=1) / a.shape[1]`,
      ],
    },
    real: [
      num({
        title: 'Average delay ignoring cancelled flights',
        use: ['flights'],
        starter: 'nulls = [f for f in flights if f["dep_delay"] is None][:4]\nhave = [f for f in flights if f["dep_delay"] is not None][:6]\nsample = np.array([f["dep_delay"] for f in nulls + have], dtype=float)\nanswer = ...\n',
        given: '# flights is a list of dictionaries. sample mixes 4 cancelled flights (missing dep_delay, now nan) with 6 real ones.',
        brief: 'Compute the mean of `sample`, ignoring the missing values, rounded to 2 decimals, in `answer`.',
        reference: py`nulls = [f for f in flights if f["dep_delay"] is None][:4]
have = [f for f in flights if f["dep_delay"] is not None][:6]
sample = np.array([f["dep_delay"] for f in nulls + have], dtype=float)
answer = round(float(np.nanmean(sample)), 2)`,
        walkthrough: '`np.nanmean` skips `nan` entries entirely, rather than letting a single missing value poison the whole average the way plain `np.mean` would.',
        traps: [py`nulls = [f for f in flights if f["dep_delay"] is None][:4]
have = [f for f in flights if f["dep_delay"] is not None][:6]
sample = np.array([f["dep_delay"] for f in nulls + have], dtype=float)
answer = round(float(np.mean(sample)), 2)`],
      }),
      num({
        title: 'Spread of bill lengths, missing values included',
        use: ['penguins'],
        starter: 'nulls = [p for p in penguins if p["bill_length_mm"] is None][:2]\nhave = [p for p in penguins if p["bill_length_mm"] is not None][:8]\nsample = np.array([p["bill_length_mm"] for p in nulls + have], dtype=float)\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. sample mixes 2 penguins with a missing measurement with 8 real ones.',
        brief: 'Compute the standard deviation of `sample`, ignoring the missing values, rounded to 2 decimals, in `answer`.',
        reference: py`nulls = [p for p in penguins if p["bill_length_mm"] is None][:2]
have = [p for p in penguins if p["bill_length_mm"] is not None][:8]
sample = np.array([p["bill_length_mm"] for p in nulls + have], dtype=float)
answer = round(float(np.nanstd(sample)), 2)`,
        walkthrough: '`np.nanstd` is the NaN-aware counterpart of `np.std`: the missing entries are excluded instead of turning the whole result into `nan`.',
        traps: [py`nulls = [p for p in penguins if p["bill_length_mm"] is None][:2]
have = [p for p in penguins if p["bill_length_mm"] is not None][:8]
sample = np.array([p["bill_length_mm"] for p in nulls + have], dtype=float)
answer = round(float(np.nanvar(sample)), 2)`],
      }),
      num({
        title: 'Column-wise maximum delay, ignoring cancellations',
        use: ['flights'],
        starter: 'have = [f for f in flights if f["dep_delay"] is not None and f["arr_delay"] is not None][:5]\nnulls = [f for f in flights if f["dep_delay"] is None][:2]\nsample = np.array([[f["dep_delay"], f["arr_delay"]] for f in have + nulls], dtype=float)\nanswer = ...\n',
        given: '# flights is a list of dictionaries. sample mixes 5 real rows with 2 rows missing both delays.',
        brief: 'Find the column-wise maximum of `sample` (max departure delay, max arrival delay), ignoring missing values, as a list of two numbers, in `answer`.',
        reference: py`have = [f for f in flights if f["dep_delay"] is not None and f["arr_delay"] is not None][:5]
nulls = [f for f in flights if f["dep_delay"] is None][:2]
sample = np.array([[f["dep_delay"], f["arr_delay"]] for f in have + nulls], dtype=float)
answer = np.nanmax(sample, axis=0).tolist()`,
        walkthrough: '`axis=0` reduces down the rows, one result per column; the NaN-aware version skips missing entries in that column instead of propagating them.',
        traps: [py`have = [f for f in flights if f["dep_delay"] is not None and f["arr_delay"] is not None][:5]
nulls = [f for f in flights if f["dep_delay"] is None][:2]
sample = np.array([[f["dep_delay"], f["arr_delay"]] for f in have + nulls], dtype=float)
answer = np.nanmax(sample, axis=1).tolist()`],
      }),
    ],
  },
]
