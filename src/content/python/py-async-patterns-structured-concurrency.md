A single `await` here and there is easy. Coordinating several coroutines that depend on each other — a producer filling a queue, a consumer draining it, both needing to shut down cleanly — takes a bit more structure. `TaskGroup` (Python 3.11+) is the modern, safer way to manage that.

You will learn:

- `asyncio.Queue` in a producer/consumer pipeline
- `TaskGroup` for structured concurrency
- exception handling across a group of tasks
- async iterators and generators, briefly
- async context managers, briefly
- testing async code

## Producer/consumer with a queue

```python
import asyncio

async def producer(queue, items):
    for item in items:
        await queue.put(item)
    await queue.put(None)   # a sentinel - tells the consumer there's no more work

async def consumer(queue, results):
    while True:
        item = await queue.get()
        if item is None:
            break
        results.append(item * 2)

async def main():
    queue = asyncio.Queue(maxsize=2)
    results = []
    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer(queue, [1, 2, 3]))
        tg.create_task(consumer(queue, results))
    return results

print(asyncio.run(main()))
```

The `maxsize=2` on the queue is what gives this **back-pressure**: once two items are waiting, the producer's next `put` pauses until the consumer catches up — the queue naturally limits how far the producer can get ahead, without either side needing to poll the other's progress directly.

## TaskGroup

```python
import asyncio

async def main():
    async with asyncio.TaskGroup() as tg:
        task1 = tg.create_task(asyncio.sleep(0, result="first"))
        task2 = tg.create_task(asyncio.sleep(0, result="second"))
    # by the time the `async with` block exits, BOTH tasks are guaranteed done
    return task1.result(), task2.result()

print(asyncio.run(main()))
```

A `TaskGroup` guarantees that every task created inside it has finished — successfully or not — by the time the `async with` block exits. This is **structured concurrency**: no task can accidentally be left running in the background after the block that created it has moved on, unlike calling `asyncio.create_task` directly with no group tracking it.

## Exception handling in groups

```python
import asyncio

async def failing():
    await asyncio.sleep(0)
    raise ValueError("something went wrong")

async def main():
    caught = 0
    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(failing())
            tg.create_task(asyncio.sleep(0.01))
    except* ValueError as eg:
        caught = len(eg.exceptions)   # return/break/continue aren't allowed directly inside except* - assign, then return after
    return f"caught {caught} error(s)"

print(asyncio.run(main()))
```

If any task in a group raises, the group cancels the other still-running tasks and raises an `ExceptionGroup` once everything has actually stopped — `except*` (Python 3.11+) is the syntax for catching specific exception types out of that group, since more than one task could have failed simultaneously.

## Async iterators and generators, briefly

```python
import asyncio

async def countdown(n):
    while n > 0:
        yield n
        await asyncio.sleep(0)
        n -= 1

async def main():
    values = []
    async for v in countdown(3):
        values.append(v)
    return values

print(asyncio.run(main()))
```

An `async def` function containing `yield` is an **async generator** — consumed with `async for` instead of a plain `for`, letting each step of the iteration itself await something (a network page, the next queue item) without blocking everything else.

## Async context managers, briefly

```python
import asyncio

class AsyncResource:
    async def __aenter__(self):
        await asyncio.sleep(0)
        return self
    async def __aexit__(self, exc_type, exc, tb):
        await asyncio.sleep(0)
        return False

async def main():
    async with AsyncResource() as r:
        return "used the resource"

print(asyncio.run(main()))
```

`__aenter__`/`__aexit__` are the async counterparts of `__enter__`/`__exit__` — for a resource whose setup or teardown itself needs to await something (an async database connection, for instance), rather than a plain synchronous context manager.

## Testing async code

```python
import asyncio

async def add_async(a, b):
    await asyncio.sleep(0)
    return a + b

def test_add_async():
    result = asyncio.run(add_async(2, 3))
    assert result == 5

test_add_async()
print("test passed")
```

A plain `assert` inside a regular test function still works for async code — you just need something (`asyncio.run`, or a plugin like `pytest-asyncio` marking the test function itself `async def`) to actually drive the coroutine to completion before asserting on its result.

## Watch out: forgetting to await

```python
import asyncio

async def compute():
    await asyncio.sleep(0)
    return 42

async def broken():
    result = compute()   # missing `await` - result is a coroutine object, not 42
    return result

value = asyncio.run(broken())
print(type(value), value)   # a coroutine object, not the int 42 - almost certainly a bug
```

Forgetting `await` does not raise an error — it silently hands you the coroutine *object* instead of its eventual result, which usually surfaces much later as a confusing type error somewhere completely unrelated to the actual mistake.

## Common mistakes

- Using bare `asyncio.create_task` with nothing tracking the task, letting it silently run in the background (or get garbage collected) instead of using a `TaskGroup`.
- Forgetting the sentinel value that tells a consumer to stop, leaving it waiting on the queue forever.
- Missing an `await` and passing a coroutine object around as if it were already the result.
- Not handling `ExceptionGroup` from a `TaskGroup`, and being confused when a single `except ValueError` does not catch it.
