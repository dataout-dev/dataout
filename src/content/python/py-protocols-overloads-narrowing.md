Two more tools round out practical typing: `Protocol` for "any object shaped like this, inheritance or not", and `@overload` for a function whose *return type* genuinely depends on which type of argument it received.

You will learn:

- `Protocol` for structural typing
- `@overload` for argument-dependent signatures
- `isinstance` narrowing
- `TypeGuard` for custom narrowing functions
- `assert_never` for exhaustive matches

## Protocol: structural typing

```python
from typing import Protocol

class HasArea(Protocol):
    def area(self) -> float: ...

class Circle:
    def __init__(self, r: float) -> None:
        self.r = r
    def area(self) -> float:
        return 3.14159 * self.r ** 2

class Square:
    def __init__(self, side: float) -> None:
        self.side = side
    def area(self) -> float:
        return self.side ** 2

def total_area(shapes: list[HasArea]) -> float:
    return sum(s.area() for s in shapes)

print(total_area([Circle(2), Square(3)]))
```

Neither `Circle` nor `Square` inherits from `HasArea` — a `Protocol` matches by *shape* (does it have an `area()` method with this signature?), not by declared ancestry. This is "duck typing", made checkable.

## @overload: one name, several precise signatures

```python
from typing import overload

@overload
def parse(value: str) -> int: ...
@overload
def parse(value: list) -> list[int]: ...

def parse(value):
    if isinstance(value, str):
        return int(value)
    return [int(v) for v in value]

print(parse("42"))
print(parse(["1", "2", "3"]))
```

The `@overload`-decorated stubs carry no implementation — they exist purely so a type checker knows `parse("42")` returns `int`, while `parse(["1"])` returns `list[int]`, even though there is exactly one real function body underneath handling both.

## isinstance narrowing

```python
def describe(x: int | str) -> str:
    if isinstance(x, int):
        return f"number: {x + 1}"
    return f"text: {x.upper()}"

print(describe(5))
print(describe("hi"))
```

Inside the `if isinstance(x, int)` branch, a type checker treats `x` as definitely `int` — `x + 1` is safe there. In the `else` branch, it knows `x` must be the remaining possibility, `str`, so `x.upper()` is safe too. This is "narrowing": the checked type gets more specific as you rule branches out.

## TypeGuard: custom narrowing

```python
from typing import TypeGuard

def is_str_list(vals: list) -> TypeGuard[list[str]]:
    return all(isinstance(v, str) for v in vals)

def shout_all(vals: list) -> list:
    if is_str_list(vals):
        return [v.upper() for v in vals]
    return vals

print(shout_all(["a", "b"]))
print(shout_all([1, 2]))
```

A plain `bool`-returning function tells a type checker nothing about *what* was checked. `TypeGuard[list[str]]` tells it: "if this returns `True`, treat the argument as `list[str]` from here on" — turning your own runtime check into narrowing information the checker can use too.

## assert_never: exhaustiveness checking

```python
from typing import Literal

Direction = Literal["up", "down"]

def move(d: Direction) -> str:
    if d == "up":
        return "moving up"
    elif d == "down":
        return "moving down"
    else:
        raise ValueError(f"unexpected direction: {d}")

print(move("up"))
```

`typing.assert_never` (used in the `else` branch in place of the plain `raise`) tells a type checker "no value of `Direction` should ever reach here" — if someone later adds `"left"` to the `Literal` without updating `move`, the checker flags the now-incomplete `if`/`elif` chain immediately, rather than waiting for a runtime `ValueError` in production.

## Watch out: casts that lie

```python
from typing import cast

def get_config_value(key: str) -> object:
    return {"timeout": 30}.get(key)

# cast() does NOT check anything at runtime - it just tells the type checker to trust you
timeout = cast(int, get_config_value("timeout"))
missing = cast(int, get_config_value("does_not_exist"))  # actually None at runtime!
```

`cast` is a promise to the type checker with zero runtime enforcement. If the promise is wrong (as with `missing` above, which is really `None`), nothing catches it until something downstream crashes in a way that has nothing to do with the `cast` line itself.

## Common mistakes

- Reaching for inheritance to satisfy a type checker when a `Protocol` would let unrelated classes already shaped correctly just work.
- Writing `@overload` stubs that do not agree with what the real implementation actually does.
- Trusting `cast()` to *validate* a value, when it only silences the type checker.
- Forgetting to add a new case to an `if`/`elif` chain after extending a `Literal`, with no `assert_never` in place to catch the gap.
