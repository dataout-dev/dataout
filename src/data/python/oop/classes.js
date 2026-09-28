import { py, oop } from './common.js'

export const classesAndObjects = {
  id: 'classes-and-objects',
  title: 'Classes and objects',
  intro: 'The core ideas, built slowly and in depth.',
  lessons: [
    {
      id: 'py-identity-type-value',
      title: 'Everything is an object: identity, type and value',
      blurb: 'id(), type(), is versus ==, and names as references.',
      kind: 'learn',
      check: [
        {
          q: 'What does `a is b` check?',
          options: ['Whether `a` and `b` hold equal values', 'Whether `a` and `b` are the exact same object', 'Whether `a` and `b` have the same type only', 'Whether `a` and `b` are both numbers'],
          answer: 1,
          why: '`is` compares identity: are these two names attached to the one same object? `==` compares value.',
        },
        {
          q: 'What does this print?\n\n```python\na = [1, 2]\nb = a\nb.append(3)\nprint(a)\n```',
          options: ['`[1, 2]`', '`[1, 2, 3]`', '`[3]`', 'An error'],
          answer: 1,
          why: '`b = a` makes `b` a second name for the same list. Appending through `b` changes the one object both names point to.',
        },
        {
          q: 'Why should you avoid using `is` to compare two strings for equality?',
          options: [
            '`is` is slower than `==`',
            'Some strings are cached and share identity by accident, so `is` can seem to work and then fail elsewhere',
            'Strings do not support `is`',
            '`is` only works on numbers',
          ],
          answer: 1,
          why: 'Small integers and some strings are cached by the implementation. Relying on that accident is fragile; use `==` for value equality.',
        },
        {
          q: 'Which of these best describes a Python variable?',
          options: ['A labelled box that holds a copy of a value', 'A name attached to an object, which can be reattached to a different object', 'A fixed memory address', 'A type declaration'],
          answer: 1,
          why: 'A name is a reference. Assignment moves the label; it does not copy the object it pointed to.',
        },
        {
          q: 'What does `dir(obj)` do?',
          options: ['Deletes the object', 'Lists the names (attributes and methods) available on the object', 'Returns the object\'s memory address', 'Converts the object to a directory'],
          answer: 1,
          why: '`dir()` is an exploration tool: it lists what you can do with a value, including inherited methods.',
        },
      ],
    },
    {
      id: 'py-class-init',
      title: 'Defining classes: __init__, instances and attributes',
      blurb: 'class syntax, the constructor, instance attributes and lookup order.',
      kind: 'code',
      practice: {
        prompt: 'Write a class `Rectangle` with `width` and `height` set in the constructor, and a method `area()` that returns their product.\n\n`area()` must always use the **current** `width` and `height`, even if they are changed after construction.',
        starter: 'class Rectangle:\n    def __init__(self, width, height):\n        ...\n\n    def area(self):\n        ...\n',
        solution: py`class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height`,
        samples: ['Rectangle(3, 4).area()', 'Rectangle(5, 2).width'],
        cases: [
          ['The area of a rectangle', 'Rectangle(3, 4).area()'],
          ['The width is stored', 'Rectangle(2, 6).width'],
          ['The height is stored', 'Rectangle(2, 6).height'],
          ['A square', 'Rectangle(5, 5).area()'],
          ['Decimals', 'Rectangle(1.5, 2).area()'],
          ['area recomputes after width changes', 'r = Rectangle(1, 10)\nr.width = 4\nr.area()'],
          ['area recomputes after height changes', 'r = Rectangle(4, 1)\nr.height = 10\nr.area()'],
          ['Two instances are independent', 'a = Rectangle(2, 2)\nb = Rectangle(9, 9)\na.width, b.width'],
        ],
        traps: [
          py`class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width + self.height`,
          py`class Rectangle:
    def __init__(self, width, height):
        self.height = width
        self.width = height

    def area(self):
        return self.width * self.height`,
          py`class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self._area = width * height

    def area(self):
        return self._area`,
          py`class Rectangle:
    width = 0
    height = 0

    def __init__(self, width, height):
        Rectangle.width = width
        Rectangle.height = height

    def area(self):
        return self.width * self.height`,
        ],
      },
      real: [
        oop({
          title: 'A Track class from Chinook',
          use: ['tracks'],
          starter: 'class Track:\n    def __init__(self, name, milliseconds, unit_price):\n        ...\n\n    def minutes(self):\n        ...\n\n    def cost_for(self, quantity):\n        ...\n\ntrack = Track(tracks[0]["Name"], tracks[0]["Milliseconds"], tracks[0]["UnitPrice"])\nanswer = (round(track.minutes(), 2), round(track.cost_for(3), 2))\n',
          given: '# tracks is a list of dictionaries. The last line builds a Track from the first row.',
          brief: 'Write `Track(name, milliseconds, unit_price)`. `minutes()` returns the length in minutes (`milliseconds / 60000`). `cost_for(quantity)` returns `unit_price * quantity`. The last line stores both results, rounded to 2 decimals, in `answer`.',
          reference: py`class Track:
    def __init__(self, name, milliseconds, unit_price):
        self.name = name
        self.milliseconds = milliseconds
        self.unit_price = unit_price

    def minutes(self):
        return self.milliseconds / 60000

    def cost_for(self, quantity):
        return self.unit_price * quantity

track = Track(tracks[0]["Name"], tracks[0]["Milliseconds"], tracks[0]["UnitPrice"])
answer = (round(track.minutes(), 2), round(track.cost_for(3), 2))`,
          walkthrough: 'Store the three values on `self` in `__init__`, and compute both results from them in ordinary methods.',
          traps: [py`class Track:
    def __init__(self, name, milliseconds, unit_price):
        self.name = name
        self.milliseconds = milliseconds
        self.unit_price = unit_price

    def minutes(self):
        return self.milliseconds / 1000

    def cost_for(self, quantity):
        return self.unit_price * quantity

track = Track(tracks[0]["Name"], tracks[0]["Milliseconds"], tracks[0]["UnitPrice"])
answer = (round(track.minutes(), 2), round(track.cost_for(3), 2))`, py`class Track:
    def __init__(self, name, milliseconds, unit_price):
        self.name = name
        self.milliseconds = milliseconds
        self.unit_price = unit_price

    def minutes(self):
        return self.milliseconds / 60000

    def cost_for(self, quantity):
        return self.unit_price + quantity

track = Track(tracks[0]["Name"], tracks[0]["Milliseconds"], tracks[0]["UnitPrice"])
answer = (round(track.minutes(), 2), round(track.cost_for(3), 2))`],
        }),
        oop({
          title: 'A Customer class with a display name',
          use: ['customers'],
          starter: 'class Customer:\n    def __init__(self, first, last, country):\n        ...\n\n    def display_name(self):\n        ...\n\ncust = Customer(customers[0]["FirstName"], customers[0]["LastName"], customers[0]["Country"])\nanswer = cust.display_name()\n',
          given: '# customers is a list of dictionaries. The last line builds a Customer from the first row.',
          brief: 'Write `Customer(first, last, country)`, storing all three. `display_name()` returns `"Last, First (Country)"`, for example `"Gaertner, Luis (Brazil)"`.',
          reference: py`class Customer:
    def __init__(self, first, last, country):
        self.first = first
        self.last = last
        self.country = country

    def display_name(self):
        return f"{self.last}, {self.first} ({self.country})"

cust = Customer(customers[0]["FirstName"], customers[0]["LastName"], customers[0]["Country"])
answer = cust.display_name()`,
          walkthrough: 'An f-string in the method reads the instance\'s own attributes through `self` to build the text.',
          traps: [py`class Customer:
    def __init__(self, first, last, country):
        self.first = first
        self.last = last
        self.country = country

    def display_name(self):
        return f"{self.first}, {self.last} ({self.country})"

cust = Customer(customers[0]["FirstName"], customers[0]["LastName"], customers[0]["Country"])
answer = cust.display_name()`, py`class Customer:
    def __init__(self, first, last, country):
        self.first = first
        self.last = last
        self.country = country

    def display_name(self):
        return f"{self.last}, {self.first}"

cust = Customer(customers[0]["FirstName"], customers[0]["LastName"], customers[0]["Country"])
answer = cust.display_name()`],
        }),
        oop({
          title: 'Load rows into objects',
          use: ['genres'],
          starter: 'class Genre:\n    def __init__(self, genre_id, name):\n        ...\n\ngenre_objects = [Genre(g["GenreId"], g["Name"]) for g in genres]\nanswer = (len(genre_objects), genre_objects[0].name, genre_objects[-1].genre_id)\n',
          given: '# genres is a list of dictionaries. The last line turns every row into a Genre.',
          brief: 'Write `Genre(genre_id, name)`, storing both as `genre_id` and `name`. The last line converts every row of `genres` into a `Genre` object and reports how many there are, the first one\'s name, and the last one\'s id.',
          reference: py`class Genre:
    def __init__(self, genre_id, name):
        self.genre_id = genre_id
        self.name = name

genre_objects = [Genre(g["GenreId"], g["Name"]) for g in genres]
answer = (len(genre_objects), genre_objects[0].name, genre_objects[-1].genre_id)`,
          walkthrough: 'One attribute per constructor argument is enough here. A list comprehension builds one object per row.',
          traps: [py`class Genre:
    def __init__(self, genre_id, name):
        self.genre_id = name
        self.name = genre_id

genre_objects = [Genre(g["GenreId"], g["Name"]) for g in genres]
answer = (len(genre_objects), genre_objects[0].name, genre_objects[-1].genre_id)`, py`class Genre:
    def __init__(self, genre_id, name):
        self.genre_id = genre_id
        self.name = name

genre_objects = [Genre(g["GenreId"], g["Name"]) for g in genres[:-1]]
answer = (len(genre_objects), genre_objects[0].name, genre_objects[-1].genre_id)`],
        }),
      ],
    },
    {
      id: 'py-self-class-attrs',
      title: 'Methods and self; instance versus class attributes',
      blurb: 'Shared class attributes, counters, and the mutable-attribute bug.',
      kind: 'code',
      practice: {
        prompt: 'Write a class `Tracked` with a **class attribute** `count` starting at `0`. Every time a `Tracked` instance is created, `Tracked.count` increases by one, shared across every instance.',
        starter: 'class Tracked:\n    count = 0\n\n    def __init__(self):\n        ...\n',
        solution: py`class Tracked:
    count = 0

    def __init__(self):
        Tracked.count += 1`,
        samples: ['Tracked(); Tracked(); Tracked.count'],
        cases: [
          ['Three instances', 'Tracked()\nTracked()\nTracked()\nTracked.count'],
          ['One instance', 'Tracked()\nTracked.count'],
          ['Reading through an instance', 't = Tracked()\nt.count'],
          ['Every instance sees the same total', 'a = Tracked()\nb = Tracked()\na.count == b.count'],
          ['Five instances', '[Tracked() for _ in range(5)]\nTracked.count'],
        ],
        traps: [
          py`class Tracked:
    count = 0

    def __init__(self):
        self.count += 1`,
          py`class Tracked:
    def __init__(self):
        self.count = 1`,
          py`class Tracked:
    count = 0

    def __init__(self):
        pass`,
          py`class Tracked:
    count = 1

    def __init__(self):
        Tracked.count += 1`,
        ],
      },
      real: [
        oop({
          title: 'A shared genre catalogue',
          use: ['genres'],
          starter: 'class Genre:\n    catalogue = {}\n\n    def __init__(self, genre_id, name):\n        ...\n\nfor g in genres:\n    Genre(g["GenreId"], g["Name"])\nanswer = (len(Genre.catalogue), Genre.catalogue.get(1))\n',
          given: '# genres is a list of dictionaries. The loop below builds one Genre per row.',
          brief: 'Write `Genre(genre_id, name)`. Every time one is created, it must **register itself** in the shared class dictionary `catalogue`, mapping `genre_id` to `name`. Store the number of registered genres and the name for id `1` in `answer`.',
          reference: py`class Genre:
    catalogue = {}

    def __init__(self, genre_id, name):
        self.genre_id = genre_id
        self.name = name
        Genre.catalogue[genre_id] = name

for g in genres:
    Genre(g["GenreId"], g["Name"])
answer = (len(Genre.catalogue), Genre.catalogue.get(1))`,
          walkthrough: 'The dictionary is a class attribute, shared by every instance. Writing into it through the class name (`Genre.catalogue[...] = ...`) updates the one shared dictionary, unlike `self.catalogue = ...` which would create a separate instance attribute.',
          traps: [py`class Genre:
    catalogue = {}

    def __init__(self, genre_id, name):
        self.genre_id = genre_id
        self.name = name
        self.catalogue = {genre_id: name}

for g in genres:
    Genre(g["GenreId"], g["Name"])
answer = (len(Genre.catalogue), Genre.catalogue.get(1))`, py`class Genre:
    catalogue = {}

    def __init__(self, genre_id, name):
        self.genre_id = genre_id
        self.name = name

for g in genres:
    Genre(g["GenreId"], g["Name"])
answer = (len(Genre.catalogue), Genre.catalogue.get(1))`],
        }),
        oop({
          title: 'A running total shared by every invoice',
          use: ['invoices'],
          starter: 'class InvoiceView:\n    grand_total = 0.0\n\n    def __init__(self, total):\n        ...\n\nfor inv in invoices:\n    InvoiceView(inv["Total"])\nanswer = round(InvoiceView.grand_total, 2)\n',
          given: '# invoices is a list of dictionaries. The loop below builds one InvoiceView per row.',
          brief: 'Write `InvoiceView(total)`. Each new instance must **add** its `total` to the shared class attribute `grand_total`. Store the final grand total, rounded to 2 decimals, in `answer`.',
          reference: py`class InvoiceView:
    grand_total = 0.0

    def __init__(self, total):
        self.total = total
        InvoiceView.grand_total += total

for inv in invoices:
    InvoiceView(inv["Total"])
answer = round(InvoiceView.grand_total, 2)`,
          walkthrough: 'Because the update must accumulate across every instance, it has to go through the class name, not `self`. `self.grand_total += total` would silently start a fresh, per-instance copy at 0 each time.',
          traps: [py`class InvoiceView:
    grand_total = 0.0

    def __init__(self, total):
        self.total = total
        self.grand_total += total

for inv in invoices:
    InvoiceView(inv["Total"])
answer = round(InvoiceView.grand_total, 2)`, py`class InvoiceView:
    grand_total = 0.0

    def __init__(self, total):
        self.total = total

for inv in invoices:
    InvoiceView(inv["Total"])
answer = round(InvoiceView.grand_total, 2)`],
        }),
        oop({
          title: 'Fixing a shared mutable list',
          use: ['artists'],
          starter: 'class Roster:\n    def __init__(self):\n        ...\n\n    def add(self, name):\n        self.names.append(name)\n\na = Roster()\nb = Roster()\na.add(artists[0]["Name"])\nanswer = (a.names, b.names)\n',
          given: '# artists is a list of dictionaries. The last lines create two separate rosters.',
          brief: 'Finish `Roster.__init__` so that **each instance gets its own empty `names` list**. As written, adding a name to `a` must never appear in `b`.',
          reference: py`class Roster:
    def __init__(self):
        self.names = []

    def add(self, name):
        self.names.append(name)

a = Roster()
b = Roster()
a.add(artists[0]["Name"])
answer = (a.names, b.names)`,
          walkthrough: 'A fresh list created inside `__init__` and assigned to `self.names` belongs to that one instance alone, unlike a list written directly in the class body.',
          traps: [py`class Roster:
    names = []

    def __init__(self):
        pass

    def add(self, name):
        self.names.append(name)

a = Roster()
b = Roster()
a.add(artists[0]["Name"])
answer = (a.names, b.names)`],
        }),
      ],
    },
    {
      id: 'py-classmethod-staticmethod',
      title: 'classmethod, staticmethod and alternative constructors',
      blurb: '@classmethod and cls, @staticmethod, and named constructors.',
      kind: 'code',
      practice: {
        prompt: 'Write a class `Player` with `name` and `score`. Add a **classmethod** `from_string(text)` that parses text of the form `"name:score"` (score is an integer) and returns a new `Player`.',
        starter: 'class Player:\n    def __init__(self, name, score):\n        ...\n\n    @classmethod\n    def from_string(cls, text):\n        ...\n',
        solution: py`class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    @classmethod
    def from_string(cls, text):
        name, score = text.split(":")
        return cls(name, int(score))`,
        samples: ['(Player.from_string("Ada:95").name, Player.from_string("Ada:95").score)'],
        cases: [
          ['Parsing a normal entry', '(Player.from_string("Ada:95").name, Player.from_string("Ada:95").score)'],
          ['The score becomes an integer', 'type(Player.from_string("Ada:95").score).__name__'],
          ['A different name and score', '(Player.from_string("Grace:100").name, Player.from_string("Grace:100").score)'],
          ['A score of zero', 'Player.from_string("Bo:0").score'],
          ['Called on the class, not an instance', 'callable(getattr(Player, "from_string"))'],
          ['Works through a subclass', 'class VIP(Player):\n    pass\ntype(VIP.from_string("Zoe:1")).__name__'],
        ],
        traps: [
          py`class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    @classmethod
    def from_string(cls, text):
        name, score = text.split(":")
        return cls(score, name)`,
          py`class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    @classmethod
    def from_string(cls, text):
        name, score = text.split(":")
        return cls(name, score)`,
          py`class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    @staticmethod
    def from_string(text):
        name, score = text.split(":")
        return Player(name, int(score))

_dummy = Player.from_string`,
        ],
      },
      real: [
        oop({
          title: 'Song.from_row',
          use: ['songs'],
          starter: 'class Song:\n    def __init__(self, title, artist, streams):\n        ...\n\n    @classmethod\n    def from_row(cls, row):\n        ...\n\nsong = Song.from_row(songs[0])\nanswer = (song.title, song.artist)\n',
          given: '# songs is a list of dictionaries with keys "track", "artist" and "spotify_streams".',
          brief: 'Write `Song(title, artist, streams)`. Add a classmethod `from_row(row)` that builds a `Song` from a dictionary with keys `"track"`, `"artist"` and `"spotify_streams"`. Use `cls(...)`, not the class name directly. Store the title, artist and streams of the first song in `answer`.',
          reference: py`class Song:
    def __init__(self, title, artist, streams):
        self.title = title
        self.artist = artist
        self.streams = streams

    @classmethod
    def from_row(cls, row):
        return cls(row["track"], row["artist"], row["spotify_streams"])

song = Song.from_row(songs[0])
answer = (song.title, song.artist, song.streams)`,
          walkthrough: 'The classmethod reads the three fields out of the dictionary and passes them, in the right order, to the ordinary constructor.',
          traps: [py`class Song:
    def __init__(self, title, artist, streams):
        self.title = title
        self.artist = artist
        self.streams = streams

    @classmethod
    def from_row(cls, row):
        return cls(row["artist"], row["track"], row["spotify_streams"])

song = Song.from_row(songs[0])
answer = (song.title, song.artist, song.streams)`, py`class Song:
    def __init__(self, title, artist, streams):
        self.title = title
        self.artist = artist
        self.streams = streams

    @classmethod
    def from_row(cls, row):
        return cls(row["track"], row["artist"], 0)

song = Song.from_row(songs[0])
answer = (song.title, song.artist, song.streams)`],
        }),
        oop({
          title: 'Invoice.from_dict and subclassing',
          use: ['invoices'],
          starter: 'class Invoice:\n    def __init__(self, invoice_id, total):\n        ...\n\n    @classmethod\n    def from_dict(cls, data):\n        ...\n\nclass PaidInvoice(Invoice):\n    pass\n\nregular = Invoice.from_dict(invoices[0])\npaid = PaidInvoice.from_dict(invoices[0])\nanswer = (type(regular).__name__, type(paid).__name__, paid.total)\n',
          given: '# invoices is a list of dictionaries with "InvoiceId" and "Total". PaidInvoice is a subclass with nothing added.',
          brief: 'Write `Invoice(invoice_id, total)` and a classmethod `from_dict(data)` built with `cls(...)`, using the keys `"InvoiceId"` and `"Total"`. Store the type names produced by calling `from_dict` on `Invoice` and on `PaidInvoice`, plus the total, in `answer`.',
          reference: py`class Invoice:
    def __init__(self, invoice_id, total):
        self.invoice_id = invoice_id
        self.total = total

    @classmethod
    def from_dict(cls, data):
        return cls(data["InvoiceId"], data["Total"])

class PaidInvoice(Invoice):
    pass

regular = Invoice.from_dict(invoices[0])
paid = PaidInvoice.from_dict(invoices[0])
answer = (type(regular).__name__, type(paid).__name__, paid.total)`,
          walkthrough: 'Because the classmethod builds with `cls(...)`, calling it on `PaidInvoice` produces a `PaidInvoice`, not a plain `Invoice`. Building with `Invoice(...)` directly would have given the wrong type both times.',
          traps: [py`class Invoice:
    def __init__(self, invoice_id, total):
        self.invoice_id = invoice_id
        self.total = total

    @classmethod
    def from_dict(cls, data):
        return Invoice(data["InvoiceId"], data["Total"])

class PaidInvoice(Invoice):
    pass

regular = Invoice.from_dict(invoices[0])
paid = PaidInvoice.from_dict(invoices[0])
answer = (type(regular).__name__, type(paid).__name__, paid.total)`],
        }),
        oop({
          title: 'A static validity check',
          use: ['customers'],
          starter: 'class Contact:\n    def __init__(self, email):\n        ...\n\n    @staticmethod\n    def looks_valid(email):\n        ...\n\nanswer = [Contact.looks_valid(c["Email"]) for c in customers[:5]] + [Contact.looks_valid(p) for p in ["not-an-email", "@x.com", "user@nodot", "a@b@c"]]\n',
          given: '# customers is a list of dictionaries with an "Email" key.',
          brief: 'Write `Contact(email)`, and a **staticmethod** `looks_valid(email)` that returns `True` when the text contains exactly one `"@"` with at least one character before it and a `"."` somewhere after it. Store the nine results (five real e-mails, then four bad ones) in `answer`.',
          reference: py`class Contact:
    def __init__(self, email):
        self.email = email

    @staticmethod
    def looks_valid(email):
        if email.count("@") != 1:
            return False
        local, domain = email.split("@")
        return len(local) > 0 and "." in domain

answer = [Contact.looks_valid(c["Email"]) for c in customers[:5]] + [Contact.looks_valid(p) for p in ["not-an-email", "@x.com", "user@nodot", "a@b@c"]]`,
          walkthrough: 'A staticmethod needs no `self` or `cls`, because the check does not depend on any particular `Contact` instance. It is grouped with the class purely because it is about the same idea: e-mails.',
          traps: [py`class Contact:
    def __init__(self, email):
        self.email = email

    @staticmethod
    def looks_valid(email):
        return "@" in email

answer = [Contact.looks_valid(c["Email"]) for c in customers[:5]] + [Contact.looks_valid(p) for p in ["not-an-email", "@x.com", "user@nodot", "a@b@c"]]`],
        }),
      ],
    },
    {
      id: 'py-encapsulation-properties',
      title: 'Encapsulation and properties',
      blurb: '_protected names, @property, validated setters and computed values.',
      kind: 'code',
      practice: {
        prompt: 'Write a class `Temperature` with a **validated property** `celsius`: setting it to a value below `-273.15` raises a `ValueError`. Add a **read-only, computed property** `fahrenheit` (`celsius * 9 / 5 + 32`).\n\nThe constructor must accept `celsius` and go through the same validation.',
        starter: 'class Temperature:\n    def __init__(self, celsius):\n        ...\n\n    @property\n    def celsius(self):\n        ...\n\n    @celsius.setter\n    def celsius(self, value):\n        ...\n\n    @property\n    def fahrenheit(self):\n        ...\n',
        solution: py`class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32`,
        samples: ['Temperature(0).fahrenheit', 'Temperature(100).fahrenheit'],
        cases: [
          ['Freezing point', 'Temperature(0).fahrenheit'],
          ['Boiling point', 'Temperature(100).fahrenheit'],
          ['Reading celsius back', 'Temperature(37).celsius'],
          ['Raises when too cold', 'Temperature(-300)'],
          ['Raises on assignment too', 't = Temperature(0)\nt.celsius = -1000'],
          ['A valid change updates fahrenheit', 't = Temperature(0)\nt.celsius = 100\nt.fahrenheit'],
          ['Exactly absolute zero is allowed', 'Temperature(-273.15).celsius'],
          ['Raises: fahrenheit cannot be set', 't = Temperature(0)\nt.fahrenheit = 999'],
        ],
        traps: [
          py`class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32`,
          py`class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32`,
          py`class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius + 32`,
        ],
      },
      real: [
        oop({
          title: 'A validated invoice line',
          use: ['tracks'],
          starter: 'class LineItem:\n    def __init__(self, name, quantity):\n        ...\n\n    @property\n    def quantity(self):\n        ...\n\n    @quantity.setter\n    def quantity(self, value):\n        ...\n\nitem = LineItem(tracks[0]["Name"], 3)\nanswer = []\ntry:\n    item.quantity = -1\nexcept ValueError as e:\n    answer.append(str(e))\nanswer.append(item.quantity)\n',
          given: '# tracks is a list of dictionaries. The last lines try an invalid assignment, then read the quantity back.',
          brief: 'Write `LineItem(name, quantity)` with a `quantity` **property** that rejects any value **at or below zero** with `ValueError("quantity must be positive")`. A rejected assignment must leave the **previous, valid** quantity in place. Store the error message and the final quantity in `answer`.',
          reference: py`class LineItem:
    def __init__(self, name, quantity):
        self.name = name
        self.quantity = quantity

    @property
    def quantity(self):
        return self._quantity

    @quantity.setter
    def quantity(self, value):
        if value <= 0:
            raise ValueError("quantity must be positive")
        self._quantity = value

item = LineItem(tracks[0]["Name"], 3)
answer = []
try:
    item.quantity = -1
except ValueError as e:
    answer.append(str(e))
answer.append(item.quantity)`,
          walkthrough: 'Because the setter raises **before** touching `self._quantity`, a rejected assignment leaves the old value untouched: the line item stays valid at all times.',
          traps: [py`class LineItem:
    def __init__(self, name, quantity):
        self.name = name
        self.quantity = quantity

    @property
    def quantity(self):
        return self._quantity

    @quantity.setter
    def quantity(self, value):
        self._quantity = value
        if value <= 0:
            raise ValueError("quantity must be positive")

item = LineItem(tracks[0]["Name"], 3)
answer = []
try:
    item.quantity = -1
except ValueError as e:
    answer.append(str(e))
answer.append(item.quantity)`],
        }),
        oop({
          title: 'A capped playlist length',
          use: ['tracks'],
          starter: 'class Playlist:\n    def __init__(self, capacity):\n        ...\n\n    @property\n    def remaining(self):\n        ...\n\n    def add(self, name):\n        ...\n\npl = Playlist(2)\npl.add(tracks[0]["Name"])\nanswer = [pl.remaining]\ntry:\n    pl.add(tracks[1]["Name"])\n    pl.add(tracks[2]["Name"])\nexcept ValueError as e:\n    answer.append(str(e))\nanswer.append(pl.remaining)\n',
          given: '# tracks is a list of dictionaries. The last lines fill the playlist past its capacity.',
          brief: 'Write `Playlist(capacity)` with a list of names, and a **read-only property** `remaining` (`capacity - len(names)`). `add(name)` appends the name, but raises `ValueError("playlist is full")` when there is no room left, **without** adding it.',
          reference: py`class Playlist:
    def __init__(self, capacity):
        self.capacity = capacity
        self.names = []

    @property
    def remaining(self):
        return self.capacity - len(self.names)

    def add(self, name):
        if self.remaining <= 0:
            raise ValueError("playlist is full")
        self.names.append(name)

pl = Playlist(2)
pl.add(tracks[0]["Name"])
answer = [pl.remaining]
try:
    pl.add(tracks[1]["Name"])
    pl.add(tracks[2]["Name"])
except ValueError as e:
    answer.append(str(e))
answer.append(pl.remaining)`,
          walkthrough: 'Checking `remaining` before appending stops the list from ever growing past capacity, and the property always reflects the true, current count because it recomputes from `names` every time.',
          traps: [py`class Playlist:
    def __init__(self, capacity):
        self.capacity = capacity
        self.names = []

    @property
    def remaining(self):
        return self.capacity - len(self.names)

    def add(self, name):
        self.names.append(name)
        if self.remaining < 0:
            raise ValueError("playlist is full")

pl = Playlist(2)
pl.add(tracks[0]["Name"])
answer = [pl.remaining]
try:
    pl.add(tracks[1]["Name"])
    pl.add(tracks[2]["Name"])
except ValueError as e:
    answer.append(str(e))
answer.append(pl.remaining)`],
        }),
        oop({
          title: 'A protected employee salary',
          use: ['employees'],
          starter: 'class Employee:\n    def __init__(self, title, salary):\n        ...\n\n    @property\n    def salary(self):\n        ...\n\n    @salary.setter\n    def salary(self, value):\n        ...\n\ne = Employee(employees[0]["Title"], 50000)\ne.salary = 55000\nanswer = [e.salary]\ntry:\n    e.salary = 40000\nexcept ValueError as err:\n    answer.append(str(err))\n',
          given: '# employees is a list of dictionaries. The last lines give a raise, then attempt a pay cut.',
          brief: 'Write `Employee(title, salary)` with a `salary` property that **rejects any decrease** (the new value must be greater than or equal to the current one), raising `ValueError("salary cannot decrease")`. Store the salary after the raise, then the error message from the rejected cut, in `answer`.',
          reference: py`class Employee:
    def __init__(self, title, salary):
        self.title = title
        self._salary = salary

    @property
    def salary(self):
        return self._salary

    @salary.setter
    def salary(self, value):
        if value < self._salary:
            raise ValueError("salary cannot decrease")
        self._salary = value

e = Employee(employees[0]["Title"], 50000)
e.salary = 55000
answer = [e.salary]
try:
    e.salary = 40000
except ValueError as err:
    answer.append(str(err))`,
          walkthrough: 'The check compares the proposed `value` against the **current** `self._salary` before overwriting it, so a pay cut is refused and the old salary survives.',
          traps: [py`class Employee:
    def __init__(self, title, salary):
        self.title = title
        self._salary = salary

    @property
    def salary(self):
        return self._salary

    @salary.setter
    def salary(self, value):
        self._salary = value
        if value < self._salary:
            raise ValueError("salary cannot decrease")

e = Employee(employees[0]["Title"], 50000)
e.salary = 55000
answer = [e.salary]
try:
    e.salary = 40000
except ValueError as err:
    answer.append(str(err))`],
        }),
      ],
    },
    {
      id: 'py-repr-str-format',
      title: 'String representation: __repr__, __str__ and __format__',
      blurb: 'repr for developers, str for users, and the format protocol.',
      kind: 'code',
      practice: {
        prompt: 'Write a class `Money` that stores an amount in **cents** (an integer). Give it:\n\n- `__repr__` returning `"Money(<cents>)"`, for example `"Money(1250)"`\n- `__str__` returning a dollar amount with 2 decimals, for example `"$12.50"`',
        starter: 'class Money:\n    def __init__(self, cents):\n        ...\n\n    def __repr__(self):\n        ...\n\n    def __str__(self):\n        ...\n',
        solution: py`class Money:
    def __init__(self, cents):
        self.cents = cents

    def __repr__(self):
        return f"Money({self.cents!r})"

    def __str__(self):
        return "$" + f"{self.cents / 100:.2f}"`,
        samples: ['str(Money(1250))', 'repr(Money(1250))'],
        cases: [
          ['str of a normal amount', 'str(Money(1250))'],
          ['repr of a normal amount', 'repr(Money(1250))'],
          ['A round amount', 'str(Money(500))'],
          ['A single cent', 'str(Money(1))'],
          ['Zero', 'str(Money(0))'],
          ['print uses str', 'import io, contextlib\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    print(Money(999))\nbuf.getvalue().strip()'],
          ['A list shows repr for its items', 'str([Money(100)])'],
        ],
        traps: [
          py`class Money:
    def __init__(self, cents):
        self.cents = cents

    def __repr__(self):
        return "$" + f"{self.cents / 100:.2f}"

    def __str__(self):
        return f"Money({self.cents!r})"`,
          py`class Money:
    def __init__(self, cents):
        self.cents = cents

    def __repr__(self):
        return f"Money({self.cents!r})"

    def __str__(self):
        return "$" + f"{self.cents:.2f}"`,
          py`class Money:
    def __init__(self, cents):
        self.cents = cents

    def __repr__(self):
        return "Money"

    def __str__(self):
        return "$" + f"{self.cents / 100:.2f}"`,
        ],
      },
      real: [
        oop({
          title: 'A readable Track',
          use: ['tracks'],
          starter: 'class Track:\n    def __init__(self, name, milliseconds):\n        ...\n\n    def __repr__(self):\n        ...\n\n    def __str__(self):\n        ...\n\nt = Track(tracks[0]["Name"], tracks[0]["Milliseconds"])\nanswer = (repr(t), str(t))\n',
          given: '# tracks is a list of dictionaries with "Name" and "Milliseconds".',
          brief: 'Write `Track(name, milliseconds)`. `__repr__` returns `"Track(<name!r>, <milliseconds>)"` (using `!r` on the name). `__str__` returns `"<name> (<minutes>:<seconds>)"` with seconds zero-padded to two digits, for example `"Balls to the Wall (5:02)"`.',
          reference: py`class Track:
    def __init__(self, name, milliseconds):
        self.name = name
        self.milliseconds = milliseconds

    def __repr__(self):
        return f"Track({self.name!r}, {self.milliseconds})"

    def __str__(self):
        minutes, seconds = divmod(self.milliseconds // 1000, 60)
        return f"{self.name} ({minutes}:{seconds:02d})"

t = Track(tracks[0]["Name"], tracks[0]["Milliseconds"])
short = Track("Short", 65005)
answer = (repr(t), str(t), str(short))`,
          walkthrough: 'The `!r` in the f-string calls `repr()` on the name so its quotes show, matching the convention that a repr looks like the code to rebuild the object. The made-up `short` track has only 5 seconds left over, which is where a missing zero-pad would show.',
          traps: [py`class Track:
    def __init__(self, name, milliseconds):
        self.name = name
        self.milliseconds = milliseconds

    def __repr__(self):
        return f"Track({self.name}, {self.milliseconds})"

    def __str__(self):
        minutes, seconds = divmod(self.milliseconds // 1000, 60)
        return f"{self.name} ({minutes}:{seconds:02d})"

t = Track(tracks[0]["Name"], tracks[0]["Milliseconds"])
short = Track("Short", 65005)
answer = (repr(t), str(t), str(short))`, py`class Track:
    def __init__(self, name, milliseconds):
        self.name = name
        self.milliseconds = milliseconds

    def __repr__(self):
        return f"Track({self.name!r}, {self.milliseconds})"

    def __str__(self):
        minutes, seconds = divmod(self.milliseconds // 1000, 60)
        return f"{self.name} ({minutes}:{seconds})"

t = Track(tracks[0]["Name"], tracks[0]["Milliseconds"])
short = Track("Short", 65005)
answer = (repr(t), str(t), str(short))`],
        }),
        oop({
          title: 'Formatting a Streams count',
          use: ['songs'],
          starter: 'class Streams:\n    def __init__(self, count):\n        ...\n\n    def __format__(self, spec):\n        ...\n\ns = Streams(songs[0]["spotify_streams"])\nanswer = (f"{s}", f"{s:,}")\n',
          given: '# songs is a list of dictionaries with "spotify_streams".',
          brief: 'Write `Streams(count)`. Its `__format__(spec)` returns `f"{count} streams"` when `spec` is **empty**, and otherwise passes `spec` straight to `format(count, spec)` (so `f"{s:,}"` uses thousands separators on the raw number).',
          reference: py`class Streams:
    def __init__(self, count):
        self.count = count

    def __format__(self, spec):
        if spec == "":
            return f"{self.count} streams"
        return format(self.count, spec)

s = Streams(songs[0]["spotify_streams"])
answer = (f"{s}", f"{s:,}")`,
          walkthrough: 'An empty `spec` means the plain `{s}` case, which gets the custom, friendly text. Any other spec is delegated to the built-in `format` on the underlying number.',
          traps: [py`class Streams:
    def __init__(self, count):
        self.count = count

    def __format__(self, spec):
        return f"{self.count} streams"

s = Streams(songs[0]["spotify_streams"])
answer = (f"{s}", f"{s:,}")`],
        }),
        oop({
          title: 'A safe repr that never raises',
          use: ['customers'],
          starter: 'class Contact:\n    def __init__(self, name, email=None):\n        ...\n\n    def __repr__(self):\n        ...\n\nc1 = Contact(customers[0]["FirstName"], customers[0]["Email"])\nc2 = Contact(customers[1]["FirstName"])\nanswer = (repr(c1), repr(c2))\n',
          given: '# customers is a list of dictionaries. c2 is built with no email at all.',
          brief: 'Write `Contact(name, email=None)`. `__repr__` must **never raise**, even when `email` is `None`: return `"Contact(<name!r>, <email!r>)"` in both cases, using `!r` for both parts.',
          reference: py`class Contact:
    def __init__(self, name, email=None):
        self.name = name
        self.email = email

    def __repr__(self):
        return f"Contact({self.name!r}, {self.email!r})"

c1 = Contact(customers[0]["FirstName"], customers[0]["Email"])
c2 = Contact(customers[1]["FirstName"])
answer = (repr(c1), repr(c2))`,
          walkthrough: '`!r` works uniformly on any value, including `None`, so the repr never needs a special case and can never raise because of a missing e-mail.',
          traps: [py`class Contact:
    def __init__(self, name, email=None):
        self.name = name
        self.email = email

    def __repr__(self):
        return f"Contact({self.name!r}, {self.email.upper()!r})"

c1 = Contact(customers[0]["FirstName"], customers[0]["Email"])
c2 = Contact(customers[1]["FirstName"])
answer = (repr(c1), repr(c2))`],
        }),
      ],
    },
    {
      id: 'py-object-lifecycle',
      title: 'Object lifecycle: __new__, __del__, references and garbage collection',
      blurb: 'Creation, reference counting, cycles and why not to rely on __del__.',
      kind: 'learn',
      check: [
        {
          q: 'What is the relationship between `__new__` and `__init__`?',
          options: [
            'They are the same thing under two names',
            '`__new__` creates the (empty) instance; `__init__` then initialises it',
            '`__init__` creates the instance; `__new__` initialises it',
            '`__new__` is only used for exceptions',
          ],
          answer: 1,
          why: 'Calling `SomeClass(...)` first calls `__new__` to build the raw object, then calls `__init__` on it. Most classes only need to override `__init__`.',
        },
        {
          q: 'In CPython, when is an object\'s memory normally reclaimed?',
          options: [
            'Only when the program ends',
            'As soon as its reference count drops to zero',
            'Every 60 seconds, on a timer',
            'Never, unless you call `del` on every name',
          ],
          answer: 1,
          why: 'CPython uses reference counting: once nothing refers to an object any more, it is freed immediately.',
        },
        {
          q: 'Why does Python need a separate cyclic garbage collector, on top of reference counting?',
          options: [
            'To make the language slower on purpose',
            'Because two objects that reference each other can keep each other\'s count above zero even when nothing else can reach them',
            'It does not; reference counting is always enough',
            'Only for very large programs',
          ],
          answer: 1,
          why: 'A reference cycle keeps counts positive forever under plain reference counting. The cyclic collector finds and frees such unreachable cycles.',
        },
        {
          q: 'Why is `__del__` unreliable as your main way to release a resource like a file or a network connection?',
          options: [
            '`__del__` methods are not allowed in Python',
            'Its timing is not guaranteed, and exceptions inside it are not propagated normally',
            'It can only be used once per program',
            'It runs before `__init__`',
          ],
          answer: 1,
          why: 'An object caught in a cycle may be finalised late (or not before the program exits), and errors inside `__del__` are easy to miss. Explicit cleanup, such as a context manager, is far more predictable.',
        },
        {
          q: 'What does a `weakref` to an object do?',
          options: [
            'It makes the object immutable',
            'It refers to the object without increasing its reference count, so it does not by itself keep the object alive',
            'It is a stronger reference than a normal variable',
            'It automatically deletes the object',
          ],
          answer: 1,
          why: 'A weak reference lets you check on an object, useful for caches, without preventing it from being freed once nothing else needs it.',
        },
      ],
    },
    {
      id: 'py-class-design-workshop',
      title: 'Class design workshop: modelling a domain',
      blurb: 'From a description to attributes, methods and invariants.',
      kind: 'code',
      practice: {
        prompt: 'Implement `BankAccount(owner, balance=0)`.\n\n- The opening `balance` must not be negative (`ValueError("opening balance cannot be negative")`).\n- `deposit(amount)`: `amount` must be positive (`ValueError("deposit must be positive")`); increases `balance` and appends `("deposit", amount)` to `history`.\n- `withdraw(amount)`: `amount` must be positive (`ValueError("withdrawal must be positive")`); must not exceed the balance (`ValueError("insufficient funds")`); decreases `balance` and appends `("withdraw", amount)` to `history`.\n- `history` starts empty, and is a plain list you may read directly for this exercise.',
        starter: 'class BankAccount:\n    def __init__(self, owner, balance=0):\n        ...\n\n    def deposit(self, amount):\n        ...\n\n    def withdraw(self, amount):\n        ...\n',
        solution: py`class BankAccount:
    def __init__(self, owner, balance=0):
        if balance < 0:
            raise ValueError("opening balance cannot be negative")
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self.balance += amount
        self.history.append(("deposit", amount))

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("withdrawal must be positive")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        self.history.append(("withdraw", amount))`,
        samples: ['a = BankAccount("Ada", 100)\na.deposit(50)\na.withdraw(30)\na.balance'],
        cases: [
          ['A simple deposit and withdrawal', 'a = BankAccount("Ada", 100)\na.deposit(50)\na.withdraw(30)\na.balance'],
          ['The history is recorded in order', 'a = BankAccount("Ada", 100)\na.deposit(50)\na.withdraw(30)\na.history'],
          ['Starting at zero', 'BankAccount("Grace").balance'],
          ['Raises: a negative opening balance', 'BankAccount("Ada", -5)'],
          ['Raises: withdrawing more than the balance', 'BankAccount("Ada", 10).withdraw(20)'],
          ['Raises: a negative deposit', 'BankAccount("Ada", 10).deposit(-5)'],
          ['Raises: a negative withdrawal', 'BankAccount("Ada", 10).withdraw(-5)'],
          ['Withdrawing exactly the balance is allowed', 'a = BankAccount("Ada", 10)\na.withdraw(10)\na.balance'],
          ['Two accounts do not share history', 'a = BankAccount("Ada", 0)\nb = BankAccount("Bo", 0)\na.deposit(10)\nb.history'],
        ],
        traps: [
          py`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, amount):
        self.balance += amount
        self.history.append(("deposit", amount))

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        self.history.append(("withdraw", amount))`,
          py`class BankAccount:
    history = []

    def __init__(self, owner, balance=0):
        if balance < 0:
            raise ValueError("opening balance cannot be negative")
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self.balance += amount
        self.history.append(("deposit", amount))

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("withdrawal must be positive")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        self.history.append(("withdraw", amount))`,
          py`class BankAccount:
    def __init__(self, owner, balance=0):
        if balance < 0:
            raise ValueError("opening balance cannot be negative")
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self.balance += amount
        self.history.append(("deposit", amount))

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("withdrawal must be positive")
        if amount >= self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        self.history.append(("withdraw", amount))`,
        ],
      },
      real: [
        oop({
          title: 'An inventory with no negative stock',
          use: ['tracks'],
          starter: 'class Inventory:\n    def __init__(self):\n        ...\n\n    def restock(self, name, qty):\n        ...\n\n    def sell(self, name, qty):\n        ...\n\ninv = Inventory()\ninv.restock(tracks[0]["Name"], 5)\nanswer = []\ninv.sell(tracks[0]["Name"], 2)\nanswer.append(inv.stock[tracks[0]["Name"]])\ntry:\n    inv.sell(tracks[0]["Name"], 100)\nexcept ValueError as e:\n    answer.append(str(e))\nanswer.append(inv.stock[tracks[0]["Name"]])\n',
          given: '# tracks is a list of dictionaries. The last lines restock, sell, then try to oversell.',
          brief: 'Write `Inventory()` with a `stock` dictionary (name to quantity). `restock(name, qty)` adds `qty` (creating the entry if new). `sell(name, qty)` raises `ValueError("not enough stock")` if `qty` exceeds the current stock (or the item is unknown), otherwise reduces it. A failed sale must leave the stock **unchanged**. Store the stock after a valid sale, the error message of the failed one, and the stock once more (to check it was not corrupted), in `answer`.',
          reference: py`class Inventory:
    def __init__(self):
        self.stock = {}

    def restock(self, name, qty):
        self.stock[name] = self.stock.get(name, 0) + qty

    def sell(self, name, qty):
        if self.stock.get(name, 0) < qty:
            raise ValueError("not enough stock")
        self.stock[name] -= qty

inv = Inventory()
inv.restock(tracks[0]["Name"], 5)
answer = []
inv.sell(tracks[0]["Name"], 2)
answer.append(inv.stock[tracks[0]["Name"]])
try:
    inv.sell(tracks[0]["Name"], 100)
except ValueError as e:
    answer.append(str(e))
answer.append(inv.stock[tracks[0]["Name"]])`,
          walkthrough: 'Checking `self.stock.get(name, 0) < qty` before subtracting protects the invariant "stock never negative" in one place, and also handles an unknown name for free (`get` gives `0`).',
          traps: [py`class Inventory:
    def __init__(self):
        self.stock = {}

    def restock(self, name, qty):
        self.stock[name] = self.stock.get(name, 0) + qty

    def sell(self, name, qty):
        self.stock[name] = self.stock.get(name, 0) - qty
        if self.stock[name] < 0:
            raise ValueError("not enough stock")

inv = Inventory()
inv.restock(tracks[0]["Name"], 5)
answer = []
inv.sell(tracks[0]["Name"], 2)
answer.append(inv.stock[tracks[0]["Name"]])
try:
    inv.sell(tracks[0]["Name"], 100)
except ValueError as e:
    answer.append(str(e))
answer.append(inv.stock[tracks[0]["Name"]])`],
        }),
        oop({
          title: 'A history you cannot corrupt from outside',
          use: ['tracks'],
          starter: 'class Cart:\n    def __init__(self):\n        ...\n\n    def add(self, name):\n        ...\n\n    @property\n    def items(self):\n        ...\n\ncart = Cart()\ncart.add(tracks[0]["Name"])\nleaked = cart.items\nleaked.append("HACKED")\nanswer = cart.items\n',
          given: '# tracks is a list of dictionaries. The last lines try to corrupt the cart through the returned list.',
          brief: 'Write `Cart()` with an internal list of added names, and a **read-only property** `items` that returns a **copy**, so that changing the returned list never affects the cart itself.',
          reference: py`class Cart:
    def __init__(self):
        self._items = []

    def add(self, name):
        self._items.append(name)

    @property
    def items(self):
        return list(self._items)

cart = Cart()
cart.add(tracks[0]["Name"])
leaked = cart.items
leaked.append("HACKED")
answer = cart.items`,
          walkthrough: '`list(self._items)` builds a new list each time `items` is read, so the caller can never reach the cart\'s real, internal list.',
          traps: [py`class Cart:
    def __init__(self):
        self.items = []

    def add(self, name):
        self.items.append(name)

cart = Cart()
cart.add(tracks[0]["Name"])
leaked = cart.items
leaked.append("HACKED")
answer = cart.items`],
        }),
        oop({
          title: 'A focused class, not a god class',
          use: ['invoices'],
          starter: 'class Invoice:\n    def __init__(self, invoice_id, total):\n        ...\n\n    def apply_discount(self, percent):\n        ...\n\ndef format_invoice(invoice):\n    return f"#{invoice.invoice_id}: {invoice.total:.2f}"\n\ninv = Invoice(invoices[0]["InvoiceId"], invoices[0]["Total"])\ninv.apply_discount(10)\nanswer = (round(inv.total, 2), format_invoice(inv))\n',
          given: '# invoices is a list of dictionaries. format_invoice is a separate function, not a method.',
          brief: 'Write `Invoice(invoice_id, total)`. `apply_discount(percent)` reduces `total` by that percentage (10 means 10% off), in place. Notice `format_invoice` is deliberately kept as a **plain function**, not a method: formatting for display is a separate responsibility from the invoice\'s own data. Store the discounted total and the formatted text in `answer`.',
          reference: py`class Invoice:
    def __init__(self, invoice_id, total):
        self.invoice_id = invoice_id
        self.total = total

    def apply_discount(self, percent):
        self.total -= self.total * percent / 100

def format_invoice(invoice):
    return f"#{invoice.invoice_id}: {invoice.total:.2f}"

inv = Invoice(invoices[0]["InvoiceId"], invoices[0]["Total"])
inv.apply_discount(10)
answer = (round(inv.total, 2), format_invoice(inv))`,
          walkthrough: '`apply_discount` changes the invoice\'s own state, which belongs on the class. Formatting text for a report is a different concern, and keeping it as a plain function that merely *reads* the invoice keeps `Invoice` focused on being an invoice.',
          traps: [py`class Invoice:
    def __init__(self, invoice_id, total):
        self.invoice_id = invoice_id
        self.total = total

    def apply_discount(self, percent):
        self.total -= percent

def format_invoice(invoice):
    return f"#{invoice.invoice_id}: {invoice.total:.2f}"

inv = Invoice(invoices[0]["InvoiceId"], invoices[0]["Total"])
inv.apply_discount(10)
answer = (round(inv.total, 2), format_invoice(inv))`],
        }),
      ],
    },
  ],
  checkpoint: [],
}
