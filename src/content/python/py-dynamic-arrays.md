A Python `list` feels like magic: you `append` to it forever and it just grows. Underneath, it is a **dynamic array** — a fixed-size block of contiguous memory that occasionally has to be replaced by a bigger one.

You will learn:

- how a dynamic array stores items contiguously, with some spare room at the end
- why growth means allocating a **new, bigger** block and copying everything across
- why doubling the capacity (rather than growing by a fixed amount) is what makes `append` amortised O(1)
- the classic 2-D array pitfall: a list of lists that all secretly share one row

## The core idea

```python
class TinyArray:
    def __init__(self, capacity=1):
        self._capacity = capacity
        self._size = 0
        self._data = [None] * capacity

    def append(self, value):
        if self._size == self._capacity:
            self._grow()
        self._data[self._size] = value
        self._size += 1

    def _grow(self):
        self._capacity *= 2
        bigger = [None] * self._capacity
        for i in range(self._size):
            bigger[i] = self._data[i]
        self._data = bigger

a = TinyArray()
for i in range(5):
    a.append(i)
print(a._size, a._capacity)
```

Notice `_capacity` grows in powers of two (1, 2, 4, 8, ...) even though you only asked for 5 appends — there is spare room left over, ready for the next few appends to be free.

## Why doubling, not "+1 each time"

If growth added a *fixed* amount of space each time (say, +1), you would need to copy the whole array on **every single append past the initial size** — n copies for n appends, which is O(n squared) overall. Doubling means the total amount of copying across all the growth steps up to size n is at most `1 + 2 + 4 + ... + n`, which sums to under `2n` — spread over n appends, that is O(1) per append on average. This is exactly what "amortised" means: individual calls vary, but the average over many calls is constant.

## Insert and delete cost

```python
items = [1, 2, 3, 4, 5]
items.insert(0, 0)     # O(n): every item shifts right by one slot
items.pop()            # O(1): just shrink the used length
items.pop(0)           # O(n): every remaining item shifts left by one slot
print(items)
```

Anything at the **end** is cheap. Anything at the **front or middle** requires shifting every item after it, because the array is contiguous — there is no way to "make a hole" without moving things.

## 2-D arrays: a real pitfall

```python
# WRONG: every row is the SAME list object
grid = [[0] * 3] * 3
grid[0][0] = 1
print(grid)   # every row changed!

# RIGHT: build each row separately
grid = [[0] * 3 for _ in range(3)]
grid[0][0] = 1
print(grid)   # only the first row changed
```

`[[0] * 3] * 3` repeats the *same inner list* three times — there is only one list object, referenced three times. A list comprehension creates a genuinely new list on each iteration.

## Common mistakes

- Using `list.insert(0, x)` or `list.pop(0)` in a loop and being surprised it is slow — both are O(n), not O(1).
- Building a 2-D grid with `[[value] * cols] * rows` and getting shared rows.
- Assuming a dynamic array's capacity always equals its length — it doesn't; `len()` reports the used size, not the allocated capacity.
