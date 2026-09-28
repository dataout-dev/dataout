import { py, oop } from './common.js'

export const dataModelLessonsB = [
    {
      id: 'py-descriptors',
      title: 'Descriptors and how properties work',
      blurb: 'The descriptor protocol, and a reusable validating attribute.',
      kind: 'code',
      practice: {
        prompt: 'Write `PositiveInt`, a descriptor. `__set_name__` records `"_" + name`. `__get__` returns the stored value (or `self` if `instance is None`). `__set__` raises `ValueError` for anything that is not a positive `int` (reject `bool`), otherwise stores it.',
        starter: 'class PositiveInt:\n    def __set_name__(self, owner, name):\n        ...\n\n    def __get__(self, instance, owner):\n        ...\n\n    def __set__(self, instance, value):\n        ...\n',
        solution: py`class PositiveInt:
    def __set_name__(self, owner, name):
        self.name = "_" + name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name)

    def __set__(self, instance, value):
        if not isinstance(value, int) or isinstance(value, bool) or value <= 0:
            raise ValueError("must be a positive integer")
        setattr(instance, self.name, value)`,
        samples: ['class Product:\n    quantity = PositiveInt()\n    def __init__(self, quantity):\n        self.quantity = quantity\nProduct(5).quantity'],
        cases: [
          ['Stores a valid value', 'class Product:\n    quantity = PositiveInt()\n    def __init__(self, quantity):\n        self.quantity = quantity\nProduct(5).quantity'],
          ['Raises: zero is not allowed', 'class Product:\n    quantity = PositiveInt()\n    def __init__(self, quantity):\n        self.quantity = quantity\nProduct(0)'],
          ['Raises: negative is not allowed', 'class Product:\n    quantity = PositiveInt()\n    def __init__(self, quantity):\n        self.quantity = quantity\nProduct(-3)'],
          ['Raises: a float is not an int', 'class Product:\n    quantity = PositiveInt()\n    def __init__(self, quantity):\n        self.quantity = quantity\nProduct(2.5)'],
          ['Raises: a bool is rejected', 'class Product:\n    quantity = PositiveInt()\n    def __init__(self, quantity):\n        self.quantity = quantity\nProduct(True)'],
          ['Two attributes on one class are independent', 'class Order:\n    a = PositiveInt()\n    b = PositiveInt()\n    def __init__(self, a, b):\n        self.a = a\n        self.b = b\no = Order(2, 9)\n(o.a, o.b)'],
          ['Two instances do not share state', 'class Product:\n    quantity = PositiveInt()\n    def __init__(self, quantity):\n        self.quantity = quantity\np1 = Product(3)\np2 = Product(7)\n(p1.quantity, p2.quantity)'],
        ],
        traps: [
          py`class PositiveInt:
    def __set_name__(self, owner, name):
        self.name = "_" + name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name)

    def __set__(self, instance, value):
        if value <= 0:
            raise ValueError("must be a positive integer")
        setattr(instance, self.name, value)`,
          py`class PositiveInt:
    def __get__(self, instance, owner):
        if instance is None:
            return self
        return self.value

    def __set__(self, instance, value):
        if not isinstance(value, int) or isinstance(value, bool) or value <= 0:
            raise ValueError("must be a positive integer")
        self.value = value`,
          py`class PositiveInt:
    def __set_name__(self, owner, name):
        self.name = "_" + name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name)

    def __set__(self, instance, value):
        if not isinstance(value, int) or isinstance(value, bool) or value < 0:
            raise ValueError("must be a positive integer")
        setattr(instance, self.name, value)`,
        ],
      },
      real: [
        oop({
          title: 'A validated price on Track objects',
          use: ['tracks'],
          starter: 'class PositivePrice:\n    def __set_name__(self, owner, name):\n        self.name = "_" + name\n\n    def __get__(self, instance, owner):\n        if instance is None:\n            return self\n        return getattr(instance, self.name)\n\n    def __set__(self, instance, value):\n        ...\n\n\nclass Track:\n    price = PositivePrice()\n\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\nt = Track(tracks[0]["Name"], tracks[0]["UnitPrice"])\noriginal = t.price\nerror = None\ntry:\n    t.price = -5\nexcept ValueError as e:\n    error = str(e)\nanswer = (original, t.price, error)\n',
          given: '# tracks is a list of dictionaries. Only PositivePrice.__set__ needs writing.',
          brief: 'Write `PositivePrice.__set__`: reject any value that is **not greater than zero** with `ValueError("price must be positive")`, **without** storing it, otherwise store it.',
          reference: py`class PositivePrice:
    def __set_name__(self, owner, name):
        self.name = "_" + name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name)

    def __set__(self, instance, value):
        if value <= 0:
            raise ValueError("price must be positive")
        setattr(instance, self.name, value)


class Track:
    price = PositivePrice()

    def __init__(self, name, price):
        self.name = name
        self.price = price

t = Track(tracks[0]["Name"], tracks[0]["UnitPrice"])
original = t.price
error = None
try:
    t.price = -5
except ValueError as e:
    error = str(e)
answer = (original, t.price, error)`,
          walkthrough: 'Checking the value **before** calling `setattr` means a rejected assignment never touches the stored price, so `t.price` still holds its original, valid value afterward.',
          traps: [py`class PositivePrice:
    def __set_name__(self, owner, name):
        self.name = "_" + name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name)

    def __set__(self, instance, value):
        setattr(instance, self.name, value)
        if value <= 0:
            raise ValueError("price must be positive")


class Track:
    price = PositivePrice()

    def __init__(self, name, price):
        self.name = name
        self.price = price

t = Track(tracks[0]["Name"], tracks[0]["UnitPrice"])
original = t.price
error = None
try:
    t.price = -5
except ValueError as e:
    error = str(e)
answer = (original, t.price, error)`],
        }),
        oop({
          title: 'Reusing one descriptor for two fields',
          use: ['customers'],
          starter: 'class NonEmptyText:\n    def __set_name__(self, owner, name):\n        self.name = "_" + name\n\n    def __get__(self, instance, owner):\n        if instance is None:\n            return self\n        return getattr(instance, self.name)\n\n    def __set__(self, instance, value):\n        ...\n\n\nclass Contact:\n    first = NonEmptyText()\n    last = NonEmptyText()\n\n    def __init__(self, first, last):\n        self.first = first\n        self.last = last\n\nc = Contact(customers[0]["FirstName"], customers[0]["LastName"])\nanswer = [(c.first, c.last)]\ntry:\n    Contact("", "Smith")\nexcept ValueError as e:\n    answer.append(str(e))\n',
          given: '# customers is a list of dictionaries. Only NonEmptyText.__set__ needs writing.',
          brief: 'Write `NonEmptyText.__set__`: reject an **empty string** with `ValueError("text cannot be empty")`, otherwise store it. The **same** descriptor class must work for both `first` and `last`, independently.',
          reference: py`class NonEmptyText:
    def __set_name__(self, owner, name):
        self.name = "_" + name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name)

    def __set__(self, instance, value):
        if value == "":
            raise ValueError("text cannot be empty")
        setattr(instance, self.name, value)


class Contact:
    first = NonEmptyText()
    last = NonEmptyText()

    def __init__(self, first, last):
        self.first = first
        self.last = last

c1 = Contact(customers[0]["FirstName"], customers[0]["LastName"])
c2 = Contact(customers[1]["FirstName"], customers[1]["LastName"])
answer = [(c1.first, c1.last), (c2.first, c2.last)]
try:
    Contact("", "Smith")
except ValueError as e:
    answer.append(str(e))`,
          walkthrough: '`__set_name__` gives each attribute its own private storage name (`_first`, `_last`), so one `NonEmptyText` class safely validates two independent fields on the same object.',
          traps: [py`class NonEmptyText:
    def __get__(self, instance, owner):
        if instance is None:
            return self
        return self.stored

    def __set__(self, instance, value):
        if value == "":
            raise ValueError("text cannot be empty")
        self.stored = value


class Contact:
    first = NonEmptyText()
    last = NonEmptyText()

    def __init__(self, first, last):
        self.first = first
        self.last = last

c1 = Contact(customers[0]["FirstName"], customers[0]["LastName"])
c2 = Contact(customers[1]["FirstName"], customers[1]["LastName"])
answer = [(c1.first, c1.last), (c2.first, c2.last)]
try:
    Contact("", "Smith")
except ValueError as e:
    answer.append(str(e))`],
        }),
        oop({
          title: 'Functions as descriptors, made visible',
          use: ['tracks'],
          starter: 'class Track:\n    def __init__(self, name):\n        ...\n\n    def shout(self):\n        return self.name.upper()\n\nt = Track(tracks[0]["Name"])\nbound = t.shout\nunbound = Track.shout\nanswer = (bound(), unbound(t), type(Track.__dict__["shout"]).__name__ != type(bound).__name__)\n',
          given: '# tracks is a list of dictionaries. Only Track.__init__ needs writing.',
          brief: 'Write `Track.__init__`, storing `name`. Then `t.shout` (a **bound method**) and `Track.shout` (the plain function) are different objects, produced by the function\'s own descriptor protocol.',
          reference: py`class Track:
    def __init__(self, name):
        self.name = name

    def shout(self):
        return self.name.upper()

t = Track(tracks[0]["Name"])
bound = t.shout
unbound = Track.shout
answer = (bound(), unbound(t), type(Track.__dict__["shout"]).__name__ != type(bound).__name__)`,
          walkthrough: '`Track.__dict__["shout"]` is a plain function. `t.shout` triggers that function\'s `__get__`, producing a distinct "bound method" object that already remembers `t` as `self`.',
          traps: [py`class Track:
    def __init__(self, name):
        self.name = name

    def shout(self):
        return self.name.upper()

t = Track(tracks[0]["Name"])
bound = t.shout
unbound = Track.shout
answer = (bound(), unbound(t), False)`],
        }),
      ],
    },
    {
      id: 'py-slots-memory',
      title: '__slots__, memory and attribute storage',
      blurb: 'Per-instance __dict__, __slots__ trade-offs and inheritance.',
      kind: 'learn',
      check: [
        {
          q: 'What does an ordinary instance (no `__slots__`) use to store its attributes?',
          options: ['A fixed-size array', 'Its own `__dict__`, a real dictionary created for that instance', 'The class body directly', 'Nothing; attributes are computed each time'],
          answer: 1,
          why: 'Every ordinary instance carries its own `__dict__`, which is what lets you add attributes to it freely.',
        },
        {
          q: 'What is the main benefit of declaring `__slots__`?',
          options: [
            'It makes methods run faster',
            'It removes the per-instance `__dict__`, saving memory when you create very many instances',
            'It automatically validates attribute values',
            'It adds new methods to the class',
          ],
          answer: 1,
          why: '`__slots__` reserves fixed storage for named attributes only, avoiding the overhead of a dictionary per instance.',
        },
        {
          q: 'A class `Base` declares `__slots__ = ("x",)`. A subclass `Child(Base)` declares no `__slots__` of its own. What happens?',
          options: [
            'Child instances have no `__dict__`, just like Base',
            'Child instances get a `__dict__` after all, cancelling much of the memory benefit',
            'Python raises an error immediately',
            'Child cannot be created',
          ],
          answer: 1,
          why: 'Every class in the chain needs its own `__slots__` to keep the benefit; a subclass without one gets a `__dict__` back.',
        },
        {
          q: 'What do you need to add to `__slots__` if you want instances to support `weakref.ref`?',
          options: ['`"__dict__"`', '`"__weakref__"`', '`"__weak__"`', 'Nothing extra is needed'],
          answer: 1,
          why: 'Slotted instances cannot be weakly referenced unless `"__weakref__"` is explicitly included in `__slots__`.',
        },
        {
          q: 'When is `__slots__` most worth using?',
          options: [
            'For every class you write, by default',
            'When you will create very many instances of a simple, fixed-shape class and memory genuinely matters',
            'Only for abstract base classes',
            'Never; it is purely historical',
          ],
          answer: 1,
          why: 'For a handful of long-lived objects, the flexibility of `__dict__` usually outweighs the small memory saving. `__slots__` pays off at scale.',
        },
      ],
    },
    {
      id: 'py-dataclasses',
      title: 'Dataclasses in depth',
      blurb: '@dataclass options, field(), __post_init__, InitVar, asdict and replace.',
      kind: 'code',
      practice: {
        prompt: 'Define `Song` as a **frozen, ordered** dataclass with fields `streams: int` and `title: str`, in that order (so sorting is by streams first).',
        starter: 'from dataclasses import dataclass\n\n@dataclass(order=True, frozen=True)\nclass Song:\n    ...\n',
        solution: py`from dataclasses import dataclass

@dataclass(order=True, frozen=True)
class Song:
    streams: int
    title: str`,
        samples: ['[s.title for s in sorted([Song(100, "B"), Song(300, "A"), Song(100, "A")])]'],
        cases: [
          ['Equality by value', 'Song(100, "A") == Song(100, "A")'],
          ['Sorting by streams first', '[s.title for s in sorted([Song(100, "B"), Song(300, "A"), Song(100, "A")])]'],
          ['Less than', 'Song(100, "A") < Song(200, "A")'],
          ['Raises: frozen, cannot be changed', 's = Song(100, "A")\ns.streams = 200'],
          ['repr shows the fields', "'100' in repr(Song(100, 'A')) and 'A' in repr(Song(100, 'A'))"],
          ['Hashable because it is frozen', 'len({Song(100, "A"), Song(100, "A"), Song(200, "A")})'],
        ],
        traps: [
          py`from dataclasses import dataclass

@dataclass(frozen=True)
class Song:
    streams: int
    title: str`,
          py`from dataclasses import dataclass

@dataclass(order=True)
class Song:
    streams: int
    title: str`,
          py`from dataclasses import dataclass

@dataclass(order=True, frozen=True)
class Song:
    title: str
    streams: int`,
        ],
      },
      real: [
        oop({
          title: 'A Song dataclass over real songs',
          use: ['songs'],
          starter: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Song:\n    title: str\n    artist: str\n    streams: int\n    millions: float = field(init=False)\n\n    def __post_init__(self):\n        ...\n\nsongs_data = [Song(s["track"], s["artist"], s["spotify_streams"]) for s in songs[:15]]\ntop = sorted(songs_data, key=lambda s: s.streams, reverse=True)[:3]\nanswer = [(s.title, round(s.millions, 2)) for s in top]\n',
          given: '# songs is a list of dictionaries. Only __post_init__ needs writing.',
          brief: 'Write `Song.__post_init__`, setting `self.millions = self.streams / 1_000_000`. `Song` never writes its own `__init__` at all — `@dataclass` generates it from the three annotated fields, and `__post_init__` runs right after.',
          reference: py`from dataclasses import dataclass, field

@dataclass
class Song:
    title: str
    artist: str
    streams: int
    millions: float = field(init=False)

    def __post_init__(self):
        self.millions = self.streams / 1_000_000

songs_data = [Song(s["track"], s["artist"], s["spotify_streams"]) for s in songs[:15]]
top = sorted(songs_data, key=lambda s: s.streams, reverse=True)[:3]
answer = [(s.title, round(s.millions, 2)) for s in top]`,
          walkthrough: '`@dataclass` generated `__init__` from the three annotated fields, so `Song(title, artist, streams)` already works exactly as if it had been written by hand, and `__post_init__` fills in the one derived field.',
          traps: [py`from dataclasses import dataclass, field

@dataclass
class Song:
    title: str
    artist: str
    streams: int
    millions: float = field(init=False)

    def __post_init__(self):
        self.millions = self.streams / 1_000

songs_data = [Song(s["track"], s["artist"], s["spotify_streams"]) for s in songs[:15]]
top = sorted(songs_data, key=lambda s: s.streams, reverse=True)[:3]
answer = [(s.title, round(s.millions, 2)) for s in top]`],
        }),
        oop({
          title: 'A computed field with __post_init__',
          use: ['invoices'],
          starter: 'from dataclasses import dataclass, field\n\n@dataclass\nclass InvoiceLine:\n    unit_price: float\n    quantity: int\n    total: float = field(init=False)\n\n    def __post_init__(self):\n        ...\n\nlines = [InvoiceLine(inv["Total"], 1) for inv in invoices[:3]]\nanswer = [round(line.total, 2) for line in lines]\n',
          given: '# invoices is a list of dictionaries with "Total". Only __post_init__ needs writing.',
          brief: 'Write `__post_init__`, setting `self.total = self.unit_price * self.quantity`. `total` is excluded from the generated constructor (`field(init=False)`) because it is always computed.',
          reference: py`from dataclasses import dataclass, field

@dataclass
class InvoiceLine:
    unit_price: float
    quantity: int
    total: float = field(init=False)

    def __post_init__(self):
        self.total = self.unit_price * self.quantity

lines = [InvoiceLine(inv["Total"], 1) for inv in invoices[:3]]
answer = [round(line.total, 2) for line in lines]`,
          walkthrough: '`__post_init__` runs immediately after the generated `__init__`, which is exactly where a field that depends on the others should be computed.',
          traps: [py`from dataclasses import dataclass, field

@dataclass
class InvoiceLine:
    unit_price: float
    quantity: int
    total: float = field(init=False)

    def __post_init__(self):
        self.total = self.unit_price + self.quantity

lines = [InvoiceLine(inv["Total"], 1) for inv in invoices[:3]]
answer = [round(line.total, 2) for line in lines]`],
        }),
        oop({
          title: 'asdict and replace on real rows',
          use: ['customers'],
          starter: 'from dataclasses import dataclass, asdict, replace\n\n@dataclass\nclass Contact:\n    first: str\n    country: str\n\n\ndef relocate(contact, new_country):\n    ...\n\nc = Contact(customers[0]["FirstName"], customers[0]["Country"])\nmoved = relocate(c, "Nowhere")\nanswer = (asdict(c), asdict(moved), c.country)\n',
          given: '# customers is a list of dictionaries. Only relocate needs writing.',
          brief: 'Write `relocate(contact, new_country)` using `replace`, returning a **new** `Contact` with `country` changed, leaving the original untouched.',
          reference: py`from dataclasses import dataclass, asdict, replace

@dataclass
class Contact:
    first: str
    country: str


def relocate(contact, new_country):
    return replace(contact, country=new_country)

c = Contact(customers[0]["FirstName"], customers[0]["Country"])
moved = relocate(c, "Nowhere")
answer = (asdict(c), asdict(moved), c.country)`,
          walkthrough: '`replace` builds a brand-new `Contact` with just `country` changed; `c` itself is never modified, which is why `c.country` still holds the original value.',
          traps: [py`from dataclasses import dataclass, asdict, replace

@dataclass
class Contact:
    first: str
    country: str


def relocate(contact, new_country):
    contact.country = new_country
    return contact

c = Contact(customers[0]["FirstName"], customers[0]["Country"])
moved = relocate(c, "Nowhere")
answer = (asdict(c), asdict(moved), c.country)`],
        }),
      ],
    },
    {
      id: 'py-enum-namedtuple-attrs',
      title: 'Enums, NamedTuple, attrs and pydantic overview',
      blurb: 'Richer enums, NamedTuple next to dataclasses, and attrs/pydantic.',
      kind: 'learn',
      check: [
        {
          q: 'Can an Enum member\'s value be something other than a string or a number?',
          options: ['No, only strings', 'No, only integers', 'Yes, a member\'s value can be any object, such as a tuple', 'No, values are assigned automatically and cannot be chosen'],
          answer: 2,
          why: 'An Enum member\'s value can be any Python object, including a tuple, as long as all values in the enum are distinct.',
        },
        {
          q: 'Which is true of every `NamedTuple`?',
          options: ['It is always mutable', 'It behaves like a tuple: it unpacks and supports indexing, and is always immutable', 'It cannot have type hints', 'It requires a metaclass to define'],
          answer: 1,
          why: 'A `NamedTuple` is a genuine tuple with named fields, so it is immutable and supports tuple operations like unpacking.',
        },
        {
          q: 'What is the main extra feature `pydantic` adds over a plain `@dataclass`?',
          options: [
            'Faster attribute access',
            'Automatic validation and conversion of data based on the type hints themselves',
            'Support for multiple inheritance',
            'It removes the need for `__init__`',
          ],
          answer: 1,
          why: '`pydantic` reads the type hints and validates/converts incoming data automatically, which is why it is popular for data arriving from outside a program.',
        },
        {
          q: 'You see `@attr.s` decorating a class in a codebase you are reading. What does that most likely tell you?',
          options: [
            'The code will not run',
            'It is using the third-party `attrs` library, a flexible relative of `@dataclass` with field validators and converters',
            'It is a typo for `@dataclass`',
            'It only works with abstract classes',
          ],
          answer: 1,
          why: '`attrs` predates and inspired `@dataclass`, and offers similar generated methods plus extra features like validators.',
        },
        {
          q: 'Which is the best default choice for an ordinary, mutable record class with several fields, no special validation needed, and no external dependencies wanted?',
          options: ['`pydantic.BaseModel`', '`attrs`', '`@dataclass`', '`NamedTuple`'],
          answer: 2,
          why: '`@dataclass` is in the standard library, supports mutability, and covers the common case without adding a dependency.',
        },
      ],
    },
]
