**Polymorphism** means one piece of code working correctly with objects of many different types. Python leans heavily on a particular style of polymorphism: **duck typing** — "if it walks like a duck and quacks like a duck, treat it as a duck." What matters is not what an object **is**, but what it **can do**.

You will learn:

- same interface, different behaviour: the essence of polymorphism
- duck typing, and how it relates to EAFP from Foundations
- the "file-like object" idea, as a real-world example
- `len()`, `iter()` and friends as already-polymorphic built-ins
- when an `isinstance` check helps, and when it defeats the point

## Same interface, different behaviour

You already used this in the shapes lesson: `total_area(shapes)` calls `.area()` on each item, and does not care which class it belongs to, as long as `.area()` exists and behaves sensibly. That **is** polymorphism — many shapes, one calling convention.

## Duck typing

Python rarely checks an object's type before using it. It simply tries the operation, and lets it fail naturally if the object cannot do it:

```python
class Duck:
    def quack(self):
        return "Quack!"

class Person:
    def quack(self):
        return "I'm quacking, I promise"

def make_it_quack(thing):
    return thing.quack()

print(make_it_quack(Duck()))
print(make_it_quack(Person()))
```

Neither `Duck` nor `Person` needs to share a common base class. `make_it_quack` only cares that `.quack()` exists. This is the same **EAFP** spirit from the exceptions lessons in Core Python — "Easier to Ask Forgiveness than Permission" — applied to types instead of dictionary keys: try the operation, and handle the failure if it is not supported, rather than checking in advance.

```python
def safe_quack(thing):
    try:
        return thing.quack()
    except AttributeError:
        return "(silence)"

print(safe_quack(Duck()))
print(safe_quack(object()))
```

## The file-like object idea

You already met this pattern without naming it: many functions in the standard library accept **anything with the right methods**, not specifically a file. `io.StringIO`, an open file, and a network socket wrapped for text can all be used wherever a "file" is expected, because they all support `.read()`, `.write()`, and the rest of the same interface:

```python
def consume(obj):
    return obj.read()

import io

print(consume(io.StringIO("hello")))

class FixedReader:
    def read(self):
        return "always this text"

print(consume(FixedReader()))
```

`consume` never checks `isinstance(obj, io.IOBase)`. It just calls `.read()`, so **anything** that defines a compatible `read()` method works, including a class you invent yourself, with no shared ancestor at all.

## Built-ins are already polymorphic

`len()`, `iter()`, `str()`, and the `for` loop all work through special methods (`__len__`, `__iter__`, `__str__`, and so on), which is exactly why they work identically on lists, strings, dictionaries, and — once you implement the data model in the next section — your own classes too:

```python
print(len([1, 2, 3]), len("abc"), len({"a": 1}))

class Basket:
    def __init__(self, items):
        self.items = items

    def __len__(self):
        return len(self.items)

print(len(Basket([1, 2, 3, 4])))
```

`len(Basket(...))` works because `len()` is itself written polymorphically: it calls whatever `__len__` the object provides, without knowing anything about `Basket` in advance.

## When isinstance still helps

Duck typing does not mean "never check types". `isinstance` is the right tool when:

- you must branch on **which kind** of thing you have, and different kinds need genuinely different logic (as in the `describe` function from the previous lesson), or
- you are validating input at a boundary, and want a clear, early error instead of a confusing one three calls later.

```python
def area_or_none(shape):
    if not hasattr(shape, "area"):
        return None
    return shape.area()

print(area_or_none(Duck()))
```

`hasattr` is itself a duck-typing-friendly check: "does this have the capability I need", not "is this a particular class".

## When isinstance defeats the point

An `isinstance` check that lists every type you can think of, updated every time someone adds a new one, throws away exactly the flexibility polymorphism was meant to give you:

```python
def bad_total_area(shapes):
    total = 0
    for s in shapes:
        if isinstance(s, Rectangle) if False else True:
            pass
    return total
```

The earlier `total_area(shapes)` from the substitution lesson, which simply calls `.area()` on each item, is the better version precisely because it never needs updating when a new shape type appears.

## Common mistakes

- Writing a long `isinstance` chain where duck typing (just calling the method) would do.
- Forgetting to handle the `AttributeError` when using EAFP with duck typing on truly untrusted input.
- Confusing "any object with the right methods" with "any object of the right base class" — duck typing needs neither a shared base class nor a `Protocol` (a later lesson makes this precise and checkable).

## Recap

- Polymorphism means code that works across many types through a shared interface.
- Duck typing asks "can it do this?", not "is it officially this type?" — matching the EAFP style from exceptions.
- Built-ins like `len()` and `for` are already polymorphic through special methods.
- Use `isinstance` for genuine branching or boundary validation; avoid it as a substitute for a shared interface.

## Your turn

In the **Practice** tab you write `consume(obj)`, which works with any object that has a `read()` method. Then three challenges use real data.
