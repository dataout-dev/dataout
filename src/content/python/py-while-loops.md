A `for` loop is perfect when you know what to loop over. But sometimes you do not know in advance how many rounds you need. You want to keep going **until something happens**. That is what the `while` loop is for.

## The while loop

A `while` loop repeats its block as long as a condition is true. Python checks the condition before every round:

```python
count = 3
while count > 0:
    print(count)
    count -= 1
print("liftoff")
```

Three things make a working `while` loop:

1. **A starting state**: `count = 3`.
2. **A condition** that is true at first: `count > 0`.
3. **A change** inside the loop that eventually makes the condition false: `count -= 1`.

If you forget the third, the loop never ends. That is called an **infinite loop**. If it ever happens, press **Stop**, and nothing is damaged.

## When to use while

Use `for` to go through a known group. Use `while` when you are waiting for a condition, such as "keep halving until the number is small":

```python
value = 1000
steps = 0
while value >= 1:
    value = value / 2
    steps += 1
print(steps)
```

## break: stop early

`break` leaves the loop immediately, whatever the condition says:

```python
n = 0
while True:
    n += 1
    if n * n > 50:
        break
print(n)
```

`while True` says "loop forever", and `break` is the way out. This pattern is common when the stopping test is easier to write inside the loop.

## continue: skip to the next round

`continue` jumps straight to the next round without running the rest of the block:

```python
n = 0
while n < 6:
    n += 1
    if n % 2 == 0:
        continue
    print(n)
```

Only the odd numbers are printed.

## The else clause on a loop

Loops can have an `else` block. It runs only when the loop ends **normally**, not by `break`. It is handy for "search, and say if not found":

```python
target = 7
n = 2
while n < 6:
    if n == target:
        print("found")
        break
    n += 1
else:
    print("not found")
```

Change `target` to `4` and run it again.

## A useful example: Collatz

Here is a famous puzzle. Start with any number. If it is even, halve it. If it is odd, triple it and add 1. Repeat until you reach 1. How many steps does it take?

```python
n = 6
steps = 0
while n != 1:
    if n % 2 == 0:
        n = n // 2
    else:
        n = 3 * n + 1
    steps += 1
print(steps)
```

Nobody has ever proved that every starting number reaches 1, yet the loop always ends in practice. Try `n = 27`.

## Common mistakes

- Forgetting to change the variable used in the condition, which makes an infinite loop.
- Making the condition false from the start, so the loop never runs.
- Using `while` where a simple `for` over a range would do.
- Forgetting that `continue` skips any update written *after* it, which can also cause an endless loop.

## Recap

- `while condition:` repeats as long as the condition is true.
- Something inside the loop must eventually make the condition false.
- `break` leaves the loop, `continue` skips to the next round, and an `else` runs when no `break` happened.
- Use `while` when you do not know how many rounds you need.

## Your turn

In the **Practice** tab you are given a positive whole number `n`. Count how many Collatz steps it takes to reach 1.
