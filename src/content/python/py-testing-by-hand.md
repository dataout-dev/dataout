How do you know your code works? Not by running it once and seeing that the output looks right. **Testing** means deliberately trying your code on many inputs, especially awkward ones, and checking each answer against what you expect. In this lesson you learn to choose good test cases and to make Python check them for you.

## Test cases

A **test case** is an input together with the expected output. Choose cases that cover different situations:

- **A typical case**: what the function is for.
- **The smallest case**: an empty list, an empty string, zero.
- **A single item**.
- **Boundaries**: the point where behaviour changes, such as exactly at the limit.
- **Odd cases**: duplicates, negatives, very large values, missing data.

For a function `is_sorted(items)` that says whether a list is in order, good cases are:

| Input | Expected |
| ----- | -------- |
| `[1, 2, 3]` | `True` |
| `[3, 2, 1]` | `False` |
| `[]` | `True` |
| `[7]` | `True` |
| `[1, 1, 2]` | `True` (duplicates are allowed) |
| `[1, 3, 2]` | `False` (the problem is in the middle) |

## Checking with assert

An `assert` statement says "this must be true". If it is not, Python stops with an `AssertionError`. That makes a simple test:

```python
def is_sorted(items):
    for i in range(len(items) - 1):
        if items[i] > items[i + 1]:
            return False
    return True

assert is_sorted([1, 2, 3]) == True
assert is_sorted([3, 2, 1]) == False
assert is_sorted([]) == True
assert is_sorted([7]) == True
assert is_sorted([1, 1, 2]) == True
assert is_sorted([1, 3, 2]) == False
print("all tests passed")
```

If every assert holds, nothing happens, and the last line prints. If one fails, you get an error that points at the line.

You can add a message that appears when the assertion fails:

```python
assert 2 + 2 == 4, "arithmetic is broken"
print("ok")
```

## What a failing test looks like

Here is what happens with a broken function:

<!-- expect-error -->
```python
def is_sorted_bug(items):
    for i in range(len(items) - 1):
        if items[i] >= items[i + 1]:
            return False
    return True

assert is_sorted_bug([1, 1, 2]) == True, "duplicates should be allowed"
```

The `AssertionError` message tells you which case broke. The bug is `>=` where `>` was needed, and the duplicates case is exactly the one that found it.

## Write the tests first

A good habit is to write the test cases **before** you write the function. Deciding what the answer should be forces you to understand the problem, and you know when you are done: when all the tests pass.

## Tests as a list of cases

When you have many cases, put them in a list and loop over them:

```python
def double(n):
    return n * 2

cases = [(0, 0), (1, 2), (-3, -6), (2.5, 5.0)]
for value, expected in cases:
    actual = double(value)
    assert actual == expected, f"double({value}) gave {actual}, expected {expected}"
print("all", len(cases), "cases passed")
```

Adding a new case is now a single line.

## Testing floating point numbers

Because of rounding, do not compare floats with `==`. Use `round` or a tolerance:

```python
import math

assert math.isclose(0.1 + 0.2, 0.3)
print("close enough")
```

## Test the edges

Most bugs live at the edges. Make it a rule: for every function, test the empty input, one item, the boundary, and one clearly bad input.

## What testing cannot do

A passing test only tells you that *those cases* work. It cannot prove there are no bugs. That is why choosing varied, awkward cases is so valuable. Later, professional tools such as `pytest` make writing and running many tests easy, and you will meet them in the professional tier.

## Common mistakes

- Testing only the example that you already know works.
- Forgetting the empty input.
- Checking that the code runs without checking that the answer is right.
- Comparing floats with `==`.

## Recap

- A test case is an input and the expected output. Choose typical, empty, single, boundary and odd cases.
- `assert condition, message` checks a claim, and it stops with an error when the claim is false.
- Put cases in a list and loop over them.
- Write tests first when you can, and compare floats with a tolerance.

## Your turn

In the **Practice** tab you write `is_sorted(items)`. Your function is then tested with cases you have not seen, including the empty list and duplicates.
