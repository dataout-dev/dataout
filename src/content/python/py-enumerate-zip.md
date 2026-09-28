Very often you need more than just the items when you loop. You want to know **which** item it is (its position), or you want to walk through **two groups at the same time**. Python has two friendly tools for this: `enumerate` and `zip`.

## The problem with range(len(...))

You might be tempted to loop over positions:

```python
names = ["Ada", "Bob", "Cy"]
for i in range(len(names)):
    print(i, names[i])
```

It works, but it is clumsy. There is a cleaner way.

## enumerate: item and position together

`enumerate` hands you a pair on each round: the position and the item.

```python
names = ["Ada", "Bob", "Cy"]
for position, name in enumerate(names):
    print(position, name)
```

By default counting starts at 0. To start at 1, which is nicer for people, add `start=1`:

```python
names = ["Ada", "Bob", "Cy"]
for number, name in enumerate(names, start=1):
    print(f"{number}. {name}")
```

The two names before `in` receive the two parts of the pair. This is called **unpacking**, and you will see more of it in the collections section.

## zip: two groups side by side

`zip` pairs up items from two (or more) groups, first with first, second with second:

```python
names = ["Ada", "Bob", "Cy"]
scores = [90, 72, 85]
for name, score in zip(names, scores):
    print(name, score)
```

If the groups have different lengths, `zip` stops at the **shortest**:

```python
letters = ["a", "b", "c"]
numbers = [1, 2]
for letter, number in zip(letters, numbers):
    print(letter, number)
```

The `"c"` never appears. Keep that in mind when data might be uneven.

## Combining them

You can use both together. Put the `zip` inside `enumerate`, and unpack with brackets:

```python
names = ["Ada", "Bob", "Cy"]
scores = [90, 72, 85]
for rank, (name, score) in enumerate(zip(names, scores), start=1):
    print(f"{rank}. {name}: {score}")
```

## reversed and sorted

Two more helpers walk through a group without changing it:

```python
names = ["Ada", "Bob", "Cy"]
for name in reversed(names):
    print(name)

for name in sorted(["pear", "apple", "fig"]):
    print(name)
```

`reversed` goes backwards. `sorted` goes in order. Neither changes the original.

## Building a table

Here is a small report that uses everything from this lesson:

```python
items = ["tea", "coffee", "milk"]
prices = [2.5, 3.0, 1.2]
lines = ""
for n, (item, price) in enumerate(zip(items, prices), start=1):
    lines += f"{n}. {item:<8}{price:>6.2f}\n"
print(lines)
```

## Common mistakes

- Forgetting `start=1` and being surprised that the numbering begins at 0.
- Assuming `zip` keeps going when one group is longer. It stops at the shortest.
- Unpacking into the wrong number of names. `for a, b in zip(x, y, z)` fails, because each item has three parts.
- Using `range(len(...))` when `enumerate` would be clearer.

## Recap

- `enumerate(group)` gives `(position, item)` pairs, and `start=1` changes the first number.
- `zip(a, b)` pairs up two groups and stops at the shorter one.
- `reversed` and `sorted` loop in a different order without changing the original.

## Your turn

In the **Practice** tab you are given two lists, `names` and `scores`. Build one text called `report` that has a line for each pair in the form `1. Ada: 90`, each line ending with a new line character.
