A loop can contain another loop. That is called **nesting**, and it is the natural way to work with anything that has rows and columns: tables, grids, or every pair of items in a group. In this lesson you will learn how nested loops run, how many times, and how to use them safely.

## How nested loops run

The inner loop runs completely for every single round of the outer loop:

```python
for row in range(3):
    for col in range(4):
        print(row, col)
```

Read the output carefully. First `row` is 0 and `col` goes through 0, 1, 2, 3. Then `row` becomes 1 and the inner loop starts again from the beginning. In total, the `print` runs 3 × 4 = 12 times.

## A grid of stars

Printing shapes is the classic way to practise:

```python
for row in range(1, 5):
    line = ""
    for col in range(row):
        line += "*"
    print(line)
```

Each `row` builds a line with `row` stars. Because the inner loop runs `row` times, the triangle grows. There is often a shortcut with string multiplication (`"*" * row`), but the nested version shows how the loops work.

## A multiplication table

```python
for i in range(1, 4):
    line = ""
    for j in range(1, 4):
        line += f"{i * j:4}"
    print(line)
```

The format `:4` gives each number a width of 4, so the columns line up.

## Every pair

If you need to compare each item with each other item, use two loops. To avoid comparing an item with itself and counting each pair twice, start the inner loop after the outer one:

```python
letters = "abcd"
for i in range(len(letters)):
    for j in range(i + 1, len(letters)):
        print(letters[i] + letters[j])
```

That prints every unordered pair once: ab, ac, ad, bc, bd, cd.

## How much work is it?

Nested loops multiply. If the outer loop runs `n` times and the inner one `m` times, the body runs `n * m` times. With two loops over the same 1000 items, that is a million rounds. This is why nesting is powerful, but also why you should be careful with big data. You will see more about this in the algorithms tier.

## Getting out of two loops

`break` only leaves the **innermost** loop. To stop both, use a flag, or put the code in a function and `return`:

```python
found = False
for i in range(1, 10):
    for j in range(1, 10):
        if i * j == 42:
            found = True
            break
    if found:
        break
print(i, j)
```

## Use different names for the counters

Do not reuse the same variable name in both loops. The inner loop would overwrite the outer variable and cause hard-to-find mistakes. Names such as `row` and `col`, or `i` and `j`, keep them apart.

## Common mistakes

- Reusing the same loop variable in the inner and outer loop.
- Forgetting that the inner loop restarts on every outer round.
- Expecting `break` to leave both loops.
- Nesting loops over big groups without thinking about how many rounds that makes.

## Recap

- The inner loop runs completely for each round of the outer loop.
- The body of two nested loops runs `n * m` times.
- Start the inner loop at `i + 1` to visit each pair once.
- `break` only leaves the loop it is in.

## Your turn

In the **Practice** tab you are given a whole number `n`. Build a right-angled triangle of `*` with `n` rows, as one text with the rows separated by new lines.
