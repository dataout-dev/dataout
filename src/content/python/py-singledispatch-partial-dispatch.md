An `if isinstance(x, ...) elif isinstance(x, ...)` chain works, but grows unwieldy as more types are added, and forces every case to live inside one function. `functools.singledispatch` inverts this: one function per type, dispatched automatically.

You will learn:

- single dispatch on argument type
- dispatching on methods with singledispatchmethod
- partial and partialmethod
- the operator module, briefly
- registries of handlers as an alternative
- comparing dispatch with match

## Single dispatch on argument type

```python
from functools import singledispatch

@singledispatch
def describe(x):
    return f"something: {x}"

@describe.register
def _(x: int):
    return f"an int: {x}"

@describe.register
def _(x: str):
    return f"a string of length {len(x)}"

print(describe(5))
print(describe("hello"))
print(describe(3.14))
```

`@describe.register` adds a new implementation keyed by the type hint on its single argument. Calling `describe(x)` picks whichever registered implementation matches `type(x)` most specifically, falling back to the undecorated function for anything with no registered match.

## Dispatching on methods

```python
from functools import singledispatchmethod

class Formatter:
    @singledispatchmethod
    def format(self, x):
        return str(x)

    @format.register
    def _(self, x: int):
        return f"int:{x}"

f = Formatter()
print(f.format(5))
print(f.format("hi"))
```

`singledispatchmethod` is the same idea applied to a method, correctly accounting for `self` as the first parameter (which plain `singledispatch` does not handle for you automatically).

## partial and partialmethod

```python
from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5), cube(2))
```

`partial(fn, **fixed_kwargs)` bakes in some arguments ahead of time, producing a new, narrower callable — useful for turning one general function into several specific, more readable ones without writing a new `def` for each.

## The operator module, briefly

```python
import operator
from functools import reduce

numbers = [1, 2, 3, 4]
total = reduce(operator.add, numbers)
product = reduce(operator.mul, numbers)
print(total, product)
```

`operator.add`, `operator.mul`, and similar give you the built-in operators as plain callable functions — handy with `reduce`, `sorted(key=operator.itemgetter(...))`, or anywhere else a function object (rather than an inline `lambda`) is expected.

## Registries of handlers, an alternative

```python
handlers = {}

def register(name):
    def decorator(fn):
        handlers[name] = fn
        return fn
    return decorator

@register("upper")
def to_upper(text):
    return text.upper()

@register("lower")
def to_lower(text):
    return text.lower()

print(handlers["upper"]("hi"))
```

A plain dict-based registry dispatches on an arbitrary key (a string, an enum) rather than a Python type — the right tool when the thing you are branching on is not naturally "the type of one argument," which is specifically what `singledispatch` is built around.

## Comparing dispatch with match

```python
def describe_match(x):
    match x:
        case int():
            return f"an int: {x}"
        case str():
            return f"a string of length {len(x)}"
        case _:
            return f"something: {x}"

print(describe_match(5))
```

`match` can express the same type-based branching inline, in one function — often more readable for a handful of cases checked in one place. `singledispatch` shines when the cases need to live in genuinely separate, independently registered functions (across different files, or added later by a plugin), which `match` cannot do without editing the original function.

## Watch out: dispatching on too many types

Once a `singledispatch` function accumulates a dozen or more registered types, consider whether the underlying problem is really "format differently by type," or whether each type should instead implement a shared method (`__format_for_report__`, say) that a much simpler, generic caller invokes polymorphically — sometimes dispatch-by-type is standing in for a missing shared interface.

## Common mistakes

- Using plain `singledispatch` on a method and forgetting `self` breaks the dispatch (use `singledispatchmethod` instead).
- Reaching for `partial` when a simple `lambda` or a second `def` would be just as clear.
- Building a `singledispatch` function with dozens of registered types where a shared method on each type would read more clearly.
- Forgetting that `singledispatch` dispatches only on the *first* argument's type, not any other parameter.
