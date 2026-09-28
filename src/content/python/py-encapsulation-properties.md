So far, any code outside a class could reach in and set an attribute to anything at all, including nonsense. **Encapsulation** means controlling that access: hiding the details, and validating what goes in. Python does this with a naming convention and with **properties**, which let ordinary-looking attribute access run real code behind the scenes.

You will learn:

- the naming conventions `_protected` and `__mangled`
- `@property`, and validating setters
- computed, read-only attributes
- deleters
- when getters and setters are un-Pythonic, and when a property is exactly right

## Naming conventions

Python has no true "private" attributes. Instead, it uses names to signal intent:

- `_name` (one leading underscore): "internal, please do not touch from outside", by **convention only**. Nothing stops access.
- `__name` (two leading underscores, no trailing ones): triggers **name mangling**, rewritten internally to `_ClassName__name`, mainly to avoid accidental clashes in subclasses.

```python
class Account:
    def __init__(self, balance):
        self._balance = balance
        self.__secret = "shh"

a = Account(100)
print(a._balance)
print(a.__dict__)
```

`vars(a)` reveals `_Account__secret`, not `__secret`. This is not real security, just collision avoidance. The community convention `_name` is what you should reach for in almost every case; double underscores are rarely needed.

## The problem properties solve

Suppose a temperature must never be below absolute zero. Storing it as a plain attribute cannot enforce that:

```python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

t = Temperature(-500)
print(t.celsius)
```

Nothing stopped `-500`. We want `t.celsius = -500` to raise an error, while `t.celsius` still **looks like** plain attribute access, not a method call.

## @property

A property turns a **method** into something that is read like an attribute:

```python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def celsius(self):
        return self._celsius

t = Temperature(20)
print(t.celsius)
```

`t.celsius` calls the method, but **without parentheses**. The actual value lives in `self._celsius`, a plain attribute by convention "internal".

## A validating setter

Add a setter with `@celsius.setter`, using the **same name**. Now assignment also runs your code:

```python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value

t = Temperature(20)
t.celsius = -10
print(t.celsius)
```

<!-- expect-error -->
```python
t = Temperature(20)
t.celsius = -1000
```

Notice that `__init__` itself assigns through `self.celsius = celsius`, so construction is validated too, for free.

## A computed, read-only property

A property with **no setter** is read-only from outside. It can compute its value from other attributes, with nothing stored at all:

```python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32

t = Temperature(0)
print(t.fahrenheit)
```

<!-- expect-error -->
```python
t = Temperature(0)
t.fahrenheit = 100
```

`fahrenheit` is always in sync with `celsius`, because it is recomputed every time it is read, never stored.

## Deleters

A property can also react to `del`, with `@name.deleter`, though this is used far less often:

```python
class Cache:
    def __init__(self):
        self._value = "cached"

    @property
    def value(self):
        return self._value

    @value.deleter
    def value(self):
        print("clearing the cache")
        self._value = None

c = Cache()
del c.value
print(c.value)
```

## The classic infinite-recursion bug

The setter must store into a **differently named** attribute (`_celsius`, not `celsius`). If it assigned `self.celsius = value` inside the `celsius` setter, that assignment would call the setter again, forever:

<!-- expect-error -->
```python
import sys
sys.setrecursionlimit(200)

class Broken:
    @property
    def value(self):
        return self._value

    @value.setter
    def value(self, v):
        self.value = v

Broken().value = 5
```

The error is a `RecursionError`. Always back a property with a distinctly named attribute.

## When not to bother

Languages like Java encourage a getter and setter for every field, "just in case". In Python this is usually unnecessary noise: start with a plain public attribute, and only introduce a property **later**, if and when you actually need validation or a computed value. Because `obj.attr` and `obj.attr = x` look identical whether `attr` is plain or a property, you can make that change **without breaking any code that already uses the class**. That is the real payoff of properties in Python: you do not have to guess up front.

## Common mistakes

- Storing the value under the same name the property uses, causing infinite recursion.
- Writing a setter with a different parameter name than the getter's property name (they must match).
- Adding a property with a setter but no way to construct a valid initial value.
- Reaching for getters and setters by default, out of habit from another language.

## Recap

- `_name` signals "internal" by convention. `__name` is mangled, mostly to avoid clashes in subclasses.
- `@property` makes a method readable as a plain attribute; `@name.setter` makes assignment run validation.
- A property with no setter is computed and read-only.
- Start with plain attributes; add a property later without changing the class's public interface.

## Your turn

In the **Practice** tab you write a `Temperature` class with a validated `celsius` property and a computed `fahrenheit`. Then three challenges use real data.
