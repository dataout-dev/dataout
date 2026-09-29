Test-driven development (TDD) inverts the usual order: instead of writing code and then checking it works, you write a failing test first, make it pass with the smallest change that will do, and only then clean up the result. The tests you already have are what makes that cleanup safe.

## Red, green, refactor

```python
# RED: write a test for behaviour that doesn't exist yet
def test_total_of_empty_cart_is_zero():
    assert cart_total([]) == 0
```

Running this fails immediately (`cart_total` is not even defined) — that is the point: a failing test *proves the test can actually fail*, ruling out the embarrassing case of a test that would pass no matter what the code does.

```python
# GREEN: the smallest code that makes it pass
def cart_total(items):
    return 0
```

This is obviously not a finished cart function, but it is honestly the simplest thing that satisfies the one test written so far. The next test drives the next bit of real behaviour:

```python
def test_total_of_two_items():
    assert cart_total([1.0, 2.0]) == 3.0

def cart_total(items):
    return sum(items)
```

**REFACTOR** comes last: now that both tests pass, you are free to rename, restructure, or simplify the implementation, running the tests after every change to confirm nothing broke.

```python
def test_total_of_empty_cart_is_zero():
    assert cart_total([]) == 0

def test_total_of_two_items():
    assert cart_total([1.0, 2.0]) == 3.0

def cart_total(items):
    return sum(items)

test_total_of_empty_cart_is_zero()
test_total_of_two_items()
print("both tests still pass after refactoring to a one-line implementation")
```

## Growing a design from tests

Each new test is a small, concrete demand on the design: "given this input, the function must return that". Writing several before touching the implementation tends to reveal the shape of a good interface before you have committed to one — the tests act as the first, most honest user of the code.

## Characterisation tests for legacy code

Not all code is written test-first. When you inherit an undocumented function with no tests, a **characterisation test** records what it *actually does right now* — bugs and all — so that a later refactor can be checked against that exact baseline, rather than against a guess of what the function was "supposed" to do.

```python
def legacy_discount(price, is_member):
    # nobody remembers if this rounding was intentional
    return round(price * 0.9) if is_member else price

def test_characterises_current_rounding_behaviour():
    # this pins down the existing (possibly surprising) behaviour, on purpose
    assert legacy_discount(10.4, True) == 9

test_characterises_current_rounding_behaviour()
```

## When TDD helps, and when it does not

TDD shines when the desired behaviour can be stated up front: a pricing rule, a parser, a data transformation with clear inputs and outputs. It is a poor fit for pure exploration — sketching out a new UI interaction or trying three different architectures to see what feels right usually needs a throwaway spike first; writing tests against a design that does not exist yet just slows down the exploration.

## Watch out: testing implementation details

```python
class Cart:
    def __init__(self):
        self._items = []          # an internal detail
    def add(self, price):
        self._items.append(price)
    def total(self):
        return sum(self._items)

# fragile: asserts on a private internal, not on observable behaviour
def test_fragile():
    c = Cart()
    c.add(5)
    assert c._items == [5]

# robust: asserts on what the object actually promises to callers
def test_robust():
    c = Cart()
    c.add(5)
    assert c.total() == 5
```

If `Cart` is refactored to store items in a dict instead of a list, `test_fragile` breaks even though `Cart`'s real behaviour (`total()`) is unchanged. Testing through the public interface is what lets you refactor freely.

## Common mistakes

- Writing the implementation first, then a test that simply mirrors it back — this confirms the code does what it does, not that it does what it *should*.
- Skipping "red" and never confirming the test can actually fail.
- Treating TDD as mandatory for every kind of work, including exploratory design where it gets in the way.
- Asserting on private, internal state instead of the behaviour a caller actually relies on.
