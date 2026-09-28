Programs constantly ask yes-or-no questions. Is the user old enough? Is this penguin heavier than that one? Is the file empty? In Python, the answer to such a question is a `bool`: either `True` or `False`. In this lesson you learn to ask the questions and to combine them.

## Comparison operators

A comparison produces a boolean:

```python
print(5 > 3)
print(5 < 3)
print(5 >= 5)
print(5 <= 4)
print(5 == 5)
print(5 != 6)
```

| Operator | Means |
| -------- | ----- |
| `==` | equal to |
| `!=` | not equal to |
| `<` `>` | less than, greater than |
| `<=` `>=` | less than or equal, greater than or equal |

Remember: a single `=` **assigns**. Two equals signs `==` **compare**. Mixing them up is one of the most common beginner mistakes.

You can compare text too. Comparison is by dictionary order, and capital letters come before lower-case ones:

```python
print("apple" < "banana")
print("Zebra" < "apple")
```

## Chained comparisons

Python lets you chain comparisons, just like in maths:

```python
age = 25
18 <= age < 30
```

That is a neat way to say "age is at least 18 and less than 30".

## Combining conditions: and, or, not

Use `and`, `or` and `not` to combine booleans:

```python
sunny = True
warm = False

print(sunny and warm)
print(sunny or warm)
print(not sunny)
```

- `a and b` is `True` only if **both** are `True`.
- `a or b` is `True` if **at least one** is `True`.
- `not a` flips `True` to `False` and back.

You can build bigger conditions. Use brackets so the meaning is clear:

```python
mass = 4200
sex = "female"
(mass > 4000) and (sex == "female")
```

## Short-circuiting

Python stops as soon as it knows the answer. In `False and anything`, the second part is never looked at. In `True or anything` also not. This is called **short-circuit evaluation**, and it is useful for guarding against errors:

```python
items = []
len(items) > 0 and items[0] == "x"
```

The list is empty, so the first part is `False` and Python never tries `items[0]`, which would have crashed.

## Truthiness in conditions

In the types lesson you saw that zero, empty text and `None` count as `False`. `and` and `or` use this rule, and they return one of their *operands*, not always a boolean:

```python
print(0 or "default")
print("hello" and "world")
print("" or "fallback")
```

The `or` trick is a popular way to supply a default value.

## Testing membership

`in` asks whether something is inside a string or another group:

```python
print("py" in "python")
print("z" in "python")
print("y" not in "python")
```

## `is` and `==` are different

`==` asks "do these have the same value?". `is` asks "are these the very same object?". For most things you want `==`. The main exception is `None`, which you test with `is`:

```python
result = None
print(result is None)
print(result is not None)
```

## Common mistakes

- Using `=` where you need `==`.
- Writing `if x == 3 or 4`. That means `(x == 3) or 4`, and `4` is always true. Write `x == 3 or x == 4`, or `x in (3, 4)`.
- Comparing text with numbers (`"5" == 5` is `False`).
- Forgetting that `and` and `or` return operands, not always booleans.

## Recap

- Comparisons (`== != < > <= >=`) give `True` or `False`.
- Combine conditions with `and`, `or` and `not`. Use brackets when it helps.
- Python short-circuits, and it treats zero, empty and `None` as false.
- Test for `None` with `is None`.
