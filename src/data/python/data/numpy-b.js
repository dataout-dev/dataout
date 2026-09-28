import { dat, py } from './common.js'

const num = (c) => dat({ ...c, hidden: 'import numpy as np\n' + (c.hidden ?? '') })

export const numpyLessonsB = [
  {
    id: 'py-sorting-unique-search',
    title: 'Sorting, unique, searching and set operations',
    blurb: 'sort, argsort, unique with counts, searchsorted, and top-k with argpartition.',
    kind: 'code',
    practice: {
      prompt: 'Write `top_k_idx(a, k)`: return the indices of the `k` largest values in `a`, **largest first**.',
      starter: 'import numpy as np\n\ndef top_k_idx(a, k):\n    ...\n',
      solution: py`import numpy as np

def top_k_idx(a, k):
    return np.argsort(a)[::-1][:k]`,
      samples: ['top_k_idx(np.array([5, 1, 9, 3, 7]), 3).tolist()'],
      cases: [
        ['Top 3 of a small array', 'top_k_idx(np.array([5, 1, 9, 3, 7]), 3).tolist()'],
        ['k equals 1', 'top_k_idx(np.array([5, 1, 9, 3, 7]), 1).tolist()'],
        ['k equals the full length', 'top_k_idx(np.array([5, 1, 9, 3, 7]), 5).tolist()'],
        ['Negative numbers', 'top_k_idx(np.array([-5, -1, -9, -3]), 2).tolist()'],
        ['Return type', 'type(top_k_idx(np.array([1, 2, 3]), 2)).__name__'],
      ],
      traps: [
        py`import numpy as np

def top_k_idx(a, k):
    return np.argsort(a)[:k]`,
        py`import numpy as np

def top_k_idx(a, k):
    return np.sort(a)[::-1][:k]`,
        py`import numpy as np

def top_k_idx(a, k):
    return np.argsort(a)[::-1][:k + 1]`,
      ],
    },
    real: [
      num({
        title: 'The 3 longest tracks',
        use: ['tracks'],
        starter: 'ms = np.array([t["Milliseconds"] for t in tracks[:15]])\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. ms already holds 15 real durations.',
        brief: 'Find the indices (into the first 15 tracks) of the 3 longest, longest first, without a loop. Store the list of indices in `answer`.',
        reference: py`ms = np.array([t["Milliseconds"] for t in tracks[:15]])
idx = np.argsort(ms)[::-1][:3]
answer = idx.tolist()`,
        walkthrough: '`np.argsort` gives the positions that would sort the array ascending; reversing and slicing keeps the top 3, largest first.',
        traps: [py`ms = np.array([t["Milliseconds"] for t in tracks[:15]])
idx = np.argsort(ms)[:3]
answer = idx.tolist()`],
      }),
      num({
        title: 'Distinct carriers, with counts',
        use: ['flights'],
        starter: 'carriers = np.array([f["carrier"] for f in flights[:100]])\nanswer = ...\n',
        given: '# flights is a list of dictionaries. carriers already holds 100 real carrier codes.',
        brief: 'Using `np.unique` with `return_counts=True`, find how many distinct carriers appear in `carriers`, and the largest count among them. Store `(number_of_distinct_carriers, largest_count)` in `answer`.',
        reference: py`carriers = np.array([f["carrier"] for f in flights[:100]])
values, counts = np.unique(carriers, return_counts=True)
answer = (int(len(values)), int(counts.max()))`,
        walkthrough: '`np.unique(..., return_counts=True)` returns the distinct values and how many times each occurred, in matching order.',
        traps: [py`carriers = np.array([f["carrier"] for f in flights[:100]])
values, counts = np.unique(carriers, return_counts=True)
answer = (int(len(values)), int(counts.min()))`],
      }),
      num({
        title: 'Searching a sorted list of distances',
        use: ['flights'],
        starter: 'distances_sorted = np.sort(np.array([f["distance"] for f in flights[:50]]))\nanswer = ...\n',
        given: '# flights is a list of dictionaries. distances_sorted already holds 50 real distances, sorted.',
        brief: 'Using `np.searchsorted`, find the index where the value `1000` would need to be inserted into `distances_sorted` to keep it sorted. Store the index (an `int`) in `answer`.',
        reference: py`distances_sorted = np.sort(np.array([f["distance"] for f in flights[:50]]))
answer = int(np.searchsorted(distances_sorted, 1000))`,
        walkthrough: '`np.searchsorted` runs a binary search on the already-sorted array and returns the insertion point that keeps it sorted.',
        traps: [py`distances_sorted = np.sort(np.array([f["distance"] for f in flights[:50]]))
answer = int(np.searchsorted(1000, distances_sorted))`],
      }),
    ],
  },
  {
    id: 'py-combining-splitting-arrays',
    title: 'Combining and splitting arrays',
    blurb: 'concatenate, stack, split, tile, repeat and meshgrid.',
    kind: 'code',
    practice: {
      prompt: 'Write `mult_table(n)`: using `np.meshgrid`, return the `n`×`n` multiplication table as a 2-D array, where entry `(i, j)` is `(i + 1) * (j + 1)`.',
      starter: 'import numpy as np\n\ndef mult_table(n):\n    ...\n',
      solution: py`import numpy as np

def mult_table(n):
    x, y = np.meshgrid(np.arange(1, n + 1), np.arange(1, n + 1))
    return x * y`,
      samples: ['mult_table(3).tolist()'],
      cases: [
        ['A 3x3 table', 'mult_table(3).tolist()'],
        ['n = 1', 'mult_table(1).tolist()'],
        ['The shape', 'mult_table(4).shape'],
        ['A larger table', 'mult_table(5).tolist()'],
      ],
      traps: [
        py`import numpy as np

def mult_table(n):
    x, y = np.meshgrid(np.arange(1, n + 1), np.arange(1, n + 1))
    return x + y`,
        py`import numpy as np

def mult_table(n):
    x, y = np.meshgrid(np.arange(n), np.arange(n))
    return x * y`,
        py`import numpy as np

def mult_table(n):
    x, y = np.meshgrid(np.arange(1, n + 1), np.arange(1, n + 1))
    return x`,
      ],
    },
    real: [
      num({
        title: 'Stacking two months of flight counts',
        use: ['flights'],
        starter: 'jan = np.array([f["distance"] for f in flights if f["month"] == 1][:5])\nfeb = np.array([f["distance"] for f in flights if f["month"] == 2][:5])\nanswer = ...\n',
        given: '# flights is a list of dictionaries. jan and feb already hold 5 real distances each.',
        brief: 'Stack `jan` and `feb` as two rows of one 2-D array with `np.vstack`, and store it as nested lists in `answer`.',
        reference: py`jan = np.array([f["distance"] for f in flights if f["month"] == 1][:5])
feb = np.array([f["distance"] for f in flights if f["month"] == 2][:5])
answer = np.vstack([jan, feb]).tolist()`,
        walkthrough: '`np.vstack` stacks same-length 1-D arrays as new rows of a 2-D array.',
        traps: [py`jan = np.array([f["distance"] for f in flights if f["month"] == 1][:5])
feb = np.array([f["distance"] for f in flights if f["month"] == 2][:5])
answer = np.vstack([feb, jan]).tolist()`],
      }),
      num({
        title: 'Splitting a batch of tracks in half',
        use: ['tracks'],
        starter: 'ms = np.array([t["Milliseconds"] for t in tracks[:10]])\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. ms already holds 10 real durations.',
        brief: 'Using `np.split`, split `ms` into two equal halves. Store both halves as a list of two lists in `answer`.',
        reference: py`ms = np.array([t["Milliseconds"] for t in tracks[:10]])
first, second = np.split(ms, 2)
answer = [first.tolist(), second.tolist()]`,
        walkthrough: '`np.split(a, 2)` divides `a` into 2 equal-length pieces, in order.',
        traps: [py`ms = np.array([t["Milliseconds"] for t in tracks[:10]])
second, first = np.split(ms, 2)
answer = [first.tolist(), second.tolist()]`],
      }),
      num({
        title: 'Repeating a genre label per track',
        use: ['genres'],
        starter: 'names = np.array([g["Name"] for g in genres[:3]])\nanswer = ...\n',
        given: '# genres is a list of dictionaries. names already holds 3 real genre names.',
        brief: 'Using `np.repeat`, repeat each of the 3 names twice **in place** (so it reads name, name, name, name, name, name, not the whole list twice). Store the result as a list in `answer`.',
        reference: py`names = np.array([g["Name"] for g in genres[:3]])
answer = np.repeat(names, 2).tolist()`,
        walkthrough: '`np.repeat` repeats each element where it stands; `np.tile` would repeat the whole array instead, which reads in the other order.',
        traps: [py`names = np.array([g["Name"] for g in genres[:3]])
answer = np.tile(names, 2).tolist()`],
      }),
    ],
  },
  {
    id: 'py-random-numbers-numpy',
    title: 'Random numbers: Generators, seeds and sampling',
    blurb: 'default_rng and seeds, integers, random, normal, choice, shuffle and simulation basics.',
    kind: 'code',
    practice: {
      prompt: 'Write `estimate_pi(n, seed=0)`: build `rng = np.random.default_rng(seed)`, draw `n` random 2-D points with **one call** `points = rng.random((n, 2))` (each coordinate in `[0, 1)`), and return `4 * (fraction of points with x**2 + y**2 <= 1)`.\n\nThe exact call shape matters here: a different (even otherwise valid) way of drawing the same "n random points" consumes the random stream differently and will not reproduce the same numbers for the same seed.',
      starter: 'import numpy as np\n\ndef estimate_pi(n, seed=0):\n    ...\n',
      solution: py`import numpy as np

def estimate_pi(n, seed=0):
    rng = np.random.default_rng(seed)
    points = rng.random((n, 2))
    inside = (points[:, 0] ** 2 + points[:, 1] ** 2) <= 1
    return 4 * inside.sum() / n`,
      samples: ['round(estimate_pi(2000, seed=0), 3)'],
      cases: [
        ['A moderate sample', 'round(estimate_pi(2000, seed=0), 3)'],
        ['A different seed', 'round(estimate_pi(2000, seed=1), 3)'],
        ['A small sample', 'round(estimate_pi(50, seed=0), 3)'],
        ['Returns a plain float or numpy float', 'type(estimate_pi(10, seed=0)).__name__ in ("float", "float64")'],
        ['Gets closer to pi with more points', 'abs(estimate_pi(8000, seed=0) - 3.14159) < 0.5'],
      ],
      traps: [
        py`import numpy as np

def estimate_pi(n, seed=0):
    rng = np.random.default_rng(seed)
    points = rng.random((n, 2))
    inside = (points[:, 0] + points[:, 1]) <= 1
    return 4 * inside.sum() / n`,
        py`import numpy as np

def estimate_pi(n, seed=0):
    rng = np.random.default_rng(seed)
    x = rng.random(n)
    y = rng.random(n)
    inside = (x ** 2 + y ** 2) <= 1
    return 4 * inside.sum() / n`,
        py`import numpy as np

def estimate_pi(n, seed=0):
    rng = np.random.default_rng(seed)
    points = rng.random((n, 2))
    inside = (points[:, 0] ** 2 + points[:, 1] ** 2) <= 1
    return inside.sum() / n`,
      ],
    },
    real: [
      num({
        title: 'Shuffling a playlist reproducibly',
        use: ['tracks'],
        starter: 'names = [t["Name"] for t in tracks[:10]]\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. names already holds 10 real track names.',
        brief: 'Using `rng = np.random.default_rng(0)` and `rng.permutation(len(names))`, compute a reproducible shuffled order of `names`. Store the **first 3 names** in that shuffled order, as a list, in `answer`.',
        reference: py`names = [t["Name"] for t in tracks[:10]]
rng = np.random.default_rng(0)
order = rng.permutation(len(names))
answer = [names[i] for i in order[:3]]`,
        walkthrough: '`rng.permutation(n)` returns a reproducible random ordering of `0..n-1` for a given seed; indexing `names` with it shuffles the list itself.',
        traps: [py`names = [t["Name"] for t in tracks[:10]]
rng = np.random.default_rng(1)
order = rng.permutation(len(names))
answer = [names[i] for i in order[:3]]`],
      }),
      num({
        title: 'Sampling customer countries with replacement',
        use: ['customers'],
        starter: 'countries = [c["Country"] for c in customers[:20]]\nanswer = ...\n',
        given: '# customers is a list of dictionaries. countries already holds 20 real country names.',
        brief: 'Using `rng = np.random.default_rng(0)` and `rng.choice(countries, size=5, replace=True)`, draw a reproducible sample of 5 countries. Store the list of 5 in `answer`.',
        reference: py`countries = [c["Country"] for c in customers[:20]]
rng = np.random.default_rng(0)
sample = rng.choice(countries, size=5, replace=True)
answer = sample.tolist()`,
        walkthrough: '`rng.choice(..., replace=True)` draws independently with replacement; the same seed always reproduces the same 5 draws.',
        traps: [py`countries = [c["Country"] for c in customers[:20]]
rng = np.random.default_rng(0)
sample = rng.choice(countries, size=5, replace=False)
answer = sample.tolist()`],
      }),
      num({
        title: 'A reproducible held-out sample of flights',
        use: ['flights'],
        starter: 'ids = list(range(20))\nanswer = ...\n',
        given: "# flights is a list of dictionaries. ids stands for the positions of the first 20 flights.",
        brief: 'Using `rng = np.random.default_rng(0)` and `rng.choice(ids, size=5, replace=False)`, pick a reproducible sample of 5 positions to "hold out". Store the **sorted** list of positions in `answer`.',
        reference: py`ids = list(range(20))
rng = np.random.default_rng(0)
held_out = rng.choice(ids, size=5, replace=False)
answer = sorted(int(x) for x in held_out)`,
        walkthrough: 'Sorting the sample makes the result easy to check while still depending on the exact reproducible draw.',
        traps: [py`ids = list(range(20))
rng = np.random.default_rng(0)
held_out = rng.choice(ids, size=6, replace=False)
answer = sorted(int(x) for x in held_out)`],
      }),
    ],
  },
  {
    id: 'py-linear-algebra-numpy',
    title: 'Linear algebra with numpy.linalg',
    blurb: 'dot, matmul and @, inverse and determinant, solving linear systems, norms.',
    kind: 'code',
    practice: {
      prompt: 'Write `solve2(A, b)`: solve the 2×2 (or n×n) linear system `A x = b` and return the solution array `x`.',
      starter: 'import numpy as np\n\ndef solve2(A, b):\n    ...\n',
      solution: py`import numpy as np

def solve2(A, b):
    return np.linalg.solve(A, b)`,
      samples: ['solve2(np.array([[2.0, 0.0], [0.0, 3.0]]), np.array([4.0, 9.0])).tolist()'],
      cases: [
        ['A diagonal system', 'solve2(np.array([[2.0, 0.0], [0.0, 3.0]]), np.array([4.0, 9.0])).tolist()'],
        ['An asymmetric system', 'solve2(np.array([[1.0, 2.0], [3.0, 4.0]]), np.array([5.0, 6.0])).tolist()'],
        ['The identity matrix', 'solve2(np.array([[1.0, 0.0], [0.0, 1.0]]), np.array([7.0, 8.0])).tolist()'],
        ['Return type', 'type(solve2(np.array([[1.0, 0.0], [0.0, 1.0]]), np.array([1.0, 1.0]))).__name__'],
      ],
      traps: [
        py`import numpy as np

def solve2(A, b):
    return A @ b`,
        py`import numpy as np

def solve2(A, b):
    return np.linalg.solve(b, A)`,
        py`import numpy as np

def solve2(A, b):
    return np.linalg.solve(A.T, b)`,
      ],
    },
    real: [
      num({
        title: "Splitting a bundle price into two track prices",
        use: ['tracks'],
        starter: 'p1 = tracks[0]["UnitPrice"]\np2 = tracks[1]["UnitPrice"]\nA = np.array([[1.0, 1.0], [1.0, -1.0]])\nb = np.array([p1 + p2, p1 - p2])\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. A and b already encode the sum and difference of two real prices.',
        brief: 'Solve `A x = b` to recover `[p1, p2]`. Round both to 2 decimals and store as a list in `answer`.',
        reference: py`p1 = tracks[0]["UnitPrice"]
p2 = tracks[1]["UnitPrice"]
A = np.array([[1.0, 1.0], [1.0, -1.0]])
b = np.array([p1 + p2, p1 - p2])
x = np.linalg.solve(A, b)
answer = [round(v, 2) for v in x.tolist()]`,
        walkthrough: 'The system encodes "sum" and "difference" as two linear equations; `np.linalg.solve` recovers the original two prices.',
        traps: [py`p1 = tracks[0]["UnitPrice"]
p2 = tracks[1]["UnitPrice"]
A = np.array([[1.0, 1.0], [1.0, -1.0]])
b = np.array([p1 + p2, p1 - p2])
x = A @ b
answer = [round(v, 2) for v in x.tolist()]`],
      }),
      num({
        title: 'Recovering two flight delays from their sum and difference',
        use: ['flights'],
        starter: 'have = [f for f in flights if f["dep_delay"] is not None][:2]\nd1 = have[0]["dep_delay"]\nd2 = have[1]["dep_delay"]\nA = np.array([[1.0, 1.0], [1.0, -1.0]])\nb = np.array([d1 + d2, d1 - d2])\nanswer = ...\n',
        given: '# flights is a list of dictionaries. A and b already encode the sum and difference of two real delays.',
        brief: 'Solve `A x = b` to recover `[d1, d2]`. Round both to 2 decimals and store as a list in `answer`.',
        reference: py`have = [f for f in flights if f["dep_delay"] is not None][:2]
d1 = have[0]["dep_delay"]
d2 = have[1]["dep_delay"]
A = np.array([[1.0, 1.0], [1.0, -1.0]])
b = np.array([d1 + d2, d1 - d2])
x = np.linalg.solve(A, b)
answer = [round(v, 2) for v in x.tolist()]`,
        walkthrough: 'The same sum/difference trick as the practice: two linear equations pin down the two original values exactly.',
        traps: [py`have = [f for f in flights if f["dep_delay"] is not None][:2]
d1 = have[0]["dep_delay"]
d2 = have[1]["dep_delay"]
A = np.array([[1.0, -1.0], [1.0, 1.0]])
b = np.array([d1 + d2, d1 - d2])
x = np.linalg.solve(A, b)
answer = [round(v, 2) for v in x.tolist()]`],
      }),
      num({
        title: "Recovering two songs' stream counts",
        use: ['songs'],
        starter: 's1 = songs[0]["spotify_streams"]\ns2 = songs[1]["spotify_streams"]\nA = np.array([[1.0, 1.0], [1.0, -1.0]])\nb = np.array([s1 + s2, s1 - s2])\nanswer = ...\n',
        given: '# songs is a list of dictionaries. A and b already encode the sum and difference of two real stream counts.',
        brief: 'Solve `A x = b` to recover `[s1, s2]`. Round both to 2 decimals and store as a list in `answer`.',
        reference: py`s1 = songs[0]["spotify_streams"]
s2 = songs[1]["spotify_streams"]
A = np.array([[1.0, 1.0], [1.0, -1.0]])
b = np.array([s1 + s2, s1 - s2])
x = np.linalg.solve(A, b)
answer = [round(v, 2) for v in x.tolist()]`,
        walkthrough: 'The same pattern once more: `np.linalg.solve` is the direct, numerically stable way to recover the two unknowns, rather than inverting `A` by hand.',
        traps: [py`s1 = songs[0]["spotify_streams"]
s2 = songs[1]["spotify_streams"]
A = np.array([[1.0, 1.0], [1.0, -1.0]])
b = np.array([s1 + s2, s1 - s2])
x = np.linalg.solve(A, b)[::-1]
answer = [round(v, 2) for v in x.tolist()]`],
      }),
    ],
  },
  {
    id: 'py-dtypes-structured-datetime',
    title: 'dtypes, structured arrays, datetime64 and missing values',
    blurb: 'astype, structured arrays, datetime64/timedelta64, and NaN in numeric arrays.',
    kind: 'code',
    practice: {
      prompt: 'Write `business_days(a, b)`: return the number of business days (Monday to Friday) between dates `a` and `b` (each a `numpy.datetime64` or a `"YYYY-MM-DD"` string), where `a` comes before `b`.',
      starter: 'import numpy as np\n\ndef business_days(a, b):\n    ...\n',
      solution: py`import numpy as np

def business_days(a, b):
    return int(np.busday_count(a, b))`,
      samples: ["business_days(np.datetime64('2024-01-01'), np.datetime64('2024-01-08'))"],
      cases: [
        ['A single week', "business_days(np.datetime64('2024-01-01'), np.datetime64('2024-01-08'))"],
        ['Same day', "business_days(np.datetime64('2024-01-01'), np.datetime64('2024-01-01'))"],
        ['A weekend only', "business_days(np.datetime64('2024-01-06'), np.datetime64('2024-01-08'))"],
        ['From plain date strings', "business_days('2024-01-01', '2024-01-02')"],
      ],
      traps: [
        py`import numpy as np

def business_days(a, b):
    return int(np.busday_count(a, b)) + 1`,
        py`import numpy as np

def business_days(a, b):
    return int(np.busday_count(b, a))`,
        py`import numpy as np

def business_days(a, b):
    return int((np.datetime64(b) - np.datetime64(a)) / np.timedelta64(1, "D"))`,
      ],
    },
    real: [
      num({
        title: "Business days across January in the data",
        use: ['flights'],
        starter: 'jan_dates = sorted({f["flight_date"] for f in flights if f["month"] == 1})\nfirst, last = jan_dates[0], jan_dates[-1]\nanswer = ...\n',
        given: '# flights is a list of dictionaries. first and last already hold the earliest and latest January date.',
        brief: 'Count the business days between `first` and `last`, using `np.busday_count`. Store the count as an `int` in `answer`.',
        reference: py`jan_dates = sorted({f["flight_date"] for f in flights if f["month"] == 1})
first, last = jan_dates[0], jan_dates[-1]
answer = int(np.busday_count(first, last))`,
        walkthrough: '`np.busday_count` parses the `"YYYY-MM-DD"` strings directly and counts Monday-to-Friday days in the half-open range `[first, last)`.',
        traps: [py`jan_dates = sorted({f["flight_date"] for f in flights if f["month"] == 1})
first, last = jan_dates[0], jan_dates[-1]
answer = int(np.busday_count(last, first))`],
      }),
      num({
        title: 'Weekend flights in a two-week sample',
        use: ['flights'],
        starter: 'sample_dates = np.array([f["flight_date"] for f in flights[:14]], dtype="datetime64[D]")\nanswer = ...\n',
        given: '# flights is a list of dictionaries. sample_dates already holds 14 real dates.',
        brief: 'Using `np.is_busday`, count how many of `sample_dates` fall on a weekend (i.e. are **not** business days). Store the count as an `int` in `answer`.',
        reference: py`sample_dates = np.array([f["flight_date"] for f in flights[:14]], dtype="datetime64[D]")
weekend = ~np.is_busday(sample_dates)
answer = int(weekend.sum())`,
        walkthrough: '`np.is_busday` returns `True` for Monday-to-Friday dates; negating it with `~` flags the weekend ones, which are then summed.',
        traps: [py`sample_dates = np.array([f["flight_date"] for f in flights[:14]], dtype="datetime64[D]")
weekend = np.is_busday(sample_dates)
answer = int(weekend.sum())`],
      }),
      num({
        title: 'Business days between two invoice dates',
        use: ['invoices'],
        starter: 'have = invoices[:2]\nd1 = have[0]["InvoiceDate"][:10]\nd2 = have[1]["InvoiceDate"][:10]\nanswer = ...\n',
        given: '# invoices is a list of dictionaries. InvoiceDate strings look like "2009-01-01 00:00:00"; d1/d2 keep just the date part.',
        brief: 'Count the business days between `d1` and `d2`, ordering them earliest-first yourself before calling `np.busday_count`. Store the count as an `int` in `answer`.',
        reference: py`have = invoices[:2]
d1 = have[0]["InvoiceDate"][:10]
d2 = have[1]["InvoiceDate"][:10]
start, end = sorted([d1, d2])
answer = int(np.busday_count(start, end))`,
        walkthrough: 'Sorting the two date strings before counting guarantees a non-negative count regardless of which invoice happened to come first in the list.',
        traps: [py`have = invoices[:2]
d1 = have[0]["InvoiceDate"][:10]
d2 = have[1]["InvoiceDate"][:10]
start, end = sorted([d1, d2], reverse=True)
answer = int(np.busday_count(start, end))`],
      }),
    ],
  },
  {
    id: 'py-numpy-performance',
    title: 'NumPy performance: memory layout, einsum and avoiding loops',
    blurb: 'C versus Fortran order, strides, temporary arrays, in-place operations and einsum.',
    kind: 'learn',
    check: [
      {
        q: 'What does "C order" (row-major) mean for a 2-D array in memory?',
        options: [
          'Values are stored column by column',
          'Values are stored row by row, so consecutive elements of a row are next to each other in memory',
          'The array is compressed',
          'It refers to the array being written in the C programming language',
        ],
        answer: 1,
        why: 'In C (row-major) order, an entire row is contiguous in memory before the next row begins. Fortran order stores columns contiguously instead.',
      },
      {
        q: 'Why can chaining several array operations like `a * 2 + b - c` be slower than necessary?',
        options: [
          'Python cannot parse the expression',
          'Each intermediate step allocates a brand-new temporary array before the next operation runs',
          'NumPy refuses to chain more than two operations',
          'It is actually always the fastest approach',
        ],
        answer: 1,
        why: 'Every operator produces a new temporary array. In-place operators (`+=`, `*=`) or `out=` parameters can avoid some of these allocations when it matters.',
      },
      {
        q: 'What does `np.einsum` let you express?',
        options: [
          'A way to draw array plots',
          'Sums and products over named axes, written compactly, covering many reductions, dot products and transposes in one notation',
          'A random number generator',
          'A way to sort arrays',
        ],
        answer: 1,
        why: '`einsum` describes how axes of one or more arrays should be multiplied and summed, using a compact subscript notation, and can implement many linear-algebra operations in one call.',
      },
      {
        q: 'Why is a plain Python loop over a NumPy array usually much slower than a vectorised expression?',
        options: [
          'Loops are forbidden by NumPy',
          'Each iteration pays Python\'s per-element interpreter overhead, while a vectorised call runs compiled C code across the whole array at once',
          'Vectorised expressions use less memory, which is the only reason they are faster',
          'There is no real difference in practice',
        ],
        answer: 1,
        why: 'Vectorisation moves the loop into fast, compiled code that processes the whole array in one call, avoiding the per-element cost of the Python interpreter.',
      },
      {
        q: 'What is a reasonable way to check whether an operation actually needs to be faster before optimising it?',
        options: [
          'Rewrite everything in einsum immediately',
          'Profile or time the real, current bottleneck first, since premature optimisation often targets the wrong part of the code',
          'Assume every loop is a performance problem',
          'Never measure; trust intuition alone',
        ],
        answer: 1,
        why: 'Optimising the wrong part wastes effort and can make code harder to read for no benefit. Measure first, then optimise the part that actually matters.',
      },
    ],
  },
  {
    id: 'py-numpy-workshop',
    title: 'NumPy workshop: image-like arrays and a simulation',
    blurb: 'Grayscale images as arrays, slicing tricks, a random walk, and testing with np.testing.',
    kind: 'code',
    practice: {
      prompt: "Write `blur(a)`: apply a 3x3 mean filter to the 2-D array `a`, keeping the same shape. At the edges and corners, average only the neighbours that actually exist inside `a` (do not pad with zeros).",
      starter: 'import numpy as np\n\ndef blur(a):\n    ...\n',
      solution: py`import numpy as np

def blur(a):
    a = np.asarray(a, dtype=float)
    out = np.zeros_like(a)
    rows, cols = a.shape
    for i in range(rows):
        for j in range(cols):
            r0, r1 = max(0, i - 1), min(rows, i + 2)
            c0, c1 = max(0, j - 1), min(cols, j + 2)
            out[i, j] = a[r0:r1, c0:c1].mean()
    return out`,
      samples: ['blur(np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0]])).tolist()'],
      cases: [
        ['A 3x3 array', 'blur(np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0]])).tolist()'],
        ['A uniform array stays the same', 'blur(np.full((4, 4), 5.0)).tolist()'],
        ['The shape is preserved', 'blur(np.arange(20, dtype=float).reshape(4, 5)).shape'],
        ['A single row', 'blur(np.array([[1.0, 2.0, 3.0, 4.0]])).tolist()'],
      ],
      traps: [
        py`import numpy as np

def blur(a):
    a = np.asarray(a, dtype=float)
    out = np.zeros_like(a)
    rows, cols = a.shape
    for i in range(rows):
        for j in range(cols):
            r0, r1 = max(0, i - 1), min(rows, i + 2)
            c0, c1 = max(0, j - 1), min(cols, j + 2)
            out[i, j] = a[r0:r1, c0:c1].sum() / 9
    return out`,
        py`import numpy as np

def blur(a):
    a = np.asarray(a, dtype=float)
    out = np.zeros_like(a)
    rows, cols = a.shape
    for i in range(rows):
        for j in range(cols):
            c0, c1 = max(0, j - 1), min(cols, j + 2)
            out[i, j] = a[i, c0:c1].mean()
    return out`,
        py`import numpy as np

def blur(a):
    a = np.asarray(a, dtype=float)
    out = np.zeros_like(a)
    rows, cols = a.shape
    for i in range(rows):
        for j in range(cols):
            r0, r1 = max(0, i - 1), min(rows, i + 1)
            c0, c1 = max(0, j - 1), min(cols, j + 1)
            out[i, j] = a[r0:r1, c0:c1].mean()
    return out`,
      ],
    },
    real: [
      num({
        title: 'Blurring a grid of real flight distances',
        use: ['flights'],
        starter: 'grid = np.array([f["distance"] for f in flights[:20]]).reshape(4, 5).astype(float)\nanswer = ...\n',
        given: '# flights is a list of dictionaries. grid already holds 20 real distances, reshaped to (4, 5).',
        brief: 'Apply the same 3x3 mean-filter idea (edges keep only their real neighbours) to `grid`. Store the blurred grid, rounded to 2 decimals, as nested lists, in `answer`.',
        reference: py`grid = np.array([f["distance"] for f in flights[:20]]).reshape(4, 5).astype(float)
rows, cols = grid.shape
out = np.zeros_like(grid)
for i in range(rows):
    for j in range(cols):
        r0, r1 = max(0, i - 1), min(rows, i + 2)
        c0, c1 = max(0, j - 1), min(cols, j + 2)
        out[i, j] = grid[r0:r1, c0:c1].mean()
answer = [[round(x, 2) for x in row] for row in out.tolist()]`,
        walkthrough: 'Each cell averages only the neighbours that really exist inside the grid, so corners average a 2x2 block, edges a 2x3 or 3x2 block, and interior cells the full 3x3.',
        traps: [py`grid = np.array([f["distance"] for f in flights[:20]]).reshape(4, 5).astype(float)
rows, cols = grid.shape
out = np.zeros_like(grid)
for i in range(rows):
    for j in range(cols):
        r0, r1 = max(0, i - 1), min(rows, i + 2)
        c0, c1 = max(0, j - 1), min(cols, j + 2)
        out[i, j] = grid[r0:r1, c0:c1].sum() / 9
answer = [[round(x, 2) for x in row] for row in out.tolist()]`],
      }),
      num({
        title: 'A random walk across a playlist',
        use: ['tracks'],
        starter: 'rng = np.random.default_rng(0)\nsteps = rng.choice([-1, 1], size=len(tracks[:50]))\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. One step is taken for every one of the first 50 tracks, +1 or -1, reproducibly.',
        brief: 'Compute the running total of `steps` (the cumulative sum) and store the **final** position (an `int`) in `answer`.',
        reference: py`rng = np.random.default_rng(0)
steps = rng.choice([-1, 1], size=len(tracks[:50]))
position = np.cumsum(steps)
answer = int(position[-1])`,
        walkthrough: '`np.cumsum` builds the running total after each step; the last entry is the walk\'s final position.',
        traps: [py`rng = np.random.default_rng(0)
steps = rng.choice([-1, 1], size=len(tracks[:50]))
position = np.cumsum(steps)
answer = int(position[0])`],
      }),
      num({
        title: 'Cropping and thresholding a grid of real delays',
        use: ['flights'],
        starter: 'grid = np.array([f["dep_delay"] for f in flights if f["dep_delay"] is not None][:20]).reshape(4, 5).astype(float)\nanswer = ...\n',
        given: '# flights is a list of dictionaries. grid already holds 20 real, non-missing delays, reshaped to (4, 5).',
        brief: 'Crop `grid` to its inner block (rows 1 to 2, columns 1 to 3), then threshold it: any value greater than 0 becomes `1`, everything else `0`. Store the thresholded block as nested ints, in `answer`.',
        reference: py`grid = np.array([f["dep_delay"] for f in flights if f["dep_delay"] is not None][:20]).reshape(4, 5).astype(float)
cropped = grid[1:3, 1:4]
thresholded = (cropped > 0).astype(int)
answer = thresholded.tolist()`,
        walkthrough: 'Cropping is just slicing; thresholding turns the boolean mask `cropped > 0` directly into 0/1 integers with `.astype(int)`.',
        traps: [py`grid = np.array([f["dep_delay"] for f in flights if f["dep_delay"] is not None][:20]).reshape(4, 5).astype(float)
cropped = grid[1:3, 1:4]
thresholded = (cropped > cropped.mean()).astype(int)
answer = thresholded.tolist()`],
      }),
    ],
  },
]
