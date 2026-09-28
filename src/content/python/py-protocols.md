Abstract base classes require **inheritance**: a class must explicitly say it implements your interface. `Protocol`, from the `typing` module, describes an interface **structurally** instead: any class that happens to have the right methods and attributes fits, whether or not it ever heard of your protocol. This is duck typing, made precise and checkable by tools.

You will learn:

- defining a `Protocol`
- structural typing versus nominal typing
- `@runtime_checkable`, and its limits
- when to reach for a `Protocol` instead of an `ABC`

## Nominal typing: what abc gives you

With `ABC`, a class only "counts" as an `Exporter` if it says `class CsvExporter(Exporter):` — the relationship is by **name**, declared up front. This is called **nominal typing**.

## Structural typing: what Protocol gives you

```python
from typing import Protocol

class HasArea(Protocol):
    def area(self) -> float:
        ...

class Square:
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2

class Circle:
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

def total_area(shapes: list[HasArea]) -> float:
    return sum(shape.area() for shape in shapes)

print(round(total_area([Square(4), Circle(2)]), 2))
```

Neither `Square` nor `Circle` mentions `HasArea` anywhere. A type checker (such as `mypy`), reading the hint `list[HasArea]`, would confirm that both classes have a compatible `area()` method, purely by looking at their **shape** — hence "structural" typing. This is exactly duck typing, now written down as a hint that tools can verify.

## Protocol is (mostly) for type checkers, not runtime

By default, a `Protocol` is not checked while the program runs. `isinstance` against a plain `Protocol` raises an error:

<!-- expect-error -->
```python
from typing import Protocol

class HasArea(Protocol):
    def area(self) -> float:
        ...

isinstance(3, HasArea)
```

## runtime_checkable

Add `@runtime_checkable` to allow `isinstance`/`issubclass` — but read the fine print below before you rely on it:

```python
from typing import Protocol, runtime_checkable

@runtime_checkable
class HasArea(Protocol):
    def area(self) -> float:
        ...

class Square:
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2

print(isinstance(Square(3), HasArea))
print(isinstance("text", HasArea))
```

## The limit: only names are checked, not signatures or types

A runtime-checkable protocol confirms that the **names** exist as callable attributes. It does **not** check the number of parameters, their types, or the return type:

```python
@runtime_checkable
class HasArea(Protocol):
    def area(self) -> float:
        ...

class Faker:
    def area(self, unused_argument):
        return "not even a number"

print(isinstance(Faker(), HasArea))
```

`Faker.area` takes an extra argument and returns text, not a number — completely wrong — yet `isinstance` reports `True`, because it only checked that an attribute called `area` exists and is callable. **Use `runtime_checkable` for a quick sanity check, and rely on a proper type checker (or your tests) for anything that really matters.**

## Protocol versus ABC

| | `ABC` | `Protocol` |
| - | ----- | ---------- |
| Relationship | nominal: must inherit and declare it | structural: shape alone is enough |
| Enforced when | instance creation (`TypeError` if incomplete) | mostly at type-checking time, not runtime |
| Good for | a family of classes **you** control and design together | describing what a function needs from **any** object, including ones you do not control |
| `isinstance` | always meaningful | only with `@runtime_checkable`, and only checks names |

A useful rule: if you are designing a **family of related classes from scratch** and want Python itself to enforce completeness, reach for `ABC`. If you are writing a function that should accept **anything with the right shape** — including objects from other libraries you cannot modify — a `Protocol` documents that intention without forcing anyone into your hierarchy.

## A protocol for something you do not own

This is where protocols shine: describing objects you did not write and cannot change.

```python
from typing import Protocol

class SupportsLen(Protocol):
    def __len__(self) -> int:
        ...

def describe_size(x: SupportsLen) -> str:
    return f"has {len(x)} items"

print(describe_size([1, 2, 3]))
print(describe_size("hello"))
print(describe_size({"a": 1}))
```

`list`, `str` and `dict` were never written with `SupportsLen` in mind, and never will be, yet the hint precisely documents what `describe_size` actually needs from its argument.

## Common mistakes

- Expecting `isinstance` against a plain `Protocol` to work without `@runtime_checkable`.
- Trusting a `runtime_checkable` check to have verified argument types or counts — it has not.
- Reaching for `Protocol` when you actually control the whole hierarchy and want Python to enforce completeness (that is what `ABC` is for).
- Writing a `Protocol` with dozens of required members "just in case", instead of the few a function truly needs.

## Recap

- `Protocol` describes an interface structurally: any class with the right shape fits, no inheritance needed.
- Plain `Protocol` is a static-typing tool; add `@runtime_checkable` for `isinstance`, which then only checks that the named attributes exist.
- Use `ABC` for a family of classes you design together and want enforced; use `Protocol` for what a function needs from anything, including code you do not own.

## Your turn

In the **Practice** tab you define a `HasArea` protocol and a function that sums areas. Then three challenges use real data.
