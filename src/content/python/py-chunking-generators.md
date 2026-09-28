A file that does not fit comfortably in memory does not need to fit in memory all at once — reading it in pieces, and aggregating as you go, gets the same final answer using a small, fixed amount of memory throughout.

You will learn:

- reading a CSV in chunks with `chunksize`
- streaming aggregation
- generators over files
- when to reach for something beyond pandas entirely

## Reading in chunks

```python
import pandas as pd
import io

text = "value\n" + "\n".join(str(i) for i in range(20))
total = 0
count = 0
for chunk in pd.read_csv(io.StringIO(text), chunksize=5):
    total += chunk["value"].sum()
    count += len(chunk)
print(total, count)
```

`chunksize=5` turns `read_csv` into an iterator of 5-row DataFrames instead of one big one — each chunk is processed and then can be discarded, so memory use stays bounded regardless of how large the whole file is.

## Streaming aggregation

The trick to chunked processing is keeping only a small **running summary** between chunks, never the raw rows themselves:

```python
import pandas as pd
import io

text = "category,value\n" + "\n".join(f"{'a' if i % 2 else 'b'},{i}" for i in range(20))
totals = {}
for chunk in pd.read_csv(io.StringIO(text), chunksize=6):
    for cat, group in chunk.groupby("category"):
        totals[cat] = totals.get(cat, 0) + group["value"].sum()
print(totals)
```

A running total (or count, or min/max) per group updates correctly chunk by chunk, without ever needing every row from every chunk in memory simultaneously — the same final answer as loading everything at once and grouping in one pass.

## Generators over files

```python
def read_lines(text):
    for line in text.splitlines():
        yield line.strip()

text = "a\nb\nc"
gen = read_lines(text)
print(next(gen))
print(next(gen))
print(list(gen))
```

A generator function (using `yield`) produces items one at a time, on demand, rather than building a whole list upfront — reading a genuinely huge file line by line this way never holds more than one line in memory at once.

## A generator expression

```python
text = "1\n2\n3\n4\n5"
total = sum(int(line) for line in text.splitlines())
print(total)
```

`(int(line) for line in text.splitlines())` (round parentheses, not square brackets) is a generator expression — it produces values lazily, one at a time, as `sum` asks for them, rather than building the whole list of converted values first.

## Memory profiling

Before optimising for memory, it helps to actually measure it — `df.memory_usage(deep=True).sum()` (covered in an earlier lesson) for an in-memory DataFrame, or a proper profiling tool for a running process, rather than guessing whether something really is a memory problem worth solving.

## When to reach for Dask, Spark or DuckDB

Chunking with plain pandas works well for a straightforward running aggregation. Once the processing itself needs to be genuinely more complex (joins across huge tables, non-trivial multi-pass computation) or needs to run across multiple machines, purpose-built tools — Dask (parallel pandas-like operations), Spark (distributed processing at large scale), or DuckDB (an efficient single-machine analytical engine, covered in an earlier lesson) — take over where hand-rolled chunking starts to strain. This is an overview only; none of these beyond DuckDB are used hands-on in this tier.

## Watch out: collecting a big result into a list

```python
text = "1\n2\n3\n4\n5"
wasteful = [int(line) for line in text.splitlines()]
print(sum(wasteful))
```

Building the whole list first, purely to sum it immediately afterward, defeats the point of streaming — if the point was to avoid holding everything in memory at once, the aggregation itself (`sum(...)`, a running total, a chunk-by-chunk update) needs to consume the generator or chunks directly, not collect them into a list first.

## Common mistakes

- Building a full list from a generator "just to be safe", losing the memory benefit that was the entire point.
- Keeping raw rows across chunks instead of just a running summary, letting memory use grow anyway.
- Reaching for Dask or Spark before checking whether plain chunked pandas would already be enough.
- Not measuring memory use at all before deciding something needs a chunked or out-of-core approach.

## Recap

- `chunksize=` turns `read_csv` into an iterator of smaller DataFrames, processed one at a time.
- Keep only a running summary between chunks — never accumulate the raw rows themselves.
- A generator (`yield`, or a `(... for ...)` expression) produces items lazily, one at a time.
- Reach for Dask, Spark or DuckDB once the computation itself outgrows what hand-rolled chunking can comfortably do.

## Your turn

In the **Practice** tab you write `chunked_total(text, n)`. Then three challenges use real data.
