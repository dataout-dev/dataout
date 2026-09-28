Python does not require you to declare the types of variables and functions. But you can **annotate** them with **type hints**, which document what is expected, help your editor find mistakes, and let tools such as `mypy` check a whole program before it runs. This lesson covers the everyday hints.

You will learn:

- annotating variables and functions
- containers: `list[int]`, `dict[str, int]`, `tuple[int, str]`
- optional values and unions: `int | None`
- `Any`, `Callable` and a few more
- how to read hints in documentation
- how tools use them
- the most important fact: hints do nothing at runtime

## Annotating a function

After each parameter, write `: type`, and after the parentheses write `-> type`:

```python
def greet(name: str, times: int = 1) -> str:
    return ("Hello, " + name + "! ") * times

print(greet("Ada", 2))
print(greet.__annotations__)
```

The hints are stored in `__annotations__`. Variables can be annotated too:

```python
count: int = 0
names: list[str] = []
scores: dict[str, float] = {"ada": 9.5}
print(count, names, scores)
```

## Hints do nothing at runtime

This is the key fact. Python **ignores** hints when it runs the program:

```python
def double(x: int) -> int:
    return x * 2

print(double("ab"))
```

No error: `"ab" * 2` is a valid operation, even though the hint says `int`. The hints are for **you, your editor and your tools**. A type checker such as `mypy` or `pyright` reads the code, and warns you about `double("ab")` before you run it.

## Containers

Since Python 3.9, you write the built-in containers with square brackets:

```python
def total(prices: list[float]) -> float:
    return sum(prices)

def count_words(text: str) -> dict[str, int]:
    counts: dict[str, int] = {}
    for word in text.split():
        counts[word] = counts.get(word, 0) + 1
    return counts

point: tuple[int, int] = (3, 4)
row: tuple[str, int, float] = ("pen", 3, 1.5)
tags: set[str] = {"a", "b"}
matrix: list[list[int]] = [[1, 2], [3, 4]]
scores: tuple[int, ...] = (1, 2, 3, 4)
print(total([1.5, 2.5]), count_words("a b a"))
```

`tuple[int, str]` is a tuple of exactly two items. `tuple[int, ...]` is a tuple of any length whose items are all `int`.

## Optional values and unions

A function that sometimes returns nothing has a return type that is either a type or `None`. Since Python 3.10, that is written with `|`:

```python
def find(items: list[str], key: str) -> int | None:
    for index, item in enumerate(items):
        if item == key:
            return index
    return None

print(find(["a", "b"], "b"), find(["a"], "z"))
print(find.__annotations__)

def parse(value: int | str | None) -> str:
    return "none" if value is None else str(value)

print(parse(5), parse(None))
```

Older code writes `Optional[int]` and `Union[int, str]` from the `typing` module. They mean the same thing. When a value can be `None`, a type checker makes you check for it before you use it. That is one of the most helpful things about hints.

## Any, Callable and friends

```python
from typing import Any, Callable, Iterable, Literal

def apply(function: Callable[[int], int], value: int) -> int:
    return function(value)

def first(items: Iterable[Any]) -> Any:
    for item in items:
        return item

def set_mode(mode: Literal["fast", "slow"]) -> str:
    return mode

print(apply(lambda x: x + 1, 4), first("xyz"), set_mode("fast"))
```

- `Any` means "any type", so the checker does not check it.
- `Callable[[int, str], bool]` is a function that takes an `int` and a `str` and returns a `bool`.
- `Iterable[T]`, `Sequence[T]` and `Mapping[K, V]` (from `collections.abc`) describe **what a function needs** from its argument, and not the concrete type. Prefer them for parameters, and use concrete types (`list`, `dict`) for what you return.
- `Literal["fast", "slow"]` allows only those exact values.

## Type aliases and generics

A long hint can get a name, and a function can work for **any** type with a type variable:

```python
type Point = tuple[float, float]
type Matrix = list[list[float]]

def distance(a: Point, b: Point) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5

def first_or_none[T](items: list[T]) -> T | None:
    return items[0] if items else None

print(distance((0, 0), (3, 4)), first_or_none([7, 8]), first_or_none([]))
```

The `type` statement and the `[T]` syntax are new in Python 3.12. Older code uses `TypeAlias` and `TypeVar` from `typing`.

## Reading hints in documentation

When you look up a function, the hints tell you a lot. For example `sorted(iterable, /, *, key=None, reverse=False)` and the standard library's hints such as `def mean(data: Iterable[float]) -> float` show what to pass in, and what you get back. `inspect.signature` prints them:

```python
import inspect

def convert(value: str, base: int = 10) -> int:
    return int(value, base)

print(inspect.signature(convert))
print(inspect.get_annotations(convert))
```

## What tools do with hints

- **Editors** show completions and warnings.
- **Type checkers** (`mypy`, `pyright`) analyse the whole program, without running it.
- **Libraries** such as `dataclasses`, `pydantic` and web frameworks read the hints at runtime to build behaviour, for example to validate input.

You can adopt hints step by step: annotate the public functions first, then the rest.

## When to use them

Hints pay off in larger programs, in libraries, and in code that several people share. For a ten-line script, they add noise. Keep them simple: a hint that is too clever is worse than none.

## Common mistakes

- Believing that hints are checked when the program runs.
- Using `list` for a parameter when `Iterable` or `Sequence` would accept more.
- Writing `-> None` functions that return a value, or forgetting `| None` for a function that can return `None`.
- Mutable defaults such as `items: list[int] = []`, which are still a bug, hints or no hints.

## Recap

- Annotate with `name: type` and `-> type`. Containers are `list[int]`, `dict[str, int]` and `tuple[int, str]`.
- `int | None` is an optional value. `Any` and `Callable` cover the other common cases.
- Hints are ignored when the program runs. Editors and type checkers use them.

## Your turn

In the **Practice** tab you write `find(items, key)` with precise type hints. Then three challenges use the Chinook store.
