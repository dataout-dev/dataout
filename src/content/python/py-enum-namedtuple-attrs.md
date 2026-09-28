This closing lesson of the data model section is a tour: a deeper look at `Enum`, a reminder of `NamedTuple`, and an honest comparison of `attrs` and `pydantic` against the `@dataclass` you just learned — so that when you meet a codebase using any of them, you already know roughly what you are looking at.

You will learn:

- richer enums: methods, values that are tuples, and `Flag`
- `NamedTuple`, revisited alongside dataclasses
- what `attrs` adds over `@dataclass`
- what `pydantic` adds, and why it is popular for data at the edges of a program
- a decision guide for choosing between them

## Enums with methods

An `Enum` is a class, and can have ordinary methods, computed from `self.value`:

```python
from enum import Enum

class Direction(Enum):
    NORTH = (0, 1)
    SOUTH = (0, -1)
    EAST = (1, 0)
    WEST = (-1, 0)

    def offset(self):
        return self.value

print(Direction.NORTH.offset())
print(Direction.EAST.value)
```

A member's `value` can be **any** object at all — here, a tuple — not just a string or a number.

## Flag, revisited: combining and checking

```python
from enum import Flag, auto

class Access(Flag):
    READ = auto()
    WRITE = auto()
    ADMIN = auto()

level = Access.READ | Access.WRITE
print(level)
print(Access.WRITE in level, Access.ADMIN in level)
print((level & Access.ADMIN) == Access.ADMIN)
```

## StrEnum and IntEnum, briefly revisited

Sometimes an enum's members need to behave like their underlying value in other contexts (comparing to a plain string, or being written to JSON directly):

```python
from enum import IntEnum

class Priority(IntEnum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3

print(Priority.HIGH > Priority.LOW)
print(Priority.HIGH == 3)
print(sorted([Priority.HIGH, Priority.LOW, Priority.MEDIUM]))
```

Remember the trade-off from Core Python: a plain `Enum` prevents accidental mixing with raw numbers or strings, which is usually **safer**; `IntEnum`/`StrEnum` are for the specific cases where you genuinely need that interoperability, such as matching values from an external API.

## NamedTuple, next to a dataclass

```python
from typing import NamedTuple
from dataclasses import dataclass

class PointTuple(NamedTuple):
    x: float
    y: float

@dataclass
class PointClass:
    x: float
    y: float

pt = PointTuple(1, 2)
pc = PointClass(1, 2)
print(pt == PointTuple(1, 2))
print(pc == PointClass(1, 2))
x, y = pt
print(x, y)
print(pt._replace(x=9))
```

Both compare by value out of the box. The real differences: a `NamedTuple` **is** a tuple (it unpacks, supports indexing, and is always immutable), while a `@dataclass` is an ordinary mutable object by default (or immutable only if you ask for `frozen=True`). Choose `NamedTuple` for a small, tuple-like record; choose `@dataclass` when you want an ordinary object, mutability, `__post_init__`, or inheritance.

## attrs: dataclasses' older, more flexible cousin

The third-party `attrs` library predates `@dataclass` (which was inspired by it), and remains more flexible in a few ways: **validators** attached directly to a field, converters that transform a value on assignment, and support for versions of Python before dataclasses existed. Conceptually, it looks almost identical:

```text
import attr

@attr.s
class Song:
    title = attr.ib()
    streams = attr.ib(validator=attr.validators.instance_of(int))
```

If you see `@attr.s` or `@define` decorating a class in someone else's code, you are looking at `attrs`; the ideas transfer directly from what you just learned about dataclasses.

## pydantic: validation from the type hints themselves

`pydantic` goes a step further: it reads your type hints and **automatically validates and converts** incoming data to match them, which makes it extremely popular for parsing data that arrives from **outside** your program — a web request body, a configuration file, an external API response:

```text
from pydantic import BaseModel

class Song(BaseModel):
    title: str
    streams: int

song = Song(title="Track A", streams="100")
print(song.streams, type(song.streams))
```

Note that `pydantic` is not part of the standard library, and, unlike `attrs`, may not be installed in every environment (including this browser playground) — but recognising it, and knowing that it turns type hints into working validation, will save you real confusion the first time you meet it in a real project.

## A decision guide

| You need... | Reach for |
| ----------- | --------- |
| a fixed set of named choices | `Enum` (or `IntEnum`/`Flag` for the specific cases that need it) |
| a small, immutable, tuple-like record | `NamedTuple` |
| an ordinary record class, with `__init__`/`__repr__`/`__eq__` generated | `@dataclass` |
| field-level validators or converters, without external dependencies being a concern | `attrs` |
| automatic validation and parsing of data from outside your program | `pydantic` |

## Common mistakes

- Reaching for `pydantic` (or `attrs`) for internal, already-trusted data, where a plain `@dataclass` would be simpler and dependency-free.
- Forgetting that a `NamedTuple` is always immutable, and fighting the language trying to "update" one in place instead of using `_replace`.
- Assuming every codebase uses the same tool — recognise `@attr.s`/`@define` and `BaseModel` as siblings of `@dataclass`, not competitors you need to relearn from scratch.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
