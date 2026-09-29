When work is genuinely CPU-bound and needs to go faster on a multi-core machine, threads (limited by the GIL) will not help — separate processes, each with their own interpreter, are the standard answer.

This is a reading lesson: spawning real OS processes needs a real multi-core operating system process model, which this single-threaded, browser-based Web Worker does not have. The ideas apply directly on any real machine.

You will learn:

- `ThreadPoolExecutor` versus `ProcessPoolExecutor`
- `map` versus `submit`
- pickling requirements
- shared state and its costs across processes
- chunking work
- `joblib`, briefly

## ThreadPoolExecutor and ProcessPoolExecutor

```text
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

with ThreadPoolExecutor(max_workers=8) as pool:
    pool.map(download_file, urls)          # I/O-bound - threads are fine, cheap to start

with ProcessPoolExecutor(max_workers=4) as pool:
    pool.map(crunch_numbers, datasets)      # CPU-bound - needs real processes for real speedup
```

Both classes implement the same `Executor` interface — `submit`, `map`, and the context-manager protocol for cleanup — so the *choice* of thread pool versus process pool is close to the only thing that changes when moving from I/O-bound to CPU-bound work.

## map versus submit

```text
# map: apply the same function across many inputs, results in order
results = list(pool.map(process_item, items))

# submit: one specific call, tracked as its own Future
future = pool.submit(process_item, single_item)
result = future.result()   # blocks until this one specific call finishes
```

`map` is the right tool for "run this same function over a uniform batch of inputs." `submit` is for tracking individual, possibly heterogeneous tasks — checking on one specific call's status, attaching a callback, or cancelling it independently of the others.

## Pickling requirements

```text
def process_item(item):
    return item * 2

# this needs to be defined at module level (not inside a function or as a lambda) -
# ProcessPoolExecutor pickles the function reference to send it to a worker process
```

A `ProcessPoolExecutor` sends both the function and its arguments to a separate process — since processes do not share memory, this happens via pickling (serialising to bytes, then reconstructing on the other side). A `lambda`, or a function defined inside another function, generally cannot be pickled this way, which is a common first stumbling block when switching from threads to processes.

## Shared state and its costs

```text
from multiprocessing import Value, Array

counter = Value("i", 0)   # a genuinely shared integer, backed by shared memory

def increment(counter):
    with counter.get_lock():
        counter.value += 1
```

Threads share memory automatically (which is why race conditions are a threading concern in the first place); processes do not, by design. Sharing state between processes needs explicit machinery (`multiprocessing.Value`, `Array`, or passing data back through a `Queue`/`Pipe`) — each with real overhead, which is why processes suit workloads that mostly *do not* need to share much data while working.

## Chunking work

```text
# submitting 100,000 individual tiny tasks: overhead-dominated
pool.map(tiny_task, range(100_000))

# submitting the same work in 100 chunks of 1,000: overhead amortised
pool.map(process_chunk, chunks_of_1000, chunksize=1000)
```

Every task submitted to a process pool carries real overhead — serialising the call, sending it across the process boundary, deserialising the result. If each individual unit of work is small, that overhead can dwarf the actual computation; batching many small items into fewer, larger chunks is how real code avoids this trap.

## joblib, briefly

```text
from joblib import Parallel, delayed

results = Parallel(n_jobs=4)(delayed(process_item)(item) for item in items)
```

`joblib` wraps `multiprocessing` (and other backends) behind a friendlier interface, popular in the data-science ecosystem specifically because it also handles large NumPy arrays efficiently across processes — a case the standard library's pickling-based approach handles less gracefully by default.

## Watch out: assuming more processes always means more speed

Spinning up a process pool has real, fixed startup cost (each worker starts its own interpreter), and coordinating results has real overhead too. For a workload that is small, or already fast, `ProcessPoolExecutor` can easily be *slower* than just doing the work directly in the main process — parallelism has to earn back the overhead of setting it up in the first place.

## Common mistakes

- Trying to pass a `lambda` or a nested function to `ProcessPoolExecutor` and hitting a pickling error.
- Submitting a huge number of very small tasks individually instead of chunking them.
- Reaching for multiprocessing on I/O-bound work where threads (or asyncio) would be simpler and just as fast.
- Assuming shared memory works the same way across processes as it does across threads.
