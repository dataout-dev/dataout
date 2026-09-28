You have used `with open(...) as f:` since Core Python. This lesson shows you how that works, and how to write your **own** context managers with `__enter__` and `__exit__` — the cleanest way to guarantee that setup and cleanup always happen together, in pairs, no matter what happens in between.

You will learn:

- the `with` protocol: `__enter__` and `__exit__`
- what the three `__exit__` arguments mean
- suppressing an exception by returning `True`
- `contextlib.contextmanager`, a much shorter way to write one
- `ExitStack` for a variable number of contexts
- nesting context managers

## Writing __enter__ and __exit__

```python
import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.perf_counter() - self.start
        return False

with Timer() as t:
    total = sum(range(100000))

print(t.elapsed >= 0)
```

`with Timer() as t:` calls `Timer().__enter__()`, and binds whatever it **returns** to `t` — here, `self`, so `t` is the same `Timer` instance. When the block ends, `__exit__` runs **automatically**, whether the block finished normally or raised.

## The three __exit__ arguments

If an exception happened inside the `with` block, Python passes its type, the exception instance, and its traceback to `__exit__`. If nothing went wrong, all three are `None`:

```python
class Reporter:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is None:
            print("finished cleanly")
        else:
            print(f"finished with {exc_type.__name__}: {exc_value}")
        return False

with Reporter():
    print("doing work")

try:
    with Reporter():
        raise ValueError("oops")
except ValueError:
    print("re-raised, as expected")
```

## Returning True suppresses the exception

If `__exit__` returns a **truthy** value, Python treats the exception as **handled**, and it does not propagate further:

```python
class Suppressor:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is ValueError:
            print("ignoring a ValueError")
            return True
        return False

with Suppressor():
    raise ValueError("this disappears")

print("we get here")
```

Use this power carefully: silently swallowing exceptions can hide real bugs, exactly as the errors lessons in Core Python warned. Return `False` (or nothing, which is falsy) unless you have a genuine, deliberate reason to suppress a specific exception type.

## contextlib.contextmanager: the short way

Writing a full class for a simple context manager is often more code than the idea deserves. `@contextmanager` turns a **generator function** into one: everything before `yield` is `__enter__`, the yielded value is what `as` binds, and everything after `yield` is `__exit__`:

```python
from contextlib import contextmanager
import time

@contextmanager
def timer():
    start = time.perf_counter()
    result = {}
    try:
        yield result
    finally:
        result["elapsed"] = time.perf_counter() - start

with timer() as t:
    total = sum(range(100000))

print(t["elapsed"] >= 0)
```

The `try`/`finally` matters: it guarantees the cleanup code after `yield` runs **even if the `with` block raises**, just like a class-based `__exit__` always runs.

```python
from contextlib import contextmanager

@contextmanager
def announce(name):
    print(f"entering {name}")
    try:
        yield
    finally:
        print(f"leaving {name}")

try:
    with announce("risky"):
        raise RuntimeError("boom")
except RuntimeError:
    print("caught outside")
```

Notice `"leaving risky"` prints **before** `"caught outside"` — cleanup always runs on the way out, even when an exception is in flight.

## ExitStack: a variable number of contexts

Sometimes you do not know in advance how many things need managing — perhaps a list of files, one per item in some data. `contextlib.ExitStack` lets you enter any number of context managers, and closes them all, in reverse order, when the stack itself exits:

```python
from contextlib import ExitStack, contextmanager

@contextmanager
def resource(name):
    print(f"open {name}")
    try:
        yield name
    finally:
        print(f"close {name}")

names = ["a", "b", "c"]
with ExitStack() as stack:
    opened = [stack.enter_context(resource(n)) for n in names]
    print("using", opened)
```

## Nesting context managers

Multiple context managers can be combined in one `with` statement, entered left to right and exited right to left:

```python
from contextlib import contextmanager

@contextmanager
def step(name):
    print(f"start {name}")
    yield
    print(f"end {name}")

with step("outer"), step("inner"):
    print("working")
```

## Common mistakes

- Forgetting to return `self` from `__enter__` when the `with ... as x:` binding is supposed to be the object itself.
- Returning a truthy value from `__exit__` by accident, silently swallowing every exception.
- Forgetting `try`/`finally` around `yield` in a `@contextmanager` function, so cleanup is skipped when the block raises.
- Writing a full class when a short `@contextmanager` function would be clearer.

## Recap

- `__enter__` runs at the start of `with`, and its return value is what `as` binds. `__exit__` always runs at the end, exception or not.
- `__exit__` returning a truthy value suppresses the exception.
- `@contextmanager` turns a generator (with `yield` and a `try`/`finally`) into a context manager with far less code.
- `ExitStack` manages a variable number of context managers at once.

## Your turn

In the **Practice** tab you write a `Timer` context manager that records elapsed seconds. Then three challenges use real data.
