The `collections` module has specialised containers that solve common jobs better than plain lists and dictionaries: counting, grouping, queues, records and layered settings. Knowing them removes a lot of hand-written loops.

You will learn:

- `Counter` for counting and `most_common`
- `defaultdict` for grouping
- `deque` for queues and sliding windows
- `namedtuple` for lightweight records
- `ChainMap` for layered settings
- a note about `OrderedDict`
- a warning about `defaultdict` creating keys on read

## Counter

A `Counter` is a dictionary that counts. Give it any iterable, and it tells you how often each item appears:

```python
from collections import Counter

counts = Counter("mississippi")
print(counts)
print(counts["s"], counts["z"])
print(counts.most_common(2))
```

A missing item gives `0`, and does not raise a `KeyError`. `most_common(n)` returns the `n` biggest counts as `(item, count)` pairs, largest first. **Items with equal counts come in the order they were first seen**, not alphabetically, which matters when you need a stable result:

```python
words = "b a c a b d".split()
print(Counter(words).most_common())
print(sorted(Counter(words).items(), key=lambda item: (-item[1], item[0])))
```

Counters can be added, subtracted and updated:

```python
a = Counter("aabbc")
b = Counter("abc")
print(a + b)
print(a - b)
a.update("zz")
print(a)
print(list(Counter("hello").elements()))
print(sum(a.values()), len(a))
```

Subtraction drops results that are zero or negative.

## defaultdict

A `defaultdict` creates a missing value on demand, using a **factory function** you give it. That removes the "if the key is not there yet" step from grouping loops:

```python
from collections import defaultdict

groups = defaultdict(list)
for word in ["apple", "avocado", "banana", "blueberry", "cherry"]:
    groups[word[0]].append(word)
print(dict(groups))

totals = defaultdict(int)
for letter in "hello":
    totals[letter] += 1
print(dict(totals))

nested = defaultdict(lambda: defaultdict(int))
nested["a"]["x"] += 2
print({k: dict(v) for k, v in nested.items()})
```

The factory (`list`, `int`, `set`, `lambda: ...`) is called with no arguments whenever a **missing key is read**.

## The defaultdict trap

Because a read creates the key, even a harmless look-up changes the dictionary:

```python
seen = defaultdict(list)
print("x" in seen)
seen["x"]
print("x" in seen)
print(len(seen))
```

Use `in` or `.get(key)` when you only want to **check**. Both leave the dictionary alone. When you are finished collecting, convert with `dict(groups)`, so that later mistakes raise an error instead of silently adding keys.

## deque

A `deque` (pronounced "deck") is a **double-ended queue**. Adding and removing at **either end** is fast. A list is slow at the front, because every item has to move.

```python
from collections import deque

queue = deque([1, 2, 3])
queue.append(4)
queue.appendleft(0)
print(queue)
print(queue.popleft(), queue.pop())
print(queue)
queue.rotate(1)
print(queue)
```

A `deque` with `maxlen` keeps only the **most recent** items, dropping the oldest. That makes a neat **sliding window**:

```python
window = deque(maxlen=3)
averages = []
for value in [10, 20, 30, 40, 50]:
    window.append(value)
    averages.append(sum(window) / len(window))
print(list(window))
print(averages)
```

## namedtuple

A `namedtuple` is a tuple whose items also have **names**. It is light, immutable, and readable:

```python
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p, p.x, p[1])
x, y = p
print(x + y)
print(p._asdict())
print(p._replace(x=10))
print(Point._fields)
```

Fields are read with a dot or with an index, and the tuple still unpacks. You cannot change a field. `_replace` makes a modified copy. (A later tier shows `dataclass`, which is the more flexible alternative.)

## ChainMap

A `ChainMap` looks up a key in **several dictionaries, in order**, without merging them. It is ideal for layered settings: command line, then environment, then defaults:

```python
from collections import ChainMap

defaults = {"colour": "red", "size": "M"}
user = {"colour": "blue"}
settings = ChainMap(user, defaults)
print(settings["colour"], settings["size"])
settings["size"] = "L"
print(user, defaults["size"])
print(dict(settings))
```

Reads search all the layers from first to last. Writes go only to the **first** dictionary, so the defaults stay intact.

## OrderedDict

Regular dictionaries have kept **insertion order** since Python 3.7, so you rarely need `OrderedDict` today. It still has two special features: `move_to_end`, and equality that **checks the order**:

```python
from collections import OrderedDict

od = OrderedDict(a=1, b=2, c=3)
od.move_to_end("a")
print(list(od))
print(OrderedDict(a=1, b=2) == OrderedDict(b=2, a=1), {"a": 1, "b": 2} == {"b": 2, "a": 1})
```

## Common mistakes

- Assuming `most_common` sorts ties alphabetically.
- Reading a `defaultdict` key just to check it, and creating it.
- Using a list as a queue with `pop(0)`, when a `deque` is faster.
- Trying to change a `namedtuple` field.

## Recap

- `Counter` counts, and `most_common(n)` gives the top items. Ties keep the first-seen order.
- `defaultdict(factory)` creates values on demand. Reading a missing key creates it.
- `deque` is a fast queue at both ends, and `maxlen` gives a sliding window.
- `namedtuple` gives named fields, and `ChainMap` layers dictionaries.

## Your turn

In the **Practice** tab you write `top_n(items, n)`. Then three challenges use the Chinook store.
