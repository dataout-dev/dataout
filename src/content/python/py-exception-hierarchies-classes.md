Core Python taught you to design a small exception hierarchy for a library. Now that you can build rich classes, this lesson goes further: designing a **complete**, well-organised hierarchy for a real system, giving each exception the **context** it needs, and wrapping lower-level errors without losing information.

You will learn:

- designing one base exception per library or subsystem
- attaching structured context to an exception, not just a message
- wrapping a lower-level error while preserving its cause
- documenting what a function can raise
- avoiding exceptions that leak implementation details

## One base exception per subsystem

A library or subsystem should define **one** root exception, with specific exceptions inheriting from it. Callers who do not care about the specifics can catch the base; callers who do can catch precisely:

```python
class InventoryError(Exception):
    "Base class for every error raised by the inventory subsystem."

class UnknownItem(InventoryError):
    def __init__(self, name):
        super().__init__(f"unknown item: {name}")
        self.name = name

class OutOfStock(InventoryError):
    def __init__(self, name, requested, available):
        super().__init__(f"only {available} of {name} left, requested {requested}")
        self.name = name
        self.requested = requested
        self.available = available

class InvalidQuantity(InventoryError):
    def __init__(self, quantity):
        super().__init__(f"quantity must be positive, got {quantity}")
        self.quantity = quantity
```

## Attaching structured context

Notice that each exception stores its **data** (`name`, `requested`, `available`) as attributes, not just a formatted message. This lets a caller react precisely, without parsing text:

```python
def sell(stock, name, quantity):
    if quantity <= 0:
        raise InvalidQuantity(quantity)
    if name not in stock:
        raise UnknownItem(name)
    if stock[name] < quantity:
        raise OutOfStock(name, quantity, stock[name])
    stock[name] -= quantity

stock = {"pen": 3}
try:
    sell(stock, "pen", 10)
except OutOfStock as error:
    print(f"short by {error.requested - error.available}")
```

`error.requested - error.available` is exact and reliable. Extracting the same numbers from a formatted string (`"only 3 of pen left, requested 10"`) would be fragile and easy to break by rewording the message later.

## Catching the whole family

Code that does not need the details can still catch everything with the one base class:

```python
def process_order(stock, items):
    results = []
    for name, quantity in items:
        try:
            sell(stock, name, quantity)
            results.append((name, "ok"))
        except InventoryError as error:
            results.append((name, str(error)))
    return results

print(process_order({"pen": 3, "ink": 0}, [("pen", 1), ("ink", 1), ("stapler", 1)]))
```

Three completely different problems (a valid sale, no stock, an unknown item) are all handled by the **one** `except InventoryError` clause, because every specific exception shares that common ancestor.

## Wrapping a lower-level error

When your code calls something that can raise its own, lower-level exceptions (a network library, a database driver), it is often better to **wrap** that error in one of your own, so callers of your subsystem only ever need to know about *your* hierarchy, not every library you happen to use underneath:

```python
class InventoryError(Exception):
    pass

class StorageError(InventoryError):
    "Something went wrong reading or writing inventory data."

def load_stock(source):
    try:
        return {"pen": int(source["pen"])}
    except (KeyError, ValueError) as error:
        raise StorageError("could not read stock data") from error

try:
    load_stock({"pen": "not a number"})
except StorageError as error:
    print(error, "|", type(error.__cause__).__name__)
```

`raise ... from error` (from the Core Python errors lessons) keeps the original `ValueError` visible as `__cause__`, for debugging, while giving callers a single, stable exception type (`StorageError`) to catch — they should not need to know or care that the current implementation happens to use `int()` and dictionaries underneath.

## Documenting what a function can raise

Python has no `throws` declaration, so document raised exceptions explicitly, in the docstring, as part of the function's contract:

```python
def sell(stock, name, quantity):
    """Sell `quantity` of `name` from `stock`.

    Raises:
        InvalidQuantity: if quantity is not positive.
        UnknownItem: if name is not in stock.
        OutOfStock: if there is not enough of name.
    """
```

A caller reading this docstring immediately knows which `except` clauses they might need, without having to read the whole implementation.

## Avoid leaking implementation details

A well-designed exception hierarchy describes problems in terms of **your** subsystem's concepts (`OutOfStock`, `UnknownItem`), not the accidents of how it happens to be implemented today (`KeyError`, `sqlite3.OperationalError`, `requests.ConnectionError`). If you swap the storage engine or the network library later, callers of `sell` should not need to change a single `except` clause.

## Common mistakes

- Letting low-level exceptions (`KeyError`, a database driver's own exception types) leak out of a subsystem's public functions.
- Encoding important data only in the exception's message text, instead of as attributes.
- Forgetting a single base exception, so callers must list every specific exception by hand to "catch everything from this library".
- Wrapping an error without `from`, losing the original cause.

## Your turn

In the **Practice** tab you design an exception hierarchy for an inventory system and use it in `sell`. Then three challenges use real data.
