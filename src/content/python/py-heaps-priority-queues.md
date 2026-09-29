A heap answers one question extremely well: "what is the smallest (or largest) thing I currently have?" — in O(log n) per update, without ever fully sorting anything.

You will learn:

- what a binary heap is, and how `heapq` implements one on top of a plain list
- keeping only the top k items in a stream, with a heap of size k
- merging several already-sorted sequences with `heapq.merge`
- the running-median trick with two heaps

## heapq is a min-heap

```python
import heapq

numbers = [5, 1, 8, 2, 9]
heapq.heapify(numbers)          # O(n): arrange in heap order, in place
print(heapq.heappop(numbers))   # O(log n): always the smallest
heapq.heappush(numbers, 0)      # O(log n)
print(numbers[0])                # the smallest is always at index 0
```

`heapq` only gives you a **min**-heap. To simulate a max-heap, push negated values and negate them back on the way out — this trick appears constantly in heap-based code, including the running median below.

## Top k with a heap of size k

Keeping every item and sorting at the end is O(n log n). Keeping a heap that never exceeds size k is O(n log k) — much better when k is small:

```python
import heapq

def top_k(stream, k):
    heap = []
    for v in stream:
        heapq.heappush(heap, v)
        if len(heap) > k:
            heapq.heappop(heap)   # discard the current smallest of the k kept
    return sorted(heap, reverse=True)

print(top_k([5, 1, 9, 3, 7, 2], k=3))
```

The heap holds the k **largest values seen so far**. Whenever a new value pushes the heap past size k, the smallest of the current top-k is evicted — so only genuinely large values survive to the end.

## Merging sorted sequences

```python
import heapq

a = [1, 4, 7]
b = [2, 3, 9]
print(list(heapq.merge(a, b)))
```

`heapq.merge` walks both inputs together, always emitting the smallest of the two current fronts — O(n + m) total, versus O((n+m) log(n+m)) for concatenating and re-sorting from scratch. It generalises directly to merging any number of sorted inputs at once.

## Running median with two heaps

```python
import heapq

def running_medians(stream):
    lo, hi, medians = [], [], []   # lo: max-heap (negated) for the smaller half
    for v in stream:
        if not lo or v <= -lo[0]:
            heapq.heappush(lo, -v)
        else:
            heapq.heappush(hi, v)
        if len(lo) > len(hi) + 1:
            heapq.heappush(hi, -heapq.heappop(lo))
        elif len(hi) > len(lo):
            heapq.heappush(lo, -heapq.heappop(hi))
        medians.append(-lo[0] if len(lo) > len(hi) else (-lo[0] + hi[0]) / 2)
    return medians

print(running_medians([5, 2, 8, 1]))
```

`lo` holds the smaller half of the values seen so far (as negatives, so its top is the largest of the small half); `hi` holds the larger half. Rebalancing after every insert keeps the sizes within one of each other, so the median is always available at the top of one or both heaps, without ever re-sorting the whole stream.

## Common mistakes

- Forgetting `heapq` is a min-heap and expecting `heap[0]` to be the largest.
- Popping when the heap has fewer than k items — checking `len(heap) > k` (not `>=`) after each push keeps exactly k, never fewer.
- Concatenating and sorting sequences that are already individually sorted, instead of using `heapq.merge` to do it in linear time.
