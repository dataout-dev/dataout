import { py, oop } from './common.js'

export const designLessonsB = [
    {
      id: 'py-repository-di',
      title: 'Repository and service layers; dependency injection',
      blurb: 'Separating storage from logic, and passing dependencies in explicitly.',
      kind: 'code',
      practice: {
        prompt: 'Write `InMemoryRepo` with `add(item)` (returns a new integer id, starting at 1), `get(item_id)`, and `all()` (a list of every stored item, in insertion order). Write `UserService(repo)`: `register(name, email)` raises `ValueError("invalid email")` if `"@"` is not in `email`, otherwise calls `self.repo.add({"name": name, "email": email})` and returns its id.',
        starter: 'class InMemoryRepo:\n    def __init__(self):\n        ...\n\n    def add(self, item):\n        ...\n\n    def get(self, item_id):\n        ...\n\n    def all(self):\n        ...\n\n\nclass UserService:\n    def __init__(self, repo):\n        ...\n\n    def register(self, name, email):\n        ...\n',
        solution: py`class InMemoryRepo:
    def __init__(self):
        self._items = {}
        self._next_id = 1

    def add(self, item):
        item_id = self._next_id
        self._items[item_id] = item
        self._next_id += 1
        return item_id

    def get(self, item_id):
        return self._items[item_id]

    def all(self):
        return list(self._items.values())


class UserService:
    def __init__(self, repo):
        self.repo = repo

    def register(self, name, email):
        if "@" not in email:
            raise ValueError("invalid email")
        return self.repo.add({"name": name, "email": email})`,
        samples: ['s = UserService(InMemoryRepo())\nuid = s.register("Ada", "ada@example.org")\ns.repo.get(uid)'],
        cases: [
          ['Registering returns a usable id', 's = UserService(InMemoryRepo())\nuid = s.register("Ada", "ada@example.org")\ns.repo.get(uid)'],
          ['Raises for an invalid email', 'UserService(InMemoryRepo()).register("Ada", "not-an-email")'],
          ['Ids increase with each add', 'r = InMemoryRepo()\n(r.add({"x": 1}), r.add({"x": 2}))'],
          ['all() lists every item in order', 'r = InMemoryRepo()\nr.add({"x": 1})\nr.add({"x": 2})\nr.all()'],
          ['A rejected registration adds nothing', 's = UserService(InMemoryRepo())\ntry:\n    s.register("Ada", "bad")\nexcept ValueError:\n    pass\ns.repo.all()'],
          ['The service works with any object that has add/get', 'class Fake:\n    def add(self, item):\n        return 999\nUserService(Fake()).register("Ada", "ada@example.org")'],
          ['Two repos are independent', 'a = InMemoryRepo()\nb = InMemoryRepo()\na.add({"x": 1})\nb.all()'],
        ],
        traps: [
          py`class InMemoryRepo:
    items = {}
    next_id = 1

    def __init__(self):
        pass

    def add(self, item):
        item_id = InMemoryRepo.next_id
        InMemoryRepo.items[item_id] = item
        InMemoryRepo.next_id += 1
        return item_id

    def get(self, item_id):
        return InMemoryRepo.items[item_id]

    def all(self):
        return list(InMemoryRepo.items.values())


class UserService:
    def __init__(self, repo):
        self.repo = repo

    def register(self, name, email):
        if "@" not in email:
            raise ValueError("invalid email")
        return self.repo.add({"name": name, "email": email})`,
          py`class InMemoryRepo:
    def __init__(self):
        self._items = {}
        self._next_id = 1

    def add(self, item):
        item_id = self._next_id
        self._items[item_id] = item
        self._next_id += 1
        return item_id

    def get(self, item_id):
        return self._items[item_id]

    def all(self):
        return list(self._items.values())


class UserService:
    def __init__(self, repo):
        self.repo = InMemoryRepo()

    def register(self, name, email):
        if "@" not in email:
            raise ValueError("invalid email")
        return self.repo.add({"name": name, "email": email})`,
        ],
      },
      real: [
        oop({
          title: 'A repository of tracks with a query method',
          use: ['tracks'],
          starter: 'class TrackRepo:\n    def __init__(self, rows):\n        ...\n\n    def by_genre(self, genre_id):\n        ...\n\nrepo = TrackRepo(tracks)\nanswer = len(repo.by_genre(1))\n',
          given: '# tracks is a list of dictionaries with "GenreId".',
          brief: 'Write `TrackRepo(rows)`, storing the rows. `by_genre(genre_id)` returns the list of rows whose `GenreId` matches — the whole point of a repository: callers ask a **meaningful** question, not raw filtering logic scattered everywhere.',
          reference: py`class TrackRepo:
    def __init__(self, rows):
        self.rows = rows

    def by_genre(self, genre_id):
        return [row for row in self.rows if row["GenreId"] == genre_id]

repo = TrackRepo(tracks)
answer = len(repo.by_genre(1))`,
          walkthrough: 'Callers of `by_genre` never need to know the rows are stored as a plain list, or how the filtering works — exactly the abstraction a repository is meant to provide.',
          traps: [py`class TrackRepo:
    def __init__(self, rows):
        self.rows = rows

    def by_genre(self, genre_id):
        return [row for row in self.rows if row["GenreId"] != genre_id]

repo = TrackRepo(tracks)
answer = len(repo.by_genre(1))`],
        }),
        oop({
          title: 'A service tested with a fake repository',
          use: ['tracks'],
          starter: 'class PricingService:\n    def __init__(self, repo):\n        ...\n\n    def total_value(self):\n        ...\n\n\nclass FakeRepo:\n    def __init__(self, rows):\n        self.rows = rows\n\n    def all(self):\n        return self.rows\n\nservice = PricingService(FakeRepo(tracks[:10]))\nanswer = round(service.total_value(), 2)\n',
          given: '# tracks is a list of dictionaries with "UnitPrice". FakeRepo stands in for a real database-backed one.',
          brief: 'Write `PricingService(repo)`. `total_value()` returns the sum of `UnitPrice` over `self.repo.all()`. It must work with **any** repo that has an `all()` method, real or fake.',
          reference: py`class PricingService:
    def __init__(self, repo):
        self.repo = repo

    def total_value(self):
        return sum(row["UnitPrice"] for row in self.repo.all())


class FakeRepo:
    def __init__(self, rows):
        self.rows = rows

    def all(self):
        return self.rows

service = PricingService(FakeRepo(tracks[:10]))
answer = round(service.total_value(), 2)`,
          walkthrough: '`PricingService` depends only on `repo.all()` existing, so a lightweight `FakeRepo` (no real database at all) is enough to exercise it fully, exactly as the testing-classes lesson recommended.',
          traps: [py`class PricingService:
    def __init__(self, repo):
        self.repo = repo

    def total_value(self):
        return len(self.repo.all())


class FakeRepo:
    def __init__(self, rows):
        self.rows = rows

    def all(self):
        return self.rows

service = PricingService(FakeRepo(tracks[:10]))
answer = round(service.total_value(), 2)`],
        }),
        oop({
          title: 'Swapping repositories without changing the service',
          use: ['genres'],
          starter: 'class GenreService:\n    def __init__(self, repo):\n        ...\n\n    def names(self):\n        ...\n\n\nclass ListRepo:\n    def __init__(self, rows):\n        self.rows = rows\n\n    def all(self):\n        return self.rows\n\nrepo = ListRepo(list(genres[:2]))\nservice = GenreService(repo)\nbefore = service.names()\nrepo.rows = list(genres[:3])\nafter = service.names()\nanswer = (before, after)\n',
          given: '# genres is a list of dictionaries with "Name". ListRepo is already finished. The repo\'s rows are changed after the service is built.',
          brief: 'Write `GenreService(repo)` (storing the **repo itself**, not a snapshot of its rows) and `names()`, returning `[row["Name"] for row in self.repo.all()]`, called **live** every time. Because it holds onto `repo` rather than a copy, a later change to the repo\'s own data must show up the next time `names()` is called.',
          reference: py`class GenreService:
    def __init__(self, repo):
        self.repo = repo

    def names(self):
        return [row["Name"] for row in self.repo.all()]


class ListRepo:
    def __init__(self, rows):
        self.rows = rows

    def all(self):
        return self.rows

repo = ListRepo(list(genres[:2]))
service = GenreService(repo)
before = service.names()
repo.rows = list(genres[:3])
after = service.names()
answer = (before, after)`,
          walkthrough: 'Because `GenreService` keeps a reference to the **repo itself** and calls `.all()` fresh each time, appending a row to `repo.rows` after construction is visible on the very next call to `names()` — a service that instead snapshotted the rows at construction time would never see it.',
          traps: [py`class GenreService:
    def __init__(self, repo):
        self.repo = ListRepo(repo.all())

    def names(self):
        return [row["Name"] for row in self.repo.all()]


class ListRepo:
    def __init__(self, rows):
        self.rows = rows

    def all(self):
        return self.rows

repo = ListRepo(list(genres[:2]))
service = GenreService(repo)
before = service.names()
repo.rows = list(genres[:3])
after = service.names()
answer = (before, after)`],
        }),
      ],
    },
    {
      id: 'py-pythonic-patterns',
      title: 'Pythonic patterns: functions over classes, registries and plugins',
      blurb: 'Dispatch tables, decorator registries and functools.singledispatch.',
      kind: 'code',
      practice: {
        prompt: 'Write `command(name)`, a decorator factory (like `exporter`/`shape` earlier in this section): it stores the decorated function in a module-level dictionary `handlers`, keyed by `name`, and returns the function unchanged.',
        starter: 'handlers = {}\n\ndef command(name):\n    def decorator(func):\n        ...\n    return decorator\n',
        solution: py`handlers = {}

def command(name):
    def decorator(func):
        handlers[name] = func
        return func
    return decorator`,
        samples: ['@command("greet")\ndef greet(name):\n    return f"hi {name}"\nhandlers["greet"]("Ada")'],
        cases: [
          ['Registers and still works normally', '@command("greet")\ndef greet(name):\n    return f"hi {name}"\ngreet("Ada")'],
          ['Callable through the registry', '@command("greet")\ndef greet(name):\n    return f"hi {name}"\nhandlers["greet"]("Ada")'],
          ['Two commands register independently', '@command("a")\ndef f():\n    return 1\n@command("b")\ndef g():\n    return 2\n(handlers["a"](), handlers["b"]())'],
          ['The function keeps its name', '@command("x")\ndef my_func():\n    pass\nmy_func.__name__'],
        ],
        traps: [
          py`handlers = {}

def command(name):
    def decorator(func):
        handlers[name] = func()
        return func
    return decorator`,
          py`handlers = {}

def command(name):
    def decorator(func):
        handlers[name] = func
    return decorator`,
        ],
      },
      real: [
        oop({
          title: 'A dispatch table for report formats',
          use: ['tracks'],
          starter: 'def as_csv(rows):\n    return ",".join(r["Name"] for r in rows)\n\n\ndef as_count(rows):\n    return len(rows)\n\n\nformatters = {\n    "csv": as_csv,\n    "count": as_count,\n}\n\ndef render(kind, rows):\n    ...\n\nanswer = (render("csv", tracks[:2]), render("count", tracks[:5]))\n',
          given: '# tracks is a list of dictionaries. as_csv, as_count and formatters are already finished; only render needs writing.',
          brief: 'Write `render(kind, rows)`, looking `kind` up in `formatters` and calling it with `rows`, **without any `if`/`elif` chain**.',
          reference: py`def as_csv(rows):
    return ",".join(r["Name"] for r in rows)


def as_count(rows):
    return len(rows)


formatters = {
    "csv": as_csv,
    "count": as_count,
}

def render(kind, rows):
    return formatters[kind](rows)

answer = (render("csv", tracks[:2]), render("count", tracks[:5]))`,
          walkthrough: '`formatters[kind]` looks up the right function by name, and `(rows)` calls it — a dictionary lookup replaces what an `if`/`elif` chain would otherwise need.',
          traps: [py`def as_csv(rows):
    return ",".join(r["Name"] for r in rows)


def as_count(rows):
    return len(rows)


formatters = {
    "csv": as_csv,
    "count": as_count,
}

def render(kind, rows):
    return formatters[kind]

answer = (render("csv", tracks[:2]), render("count", tracks[:5]))`],
        }),
        oop({
          title: 'Type-based dispatch with singledispatch',
          use: ['genres'],
          starter: 'from functools import singledispatch\n\n@singledispatch\ndef describe(value):\n    return f"a {type(value).__name__}"\n\n\n@describe.register(dict)\ndef _(value):\n    ...\n\nanswer = [describe(genres[0]), describe(5), describe("text")]\n',
          given: '# genres is a list of dictionaries. The base describe() and the registration line are already there.',
          brief: 'Write the body registered for `dict`: return `f"a row with keys {sorted(value)}"`.',
          reference: py`from functools import singledispatch

@singledispatch
def describe(value):
    return f"a {type(value).__name__}"


@describe.register(dict)
def _(value):
    return f"a row with keys {sorted(value)}"

answer = [describe(genres[0]), describe(5), describe("text")]`,
          walkthrough: '`singledispatch` picks the registered function that matches the argument\'s type, so a `dict` gets the specific version while every other type falls back to the generic one.',
          traps: [py`from functools import singledispatch

@singledispatch
def describe(value):
    return f"a {type(value).__name__}"


@describe.register(dict)
def _(value):
    return f"a {type(value).__name__}"

answer = [describe(genres[0]), describe(5), describe("text")]`],
        }),
        oop({
          title: 'A plugin-style registry of validators',
          use: ['customers'],
          starter: 'validators = {}\n\ndef validator(field):\n    def decorator(func):\n        validators[field] = func\n        return func\n    return decorator\n\n\n@validator("Email")\ndef check_email(value):\n    return "@" in (value or "")\n\n\n@validator("Country")\ndef check_country(value):\n    ...\n\ndef validate(row):\n    return {field: fn(row.get(field)) for field, fn in validators.items()}\n\nanswer = [validate(c) for c in customers[:3]] + [validate({"Email": "x@y.com", "Country": ""})]\n',
          given: '# customers is a list of dictionaries. validator, check_email and validate are already finished.',
          brief: 'Write `check_country(value)`, registered under `"Country"`: return `True` when `value` is a non-empty string, `False` otherwise (including `None`).',
          reference: py`validators = {}

def validator(field):
    def decorator(func):
        validators[field] = func
        return func
    return decorator


@validator("Email")
def check_email(value):
    return "@" in (value or "")


@validator("Country")
def check_country(value):
    return bool(value)

def validate(row):
    return {field: fn(row.get(field)) for field, fn in validators.items()}

answer = [validate(c) for c in customers[:3]] + [validate({"Email": "x@y.com", "Country": ""})]`,
          walkthrough: '`validate` never mentions `Email` or `Country` by name — it just runs every registered validator against the matching field, so adding a new `@validator(...)` needs no change to `validate` itself.',
          traps: [py`validators = {}

def validator(field):
    def decorator(func):
        validators[field] = func
        return func
    return decorator


@validator("Email")
def check_email(value):
    return "@" in (value or "")


@validator("Country")
def check_country(value):
    return value is not None

def validate(row):
    return {field: fn(row.get(field)) for field, fn in validators.items()}

answer = [validate(c) for c in customers[:3]] + [validate({"Email": "x@y.com", "Country": ""})]`],
        }),
      ],
    },
    {
      id: 'py-refactoring',
      title: 'Refactoring: recognising smells and improving structure',
      blurb: 'Long functions, large classes, primitive obsession, and safe refactoring steps.',
      kind: 'learn',
      check: [
        {
          q: 'A function has grown to do five unrelated things in thirty lines. What is this smell called?',
          options: ['Feature envy', 'Long function', 'Primitive obsession', 'Shotgun surgery'],
          answer: 1,
          why: 'A long function that does many things is harder to read, test and change than several small, focused ones.',
        },
        {
          q: 'A rule ("apply 8% tax") is duplicated in twelve different places in a codebase, so changing it means editing all twelve. What is this pair of smells called?',
          options: ['Long function and feature envy', 'Duplicated code, causing shotgun surgery', 'Primitive obsession', 'Large class'],
          answer: 1,
          why: 'The duplicated logic is why one conceptual change needs "shotgun surgery" across many scattered locations. Extracting it into one function or class fixes both at once.',
        },
        {
          q: 'What does "extract function" mean, as a refactoring move?',
          options: [
            'Deleting an unused function',
            'Pulling a chunk of a long function out into its own, well-named function',
            'Converting a function into a class',
            'Merging two functions into one',
          ],
          answer: 1,
          why: 'Extract function is the most common refactoring move: give a meaningful name to a piece of logic, and let the original function call it.',
        },
        {
          q: 'Which is the single rule that makes refactoring safe?',
          options: [
            'Always rewrite the whole module at once',
            'Never refactor code that has no tests protecting its current behaviour',
            'Only refactor code you wrote yourself',
            'Refactor only on Fridays',
          ],
          answer: 1,
          why: 'Without tests, you cannot confirm you kept the behaviour unchanged, which is the entire definition of refactoring — it becomes a risky rewrite instead.',
        },
        {
          q: 'An `if`/`elif` chain branches on an order\'s type to compute shipping cost, and grows a new branch every few months. Replacing it with one class per order type, chosen polymorphically, is an example of which refactoring?',
          options: ['Extract class', 'Replace conditionals with polymorphism', 'Extract function', 'Inline variable'],
          answer: 1,
          why: 'This is the direct application of the Open/Closed Principle: each new order type becomes a new class, and the calling code never needs to change again.',
        },
      ],
    },
    {
      id: 'py-oop-design-workshop',
      title: 'OOP design workshop: a library system with tests',
      blurb: 'Requirements to design: Book, Member, Library, an error hierarchy and tests.',
      kind: 'code',
      practice: {
        prompt: 'Implement the borrowing rules from the lesson.\n\n- `Book(title, copies)`, `Member(name)` (with an empty `borrowed` list).\n- `LibraryError(Exception)` base; `NoCopiesAvailable`, `TooManyBooks`, `AlreadyBorrowed`, `NotBorrowed`, all subclasses of `LibraryError`.\n- `Library` with class attribute `MAX_BOOKS = 3`.\n- `borrow(member, book)`: raises `AlreadyBorrowed` if `book` is already in `member.borrowed`; then `TooManyBooks` if `member` already has `MAX_BOOKS` books; then `NoCopiesAvailable` if `book.copies <= 0`; otherwise decreases `book.copies` by 1 and appends `book` to `member.borrowed`.\n- `return_book(member, book)`: raises `NotBorrowed` if `book` is not in `member.borrowed`; otherwise removes it and increases `book.copies` by 1.',
        starter: 'class Book:\n    def __init__(self, title, copies):\n        ...\n\n\nclass Member:\n    def __init__(self, name):\n        ...\n\n\nclass LibraryError(Exception):\n    pass\n\n\nclass NoCopiesAvailable(LibraryError):\n    pass\n\n\nclass TooManyBooks(LibraryError):\n    pass\n\n\nclass AlreadyBorrowed(LibraryError):\n    pass\n\n\nclass NotBorrowed(LibraryError):\n    pass\n\n\nclass Library:\n    MAX_BOOKS = 3\n\n    def borrow(self, member, book):\n        ...\n\n    def return_book(self, member, book):\n        ...\n',
        solution: py`class Book:
    def __init__(self, title, copies):
        self.title = title
        self.copies = copies


class Member:
    def __init__(self, name):
        self.name = name
        self.borrowed = []


class LibraryError(Exception):
    pass


class NoCopiesAvailable(LibraryError):
    pass


class TooManyBooks(LibraryError):
    pass


class AlreadyBorrowed(LibraryError):
    pass


class NotBorrowed(LibraryError):
    pass


class Library:
    MAX_BOOKS = 3

    def borrow(self, member, book):
        if book in member.borrowed:
            raise AlreadyBorrowed(f"{member.name} already has {book.title}")
        if len(member.borrowed) >= self.MAX_BOOKS:
            raise TooManyBooks(f"{member.name} already has {self.MAX_BOOKS} books")
        if book.copies <= 0:
            raise NoCopiesAvailable(f"no copies of {book.title} left")
        book.copies -= 1
        member.borrowed.append(book)

    def return_book(self, member, book):
        if book not in member.borrowed:
            raise NotBorrowed(f"{member.name} has not borrowed {book.title}")
        member.borrowed.remove(book)
        book.copies += 1`,
        samples: ['lib = Library()\nm = Member("Alice")\nb = Book("Dune", 1)\nlib.borrow(m, b)\n(b.copies, len(m.borrowed))'],
        cases: [
          ['A normal borrow', 'lib = Library()\nm = Member("Alice")\nb = Book("Dune", 1)\nlib.borrow(m, b)\n(b.copies, len(m.borrowed))'],
          ['Raises when no copies are left', 'lib = Library()\nm = Member("Alice")\nb = Book("Dune", 0)\nlib.borrow(m, b)'],
          ['Raises for the same book twice', 'lib = Library()\nm = Member("Alice")\nb = Book("Dune", 5)\nlib.borrow(m, b)\nlib.borrow(m, b)'],
          ['Raises after the third book', 'lib = Library()\nm = Member("Alice")\nbooks = [Book("A", 1), Book("B", 1), Book("C", 1), Book("D", 1)]\nfor b in books[:3]:\n    lib.borrow(m, b)\nlib.borrow(m, books[3])'],
          ['A third distinct book is allowed', 'lib = Library()\nm = Member("Alice")\nbooks = [Book("A", 1), Book("B", 1), Book("C", 1)]\nfor b in books:\n    lib.borrow(m, b)\nlen(m.borrowed)'],
          ['Returning frees a copy', 'lib = Library()\nm = Member("Alice")\nb = Book("Dune", 1)\nlib.borrow(m, b)\nlib.return_book(m, b)\n(b.copies, len(m.borrowed))'],
          ['Raises returning a book never borrowed', 'lib = Library()\nm = Member("Alice")\nb = Book("Dune", 1)\nlib.return_book(m, b)'],
          ['After returning, the book can be borrowed again', 'lib = Library()\nm = Member("Alice")\nb = Book("Dune", 1)\nlib.borrow(m, b)\nlib.return_book(m, b)\nlib.borrow(m, b)\nlen(m.borrowed)'],
          ['Two members do not share state', 'lib = Library()\na = Member("A")\nb = Member("B")\nbook = Book("Dune", 5)\nlib.borrow(a, book)\nlen(b.borrowed)'],
          ['A failed borrow (no copies) leaves state untouched', 'lib = Library()\nm = Member("Alice")\nb = Book("Dune", 0)\ntry:\n    lib.borrow(m, b)\nexcept Exception:\n    pass\n(b.copies, m.borrowed)'],
          ['A repeated borrow does not double-mutate', 'lib = Library()\nm = Member("Alice")\nb = Book("Dune", 5)\nlib.borrow(m, b)\ntry:\n    lib.borrow(m, b)\nexcept Exception:\n    pass\n(b.copies, len(m.borrowed))'],
          ['AlreadyBorrowed takes priority over TooManyBooks', 'lib = Library()\nm = Member("Alice")\nbooks = [Book("A", 1), Book("B", 1), Book("C", 1)]\nfor b in books:\n    lib.borrow(m, b)\ntry:\n    lib.borrow(m, books[0])\nexcept AlreadyBorrowed:\n    result = "AlreadyBorrowed"\nexcept TooManyBooks:\n    result = "TooManyBooks"\nresult'],
          ['Every specific error is a LibraryError', 'issubclass(NoCopiesAvailable, LibraryError) and issubclass(TooManyBooks, LibraryError) and issubclass(AlreadyBorrowed, LibraryError) and issubclass(NotBorrowed, LibraryError)'],
        ],
        traps: [
          py`class Book:
    def __init__(self, title, copies):
        self.title = title
        self.copies = copies


class Member:
    def __init__(self, name):
        self.name = name
        self.borrowed = []


class LibraryError(Exception):
    pass


class NoCopiesAvailable(LibraryError):
    pass


class TooManyBooks(LibraryError):
    pass


class AlreadyBorrowed(LibraryError):
    pass


class NotBorrowed(LibraryError):
    pass


class Library:
    MAX_BOOKS = 3

    def borrow(self, member, book):
        book.copies -= 1
        member.borrowed.append(book)
        if book in member.borrowed[:-1]:
            raise AlreadyBorrowed(f"{member.name} already has {book.title}")
        if len(member.borrowed) > self.MAX_BOOKS:
            raise TooManyBooks(f"{member.name} already has {self.MAX_BOOKS} books")
        if book.copies < 0:
            raise NoCopiesAvailable(f"no copies of {book.title} left")

    def return_book(self, member, book):
        if book not in member.borrowed:
            raise NotBorrowed(f"{member.name} has not borrowed {book.title}")
        member.borrowed.remove(book)
        book.copies += 1`,
          py`class Book:
    def __init__(self, title, copies):
        self.title = title
        self.copies = copies


class Member:
    borrowed = []

    def __init__(self, name):
        self.name = name


class LibraryError(Exception):
    pass


class NoCopiesAvailable(LibraryError):
    pass


class TooManyBooks(LibraryError):
    pass


class AlreadyBorrowed(LibraryError):
    pass


class NotBorrowed(LibraryError):
    pass


class Library:
    MAX_BOOKS = 3

    def borrow(self, member, book):
        if book in member.borrowed:
            raise AlreadyBorrowed(f"{member.name} already has {book.title}")
        if len(member.borrowed) >= self.MAX_BOOKS:
            raise TooManyBooks(f"{member.name} already has {self.MAX_BOOKS} books")
        if book.copies <= 0:
            raise NoCopiesAvailable(f"no copies of {book.title} left")
        book.copies -= 1
        member.borrowed.append(book)

    def return_book(self, member, book):
        if book not in member.borrowed:
            raise NotBorrowed(f"{member.name} has not borrowed {book.title}")
        member.borrowed.remove(book)
        book.copies += 1`,
          py`class Book:
    def __init__(self, title, copies):
        self.title = title
        self.copies = copies


class Member:
    def __init__(self, name):
        self.name = name
        self.borrowed = []


class LibraryError(Exception):
    pass


class NoCopiesAvailable(LibraryError):
    pass


class TooManyBooks(LibraryError):
    pass


class AlreadyBorrowed(LibraryError):
    pass


class NotBorrowed(LibraryError):
    pass


class Library:
    MAX_BOOKS = 3

    def borrow(self, member, book):
        if len(member.borrowed) >= self.MAX_BOOKS:
            raise TooManyBooks(f"{member.name} already has {self.MAX_BOOKS} books")
        if book in member.borrowed:
            raise AlreadyBorrowed(f"{member.name} already has {book.title}")
        if book.copies <= 0:
            raise NoCopiesAvailable(f"no copies of {book.title} left")
        book.copies -= 1
        member.borrowed.append(book)

    def return_book(self, member, book):
        if book not in member.borrowed:
            raise NotBorrowed(f"{member.name} has not borrowed {book.title}")
        member.borrowed.remove(book)
        book.copies += 1`,
        ],
      },
      real: [
        oop({
          title: 'A library seeded from the Chinook catalogue',
          use: ['albums'],
          starter: 'class Book:\n    def __init__(self, title, copies):\n        self.title = title\n        self.copies = copies\n\n\nclass Member:\n    def __init__(self, name):\n        self.name = name\n        self.borrowed = []\n\n\nclass Library:\n    def __init__(self):\n        ...\n\n    def add_book(self, book):\n        ...\n\n    def find(self, title):\n        ...\n\nlib = Library()\nfor a in albums[:5]:\n    lib.add_book(Book(a["Title"], 2))\nanswer = (lib.find(albums[0]["Title"]).title, lib.find("Not a real album"))\n',
          given: '# albums is a list of dictionaries with "Title". Book and Member are already finished.',
          brief: 'Write `Library.__init__` (an empty `books` list), `add_book(book)` (appends to it), and `find(title)`: returns the first `Book` with that title, or `None` if there is none.',
          reference: py`class Book:
    def __init__(self, title, copies):
        self.title = title
        self.copies = copies


class Member:
    def __init__(self, name):
        self.name = name
        self.borrowed = []


class Library:
    def __init__(self):
        self.books = []

    def add_book(self, book):
        self.books.append(book)

    def find(self, title):
        for book in self.books:
            if book.title == title:
                return book
        return None

lib = Library()
for a in albums[:5]:
    lib.add_book(Book(a["Title"], 2))
answer = (lib.find(albums[0]["Title"]).title, lib.find("Not a real album"))`,
          walkthrough: '`find` is a small, meaningful query method on `Library`, exactly the repository idea from earlier in this section, applied to an in-memory list of `Book` objects.',
          traps: [py`class Book:
    def __init__(self, title, copies):
        self.title = title
        self.copies = copies


class Member:
    def __init__(self, name):
        self.name = name
        self.borrowed = []


class Library:
    def __init__(self):
        self.books = []

    def add_book(self, book):
        self.books.append(book)

    def find(self, title):
        for book in self.books:
            if book.title != title:
                return book
        return None

lib = Library()
for a in albums[:5]:
    lib.add_book(Book(a["Title"], 2))
answer = (lib.find(albums[0]["Title"]).title, lib.find("Not a real album"))`],
        }),
        oop({
          title: 'A librarian report, kept separate from the rules',
          use: ['albums'],
          starter: 'class Book:\n    def __init__(self, title, copies):\n        self.title = title\n        self.copies = copies\n\ndef availability_report(books):\n    ...\n\nbooks = [Book(a["Title"], i % 3) for i, a in enumerate(albums[:6])]\nanswer = availability_report(books)\n',
          given: '# albums is a list of dictionaries. Book is finished; only availability_report needs writing.',
          brief: 'Write `availability_report(books)` as a **plain function**, not a method on `Book`: return the number of books with `copies == 0` (unavailable), keeping this reporting concern separate from `Book` itself, following the single-responsibility idea.',
          reference: py`class Book:
    def __init__(self, title, copies):
        self.title = title
        self.copies = copies

def availability_report(books):
    return sum(1 for book in books if book.copies == 0)

books = [Book(a["Title"], i % 3) for i, a in enumerate(albums[:6])]
answer = availability_report(books)`,
          walkthrough: '`availability_report` is kept as a standalone function that only reads `Book` objects, rather than a method bolted onto `Book` itself — a reporting concern is not part of what a book fundamentally is.',
          traps: [py`class Book:
    def __init__(self, title, copies):
        self.title = title
        self.copies = copies

def availability_report(books):
    return sum(1 for book in books if book.copies > 0)

books = [Book(a["Title"], i % 3) for i, a in enumerate(albums[:6])]
answer = availability_report(books)`],
        }),
        oop({
          title: 'Catching the whole family of library errors',
          use: ['albums'],
          starter: 'class LibraryError(Exception):\n    pass\n\n\nclass NoCopiesAvailable(LibraryError):\n    pass\n\n\nclass TooManyBooks(LibraryError):\n    pass\n\n\nclass Book:\n    def __init__(self, title, copies):\n        self.title = title\n        self.copies = copies\n\n\nclass Member:\n    def __init__(self, name):\n        self.name = name\n        self.borrowed = []\n\n\nclass Library:\n    MAX_BOOKS = 2\n\n    def borrow(self, member, book):\n        ...\n\nlib = Library()\nm = Member("Alice")\nbooks = [Book("A", 1), Book("B", 0), Book("C", 1), Book("D", 1)]\nresults = []\nfor b in books:\n    try:\n        lib.borrow(m, b)\n        results.append("ok")\n    except LibraryError as e:\n        results.append(type(e).__name__)\nanswer = (results, books[3].copies)\n',
          given: '# albums is a list of dictionaries (not used directly). MAX_BOOKS is deliberately set to 2 for this exercise, so the 3rd successful borrow (book D) must be rejected.',
          brief: 'Write `Library.borrow(member, book)`: raise `TooManyBooks` if `member` already has `MAX_BOOKS` books, then `NoCopiesAvailable` if `book.copies <= 0`, otherwise borrow normally. A **rejected** borrow must leave `book.copies` and `member.borrowed` **unchanged**.',
          reference: py`class LibraryError(Exception):
    pass


class NoCopiesAvailable(LibraryError):
    pass


class TooManyBooks(LibraryError):
    pass


class Book:
    def __init__(self, title, copies):
        self.title = title
        self.copies = copies


class Member:
    def __init__(self, name):
        self.name = name
        self.borrowed = []


class Library:
    MAX_BOOKS = 2

    def borrow(self, member, book):
        if len(member.borrowed) >= self.MAX_BOOKS:
            raise TooManyBooks(f"{member.name} already has {self.MAX_BOOKS} books")
        if book.copies <= 0:
            raise NoCopiesAvailable(f"no copies of {book.title} left")
        book.copies -= 1
        member.borrowed.append(book)

lib = Library()
m = Member("Alice")
books = [Book("A", 1), Book("B", 0), Book("C", 1), Book("D", 1)]
results = []
for b in books:
    try:
        lib.borrow(m, b)
        results.append("ok")
    except LibraryError as e:
        results.append(type(e).__name__)
answer = (results, books[3].copies)`,
          walkthrough: 'The loop catches only `LibraryError`, and both specific exceptions are still caught, because each is a subclass of it — the single `except` clause handles the whole family.',
          traps: [py`class LibraryError(Exception):
    pass


class NoCopiesAvailable(LibraryError):
    pass


class TooManyBooks(LibraryError):
    pass


class Book:
    def __init__(self, title, copies):
        self.title = title
        self.copies = copies


class Member:
    def __init__(self, name):
        self.name = name
        self.borrowed = []


class Library:
    MAX_BOOKS = 2

    def borrow(self, member, book):
        if book.copies <= 0:
            raise NoCopiesAvailable(f"no copies of {book.title} left")
        book.copies -= 1
        member.borrowed.append(book)
        if len(member.borrowed) > self.MAX_BOOKS:
            raise TooManyBooks(f"{member.name} already has {self.MAX_BOOKS} books")

lib = Library()
m = Member("Alice")
books = [Book("A", 1), Book("B", 0), Book("C", 1), Book("D", 1)]
results = []
for b in books:
    try:
        lib.borrow(m, b)
        results.append("ok")
    except LibraryError as e:
        results.append(type(e).__name__)
answer = (results, books[3].copies)`],
        }),
      ],
    },
]
