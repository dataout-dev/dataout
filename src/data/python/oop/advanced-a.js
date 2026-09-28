import { py, oop } from './common.js'

export const advancedLessonsA = [
    {
      id: 'py-metaclasses',
      title: 'Classes are objects: type(), class creation and metaclasses',
      blurb: 'type as the class of classes, __init_subclass__, and class decorators.',
      kind: 'code',
      practice: {
        prompt: 'Write `register(cls)`, a **class decorator**. It stores `cls` in the module-level dictionary `registry`, keyed by `cls.__name__`, and returns `cls` unchanged.',
        starter: 'registry = {}\n\ndef register(cls):\n    ...\n',
        solution: py`registry = {}

def register(cls):
    registry[cls.__name__] = cls
    return cls`,
        samples: ['@register\nclass Cat:\n    pass\nregistry["Cat"] is Cat'],
        cases: [
          ['Registers by name', '@register\nclass Cat:\n    pass\nregistry["Cat"] is Cat'],
          ['Returns the class unchanged', '@register\nclass Dog:\n    pass\nDog.__name__'],
          ['Two classes both register', '@register\nclass A:\n    pass\n@register\nclass B:\n    pass\nsorted(k for k in registry if k in ("A", "B"))'],
          ['The class can still be instantiated', '@register\nclass Widget:\n    def __init__(self, n):\n        self.n = n\nWidget(5).n'],
        ],
        traps: [
          py`registry = {}

def register(cls):
    registry[cls.__name__] = cls`,
          py`registry = {}

def register(cls):
    registry[cls] = cls.__name__
    return cls`,
          py`registry = {}

def register(cls):
    registry["cls"] = cls
    return cls`,
        ],
      },
      real: [
        oop({
          title: 'A registry of report formatters',
          use: ['tracks'],
          starter: 'formatters = {}\n\ndef formatter(name):\n    def decorator(cls):\n        ...\n    return decorator\n\n\n@formatter("csv")\nclass CsvFormatter:\n    def render(self, rows):\n        return "\\n".join(",".join(row) for row in rows)\n\nanswer = (sorted(formatters), formatters["csv"]().render([[tracks[0]["Name"]]]))\n',
          given: '# tracks is a list of dictionaries. CsvFormatter is already finished; only the decorator body needs writing.',
          brief: 'Write `formatter(name)`, a decorator **factory**: `decorator(cls)` should store `cls` in `formatters[name]` and return `cls` unchanged.',
          reference: py`formatters = {}

def formatter(name):
    def decorator(cls):
        formatters[name] = cls
        return cls
    return decorator


@formatter("csv")
class CsvFormatter:
    def render(self, rows):
        return "\n".join(",".join(row) for row in rows)

answer = (sorted(formatters), formatters["csv"]().render([[tracks[0]["Name"]]]))`,
          walkthrough: '`formatter("csv")` returns `decorator`, and `@formatter("csv")` then applies it to `CsvFormatter`, registering it under `"csv"` while leaving the class itself untouched.',
          traps: [py`formatters = {}

def formatter(name):
    def decorator(cls):
        formatters[name] = cls()
        return cls
    return decorator


@formatter("csv")
class CsvFormatter:
    def render(self, rows):
        return "\n".join(",".join(row) for row in rows)

answer = (sorted(formatters), formatters["csv"]().render([[tracks[0]["Name"]]]))`],
        }),
        oop({
          title: 'Auto-registering subclasses',
          use: ['genres'],
          starter: 'class Exporter:\n    registry = {}\n\n    def __init_subclass__(cls, **kwargs):\n        ...\n\n\nclass CsvExporter(Exporter):\n    pass\n\n\nclass JsonExporter(Exporter):\n    pass\n\nanswer = sorted(Exporter.registry)\n',
          given: '# genres is a list of dictionaries (unused directly; the point is the registration mechanism).',
          brief: 'Write `Exporter.__init_subclass__`, calling `super().__init_subclass__(**kwargs)` first, then storing `cls` in `Exporter.registry` keyed by `cls.__name__`. Every subclass must register **automatically**, with no decorator needed.',
          reference: py`class Exporter:
    registry = {}

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        Exporter.registry[cls.__name__] = cls


class CsvExporter(Exporter):
    pass


class JsonExporter(Exporter):
    pass

answer = sorted(Exporter.registry)`,
          walkthrough: '`__init_subclass__` fires automatically for every subclass, the moment it is defined — no `@decorator` line is needed on `CsvExporter` or `JsonExporter` at all.',
          traps: [py`class Exporter:
    registry = {}

    def __init_subclass__(cls, **kwargs):
        pass


class CsvExporter(Exporter):
    pass


class JsonExporter(Exporter):
    pass

answer = sorted(Exporter.registry)`],
        }),
        oop({
          title: 'Building a class with type() directly',
          use: ['artists'],
          starter: 'def make_row_class(field_names):\n    ...\n\nRow = make_row_class(["name", "count"])\nr = Row()\nr.name = artists[0]["Name"]\nr.count = 5\nanswer = (type(Row).__name__, Row.__name__, r.name, r.count)\n',
          given: '# artists is a list of dictionaries.',
          brief: 'Write `make_row_class(field_names)`, using `type("Row", (), {})` to build and return a brand-new, empty class named `"Row"` (the `field_names` argument is accepted but not used by the body itself — instances simply get their attributes assigned afterward).',
          reference: py`def make_row_class(field_names):
    return type("Row", (), {})

Row = make_row_class(["name", "count"])
r = Row()
r.name = artists[0]["Name"]
r.count = 5
answer = (type(Row).__name__, Row.__name__, r.name, r.count)`,
          walkthrough: '`type(name, bases, namespace)` builds a class object directly, exactly as the `class` statement does behind the scenes — `type(Row)` reports `"type"`, confirming `Row` is, itself, an ordinary instance of `type`.',
          traps: [py`def make_row_class(field_names):
    return type("Row", (object,), {"fields": field_names})()

Row = make_row_class(["name", "count"])
r = Row()
r.name = artists[0]["Name"]
r.count = 5
answer = (type(Row).__name__, Row.__name__, r.name, r.count)`],
        }),
      ],
    },
    {
      id: 'py-generics-typing',
      title: 'Generics and typing for classes',
      blurb: 'TypeVar, Generic, bounded type variables and a typed Stack.',
      kind: 'code',
      practice: {
        prompt: 'Write a generic `Stack[T]` (use `TypeVar`/`Generic`) with `push(item: T)`, `pop() -> T`, and `peek() -> T`. `pop` and `peek` on an empty stack raise `IndexError("pop from empty stack")` / `IndexError("peek from empty stack")`.',
        starter: 'from typing import TypeVar, Generic\n\nT = TypeVar("T")\n\nclass Stack(Generic[T]):\n    def __init__(self):\n        ...\n\n    def push(self, item):\n        ...\n\n    def pop(self):\n        ...\n\n    def peek(self):\n        ...\n',
        solution: py`from typing import TypeVar, Generic

T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.items:
            raise IndexError("pop from empty stack")
        return self.items.pop()

    def peek(self):
        if not self.items:
            raise IndexError("peek from empty stack")
        return self.items[-1]`,
        samples: ['s = Stack()\ns.push(1)\ns.push(2)\n(s.pop(), s.peek())'],
        cases: [
          ['Push then pop, LIFO order', 's = Stack()\ns.push(1)\ns.push(2)\n(s.pop(), s.pop())'],
          ['Peek does not remove', 's = Stack()\ns.push(1)\n(s.peek(), s.peek())'],
          ['Works with any type', 's = Stack()\ns.push("a")\ns.push("b")\ns.pop()'],
          ['Raises: pop from empty', 'Stack().pop()'],
          ['Raises: peek from empty', 'Stack().peek()'],
          ['A fresh stack after popping everything', 's = Stack()\ns.push(1)\ns.pop()\ns.push(2)\ns.pop()'],
          ['Two stacks are independent', 'a = Stack()\nb = Stack()\na.push(1)\nlen(b.items)'],
        ],
        traps: [
          py`from typing import TypeVar, Generic

T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.items:
            raise IndexError("pop from empty stack")
        return self.items.pop(0)

    def peek(self):
        if not self.items:
            raise IndexError("peek from empty stack")
        return self.items[-1]`,
          py`from typing import TypeVar, Generic

T = TypeVar("T")

class Stack(Generic[T]):
    items = []

    def __init__(self):
        pass

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.items:
            raise IndexError("pop from empty stack")
        return self.items.pop()

    def peek(self):
        if not self.items:
            raise IndexError("peek from empty stack")
        return self.items[-1]`,
          py`from typing import TypeVar, Generic

T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items = [item]

    def pop(self):
        if not self.items:
            raise IndexError("pop from empty stack")
        return self.items.pop()

    def peek(self):
        if not self.items:
            raise IndexError("peek from empty stack")
        return self.items[-1]`,
        ],
      },
      real: [
        oop({
          title: 'A typed queue of track names',
          use: ['tracks'],
          starter: 'from typing import TypeVar, Generic\n\nT = TypeVar("T")\n\nclass Queue(Generic[T]):\n    def __init__(self):\n        ...\n\n    def enqueue(self, item: T) -> None:\n        ...\n\n    def dequeue(self) -> T:\n        ...\n\nq = Queue()\nfor t in tracks[:3]:\n    q.enqueue(t["Name"])\nanswer = [q.dequeue(), q.dequeue(), q.dequeue()]\n',
          given: '# tracks is a list of dictionaries.',
          brief: 'Write `Queue[T]`: `enqueue` adds to one end, `dequeue` removes from the **other** end (first in, first out), unlike a `Stack`.',
          reference: py`from typing import TypeVar, Generic

T = TypeVar("T")

class Queue(Generic[T]):
    def __init__(self):
        self.items = []

    def enqueue(self, item: T) -> None:
        self.items.append(item)

    def dequeue(self) -> T:
        return self.items.pop(0)

q = Queue()
for t in tracks[:3]:
    q.enqueue(t["Name"])
answer = [q.dequeue(), q.dequeue(), q.dequeue()]`,
          walkthrough: 'A queue removes from the **front** (`pop(0)`), giving first-in-first-out order, the opposite of the stack\'s last-in-first-out `pop()`.',
          traps: [py`from typing import TypeVar, Generic

T = TypeVar("T")

class Queue(Generic[T]):
    def __init__(self):
        self.items = []

    def enqueue(self, item: T) -> None:
        self.items.append(item)

    def dequeue(self) -> T:
        return self.items.pop()

q = Queue()
for t in tracks[:3]:
    q.enqueue(t["Name"])
answer = [q.dequeue(), q.dequeue(), q.dequeue()]`],
        }),
        oop({
          title: 'A bounded generic type variable',
          use: ['tracks'],
          starter: 'from typing import TypeVar\n\nNumeric = TypeVar("Numeric", bound=float)\n\ndef largest(items):\n    ...\n\nanswer = largest(sorted({t["UnitPrice"] for t in tracks}))\n',
          given: '# tracks is a list of dictionaries with "UnitPrice".',
          brief: 'Write `largest(items: list[Numeric]) -> Numeric`, returning the biggest item, **without using the built-in `max`**.',
          reference: py`from typing import TypeVar

Numeric = TypeVar("Numeric", bound=float)

def largest(items: list[Numeric]) -> Numeric:
    best = items[0]
    for item in items[1:]:
        if item > best:
            best = item
    return best

answer = largest(sorted({t["UnitPrice"] for t in tracks}))`,
          walkthrough: 'The `bound=float` type variable documents that `largest` works for any numeric type; the implementation itself is an ordinary loop keeping the best value seen so far.',
          traps: [py`from typing import TypeVar

Numeric = TypeVar("Numeric", bound=float)

def largest(items: list[Numeric]) -> Numeric:
    best = items[0]
    for item in items[1:]:
        if item < best:
            best = item
    return best

answer = largest(sorted({t["UnitPrice"] for t in tracks}))`],
        }),
        oop({
          title: 'A generic Pair swapped',
          use: ['customers'],
          starter: 'from typing import TypeVar, Generic\n\nA = TypeVar("A")\nB = TypeVar("B")\n\nclass Pair(Generic[A, B]):\n    def __init__(self, first, second):\n        ...\n\n    def swapped(self):\n        ...\n\np = Pair(customers[0]["FirstName"], customers[0]["Country"])\ns = p.swapped()\nanswer = (p.first, p.second, s.first, s.second)\n',
          given: '# customers is a list of dictionaries.',
          brief: 'Write `Pair.__init__` and `swapped()`, returning a **new** `Pair` with `first` and `second` exchanged.',
          reference: py`from typing import TypeVar, Generic

A = TypeVar("A")
B = TypeVar("B")

class Pair(Generic[A, B]):
    def __init__(self, first, second):
        self.first = first
        self.second = second

    def swapped(self):
        return Pair(self.second, self.first)

p = Pair(customers[0]["FirstName"], customers[0]["Country"])
s = p.swapped()
answer = (p.first, p.second, s.first, s.second)`,
          walkthrough: '`swapped` builds a fresh `Pair` rather than mutating `self`, so the original pair is left completely unchanged.',
          traps: [py`from typing import TypeVar, Generic

A = TypeVar("A")
B = TypeVar("B")

class Pair(Generic[A, B]):
    def __init__(self, first, second):
        self.first = first
        self.second = second

    def swapped(self):
        self.first, self.second = self.second, self.first
        return self

p = Pair(customers[0]["FirstName"], customers[0]["Country"])
s = p.swapped()
answer = (p.first, p.second, s.first, s.second)`],
        }),
      ],
    },
    {
      id: 'py-copying-objects',
      title: 'Copying objects: shallow, deep and custom',
      blurb: 'copy.copy, copy.deepcopy, and __copy__/__deepcopy__.',
      kind: 'code',
      practice: {
        prompt: 'Write `Config(options)`. Add `__deepcopy__` so that `copy.deepcopy` on a `Config` produces a **new** `Config` whose `options` dictionary is **fully independent** (deep-copied) from the original.',
        starter: 'import copy\n\nclass Config:\n    def __init__(self, options):\n        ...\n\n    def __deepcopy__(self, memo):\n        ...\n',
        solution: py`import copy

class Config:
    def __init__(self, options):
        self.options = options

    def __deepcopy__(self, memo):
        return Config(copy.deepcopy(self.options, memo))`,
        samples: ['import copy\noriginal = Config({"debug": False})\ndeep = copy.deepcopy(original)\ndeep.options["debug"] = True\n(original.options, deep.options)'],
        cases: [
          ['Deep copy is independent', 'import copy\noriginal = Config({"debug": False})\ndeep = copy.deepcopy(original)\ndeep.options["debug"] = True\n(original.options, deep.options)'],
          ['Nested lists are independent too', 'import copy\noriginal = Config({"tags": [1, 2]})\ndeep = copy.deepcopy(original)\ndeep.options["tags"].append(3)\n(original.options, deep.options)'],
          ['A plain shallow copy of options works too', 'import copy\noriginal = Config({"a": 1})\ndeep = copy.deepcopy(original)\ndeep.options', ],
          ['The result is a Config', 'import copy\ntype(copy.deepcopy(Config({}))).__name__'],
        ],
        traps: [
          py`import copy

class Config:
    def __init__(self, options):
        self.options = options

    def __deepcopy__(self, memo):
        return Config(self.options)`,
          py`import copy

class Config:
    def __init__(self, options):
        self.options = options

    def __deepcopy__(self, memo):
        return Config(dict(self.options))`,
        ],
      },
      real: [
        oop({
          title: 'Independent invoice line copies',
          use: ['invoices'],
          starter: 'import copy\n\nclass InvoiceRecord:\n    def __init__(self, row):\n        self.row = row\n\n    def safe_copy(self):\n        ...\n\noriginal = InvoiceRecord(dict(invoices[0]))\nshallow = copy.copy(original)\nshallow.row["Total"] = -1\nsafe = original.safe_copy()\nsafe.row["Total"] = -2\nanswer = (original.row["Total"], shallow.row["Total"], safe.row["Total"])\n',
          given: '# invoices is a list of dictionaries. InvoiceRecord.__init__ is already written; only safe_copy needs writing.',
          brief: 'Write `InvoiceRecord.safe_copy()`, returning a **new** `InvoiceRecord` built from a fresh `dict(self.row)`, so that changing the copy\'s row never affects the original — unlike a plain `copy.copy`, which shares the same dictionary.',
          reference: py`import copy

class InvoiceRecord:
    def __init__(self, row):
        self.row = row

    def safe_copy(self):
        return InvoiceRecord(dict(self.row))

original = InvoiceRecord(dict(invoices[0]))
shallow = copy.copy(original)
shallow.row["Total"] = -1
safe = original.safe_copy()
safe.row["Total"] = -2
answer = (original.row["Total"], shallow.row["Total"], safe.row["Total"])`,
          walkthrough: 'A plain `copy.copy` only copies the reference to `row`, so mutating it through `shallow` is visible through `original` too. `safe_copy` builds a **fresh** dictionary, so mutating `safe.row` never touches `original.row` at all.',
          traps: [py`import copy

class InvoiceRecord:
    def __init__(self, row):
        self.row = row

    def safe_copy(self):
        return InvoiceRecord(self.row)

original = InvoiceRecord(dict(invoices[0]))
shallow = copy.copy(original)
shallow.row["Total"] = -1
safe = original.safe_copy()
safe.row["Total"] = -2
answer = (original.row["Total"], shallow.row["Total"], safe.row["Total"])`],
        }),
        oop({
          title: 'A shared cache that deepcopy should not duplicate',
          use: ['genres'],
          starter: 'import copy\n\nclass Catalogue:\n    def __init__(self, items, shared_cache):\n        ...\n\n    def __deepcopy__(self, memo):\n        ...\n\ncache = {"built": True}\noriginal = Catalogue([g["Name"] for g in genres[:3]], cache)\ndeep = copy.deepcopy(original)\ndeep.items.append("Extra")\nanswer = (original.items, deep.items, deep.shared_cache is cache)\n',
          given: '# genres is a list of dictionaries. cache should be shared, not duplicated.',
          brief: 'Write `Catalogue.__init__` and `__deepcopy__`: deep-copy `items`, but keep `shared_cache` **as the same object** in the copy (do not deep-copy it).',
          reference: py`import copy

class Catalogue:
    def __init__(self, items, shared_cache):
        self.items = items
        self.shared_cache = shared_cache

    def __deepcopy__(self, memo):
        return Catalogue(copy.deepcopy(self.items, memo), self.shared_cache)

cache = {"built": True}
original = Catalogue([g["Name"] for g in genres[:3]], cache)
deep = copy.deepcopy(original)
deep.items.append("Extra")
answer = (original.items, deep.items, deep.shared_cache is cache)`,
          walkthrough: 'The list is deep-copied, so appending to the copy never touches the original, while `shared_cache` is passed through unchanged, so both catalogues genuinely share the one cache object.',
          traps: [py`import copy

class Catalogue:
    def __init__(self, items, shared_cache):
        self.items = items
        self.shared_cache = shared_cache

    def __deepcopy__(self, memo):
        return Catalogue(copy.deepcopy(self.items, memo), copy.deepcopy(self.shared_cache, memo))

cache = {"built": True}
original = Catalogue([g["Name"] for g in genres[:3]], cache)
deep = copy.deepcopy(original)
deep.items.append("Extra")
answer = (original.items, deep.items, deep.shared_cache is cache)`],
        }),
        oop({
          title: 'A self-referential structure',
          use: ['artists'],
          starter: 'import copy\n\nclass Node:\n    def __init__(self, name):\n        ...\n\nn = Node(artists[0]["Name"])\nn.next = n\ncopied = copy.deepcopy(n)\nanswer = (copied.name, copied.next is copied, copied is n)\n',
          given: '# artists is a list of dictionaries. n.next points back at n itself.',
          brief: 'Write `Node.__init__`, storing `name` and setting `self.next = None`. Nothing else to add: `copy.deepcopy` already handles the self-reference correctly, using its own `memo` dictionary.',
          reference: py`import copy

class Node:
    def __init__(self, name):
        self.name = name
        self.next = None

n = Node(artists[0]["Name"])
n.next = n
copied = copy.deepcopy(n)
answer = (copied.name, copied.next is copied, copied is n)`,
          walkthrough: '`deepcopy` remembers, by id, every object it has already copied. When it reaches `n.next` and finds `n` itself again, it reuses the **copy** it already made, instead of looping forever or making a second, different copy.',
          traps: [py`import copy

class Node:
    def __init__(self, name):
        self.name = "wrong"
        self.next = None

n = Node(artists[0]["Name"])
n.next = n
copied = copy.deepcopy(n)
answer = (copied.name, copied.next is copied, copied is n)`],
        }),
      ],
    },
    {
      id: 'py-exception-hierarchies-classes',
      title: 'Designing exception hierarchies for classes and libraries',
      blurb: 'One base exception, structured context, and wrapping lower-level errors.',
      kind: 'code',
      practice: {
        prompt: 'Design an exception hierarchy: `InventoryError(Exception)` (base), `UnknownItem(InventoryError)` storing `name`, `OutOfStock(InventoryError)` storing `name`, `requested`, `available`, and `InvalidQuantity(InventoryError)` storing `quantity`. Write `sell(stock, name, quantity)`: raises `InvalidQuantity` if `quantity <= 0`, `UnknownItem` if `name` is not in `stock`, `OutOfStock` if there is not enough; otherwise reduces `stock[name]`.',
        starter: 'class InventoryError(Exception):\n    pass\n\n\nclass UnknownItem(InventoryError):\n    def __init__(self, name):\n        ...\n\n\nclass OutOfStock(InventoryError):\n    def __init__(self, name, requested, available):\n        ...\n\n\nclass InvalidQuantity(InventoryError):\n    def __init__(self, quantity):\n        ...\n\n\ndef sell(stock, name, quantity):\n    ...\n',
        solution: py`class InventoryError(Exception):
    pass


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


def sell(stock, name, quantity):
    if quantity <= 0:
        raise InvalidQuantity(quantity)
    if name not in stock:
        raise UnknownItem(name)
    if stock[name] < quantity:
        raise OutOfStock(name, quantity, stock[name])
    stock[name] -= quantity`,
        samples: ['stock = {"pen": 5}\nsell(stock, "pen", 2)\nstock["pen"]'],
        cases: [
          ['A normal sale', 'stock = {"pen": 5}\nsell(stock, "pen", 2)\nstock["pen"]'],
          ['Raises UnknownItem for a missing item', 'sell({"pen": 5}, "ink", 1)'],
          ['Raises OutOfStock', 'sell({"pen": 1}, "pen", 5)'],
          ['Raises InvalidQuantity for zero', 'sell({"pen": 5}, "pen", 0)'],
          ['Raises InvalidQuantity for negative', 'sell({"pen": 5}, "pen", -1)'],
          ['Raises InvalidQuantity even for an unknown item', 'sell({"pen": 5}, "ink", 0)'],
          ['OutOfStock carries the right numbers', 'try:\n    sell({"pen": 1}, "pen", 5)\nexcept OutOfStock as e:\n    result = (e.name, e.requested, e.available)\nresult'],
          ['All three are InventoryError', 'issubclass(UnknownItem, InventoryError) and issubclass(OutOfStock, InventoryError) and issubclass(InvalidQuantity, InventoryError)'],
          ['A single except catches every kind', 'caught = []\nfor args in [({"pen": 5}, "ink", 1), ({"pen": 1}, "pen", 5), ({"pen": 5}, "pen", 0)]:\n    try:\n        sell(*args)\n    except InventoryError as e:\n        caught.append(type(e).__name__)\ncaught'],
        ],
        traps: [
          py`class InventoryError(Exception):
    pass


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


def sell(stock, name, quantity):
    if name not in stock:
        raise UnknownItem(name)
    if quantity <= 0:
        raise InvalidQuantity(quantity)
    if stock[name] < quantity:
        raise OutOfStock(name, quantity, stock[name])
    stock[name] -= quantity`,
          py`class InventoryError(Exception):
    pass


class UnknownItem(InventoryError):
    def __init__(self, name):
        super().__init__(f"unknown item: {name}")
        self.name = name


class OutOfStock(InventoryError):
    def __init__(self, name, requested, available):
        super().__init__(f"only {available} of {name} left, requested {requested}")
        self.name = requested
        self.requested = name
        self.available = available


class InvalidQuantity(InventoryError):
    def __init__(self, quantity):
        super().__init__(f"quantity must be positive, got {quantity}")
        self.quantity = quantity


def sell(stock, name, quantity):
    if quantity <= 0:
        raise InvalidQuantity(quantity)
    if name not in stock:
        raise UnknownItem(name)
    if stock[name] < quantity:
        raise OutOfStock(name, quantity, stock[name])
    stock[name] -= quantity`,
        ],
      },
      real: [
        oop({
          title: 'Wrapping a parsing error',
          use: ['tracks'],
          starter: 'class CatalogueError(Exception):\n    pass\n\n\nclass RowError(CatalogueError):\n    pass\n\n\ndef parse_price(row):\n    ...\n\nanswer = []\nfor row in [tracks[0], {"UnitPrice": "not a number"}]:\n    try:\n        answer.append(parse_price(row))\n    except RowError as e:\n        answer.append((str(e), type(e.__cause__).__name__))\n',
          given: '# tracks is a list of dictionaries with "UnitPrice".',
          brief: 'Write `parse_price(row)`: return `float(row["UnitPrice"])`. If that raises `(ValueError, TypeError, KeyError)`, raise `RowError("bad price")` **from** the original error, so it is preserved as `__cause__`.',
          reference: py`class CatalogueError(Exception):
    pass


class RowError(CatalogueError):
    pass


def parse_price(row):
    try:
        return float(row["UnitPrice"])
    except (ValueError, TypeError, KeyError) as error:
        raise RowError("bad price") from error

answer = []
for row in [tracks[0], {"UnitPrice": "not a number"}]:
    try:
        answer.append(parse_price(row))
    except RowError as e:
        answer.append((str(e), type(e.__cause__).__name__))`,
          walkthrough: '`raise RowError("bad price") from error` keeps the original `ValueError` visible as `__cause__`, while giving the caller one stable exception type to catch, regardless of which underlying problem occurred.',
          traps: [py`class CatalogueError(Exception):
    pass


class RowError(CatalogueError):
    pass


def parse_price(row):
    try:
        return float(row["UnitPrice"])
    except (ValueError, TypeError, KeyError):
        raise RowError("bad price")

answer = []
for row in [tracks[0], {"UnitPrice": "not a number"}]:
    try:
        answer.append(parse_price(row))
    except RowError as e:
        answer.append((str(e), type(e.__cause__).__name__))`],
        }),
        oop({
          title: 'Catching a whole family at once',
          use: ['customers'],
          starter: 'class ValidationError(Exception):\n    pass\n\n\nclass MissingField(ValidationError):\n    def __init__(self, field):\n        super().__init__(f"missing {field}")\n        self.field = field\n\n\nclass EmptyField(ValidationError):\n    def __init__(self, field):\n        super().__init__(f"empty {field}")\n        self.field = field\n\n\ndef validate_customer(row):\n    ...\n\nresults = []\nfor row in [customers[0], {"FirstName": ""}, {}]:\n    try:\n        validate_customer(row)\n        results.append("ok")\n    except ValidationError as e:\n        results.append(type(e).__name__)\nanswer = results\n',
          given: '# customers is a list of dictionaries. MissingField and EmptyField are already finished.',
          brief: 'Write `validate_customer(row)`: raise `MissingField("FirstName")` if the key is absent, `EmptyField("FirstName")` if it is an empty string, otherwise return normally.',
          reference: py`class ValidationError(Exception):
    pass


class MissingField(ValidationError):
    def __init__(self, field):
        super().__init__(f"missing {field}")
        self.field = field


class EmptyField(ValidationError):
    def __init__(self, field):
        super().__init__(f"empty {field}")
        self.field = field


def validate_customer(row):
    if "FirstName" not in row:
        raise MissingField("FirstName")
    if row["FirstName"] == "":
        raise EmptyField("FirstName")

results = []
for row in [customers[0], {"FirstName": ""}, {}]:
    try:
        validate_customer(row)
        results.append("ok")
    except ValidationError as e:
        results.append(type(e).__name__)
answer = results`,
          walkthrough: 'The single `except ValidationError` in the loop catches both specific exceptions, because they share the one base class — exactly the point of a small hierarchy.',
          traps: [py`class ValidationError(Exception):
    pass


class MissingField(ValidationError):
    def __init__(self, field):
        super().__init__(f"missing {field}")
        self.field = field


class EmptyField(ValidationError):
    def __init__(self, field):
        super().__init__(f"empty {field}")
        self.field = field


def validate_customer(row):
    if row.get("FirstName", "") == "":
        raise EmptyField("FirstName")

results = []
for row in [customers[0], {"FirstName": ""}, {}]:
    try:
        validate_customer(row)
        results.append("ok")
    except ValidationError as e:
        results.append(type(e).__name__)
answer = results`],
        }),
        oop({
          title: 'Structured context beats string parsing',
          use: ['invoices'],
          starter: 'class BillingError(Exception):\n    def __init__(self, invoice_id, shortfall):\n        ...\n\n\ndef charge(invoice, available):\n    ...\n\nanswer = []\nfor inv in invoices[:3]:\n    try:\n        charge(inv, inv["Total"] - 1)\n    except BillingError as e:\n        answer.append(round(e.shortfall, 2))\n',
          given: '# invoices is a list of dictionaries with "InvoiceId" and "Total". Each charge attempt is short by exactly 1.',
          brief: 'Write `BillingError.__init__(self, invoice_id, shortfall)`, storing both as attributes (and calling `super().__init__` with a message). Write `charge(invoice, available)`: if `available < invoice["Total"]`, raise `BillingError(invoice["InvoiceId"], invoice["Total"] - available)`.',
          reference: py`class BillingError(Exception):
    def __init__(self, invoice_id, shortfall):
        super().__init__(f"invoice {invoice_id} short by {shortfall}")
        self.invoice_id = invoice_id
        self.shortfall = shortfall


def charge(invoice, available):
    if available < invoice["Total"]:
        raise BillingError(invoice["InvoiceId"], invoice["Total"] - available)

answer = []
for inv in invoices[:3]:
    try:
        charge(inv, inv["Total"] - 1)
    except BillingError as e:
        answer.append(round(e.shortfall, 2))`,
          walkthrough: 'Storing `shortfall` as a real attribute means the caller can use the exact number directly (`round(e.shortfall, 2)`), rather than trying to parse it back out of a formatted message.',
          traps: [py`class BillingError(Exception):
    def __init__(self, invoice_id, shortfall):
        super().__init__(f"invoice {invoice_id} short by {shortfall}")
        self.invoice_id = invoice_id
        self.shortfall = invoice_id


def charge(invoice, available):
    if available < invoice["Total"]:
        raise BillingError(invoice["InvoiceId"], invoice["Total"] - available)

answer = []
for inv in invoices[:3]:
    try:
        charge(inv, inv["Total"] - 1)
    except BillingError as e:
        answer.append(round(e.shortfall, 2))`],
        }),
      ],
    },
]
