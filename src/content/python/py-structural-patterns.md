**Structural patterns** describe how objects are **composed** into larger structures. This lesson covers four of the most common: the adapter, which makes an incompatible interface fit; the decorator pattern (not to be confused with the `@decorator` syntax); the facade, which simplifies a complicated subsystem; and the proxy, which stands in for another object.

You will learn:

- the adapter pattern: wrapping a legacy or mismatched API
- the decorator **pattern** versus Python's `@decorator` **syntax**
- the facade pattern: one simple entry point over a complex subsystem
- the proxy pattern: lazy loading and access control
- the composite pattern, briefly
- when too many layers becomes its own problem

## Adapter: making interfaces fit

An **adapter** wraps an object with one interface, and exposes a **different** interface that your code actually expects — without changing the original object at all:

```python
legacy_rows = [{"n": "Ada", "s": 95}, {"n": "Alan", "s": 88}]

class RowsAdapter:
    def __init__(self, legacy_rows):
        self._rows = legacy_rows

    def __iter__(self):
        for row in self._rows:
            yield {"name": row["n"], "score": row["s"]}

def print_report(rows):
    for row in rows:
        print(row["name"], row["score"])

print_report(RowsAdapter(legacy_rows))
```

`print_report` expects `"name"`/`"score"` keys. `legacy_rows` uses `"n"`/`"s"`. Rather than rewriting `print_report`, or the (perhaps external, unchangeable) source of `legacy_rows`, `RowsAdapter` translates between the two — a very common, very practical pattern whenever you connect code you own to code you do not.

## Decorator pattern versus @decorator syntax

Python's `@decorator` syntax (from Core Python) is one **implementation** of a much older, language-independent idea: the **decorator pattern**, which wraps an object to add behaviour, while keeping the same interface, so the wrapped object can be used exactly where the original was:

```python
class Coffee:
    def cost(self):
        return 2.0

    def describe(self):
        return "coffee"

class MilkDecorator:
    def __init__(self, drink):
        self._drink = drink

    def cost(self):
        return self._drink.cost() + 0.5

    def describe(self):
        return self._drink.describe() + " with milk"

drink = MilkDecorator(MilkDecorator(Coffee()))
print(drink.describe(), drink.cost())
```

Both `MilkDecorator` layers **wrap** a `Coffee`-like object and present the **same** interface (`cost`, `describe`), so they can be stacked. This is the general object-oriented pattern; Python's `@` syntax happens to make the *function*-wrapping special case of it extremely convenient, but the pattern itself applies to any object, not just functions.

## Facade: one simple door into a complex house

A **facade** provides a single, simple interface in front of a complicated subsystem with many moving parts, hiding the complexity that most callers do not need to know about:

```python
class AudioDecoder:
    def load(self, path):
        return f"decoded audio from {path}"

class VideoDecoder:
    def load(self, path):
        return f"decoded video from {path}"

class SubtitleLoader:
    def load(self, path):
        return f"loaded subtitles from {path}"

class MediaPlayerFacade:
    def __init__(self):
        self.audio = AudioDecoder()
        self.video = VideoDecoder()
        self.subtitles = SubtitleLoader()

    def play(self, path):
        return [self.audio.load(path), self.video.load(path), self.subtitles.load(path)]

player = MediaPlayerFacade()
print(player.play("movie.mp4"))
```

A caller of `MediaPlayerFacade.play` never needs to know that three separate subsystems exist underneath. The facade does not replace the subsystems — it simply gives most callers a much simpler front door, while the individual pieces remain available for anyone who genuinely needs finer control.

## Proxy: standing in for another object

A **proxy** has the same interface as a real object, but adds a layer of control — often lazy loading (delay expensive work until it is truly needed) or access control:

```python
class ExpensiveResource:
    def __init__(self):
        print("expensive setup happening now")
        self.data = "real data"

class LazyProxy:
    def __init__(self):
        self._real = None

    def _ensure_loaded(self):
        if self._real is None:
            self._real = ExpensiveResource()
        return self._real

    @property
    def data(self):
        return self._ensure_loaded().data

proxy = LazyProxy()
print("proxy created, nothing expensive yet")
print(proxy.data)
```

`ExpensiveResource` is not built until `proxy.data` is actually read for the first time. The caller never needs to know a proxy is involved — from the outside, `proxy.data` looks exactly like reading data directly off a real, already-loaded resource.

## Composite, briefly

A **composite** lets you treat a single object and a group of objects **the same way**, usually for tree-shaped data — a file and a folder full of files both respond to the same "size" question:

```python
class File:
    def __init__(self, name, size):
        self.name = name
        self.size = size

    def total_size(self):
        return self.size

class Folder:
    def __init__(self, name, children):
        self.name = name
        self.children = children

    def total_size(self):
        return sum(child.total_size() for child in self.children)

tree = Folder("root", [File("a.txt", 100), Folder("sub", [File("b.txt", 50)])])
print(tree.total_size())
```

`total_size()` means the same thing whether you call it on a single `File` or a whole `Folder` of nested children — the calling code does not need to know or care which one it has.

## Too many layers

Each of these patterns adds an **indirection**: one more object between the caller and the real work. That cost is worth paying when it solves a genuine problem (an incompatible interface, an expensive resource, real complexity worth hiding). Stacking adapters around facades around proxies "in case they might help" adds real cost — more code to read, more places for a bug to hide, more mental effort to trace a single call through five wrapping layers — with no corresponding benefit. Reach for a structural pattern when you can name the specific problem it solves.

## Common mistakes

- Confusing the decorator **pattern** (any object wrapping another with the same interface) with Python's `@` **decorator syntax** (specifically for wrapping functions and classes).
- Adding a facade that hides functionality some callers genuinely need, with no way to reach the underlying subsystem.
- Building a proxy or adapter "just in case", for a problem that does not actually exist yet.

## Your turn

In the **Practice** tab you write `RowsAdapter`, adapting a list-of-dicts source to a different interface. Then three challenges use real data.
