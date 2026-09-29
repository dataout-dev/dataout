A docstring is documentation living right next to the code it describes. `doctest` goes one step further: it actually *runs* the examples in a docstring and checks their output, turning documentation into a test that fails the moment it drifts out of sync with reality.

You will learn:

- common docstring styles (Google, NumPy, reST)
- doctest, hands-on
- type hints as a form of documentation
- README and example files
- Sphinx and MkDocs, briefly
- keeping docs in sync with behaviour

## Docstring styles

```python
def google_style(a, b):
    """Add two numbers.

    Args:
        a: The first number.
        b: The second number.

    Returns:
        The sum of a and b.
    """
    return a + b

def numpy_style(a, b):
    """Add two numbers.

    Parameters
    ----------
    a : int
        The first number.
    b : int
        The second number.

    Returns
    -------
    int
        The sum of a and b.
    """
    return a + b

print(google_style(2, 3), numpy_style(2, 3))
```

Google style and NumPy style are the two most common conventions for structuring a longer docstring's parameters and return value; reST (reStructuredText) style is an older, more markup-heavy alternative. Which one a project uses matters less than being consistent about it — most doc generators can read any of them, given the right configuration.

## doctest, hands-on

```python
import doctest

def add(a, b):
    """Add two numbers.

    >>> add(2, 3)
    5
    >>> add(-1, 1)
    0
    """
    return a + b

finder = doctest.DocTestFinder()
tests = finder.find(add, globs=globals())
runner = doctest.DocTestRunner()
failures = 0
for test in tests:
    result = runner.run(test, out=lambda s: None)
    failures += result.failed

print(f"{failures} failing example(s)")
```

Each `>>> ...` line in the docstring is executed exactly as if typed at a real Python prompt, and the following line(s) must match the actual output exactly. `DocTestFinder` locates every doctest in an object (a function, or a whole module); `DocTestRunner` actually executes and checks them. If a docstring example's output does not match reality — because the code changed and the docstring was not updated — this fails, exactly like any other test would.

## A note on quoting

```python
def make_greeting(name):
    """
    >>> print(make_greeting("Ada"))
    Hello, Ada!
    """
    return f"Hello, {name}!"
```

A bare `>>> some_call(...)` expression is checked against the **repr** of its return value — for a string, that means it needs to be written with quotes (`'like this'`). Wrapping the call in `print(...)` instead compares against the string's own printed form, with no quotes needed — usually the more readable and less error-prone choice for string-returning functions.

## Type hints as documentation

```python
def parse_price(text: str) -> float:
    return float(text.strip().lstrip("$"))

print(parse_price("$9.99"))
```

A type hint documents a contract (what goes in, what comes out) that a docstring's prose could also state, but a type hint is *checked* by a type checker and read by an IDE for autocomplete — documentation that cannot silently drift out of sync with the code the way an unchecked comment can.

## README and example files

A project's `README` is usually the very first thing a prospective user reads — before the full API docs, often before deciding whether to use the project at all. A short, runnable example near the top of it (not buried three sections down) does more to convey what a library actually does than a paragraph of description.

## Sphinx and MkDocs, briefly

Sphinx and MkDocs are the two most common tools for turning docstrings and standalone Markdown/reST pages into a real documentation website — extracting API documentation directly from docstrings (so it cannot drift too far from the code) and combining it with hand-written guides and tutorials.

## Watch out: docs describing intentions, not behaviour

```python
def clamp(value, low, high):
    """Clamps value to be within [low, high], inclusive."""
    return max(low, min(value, high))   # what if low > high? the docstring doesn't say
```

A docstring that describes what a function is *supposed* to do, without ever being checked against what it *actually* does, can drift silently for years — a doctest example is one of the few forms of documentation that fails loudly the moment it stops being true.

## Common mistakes

- Writing a docstring example that was correct when written but never re-verified after the implementation changed.
- Mixing docstring styles inconsistently within one project, confusing both readers and doc generators.
- Using a bare expression doctest for a string-returning function and getting the quoting wrong, instead of wrapping it in `print(...)`.
- Treating type hints and docstrings as redundant, when the type hint documents the contract and the docstring can explain the *why* a type alone cannot.
