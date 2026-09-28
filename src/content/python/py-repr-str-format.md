When you `print` an object you have not customised, you get something unhelpful like `<__main__.Money object at 0x7f...>`. This lesson teaches your objects to describe themselves properly, with three special methods: `__repr__` for developers, `__str__` for everyone else, and `__format__` for the format mini-language.

You will learn:

- the default, unhelpful representation
- `__repr__`: unambiguous, ideally reconstructible
- `__str__`: readable, for end users
- how `print`, `str()` and f-strings choose between them
- `!r` and `!s` conversion flags
- `__format__` and format specs
- why `__repr__` must never raise

## The default is not useful

```python
class Money:
    def __init__(self, amount):
        self.amount = amount

m = Money(1250)
print(m)
print(repr(m))
```

Both show the class name and a memory address. Useless for debugging, and useless for a user.

## __repr__: for developers

`__repr__` should be **unambiguous**. The convention is that it looks like the code you would type to recreate the object, when that is practical:

```python
class Money:
    def __init__(self, cents):
        self.cents = cents

    def __repr__(self):
        return f"Money({self.cents!r})"

m = Money(1250)
print(repr(m))
print(m)
```

Now `print(m)` and `repr(m)` both use `__repr__`, because we have not defined `__str__` yet, and Python falls back to `__repr__` when `__str__` is missing. Notice `{self.cents!r}` inside the f-string: it calls `repr()` on the value, which is the right habit inside a `__repr__`, since it makes strings show their quotes.

## __str__: for users

`__str__` is meant to be **readable**, for people who do not care about Python syntax:

```python
class Money:
    def __init__(self, cents):
        self.cents = cents

    def __repr__(self):
        return f"Money({self.cents!r})"

    def __str__(self):
        return f"${self.cents / 100:.2f}"

m = Money(1250)
print(m)
print(str(m))
print(repr(m))
print(f"You owe {m}")
```

`print(m)` and an f-string like `f"...{m}"` both use `__str__` when it exists. `repr(m)` always uses `__repr__`, regardless.

## Choosing which one is used

| Call | Uses |
| ---- | ---- |
| `repr(obj)`, or an interactive prompt showing a value | `__repr__` |
| `str(obj)`, `print(obj)`, `f"{obj}"` | `__str__`, or `__repr__` if `__str__` is missing |
| inside a container's own repr, e.g. `print([m])` | always `__repr__` of the items |

```python
print([m])
print({"total": m})
```

Notice that even though `print(m)` alone uses `__str__`, printing a **list containing** `m` uses its `__repr__`. That is why `__repr__` should always exist and always be informative, even when you also define `__str__`.

## !r and !s in f-strings

Inside an f-string, `!r` forces `repr()` and `!s` forces `str()`, overriding the default:

```python
print(f"{m!r}")
print(f"{m!s}")
print(f"{m}")
```

## __format__ and format specs

The mini-language you use for numbers (`f"{x:.2f}"`) is powered by `__format__`, which you can also implement for your own classes:

```python
class Money:
    def __init__(self, cents):
        self.cents = cents

    def __repr__(self):
        return f"Money({self.cents!r})"

    def __format__(self, spec):
        dollars = self.cents / 100
        if spec == "":
            return f"${dollars:.2f}"
        return format(dollars, spec)

m = Money(999950)
print(f"{m}")
print(f"{m:.0f}")
print(f"{m:,.2f}")
```

An empty `spec` (plain `{m}`) gives your default rendering. Any other spec (`.0f`, `,.2f`) is passed straight to the underlying number, so your object plays nicely with the whole format mini-language you already know.

## __repr__ must never raise

Debuggers, error messages, and `pprint` all call `__repr__` on demand, often exactly when something has already gone wrong. If `__repr__` itself raises, you lose the very information you needed to diagnose the problem, and the original error can be obscured:

```python
class Fragile:
    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return f"Fragile({self.name!r})"

things = [Fragile("a"), Fragile("b")]
print(things)
```

Keep `__repr__` simple and defensive: build it from values you are sure exist, and avoid calling out to anything that might fail (a network call, a slow computation, code that assumes attributes are already set).

## A repr with pprint

`pprint` respects `__repr__`, and lays out nested structures more readably than plain `print`:

```python
from pprint import pprint

pprint({"items": [Money(500), Money(1000)], "total": Money(1500)})
```

## Common mistakes

- Never implementing `__repr__` at all, leaving debugging output useless.
- Using `str()` formatting (`!s`, or plain interpolation) inside `__repr__`, which can hide quotes and types.
- Writing a `__repr__` that can raise, for example by assuming an attribute exists before `__init__` finished.
- Confusing `__str__` (for users) with `__repr__` (for developers) and only bothering with one when both matter.

## Recap

- `__repr__` is for developers: unambiguous, ideally like the constructor call.
- `__str__` is for end users: readable. Python falls back to `__repr__` when `__str__` is missing.
- Containers always show their items with `__repr__`.
- `__format__` lets your class work with the format mini-language.

## Your turn

In the **Practice** tab you give a `Money` class a `__repr__` and `__str__`. Then three challenges use real data.
