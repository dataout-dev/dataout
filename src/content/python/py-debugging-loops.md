Loops are where most beginner bugs live. They run many times, so a small mistake gets repeated, and it can be hard to see what went wrong. The good news is that the same few techniques find nearly every loop bug. This lesson teaches them, and lists the classic mistakes so you can recognise them on sight.

You will learn:

- how to trace a loop by hand with a table
- how to use `print` to watch a loop run
- the "off-by-one" family of bugs
- how to test loops with small and awkward inputs

## Trace it by hand

Before you run a loop, or when its output is wrong, **execute it on paper**. Choose a very small input and write down the variables after each round.

```python
total = 0
for n in range(1, 4):
    total = total + n
print(total)
```

| round | n | total (after) |
| ----- | - | ------------- |
| start | | 0 |
| 1 | 1 | 1 |
| 2 | 2 | 3 |
| 3 | 3 | 6 |

The table says the answer is 6. If the program prints something else, you know your idea of the loop and the real loop differ, and the table shows where.

## Watch it run with print

Adding a `print` inside the loop shows what really happens. It is the fastest way to find a bug:

```python
total = 0
for n in range(1, 4):
    total = total + n
    print("n =", n, "total =", total)
```

Remove the extra prints when you have fixed the problem.

## The off-by-one family

The most common loop bug is being wrong by exactly one. It has several disguises:

**1. `range` stops early.** `range(1, 10)` does not include 10:

```python
print(list(range(1, 5)))
```

If you wanted 1 to 5, write `range(1, 6)`.

**2. Starting at 0 or 1.** Position numbers start at 0, but people count from 1.

**3. `<` versus `<=`.** A `while n < 5` loop stops before 5, and `while n <= 5` includes it.

**4. Counting fences and posts.** Ten posts have nine gaps between them. If you loop over the gaps, you need `n - 1` rounds.

**5. Slices.** `text[1:4]` has three characters, not four.

Whenever a result is wrong by one, check each of these five.

## Infinite loops

If your program never stops, a `while` condition never becomes false. Look at the variable in the condition, and check that it changes in the right direction:

```python
n = 10
while n > 0:
    print(n)
    n -= 3
```

Do not press Run on a loop you suspect could go on forever without knowing you can press **Stop**.

## Resetting in the wrong place

Setting an accumulator inside the loop resets it every round:

```python
for n in range(1, 4):
    total = 0
    total += n
print(total)
```

The answer is `3`, not `6`, because `total` was set back to 0 each time. Move `total = 0` above the loop.

## Changing what you loop over

Changing a group while you are looping over it produces odd results. For example, removing items from a list as you go skips some. Loop over a copy, or build a new list of the items you want to keep.

## Test the edges

Try your loop on:

- **nothing**: an empty text or `range(0)`
- **one item**
- **the boundary** where a condition just becomes true
- **a negative or zero input**

Most loop bugs show up at these edges.

## Common mistakes

- Debugging by changing code at random instead of tracing.
- Fixing the symptom (adding 1 to the answer) instead of the cause.
- Testing only the example that works.
- Leaving the debugging `print` lines in the final code.

## Recap

- Trace a loop by hand with a table, or watch it with `print`.
- Learn the five off-by-one disguises.
- Keep the accumulator outside the loop, and change the loop variable in a `while` loop.
- Test with nothing, one item and the boundaries.
