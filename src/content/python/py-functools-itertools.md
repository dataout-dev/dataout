Python's standard library has two modules full of ready-made tools for working with functions and iterators: `functools` and `itertools`. Knowing them saves you from rewriting the same loops again and again. This lesson is a guided tour.

You will learn:

- `functools.partial`, `lru_cache` and `cache`, `cached_property`, `total_ordering` and `singledispatch`
- `itertools.chain`, `islice`, `groupby`, `product`, `permutations`, `combinations`, `accumulate` and `zip_longest`
- the rule that `groupby` needs sorted input

## partial: fix some arguments

`functools.partial` makes a new function with some arguments already filled in:

```python
from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)
print(square(5), cube(5))

int_from_binary = partial(int, base=2)
print(int_from_binary("1010"))
```

It is a tidy alternative to a small lambda when you pass a function to `map` or `sorted`.

## cache and lru_cache

`functools.cache` remembers the results of a function. When you call the function again with the same arguments, the stored answer is returned:

```python
from functools import cache

calls = 0

@cache
def slow_square(n):
    global calls
    calls += 1
    return n * n

print(slow_square(9), slow_square(9), slow_square(9))
print("real calls:", calls)
```

`lru_cache(maxsize=N)` keeps only the `N` most recently used results, so it does not grow without limit. It also has helpful methods:

```python
from functools import lru_cache

@lru_cache(maxsize=2)
def double(n):
    return n * 2

double(1)
double(2)
double(1)
print(double.cache_info())
double.cache_clear()
```

The arguments must be **hashable** (numbers, text, tuples), because they are used as dictionary keys. A list argument causes an error.

## cached_property, total_ordering and singledispatch

Three more tools for classes and overloading. You will use them fully after the object-oriented tier, but here is a preview:

```python
from functools import total_ordering, singledispatch

@total_ordering
class Version:
    def __init__(self, major, minor):
        self.major, self.minor = major, minor

    def __eq__(self, other):
        return (self.major, self.minor) == (other.major, other.minor)

    def __lt__(self, other):
        return (self.major, self.minor) < (other.major, other.minor)

print(Version(1, 2) <= Version(1, 3), Version(2, 0) > Version(1, 9))

@singledispatch
def describe(value):
    return f"something: {value}"

@describe.register(int)
def _(value):
    return f"an integer: {value}"

@describe.register(list)
def _(value):
    return f"a list of {len(value)}"

print(describe(3), describe([1, 2]), describe("x"))
```

`total_ordering` fills in all the comparison methods from `__eq__` and one other. `singledispatch` picks a version of the function by the **type** of the first argument.

## chain and islice

`chain` joins several iterables into one, and `islice` slices any iterator, including infinite ones:

```python
from itertools import chain, islice, count

print(list(chain("ab", [1, 2], (True,))))
print(list(chain.from_iterable([[1, 2], [3], []])))
print(list(islice(count(1), 5)))
print(list(islice("abcdefgh", 2, 6, 2)))
```

## product, permutations and combinations

These three build **combinatorial** sequences:

```python
from itertools import product, permutations, combinations, combinations_with_replacement

print(list(product("ab", [1, 2])))
print(list(permutations("abc", 2)))
print(list(combinations("abc", 2)))
print(list(combinations_with_replacement("ab", 2)))
```

- `product` is every pairing (a nested loop).
- `permutations` is every **ordering** of a selection (`ab` and `ba` are different).
- `combinations` is every **selection** without regard to order (`ab` and `ba` are the same).

Be careful, because the results grow very quickly. Ten items have 3,628,800 permutations.

## accumulate

`accumulate` gives the running result of a combining function. By default, that is a running sum:

```python
from itertools import accumulate
import operator

print(list(accumulate([1, 2, 3, 4])))
print(list(accumulate([1, 2, 3, 4], operator.mul)))
print(list(accumulate([3, 1, 4, 1, 5], max)))
```

## zip_longest

`zip` stops at the shortest input. `zip_longest` continues to the longest, and fills the gaps:

```python
from itertools import zip_longest

print(list(zip("abc", [1, 2])))
print(list(zip_longest("abc", [1, 2], fillvalue="-")))
```

## groupby

`groupby` groups **consecutive** items that have the same key. It returns pairs of the key and an iterator of the group:

```python
from itertools import groupby

words = ["apple", "avocado", "banana", "blueberry", "cherry"]
for letter, group in groupby(words, key=lambda w: w[0]):
    print(letter, list(group))
```

The catch: it only groups items that are **next to each other**. If the data is not sorted by the key, you get several separate groups for the same key:

```python
data = ["a1", "b1", "a2", "a3"]
print([(k, len(list(g))) for k, g in groupby(data, key=lambda s: s[0])])
print([(k, len(list(g))) for k, g in groupby(sorted(data), key=lambda s: s[0])])
```

**Always sort by the same key first.** Also, each group is a lazy iterator, and is invalidated when the loop moves on, so turn it into a list right away if you need to keep it.

## Two newer helpers

Python 3.10 and 3.12 added `pairwise` and `batched`:

```python
from itertools import pairwise, batched

print(list(pairwise([1, 4, 9, 16])))
print([list(b) for b in batched("abcdefg", 3)])
```

`pairwise` gives overlapping pairs (useful for differences), and `batched` cuts an iterable into pieces of a given size.

## Common mistakes

- Using `groupby` on unsorted data.
- Keeping a `groupby` group after the loop has moved on.
- Passing an unhashable argument, such as a list, to a cached function.
- Building all permutations of a long list.

## Recap

- `partial` fixes arguments. `cache` and `lru_cache` remember results.
- `chain`, `islice`, `accumulate`, `zip_longest`, `pairwise` and `batched` are the everyday iterator tools.
- `product`, `permutations` and `combinations` produce combinatorial sequences.
- `groupby` needs input sorted by the same key.

## Your turn

In the **Practice** tab you write `all_pairs(items)` with `itertools`. Then three challenges use the Chinook store.
