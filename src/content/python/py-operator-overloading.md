Every time you write `3 + 4`, Python calls `(3).__add__(4)` behind the scenes. Your own classes can hook into the same machinery, so that `+`, `-`, `*`, unary `-`, and `abs()` all work naturally on your objects. This is **operator overloading**: giving familiar operators a sensible new meaning for a new type.

You will learn:

- `__add__`, `__sub__`, `__mul__`, and friends
- unary operators: `__neg__`, `__abs__`
- reflected methods, for when your object is on the **right**
- in-place operators, briefly
- `NotImplemented` for combinations you cannot handle
- `__bool__` and `__len__` for truthiness

## A Vector2D

```python
class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector2D({self.x}, {self.y})"

    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)

    def __add__(self, other):
        return Vector2D(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector2D(self.x - other.x, self.y - other.y)

a = Vector2D(1, 2)
b = Vector2D(3, 4)
print(a + b)
print(a - b)
```

`a + b` calls `a.__add__(b)`. Nothing about `+` is special-cased for vectors anywhere in Python; the language simply looks for `__add__` on the left operand, exactly as it would for two numbers.

## Multiplying by a scalar

```python
class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __mul__(self, scalar):
        return Vector2D(self.x * scalar, self.y * scalar)

v = Vector2D(2, 3)
print((v * 5).x, (v * 5).y)
```

## Unary operators

`__neg__` and `__abs__` handle `-x` and `abs(x)`:

```python
import math

class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector2D({self.x}, {self.y})"

    def __neg__(self):
        return Vector2D(-self.x, -self.y)

    def __abs__(self):
        return math.hypot(self.x, self.y)

v = Vector2D(3, 4)
print(-v)
print(abs(v))
```

## Reflected methods: when your object is on the right

`a + b` calls `a.__add__(b)`. But what about `5 * v`, where the **left** operand (`5`, a plain `int`) has no idea what a `Vector2D` is? Python tries `(5).__mul__(v)` first, which returns `NotImplemented` because `int` does not know about vectors — and then falls back to `v.__rmul__(5)`, the **reflected** version, with the operands swapped:

```python
class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector2D({self.x}, {self.y})"

    def __mul__(self, scalar):
        return Vector2D(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar):
        return self.__mul__(scalar)

v = Vector2D(1, 2)
print(v * 3)
print(3 * v)
```

Every arithmetic method has a reflected counterpart: `__radd__`, `__rsub__`, `__rmul__`, and so on. Implement them whenever your object should sensibly appear on **either** side of the operator.

## NotImplemented for combinations you cannot handle

When your method genuinely does not know how to combine with the other operand's type, return `NotImplemented` (not raise, and not return `False` for a comparison) — this lets Python try the other side, or produce a proper `TypeError` if nobody can help:

```python
class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        if not isinstance(other, Vector2D):
            return NotImplemented
        return Vector2D(self.x + other.x, self.y + other.y)
```

<!-- expect-error -->
```python
class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        if not isinstance(other, Vector2D):
            return NotImplemented
        return Vector2D(self.x + other.x, self.y + other.y)

Vector2D(1, 2) + "not a vector"
```

Python turns an unhandled `NotImplemented` into a clear `TypeError` for you, rather than a confusing crash deep inside your method.

## In-place operators

`+=` can be sped up (avoiding a full new copy) with `__iadd__`, which should modify `self` and return it. If you do not define it, Python falls back to `__add__` plus a plain reassignment, which is correct but makes a new object every time:

```python
class Counter:
    def __init__(self, value=0):
        self.value = value

    def __iadd__(self, amount):
        self.value += amount
        return self

c = Counter(5)
c += 3
print(c.value)
```

## __bool__ and __len__: truthiness

`if obj:` calls `__bool__` if it exists, or falls back to `__len__` (an object is falsy if its length is `0`), or otherwise is always truthy:

```python
class Playlist:
    def __init__(self, tracks):
        self.tracks = tracks

    def __len__(self):
        return len(self.tracks)

empty = Playlist([])
full = Playlist(["a", "b"])
print(bool(empty), bool(full))
if not empty:
    print("nothing to play")
```

No `__bool__` was defined here at all — `__len__` alone was enough for `bool()` and `if` to do the sensible thing.

## Common mistakes

- Forgetting the reflected method, so your object only works as the **left** operand.
- Returning `False` from `__eq__`, or raising, for an unrecognised type, instead of `NotImplemented`.
- Implementing `__add__` to *mutate* `self` instead of returning a new object (surprising, since `+` should not change either operand).
- Defining `__len__` but expecting `bool()` to ignore it — it will not, unless `__bool__` is also defined.

## Recap

- `__add__`, `__sub__`, `__mul__`, `__neg__`, `__abs__` and friends let your objects use ordinary operators.
- Reflected methods (`__radd__`, and so on) handle your object appearing on the right.
- Return `NotImplemented` for a combination you cannot handle, and let Python (or the other operand) sort it out.
- `__bool__`, or `__len__` as a fallback, controls truthiness.

## Your turn

In the **Practice** tab you implement a `Vector2D` with `+`, `-`, scalar `*`, `abs()` and `==`. Then three challenges use real data.
