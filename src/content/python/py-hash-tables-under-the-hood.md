Every time you write `x in some_set` or look something up in a `dict`, you are relying on hashing — one of the few tricks in computer science that turns an O(n) search into an O(1) one, almost for free.

You will learn:

- what a hash function does, and why it turns a key into a bucket index
- how collisions happen, and how CPython resolves them (open addressing)
- load factor, and why hash tables resize themselves
- why keys must be hashable, and what that actually requires
- what ordering guarantees dicts and sets do (and do not) make

## From key to bucket

A hash table is really just an array of "buckets." `hash(key)` produces a number; that number, reduced to fit the table's size, tells Python which bucket to look in. If a key hashes to bucket 7, Python goes straight to bucket 7 — it does not scan buckets 0 through 6 first.

```python
print(hash("apple") % 8)
print(hash(42) % 8)
```

(The exact numbers will differ between runs — Python randomises string hashing per process for security — but the *idea* is the same every time: the hash decides the starting bucket.)

## Collisions

Two different keys can hash to the same bucket. CPython's dicts and sets handle this with **open addressing**: if the first slot is taken, they probe a nearby slot using a defined sequence, and keep probing until they find the key or an empty slot. This is why a *very* full table gets slow — more collisions mean more probing.

## Load factor and resizing

The load factor is roughly `(number of keys) / (number of slots)`. CPython keeps this below a threshold (resizing — allocating a bigger table and re-inserting everything — once it gets too full) precisely so that lookups stay close to O(1) instead of degrading toward O(n) as the table fills up. This is conceptually the same "occasional expensive step, amortised over many cheap ones" idea as a dynamic array's growth.

## Why keys must be hashable

```python
d = {}
d[(1, 2)] = "a tuple key works"
print(d)

try:
    d[[1, 2]] = "this will fail"
except TypeError as e:
    print("TypeError:", e)
```

A key's hash decides where it lives. If the key could change after being inserted — as a mutable `list` could — its hash might change too, and the table would be looking in the wrong bucket forever after. That is why lists are unhashable but the equivalent tuple is fine: tuples cannot be mutated after creation, so their hash is stable for their whole lifetime.

## Ordering guarantees

```python
d = {}
d["z"] = 1
d["a"] = 2
d["m"] = 3
print(list(d.keys()))   # insertion order: z, a, m — never alphabetical
```

Since Python 3.7, dicts preserve **insertion order** as a language guarantee — this is genuinely relied upon by real code. Plain `set` makes **no** ordering promise at all; two runs of the same program can iterate a set in a different order, especially once hash randomisation is involved.

## Common mistakes

- Checking membership with `x in some_list` inside a loop when a `set` would make it O(1) instead of O(n).
- Trying to use a `list` (or a `dict`, or another `set`) as a dict key or set element, and being confused by the `TypeError: unhashable type`.
- Relying on the iteration order of a `set` for anything — only dicts (and, transitively, `dict.keys()`/`dict.values()`/`dict.items()`) guarantee insertion order.
