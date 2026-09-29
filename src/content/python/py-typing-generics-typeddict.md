Basic type hints (`x: int`, `def f() -> str`) cover simple cases. Real code often needs to describe *shapes* that depend on other types, or dictionaries with a fixed, known set of keys — that is what generics, `TypedDict`, `Literal` and `Callable` are for.

You will learn:

- generic functions and containers
- `TypedDict` and `Required`
- `Literal` and `Final`
- `Callable` and a first look at `ParamSpec`
- type aliases
- when annotating gets excessive

## Generic functions

```python
from typing import TypeVar

T = TypeVar("T")

def first(items: list[T]) -> T:
    return items[0]

print(first([1, 2, 3]))
print(first(["a", "b"]))
```

`first` works on a list of anything, and a type checker can still track *what* that "anything" was: call it with `list[int]` and it knows the return type is `int`, without `first` needing a separate version per type.

## Generic containers

```python
from typing import Generic, TypeVar

T = TypeVar("T")

class Box(Generic[T]):
    def __init__(self, item: T) -> None:
        self.item = item
    def get(self) -> T:
        return self.item

b = Box(42)
print(b.get())
```

`Box[int]` and `Box[str]` are different shapes to a type checker, even though there is only one `Box` class — the type parameter travels with the container.

## TypedDict

A plain `dict[str, Any]` says nothing about *which* keys exist. `TypedDict` fixes that:

```python
from typing import TypedDict

class Track(TypedDict):
    name: str
    milliseconds: int
    unit_price: float

def describe(t: Track) -> str:
    return f"{t['name']} ({t['milliseconds']}ms, ${t['unit_price']})"

track: Track = {"name": "Test", "milliseconds": 1000, "unit_price": 0.99}
print(describe(track))
```

A type checker now flags `track["nam"]` (typo) or a missing required key as an error, while the value at runtime is still a completely ordinary `dict`.

## Literal and Final

```python
from typing import Literal, Final

Mode = Literal["read", "write", "append"]

def open_file(path: str, mode: Mode) -> None:
    print(f"opening {path} in {mode} mode")

open_file("data.txt", "read")

MAX_RETRIES: Final = 3
print(MAX_RETRIES)
```

`Literal["read", "write", "append"]` restricts the *values* a string can take, not just its type — passing `"delete"` would be a type error, caught before the code ever runs. `Final` marks a name as never meant to be reassigned.

## Callable and type aliases

```python
from typing import Callable

Handler = Callable[[int, int], int]

def apply(fn: Handler, a: int, b: int) -> int:
    return fn(a, b)

print(apply(lambda a, b: a + b, 2, 3))
```

`Callable[[int, int], int]` says "a function taking two ints, returning an int". Giving that a name (`Handler`) via a type alias makes a signature like `def register(handler: Handler)` read far better than repeating the full `Callable[...]` everywhere it is used. `ParamSpec` extends this to preserve an entire parameter list through a decorator — useful, but reached for far less often than a plain `Callable`.

## Watch out: over-annotating obvious code

```python
def add(a: int, b: int) -> int:
    return a + b

# excessive: the type is already obvious from a literal constant
count: int = 5
```

Annotating a genuinely ambiguous signature (what does this function accept? what can I pass as a callback?) is valuable. Annotating `count: int = 5`, where the type is obvious on sight, mostly adds noise. Hints earn their keep at boundaries and non-obvious shapes, not on every single line.

## Common mistakes

- Reaching for `Any` everywhere a type is mildly inconvenient to express, silently disabling the checker for that value.
- Using a plain `dict` where a `TypedDict` would catch a typo'd key at type-check time.
- Forgetting that `Literal` is about specific *values*, not just narrowing a type to `str`.
- Writing out a long `Callable[[...], ...]` repeatedly instead of naming it once as a type alias.
