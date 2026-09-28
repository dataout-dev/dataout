A **comprehension** builds a list, dictionary or set from another sequence in a single readable expression. You met list comprehensions in Foundations. This lesson goes deeper: conditions, nested loops, dictionary and set comprehensions, generator expressions, and how to know when a plain loop is the better choice.

You will learn:

- the shape of a comprehension, and how it maps to a loop
- filtering, and conditional expressions
- nested loops
- dictionary and set comprehensions
- generator expressions and their memory advantage
- readability limits

## From loop to comprehension

This loop builds a list:

```python
squares = []
for n in range(6):
    squares.append(n * n)
print(squares)
```

The comprehension says the same in one line: **what** to build, **for** each item:

```python
print([n * n for n in range(6)])
```

The order to read it: `for n in range(6)` produces the items, and the expression at the front is the result for each.

## Filtering with if

An `if` at the **end** keeps only the items that pass:

```python
words = ["apple", "fig", "banana", "kiwi"]
print([w for w in words if len(w) > 3])
print([w.upper() for w in words if w.startswith(("a", "k"))])
```

## A choice for each item

An `if ... else` at the **front** is different. It is a conditional expression, and it chooses the **value** for every item. Nothing is dropped:

```python
numbers = [3, -1, 4, -5]
print(["neg" if n < 0 else "pos" for n in numbers])
print([n if n > 0 else 0 for n in numbers])
```

Keep the two straight: `if` at the end **filters**, and `x if c else y` at the front **chooses**. You can use both:

```python
print([n * 10 if n % 2 else n for n in range(6) if n != 3])
```

## Nested loops

Several `for` clauses work like nested loops, in the same order that you would write the loops:

```python
pairs = [(x, y) for x in [1, 2, 3] for y in "ab"]
print(pairs)

flat = [value for row in [[1, 2], [3], [4, 5]] for value in row]
print(flat)
```

The first `for` is the outer loop. Beyond two levels, a comprehension becomes hard to read, so use a loop.

## Dictionary comprehensions

Curly braces with a `key: value` pair build a dictionary:

```python
words = ["apple", "fig", "banana"]
print({w: len(w) for w in words})
print({w: len(w) for w in words if len(w) > 3})

prices = {"a": 1, "b": 2}
print({key: value * 10 for key, value in prices.items()})
print({value: key for key, value in prices.items()})
```

If two items produce the same key, the last one wins.

## Set comprehensions

Curly braces with a single expression build a **set**, which drops duplicates:

```python
print({len(w) for w in ["a", "bb", "cc", "ddd"]})
print({c.lower() for c in "Mississippi"})
```

An empty `{}` is a dictionary, not a set. Use `set()` for an empty set.

## Generator expressions

Round brackets instead of square ones give a **generator expression**. It produces the items **one at a time**, and never builds the whole list. This matters for large data:

```python
total = sum(n * n for n in range(1_000_000))
print(total)

longest = max((len(w) for w in ["a", "abc", "ab"]))
print(longest)
```

When a generator expression is the only argument of a function, the extra brackets can be dropped, as in `sum(...)` above. A generator can be used **once**.

```python
gen = (n for n in range(3))
print(list(gen))
print(list(gen))
```

A quick memory comparison shows the difference:

```python
import sys

as_list = [n for n in range(10_000)]
as_generator = (n for n in range(10_000))
print(sys.getsizeof(as_list) > sys.getsizeof(as_generator))
```

## Walrus in comprehensions

The assignment expression `:=` lets you compute something once and use it in both the filter and the result:

```python
data = ["10", "x", "25", "", "7"]
print([int(s) for s in data if s.isdigit()])
print([n for s in data if (n := len(s)) > 1])
```

## When not to use one

Use a normal loop when:

- the body has **more than one step**, or needs `try`/`except`,
- you need side effects (printing, writing, changing something),
- the comprehension needs more than two `for` or `if` parts,
- you find yourself writing a long line that needs a comment.

```python
result = []
for s in data:
    try:
        result.append(int(s))
    except ValueError:
        pass
print(result)
```

Do not use a comprehension only for its side effects. `[print(x) for x in items]` builds a useless list of `None`.

## Common mistakes

- Mixing up the filter `if` at the end with the conditional expression at the front.
- Using an empty `{}` and expecting a set.
- Nesting too deeply, so that nobody can read the line.
- Reusing a generator that is already used up.

## Recap

- `[expr for x in items if cond]` builds a list. Braces with `key: value` build a dictionary, and a single expression in braces builds a set.
- `if` at the end filters, and `a if c else b` at the front chooses the value.
- Multiple `for` clauses nest in the same order as loops.
- Generator expressions use round brackets, and produce items lazily.

## Your turn

In the **Practice** tab you write `long_word_lengths(words)`. Then three challenges use the Chinook store.
