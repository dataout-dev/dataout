A plain decorator (`@decorator`) wraps a function once. A **parametrised** decorator — one that itself takes arguments, like `@retry(3)` — needs one extra layer of nesting, and stacking several decorators raises real questions about order.

You will learn:

- decorators with arguments
- class-based decorators
- stacking order
- decorating methods and classmethods
- preserving signatures with functools.wraps

## Decorators with arguments

```python
def repeat(times):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = fn(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet():
    print("hi")

greet()
```

`@retry(3)` is really `retry(3)` called first (producing the *actual* decorator), which is then applied to the function — three layers of function: the parametrised factory, the decorator it returns, and the wrapper that decorator produces.

## Class-based decorators

```python
class CountCalls:
    def __init__(self, fn):
        self.fn = fn
        self.calls = 0
    def __call__(self, *args, **kwargs):
        self.calls += 1
        return self.fn(*args, **kwargs)

@CountCalls
def add(a, b):
    return a + b

add(1, 2)
add(3, 4)
print(add.calls)
```

A class with `__call__` can act as a decorator too — `@CountCalls` on `add` replaces `add` with an instance of `CountCalls` wrapping it, useful when the decorator itself needs to hold state (like a call count) beyond what a closure conveniently offers.

## Stacking order

```python
def shout(fn):
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs).upper()
    return wrapper

def exclaim(fn):
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs) + "!"
    return wrapper

@shout
@exclaim
def greet():
    return "hello"

print(greet())
```

Decorators apply bottom-up: `@exclaim` wraps `greet` first, then `@shout` wraps *that* — so `"hello"` becomes `"hello!"` (exclaim) and then `"HELLO!"` (shout). Reversing the stacking order would change the result, which is worth checking deliberately whenever more than one decorator is stacked.

## Decorating methods and classmethods

```python
def logged(fn):
    def wrapper(self, *args, **kwargs):
        print(f"calling {fn.__name__}")
        return fn(self, *args, **kwargs)
    return wrapper

class Service:
    @logged
    def run(self, task):
        return f"ran {task}"

Service().run("import")
```

A decorator for an instance method needs to accept `self` as its first positional argument, just like the method itself does — a decorator written only for plain functions (with no `self` in its wrapper's signature) breaks the moment it is applied to a method.

## Preserving signatures with functools.wraps

```python
import functools

def logged(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@logged
def add(a, b):
    """Add two numbers."""
    return a + b

print(add.__name__, add.__doc__)
```

Without `@functools.wraps(fn)`, the decorated function's `__name__` and `__doc__` become the *wrapper's* (`"wrapper"`, `None`) instead of the original function's — breaking introspection, debugging output, and generated documentation. Always apply `functools.wraps` inside a decorator, as a matter of habit.

## Watch out: decorating a method as a plain function

```python
def double_result(fn):
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs) * 2
    return wrapper

class Calculator:
    @double_result
    def value(self):
        return 21

print(Calculator().value())
```

This example happens to work because `*args` absorbs `self` transparently — but a decorator written assuming a *specific* fixed argument count (rather than `*args, **kwargs`) can break in confusing ways once applied to a method, where an implicit `self` is always the first argument.

## Common mistakes

- Forgetting the extra layer of nesting a parametrised decorator needs (`retry(3)` must return a decorator, not wrap the function directly).
- Omitting `functools.wraps`, breaking introspection and debugging for every decorated function.
- Assuming decorator stacking order does not matter, when it very much can.
- Writing a decorator's wrapper with a fixed argument list instead of `*args, **kwargs`, breaking it for any function with a different signature.
