Look back at every "record-like" class you have written in this tier — `__init__` storing a handful of attributes, plus `__repr__`, plus `__eq__` — and notice the pattern: it is almost always the same three methods, written by hand, every time. `@dataclass` generates them for you from a short list of annotated fields.

You will learn:

- `@dataclass`, and what it generates automatically
- `field()` and `default_factory` for defaults that need computing
- `order`, `frozen`, `kw_only`, and `slots`
- `__post_init__` for validation and derived values
- `InitVar` for constructor-only input
- `asdict` and `replace`
- how dataclasses compare with `namedtuple` and with `attrs`/`pydantic`

## The problem, by hand

```python
class Song:
    def __init__(self, title, artist, streams):
        self.title = title
        self.artist = artist
        self.streams = streams

    def __repr__(self):
        return f"Song(title={self.title!r}, artist={self.artist!r}, streams={self.streams!r})"

    def __eq__(self, other):
        return (self.title, self.artist, self.streams) == (other.title, other.artist, other.streams)
```

Nothing here is wrong, but it is entirely boilerplate: the shape of `__repr__` and `__eq__` follows mechanically from the fields.

## The same thing with @dataclass

```python
from dataclasses import dataclass

@dataclass
class Song:
    title: str
    artist: str
    streams: int

s1 = Song("Blinding Lights", "The Weeknd", 100)
s2 = Song("Blinding Lights", "The Weeknd", 100)
print(s1)
print(s1 == s2)
```

`@dataclass` reads the **type-annotated** class body and generates `__init__`, `__repr__`, and `__eq__` for you, all based on the fields you listed. This is the same annotation syntax from the type hints lesson in Core Python, now doing real work at class-definition time, not just documenting.

## Defaults, and field() for anything mutable

```python
from dataclasses import dataclass, field

@dataclass
class Playlist:
    name: str
    tracks: list = field(default_factory=list)
    limit: int = 50

p1 = Playlist("Focus")
p1.tracks.append("Track A")
p2 = Playlist("Chill")
print(p1.tracks, p2.tracks)
```

A plain `tracks: list = []` would repeat the exact mutable-default-argument bug from the functions lesson in Core Python — one shared list, for every instance. `field(default_factory=list)` calls `list()` **fresh, for each new instance**, which is why `p1` and `p2` above have independent lists.

## order, frozen, kw_only

```python
from dataclasses import dataclass

@dataclass(order=True, frozen=True)
class Song:
    streams: int
    title: str

songs = [Song(100, "B"), Song(300, "A"), Song(100, "A")]
print(sorted(songs))
```

- `order=True` generates `__lt__` and friends, comparing fields **in the order they are declared** — here, `streams` first, then `title`, which is why `Song(100, "A")` sorts before `Song(100, "B")`.
- `frozen=True` makes instances **immutable** after construction — assigning to a field afterward raises.

<!-- expect-error -->
```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Song:
    streams: int
    title: str

s = Song(100, "A")
s.streams = 200
```

`kw_only=True` (on the whole class, or per-field with `field(kw_only=True)`) forces fields to be passed by keyword only, which is often clearer once a dataclass has several fields of the same type.

## __post_init__: validation and derived fields

`__init__` is generated for you, but you can still run extra code **right after** it, by defining `__post_init__`:

```python
from dataclasses import dataclass, field

@dataclass
class Rectangle:
    width: float
    height: float
    area: float = field(init=False)

    def __post_init__(self):
        if self.width <= 0 or self.height <= 0:
            raise ValueError("dimensions must be positive")
        self.area = self.width * self.height

r = Rectangle(3, 4)
print(r.area)
```

`field(init=False)` excludes `area` from the generated `__init__` parameters entirely, since it is always **computed**, never passed in directly.

## InitVar: input that is not stored

Occasionally you need a value **only** to compute something in `__post_init__`, without keeping it as a field at all. `InitVar` marks exactly that:

```python
from dataclasses import dataclass, InitVar

@dataclass
class Circle:
    radius: float
    diameter: float = 0.0
    unit: InitVar[str] = "cm"

    def __post_init__(self, unit):
        self.diameter = self.radius * 2
        print(f"created a circle measured in {unit}")

c = Circle(5, unit="inches")
print(c.diameter)
print(hasattr(c, "unit"))
```

`unit` is accepted by the constructor and passed into `__post_init__`, but `Circle` instances never actually store it.

## asdict and replace

```python
from dataclasses import dataclass, asdict, replace

@dataclass
class Song:
    title: str
    streams: int

s = Song("Track A", 100)
print(asdict(s))
bigger = replace(s, streams=200)
print(s, bigger)
```

`asdict` converts a dataclass instance (recursively, including nested dataclasses) into a plain dictionary. `replace` builds a **new** instance with some fields changed, leaving the original untouched — the standard way to "modify" an immutable (`frozen=True`) dataclass.

## Inheritance

Dataclasses inherit normally; a subclass's own fields are added **after** the parent's:

```python
from dataclasses import dataclass

@dataclass
class Track:
    title: str
    milliseconds: int

@dataclass
class Song(Track):
    lyrics_by: str = "unknown"

s = Song("Track A", 200000, "Ada")
print(s)
```

## Comparing with namedtuple, attrs and pydantic

| | Mutable? | Type hints | Validation | Standard library? |
| - | -------- | ---------- | ---------- | ------------------ |
| `namedtuple` | no | no | no | yes |
| `@dataclass` | yes (or `frozen=True`) | yes | only what you write in `__post_init__` | yes |
| `attrs` (third-party) | either | yes | built-in validators | no |
| `pydantic` (third-party) | either | yes | automatic, from the type hints themselves | no |

Use `namedtuple` for a very small, tuple-like, immutable record. Use `@dataclass` for everything else you would have written `__init__`/`__repr__`/`__eq__` for by hand — which, by this point in the tier, is most of your classes. Reach for `attrs` or `pydantic` when you need automatic validation straight from type hints (common for data arriving from outside your program, such as a web request); note that `pydantic` may not be available in every environment, including this browser playground.

## Common mistakes

- Using a plain mutable default (`tracks: list = []`) instead of `field(default_factory=list)`.
- Forgetting `field(init=False)` for a field that `__post_init__` computes, and getting a confusing constructor signature.
- Expecting `frozen=True` alone to deep-freeze nested mutable fields (a frozen dataclass can still contain a mutable list, which can still be mutated in place).
- Reaching for `namedtuple` when you actually need mutability or default values.

## Recap

- `@dataclass` generates `__init__`, `__repr__` and `__eq__` from annotated fields.
- `field(default_factory=...)` avoids the mutable-default bug; `order`, `frozen` and `kw_only` add common behaviour.
- `__post_init__` validates or computes derived fields after construction; `InitVar` accepts input that is not stored.
- `asdict` and `replace` convert and "modify" dataclass instances.

## Your turn

In the **Practice** tab you define a frozen, ordered `Song` dataclass and sort by streams. Then three challenges use real data.
