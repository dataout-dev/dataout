A function is allowed to call itself. This is called **recursion**, and it is one of the most beautiful ideas in programming. Many problems that involve something made of smaller copies of itself, such as folders inside folders, become short and clear when written recursively. It also takes a little practice to see. This lesson introduces the idea gently.

## A function that calls itself

Here is the classic first example: counting down.

```python
def countdown(n):
    if n == 0:
        print("liftoff")
    else:
        print(n)
        countdown(n - 1)

countdown(3)
```

`countdown(3)` prints 3 and then calls `countdown(2)`, which prints 2 and calls `countdown(1)`, and so on. The chain stops when `n` reaches 0.

## The two parts of every recursion

Every correct recursive function has:

1. A **base case**: a situation simple enough to answer directly, with no further call. This is what stops the recursion.
2. A **recursive case**: the function calls itself on a *smaller* version of the problem.

If you forget the base case, or the problem never gets smaller, the function calls itself forever. Python protects you by raising a `RecursionError` after about a thousand nested calls:

<!-- expect-error -->
```python
def broken(n):
    return broken(n - 1)

broken(5)
```

## Factorial

The factorial of `n`, written `n!`, is `1 × 2 × ... × n`. Notice that `n! = n × (n-1)!`, a smaller factorial. The base case is `0! = 1`.

```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
```

Follow what happens for `factorial(3)`:

```text
factorial(3) = 3 * factorial(2)
             = 3 * (2 * factorial(1))
             = 3 * (2 * (1 * factorial(0)))
             = 3 * (2 * (1 * 1))
             = 6
```

Each call waits for the smaller one to answer. This uses the call stack you met in the scope lesson: each call gets its own frame.

## Summing a list recursively

The sum of a list is its first item plus the sum of the rest:

```python
def total(numbers):
    if not numbers:
        return 0
    return numbers[0] + total(numbers[1:])

print(total([1, 2, 3, 4]))
```

The base case is the empty list. The recursive case shrinks the list by one item.

## Fibonacci

In the Fibonacci sequence, each number is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, ...

```python
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print([fib(i) for i in range(10)])
```

This one has **two** base cases (`fib(0)` and `fib(1)` are just `n`) and two recursive calls. It is easy to write but slow for big `n`, because it recomputes the same values again and again. Try `fib(30)`. It takes a moment, and `fib(40)` would take very long. Later you will learn to fix this with **memoisation**, which remembers earlier answers.

## Recursion versus loops

Anything you can do with recursion, you can do with a loop, and the reverse. Recursion is often shorter and clearer when the problem is naturally nested, such as folders, family trees or puzzles. A loop is usually faster and uses less memory, because it does not create a frame for each step.

```python
def factorial_loop(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

print(factorial_loop(5))
```

## The recursion limit

Python limits how deep the recursion can go, so a mistake gives a clear error instead of crashing your computer:

```python
import sys

print(sys.getrecursionlimit())
```

For very large inputs, switch to a loop.

## Common mistakes

- Forgetting the base case.
- A recursive call that does not make the problem smaller.
- Returning nothing from the recursive case, so the result is `None`.
- Using recursion for simple repetition, where a `for` loop is clearer.

## Recap

- A recursive function calls itself, with a smaller problem each time.
- It needs a base case that stops the calls.
- Each call has its own frame on the call stack.
- Python limits the depth, and slow recursions such as `fib` can be sped up later with memoisation.

## Your turn

In the **Practice** tab you write `fib(n)` recursively, or with a loop if you prefer, for the n-th Fibonacci number.
