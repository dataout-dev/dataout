**Refactoring** means changing a program's internal structure without changing what it does — making it easier to understand and to extend, while every existing test keeps passing. This lesson gives you a vocabulary for the smells that signal "this could be better", a handful of small, safe refactoring moves, and the one rule that makes the whole practice safe.

You will learn:

- code smells: long function, large class, primitive obsession, shotgun surgery, duplicated code, feature envy
- small, safe refactoring steps
- extract function and extract class
- replacing conditionals with polymorphism
- the one rule: never refactor without tests

## Code smells

A **smell** is not a bug — the code works — but it is a sign that change will be harder than it needs to be.

**Long function.** A function that has grown to do five things is hard to read in one glance, and hard to test in isolation.

```python
def process_order(order):
    total = sum(item["price"] * item["qty"] for item in order["items"])
    if order["customer"]["country"] == "US":
        total *= 1.08
    if total > 100:
        total *= 0.95
    print(f"Order for {order['customer']['name']}: ${total:.2f}")
    return total
```

**Large class.** The "god class" from the very first design lesson of this tier: a class that has accumulated unrelated responsibilities.

**Primitive obsession.** Using plain strings, numbers, or tuples where a small class (a value object, from earlier in this section) would express the idea, and its rules, far more clearly:

```python
def send_email(address):
    if "@" not in address:
        raise ValueError("bad address")
```

Every function that receives an e-mail address has to re-check it is valid, because nothing stops a plain string from being anything at all.

**Shotgun surgery.** One conceptual change (say, "how we calculate tax") requires editing many, scattered places, because the same rule is duplicated everywhere instead of living in one function or class.

**Duplicated code.** The same logic, copied instead of shared — the direct cause of shotgun surgery, and a maintenance risk on its own: fix a bug in one copy, and the others silently keep the bug.

**Feature envy.** You met this one already, in the cohesion and coupling lesson: a method that is more interested in another object's data than its own.

## Extract function

The single most useful refactoring move: pull a chunk of a long function out into its **own**, well-named function.

```python
def process_order(order):
    total = calculate_subtotal(order["items"])
    total = apply_tax(total, order["customer"]["country"])
    total = apply_bulk_discount(total)
    print(f"Order for {order['customer']['name']}: ${total:.2f}")
    return total

def calculate_subtotal(items):
    return sum(item["price"] * item["qty"] for item in items)

def apply_tax(total, country):
    return total * 1.08 if country == "US" else total

def apply_bulk_discount(total):
    return total * 0.95 if total > 100 else total
```

`process_order` now reads almost like a summary of the steps, and each extracted piece can be tested and understood on its own.

## Extract class

When a class is doing too much (the large-class smell), pull the unrelated part out into its **own** class, exactly as the single-responsibility lesson demonstrated:

```python
class Order:
    def __init__(self, items):
        self.items = items

    def total(self):
        return sum(item["price"] * item["qty"] for item in self.items)

class OrderPrinter:
    def describe(self, order):
        return f"Order total: {order.total():.2f}"
```

## Replace conditionals with polymorphism

An `if`/`elif` chain that branches on a **type**, or a type-like field, is often better expressed as separate classes, each handling its own case — exactly the Open/Closed pattern from the creational-patterns lesson:

```python
def shipping_cost(order_type, weight):
    if order_type == "standard":
        return weight * 1.0
    elif order_type == "express":
        return weight * 2.5
    elif order_type == "overnight":
        return weight * 5.0
```

becomes:

```python
class StandardShipping:
    def cost(self, weight):
        return weight * 1.0

class ExpressShipping:
    def cost(self, weight):
        return weight * 2.5

class OvernightShipping:
    def cost(self, weight):
        return weight * 5.0

def shipping_cost(strategy, weight):
    return strategy.cost(weight)
```

Each branch becomes its own small, independently testable piece, and a new shipping type needs no edits to existing code at all.

## Small, safe steps

Refactor in the **smallest** steps that still leave the program working: extract one function, run the tests, commit; rename one thing, run the tests, commit. Large, sweeping rewrites done all at once are exactly how a "simple cleanup" turns into a multi-day debugging session, because when something breaks, there are a hundred candidate changes to suspect instead of one.

## The one rule: never refactor without tests

Refactoring is defined as changing structure **without** changing behaviour. Without tests, you have no way to **know** whether you kept that promise — a refactor without tests is really just a rewrite, with all the risk that implies. Before refactoring code that has no tests, the very first, smallest safe step is to write a handful covering its current, observable behaviour (exactly the testing-classes lesson's approach), and only then start moving code around, checking after every step that they still pass.

## Common mistakes

- Refactoring and adding new behaviour in the same change, making it unclear which part broke something if a test fails.
- Doing a large rewrite in one uninterrupted sitting, instead of small, separately verifiable steps.
- Refactoring code that has no tests at all, with no way to confirm nothing changed.
- Extracting a function or class but choosing a vague name, so the "improvement" reads no more clearly than before.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
