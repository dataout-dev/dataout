Every ordinary instance you have created in this tier secretly carries its own dictionary, `__dict__`, holding its attributes. That flexibility is convenient, but it is not free. This lesson looks at what `__dict__` actually costs, and `__slots__`, the tool that trades away some flexibility for real memory savings.

You will learn:

- that every ordinary instance has its own `__dict__`
- `__slots__`, and what it removes
- measuring the difference with `sys.getsizeof`
- `__slots__` and inheritance
- weak references and `__slots__`
- when the trade-off is (and is not) worth it

## Every instance has a __dict__

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(1, 2)
print(p.__dict__)
p.z = 99
print(p.__dict__)
```

That `p.__dict__` is a real, ordinary Python dictionary, created for **every single instance**. It is what lets you add `p.z = 99` on the fly, and it is what `vars(p)` shows you. For one object, this is a trivial cost. For **millions** of small objects — which is exactly the kind of program later Python tiers build — the memory adds up.

## __slots__: declaring a fixed set of attributes

```python
class SlottedPoint:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y

p = SlottedPoint(1, 2)
print(p.x, p.y)
```

<!-- expect-error -->
```python
class SlottedPoint:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y

p = SlottedPoint(1, 2)
p.z = 99
```

With `__slots__`, there is **no `__dict__` at all** (unless you explicitly add `"__dict__"` to the slots, defeating the purpose). Python instead reserves a small, fixed amount of storage for exactly the named attributes — nothing more can be added.

## Measuring the difference

```python
import sys

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class SlottedPoint:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y

regular = Point(1, 2)
slotted = SlottedPoint(1, 2)
print(sys.getsizeof(regular.__dict__))
print(sys.getsizeof(regular) + sys.getsizeof(regular.__dict__))
print(sys.getsizeof(slotted))
```

The slotted version has no separate dictionary object to account for at all, and the saving compounds across every instance you create — for a program with a few objects this is irrelevant, but for large data structures it is a real, measurable difference (and the third-party `numpy`/`pandas` libraries you will meet in a later tier take this idea much further still).

## __slots__ and inheritance

`__slots__` only reserves storage for the names listed **in that class**. A subclass that does not declare its own `__slots__` gets a `__dict__` back anyway, silently cancelling much of the benefit:

```python
class Base:
    __slots__ = ("x",)

class Child(Base):
    def __init__(self, x, y):
        self.x = x
        self.y = y

c = Child(1, 2)
print(c.__dict__)
```

To keep the saving through an inheritance chain, **every** class in the chain needs its own `__slots__`, listing only the **new** names it introduces (not the parent's, which would be redundant and can even raise an error in some cases):

```python
class Base:
    __slots__ = ("x",)

class Child(Base):
    __slots__ = ("y",)

    def __init__(self, x, y):
        self.x = x
        self.y = y

c = Child(1, 2)
print(c.x, c.y)
print(hasattr(c, "__dict__"))
```

## Weak references

Instances with `__slots__` cannot be weakly referenced unless you explicitly add `"__weakref__"` to the slots — another small trade-off of the memory savings:

```python
import weakref

class NoWeak:
    __slots__ = ("value",)

class Weakable:
    __slots__ = ("value", "__weakref__")

w = Weakable()
w.value = 1
ref = weakref.ref(w)
print(ref().value)
```

<!-- expect-error -->
```python
import weakref

class NoWeak:
    __slots__ = ("value",)

n = NoWeak()
weakref.ref(n)
```

## When to bother

`__slots__` is worth reaching for when:

- you will create **very many** instances of a simple, fixed-shape class, and memory matters, or
- you want to **enforce** that no stray attributes are added by accident (a form of defensive programming).

It is usually **not** worth it for ordinary application code with a handful of long-lived objects — the flexibility of `__dict__` (adding attributes freely, easy debugging, compatibility with tools that inspect `__dict__`) outweighs the small memory cost. Dataclasses, in the next lesson, offer an easy `slots=True` option once you decide it is worth it.

## Common mistakes

- Adding `__dict__` back to the slots "just in case", which removes the memory benefit entirely.
- Forgetting that a subclass needs its own `__slots__` too, or it silently gets a `__dict__`.
- Expecting `__slots__` instances to support weak references without adding `"__weakref__"`.
- Reaching for `__slots__` prematurely, before memory has actually been shown to matter.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
