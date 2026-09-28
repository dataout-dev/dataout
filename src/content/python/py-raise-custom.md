So far you have **caught** exceptions raised by Python. Now you will **raise** your own. Good code signals problems with clear, specific exceptions. You will learn how to raise, how to chain an error to its cause, how to design custom exception classes, and how to handle several errors at once with `ExceptionGroup`.

You will learn:

- the `raise` statement
- `raise ... from ...` to keep the cause
- designing your own exception classes
- messages, error codes and extra data
- `ExceptionGroup` and `except*` (Python 3.11 and later)
- notes on exceptions

## raise

You can raise any exception yourself, with a helpful message:

```python
def set_age(age):
    if age < 0:
        raise ValueError(f"age cannot be negative, got {age}")
    return age

try:
    set_age(-3)
except ValueError as error:
    print("Error:", error)
```

Pick the exception type that best describes the problem. A wrong **value** is a `ValueError`, a wrong **type** is a `TypeError`, and a missing key or position is a `KeyError` or `IndexError`.

## Chaining with from

If you catch one error and raise another, use `from` to remember the original. It shows up in the traceback as the "direct cause", and is available as `__cause__`:

```python
def load_port(config):
    try:
        return int(config["port"])
    except KeyError as error:
        raise ValueError("config has no port") from error

try:
    load_port({})
except ValueError as error:
    print(error, "| cause:", repr(error.__cause__))
```

`raise ... from None` hides the original error when it is only noise.

## Custom exceptions

A custom exception is a class that **inherits** from an existing one. Even an empty class is useful, because callers can catch it by name:

```python
class ValidationError(ValueError):
    pass

try:
    raise ValidationError("name is empty")
except ValueError as error:
    print(type(error).__name__, error)
```

Because `ValidationError` inherits from `ValueError`, code that catches `ValueError` also catches it. Code that wants to be specific catches `ValidationError`.

## Adding data

Give an exception attributes when the handler needs more than text:

```python
class ValidationError(ValueError):
    def __init__(self, field, message):
        super().__init__(f"{field}: {message}")
        self.field = field
        self.message = message

try:
    raise ValidationError("age", "must be a number")
except ValidationError as error:
    print(error)
    print(error.field, "|", error.message)
```

The call to `super().__init__` sets the message, so `str(error)` works. Now the handler can put the error next to the right form field.

## A hierarchy for a library

A library usually defines **one base exception**, and derives specific ones from it. Users can catch everything from your library with one clause:

```python
class ShopError(Exception):
    "Base class for all errors in this library."

class OutOfStock(ShopError):
    def __init__(self, item):
        super().__init__(f"{item} is out of stock")
        self.item = item

class PaymentFailed(ShopError):
    pass

def buy(item, stock):
    if stock.get(item, 0) == 0:
        raise OutOfStock(item)
    stock[item] -= 1
    return "bought " + item

stock = {"pen": 1}
print(buy("pen", stock))
try:
    buy("pen", stock)
except ShopError as error:
    print("shop error:", error)
```

Name your classes after **what went wrong**, and end them with `Error` (or `Exception`).

## Do not use exceptions as ordinary control flow

Exceptions are for **exceptional** situations. Do not raise one to leave a loop or to return a normal result. A short `try`/`except` around an operation that fails rarely is fine, but a design where errors are the normal path is slow and hard to follow.

## Adding notes

Python 3.11 added `add_note`, so a handler can attach extra context without changing the message:

```python
try:
    try:
        int("abc")
    except ValueError as error:
        error.add_note("while reading the 'port' setting")
        raise
except ValueError as error:
    print(error.__notes__)
```

## ExceptionGroup and except*

Sometimes several errors happen at once, for example when validating a whole form, or when running many tasks together. An **`ExceptionGroup`** bundles several exceptions into one. The **`except*`** clause handles the members by type:

```python
errors = [ValueError("bad value"), TypeError("bad type"), ValueError("another bad value")]

try:
    raise ExceptionGroup("validation failed", errors)
except* ValueError as group:
    print("value errors:", len(group.exceptions))
except* TypeError as group:
    print("type errors:", len(group.exceptions))
```

Each `except*` clause receives a **group** with just the members of its type. Several clauses can run for one raise. Note that you cannot mix `except` and `except*` in one `try`.

## Common mistakes

- Raising the base `Exception` with a vague message.
- Catching an error and raising another one without `from`, so the cause is lost.
- Creating custom exceptions that do not inherit from a sensible built-in.
- Building the message but forgetting `super().__init__`, so `str(error)` is empty.

## Recap

- `raise SomeError("message")` signals a problem. Pick the most fitting type.
- `raise ... from error` keeps the cause.
- Custom exceptions inherit from built-ins, and can carry extra attributes.
- A library base exception lets callers catch everything at once.
- `ExceptionGroup` and `except*` handle several errors together.

## Your turn

In the **Practice** tab you write `ValidationError`, `validate(user)` and `problem(user)`. Then three challenges use the Chinook store.
