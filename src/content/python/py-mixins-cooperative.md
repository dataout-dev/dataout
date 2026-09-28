A **mixin** is a small class that adds **one** capability, and is meant to be combined with other classes through multiple inheritance — never used on its own. This lesson shows how to write mixins that cooperate properly with `super()`, and the arguments trap that catches people who write them carelessly.

You will learn:

- what makes a class a mixin
- designing a `JsonMixin` from an object's own attributes
- cooperative `super()` calls across independent mixins
- passing keyword arguments through a mixin chain
- the trap of mixins with their own, incompatible `__init__` parameters

## A first mixin

A mixin typically has **no `__init__` of its own**, and assumes it will be combined with a class that has the state it needs:

```python
class JsonMixin:
    def to_json(self):
        import json
        return json.dumps(self.__dict__)

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class JsonPoint(JsonMixin, Point):
    pass

p = JsonPoint(3, 4)
print(p.to_json())
```

`JsonMixin` does not know anything about `Point` specifically. It only assumes that `self.__dict__` will hold the data worth serialising — which works for **any** class it is mixed into.

## Order matters: mixins usually come first

By convention, mixins are listed **before** the "real" base class, so that Python's method resolution order checks the mixin's methods first when there is a name clash:

```python
class LoggingMixin:
    def save(self):
        print(f"saving {self!r}")
        return super().save()

class Record:
    def __repr__(self):
        return "Record()"

    def save(self):
        print("writing to storage")
        return True

class LoggedRecord(LoggingMixin, Record):
    pass

print(LoggedRecord().save())
```

`LoggingMixin.save` runs first (it is earlier in the MRO), does its own work, and then calls `super().save()` to continue to `Record.save`. This is the same cooperative pattern from the MRO lesson, now used deliberately: each piece adds its behaviour and passes the call along.

## Several independent mixins together

Real designs stack more than one:

```python
class ComparableMixin:
    def __eq__(self, other):
        return self.__dict__ == other.__dict__

class Money(ComparableMixin, JsonMixin):
    def __init__(self, cents):
        self.cents = cents

a, b = Money(500), Money(500)
print(a == b)
print(a.to_json())
```

Each mixin contributes one clear ability — comparison, serialisation — and `Money` combines both without repeating any of that logic itself.

## Passing arguments through the chain

If mixins and the base class both need to run `__init__` work, every one of them should accept `*args, **kwargs` and forward what it does not use, so the whole chain can cooperate no matter which classes end up combined:

```python
class TimestampMixin:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        import datetime
        self.created = "now"

class Document:
    def __init__(self, title):
        self.title = title

class Report(TimestampMixin, Document):
    pass

r = Report("Q1 results")
print(r.title, r.created)
```

`TimestampMixin.__init__` does not know about `title` at all. It just passes everything through with `*args, **kwargs`, does its own small piece of setup, and trusts the rest of the chain (here, `Document`) to handle whatever remains.

## The trap: a mixin with its own incompatible parameters

If a mixin instead declares **specific** named parameters, it breaks as soon as it is combined with a class that has different ones, because every class in the chain receives the **same** call:

<!-- expect-error -->
```python
class BadMixin:
    def __init__(self, mixin_setting):
        self.mixin_setting = mixin_setting

class Widget:
    def __init__(self, name):
        self.name = name

class Bad(BadMixin, Widget):
    pass

b = Bad("button")
print(b.name)
```

`Bad("button")` calls `BadMixin.__init__("button")`, which treats `"button"` as `mixin_setting` — not what anyone intended. `Widget.__init__` never runs at all, so `b.name` does not exist, and the last line raises `AttributeError`. Well-designed mixins accept `*args, **kwargs` precisely to avoid this.

## Common mistakes

- Giving a mixin specific, named `__init__` parameters instead of `*args, **kwargs`.
- Forgetting `super().__init__(...)` inside a mixin, breaking the chain for whatever comes after it.
- Using a mixin on its own, when it was designed to always be combined with something else.
- Putting real, standalone behaviour in a mixin instead of a proper base class, just to avoid thinking about the hierarchy.

## Recap

- A mixin adds one capability and expects to be combined with another class, usually listed first in the base class list.
- Mixins should call `super()` to cooperate, rather than assuming they are the only thing being inherited from.
- Accept `*args, **kwargs` in a mixin's `__init__` so it can be combined with any class, in any position.

## Your turn

In the **Practice** tab you write `JsonMixin`, which adds `to_json()` based on `__dict__`. Then three challenges use real data.
