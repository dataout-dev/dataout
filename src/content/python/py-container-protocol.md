Lists support `len()`, indexing, slicing, `for`, and `in`. None of that is magic reserved for built-ins — it is all driven by special methods that **your own classes can implement too**. This lesson builds a `Playlist` that behaves like a real sequence, end to end.

You will learn:

- `__len__`, revisited for containers specifically
- `__getitem__`, including slice support
- iteration through `__getitem__`, and the cleaner `__iter__`
- `__contains__` for the `in` operator
- `__reversed__`
- subclassing `collections.abc` classes to get some methods for free

## __len__ and __getitem__

```python
class Playlist:
    def __init__(self, tracks):
        self.tracks = list(tracks)

    def __len__(self):
        return len(self.tracks)

    def __getitem__(self, index):
        return self.tracks[index]

pl = Playlist(["Intro", "Verse", "Chorus", "Outro"])
print(len(pl))
print(pl[0], pl[-1])
```

`pl[0]` calls `pl.__getitem__(0)`. Negative indices work because we delegated straight to the underlying list, which already understands them.

## Slicing comes almost for free

Python passes a `slice` object to `__getitem__` when you write `pl[1:3]`. Because we delegate to `self.tracks[index]`, and lists already know how to handle a `slice`, our `Playlist` supports slicing with no extra code:

```python
print(pl[1:3])
print(type(pl[1:3]).__name__)
```

Notice the result is a plain `list`, not a `Playlist` — delegating this simply is fine for many uses, but a more polished container might wrap the slice result back into a new `Playlist`. That is a deliberate design choice, not a requirement.

## Iteration through __getitem__

Remarkably, defining `__getitem__` alone is enough to make an object **iterable**: Python falls back to calling `obj[0]`, `obj[1]`, `obj[2]`, ... until it hits an `IndexError`:

```python
for track in pl:
    print(track)

print(list(pl))
```

This "old-style" iteration protocol exists mainly for backward compatibility and for simple sequence-like objects. Writing an explicit `__iter__` (which you will do properly with generators in the next tier of Python) is the more modern, more general way, and is required for objects that are not naturally indexed by integers, such as sets or mappings.

```python
class Playlist:
    def __init__(self, tracks):
        self.tracks = list(tracks)

    def __len__(self):
        return len(self.tracks)

    def __getitem__(self, index):
        return self.tracks[index]

    def __iter__(self):
        return iter(self.tracks)

pl = Playlist(["Intro", "Verse"])
print(list(pl))
```

## __contains__

Without it, `in` falls back to iterating and comparing each item — which works, but a custom `__contains__` can be faster or check something smarter:

```python
class Playlist:
    def __init__(self, tracks):
        self.tracks = list(tracks)

    def __contains__(self, name):
        return any(name.lower() == t.lower() for t in self.tracks)

pl = Playlist(["Intro", "Verse", "Chorus"])
print("verse" in pl)
print("Bridge" in pl)
```

Here `__contains__` does a **case-insensitive** search, something the default fallback (plain `==` on each item) would not do.

## __reversed__

`reversed(obj)` uses `__reversed__` if defined, or falls back to `__len__` plus `__getitem__` counting downward:

```python
class Playlist:
    def __init__(self, tracks):
        self.tracks = list(tracks)

    def __len__(self):
        return len(self.tracks)

    def __getitem__(self, index):
        return self.tracks[index]

    def __reversed__(self):
        return iter(self.tracks[::-1])

pl = Playlist(["Intro", "Verse", "Chorus"])
print(list(reversed(pl)))
```

## Building on collections.abc

Writing every one of these methods by hand is instructive, but the standard library's `collections.abc` classes can provide several of them **for free**, once you implement the one or two core methods they need:

```python
from collections.abc import Sequence

class Playlist(Sequence):
    def __init__(self, tracks):
        self.tracks = list(tracks)

    def __len__(self):
        return len(self.tracks)

    def __getitem__(self, index):
        return self.tracks[index]

pl = Playlist(["Intro", "Verse", "Chorus"])
print("Verse" in pl)
print(list(reversed(pl)))
print(pl.index("Chorus"))
print(pl.count("Verse"))
```

By inheriting `Sequence` and providing only `__len__` and `__getitem__`, `Playlist` automatically gained `__contains__`, `__iter__`, `__reversed__`, `.index()`, and `.count()` — all implemented in terms of the two methods you actually wrote. This is a mixin-style benefit, using the same cooperative-inheritance ideas from the previous section, applied to the standard library's own toolbox.

## Common mistakes

- Forgetting that a plain `__getitem__` also needs to handle a `slice` sensibly (usually by delegating to an underlying list).
- Writing your own `__contains__`/`__iter__`/`__reversed__` by hand when subclassing `collections.abc.Sequence` (or `Mapping`, `Set`, and friends) would give you correct versions for free.
- Assuming iteration "just works" without either `__iter__` or a properly `IndexError`-raising `__getitem__`.

## Recap

- `__len__` and `__getitem__` (with slice support) make a basic sequence.
- `__getitem__` alone enables iteration by the old protocol; `__iter__` is the modern, more general way.
- `__contains__` customises `in`, and `__reversed__` customises `reversed()`.
- Subclassing `collections.abc.Sequence` (and friends) gives you several of these methods for free.

## Your turn

In the **Practice** tab you write a `Playlist` supporting `len`, indexing, slicing, iteration and `in`. Then three challenges use real data.
