Functions in Python are **values**, just like numbers and strings. You can store a function in a variable, put it in a list, and pass it to another function. That idea is the key to some of the most useful tools in the language, such as sorting by a custom rule. This lesson shows how, and introduces the `lambda`, a way to write a very small function in one line.

## Functions are values

```python
def shout(text):
    return text.upper() + "!"

speak = shout
print(speak("hello"))
```

`speak` is now another name for the same function. Note that we wrote `shout` **without** brackets. With brackets you *call* it. Without, you refer to the function itself.

## Passing a function to another function

Here is a function that takes another function as an argument and applies it:

```python
def apply(func, value):
    return func(value)

print(apply(len, "hello"))
print(apply(str.upper, "hello"))
```

## sorted with a key

The most common use is sorting by a rule. The `key` argument is a function that gets each item and returns the value to sort by:

```python
words = ["pear", "fig", "banana", "kiwi"]
print(sorted(words))
print(sorted(words, key=len))
```

The second line sorts by length. Python calls `len` on every word and sorts by the result. The same works for `max` and `min`:

```python
words = ["pear", "fig", "banana", "kiwi"]
print(max(words, key=len))
print(min(words, key=len))
```

## lambda: a function without a name

Sometimes the rule is so small that a full `def` feels heavy. A **lambda** is a small, unnamed function written in one line:

```python
square = lambda n: n * n
print(square(5))
```

The word `lambda` is followed by the parameters, a colon, and the single expression it returns. It has no `return` keyword, because the expression is the result.

That was only for demonstration. Where lambdas really shine is as a throwaway function passed straight in:

```python
people = [("Ada", 36), ("Bob", 41), ("Cy", 29)]
by_age = sorted(people, key=lambda person: person[1])
print(by_age)
oldest = max(people, key=lambda person: person[1])
print(oldest)
```

`lambda person: person[1]` reads: "given a person, return their second item".

## Sorting by several things

A key can return a **tuple**, and tuples compare item by item. To sort by score descending and then by name, negate the number:

```python
players = [("Cy", 85), ("Ada", 90), ("Bob", 85)]
ranked = sorted(players, key=lambda p: (-p[1], p[0]))
print(ranked)
```

## Sorting dictionaries

Rows of data are often dictionaries, so the key reads a field:

```python
rows = [{"name": "Ada", "age": 36}, {"name": "Bob", "age": 41}]
oldest_first = sorted(rows, key=lambda row: row["age"], reverse=True)
print(oldest_first)
```

## A table of functions

Since functions are values, you can keep them in a dictionary to choose one at run time. This replaces a long `if`/`elif` chain:

```python
operations = {
    "add": lambda a, b: a + b,
    "multiply": lambda a, b: a * b,
}
print(operations["add"](2, 3))
print(operations["multiply"](2, 3))
```

## When not to use a lambda

A lambda can only contain one expression. If you need several lines, or the rule is worth a name, write a normal `def`. Do not assign a lambda to a name just to reuse it. A `def` is clearer.

```python
def by_length_then_alpha(word):
    return (len(word), word)

print(sorted(["fig", "kiwi", "pear", "apple"], key=by_length_then_alpha))
```

## Common mistakes

- Calling the function when you meant to pass it: `key=len()` instead of `key=len`.
- Trying to put several statements in a lambda.
- Sorting with a key that returns `None` for some items, which causes a `TypeError`.
- Forgetting that `sorted` returns a new list and `list.sort` changes the list in place.

## Recap

- Functions are values: store them, pass them, return them.
- `sorted`, `min` and `max` accept `key=function`.
- `lambda args: expression` is a one-line, unnamed function.
- Use a `def` when the rule needs more than one expression or deserves a name.

## Your turn

In the **Practice** tab you write `rank(pairs)`, which sorts a list of `(name, score)` pairs with the highest score first and ties in alphabetical order.
