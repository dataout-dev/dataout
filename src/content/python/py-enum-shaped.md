Programs are full of values that come from a **fixed list of choices**: an order status, a day of the week, a log level, a permission. Using plain text or numbers for them invites typos and confusion. This lesson introduces `Enum` and other ways to give data a clear **shape**: `NamedTuple`, `TypedDict`, and a first look at data classes.

You will learn:

- `Enum`, its members, values and names
- `IntEnum`, `Flag` and `auto`
- iterating and looking up members
- comparing members correctly
- `NamedTuple` and `TypedDict`
- when to choose a `dataclass`
- enums in `match` statements

## The problem with strings

```python
def next_step(status):
    if status == "pending":
        return "pay"
    if status == "paid":
        return "ship"
    return "nothing"

print(next_step("pending"), next_step("pendng"))
```

A typo (`"pendng"`) does not raise an error. It silently gives the wrong answer. An `Enum` makes the set of valid values explicit.

## Enum

```python
from enum import Enum

class Status(Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"

print(Status.PAID)
print(Status.PAID.name, Status.PAID.value)
print(type(Status.PAID).__name__)
print(Status("shipped"))
print(Status["PENDING"])
```

Each **member** has a `name` and a `value`. Look one up by value with `Status("paid")`, and by name with `Status["PAID"]`. An unknown one raises a `ValueError` (or `KeyError`), so a typo cannot go unnoticed:

<!-- expect-error -->
```python
Status("pendng")
```

## Iterating

An enum class is iterable, and knows its size:

```python
print(list(Status))
print([s.value for s in Status])
print(len(Status))
print(Status.PAID in Status)
```

Members are created once, so you compare them with `is` or `==`:

```python
current = Status.PAID
print(current is Status.PAID, current == Status.PAID)
```

## Do not compare with strings

A member is **not** equal to its value:

```python
print(Status.PAID == "paid")
print(Status.PAID.value == "paid")
```

The first is `False`. This is the most common enum mistake. Compare a member with a member, or compare its `.value`.

## auto and IntEnum

`auto()` numbers the members for you, and `IntEnum` members behave like integers, so they can be compared and sorted:

```python
from enum import IntEnum, auto

class Level(IntEnum):
    LOW = auto()
    MEDIUM = auto()
    HIGH = auto()

print(Level.HIGH, int(Level.HIGH))
print(Level.LOW < Level.HIGH)
print(sorted([Level.HIGH, Level.LOW, Level.MEDIUM]))
print(Level.MEDIUM == 2)
```

Only use `IntEnum` when the number really matters (for example, a code from a protocol). A plain `Enum` is safer, because it prevents accidental arithmetic.

## Flag

A `Flag` combines members with `|`, like permissions:

```python
from enum import Flag

class Permission(Flag):
    READ = auto()
    WRITE = auto()
    RUN = auto()

mine = Permission.READ | Permission.WRITE
print(mine)
print(Permission.WRITE in mine, Permission.RUN in mine)
print(mine & Permission.READ)
```

## Methods and behaviour

An enum is a class, so members can have methods, and the class can define **what is allowed next**:

```python
class Light(Enum):
    RED = "red"
    GREEN = "green"
    YELLOW = "yellow"

    def next(self):
        order = [Light.RED, Light.GREEN, Light.YELLOW]
        return order[(order.index(self) + 1) % len(order)]

print(Light.RED.next().name, Light.YELLOW.next().name)

TRANSITIONS = {
    Status.PENDING: [Status.PAID],
    Status.PAID: [Status.SHIPPED],
    Status.SHIPPED: [],
}
print([s.name for s in TRANSITIONS[Status.PENDING]])
```

Enum members work as dictionary keys, and a table like `TRANSITIONS` is a neat way to describe a **state machine**.

## Enums and match

The `match` statement matches members with a dotted name:

```python
def describe(status):
    match status:
        case Status.PENDING:
            return "waiting for payment"
        case Status.PAID:
            return "ready to ship"
        case _:
            return "on its way"

print(describe(Status.PENDING), describe(Status.SHIPPED))
```

## NamedTuple

`typing.NamedTuple` is a `namedtuple` with type hints and a class syntax. It is immutable, light, and unpacks like a tuple:

```python
from typing import NamedTuple

class Point(NamedTuple):
    x: float
    y: float = 0.0

    def length(self) -> float:
        return (self.x ** 2 + self.y ** 2) ** 0.5

p = Point(3, 4)
print(p, p.length(), p._replace(x=6))
x, y = p
print(x + y)
```

## TypedDict

`TypedDict` describes the **keys and value types** of a dictionary. At runtime it is a plain dictionary. The description is for editors and type checkers, which is useful for data that comes from JSON:

```python
from typing import TypedDict

class Track(TypedDict):
    name: str
    milliseconds: int

track: Track = {"name": "Intro", "milliseconds": 61000}
print(track["name"], type(track).__name__)
print(Track.__annotations__)
```

## Which one should I choose?

| Need | Choose |
| ---- | ------ |
| A fixed set of named choices | `Enum` |
| A small immutable record, tuple-like | `NamedTuple` |
| A dictionary with known keys (JSON) | `TypedDict` |
| A record with methods, defaults and changeable fields | `@dataclass` |
| Behaviour and state together | a normal `class` |

A **dataclass** writes the boring methods for you (`__init__`, `__repr__`, `__eq__`) from field annotations. You meet it in the next tier.

## Common mistakes

- Comparing an enum member with its value: `Status.PAID == "paid"` is `False`.
- Using `IntEnum` when a plain `Enum` would prevent mistakes.
- Storing the enum member in JSON. Store its `value`, and convert back with `Status(value)`.
- Adding members to an enum after it is defined.

## Recap

- `Enum` gives a fixed set of named choices, with `name` and `value`. Look up by value with `Status("paid")`.
- Compare members with members. Use `IntEnum` and `Flag` for numbers and combinations.
- `NamedTuple` and `TypedDict` describe the shape of records and dictionaries, and `dataclass` is the flexible option.

## Your turn

In the **Practice** tab you write an `Enum` of order statuses and `next_states(status)`. Then three challenges use the Chinook store.
