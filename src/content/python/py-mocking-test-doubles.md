Some code you want to test depends on something slow, unreliable, or expensive to actually run in a test: a network call, a real database, the current time, a random number. A **test double** stands in for the real thing so the test stays fast, deterministic, and independent of the outside world.

## Fakes, stubs, mocks and spies

These four words describe test doubles with slightly different jobs:

- A **fake** is a lightweight, working implementation (an in-memory dict standing in for a real database).
- A **stub** returns canned answers, with no real logic behind them.
- A **mock** is a stub that also records how it was called, so the test can assert on that.
- A **spy** wraps a *real* object and records calls to it, while still letting the real behaviour run.

```python
class FakeApi:
    def price(self, name):
        return 1.0

def total_with_prices(cart, api):
    return sum(api.price(name) for name in cart)

fake = FakeApi()
print(total_with_prices(["a", "b", "c"], fake))
```

`FakeApi` never makes a network call, so the test runs instantly and gives the same answer every time — exactly what a unit test needs.

## unittest.mock: patch and MagicMock

The standard library's `unittest.mock` gives you ready-made mocks:

```python
from unittest.mock import MagicMock

api = MagicMock()
api.price.return_value = 2.5

def total_with_prices(cart, api):
    return sum(api.price(name) for name in cart)

total = total_with_prices(["x", "y"], api)
print(total, api.price.call_count)
```

`MagicMock` accepts any attribute or method call and records it; `api.price.call_count` tells you exactly how many times `price` was called, which is the "mock" half — asserting not just on the result, but on *how* your code used its dependency.

## Patching where a name is used

`unittest.mock.patch` temporarily replaces a name with a mock for the duration of a test:

```python
import random
from unittest.mock import patch

def get_confidence():
    return "confident" if random.random() > 0.5 else "cautious"

with patch("random.random", return_value=0.9):
    print(get_confidence())   # "confident" - random.random() is forced to 0.9 here

with patch("random.random", return_value=0.1):
    print(get_confidence())   # "cautious" - forced to 0.1 instead
```

The critical rule this generalises to: **patch where a name is looked up, not where it was originally defined**. If `my_module.py` does `from other_module import thing`, then `my_module` has its *own* reference to `thing` from the moment it was imported. Patching `other_module.thing` later has no effect on that already-bound reference — the fix is patching `my_module.thing` instead, since that is the name actually looked up when `my_module`'s code runs.

```text
# other_module.py
def thing():
    return "real"

# my_module.py
from other_module import thing   # my_module.thing now points at the same function

def use_it():
    return thing()

# in a test: this does NOT affect my_module.use_it(), because my_module
# already has its own reference to the original `thing`:
patch("other_module.thing", return_value="fake")

# this DOES affect it, because it patches the name my_module actually calls:
patch("my_module.thing", return_value="fake")
```

## Time and randomness in tests

Anything non-deterministic — `datetime.now()`, `random.random()`, a UUID — makes a test flaky unless it is replaced with a fixed value for the duration of the test, the same way `patch` was used above. A test that sometimes passes and sometimes fails for no code reason destroys trust in the whole suite.

## Contract tests

A fake is only useful if it behaves like the real thing it replaces. A **contract test** runs the same test suite against both the fake and the real implementation, catching the case where a fake has quietly drifted out of sync with what the real API actually does.

## Watch out: mocking what you own

```python
from unittest.mock import MagicMock

def process(pricer):
    return pricer.get_price() * 2

pricer = MagicMock()
pricer.get_price.return_value = 5
print(process(pricer))
```

Mocking a dependency you do not own (an external API, a database driver) is normal. Mocking *your own* internal function just to test another function that calls it often means the two are too tightly coupled, or that a cheap fake would test both more honestly than a mock that just returns whatever you told it to.

## Common mistakes

- Patching the wrong location (the original module instead of where the name is imported and used).
- Over-mocking so heavily that a test only checks "did I call the mock the way I expected", not "does the real behaviour work".
- Leaving `datetime.now()` or `random` unmocked in a test, producing occasional, hard-to-reproduce failures.
- Forgetting that `MagicMock()` will happily accept *any* attribute or method name — a typo in the code under test can go unnoticed because the mock never complains.
