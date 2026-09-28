import { py, oop } from './common.js'

export const designLessonsA = [
    {
      id: 'py-solid-principles',
      title: 'The SOLID principles in Python',
      blurb: 'Single responsibility, open/closed, Liskov, interface segregation, dependency inversion.',
      kind: 'learn',
      check: [
        {
          q: 'A `Report` class computes totals, writes files, and sends e-mails. Which SOLID principle does it most clearly violate?',
          options: ['Liskov substitution', 'Single responsibility', 'Interface segregation', 'Dependency inversion'],
          answer: 1,
          why: 'A class with several unrelated reasons to change violates single responsibility. Splitting the concerns into separate classes or functions fixes it.',
        },
        {
          q: 'A function has a long `if`/`elif` chain that needs a new branch every time a new "order type" is added. Rewriting it as one class per order type, chosen polymorphically, is an example of which principle?',
          options: ['Open/closed', 'Single responsibility', 'Liskov substitution', 'Interface segregation'],
          answer: 0,
          why: 'The rewritten code is open for extension (add a new class) but closed for modification (the calling code never changes).',
        },
        {
          q: 'Which SOLID principle did you already study in detail, under its own name, earlier in this tier?',
          options: ['Single responsibility', 'Liskov substitution', 'Interface segregation', 'Dependency inversion'],
          answer: 1,
          why: 'The overriding and substitution lesson covered the Liskov substitution principle in depth, with the PickyRectangle example.',
        },
        {
          q: 'An interface requires every implementer to define `work()` and `eat()`, but a `Robot` class has no sensible way to `eat()`. Which principle does this interface violate?',
          options: ['Interface segregation', 'Open/closed', 'Single responsibility', 'Liskov substitution'],
          answer: 0,
          why: 'Interface segregation says not to force a class to implement methods it does not need. Smaller, focused interfaces (or Protocols) avoid this.',
        },
        {
          q: 'A class builds its own `MysqlDatabase` inside `__init__`, instead of accepting a database as a constructor argument. What does passing it in as an argument achieve?',
          options: [
            'It makes the code run faster',
            'It applies dependency inversion, letting the class depend on any object with the right interface instead of one concrete class',
            'It removes the need for a constructor entirely',
            'It automatically adds validation',
          ],
          answer: 1,
          why: 'Accepting the dependency as an argument inverts the direction of dependency: the class now depends on an abstraction ("something with a save method"), not a specific implementation.',
        },
      ],
    },
    {
      id: 'py-cohesion-coupling',
      title: "Cohesion, coupling, Law of Demeter and 'tell, don't ask'",
      blurb: 'Everyday design instincts: how classes relate, and feature envy.',
      kind: 'learn',
      check: [
        {
          q: 'A class has high cohesion when...',
          options: [
            'It has as many methods as possible',
            'Its attributes and methods are all closely related to one clear purpose',
            'It never calls any other class',
            'It has no attributes at all',
          ],
          answer: 1,
          why: 'High cohesion means everything in the class belongs together, working toward one purpose.',
        },
        {
          q: 'What does "high coupling" between two classes mean?',
          options: [
            'They are defined in the same file',
            'One depends heavily on the internal details of the other, so a change in one is likely to break the other',
            'They share a common parent class',
            'They both raise the same exceptions',
          ],
          answer: 1,
          why: 'High coupling means a change to one class\'s internals is likely to ripple into the other, making both harder to change independently.',
        },
        {
          q: 'What does the Law of Demeter recommend?',
          options: [
            'A method should only call methods on itself, its own attributes, or objects passed to it directly, not reach through a chain of attributes',
            'Every class must have exactly one method',
            'Classes should never reference each other',
            'Every method must return `self`',
          ],
          answer: 0,
          why: 'The Law of Demeter warns against "train wrecks" like `order.customer.wallet.balance`, which couple you to several classes\' internals at once.',
        },
        {
          q: 'What does "tell, don\'t ask" recommend, concretely?',
          options: [
            'Ask an object for its data, then decide what to do with it yourself',
            'Tell an object what you want done, and let it use its own data to do it, such as calling `account.withdraw(amount)` instead of checking and changing `account.balance` directly',
            'Never call any methods on other objects',
            'Always ask permission before calling a method',
          ],
          answer: 1,
          why: '"Telling" keeps the decision and the data together, inside the class that owns them, instead of scattering the logic across every caller.',
        },
        {
          q: 'A method mostly reads and manipulates another object\'s data, using almost none of its own. What is this smell called?',
          options: ['Shotgun surgery', 'Feature envy', 'Primitive obsession', 'Duplicated code'],
          answer: 1,
          why: 'Feature envy suggests the method is more interested in another class\'s data than its own, and the logic probably belongs on that other class instead.',
        },
      ],
    },
    {
      id: 'py-creational-patterns',
      title: 'Creational patterns: factory, builder and why singletons are risky',
      blurb: 'Factory functions, registries, the builder pattern, and singleton alternatives.',
      kind: 'code',
      practice: {
        prompt: 'Write `make_shape(spec)`. `spec` is a dictionary with a `"kind"` key: `"circle"` (with `"radius"`) or `"square"` (with `"side"`). Return an instance of a matching class with an `area()` method. An unknown kind raises `ValueError("unknown shape kind: <kind>")`.',
        starter: 'class Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return 3.14159 * self.radius ** 2\n\n\nclass Square:\n    def __init__(self, side):\n        self.side = side\n\n    def area(self):\n        return self.side ** 2\n\n\ndef make_shape(spec):\n    ...\n',
        solution: py`class Circle:
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2


class Square:
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2


def make_shape(spec):
    kind = spec["kind"]
    if kind == "circle":
        return Circle(spec["radius"])
    if kind == "square":
        return Square(spec["side"])
    raise ValueError(f"unknown shape kind: {kind}")`,
        samples: ['round(make_shape({"kind": "circle", "radius": 2}).area(), 2)'],
        cases: [
          ['A circle', 'round(make_shape({"kind": "circle", "radius": 2}).area(), 2)'],
          ['A square', 'make_shape({"kind": "square", "side": 4}).area()'],
          ['Raises for an unknown kind', 'make_shape({"kind": "triangle"})'],
          ['The error message names the kind', 'try:\n    make_shape({"kind": "hexagon"})\nexcept ValueError as e:\n    result = str(e)\nresult'],
          ['A different circle', 'round(make_shape({"kind": "circle", "radius": 1}).area(), 2)'],
        ],
        traps: [
          py`class Circle:
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2


class Square:
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2


def make_shape(spec):
    kind = spec["kind"]
    if kind == "circle":
        return Square(spec["radius"])
    if kind == "square":
        return Square(spec["side"])
    raise ValueError(f"unknown shape kind: {kind}")`,
          py`class Circle:
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2


class Square:
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2


def make_shape(spec):
    kind = spec["kind"]
    if kind == "circle":
        return Circle(spec["radius"])
    if kind == "square":
        return Square(spec["side"])
    return None`,
        ],
      },
      real: [
        oop({
          title: 'A registry-based exporter factory',
          use: ['tracks'],
          starter: 'exporters = {}\n\ndef exporter(name):\n    def decorator(cls):\n        ...\n    return decorator\n\n\n@exporter("names")\nclass NameExporter:\n    def __init__(self, rows):\n        self.rows = rows\n\n    def export(self):\n        return [r["Name"] for r in self.rows]\n\ndef make_exporter(name, rows):\n    return exporters[name](rows)\n\nanswer = (sorted(exporters), make_exporter("names", tracks[:3]).export())\n',
          given: '# tracks is a list of dictionaries. NameExporter is already finished; only the decorator body needs writing.',
          brief: 'Write `exporter(name)`\'s inner `decorator(cls)`: store `cls` in `exporters[name]` and return `cls` unchanged.',
          reference: py`exporters = {}

def exporter(name):
    def decorator(cls):
        exporters[name] = cls
        return cls
    return decorator


@exporter("names")
class NameExporter:
    def __init__(self, rows):
        self.rows = rows

    def export(self):
        return [r["Name"] for r in self.rows]

def make_exporter(name, rows):
    return exporters[name](rows)

answer = (sorted(exporters), make_exporter("names", tracks[:3]).export())`,
          walkthrough: '`exporter("names")` returns `decorator`, and `@exporter("names")` applies it to `NameExporter`, registering the class under `"names"` while returning it unchanged so it still works normally.',
          traps: [py`exporters = {}

def exporter(name):
    def decorator(cls):
        exporters[name] = cls()
        return cls
    return decorator


@exporter("names")
class NameExporter:
    def __init__(self, rows):
        self.rows = rows

    def export(self):
        return [r["Name"] for r in self.rows]

def make_exporter(name, rows):
    return exporters[name](rows)

answer = (sorted(exporters), make_exporter("names", tracks[:3]).export())`],
        }),
        oop({
          title: 'A builder for a playlist',
          use: ['tracks'],
          starter: 'class Playlist:\n    def __init__(self, name, track_names):\n        self.name = name\n        self.track_names = track_names\n\n\nclass PlaylistBuilder:\n    def __init__(self, name):\n        ...\n\n    def add(self, track_name):\n        ...\n\n    def build(self):\n        ...\n\npl = PlaylistBuilder("Favourites").add(tracks[0]["Name"]).add(tracks[1]["Name"]).build()\nanswer = (pl.name, pl.track_names)\n',
          given: '# tracks is a list of dictionaries. Playlist is already finished; only PlaylistBuilder needs writing.',
          brief: 'Write `PlaylistBuilder`: `add(track_name)` appends to an internal list and returns `self` (so calls chain), and `build()` returns a `Playlist` with the accumulated names.',
          reference: py`class Playlist:
    def __init__(self, name, track_names):
        self.name = name
        self.track_names = track_names


class PlaylistBuilder:
    def __init__(self, name):
        self.name = name
        self.track_names = []

    def add(self, track_name):
        self.track_names.append(track_name)
        return self

    def build(self):
        return Playlist(self.name, list(self.track_names))

pl = PlaylistBuilder("Favourites").add(tracks[0]["Name"]).add(tracks[1]["Name"]).build()
answer = (pl.name, pl.track_names)`,
          walkthrough: 'Each `add` returns `self`, which is exactly what allows the calls to chain: `.add(...).add(...)`. `build()` produces the final `Playlist` from whatever was accumulated.',
          traps: [py`class Playlist:
    def __init__(self, name, track_names):
        self.name = name
        self.track_names = track_names


class PlaylistBuilder:
    def __init__(self, name):
        self.name = name
        self.track_names = []

    def add(self, track_name):
        self.track_names.append(track_name)

    def build(self):
        return Playlist(self.name, list(self.track_names))

pl = PlaylistBuilder("Favourites").add(tracks[0]["Name"]).add(tracks[1]["Name"]).build()
answer = (pl.name, pl.track_names)`],
        }),
        oop({
          title: 'A shared module-level instance versus a fresh copy',
          use: ['genres'],
          starter: 'import copy\n\ndefault_settings = {"sort": "name", "limit": 10}\n\ndef new_settings():\n    ...\n\na = new_settings()\nb = new_settings()\na["limit"] = 999\nanswer = (a["limit"], b["limit"], default_settings["limit"])\n',
          given: '# genres is a list of dictionaries (not used directly here; the point is the prototype technique).',
          brief: 'Write `new_settings()`, returning a **deep copy** of `default_settings`, so that changing one caller\'s settings never affects another caller\'s, or the shared default.',
          reference: py`import copy

default_settings = {"sort": "name", "limit": 10}

def new_settings():
    return copy.deepcopy(default_settings)

a = new_settings()
b = new_settings()
a["limit"] = 999
answer = (a["limit"], b["limit"], default_settings["limit"])`,
          walkthrough: 'Each call to `new_settings()` returns an independent copy (the prototype pattern), so changing `a` never touches `b` or the original `default_settings`.',
          traps: [py`default_settings = {"sort": "name", "limit": 10}

def new_settings():
    return default_settings

a = new_settings()
b = new_settings()
a["limit"] = 999
answer = (a["limit"], b["limit"], default_settings["limit"])`],
        }),
      ],
    },
    {
      id: 'py-structural-patterns',
      title: 'Structural patterns: adapter, decorator, facade and proxy',
      blurb: 'Wrapping incompatible interfaces, adding behaviour, and simplifying subsystems.',
      kind: 'code',
      practice: {
        prompt: 'Write `RowsAdapter(legacy_rows)`. Each row in `legacy_rows` is a dict with keys `"n"` and `"s"`. Iterating over a `RowsAdapter` (`for row in adapter:`) must yield dicts with keys `"name"` and `"score"` instead, in the same order.',
        starter: 'class RowsAdapter:\n    def __init__(self, legacy_rows):\n        ...\n\n    def __iter__(self):\n        ...\n',
        solution: py`class RowsAdapter:
    def __init__(self, legacy_rows):
        self._rows = legacy_rows

    def __iter__(self):
        for row in self._rows:
            yield {"name": row["n"], "score": row["s"]}`,
        samples: ['list(RowsAdapter([{"n": "Ada", "s": 95}]))'],
        cases: [
          ['Translates keys', 'list(RowsAdapter([{"n": "Ada", "s": 95}]))'],
          ['Keeps the order', '[r["name"] for r in RowsAdapter([{"n": "A", "s": 1}, {"n": "B", "s": 2}])]'],
          ['An empty source', 'list(RowsAdapter([]))'],
          ['Works in a for loop', 'total = 0\nfor row in RowsAdapter([{"n": "A", "s": 5}, {"n": "B", "s": 3}]):\n    total += row["score"]\ntotal'],
          ['Can be iterated as a list twice (fresh each time)', 'a = RowsAdapter([{"n": "A", "s": 1}])\n(list(a), list(a))'],
        ],
        traps: [
          py`class RowsAdapter:
    def __init__(self, legacy_rows):
        self._rows = legacy_rows

    def __iter__(self):
        for row in self._rows:
            yield {"name": row["s"], "score": row["n"]}`,
          py`class RowsAdapter:
    def __init__(self, legacy_rows):
        self._rows = legacy_rows

    def __iter__(self):
        return iter(self._rows)`,
        ],
      },
      real: [
        oop({
          title: 'An adapter for Chinook customer rows',
          use: ['customers'],
          starter: 'class ContactAdapter:\n    def __init__(self, rows):\n        ...\n\n    def __iter__(self):\n        ...\n\nadapted = list(ContactAdapter(customers[:3]))\nanswer = adapted\n',
          given: '# customers is a list of dictionaries with "FirstName", "LastName" and "Email".',
          brief: 'Write `ContactAdapter(rows)`. Iterating yields dicts with keys `"full_name"` (`"<FirstName> <LastName>"`) and `"contact"` (the `Email`), one per row, in order.',
          reference: py`class ContactAdapter:
    def __init__(self, rows):
        self._rows = rows

    def __iter__(self):
        for row in self._rows:
            yield {"full_name": f"{row['FirstName']} {row['LastName']}", "contact": row["Email"]}

adapted = list(ContactAdapter(customers[:3]))
answer = adapted`,
          walkthrough: 'The adapter translates each raw Chinook row into the shape (`full_name`, `contact`) that other code expects, without changing the original `customers` data at all.',
          traps: [py`class ContactAdapter:
    def __init__(self, rows):
        self._rows = rows

    def __iter__(self):
        for row in self._rows:
            yield {"full_name": row["FirstName"], "contact": row["Email"]}

adapted = list(ContactAdapter(customers[:3]))
answer = adapted`],
        }),
        oop({
          title: 'Stacking decorators around a price',
          use: ['tracks'],
          starter: 'class BasePrice:\n    def __init__(self, amount):\n        self.amount = amount\n\n    def total(self):\n        return self.amount\n\n\nclass TaxDecorator:\n    def __init__(self, wrapped, rate):\n        ...\n\n    def total(self):\n        ...\n\np = TaxDecorator(TaxDecorator(BasePrice(tracks[0]["UnitPrice"]), 0.1), 0.05)\nanswer = round(p.total(), 4)\n',
          given: '# tracks is a list of dictionaries. BasePrice is finished; only TaxDecorator needs writing.',
          brief: 'Write `TaxDecorator(wrapped, rate)`: `total()` returns `wrapped.total() * (1 + rate)`. Stacking two decorators (as in the last line) must apply **both** taxes, one after the other.',
          reference: py`class BasePrice:
    def __init__(self, amount):
        self.amount = amount

    def total(self):
        return self.amount


class TaxDecorator:
    def __init__(self, wrapped, rate):
        self.wrapped = wrapped
        self.rate = rate

    def total(self):
        return self.wrapped.total() * (1 + self.rate)

p = TaxDecorator(TaxDecorator(BasePrice(tracks[0]["UnitPrice"]), 0.1), 0.05)
answer = round(p.total(), 4)`,
          walkthrough: 'Each `TaxDecorator` wraps the one before it and shares the same `total()` interface, so they stack, each adding its own tax on top of whatever the inner object already reports.',
          traps: [py`class BasePrice:
    def __init__(self, amount):
        self.amount = amount

    def total(self):
        return self.amount


class TaxDecorator:
    def __init__(self, wrapped, rate):
        self.wrapped = wrapped
        self.rate = rate

    def total(self):
        return self.wrapped.amount * (1 + self.rate)

p = TaxDecorator(TaxDecorator(BasePrice(tracks[0]["UnitPrice"]), 0.1), 0.05)
answer = round(p.total(), 4)`],
        }),
        oop({
          title: 'A lazy proxy around a dataset summary',
          use: ['genres'],
          starter: 'class RealSummary:\n    def __init__(self, rows):\n        self.built = True\n        self.count = len(rows)\n\n\nclass LazySummaryProxy:\n    def __init__(self, rows):\n        ...\n\n    @property\n    def count(self):\n        ...\n\nproxy = LazySummaryProxy(genres)\nbuilt_before = proxy._real is not None\nc = proxy.count\nbuilt_after = proxy._real is not None\nanswer = (built_before, c, built_after)\n',
          given: '# genres is a list of dictionaries. RealSummary is finished; only LazySummaryProxy needs writing.',
          brief: 'Write `LazySummaryProxy(rows)` with `self._real = None`. The `count` property should build `RealSummary(rows)` (storing it in `self._real`) only the **first** time it is read, and return `self._real.count`.',
          reference: py`class RealSummary:
    def __init__(self, rows):
        self.built = True
        self.count = len(rows)


class LazySummaryProxy:
    def __init__(self, rows):
        self._rows = rows
        self._real = None

    @property
    def count(self):
        if self._real is None:
            self._real = RealSummary(self._rows)
        return self._real.count

proxy = LazySummaryProxy(genres)
built_before = proxy._real is not None
c = proxy.count
built_after = proxy._real is not None
answer = (built_before, c, built_after)`,
          walkthrough: '`self._real` stays `None` until `count` is actually read for the first time, at which point `RealSummary` is finally built — the whole point of a lazy proxy.',
          traps: [py`class RealSummary:
    def __init__(self, rows):
        self.built = True
        self.count = len(rows)


class LazySummaryProxy:
    def __init__(self, rows):
        self._rows = rows
        self._real = RealSummary(rows)

    @property
    def count(self):
        return self._real.count

proxy = LazySummaryProxy(genres)
built_before = proxy._real is not None
c = proxy.count
built_after = proxy._real is not None
answer = (built_before, c, built_after)`],
        }),
      ],
    },
    {
      id: 'py-behavioural-patterns',
      title: 'Behavioural patterns: strategy, observer, command and state',
      blurb: 'An event emitter, undoable commands, and a state machine.',
      kind: 'code',
      practice: {
        prompt: 'Write `Emitter` with `on(event, callback)`, `off(event, callback)`, and `emit(event, *args)` (calling every registered callback for that event, in the order they were added, with `*args`).',
        starter: 'class Emitter:\n    def __init__(self):\n        ...\n\n    def on(self, event, callback):\n        ...\n\n    def off(self, event, callback):\n        ...\n\n    def emit(self, event, *args):\n        ...\n',
        solution: py`class Emitter:
    def __init__(self):
        self._listeners = {}

    def on(self, event, callback):
        self._listeners.setdefault(event, []).append(callback)

    def off(self, event, callback):
        self._listeners[event].remove(callback)

    def emit(self, event, *args):
        for callback in self._listeners.get(event, []):
            callback(*args)`,
        samples: ['e = Emitter()\nresults = []\ne.on("go", lambda x: results.append(x))\ne.emit("go", 1)\nresults'],
        cases: [
          ['A listener is called', 'e = Emitter()\nresults = []\ne.on("go", lambda x: results.append(x))\ne.emit("go", 1)\nresults'],
          ['Two listeners, in order', 'e = Emitter()\nresults = []\ne.on("go", lambda x: results.append(("a", x)))\ne.on("go", lambda x: results.append(("b", x)))\ne.emit("go", 5)\nresults'],
          ['off removes a listener', 'e = Emitter()\nresults = []\ndef cb(x):\n    results.append(x)\ne.on("go", cb)\ne.off("go", cb)\ne.emit("go", 1)\nresults'],
          ['Emitting an event with no listeners does nothing', 'Emitter().emit("nothing")\n"ok"'],
          ['Different events are independent', 'e = Emitter()\nresults = []\ne.on("a", lambda: results.append("a"))\ne.on("b", lambda: results.append("b"))\ne.emit("a")\nresults'],
          ['Two Emitters do not share listeners', 'a = Emitter()\nb = Emitter()\nresults = []\na.on("go", lambda: results.append("a"))\nb.emit("go")\nresults'],
          ['Multiple arguments are forwarded', 'e = Emitter()\nresults = []\ne.on("go", lambda x, y: results.append(x + y))\ne.emit("go", 2, 3)\nresults'],
        ],
        traps: [
          py`class Emitter:
    def __init__(self):
        self._listeners = {}

    def on(self, event, callback):
        self._listeners[event] = callback

    def off(self, event, callback):
        del self._listeners[event]

    def emit(self, event, *args):
        if event in self._listeners:
            self._listeners[event](*args)`,
          py`class Emitter:
    listeners = {}

    def __init__(self):
        pass

    def on(self, event, callback):
        self.listeners.setdefault(event, []).append(callback)

    def off(self, event, callback):
        self.listeners[event].remove(callback)

    def emit(self, event, *args):
        for callback in self.listeners.get(event, []):
            callback(*args)`,
          py`class Emitter:
    def __init__(self):
        self._listeners = {}

    def on(self, event, callback):
        self._listeners.setdefault(event, []).append(callback)

    def off(self, event, callback):
        self._listeners[event].remove(callback)

    def emit(self, event, *args):
        for callback in reversed(self._listeners.get(event, [])):
            callback(*args)`,
        ],
      },
      real: [
        oop({
          title: 'An emitter that logs invoice events',
          use: ['invoices'],
          starter: 'class Emitter:\n    def __init__(self):\n        self._listeners = {}\n\n    def on(self, event, callback):\n        self._listeners.setdefault(event, []).append(callback)\n\n    def emit(self, event, *args):\n        for callback in self._listeners.get(event, []):\n            callback(*args)\n\nlog = []\nemitter = Emitter()\n\ndef record(invoice_id, total):\n    ...\n\nemitter.on("paid", record)\nfor inv in invoices[:3]:\n    emitter.emit("paid", inv["InvoiceId"], inv["Total"])\nanswer = log\n',
          given: '# invoices is a list of dictionaries. Emitter is already finished; only record needs writing.',
          brief: 'Write `record(invoice_id, total)`: append the tuple `(invoice_id, round(total, 2))` to `log`.',
          reference: py`class Emitter:
    def __init__(self):
        self._listeners = {}

    def on(self, event, callback):
        self._listeners.setdefault(event, []).append(callback)

    def emit(self, event, *args):
        for callback in self._listeners.get(event, []):
            callback(*args)

log = []
emitter = Emitter()

def record(invoice_id, total):
    log.append((invoice_id, round(total, 2)))

emitter.on("paid", record)
for inv in invoices[:3]:
    emitter.emit("paid", inv["InvoiceId"], inv["Total"])
answer = log`,
          walkthrough: '`emitter.emit("paid", ...)` calls every registered listener with the given arguments — here, just `record`, which appends what it was told to `log`.',
          traps: [py`class Emitter:
    def __init__(self):
        self._listeners = {}

    def on(self, event, callback):
        self._listeners.setdefault(event, []).append(callback)

    def emit(self, event, *args):
        for callback in self._listeners.get(event, []):
            callback(*args)

log = []
emitter = Emitter()

def record(invoice_id, total):
    log.append(round(total, 2))

emitter.on("paid", record)
for inv in invoices[:3]:
    emitter.emit("paid", inv["InvoiceId"], inv["Total"])
answer = log`],
        }),
        oop({
          title: 'Undoable commands over a cart',
          use: ['tracks'],
          starter: 'class AddCommand:\n    def __init__(self, cart, item):\n        ...\n\n    def execute(self):\n        ...\n\n    def undo(self):\n        ...\n\ncart = []\ncommands = []\nfor t in tracks[:3]:\n    cmd = AddCommand(cart, t["Name"])\n    cmd.execute()\n    commands.append(cmd)\ncommands[-1].undo()\nanswer = cart\n',
          given: '# tracks is a list of dictionaries.',
          brief: 'Write `AddCommand(cart, item)`: `execute()` appends `item` to `cart`, and `undo()` removes it again.',
          reference: py`class AddCommand:
    def __init__(self, cart, item):
        self.cart = cart
        self.item = item

    def execute(self):
        self.cart.append(self.item)

    def undo(self):
        self.cart.remove(self.item)

cart = []
commands = []
for t in tracks[:3]:
    cmd = AddCommand(cart, t["Name"])
    cmd.execute()
    commands.append(cmd)
commands[-1].undo()
answer = cart`,
          walkthrough: 'Each command remembers exactly what it added, so calling `undo()` on the most recent one removes precisely that item, leaving the earlier ones in place.',
          traps: [py`class AddCommand:
    def __init__(self, cart, item):
        self.cart = cart
        self.item = item

    def execute(self):
        self.cart.append(self.item)

    def undo(self):
        if self.cart:
            self.cart.pop(0)

cart = []
commands = []
for t in tracks[:3]:
    cmd = AddCommand(cart, t["Name"])
    cmd.execute()
    commands.append(cmd)
commands[-1].undo()
answer = cart`],
        }),
        oop({
          title: 'A state machine for invoice status',
          use: ['invoices'],
          starter: 'from enum import Enum\n\nclass Status(Enum):\n    OPEN = "open"\n    PAID = "paid"\n    REFUNDED = "refunded"\n\nTRANSITIONS = {\n    Status.OPEN: {Status.PAID},\n    Status.PAID: {Status.REFUNDED},\n    Status.REFUNDED: set(),\n}\n\nclass InvoiceState:\n    def __init__(self):\n        self.status = Status.OPEN\n\n    def transition_to(self, new_status):\n        ...\n\nstate = InvoiceState()\nstate.transition_to(Status.PAID)\nanswer = [state.status.value]\ntry:\n    state.transition_to(Status.OPEN)\nexcept ValueError as e:\n    answer.append(str(e))\n',
          given: '# invoices is a list of dictionaries (not used directly; the point is the transition table). TRANSITIONS is already defined.',
          brief: 'Write `InvoiceState.transition_to(new_status)`: raise `ValueError(f"cannot go from {self.status} to {new_status}")` if `new_status` is not in `TRANSITIONS[self.status]`, otherwise update `self.status`.',
          reference: py`from enum import Enum

class Status(Enum):
    OPEN = "open"
    PAID = "paid"
    REFUNDED = "refunded"

TRANSITIONS = {
    Status.OPEN: {Status.PAID},
    Status.PAID: {Status.REFUNDED},
    Status.REFUNDED: set(),
}

class InvoiceState:
    def __init__(self):
        self.status = Status.OPEN

    def transition_to(self, new_status):
        if new_status not in TRANSITIONS[self.status]:
            raise ValueError(f"cannot go from {self.status} to {new_status}")
        self.status = new_status

state = InvoiceState()
state.transition_to(Status.PAID)
answer = [state.status.value]
try:
    state.transition_to(Status.OPEN)
except ValueError as e:
    answer.append(str(e))`,
          walkthrough: 'The transition table is checked in exactly one place, so an illegal move (going back from `PAID` to `OPEN`) is rejected consistently, however the state is reached.',
          traps: [py`from enum import Enum

class Status(Enum):
    OPEN = "open"
    PAID = "paid"
    REFUNDED = "refunded"

TRANSITIONS = {
    Status.OPEN: {Status.PAID},
    Status.PAID: {Status.REFUNDED},
    Status.REFUNDED: set(),
}

class InvoiceState:
    def __init__(self):
        self.status = Status.OPEN

    def transition_to(self, new_status):
        self.status = new_status

state = InvoiceState()
state.transition_to(Status.PAID)
answer = [state.status.value]
try:
    state.transition_to(Status.OPEN)
except ValueError as e:
    answer.append(str(e))`],
        }),
      ],
    },
]
