By default, two instances of your own class are only "equal" if they are the exact same object — even if every attribute matches. This lesson teaches Python's own objects to compare, sort, and be used as dictionary keys, by implementing three special methods: `__eq__`, `__hash__`, and the ordering methods.

You will learn:

- the default equality (identity), and why it is often wrong for value-like objects
- `__eq__`, and the contract it must keep with `__hash__`
- why defining `__eq__` removes the default `__hash__`
- `__lt__` and the other ordering methods
- `functools.total_ordering` to avoid writing all six
- sorting custom objects, and using them in sets and dictionary keys

## The default: identity

```python
class Version:
    def __init__(self, text):
        self.text = text

a = Version("1.2")
b = Version("1.2")
print(a == b, a is b)
```

Without a custom `__eq__`, `==` falls back to `is`: two different `Version` objects are never equal, even with identical data. For a **value-like** object — one whose identity should not matter, only its data — this is almost always wrong.

## Implementing __eq__

```python
class Version:
    def __init__(self, text):
        self.major, self.minor = map(int, text.split("."))

    def __eq__(self, other):
        if not isinstance(other, Version):
            return NotImplemented
        return (self.major, self.minor) == (other.major, other.minor)

a = Version("1.10")
b = Version("1.10")
print(a == b, a is b)
print(a == "1.10")
```

Returning `NotImplemented` (not `False`, and not raising) for an incompatible type is the correct idiom: it tells Python "I don't know how to compare with this", and lets Python try the other object's `__eq__`, or fall back to `False` if nobody can answer.

## The __eq__/__hash__ contract

Python's rule: **if two objects are equal, they must have the same hash.** This matters because dictionaries and sets use the hash to find a bucket, and then use `==` to confirm a genuine match within it. If equal objects had different hashes, a dictionary could never find a key that is, by rights, "the same" as the one you are looking up.

The moment you define `__eq__`, Python **removes the inherited `__hash__`** (setting it to `None`), because the default identity-based hash would now violate the contract:

<!-- expect-error -->
```python
class Broken:
    def __init__(self, value):
        self.value = value

    def __eq__(self, other):
        return self.value == other.value

hash(Broken(1))
```

If your objects are meant to be **immutable** value objects, add a matching `__hash__` yourself, built from the same fields used in `__eq__`:

```python
class Version:
    def __init__(self, text):
        self.major, self.minor = map(int, text.split("."))

    def __eq__(self, other):
        if not isinstance(other, Version):
            return NotImplemented
        return (self.major, self.minor) == (other.major, other.minor)

    def __hash__(self):
        return hash((self.major, self.minor))

versions = {Version("1.0"), Version("1.0"), Version("2.0")}
print(len(versions))
```

Two equal `Version`s collapse into one entry in the set, exactly as they should.

## Mutable objects and hashing

If an object's fields **can change** after creation, do not give it a `__hash__` at all (or explicitly set `__hash__ = None`). A hashable object that changes after being placed in a set or used as a dictionary key can no longer be found — it is stored in the bucket for its *old* hash, but looked up using its *new* one. This is why lists and dictionaries are themselves unhashable in Python: they are mutable.

## Ordering: __lt__ and friends

Equality does not give you `<`, `>`, `<=`, or `>=`. Those come from a separate family: `__lt__`, `__le__`, `__gt__`, `__ge__`.

```python
class Version:
    def __init__(self, text):
        self.major, self.minor = map(int, text.split("."))

    def __eq__(self, other):
        return (self.major, self.minor) == (other.major, other.minor)

    def __lt__(self, other):
        return (self.major, self.minor) < (other.major, other.minor)

    def __hash__(self):
        return hash((self.major, self.minor))

versions = [Version("2.1"), Version("1.9"), Version("2.0")]
ordered = sorted(versions)
print([f"{v.major}.{v.minor}" for v in ordered])
print(Version("1.0") < Version("2.0"))
```

`sorted()`, `min()`, `max()`, and the comparison operators all work once `__lt__` (and `__eq__`) exist, because Python's sorting only ever needs "less than" and can derive the rest.

## total_ordering: write one, get four

Writing all four comparison methods by hand is repetitive. `functools.total_ordering` fills in the rest, as long as you provide `__eq__` and **one** of `__lt__`/`__le__`/`__gt__`/`__ge__`:

```python
from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, text):
        self.major, self.minor = map(int, text.split("."))

    def __eq__(self, other):
        return (self.major, self.minor) == (other.major, other.minor)

    def __lt__(self, other):
        return (self.major, self.minor) < (other.major, other.minor)

print(Version("1.0") <= Version("1.0"))
print(Version("2.0") >= Version("1.9"))
print(Version("1.0") > Version("2.0"))
```

## Common mistakes

- Defining `__eq__` without `__hash__` for a value that you then try to put in a set.
- Making a **mutable** object hashable, then changing it after it is stored in a set or as a dictionary key.
- Returning `False` instead of `NotImplemented` from `__eq__` when the other object's type is not recognised.
- Writing all six comparison methods by hand instead of using `@total_ordering`.

## Recap

- Without `__eq__`, equality is identity. Define `__eq__` for value-like objects.
- Equal objects **must** have equal hashes; defining `__eq__` removes the default `__hash__`, so add your own for immutable values, or leave hashing disabled for mutable ones.
- `__lt__` (plus `__eq__`) is enough for `sorted()`, `min()`, `max()`; `@total_ordering` fills in the rest.

## Your turn

In the **Practice** tab you write a `Version` class that compares, hashes and sorts correctly. Then three challenges use real data.
