Reading complexity off a page of code is useful, but sometimes the fastest way to understand how something scales is to actually run it at a few sizes and look at the numbers.

You will learn:

- timing code with `time.perf_counter` as the input grows
- why the **ratio** between consecutive timings matters more than the raw numbers
- why the smallest inputs give the least trustworthy timings
- picking a worst-case input on purpose, instead of hoping you stumbled on one

## Timing a growing input

```python
import time

def sum_of_squares(n):
    return sum(i * i for i in range(n))

def timed(fn, n):
    start = time.perf_counter()
    fn(n)
    return time.perf_counter() - start

sizes = [1_000, 2_000, 4_000]
times = [timed(sum_of_squares, n) for n in sizes]
print(len(times))
```

Each doubling of `n` should roughly double the time for a linear algorithm. If the algorithm were quadratic, each doubling would roughly *quadruple* the time instead — that ratio is the signal you are looking for, not the absolute seconds.

## Why the first measurement lies

Fixed overhead — starting the timer, warming up caches, one-off setup — is roughly constant, no matter how big `n` is. For a *small* n, that fixed overhead can be a large fraction of the total time, making a linear algorithm briefly look quadratic (or a quadratic one look linear) before the trend settles down. The practice below asks you to trust only the ratio between the **two largest** measurements for exactly this reason — `label_growth`'s first timing is a distraction, not evidence.

```python
# A tiny, noisy measurement can mislead you:
noisy_times = [0.0011, 0.0050, 0.0100]   # looks quadratic early, then flattens to linear
big_step_ratio = noisy_times[2] / noisy_times[1]
print(round(big_step_ratio, 2))
```

## Picking a worst-case input

Timing is only meaningful if the input actually exercises the case you care about. A sorting algorithm timed only on already-sorted data will not reveal its worst case; searching for a value that is never in the list will. When you design a benchmark, ask what input would make the algorithm work hardest, and test that on purpose rather than by accident.

## Benchmarking pitfalls

- Timing once and trusting it — a single measurement includes noise from the operating system scheduler, garbage collection, and whatever else is running. Take a few measurements and use the smallest or the median.
- Including one-time setup (like building a large test list) inside the timed section, when only the algorithm itself should be measured.
- Comparing timings taken on different machines, or under different load, as if they were directly comparable.

## Common mistakes

- Drawing a conclusion from one data point instead of a trend across growing sizes.
- Trusting the smallest, noisiest measurement over the largest, most stable one.
- Confusing "this ran fast on my test data" with "this scales well" — they are not the same claim.
