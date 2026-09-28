Every data library in this tier is built on one idea: the **ndarray**, NumPy's fast, fixed-type array. This lesson explains why it exists, what it costs to use one, and the main ways to build one.

You will learn:

- why arrays beat plain Python lists for numeric work
- `dtype`, and what it costs you if you ignore it
- `array`, `zeros`, `ones`, `full`, `arange`, `linspace`, `eye`
- a first look at copies versus views

## Lists versus arrays

A Python list can hold anything, and pays for that flexibility: each element is a separate Python object, scattered in memory, accessed through a pointer. A NumPy array stores one fixed type in one contiguous block of memory, so arithmetic on it runs as tight, compiled loops instead of a Python `for` loop over individual objects.

```python
import numpy as np

numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(doubled)

arr = np.array([1, 2, 3, 4, 5])
print(arr * 2)
```

Both print similar-looking results, but `arr * 2` runs as one vectorised operation over the whole array, while `doubled` runs a Python-level loop. On a five-element list the difference is invisible; on a million-element array it is the difference between milliseconds and seconds.

## dtype

Every array has one `dtype`: every element is the same type, chosen once.

```python
import numpy as np

ints = np.array([1, 2, 3])
floats = np.array([1.0, 2.0, 3.0])
print(ints.dtype, floats.dtype)
```

**Watch out:** mixing types in the input list silently **upcasts** the whole array to whatever type can hold every value, usually without an error or a warning:

```python
import numpy as np

mixed = np.array([1, 2, 3.5])
print(mixed.dtype, mixed)
```

Every element became a float, including the `1` and `2`, because a single array cannot hold two different types at once.

## Building arrays

```python
import numpy as np

print(np.zeros((2, 3)))
print(np.ones((2, 3)))
print(np.full((2, 2), 7))
print(np.arange(0, 10, 2))
print(np.linspace(0, 1, 5))
print(np.eye(3))
```

`zeros`/`ones`/`full` build an array of a given shape filled with a constant. `arange(start, stop, step)` is like `range`, but returns an array. `linspace(start, stop, n)` returns `n` evenly spaced values **including both ends** (unlike `arange`, which excludes `stop`). `eye(n)` builds an `n`×`n` identity matrix.

## A first look at copies and views

Slicing an array does not necessarily copy it — later lessons cover this in depth, but it is worth seeing once now:

```python
import numpy as np

a = np.array([1, 2, 3, 4, 5])
b = a[1:3]
b[0] = 99
print(a)
```

Changing `b` changed `a`, because `b` is a **view** onto the same memory, not an independent copy. This is a real source of bugs until you get used to it.

## Common mistakes

- Assuming a NumPy array can hold mixed types the way a list can; it always upcasts to one common type instead.
- Forgetting that `linspace`'s `stop` is included, while `arange`'s is not.
- Being surprised when editing a slice changes the original array.
- Reaching for a Python loop out of habit, on data that is already a NumPy array.

## Recap

- Arrays store one fixed `dtype` in contiguous memory, which is what makes vectorised operations fast.
- Mixed-type input is silently upcast to one common type.
- `zeros`, `ones`, `full`, `arange`, `linspace` and `eye` cover most array-building needs.
- A slice can be a **view**: changing it can change the original array.

## Your turn

In the **Practice** tab you write `border_array()`, a 5×5 array with a border of 1s. Then three challenges use real data.
