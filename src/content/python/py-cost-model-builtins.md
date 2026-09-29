Python's built-in types are not all the same underneath. Knowing what each one actually costs lets you pick the right tool before performance becomes a problem, instead of after.

You will learn:

- the real cost of `list`, `dict`, `set` and `deque` operations
- why `x in list` and `x in set` are worlds apart for large collections
- why `list.append` is fast but `list.insert(0, x)` is not
- `heapq` and `bisect`: two modules that hide a fast algorithm inside a simple call

## Lists: contiguous and fast at the end, slow at the front

```python
values = list(range(5))
values.append(5)          # O(1) amortised — the end of the list
values.insert(0, -1)      # O(n) — every other item shifts right by one
print(values)
```

A list is stored as one contiguous block of memory. Adding or removing at the **end** just changes the used length, but adding or removing at the **start** (or middle) means physically shifting every item after it. `values.pop(0)` has the same problem as `insert(0, ...)`, for the same reason.

## Sets and dicts: hashing gives you O(1) lookups

```python
big_list = list(range(100_000))
big_set = set(big_list)

print(99_999 in big_set)   # O(1) on average — jump straight to the bucket
print(99_999 in big_list)  # O(n) — may have to scan the whole thing
```

A `set` (and a `dict`'s keys) uses hashing: the value's hash tells Python roughly where to look, so membership testing does not depend on how many items are stored. This is the single most common "swap the data structure, not the algorithm" optimisation.

## deque: O(1) at both ends

```python
from collections import deque

queue = deque([1, 2, 3])
queue.appendleft(0)   # O(1) — a deque is a doubly linked block structure
queue.popleft()       # O(1)
print(queue)
```

Use `deque` instead of `list` whenever you need to add or remove from the *front* repeatedly — a queue, a sliding window, an undo history.

## heapq and bisect: an algorithm hiding in a module

```python
import heapq

numbers = [5, 1, 8, 2, 9]
heapq.heapify(numbers)          # O(n) — arrange into heap order
smallest = heapq.heappop(numbers)  # O(log n) — much cheaper than sorting again
print(smallest, numbers)
```

`heapq` maintains a binary heap on top of a plain list, giving O(log n) push/pop instead of O(n log n) for re-sorting. `bisect` does the equivalent for keeping a list sorted: `bisect.insort` finds the right spot with binary search (O(log n) to *find* it, though the insertion itself still shifts elements).

## sorted() and its cost

`sorted()` is O(n log n) — Python's Timsort is very good in practice, and is the right default whenever you need order. Do not write your own sort "for speed"; you will not beat it.

## Common mistakes

- Using a `list` for membership testing in a hot loop, when a `set` would turn an O(n) check into O(1).
- Building a queue with `list.pop(0)`, which is O(n) per call, instead of `collections.deque`.
- Re-`sorted()`-ing a whole list every time you need the smallest item, instead of maintaining a `heapq`.
