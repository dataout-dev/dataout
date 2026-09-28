Many classic design patterns exist to work around the lack of first-class functions and dynamic dispatch in languages like Java or C++. Python has both, from the very beginning. This lesson highlights the **Pythonic** alternatives you have already been using piece by piece throughout this tier — functions instead of single-method classes, decorator-based registries, and `singledispatch` — and puts a name to the discipline of choosing them deliberately.

You will learn:

- when a plain function replaces an entire "strategy" class
- decorator-based registries and a simple plugin idea
- dispatch tables, as data-driven alternatives to long `if`/`elif` chains
- `functools.singledispatch` for type-based dispatch
- the smell: "a class with one method"

## Functions over classes

If a "pattern" would produce a class with exactly **one** meaningful method (often named `execute`, `apply`, or `run`) and no state of its own, it is almost always simpler as a plain function. You saw this already with the strategy pattern:

```python
class UppercaseStrategy:
    def apply(self, text):
        return text.upper()

def apply_uppercase(text):
    return text.upper()
```

The class version adds a name, an indentation level, and an import, for exactly the same behaviour a function already provides directly. Reach for a class when you need to bundle **state** with behaviour, or when several related operations belong together; reach for a function when one clear operation is all there is.

## Decorator-based registries

You built one of these already, in the creational patterns lesson. It is worth naming as its own idiom: a plain dictionary, filled in by a decorator, replacing what other languages might need a formal "abstract factory" class hierarchy to achieve:

```python
handlers = {}

def command(name):
    def decorator(func):
        handlers[name] = func
        return func
    return decorator

@command("greet")
def greet(args):
    return f"hello, {args}"

@command("shout")
def shout(args):
    return args.upper()

def run(name, args):
    return handlers[name](args)

print(run("greet", "Ada"))
print(run("shout", "hi"))
```

Adding a new command means adding a new `@command("...")` function — `run` itself never changes, and there is no class hierarchy anywhere in sight.

## A plugin idea, briefly

The same registry idea scales up to a genuine **plugin system**: a package can expose a decorator, third-party code registers itself with it, and the main program discovers everything registered without knowing in advance what exists. Python's packaging tools also support formal "entry points" for this, for plugins that live in **separate, installable** packages — a more advanced technique you may meet in real projects, built on exactly this same registration idea.

## Dispatch tables

A long `if`/`elif` chain choosing between operations is often more clearly written as a **dictionary lookup**:

```python
import operator

operations = {
    "+": operator.add,
    "-": operator.sub,
    "*": operator.mul,
    "/": operator.truediv,
}

def calculate(a, op, b):
    return operations[op](a, b)

print(calculate(3, "+", 4))
print(calculate(10, "/", 2))
```

This is data-driven: adding a new operator means adding a new dictionary entry, not another `elif`. It is also naturally extensible at **runtime** — a caller could register a new operator into `operations` without touching `calculate` at all.

## functools.singledispatch: dispatch by type

When the "right" behaviour depends on the **type** of an argument, `functools.singledispatch` avoids a chain of `isinstance` checks entirely:

```python
from functools import singledispatch

@singledispatch
def describe(value):
    return f"a {type(value).__name__}"

@describe.register(int)
def _(value):
    return f"the integer {value}"

@describe.register(list)
def _(value):
    return f"a list of {len(value)} items"

print(describe(5))
print(describe([1, 2, 3]))
print(describe(3.14))
```

Each type gets its **own** function, registered independently, rather than one function with a growing `if isinstance(...)` ladder — precisely the Open/Closed Principle again, this time solved with a single decorator from the standard library.

## The smell: a class with one method

If you notice yourself writing a class whose entire job is one method (frequently, again, named `execute` or `run`), pause and ask: does this really need to be a class? Signs it might, despite appearances:

- it needs to be **constructed with configuration** that stays fixed across many calls (then a class with `__init__` and `__call__`, from the callable-objects lesson, may be the cleanest shape), or
- it is part of a family of interchangeable implementations that genuinely share a **base class or protocol** (the strategy pattern, done properly).

If neither applies, a plain function — or a dictionary of them — is usually the more honest, more Pythonic shape.

## Common mistakes

- Building a class hierarchy for behaviour that a dictionary of functions, or `singledispatch`, would express more simply.
- Writing a long `isinstance` chain instead of `singledispatch`, when the dispatch is genuinely by type.
- Growing an `if`/`elif` chain indefinitely instead of switching to a registry once new cases keep appearing.

## Your turn

In the **Practice** tab you write `command(name)`, a registry decorator for command handlers. Then three challenges use real data.
