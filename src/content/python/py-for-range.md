Computers are excellent at repeating things. A **loop** runs the same block of code many times, so you do not have to write it out again and again. The `for` loop is the loop you will use most: it takes a group of things and runs a block once for each one.

## Your first for loop

```python
for number in [1, 2, 3]:
    print("Number", number)
```

Read it as: "for each `number` in this group, run the indented block". On each round, the name `number` refers to the next item. The block is marked, as always, by a colon and indentation.

## Looping over a string

A string is a sequence of characters, so you can loop over its letters:

```python
for letter in "Hi!":
    print(letter)
```

## range(): a sequence of numbers

Most of the time you want to repeat something a set number of times, or walk through numbers. `range()` makes them for you:

```python
for i in range(5):
    print(i)
```

Notice that it starts at **0** and stops **before** 5. That mirrors slicing: `range(5)` gives 0, 1, 2, 3, 4.

You can give a start, and a step:

```python
print(list(range(2, 8)))
print(list(range(0, 10, 2)))
print(list(range(5, 0, -1)))
```

(`list(...)` just shows all the numbers at once.) `range(2, 8)` starts at 2 and stops before 8. `range(0, 10, 2)` counts in twos. A negative step counts down.

## The accumulator pattern

The most common thing a loop does is **build up an answer**. You start with a starting value before the loop, then update it on every round:

```python
total = 0
for n in range(1, 6):
    total = total + n
print(total)
```

That adds 1 + 2 + 3 + 4 + 5. The variable `total` is called an **accumulator**. Get in the habit of choosing a sensible starting value: `0` for a sum, `1` for a product, an empty string for text you are building.

```python
text = ""
for letter in "abc":
    text = text + letter.upper()
print(text)
```

## Loops and if

You can put an `if` inside a loop to act only on some items. Here we add only the even numbers:

```python
total = 0
for n in range(1, 11):
    if n % 2 == 0:
        total += n
print(total)
```

## Looping over a list of dictionaries

Real data often arrives as a list of records. Each record is a **dictionary**, which stores named values. You read a value with square brackets and the name in quotes:

```python
people = [{"name": "Ada", "age": 36}, {"name": "Bob", "age": 41}]
for person in people:
    print(person["name"], person["age"])
```

You will meet dictionaries properly in a later section. For now, notice that `person["name"]` looks up the `name`. The penguin data you will use in the real-data challenges has exactly this shape.

## Unused loop variables

If you only want to repeat something and do not need the counter, name the variable `_`:

```python
for _ in range(3):
    print("hello")
```

## Common mistakes

- Expecting `range(5)` to include 5. It stops at 4.
- Forgetting to set the accumulator before the loop, or setting it inside, so it resets each time.
- Changing the loop variable inside the loop and expecting it to affect the next round.
- Forgetting the colon or the indentation.
- Off-by-one errors: `range(1, n)` stops at `n - 1`. Use `range(1, n + 1)` to include `n`.

## Recap

- `for item in group:` runs a block once for every item.
- `range(stop)`, `range(start, stop)` and `range(start, stop, step)` produce numbers, stopping before `stop`.
- The accumulator pattern: set a starting value, then update it in the loop.
- Combine `for` with `if` to act on only some items.

## Your turn

In the **Practice** tab you are given a whole number `n`. Add up all the numbers below `n` that are multiples of 3 or 5.
