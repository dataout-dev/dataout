Python threads look like threads in any other language — but for years, one detail has surprised newcomers: adding more threads to CPU-bound Python code often does not make it faster. The Global Interpreter Lock (GIL) is why, and it is changing.

This is a reading lesson: comparing real threaded, CPU-bound workloads needs actual OS threads and multiple cores, which this browser-based playground (a single Web Worker) does not provide. The concepts transfer directly to any real multi-core machine.

You will learn:

- what the GIL is and why it exists
- the difference it makes for CPU-bound versus I/O-bound code
- free-threaded builds, and what changes
- process-based parallelism as the traditional workaround
- how to decide which tool fits a given workload

## What the GIL is

```text
Thread A: [runs Python bytecode] -> [blocked, waiting for GIL]
Thread B: [blocked, waiting for GIL] -> [runs Python bytecode]
```

The GIL is a single lock inside the CPython interpreter, held by whichever thread is currently executing Python bytecode. Only one thread can hold it at a time. This exists to protect CPython's internal data structures (reference counts, among others) from being corrupted by two threads modifying them simultaneously — a real risk without it.

## I/O-bound code: threads still help

```text
def fetch(url):
    response = requests.get(url)   # GIL is RELEASED while waiting on the network
    return response.text

# ten threads fetching ten URLs concurrently genuinely overlap their WAITING time,
# even though only one thread ever runs Python bytecode at any instant
```

A thread waiting on a network call, a disk read, or `time.sleep()` releases the GIL for that duration. Ten threads each waiting on a slow network response can have their *waits* overlap almost entirely — the GIL is only actually contended for the brief moments each thread is running real Python code (parsing a response, say), not during the wait itself.

## CPU-bound code: threads do not help (on a GIL build)

```text
def count_primes(n):
    # pure computation, no I/O - never releases the GIL voluntarily
    ...

# four threads each computing primes do NOT run four-times-faster;
# they take turns holding the GIL, adding switching overhead on top
```

Since only one thread can execute Python bytecode at any instant, splitting purely computational work across threads does not add parallelism — it adds the overhead of the interpreter switching which thread currently holds the GIL, typically making things slightly *worse* than a single thread doing the same total work.

## Free-threaded builds

```text
python3.14t script.py   # the 't' (threaded) build variant, GIL disabled
```

Recent CPython versions offer an experimental **free-threaded** build where the GIL can be disabled. This allows genuinely parallel execution of Python bytecode across threads — but it requires much finer-grained internal locking throughout the interpreter to stay safe without the GIL's single big lock, and the ecosystem (C extensions especially) is still catching up to being fully compatible with it.

## The traditional workaround: processes

```text
from concurrent.futures import ProcessPoolExecutor

with ProcessPoolExecutor() as pool:
    results = list(pool.map(count_primes, [1000, 2000, 3000, 4000]))
```

Each process gets its own Python interpreter and its own GIL, so CPU-bound work genuinely runs in parallel across processes on a multi-core machine. The cost: more memory (a full interpreter per process) and the need to serialise (pickle) data passed between processes, since they do not share memory directly.

## Deciding which tool fits

- **I/O-bound, want concurrency**: threads (or asyncio — covered in the next section) — the GIL is not the bottleneck here.
- **CPU-bound, want parallelism, on a standard build**: processes.
- **CPU-bound, on a free-threaded build**: threads become a real option too, once the ecosystem catches up.

## Watch out: race conditions still exist with the GIL

```text
counter = 0

def increment():
    global counter
    counter += 1   # NOT atomic - a "read, add one, write back" sequence

# the GIL can switch threads BETWEEN the read and the write of `counter += 1`,
# so 100 threads each incrementing 1000 times can still lose updates
```

The GIL prevents two threads from running Python bytecode at the *exact same instant*, but it does not make multi-step operations like `counter += 1` atomic — a thread switch can happen between the read and the write. A `threading.Lock` around the shared update is still required, GIL or no GIL.

## Common mistakes

- Adding threads to CPU-bound code expecting a speedup, then being confused when it gets slower.
- Assuming the GIL makes all shared-state code automatically safe, and skipping locks that are still needed.
- Reaching for multiprocessing for I/O-bound work, paying its overhead for a problem threads (or asyncio) already solve more cheaply.
- Assuming free-threaded Python is already the default, production-ready experience — as of now, it is an opt-in, still-maturing build variant.
