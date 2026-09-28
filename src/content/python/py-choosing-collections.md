You now know four ways to hold a group of things: lists, tuples, dictionaries and sets. Knowing *when to use which* is what turns knowing the syntax into writing good programs. This lesson gives you a way to decide, and shows why the right choice can make code both simpler and much faster.

## The four at a glance

| | list | tuple | set | dict |
| - | ---- | ----- | --- | ---- |
| Written | `[1, 2]` | `(1, 2)` | `{1, 2}` | `{"a": 1}` |
| Ordered | yes | yes | no | yes (by insertion) |
| Changeable | yes | no | yes | yes |
| Duplicates | allowed | allowed | **no** | keys are unique |
| Look up by | position | position | (membership) | **key** |

## Four questions to ask

**1. Do I need to look things up by a name (a key)?** Use a **dictionary**. "The mass of penguin 12", "the count for each word", "the price of each item".

**2. Do I only care whether something is in the group, or need no duplicates?** Use a **set**. "Which islands appear?", "Have I already seen this id?"

**3. Is it a fixed record of a few related values that should not change?** Use a **tuple**. "A point `(x, y)`", "a date `(2024, 5, 17)`".

**4. Otherwise, is it an ordered collection that grows or changes?** Use a **list**. "All the scores", "the rows of a file".

## Speed: membership tests

Asking `x in group` is the operation where the choice matters most. Watch what happens with a big group. (We use a small timing helper here.)

```python
import time

numbers = list(range(50000))
as_set = set(numbers)

start = time.perf_counter()
for _ in range(100):
    49999 in numbers
list_time = time.perf_counter() - start

start = time.perf_counter()
for _ in range(100):
    49999 in as_set
set_time = time.perf_counter() - start

print("the set was faster:", set_time < list_time)
```

A list has to check items one by one, so its cost grows with its size. A set (and a dictionary) find items almost instantly, however big they are. If you test membership over and over, convert the list to a set first.

## Choosing by example

- **Word counts** → dictionary (word → count).
- **Unique visitors** → set.
- **A list of scores in order of entry** → list.
- **Coordinates of a point** → tuple.
- **A table of people** → a list of dictionaries.
- **Which of these ids are in both files?** → two sets and `&`.
- **Group students by class** → a dictionary of lists.

## Converting between them

You can move between the types when a job needs a different shape:

```python
items = [3, 1, 3, 2]
print(set(items))
print(sorted(set(items)))
print(tuple(items))
print(list((1, 2)))
pairs = [("a", 1), ("b", 2)]
print(dict(pairs))
```

`dict(pairs)` turns a list of two-item tuples into a dictionary, and `list(d.items())` goes back.

## Immutable keys

Only unchangeable items can be dictionary keys or set members. That is one more reason to use a tuple for a coordinate:

```python
visited = {(0, 0), (1, 2)}
print((1, 2) in visited)
```

## Common mistakes

- Using a list where a set is much faster.
- Using two parallel lists (names and ages) where one dictionary would be clearer.
- Using a dictionary when the position is what matters.
- Trying to use a list as a dictionary key or as a set member.

## Recap

- Lookup by name → dictionary. Uniqueness or membership → set. Fixed record → tuple. Ordered, changing collection → list.
- Membership tests are far faster on sets and dictionaries than on lists.
- Convert between them freely: `set`, `list`, `tuple`, `dict`.
- Keys and set members must be unchangeable.
