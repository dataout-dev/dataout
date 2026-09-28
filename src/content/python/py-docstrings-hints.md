Writing a function that works is only half of the job. The other half is making it easy for others, and for you in six months, to understand and use it. Two tools help: **docstrings**, which describe what a function does, and **type hints**, which say what kinds of values it expects and returns.

## Docstrings

A docstring is a string placed as the very first thing inside a function. Python stores it as the function's documentation:

```python
def to_kg(grams):
    """Convert a mass in grams to kilograms."""
    return grams / 1000

print(to_kg(3750))
print(to_kg.__doc__)
```

The built-in `help()` shows it in a terminal, and editors display it when you hover over the function name.

A good one-line docstring:

- starts with a verb: "Convert...", "Return...", "Count..."
- says what the function does, not how
- fits on a single line, ending in a full stop

For a longer description, use a multi-line docstring. The first line is a summary, then a blank line, then the details:

```python
def average(numbers):
    """Return the mean of a list of numbers.

    If the list is empty, return 0 instead of raising an error.
    """
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)

print(average.__doc__)
```

## Comments versus docstrings

- A **docstring** says what the function is *for*, for the people who call it.
- A **comment** (`#`) explains a tricky detail *inside*, for the people who read the code.

## Type hints

A **type hint** says what type a parameter should have and what the function returns. It goes after a colon for parameters, and after `->` for the result:

```python
def clamp(x: float, low: float, high: float) -> float:
    """Return x, limited to the range from low to high."""
    if x < low:
        return low
    if x > high:
        return high
    return x

print(clamp(15, 0, 10))
```

Hints are **not enforced**. Python does not check them when the program runs. Their value is as documentation, and as input for editors and tools such as `mypy` that can warn you when you use a function wrongly.

Some common hints:

```python
def greet(name: str, times: int = 1) -> str:
    return (f"Hello, {name}! " * times).strip()

def total(prices: list[float]) -> float:
    return sum(prices)

def find(items: list[str], key: str) -> int | None:
    """Return the position of key, or None if it is missing."""
    for i, item in enumerate(items):
        if item == key:
            return i
    return None

print(greet("Ada", 2))
print(total([1.5, 2.5]))
print(find(["a", "b"], "b"))
```

- `list[float]` means "a list of floats", and `dict[str, int]` means "a dictionary from text to whole numbers".
- `int | None` means "an int, or `None`".
- `-> None` says the function returns nothing.

## Small, pure functions

A **pure** function has two properties: it gives the same result for the same input, and it changes nothing outside itself (no printing, no changing arguments, no global variables). Pure functions are easy to understand and easy to test, so prefer them where you can.

```python
def is_adult(age: int) -> bool:
    """Return True if age is 18 or more."""
    return age >= 18

print(is_adult(20), is_adult(12))
```

Keep functions **short** and doing **one thing**. If you need the word "and" to describe what a function does ("it cleans the data *and* prints a report"), split it into two.

## Examples in docstrings

A docstring can include an example. Python's `doctest` module can even run them to check they are right:

```python
def double(n: int) -> int:
    """Return n doubled.

    >>> double(4)
    8
    """
    return n * 2

print(double(4))
```

## Common mistakes

- Docstrings that repeat the function name ("This function does clamp").
- Believing that hints are checked at run time. They are not.
- Writing a comment for every line instead of one clear docstring.
- Functions that do several unrelated things.

## Recap

- A docstring is the first string in a function, and describes what it does.
- Type hints such as `x: float` and `-> str` document the expected types, without being enforced.
- Prefer small, pure functions that return their results.
- Comments explain the inside, and docstrings explain the outside.

## Your turn

In the **Practice** tab you write `clamp(x, low, high)` with type hints, which limits a number to a range.
