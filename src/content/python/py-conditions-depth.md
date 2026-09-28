You know how to make a decision with `if`. Now let's go deeper. Python has several compact ways to express conditions, and a few habits that make decision code shorter, safer and easier to read. In this lesson we look at combining conditions, testing truthiness the Pythonic way, one-line conditionals, and `any` and `all`.

You will learn:

- how `and` and `or` short-circuit, and how to use that to guard against errors
- why `if items:` is better than `if items != []:`
- how to write a value that depends on a condition in a single line
- how `any()` and `all()` test many things at once

## Short-circuiting

When Python evaluates `a and b`, it looks at `a` first. If `a` is false, the answer is false, so `b` is never looked at. With `or`, it stops as soon as one side is true.

This is useful as a **guard**, a check that stops a dangerous test from running:

```python
text = ""
if len(text) > 0 and text[0] == "A":
    print("starts with A")
else:
    print("empty or not A")
```

If `text` is empty, `text[0]` would crash. The guard `len(text) > 0` stops Python before it gets there.

## Truthiness in conditions

You do not have to compare with `True`, `0` or `""` yourself. Python treats zero, empty text, `None` and empty containers as false, and everything else as true. That lets you write:

```python
items = []
if items:
    print("has items")
else:
    print("nothing here")
```

Prefer `if items:` to `if items != []:` or `if len(items) > 0:`. It is shorter and it works for every kind of container.

The same goes for booleans. Write `if is_valid:` instead of `if is_valid == True:`.

One warning: `0` is falsy. If zero is a valid value, test for `None` explicitly:

```python
count = 0
if count is None:
    print("no value yet")
else:
    print("count is", count)
```

## A value that depends on a condition

You will often write code that sets a variable in two different ways:

```python
age = 20
if age >= 18:
    status = "adult"
else:
    status = "minor"
print(status)
```

Python has a one-line form called the **conditional expression**:

```python
age = 20
status = "adult" if age >= 18 else "minor"
print(status)
```

Read it as: "`adult` if the condition holds, otherwise `minor`". It is best for simple choices. If you find yourself chaining several, use a normal `if/elif`.

## Choosing a default with or

Because `or` returns the first true operand, it gives a neat way to supply a default:

```python
name = ""
shown = name or "anonymous"
print(shown)
```

## any() and all()

`any(...)` is true when **at least one** item is true. `all(...)` is true when **every** item is true. They take a group of things, and are often used with a short loop expression:

```python
scores = [55, 72, 91]
print(any(score >= 90 for score in scores))
print(all(score >= 60 for score in scores))
```

The expression `score >= 90 for score in scores` runs the test on each item. Loops come in a later section, but you can already use this pattern.

## Chained comparisons and `in`

Two more tools keep conditions short:

```python
x = 5
print(1 < x < 10)

colour = "red"
print(colour in ("red", "green", "blue"))
```

`x in (a, b, c)` is much tidier than `x == a or x == b or x == c`.

## Common mistakes

- Testing `if x == True` or `if x == False`.
- Testing `if len(items) > 0` when `if items` says the same thing.
- Using `or` for a default when zero or an empty string is a valid value.
- Chaining many conditional expressions into one unreadable line.

## Recap

- `and` and `or` short-circuit. Use that to guard risky tests.
- Empty values are false. Write `if items:` rather than comparing with `[]`.
- `a if condition else b` picks a value in one line, and `x or default` supplies a default.
- `any` and `all` test whole groups, and `x in (a, b, c)` beats repeated `==`.

## Your turn

In the **Practice** tab you are given a number `n` and a text `text`. Store `"even"` or `"odd"` in `parity` using a conditional expression, and store the text, or the word `"n/a"` when it is empty, in `shown`.
