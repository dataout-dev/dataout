In Python, functions are **values**, just like numbers and text. You can store a function in a variable, put it in a list, pass it to another function and return it from one. A function that takes or returns another function is called a **higher-order function**. This lesson covers the built-in and standard tools for working that way.

You will learn:

- functions as values
- `map` and `filter`, and why they return iterators
- `functools.reduce`
- the `key` argument of `sorted`, `min` and `max`
- `operator.itemgetter` and `attrgetter`
- composing functions

## Functions are values

```python
def shout(text):
    return text.upper() + "!"

action = shout
print(action("hello"))

operations = [str.upper, str.title, len]
for op in operations:
    print(op("data out"))
```

Note the missing parentheses: `shout` is the function, `shout("x")` is a call.

## map

`map(function, items)` applies the function to every item. It returns an **iterator**, so wrap it in `list` to see the results:

```python
numbers = [1, 2, 3, 4]
print(list(map(lambda n: n * n, numbers)))
print(list(map(str.strip, ["  a ", "b  "])))
print(list(map(pow, [2, 3, 4], [1, 2, 3])))
```

With several sequences, `map` passes one item from each. It stops at the shortest one. A list comprehension often reads better, but `map` is neat when you already have a named function.

## filter

`filter(function, items)` keeps the items for which the function returns a **truthy** value:

```python
print(list(filter(lambda n: n % 2 == 0, range(10))))
print(list(filter(None, [0, 1, "", "a", None, [], [0]])))
```

Giving `None` as the function keeps the truthy items.

## They are lazy

Because `map` and `filter` return iterators, nothing is computed until you ask for the items. An iterator can also be used **only once**:

```python
squares = map(lambda n: n * n, [1, 2, 3])
print(list(squares))
print(list(squares))
```

The second `list` is empty, because the iterator was already used up. Convert to a list if you need the results twice.

## reduce

`functools.reduce(function, items, start)` combines all the items into **one value**, calling the function with the result so far and the next item:

```python
from functools import reduce

print(reduce(lambda total, n: total + n, [1, 2, 3, 4], 0))
print(reduce(lambda a, b: a * b, [1, 2, 3, 4, 5]))
print(reduce(max, [3, 9, 2]))
```

For sums, products and maxima, the built-ins `sum`, `math.prod` and `max` are clearer. `reduce` is for combining in your own way, for example merging dictionaries.

## The key function

`sorted`, `min`, `max` and `list.sort` accept a `key` function. It is called once per item, and the results are used for the comparison:

```python
words = ["banana", "fig", "cherry", "kiwi"]
print(sorted(words, key=len))
print(max(words, key=len))
print(min(words, key=lambda w: w[-1]))
print(sorted(words, key=lambda w: (len(w), w)))
```

A tuple as the key sorts by several things at once. Negating a number sorts in reverse for that part: `key=lambda w: (-len(w), w)` puts the longest first, and breaks ties alphabetically.

## itemgetter and attrgetter

The `operator` module has ready-made functions for the most common keys. `itemgetter` picks items by index or key:

```python
from operator import itemgetter

people = [{"name": "Ada", "age": 36}, {"name": "Alan", "age": 41}, {"name": "Grace", "age": 85}]
print(sorted(people, key=itemgetter("age"), reverse=True)[0]["name"])
pairs = [("b", 2), ("a", 3), ("c", 1)]
print(sorted(pairs, key=itemgetter(1)))
print(itemgetter("name", "age")(people[0]))
```

`itemgetter` is a little faster than a lambda, and it says clearly what you mean. `attrgetter` does the same for attributes of objects.

## Composing functions

Since functions are values, you can build a new function from smaller ones. This **composition** function chains single-argument functions, from the left to the right:

```python
def compose(*functions):
    def combined(value):
        for function in functions:
            value = function(value)
        return value
    return combined

clean = compose(str.strip, str.lower, lambda s: s.replace(" ", "-"))
print(clean("  Hello Big World "))
```

Chains of small, well-named functions are easier to test than one large function.

## Common mistakes

- Printing a `map` object and being surprised that it does not show the results.
- Using an iterator twice.
- Writing a lambda that does what a built-in already does (`lambda x: len(x)` instead of `len`).
- Using `reduce` where `sum`, `max` or a loop would be clearer.

## Recap

- Functions are values: store them, pass them and return them.
- `map` and `filter` are lazy and return iterators, and `reduce` combines all items into one.
- `key=` customises `sorted`, `min` and `max`. Use tuples for several criteria.
- `itemgetter` and `attrgetter` are the tidy way to write common keys.

## Your turn

In the **Practice** tab you write `compose(*funcs)`. Then three challenges use the Chinook store.
