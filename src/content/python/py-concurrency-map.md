Python offers three distinct tools for doing more than one thing at a time — threads, processes, and asyncio — and picking the wrong one for a given workload either wastes effort or genuinely does not help at all. This lesson is the map; the next two build the asyncio piece hands-on.

This is a reading lesson: comparing real threaded, multi-process and event-loop-based workloads side by side needs a real multi-core machine and OS-level processes, which this browser-based playground (a single Web Worker) does not have. asyncio itself *does* work here, and gets hands-on treatment in the next two lessons.

You will learn:

- concurrency versus parallelism
- I/O-bound versus CPU-bound, and why the distinction drives the tool choice
- `concurrent.futures` executors, briefly
- queues, for coordinating between workers
- race conditions and locks
- deadlocks

## Concurrency versus parallelism

```text
Concurrency (asyncio, single thread):
  task A: --wait-- --wait-- [run] --wait--
  task B: [run] --wait-- --wait-- [run]
  (interleaved on ONE thread - never truly simultaneous)

Parallelism (multiprocessing, multiple cores):
  process 1: [run][run][run][run]
  process 2: [run][run][run][run]
  (genuinely simultaneous, on separate cores)
```

Concurrency is a way of *structuring* a program to deal with multiple things that are in progress at once — it does not require more than one CPU core. Parallelism is actually executing more than one thing at the exact same instant, which does require multiple cores (or multiple machines). asyncio gives you the first; multiprocessing gives you the second.

## I/O-bound versus CPU-bound

The single most important question when choosing a concurrency tool: is the work spent **waiting** (for a network response, a disk read, a database query), or **computing** (parsing, transforming, crunching numbers)? I/O-bound work benefits enormously from asyncio or threads, since the GIL is released during a wait. CPU-bound work needs genuine parallelism — processes — to actually go faster on a GIL-based Python build.

## concurrent.futures executors

```text
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

with ThreadPoolExecutor(max_workers=10) as pool:
    results = list(pool.map(fetch_url, urls))          # I/O-bound: threads are fine

with ProcessPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(cpu_heavy_task, chunks))    # CPU-bound: needs processes
```

Both executor classes share the same `submit`/`map` interface — the code calling them barely changes whether you are using threads or processes, which makes it easy to pick the right one for the workload without restructuring the calling code.

## Queues for coordination

```text
import queue
import threading

work_queue = queue.Queue()

def worker():
    while True:
        item = work_queue.get()
        process(item)
        work_queue.task_done()

threading.Thread(target=worker, daemon=True).start()
```

A queue is the standard way to hand work between producer and consumer threads (or processes) safely — it handles the locking internally, so you are not manually coordinating access to a shared list yourself. `asyncio.Queue` (used hands-on in the next lesson) plays the identical role for coroutines.

## Race conditions

```text
counter = 0

def increment():
    global counter
    counter += 1   # read, add one, write back - three steps, not one

# ten threads each calling increment() 1000 times can lose updates,
# because a thread switch can happen between the read and the write
```

Two threads modifying shared state without coordination can interleave in a way that loses an update — the result depends on timing, which is exactly what makes race conditions intermittent and hard to reproduce. A `threading.Lock` around the read-modify-write sequence fixes this by ensuring only one thread executes it at a time.

## Deadlocks

```text
# thread A:
lock1.acquire()
lock2.acquire()   # waits forever if thread B holds lock2 and wants lock1

# thread B:
lock2.acquire()
lock1.acquire()   # waits forever if thread A holds lock1 and wants lock2
```

If two threads can each hold one lock while waiting for the other's lock, neither can ever proceed — a deadlock. The usual prevention is simple but has to be followed everywhere: always acquire multiple locks in the same, fixed order, everywhere in the codebase.

## Common mistakes

- Reaching for multiprocessing on I/O-bound work, paying serialisation overhead for a problem asyncio or threads already solve more cheaply.
- Sharing mutable state between threads without a lock, and getting an intermittent, hard-to-reproduce bug.
- Acquiring locks in inconsistent order across different parts of a codebase, creating a latent deadlock that only shows up under specific timing.
- Assuming any concurrency tool automatically makes CPU-bound code faster, without checking whether the GIL (or true parallelism) is actually the limiting factor.
