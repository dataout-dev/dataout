A **set** is a collection of items with no duplicates and no order. It sounds humble, but a set answers two kinds of question very well and very quickly: "is this item in the group?" and "what do these two groups have in common?". Removing duplicates from a list is a classic use.

## Creating a set

Sets are written with curly brackets, but with single items, not key-value pairs:

```python
colours = {"red", "green", "blue", "red"}
print(colours)
```

The duplicate `"red"` was dropped. The order you see may differ from the order you typed, because a set does not keep order.

To make a set from a list, or from text, use `set()`:

```python
print(set([3, 1, 3, 2, 1]))
print(set("banana"))
```

An empty set must be written `set()`, because `{}` is an empty **dictionary**.

## Adding and removing

```python
s = {1, 2}
s.add(3)
s.add(2)
print(s)
s.discard(10)
s.remove(1)
print(s)
```

- `add` puts an item in. Adding something already there does nothing.
- `remove` deletes an item and raises an error if it is missing. `discard` does not raise.

## Fast membership tests

Asking `x in s` is very fast, even for millions of items, whereas a list has to look at items one by one. If you test membership over and over, put the items in a set.

```python
allowed = {"csv", "json", "txt"}
print("json" in allowed)
print("pdf" in allowed)
```

## Set operations

Sets follow the maths you may know from Venn diagrams:

```python
a = {1, 2, 3, 4}
b = {3, 4, 5}
print(a | b)
print(a & b)
print(a - b)
print(a ^ b)
```

| Operator | Name | Meaning |
| -------- | ---- | ------- |
| `a \| b` | union | in either |
| `a & b` | intersection | in both |
| `a - b` | difference | in `a` but not in `b` |
| `a ^ b` | symmetric difference | in one but not both |

There are matching methods: `union`, `intersection`, `difference` and `symmetric_difference`.

## Subsets

```python
print({1, 2} <= {1, 2, 3})
print({1, 2, 3} >= {1})
print({1, 2}.isdisjoint({3, 4}))
```

`<=` asks "is this a subset?". `isdisjoint` asks whether the sets share nothing.

## Removing duplicates

```python
values = [3, 1, 3, 2, 1]
unique = set(values)
print(unique)
```

To get a sorted list without duplicates:

```python
values = [3, 1, 3, 2, 1]
print(sorted(set(values)))
```

To remove duplicates and **keep the original order**, use a dictionary trick, because dictionaries remember order:

```python
values = [3, 1, 3, 2, 1]
print(list(dict.fromkeys(values)))
```

## What can go in a set?

Only items that cannot change, meaning strings, numbers and tuples. A list cannot be an item of a set:

<!-- expect-error -->
```python
bad = {[1, 2], [3]}
```

## Set comprehensions

A compact way to build a set from a loop:

```python
lengths = {len(word) for word in ["a", "bb", "cc", "ddd"]}
print(lengths)
```

## Common mistakes

- Writing `{}` and expecting an empty set.
- Relying on the order of a set.
- Putting a list inside a set.
- Using a list for repeated membership tests when a set would be far faster.

## Recap

- A set holds unique, unordered items: `{1, 2, 3}` or `set(items)`.
- `in` is fast, and `add`, `remove` and `discard` change it.
- `|`, `&`, `-` and `^` give union, intersection, difference and symmetric difference.
- `sorted(set(items))` is a quick way to get the distinct items.

## Your turn

In the **Practice** tab you are given two lists, `a` and `b`. Find the items in both, the items only in `a`, and how many different items there are in total.
