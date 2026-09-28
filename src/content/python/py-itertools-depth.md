You met `itertools` briefly in the functional tools section. Here we go deeper: how to generate every combination or arrangement, how to group data properly, how to split an iterator into copies, and how to read the recipes in the official documentation. These tools make problems about "all possible ..." short and clear.

You will learn:

- `product`, `permutations`, `combinations` and `combinations_with_replacement` in depth
- how quickly they grow, and how to count them
- `groupby` recipes
- `tee` and why iterators are one-shot
- `accumulate`, `pairwise` and `batched`
- the recipes in the documentation

## Counting the possibilities

Before you generate a combinatorial sequence, count it. The `math` module has the formulas:

```python
import math
from itertools import product, permutations, combinations, combinations_with_replacement

print(math.perm(5, 2), math.comb(5, 2))
print(len(list(permutations(range(5), 2))), len(list(combinations(range(5), 2))))
print(len(list(product(range(5), repeat=2))), len(list(combinations_with_replacement(range(5), 2))))
```

| Function | Order matters? | Repeats allowed? | Count for `n` items, `r` picks |
| -------- | -------------- | ---------------- | ------------------------------ |
| `product(items, repeat=r)` | yes | yes | `n ** r` |
| `permutations(items, r)` | yes | no | `n! / (n-r)!` |
| `combinations(items, r)` | no | no | `n! / (r! (n-r)!)` |
| `combinations_with_replacement(items, r)` | no | yes | `(n+r-1)! / (r! (n-1)!)` |

The results grow **fast**. Ten items have 3,628,800 permutations, and thirty items have more subsets than there are seconds in a human life. Always compute the size first, and use the results lazily.

## product

`product` is a nested loop written as one call. It pairs every item of the first iterable with every item of the next:

```python
print(list(product("ab", [1, 2, 3])))
print(len(list(product("ab", repeat=3))))
print(["".join(p) for p in product("01", repeat=3)])
```

Password guessing, grid coordinates, all the outcomes of dice rolls: all are a `product`.

```python
dice = list(product(range(1, 7), repeat=2))
print(len(dice), sum(1 for a, b in dice if a + b == 7))
```

## permutations

`permutations(items, r)` gives every **ordering** of `r` picks:

```python
print(list(permutations("abc")))
print(list(permutations("abc", 2)))
```

Anagrams, seating plans, routes through a list of towns: all are permutations. The items are treated by **position**, not by value, so repeated values appear repeated:

```python
print(len(list(permutations("aab"))), len(set(permutations("aab"))))
```

## combinations

`combinations(items, r)` gives every **selection**, without regard to order, so `("a", "b")` and `("b", "a")` are the same one:

```python
print(list(combinations("abcd", 2)))
print([c for c in combinations([1, 2, 3, 4, 5], 3) if sum(c) == 9])
```

The results come out in the order of the input, so a sorted input gives sorted tuples.

## The power set

The **power set** is the set of all subsets, including the empty one and the full one. It is the combinations of every size, chained together:

```python
from itertools import chain

def power_set(items):
    items = list(items)
    return list(chain.from_iterable(combinations(items, size) for size in range(len(items) + 1)))

print(power_set([1, 2, 3]))
print(len(power_set(range(10))))
```

A set of `n` items has `2 ** n` subsets.

## groupby recipes

`groupby` groups **neighbouring** items with the same key. Remember to sort by the same key first. A typical use: count consecutive runs, or split a sorted list into sections:

```python
from itertools import groupby

data = "aaabccdd"
print([(key, len(list(group))) for key, group in groupby(data)])

people = [("Ada", "UK"), ("Alan", "UK"), ("Grace", "US"), ("Linus", "FI"), ("Ken", "US")]
key = lambda person: person[1]
for country, group in groupby(sorted(people, key=key), key=key):
    print(country, [name for name, _ in group])
```

You must use each `group` before you move on, because the groups share the same underlying iterator.

## tee: several copies of an iterator

An iterator can be used only once. `tee` makes several **independent** iterators from one:

```python
from itertools import tee

first, second = tee(iter([1, 2, 3, 4]))
print(list(first))
print(list(second))

a, b = tee(x * x for x in range(5))
next(b)
print(list(zip(a, b)))
```

`tee` stores the items that one copy has read, and another has not, so it uses memory. If you need the data twice and it fits in memory, a `list` is simpler.

## accumulate, pairwise and batched

```python
from itertools import accumulate, pairwise, batched
import operator

prices = [10, 12, 11, 15, 14]
print(list(accumulate(prices, max)))
print([b - a for a, b in pairwise(prices)])
print(list(accumulate([1, 2, 3, 4], operator.mul)))
print([list(chunk) for chunk in batched(range(7), 3)])
```

`pairwise` (Python 3.10) is perfect for **differences**, and `batched` (3.12) cuts data into chunks.

## Other useful ones

```python
from itertools import islice, cycle, repeat, takewhile, dropwhile, starmap, compress, zip_longest

print(list(takewhile(lambda n: n < 4, [1, 2, 3, 6, 2, 1])))
print(list(dropwhile(lambda n: n < 4, [1, 2, 3, 6, 2, 1])))
print(list(starmap(pow, [(2, 3), (3, 2)])))
print(list(compress("abcdef", [1, 0, 1, 0, 1, 1])))
print(list(islice(cycle("ab"), 5)), list(repeat("x", 3)))
```

## The recipes

The documentation page of `itertools` ends with a section of **recipes**: short functions built from these tools, such as `take`, `flatten`, `unique_everseen`, `partition` and `powerset`. Reading them is a very good way to learn how to combine the pieces, and you can copy them into your own code.

## Common mistakes

- Turning a huge combinatorial iterator into a list.
- Using `groupby` on unsorted data.
- Reusing an iterator, instead of using `tee` or a list.
- Forgetting that `permutations` treats equal values as different items.

## Recap

- Compute the size with `math.perm` and `math.comb`, then use the iterators lazily.
- `product` is a nested loop, `permutations` counts orderings, and `combinations` counts selections.
- The power set is `chain.from_iterable` of `combinations` for every size.
- `groupby` needs sorted input, and `tee` copies an iterator.

## Your turn

In the **Practice** tab you write `power_set(items)`. Then three challenges use the Chinook store.
