Every function you write eventually needs to be checked against more than one input. `pytest` is the tool most Python projects reach for: it finds your tests automatically, gives you plain `assert` statements instead of a wall of `self.assertEqual(...)` calls, and prints failures in a way that shows you exactly what went wrong.

`pytest` itself runs fine in this playground, so every example below is real, runnable code.

You will learn:

- how pytest finds and runs tests
- writing assertions pytest can explain clearly
- testing that an exception is raised, with `pytest.raises`
- comparing floats safely, with `pytest.approx`
- naming tests and structuring a test file
- reading a failure report

## Test discovery and assert rewriting

A normal pytest project collects any file named `test_*.py` (or `*_test.py`), and inside it, any function named `test_*`. There is no registration step — the name is the whole contract:

```python
def test_addition_is_commutative():
    assert 2 + 3 == 3 + 2
```

If that `assert` fails, plain Python would just tell you `AssertionError`. pytest **rewrites** assertions at import time so a failure shows the actual values on both sides — you write ordinary `assert`, and get a readable failure for free.

## Testing exceptions: pytest.raises

Sometimes the *correct* behaviour is to raise an exception. `pytest.raises` is a context manager: the block inside it must raise the given exception type, or the test fails.

```python
import pytest

def divide(a, b):
    if b == 0:
        raise ZeroDivisionError("cannot divide by zero")
    return a / b

with pytest.raises(ZeroDivisionError):
    divide(1, 0)

print("the exception was raised and caught, as expected")
```

If the block does *not* raise, or raises a different exception type, `pytest.raises` itself raises a failure — this is exactly as strict as it sounds, which is the point: "no error at all" is a different bug from "the wrong error".

## Comparing floats: pytest.approx

Floating-point arithmetic rarely lands on an exact value. Comparing with `==` is fragile:

```python
import pytest

total = 0.1 + 0.1 + 0.1
print(total == 0.3)          # often False, due to binary float representation
print(total == pytest.approx(0.3))
```

`pytest.approx` wraps a value and makes `==` tolerant of tiny floating-point noise, without you having to pick a tolerance by hand for every comparison.

## Naming and structure

A clear test name describes the *behaviour*, not the mechanism: `test_empty_cart_totals_zero` tells you what broke far faster than `test_1`. Most projects group related tests in one file per module under test (`test_pricing.py` for `pricing.py`), and use one `assert` per logical check so a failure points at exactly one thing.

## Running a subset

In a real project, `pytest -k "cart"` runs only tests whose name contains `cart`, and `pytest path/to/test_file.py::test_name` runs one specific test. This matters once a suite has hundreds of tests — you rarely want to wait for all of them while iterating on one function.

## Reading a failure report

A pytest failure shows the assertion line, the values it rewrote, and a traceback. The habit worth building early: read the **assertion line first** — it almost always tells you which side (expected vs actual) was wrong, before you even look at the traceback.

## Watch out: tests that depend on each other

```python
seen = []

def test_first():
    seen.append(1)
    assert seen == [1]

def test_second():
    # relies on test_first having already run and appended to `seen`
    assert seen == [1]
```

This pair only passes if pytest happens to run `test_first` before `test_second`. A good test suite has no such ordering dependency — each test should set up everything it needs itself, so any single test can run alone and still make sense.

## Common mistakes

- Naming tests vaguely (`test_1`, `test_it_works`) instead of describing the behaviour under test.
- Comparing floats with `==` instead of `pytest.approx`.
- Writing a test that only passes because an earlier test happened to run first.
- Using a bare `try`/`except` to "test" for an exception instead of `pytest.raises`, which also fails the test if *no* exception is raised.
