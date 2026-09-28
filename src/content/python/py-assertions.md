Bugs are cheapest to fix when they are caught **early**, close to where they start. **Defensive programming** means writing code that checks its own assumptions, so that a wrong value stops the program at once, with a clear message, instead of producing a silently wrong answer three functions later.

You will learn:

- the `assert` statement
- preconditions, postconditions and invariants
- the difference between `assert` and raising an exception
- the fail-fast principle
- validating input at the boundaries of a program
- what `python -O` does to assertions

## assert

`assert condition, message` checks a claim. If the condition is false, it raises an `AssertionError` with your message:

```python
def average(numbers):
    assert len(numbers) > 0, "average() needs at least one number"
    return sum(numbers) / len(numbers)

print(average([1, 2, 3]))
```

<!-- expect-error -->
```python
def average(numbers):
    assert len(numbers) > 0, "average() needs at least one number"
    return sum(numbers) / len(numbers)

average([])
```

Compare it with the error you would get without the assertion: a `ZeroDivisionError` from a line that has nothing to do with the real mistake (the empty list).

## Three kinds of claims

- A **precondition** is what must be true when a function starts. It is the caller's responsibility.
- A **postcondition** is what the function guarantees when it ends.
- An **invariant** is something that must always stay true, for example "the balance is never negative".

```python
def withdraw(balance, amount):
    assert amount > 0, "amount must be positive"
    assert amount <= balance, "not enough money"
    new_balance = balance - amount
    assert new_balance >= 0, "invariant broken: negative balance"
    return new_balance

print(withdraw(100, 30))
```

Assertions are also good executable documentation. They tell the next reader what you assume.

## assert is not for user input

This is the most important rule. `assert` is for catching **programmer mistakes**, the "this can never happen" situations. It is **not** a way to validate data that comes from outside the program: files, users, the network. Assertions can be switched off. Running `python -O` removes every `assert` statement completely, so a check that protects against bad input would vanish.

```python
def safe_age(value):
    if not isinstance(value, int) or not 0 <= value <= 150:
        raise ValueError(f"age must be an integer from 0 to 150, got {value!r}")
    return value

print(safe_age(36))
```

For input from outside, **raise a proper exception**, such as `ValueError` or your own class. Reserve `assert` for internal assumptions.

## A useful rule

Ask: "Could this be false because of something a *user* or another system did?" If yes, raise an exception. If it can only be false because of a bug in **my** code, assert it.

## Fail fast

The **fail-fast** principle says: detect a problem as early as possible and stop, rather than carrying a bad value forward. The earlier the failure, the closer the error message is to the cause.

A common style is to validate everything at the **boundary** (where data enters your program) and then trust it inside:

```python
def parse_order(raw):
    if not isinstance(raw, dict):
        raise TypeError("order must be a dictionary")
    for key in ("item", "quantity"):
        if key not in raw:
            raise ValueError(f"order is missing {key!r}")
    if not isinstance(raw["quantity"], int) or raw["quantity"] <= 0:
        raise ValueError("quantity must be a positive integer")
    return raw["item"], raw["quantity"]

print(parse_order({"item": "pen", "quantity": 3}))
```

After this function, the rest of the program can rely on `item` and `quantity` being sensible.

## Collect all the problems

Sometimes it is friendlier to report **every** problem at once, instead of the first one. Build a list of messages and return it:

```python
def check_order(raw):
    problems = []
    if "item" not in raw:
        problems.append("item is missing")
    if not isinstance(raw.get("quantity"), int):
        problems.append("quantity must be an integer")
    return problems

print(check_order({}))
print(check_order({"item": "pen", "quantity": 2}))
```

This suits forms and configuration files, where users want to fix everything in one go.

## Postconditions in tests

Assertions are also at the heart of tests, which you write with the `assert` statement in a test function, or with a framework such as `pytest` (a later tier):

```python
def clamp(value, low, high):
    return max(low, min(value, high))

assert clamp(5, 0, 10) == 5
assert clamp(-1, 0, 10) == 0
assert clamp(99, 0, 10) == 10
print("clamp works")
```

## Common mistakes

- Using `assert` to validate user input or file contents.
- Putting code with side effects inside an assertion, such as `assert do_something()`. The call vanishes under `-O`.
- Writing assertions with no message, so a failure gives no hint.
- Asserting a tuple: `assert (x > 0, "message")` is always true because a non-empty tuple is truthy.

## Recap

- `assert condition, message` documents and checks an assumption.
- Assertions are for programmer mistakes. Raise exceptions for bad input.
- Fail fast, and validate at the boundary of your program.
- Collect all problems in a list when the user benefits from seeing them together.

## Your turn

In the **Practice** tab you write `check_config(cfg)`, which returns a list of problems. Then three challenges use the Chinook store.
