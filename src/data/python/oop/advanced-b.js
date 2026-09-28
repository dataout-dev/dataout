import { py, oop } from './common.js'

export const advancedLessonsB = [
    {
      id: 'py-immutability-value-objects',
      title: 'Immutability and value objects',
      blurb: 'Frozen dataclasses, the with-style update, and hashing.',
      kind: 'code',
      practice: {
        prompt: 'Write an immutable `Point(x, y)` (a frozen dataclass, or a plain class that refuses attribute changes). Add `with_x(new_x)`, returning a **new** `Point` with `x` replaced and `y` unchanged, leaving the original untouched.',
        starter: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: float\n    y: float\n\n    def with_x(self, new_x):\n        ...\n',
        solution: py`from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: float
    y: float

    def with_x(self, new_x):
        return Point(new_x, self.y)`,
        samples: ['(Point(1, 2).with_x(9).x, Point(1, 2).with_x(9).y)'],
        cases: [
          ['Replaces x, keeps y', 'p = Point(1, 2).with_x(9)\n(p.x, p.y)'],
          ['The original is unchanged', 'p = Point(1, 2)\np.with_x(9)\n(p.x, p.y)'],
          ['Returns a new object', 'p = Point(1, 2)\np.with_x(9) is p'],
          ['Equality by value', 'Point(1, 2).with_x(9) == Point(9, 2)'],
          ['Raises: frozen, cannot assign', 'p = Point(1, 2)\np.x = 5'],
          ['Hashable', 'len({Point(1, 2), Point(1, 2), Point(3, 4)})'],
        ],
        traps: [
          py`from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: float
    y: float

    def with_x(self, new_x):
        self.x = new_x
        return self`,
          py`from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: float
    y: float

    def with_x(self, new_x):
        return Point(new_x, new_x)`,
          py`from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

    def with_x(self, new_x):
        return Point(new_x, self.y)`,
        ],
      },
      real: [
        oop({
          title: 'Value objects for track prices',
          use: ['tracks'],
          starter: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Price:\n    amount: float\n    currency: str = "USD"\n\n    def converted(self, rate, currency):\n        ...\n\np = Price(tracks[0]["UnitPrice"])\neuros = p.converted(0.9, "EUR")\nanswer = (round(p.amount, 2), p.currency, round(euros.amount, 2), euros.currency)\n',
          given: '# tracks is a list of dictionaries with "UnitPrice".',
          brief: 'Write `Price.converted(rate, currency)`, returning a **new** `Price` with `amount * rate` and the given `currency`, leaving the original `Price` unchanged.',
          reference: py`from dataclasses import dataclass

@dataclass(frozen=True)
class Price:
    amount: float
    currency: str = "USD"

    def converted(self, rate, currency):
        return Price(self.amount * rate, currency)

p = Price(tracks[0]["UnitPrice"])
euros = p.converted(0.9, "EUR")
answer = (round(p.amount, 2), p.currency, round(euros.amount, 2), euros.currency)`,
          walkthrough: '`converted` builds and returns a brand-new `Price`, so `p` itself still reports its original amount and currency afterward.',
          traps: [py`from dataclasses import dataclass

@dataclass(frozen=True)
class Price:
    amount: float
    currency: str = "USD"

    def converted(self, rate, currency):
        return Price(self.amount * rate, self.currency)

p = Price(tracks[0]["UnitPrice"])
euros = p.converted(0.9, "EUR")
answer = (round(p.amount, 2), p.currency, round(euros.amount, 2), euros.currency)`],
        }),
        oop({
          title: 'Value objects as dictionary keys',
          use: ['genres'],
          starter: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass GenreKey:\n    name: str\n\ncounts = {}\nfor g in genres:\n    key = GenreKey(g["Name"])\n    ...\nanswer = counts[GenreKey("Rock")]\n',
          given: '# genres is a list of dictionaries with "Name". GenreKey is already finished.',
          brief: 'Finish the loop: count how many times each `GenreKey` value appears, using `counts` (a plain dictionary). Two `GenreKey`s with the same name must count as the same key.',
          reference: py`from dataclasses import dataclass

@dataclass(frozen=True)
class GenreKey:
    name: str

counts = {}
for g in genres:
    key = GenreKey(g["Name"])
    counts[key] = counts.get(key, 0) + 1
answer = counts[GenreKey("Rock")]`,
          walkthrough: 'Because `GenreKey` is a frozen dataclass, two instances built from the same name are equal **and** hash equal, so they collapse into a single dictionary entry, exactly like two equal strings would.',
          traps: [py`from dataclasses import dataclass

@dataclass(frozen=True)
class GenreKey:
    name: str

counts = {}
for g in genres:
    key = GenreKey(g["Name"])
    counts[g["Name"]] = counts.get(g["Name"], 0) + 1
answer = counts[GenreKey("Rock")]`],
        }),
        oop({
          title: 'A mutable field hiding inside a frozen class',
          use: ['artists'],
          starter: 'from dataclasses import dataclass, field\n\n@dataclass(frozen=True)\nclass TaggedArtist:\n    name: str\n    tags: tuple = ()\n\n    def tagged(self, tag):\n        ...\n\na = TaggedArtist(artists[0]["Name"])\nb = a.tagged("favourite")\nanswer = (a.tags, b.tags)\n',
          given: '# artists is a list of dictionaries.',
          brief: 'Write `TaggedArtist.tagged(tag)`, returning a **new** `TaggedArtist` whose `tags` is the old tuple with `tag` appended (`self.tags + (tag,)`), leaving the original unchanged. Using a `tuple` (not a `list`) keeps the class a true, fully immutable value object.',
          reference: py`from dataclasses import dataclass

@dataclass(frozen=True)
class TaggedArtist:
    name: str
    tags: tuple = ()

    def tagged(self, tag):
        return TaggedArtist(self.name, self.tags + (tag,))

a = TaggedArtist(artists[0]["Name"])
b = a.tagged("favourite")
answer = (a.tags, b.tags)`,
          walkthrough: 'A `tuple` has no `append`, so the only way to add a tag is to build a new tuple (and a new `TaggedArtist`) — which is exactly what keeps this class genuinely, fully immutable.',
          traps: [py`from dataclasses import dataclass

@dataclass(frozen=True)
class TaggedArtist:
    name: str
    tags: list = None

    def __post_init__(self):
        if self.tags is None:
            object.__setattr__(self, "tags", [])

    def tagged(self, tag):
        self.tags.append(tag)
        return self

a = TaggedArtist(artists[0]["Name"])
b = a.tagged("favourite")
answer = (a.tags, b.tags)`],
        }),
      ],
    },
    {
      id: 'py-iterators-as-classes',
      title: 'Iterators and generators as classes; lazy sequences',
      blurb: 'The iterator protocol by hand, and reusable versus one-shot iterables.',
      kind: 'code',
      practice: {
        prompt: 'Write `Countdown(start)` as a **reusable iterable**: `__iter__` must return a **new** iterator each time (starting fresh from `start`), so it can be iterated more than once. Use a small helper iterator class, or a generator inside `__iter__`.',
        starter: 'class Countdown:\n    def __init__(self, start):\n        ...\n\n    def __iter__(self):\n        ...\n',
        solution: py`class Countdown:
    def __init__(self, start):
        self.start = start

    def __iter__(self):
        current = self.start
        while current > 0:
            yield current
            current -= 1`,
        samples: ['list(Countdown(3))'],
        cases: [
          ['A normal countdown', 'list(Countdown(3))'],
          ['Can be iterated twice', 'c = Countdown(3)\n(list(c), list(c))'],
          ['A start of zero gives nothing', 'list(Countdown(0))'],
          ['A start of one', 'list(Countdown(1))'],
          ['Two separate instances are independent', '(list(Countdown(2)), list(Countdown(4)))'],
          ['Works in a for loop', 'total = 0\nfor n in Countdown(4):\n    total += n\ntotal'],
        ],
        traps: [
          py`class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value`,
          py`class Countdown:
    def __init__(self, start):
        self.start = start

    def __iter__(self):
        current = self.start
        while current >= 0:
            yield current
            current -= 1`,
          py`class Countdown:
    def __init__(self, start):
        self.start = start

    def __iter__(self):
        current = self.start
        while current > 0:
            current -= 1
            yield current`,
        ],
      },
      real: [
        oop({
          title: 'A reusable iterable over real tracks',
          use: ['tracks'],
          starter: 'class TrackNames:\n    def __init__(self, rows, limit):\n        ...\n\n    def __iter__(self):\n        ...\n\ntn = TrackNames(tracks, 3)\nanswer = (list(tn), list(tn))\n',
          given: '# tracks is a list of dictionaries with "Name".',
          brief: 'Write `TrackNames(rows, limit)` as a reusable iterable: `__iter__` yields the `"Name"` of the first `limit` rows, **fresh every time** it is called.',
          reference: py`class TrackNames:
    def __init__(self, rows, limit):
        self.rows = rows
        self.limit = limit

    def __iter__(self):
        for row in self.rows[: self.limit]:
            yield row["Name"]

tn = TrackNames(tracks, 3)
answer = (list(tn), list(tn))`,
          walkthrough: 'Because `__iter__` is a generator function, calling it again (which `list()` does each time) starts a brand-new generator from the beginning, so the second `list(tn)` is identical to the first.',
          traps: [py`class TrackNames:
    def __init__(self, rows, limit):
        self.rows = iter(rows[:limit])

    def __iter__(self):
        return self

    def __next__(self):
        return next(self.rows)["Name"]

tn = TrackNames(tracks, 3)
answer = (list(tn), list(tn))`],
        }),
        oop({
          title: 'Batches of invoices, safely bounded',
          use: ['invoices'],
          hidden: 'from itertools import islice\n',
          starter: 'class Batcher:\n    def __init__(self, rows, size):\n        ...\n\n    def __iter__(self):\n        ...\n\nb = Batcher(invoices[:7], 3)\nanswer = [len(batch) for batch in islice(b, 5)]\n',
          given: '# invoices is a list of dictionaries. islice is already imported, so testing stays safe even while you are still writing __iter__.',
          brief: 'Write `Batcher(rows, size)`: `__iter__` yields **lists** of up to `size` rows at a time, until `rows` is exhausted (the last batch may be smaller).',
          reference: py`class Batcher:
    def __init__(self, rows, size):
        self.rows = rows
        self.size = size

    def __iter__(self):
        for start in range(0, len(self.rows), self.size):
            yield self.rows[start : start + self.size]

b = Batcher(invoices[:7], 3)
answer = [len(batch) for batch in islice(b, 5)]`,
          walkthrough: '`range(0, len(rows), size)` naturally stops once every row has been covered, so the generator always terminates on its own — `islice` is only there so that testing stays safe while `__iter__` is still being written.',
          traps: [py`class Batcher:
    def __init__(self, rows, size):
        self.rows = rows
        self.size = size

    def __iter__(self):
        for start in range(0, len(self.rows), self.size):
            yield self.rows[start:self.size]

b = Batcher(invoices[:7], 3)
answer = [len(batch) for batch in islice(b, 5)]`],
        }),
        oop({
          title: 'A lazily cached sequence of genre names',
          use: ['genres'],
          starter: 'class CachedNames:\n    def __init__(self, rows):\n        ...\n\n    def __iter__(self):\n        ...\n\ncn = CachedNames(genres[:5])\nit = iter(cn)\nfirst_two = [next(it), next(it)]\nmid_cache = list(cn._cache)\nrest = list(it)\nanswer = (first_two, mid_cache, rest, list(cn._cache))\n',
          given: '# genres is a list of dictionaries with "Name". The test deliberately pauses after two names to check the cache mid-way.',
          brief: 'Write `CachedNames(rows)` with an empty list `self._cache`. `__iter__` should yield each row\'s `"Name"`, **appending it to `self._cache` one at a time, as it goes** — not all at once at the end — so the cache already holds the names produced so far, even if iteration is paused part-way through.',
          reference: py`class CachedNames:
    def __init__(self, rows):
        self.rows = rows
        self._cache = []

    def __iter__(self):
        for row in self.rows:
            name = row["Name"]
            self._cache.append(name)
            yield name

cn = CachedNames(genres[:5])
it = iter(cn)
first_two = [next(it), next(it)]
mid_cache = list(cn._cache)
rest = list(it)
answer = (first_two, mid_cache, rest, list(cn._cache))`,
          walkthrough: 'Because each value is appended to `self._cache` at the moment it is produced, the cache already holds exactly the two names yielded so far when iteration is paused — a version that instead fills the cache only after the whole loop finishes would still show it empty at that point.',
          traps: [py`class CachedNames:
    def __init__(self, rows):
        self.rows = rows
        self._cache = []

    def __iter__(self):
        for row in self.rows:
            yield row["Name"]
        self._cache = [row["Name"] for row in self.rows]

cn = CachedNames(genres[:5])
it = iter(cn)
first_two = [next(it), next(it)]
mid_cache = list(cn._cache)
rest = list(it)
answer = (first_two, mid_cache, rest, list(cn._cache))`],
        }),
      ],
    },
    {
      id: 'py-testing-classes',
      title: 'Testing classes: unit tests, fixtures and mocks',
      blurb: 'unittest style, testing behaviour, fixtures and mocking collaborators.',
      kind: 'code',
      practice: {
        prompt: 'Write `ShoppingCart()` with `add(name, price)`, `total()` (sum of prices), and `item_count()`. `add` rejects a **negative** price with `ValueError("price cannot be negative")`.',
        starter: 'class ShoppingCart:\n    def __init__(self):\n        ...\n\n    def add(self, name, price):\n        ...\n\n    def total(self):\n        ...\n\n    def item_count(self):\n        ...\n',
        solution: py`class ShoppingCart:
    def __init__(self):
        self.items = []

    def add(self, name, price):
        if price < 0:
            raise ValueError("price cannot be negative")
        self.items.append((name, price))

    def total(self):
        return sum(price for _, price in self.items)

    def item_count(self):
        return len(self.items)`,
        samples: ['c = ShoppingCart()\nc.add("pen", 1.5)\nc.add("ink", 3.0)\n(c.total(), c.item_count())'],
        cases: [
          ['An empty cart totals zero', 'ShoppingCart().total()'],
          ['Adding increases the total', 'c = ShoppingCart()\nc.add("pen", 1.5)\nc.add("ink", 3.0)\nc.total()'],
          ['item_count tracks additions', 'c = ShoppingCart()\nc.add("pen", 1.5)\nc.add("ink", 3.0)\nc.item_count()'],
          ['Raises: a negative price is rejected', 'ShoppingCart().add("free", -1)'],
          ['A rejected item is not added', 'c = ShoppingCart()\ntry:\n    c.add("bad", -1)\nexcept ValueError:\n    pass\nc.item_count()'],
          ['Zero is a valid price', 'c = ShoppingCart()\nc.add("free sample", 0)\n(c.total(), c.item_count())'],
          ['Two carts are independent', 'a = ShoppingCart()\nb = ShoppingCart()\na.add("x", 1)\nb.item_count()'],
        ],
        traps: [
          py`class ShoppingCart:
    def __init__(self):
        self.items = []

    def add(self, name, price):
        self.items.append((name, price))
        if price < 0:
            raise ValueError("price cannot be negative")

    def total(self):
        return sum(price for _, price in self.items)

    def item_count(self):
        return len(self.items)`,
          py`class ShoppingCart:
    items = []

    def __init__(self):
        pass

    def add(self, name, price):
        if price < 0:
            raise ValueError("price cannot be negative")
        self.items.append((name, price))

    def total(self):
        return sum(price for _, price in self.items)

    def item_count(self):
        return len(self.items)`,
          py`class ShoppingCart:
    def __init__(self):
        self.items = []
        self.count = 0

    def add(self, name, price):
        if price < 0:
            raise ValueError("price cannot be negative")
        self.items.append((name, price))
        self.count += 1

    def total(self):
        return sum(price for _, price in self.items)

    def item_count(self):
        return 0`,
        ],
      },
      real: [
        oop({
          title: 'Testing a Track summary, behaviourally',
          use: ['tracks'],
          starter: 'class Track:\n    def __init__(self, name, milliseconds):\n        ...\n\n    def is_long(self):\n        ...\n\nresults = []\nfor t in tracks[:5]:\n    track = Track(t["Name"], t["Milliseconds"])\n    results.append(track.is_long())\nanswer = results\n',
          given: '# tracks is a list of dictionaries. "Long" means 4 minutes (240 000 ms) or more.',
          brief: 'Write `Track.__init__` and `is_long()` (`True` when `milliseconds >= 240_000`, so the boundary itself counts as long). Then this behaves like a small test: it checks `is_long()` through the public interface only, on five real tracks plus one built exactly on the boundary.',
          reference: py`class Track:
    def __init__(self, name, milliseconds):
        self.name = name
        self.milliseconds = milliseconds

    def is_long(self):
        return self.milliseconds >= 240_000

results = []
for t in tracks[:5] + [{"Name": "Exactly four minutes", "Milliseconds": 240_000}]:
    track = Track(t["Name"], t["Milliseconds"])
    results.append(track.is_long())
answer = results`,
          walkthrough: 'The test only ever calls `is_long()`, the class\'s public interface — it never looks at `milliseconds` directly, so `Track` could change its internal storage later without breaking anything that depends on it.',
          traps: [py`class Track:
    def __init__(self, name, milliseconds):
        self.name = name
        self.milliseconds = milliseconds

    def is_long(self):
        return self.milliseconds > 240_000

results = []
for t in tracks[:5] + [{"Name": "Exactly four minutes", "Milliseconds": 240_000}]:
    track = Track(t["Name"], t["Milliseconds"])
    results.append(track.is_long())
answer = results`],
        }),
        oop({
          title: 'A fixture-style helper for several checks',
          use: ['customers'],
          starter: 'class CustomerRecord:\n    def __init__(self, row):\n        ...\n\n    def has_company(self):\n        ...\n\n    def is_from(self, country):\n        ...\n\ndef make_record(row):\n    return CustomerRecord(row)\n\nblank = {"Company": "", "Country": "Nowhere"}\nanswer = (make_record(customers[0]).has_company(), make_record(blank).has_company(), make_record(customers[0]).is_from(customers[0]["Country"]), make_record(customers[0]).is_from("Nowhere"))\n',
          given: '# customers is a list of dictionaries. blank is a made-up row with an empty (but not missing) Company.',
          brief: 'Write `CustomerRecord.__init__`, `has_company()` (`True` when `row["Company"]` is **not `None`** — an empty string still counts as "has a company"), and `is_from(country)` (compares `row["Country"]`).',
          reference: py`class CustomerRecord:
    def __init__(self, row):
        self.row = row

    def has_company(self):
        return self.row["Company"] is not None

    def is_from(self, country):
        return self.row["Country"] == country

def make_record(row):
    return CustomerRecord(row)

blank = {"Company": "", "Country": "Nowhere"}
answer = (make_record(customers[0]).has_company(), make_record(blank).has_company(), make_record(customers[0]).is_from(customers[0]["Country"]), make_record(customers[0]).is_from("Nowhere"))`,
          walkthrough: '`make_record` is a tiny fixture: it builds a fresh `CustomerRecord` for each check, so the checks cannot accidentally affect one another.',
          traps: [py`class CustomerRecord:
    def __init__(self, row):
        self.row = row

    def has_company(self):
        return bool(self.row["Company"])

    def is_from(self, country):
        return self.row["Country"] == country

def make_record(row):
    return CustomerRecord(row)

blank = {"Company": "", "Country": "Nowhere"}
answer = (make_record(customers[0]).has_company(), make_record(blank).has_company(), make_record(customers[0]).is_from(customers[0]["Country"]), make_record(customers[0]).is_from("Nowhere"))`],
        }),
        oop({
          title: 'Faking a slow collaborator',
          use: ['invoices'],
          starter: 'class SlowPricer:\n    def quote(self, total):\n        raise RuntimeError("this would call a slow real service")\n\n\nclass FakePricer:\n    def __init__(self, extra):\n        ...\n\n    def quote(self, total):\n        ...\n\n\ndef total_with_fee(pricer, total):\n    return pricer.quote(total)\n\nfake = FakePricer(2.5)\nanswer = [round(total_with_fee(fake, inv["Total"]), 2) for inv in invoices[:3]]\n',
          given: '# invoices is a list of dictionaries with "Total". SlowPricer stands in for a real, slow dependency that tests must never call.',
          brief: 'Write `FakePricer(extra)` with `quote(total)` returning `total + extra`, standing in for a real pricing service in a test, without ever touching `SlowPricer`.',
          reference: py`class SlowPricer:
    def quote(self, total):
        raise RuntimeError("this would call a slow real service")


class FakePricer:
    def __init__(self, extra):
        self.extra = extra

    def quote(self, total):
        return total + self.extra


def total_with_fee(pricer, total):
    return pricer.quote(total)

fake = FakePricer(2.5)
answer = [round(total_with_fee(fake, inv["Total"]), 2) for inv in invoices[:3]]`,
          walkthrough: '`total_with_fee` does not care which kind of pricer it receives, as long as it has a `quote` method — so the test substitutes `FakePricer` and never has to call the slow, real `SlowPricer` at all.',
          traps: [py`class SlowPricer:
    def quote(self, total):
        raise RuntimeError("this would call a slow real service")


class FakePricer:
    def __init__(self, extra):
        self.extra = extra

    def quote(self, total):
        return total * self.extra


def total_with_fee(pricer, total):
    return pricer.quote(total)

fake = FakePricer(2.5)
answer = [round(total_with_fee(fake, inv["Total"]), 2) for inv in invoices[:3]]`],
        }),
      ],
    },
]
