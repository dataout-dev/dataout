`asyncio` is Python's built-in library for concurrency on a single thread: many operations appear to run "at once" by cooperatively taking turns whenever one of them is waiting on something. Unlike the threading and multiprocessing tools from the previous lesson, asyncio runs fine right here in this playground.

You will learn:

- `async`/`await` and coroutines
- running coroutines with `asyncio.run`
- tasks and `asyncio.gather`
- timeouts and cancellation
- semaphores, briefly
- `asyncio.Queue`

## async and await

```python
import asyncio

async def greet(name):
    await asyncio.sleep(0)   # yields control - "I'm waiting, let something else run"
    return f"hello, {name}"

result = asyncio.run(greet("Ada"))
print(result)
```

An `async def` function is a **coroutine function** — calling it does not run the body immediately, it returns a coroutine object that has to be *driven* (via `await`, or a runner like `asyncio.run`). `await` pauses the current coroutine at that point, letting the event loop run something else, then resumes once the awaited thing is ready.

## Running coroutines

```python
import asyncio

async def main():
    print("start")
    await asyncio.sleep(0)
    print("end")

asyncio.run(main())
```

`asyncio.run(coro)` is the standard entry point: create an event loop, run the coroutine to completion, then close the loop. It is meant to be called once, from ordinary (non-async) code, to kick the whole thing off.

## Tasks and gather

```python
import asyncio

async def fetch(name, delay):
    await asyncio.sleep(delay)
    return f"{name} done"

async def main():
    results = await asyncio.gather(
        fetch("A", 0),
        fetch("B", 0),
        fetch("C", 0),
    )
    return results

print(asyncio.run(main()))
```

`asyncio.gather(*coros)` schedules every coroutine to run concurrently and returns their results as a list, **in the same order the coroutines were passed in** — regardless of which one actually finishes first. This is the asyncio equivalent of "start several things, then wait for all of them."

## Timeouts and cancellation

```python
import asyncio

async def slow_task():
    await asyncio.sleep(5)
    return "finished"

async def main():
    try:
        return await asyncio.wait_for(slow_task(), timeout=0.01)
    except TimeoutError:
        return "gave up waiting"

print(asyncio.run(main()))
```

`asyncio.wait_for` races a coroutine against a timeout, cancelling it and raising `TimeoutError` if it has not finished in time — essential for anything that talks to the outside world, where "wait forever" is rarely the right behaviour.

## Semaphores, briefly

```python
import asyncio

async def limited_task(sem, n):
    async with sem:
        await asyncio.sleep(0)
        return n

async def main():
    sem = asyncio.Semaphore(2)   # at most 2 running at once
    return await asyncio.gather(*(limited_task(sem, i) for i in range(5)))

print(asyncio.run(main()))
```

An `asyncio.Semaphore(n)` caps how many coroutines can hold it at once — useful for "run these 100 requests concurrently, but never more than 5 at a time against this one server", capping load without giving up concurrency entirely.

## asyncio.Queue

```python
import asyncio

async def main():
    queue = asyncio.Queue()
    await queue.put("item")
    value = await queue.get()
    return value

print(asyncio.run(main()))
```

`asyncio.Queue` is the coroutine-friendly version of the thread-safe queue from the previous lesson — the standard way to hand data between a producer coroutine and a consumer coroutine, which the next lesson builds into a full pipeline.

## Watch out: calling a blocking function inside a coroutine

```python
import time

async def bad_wait():
    time.sleep(1)   # BLOCKS the whole event loop - nothing else can run during this
    return "done"
```

`time.sleep` (unlike `asyncio.sleep`) blocks the entire thread, including the event loop — every other coroutine waiting to run is frozen for that whole second, defeating the entire point of using asyncio. Any genuinely blocking call (synchronous file I/O, a blocking network library, real CPU work) needs `asyncio.sleep` for waits, or `loop.run_in_executor` to push real blocking work onto a separate thread instead of running it directly on the event loop.

## Common mistakes

- Calling an `async def` function and expecting it to run immediately, forgetting it returns a coroutine that must be awaited or run.
- Using `time.sleep` instead of `await asyncio.sleep` inside a coroutine, blocking the whole event loop.
- Assuming `asyncio.gather`'s results come back in *completion* order rather than the order the coroutines were passed in.
- Forgetting a timeout on anything that waits on the outside world, and hanging indefinitely if it never responds.
