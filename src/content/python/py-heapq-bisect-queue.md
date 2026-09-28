Some jobs need the **biggest** item, the **next** item to process, or a **sorted list** that stays sorted as you add to it. The standard library has efficient tools for each: `heapq` for priority queues, `bisect` for sorted lists, `array` for compact number storage and `queue` for passing work between threads.

You will learn:

- `heapq`: heaps and priority queues
- `nlargest` and `nsmallest`
- `bisect` for searching and inserting in sorted lists
- the `array` module
- `queue.Queue` and its friends
- why `heapq` is a min-heap

## heapq

A **heap** is a list arranged so that its **smallest** item is always at position 0. Adding and removing take about `log n` steps, much faster than sorting the whole list again. The `heapq` module works on an ordinary list:

```python
import heapq

heap = []
for value in [5, 1, 8, 3, 2]:
    heapq.heappush(heap, value)
print(heap[0])
print([heapq.heappop(heap) for _ in range(len(heap))])
```

`heappush` adds an item, and `heappop` removes and returns the **smallest**. Reading `heap[0]` peeks at the smallest without removing it. Turn an existing list into a heap in place with `heapify`:

```python
data = [9, 4, 7, 1, 3]
heapq.heapify(data)
print(data[0])
print(heapq.heappushpop(data, 0))
print(heapq.heapreplace(data, 10))
```

## It is a min-heap

Python's heap gives the **smallest** first. For the **largest** first, push the **negated** values:

```python
scores = [30, 90, 60]
max_heap = [-s for s in scores]
heapq.heapify(max_heap)
print(-heapq.heappop(max_heap))
```

## Priority queues

Push tuples of `(priority, item)`. The heap compares them tuple-wise, so the item with the lowest priority number comes out first. Add a counter as a tie-breaker, so equal priorities keep their order and the items themselves never have to be compared:

```python
import itertools

counter = itertools.count()
tasks = []
for priority, name in [(2, "write"), (1, "plan"), (2, "test"), (3, "ship")]:
    heapq.heappush(tasks, (priority, next(counter), name))

while tasks:
    priority, _, name = heapq.heappop(tasks)
    print(priority, name)
```

## nlargest and nsmallest

To get the `k` biggest or smallest items **without sorting everything**, use these two functions. They are ideal for "top ten" lists over a large data set or a stream:

```python
print(heapq.nlargest(3, [5, 1, 9, 3, 7]))
print(heapq.nsmallest(2, [5, 1, 9, 3, 7]))

words = ["fig", "banana", "kiwi", "cherry", "apple"]
print(heapq.nlargest(2, words, key=len))
print(heapq.nsmallest(2, [{"n": 3}, {"n": 1}, {"n": 2}], key=lambda d: d["n"]))
```

They accept **any iterable**, including a generator, and take a `key`. For small `k`, they are faster than `sorted(data)[:k]`, and they use little memory. If `k` is close to the size of the data, `sorted` is the better choice.

## Merging sorted data

`heapq.merge` combines several **already sorted** inputs into one sorted stream, lazily:

```python
print(list(heapq.merge([1, 4, 7], [2, 5, 8], [0, 3, 6])))
```

## bisect

`bisect` searches a **sorted** list with **binary search**, halving the range at every step. It finds where a value belongs:

```python
import bisect

scores = [10, 20, 20, 30, 40]
print(bisect.bisect_left(scores, 20))
print(bisect.bisect_right(scores, 20))
print(bisect.bisect_left(scores, 25))
```

- `bisect_left` gives the position **before** any equal items.
- `bisect_right` (also called `bisect`) gives the position **after** them.

`insort` inserts and keeps the list sorted:

```python
bisect.insort(scores, 25)
print(scores)
```

A very handy use is looking a value up in a table of **ranges**, such as grade boundaries:

```python
def grade(score):
    breakpoints = [60, 70, 80, 90]
    letters = "FDCBA"
    return letters[bisect.bisect(breakpoints, score)]

print([grade(s) for s in [55, 60, 75, 89, 90, 100]])
```

Both `bisect` and the heap functions accept a `key` in recent Python versions.

## array

An `array` stores numbers of **one type** compactly, using much less memory than a list of Python objects:

```python
from array import array
import sys

small = array("i", range(1000))
big = list(range(1000))
print(small.typecode, small.itemsize)
print(sys.getsizeof(small) < sys.getsizeof(big) + 1000 * 28)
small.append(5)
print(small[-1], small.tolist()[:3])
```

For heavy numeric work, the third-party `numpy` library is far more capable, but `array` is handy for simple cases without installing anything.

## queue

The `queue` module has thread-safe queues, for passing work between threads:

```python
import queue

fifo = queue.Queue()
for item in "abc":
    fifo.put(item)
print([fifo.get() for _ in range(fifo.qsize())])

lifo = queue.LifoQueue()
for item in "abc":
    lifo.put(item)
print([lifo.get() for _ in range(lifo.qsize())])

priority = queue.PriorityQueue()
priority.put((2, "b"))
priority.put((1, "a"))
print(priority.get())
```

`Queue` is first in, first out. `LifoQueue` is a stack (last in, first out), and `PriorityQueue` is a thread-safe heap. For a single thread, `collections.deque` and `heapq` are lighter.

## Common mistakes

- Expecting `heapq` to give the largest item first.
- Using `bisect` on a list that is **not sorted**.
- Pushing items that cannot be compared, without a tie-breaker.
- Using `heap[1]` as if it were the second smallest. Only `heap[0]` is guaranteed.

## Recap

- `heappush`, `heappop` and `heapify` make a min-heap. Negate values for a max-heap.
- `nlargest` and `nsmallest` find the top items without a full sort.
- `bisect` searches and inserts in sorted lists, and is good for range look-ups.
- `array` stores numbers compactly, and `queue` is for threads.

## Your turn

In the **Practice** tab you write `top_k(stream, k)`. Then three challenges use the Chinook store.
