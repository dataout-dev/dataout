import { py, pro } from './common.js'

export const testingAndCodeQuality = {
  id: 'testing-and-code-quality',
  title: 'Testing and code quality',
  intro: 'Writing code you can change with confidence.',
  lessons: [
    {
      id: 'py-pytest-fundamentals',
      title: 'pytest fundamentals',
      blurb: 'Test discovery, assert rewriting, pytest.raises, pytest.approx, and reading failures.',
      kind: 'code',
      practice: {
        prompt: 'Write `slugify(text)`: lowercase the text, replace every run of characters that are not a lowercase letter or digit with a single hyphen, then strip any leading or trailing hyphens.',
        starter: 'def slugify(text):\n    ...\n',
        solution: py`import re

def slugify(text):
    text = re.sub(r"[^a-z0-9]+", "-", text.strip().lower())
    return text.strip("-")`,
        samples: ['slugify("Hello World")'],
        cases: [
          ['A simple title', 'slugify("Hello World")'],
          ['Repeated spaces collapse to one hyphen', 'slugify("Multiple   Spaces")'],
          ['Punctuation becomes a hyphen', 'slugify("C++ Programming!")'],
          ['Leading and trailing junk is stripped', 'slugify("---Leading and Trailing---")'],
          ['Digits are kept', 'slugify("Item 42")'],
          ['Already a slug stays the same', 'slugify("already-a-slug")'],
          ['Empty string stays empty', 'slugify("")'],
          ['Mixed case', 'slugify("ThIs Is MIXED")'],
        ],
        traps: [
          py`import re

def slugify(text):
    return re.sub(r"[^a-zA-Z0-9]+", "-", text.strip()).strip("-")`,
          py`def slugify(text):
    return text.strip().lower().replace(" ", "-")`,
          py`import re

def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.strip().lower())`,
        ],
      },
      real: [
        pro({
          title: 'Slugging Chinook track names',
          use: ['tracks'],
          starter: 'import re\n\ndef slugify(text):\n    ...\n\nnames = [t["Name"] for t in tracks[:25]]\nslugs = [slugify(n) for n in names]\nanswer = (slugs[0], len(set(slugs)))\n',
          given: '# tracks is a list of dictionaries; names holds the first 25 track names.',
          brief: 'Write `slugify` as in the lesson. Store `(slug_of_first_track, number_of_distinct_slugs_among_the_25)` in `answer`.',
          reference: py`import re

def slugify(text):
    text = re.sub(r"[^a-z0-9]+", "-", text.strip().lower())
    return text.strip("-")

names = [t["Name"] for t in tracks[:25]]
slugs = [slugify(n) for n in names]
answer = (slugs[0], len(set(slugs)))`,
          walkthrough: 'The same slug function used in the practice test applies directly to real track titles; counting distinct slugs is a quick way to check whether any two titles would collide as URLs.',
          traps: [py`names = [t["Name"] for t in tracks[:25]]
slugs = [n.strip().lower().replace(" ", "-") for n in names]
answer = (slugs[0], len(set(slugs)))`],
        }),
        pro({
          title: 'Testing a surcharge formula with pytest.approx',
          use: ['invoices'],
          starter: 'def with_surcharge(total, rate=0.0825):\n    ...\n\ntotals = [i["Total"] for i in invoices[:10]]\nfinal = sum(with_surcharge(t) for t in totals)\nanswer = round(final, 2)\n',
          given: '# invoices is a list of dictionaries; totals holds the first 10 invoice Total values.',
          brief: 'Write `with_surcharge(total, rate=0.0825)` returning `total * (1 + rate)`. Store the rounded total (2 decimals) of the first 10 invoices with the surcharge applied in `answer`.',
          reference: py`def with_surcharge(total, rate=0.0825):
    return total * (1 + rate)

totals = [i["Total"] for i in invoices[:10]]
final = sum(with_surcharge(t) for t in totals)
answer = round(final, 2)`,
          walkthrough: '`pytest.approx` exists because chained float arithmetic like this rarely lands on an exact decimal — the lesson’s hidden cases tolerate tiny floating-point noise the same way.',
          traps: [py`def with_surcharge(total, rate=0.0825):
    return total + rate

totals = [i["Total"] for i in invoices[:10]]
final = sum(with_surcharge(t) for t in totals)
answer = round(final, 2)`],
        }),
        pro({
          title: 'Raising and catching the right exception',
          use: ['tracks'],
          starter: 'def price_bucket(price):\n    ...\n\nsample = [t["UnitPrice"] for t in tracks[2800:2840]]\nbuckets = []\nfor p in sample:\n    try:\n        buckets.append(price_bucket(p))\n    except ValueError:\n        buckets.append("invalid")\nanswer = buckets.count("standard")\n',
          given: '# tracks is a list of dictionaries; sample is a 40-track slice that mixes cheap and standard prices.',
          brief: 'Write `price_bucket(price)`: raise `ValueError` if `price < 0`, otherwise return `"cheap"` for `price < 1.0` and `"standard"` otherwise. Store the number of `"standard"` tracks in `answer`.',
          reference: py`def price_bucket(price):
    if price < 0:
        raise ValueError("negative price")
    return "cheap" if price < 1.0 else "standard"

sample = [t["UnitPrice"] for t in tracks[2800:2840]]
buckets = []
for p in sample:
    try:
        buckets.append(price_bucket(p))
    except ValueError:
        buckets.append("invalid")
answer = buckets.count("standard")`,
          walkthrough: '`pytest.raises(ValueError)` in a test is the same shape as this `try`/`except`: expect a specific exception, not any error at all — here the real data never actually raises, but the bucketing logic still has to be right to split cheap from standard correctly.',
          traps: [py`def price_bucket(price):
    return "standard" if price < 1.0 else "cheap"

sample = [t["UnitPrice"] for t in tracks[2800:2840]]
buckets = []
for p in sample:
    try:
        buckets.append(price_bucket(p))
    except ValueError:
        buckets.append("invalid")
answer = buckets.count("standard")`],
        }),
      ],
    },
    {
      id: 'py-fixtures-parametrisation',
      title: 'Fixtures, parametrisation and test organisation',
      blurb: 'conftest.py, @pytest.mark.parametrize, tmp_path, monkeypatch, and keeping tests fast.',
      kind: 'code',
      practice: {
        prompt: 'Given `values = [-5, -3, -1, 0, 1, 2, 3, 5, 8, 10]`, write `case_count(fn)` returning how many of these values `x` satisfy `fn(x) == x * 2` — the same idea `@pytest.mark.parametrize` automates: one assertion body, many inputs, run in a single call.',
        starter: 'def case_count(fn):\n    ...\n',
        solution: py`def case_count(fn):
    values = [-5, -3, -1, 0, 1, 2, 3, 5, 8, 10]
    return sum(1 for x in values if fn(x) == x * 2)`,
        samples: ['case_count(lambda x: x * 2)'],
        cases: [
          ['A correct doubling function passes all ten', 'case_count(lambda x: x * 2)'],
          ['A constant function passes only where 2x == 0', 'case_count(lambda x: 0)'],
          ['An off-by-one function passes none', 'case_count(lambda x: x * 2 + 1)'],
          ['Correct only for non-negative inputs', 'case_count(lambda x: x * 2 if x >= 0 else 0)'],
          ['The identity function', 'case_count(lambda x: x)'],
          ['Correct only for negative inputs', 'case_count(lambda x: x * 2 if x < 0 else 0)'],
        ],
        traps: [
          py`def case_count(fn):
    values = [-5, -3, -1, 0, 1, 2, 3, 5, 8, 10]
    return sum(1 for x in values if fn(x) == x + 2)`,
          py`def case_count(fn):
    values = [-5, -3, -1, 0, 1, 2, 3, 5, 8, 10]
    return len(values)`,
          py`def case_count(fn):
    values = [-5, -3, -1, 0, 1, 2, 3, 5, 8, 10]
    return sum(1 for x in values[:5] if fn(x) == x * 2)`,
        ],
      },
      real: [
        pro({
          title: 'Parametrising over real track durations',
          use: ['tracks'],
          starter: 'def is_short(ms, limit):\n    ...\n\ndurations = [t["Milliseconds"] for t in tracks[:60]]\nlimit = durations[0]\nanswer = sum(1 for d in durations if is_short(d, limit))\n',
          given: '# tracks is a list of dictionaries; durations holds the first 60 Milliseconds values. limit is deliberately set to the first track’s own duration, so it is a boundary value actually present in the data.',
          brief: 'Write `is_short(ms, limit)` returning whether `ms < limit` (strictly less than). Store the count of tracks strictly shorter than `limit` in `answer`.',
          reference: py`def is_short(ms, limit):
    return ms < limit

durations = [t["Milliseconds"] for t in tracks[:60]]
limit = durations[0]
answer = sum(1 for d in durations if is_short(d, limit))`,
          walkthrough: 'One assertion (`is_short`), evaluated across every duration — exactly the shape a parametrised test takes, just counted instead of asserted one at a time. Using the first track’s own duration as the limit guarantees at least one real value sits exactly on the boundary, which is where a `<` vs `<=` mistake would otherwise hide.',
          traps: [py`def is_short(ms, limit):
    return ms <= limit

durations = [t["Milliseconds"] for t in tracks[:60]]
limit = durations[0]
answer = sum(1 for d in durations if is_short(d, limit))`],
        }),
        pro({
          title: 'A fixture-style shared setup, by hand',
          use: ['tracks'],
          starter: 'def normalise(name):\n    ...\n\nshared_names = [t["Name"] for t in tracks[:15]]\nanswer = [normalise(n) for n in shared_names][:3]\n',
          given: '# tracks is a list of dictionaries; shared_names simulates a fixture built once and reused across many cases.',
          brief: 'Write `normalise(name)` returning the name stripped of surrounding whitespace and title-cased. Store the first three normalised names in `answer`.',
          reference: py`def normalise(name):
    return name.strip().title()

shared_names = [t["Name"] for t in tracks[:15]]
answer = [normalise(n) for n in shared_names][:3]`,
          walkthrough: 'A fixture builds shared setup once; here `shared_names` plays that role, reused by every case that needs it instead of being rebuilt each time.',
          traps: [py`def normalise(name):
    return name.strip().upper()

shared_names = [t["Name"] for t in tracks[:15]]
answer = [normalise(n) for n in shared_names][:3]`],
        }),
        pro({
          title: 'Keeping a filter fast: short-circuit vs scan-everything',
          use: ['tracks'],
          starter: 'def has_short_track(durations, limit=210000):\n    ...\n\ndurations = [t["Milliseconds"] for t in tracks[:100]]\nanswer = has_short_track(durations)\n',
          given: '# tracks is a list of dictionaries; durations holds the first 100 Milliseconds values (a real mix of short and long tracks).',
          brief: 'Write `has_short_track(durations, limit=210000)` returning whether any duration is less than or equal to `limit`. Store the result in `answer`.',
          reference: py`def has_short_track(durations, limit=210000):
    return any(d <= limit for d in durations)

durations = [t["Milliseconds"] for t in tracks[:100]]
answer = has_short_track(durations)`,
          walkthrough: '`any(...)` stops at the first match — the same reason a well-written test suite fails fast instead of grinding through every remaining case once one has already failed. Here the 100 tracks are a genuine mix, so `any` and `all` actually disagree, unlike a sample where every value happens to sit on the same side of the limit.',
          traps: [py`def has_short_track(durations, limit=210000):
    return all(d <= limit for d in durations)

durations = [t["Milliseconds"] for t in tracks[:100]]
answer = has_short_track(durations)`],
        }),
      ],
    },
    {
      id: 'py-mocking-test-doubles',
      title: 'Mocking and test doubles',
      blurb: 'Fakes, stubs, mocks and spies; unittest.mock; patching where a name is used.',
      kind: 'code',
      practice: {
        prompt: 'Write `total_with_prices(cart, api)`: `cart` is a list of item names, `api` is an object with a method `price(name)`. Return the sum of `api.price(name)` for every item in `cart`.',
        starter: 'def total_with_prices(cart, api):\n    ...\n',
        solution: py`def total_with_prices(cart, api):
    return sum(api.price(name) for name in cart)`,
        samples: ['class FakeApi:\n    def price(self, name):\n        return 2.0\ntotal_with_prices(["a", "b"], FakeApi())'],
        cases: [
          ['Two items at a fixed fake price', 'class FakeApi:\n    def price(self, name):\n        return 2.0\ntotal_with_prices(["a", "b"], FakeApi())'],
          ['Price depends on the item', 'class FakeApi:\n    def price(self, name):\n        return {"a": 1.0, "b": 3.0}[name]\ntotal_with_prices(["a", "b", "a"], FakeApi())'],
          ['An empty cart costs nothing', 'class FakeApi:\n    def price(self, name):\n        return 5.0\ntotal_with_prices([], FakeApi())'],
          ['A single item', 'class FakeApi:\n    def price(self, name):\n        return 9.99\ntotal_with_prices(["x"], FakeApi())'],
          ['Repeated items are each priced', 'class FakeApi:\n    def price(self, name):\n        return 1.5\ntotal_with_prices(["a", "a", "a"], FakeApi())'],
        ],
        traps: [
          py`def total_with_prices(cart, api):
    return len(cart) * api.price(cart[0]) if cart else 0`,
          py`def total_with_prices(cart, api):
    return sum(api.price(name) for name in set(cart))`,
        ],
      },
      real: [
        pro({
          title: 'Faking a currency-conversion service',
          use: ['tracks'],
          starter: 'def convert_total(prices, converter):\n    ...\n\nprices = [t["UnitPrice"] for t in tracks[:20]]\n\nclass FixedRate:\n    def to_eur(self, amount):\n        return round(amount * 0.9, 4)\n\nanswer = round(convert_total(prices, FixedRate()), 2)\n',
          given: '# tracks is a list of dictionaries; prices holds the first 20 UnitPrice values. FixedRate is a fake standing in for a real currency API.',
          brief: 'Write `convert_total(prices, converter)` returning the sum of `converter.to_eur(p)` for each price. Store the rounded (2 decimals) result in `answer`.',
          reference: py`def convert_total(prices, converter):
    return sum(converter.to_eur(p) for p in prices)

prices = [t["UnitPrice"] for t in tracks[:20]]

class FixedRate:
    def to_eur(self, amount):
        return round(amount * 0.9, 4)

answer = round(convert_total(prices, FixedRate()), 2)`,
          walkthrough: 'Injecting `FixedRate` instead of a real currency API is exactly what a test double buys you: deterministic behaviour, no network call, no real exchange-rate drift.',
          traps: [py`prices = [t["UnitPrice"] for t in tracks[:20]]

class FixedRate:
    def to_eur(self, amount):
        return round(amount * 0.9, 4)

def convert_total(prices, converter):
    return sum(converter.to_eur(p) for p in prices) - len(prices)

answer = round(convert_total(prices, FixedRate()), 2)`],
        }),
        pro({
          title: 'A spy that counts calls',
          use: ['tracks'],
          starter: 'class CountingApi:\n    def __init__(self):\n        self.calls = 0\n    def price(self, name):\n        self.calls += 1\n        return 1.0\n\ndef total_with_prices(cart, api):\n    ...\n\napi = CountingApi()\nnames = [t["Name"] for t in tracks[:12]]\ntotal = total_with_prices(names, api)\nanswer = (total, api.calls)\n',
          given: '# tracks is a list of dictionaries; names holds the first 12 track names. CountingApi is a spy that records how many times it was called.',
          brief: 'Write `total_with_prices(cart, api)` as before (sum of `api.price(name)` for each item). Store `(total_price, number_of_api_calls)` in `answer`.',
          reference: py`class CountingApi:
    def __init__(self):
        self.calls = 0
    def price(self, name):
        self.calls += 1
        return 1.0

def total_with_prices(cart, api):
    return sum(api.price(name) for name in cart)

api = CountingApi()
names = [t["Name"] for t in tracks[:12]]
total = total_with_prices(names, api)
answer = (total, api.calls)`,
          walkthrough: 'A spy is a fake that also remembers how it was used — here, proving the real code called the API exactly once per cart item, not zero and not twice.',
          traps: [py`class CountingApi:
    def __init__(self):
        self.calls = 0
    def price(self, name):
        self.calls += 1
        return 1.0

def total_with_prices(cart, api):
    total = 0
    for name in cart:
        total += api.price(name)
        total += api.price(name)
    return total / 2

api = CountingApi()
names = [t["Name"] for t in tracks[:12]]
total = total_with_prices(names, api)
answer = (total, api.calls)`],
        }),
        pro({
          title: 'Stubbing a flaky lookup',
          use: ['tracks'],
          starter: 'def safe_genre_name(track_id, lookup):\n    ...\n\nids = [t["TrackId"] for t in tracks[:10]]\n\nclass FlakyLookup:\n    def __init__(self):\n        self.calls = 0\n    def genre_of(self, track_id):\n        self.calls += 1\n        if self.calls % 2 == 0:\n            raise ConnectionError("down")\n        return "Rock"\n\nlookup = FlakyLookup()\nanswer = [safe_genre_name(i, lookup) for i in ids[:3]]\n',
          given: '# ids holds the first 10 TrackId values. FlakyLookup is a stub, scripted to fail on every second call regardless of which id is asked for — one shared instance is reused for all three lookups below.',
          brief: 'Write `safe_genre_name(track_id, lookup)` returning `lookup.genre_of(track_id)`, or `"unknown"` if that raises `ConnectionError`. Store the results for the first three ids in `answer`.',
          reference: py`def safe_genre_name(track_id, lookup):
    try:
        return lookup.genre_of(track_id)
    except ConnectionError:
        return "unknown"

ids = [t["TrackId"] for t in tracks[:10]]

class FlakyLookup:
    def __init__(self):
        self.calls = 0
    def genre_of(self, track_id):
        self.calls += 1
        if self.calls % 2 == 0:
            raise ConnectionError("down")
        return "Rock"

lookup = FlakyLookup()
answer = [safe_genre_name(i, lookup) for i in ids[:3]]`,
          walkthrough: 'A stub with scripted, sometimes-failing behaviour is how you test the unhappy path deterministically — no need to wait for a real service to actually go down. Sharing one `lookup` instance across all three calls is what makes the second call actually hit the failure branch.',
          traps: [py`ids = [t["TrackId"] for t in tracks[:10]]

class FlakyLookup:
    def __init__(self):
        self.calls = 0
    def genre_of(self, track_id):
        self.calls += 1
        if self.calls % 2 == 0:
            raise ConnectionError("down")
        return "Rock"

def safe_genre_name(track_id, lookup):
    return lookup.genre_of(track_id)

lookup = FlakyLookup()
answer = [safe_genre_name(i, lookup) for i in ids[:3]]`],
        }),
      ],
    },
    {
      id: 'py-tdd-refactoring',
      title: 'Test-driven development and refactoring safely',
      blurb: 'Red, green, refactor; characterisation tests; when TDD helps and when it does not.',
      kind: 'learn',
      check: [
        {
          q: 'What is the correct order of the TDD cycle?',
          options: [
            'Refactor, then write a test, then make it pass',
            'Write a failing test (red), make it pass with the simplest code (green), then improve the code (refactor)',
            'Write all the code first, then write tests to match it',
            'Write the documentation, then the tests, then the code',
          ],
          answer: 1,
          why: 'Red-green-refactor: fail first (proving the test can fail), pass minimally, then clean up while the passing test protects you.',
        },
        {
          q: 'What is a "characterisation test"?',
          options: [
            'A test that checks code style',
            'A test written against existing, undocumented behaviour, to pin it down before changing the code around it',
            'A test that only runs on characters (strings)',
            'A test that always fails until a feature ships',
          ],
          answer: 1,
          why: 'When you inherit legacy code with no tests, a characterisation test records what it *actually* does right now, so a refactor can be checked against that baseline.',
        },
        {
          q: 'Which situation is TDD least likely to help with?',
          options: [
            'A well-understood function with a clear input/output contract',
            'Exploratory work where you are not yet sure what the right design even is',
            'A bug fix where you can write a failing test that reproduces it first',
            'A pure function with several edge cases to cover',
          ],
          answer: 1,
          why: 'TDD works best when you can state the desired behaviour up front. Pure exploration often needs a spike or prototype before a test even makes sense to write.',
        },
        {
          q: 'Why does "refactor" come *after* green, not before?',
          options: [
            'It does not matter what order they happen in',
            'A passing test suite is what makes it safe to restructure code — refactoring without that safety net is just editing and hoping',
            'Refactoring always breaks tests, so it must happen last',
            'Refactoring is only about renaming variables',
          ],
          answer: 1,
          why: 'The whole point of having green tests first is that they catch you if a refactor changes behaviour by accident.',
        },
        {
          q: 'What does "testing implementation details" mean, and why is it a trap?',
          options: [
            'It means testing too many things at once',
            'It means asserting on private internals (e.g. an internal cache’s exact contents) rather than observable behaviour, which makes tests break on harmless refactors',
            'It means writing tests in a different file than the code',
            'It is not actually a problem',
          ],
          answer: 1,
          why: 'Tests coupled to internals fail every time you refactor, even when behaviour is unchanged — defeating the safety net TDD is supposed to provide.',
        },
      ],
    },
    {
      id: 'py-property-based-testing-coverage',
      title: 'Property-based testing and coverage (reading)',
      blurb: 'Generated inputs, shrinking, coverage.py, and what coverage does not tell you.',
      kind: 'read',
      check: [
        {
          q: 'What is the core idea of property-based testing (e.g. with Hypothesis)?',
          options: [
            'You write one example input and expected output per test, as usual',
            'You describe a *property* that should hold for a whole range of inputs (e.g. "sorting twice equals sorting once"), and the tool generates many inputs to try to break it',
            'It replaces unit tests entirely',
            'It only works on numeric inputs',
          ],
          answer: 1,
          why: 'Instead of picking individual examples, you state an invariant and let the framework search the input space for a counterexample.',
        },
        {
          q: 'What does "shrinking" mean in this context?',
          options: [
            'Making the test file smaller',
            'When a generated input fails, the tool automatically searches for the smallest, simplest failing input that still reproduces the bug',
            'Reducing the number of test cases run in CI',
            'Compressing test output logs',
          ],
          answer: 1,
          why: 'A huge random failing input is hard to debug; shrinking narrows it down to something like `[0, -1]` instead of a 200-element list.',
        },
        {
          q: 'What does a coverage percentage from coverage.py actually measure?',
          options: [
            'How correct your code is',
            'Which lines (or branches) of code were executed while the tests ran — nothing about whether the assertions were meaningful',
            'How many bugs are left',
            'How fast the test suite runs',
          ],
          answer: 1,
          why: '100% coverage just means every line ran at least once; a test with no assertions at all can still "cover" a line.',
        },
        {
          q: 'Why is 100% coverage not the same as "well tested"?',
          options: [
            'It is exactly the same thing',
            'A line can execute without its result ever being checked, and coverage says nothing about untested *combinations* of branches',
            'Coverage tools are always inaccurate',
            'Because 100% coverage is impossible to reach',
          ],
          answer: 1,
          why: 'Coverage answers "was this code run?", not "was this code checked?" — a necessary but far from sufficient signal.',
        },
        {
          q: 'What does mutation testing add on top of ordinary coverage?',
          options: [
            'Nothing new, it is a synonym for coverage',
            'It deliberately introduces small bugs (mutants) into your code and checks whether your test suite actually fails — a stronger signal than "this line ran"',
            'It generates documentation automatically',
            'It measures test execution speed',
          ],
          answer: 1,
          why: 'If a mutant survives (tests still pass with the bug injected), that reveals a gap coverage alone would have missed.',
        },
      ],
    },
    {
      id: 'py-linting-static-analysis',
      title: 'Linting, formatting and static analysis (reading)',
      blurb: 'PEP 8 checkers, ruff and black, import sorting, pre-commit hooks and CI.',
      kind: 'read',
      check: [
        {
          q: 'What is the difference between a linter and a formatter?',
          options: [
            'They are the same tool with two names',
            'A linter (e.g. ruff, flake8) flags likely bugs and style issues without changing code; a formatter (e.g. black) rewrites code into a consistent style automatically',
            'A formatter only works on comments',
            'A linter can only be run in CI, never locally',
          ],
          answer: 1,
          why: 'Linters report problems for a human (or CI) to act on; formatters just make the change for you, removing style debates entirely.',
        },
        {
          q: 'Why do many teams run an auto-formatter like black instead of debating style in code review?',
          options: [
            'Formatters are faster than linters',
            'It removes a whole category of bikeshedding — there is one canonical style, applied automatically, so reviews focus on behaviour instead',
            'It replaces the need for tests',
            'It is required by the Python language itself',
          ],
          answer: 1,
          why: 'A deterministic formatter ends "tabs vs spaces"-style arguments by making the question moot.',
        },
        {
          q: 'What does a pre-commit hook do?',
          options: [
            'It runs after code is pushed to the remote',
            'It runs checks (lint, format, tests) automatically before a commit is allowed to complete, catching problems before they even enter history',
            'It is a Git feature unrelated to code quality tools',
            'It only works with GitHub, not other Git hosts',
          ],
          answer: 1,
          why: 'pre-commit hooks run locally, right before the commit is created, so obvious issues never make it into the repository at all.',
        },
        {
          q: 'What kind of problem does a complexity checker (e.g. flagging high cyclomatic complexity) try to catch?',
          options: [
            'Slow-running code',
            'Functions with so many branching paths that they become hard to understand, test fully, and safely change',
            'Memory leaks',
            'Import cycles',
          ],
          answer: 1,
          why: 'Cyclomatic complexity roughly counts independent paths through a function — a high number correlates with code that is hard to reason about and easy to leave under-tested.',
        },
        {
          q: 'Why run lint/format/type checks in CI even if developers already run them locally?',
          options: [
            'CI runs are unnecessary if local checks exist',
            'Local checks can be skipped or forgotten; CI is the enforced, consistent gate that every change has to pass regardless of who wrote it or what they remembered to run',
            'CI only checks performance, not style',
            'It is purely a formality with no real benefit',
          ],
          answer: 1,
          why: 'CI is the backstop: it does not depend on anyone remembering to run a tool before pushing.',
        },
      ],
    },
  ],
  checkpoint: [],
}
