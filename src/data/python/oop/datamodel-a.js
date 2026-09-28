import { py, oop } from './common.js'

export const dataModelLessonsA = [
    {
      id: 'py-eq-hash-order',
      title: 'Equality, hashing and ordering',
      blurb: '__eq__, the hash contract, __lt__ and total_ordering.',
      kind: 'code',
      practice: {
        prompt: 'Write `Version(text)`, parsing text like `"1.10"` into `major` and `minor` integers. Implement `__eq__` and `__lt__` comparing `(major, minor)`, and a matching `__hash__`. Use `@functools.total_ordering` so all four comparisons work.',
        starter: 'from functools import total_ordering\n\n@total_ordering\nclass Version:\n    def __init__(self, text):\n        ...\n\n    def __eq__(self, other):\n        ...\n\n    def __lt__(self, other):\n        ...\n\n    def __hash__(self):\n        ...\n',
        solution: py`from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, text):
        self.major, self.minor = map(int, text.split("."))

    def __eq__(self, other):
        return (self.major, self.minor) == (other.major, other.minor)

    def __lt__(self, other):
        return (self.major, self.minor) < (other.major, other.minor)

    def __hash__(self):
        return hash((self.major, self.minor))`,
        samples: ['Version("1.2") == Version("1.2")', 'Version("1.2") < Version("1.10")'],
        cases: [
          ['Equal versions', 'Version("1.2") == Version("1.2")'],
          ['Different minor versions', 'Version("1.2") == Version("1.3")'],
          ['Numeric comparison, not text', 'Version("1.2") < Version("1.10")'],
          ['Greater than', 'Version("2.0") > Version("1.9")'],
          ['Less than or equal, equal case', 'Version("1.5") <= Version("1.5")'],
          ['Greater than or equal', 'Version("1.5") >= Version("1.6")'],
          ['Sorting a list', '[f"{v.major}.{v.minor}" for v in sorted([Version("2.1"), Version("1.9"), Version("2.0")])]'],
          ['Equal versions hash the same', 'hash(Version("3.4")) == hash(Version("3.4"))'],
          ['Usable in a set', 'len({Version("1.0"), Version("1.0"), Version("2.0")})'],
        ],
        traps: [
          py`from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, text):
        self.major, self.minor = map(int, text.split("."))

    def __eq__(self, other):
        return self.major == other.major

    def __lt__(self, other):
        return (self.major, self.minor) < (other.major, other.minor)

    def __hash__(self):
        return hash((self.major, self.minor))`,
          py`from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, text):
        self.major, self.minor = text.split(".")

    def __eq__(self, other):
        return (self.major, self.minor) == (other.major, other.minor)

    def __lt__(self, other):
        return (self.major, self.minor) < (other.major, other.minor)

    def __hash__(self):
        return hash((self.major, self.minor))`,
          py`from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, text):
        self.major, self.minor = map(int, text.split("."))

    def __eq__(self, other):
        return (self.major, self.minor) == (other.major, other.minor)

    def __lt__(self, other):
        return (self.minor, self.major) < (other.minor, other.major)

    def __hash__(self):
        return hash((self.major, self.minor))`,
        ],
      },
      real: [
        oop({
          title: 'Sortable songs',
          use: ['songs'],
          starter: 'from functools import total_ordering\n\n@total_ordering\nclass SongRank:\n    def __init__(self, row):\n        ...\n\n    def __eq__(self, other):\n        ...\n\n    def __lt__(self, other):\n        ...\n\nranked = sorted((SongRank(s) for s in songs[:20]), reverse=True)\nanswer = [r.streams for r in ranked[:3]]\n',
          given: '# songs is a list of dictionaries with "track" and "spotify_streams".',
          brief: 'Write `SongRank(row)` storing `streams` (from `"spotify_streams"`). Implement `__eq__` and `__lt__` comparing by `streams` only, so the twenty songs sort by streams, **highest first** when reversed.',
          reference: py`from functools import total_ordering

@total_ordering
class SongRank:
    def __init__(self, row):
        self.streams = row["spotify_streams"]

    def __eq__(self, other):
        return self.streams == other.streams

    def __lt__(self, other):
        return self.streams < other.streams

ranked = sorted((SongRank(s) for s in songs[:20]), reverse=True)
answer = [r.streams for r in ranked[:3]]`,
          walkthrough: '`sorted(..., reverse=True)` only needs `__lt__` (and a working `__eq__` for ties), which is exactly what `SongRank` provides.',
          traps: [py`from functools import total_ordering

@total_ordering
class SongRank:
    def __init__(self, row):
        self.streams = row["spotify_streams"]

    def __eq__(self, other):
        return self.streams == other.streams

    def __lt__(self, other):
        return self.streams > other.streams

ranked = sorted((SongRank(s) for s in songs[:20]), reverse=True)
answer = [r.streams for r in ranked[:3]]`],
        }),
        oop({
          title: 'Deduplicating customers by a key',
          use: ['customers'],
          starter: 'class CustomerKey:\n    def __init__(self, row):\n        ...\n\n    def __eq__(self, other):\n        ...\n\n    def __hash__(self):\n        ...\n\ndoubled = customers[:10] + customers[:3]\nkeys = {CustomerKey(c) for c in doubled}\nanswer = len(keys)\n',
          given: '# customers is a list of dictionaries with "CustomerId". doubled repeats the first three rows.',
          brief: 'Write `CustomerKey(row)` storing `customer_id` (from `"CustomerId"`). Implement `__eq__` and `__hash__` so that a **set** of keys correctly collapses duplicates by id.',
          reference: py`class CustomerKey:
    def __init__(self, row):
        self.customer_id = row["CustomerId"]

    def __eq__(self, other):
        return self.customer_id == other.customer_id

    def __hash__(self):
        return hash(self.customer_id)

doubled = customers[:10] + customers[:3]
keys = {CustomerKey(c) for c in doubled}
answer = len(keys)`,
          walkthrough: 'A set relies on both `__hash__` and `__eq__` agreeing about what "the same" means; here that is having the same `customer_id`, so the three repeated rows collapse to one entry each.',
          traps: [py`class CustomerKey:
    def __init__(self, row):
        self.customer_id = row["CustomerId"]

    def __eq__(self, other):
        return self.customer_id == other.customer_id

doubled = customers[:10] + customers[:3]
keys = {CustomerKey(c) for c in doubled}
answer = len(keys)`],
        }),
        oop({
          title: 'Ordering tracks with total_ordering',
          use: ['tracks'],
          starter: 'from functools import total_ordering\n\n@total_ordering\nclass ByPrice:\n    def __init__(self, row):\n        self.row = row\n\n    def __eq__(self, other):\n        return self.row["UnitPrice"] == other.row["UnitPrice"]\n\n    def __lt__(self, other):\n        ...\n\ncheapest = min(ByPrice(t) for t in tracks[:30])\nmost_expensive = max(ByPrice(t) for t in tracks[:30])\nanswer = (round(cheapest.row["UnitPrice"], 2), round(most_expensive.row["UnitPrice"], 2))\n',
          given: '# tracks is a list of dictionaries with "UnitPrice". __eq__ is already written.',
          brief: 'Write `ByPrice.__lt__`, comparing `row["UnitPrice"]`. With it, `min()` and `max()` (which only need `<`) work directly on `ByPrice`-wrapped tracks.',
          reference: py`from functools import total_ordering

@total_ordering
class ByPrice:
    def __init__(self, row):
        self.row = row

    def __eq__(self, other):
        return self.row["UnitPrice"] == other.row["UnitPrice"]

    def __lt__(self, other):
        return self.row["UnitPrice"] < other.row["UnitPrice"]

sample = sorted({t["UnitPrice"]: t for t in tracks}.values(), key=lambda t: t["UnitPrice"])
cheapest = min(ByPrice(t) for t in sample)
most_expensive = max(ByPrice(t) for t in sample)
answer = (round(cheapest.row["UnitPrice"], 2), round(most_expensive.row["UnitPrice"], 2))`,
          walkthrough: '`min` and `max` are built entirely on `<`, so a correct `__lt__` is all that is needed for both to work.',
          traps: [py`from functools import total_ordering

@total_ordering
class ByPrice:
    def __init__(self, row):
        self.row = row

    def __eq__(self, other):
        return self.row["UnitPrice"] == other.row["UnitPrice"]

    def __lt__(self, other):
        return self.row["UnitPrice"] > other.row["UnitPrice"]

sample = sorted({t["UnitPrice"]: t for t in tracks}.values(), key=lambda t: t["UnitPrice"])
cheapest = min(ByPrice(t) for t in sample)
most_expensive = max(ByPrice(t) for t in sample)
answer = (round(cheapest.row["UnitPrice"], 2), round(most_expensive.row["UnitPrice"], 2))`],
        }),
      ],
    },
    {
      id: 'py-operator-overloading',
      title: 'Arithmetic and operator overloading',
      blurb: '__add__, reflected methods, NotImplemented and __bool__.',
      kind: 'code',
      practice: {
        prompt: 'Implement `Vector2D(x, y)` with `+` (`__add__`), `-` (`__sub__`), scalar `*` on **either side** (`__mul__` and `__rmul__`), `abs()` (Euclidean length), and `==`.',
        starter: 'import math\n\nclass Vector2D:\n    def __init__(self, x, y):\n        ...\n\n    def __eq__(self, other):\n        ...\n\n    def __add__(self, other):\n        ...\n\n    def __sub__(self, other):\n        ...\n\n    def __mul__(self, scalar):\n        ...\n\n    def __rmul__(self, scalar):\n        ...\n\n    def __abs__(self):\n        ...\n',
        solution: py`import math

class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)

    def __add__(self, other):
        return Vector2D(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector2D(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        return Vector2D(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar):
        return self.__mul__(scalar)

    def __abs__(self):
        return math.hypot(self.x, self.y)`,
        samples: ['Vector2D(1, 2) + Vector2D(3, 4) == Vector2D(4, 6)', 'abs(Vector2D(3, 4))'],
        cases: [
          ['Addition', '(Vector2D(1, 2) + Vector2D(3, 4)).x, (Vector2D(1, 2) + Vector2D(3, 4)).y'],
          ['Subtraction', '(Vector2D(5, 5) - Vector2D(2, 1)).x, (Vector2D(5, 5) - Vector2D(2, 1)).y'],
          ['Scalar multiplication on the right', '(Vector2D(2, 3) * 5).x, (Vector2D(2, 3) * 5).y'],
          ['Scalar multiplication on the left', '(5 * Vector2D(2, 3)).x, (5 * Vector2D(2, 3)).y'],
          ['Length', 'abs(Vector2D(3, 4))'],
          ['Equality', 'Vector2D(1, 2) == Vector2D(1, 2)'],
          ['Inequality', 'Vector2D(1, 2) == Vector2D(1, 3)'],
          ['A zero vector has zero length', 'abs(Vector2D(0, 0))'],
        ],
        traps: [
          py`import math

class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)

    def __add__(self, other):
        return Vector2D(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector2D(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        return Vector2D(self.x * scalar, self.y * scalar)

    def __abs__(self):
        return math.hypot(self.x, self.y)`,
          py`import math

class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)

    def __add__(self, other):
        return Vector2D(self.x - other.x, self.y - other.y)

    def __sub__(self, other):
        return Vector2D(self.x + other.x, self.y + other.y)

    def __mul__(self, scalar):
        return Vector2D(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar):
        return self.__mul__(scalar)

    def __abs__(self):
        return math.hypot(self.x, self.y)`,
          py`import math

class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)

    def __add__(self, other):
        return Vector2D(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector2D(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        return Vector2D(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar):
        return self.__mul__(scalar)

    def __abs__(self):
        return self.x + self.y`,
        ],
      },
      real: [
        oop({
          title: 'Combining two invoice totals',
          use: ['invoices'],
          starter: 'class Money:\n    def __init__(self, cents):\n        ...\n\n    def __add__(self, other):\n        ...\n\n    def __eq__(self, other):\n        ...\n\n    def __repr__(self):\n        return f"Money({self.cents})"\n\nfirst = Money(0)\nsecond = first + Money(round(invoices[0]["Total"] * 100))\nthird = second + Money(round(invoices[1]["Total"] * 100))\nanswer = (first.cents, second.cents, third.cents)\n',
          given: '# invoices is a list of dictionaries with "Total". Money.__repr__ is already written for you.',
          brief: 'Write `Money(cents)`, `__add__` (returns a **new** `Money` with the summed cents, leaving both originals unchanged), and `__eq__` (compares `cents`). `answer` checks that earlier partial sums were never mutated.',
          reference: py`class Money:
    def __init__(self, cents):
        self.cents = cents

    def __add__(self, other):
        return Money(self.cents + other.cents)

    def __eq__(self, other):
        return self.cents == other.cents

    def __repr__(self):
        return f"Money({self.cents})"

first = Money(0)
second = first + Money(round(invoices[0]["Total"] * 100))
third = second + Money(round(invoices[1]["Total"] * 100))
answer = (first.cents, second.cents, third.cents)`,
          walkthrough: '`first + Money(...)` calls `Money.__add__`, returning a brand-new `Money` and leaving `first` itself unchanged — which is why `first.cents` stays `0` even after `second` and `third` are built from it.',
          traps: [py`class Money:
    def __init__(self, cents):
        self.cents = cents

    def __add__(self, other):
        self.cents += other.cents
        return self

    def __eq__(self, other):
        return self.cents == other.cents

    def __repr__(self):
        return f"Money({self.cents})"

first = Money(0)
second = first + Money(round(invoices[0]["Total"] * 100))
third = second + Money(round(invoices[1]["Total"] * 100))
answer = (first.cents, second.cents, third.cents)`],
        }),
        oop({
          title: 'Scaling every track price',
          use: ['tracks'],
          starter: 'class Price:\n    def __init__(self, amount):\n        ...\n\n    def __mul__(self, factor):\n        ...\n\n    def __rmul__(self, factor):\n        ...\n\nprices = [Price(t["UnitPrice"]) for t in tracks[:5]]\ndoubled = [2 * p for p in prices]\nanswer = [round(p.amount, 2) for p in doubled]\n',
          given: '# tracks is a list of dictionaries with "UnitPrice".',
          brief: 'Write `Price(amount)`, `__mul__` and `__rmul__`, so that both `price * 2` and `2 * price` scale the amount and return a new `Price`.',
          reference: py`class Price:
    def __init__(self, amount):
        self.amount = amount

    def __mul__(self, factor):
        return Price(self.amount * factor)

    def __rmul__(self, factor):
        return self.__mul__(factor)

prices = [Price(t["UnitPrice"]) for t in tracks[:5]]
doubled = [2 * p for p in prices]
answer = [round(p.amount, 2) for p in doubled]`,
          walkthrough: '`2 * p` cannot use `int.__mul__` (an int knows nothing about `Price`), so Python falls back to `p.__rmul__(2)`, which is why the reflected method is required for the left-hand case.',
          traps: [py`class Price:
    def __init__(self, amount):
        self.amount = amount

    def __mul__(self, factor):
        return Price(self.amount * factor)

prices = [Price(t["UnitPrice"]) for t in tracks[:5]]
doubled = [2 * p for p in prices]
answer = [round(p.amount, 2) for p in doubled]`],
        }),
        oop({
          title: 'A playlist that is falsy when empty',
          use: ['tracks'],
          starter: 'class Playlist:\n    def __init__(self, names):\n        ...\n\n    def __len__(self):\n        ...\n\nfull = Playlist([t["Name"] for t in tracks[:3]])\nempty = Playlist([])\nanswer = (bool(full), bool(empty))\n',
          given: '# tracks is a list of dictionaries.',
          brief: 'Write `Playlist(names)` and `__len__`. Do **not** write `__bool__`: `bool()` should fall back to `__len__` on its own, being falsy for an empty playlist.',
          reference: py`class Playlist:
    def __init__(self, names):
        self.names = names

    def __len__(self):
        return len(self.names)

full = Playlist([t["Name"] for t in tracks[:3]])
empty = Playlist([])
answer = (bool(full), bool(empty))`,
          walkthrough: 'With no `__bool__`, Python uses `__len__`: zero means falsy, anything else means truthy — one method serving two purposes.',
          traps: [py`class Playlist:
    def __init__(self, names):
        self.names = names

    def size(self):
        return len(self.names)

full = Playlist([t["Name"] for t in tracks[:3]])
empty = Playlist([])
answer = (bool(full), bool(empty))`],
        }),
      ],
    },
    {
      id: 'py-container-protocol',
      title: 'Container protocol: __len__, __getitem__, __iter__, __contains__',
      blurb: 'Sequence and mapping protocols, slicing, and collections.abc.',
      kind: 'code',
      practice: {
        prompt: 'Write `Playlist(tracks)` supporting `len()`, indexing and slicing (`__getitem__`, delegating to the underlying list), iteration (`__iter__`), and a **case-insensitive** `in` (`__contains__`).',
        starter: 'class Playlist:\n    def __init__(self, tracks):\n        ...\n\n    def __len__(self):\n        ...\n\n    def __getitem__(self, index):\n        ...\n\n    def __iter__(self):\n        ...\n\n    def __contains__(self, name):\n        ...\n',
        solution: py`class Playlist:
    def __init__(self, tracks):
        self.tracks = list(tracks)

    def __len__(self):
        return len(self.tracks)

    def __getitem__(self, index):
        return self.tracks[index]

    def __iter__(self):
        return iter(self.tracks)

    def __contains__(self, name):
        return any(name.lower() == t.lower() for t in self.tracks)`,
        samples: ['len(Playlist(["a", "b", "c"]))', '"B" in Playlist(["a", "b", "c"])'],
        cases: [
          ['Length', 'len(Playlist(["a", "b", "c"]))'],
          ['Indexing', 'Playlist(["a", "b", "c"])[1]'],
          ['Negative indexing', 'Playlist(["a", "b", "c"])[-1]'],
          ['Slicing', 'Playlist(["a", "b", "c", "d"])[1:3]'],
          ['Iteration', 'list(Playlist(["a", "b", "c"]))'],
          ['Case-insensitive contains, present', '"B" in Playlist(["a", "b", "c"])'],
          ['Case-insensitive contains, absent', '"z" in Playlist(["a", "b", "c"])'],
          ['An empty playlist', 'len(Playlist([]))'],
        ],
        traps: [
          py`class Playlist:
    def __init__(self, tracks):
        self.tracks = list(tracks)

    def __len__(self):
        return len(self.tracks)

    def __getitem__(self, index):
        return self.tracks[index]

    def __iter__(self):
        return iter(self.tracks)

    def __contains__(self, name):
        return name in self.tracks`,
          py`class Playlist:
    def __init__(self, tracks):
        self.tracks = list(tracks)

    def __len__(self):
        return len(self.tracks)

    def __getitem__(self, index):
        return self.tracks[index + 1]

    def __iter__(self):
        return iter(self.tracks)

    def __contains__(self, name):
        return any(name.lower() == t.lower() for t in self.tracks)`,
        ],
      },
      real: [
        oop({
          title: 'A Sequence-based playlist, almost for free',
          use: ['tracks'],
          starter: 'from collections.abc import Sequence\n\nclass Playlist(Sequence):\n    def __init__(self, names):\n        ...\n\n    def __len__(self):\n        ...\n\n    def __getitem__(self, index):\n        ...\n\npl = Playlist([t["Name"] for t in tracks[:10]])\nanswer = (len(pl), pl[0], pl[-1], list(reversed(pl))[:2])\n',
          given: '# tracks is a list of dictionaries. Sequence is already imported.',
          brief: 'Write `Playlist(names)`, `__len__` and `__getitem__` only, delegating to the stored list. By inheriting `Sequence`, `reversed()` (and, in the lesson, `.count()` and `.index()` too) come for free.',
          reference: py`from collections.abc import Sequence

class Playlist(Sequence):
    def __init__(self, names):
        self.names = names

    def __len__(self):
        return len(self.names)

    def __getitem__(self, index):
        return self.names[index]

pl = Playlist([t["Name"] for t in tracks[:10]])
answer = (len(pl), pl[0], pl[-1], list(reversed(pl))[:2])`,
          walkthrough: '`Sequence` implements `count`, `index`, `__contains__` and `__reversed__` in terms of the two methods you actually wrote, which is the same cooperative-inheritance benefit as a mixin. `reversed()` in particular only needs a correct `__len__` and `__getitem__` to walk the indices backwards.',
          traps: [py`from collections.abc import Sequence

class Playlist(Sequence):
    def __init__(self, names):
        self.names = names

    def __len__(self):
        return len(self.names)

    def __getitem__(self, index):
        return self.names[0]

pl = Playlist([t["Name"] for t in tracks[:10]])
answer = (len(pl), pl[0], pl[-1], list(reversed(pl))[:2])`],
        }),
        oop({
          title: 'A read-only view over invoices',
          use: ['invoices'],
          starter: 'class InvoiceView:\n    def __init__(self, rows):\n        ...\n\n    def __len__(self):\n        ...\n\n    def __getitem__(self, index):\n        ...\n\nview = InvoiceView(invoices[:8])\nanswer = (len(view), view[2]["InvoiceId"], [row["InvoiceId"] for row in view[:3]])\n',
          given: '# invoices is a list of dictionaries with "InvoiceId".',
          brief: 'Write `InvoiceView(rows)`, `__len__` and `__getitem__` (delegating to the stored rows, including slices).',
          reference: py`class InvoiceView:
    def __init__(self, rows):
        self.rows = list(rows)

    def __len__(self):
        return len(self.rows)

    def __getitem__(self, index):
        return self.rows[index]

view = InvoiceView(invoices[:8])
answer = (len(view), view[2]["InvoiceId"], [row["InvoiceId"] for row in view[:3]])`,
          walkthrough: 'Delegating `index` straight to the underlying list means slice objects are handled automatically, with no extra code.',
          traps: [py`class InvoiceView:
    def __init__(self, rows):
        self.rows = list(rows)

    def __len__(self):
        return len(self.rows)

    def __getitem__(self, index):
        if isinstance(index, slice):
            return []
        return self.rows[index]

view = InvoiceView(invoices[:8])
answer = (len(view), view[2]["InvoiceId"], [row["InvoiceId"] for row in view[:3]])`],
        }),
        oop({
          title: 'A sparse list of tracks',
          use: ['tracks'],
          starter: 'class SparseList:\n    def __init__(self, default=None):\n        ...\n\n    def __setitem__(self, index, value):\n        ...\n\n    def __getitem__(self, index):\n        ...\n\nsl = SparseList(default="(empty)")\nsl[0] = tracks[0]["Name"]\nsl[5] = tracks[1]["Name"]\nanswer = (sl[0], sl[2], sl[5])\n',
          given: '# tracks is a list of dictionaries.',
          brief: 'Write `SparseList(default)` backed by a dictionary. `__setitem__(index, value)` stores a value at an index. `__getitem__(index)` returns the stored value, or `default` when nothing was ever set there.',
          reference: py`class SparseList:
    def __init__(self, default=None):
        self.default = default
        self.values = {}

    def __setitem__(self, index, value):
        self.values[index] = value

    def __getitem__(self, index):
        return self.values.get(index, self.default)

sl = SparseList(default="(empty)")
sl[0] = tracks[0]["Name"]
sl[5] = tracks[1]["Name"]
answer = (sl[0], sl[2], sl[5])`,
          walkthrough: 'A dictionary is a natural backing store for a "sparse" sequence: most positions are never set, and `.get(index, default)` handles the gaps in one call.',
          traps: [py`class SparseList:
    def __init__(self, default=None):
        self.default = default
        self.values = {}

    def __setitem__(self, index, value):
        self.values[index] = value

    def __getitem__(self, index):
        if index in self.values:
            return self.values[index]
        return None

sl = SparseList(default="(empty)")
sl[0] = tracks[0]["Name"]
sl[5] = tracks[1]["Name"]
answer = (sl[0], sl[2], sl[5])`],
        }),
      ],
    },
    {
      id: 'py-callable-getattr',
      title: 'Callable objects and dynamic attribute access',
      blurb: '__call__, __getattr__ versus __getattribute__, and proxies.',
      kind: 'code',
      practice: {
        prompt: 'Write `CallCounter()`. Calling an instance (`counter()`, `counter(1, 2)`, with any arguments) increases its `calls` attribute by 1 and returns the number of calls so far.',
        starter: 'class CallCounter:\n    def __init__(self):\n        ...\n\n    def __call__(self, *args, **kwargs):\n        ...\n',
        solution: py`class CallCounter:
    def __init__(self):
        self.calls = 0

    def __call__(self, *args, **kwargs):
        self.calls += 1
        return self.calls`,
        samples: ['c = CallCounter()\n(c(), c(), c.calls)'],
        cases: [
          ['Calls return an increasing count', 'c = CallCounter()\n(c(), c(), c())'],
          ['calls attribute matches', 'c = CallCounter()\nc()\nc()\nc.calls'],
          ['Starts at zero', 'CallCounter().calls'],
          ['Works with any arguments', 'c = CallCounter()\nc(1, 2, x=3)\nc.calls'],
          ['Two counters are independent', 'a = CallCounter()\nb = CallCounter()\na()\na()\nb()\n(a.calls, b.calls)'],
          ['A counter is callable', 'callable(CallCounter())'],
        ],
        traps: [
          py`class CallCounter:
    def __init__(self):
        self.calls = 0

    def __call__(self, *args, **kwargs):
        result = self.calls
        self.calls += 1
        return result`,
          py`class CallCounter:
    def __init__(self):
        self.calls = 0

    def __call__(self, *args, **kwargs):
        self.calls += 1`,
          py`class CallCounter:
    def __init__(self):
        self.calls = 0

    def call(self, *args, **kwargs):
        self.calls += 1
        return self.calls`,
        ],
      },
      real: [
        oop({
          title: 'A dictionary that answers like an object',
          use: ['customers'],
          starter: 'class RowView:\n    def __init__(self, row):\n        ...\n\n    def __getattr__(self, name):\n        ...\n\nrv = RowView(customers[0])\nanswer = [rv.FirstName, rv.Country]\ntry:\n    rv.NoSuchField\n    answer.append("no error")\nexcept AttributeError:\n    answer.append("raised")\n',
          given: '# customers is a list of dictionaries.',
          brief: 'Write `RowView(row)`, storing the row. `__getattr__(name)` should look `name` up in the row, raising `AttributeError(name)` if it is missing — an unknown field must raise, not return `None`.',
          reference: py`class RowView:
    def __init__(self, row):
        self.row = row

    def __getattr__(self, name):
        try:
            return self.row[name]
        except KeyError:
            raise AttributeError(name)

rv = RowView(customers[0])
answer = [rv.FirstName, rv.Country]
try:
    rv.NoSuchField
    answer.append("no error")
except AttributeError:
    answer.append("raised")`,
          walkthrough: '`__getattr__` only fires when the normal lookup (checking `self.__dict__`, then the class) fails, so `rv.FirstName` falls through to it and is answered from the wrapped dictionary. A genuinely missing field must raise `AttributeError`, not silently return `None`.',
          traps: [py`class RowView:
    def __init__(self, row):
        self.row = row

    def __getattr__(self, name):
        return self.row.get(name)

rv = RowView(customers[0])
answer = [rv.FirstName, rv.Country]
try:
    rv.NoSuchField
    answer.append("no error")
except AttributeError:
    answer.append("raised")`],
        }),
        oop({
          title: 'A running average as a callable',
          use: ['invoices'],
          starter: 'class RunningAverage:\n    def __init__(self):\n        ...\n\n    def __call__(self, value):\n        ...\n\navg = RunningAverage()\nresults = [round(avg(inv["Total"]), 2) for inv in invoices[:5]]\nanswer = results\n',
          given: '# invoices is a list of dictionaries with "Total".',
          brief: 'Write `RunningAverage()`. Each call adds a new value and returns the **average of every value seen so far** (including this one).',
          reference: py`class RunningAverage:
    def __init__(self):
        self.total = 0
        self.count = 0

    def __call__(self, value):
        self.total += value
        self.count += 1
        return self.total / self.count

avg = RunningAverage()
results = [round(avg(inv["Total"]), 2) for inv in invoices[:5]]
answer = results`,
          walkthrough: 'The object keeps `total` and `count` between calls, updating both before computing the new average — a callable with memory, unlike a plain function.',
          traps: [py`class RunningAverage:
    def __init__(self):
        self.total = 0
        self.count = 0

    def __call__(self, value):
        self.total += value
        self.count += 1
        return value

avg = RunningAverage()
results = [round(avg(inv["Total"]), 2) for inv in invoices[:5]]
answer = results`],
        }),
        oop({
          title: 'A logging proxy for a list of tracks',
          use: ['tracks'],
          starter: 'class LoggingProxy:\n    def __init__(self, target):\n        ...\n\n    def __getattr__(self, name):\n        ...\n\nnames = [t["Name"] for t in tracks[:5]]\nproxy = LoggingProxy(names)\nresult = proxy.count(names[0])\nanswer = (result, proxy.accessed)\n',
          given: '# tracks is a list of dictionaries.',
          brief: 'Write `LoggingProxy(target)`, with an `accessed` list. `__getattr__(name)` should append `name` to `accessed`, then return `getattr(self._target, name)` (store the target as `self._target`).',
          reference: py`class LoggingProxy:
    def __init__(self, target):
        self._target = target
        self.accessed = []

    def __getattr__(self, name):
        self.accessed.append(name)
        return getattr(self._target, name)

names = [t["Name"] for t in tracks[:5]]
proxy = LoggingProxy(names)
result = proxy.count(names[0])
answer = (result, proxy.accessed)`,
          walkthrough: '`proxy.count` is not a real attribute of `LoggingProxy`, so `__getattr__` catches it, logs the name, and forwards the actual `count` method from the wrapped list.',
          traps: [py`class LoggingProxy:
    def __init__(self, target):
        self._target = target
        self.accessed = []

    def __getattr__(self, name):
        return getattr(self._target, name)

names = [t["Name"] for t in tracks[:5]]
proxy = LoggingProxy(names)
result = proxy.count(names[0])
answer = (result, proxy.accessed)`],
        }),
      ],
    },
    {
      id: 'py-context-managers-class',
      title: 'Context managers: __enter__, __exit__ and contextlib',
      blurb: 'The with protocol, suppressing exceptions, and @contextmanager.',
      kind: 'code',
      practice: {
        prompt: 'Write `Timer`, a context manager. `__enter__` records the start time (with `time.perf_counter()`) and returns `self`. `__exit__` computes `self.elapsed` (never suppressing an exception).',
        starter: 'import time\n\nclass Timer:\n    def __enter__(self):\n        ...\n\n    def __exit__(self, exc_type, exc_value, traceback):\n        ...\n',
        solution: py`import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.perf_counter() - self.start
        return False`,
        samples: ['with Timer() as t:\n    total = sum(range(1000))\nt.elapsed >= 0'],
        cases: [
          ['elapsed is a non-negative number', 'with Timer() as t:\n    total = sum(range(1000))\nt.elapsed >= 0'],
          ['as binds the Timer itself', 'with Timer() as t:\n    pass\nisinstance(t, Timer)'],
          ['Raises: an exception still propagates', 'with Timer() as t:\n    raise ValueError("boom")'],
          ['elapsed is still set even when the block raises', 't = Timer()\ntry:\n    with t:\n        raise ValueError("boom")\nexcept ValueError:\n    pass\nt.elapsed >= 0'],
        ],
        traps: [
          py`import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.perf_counter() - self.start
        return False`,
          py`import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.perf_counter() - self.start
        return True`,
          py`import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return False`,
        ],
      },
      real: [
        oop({
          title: 'A transaction that rolls back on error',
          use: ['invoices'],
          starter: 'class Transaction:\n    def __init__(self, items):\n        ...\n\n    def __enter__(self):\n        ...\n\n    def __exit__(self, exc_type, exc_value, traceback):\n        ...\n\nitems = []\ntry:\n    with Transaction(items):\n        items.append(invoices[0]["InvoiceId"])\n        items.append(invoices[1]["InvoiceId"])\n        raise ValueError("something went wrong")\nexcept ValueError:\n    pass\nafter_failure = list(items)\nwith Transaction(items):\n    items.append(invoices[2]["InvoiceId"])\nanswer = (after_failure, items)\n',
          given: '# invoices is a list of dictionaries. The first block deliberately raises; the second one completes cleanly.',
          brief: 'Write `Transaction(items)`. `__enter__` remembers a **copy** of `items` as it was at the start (`self.snapshot`), and returns `self`. `__exit__`, **only when an exception occurred**, restores `items` to that snapshot **in place** (clear it, then extend with the snapshot). It always returns `False`. A **successful** block must keep its changes.',
          reference: py`class Transaction:
    def __init__(self, items):
        self.items = items

    def __enter__(self):
        self.snapshot = list(self.items)
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is not None:
            self.items.clear()
            self.items.extend(self.snapshot)
        return False

items = []
try:
    with Transaction(items):
        items.append(invoices[0]["InvoiceId"])
        items.append(invoices[1]["InvoiceId"])
        raise ValueError("something went wrong")
except ValueError:
    pass
after_failure = list(items)
with Transaction(items):
    items.append(invoices[2]["InvoiceId"])
answer = (after_failure, items)`,
          walkthrough: '`__exit__` receives the exception type, so it can tell a failure from a clean finish, and restores the **same** list object in place (rather than replacing it), so the caller\'s reference stays valid.',
          traps: [py`class Transaction:
    def __init__(self, items):
        self.items = items

    def __enter__(self):
        self.snapshot = list(self.items)
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.items.clear()
        self.items.extend(self.snapshot)
        return False

items = []
try:
    with Transaction(items):
        items.append(invoices[0]["InvoiceId"])
        items.append(invoices[1]["InvoiceId"])
        raise ValueError("something went wrong")
except ValueError:
    pass
after_failure = list(items)
with Transaction(items):
    items.append(invoices[2]["InvoiceId"])
answer = (after_failure, items)`],
        }),
        oop({
          title: 'Counting how many blocks fail',
          use: ['tracks'],
          starter: 'class FailureCounter:\n    total = 0\n\n    def __enter__(self):\n        return self\n\n    def __exit__(self, exc_type, exc_value, traceback):\n        ...\n\ncaught = 0\nfor t in tracks[:6]:\n    try:\n        with FailureCounter():\n            if t["UnitPrice"] > 0.98:\n                raise ValueError("too expensive")\n    except ValueError:\n        caught += 1\nanswer = (FailureCounter.total, caught)\n',
          given: '# tracks is a list of dictionaries with "UnitPrice". __enter__ is already written.',
          brief: 'Write `FailureCounter.__exit__`: when an exception occurred, add 1 to the **class attribute** `FailureCounter.total` (shared across every use). It must always return `False`, so the exception still propagates and is caught by the surrounding `except ValueError`.',
          reference: py`class FailureCounter:
    total = 0

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is not None:
            FailureCounter.total += 1
        return False

caught = 0
for t in tracks[:6]:
    try:
        with FailureCounter():
            if t["UnitPrice"] > 0.98:
                raise ValueError("too expensive")
    except ValueError:
        caught += 1
answer = (FailureCounter.total, caught)`,
          walkthrough: 'Updating through the class name (as in the earlier class-attributes lesson) makes the count shared across every separate `with FailureCounter():` block, even though a new instance is created each time.',
          traps: [py`class FailureCounter:
    total = 0

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is not None:
            FailureCounter.total += 1
        return True

caught = 0
for t in tracks[:6]:
    try:
        with FailureCounter():
            if t["UnitPrice"] > 0.98:
                raise ValueError("too expensive")
    except ValueError:
        caught += 1
answer = (FailureCounter.total, caught)`],
        }),
        oop({
          title: 'A contextmanager function for muting errors',
          use: ['tracks'],
          starter: 'from contextlib import contextmanager\n\n@contextmanager\ndef ignore(*exception_types):\n    ...\n\ndenominators = [t["Bytes"] for t in tracks[:4]] + [0]\nresults = []\nfor d in denominators:\n    with ignore(ZeroDivisionError):\n        results.append(round(1000 / d, 4))\nanswer = results\n',
          given: '# tracks is a list of dictionaries. denominators ends with a 0, which would divide by zero.',
          brief: 'Write `ignore(*exception_types)` with `@contextmanager`: it should `yield`, and in a `try`/`except exception_types:` **around** the `yield`, silently ignore any of the given exception types (do not re-raise). The loop must keep running after the ignored error, so `results` ends up with **4** entries, not 5.',
          reference: py`from contextlib import contextmanager

@contextmanager
def ignore(*exception_types):
    try:
        yield
    except exception_types:
        pass

denominators = [t["Bytes"] for t in tracks[:4]] + [0]
results = []
for d in denominators:
    with ignore(ZeroDivisionError):
        results.append(round(1000 / d, 4))
answer = results`,
          walkthrough: 'Wrapping the `yield` in a `try`/`except` is exactly how `@contextmanager` expresses "catch what happens inside the `with` block": the exception surfaces exactly at the `yield` line, is caught there, and the loop moves on to its next value.',
          traps: [py`from contextlib import contextmanager

@contextmanager
def ignore(*exception_types):
    yield
    try:
        pass
    except exception_types:
        pass

denominators = [t["Bytes"] for t in tracks[:4]] + [0]
results = []
for d in denominators:
    with ignore(ZeroDivisionError):
        results.append(round(1000 / d, 4))
answer = results`],
        }),
      ],
    },
]
