**Behavioural patterns** describe how objects **communicate and share responsibility** for a task. This lesson covers four classics — strategy, observer, command, and state — and shows that in Python, several of them are often implementable with a **plain function**, no class hierarchy required.

You will learn:

- strategy, implemented with functions instead of a class hierarchy
- observer: an event emitter that notifies listeners
- command: wrapping an action (with its undo) as an object
- state: modelling a state machine with an enum and a transition table
- the iterator and template method patterns, briefly, as ones you already know

## Strategy, with functions

You met the strategy pattern properly in the composition-over-inheritance lesson: a class holds a swappable behaviour object. In Python, when the "strategy" needs no state of its own, a **plain function** is often the whole implementation:

```python
def total_after_standard(prices):
    return sum(prices)

def total_after_discount(prices):
    return sum(prices) * 0.9

def checkout(prices, strategy):
    return strategy(prices)

print(checkout([10, 20, 30], total_after_standard))
print(checkout([10, 20, 30], total_after_discount))
```

No `Strategy` base class, no `.apply()` method — `checkout` just calls whatever function it was given. This is the same idea as the class-based version, with less ceremony, because functions are already first-class values in Python.

## Observer: an event emitter

The **observer** pattern lets objects (**listeners**) register interest in something, and be notified automatically when it happens, without the source needing to know who is listening:

```python
class Emitter:
    def __init__(self):
        self._listeners = {}

    def on(self, event, callback):
        self._listeners.setdefault(event, []).append(callback)

    def off(self, event, callback):
        self._listeners[event].remove(callback)

    def emit(self, event, *args):
        for callback in self._listeners.get(event, []):
            callback(*args)

emitter = Emitter()

def on_sale(item, price):
    print(f"sold {item} for {price}")

emitter.on("sale", on_sale)
emitter.emit("sale", "pen", 1.5)
emitter.off("sale", on_sale)
emitter.emit("sale", "ink", 3.0)
```

The second `emit` prints nothing, because `on_sale` was removed. `Emitter` never needs to know **what** `on_sale` does, or how many listeners exist — it just calls whatever is registered when the moment comes. This is the same underlying idea as a GUI's "on click" handler, or a web framework's event hooks.

## Command: an action as an object

The **command** pattern wraps a request as an object, which lets you queue it, log it, or **undo** it — treating an action as data, rather than an immediate function call:

```python
class AddItemCommand:
    def __init__(self, cart, item):
        self.cart = cart
        self.item = item

    def execute(self):
        self.cart.append(self.item)

    def undo(self):
        self.cart.remove(self.item)

cart = []
commands = []

for item in ["pen", "ink"]:
    cmd = AddItemCommand(cart, item)
    cmd.execute()
    commands.append(cmd)

print(cart)
commands[-1].undo()
print(cart)
```

Because each `AddItemCommand` remembers exactly what it did, undoing is simply calling `undo()` on the most recent one — the basis of every "undo" button you have ever clicked.

## State: a state machine with an enum

You met `Enum` in Core Python, and a transition table in the enum lesson of this tier's data model section. The **state pattern** formalises exactly that idea: a fixed set of states, and a table of which transitions are legal:

```python
from enum import Enum

class OrderState(Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    CANCELLED = "cancelled"

TRANSITIONS = {
    OrderState.PENDING: {OrderState.PAID, OrderState.CANCELLED},
    OrderState.PAID: {OrderState.SHIPPED, OrderState.CANCELLED},
    OrderState.SHIPPED: set(),
    OrderState.CANCELLED: set(),
}

class Order:
    def __init__(self):
        self.state = OrderState.PENDING

    def transition_to(self, new_state):
        if new_state not in TRANSITIONS[self.state]:
            raise ValueError(f"cannot go from {self.state} to {new_state}")
        self.state = new_state

order = Order()
order.transition_to(OrderState.PAID)
print(order.state)
```

<!-- expect-error -->
```python
from enum import Enum

class OrderState(Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"

TRANSITIONS = {OrderState.PENDING: {OrderState.PAID}, OrderState.PAID: set()}

class Order:
    def __init__(self):
        self.state = OrderState.PENDING

    def transition_to(self, new_state):
        if new_state not in TRANSITIONS[self.state]:
            raise ValueError(f"cannot go from {self.state} to {new_state}")
        self.state = new_state

order = Order()
order.transition_to(OrderState.PAID)
order.transition_to(OrderState.PENDING)
```

The illegal transition is rejected in one place, rather than scattered across every part of the program that might change an order's state.

## Two you already know: iterator and template method

You have, in effect, already learned two more behavioural patterns under different names:

- The **iterator** pattern is exactly the `__iter__`/`__next__` protocol from the previous section — a standard way to step through a collection without exposing how it is stored.
- The **template method** pattern is a base class method that calls a series of steps, some of which subclasses override — which is precisely what the `Shape.describe()` method (calling the polymorphic `self.area()`) demonstrated back in the overriding lesson.

Recognising these as "patterns" is mostly about vocabulary at this point: you have been using the ideas correctly since earlier in this tier.

## Common mistakes

- Building a full strategy class hierarchy when a plain function argument would do.
- Forgetting to remove listeners from an emitter, causing them to keep firing (and keeping objects alive) long after they are needed.
- A command's `undo` that does not perfectly reverse its `execute`, causing silent state drift.
- A state machine whose legal transitions are checked in several different places instead of one table.

## Your turn

In the **Practice** tab you write a small event `Emitter` with `on`, `off` and `emit`. Then three challenges use real data.
