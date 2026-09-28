You have been testing functions with `assert` since Foundations. Classes bring two new questions: how do you test an object's **behaviour** without depending on its private internals, and how do you test code that depends on something slow, unpredictable, or external (a network call, the current time)? This closing lesson of the section answers both.

You will learn:

- `unittest` and `pytest` styles, side by side
- testing behaviour, not implementation
- fixtures: shared setup for many tests
- `unittest.mock` for replacing collaborators
- test doubles, and why not to over-mock

## unittest: the standard library's built-in

```python
import unittest

class ShoppingCart:
    def __init__(self):
        self.items = []

    def add(self, name, price):
        self.items.append((name, price))

    def total(self):
        return sum(price for _, price in self.items)

class TestShoppingCart(unittest.TestCase):
    def test_empty_cart_totals_zero(self):
        cart = ShoppingCart()
        self.assertEqual(cart.total(), 0)

    def test_total_adds_prices(self):
        cart = ShoppingCart()
        cart.add("pen", 1.5)
        cart.add("ink", 3.0)
        self.assertEqual(cart.total(), 4.5)

result = unittest.TextTestRunner(verbosity=0).run(unittest.TestLoader().loadTestsFromTestCase(TestShoppingCart))
print(result.wasSuccessful())
```

Each test is a method starting with `test_`, and `self.assertEqual`, `self.assertRaises`, `self.assertTrue` and friends replace plain `assert` with more informative failure messages.

## pytest: shorter, and very popular

The third-party `pytest` (installed with `pip`, not part of the standard library) lets you write tests as **plain functions**, using ordinary `assert`:

```text
def test_empty_cart_totals_zero():
    cart = ShoppingCart()
    assert cart.total() == 0

def test_total_adds_prices():
    cart = ShoppingCart()
    cart.add("pen", 1.5)
    cart.add("ink", 3.0)
    assert cart.total() == 4.5
```

`pytest` is shown here as text because it is not installed in every environment, including this browser playground — but recognise the style, because it is what you will meet most often in real Python projects. Both styles test the same thing; `pytest` simply removes the `self.assertX` ceremony.

## Testing behaviour, not implementation

A good test checks **what** an object does, through its public interface, not **how** it does it internally:

```python
class ShoppingCart:
    def __init__(self):
        self._items = []

    def add(self, name, price):
        self._items.append((name, price))

    def total(self):
        return sum(price for _, price in self._items)

cart = ShoppingCart()
cart.add("pen", 1.5)
assert cart.total() == 1.5
```

A test that instead reached into `cart._items` directly (`assert cart._items == [("pen", 1.5)]`) would break the moment the internal storage changed — even if `total()` still worked perfectly. Testing through `add` and `total`, the class's actual public contract, means the internals are free to change without breaking every test that depends on them.

## Fixtures: shared setup

A **fixture** provides ready-made setup that many tests can share, instead of repeating it in every test. `unittest` offers `setUp`, run fresh before every test method:

```python
import unittest

class TestShoppingCart(unittest.TestCase):
    def setUp(self):
        self.cart = ShoppingCart()

    def test_starts_empty(self):
        self.assertEqual(self.cart.total(), 0)

    def test_add_increases_total(self):
        self.cart.add("pen", 1.5)
        self.assertEqual(self.cart.total(), 1.5)

result = unittest.TextTestRunner(verbosity=0).run(unittest.TestLoader().loadTestsFromTestCase(TestShoppingCart))
print(result.wasSuccessful())
```

`pytest`'s equivalent is a function decorated `@pytest.fixture`, passed into each test as a parameter — different syntax, identical idea: **do not repeat the setup that every test needs.**

## Mocking collaborators

Some classes depend on something you do not want a test to actually touch: a network call, the current time, a real database. `unittest.mock` lets you substitute a **fake** in its place, one that records how it was used:

```python
from unittest.mock import Mock

class NotificationService:
    def __init__(self, mailer):
        self.mailer = mailer

    def notify(self, address, message):
        self.mailer.send(address, message)

fake_mailer = Mock()
service = NotificationService(fake_mailer)
service.notify("ada@example.org", "hello")

fake_mailer.send.assert_called_once_with("ada@example.org", "hello")
```

No real e-mail was ever sent. `Mock()` accepts **any** method call and records it, so `assert_called_once_with` can check exactly how `notify` used its `mailer`, without a real mail server anywhere in sight.

## Faking a return value

A mock can also be told what to return, which is useful for simulating a collaborator's response:

```python
from unittest.mock import Mock

def get_shipping_cost(pricing_api, weight):
    return pricing_api.quote(weight) + 2.0

fake_api = Mock()
fake_api.quote.return_value = 10.0

print(get_shipping_cost(fake_api, 5))
```

## Test doubles: a vocabulary

"Mock" is often used loosely, but the testing world distinguishes a few related ideas:

- A **stub** returns canned answers, and nothing more.
- A **fake** is a lightweight, working substitute (an in-memory database standing in for a real one).
- A **mock** additionally **records** how it was called, so a test can assert on that.
- A **spy** wraps a **real** object, recording calls while still delegating to the genuine implementation.

`unittest.mock.Mock` can play the role of a stub, a mock, or (with `wraps=`) a spy, depending on how you configure it.

## The danger of over-mocking

Replacing **everything** a class touches with a mock can produce tests that pass even when the real code is badly broken, because nothing real was ever exercised. A good rule: mock the **boundaries** of your system — the network, the clock, an external service — and let your own classes' real logic run and be genuinely tested against each other.

## Common mistakes

- Testing private attributes directly instead of the public interface.
- Repeating setup code in every test instead of using a fixture.
- Mocking so much of a test's dependencies that the test no longer exercises any real logic.
- Forgetting to check *how* a mock was called (`assert_called_once_with`) when that is the actual point of the test.

## Recap

- `unittest` uses classes and `self.assertX`; `pytest` uses plain functions and `assert`. Both test the same ideas.
- Test the public interface, not private internals, so implementation details can change freely.
- Fixtures share setup across tests; `unittest.mock.Mock` fakes and records interactions with collaborators.
- Mock at the boundaries of your system; do not mock away the code you are actually trying to test.

## Your turn

In the **Practice** tab you write assertions for a `ShoppingCart` class, and your tests must pass hidden behavioural cases. Then three challenges use real data.
