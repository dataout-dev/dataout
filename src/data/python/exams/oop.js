const py = String.raw

const LOAD = "customers = rows('chinook', 'Customer')\ninvoices = rows('chinook', 'Invoice')\ntracks = rows('chinook', 'Track')\n"

const code = (c) => ({ kind: 'code', points: 10, dataset: 'chinook', starter: 'answer = ', ...c, hidden: LOAD + (c.hidden ?? '') })

export const oopExam = [
  code({
    id: 'oop-exam-1',
    starter: 'class Customer:\n    def __init__(self, row):\n        ...\n\n    def total_spent(self, invoices):\n        ...\n\nc = Customer(customers[0])\nspent = [inv for inv in invoices if inv["CustomerId"] == customers[0]["CustomerId"]]\nanswer = round(c.total_spent(spent), 2)\n',
    given: '# customers and invoices are lists of dictionaries. spent holds the invoices for the first customer.',
    task: 'Write `Customer(row)`, storing the row. Write `total_spent(invoices)`, returning the sum of `Total` over the given invoices, rounded through the caller.',
    reference: py`class Customer:
    def __init__(self, row):
        self.row = row

    def total_spent(self, invoices):
        return sum(inv["Total"] for inv in invoices)

c = Customer(customers[0])
spent = [inv for inv in invoices if inv["CustomerId"] == customers[0]["CustomerId"]]
answer = round(c.total_spent(spent), 2)`,
    walkthrough: 'A method computes from the arguments it is given, here summing `Total` across whichever invoices are passed in.',
    traps: [py`class Customer:
    def __init__(self, row):
        self.row = row

    def total_spent(self, invoices):
        return len(invoices)

c = Customer(customers[0])
spent = [inv for inv in invoices if inv["CustomerId"] == customers[0]["CustomerId"]]
answer = round(c.total_spent(spent), 2)`],
  }),
  {
    id: 'oop-exam-2',
    kind: 'mcq',
    points: 10,
    q: 'A `Version` class defines `__eq__` but not `__hash__`. What happens when you try to put an instance in a `set`?',
    options: [
      'It works exactly like before',
      'It raises `TypeError: unhashable type`, because defining `__eq__` removes the inherited `__hash__`',
      'Python silently uses object identity for hashing',
      'It raises a `SyntaxError`',
    ],
    answer: 1,
    why: 'Defining `__eq__` without `__hash__` disables hashing, because the default identity-based hash would violate the rule that equal objects must have equal hashes.',
  },
  code({
    id: 'oop-exam-3',
    starter: 'class Shape:\n    def area(self):\n        raise NotImplementedError\n\n\nclass TrackBar(Shape):\n    def __init__(self, milliseconds):\n        ...\n\n    def area(self):\n        ...\n\ndef total_area(shapes):\n    return sum(shape.area() for shape in shapes)\n\nbars = [TrackBar(t["Milliseconds"]) for t in tracks[:10]]\nanswer = round(total_area(bars), 2)\n',
    given: '# tracks is a list of dictionaries. total_area already works with any Shape.',
    task: 'Write `TrackBar(Shape)`: `area()` returns the length in seconds (`milliseconds / 1000`), fulfilling the promise `Shape` makes.',
    reference: py`class Shape:
    def area(self):
        raise NotImplementedError


class TrackBar(Shape):
    def __init__(self, milliseconds):
        self.milliseconds = milliseconds

    def area(self):
        return self.milliseconds / 1000

def total_area(shapes):
    return sum(shape.area() for shape in shapes)

bars = [TrackBar(t["Milliseconds"]) for t in tracks[:10]]
answer = round(total_area(bars), 2)`,
    walkthrough: 'Because `TrackBar` honours the interface `Shape` promised, `total_area` works on it without any changes, exactly as substitutability requires.',
    traps: [py`class Shape:
    def area(self):
        raise NotImplementedError


class TrackBar(Shape):
    def __init__(self, milliseconds):
        self.milliseconds = milliseconds

    def area(self):
        return self.milliseconds

def total_area(shapes):
    return sum(shape.area() for shape in shapes)

bars = [TrackBar(t["Milliseconds"]) for t in tracks[:10]]
answer = round(total_area(bars), 2)`],
  }),
  {
    id: 'oop-exam-4',
    kind: 'mcq',
    points: 10,
    q: 'Classes `A` and `B` both inherit from `Base`. Class `C(A, B)` inherits from both. In `C`\'s method resolution order, where does `Base` appear?',
    options: ['Before both `A` and `B`', 'Between `A` and `B`', 'After both `A` and `B`', 'It does not appear at all'],
    answer: 2,
    why: 'Python\'s C3 linearisation always places a shared ancestor after all of its children, and preserves the order the base classes were listed in.',
  },
  code({
    id: 'oop-exam-5',
    starter: 'class PositiveInt:\n    def __set_name__(self, owner, name):\n        self.name = "_" + name\n\n    def __get__(self, instance, owner):\n        if instance is None:\n            return self\n        return getattr(instance, self.name)\n\n    def __set__(self, instance, value):\n        ...\n\n\nclass LineItem:\n    quantity = PositiveInt()\n\n    def __init__(self, quantity):\n        self.quantity = quantity\n\ngood = LineItem(3)\nanswer = [good.quantity]\ntry:\n    LineItem(0)\nexcept ValueError as e:\n    answer.append(str(e))\n',
    given: '# Only PositiveInt.__set__ needs writing.',
    task: 'Write `PositiveInt.__set__`: reject any value that is **not greater than zero** with `ValueError("must be positive")`, otherwise store it.',
    reference: py`class PositiveInt:
    def __set_name__(self, owner, name):
        self.name = "_" + name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name)

    def __set__(self, instance, value):
        if value <= 0:
            raise ValueError("must be positive")
        setattr(instance, self.name, value)


class LineItem:
    quantity = PositiveInt()

    def __init__(self, quantity):
        self.quantity = quantity

good = LineItem(3)
answer = [good.quantity]
try:
    LineItem(0)
except ValueError as e:
    answer.append(str(e))`,
    walkthrough: 'The descriptor validates on every assignment, including the one inside `__init__`, so an invalid `LineItem` can never be constructed.',
    traps: [py`class PositiveInt:
    def __set_name__(self, owner, name):
        self.name = "_" + name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name)

    def __set__(self, instance, value):
        if value < 0:
            raise ValueError("must be positive")
        setattr(instance, self.name, value)


class LineItem:
    quantity = PositiveInt()

    def __init__(self, quantity):
        self.quantity = quantity

good = LineItem(3)
answer = [good.quantity]
try:
    LineItem(0)
except ValueError as e:
    answer.append(str(e))`],
  }),
  code({
    id: 'oop-exam-6',
    starter: 'from dataclasses import dataclass\n\nclass Invoice:\n    total: float\n    invoice_id: int\n\nrows = sorted(Invoice(inv["Total"], inv["InvoiceId"]) for inv in invoices[:10])\nanswer = [round(r.total, 2) for r in rows[:3]]\n',
    given: '# invoices is a list of dictionaries. Add the decorator that makes Invoice frozen and sortable.',
    task: 'Add `@dataclass(frozen=True, order=True)` above `class Invoice`, so it can be constructed from its two annotated fields and sorted directly, without a hand-written `__lt__`. Store the three smallest totals, in order.',
    reference: py`from dataclasses import dataclass

@dataclass(frozen=True, order=True)
class Invoice:
    total: float
    invoice_id: int

rows = sorted(Invoice(inv["Total"], inv["InvoiceId"]) for inv in invoices[:10])
answer = [round(r.total, 2) for r in rows[:3]]`,
    walkthrough: '`order=True` generates comparison methods from the fields in the order they are declared, so sorting works exactly as it would with a hand-written `__lt__` comparing `total` first.',
    traps: [py`from dataclasses import dataclass

@dataclass(frozen=True, order=True)
class Invoice:
    total: float
    invoice_id: int

rows = sorted((Invoice(inv["Total"], inv["InvoiceId"]) for inv in invoices[:10]), reverse=True)
answer = [round(r.total, 2) for r in rows[:3]]`],
  }),
  {
    id: 'oop-exam-7',
    kind: 'mcq',
    points: 10,
    q: 'What is the main practical risk of the classic singleton pattern (a class that guarantees only one instance, via `__new__`)?',
    options: [
      'It uses too much memory',
      'It is really a global variable in disguise, which makes testing harder and hides a dependency that code secretly relies on',
      'It cannot have any methods',
      'Python does not allow overriding `__new__`',
    ],
    answer: 1,
    why: 'A singleton carries every problem of global mutable state. A module-level instance, or an explicitly injected dependency, is usually the better Python idiom.',
  },
  code({
    id: 'oop-exam-8',
    starter: 'class InventoryError(Exception):\n    pass\n\n\nclass OutOfStock(InventoryError):\n    def __init__(self, name, available):\n        ...\n\n\ndef sell(stock, name, qty):\n    ...\n\nstock = {"pen": 2}\nanswer = []\ntry:\n    sell(stock, "pen", 5)\nexcept OutOfStock as e:\n    answer.append((e.name, e.available))\nsell(stock, "pen", 1)\nanswer.append(stock["pen"])\n',
    given: '# A failed sale must leave stock unchanged.',
    task: 'Write `OutOfStock.__init__(self, name, available)`, storing both as attributes (call `super().__init__` with a message). Write `sell(stock, name, qty)`: raise `OutOfStock(name, stock[name])` if `qty > stock[name]`, otherwise reduce `stock[name]` by `qty`.',
    reference: py`class InventoryError(Exception):
    pass


class OutOfStock(InventoryError):
    def __init__(self, name, available):
        super().__init__(f"only {available} of {name} left")
        self.name = name
        self.available = available


def sell(stock, name, qty):
    if qty > stock[name]:
        raise OutOfStock(name, stock[name])
    stock[name] -= qty

stock = {"pen": 2}
answer = []
try:
    sell(stock, "pen", 5)
except OutOfStock as e:
    answer.append((e.name, e.available))
sell(stock, "pen", 1)
answer.append(stock["pen"])`,
    walkthrough: 'The check happens before any mutation, so a rejected sale leaves `stock` exactly as it was, and the exception carries the exact numbers a caller needs, as attributes.',
    traps: [py`class InventoryError(Exception):
    pass


class OutOfStock(InventoryError):
    def __init__(self, name, available):
        super().__init__(f"only {available} of {name} left")
        self.name = name
        self.available = available


def sell(stock, name, qty):
    stock[name] -= qty
    if stock[name] < 0:
        raise OutOfStock(name, stock[name])

stock = {"pen": 2}
answer = []
try:
    sell(stock, "pen", 5)
except OutOfStock as e:
    answer.append((e.name, e.available))
sell(stock, "pen", 1)
answer.append(stock["pen"])`],
  }),
  {
    id: 'oop-exam-9',
    kind: 'mcq',
    points: 10,
    q: 'A method `Order.charge` writes `self.customer.wallet.balance -= amount`, reaching through two dots to change a distant object\'s data. Which principle does this violate, and what is the usual fix?',
    options: [
      'Open/closed; fix by adding a new subclass',
      'The Law of Demeter; fix by adding a method such as `wallet.deduct(amount)` and delegating to it through `customer.charge(amount)`',
      'Liskov substitution; fix by removing the subclass',
      'Interface segregation; fix by splitting the interface',
    ],
    answer: 1,
    why: 'This is a "train wreck" that violates the Law of Demeter. Delegating the request one hop at a time, telling each object what to do with data it already owns, fixes it.',
  },
  code({
    id: 'oop-exam-10',
    starter: 'handlers = {}\n\ndef command(name):\n    def decorator(func):\n        ...\n    return decorator\n\n\n@command("count")\ndef count_tracks(rows):\n    return len(rows)\n\n\n@command("total_price")\ndef total_price(rows):\n    return round(sum(r["UnitPrice"] for r in rows), 2)\n\ndef run(name, rows):\n    return handlers[name](rows)\n\nanswer = (run("count", tracks[:5]), run("total_price", tracks[:5]))\n',
    given: '# tracks is a list of dictionaries. Only the decorator body needs writing.',
    task: 'Write `command(name)`\'s inner `decorator(func)`: store `func` in `handlers[name]` and return `func` unchanged.',
    reference: py`handlers = {}

def command(name):
    def decorator(func):
        handlers[name] = func
        return func
    return decorator


@command("count")
def count_tracks(rows):
    return len(rows)


@command("total_price")
def total_price(rows):
    return round(sum(r["UnitPrice"] for r in rows), 2)

def run(name, rows):
    return handlers[name](rows)

answer = (run("count", tracks[:5]), run("total_price", tracks[:5]))`,
    walkthrough: 'Each `@command("...")` registers its function under a name, so `run` can dispatch by looking the name up, with no `if`/`elif` chain and no change needed when a new command is added.',
    traps: [py`handlers = {}

def command(name):
    def decorator(func):
        handlers[name] = func()
        return func
    return decorator


@command("count")
def count_tracks(rows):
    return len(rows)


@command("total_price")
def total_price(rows):
    return round(sum(r["UnitPrice"] for r in rows), 2)

def run(name, rows):
    return handlers[name](rows)

answer = (run("count", tracks[:5]), run("total_price", tracks[:5]))`],
  }),
]
