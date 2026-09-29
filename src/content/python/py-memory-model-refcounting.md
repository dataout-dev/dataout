Every object you create in Python lives on the heap, and every name is just a label pointing at one. Understanding how CPython decides when an object's memory can finally be freed explains a surprising number of "why does this behave like that" moments.

You will learn:

- objects, references, and `sys.getrefcount`
- interning of small ints and some strings
- identity pitfalls this creates
- the cyclic garbage collector, and why it exists alongside reference counting
- weak references
- memory leaks in Python, and `tracemalloc`

## Objects and reference counts

```python
import sys

a = [1, 2, 3]
print(sys.getrefcount(a))   # at least 2: `a` itself, plus getrefcount's own temporary argument reference

b = a
print(sys.getrefcount(a))   # one higher now that `b` also refers to the same object

del b
print(sys.getrefcount(a))   # back down
```

Every object carries a count of how many references point to it. The moment that count reaches zero, CPython frees the object immediately — there is no waiting for a garbage-collection pass in the common case, unlike some other languages.

## Interning

```python
a = 5
b = 5
print(a is b)   # True - small integers are cached and shared

x = 1000
y = 1000
print(x is y)   # often False - large integers usually are not cached

s1 = "hello"
s2 = "hello"
print(s1 is s2)   # often True - simple string literals are frequently interned
```

CPython caches small integers (typically -5 to 256) and many simple string literals as a memory and speed optimisation. This is an *implementation detail*, not a language guarantee — relying on `is` instead of `==` to compare values is fragile precisely because it depends on caching behaviour that can differ between values, versions, or implementations.

## Identity pitfalls

```python
a = 1000
b = 1000
print(a == b)   # True - values are equal
print(a is b)   # implementation-dependent - don't rely on this
```

The bug this causes in practice: code that happens to work while testing with small numbers (which are interned) breaks once real data includes larger ones — a classic case of a hidden dependency on an implementation detail.

## The cyclic garbage collector

```python
import gc

class Node:
    def __init__(self):
        self.other = None

a = Node()
b = Node()
a.other = b
b.other = a   # a cycle: each keeps the other's reference count above zero

del a
del b
# neither object's refcount reached zero - the names are gone, but they still reference each other
collected = gc.collect()
print(f"gc collected {collected} unreachable objects")
```

Reference counting alone cannot free a cycle: even after both names are deleted, `a` and `b` still reference each other, so neither ever reaches a reference count of zero. Python's separate cyclic collector periodically scans for groups of objects that are unreachable from anywhere else, despite still referencing each other, and frees them as a group.

## Weak references

```python
import weakref

class Resource:
    pass

r = Resource()
weak = weakref.ref(r)

print(weak() is r)   # the weak reference resolves to the real object while it's still alive

del r
print(weak())   # None - the object was freed; the weak reference didn't keep it alive
```

A normal reference keeps an object alive. A `weakref` lets you refer to an object *without* affecting its reference count — exactly what a cache needs if it should not be the reason nothing ever gets freed.

## tracemalloc

```python
import tracemalloc

tracemalloc.start()
data = [str(i) * 100 for i in range(1000)]
snapshot = tracemalloc.take_snapshot()
tracemalloc.stop()

top_stats = snapshot.statistics("lineno")
print(f"tracked {len(top_stats)} distinct allocation sites")
```

`tracemalloc` records where in your code each allocation happened, then lets you inspect or diff snapshots — the tool to reach for when memory use is growing and you need to find out *which line* is responsible, rather than guessing.

## Watch out: assuming del frees memory

```python
a = [1, 2, 3]
b = a
del a
# the list is NOT freed here - `b` still references it
print(b)
```

`del name` only removes *that name's* reference. The underlying object is freed only once its reference count actually reaches zero — which may not happen at the `del` line at all, if something else still holds a reference.

## Common mistakes

- Comparing values with `is` instead of `==`, relying on interning that is not guaranteed.
- Assuming `del x` frees the object `x` referred to, when another reference to it may still exist.
- Building a cache with strong references that quietly prevents anything it has ever seen from being garbage collected.
- Reaching for `gc.collect()` as a routine fix for memory growth, instead of using `tracemalloc` to find the actual cause first.
