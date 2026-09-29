`with` handles one resource cleanly. `contextlib.ExitStack` extends the same guarantee to a number of resources decided at runtime — not known when you write the code.

You will learn:

- contextlib.contextmanager pitfalls, recapped
- ExitStack for a dynamic number of contexts
- suppress
- closing
- redirect_stdout
- async context managers, briefly
- reentrant contexts

## contextmanager pitfalls, recapped

```python
from contextlib import contextmanager

@contextmanager
def timer(label):
    print(f"{label}: starting")
    try:
        yield
    finally:
        print(f"{label}: done")

with timer("task"):
    print("doing work")
```

A generator-based context manager must wrap its cleanup in `try`/`finally` around the `yield` — otherwise an exception raised inside the `with` block skips the cleanup code entirely, which is exactly what the `try`/`finally` here prevents.

## ExitStack for a dynamic number of contexts

```python
from contextlib import ExitStack

class Resource:
    def __init__(self, name):
        self.name = name
    def __enter__(self):
        print(f"opening {self.name}")
        return self
    def __exit__(self, *exc):
        print(f"closing {self.name}")

names = ["a", "b", "c"]
with ExitStack() as stack:
    resources = [stack.enter_context(Resource(n)) for n in names]
    print(f"using {len(resources)} resources")
```

`with a, b, c:` only works for a number of context managers known when you write the line. `ExitStack` lets that number be decided at runtime — built up in a loop — while still guaranteeing every one of them is closed, in reverse order, when the `with` block ends (even if an exception occurs partway through).

## suppress

```python
from contextlib import suppress

with suppress(FileNotFoundError):
    open("does-not-exist.txt")

print("continued past the missing file")
```

`suppress(SomeException)` is a shorter, more readable alternative to a `try`/`except: pass` block for the specific, narrow case of "ignore this one exception type entirely and move on."

## closing

```python
from contextlib import closing
import io

with closing(io.StringIO("data")) as f:
    print(f.read())
```

`closing(obj)` turns any object with a `.close()` method into a context manager that calls it automatically — useful for older APIs that support `.close()` but were never written as a context manager themselves.

## redirect_stdout

```python
from contextlib import redirect_stdout
import io

buffer = io.StringIO()
with redirect_stdout(buffer):
    print("captured, not printed to the real stdout")

print("captured text was:", buffer.getvalue().strip())
```

Temporarily redirecting `stdout` into an in-memory buffer is a common way to capture what a function prints, for testing or for building a report — without needing to change the function itself to return the text instead of printing it.

## Async context managers, briefly

```python
import asyncio

class AsyncResource:
    async def __aenter__(self):
        await asyncio.sleep(0)
        return self
    async def __aexit__(self, *exc):
        await asyncio.sleep(0)

async def main():
    async with AsyncResource():
        return "used it"

print(asyncio.run(main()))
```

`async with` pairs with `__aenter__`/`__aexit__` for a resource whose setup or teardown itself needs to `await` something — an async database connection, for instance — the asyncio-native counterpart of the plain synchronous context manager protocol.

## Reentrant contexts, briefly

Most simple context managers are **not** safe to nest inside themselves (entering the same instance twice before exiting once) — a lock, for instance, would deadlock. A "reentrant" context manager is explicitly designed to support this (an `RLock`, for example) — worth checking a type's documentation before assuming nested use is safe.

## Watch out: exceptions in __enter__

```python
class Flaky:
    def __enter__(self):
        raise RuntimeError("setup failed")
    def __exit__(self, *exc):
        print("this never runs")

try:
    with Flaky():
        print("never reached")
except RuntimeError as e:
    print(f"caught: {e}")
```

If `__enter__` itself raises, `__exit__` is never called at all — there is nothing to clean up yet, since the resource was never successfully acquired in the first place. Any partial setup done before the failure inside `__enter__` needs its own cleanup, handled there directly.

## Common mistakes

- Forgetting `try`/`finally` around `yield` in a `@contextmanager` function, skipping cleanup on an exception.
- Using a fixed `with a, b, c:` when the actual number of resources is only known at runtime — `ExitStack` is the tool for that case.
- Assuming any context manager is safe to nest inside itself without checking whether it is actually reentrant.
- Suppressing a broader exception type than intended with `suppress(...)`, hiding a real bug along with the expected one.
