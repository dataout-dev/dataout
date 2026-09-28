In Foundations you met recursion: a function that calls itself. This lesson goes further. You will learn a way of **thinking** recursively, see why a naive recursive function can be absurdly slow, and fix it with **memoisation**. You will also meet Python's recursion limit, and how to turn recursion into a loop.

You will learn:

- how to think about a problem in a recursive way
- why recomputing the same subproblem is so costly
- memoisation with a dictionary and with `lru_cache`
- the recursion depth limit and `RecursionError`
- turning recursion into a loop
- mutual recursion

## The recursive way of thinking

Every recursive solution has the same two parts:

1. A **base case**: a small input that has an obvious answer.
2. A **recursive case**: a way to reduce the problem to a smaller one of the same kind.

For example, the number of ways to climb `n` stairs when you can take 1 or 2 steps at a time is: `ways(n) = ways(n - 1) + ways(n - 2)`. You reach step `n` from step `n - 1` or from `n - 2`.

```python
def ways(n):
    if n <= 1:
        return 1
    return ways(n - 1) + ways(n - 2)

print([ways(n) for n in range(8)])
```

That is correct, but it has a serious flaw.

## Recomputing the same thing

Let us count how many calls `ways` makes:

```python
calls = 0

def ways(n):
    global calls
    calls += 1
    if n <= 1:
        return 1
    return ways(n - 1) + ways(n - 2)

for n in (5, 10, 15, 20):
    calls = 0
    ways(n)
    print(n, calls)
```

The number of calls **grows exponentially**. `ways(20)` makes over 20,000 calls, and `ways(40)` would take hundreds of millions. The reason is that `ways(3)` is computed again and again from different branches.

## Memoisation

**Memoisation** means storing the result of each call, so the second time you need `ways(3)`, you look it up. With a dictionary:

```python
def ways(n, memo=None):
    if memo is None:
        memo = {}
    if n <= 1:
        return 1
    if n not in memo:
        memo[n] = ways(n - 1, memo) + ways(n - 2, memo)
    return memo[n]

print(ways(50))
```

Each value is computed once, so the work is proportional to `n` instead of exponential.

## lru_cache does it for you

`functools.cache` (and `lru_cache`) adds the memo with a single line:

```python
from functools import cache

@cache
def ways(n):
    if n <= 1:
        return 1
    return ways(n - 1) + ways(n - 2)

print(ways(80))
print(ways.cache_info())
```

The function stays clean, and the cache is separate. The arguments must be hashable.

## Change-making

A second classic problem: in how many ways can you make an amount from a set of coins? For each coin, either use it (and reduce the amount), or skip it (and never use it again):

```python
from functools import cache

def ways_to_change(amount, coins):
    coins = tuple(coins)

    @cache
    def go(remaining, index):
        if remaining == 0:
            return 1
        if remaining < 0 or index == len(coins):
            return 0
        use = go(remaining - coins[index], index)
        skip = go(remaining, index + 1)
        return use + skip

    return go(amount, 0)

print(ways_to_change(5, [1, 2, 5]))
print(ways_to_change(100, [1, 5, 10, 25, 50]))
```

The inner function has two changing arguments, `remaining` and `index`, and the cache remembers each pair. This is the beginning of a large topic called **dynamic programming**.

## The recursion limit

Every call uses some memory on the **call stack**, so Python limits how deep the recursion may go, to protect the computer:

```python
import sys

print(sys.getrecursionlimit() >= 1000)
```

A function with no base case, or an input that is simply too large, reaches the limit and fails with a `RecursionError`:

<!-- expect-error -->
```python
def countdown(n):
    return countdown(n - 1)

countdown(10)
```

You could raise the limit with `sys.setrecursionlimit`, but that only postpones the problem, and can crash the interpreter. If your recursion is very deep, rewrite it as a loop.

## Recursion into a loop

Many recursive functions can be turned into loops with the same variables. The recursive sum of a list:

```python
def total(items):
    if not items:
        return 0
    return items[0] + total(items[1:])

def total_loop(items):
    result = 0
    for item in items:
        result += item
    return result

data = list(range(100))
print(total(data), total_loop(data))
```

The loop version has no depth limit and does not copy the list at each step. Recursion is the best fit when the data is **naturally nested**, such as folders, trees and nested lists. For flat sequences, a loop is usually better.

The Fibonacci numbers show the same idea. A loop keeps just the last two values:

```python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fib(10), fib(90))
```

## Mutual recursion

Two functions can call each other. Each has its own base case:

```python
def is_even(n):
    return True if n == 0 else is_odd(n - 1)

def is_odd(n):
    return False if n == 0 else is_even(n - 1)

print(is_even(10), is_odd(7), is_even(7))
```

It works, but a plain `n % 2` is better. Mutual recursion is useful when reading grammars and nested structures that have two alternating shapes.

## Common mistakes

- Forgetting the base case, or a base case that the recursion never reaches.
- Not noticing that the same subproblem is computed many times.
- Caching a function that has side effects or unhashable arguments.
- Recursing on a very long flat list and reaching the recursion limit.

## Recap

- Think in a base case and a recursive case that shrinks the problem.
- Naive recursion that overlaps can be exponentially slow. Memoise with a dictionary or `functools.cache`.
- Python limits the recursion depth. Deep or flat problems are better as loops.
- Recursion is at its best for nested data.

## Your turn

In the **Practice** tab you write `ways_to_change(amount, coins)`. Then three challenges use the Chinook store.
