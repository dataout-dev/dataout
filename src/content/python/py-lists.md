So far each variable has held one value. Real programs need to hold *many*: all the scores in a class, all the rows of a file, every penguin's mass. Python's most important tool for that is the **list**: an ordered collection of items. Almost everything you do with data will involve lists, so this lesson is worth reading slowly.

You will learn:

- how to create a list and read items from it
- how to slice a list, and how indexes work
- the useful built-in functions that work on lists
- that a list holds *references*, and why that matters

## Creating a list

A list is written with square brackets, and its items are separated by commas:

```python
scores = [90, 72, 85]
names = ["Ada", "Bob", "Cy"]
mixed = [1, "two", 3.0, True]
empty = []
print(scores, names, mixed, empty)
```

A list can hold anything, even a mix of types, and even other lists. You can also make one from another group with `list()`:

```python
print(list("abc"))
print(list(range(5)))
```

## Reading items

Lists use the same indexing as strings: positions start at 0, and negative numbers count from the end.

```python
scores = [90, 72, 85, 60]
print(scores[0])
print(scores[2])
print(scores[-1])
```

Asking for a position that does not exist raises an `IndexError`.

## Slicing a list

Slices work exactly as they do for text: `list[start:stop:step]`, with the stop excluded. The result is a **new list**:

```python
scores = [90, 72, 85, 60, 55]
print(scores[1:3])
print(scores[:2])
print(scores[-2:])
print(scores[::-1])
```

## Changing items

Unlike a string, a list is **mutable**: you can change it in place.

```python
scores = [90, 72, 85]
scores[1] = 100
print(scores)
```

## Built-in functions for lists

```python
scores = [90, 72, 85, 60]
print(len(scores))
print(min(scores), max(scores))
print(sum(scores))
print(sum(scores) / len(scores))
print(sorted(scores))
print(90 in scores, 91 in scores)
```

- `len` counts items, `min` and `max` find the extremes, and `sum` adds numbers up.
- `sorted` returns a **new** sorted list and leaves the original alone.
- `in` asks whether an item is in the list.

## Joining and repeating

`+` joins two lists, and `*` repeats one:

```python
print([1, 2] + [3, 4])
print([0] * 5)
```

## Looping over a list

You already know how:

```python
scores = [90, 72, 85]
total = 0
for score in scores:
    total += score
print(total / len(scores))
```

## Lists can hold lists

A list of lists is how you store a table:

```python
grid = [[1, 2, 3], [4, 5, 6]]
print(grid[1][2])
```

`grid[1]` is the second row, and `[2]` picks the third item of that row.

A word of warning. Repeating a list of lists with `*` copies the **reference**, not the inner list:

```python
rows = [[0] * 3] * 2
rows[0][0] = 9
print(rows)
```

Both rows changed. They are the same list. You will see why in the lesson on copying. To build independent rows, use a loop:

```python
rows = []
for _ in range(2):
    rows.append([0] * 3)
rows[0][0] = 9
print(rows)
```

## Common mistakes

- Starting to count at 1 when reading items.
- Forgetting that `sorted()` gives a new list, while modifying methods change the original.
- Using `*` to build a table of lists.
- Reading a position that is not there (`IndexError`), especially in an empty list.

## Recap

- A list is an ordered, changeable collection, written in square brackets.
- Read with `list[i]` and `list[start:stop]`. Negative indexes count from the end.
- `len`, `min`, `max`, `sum`, `sorted` and `in` work on lists.
- Lists are mutable, and a list of lists needs care when you build it.

## Your turn

In the **Practice** tab you are given a list of numbers `nums`. Pick out its first item, its last item, the items in the middle, and its length.
