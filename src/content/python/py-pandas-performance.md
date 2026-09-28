Most pandas code is already fast enough once it is genuinely vectorised. This lesson collects the handful of ideas worth knowing for the moment it is not: which dtypes cost memory, which patterns hide a slow loop, and what changes when data is too big to load all at once.

You will learn:

- checking memory with `memory_usage`
- `category` and downcasting
- avoiding `apply` and `iterrows`
- vectorised string operations
- chunked reading, and a glance at copy-on-write and Arrow

## memory_usage

```python
import pandas as pd

df = pd.DataFrame({"id": range(1000), "name": ["Ada"] * 1000})
print(df.memory_usage(deep=True))
print(df.memory_usage(deep=True).sum())
```

`deep=True` accounts for the actual memory used by object (text) columns, not just the pointers to them — without it, a text column's reported size is misleadingly small.

## category and downcasting

```python
import pandas as pd

df = pd.DataFrame({"status": ["active", "inactive", "active"] * 1000})
print(df["status"].memory_usage(deep=True))
print(df["status"].astype("category").memory_usage(deep=True))
```

A repeated-value text column shrinks dramatically as `category`; a numeric column with a known, small range shrinks similarly with a smaller integer dtype (`astype("int16")`, say).

## Avoiding apply and iterrows

```python
import pandas as pd
import time

df = pd.DataFrame({"x": range(100000)})

start = time.perf_counter()
vectorised = df["x"] * 2
vector_time = time.perf_counter() - start

start = time.perf_counter()
applied = df["x"].apply(lambda v: v * 2)
apply_time = time.perf_counter() - start

print(vector_time < apply_time)
```

`iterrows()` is even slower than `.apply` for most tasks, since it also rebuilds a Series object per row; a vectorised expression almost always exists once you look for it.

## Vectorised string operations

```python
import pandas as pd

s = pd.Series(["Ada", "Grace", "Alan"])
print(s.str.upper())
```

The `.str` accessor (covered in an earlier lesson) is itself the vectorised alternative to looping over a text column and calling a plain Python string method on each value.

## Chunked reading

```python
import pandas as pd
import io

text = "x\n" + "\n".join(str(i) for i in range(10))
total = 0
for chunk in pd.read_csv(io.StringIO(text), chunksize=3):
    total += chunk["x"].sum()
print(total)
```

Reading in chunks and aggregating as you go keeps memory bounded, at the cost of writing the aggregation as an explicit running total instead of one call on the whole frame.

## Copy-on-write and Arrow, briefly

Copy-on-write (the modern pandas default) removes the need to reason about whether a given operation returns a view or a copy — writes are always safe, and copies are only made lazily, when actually needed. Arrow-backed dtypes (mentioned in an earlier lesson) can speed up string-heavy workloads specifically, without changing how you write the code that uses them.

## Watch out: optimising the wrong step

Rewriting a clear, already-fast vectorised expression into something more clever rarely shows up in a real profile. Time or profile an actual, current bottleneck before spending effort on it — the slow part is often a completely different line than intuition suggests.

## Common mistakes

- Reaching for `apply`/`iterrows` before checking whether a vectorised expression already exists.
- Assuming a text column's `memory_usage()` is accurate without `deep=True`.
- Downcasting or converting to `category` without checking the data actually fits.
- Optimising a line that was never actually the bottleneck.

## Recap

- `memory_usage(deep=True)` gives an honest read of how much a frame (especially its text columns) really costs.
- `category` and smaller numeric dtypes trade a known, safe range for real memory savings.
- Vectorised expressions beat `apply`/`iterrows` for almost anything a loop-per-row was doing.
- `chunksize=` bounds memory for files too large to load at once; measure before optimising anything else.
