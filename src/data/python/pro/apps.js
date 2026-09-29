import { py, pro } from './common.js'

export const buildingApplications = {
  id: 'building-applications',
  title: 'Building applications',
  intro: 'Command-line tools, services and data access in practice.',
  lessons: [
    {
      id: 'py-cli-apps-argparse-click-typer',
      title: 'Command-line applications with argparse, click and typer',
      blurb: 'Designing a CLI, sub-commands, validation, exit codes, and testing by passing argv.',
      kind: 'code',
      practice: {
        prompt: 'Write `build_cli(argv)`: an `argparse` parser with two sub-commands \u2014 `add` (positional integers `x` and `y`) and `list` (an optional `--limit` integer, default `10`) \u2014 dispatched via `dest="command"`. Parse `argv` and return the result as a plain dict (`vars(namespace)`).',
        starter: 'import argparse\n\ndef build_cli(argv):\n    ...\n',
        solution: py`import argparse

def build_cli(argv):
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command")
    add_p = sub.add_parser("add")
    add_p.add_argument("x", type=int)
    add_p.add_argument("y", type=int)
    list_p = sub.add_parser("list")
    list_p.add_argument("--limit", type=int, default=10)
    ns = parser.parse_args(argv)
    return vars(ns)`,
        samples: ['build_cli(["add", "2", "3"])'],
        cases: [
          ['The add sub-command parses two integers', 'build_cli(["add", "2", "3"])'],
          ['The list sub-command defaults limit to 10', 'build_cli(["list"])'],
          ['The list sub-command accepts an explicit limit', 'build_cli(["list", "--limit", "5"])'],
          ['Negative numbers parse correctly', 'build_cli(["add", "10", "-5"])'],
        ],
        traps: [
          py`import argparse

def build_cli(argv):
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command")
    add_p = sub.add_parser("add")
    add_p.add_argument("x")
    add_p.add_argument("y")
    list_p = sub.add_parser("list")
    list_p.add_argument("--limit", type=int, default=10)
    ns = parser.parse_args(argv)
    return vars(ns)`,
          py`import argparse

def build_cli(argv):
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command")
    add_p = sub.add_parser("add")
    add_p.add_argument("x", type=int)
    add_p.add_argument("y", type=int)
    list_p = sub.add_parser("list")
    list_p.add_argument("--limit", type=int)
    ns = parser.parse_args(argv)
    return vars(ns)`,
        ],
      },
      real: [
        pro({
          title: 'A CLI over real track ids',
          use: ['tracks'],
          starter: 'import argparse\n\ndef build_cli(argv):\n    ...\n\nfirst_id = str(tracks[0]["TrackId"])\nsecond_id = str(tracks[1]["TrackId"])\nanswer = build_cli(["add", first_id, second_id])\n',
          given: '# tracks is a list of dictionaries; first_id and second_id are real TrackId values, as strings (the way argv arrives).',
          brief: 'Write `build_cli` as in the lesson. Store the parsed result of `add`-ing the two real ids in `answer`.',
          reference: py`import argparse

def build_cli(argv):
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command")
    add_p = sub.add_parser("add")
    add_p.add_argument("x", type=int)
    add_p.add_argument("y", type=int)
    list_p = sub.add_parser("list")
    list_p.add_argument("--limit", type=int, default=10)
    ns = parser.parse_args(argv)
    return vars(ns)

first_id = str(tracks[0]["TrackId"])
second_id = str(tracks[1]["TrackId"])
answer = build_cli(["add", first_id, second_id])`,
          walkthrough: 'Testing a CLI by passing a real `argv` list (rather than launching a real subprocess) is the standard way to unit test one \u2014 `parse_args` never cares whether the strings came from a real terminal or a test.',
          traps: [py`import argparse

first_id = str(tracks[0]["TrackId"])
second_id = str(tracks[1]["TrackId"])

def build_cli(argv):
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command")
    add_p = sub.add_parser("add")
    add_p.add_argument("x", type=int)
    add_p.add_argument("y", type=int)
    list_p = sub.add_parser("list")
    list_p.add_argument("--limit", type=int, default=10)
    ns = parser.parse_args(argv)
    result = vars(ns)
    result["x"], result["y"] = result["y"], result["x"]
    return result

answer = build_cli(["add", first_id, second_id])`],
        }),
        pro({
          title: 'Using the default limit with real data in mind',
          use: ['customers'],
          starter: 'import argparse\n\ndef build_cli(argv):\n    ...\n\nanswer = (build_cli(["list"])["limit"], len(customers) > build_cli(["list"])["limit"])\n',
          given: '# customers is a list of dictionaries.',
          brief: 'Write `build_cli` as in the lesson. Store `(default_limit, is_default_limit_smaller_than_the_real_customer_count)` in `answer`.',
          reference: py`import argparse

def build_cli(argv):
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command")
    add_p = sub.add_parser("add")
    add_p.add_argument("x", type=int)
    add_p.add_argument("y", type=int)
    list_p = sub.add_parser("list")
    list_p.add_argument("--limit", type=int, default=10)
    ns = parser.parse_args(argv)
    return vars(ns)

answer = (build_cli(["list"])["limit"], len(customers) > build_cli(["list"])["limit"])`,
          walkthrough: 'A sensible default (`--limit 10`) means the common case needs no flag at all \u2014 here, with more than 10 real customers, that default genuinely would truncate a real result set, which is exactly the scenario a `--limit` flag exists to let a user override.',
          traps: [py`import argparse

def build_cli(argv):
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command")
    add_p = sub.add_parser("add")
    add_p.add_argument("x", type=int)
    add_p.add_argument("y", type=int)
    list_p = sub.add_parser("list")
    list_p.add_argument("--limit", type=int, default=100)
    ns = parser.parse_args(argv)
    return vars(ns)

answer = (build_cli(["list"])["limit"], len(customers) > build_cli(["list"])["limit"])`],
        }),
        pro({
          title: 'Exit codes for bad input',
          use: ['tracks'],
          starter: 'import argparse\n\ndef build_cli(argv):\n    ...\n\ndef exit_code_for(argv):\n    try:\n        build_cli(argv)\n        return 0\n    except SystemExit as e:\n        return e.code\n\nvalid_id = str(tracks[0]["TrackId"])\nanswer = (exit_code_for(["add", valid_id, "3"]), exit_code_for(["add", "not-a-number", "3"]))\n',
          given: '# tracks is a list of dictionaries; valid_id is a real, parseable TrackId as a string.',
          brief: 'Write `build_cli` as in the lesson. Store `(exit_code_for_valid_input, exit_code_for_invalid_input)` in `answer` \u2014 `argparse` exits with a non-zero code on a parsing error.',
          reference: py`import argparse

def build_cli(argv):
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command")
    add_p = sub.add_parser("add")
    add_p.add_argument("x", type=int)
    add_p.add_argument("y", type=int)
    list_p = sub.add_parser("list")
    list_p.add_argument("--limit", type=int, default=10)
    ns = parser.parse_args(argv)
    return vars(ns)

def exit_code_for(argv):
    try:
        build_cli(argv)
        return 0
    except SystemExit as e:
        return e.code

valid_id = str(tracks[0]["TrackId"])
answer = (exit_code_for(["add", valid_id, "3"]), exit_code_for(["add", "not-a-number", "3"]))`,
          walkthrough: '`argparse` calls `sys.exit(2)` (raising `SystemExit`) on a parsing error rather than raising a catchable exception like `ValueError` \u2014 exactly what lets a real command-line invocation signal failure to the shell via a non-zero exit code.',
          traps: [py`import argparse

valid_id = str(tracks[0]["TrackId"])

def build_cli(argv):
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command")
    add_p = sub.add_parser("add")
    add_p.add_argument("x", type=int)
    add_p.add_argument("y", type=int)
    list_p = sub.add_parser("list")
    list_p.add_argument("--limit", type=int, default=10)
    ns = parser.parse_args(argv)
    return vars(ns)

def exit_code_for(argv):
    try:
        build_cli(argv)
    except SystemExit:
        pass
    return 0

answer = (exit_code_for(["add", valid_id, "3"]), exit_code_for(["add", "not-a-number", "3"]))`],
        }),
      ],
    },
    {
      id: 'py-configuration-env-secrets',
      title: 'Configuration, environment variables and secrets',
      blurb: 'The twelve-factor idea, layered configuration, and never committing secrets.',
      kind: 'learn',
      check: [
        {
          q: 'What is the core idea behind the "twelve-factor app" approach to configuration?',
          options: [
            'Configuration should be hard-coded for reliability',
            'Configuration that varies between environments (dev, staging, production) should live outside the code \u2014 typically in environment variables \u2014 so the same build can run correctly anywhere without a code change',
            'Every setting must be stored in a database',
            'It only applies to web applications',
          ],
          answer: 1,
          why: 'Baking an environment-specific value (a database URL, an API key) into the code means every environment needs its own build \u2014 externalising it lets the identical build run anywhere.',
        },
        {
          q: 'What is "layered configuration"?',
          options: [
            'Storing configuration in multiple unrelated files for no reason',
            'Combining configuration from several sources in a defined priority order \u2014 e.g. defaults, then a config file, then environment variables, then command-line flags, each able to override the previous layer',
            'Encrypting configuration multiple times',
            'A configuration format specific to YAML',
          ],
          answer: 1,
          why: 'Layering lets sensible defaults live in code, environment-specific overrides live in env vars, and a one-off override live in a CLI flag \u2014 without any of those needing to know about the others.',
        },
        {
          q: 'Why should secrets (API keys, database passwords) never be committed to version control, even in a private repository?',
          options: [
            'It does not matter for private repositories',
            'Git history is effectively permanent and often shared more widely than intended (a later fork, a CI log, a contractor\u2019s clone) \u2014 a committed secret usually has to be treated as compromised and rotated even after being "removed" in a later commit',
            'Committing secrets only matters for public repositories',
            'Secrets committed to git are automatically encrypted',
          ],
          answer: 1,
          why: 'Deleting a secret in a later commit does not remove it from history \u2014 anyone with access to the repository\u2019s full history (including old clones) can still find it, which is why a leaked secret needs rotating, not just deleting.',
        },
        {
          q: 'What is a `.env` file typically used for, and what is the corresponding risk?',
          options: [
            'It has no common use',
            'Loading local development environment variables (including secrets) from a file instead of setting them manually \u2014 the risk is committing it by accident, which is exactly why it belongs in `.gitignore`',
            'It replaces the need for pyproject.toml',
            'It is only used in production, never locally',
          ],
          answer: 1,
          why: 'A `.env` file is convenient exactly because it can hold real secrets for local development \u2014 which is precisely why it must never be committed.',
        },
        {
          q: 'Why validate configuration values at application startup, rather than wherever they happen to be first used?',
          options: [
            'There is no benefit to early validation',
            'A missing or malformed setting then fails immediately and clearly at startup, instead of causing a confusing failure deep inside unrelated code minutes (or hours) later, the first time that particular setting happens to be read',
            'Startup validation is slower and should be avoided',
            'Configuration can only be validated at startup, never later',
          ],
          answer: 1,
          why: 'Failing fast at startup, with a clear "MISSING_API_KEY is not set" error, is far easier to diagnose than a mysterious `NoneType has no attribute` three layers deep in a request handler.',
        },
      ],
    },
    {
      id: 'py-observability-logging',
      title: 'Logging and observability in applications',
      blurb: 'Structured logging, correlation ids, log levels in practice, and testing logs.',
      kind: 'code',
      practice: {
        prompt: 'Write `audit_log(events)`: given a list of event dicts each with a `"type"` key and an optional `"user"` key, return a list of structured log records `{"level": "INFO", "event": <type>, "user": <user, or "anonymous" if missing>}`, one per event, in the same order.',
        starter: 'def audit_log(events):\n    ...\n',
        solution: py`def audit_log(events):
    records = []
    for event in events:
        records.append({
            "level": "INFO",
            "event": event["type"],
            "user": event.get("user", "anonymous"),
        })
    return records`,
        samples: ['audit_log([{"type": "login", "user": "ann"}])'],
        cases: [
          ['A single event with a user', 'audit_log([{"type": "login", "user": "ann"}])'],
          ['A missing user defaults to anonymous', 'audit_log([{"type": "logout"}])'],
          ['An empty list of events', 'audit_log([])'],
          ['Multiple events stay in order', 'audit_log([{"type": "a", "user": "x"}, {"type": "b", "user": "y"}])'],
          ['Every record has a level key', 'all(r["level"] == "INFO" for r in audit_log([{"type": "delete", "user": "admin"}]))'],
        ],
        traps: [
          py`def audit_log(events):
    records = []
    for event in events:
        records.append({
            "level": "INFO",
            "event": event["type"],
            "user": event.get("user"),
        })
    return records`,
          py`def audit_log(events):
    records = []
    for event in reversed(events):
        records.append({
            "level": "INFO",
            "event": event["type"],
            "user": event.get("user", "anonymous"),
        })
    return records`,
          py`def audit_log(events):
    records = []
    for event in events:
        records.append({
            "level": "INFO",
            "action": event["type"],
            "user": event.get("user", "anonymous"),
        })
    return records`,
        ],
      },
      real: [
        pro({
          title: 'Auditing real customer country changes',
          use: ['customers'],
          starter: 'def audit_log(events):\n    ...\n\nevents = [{"type": "country_change", "user": c["FirstName"]} for c in customers[:4]]\nanswer = audit_log(events)\n',
          given: '# customers is a list of dictionaries; events wraps the first 4 real first names into log events.',
          brief: 'Write `audit_log` as in the lesson. Store the resulting log records in `answer`.',
          reference: py`def audit_log(events):
    records = []
    for event in events:
        records.append({
            "level": "INFO",
            "event": event["type"],
            "user": event.get("user", "anonymous"),
        })
    return records

events = [{"type": "country_change", "user": c["FirstName"]} for c in customers[:4]]
answer = audit_log(events)`,
          walkthrough: 'Structured records (a dict per event) are what let a log aggregation system later filter or group by `event` or `user` directly \u2014 a plain formatted string like `f"{user} changed country"` would need re-parsing to get the same fields back out.',
          traps: [py`events = [{"type": "country_change", "user": c["FirstName"]} for c in customers[:4]]

def audit_log(events):
    records = []
    for event in events:
        records.append({
            "level": "DEBUG",
            "event": event["type"],
            "user": event.get("user", "anonymous"),
        })
    return records

answer = audit_log(events)`],
        }),
        pro({
          title: 'Anonymous events among real track plays',
          use: ['tracks'],
          starter: 'def audit_log(events):\n    ...\n\nevents = [{"type": "play"} for _ in tracks[:3]] + [{"type": "play", "user": "ann"}]\nanswer = audit_log(events)\n',
          given: '# tracks is a list of dictionaries; events simulates 3 anonymous plays and one identified play.',
          brief: 'Write `audit_log` as in the lesson. Store the resulting log records in `answer`.',
          reference: py`def audit_log(events):
    records = []
    for event in events:
        records.append({
            "level": "INFO",
            "event": event["type"],
            "user": event.get("user", "anonymous"),
        })
    return records

events = [{"type": "play"} for _ in tracks[:3]] + [{"type": "play", "user": "ann"}]
answer = audit_log(events)`,
          walkthrough: 'Defaulting a missing field to a clear sentinel (`"anonymous"`) rather than `None` keeps every downstream consumer of these records from needing its own special-case handling for a missing user.',
          traps: [py`events = [{"type": "play"} for _ in range(3)] + [{"type": "play", "user": "ann"}]

def audit_log(events):
    records = []
    for event in events:
        records.append({
            "level": "INFO",
            "event": event["type"],
            "user": event.get("user", "unknown"),
        })
    return records

answer = audit_log(events)`],
        }),
        pro({
          title: 'Counting log levels for real genre updates',
          use: ['genres'],
          starter: 'def audit_log(events):\n    ...\n\nevents = [{"type": "rename", "user": g["Name"]} for g in genres[:5]]\nrecords = audit_log(events)\nanswer = (len(records), sum(1 for r in records if r["level"] == "INFO"))\n',
          given: '# genres is a list of dictionaries; events wraps the first 5 real genre names.',
          brief: 'Write `audit_log` as in the lesson. Store `(number_of_records, number_at_INFO_level)` in `answer`.',
          reference: py`def audit_log(events):
    records = []
    for event in events:
        records.append({
            "level": "INFO",
            "event": event["type"],
            "user": event.get("user", "anonymous"),
        })
    return records

events = [{"type": "rename", "user": g["Name"]} for g in genres[:5]]
records = audit_log(events)
answer = (len(records), sum(1 for r in records if r["level"] == "INFO"))`,
          walkthrough: 'Every record here lands at `INFO`, since `audit_log` always sets that level \u2014 a genuinely tiered logger would vary this by event severity, which is exactly what the next lesson\u2019s log-level discussion is about.',
          traps: [py`events = [{"type": "rename", "user": g["Name"]} for g in genres[:5]]

def audit_log(events):
    records = []
    for event in events[:-1]:
        records.append({
            "level": "INFO",
            "event": event["type"],
            "user": event.get("user", "anonymous"),
        })
    return records

records = audit_log(events)
answer = (len(records), sum(1 for r in records if r["level"] == "INFO"))`],
        }),
      ],
    },
    {
      id: 'py-web-apis-http-fastapi',
      title: 'Web APIs: HTTP fundamentals and building with FastAPI (reading)',
      blurb: 'HTTP methods, status codes, REST design, dependency injection, and OpenAPI docs.',
      kind: 'read',
      check: [
        {
          q: 'What is the conventional distinction between `POST` and `PUT` in a REST API?',
          options: [
            'They are completely interchangeable',
            '`POST` typically creates a new resource (the server decides its identity); `PUT` typically replaces a resource at a known, client-specified location \u2014 and is expected to be idempotent (repeating it has the same effect as doing it once)',
            '`PUT` is only for images and files',
            '`POST` is read-only',
          ],
          answer: 1,
          why: 'Idempotency is the key practical difference: sending the same `PUT` request twice should leave the resource in the same state as sending it once; `POST` typically creates a new resource each time.',
        },
        {
          q: 'What does a 404 status code mean, as opposed to a 400?',
          options: [
            'They mean the same thing',
            '404 means the requested resource does not exist at that URL; 400 means the request itself was malformed (bad syntax, invalid data) regardless of whether the resource exists',
            '404 is a success code',
            '400 means the server crashed',
          ],
          answer: 1,
          why: 'Distinguishing "this doesn\u2019t exist" (404) from "your request was invalid" (400) helps a client know whether to fix the request or stop asking for that resource entirely.',
        },
        {
          q: 'What does FastAPI use type hints (via pydantic models) for, specifically?',
          options: [
            'Purely cosmetic documentation with no runtime effect',
            'Automatic request validation (rejecting malformed input before your handler even runs), response serialisation, and generating interactive API documentation \u2014 all derived from the same type hints',
            'They are only used for internal logging',
            'FastAPI does not use type hints at all',
          ],
          answer: 1,
          why: 'A single pydantic model declared once drives validation, serialisation, and documentation together \u2014 exactly the kind of leverage type hints provide when a framework is built around them.',
        },
        {
          q: 'What is dependency injection, in the FastAPI sense (`Depends(...)`)?',
          options: [
            'A way to import external packages',
            'Declaring what a path function needs (a database session, the current user) as a parameter, with FastAPI responsible for constructing and providing it \u2014 keeping that setup logic out of every individual handler',
            'A security vulnerability to avoid',
            'A synonym for a database migration',
          ],
          answer: 1,
          why: 'Without dependency injection, every handler that needs a database session would duplicate the same setup/teardown code; `Depends` centralises it once.',
        },
        {
          q: 'What does FastAPI\u2019s automatically generated OpenAPI documentation give you?',
          options: [
            'Nothing beyond a static PDF',
            'An interactive page (commonly at `/docs`) where every endpoint, its expected input, and its possible responses are documented and can be tried directly in the browser \u2014 generated from the same type hints and models used for validation',
            'It requires writing the documentation by hand separately',
            'It only documents endpoints that return JSON',
          ],
          answer: 1,
          why: 'Because the docs are generated from the same models that validate requests, they cannot drift out of sync with the actual API the way hand-maintained documentation can.',
        },
      ],
    },
    {
      id: 'py-flask-lightweight-web-apps',
      title: 'Flask and lightweight web apps (reading)',
      blurb: 'Routes and templates, forms, sessions, blueprints, and comparing frameworks.',
      kind: 'read',
      check: [
        {
          q: 'What is Flask\u2019s general design philosophy, compared to a more "batteries-included" framework?',
          options: [
            'Flask includes every possible feature by default, like Django',
            'Flask provides a small core (routing, request/response handling) and leaves most other choices (database layer, forms, authentication) to optional extensions you add as needed',
            'Flask cannot be extended at all',
            'Flask is only for static websites',
          ],
          answer: 1,
          why: 'This "microframework" approach trades built-in structure for flexibility \u2014 useful for a small service, more effort to assemble consistently on a large one.',
        },
        {
          q: 'What do Flask templates (via Jinja2) let you do?',
          options: [
            'Nothing beyond serving static files',
            'Generate HTML dynamically by embedding Python-like expressions and control flow (loops, conditionals) directly into an HTML file, kept separate from the route-handling code',
            'Templates are only used for CSS',
            'They replace the need for a database entirely',
          ],
          answer: 1,
          why: 'Separating an HTML template from the Python view function keeps presentation and logic reasonably separate, even in a simple framework.',
        },
        {
          q: 'What does a Flask "session" typically store, and where?',
          options: [
            'It always stores data in a server-side database automatically',
            'By default, small amounts of data in a signed (but not encrypted) cookie on the client, verified against a secret key so it cannot be tampered with undetected',
            'Sessions are not supported in Flask at all',
            'Sessions can only be used for login state, nothing else',
          ],
          answer: 1,
          why: 'The signature (not encryption) distinguishes a Flask session cookie: the client can read it, but cannot modify it undetected without knowing the server\u2019s secret key.',
        },
        {
          q: 'What is a Flask "blueprint" for?',
          options: [
            'A blueprint is a database migration file',
            'A way to organise a group of related routes (and their templates/static files) into a reusable, mountable component \u2014 useful for structuring a larger app into logical sections',
            'It is required for every single Flask app, even a one-route app',
            'Blueprints replace the need for routes entirely',
          ],
          answer: 1,
          why: 'A small Flask app might never need one, but as an app grows past a handful of routes, blueprints are how you avoid one giant, unstructured file of routes.',
        },
        {
          q: 'How would you broadly compare Flask, FastAPI and Django for a new project?',
          options: [
            'They are all identical in practice',
            'Flask: minimal, flexible, you assemble the pieces; FastAPI: built around type hints for automatic validation and docs, strong for APIs specifically; Django: batteries-included (ORM, admin, auth) for larger, more conventional web applications',
            'Django is only for small scripts',
            'FastAPI cannot serve JSON APIs',
          ],
          answer: 1,
          why: 'The right choice depends on the project: a tiny internal tool, a typed API service, and a full-featured content-driven web app each tend to favour a different one of the three.',
        },
      ],
    },
    {
      id: 'py-databases-sqlalchemy-orm',
      title: 'Databases in applications: SQLAlchemy ORM and migrations',
      blurb: 'The ORM model, sessions and transactions, relationships, and queries with select().',
      kind: 'code',
      practice: {
        prompt: 'Define two related ORM models, `Customer` (with `id`, `name`, and an `invoices` relationship) and `Invoice` (with `id`, `total`, a `customer_id` foreign key, and a back-reference to its `customer`). Write `totals_per_customer(session)`: query the total invoice amount per customer, returning a sorted list of `(name, total)` tuples.',
        starter: 'from sqlalchemy import create_engine, ForeignKey, select, func\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session\n\nclass Base(DeclarativeBase):\n    pass\n\nclass Customer(Base):\n    __tablename__ = "customers"\n    ...\n\nclass Invoice(Base):\n    __tablename__ = "invoices"\n    ...\n\ndef totals_per_customer(session):\n    ...\n',
        solution: py`from sqlalchemy import create_engine, ForeignKey, select, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class Customer(Base):
    __tablename__ = "customers"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")

class Invoice(Base):
    __tablename__ = "invoices"
    id: Mapped[int] = mapped_column(primary_key=True)
    total: Mapped[float]
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    customer: Mapped["Customer"] = relationship(back_populates="invoices")

def totals_per_customer(session):
    rows = session.execute(
        select(Customer.name, func.sum(Invoice.total)).join(Invoice).group_by(Customer.name)
    ).all()
    return sorted([(name, round(float(total), 2)) for name, total in rows])`,
        samples: [
          'engine = create_engine("sqlite://")\nBase.metadata.create_all(engine)\nwith Session(engine) as session:\n    session.add_all([Customer(name="Ann", invoices=[Invoice(total=10.0), Invoice(total=5.0)]), Customer(name="Bo", invoices=[Invoice(total=20.0)])])\n    session.commit()\n    result = totals_per_customer(session)\nresult',
        ],
        cases: [
          ['Two customers with two invoices each', 'engine = create_engine("sqlite://")\nBase.metadata.create_all(engine)\nwith Session(engine) as session:\n    session.add_all([Customer(name="Ann", invoices=[Invoice(total=10.0), Invoice(total=5.0)]), Customer(name="Bo", invoices=[Invoice(total=20.0)])])\n    session.commit()\n    result = totals_per_customer(session)\nresult'],
          ['A customer with a single invoice', 'engine = create_engine("sqlite://")\nBase.metadata.create_all(engine)\nwith Session(engine) as session:\n    session.add_all([Customer(name="Solo", invoices=[Invoice(total=42.5)])])\n    session.commit()\n    result = totals_per_customer(session)\nresult'],
          ['Results are sorted by name', 'engine = create_engine("sqlite://")\nBase.metadata.create_all(engine)\nwith Session(engine) as session:\n    session.add_all([Customer(name="Zed", invoices=[Invoice(total=1.0)]), Customer(name="Ann", invoices=[Invoice(total=2.0)])])\n    session.commit()\n    result = totals_per_customer(session)\n[name for name, total in result]'],
          ['No customers at all', 'engine = create_engine("sqlite://")\nBase.metadata.create_all(engine)\nwith Session(engine) as session:\n    result = totals_per_customer(session)\nresult'],
        ],
        traps: [
          py`from sqlalchemy import create_engine, ForeignKey, select, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class Customer(Base):
    __tablename__ = "customers"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")

class Invoice(Base):
    __tablename__ = "invoices"
    id: Mapped[int] = mapped_column(primary_key=True)
    total: Mapped[float]
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    customer: Mapped["Customer"] = relationship(back_populates="invoices")

def totals_per_customer(session):
    rows = session.execute(
        select(Customer.name, func.count(Invoice.id)).join(Invoice).group_by(Customer.name)
    ).all()
    return sorted([(name, round(float(total), 2)) for name, total in rows])`,
          py`from sqlalchemy import create_engine, ForeignKey, select, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class Customer(Base):
    __tablename__ = "customers"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")

class Invoice(Base):
    __tablename__ = "invoices"
    id: Mapped[int] = mapped_column(primary_key=True)
    total: Mapped[float]
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    customer: Mapped["Customer"] = relationship(back_populates="invoices")

def totals_per_customer(session):
    rows = session.execute(select(Customer.name, Invoice.total).join(Invoice)).all()
    return sorted([(name, round(float(total), 2)) for name, total in rows])`,
        ],
      },
      real: [
        pro({
          title: 'Real customer totals through the ORM',
          use: ['customers', 'invoices'],
          starter: 'from sqlalchemy import create_engine, ForeignKey, select, func\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session\n\nclass Base(DeclarativeBase):\n    pass\n\nclass Customer(Base):\n    __tablename__ = "cust"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    name: Mapped[str]\n    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")\n\nclass Invoice(Base):\n    __tablename__ = "inv"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    total: Mapped[float]\n    customer_id: Mapped[int] = mapped_column(ForeignKey("cust.id"))\n    customer: Mapped["Customer"] = relationship(back_populates="invoices")\n\ndef totals_per_customer(session):\n    ...\n\nengine = create_engine("sqlite://")\nBase.metadata.create_all(engine)\nreal_totals = [invoices[0]["Total"], invoices[1]["Total"], invoices[2]["Total"], invoices[3]["Total"], invoices[8]["Total"], invoices[9]["Total"]]\nwith Session(engine) as session:\n    for i, c in enumerate(customers[:3]):\n        name = c["FirstName"] + " " + c["LastName"]\n        session.add(Customer(name=name, invoices=[Invoice(total=real_totals[i * 2]), Invoice(total=real_totals[i * 2 + 1])]))\n    session.commit()\n    answer = totals_per_customer(session)\n',
          given: '# customers and invoices are lists of dictionaries; real_totals picks 6 real invoice totals whose pairwise sums are all distinct.',
          brief: 'Write `totals_per_customer` as in the lesson (using the local `Customer`/`Invoice` models already defined here). Store the sorted `(name, total)` list in `answer`.',
          reference: py`from sqlalchemy import create_engine, ForeignKey, select, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class Customer(Base):
    __tablename__ = "cust"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")

class Invoice(Base):
    __tablename__ = "inv"
    id: Mapped[int] = mapped_column(primary_key=True)
    total: Mapped[float]
    customer_id: Mapped[int] = mapped_column(ForeignKey("cust.id"))
    customer: Mapped["Customer"] = relationship(back_populates="invoices")

def totals_per_customer(session):
    rows = session.execute(
        select(Customer.name, func.sum(Invoice.total)).join(Invoice).group_by(Customer.name)
    ).all()
    return sorted([(name, round(float(total), 2)) for name, total in rows])

engine = create_engine("sqlite://")
Base.metadata.create_all(engine)
real_totals = [invoices[0]["Total"], invoices[1]["Total"], invoices[2]["Total"], invoices[3]["Total"], invoices[8]["Total"], invoices[9]["Total"]]
with Session(engine) as session:
    for i, c in enumerate(customers[:3]):
        name = c["FirstName"] + " " + c["LastName"]
        session.add(Customer(name=name, invoices=[Invoice(total=real_totals[i * 2]), Invoice(total=real_totals[i * 2 + 1])]))
    session.commit()
    answer = totals_per_customer(session)`,
          walkthrough: 'The query itself never changes between synthetic and real data \u2014 `join` and `group_by` operate on whatever rows actually exist in the tables, real or not.',
          traps: [py`from sqlalchemy import create_engine, ForeignKey, select, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class Customer(Base):
    __tablename__ = "cust"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")

class Invoice(Base):
    __tablename__ = "inv"
    id: Mapped[int] = mapped_column(primary_key=True)
    total: Mapped[float]
    customer_id: Mapped[int] = mapped_column(ForeignKey("cust.id"))
    customer: Mapped["Customer"] = relationship(back_populates="invoices")

def totals_per_customer(session):
    rows = session.execute(
        select(Customer.name, func.avg(Invoice.total)).join(Invoice).group_by(Customer.name)
    ).all()
    return sorted([(name, round(float(total), 2)) for name, total in rows])

engine = create_engine("sqlite://")
Base.metadata.create_all(engine)
real_totals = [invoices[0]["Total"], invoices[1]["Total"], invoices[2]["Total"], invoices[3]["Total"], invoices[8]["Total"], invoices[9]["Total"]]
with Session(engine) as session:
    for i, c in enumerate(customers[:3]):
        name = c["FirstName"] + " " + c["LastName"]
        session.add(Customer(name=name, invoices=[Invoice(total=real_totals[i * 2]), Invoice(total=real_totals[i * 2 + 1])]))
    session.commit()
    answer = totals_per_customer(session)`],
        }),
        pro({
          title: 'Summing across a relationship directly',
          use: ['customers', 'invoices'],
          starter: 'from sqlalchemy import create_engine, ForeignKey\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session\n\nclass Base(DeclarativeBase):\n    pass\n\nclass Customer(Base):\n    __tablename__ = "cust2"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    name: Mapped[str]\n    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")\n\nclass Invoice(Base):\n    __tablename__ = "inv2"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    total: Mapped[float]\n    customer_id: Mapped[int] = mapped_column(ForeignKey("cust2.id"))\n    customer: Mapped["Customer"] = relationship(back_populates="invoices")\n\ndef total_for_customer(customer):\n    ...\n\nengine = create_engine("sqlite://")\nBase.metadata.create_all(engine)\nrow = customers[3]\nname = row["FirstName"] + " " + row["LastName"]\nreal_totals = [invoices[10]["Total"], invoices[11]["Total"], invoices[12]["Total"]]\nwith Session(engine) as session:\n    session.add(Customer(name=name, invoices=[Invoice(total=t) for t in real_totals]))\n    session.commit()\n    cust = session.query(Customer).first()\n    answer = round(total_for_customer(cust), 2)\n',
          given: '# customers and invoices are lists of dictionaries; real_totals holds 3 real invoice totals given to one real customer.',
          brief: 'Write `total_for_customer(customer)`: given a `Customer` ORM object, return the sum of `.total` across its `.invoices` relationship. Store the rounded (2 decimals) result in `answer`.',
          reference: py`from sqlalchemy import create_engine, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class Customer(Base):
    __tablename__ = "cust2"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")

class Invoice(Base):
    __tablename__ = "inv2"
    id: Mapped[int] = mapped_column(primary_key=True)
    total: Mapped[float]
    customer_id: Mapped[int] = mapped_column(ForeignKey("cust2.id"))
    customer: Mapped["Customer"] = relationship(back_populates="invoices")

def total_for_customer(customer):
    return sum(inv.total for inv in customer.invoices)

engine = create_engine("sqlite://")
Base.metadata.create_all(engine)
row = customers[3]
name = row["FirstName"] + " " + row["LastName"]
real_totals = [invoices[10]["Total"], invoices[11]["Total"], invoices[12]["Total"]]
with Session(engine) as session:
    session.add(Customer(name=name, invoices=[Invoice(total=t) for t in real_totals]))
    session.commit()
    cust = session.query(Customer).first()
    answer = round(total_for_customer(cust), 2)`,
          walkthrough: 'Navigating `customer.invoices` reads like plain attribute access, but each `Invoice` behind it is a real row — summing over the relationship needs no query-building at all, unlike the aggregate `select()` used in the previous challenge.',
          traps: [py`from sqlalchemy import create_engine, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class Customer(Base):
    __tablename__ = "cust2"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")

class Invoice(Base):
    __tablename__ = "inv2"
    id: Mapped[int] = mapped_column(primary_key=True)
    total: Mapped[float]
    customer_id: Mapped[int] = mapped_column(ForeignKey("cust2.id"))
    customer: Mapped["Customer"] = relationship(back_populates="invoices")

def total_for_customer(customer):
    return len(customer.invoices)

engine = create_engine("sqlite://")
Base.metadata.create_all(engine)
row = customers[3]
name = row["FirstName"] + " " + row["LastName"]
real_totals = [invoices[10]["Total"], invoices[11]["Total"], invoices[12]["Total"]]
with Session(engine) as session:
    session.add(Customer(name=name, invoices=[Invoice(total=t) for t in real_totals]))
    session.commit()
    cust = session.query(Customer).first()
    answer = round(total_for_customer(cust), 2)`],
        }),
        pro({
          title: 'Filtering aggregated real totals by a threshold',
          use: ['customers', 'invoices'],
          starter: 'from sqlalchemy import create_engine, select, func, ForeignKey\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session\n\nclass Base(DeclarativeBase):\n    pass\n\nclass Customer(Base):\n    __tablename__ = "cust3"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    name: Mapped[str]\n    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")\n\nclass Invoice(Base):\n    __tablename__ = "inv3"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    total: Mapped[float]\n    customer_id: Mapped[int] = mapped_column(ForeignKey("cust3.id"))\n    customer: Mapped["Customer"] = relationship(back_populates="invoices")\n\ndef totals_per_customer(session):\n    ...\n\nengine = create_engine("sqlite://")\nBase.metadata.create_all(engine)\npairs = [(customers[3], [invoices[10]["Total"], invoices[11]["Total"], invoices[16]["Total"]]), (customers[4], [invoices[12]["Total"], invoices[13]["Total"]]), (customers[5], [invoices[14]["Total"], invoices[15]["Total"]])]\nwith Session(engine) as session:\n    for c, totals in pairs:\n        name = c["FirstName"] + " " + c["LastName"]\n        session.add(Customer(name=name, invoices=[Invoice(total=t) for t in totals]))\n    session.commit()\n    result = totals_per_customer(session)\n    answer = sum(1 for name, total in result if total > 10)\n',
          given: '# customers and invoices are lists of dictionaries; pairs assigns two real invoice totals to each of 3 real customers.',
          brief: 'Write `totals_per_customer` as in the earlier lesson challenge. Store the number of customers whose total exceeds 10 in `answer`.',
          reference: py`from sqlalchemy import create_engine, select, func, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class Customer(Base):
    __tablename__ = "cust3"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")

class Invoice(Base):
    __tablename__ = "inv3"
    id: Mapped[int] = mapped_column(primary_key=True)
    total: Mapped[float]
    customer_id: Mapped[int] = mapped_column(ForeignKey("cust3.id"))
    customer: Mapped["Customer"] = relationship(back_populates="invoices")

def totals_per_customer(session):
    rows = session.execute(
        select(Customer.name, func.sum(Invoice.total)).join(Invoice).group_by(Customer.name)
    ).all()
    return sorted([(name, round(float(total), 2)) for name, total in rows])

engine = create_engine("sqlite://")
Base.metadata.create_all(engine)
pairs = [(customers[3], [invoices[10]["Total"], invoices[11]["Total"], invoices[16]["Total"]]), (customers[4], [invoices[12]["Total"], invoices[13]["Total"]]), (customers[5], [invoices[14]["Total"], invoices[15]["Total"]])]
with Session(engine) as session:
    for c, totals in pairs:
        name = c["FirstName"] + " " + c["LastName"]
        session.add(Customer(name=name, invoices=[Invoice(total=t) for t in totals]))
    session.commit()
    result = totals_per_customer(session)
    answer = sum(1 for name, total in result if total > 10)`,
          walkthrough: 'Once the aggregate query returns plain `(name, total)` tuples, filtering by a threshold is ordinary Python — the ORM’s job ends at getting the aggregated numbers out correctly.',
          traps: [py`from sqlalchemy import create_engine, select, func, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class Customer(Base):
    __tablename__ = "cust3"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")

class Invoice(Base):
    __tablename__ = "inv3"
    id: Mapped[int] = mapped_column(primary_key=True)
    total: Mapped[float]
    customer_id: Mapped[int] = mapped_column(ForeignKey("cust3.id"))
    customer: Mapped["Customer"] = relationship(back_populates="invoices")

def totals_per_customer(session):
    rows = session.execute(
        select(Customer.name, func.avg(Invoice.total)).join(Invoice).group_by(Customer.name)
    ).all()
    return sorted([(name, round(float(total), 2)) for name, total in rows])

engine = create_engine("sqlite://")
Base.metadata.create_all(engine)
pairs = [(customers[3], [invoices[10]["Total"], invoices[11]["Total"], invoices[16]["Total"]]), (customers[4], [invoices[12]["Total"], invoices[13]["Total"]]), (customers[5], [invoices[14]["Total"], invoices[15]["Total"]])]
with Session(engine) as session:
    for c, totals in pairs:
        name = c["FirstName"] + " " + c["LastName"]
        session.add(Customer(name=name, invoices=[Invoice(total=t) for t in totals]))
    session.commit()
    result = totals_per_customer(session)
    answer = sum(1 for name, total in result if total > 10)`],
        }),
      ],
    },
    {
      id: 'py-security-basics',
      title: 'Security basics for Python developers',
      blurb: 'Input validation, SQL injection, unsafe deserialisation, path traversal, and safe subprocess use.',
      kind: 'learn',
      check: [
        {
          q: 'Why is building a SQL query with string formatting (`f"SELECT * FROM users WHERE name = \'{name}\'"`) dangerous?',
          options: [
            'It is slower than the alternative',
            'It allows SQL injection: if `name` contains attacker-controlled text like `\'; DROP TABLE users; --`, that text becomes part of the executed SQL itself, not just a value',
            'It only fails for very long strings',
            'It is fine as long as the database is small',
          ],
          answer: 1,
          why: 'Parameterised queries (`cursor.execute("... WHERE name = ?", (name,))`) keep the value as data, never as executable SQL syntax, which is what closes this off entirely.',
        },
        {
          q: 'Why is `pickle.load()` on untrusted input dangerous?',
          options: [
            'It is only a performance concern',
            'Unpickling can execute arbitrary code as a side effect of reconstructing certain objects \u2014 loading a malicious pickle can run attacker-controlled code, not just deserialise data',
            'pickle only works on numbers',
            'It always raises an exception on untrusted input',
          ],
          answer: 1,
          why: 'Pickle is explicitly documented as unsafe for untrusted data because the deserialisation protocol allows calling arbitrary constructors \u2014 JSON, which has no code-execution hook, is the safer default for data you do not fully control.',
        },
        {
          q: 'What is path traversal, and how does `os.path.join` alone fail to prevent it?',
          options: [
            'A performance issue with deeply nested folders',
            'Attacker-supplied input like `"../../etc/passwd"` used as part of a file path can escape an intended directory; `os.path.join` happily joins that path without checking the result stays inside the intended folder',
            'It only affects Windows systems',
            'It is prevented automatically by Python\u2019s file-open function',
          ],
          answer: 1,
          why: 'The fix requires an explicit check \u2014 resolving the final path and confirming it is still inside the intended base directory \u2014 not just joining path segments.',
        },
        {
          q: 'Why is `subprocess.run(user_input, shell=True)` risky?',
          options: [
            'It is not risky if the input is a string',
            'With `shell=True`, the input is interpreted by a real shell, so attacker-controlled text can inject additional shell commands (via `;`, `|`, backticks) beyond what was intended',
            'shell=True only affects Windows',
            'subprocess cannot run external commands at all',
          ],
          answer: 1,
          why: 'Passing a list of arguments with `shell=False` (the safer default) avoids shell interpretation entirely \u2014 the command and its arguments are passed directly to the program, with no shell metacharacters to worry about.',
        },
        {
          q: 'Why does "rolling your own crypto" show up as a security anti-pattern on most checklists (including the OWASP-style thinking this lesson references)?',
          options: [
            'Custom cryptographic code is always faster',
            'Cryptography is extraordinarily easy to get subtly wrong in ways that look fine in testing but are broken in practice; well-reviewed, standard libraries have had far more expert scrutiny than a one-off implementation ever will',
            'It is illegal to write your own cryptographic code',
            'There is no real risk, it is just a convention',
          ],
          answer: 1,
          why: 'A subtly broken hand-rolled cipher or hash usage can look completely fine in every test you think to write, while still being trivially breakable by someone who actually understands the underlying weakness.',
        },
      ],
    },
    {
      id: 'py-scripting-automation-recipes',
      title: 'Scripting and automation recipes',
      blurb: 'Batch file organisation with pathlib, retries with backoff, and idempotent scripts.',
      kind: 'code',
      practice: {
        prompt: 'Write `organise(names)`: given a list of file names, return a dict mapping each distinct file extension (without the dot, lowercase; files with no extension map to `"other"`) to the sorted list of file names with that extension.',
        starter: 'def organise(names):\n    ...\n',
        solution: py`def organise(names):
    groups = {}
    for name in names:
        if "." in name:
            ext = name.rsplit(".", 1)[1].lower()
        else:
            ext = "other"
        groups.setdefault(ext, []).append(name)
    for ext in groups:
        groups[ext].sort()
    return groups`,
        samples: ['organise(["a.txt", "b.PDF", "c.txt"])'],
        cases: [
          ['Mixed extensions, case-insensitive', 'organise(["a.txt", "b.PDF", "c.txt"])'],
          ['A file with no extension', 'organise(["README", "notes.md"])'],
          ['An empty list', 'organise([])'],
          ['Files within one extension are sorted', 'organise(["z.txt", "a.txt", "m.txt"])'],
          ['A file with multiple dots uses the last segment', 'organise(["archive.tar.gz"])'],
        ],
        traps: [
          py`def organise(names):
    groups = {}
    for name in names:
        if "." in name:
            ext = name.split(".", 1)[1].lower()
        else:
            ext = "other"
        groups.setdefault(ext, []).append(name)
    for ext in groups:
        groups[ext].sort()
    return groups`,
          py`def organise(names):
    groups = {}
    for name in names:
        if "." in name:
            ext = name.rsplit(".", 1)[1]
        else:
            ext = "other"
        groups.setdefault(ext, []).append(name)
    for ext in groups:
        groups[ext].sort()
    return groups`,
          py`def organise(names):
    groups = {}
    for name in names:
        if "." in name:
            ext = name.rsplit(".", 1)[1].lower()
        else:
            ext = "other"
        groups.setdefault(ext, []).append(name)
    return groups`,
        ],
      },
      real: [
        pro({
          title: 'Organising real track names by (fake) extension',
          use: ['tracks'],
          starter: 'def organise(names):\n    ...\n\nnames = [t["Name"] + ".mp3" for t in tracks[:3]] + [t["Name"] + ".flac" for t in tracks[3:5]]\nresult = organise(names)\nanswer = (sorted(result.keys()), len(result["mp3"]), len(result["flac"]))\n',
          given: '# tracks is a list of dictionaries; names simulates real track titles saved as two different audio formats.',
          brief: 'Write `organise` as in the lesson. Store `(sorted_extensions, count_of_mp3, count_of_flac)` in `answer`.',
          reference: py`def organise(names):
    groups = {}
    for name in names:
        if "." in name:
            ext = name.rsplit(".", 1)[1].lower()
        else:
            ext = "other"
        groups.setdefault(ext, []).append(name)
    for ext in groups:
        groups[ext].sort()
    return groups

names = [t["Name"] + ".mp3" for t in tracks[:3]] + [t["Name"] + ".flac" for t in tracks[3:5]]
result = organise(names)
answer = (sorted(result.keys()), len(result["mp3"]), len(result["flac"]))`,
          walkthrough: 'Real, messy track titles (punctuation, mixed case, accents) do not affect the grouping logic at all \u2014 it only ever looks at the trailing extension, never the rest of the name.',
          traps: [py`names = [t["Name"] + ".mp3" for t in tracks[:3]] + [t["Name"] + ".flac" for t in tracks[3:5]]

def organise(names):
    groups = {}
    for name in names:
        if "." in name:
            ext = name.rsplit(".", 1)[1].lower()
        else:
            ext = "other"
        groups.setdefault(ext, []).append(name)
    for ext in groups:
        groups[ext].sort()
    return groups

result = organise(names)
answer = (sorted(result.keys()), len(result["flac"]), len(result["mp3"]))`],
        }),
        pro({
          title: 'A batch with no extension at all',
          use: ['artists'],
          starter: 'def organise(names):\n    ...\n\nnames = [a["Name"] for a in artists[:5]]\nresult = organise(names)\nanswer = (list(result.keys()), len(result.get("other", [])))\n',
          given: '# artists is a list of dictionaries; names holds 5 real artist names with no file extension at all.',
          brief: 'Write `organise` as in the lesson. Store `(the_dict_keys, count_grouped_as_other)` in `answer`.',
          reference: py`def organise(names):
    groups = {}
    for name in names:
        if "." in name:
            ext = name.rsplit(".", 1)[1].lower()
        else:
            ext = "other"
        groups.setdefault(ext, []).append(name)
    for ext in groups:
        groups[ext].sort()
    return groups

names = [a["Name"] for a in artists[:5]]
result = organise(names)
answer = (list(result.keys()), len(result.get("other", [])))`,
          walkthrough: 'Every one of these real artist names lacks a dot entirely, so all 5 land in the `"other"` bucket \u2014 exactly the fallback the function exists to provide for files (or, here, names) that do not fit the expected pattern.',
          traps: [py`names = [a["Name"] for a in artists[:5]]

def organise(names):
    groups = {}
    for name in names:
        ext = "unknown"
        groups.setdefault(ext, []).append(name)
    return groups

result = organise(names)
answer = (list(result.keys()), len(result.get("other", [])))`],
        }),
        pro({
          title: 'Re-running organise is safe (idempotent)',
          use: ['tracks'],
          starter: 'def organise(names):\n    ...\n\nnames = [t["Name"] + ".mp3" for t in tracks[:6]]\nfirst_run = organise(names)\nsecond_run = organise(names)\nanswer = (first_run == second_run, list(first_run.keys()))\n',
          given: '# tracks is a list of dictionaries; names simulates the same real batch of files processed twice.',
          brief: 'Write `organise` as in the lesson. Store `(runs_are_identical, dict_keys_from_the_first_run)` in `answer`.',
          reference: py`def organise(names):
    groups = {}
    for name in names:
        if "." in name:
            ext = name.rsplit(".", 1)[1].lower()
        else:
            ext = "other"
        groups.setdefault(ext, []).append(name)
    for ext in groups:
        groups[ext].sort()
    return groups

names = [t["Name"] + ".mp3" for t in tracks[:6]]
first_run = organise(names)
second_run = organise(names)
answer = (first_run == second_run, list(first_run.keys()))`,
          walkthrough: 'A pure function of its input \u2014 no hidden state, no side effects on the file system \u2014 is automatically safe to re-run: this is what "idempotent" means for a script, and it is why organise never needs a "have I already run?" check of its own.',
          traps: [py`import random

def organise(names):
    groups = {}
    shuffled = list(names)
    random.shuffle(shuffled)
    for name in shuffled:
        if "." in name:
            ext = name.rsplit(".", 1)[1].lower()
        else:
            ext = "other"
        groups.setdefault(ext, []).append(name)
    return groups

names = [t["Name"] + ".mp3" for t in tracks[:6]]
first_run = organise(names)
second_run = organise(names)
answer = (first_run == second_run, list(first_run.keys()))`],
        }),
      ],
    },
  ],
  checkpoint: [],
}
