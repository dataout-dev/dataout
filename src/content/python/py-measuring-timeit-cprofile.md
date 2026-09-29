"This should be faster" is a guess until you measure it. Python has two standard tools for that: `timeit` for "how long does this one small piece of code take", and `cProfile` for "where, across a whole program, is the time actually going".

You will learn:

- using `timeit` correctly
- `cProfile` and reading a profile with `pstats`
- micro-benchmarks versus macro-benchmarks
- noise, warm-up, and why a single run is not enough
- not optimising before measuring

## timeit, correctly

```python
import timeit

t1 = timeit.timeit("sum(range(100))", number=10000)
t2 = timeit.timeit("total = 0\nfor x in range(100): total += x", number=10000)
print(f"sum(): {t1:.4f}s, manual loop: {t2:.4f}s")
```

`timeit` runs a snippet many times (`number=10000` here) and reports total elapsed time — a single run of a fast snippet is dominated by measurement noise, so repetition is what makes the number meaningful. Comparing `sum(range(...))` to a hand-written loop is the classic first example: the built-in is implemented in C and reliably wins.

## cProfile and pstats

```python
import cProfile
import pstats
import io

def slow_function():
    total = 0
    for i in range(10000):
        total += i ** 2
    return total

profiler = cProfile.Profile()
profiler.enable()
slow_function()
profiler.disable()

stream = io.StringIO()
stats = pstats.Stats(profiler, stream=stream).sort_stats("cumulative")
stats.print_stats(5)
print(stream.getvalue()[:300])
```

`cProfile` instruments an entire run and reports, per function, how many times it was called and how much total time it accounted for. Where `timeit` answers "how fast is this specific line", `cProfile` answers "across my whole program, which function is actually the bottleneck" — a question you often cannot answer just by staring at the code.

## Reading a profile

The key columns in a `pstats` report are `ncalls` (how many times a function ran), `tottime` (time spent in that function alone, excluding functions it called), and `cumtime` (total time including everything it called). A function with high `cumtime` but low `tottime` is not itself slow — something *it calls* is; that is where to look next.

## Micro versus macro benchmarks

A micro-benchmark (`timeit` on one expression) tells you which of two small operations is faster in isolation. A macro-benchmark (timing or profiling a whole realistic workload) tells you whether that difference actually matters once everything else the program does is accounted for — a function that is "2x faster" in isolation can be irrelevant if it only ever accounts for 1% of total runtime.

## Noise and warm-up

```python
import timeit

times = timeit.repeat("sum(range(1000))", repeat=5, number=1000)
print(times)
```

A single measurement can be skewed by other work happening on the machine at that moment, or by one-time costs (importing a module, warming up a cache). `timeit.repeat` runs the whole benchmark several times and returns a list — looking at the minimum (not the average) of several repeats is the usual advice, since the minimum best represents the code's actual best-case cost with the least outside interference.

## Watch out: optimising without measuring

```python
# "optimised" by hand, without ever profiling first
def maybe_faster(items):
    return [x for x in items if x is not None]  # was this the actual bottleneck?
```

Rewriting a piece of code because it *looks* like it should be slow, without a profile pointing at it, routinely wastes effort on code that was never the bottleneck — while the real slow part goes untouched. Profile first, then optimise exactly what the profile identifies.

## Common mistakes

- Timing a snippet once and trusting that single number.
- Micro-optimising a function that a profiler would show accounts for a tiny fraction of total runtime.
- Comparing `timeit` numbers measured under very different conditions (different machine load, different Python version) as if they were directly comparable.
- Reading `cumtime` as if it were `tottime`, and chasing the wrong function as a result.
