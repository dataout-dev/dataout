const py = String.raw

const LOAD = "customers = rows('chinook', 'Customer')\ninvoices = rows('chinook', 'Invoice')\ntracks = rows('chinook', 'Track')\n"

const code = (c) => ({ kind: 'code', points: 10, dataset: 'chinook', starter: 'answer = ', ...c, hidden: LOAD + (c.hidden ?? '') })

export const proExam = [
  code({
    id: 'pro-exam-1',
    starter: 'def classify(n):\n    return "even" if n % 2 == 0 else "odd"\n\ndef always_even(n):\n    return "even"\n\ndef check_all(fn):\n    ...\n\nanswer = (check_all(classify), check_all(always_even))\n',
    given: '# a correct parity classifier, a deliberately broken one, and the pairs each should be tested against.',
    task: 'Write `check_all(fn)`: test `fn` against the pairs `[(0, "even"), (1, "odd"), (2, "even"), (-3, "odd"), (-4, "even")]`, returning how many pairs `fn` gets right.',
    reference: py`def classify(n):
    return "even" if n % 2 == 0 else "odd"

def always_even(n):
    return "even"

def check_all(fn):
    pairs = [(0, "even"), (1, "odd"), (2, "even"), (-3, "odd"), (-4, "even")]
    return sum(1 for x, expected in pairs if fn(x) == expected)

answer = (check_all(classify), check_all(always_even))`,
    walkthrough: 'This is exactly what `@pytest.mark.parametrize` automates: one assertion body, applied across several inputs including negative-number edge cases — checking a genuinely broken classifier too is what actually proves `check_all` is counting, not just returning the case count.',
    traps: [py`def classify(n):
    return "even" if n % 2 == 0 else "odd"

def always_even(n):
    return "even"

def check_all(fn):
    pairs = [(0, "even"), (1, "odd"), (2, "even"), (-3, "odd"), (-4, "even")]
    return len(pairs)

answer = (check_all(classify), check_all(always_even))`],
  }),
  code({
    id: 'pro-exam-2',
    starter: 'def total_with_prices(cart, api):\n    ...\n\nclass FakeApi:\n    def price(self, name):\n        return len(name) * 0.5\n\nnames = [t["Name"] for t in tracks[:4]]\nanswer = total_with_prices(names, FakeApi())\n',
    given: '# tracks is a list of dictionaries; names holds 4 real track names (of varying length). FakeApi is a test double standing in for a real pricing service, pricing by name length so different names get different fake prices.',
    task: 'Write `total_with_prices(cart, api)`: return the sum of `api.price(name)` for every item in `cart`.',
    reference: py`def total_with_prices(cart, api):
    return sum(api.price(name) for name in cart)

class FakeApi:
    def price(self, name):
        return len(name) * 0.5

names = [t["Name"] for t in tracks[:4]]
answer = total_with_prices(names, FakeApi())`,
    walkthrough: 'Injecting a fake instead of a real API client is what makes this test fast and deterministic — no network call, no real price catalogue needed. Pricing by name length (rather than a flat constant) is what actually forces each real name to be priced individually, instead of one price standing in for all of them.',
    traps: [py`class FakeApi:
    def price(self, name):
        return len(name) * 0.5

names = [t["Name"] for t in tracks[:4]]

def total_with_prices(cart, api):
    return api.price(cart[0]) * len(cart)

answer = total_with_prices(names, FakeApi())`],
  }),
  {
    id: 'pro-exam-3',
    kind: 'mcq',
    points: 10,
    q: 'A reference cycle (two objects that reference each other, both otherwise unreachable) exists in memory. What actually reclaims it?',
    options: [
      'Reference counting alone, immediately, the same as any other object',
      'Reference counting cannot reclaim it (both counts stay above zero forever) — CPython’s separate cyclic garbage collector periodically finds and frees unreachable cycles like this',
      'It causes an immediate crash',
      'It is never reclaimed, and the program leaks memory permanently',
    ],
    answer: 1,
    why: 'Two objects referencing each other keep each other’s reference count above zero even when nothing else refers to either — exactly the case the cyclic collector exists to handle.',
  },
  code({
    id: 'pro-exam-4',
    starter: 'def find_duplicates(items):\n    ...\n\ncountries = [c["Country"] for c in customers]\nanswer = len(find_duplicates(countries))\n',
    given: '# customers is a list of dictionaries covering many countries, several repeated.',
    task: 'Write `find_duplicates(items)`: return the values that appear more than once in `items`, each listed once, using a set for membership checks (not nested loops). Store the count of distinct repeating countries in `answer`.',
    reference: py`def find_duplicates(items):
    seen = set()
    dupe_set = set()
    dupes = []
    for x in items:
        if x in seen and x not in dupe_set:
            dupes.append(x)
            dupe_set.add(x)
        seen.add(x)
    return dupes

countries = [c["Country"] for c in customers]
answer = len(find_duplicates(countries))`,
    walkthrough: 'A single linear pass with a set stays fast regardless of how large the customer list grows; a nested-loop membership check would get quadratically slower.',
    traps: [py`countries = [c["Country"] for c in customers]

def find_duplicates(items):
    return list(set(items))

answer = len(find_duplicates(items=countries))`],
  }),
  code({
    id: 'pro-exam-5',
    starter: 'import asyncio\n\nasync def gather_results(delays):\n    ...\n\nids = [t["TrackId"] for t in tracks[:5]]\nanswer = asyncio.run(gather_results(ids))\n',
    given: '# tracks is a list of dictionaries; ids holds the first 5 real TrackId values.',
    task: 'Write `async def gather_results(delays)`: for each value, run a coroutine that does `await asyncio.sleep(0)` then returns it, all concurrently via `asyncio.gather`. Return the results in the same order as `delays`.',
    reference: py`import asyncio

async def gather_results(delays):
    async def work(d):
        await asyncio.sleep(0)
        return d
    return list(await asyncio.gather(*(work(d) for d in delays)))

ids = [t["TrackId"] for t in tracks[:5]]
answer = asyncio.run(gather_results(ids))`,
    walkthrough: '`asyncio.gather` preserves input order in its results regardless of which coroutine actually finishes first — the same property that makes it safe to use for any batch of concurrent, independent work.',
    traps: [py`import asyncio

ids = [t["TrackId"] for t in tracks[:5]]

async def gather_results(delays):
    async def work(d):
        await asyncio.sleep(0)
        return d
    results = await asyncio.gather(*(work(d) for d in delays))
    return list(reversed(results))

answer = asyncio.run(gather_results(ids))`],
  }),
  {
    id: 'pro-exam-6',
    kind: 'mcq',
    points: 10,
    q: 'Match each scenario to the best-fitting concurrency tool. Scenario: fetching 200 independent pages from a slow, rate-limited API. Which is the best default choice?',
    options: [
      'multiprocessing, since more processes always means more speed',
      'asyncio (or threads) — the bottleneck is waiting on the network, not CPU, so overlapping those waits is what actually helps here',
      'A single-threaded loop with no concurrency at all is just as fast',
      'Rewriting the fetch logic in C',
    ],
    answer: 1,
    why: 'I/O-bound waiting is exactly what asyncio (or threads) is for — the GIL is released during network waits, so overlapping many of them concurrently is cheap and effective; processes add overhead this workload does not need.',
  },
  code({
    id: 'pro-exam-7',
    starter: 'def retry(times):\n    ...\n\ncalls = [0]\n\ndef flaky():\n    calls[0] += 1\n    if calls[0] < 3:\n        raise ConnectionError("down")\n    return tracks[0]["Name"]\n\nanswer = retry(5)(flaky)()\n',
    given: '# tracks is a list of dictionaries. flaky fails twice before succeeding.',
    task: 'Write `retry(times)`: a decorator factory whose decorator calls the wrapped function up to `times` times, stopping at the first success, and returns the number of attempts made (whether it eventually succeeded or ran out of attempts).',
    reference: py`def retry(times):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            attempts = 0
            for _ in range(times):
                attempts += 1
                try:
                    fn(*args, **kwargs)
                    return attempts
                except Exception:
                    pass
            return attempts
        return wrapper
    return decorator

calls = [0]

def flaky():
    calls[0] += 1
    if calls[0] < 3:
        raise ConnectionError("down")
    return tracks[0]["Name"]

answer = retry(5)(flaky)()`,
    walkthrough: 'The decorator only cares whether a call raised, never what it returns — which is exactly what makes it reusable across any flaky function.',
    traps: [py`calls = [0]

def flaky():
    calls[0] += 1
    if calls[0] < 3:
        raise ConnectionError("down")
    return tracks[0]["Name"]

def retry(times):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                try:
                    fn(*args, **kwargs)
                    return times
                except Exception:
                    pass
            return times
        return wrapper
    return decorator

answer = retry(5)(flaky)()`],
  }),
  {
    id: 'pro-exam-8',
    kind: 'mcq',
    points: 10,
    q: 'Which of the following is the clearest example of a real security problem?',
    options: [
      'Building a SQL query with `cursor.execute("SELECT * FROM users WHERE name = ?", (name,))`',
      'Building a SQL query with `f"SELECT * FROM users WHERE name = \'{name}\'"` using a name that came directly from user input',
      'Validating a user’s age is between 0 and 150 before using it',
      'Loading configuration from an environment variable',
    ],
    answer: 1,
    why: 'String-formatting untrusted input directly into SQL is the classic SQL injection vulnerability; parameter binding (option 1) is exactly the safe alternative.',
  },
  code({
    id: 'pro-exam-9',
    starter: 'from pydantic import BaseModel, ValidationError\n\nclass Invoice(BaseModel):\n    customer_id: int\n    total: float\n\ndef validate_invoice(data):\n    ...\n\nrow = invoices[0]\nmessy = {"customer_id": str(row["CustomerId"]), "total": str(row["Total"])}\nincomplete = {"customer_id": str(row["CustomerId"])}\nbad_type = {"customer_id": str(row["CustomerId"]), "total": "not-a-number"}\nanswer = (validate_invoice(messy), validate_invoice(incomplete), validate_invoice(bad_type))\n',
    given: '# invoices is a list of dictionaries; messy holds real values as strings (as they might arrive from a form); incomplete drops the total; bad_type has a total that cannot be parsed as a number at all.',
    task: 'Write `validate_invoice(data)`: try to build an `Invoice` from `data`; return `[]` on success, or the list of field names that failed on a `ValidationError`.',
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
messy = {"customer_id": str(row["CustomerId"]), "total": str(row["Total"])}
incomplete = {"customer_id": str(row["CustomerId"])}
bad_type = {"customer_id": str(row["CustomerId"]), "total": "not-a-number"}
answer = (validate_invoice(messy), validate_invoice(incomplete), validate_invoice(bad_type))`,
    walkthrough: 'pydantic coerces numeric-looking strings automatically (so `messy` passes), catches a genuinely missing field (`incomplete`), and — unlike a check that only looks at which keys are present — also catches a present field whose value cannot actually be parsed as the declared type (`bad_type`).',
    traps: [py`from pydantic import BaseModel, ValidationError

class Invoice(BaseModel):
    customer_id: int
    total: float

def validate_invoice(data):
    return [f for f in ["customer_id", "total"] if f not in data]

row = invoices[0]
messy = {"customer_id": str(row["CustomerId"]), "total": str(row["Total"])}
incomplete = {"customer_id": str(row["CustomerId"])}
bad_type = {"customer_id": str(row["CustomerId"]), "total": "not-a-number"}
answer = (validate_invoice(messy), validate_invoice(incomplete), validate_invoice(bad_type))`],
  }),
  code({
    id: 'pro-exam-10',
    starter: 'import argparse\n\ndef build_cli(argv):\n    ...\n\nfirst_id = str(tracks[0]["TrackId"])\nanswer = (build_cli(["add", first_id, "5"]), build_cli(["list"]))\n',
    given: '# tracks is a list of dictionaries; first_id is a real TrackId as a string.',
    task: 'Write `build_cli(argv)`: an `argparse` parser with two sub-commands — `add` (two positional integers `x`, `y`) and `list` (an optional `--limit` integer, default `10`) — dispatched via `dest="command"`. Return `vars(namespace)`.',
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
answer = (build_cli(["add", first_id, "5"]), build_cli(["list"]))`,
    walkthrough: 'Testing a CLI by passing a real `argv` list works identically whether the values are toy strings or, as here, a real id converted to a string the way it would actually arrive from a shell.',
    traps: [py`import argparse

first_id = str(tracks[0]["TrackId"])

def build_cli(argv):
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command")
    add_p = sub.add_parser("add")
    add_p.add_argument("x")
    add_p.add_argument("y")
    list_p = sub.add_parser("list")
    list_p.add_argument("--limit", type=int, default=10)
    ns = parser.parse_args(argv)
    return vars(ns)

answer = (build_cli(["add", first_id, "5"]), build_cli(["list"]))`],
  }),
]
