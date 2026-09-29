Copy-pasting the same test body ten times with slightly different numbers is a maintenance trap — change the assertion once, and now nine copies are wrong. pytest solves the two halves of this separately: **fixtures** for shared setup, **parametrize** for shared assertions over many inputs.

## Parametrize: one assertion, many inputs

```python
import pytest

def double(x):
    return x * 2

@pytest.mark.parametrize("value,expected", [
    (0, 0),
    (1, 2),
    (-3, -6),
    (10, 20),
])
def test_double(value, expected):
    assert double(value) == expected
```

pytest runs `test_double` once per tuple in the list, reporting each as its own pass or fail — a single failing row shows you exactly which input broke, without four separate functions to keep in sync.

## Fixtures and scope

A fixture is a function that provides setup (and, if needed, teardown) to any test that asks for it by name:

```python
import pytest

@pytest.fixture
def sample_cart():
    return ["apple", "bread", "milk"]

def test_cart_has_three_items(sample_cart):
    assert len(sample_cart) == 3
```

pytest sees the `sample_cart` parameter, matches it to the fixture of the same name, and calls it for you. A fixture's **scope** (`function` by default, or `module`, `session`, and others) controls how often it is rebuilt — a `session`-scoped fixture connecting to a test database, say, is built once and reused everywhere, instead of once per test.

## conftest.py

A fixture defined in a file named `conftest.py` is automatically available to every test in that directory and below, with no import needed. This is how a project shares common setup (a fake database, a sample dataset, a configured client) across many test files without repeating it.

## tmp_path and monkeypatch

Two built-in fixtures come up constantly:

- `tmp_path` gives a test a fresh, empty temporary directory, so file-writing tests do not touch real files or leave junk behind.
- `monkeypatch` temporarily replaces an attribute, environment variable, or dictionary entry for the duration of one test, then automatically restores it afterwards — safer than patching something by hand and risking leaving it changed.

## Markers

`@pytest.mark.slow`, `@pytest.mark.skip`, `@pytest.mark.xfail` and custom markers tag tests for selective running (`pytest -m slow`) or expected status (`xfail` means "we know this currently fails, don't treat that as a surprise").

## Keeping tests fast

A test suite people actually run often is one that finishes in seconds. Preferring in-memory fakes over real databases or networks, and reserving expensive fixtures for the few tests that truly need them, keeps the whole suite fast enough to run on every save rather than once a day.

## Arrange-act-assert

Most well-structured tests fall into three visible parts: **arrange** the inputs and any fakes, **act** by calling the function under test, **assert** on the result. Keeping these visually separate (even with a blank line between them) makes a test readable at a glance.

```python
def test_arrange_act_assert():
    # arrange
    prices = [1.0, 2.0, 3.0]
    # act
    total = sum(prices)
    # assert
    assert total == 6.0
```

## Watch out: fixtures hiding too much setup

```python
import pytest

@pytest.fixture
def customer():
    c = {"name": "Ann", "balance": 100, "vip": True, "region": "EU", "since": 2019}
    return c

def test_discount(customer):
    assert customer["vip"] is True
```

If `test_discount` only cares about `vip`, burying it inside a five-field fixture built elsewhere makes the test harder to read on its own — a reader has to go find the fixture to see what `vip` even depends on. A narrower fixture, or building the relevant piece directly in the test, often reads better than reusing an oversized one out of convenience.

## Common mistakes

- Writing ten near-identical test functions instead of one `parametrize`d test.
- A fixture with side effects that are not cleaned up, leaking state into the next test.
- Reaching for `monkeypatch` to hand-edit an object when a fixture already provides a clean fake.
- A `conftest.py` fixture so broad that reading a test no longer tells you what it actually needs.
