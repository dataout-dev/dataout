Dictionaries really shine in a few standard recipes: **counting** things, **grouping** them, and **nesting** dictionaries inside dictionaries. These patterns solve a huge share of everyday data problems, so they are worth learning as patterns.

## Pattern 1: counting

Count how often each word appears:

```python
words = ["red", "blue", "red", "green", "blue", "red"]
counts = {}
for word in words:
    if word in counts:
        counts[word] += 1
    else:
        counts[word] = 1
print(counts)
```

For each word: if we have seen it, add 1, otherwise start at 1. There is a shorter version with `get`:

```python
words = ["red", "blue", "red", "green", "blue", "red"]
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
print(counts)
```

`counts.get(word, 0)` gives the current count, or 0 for a new word.

The standard library has a ready-made tool, `Counter`:

```python
from collections import Counter

words = ["red", "blue", "red", "green", "blue", "red"]
print(Counter(words))
print(Counter(words).most_common(2))
```

## Pattern 2: grouping

Group items by some property, such as the first letter:

```python
words = ["apple", "avocado", "banana", "blueberry", "cherry"]
groups = {}
for word in words:
    letter = word[0]
    if letter not in groups:
        groups[letter] = []
    groups[letter].append(word)
print(groups)
```

The idea: each key gets its own list, and we append to the right one. `setdefault` does the "create if missing" step in one call:

```python
words = ["apple", "avocado", "banana"]
groups = {}
for word in words:
    groups.setdefault(word[0], []).append(word)
print(groups)
```

`defaultdict` from the standard library does the same automatically:

```python
from collections import defaultdict

groups = defaultdict(list)
for word in ["apple", "avocado", "banana"]:
    groups[word[0]].append(word)
print(dict(groups))
```

## Pattern 3: nested dictionaries

A dictionary of dictionaries is a table of tables. For example, counts of colour per size:

```python
orders = [("small", "red"), ("small", "blue"), ("large", "red"), ("small", "red")]
table = {}
for size, colour in orders:
    inner = table.setdefault(size, {})
    inner[colour] = inner.get(colour, 0) + 1
print(table)
```

Read a value with two lookups: `table["small"]["red"]`.

## Pattern 4: sorting by value

A dictionary has no order to sort, but you can sort its items:

```python
counts = {"red": 3, "blue": 2, "green": 1}
ordered = sorted(counts.items(), key=lambda item: item[1], reverse=True)
print(ordered)
```

(`lambda` is a tiny function, explained in the functions section. For now, read `item[1]` as "the count".)

## Pattern 5: inverting

Swap keys and values, when the values are unique:

```python
names = {"a": "Ada", "b": "Bob"}
inverted = {}
for key, value in names.items():
    inverted[value] = key
print(inverted)
```

## Changing a dictionary while looping

Do not add or remove keys from a dictionary while looping over it. Python raises an error. Loop over a list of the keys instead, or build a new dictionary.

## Common mistakes

- Counting with `counts[word] += 1` for a new word, which is a `KeyError`. Use `get` or check first.
- Creating one shared list for all groups instead of one list per key.
- Changing a dictionary's size while looping over it.
- Forgetting that dictionary lookups use keys, not positions.

## Recap

- Count with `counts[key] = counts.get(key, 0) + 1` or `Counter`.
- Group with `setdefault(key, []).append(item)` or `defaultdict(list)`.
- Nest dictionaries for tables of tables.
- Sort `d.items()` to order by value.

## Your turn

In the **Practice** tab you are given a list of words. Build a dictionary that counts each word, and another that groups the words by their first letter.
