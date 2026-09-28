Core Python introduced generators as the easy way to build lazy sequences. This lesson looks at the same idea from the other side: writing an **iterator as a class**, by hand, with `__iter__` and `__next__`. Seeing the mechanism explicitly demystifies what a generator does for you automatically, and shows a subtle trap: the difference between an iterable that can be used many times, and an iterator that is used up after one pass.

You will learn:

- `__iter__` and `__next__`, the iterator protocol, revisited from Core Python
- `StopIteration`, and why the protocol needs it
- an iterator class versus a generator function, side by side
- reusable **iterables** versus one-shot **iterators**
- lazy sequences with caching

## Writing an iterator by hand

```python
class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

for n in Countdown(3):
    print(n)
```

`__iter__` returns `self`, meaning the object **is** its own iterator. `__next__` produces the next value, or raises `StopIteration` to signal "no more values" — exactly the exception a `for` loop already knows to catch, from the iterators lesson back in Core Python.

## The same thing, as a generator

```python
def countdown(start):
    current = start
    while current > 0:
        yield current
        current -= 1

for n in countdown(3):
    print(n)
```

Both versions produce the identical sequence. The generator function is far shorter, because Python builds the `__iter__`/`__next__` machinery for you, using `yield` to remember exactly where execution paused. Understanding the class-based version is what makes clear **why** a generator behaves the way it does: every `yield` is really a `return` from `__next__`, and the next call resumes right after it.

## Reusable iterables versus one-shot iterators

Here is the subtlety this lesson exists to teach. The `Countdown` class above is **both** an iterable (it has `__iter__`) **and** an iterator (it has `__next__`, and `__iter__` returns `self`). That combination means it can only be exhausted **once**:

```python
c = Countdown(3)
print(list(c))
print(list(c))
```

The second `list(c)` is empty, because `c.current` reached `0` during the first pass, and nothing resets it. Compare this with a plain `range`, which can be iterated many times:

```python
r = range(3)
print(list(r))
print(list(r))
```

`range` is an iterable, but **not** an iterator: each time you call `iter(r)`, you get a **fresh** iterator, starting from the beginning.

## Making a reusable iterable

To support being iterated more than once, separate the two roles: the **iterable** creates a **new** iterator object each time `__iter__` is called, rather than reusing `self`:

```python
class CountdownIterable:
    def __init__(self, start):
        self.start = start

    def __iter__(self):
        return CountdownIterator(self.start)

class CountdownIterator:
    def __init__(self, current):
        self.current = current

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

cd = CountdownIterable(3)
print(list(cd))
print(list(cd))
```

Every call to `iter(cd)` (which `for` and `list()` do automatically) builds a brand-new `CountdownIterator`, starting fresh from `self.start`. This is exactly the relationship between a generator **function** (the reusable iterable — calling it again gives a new generator) and the generator **object** it returns each time (the one-shot iterator).

## Lazy sequences with caching

A class-based iterator can hold onto extra state that a plain generator cannot as conveniently — for example, remembering every value it has produced so far, so that re-iterating (as a genuinely new pass) can be served from a cache instead of recomputing:

```python
class CachedSquares:
    def __init__(self, count):
        self.count = count
        self._cache = []

    def __iter__(self):
        for i in range(self.count):
            if i < len(self._cache):
                yield self._cache[i]
            else:
                value = i * i
                self._cache.append(value)
                yield value

squares = CachedSquares(5)
print(list(squares))
print(squares._cache)
print(list(squares))
```

Here `__iter__` is itself written as a generator (using `yield`), which is a common and convenient hybrid: the class manages long-lived state (the cache), while the generator syntax handles the iteration mechanics for each individual pass.

## Common mistakes

- Making `__iter__` return `self` when the object needs to support more than one independent pass.
- Forgetting to raise `StopIteration` from `__next__`, causing the iteration to run forever.
- Confusing an iterable (has `__iter__`) with an iterator (has `__next__`, and is usually also its own `__iter__`) — not every iterable is an iterator, and mixing them up is where the "already exhausted" bug comes from.

## Recap

- `__iter__` plus `__next__` (raising `StopIteration` when done) is the full iterator protocol, written by hand.
- An object that is its own iterator (`__iter__` returns `self`) can only be iterated once.
- A reusable iterable builds a **fresh** iterator object every time `__iter__` is called — exactly what a generator **function** does each time it is called.
- Class-based iterators can hold extra state, such as a cache, that plain generators cannot as easily.

## Your turn

In the **Practice** tab you write a reusable `Countdown` iterable, where each iteration starts fresh. Then three challenges use real data.
