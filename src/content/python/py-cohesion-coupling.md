SOLID gives you five named principles. This lesson gives you the more basic **vocabulary and instincts** underneath them: cohesion, coupling, the Law of Demeter, and "tell, don't ask" — the everyday judgment calls you make dozens of times while writing any class, whether or not you ever name a SOLID letter.

You will learn:

- cohesion: how well a class's parts belong together
- coupling: how tightly classes depend on each other's details
- the Law of Demeter ("don't talk to strangers")
- "tell, don't ask": a concrete habit that improves both
- feature envy, a smell that points at misplaced logic
- refactoring toward small interfaces

## Cohesion: do these things belong together?

A class has **high cohesion** when its attributes and methods are all closely related to one clear purpose. It has **low cohesion** when it bundles unrelated concerns — exactly the "god class" and "single responsibility" problem from the previous lesson, now given its own name.

```python
class Order:
    def __init__(self, items):
        self.items = items

    def total(self):
        return sum(item.price for item in self.items)

    def format_as_html(self):
        return f"<p>Total: {self.total()}</p>"

    def send_to_warehouse_api(self):
        print("pretending to call an external warehouse API")
```

`total` belongs with `Order`. Formatting HTML and calling an external API are different concerns, likely to change for different reasons, and pull `Order`'s cohesion down.

## Coupling: how much do classes know about each other?

**Coupling** measures how much one piece of code depends on the **internal details** of another. Low coupling is good: classes can change independently. High coupling means a small change in one class ripples through many others.

```python
class Engine:
    def __init__(self):
        self.rpm = 0

class Car:
    def accelerate(self):
        self.engine.rpm += 1000
```

`Car` reaches directly into `Engine`'s internal `rpm` attribute. If `Engine` later renames `rpm` or changes how it tracks speed, `Car` breaks too. Tighter encapsulation reduces this:

```python
class Engine:
    def __init__(self):
        self._rpm = 0

    def rev(self, amount):
        self._rpm += amount

class Car:
    def accelerate(self):
        self.engine.rev(1000)
```

Now `Car` depends only on `Engine`'s public **behaviour** (`rev`), not its internal storage. `Engine` is free to change how it tracks RPM internally.

## The Law of Demeter: don't talk to strangers

Also phrased as "only talk to your immediate friends": a method should call methods on **itself**, on its own attributes, or on objects passed to it directly — not reach through a chain of attributes to get to some distant object:

```python
class Wallet:
    def __init__(self, balance):
        self.balance = balance

class Customer:
    def __init__(self, wallet):
        self.wallet = wallet

class Order:
    def __init__(self, customer):
        self.customer = customer

    def charge(self, amount):
        self.customer.wallet.balance -= amount
```

`Order.charge` reaches through **two** dots (`customer.wallet.balance`) to touch data that is not its own. This is sometimes called a "train wreck" of dots. It couples `Order` to the exact internal structure of `Customer` **and** `Wallet` simultaneously. The fix delegates the request instead of reaching through:

```python
class Wallet:
    def __init__(self, balance):
        self.balance = balance

    def deduct(self, amount):
        self.balance -= amount

class Customer:
    def __init__(self, wallet):
        self.wallet = wallet

    def charge(self, amount):
        self.wallet.deduct(amount)

class Order:
    def __init__(self, customer):
        self.customer = customer

    def charge(self, amount):
        self.customer.charge(amount)
```

Now `Order` only ever talks to its **immediate** friend, `self.customer`. Each class hides its own internals and offers a behaviour instead.

## Tell, don't ask

This is the concrete habit that produces low coupling and the Law of Demeter almost automatically: instead of **asking** an object for its data and then deciding what to do with it yourself, **tell** the object what you want done, and let it decide how, using data it already has:

```python
class Account:
    def __init__(self, balance):
        self.balance = balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount

account = Account(100)
amount = 30

# Asking
if account.balance >= amount:
    account.balance -= amount
else:
    print("insufficient funds")

# Telling
account.withdraw(amount)
```

The "asking" version needs to know `Account`'s internal rules (that `balance` exists, and what "enough" means). The "telling" version lets `Account.withdraw` own that decision entirely — which is also exactly how the `BankAccount` class, back in the first section of this tier, was designed from the very start.

## Feature envy: a smell that points at misplaced logic

**Feature envy** is when a method seems more interested in another class's data than its own — a sign the logic is living in the wrong place:

```python
class OrderPrinter:
    def describe(self, order):
        return f"{order.customer.name} ordered {len(order.items)} items for {order.total()}"
```

`OrderPrinter.describe` uses nothing of its own; it is entirely about `order`'s data. This logic likely belongs as a method **on** `Order` itself (`order.describe()`), or the printer should ask `Order` for a summary rather than assembling one from scattered pieces.

## Refactoring toward small interfaces

When you notice low cohesion, high coupling, a Law of Demeter violation, or feature envy, the fix is almost always the same shape: **move behaviour to where the data already lives**, and expose a small, intention-revealing method instead of raw data. This single habit — ask less, tell more, and keep related things together — does more for a codebase's long-term health than memorising any list of named patterns.

## Common mistakes

- Reaching through multiple dots to get at data instead of asking the nearest object to do the work.
- Exposing raw internal attributes instead of small, meaningful methods.
- Writing a method that mostly manipulates another object's data — a sign it is defined on the wrong class.
- Confusing "low coupling" with "no classes should ever call each other" — the goal is depending on **behaviour**, not on internal details.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
