**SOLID** is five design principles, one per letter, that describe object-oriented code which stays easy to change. You have already been using ideas from every one of them throughout this tier, often without the name attached. This lesson gives each one a name, a small example of a violation, and a repair — and a warning about applying any of them too mechanically.

You will learn:

- **S**ingle responsibility
- **O**pen/closed
- **L**iskov substitution (a name you already know from earlier in this tier)
- **I**nterface segregation
- **D**ependency inversion
- how Python's dynamic nature changes each one, in practice

## S: Single Responsibility Principle

**A class should have one reason to change.** The class-design workshop, back in the first section of this tier, warned about "god classes" for exactly this reason.

```python
class Report:
    def __init__(self, rows):
        self.rows = rows

    def total(self):
        return sum(self.rows)

    def save_to_file(self, path):
        with open(path, "w") as f:
            f.write(str(self.total()))

    def email_to(self, address):
        print(f"pretending to email {self.total()} to {address}")
```

`Report` mixes three concerns: computing a total, file I/O, and sending e-mail. A change to how e-mail works should never risk breaking the total calculation. Split them:

```python
class Report:
    def __init__(self, rows):
        self.rows = rows

    def total(self):
        return sum(self.rows)

def save_report(report, path):
    with open(path, "w") as f:
        f.write(str(report.total()))

def email_report(report, address):
    print(f"pretending to email {report.total()} to {address}")
```

Now `Report` has exactly one reason to change: how a total is computed.

## O: Open/Closed Principle

**Code should be open for extension, but closed for modification.** You should be able to add new behaviour without editing code that already works and is already tested.

```python
def shipping_cost(order_type, weight):
    if order_type == "standard":
        return weight * 1.0
    elif order_type == "express":
        return weight * 2.5
    # every new order type means editing this function again
```

Every new `order_type` means opening this function and adding another branch, risking the ones already there. A polymorphic design (from the inheritance and polymorphism section) is open for extension instead:

```python
class StandardShipping:
    def cost(self, weight):
        return weight * 1.0

class ExpressShipping:
    def cost(self, weight):
        return weight * 2.5

def shipping_cost(strategy, weight):
    return strategy.cost(weight)
```

Adding a `NextDayShipping` class needs no change to `shipping_cost` at all.

## L: Liskov Substitution Principle

You met this in depth already: a subclass must be usable **anywhere** its parent is expected, without weakening what the parent promised. The `PickyRectangle` and `BuggyTriangle` examples, back in the overriding lesson, are the canonical violations. Nothing new to add here except: this is the "L" in SOLID.

## I: Interface Segregation Principle

**Do not force a class to implement methods it does not need.** A bloated interface with many unrelated methods makes every implementer carry dead weight:

```python
from abc import ABC, abstractmethod

class Worker(ABC):
    @abstractmethod
    def work(self): ...
    @abstractmethod
    def eat(self): ...

class Robot(Worker):
    def work(self):
        return "welding"

    def eat(self):
        raise NotImplementedError("robots don't eat")
```

`Robot.eat` exists only to satisfy the interface, and lies about what a `Robot` can actually do. Smaller, focused interfaces (the `Protocol` classes from the data model section are a natural fit) let each class implement only what applies to it:

```python
from typing import Protocol

class Workable(Protocol):
    def work(self) -> str: ...

class Eatable(Protocol):
    def eat(self) -> str: ...

class Robot:
    def work(self):
        return "welding"

class Person:
    def work(self):
        return "coding"

    def eat(self):
        return "lunch"
```

`Robot` now simply does not claim to be `Eatable`, instead of implementing a lie.

## D: Dependency Inversion Principle

**Depend on abstractions, not on concrete details.** High-level code (business logic) should not be tightly wired to low-level details (a specific database, a specific file format):

```python
class MysqlDatabase:
    def save(self, data):
        print(f"saving {data} to MySQL")

class OrderService:
    def __init__(self):
        self.db = MysqlDatabase()

    def place_order(self, data):
        self.db.save(data)
```

`OrderService` can only ever use `MysqlDatabase`. Passing the dependency in, rather than constructing it internally, **inverts** the direction of dependency — `OrderService` now depends only on "something with a `save` method", not on any particular database:

```python
class OrderService:
    def __init__(self, database):
        self.database = database

    def place_order(self, data):
        self.database.save(data)

service = OrderService(MysqlDatabase())
```

This is the same idea the repository and dependency-injection lesson, later in this section, develops fully.

## How Python's dynamism changes each principle

Because Python has duck typing and no compile-time interface checks, several of these principles are **easier** to apply loosely than in a strictly typed language: you rarely need a formal interface declaration to depend on "something with a `save` method" — you just call `.save()` and let duck typing do the work. This does not remove the value of the principles; it just means Python code often satisfies "I" and "D" naturally, through ordinary functions and duck typing, without ceremony.

## The warning: do not apply these mechanically

SOLID describes **tendencies to watch for**, not a checklist to satisfy on every class. A three-line utility class with two responsibilities is not automatically a crime; a single `if`/`elif` chain that will realistically never grow a third case does not need a strategy-pattern rewrite. Over-applying these principles produces the opposite problem: needless layers of abstraction, for a change that will never come. Use them to recognise **real** pain (a class that keeps changing for unrelated reasons, a function that grows a new branch every month) rather than as a rulebook to enforce everywhere.

## Common mistakes

- Treating SOLID as a mandatory checklist for every single class, however small.
- Confusing "depend on an abstraction" with "you must always use an ABC" — a `Protocol`, or just consistent duck typing, is often enough in Python.
- Fixing an Open/Closed violation by adding **more** `if`/`elif` branches "just in case" a strategy might be needed later, before that need is real.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
