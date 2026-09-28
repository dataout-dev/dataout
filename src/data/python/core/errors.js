import { py, chi } from './common.js'

const LOGGER_SETUP = py`import io, logging
stream = io.StringIO()
logger = logging.getLogger("audit")
logger.handlers.clear()
logger.propagate = False
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(stream)
handler.setFormatter(logging.Formatter("%(levelname)s:%(message)s"))
logger.addHandler(handler)
`

export const errorsDebugging = {
  id: 'errors-debugging-logging',
  title: 'Errors, debugging and logging',
  intro: 'Programs that fail well and are easy to fix.',
  lessons: [
    {
      id: 'py-exception-hierarchy',
      title: 'Exceptions and the exception hierarchy',
      blurb: 'How errors travel, the family tree and reading a traceback.',
      kind: 'learn',
      check: [
        {
          q: 'A function raises a `KeyError`. Which `except` clause catches it?',
          options: ['`except IndexError`', '`except LookupError`', '`except ArithmeticError`', '`except OSError`'],
          answer: 1,
          why: '`KeyError` and `IndexError` are both children of `LookupError`, so an `except LookupError` catches either of them.',
        },
        {
          q: 'Why is `except BaseException:` (or a bare `except:`) a bad idea?',
          options: [
            'It is slower',
            'It also catches `KeyboardInterrupt` and `SystemExit`, so the program cannot be stopped',
            'It only works in functions',
            'It is not allowed by Python',
          ],
          answer: 1,
          why: 'Exit signals are children of `BaseException` but not of `Exception`. Catch `Exception` at most, and specific classes when you can.',
        },
        {
          q: 'What does this print?\n\n```python\ntry:\n    {}["x"]\nexcept LookupError:\n    print("A")\nexcept KeyError:\n    print("B")\n```',
          options: ['`A`', '`B`', '`A` and `B`', 'Nothing'],
          answer: 0,
          why: 'The clauses are checked from top to bottom, and the first that fits is used. `KeyError` is a `LookupError`, so `A` runs, and the `KeyError` clause can never be reached.',
        },
        {
          q: 'A traceback says: "The above exception was the direct cause of the following exception". What does it mean?',
          options: [
            'The program has a syntax error',
            'The code used `raise ... from ...` to link a new error to the one that caused it',
            'Two threads failed at the same time',
            'The first error was ignored',
          ],
          answer: 1,
          why: '`raise NewError() from error` records the cause, and the traceback shows both. Read from the bottom to see the final error first.',
        },
        {
          q: 'Which is a **subclass** of `ArithmeticError`?',
          options: ['`KeyError`', '`ZeroDivisionError`', '`TypeError`', '`FileNotFoundError`'],
          answer: 1,
          why: '`ZeroDivisionError`, `OverflowError` and `FloatingPointError` are the arithmetic errors.',
        },
      ],
    },
    {
      id: 'py-try-except',
      title: 'try, except, else and finally patterns',
      blurb: 'Specific handlers, else, finally, EAFP versus LBYL and re-raising.',
      kind: 'code',
      practice: {
        prompt: 'Write `parse_int(s, default=None)`. It converts the text `s` to an **integer** with `int`. If that is **not possible**, it returns `default`.\n\nThe input can be text of any kind, or `None`. Text such as `"3.5"`, `"abc"` and `""` cannot be converted. Spaces around a whole number are allowed (`" 9 "` is 9).',
        starter: 'def parse_int(s, default=None):\n    ...\n',
        solution: py`def parse_int(s, default=None):
    try:
        return int(s)
    except (ValueError, TypeError):
        return default`,
        samples: ['parse_int("42")', 'parse_int("abc", 0)'],
        cases: [
          ['A number', 'parse_int("42")'],
          ['A negative number', 'parse_int("-7")'],
          ['Spaces around it', 'parse_int(" 9 ")'],
          ['A decimal is not an integer', 'parse_int("3.5")'],
          ['Not a number', 'parse_int("abc")'],
          ['An empty text', 'parse_int("")'],
          ['None', 'parse_int(None)'],
          ['A default value', 'parse_int("x", 0)'],
          ['A default that is not needed', 'parse_int("12", 0)'],
          ['Hexadecimal text is not base 10', 'parse_int("0x1f", -1)'],
        ],
        traps: [
          py`def parse_int(s, default=None):
    try:
        return int(s)
    except ValueError:
        return default`,
          py`def parse_int(s, default=None):
    try:
        return int(s)
    except (ValueError, TypeError):
        return None`,
          py`def parse_int(s, default=None):
    try:
        return int(float(s))
    except (ValueError, TypeError):
        return default`,
          py`def parse_int(s, default=None):
    if isinstance(s, str) and s.isdigit():
        return int(s)
    return default`,
        ],
      },
      real: [
        chi({
          title: 'Add up messy numbers',
          use: ['tracks'],
          hidden: 'raw = [str(t["Milliseconds"]) for t in tracks[:5]] + ["", "n/a", None, "12.5", "-3", " 7 ", "1_000"]\n',
          given: '# raw is a list of values: mostly text with a whole number in it, but some are empty, None, or not whole numbers.',
          brief: 'Convert each value of `raw` with `int`. Values that cannot be converted (**both** the wrong kind of text and the wrong type) are **skipped**. Store the **sum** of the numbers that could be converted in `answer`.',
          reference: py`answer = 0
for value in raw:
    try:
        answer += int(value)
    except (ValueError, TypeError):
        pass`,
          walkthrough: '`int("n/a")` raises a `ValueError` and `int(None)` raises a `TypeError`, so both are named in the `except`. `int` accepts spaces around the number and underscores between digits.',
          traps: [py`answer = 0
for value in raw:
    try:
        answer += int(value)
    except ValueError:
        pass`, py`answer = 0
for value in raw:
    if isinstance(value, str) and value.isdigit():
        answer += int(value)`],
        }),
        chi({
          title: 'Dates with a fallback',
          use: ['invoices'],
          hidden: 'from datetime import datetime\ndates = [inv["InvoiceDate"] for inv in invoices[:4]] + ["not a date", "2010-13-45 00:00:00", "", None]\n',
          given: '# dates is a list of values. Good ones look like "2009-01-01 00:00:00". datetime is already imported.',
          brief: 'Read each value with `datetime.strptime(value, "%Y-%m-%d %H:%M:%S")`. Store in `answer` the list of the **years** (`.year`), with `None` for every value that cannot be read (wrong format, impossible date **or** wrong type).',
          reference: py`answer = []
for value in dates:
    try:
        answer.append(datetime.strptime(value, "%Y-%m-%d %H:%M:%S").year)
    except (ValueError, TypeError):
        answer.append(None)`,
          walkthrough: 'A badly formed text or an impossible date such as month 13 raises `ValueError`, while `None` raises `TypeError`. Both are handled, and the list keeps its length.',
          traps: [py`answer = []
for value in dates:
    try:
        answer.append(datetime.strptime(value, "%Y-%m-%d %H:%M:%S").year)
    except ValueError:
        answer.append(None)`, py`answer = []
for value in dates:
    try:
        answer.append(datetime.strptime(value, "%Y-%m-%d %H:%M:%S").month)
    except (ValueError, TypeError):
        answer.append(None)`],
        }),
        chi({
          title: 'Unknown genres',
          use: ['tracks', 'genres'],
          hidden: 'names = {g["GenreId"]: g["Name"] for g in genres}\nids = [t["GenreId"] for t in tracks[:100]] + [999, 1000, 1001]\n',
          given: '# names maps a GenreId to a genre name. ids is a list of GenreId values, and a few of them are unknown.',
          brief: 'Look up every id in `names` by **trying it** (`names[gid]`) and catching the `KeyError`, rather than checking with `in`. Store in `answer` a tuple: the number of ids that were **found**, and the number that were **missing**.',
          reference: py`found = 0
missing = 0
for gid in ids:
    try:
        names[gid]
    except KeyError:
        missing += 1
    else:
        found += 1
answer = (found, missing)`,
          walkthrough: 'The `else` clause runs only when the `try` block did not raise, so it is a tidy place to count the successes.',
          traps: [py`found = 0
missing = 0
for gid in ids:
    try:
        names[gid]
    except KeyError:
        missing += 1
    found += 1
answer = (found, missing)`, py`found = 0
missing = 0
for gid in ids:
    try:
        names[gid]
    except KeyError:
        missing += 1
    else:
        found += 1
answer = (missing, found)`],
        }),
      ],
    },
    {
      id: 'py-raise-custom',
      title: 'Raising, chaining and custom exceptions; ExceptionGroup',
      blurb: 'raise, raise from, custom classes and except*.',
      kind: 'code',
      practice: {
        prompt: 'Write three things.\n\n**1.** A class `ValidationError` that is a kind of `ValueError`. Its constructor takes `field` and `message`. It stores them as attributes `field` and `message`, and `str(error)` is `"field: message"`.\n\n**2.** A function `validate(user)` that checks a dictionary and **raises** `ValidationError` for the **first** problem, in this order:\n- `name` missing, not text, or only spaces: field `"name"`, message `"is required"`\n- `age` missing: field `"age"`, message `"is required"`\n- `age` not an integer (`True` is not accepted either): `"must be an integer"`\n- `age` below 0 or above 150: `"must be between 0 and 150"`\n\nIf everything is fine, it returns the dictionary.\n\n**3.** A function `problem(user)` that returns `str(error)` for the error `validate` raises, or `None` when the user is valid.',
        starter: 'class ValidationError(ValueError):\n    ...\n\ndef validate(user):\n    ...\n\ndef problem(user):\n    ...\n',
        solution: py`class ValidationError(ValueError):
    def __init__(self, field, message):
        super().__init__(f"{field}: {message}")
        self.field = field
        self.message = message

def validate(user):
    name = user.get("name")
    if not isinstance(name, str) or not name.strip():
        raise ValidationError("name", "is required")
    if "age" not in user:
        raise ValidationError("age", "is required")
    age = user["age"]
    if isinstance(age, bool) or not isinstance(age, int):
        raise ValidationError("age", "must be an integer")
    if not 0 <= age <= 150:
        raise ValidationError("age", "must be between 0 and 150")
    return user

def problem(user):
    try:
        validate(user)
    except ValidationError as error:
        return str(error)
    return None`,
        samples: ['problem({"name": "Ada", "age": 36})', 'problem({"name": "", "age": 36})'],
        cases: [
          ['The text of an error', 'str(ValidationError("age", "must be a number"))'],
          ['The field', 'ValidationError("x", "y").field'],
          ['The message', 'ValidationError("x", "y").message'],
          ['It is a ValueError', 'issubclass(ValidationError, ValueError)'],
          ['A valid user', 'problem({"name": "Ada", "age": 36})'],
          ['An empty name', 'problem({"name": "", "age": 36})'],
          ['A missing name', 'problem({"age": 36})'],
          ['A name of spaces', 'problem({"name": "   ", "age": 36})'],
          ['A missing age', 'problem({"name": "Ada"})'],
          ['An age of the wrong type', 'problem({"name": "Ada", "age": "36"})'],
          ['A boolean age', 'problem({"name": "Ada", "age": True})'],
          ['An age too low', 'problem({"name": "Ada", "age": -1})'],
          ['An age too high', 'problem({"name": "Ada", "age": 151})'],
          ['Two problems, the first one is reported', 'problem({"name": "", "age": -5})'],
          ['validate returns the user', 'validate({"name": "Bo", "age": 0})'],
        ],
        traps: [
          py`class ValidationError(Exception):
    def __init__(self, field, message):
        super().__init__(f"{field}: {message}")
        self.field = field
        self.message = message

def validate(user):
    name = user.get("name")
    if not isinstance(name, str) or not name.strip():
        raise ValidationError("name", "is required")
    if "age" not in user:
        raise ValidationError("age", "is required")
    age = user["age"]
    if isinstance(age, bool) or not isinstance(age, int):
        raise ValidationError("age", "must be an integer")
    if not 0 <= age <= 150:
        raise ValidationError("age", "must be between 0 and 150")
    return user

def problem(user):
    try:
        validate(user)
    except ValidationError as error:
        return str(error)
    return None`,
          py`class ValidationError(ValueError):
    def __init__(self, field, message):
        super().__init__(message)
        self.field = field
        self.message = message

def validate(user):
    name = user.get("name")
    if not isinstance(name, str) or not name.strip():
        raise ValidationError("name", "is required")
    if "age" not in user:
        raise ValidationError("age", "is required")
    age = user["age"]
    if isinstance(age, bool) or not isinstance(age, int):
        raise ValidationError("age", "must be an integer")
    if not 0 <= age <= 150:
        raise ValidationError("age", "must be between 0 and 150")
    return user

def problem(user):
    try:
        validate(user)
    except ValidationError as error:
        return str(error)
    return None`,
          py`class ValidationError(ValueError):
    def __init__(self, field, message):
        super().__init__(f"{field}: {message}")
        self.field = field
        self.message = message

def validate(user):
    if "age" not in user:
        raise ValidationError("age", "is required")
    age = user["age"]
    if isinstance(age, bool) or not isinstance(age, int):
        raise ValidationError("age", "must be an integer")
    if not 0 <= age <= 150:
        raise ValidationError("age", "must be between 0 and 150")
    name = user.get("name")
    if not isinstance(name, str) or not name.strip():
        raise ValidationError("name", "is required")
    return user

def problem(user):
    try:
        validate(user)
    except ValidationError as error:
        return str(error)
    return None`,
          py`class ValidationError(ValueError):
    def __init__(self, field, message):
        super().__init__(f"{field}: {message}")
        self.field = field
        self.message = message

def validate(user):
    name = user.get("name")
    if not isinstance(name, str) or not name.strip():
        raise ValidationError("name", "is required")
    if "age" not in user:
        raise ValidationError("age", "is required")
    age = user["age"]
    if not isinstance(age, int):
        raise ValidationError("age", "must be an integer")
    if not 0 <= age <= 150:
        raise ValidationError("age", "must be between 0 and 150")
    return user

def problem(user):
    try:
        validate(user)
    except ValidationError as error:
        return str(error)
    return None`,
          py`class ValidationError(ValueError):
    def __init__(self, field, message):
        super().__init__(f"{field}: {message}")
        self.field = field
        self.message = message

def validate(user):
    name = user.get("name")
    if not isinstance(name, str) or not name.strip():
        raise ValidationError("name", "is required")
    if "age" not in user:
        raise ValidationError("age", "is required")
    age = user["age"]
    if isinstance(age, bool) or not isinstance(age, int):
        raise ValidationError("age", "must be an integer")
    if not 0 <= age <= 150:
        raise ValidationError("age", "must be between 0 and 150")

def problem(user):
    try:
        validate(user)
    except ValidationError as error:
        return str(error)
    return None`,
        ],
      },
      real: [
        chi({
          title: 'Count the invalid tracks',
          use: ['tracks'],
          hidden: 'class ValidationError(ValueError):\n    pass\n',
          starter: 'def validate_track(track):\n    ...\n\nanswer = 0\nfor t in tracks:\n    try:\n        validate_track(t)\n    except ValidationError:\n        answer += 1\n',
          given: '# ValidationError is already defined. The loop at the bottom counts how many tracks are rejected.',
          brief: 'Write `validate_track(track)`. It **raises** `ValidationError` with a helpful message when the track is **shorter than 60 seconds** (`Milliseconds` below 60 000) **or** has **no `Composer`** (`None`). Otherwise it does nothing. The loop counts the rejected tracks.',
          reference: py`def validate_track(track):
    if track["Milliseconds"] < 60_000:
        raise ValidationError(f"track {track['TrackId']} is too short")
    if track["Composer"] is None:
        raise ValidationError(f"track {track['TrackId']} has no composer")

answer = 0
for t in tracks:
    try:
        validate_track(t)
    except ValidationError:
        answer += 1`,
          walkthrough: 'The function checks each rule and raises at the first one that fails. The caller catches the custom class, so other errors, such as a missing key, are still reported as bugs.',
          traps: [py`def validate_track(track):
    if track["Milliseconds"] < 30_000:
        raise ValidationError("too short")
    if track["Composer"] is None:
        raise ValidationError("no composer")

answer = 0
for t in tracks:
    try:
        validate_track(t)
    except ValidationError:
        answer += 1`, py`def validate_track(track):
    if track["Milliseconds"] < 60_000:
        raise ValidationError("too short")

answer = 0
for t in tracks:
    try:
        validate_track(t)
    except ValidationError:
        answer += 1`],
        }),
        chi({
          title: 'Keep the cause',
          use: ['genres'],
          hidden: 'names = {g["GenreId"]: g["Name"] for g in genres}\n',
          starter: 'def genre_name(genre_id):\n    ...\n\nanswer = []\nfor gid in (1, 2, 999):\n    try:\n        answer.append(genre_name(gid))\n    except ValueError as error:\n        answer.append(f"{type(error).__name__}: {error} (caused by {type(error.__cause__).__name__})")\n',
          given: '# names maps a GenreId to its name. The loop at the bottom reports the error and its cause.',
          brief: 'Write `genre_name(genre_id)`. It returns the name from `names`. When the id is unknown, it must raise `ValueError("unknown genre <id>")` **from** the original `KeyError`, so that the cause is kept.',
          reference: py`def genre_name(genre_id):
    try:
        return names[genre_id]
    except KeyError as error:
        raise ValueError(f"unknown genre {genre_id}") from error

answer = []
for gid in (1, 2, 999):
    try:
        answer.append(genre_name(gid))
    except ValueError as error:
        answer.append(f"{type(error).__name__}: {error} (caused by {type(error.__cause__).__name__})")`,
          walkthrough: '`raise ... from error` stores the original exception in `__cause__`. Without `from`, the cause would be `None`, and the traceback would only say "during handling of the above exception".',
          traps: [py`def genre_name(genre_id):
    try:
        return names[genre_id]
    except KeyError:
        raise ValueError(f"unknown genre {genre_id}")

answer = []
for gid in (1, 2, 999):
    try:
        answer.append(genre_name(gid))
    except ValueError as error:
        answer.append(f"{type(error).__name__}: {error} (caused by {type(error.__cause__).__name__})")`, py`def genre_name(genre_id):
    try:
        return names[genre_id]
    except KeyError as error:
        raise ValueError("unknown genre") from error

answer = []
for gid in (1, 2, 999):
    try:
        answer.append(genre_name(gid))
    except ValueError as error:
        answer.append(f"{type(error).__name__}: {error} (caused by {type(error.__cause__).__name__})")`],
        }),
        chi({
          title: 'Report all the errors at once',
          hidden: 'values = [5, -2, "x", 7, -9, None, 3.5]\n',
          starter: 'def check_all(values):\n    errors = []\n    # add a ValueError for each negative whole number,\n    # and a TypeError for each value that is not an int\n    ...\n    if errors:\n        raise ExceptionGroup("bad values", errors)\n\ncounts = {"value": 0, "type": 0}\ntry:\n    check_all(values)\nexcept* ValueError as group:\n    ...\nexcept* TypeError as group:\n    ...\nanswer = counts\n',
          given: '# values is a list. Each item should be a whole number that is not negative.',
          brief: 'Finish `check_all`: for every value that is not an `int` add a `TypeError`; for every negative `int` add a `ValueError`. Then raise them all together in one `ExceptionGroup`. In the two `except*` clauses, count how many exceptions of each kind arrived (`group.exceptions`), in `counts["value"]` and `counts["type"]`.',
          reference: py`def check_all(values):
    errors = []
    for v in values:
        if not isinstance(v, int):
            errors.append(TypeError(f"{v!r} is not an int"))
        elif v < 0:
            errors.append(ValueError(f"{v} is negative"))
    if errors:
        raise ExceptionGroup("bad values", errors)

counts = {"value": 0, "type": 0}
try:
    check_all(values)
except* ValueError as group:
    counts["value"] = len(group.exceptions)
except* TypeError as group:
    counts["type"] = len(group.exceptions)
answer = counts`,
          walkthrough: 'Collecting the errors in a list and raising them together reports every problem, not only the first. Each `except*` clause receives a group that holds only the exceptions of its own type.',
          traps: [py`def check_all(values):
    errors = []
    for v in values:
        if not isinstance(v, int):
            errors.append(TypeError(f"{v!r} is not an int"))
        elif v < 0:
            errors.append(ValueError(f"{v} is negative"))
    if errors:
        raise ExceptionGroup("bad values", errors)

counts = {"value": 0, "type": 0}
try:
    check_all(values)
except* ValueError as group:
    counts["value"] = 1
except* TypeError as group:
    counts["type"] = 1
answer = counts`, py`def check_all(values):
    errors = []
    for v in values:
        if isinstance(v, str) or v is None:
            errors.append(TypeError(f"{v!r} is not an int"))
        elif v < 0:
            errors.append(ValueError(f"{v} is negative"))
    if errors:
        raise ExceptionGroup("bad values", errors)

counts = {"value": 0, "type": 0}
try:
    check_all(values)
except* ValueError as group:
    counts["value"] = len(group.exceptions)
except* TypeError as group:
    counts["type"] = len(group.exceptions)
answer = counts`],
        }),
      ],
    },
    {
      id: 'py-assertions',
      title: 'Assertions and defensive programming',
      blurb: 'assert, preconditions, fail-fast and validating at the boundary.',
      kind: 'code',
      practice: {
        prompt: 'Write `check_config(cfg)`. It returns the **list of all the problems** found in a configuration, as texts, or an empty list when it is fine. It **collects** the problems and does not stop at the first one.\n\n- If `cfg` is not a dictionary, return `["config must be a dictionary"]` and stop.\n- `"host"` must be a non-empty text: otherwise `"host must be a non-empty string"`.\n- `"port"` must be an integer (not `True` or `False`): otherwise `"port must be an integer"`. An integer outside 1 to 65535 gives `"port must be between 1 and 65535"`.\n- `"debug"` is optional, but when present it must be `True` or `False`: otherwise `"debug must be true or false"`.\n- Any other key gives `"unknown key: <key>"`, sorted by key, after the problems above.',
        starter: 'def check_config(cfg):\n    ...\n',
        solution: py`def check_config(cfg):
    if not isinstance(cfg, dict):
        return ["config must be a dictionary"]
    problems = []
    host = cfg.get("host")
    if not isinstance(host, str) or not host:
        problems.append("host must be a non-empty string")
    port = cfg.get("port")
    if isinstance(port, bool) or not isinstance(port, int):
        problems.append("port must be an integer")
    elif not 1 <= port <= 65535:
        problems.append("port must be between 1 and 65535")
    if "debug" in cfg and not isinstance(cfg["debug"], bool):
        problems.append("debug must be true or false")
    for key in sorted(cfg):
        if key not in ("host", "port", "debug"):
            problems.append(f"unknown key: {key}")
    return problems`,
        samples: ['check_config({"host": "localhost", "port": 8080})', 'check_config({})'],
        cases: [
          ['A valid configuration', 'check_config({"host": "localhost", "port": 8080})'],
          ['A valid one with debug', 'check_config({"host": "a.org", "port": 1, "debug": False})'],
          ['Everything missing', 'check_config({})'],
          ['An empty host', 'check_config({"host": "", "port": 80})'],
          ['A port that is text', 'check_config({"host": "h", "port": "80"})'],
          ['A port of zero', 'check_config({"host": "h", "port": 0})'],
          ['A port that is too large', 'check_config({"host": "h", "port": 70000})'],
          ['A boolean port', 'check_config({"host": "h", "port": True})'],
          ['A debug that is not a boolean', 'check_config({"host": "h", "port": 80, "debug": "yes"})'],
          ['Unknown keys are sorted', 'check_config({"host": "h", "port": 80, "zeta": 1, "alpha": 2})'],
          ['Several problems at once', 'check_config({"port": 0, "debug": 1, "x": 1})'],
          ['Not a dictionary', 'check_config(["host"])'],
        ],
        traps: [
          py`def check_config(cfg):
    if not isinstance(cfg, dict):
        return ["config must be a dictionary"]
    host = cfg.get("host")
    if not isinstance(host, str) or not host:
        return ["host must be a non-empty string"]
    port = cfg.get("port")
    if isinstance(port, bool) or not isinstance(port, int):
        return ["port must be an integer"]
    if not 1 <= port <= 65535:
        return ["port must be between 1 and 65535"]
    if "debug" in cfg and not isinstance(cfg["debug"], bool):
        return ["debug must be true or false"]
    return [f"unknown key: {key}" for key in sorted(cfg) if key not in ("host", "port", "debug")]`,
          py`def check_config(cfg):
    if not isinstance(cfg, dict):
        return ["config must be a dictionary"]
    problems = []
    host = cfg.get("host")
    if not isinstance(host, str) or not host:
        problems.append("host must be a non-empty string")
    port = cfg.get("port")
    if not isinstance(port, int):
        problems.append("port must be an integer")
    elif not 1 <= port <= 65535:
        problems.append("port must be between 1 and 65535")
    if "debug" in cfg and not isinstance(cfg["debug"], bool):
        problems.append("debug must be true or false")
    for key in sorted(cfg):
        if key not in ("host", "port", "debug"):
            problems.append(f"unknown key: {key}")
    return problems`,
          py`def check_config(cfg):
    if not isinstance(cfg, dict):
        return ["config must be a dictionary"]
    problems = []
    host = cfg.get("host")
    if not isinstance(host, str) or not host:
        problems.append("host must be a non-empty string")
    port = cfg.get("port")
    if isinstance(port, bool) or not isinstance(port, int):
        problems.append("port must be an integer")
    elif not 1 <= port <= 65535:
        problems.append("port must be between 1 and 65535")
    if "debug" in cfg and not isinstance(cfg["debug"], bool):
        problems.append("debug must be true or false")
    for key in cfg:
        if key not in ("host", "port", "debug"):
            problems.append(f"unknown key: {key}")
    return problems`,
          py`def check_config(cfg):
    problems = []
    host = cfg.get("host")
    if not isinstance(host, str) or not host:
        problems.append("host must be a non-empty string")
    port = cfg.get("port")
    if isinstance(port, bool) or not isinstance(port, int):
        problems.append("port must be an integer")
    elif not 1 <= port <= 65535:
        problems.append("port must be between 1 and 65535")
    if "debug" in cfg and not isinstance(cfg["debug"], bool):
        problems.append("debug must be true or false")
    for key in sorted(cfg):
        if key not in ("host", "port", "debug"):
            problems.append(f"unknown key: {key}")
    return problems`,
          py`def check_config(cfg):
    if not isinstance(cfg, dict):
        return ["config must be a dictionary"]
    problems = []
    host = cfg.get("host")
    if not isinstance(host, str) or not host:
        problems.append("host must be a non-empty string")
    port = cfg.get("port")
    if isinstance(port, bool) or not isinstance(port, int):
        problems.append("port must be an integer")
    elif not 1 < port < 65535:
        problems.append("port must be between 1 and 65535")
    if "debug" in cfg and not isinstance(cfg["debug"], bool):
        problems.append("debug must be true or false")
    for key in sorted(cfg):
        if key not in ("host", "port", "debug"):
            problems.append(f"unknown key: {key}")
    return problems`,
        ],
      },
      real: [
        chi({
          title: 'A precondition with assert',
          use: ['tracks'],
          starter: 'def average_price(items):\n    ...\n\nanswer = []\nfor group in (tracks[:3], [], tracks[3:6]):\n    try:\n        answer.append(round(average_price(group), 2))\n    except AssertionError as error:\n        answer.append(str(error))\n',
          given: '# The loop at the bottom calls average_price on three lists. One of them is empty.',
          brief: 'Write `average_price(items)`: the mean of the `UnitPrice` of the items. Start with an `assert` that the list is **not empty**, with the message `"no items"`, so that an empty list gives that message and not a `ZeroDivisionError`.',
          reference: py`def average_price(items):
    assert items, "no items"
    return sum(i["UnitPrice"] for i in items) / len(items)

answer = []
for group in (tracks[:3], [], tracks[3:6]):
    try:
        answer.append(round(average_price(group), 2))
    except AssertionError as error:
        answer.append(str(error))`,
          walkthrough: 'The assertion states the precondition and fails early with a clear message. Its message becomes the text of the `AssertionError`.',
          traps: [py`def average_price(items):
    if not items:
        return 0
    return sum(i["UnitPrice"] for i in items) / len(items)

answer = []
for group in (tracks[:3], [], tracks[3:6]):
    try:
        answer.append(round(average_price(group), 2))
    except AssertionError as error:
        answer.append(str(error))`, py`def average_price(items):
    assert items, "empty"
    return sum(i["UnitPrice"] for i in items) / len(items)

answer = []
for group in (tracks[:3], [], tracks[3:6]):
    try:
        answer.append(round(average_price(group), 2))
    except AssertionError as error:
        answer.append(str(error))`],
        }),
        chi({
          title: 'Count the broken assumptions',
          use: ['tracks'],
          starter: 'answer = 0\nfor t in tracks:\n    try:\n        ...\n    except AssertionError:\n        answer += 1\n',
          given: '# Some tracks have no Composer. The loop below counts the assertion failures.',
          brief: 'Inside the `try`, write an `assert` that the track **has a composer** (`Composer` is not `None`) **and** that its length is **at least 10 seconds** (`Milliseconds` of 10 000 or more). The loop counts the tracks that break the assumption.',
          reference: py`answer = 0
for t in tracks:
    try:
        assert t["Composer"] is not None and t["Milliseconds"] >= 10_000, "bad track"
    except AssertionError:
        answer += 1`,
          walkthrough: 'Both rules are one condition joined with `and`. A track that breaks either rule raises `AssertionError`, and is counted.',
          traps: [py`answer = 0
for t in tracks:
    try:
        assert t["Composer"] is not None, "no composer"
    except AssertionError:
        answer += 1`, py`answer = 0
for t in tracks:
    try:
        assert t["Composer"] is not None or t["Milliseconds"] >= 10_000, "bad track"
    except AssertionError:
        answer += 1`],
        }),
        chi({
          title: 'Which customers need attention?',
          use: ['customers'],
          starter: 'def customer_problems(customer):\n    ...\n\nanswer = sum(1 for c in customers if customer_problems(c))\n',
          given: '# customers is a list of dictionaries. Missing values are None.',
          brief: 'Write `customer_problems(customer)`. It returns a **list of problem texts**, collecting them all: `"no phone"` when `Phone` is `None`, `"no postal code"` when `PostalCode` is `None`, and `"no company"` when `Company` is `None`. The last line counts the customers with at least one problem.',
          reference: py`def customer_problems(customer):
    problems = []
    if customer["Phone"] is None:
        problems.append("no phone")
    if customer["PostalCode"] is None:
        problems.append("no postal code")
    if customer["Company"] is None:
        problems.append("no company")
    return problems

answer = sum(1 for c in customers if customer_problems(c))`,
          walkthrough: 'Every rule is checked independently, and the list collects the results. An empty list is false, so the sum counts only the customers that have problems.',
          traps: [py`def customer_problems(customer):
    problems = []
    if customer["Phone"] is None:
        problems.append("no phone")
    return problems

answer = sum(1 for c in customers if customer_problems(c))`, py`def customer_problems(customer):
    problems = []
    if customer["Phone"] is None:
        problems.append("no phone")
    if customer["PostalCode"] is None:
        problems.append("no postal code")
    return problems

answer = sum(1 for c in customers if customer_problems(c))`],
        }),
      ],
    },
    {
      id: 'py-debugging',
      title: 'Debugging: pdb, tracebacks and a debugging routine',
      blurb: 'A routine, reading tracebacks, print debugging and pdb.',
      kind: 'learn',
      check: [
        {
          q: 'What is the very **first** step of a debugging routine?',
          options: [
            'Rewrite the whole function',
            'Reproduce the bug reliably with the smallest input that shows it',
            'Search the web for the error message',
            'Add try/except everywhere',
          ],
          answer: 1,
          why: 'If you cannot make the bug happen on demand, you cannot know whether a change has fixed it.',
        },
        {
          q: 'Where should you start reading a traceback?',
          options: ['At the top', 'At the bottom: the last line names the error, and the frame above it is where it happened', 'In the middle', 'It does not matter'],
          answer: 1,
          why: 'The last line has the exception type and message. Then look for the last frame that is in your own code.',
        },
        {
          q: 'What does `print(f"{total=}")` show when `total` is 12?',
          options: ['`12`', '`total=12`', '`"total"`', 'An error'],
          answer: 1,
          why: 'The `=` in an f-string prints the expression as well as its value, which is a very quick way to label debugging output.',
        },
        {
          q: 'In `pdb`, which command runs the next line and **steps into** a function call?',
          options: ['`n`', '`s`', '`c`', '`q`'],
          answer: 1,
          why: '`s` (step) goes into calls, `n` (next) steps over them, `c` continues to the next breakpoint, and `q` quits.',
        },
        {
          q: 'Why is it a bad idea to change several things at once when you debug?',
          options: [
            'Python does not allow it',
            'You cannot tell which change mattered, and you can add new bugs',
            'It makes the program slower',
            'The debugger stops working',
          ],
          answer: 1,
          why: 'Change one thing and test. Then you know exactly what fixed (or broke) the program.',
        },
      ],
    },
    {
      id: 'py-logging',
      title: 'The logging module',
      blurb: 'Levels, loggers, handlers, formatters and dictConfig.',
      kind: 'code',
      practice: {
        prompt: 'Write `log_lines(records)`. Each record is a pair `(level, text)`, where the level is one of `"debug"`, `"info"`, `"warning"`, `"error"` or `"critical"`.\n\nUse the `logging` module: a logger named `"app"` with the threshold **INFO**, whose only handler writes to a `StringIO` buffer, with the format `"%(levelname)s %(name)s: %(message)s"`. Log every record at its level. Return the **list of lines** that were written (so `debug` records do not appear).\n\nCalling the function twice must give **independent** results, with no repeated lines.',
        starter: 'import io\nimport logging\n\ndef log_lines(records):\n    ...\n',
        solution: py`import io
import logging

def log_lines(records):
    stream = io.StringIO()
    logger = logging.getLogger("app")
    logger.handlers.clear()
    logger.propagate = False
    logger.setLevel(logging.INFO)
    handler = logging.StreamHandler(stream)
    handler.setFormatter(logging.Formatter("%(levelname)s %(name)s: %(message)s"))
    logger.addHandler(handler)
    for level, text in records:
        getattr(logger, level)(text)
    return stream.getvalue().splitlines()`,
        samples: ['log_lines([("info", "started"), ("debug", "hidden"), ("warning", "careful")])'],
        cases: [
          ['Info and warning', 'log_lines([("info", "started"), ("debug", "hidden"), ("warning", "careful")])'],
          ['Errors', 'log_lines([("error", "failed"), ("critical", "stopping")])'],
          ['Only debug messages', 'log_lines([("debug", "a"), ("debug", "b")])'],
          ['No records', 'log_lines([])'],
          ['Called twice', '(log_lines([("info", "one")]), log_lines([("info", "two")]))'],
          ['Order is kept', 'log_lines([("warning", "w"), ("info", "i"), ("error", "e")])'],
          ['Text with a percent sign', 'log_lines([("info", "100% done")])'],
        ],
        traps: [
          py`import io
import logging

stream = io.StringIO()

def log_lines(records):
    logger = logging.getLogger("app")
    logger.propagate = False
    logger.setLevel(logging.INFO)
    handler = logging.StreamHandler(stream)
    handler.setFormatter(logging.Formatter("%(levelname)s %(name)s: %(message)s"))
    logger.addHandler(handler)
    for level, text in records:
        getattr(logger, level)(text)
    return stream.getvalue().splitlines()`,
          py`import io
import logging

def log_lines(records):
    stream = io.StringIO()
    logger = logging.getLogger("app")
    logger.handlers.clear()
    logger.propagate = False
    logger.setLevel(logging.DEBUG)
    handler = logging.StreamHandler(stream)
    handler.setFormatter(logging.Formatter("%(levelname)s %(name)s: %(message)s"))
    logger.addHandler(handler)
    for level, text in records:
        getattr(logger, level)(text)
    return stream.getvalue().splitlines()`,
          py`import io
import logging

def log_lines(records):
    stream = io.StringIO()
    logger = logging.getLogger("app")
    logger.handlers.clear()
    logger.propagate = False
    logger.setLevel(logging.INFO)
    handler = logging.StreamHandler(stream)
    handler.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))
    logger.addHandler(handler)
    for level, text in records:
        getattr(logger, level)(text)
    return stream.getvalue().splitlines()`,
          py`import io
import logging

def log_lines(records):
    stream = io.StringIO()
    logger = logging.getLogger("app")
    logger.handlers.clear()
    logger.propagate = False
    logger.setLevel(logging.INFO)
    handler = logging.StreamHandler(stream)
    handler.setFormatter(logging.Formatter("%(levelname)s %(name)s: %(message)s"))
    logger.addHandler(handler)
    for level, text in records:
        logger.info(text)
    return stream.getvalue().splitlines()`,
        ],
      },
      real: [
        chi({
          title: 'Warn about missing states',
          use: ['customers'],
          hidden: LOGGER_SETUP,
          starter: '# Write a loop that logs a warning for customers whose State is None.\nanswer = stream.getvalue().splitlines()[:3]\n',
          given: '# logger writes into stream with the format "LEVEL:message", at INFO level. customers is a list of dictionaries.',
          brief: 'For every customer whose `State` is `None`, call `logger.warning("customer %s has no state", customer_id)` (with the `CustomerId`, using **lazy** `%s` arguments). Then keep the **first three lines** of the log in `answer`.',
          reference: py`for c in customers:
    if c["State"] is None:
        logger.warning("customer %s has no state", c["CustomerId"])
answer = stream.getvalue().splitlines()[:3]`,
          walkthrough: 'The logger formats the record, so the stream holds lines such as `WARNING:customer 2 has no state`. Passing the value as an argument avoids building the text when the level is switched off.',
          traps: [py`for c in customers:
    if c["State"] is None:
        logger.info("customer %s has no state", c["CustomerId"])
answer = stream.getvalue().splitlines()[:3]`, py`for c in customers:
    if c["State"] is None:
        logger.error("customer %s has no state", c["CustomerId"])
answer = stream.getvalue().splitlines()[:3]`],
        }),
        chi({
          title: 'Choose the right level',
          use: ['invoices'],
          hidden: LOGGER_SETUP,
          starter: '# Log one message per invoice at the right level.\nanswer = stream.getvalue().splitlines()\n',
          given: '# logger writes into stream at INFO level, so DEBUG messages are dropped. invoices is a list of dictionaries with "InvoiceId" and "Total".',
          brief: 'For each invoice: if `Total` is **above 20**, log `logger.info("big invoice %s", id)`. If it is **below 1**, log `logger.warning("tiny invoice %s", id)`. Otherwise log the same text at the **debug** level (`logger.debug("invoice %s", id)`). Store all the lines of the log in `answer`.',
          reference: py`for inv in invoices:
    if inv["Total"] > 20:
        logger.info("big invoice %s", inv["InvoiceId"])
    elif inv["Total"] < 1:
        logger.warning("tiny invoice %s", inv["InvoiceId"])
    else:
        logger.debug("invoice %s", inv["InvoiceId"])
answer = stream.getvalue().splitlines()`,
          walkthrough: 'The logger has the threshold INFO, so the debug messages for ordinary invoices are dropped. You get to keep the calls in the code, and switch them on by lowering the level.',
          traps: [py`for inv in invoices:
    if inv["Total"] > 15:
        logger.info("big invoice %s", inv["InvoiceId"])
    elif inv["Total"] < 1:
        logger.warning("tiny invoice %s", inv["InvoiceId"])
    else:
        logger.debug("invoice %s", inv["InvoiceId"])
answer = stream.getvalue().splitlines()`, py`for inv in invoices:
    if inv["Total"] > 20:
        logger.info("big invoice %s", inv["InvoiceId"])
    elif inv["Total"] < 1:
        logger.warning("tiny invoice %s", inv["InvoiceId"])
    else:
        logger.info("invoice %s", inv["InvoiceId"])
answer = stream.getvalue().splitlines()`],
        }),
        chi({
          title: 'Log the bad postal codes',
          use: ['customers'],
          hidden: LOGGER_SETUP,
          starter: '# Try to convert each PostalCode to an int and log the failures.\nanswer = len(stream.getvalue().splitlines())\n',
          given: '# logger writes into stream. PostalCode is text (such as "70174" or "H2G 1A7"), or None.',
          brief: 'For each customer, try `int(c["PostalCode"])`. When it fails (**either** because the text is not a whole number **or** because the value is `None`), call `logger.error("bad postal code %r", code)`. Store in `answer` the **number of lines** in the log.',
          reference: py`for c in customers:
    code = c["PostalCode"]
    try:
        int(code)
    except (ValueError, TypeError):
        logger.error("bad postal code %r", code)
answer = len(stream.getvalue().splitlines())`,
          walkthrough: '`int("H2G 1A7")` raises `ValueError` and `int(None)` raises `TypeError`. Naming both keeps the loop going, and each failure leaves one line in the log.',
          traps: [py`for c in customers:
    code = c["PostalCode"]
    try:
        int(code)
    except ValueError:
        logger.error("bad postal code %r", code)
answer = len(stream.getvalue().splitlines())`, py`for c in customers:
    code = c["PostalCode"]
    if code is not None and not code.isdigit():
        logger.error("bad postal code %r", code)
answer = len(stream.getvalue().splitlines())`],
        }),
      ],
    },
  ],
  checkpoint: [],
}
