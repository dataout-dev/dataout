A first look at `match` covers matching literals and simple types. Its real power shows up with class patterns, nested structures, and guards — often replacing a tangle of `isinstance` and index-checking with something that reads like the shape it is matching.

You will learn:

- class patterns and __match_args__
- mapping and sequence patterns
- nested patterns
- guards
- matching dataclasses and enums
- refactoring an if-chain into match

## Class patterns and __match_args__

```python
class Point:
    __match_args__ = ("x", "y")
    def __init__(self, x, y):
        self.x = x
        self.y = y

def describe(p):
    match p:
        case Point(x=0, y=0):
            return "origin"
        case Point(x=0, y=y):
            return f"on the y-axis at {y}"
        case Point(x=x, y=0):
            return f"on the x-axis at {x}"
        case Point(x=x, y=y):
            return f"at ({x}, {y})"

print(describe(Point(0, 0)))
print(describe(Point(3, 4)))
```

`__match_args__` lets `case Point(x, y)` (positional, without naming the fields) work at all — it tells `match` which attributes correspond to which positional slots, the same idea `__init__`'s parameter order conveys for construction.

## Mapping and sequence patterns

```python
def handle(event):
    match event:
        case {"type": "click", "x": x, "y": y}:
            return f"clicked at ({x}, {y})"
        case {"type": "key", "key": k}:
            return f"key pressed: {k}"
        case [first, *rest]:
            return f"a list starting with {first}, {len(rest)} more"
        case _:
            return "unknown"

print(handle({"type": "click", "x": 10, "y": 20}))
print(handle([1, 2, 3]))
```

A mapping pattern (`{"type": "click", ...}`) matches a dict containing *at least* those keys (extra keys are ignored, unlike a sequence pattern which by default requires an exact length). A sequence pattern with `*rest` captures "everything else" the way star-unpacking does in an ordinary assignment.

## Nested patterns

```python
def summarise(order):
    match order:
        case {"customer": {"name": name}, "items": [first_item, *_]}:
            return f"{name}'s order starts with {first_item}"
        case _:
            return "unrecognised order shape"

print(summarise({"customer": {"name": "Ann"}, "items": ["Widget", "Gadget"]}))
```

Patterns nest freely — a mapping pattern's value can itself be another mapping or sequence pattern, letting one `case` destructure a fairly deep, specific shape in a single readable line instead of several chained `["key"]` lookups.

## Guards

```python
def classify(n):
    match n:
        case int() if n < 0:
            return "negative"
        case int() if n == 0:
            return "zero"
        case int():
            return "positive"
        case _:
            return "not a number"

print(classify(-5), classify(0), classify(5))
```

An `if` clause after a pattern (a **guard**) adds a condition beyond what the pattern's shape alone can express — matching *and* being negative, for instance — evaluated only if the pattern itself already matched.

## Matching dataclasses and enums

```python
from dataclasses import dataclass
from enum import Enum, auto

class Status(Enum):
    PENDING = auto()
    DONE = auto()

@dataclass
class Task:
    name: str
    status: Status

def report(task):
    match task:
        case Task(status=Status.DONE):
            return f"{task.name}: finished"
        case Task(status=Status.PENDING):
            return f"{task.name}: still pending"

print(report(Task("Ship it", Status.DONE)))
```

`@dataclass` automatically generates `__match_args__` from its fields, so class patterns work on a dataclass with no extra setup — one more small reason dataclasses pair naturally with `match`.

## Refactoring an if-chain

```python
def old_style(x):
    if isinstance(x, dict) and "type" in x and x["type"] == "click":
        return f"clicked at ({x['x']}, {x['y']})"
    elif isinstance(x, list) and len(x) > 0:
        return f"a list starting with {x[0]}"
    else:
        return "unknown"

def new_style(x):
    match x:
        case {"type": "click", "x": px, "y": py}:
            return f"clicked at ({px}, {py})"
        case [first, *_]:
            return f"a list starting with {first}"
        case _:
            return "unknown"

event = {"type": "click", "x": 1, "y": 2}
print(old_style(event) == new_style(event))
```

The `match` version reads closer to "here is the shape I expect" than the `isinstance`/indexing chain does — both are correct, but the pattern-matching version tends to stay readable as more shapes are added, where the if-chain tends to get harder to follow.

## Watch out: order of case blocks

```python
def classify_order_matters(n):
    match n:
        case int():
            return "any int"
        case 0:
            return "exactly zero"   # UNREACHABLE - int() above already matched

print(classify_order_matters(0))
```

`case` blocks are checked in order, top to bottom, and the first match wins — a broad pattern (`int()`) placed before a narrower, more specific one (`0`) silently makes the specific case unreachable, with no error raised at all.

## Common mistakes

- Ordering a broad pattern before a narrower one, silently making the narrower `case` unreachable.
- Forgetting `__match_args__` on a plain (non-dataclass) class, then being confused why positional class patterns do not work.
- Writing a guard condition so broad it defeats the purpose of pattern matching on shape in the first place.
- Using a sequence pattern (`[a, b]`) when a mapping pattern would actually match the real data shape better (or vice versa).
