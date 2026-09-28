You have used `@property` many times by now. This lesson opens it up and shows the general mechanism underneath: the **descriptor protocol**. Understanding it explains, precisely, how `@property` works, how an ordinary function becomes a bound method, and lets you write your own reusable, validating attribute type.

You will learn:

- the descriptor protocol: `__get__`, `__set__`, `__delete__`, `__set_name__`
- data descriptors versus non-data descriptors
- how functions become bound methods, via the descriptor protocol
- writing a validating descriptor, reusable across many classes
- where a descriptor's state actually needs to live

## What is a descriptor?

A **descriptor** is any object that defines `__get__` (and, optionally, `__set__` and/or `__delete__`), and is stored as a **class** attribute. When you access that attribute on an instance, Python calls the descriptor's methods instead of just returning it directly.

```python
class TenTimes:
    def __get__(self, instance, owner):
        return instance.base * 10

class Thing:
    scaled = TenTimes()

    def __init__(self, base):
        self.base = base

t = Thing(4)
print(t.scaled)
```

`t.scaled` does **not** look up a plain attribute — it calls `TenTimes.__get__(instance=t, owner=Thing)`, computed fresh every time.

## The three methods

- `__get__(self, instance, owner)`: called on **read**. `instance` is the object (or `None` if accessed on the class itself), `owner` is the class.
- `__set__(self, instance, value)`: called on **write** (`obj.attr = value`).
- `__delete__(self, instance)`: called on `del obj.attr`.

A descriptor with `__set__` (or `__delete__`) is a **data descriptor**; one with only `__get__` is a **non-data descriptor**. This distinction controls priority in attribute lookup: a data descriptor on the class takes priority even over an instance's own `__dict__` entry of the same name, while a non-data descriptor can be shadowed by one.

## A validating descriptor

This is exactly how `@property` with a setter works underneath, generalised so you can **reuse** it across classes without repeating the validation code:

```python
class PositiveInt:
    def __set_name__(self, owner, name):
        self.name = "_" + name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name)

    def __set__(self, instance, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError(f"{self.name[1:]} must be a positive integer")
        setattr(instance, self.name, value)

class Product:
    quantity = PositiveInt()

    def __init__(self, quantity):
        self.quantity = quantity

p = Product(5)
print(p.quantity)
```

<!-- expect-error -->
```python
class Product:
    quantity = PositiveInt()

    def __init__(self, quantity):
        self.quantity = quantity

Product(-1)
```

## __set_name__: knowing your own name

`__set_name__(self, owner, name)` is called automatically **once**, when the class body finishes executing, telling the descriptor what attribute name it was assigned to. That is how `PositiveInt` above knows to store its data under `_quantity`, without you having to type the name twice.

## Reuse across classes

The entire point of writing a descriptor, rather than a one-off `@property`, is that the **same** validation logic now works on any class, for any number of attributes:

```python
class Order:
    quantity = PositiveInt()
    boxes = PositiveInt()

    def __init__(self, quantity, boxes):
        self.quantity = quantity
        self.boxes = boxes

o = Order(3, 2)
print(o.quantity, o.boxes)
```

Two independently validated attributes, from one small, tested class, with no repeated `if` checks anywhere.

## Where the state lives

Notice `PositiveInt` stores the actual value on the **instance** (`setattr(instance, self.name, value)`), not on itself. This matters enormously: a descriptor object is created **once**, when the class body runs, and is **shared** by every instance of the class. If it stored the value on `self` (the descriptor) instead of on the instance, every `Product` would share the same quantity — the exact mutable-class-attribute bug from the earlier "self and class attributes" lesson, now hiding inside a descriptor.

## How methods become bound methods

Functions are themselves non-data descriptors (they define `__get__`), and this is precisely how `self` gets supplied automatically when you call `obj.method()`:

```python
class Example:
    def greet(self):
        return "hi"

print(type(Example.__dict__["greet"]))
print(Example().greet)
print(Example.greet)
```

`Example().greet` is a **bound method** — the plain function's `__get__` was called with the instance, producing an object that remembers both the function and `self`, ready to be called with no further arguments. `Example.greet` (accessed on the class, so `instance` is `None`) is the plain function itself. This is the mechanism, spelled out, behind something you have used since your very first class.

## Common mistakes

- Storing a descriptor's data on `self` (the descriptor instance) instead of on the object it is attached to, sharing state across every instance by accident.
- Forgetting `__set_name__`, and hard-coding a storage attribute name that clashes between several descriptors on the same class.
- Confusing a data descriptor (has `__set__`) with a non-data one — only the former overrides an instance's own `__dict__` entry.
- Writing a descriptor for something a simple `@property` would already do perfectly well, when there is no reuse across classes to justify it.

## Recap

- A descriptor defines `__get__` (and optionally `__set__`/`__delete__`) and is stored as a class attribute.
- `__set_name__` tells a descriptor the attribute name it was assigned to.
- Store a descriptor's actual data on the instance, never on the descriptor itself.
- Functions are descriptors too — that is exactly how `obj.method` becomes a bound method.

## Your turn

In the **Practice** tab you write `PositiveInt`, a descriptor that validates a positive integer. Then three challenges use real data.
