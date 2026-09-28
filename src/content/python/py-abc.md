Duck typing trusts that an object supports the right methods, and finds out at the exact moment it does not. Sometimes you want something firmer: a class that **cannot even be created** unless it properly implements a required interface. The `abc` module (**a**bstract **b**ase **c**lasses) gives you exactly that.

You will learn:

- `ABC` and `@abstractmethod`
- what happens when you try to instantiate an incomplete subclass
- abstract properties
- registering "virtual" subclasses
- `collections.abc` as a ready-made toolbox of interfaces

## Defining an abstract base class

```python
from abc import ABC, abstractmethod

class Exporter(ABC):
    @abstractmethod
    def export(self, rows):
        "Return the rows as text, in some format."
```

`Exporter` inherits from `ABC`, and marks `export` as `@abstractmethod`: a promise with no implementation. This is a stronger version of the `raise NotImplementedError` pattern from the shapes lesson — Python now **enforces** the promise.

## You cannot instantiate an incomplete class

<!-- expect-error -->
```python
from abc import ABC, abstractmethod

class Exporter(ABC):
    @abstractmethod
    def export(self, rows):
        ...

Exporter()
```

The `TypeError` fires the moment you try to create an instance, long before any code calls `export` and discovers it is missing — catching the mistake at the earliest possible point, instead of deep inside a program.

## Concrete subclasses

A subclass that implements **every** abstract method can be instantiated normally:

```python
from abc import ABC, abstractmethod

class Exporter(ABC):
    @abstractmethod
    def export(self, rows):
        ...

class CsvExporter(Exporter):
    def export(self, rows):
        lines = [",".join(row) for row in rows]
        return "\n".join(lines)

class JsonExporter(Exporter):
    def export(self, rows):
        import json
        return json.dumps(rows)

data = [["a", "1"], ["b", "2"]]
for exporter in (CsvExporter(), JsonExporter()):
    print(exporter.export(data))
```

Both exporters can be used **interchangeably** anywhere an `Exporter` is expected — this is substitutability again, now with the interface enforced by Python itself rather than only documented in a docstring.

## Partially implementing still fails

If a subclass overrides some, but not all, abstract methods, it is still abstract, and still cannot be instantiated:

<!-- expect-error -->
```python
from abc import ABC, abstractmethod

class Exporter(ABC):
    @abstractmethod
    def export(self, rows):
        ...

    @abstractmethod
    def extension(self):
        ...

class HalfDone(Exporter):
    def export(self, rows):
        return str(rows)

HalfDone()
```

## Abstract properties

You can require a **property**, not just a method, by combining the two decorators (`@abstractmethod` directly under `@property`):

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @property
    @abstractmethod
    def area(self):
        ...

class Square(Shape):
    def __init__(self, side):
        self.side = side

    @property
    def area(self):
        return self.side ** 2

print(Square(4).area)
```

## Virtual subclasses with register

Sometimes a class already exists, was not written with your ABC in mind, and you cannot (or should not) change it — but it genuinely satisfies the interface. `register` tells Python to treat it as a subclass for `isinstance`/`issubclass` purposes, **without** actually inheriting from it, and **without** checking that any method truly exists:

```python
from abc import ABC, abstractmethod

class Exporter(ABC):
    @abstractmethod
    def export(self, rows):
        ...

class LegacyDumper:
    def export(self, rows):
        return repr(rows)

Exporter.register(LegacyDumper)
print(isinstance(LegacyDumper(), Exporter))
print(issubclass(LegacyDumper, Exporter))
```

Because `register` performs **no** checking, it is an easy way to lie to `isinstance` by accident. Use it sparingly, and only when you are certain the class really behaves the way your ABC promises.

## collections.abc: interfaces you already use

The standard library defines the interfaces behind `list`, `dict`, and friends in `collections.abc`, and you can check against them directly:

```python
from collections.abc import Iterable, Sized, Mapping

print(isinstance([1, 2, 3], Iterable), isinstance([1, 2, 3], Sized))
print(isinstance({"a": 1}, Mapping))
print(isinstance("text", Iterable))
```

This gives duck typing a precise, checkable name: instead of "anything with `__len__`", you can say `isinstance(x, Sized)`, which means exactly that, for any class — including your own, once it defines `__len__` (you will do this properly in the data model section, later in this tier).

## Common mistakes

- Forgetting `@abstractmethod` and finding that "abstract" methods are silently callable and do nothing useful.
- Expecting `ABC()` alone (with no abstract methods) to refuse instantiation — a class is only abstract if it actually has at least one `@abstractmethod`.
- Using `register` for a class that does not really implement the interface, breaking `isinstance` checks elsewhere.
- Writing an ABC when a simple `Protocol` (next lesson) would be a lighter fit.

## Recap

- `ABC` plus `@abstractmethod` stops incomplete subclasses from being instantiated at all.
- `@property` combined with `@abstractmethod` requires a property, not a method.
- `register` marks an unrelated class as a virtual subclass, without inheritance or checking.
- `collections.abc` gives you ready-made, precise names for the interfaces built-in types already follow.

## Your turn

In the **Practice** tab you define an abstract `Exporter` and two concrete exporters. Then three challenges use real data.
