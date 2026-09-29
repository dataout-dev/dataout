`obj.attr` looks like a simple dictionary lookup, but it follows a precise, layered algorithm — and `obj(args)` follows another one just as precise. Seeing both clearly demystifies a lot of what feels like "magic" in Python's object model.

You will learn:

- the full lookup algorithm for `obj.attr`
- data descriptors and why they can override an instance's own `__dict__`
- `__getattr__` as a fallback, versus `__getattribute__` for everything
- bound methods
- how `super()` finds the next class in the MRO
- what actually happens when you call a class

## The full lookup algorithm

```python
class WithProperty:
    @property
    def value(self):
        return self._value * 2
    def __init__(self, v):
        self._value = v

obj = WithProperty(5)
print(obj.value)

obj.__dict__["value"] = 999   # sneaking a same-named entry directly into the instance dict
print(obj.value)              # still uses the property - a data descriptor wins
```

Roughly, `obj.attr` checks: is there a **data descriptor** (an object defining both `__get__` and `__set__`, like `property`) for `attr` on the class or its bases? If so, that wins outright. Otherwise, is `attr` in the instance's own `__dict__`? If so, that wins. Otherwise, fall back to the class (a plain method, or a non-data descriptor). A `property` is a data descriptor, which is exactly why it keeps controlling access even after the example above tries to plant a same-named value directly on the instance.

## __getattr__ versus __getattribute__

```python
class Lazy:
    def __getattr__(self, name):
        # only called when normal lookup has ALREADY failed to find `name`
        return f"computed on demand: {name}"

obj = Lazy()
print(obj.anything)     # not found normally, so __getattr__ kicks in
obj.real = 42
print(obj.real)         # found normally - __getattr__ is never even called for this one
```

`__getattr__` is a fallback: normal lookup runs first, and `__getattr__` only fires if that lookup fails completely. `__getattribute__`, if defined, runs on *every single* attribute access, found or not — powerful, but easy to get wrong (recursing into itself is a classic mistake), so `__getattr__` is reached for far more often.

## Bound methods

```python
class Greeter:
    def hello(self):
        return "hi"

g = Greeter()
bound = g.hello
print(bound())          # no argument needed - `g` is already remembered
print(Greeter.hello(g)) # the unbound version still needs g passed explicitly
```

`g.hello` is not the same object as `Greeter.hello` — looking a function up *through an instance* produces a bound method that already carries a reference to `g`, so calling it never needs `self` supplied by hand.

## super() and the MRO

```python
class A:
    def greet(self):
        return "A"

class B(A):
    def greet(self):
        return "B then " + super().greet()

class C(A):
    def greet(self):
        return "C then " + super().greet()

class D(B, C):
    def greet(self):
        return "D then " + super().greet()

print(D.__mro__)
print(D().greet())
```

`super().greet()` does not call "the parent class" — it calls whatever comes **next in the Method Resolution Order** after the current class. With single inheritance those are the same thing; with the diamond-shaped hierarchy above, `D`'s MRO visits `B` then `C` before finally reaching `A`, so `super()` inside `B` actually calls `C`, not `A` directly — cooperative multiple inheritance depends entirely on this.

## What calling a class actually does

```python
class Traced(type):
    def __call__(cls, *args, **kwargs):
        print(f"creating a {cls.__name__}")
        return super().__call__(*args, **kwargs)

class Widget(metaclass=Traced):
    def __init__(self, name):
        self.name = name

w = Widget("button")
```

`Widget("button")` is itself governed by the call protocol, one level up: it calls `Widget`'s metaclass's `__call__` (here, `Traced.__call__`), which is what actually calls `Widget.__new__` to create the instance and then `Widget.__init__` to initialise it. Overriding a metaclass's `__call__` is how a framework can hook into "something is about to construct an instance of this class" globally.

## Watch out: assuming attribute lookup is trivial

The layered order above (data descriptor, then instance `__dict__`, then class) is exactly why a `property` cannot simply be "overridden" by assigning `self.name = value` inside `__init__` if `name` is also a property on the class — the data descriptor keeps winning, often producing a confusing `AttributeError: can't set attribute` instead of the silent shadowing a newcomer might expect.

## Common mistakes

- Overriding `__getattribute__` when `__getattr__` (the fallback-only version) is what was actually needed.
- Assuming `self.x = 5` in `__init__` always creates a plain instance attribute, without checking whether `x` is a data descriptor on the class.
- Assuming `super()` always means "my direct parent", which breaks down the moment multiple inheritance is involved.
- Forgetting that a bound method and the underlying function are different objects, and being confused by `instance.method is instance.method` often being `False` (each access can create a new bound-method wrapper).
