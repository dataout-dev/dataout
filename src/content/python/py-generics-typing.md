The type hints you met in Core Python (`list[int]`, `dict[str, int]`) describe containers of a **fixed** element type. What about a `Stack` that should work for **any** type, while still telling a type checker "whatever type you put in is the type you get out"? This lesson introduces **generics**: classes and functions parameterised by a type.

You will learn:

- `TypeVar` and `Generic`, the classic way to write a generic class
- the newer, shorter syntax (Python 3.12+)
- bounded and constrained type variables
- generic containers, such as a typed `Stack`
- covariance and contravariance, explained in plain language
- the key fact: none of this exists at runtime

## The problem

```python
class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return self.items.pop()

s = Stack()
s.push(1)
s.push("oops")
```

Nothing stops you from mixing types in this `Stack`, and nothing tells a type checker (or a reader) what `pop()` returns. A **generic** class fixes both.

## TypeVar and Generic: the classic way

```python
from typing import TypeVar, Generic

T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self):
        self.items: list[T] = []

    def push(self, item: T) -> None:
        self.items.append(item)

    def pop(self) -> T:
        return self.items.pop()

    def peek(self) -> T:
        return self.items[-1]

numbers: Stack[int] = Stack()
numbers.push(1)
numbers.push(2)
print(numbers.pop())
```

`Stack[int]` tells a type checker: "every `T` in this particular stack is an `int`". `push` must receive an `int`, and `pop`/`peek` are known to return one. At runtime, none of this is enforced — `numbers.push("oops")` would run without error — but your editor and `mypy` would flag it immediately.

## The newer syntax (Python 3.12+)

Recent Python lets you write the same thing more concisely, without importing `TypeVar` at all:

```python
class Stack[T]:
    def __init__(self):
        self.items: list[T] = []

    def push(self, item: T) -> None:
        self.items.append(item)

    def pop(self) -> T:
        return self.items.pop()

numbers = Stack[int]()
numbers.push(5)
print(numbers.pop())
```

`class Stack[T]:` declares the type parameter directly in the class header. Functions can be generic the same way: `def first[T](items: list[T]) -> T: ...`. Both styles mean the same thing; you will meet the older `TypeVar` form often in existing code, so it is worth recognising both.

## Bounded and constrained type variables

A **bound** restricts `T` to a type (or its subtypes):

```python
from typing import TypeVar

Numeric = TypeVar("Numeric", bound=float)

def double(x: Numeric) -> Numeric:
    return x * 2

print(double(3), double(2.5))
```

`bound=float` says "`T` must be `float` or something compatible with it" (which, thanks to Python's numeric tower, includes `int`). A **constrained** type variable instead lists the exact allowed types:

```python
from typing import TypeVar

StrOrBytes = TypeVar("StrOrBytes", str, bytes)

def first_char(x: StrOrBytes) -> StrOrBytes:
    return x[0:1]

print(first_char("hello"), first_char(b"hello"))
```

## A generic Pair

```python
from typing import TypeVar, Generic

A = TypeVar("A")
B = TypeVar("B")

class Pair(Generic[A, B]):
    def __init__(self, first: A, second: B):
        self.first = first
        self.second = second

    def swapped(self) -> "Pair[B, A]":
        return Pair(self.second, self.first)

p = Pair(1, "one")
print(p.swapped().first, p.swapped().second)
```

A generic class can take **more than one** type parameter, exactly like `dict[K, V]` takes two.

## Covariance and contravariance, in plain language

These words describe how generic types relate to each other when the underlying types do:

- **Covariant**: if `Cat` is a subtype of `Animal`, then `Sequence[Cat]` is treated as a subtype of `Sequence[Animal]` — a **read-only** list of cats can safely be used where a read-only list of animals is expected, because you can only ever *take things out*.
- **Contravariant**: the relationship runs the **other way** — useful for things that only ever *consume* a value, such as a function parameter type, where being willing to accept a wider variety of input is safe.
- **Invariant** (the default for a mutable container like `list`): `list[Cat]` is **not** treated as a `list[Animal]`, because you could `append` a `Dog` into what someone else thinks is a `list[Cat]`.

```python
def total_area_of_animals(animals: list) -> None:
    animals.append("not an animal at all")

cats: list = ["Tom", "Felix"]
total_area_of_animals(cats)
print(cats)
```

This is exactly *why* `list` is invariant, and immutable containers like `Sequence` and `tuple` can safely be covariant: nothing can be appended into them by a function that only reads.

## None of this exists at runtime

As with all type hints, generics are erased at runtime. `Stack[int]` and `Stack[str]` are, to the running program, the **same** class:

```python
print(Stack[int] is Stack)
```

Tools like `mypy` use the annotations to catch mistakes before you run the program; Python itself never checks them.

## Common mistakes

- Expecting `Stack[int]()` to reject a string at runtime — it will not; only a type checker catches that.
- Using an unconstrained, unbounded `TypeVar` when you actually need to call a specific method on the value (add a `bound=`).
- Assuming `list[Cat]` can always be passed where `list[Animal]` is expected — it cannot, precisely because `list` is mutable and invariant.

## Your turn

In the **Practice** tab you write a generic `Stack[T]` with `push`/`pop`/`peek` and precise hints. Then three challenges use real data.
