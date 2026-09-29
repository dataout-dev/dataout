The single biggest performance lever in most Python code is not a clever trick — it is choosing a data structure whose operations are cheap for what you are actually doing. A `dict` or `set` lookup costs roughly the same regardless of size; scanning a `list` for membership gets slower as the list grows.

You will learn:

- choosing the right structure for the job
- sets and dicts for O(1)-ish lookups
- avoiding accidentally quadratic patterns
- generators for memory, not just speed
- caching and local-variable tricks, briefly

## Sets and dicts for lookups

```python
import time

big_list = list(range(50000))
big_set = set(big_list)

start = time.perf_counter()
found = 49999 in big_list
list_time = time.perf_counter() - start

start = time.perf_counter()
found = 49999 in big_set
set_time = time.perf_counter() - start

print(f"list: {list_time:.6f}s, set: {set_time:.6f}s")
```

`in` on a `list` scans element by element until it finds a match — cost grows with the list's size. `in` on a `set` (or a `dict`'s keys) uses hashing to jump almost straight to the answer, regardless of how large it is. Converting a list you will repeatedly search into a set once, up front, is one of the cheapest wins available.

## Avoiding accidentally quadratic patterns

```python
def find_duplicates_slow(items):
    dupes = []
    for i, x in enumerate(items):
        if x in items[:i]:   # a fresh linear scan, for every single item
            dupes.append(x)
    return dupes

def find_duplicates_fast(items):
    seen = set()
    dupes = []
    for x in items:
        if x in seen:
            dupes.append(x)
        seen.add(x)
    return dupes

data = list(range(2000)) + [1, 2, 3]
print(find_duplicates_slow(data) == find_duplicates_fast(data))
```

`find_duplicates_slow` looks innocent, but `x in items[:i]` re-scans a growing slice on every iteration — the total work grows roughly with the *square* of the list's length. `find_duplicates_fast` does the same job with one linear pass and a set, and produces the identical result.

## Generators for memory

```python
def squares_list(n):
    return [x ** 2 for x in range(n)]   # builds the WHOLE list in memory at once

def squares_gen(n):
    for x in range(n):
        yield x ** 2                     # produces one value at a time, on demand

total = sum(squares_gen(1_000_000))
print(total)
```

`squares_list(1_000_000)` allocates a million-element list before you can even start using it. `squares_gen` produces one value at a time — `sum()` consumes them as they come, never holding more than one in memory. This matters most when you only need to iterate once (as `sum` does here), not when you need to index into the results repeatedly.

## Caching

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(30))
```

Recomputing `fib(28)` from scratch every time it is needed inside a naive recursive Fibonacci makes the whole function exponential. `lru_cache` remembers a result the first time it is computed for a given argument and returns it instantly on every later call with the same argument — turning the exponential recursion into a linear one, with no change to the recursive structure itself.

## Local variable tricks

```python
import math

def distances_slow(points):
    return [math.sqrt(x**2 + y**2) for x, y in points]  # looks up math.sqrt in a global dict, every call

def distances_fast(points, sqrt=math.sqrt):
    return [sqrt(x**2 + y**2) for x, y in points]        # bound once as a default argument, then a fast local lookup

points = [(3, 4), (5, 12), (8, 15)]
print(distances_slow(points) == distances_fast(points))
```

Binding a frequently-used global function as a default argument (evaluated once, at definition time) turns every later lookup inside the function into a fast local-variable access instead of a global lookup — a small trick, but a real one in a genuinely hot loop.

## Watch out: micro-optimising the wrong 97%

Donald Knuth's frequently (and often incompletely) quoted line — "premature optimization is the root of all evil" — is really about this: the vast majority of any program's runtime usually concentrates in a small fraction of the code. Applying every trick in this lesson uniformly, everywhere, adds real complexity for speed gains that mostly do not matter; profiling first (previous lesson) is what tells you *which* 3% is actually worth this attention.

## Common mistakes

- Scanning a list repeatedly for membership instead of converting it to a set once.
- Writing a loop that re-scans a growing portion of data on every iteration, without noticing the quadratic cost.
- Materialising a full list in memory when a generator, consumed once, would do.
- Applying `lru_cache` to a function with side effects, or whose arguments are unhashable (a `list` or `dict` argument) — both break the caching assumption that the same arguments always mean the same result.
