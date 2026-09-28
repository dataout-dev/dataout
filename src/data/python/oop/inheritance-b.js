import { py, oop } from './common.js'

export const inheritanceLessonsB = [
    {
      id: 'py-polymorphism-duck',
      title: 'Polymorphism and duck typing',
      blurb: 'Same interface, different behaviour, and EAFP applied to types.',
      kind: 'code',
      practice: {
        prompt: 'Write `consume(obj)`. It calls `obj.read()` and returns its result, **uppercased**. It works with **any** object that has a `read()` method, whatever class it belongs to.',
        starter: 'def consume(obj):\n    ...\n',
        solution: py`def consume(obj):
    return obj.read().upper()`,
        samples: ['import io\nconsume(io.StringIO("hello"))'],
        cases: [
          ['A StringIO', 'import io\nconsume(io.StringIO("hello"))'],
          ['A custom class with read()', 'class Fixed:\n    def read(self):\n        return "always this"\nconsume(Fixed())'],
          ['A different custom class', 'class Echo:\n    def __init__(self, text):\n        self.text = text\n    def read(self):\n        return self.text\nconsume(Echo("data out"))'],
          ['Two unrelated classes both work', 'class A:\n    def read(self):\n        return "a"\nclass B:\n    def read(self):\n        return "b"\n(consume(A()), consume(B()))'],
          ['Raises: no read method', 'consume(object())'],
        ],
        traps: [
          py`def consume(obj):
    return obj.read()`,
          py`import io

def consume(obj):
    if not isinstance(obj, io.StringIO):
        return None
    return obj.read().upper()`,
          py`def consume(obj):
    return str(obj).upper()`,
        ],
      },
      real: [
        oop({
          title: 'Anything that can total() itself',
          use: ['invoices'],
          starter: 'def grand_total(things):\n    ...\n\n\nclass InvoiceWrapper:\n    def __init__(self, row):\n        self.row = row\n\n    def total(self):\n        return self.row["Total"]\n\n\nclass FixedAmount:\n    def __init__(self, amount):\n        self.amount = amount\n\n    def total(self):\n        return self.amount\n\nmix = [InvoiceWrapper(inv) for inv in invoices[:3]] + [FixedAmount(100)]\nanswer = round(grand_total(mix), 2)\n',
          given: '# invoices is a list of dictionaries. InvoiceWrapper and FixedAmount are unrelated classes that both have a total() method.',
          brief: 'Write `grand_total(things)`: the sum of `.total()` called on every item, whatever class it is. It must work for the mixed list `mix`, which contains two completely unrelated classes.',
          reference: py`def grand_total(things):
    return sum(thing.total() for thing in things)


class InvoiceWrapper:
    def __init__(self, row):
        self.row = row

    def total(self):
        return self.row["Total"]


class FixedAmount:
    def __init__(self, amount):
        self.amount = amount

    def total(self):
        return self.amount

mix = [InvoiceWrapper(inv) for inv in invoices[:3]] + [FixedAmount(100)]
answer = round(grand_total(mix), 2)`,
          walkthrough: '`grand_total` never checks what kind of object it has. It simply trusts that `.total()` exists, which is true for both classes despite them sharing no common ancestor.',
          traps: [py`def grand_total(things):
    total = 0
    for thing in things:
        if isinstance(thing, dict):
            total += thing.total()
    return total


class InvoiceWrapper:
    def __init__(self, row):
        self.row = row

    def total(self):
        return self.row["Total"]


class FixedAmount:
    def __init__(self, amount):
        self.amount = amount

    def total(self):
        return self.amount

mix = [InvoiceWrapper(inv) for inv in invoices[:3]] + [FixedAmount(100)]
answer = round(grand_total(mix), 2)`],
        }),
        oop({
          title: 'Safe duck typing with EAFP',
          use: ['artists'],
          starter: 'def safe_name(thing):\n    ...\n\n\nclass HasName:\n    def __init__(self, name):\n        self.name = name\n\nanswer = [safe_name(HasName(artists[0]["Name"])), safe_name(object()), safe_name(HasName(artists[1]["Name"]))]\n',
          given: '# artists is a list of dictionaries. object() has no .name at all.',
          brief: 'Write `safe_name(thing)`: returns `thing.name` when it has one, and `"unknown"` otherwise. Use a `try`/`except`, not `hasattr`.',
          reference: py`def safe_name(thing):
    try:
        return thing.name
    except AttributeError:
        return "unknown"


class HasName:
    def __init__(self, name):
        self.name = name

answer = [safe_name(HasName(artists[0]["Name"])), safe_name(object()), safe_name(HasName(artists[1]["Name"]))]`,
          walkthrough: 'EAFP applied to attributes: try the access, and handle the one exception it can raise, rather than checking in advance.',
          traps: [py`def safe_name(thing):
    return thing.name


class HasName:
    def __init__(self, name):
        self.name = name

answer = [safe_name(HasName(artists[0]["Name"])), safe_name(object()), safe_name(HasName(artists[1]["Name"]))]`],
        }),
        oop({
          title: 'A polymorphic __len__',
          use: ['tracks'],
          starter: 'class TrackBox:\n    def __init__(self, names):\n        ...\n\n    def __len__(self):\n        ...\n\nbox = TrackBox([t["Name"] for t in tracks[:7]])\nanswer = (len(box), len(TrackBox([])))\n',
          given: '# tracks is a list of dictionaries.',
          brief: 'Write `TrackBox(names)` storing the list, with `__len__` returning how many names it holds, so that the built-in `len()` works on it directly.',
          reference: py`class TrackBox:
    def __init__(self, names):
        self.names = names

    def __len__(self):
        return len(self.names)

box = TrackBox([t["Name"] for t in tracks[:7]])
answer = (len(box), len(TrackBox([])))`,
          walkthrough: '`len()` is itself polymorphic: it calls `__len__` on whatever it is given, so any class that defines it correctly gets the built-in `len()` for free.',
          traps: [py`class TrackBox:
    def __init__(self, names):
        self.names = names

    def size(self):
        return len(self.names)

box = TrackBox([t["Name"] for t in tracks[:7]])
answer = (len(box), len(TrackBox([])))`],
        }),
      ],
    },
    {
      id: 'py-abc',
      title: 'Abstract base classes with abc',
      blurb: 'ABC, @abstractmethod, abstract properties and collections.abc.',
      kind: 'code',
      practice: {
        prompt: 'Define an **abstract** class `Exporter(ABC)` with an abstract method `export(self, rows)`.\n\nDefine two concrete subclasses:\n\n- `CsvExporter`: `export` joins each row\'s items with commas, and joins the rows with newlines.\n- `JsonExporter`: `export` returns `json.dumps(rows)`.',
        starter: 'from abc import ABC, abstractmethod\n\nclass Exporter(ABC):\n    @abstractmethod\n    def export(self, rows):\n        ...\n\n\nclass CsvExporter(Exporter):\n    def export(self, rows):\n        ...\n\n\nclass JsonExporter(Exporter):\n    def export(self, rows):\n        ...\n',
        solution: py`from abc import ABC, abstractmethod

class Exporter(ABC):
    @abstractmethod
    def export(self, rows):
        ...


class CsvExporter(Exporter):
    def export(self, rows):
        return "\n".join(",".join(row) for row in rows)


class JsonExporter(Exporter):
    def export(self, rows):
        import json
        return json.dumps(rows)`,
        samples: ['CsvExporter().export([["a", "1"], ["b", "2"]])'],
        cases: [
          ['CSV of two rows', 'CsvExporter().export([["a", "1"], ["b", "2"]])'],
          ['CSV of one row', 'CsvExporter().export([["x", "y", "z"]])'],
          ['CSV of no rows', 'CsvExporter().export([])'],
          ['JSON output', 'import json\njson.loads(JsonExporter().export([["a", "1"]]))'],
          ['Both are Exporters', '(isinstance(CsvExporter(), Exporter), isinstance(JsonExporter(), Exporter))'],
          ['Raises: Exporter cannot be instantiated', 'Exporter()'],
        ],
        traps: [
          py`from abc import ABC, abstractmethod

class Exporter(ABC):
    @abstractmethod
    def export(self, rows):
        ...


class CsvExporter(Exporter):
    def export(self, rows):
        return ",".join(",".join(row) for row in rows)


class JsonExporter(Exporter):
    def export(self, rows):
        import json
        return json.dumps(rows)`,
          py`from abc import ABC

class Exporter(ABC):
    def export(self, rows):
        ...


class CsvExporter(Exporter):
    def export(self, rows):
        return "\n".join(",".join(row) for row in rows)


class JsonExporter(Exporter):
    def export(self, rows):
        import json
        return json.dumps(rows)`,
        ],
      },
      real: [
        oop({
          title: 'An abstract summariser for tracks',
          use: ['tracks'],
          starter: 'from abc import ABC, abstractmethod\n\nclass Summariser(ABC):\n    @abstractmethod\n    def summarise(self, tracks):\n        ...\n\n\nclass CountSummariser(Summariser):\n    def summarise(self, tracks):\n        ...\n\n\nclass DurationSummariser(Summariser):\n    def summarise(self, tracks):\n        ...\n\nanswer = (CountSummariser().summarise(tracks[:10]), round(DurationSummariser().summarise(tracks[:10]), 2))\n',
          given: '# tracks is a list of dictionaries with "Milliseconds".',
          brief: 'Write `CountSummariser.summarise(tracks)` returning `len(tracks)`. Write `DurationSummariser.summarise(tracks)` returning the total length in **minutes** (sum of `Milliseconds` divided by 60000).',
          reference: py`from abc import ABC, abstractmethod

class Summariser(ABC):
    @abstractmethod
    def summarise(self, tracks):
        ...


class CountSummariser(Summariser):
    def summarise(self, tracks):
        return len(tracks)


class DurationSummariser(Summariser):
    def summarise(self, tracks):
        return sum(t["Milliseconds"] for t in tracks) / 60000

answer = (CountSummariser().summarise(tracks[:10]), round(DurationSummariser().summarise(tracks[:10]), 2))`,
          walkthrough: 'Both classes fulfil the same abstract contract with completely different logic, which is the whole point of an enforced interface: callers can treat any `Summariser` the same way.',
          traps: [py`from abc import ABC, abstractmethod

class Summariser(ABC):
    @abstractmethod
    def summarise(self, tracks):
        ...


class CountSummariser(Summariser):
    def summarise(self, tracks):
        return len(tracks)


class DurationSummariser(Summariser):
    def summarise(self, tracks):
        return sum(t["Milliseconds"] for t in tracks) / 1000

answer = (CountSummariser().summarise(tracks[:10]), round(DurationSummariser().summarise(tracks[:10]), 2))`],
        }),
        oop({
          title: 'An abstract property for genres',
          use: ['genres'],
          starter: 'from abc import ABC, abstractmethod\n\nclass Labelled(ABC):\n    @property\n    @abstractmethod\n    def label(self):\n        ...\n\n\nclass GenreLabel(Labelled):\n    def __init__(self, name, count):\n        ...\n\n    @property\n    def label(self):\n        ...\n\ncounts = {}\nfor g in genres:\n    counts[g["Name"]] = counts.get(g["Name"], 0) + 1\nfirst = next(iter(counts.items()))\nanswer = GenreLabel(*first).label\n',
          given: '# genres is a list of dictionaries. counts maps a genre name to how many rows have it.',
          brief: 'Write `GenreLabel(name, count)`, implementing the **abstract property** `label`, returning `f"<name> ({count})"`.',
          reference: py`from abc import ABC, abstractmethod

class Labelled(ABC):
    @property
    @abstractmethod
    def label(self):
        ...


class GenreLabel(Labelled):
    def __init__(self, name, count):
        self.name = name
        self.count = count

    @property
    def label(self):
        return f"{self.name} ({self.count})"

counts = {}
for g in genres:
    counts[g["Name"]] = counts.get(g["Name"], 0) + 1
first = next(iter(counts.items()))
answer = GenreLabel(*first).label`,
          walkthrough: 'An abstract property is fulfilled by an ordinary `@property` in the subclass; Python checks that the **name** is implemented, not how.',
          traps: [py`from abc import ABC, abstractmethod

class Labelled(ABC):
    @property
    @abstractmethod
    def label(self):
        ...


class GenreLabel(Labelled):
    def __init__(self, name, count):
        self.name = name
        self.count = count

    def label(self):
        return f"{self.name} ({self.count})"

counts = {}
for g in genres:
    counts[g["Name"]] = counts.get(g["Name"], 0) + 1
first = next(iter(counts.items()))
answer = GenreLabel(*first).label`],
        }),
        oop({
          title: 'Checking against collections.abc',
          use: ['tracks'],
          starter: 'from collections.abc import Sized, Iterable\n\nclass NameBag:\n    def __init__(self, names):\n        self.names = names\n\n    def __len__(self):\n        ...\n\n    def __iter__(self):\n        ...\n\nbag = NameBag([t["Name"] for t in tracks[:5]])\nanswer = (isinstance(bag, Sized), isinstance(bag, Iterable), len(bag), list(bag))\n',
          given: '# tracks is a list of dictionaries. Sized and Iterable are already imported.',
          brief: 'Write `NameBag.__len__` and `__iter__` so that `NameBag` satisfies both `Sized` and `Iterable` from `collections.abc`, and so that `list(bag)` gives the names in order.',
          reference: py`from collections.abc import Sized, Iterable

class NameBag:
    def __init__(self, names):
        self.names = names

    def __len__(self):
        return len(self.names)

    def __iter__(self):
        return iter(self.names)

bag = NameBag([t["Name"] for t in tracks[:5]])
answer = (isinstance(bag, Sized), isinstance(bag, Iterable), len(bag), list(bag))`,
          walkthrough: '`collections.abc` classes use `__subclasshook__` to recognise **any** class that defines the right special methods, so implementing `__len__` and `__iter__` is enough to satisfy `Sized` and `Iterable`, with no explicit inheritance needed.',
          traps: [py`from collections.abc import Sized, Iterable

class NameBag:
    def __init__(self, names):
        self.names = names

    def length(self):
        return len(self.names)

    def __iter__(self):
        return iter(self.names)

bag = NameBag([t["Name"] for t in tracks[:5]])
answer = (isinstance(bag, Sized), isinstance(bag, Iterable), len(bag), list(bag))`],
        }),
      ],
    },
    {
      id: 'py-protocols',
      title: 'Protocols and structural typing',
      blurb: 'typing.Protocol, runtime_checkable, and structural versus nominal typing.',
      kind: 'code',
      practice: {
        prompt: 'Define `HasArea(Protocol)` with an `area(self) -> float` method (structurally only; no need for `@runtime_checkable`). Write `total_area(shapes)` that sums `.area()` over any list, **rounded to 2 decimals** — it should work with classes that never mention `HasArea` at all.',
        starter: 'from typing import Protocol\n\nclass HasArea(Protocol):\n    def area(self) -> float:\n        ...\n\n\ndef total_area(shapes):\n    ...\n',
        solution: py`from typing import Protocol

class HasArea(Protocol):
    def area(self) -> float:
        ...


def total_area(shapes):
    return round(sum(shape.area() for shape in shapes), 2)`,
        samples: ['class Sq:\n    def __init__(self, s):\n        self.s = s\n    def area(self):\n        return self.s * self.s\ntotal_area([Sq(2), Sq(3)])'],
        cases: [
          ['A class that never mentions HasArea', 'class Sq:\n    def __init__(self, s):\n        self.s = s\n    def area(self):\n        return self.s * self.s\ntotal_area([Sq(2), Sq(3)])'],
          ['Two unrelated classes together', 'class Sq:\n    def area(self):\n        return 4\nclass Tri:\n    def area(self):\n        return 1.5\ntotal_area([Sq(), Tri()])'],
          ['An empty list', 'total_area([])'],
          ['A single shape', 'class Sq:\n    def area(self):\n        return 9\ntotal_area([Sq()])'],
        ],
        traps: [
          py`from typing import Protocol

class HasArea(Protocol):
    def area(self) -> float:
        ...


def total_area(shapes):
    return round(sum(shape.area() for shape in shapes) + 1, 2)`,
          py`from typing import Protocol

class HasArea(Protocol):
    def area(self) -> float:
        ...


def total_area(shapes):
    return round(len(shapes), 2)`,
        ],
      },
      real: [
        oop({
          title: 'A protocol for anything you can total()',
          use: ['invoices'],
          starter: 'from typing import Protocol\n\nclass HasTotal(Protocol):\n    def total(self) -> float:\n        ...\n\n\ndef top_totals(things, n):\n    ...\n\n\nclass InvoiceWrapper:\n    def __init__(self, row):\n        self.row = row\n\n    def total(self):\n        return self.row["Total"]\n\nwrapped = [InvoiceWrapper(inv) for inv in invoices]\nanswer = top_totals(wrapped, 3)\n',
          given: '# invoices is a list of dictionaries. InvoiceWrapper is finished.',
          brief: 'Write `top_totals(things, n)`: the `n` **largest** `.total()` values (as plain numbers, not objects), largest first, using `HasTotal` only as documentation (no runtime check needed).',
          reference: py`from typing import Protocol

class HasTotal(Protocol):
    def total(self) -> float:
        ...


def top_totals(things, n):
    return sorted((thing.total() for thing in things), reverse=True)[:n]


class InvoiceWrapper:
    def __init__(self, row):
        self.row = row

    def total(self):
        return self.row["Total"]

wrapped = [InvoiceWrapper(inv) for inv in invoices]
answer = top_totals(wrapped, 3)`,
          walkthrough: 'The `Protocol` documents what `top_totals` needs, purely by shape; the function itself just calls `.total()`, so it works for any class with that method.',
          traps: [py`from typing import Protocol

class HasTotal(Protocol):
    def total(self) -> float:
        ...


def top_totals(things, n):
    return sorted((thing.total() for thing in things))[:n]


class InvoiceWrapper:
    def __init__(self, row):
        self.row = row

    def total(self):
        return self.row["Total"]

wrapped = [InvoiceWrapper(inv) for inv in invoices]
answer = top_totals(wrapped, 3)`],
        }),
        oop({
          title: 'A runtime-checkable protocol',
          use: ['tracks'],
          starter: 'from typing import Protocol, runtime_checkable\n\n@runtime_checkable\nclass HasName(Protocol):\n    name: str\n\n\nclass NamedTrack:\n    def __init__(self, name):\n        ...\n\nnt = NamedTrack(tracks[0]["Name"])\nanswer = (isinstance(nt, HasName), isinstance(42, HasName), isinstance(object(), HasName))\n',
          given: '# tracks is a list of dictionaries. HasName is already declared; only NamedTrack.__init__ needs writing.',
          brief: 'Write `NamedTrack.__init__`, storing `name`. Then store the three `isinstance` results in `answer`, to see which objects satisfy the protocol just by having a matching attribute.',
          reference: py`from typing import Protocol, runtime_checkable

@runtime_checkable
class HasName(Protocol):
    name: str


class NamedTrack:
    def __init__(self, name):
        self.name = name

nt = NamedTrack(tracks[0]["Name"])
answer = (isinstance(nt, HasName), isinstance(42, HasName), isinstance(object(), HasName))`,
          walkthrough: '`NamedTrack` was never declared to implement `HasName`, but it has a `.name` attribute, which is all a runtime-checkable protocol looks for.',
          traps: [py`from typing import Protocol, runtime_checkable

class HasName(Protocol):
    name: str


class NamedTrack:
    def __init__(self, name):
        self.name = name

nt = NamedTrack(tracks[0]["Name"])
answer = (isinstance(nt, HasName), isinstance(42, HasName), isinstance(object(), HasName))`],
        }),
        oop({
          title: 'SupportsLen on data you did not design',
          use: ['artists'],
          starter: 'from typing import Protocol\n\nclass SupportsLen(Protocol):\n    def __len__(self) -> int:\n        ...\n\n\ndef describe_size(x):\n    ...\n\nnames = [a["Name"] for a in artists[:5]]\nanswer = (describe_size(names), describe_size(names[0]), describe_size({a["ArtistId"]: a["Name"] for a in artists[:3]}))\n',
          given: '# artists is a list of dictionaries. names is a plain list of strings.',
          brief: 'Write `describe_size(x)` returning `f"has {len(x)} items"`. It must work for a list, a string and a dictionary, none of which were written with `SupportsLen` in mind.',
          reference: py`from typing import Protocol

class SupportsLen(Protocol):
    def __len__(self) -> int:
        ...


def describe_size(x):
    return f"has {len(x)} items"

names = [a["Name"] for a in artists[:5]]
answer = (describe_size(names), describe_size(names[0]), describe_size({a["ArtistId"]: a["Name"] for a in artists[:3]}))`,
          walkthrough: 'The `Protocol` documents precisely what `describe_size` relies on (a working `__len__`), even though `list`, `str` and `dict` were never written with this function in mind.',
          traps: [py`from typing import Protocol

class SupportsLen(Protocol):
    def __len__(self) -> int:
        ...


def describe_size(x):
    return f"has {len(x) + 1} items"

names = [a["Name"] for a in artists[:5]]
answer = (describe_size(names), describe_size(names[0]), describe_size({a["ArtistId"]: a["Name"] for a in artists[:3]}))`],
        }),
      ],
    },
    {
      id: 'py-composition-delegation',
      title: 'Composition over inheritance and delegation',
      blurb: 'has-a versus is-a, delegating to a held object, and strategy by composition.',
      kind: 'code',
      practice: {
        prompt: 'Refactor a subclass-per-format design into composition. Write `CsvFormatter.format(rows)` and `JsonFormatter.format(rows)` (each takes a list of lists of strings). Write `Report(rows, formatter)` with a `render()` method that delegates to `self.formatter.format(self.rows)`. Changing `report.formatter` must change what `render()` produces.',
        starter: 'class CsvFormatter:\n    def format(self, rows):\n        ...\n\n\nclass JsonFormatter:\n    def format(self, rows):\n        ...\n\n\nclass Report:\n    def __init__(self, rows, formatter):\n        ...\n\n    def render(self):\n        ...\n',
        solution: py`class CsvFormatter:
    def format(self, rows):
        return "\n".join(",".join(row) for row in rows)


class JsonFormatter:
    def format(self, rows):
        import json
        return json.dumps(rows)


class Report:
    def __init__(self, rows, formatter):
        self.rows = rows
        self.formatter = formatter

    def render(self):
        return self.formatter.format(self.rows)`,
        samples: ['Report([["a", "1"]], CsvFormatter()).render()'],
        cases: [
          ['CSV rendering', 'Report([["a", "1"], ["b", "2"]], CsvFormatter()).render()'],
          ['JSON rendering', 'import json\njson.loads(Report([["a", "1"]], JsonFormatter()).render())'],
          ['Swapping the formatter at runtime', 'r = Report([["a", "1"]], CsvFormatter())\nfirst = r.render()\nr.formatter = JsonFormatter()\nsecond = r.render()\n(first, second != first)'],
          ['An empty report', 'Report([], CsvFormatter()).render()'],
          ['Two reports do not share a formatter instance', 'a = Report([["x"]], CsvFormatter())\nb = Report([["y"]], JsonFormatter())\n(a.render(), "y" in b.render())'],
        ],
        traps: [
          py`class CsvFormatter:
    def format(self, rows):
        return "\n".join(",".join(row) for row in rows)


class JsonFormatter:
    def format(self, rows):
        import json
        return json.dumps(rows)


class Report:
    def __init__(self, rows, formatter):
        self.rows = rows
        self._formatter = formatter

    def render(self):
        return self._formatter.format(self.rows)

    @property
    def formatter(self):
        return CsvFormatter()

    @formatter.setter
    def formatter(self, value):
        pass`,
          py`class CsvFormatter:
    def format(self, rows):
        return "\n".join(",".join(row) for row in rows)


class JsonFormatter:
    def format(self, rows):
        import json
        return json.dumps(rows)


class Report:
    def __init__(self, rows, formatter):
        self.rows = rows
        self.formatter = CsvFormatter()

    def render(self):
        return self.formatter.format(self.rows)`,
        ],
      },
      real: [
        oop({
          title: 'A wallet held inside a customer',
          use: ['customers'],
          starter: 'class Wallet:\n    def __init__(self):\n        self._items = []\n\n    def add(self, item):\n        self._items.append(item)\n\n    def __len__(self):\n        return len(self._items)\n\n\nclass CustomerAccount:\n    def __init__(self, name):\n        ...\n\n    def add_purchase(self, item):\n        ...\n\n    def purchase_count(self):\n        ...\n\nacc = CustomerAccount(customers[0]["FirstName"])\nacc.add_purchase("track A")\nacc.add_purchase("track B")\nanswer = acc.purchase_count()\n',
          given: '# customers is a list of dictionaries. Wallet is already finished; write CustomerAccount to hold one.',
          brief: 'Write `CustomerAccount(name)`, holding a `Wallet` (composition), with `add_purchase(item)` and `purchase_count()` **delegating** to it.',
          reference: py`class Wallet:
    def __init__(self):
        self._items = []

    def add(self, item):
        self._items.append(item)

    def __len__(self):
        return len(self._items)


class CustomerAccount:
    def __init__(self, name):
        self.name = name
        self.wallet = Wallet()

    def add_purchase(self, item):
        self.wallet.add(item)

    def purchase_count(self):
        return len(self.wallet)

acc = CustomerAccount(customers[0]["FirstName"])
acc.add_purchase("track A")
acc.add_purchase("track B")
answer = acc.purchase_count()`,
          walkthrough: '`CustomerAccount` **has a** `Wallet`; its methods simply forward to it, so callers of `CustomerAccount` never need to know a `Wallet` is involved at all.',
          traps: [py`class Wallet:
    def __init__(self):
        self._items = []

    def add(self, item):
        self._items.append(item)

    def __len__(self):
        return len(self._items)


class CustomerAccount:
    def __init__(self, name):
        self.name = name
        self.wallet = Wallet()
        self.count = 0

    def add_purchase(self, item):
        self.wallet.add(item)

    def purchase_count(self):
        return self.count

acc = CustomerAccount(customers[0]["FirstName"])
acc.add_purchase("track A")
acc.add_purchase("track B")
answer = acc.purchase_count()`],
        }),
        oop({
          title: 'Automatic delegation with __getattr__',
          use: ['tracks'],
          starter: 'class LoggingList:\n    def __init__(self):\n        self._data = []\n        self.calls = []\n\n    def __getattr__(self, name):\n        ...\n\n    def __len__(self):\n        return len(self._data)\n\nll = LoggingList()\nll.append(tracks[0]["Name"])\nll.append(tracks[1]["Name"])\nanswer = (len(ll), ll.calls, list(ll._data))\n',
          given: '# tracks is a list of dictionaries.',
          brief: 'Write `LoggingList.__getattr__(self, name)`: append `name` to `self.calls`, then return `getattr(self._data, name)`, so unknown methods like `append` are automatically forwarded to the wrapped list.',
          reference: py`class LoggingList:
    def __init__(self):
        self._data = []
        self.calls = []

    def __getattr__(self, name):
        self.calls.append(name)
        return getattr(self._data, name)

    def __len__(self):
        return len(self._data)

ll = LoggingList()
ll.append(tracks[0]["Name"])
ll.append(tracks[1]["Name"])
answer = (len(ll), ll.calls, list(ll._data))`,
          walkthrough: '`__getattr__` only runs when normal lookup fails, so it never interferes with `__len__` (defined directly), but catches `append`, which `LoggingList` never defines itself, and forwards it to `self._data`.',
          traps: [py`class LoggingList:
    def __init__(self):
        self._data = []
        self.calls = []

    def __getattr__(self, name):
        return getattr(self._data, name)

    def __len__(self):
        return len(self._data)

ll = LoggingList()
ll.append(tracks[0]["Name"])
ll.append(tracks[1]["Name"])
answer = (len(ll), ll.calls, list(ll._data))`],
        }),
        oop({
          title: 'Swapping a pricing strategy at runtime',
          use: ['tracks'],
          starter: 'class StandardPricing:\n    def price(self, unit_price):\n        ...\n\n\nclass SalePricing:\n    def price(self, unit_price):\n        ...\n\n\nclass Cart:\n    def __init__(self, pricing):\n        ...\n\n    def add(self, unit_price):\n        ...\n\n    def total(self):\n        ...\n\ncart = Cart(StandardPricing())\nfor t in tracks[:5]:\n    cart.add(t["UnitPrice"])\nbefore = round(cart.total(), 2)\ncart.pricing = SalePricing()\nafter = round(cart.total(), 2)\nanswer = (before, after)\n',
          given: '# tracks is a list of dictionaries with "UnitPrice".',
          brief: 'Write `StandardPricing.price(unit_price)` returning it unchanged, and `SalePricing.price(unit_price)` returning 80% of it. Write `Cart(pricing)` holding a list of unit prices and the pricing strategy; `total()` sums `self.pricing.price(p)` over the stored prices, so **changing `cart.pricing` changes future totals**.',
          reference: py`class StandardPricing:
    def price(self, unit_price):
        return unit_price


class SalePricing:
    def price(self, unit_price):
        return unit_price * 0.8


class Cart:
    def __init__(self, pricing):
        self.pricing = pricing
        self.prices = []

    def add(self, unit_price):
        self.prices.append(unit_price)

    def total(self):
        return sum(self.pricing.price(p) for p in self.prices)

cart = Cart(StandardPricing())
for t in tracks[:5]:
    cart.add(t["UnitPrice"])
before = round(cart.total(), 2)
cart.pricing = SalePricing()
after = round(cart.total(), 2)
answer = (before, after)`,
          walkthrough: '`total()` looks up `self.pricing` **every time it runs**, so assigning a new strategy to `cart.pricing` changes the result of the very next call, with no need for a new `Cart` or a new subclass.',
          traps: [py`class StandardPricing:
    def price(self, unit_price):
        return unit_price


class SalePricing:
    def price(self, unit_price):
        return unit_price * 0.8


class Cart:
    def __init__(self, pricing):
        self.pricing = pricing
        self.prices = []
        self._total = 0

    def add(self, unit_price):
        self.prices.append(unit_price)
        self._total += self.pricing.price(unit_price)

    def total(self):
        return self._total

cart = Cart(StandardPricing())
for t in tracks[:5]:
    cart.add(t["UnitPrice"])
before = round(cart.total(), 2)
cart.pricing = SalePricing()
after = round(cart.total(), 2)
answer = (before, after)`],
        }),
      ],
    },
]
