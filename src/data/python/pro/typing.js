import { py, pro } from './common.js'

export const typingInDepth = {
  id: 'typing-in-depth',
  title: 'Typing in depth',
  intro: 'Static types that document and protect your code.',
  lessons: [
    {
      id: 'py-typing-generics-typeddict',
      title: 'Type hints beyond the basics: generics, TypedDict, Literal and Callable',
      blurb: 'Generic functions and containers, TypedDict, Literal, Final, Callable and type aliases.',
      kind: 'code',
      practice: {
        prompt: 'Write `apply_all(fn, records)`: apply `fn` to every dict in `records`, returning the results as a list, in the same order.',
        starter: 'def apply_all(fn, records):\n    ...\n',
        solution: py`from typing import Callable, Any

def apply_all(fn: Callable[[dict], Any], records: list[dict]) -> list[Any]:
    return [fn(r) for r in records]`,
        samples: ['apply_all(lambda r: r["x"], [{"x": 1}, {"x": 2}, {"x": 3}])'],
        cases: [
          ['Extracting one field', 'apply_all(lambda r: r["x"], [{"x": 1}, {"x": 2}, {"x": 3}])'],
          ['A computed value', 'apply_all(lambda r: r["x"] * 2, [{"x": 5}])'],
          ['A built-in function as fn', 'apply_all(len, [{"a": 1, "b": 2}, {}])'],
          ['An empty list of records', 'apply_all(lambda r: r, [])'],
          ['Order is preserved', 'apply_all(lambda r: r["name"], [{"name": "b"}, {"name": "a"}])'],
        ],
        traps: [
          py`def apply_all(fn, records):
    return [fn(r) for r in reversed(records)]`,
          py`def apply_all(fn, records):
    return [fn(i) for i in range(len(records))]`,
          py`def apply_all(fn, records):
    return [fn(r) for r in records[1:]]`,
        ],
      },
      real: [
        pro({
          title: 'Full names from Chinook customers',
          use: ['customers'],
          starter: 'def apply_all(fn, records):\n    ...\n\nfirst_five = customers[:5]\nanswer = apply_all(lambda c: c["FirstName"] + " " + c["LastName"], first_five)\n',
          given: '# customers is a list of dictionaries; first_five holds the first 5 rows.',
          brief: 'Write `apply_all` as in the lesson. Store the list of full names for the first 5 customers in `answer`.',
          reference: py`def apply_all(fn, records):
    return [fn(r) for r in records]

first_five = customers[:5]
answer = apply_all(lambda c: c["FirstName"] + " " + c["LastName"], first_five)`,
          walkthrough: '`apply_all` is generic over what `fn` returns — a string here, a number elsewhere — which is exactly what the `Callable[[dict], Any]` hint in the solution communicates to a type checker.',
          traps: [py`first_five = customers[:5]

def apply_all(fn, records):
    return [fn(r) for r in records]

answer = apply_all(lambda c: c["LastName"] + " " + c["FirstName"], first_five)`],
        }),
        pro({
          title: 'Counting fields per record',
          use: ['tracks'],
          starter: 'def apply_all(fn, records):\n    ...\n\nsample = tracks[:8]\nanswer = apply_all(len, sample)\n',
          given: '# tracks is a list of dictionaries; sample holds the first 8 rows.',
          brief: 'Store the result of applying the built-in `len` to each of the first 8 track records in `answer` (every row has the same columns, so every count should match).',
          reference: py`def apply_all(fn, records):
    return [fn(r) for r in records]

sample = tracks[:8]
answer = apply_all(len, sample)`,
          walkthrough: '`len` is itself a `Callable[[dict], int]` — `apply_all` does not care whether `fn` is a lambda, a built-in, or a named function, as long as it accepts one record.',
          traps: [py`sample = tracks[:8]

def apply_all(fn, records):
    return [fn(r) for r in records[:-1]]

answer = apply_all(len, sample)`],
        }),
        pro({
          title: 'A TypedDict-shaped summary',
          use: ['customers'],
          starter: 'def apply_all(fn, records):\n    ...\n\ndef summarise(c):\n    return {"name": c["FirstName"] + " " + c["LastName"], "country": c["Country"]}\n\nanswer = apply_all(summarise, customers[:3])\n',
          given: '# customers is a list of dictionaries. summarise builds a small, TypedDict-shaped record from each one.',
          brief: 'Store the list of summaries (as built by `summarise`) for the first 3 customers in `answer`.',
          reference: py`def apply_all(fn, records):
    return [fn(r) for r in records]

def summarise(c):
    return {"name": c["FirstName"] + " " + c["LastName"], "country": c["Country"]}

answer = apply_all(summarise, customers[:3])`,
          walkthrough: 'A `TypedDict` would give `summarise`’s return value a precise shape (`{"name": str, "country": str}`) for a type checker to verify at every call site, without changing anything about how the dict behaves at runtime.',
          traps: [py`def apply_all(fn, records):
    return [fn(r) for r in records]

def summarise(c):
    return {"name": c["LastName"], "country": c["Country"]}

answer = apply_all(summarise, customers[:3])`],
        }),
      ],
    },
    {
      id: 'py-protocols-overloads-narrowing',
      title: 'Protocols, overloads and type narrowing',
      blurb: 'Protocol for structural typing, @overload, isinstance narrowing and TypeGuard.',
      kind: 'code',
      practice: {
        prompt: 'Write `double(x)`: if `x` is a string, return it repeated twice (concatenated with itself); if `x` is a list, return a new list with its elements repeated twice, in the same relative order. A single `+` on `x` does exactly this for both types.',
        starter: 'def double(x):\n    ...\n',
        solution: py`from typing import overload, Union

@overload
def double(x: str) -> str: ...
@overload
def double(x: list) -> list: ...

def double(x):
    return x + x`,
        samples: ['double("ab")', 'double([1, 2])'],
        cases: [
          ['A short string', 'double("ab")'],
          ['A short list', 'double([1, 2])'],
          ['An empty string', 'double("")'],
          ['An empty list', 'double([])'],
          ['A single character', 'double("x")'],
          ['A list of strings', 'double(["a", "b"])'],
        ],
        traps: [
          py`def double(x):
    return list(x) + list(x)`,
          py`def double(x):
    return x`,
          py`def double(x):
    return x + x + x`,
        ],
      },
      real: [
        pro({
          title: 'Doubling a genre name and a track list',
          use: ['genres', 'tracks'],
          starter: 'def double(x):\n    ...\n\nname = genres[0]["Name"]\nfirst_two = [t["Name"] for t in tracks[:2]]\nanswer = (double(name), double(first_two))\n',
          given: '# genres and tracks are lists of dictionaries.',
          brief: 'Store `(double(first_genre_name), double(first_two_track_names))` in `answer`.',
          reference: py`def double(x):
    return x + x

name = genres[0]["Name"]
first_two = [t["Name"] for t in tracks[:2]]
answer = (double(name), double(first_two))`,
          walkthrough: 'The same one-line implementation (`x + x`) is correct for both a `str` and a `list` — `@overload` exists purely to tell a type checker the two precise return-type shapes, without needing two separate implementations.',
          traps: [py`name = genres[0]["Name"]
first_two = [t["Name"] for t in tracks[:2]]

def double(x):
    return list(x) + list(x)

answer = (double(name), double(first_two))`],
        }),
        pro({
          title: 'Narrowing before doubling',
          use: ['artists'],
          starter: 'def safe_double(x):\n    ...\n\nname = artists[0]["Name"]\nanswer = (safe_double(name), safe_double(None), safe_double(""))\n',
          given: '# artists is a list of dictionaries.',
          brief: 'Write `safe_double(x)`: if `x` is `None`, return `None`; otherwise (narrowing `x` to a string) return `x + x`. Store `(safe_double(first_artist_name), safe_double(None), safe_double(""))` in `answer` — note that an empty string is not `None`, so it should still be doubled (to `""`).',
          reference: py`def safe_double(x):
    if x is None:
        return None
    return x + x

name = artists[0]["Name"]
answer = (safe_double(name), safe_double(None), safe_double(""))`,
          walkthrough: 'Checking `x is None` first is a type guard: after that check, a type checker knows the rest of the function only ever sees a real string, matching what `isinstance` narrowing does more generally. Testing with an empty string (falsy, but not `None`) is what actually catches a solution that narrows on truthiness instead of on `is None`.',
          traps: [py`name = artists[0]["Name"]

def safe_double(x):
    return x + x if x else None

answer = (safe_double(name), safe_double(None), safe_double(""))`],
        }),
        pro({
          title: 'A Protocol-shaped helper',
          use: ['tracks'],
          starter: 'class HasName:\n    def __init__(self, name):\n        self.name = name\n\ndef shout(x):\n    ...\n\nwrapped = [HasName(t["Name"]) for t in tracks[:3]]\nanswer = [shout(w) for w in wrapped]\n',
          given: '# tracks is a list of dictionaries. HasName wraps a track name in an object with a `.name` attribute, structurally matching any "has a name" Protocol — no inheritance needed.',
          brief: 'Write `shout(x)` returning `x.name.upper()`. Store the shouted names for the first 3 wrapped tracks in `answer`.',
          reference: py`class HasName:
    def __init__(self, name):
        self.name = name

def shout(x):
    return x.name.upper()

wrapped = [HasName(t["Name"]) for t in tracks[:3]]
answer = [shout(w) for w in wrapped]`,
          walkthrough: 'A `Protocol` with a `name: str` attribute would accept `HasName`, or *any* other class with a `.name` attribute, without either of them needing to inherit from a shared base — that structural match is the whole point of `Protocol`.',
          traps: [py`class HasName:
    def __init__(self, name):
        self.name = name

def shout(x):
    return x.name.lower()

wrapped = [HasName(t["Name"]) for t in tracks[:3]]
answer = [shout(w) for w in wrapped]`],
        }),
      ],
    },
    {
      id: 'py-static-checking-mypy-pyright',
      title: 'Static checking with mypy and pyright (reading)',
      blurb: 'Running a type checker, gradual typing, strictness settings and stubs.',
      kind: 'read',
      check: [
        {
          q: 'What does running `mypy` on a file actually do?',
          options: [
            'It executes the code and reports runtime errors',
            'It reads the code and its type hints *without running it*, and reports places where the types do not line up',
            'It automatically adds missing type hints to your code',
            'It formats the code according to PEP 8',
          ],
          answer: 1,
          why: 'Static type checking is purely a read of the source: mypy never executes your program, it reasons about it.',
        },
        {
          q: 'What does "gradual typing" mean in Python?',
          options: [
            'You must type-hint every single line before mypy will run at all',
            'Type hints are optional and can be added incrementally, file by file or even function by function, mixing typed and untyped code',
            'Types are checked gradually, one per second, at runtime',
            'It refers to Python slowly becoming a statically typed language over several major versions',
          ],
          answer: 1,
          why: 'Unlike a language that forces full typing everywhere, Python lets you adopt type hints incrementally, which is why mypy has to tolerate large amounts of untyped code by default.',
        },
        {
          q: 'What does a stricter mypy setting (e.g. `--strict`) typically add?',
          options: [
            'Nothing, strict mode is purely cosmetic',
            'It disallows things loose mode tolerates — untyped function definitions, implicit `Any`, missing return types — catching more, at the cost of needing more annotations up front',
            'It makes the checker run faster',
            'It only affects formatting, not type checking',
          ],
          answer: 1,
          why: 'Strict mode trades convenience for thoroughness: more of your code has to be explicitly typed, but more real mistakes get caught.',
        },
        {
          q: 'What is a `.pyi` stub file for?',
          options: [
            'A backup copy of a Python file',
            'A file containing only type information for a module (no implementation) — used for typing C extensions or third-party code that has no inline hints',
            'A file pytest uses to discover tests',
            'A compiled bytecode cache',
          ],
          answer: 1,
          why: 'Stub files let you (or a library’s maintainers) describe a module’s types separately from its implementation, which matters a lot for compiled extensions with no Python source to annotate directly.',
        },
        {
          q: 'Why might a project ship a `py.typed` marker file?',
          options: [
            'It has no effect and is purely decorative',
            'It signals to type checkers that this package’s own inline type hints are meant to be trusted and checked, rather than treated as untyped',
            'It is required for the package to be installable at all',
            'It marks which files were written by a specific author',
          ],
          answer: 1,
          why: 'Without `py.typed`, a type checker may treat an installed package as untyped even if its source has hints, to avoid trusting hints the maintainers never intended to be checked as a public contract.',
        },
      ],
    },
    {
      id: 'py-pydantic-validation',
      title: 'Runtime validation with pydantic',
      blurb: 'Models, type coercion, custom validators, parsing JSON, and dataclass versus pydantic.',
      kind: 'code',
      practice: {
        prompt: 'Define a pydantic model `Invoice` with `customer_id: int` and `total: float`. Write `validate_invoice(data)`: try to build an `Invoice` from `data` (a dict); on success return `[]`, on failure return the list of field names that failed validation.',
        starter: 'from pydantic import BaseModel, ValidationError\n\nclass Invoice(BaseModel):\n    ...\n\ndef validate_invoice(data):\n    ...\n',
        solution: py`from pydantic import BaseModel, ValidationError

class Invoice(BaseModel):
    customer_id: int
    total: float

def validate_invoice(data):
    try:
        Invoice(**data)
        return []
    except ValidationError as e:
        return [err["loc"][0] for err in e.errors()]`,
        samples: ['validate_invoice({"customer_id": 1, "total": 9.99})'],
        cases: [
          ['Valid data passes', 'validate_invoice({"customer_id": 1, "total": 9.99})'],
          ['Missing total', 'validate_invoice({"customer_id": 1})'],
          ['Total is not a valid number', 'validate_invoice({"customer_id": 1, "total": "abc"})'],
          ['Both fields missing', 'validate_invoice({})'],
          ['An unexpected extra field is ignored', 'validate_invoice({"customer_id": 1, "total": 5.0, "note": "hi"})'],
          ['Numeric strings are coerced', 'validate_invoice({"customer_id": "2", "total": "3.5"})'],
        ],
        traps: [
          py`from pydantic import BaseModel, ValidationError

class Invoice(BaseModel):
    customer_id: int
    total: float

def validate_invoice(data):
    return [f for f in ["customer_id", "total"] if f not in data]`,
          py`from pydantic import BaseModel, ValidationError

class Invoice(BaseModel):
    customer_id: int
    total: float

def validate_invoice(data):
    try:
        Invoice(**data)
        return []
    except ValidationError as e:
        return e.errors()`,
        ],
      },
      real: [
        pro({
          title: 'Validating real Chinook customers',
          use: ['customers'],
          starter: 'from pydantic import BaseModel, ValidationError\n\nclass CustomerModel(BaseModel):\n    ...\n\ndef validate_customer(data):\n    ...\n\nrow = customers[0]\nvalid = {"first_name": row["FirstName"], "last_name": row["LastName"], "country": row["Country"]}\nanswer = validate_customer(valid)\n',
          given: '# customers is a list of dictionaries; valid is built from real, complete data from the first row.',
          brief: 'Define `CustomerModel` with `first_name: str`, `last_name: str`, `country: str`. Write `validate_customer(data)` exactly like `validate_invoice` (empty list on success, list of bad field names on failure). Store the result for `valid` in `answer` (it should pass).',
          reference: py`from pydantic import BaseModel, ValidationError

class CustomerModel(BaseModel):
    first_name: str
    last_name: str
    country: str

def validate_customer(data):
    try:
        CustomerModel(**data)
        return []
    except ValidationError as e:
        return [err["loc"][0] for err in e.errors()]

row = customers[0]
valid = {"first_name": row["FirstName"], "last_name": row["LastName"], "country": row["Country"]}
answer = validate_customer(valid)`,
          walkthrough: 'Real, well-formed data should always validate cleanly — this checks the happy path actually stays happy once the model is hooked up to real records.',
          traps: [py`from pydantic import BaseModel, ValidationError

class CustomerModel(BaseModel):
    first_name: str
    last_name: str
    country: str

def validate_customer(data):
    try:
        CustomerModel(**data)
        return ["ok"]
    except ValidationError as e:
        return [err["loc"][0] for err in e.errors()]

row = customers[0]
valid = {"first_name": row["FirstName"], "last_name": row["LastName"], "country": row["Country"]}
answer = validate_customer(valid)`],
        }),
        pro({
          title: 'Catching a missing field from real data',
          use: ['customers'],
          starter: 'from pydantic import BaseModel, ValidationError\n\nclass CustomerModel(BaseModel):\n    ...\n\ndef validate_customer(data):\n    ...\n\nrow = customers[1]\nincomplete = {"first_name": row["FirstName"], "country": row["Country"]}\nanswer = validate_customer(incomplete)\n',
          given: '# customers is a list of dictionaries; incomplete deliberately drops last_name.',
          brief: 'Same `CustomerModel`/`validate_customer` as before. Store the result for `incomplete` in `answer` (it should report the missing field).',
          reference: py`from pydantic import BaseModel, ValidationError

class CustomerModel(BaseModel):
    first_name: str
    last_name: str
    country: str

def validate_customer(data):
    try:
        CustomerModel(**data)
        return []
    except ValidationError as e:
        return [err["loc"][0] for err in e.errors()]

row = customers[1]
incomplete = {"first_name": row["FirstName"], "country": row["Country"]}
answer = validate_customer(incomplete)`,
          walkthrough: 'pydantic reports precisely which field is missing, which is what makes it useful for real ingestion pipelines: the error tells you exactly what to fix, not just that "something" was wrong.',
          traps: [py`row = customers[1]
incomplete = {"first_name": row["FirstName"], "country": row["Country"]}

def validate_customer(data):
    return [] if "first_name" in data else ["first_name"]

answer = validate_customer(incomplete)`],
        }),
        pro({
          title: 'Coercing real invoice totals',
          use: ['invoices'],
          starter: 'from pydantic import BaseModel, ValidationError\n\nclass Invoice(BaseModel):\n    customer_id: int\n    total: float\n\ndef validate_invoice(data):\n    ...\n\nrow = invoices[0]\nas_strings = {"customer_id": str(row["CustomerId"]), "total": str(row["Total"])}\nanswer = validate_invoice(as_strings)\n',
          given: '# invoices is a list of dictionaries; as_strings holds the same real values, but converted to strings (as they might arrive from a CSV or form).',
          brief: 'Write `validate_invoice` as in the lesson. Store the result for `as_strings` in `answer` (pydantic should coerce both back to numbers and accept it).',
          reference: py`from pydantic import BaseModel, ValidationError

class Invoice(BaseModel):
    customer_id: int
    total: float

def validate_invoice(data):
    try:
        Invoice(**data)
        return []
    except ValidationError as e:
        return [err["loc"][0] for err in e.errors()]

row = invoices[0]
as_strings = {"customer_id": str(row["CustomerId"]), "total": str(row["Total"])}
answer = validate_invoice(as_strings)`,
          walkthrough: 'pydantic coerces a numeric-looking string into the declared type automatically — exactly the kind of "data arrived slightly wrong-shaped" problem it is meant to absorb at the boundary of a system.',
          traps: [py`from pydantic import BaseModel, ValidationError

class Invoice(BaseModel):
    customer_id: int
    total: float

def validate_invoice(data):
    return [] if isinstance(data.get("total"), float) else ["total"]

row = invoices[0]
as_strings = {"customer_id": str(row["CustomerId"]), "total": str(row["Total"])}
answer = validate_invoice(as_strings)`],
        }),
      ],
    },
  ],
  checkpoint: [],
}
