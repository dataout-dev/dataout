Some computations are expensive and get asked for the same input repeatedly. Caching that result the first time, and handing back the stored copy afterwards, trades a little memory for a lot of repeated work avoided — as long as you are careful about when a cached value should stop being trusted.

You will learn:

- `lru_cache` and `cache`
- cache invalidation
- caching pure functions only
- disk caches, briefly
- hashing arguments
- memoising methods
- time-based (TTL) caches

## lru_cache and cache

```python
from functools import lru_cache, cache

@lru_cache(maxsize=128)
def slow_square(n):
    return n ** 2

print(slow_square(4), slow_square(4))   # second call is a cache hit

@cache   # equivalent to @lru_cache(maxsize=None) - an unbounded cache
def slow_cube(n):
    return n ** 3

print(slow_cube(3))
```

`lru_cache` remembers results keyed by the exact arguments passed in, evicting the *least recently used* entry once `maxsize` is reached. `cache` is the same idea with no eviction at all — fine for a bounded, small set of possible inputs, risky for one that could grow without bound.

## Cache invalidation

There is an old joke that cache invalidation is one of the two genuinely hard problems in computing (the other being naming things, and off-by-one errors). The core issue: a cache is only correct as long as the underlying data has not changed since it was cached. `lru_cache` has no idea when that happens — clearing a cache (`fn.cache_clear()`) is a manual, deliberate action you have to remember to take when the underlying data changes.

```python
from functools import lru_cache

@lru_cache
def get_setting(key):
    return {"debug": False}.get(key)

print(get_setting("debug"))
get_setting.cache_clear()   # manually invalidate everything, e.g. after settings reload
```

## Caching pure functions only

```python
import random
from functools import lru_cache

@lru_cache
def bad_cache_target(n):
    return n + random.random()   # NOT pure - depends on hidden, changing state

print(bad_cache_target(5) == bad_cache_target(5))   # True, but for the wrong reason
```

Caching only makes sense for a **pure** function: same arguments always produce the same result, with no side effects. Caching `bad_cache_target` "works" in the sense that it returns a consistent answer for `5` — but that consistency is an accident of caching, not a property of the function, and the caller has no way to know they are getting stale randomness instead of a fresh one.

## Hashing arguments

```python
from functools import lru_cache

@lru_cache
def process(items):
    return sum(items)

# process([1, 2, 3])  # would raise TypeError: unhashable type: 'list'
print(process((1, 2, 3)))   # works - tuples are hashable
```

`lru_cache` needs to hash the arguments to use them as a dictionary key internally — a `list` or `dict` argument raises `TypeError` immediately. Passing a `tuple` instead of a `list` (or freezing a dict into a `frozenset` of items) is the usual fix when the underlying data is naturally a sequence or mapping.

## Memoising methods

```python
from functools import lru_cache

class Report:
    def __init__(self, data):
        self.data = tuple(data)

    @lru_cache
    def total(self):
        return sum(self.data)

r = Report([1, 2, 3])
print(r.total())
```

`lru_cache` on a method keys its cache by `self` too (since `self` is an argument) — which means every distinct instance gets its own cache entries, but it also means the cache silently keeps every instance that has ever called the method alive (since the cache holds a reference to `self`), which can be a genuine memory leak for long-lived programs creating many short-lived instances.

## Disk caches, briefly

For results expensive enough to be worth persisting *between* program runs (not just within one process), a disk-backed cache (writing results to a file or a local key-value store) trades memory for durability — the classic use case being anything involving a slow network call or a heavy computation whose inputs rarely change.

## Time-based (TTL) caches

A plain `lru_cache` never expires an entry on its own — only eviction by capacity or a manual `cache_clear()` removes anything. A **TTL** (time-to-live) cache adds an expiry: a cached value is only trusted for some duration before the next request forces a fresh computation, which is the practical middle ground between "always recompute" and "cache forever" for data that changes slowly but does change.

## Watch out: unbounded caches

```python
from functools import lru_cache

@lru_cache(maxsize=None)   # unbounded - grows forever if inputs never repeat
def process_request(request_id):
    return f"handled {request_id}"
```

An unbounded cache keyed on something like a unique request id (which by definition never repeats) never gets a cache *hit*, and never gets smaller — it just accumulates memory forever. A bounded `maxsize`, or no cache at all for inputs that are inherently unique, avoids this.

## Common mistakes

- Caching a function with side effects or hidden randomness, and being surprised by "stale" behaviour.
- Passing a mutable, unhashable argument to a cached function and hitting a `TypeError`.
- Never calling `cache_clear()` after the underlying data actually changes.
- Using an unbounded cache for a function called with effectively unique arguments, quietly leaking memory.
