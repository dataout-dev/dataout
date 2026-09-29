import { py, pro } from './common.js'

export const advancedLanguageFeatures = {
  id: 'advanced-language-features',
  title: 'Advanced language features',
  intro: "Python's deeper idioms.",
  lessons: [
    {
      id: 'py-advanced-decorators-patterns',
      title: 'Advanced decorators: parametrised, class-based and stacked',
      blurb: 'Decorators with arguments, stacking order, and preserving signatures with wraps.',
      kind: 'code',
      practice: {
        prompt: 'Write `retry(times)`: a decorator factory. The decorator it returns calls the wrapped function repeatedly (up to `times` attempts total), stopping as soon as a call succeeds. It returns the **number of attempts actually made** — not the wrapped function’s own return value — whether it eventually succeeded or ran out of attempts.',
        starter: 'def retry(times):\n    ...\n',
        solution: py`def retry(times):
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
    return decorator`,
        samples: [
          'calls = [0]\ndef flaky():\n    calls[0] += 1\n    if calls[0] < 3:\n        raise ValueError("fail")\n    return "ok"\nretry(5)(flaky)()',
        ],
        cases: [
          ['Succeeds on the third attempt', 'calls = [0]\ndef flaky():\n    calls[0] += 1\n    if calls[0] < 3:\n        raise ValueError("fail")\n    return "ok"\nretry(5)(flaky)()'],
          ['Succeeds immediately', 'calls = [0]\ndef immediate():\n    calls[0] += 1\n    return "ok"\nretry(5)(immediate)()'],
          ['Never succeeds within the allowed attempts', 'calls = [0]\ndef always_fails():\n    calls[0] += 1\n    raise ValueError("fail")\nretry(3)(always_fails)()'],
          ['Succeeds on exactly the last allowed attempt', 'calls = [0]\ndef last_chance():\n    calls[0] += 1\n    if calls[0] < 2:\n        raise ValueError("fail")\n    return "ok"\nretry(2)(last_chance)()'],
        ],
        traps: [
          py`def retry(times):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            fn(*args, **kwargs)
            return 1
        return wrapper
    return decorator`,
          py`def retry(times):
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
    return decorator`,
          py`def retry(times):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            attempts = 0
            for _ in range(times - 1):
                attempts += 1
                try:
                    fn(*args, **kwargs)
                    return attempts
                except Exception:
                    pass
            return attempts
        return wrapper
    return decorator`,
        ],
      },
      real: [
        pro({
          title: 'Retrying a flaky lookup over real tracks',
          use: ['tracks'],
          starter: 'def retry(times):\n    ...\n\ncalls = [0]\ntarget_name = tracks[0]["Name"]\n\ndef lookup():\n    calls[0] += 1\n    if calls[0] < 2:\n        raise ConnectionError("down")\n    return next(t for t in tracks if t["Name"] == target_name)\n\nanswer = retry(4)(lookup)()\n',
          given: '# tracks is a list of dictionaries; target_name is a real track name. lookup fails once before succeeding.',
          brief: 'Write `retry` as in the lesson. Store the number of attempts `retry(4)(lookup)()` took in `answer`.',
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
target_name = tracks[0]["Name"]

def lookup():
    calls[0] += 1
    if calls[0] < 2:
        raise ConnectionError("down")
    return next(t for t in tracks if t["Name"] == target_name)

answer = retry(4)(lookup)()`,
          walkthrough: 'The decorator never inspects what `lookup` actually returns — it only cares whether the call raised, which is exactly what makes `retry` reusable across any flaky function, real data or not.',
          traps: [py`calls = [0]
target_name = tracks[0]["Name"]

def lookup():
    calls[0] += 1
    if calls[0] < 2:
        raise ConnectionError("down")
    return next(t for t in tracks if t["Name"] == target_name)

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

answer = retry(4)(lookup)()`],
        }),
        pro({
          title: 'A lookup that never recovers',
          use: ['customers'],
          starter: 'def retry(times):\n    ...\n\ndef always_missing():\n    raise KeyError(customers[0]["CustomerId"])\n\nanswer = retry(3)(always_missing)()\n',
          given: '# customers is a list of dictionaries. always_missing simulates a lookup that never succeeds.',
          brief: 'Write `retry` as in the lesson. Store the number of attempts made in `answer` (it should exhaust all 3).',
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

def always_missing():
    raise KeyError(customers[0]["CustomerId"])

answer = retry(3)(always_missing)()`,
          walkthrough: 'A retry decorator has to give up eventually — returning the exhausted attempt count (rather than raising, or looping forever) is what lets the caller decide what "gave up after N tries" should mean for them.',
          traps: [py`def always_missing():
    raise KeyError(customers[0]["CustomerId"])

def retry(times):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            attempts = 0
            for _ in range(times + 2):
                attempts += 1
                try:
                    fn(*args, **kwargs)
                    return attempts
                except Exception:
                    pass
            return attempts
        return wrapper
    return decorator

answer = retry(3)(always_missing)()`],
        }),
        pro({
          title: 'Two independent retry budgets',
          use: ['tracks'],
          starter: 'def retry(times):\n    ...\n\ncalls_a = [0]\ndef a():\n    calls_a[0] += 1\n    if calls_a[0] < 2:\n        raise ValueError()\n    return tracks[0]["Name"]\n\ncalls_b = [0]\ndef b():\n    calls_b[0] += 1\n    if calls_b[0] < 4:\n        raise ValueError()\n    return tracks[1]["Name"]\n\nanswer = (retry(5)(a)(), retry(5)(b)())\n',
          given: '# tracks is a list of dictionaries. a and b are two independently-flaky functions, each with its own call counter.',
          brief: 'Write `retry` as in the lesson. Store `(attempts_for_a, attempts_for_b)` in `answer`.',
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

calls_a = [0]
def a():
    calls_a[0] += 1
    if calls_a[0] < 2:
        raise ValueError()
    return tracks[0]["Name"]

calls_b = [0]
def b():
    calls_b[0] += 1
    if calls_b[0] < 4:
        raise ValueError()
    return tracks[1]["Name"]

answer = (retry(5)(a)(), retry(5)(b)())`,
          walkthrough: 'Each call to `retry(5)` creates a fresh `wrapper` closure with its own local `attempts` counter — wrapping two different functions never lets their attempt counts interfere with each other.',
          traps: [py`calls_a = [0]
def a():
    calls_a[0] += 1
    if calls_a[0] < 2:
        raise ValueError()
    return tracks[0]["Name"]

calls_b = [0]
def b():
    calls_b[0] += 1
    if calls_b[0] < 4:
        raise ValueError()
    return tracks[1]["Name"]

attempts_counter = [0]

def retry(times):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                attempts_counter[0] += 1
                try:
                    fn(*args, **kwargs)
                    return attempts_counter[0]
                except Exception:
                    pass
            return attempts_counter[0]
        return wrapper
    return decorator

answer = (retry(5)(a)(), retry(5)(b)())`],
        }),
      ],
    },
    {
      id: 'py-context-managers-exitstack',
      title: 'Advanced context managers and ExitStack',
      blurb: 'Nested and dynamic contexts with ExitStack, suppress, and reentrant contexts.',
      kind: 'code',
      practice: {
        prompt: 'Write `read_all(texts)`: using `contextlib.ExitStack`, open each string in `texts` as an in-memory file (`io.StringIO`), managed by the stack, and return a list of their contents (in order).',
        starter: 'from contextlib import ExitStack\nimport io\n\ndef read_all(texts):\n    ...\n',
        solution: py`from contextlib import ExitStack
import io

def read_all(texts):
    with ExitStack() as stack:
        files = [stack.enter_context(io.StringIO(t)) for t in texts]
        return [f.read() for f in files]`,
        samples: ['read_all(["a", "b", "c"])'],
        cases: [
          ['Three short texts', 'read_all(["a", "b", "c"])'],
          ['An empty list', 'read_all([])'],
          ['A single longer text', 'read_all(["hello world"])'],
          ['An empty string among real ones', 'read_all(["", "x"])'],
        ],
        traps: [
          py`from contextlib import ExitStack
import io

def read_all(texts):
    with ExitStack() as stack:
        files = [stack.enter_context(io.StringIO(t)) for t in texts]
    return [f.read() for f in files]`,
          py`from contextlib import ExitStack
import io

def read_all(texts):
    with ExitStack() as stack:
        files = [stack.enter_context(io.StringIO(t)) for t in reversed(texts)]
        return [f.read() for f in files]`,
        ],
      },
      real: [
        pro({
          title: 'Reading real track names through ExitStack',
          use: ['tracks'],
          starter: 'from contextlib import ExitStack\nimport io\n\ndef read_all(texts):\n    ...\n\nnames = [t["Name"] for t in tracks[:4]]\nanswer = read_all(names)\n',
          given: '# tracks is a list of dictionaries; names holds the first 4 real track names.',
          brief: 'Write `read_all` as in the lesson. Store the result for the real names in `answer`.',
          reference: py`from contextlib import ExitStack
import io

def read_all(texts):
    with ExitStack() as stack:
        files = [stack.enter_context(io.StringIO(t)) for t in texts]
        return [f.read() for f in files]

names = [t["Name"] for t in tracks[:4]]
answer = read_all(names)`,
          walkthrough: 'Nothing about `ExitStack` cares whether the strings are toy examples or real track titles — it manages the lifecycle of however many context managers `texts` happens to produce.',
          traps: [py`names = [t["Name"] for t in tracks[:4]]

from contextlib import ExitStack
import io

def read_all(texts):
    with ExitStack() as stack:
        files = [stack.enter_context(io.StringIO(t)) for t in texts]
        return [f.read().upper() for f in files]

answer = read_all(names)`],
        }),
        pro({
          title: 'A dynamic number of real files',
          use: ['artists'],
          starter: 'from contextlib import ExitStack\nimport io\n\ndef read_all(texts):\n    ...\n\nnames = [a["Name"] for a in artists[:7]]\nanswer = (len(read_all(names)), read_all(names)[0])\n',
          given: '# artists is a list of dictionaries; names holds 7 real artist names.',
          brief: 'Write `read_all` as in the lesson. Store `(count_of_results, first_result)` in `answer`.',
          reference: py`from contextlib import ExitStack
import io

def read_all(texts):
    with ExitStack() as stack:
        files = [stack.enter_context(io.StringIO(t)) for t in texts]
        return [f.read() for f in files]

names = [a["Name"] for a in artists[:7]]
answer = (len(read_all(names)), read_all(names)[0])`,
          walkthrough: '`ExitStack` does not need to know in advance how many context managers it will hold — `enter_context` can be called inside a loop of any length, dynamic or fixed.',
          traps: [py`names = [a["Name"] for a in artists[:7]]

from contextlib import ExitStack
import io

def read_all(texts):
    with ExitStack() as stack:
        files = [stack.enter_context(io.StringIO(t)) for t in texts[:-1]]
        return [f.read() for f in files]

answer = (len(read_all(names)), read_all(names)[0])`],
        }),
        pro({
          title: 'Empty input among real data',
          use: ['genres'],
          starter: 'from contextlib import ExitStack\nimport io\n\ndef read_all(texts):\n    ...\n\nreal_but_filtered = [g["Name"] for g in genres if g["Name"] == "Does Not Exist"]\nanswer = read_all(real_but_filtered)\n',
          given: '# genres is a list of dictionaries; real_but_filtered is empty, since no real genre has that name.',
          brief: 'Write `read_all` as in the lesson. Store the result in `answer` (it should be an empty list).',
          reference: py`from contextlib import ExitStack
import io

def read_all(texts):
    with ExitStack() as stack:
        files = [stack.enter_context(io.StringIO(t)) for t in texts]
        return [f.read() for f in files]

real_but_filtered = [g["Name"] for g in genres if g["Name"] == "Does Not Exist"]
answer = read_all(real_but_filtered)`,
          walkthrough: 'An `ExitStack` managing zero context managers is not a special case — the `with` block still enters and exits cleanly, and the list comprehension it wraps is simply empty.',
          traps: [py`real_but_filtered = [g["Name"] for g in genres if g["Name"] == "Does Not Exist"]

from contextlib import ExitStack
import io

def read_all(texts):
    with ExitStack() as stack:
        files = [stack.enter_context(io.StringIO(t)) for t in texts]
        return [f.read() for f in files] or ["nothing found"]

answer = read_all(real_but_filtered)`],
        }),
      ],
    },
    {
      id: 'py-metaprogramming-inspect',
      title: 'Metaprogramming: introspection, dynamic code and the inspect module',
      blurb: 'getattr and setattr, inspect signatures, __init_subclass__ registries, and code-generation risks.',
      kind: 'code',
      practice: {
        prompt: 'Write `defaults(fn)`: return a dict mapping each parameter name of `fn` that has a default value to that default value, using `inspect.signature`.',
        starter: 'import inspect\n\ndef defaults(fn):\n    ...\n',
        solution: py`import inspect

def defaults(fn):
    sig = inspect.signature(fn)
    return {
        name: p.default
        for name, p in sig.parameters.items()
        if p.default is not inspect.Parameter.empty
    }`,
        samples: ['defaults(lambda a, b=2, c=3: None)'],
        cases: [
          ['Two of three parameters have defaults', 'defaults(lambda a, b=2, c=3: None)'],
          ['No parameters have defaults', 'defaults(lambda x: None)'],
          ['A keyword-only parameter with a default', 'defaults(lambda a=1, *, b=2: None)'],
          ['A default of None still counts', 'def f(a, b=None): pass\ndefaults(f)'],
          ['No parameters at all', 'defaults(lambda: None)'],
        ],
        traps: [
          py`import inspect

def defaults(fn):
    sig = inspect.signature(fn)
    return {name: p.default for name, p in sig.parameters.items()}`,
          py`import inspect

def defaults(fn):
    sig = inspect.signature(fn)
    return {
        name: p.default
        for name, p in sig.parameters.items()
        if p.default is not None
    }`,
        ],
      },
      real: [
        pro({
          title: 'Defaults on a real data-processing function',
          use: ['tracks'],
          starter: 'import inspect\n\ndef defaults(fn):\n    ...\n\ndef price_bucket(price, cheap_limit=1.0, currency="USD"):\n    return price\n\nanswer = defaults(price_bucket)\n',
          given: '# tracks is loaded but not needed directly here; price_bucket is a small real-looking helper.',
          brief: 'Write `defaults` as in the lesson. Store the result for `price_bucket` in `answer`.',
          reference: py`import inspect

def defaults(fn):
    sig = inspect.signature(fn)
    return {
        name: p.default
        for name, p in sig.parameters.items()
        if p.default is not inspect.Parameter.empty
    }

def price_bucket(price, cheap_limit=1.0, currency="USD"):
    return price

answer = defaults(price_bucket)`,
          walkthrough: '`inspect.signature` works identically on any function, whether it is a one-line lambda from a test or a real helper with several keyword defaults.',
          traps: [py`import inspect

def price_bucket(price, cheap_limit=1.0, currency="USD"):
    return price

def defaults(fn):
    sig = inspect.signature(fn)
    return {name: p.default for name, p in sig.parameters.items()}

answer = defaults(price_bucket)`],
        }),
        pro({
          title: 'A function with no defaults at all',
          use: ['customers'],
          starter: 'import inspect\n\ndef defaults(fn):\n    ...\n\ndef full_name(first, last):\n    return first + " " + last\n\nanswer = (defaults(full_name), full_name(customers[0]["FirstName"], customers[0]["LastName"]))\n',
          given: '# customers is a list of dictionaries.',
          brief: 'Write `defaults` as in the lesson. Store `(defaults_dict, a_real_full_name)` in `answer`.',
          reference: py`import inspect

def defaults(fn):
    sig = inspect.signature(fn)
    return {
        name: p.default
        for name, p in sig.parameters.items()
        if p.default is not inspect.Parameter.empty
    }

def full_name(first, last):
    return first + " " + last

answer = (defaults(full_name), full_name(customers[0]["FirstName"], customers[0]["LastName"]))`,
          walkthrough: 'A function with no default arguments at all should return an empty dict, not raise — `inspect.signature` handles this the same way it handles any other function.',
          traps: [py`import inspect

def full_name(first, last):
    return first + " " + last

def defaults(fn):
    sig = inspect.signature(fn)
    return {name: None for name in sig.parameters}

answer = (defaults(full_name), full_name(customers[0]["FirstName"], customers[0]["LastName"]))`],
        }),
        pro({
          title: 'Introspecting a function built from real column names',
          use: ['genres'],
          starter: 'import inspect\n\ndef defaults(fn):\n    ...\n\ndef rename(old_name, new_name=None, dry_run=True):\n    return new_name or old_name\n\nanswer = (sorted(defaults(rename).keys()), rename(genres[0]["Name"]))\n',
          given: '# genres is a list of dictionaries.',
          brief: 'Write `defaults` as in the lesson. Store `(sorted_default_param_names, result_of_calling_rename_with_only_the_real_name)` in `answer`.',
          reference: py`import inspect

def defaults(fn):
    sig = inspect.signature(fn)
    return {
        name: p.default
        for name, p in sig.parameters.items()
        if p.default is not inspect.Parameter.empty
    }

def rename(old_name, new_name=None, dry_run=True):
    return new_name or old_name

answer = (sorted(defaults(rename).keys()), rename(genres[0]["Name"]))`,
          walkthrough: 'Sorting the parameter names before comparing sidesteps a detail that does not actually matter here — dict key order — while still checking that exactly the right parameters were identified as having defaults.',
          traps: [py`import inspect

def rename(old_name, new_name=None, dry_run=True):
    return new_name or old_name

def defaults(fn):
    sig = inspect.signature(fn)
    return {
        name: p.default
        for name, p in sig.parameters.items()
        if p.default is not inspect.Parameter.empty and name != "dry_run"
    }

answer = (sorted(defaults(rename).keys()), rename(genres[0]["Name"]))`],
        }),
      ],
    },
    {
      id: 'py-singledispatch-partial-dispatch',
      title: 'functools.singledispatch, partial and other dispatch tools',
      blurb: 'Single dispatch on argument type, partial and partialmethod, and comparing dispatch with match.',
      kind: 'code',
      practice: {
        prompt: 'Write a `@singledispatch` function `fmt(x)`: the default case returns `str(x)`; registered for `int`, return `f"int:{x}"`; for `list`, return `f"list:{len(x)}"`; for `dict`, return `f"dict:{sorted(x.keys())}"`.',
        starter: 'from functools import singledispatch\n\n@singledispatch\ndef fmt(x):\n    ...\n',
        solution: py`from functools import singledispatch

@singledispatch
def fmt(x):
    return str(x)

@fmt.register
def _(x: int):
    return f"int:{x}"

@fmt.register
def _(x: list):
    return f"list:{len(x)}"

@fmt.register
def _(x: dict):
    return f"dict:{sorted(x.keys())}"`,
        samples: ['fmt(5)'],
        cases: [
          ['An int', 'fmt(5)'],
          ['A list', 'fmt([1, 2, 3])'],
          ['A dict, keys sorted regardless of insertion order', 'fmt({"b": 1, "a": 2})'],
          ['Falls back to str for an unregistered type', 'fmt("hello")'],
          ['An empty list', 'fmt([])'],
        ],
        traps: [
          py`from functools import singledispatch

@singledispatch
def fmt(x):
    return str(x)

@fmt.register
def _(x: int):
    return f"int:{x}"

@fmt.register
def _(x: list):
    return f"list:{len(x)}"

@fmt.register
def _(x: dict):
    return f"dict:{list(x.keys())}"`,
          py`from functools import singledispatch

@singledispatch
def fmt(x):
    return str(x)

@fmt.register
def _(x: int):
    return f"list:{x}"

@fmt.register
def _(x: list):
    return f"list:{len(x)}"

@fmt.register
def _(x: dict):
    return f"dict:{sorted(x.keys())}"`,
        ],
      },
      real: [
        pro({
          title: 'Formatting real Chinook values by type',
          use: ['tracks'],
          starter: 'from functools import singledispatch\n\n@singledispatch\ndef fmt(x):\n    ...\n\n@fmt.register\ndef _(x: int):\n    ...\n\n@fmt.register\ndef _(x: list):\n    ...\n\n@fmt.register\ndef _(x: dict):\n    ...\n\nrow = tracks[0]\nanswer = (fmt(row["TrackId"]), fmt(row["Name"]), fmt([row]))\n',
          given: '# tracks is a list of dictionaries; row is the first real track.',
          brief: 'Write `fmt` as in the lesson. Store `(fmt(real_id), fmt(real_name), fmt([real_row]))` in `answer` — the name has no registered handler, so it falls back to `str`.',
          reference: py`from functools import singledispatch

@singledispatch
def fmt(x):
    return str(x)

@fmt.register
def _(x: int):
    return f"int:{x}"

@fmt.register
def _(x: list):
    return f"list:{len(x)}"

@fmt.register
def _(x: dict):
    return f"dict:{sorted(x.keys())}"

row = tracks[0]
answer = (fmt(row["TrackId"]), fmt(row["Name"]), fmt([row]))`,
          walkthrough: 'Dispatch happens purely on the runtime type of the first argument — a real `TrackId` (an `int`) and a real `Name` (a `str`, unregistered) land in completely different branches with no type-checking code written by hand.',
          traps: [py`from functools import singledispatch

@singledispatch
def fmt(x):
    return str(x)

@fmt.register
def _(x: int):
    return str(x)

@fmt.register
def _(x: list):
    return f"list:{len(x)}"

@fmt.register
def _(x: dict):
    return f"dict:{sorted(x.keys())}"

row = tracks[0]
answer = (fmt(row["TrackId"]), fmt(row["Name"]), fmt([row]))`],
        }),
        pro({
          title: 'Dispatching on a real customer record',
          use: ['customers'],
          starter: 'from functools import singledispatch\n\n@singledispatch\ndef fmt(x):\n    ...\n\n@fmt.register\ndef _(x: int):\n    ...\n\n@fmt.register\ndef _(x: list):\n    ...\n\n@fmt.register\ndef _(x: dict):\n    ...\n\nanswer = fmt(customers[0])\n',
          given: '# customers is a list of dictionaries; customers[0] is a real customer record.',
          brief: 'Write `fmt` as in the lesson. Store the result of `fmt` on the raw first customer dict in `answer`.',
          reference: py`from functools import singledispatch

@singledispatch
def fmt(x):
    return str(x)

@fmt.register
def _(x: int):
    return f"int:{x}"

@fmt.register
def _(x: list):
    return f"list:{len(x)}"

@fmt.register
def _(x: dict):
    return f"dict:{sorted(x.keys())}"

answer = fmt(customers[0])`,
          walkthrough: 'A real customer record is just another `dict` as far as dispatch is concerned — the registered `dict` handler runs regardless of where the dictionary actually came from.',
          traps: [py`from functools import singledispatch

@singledispatch
def fmt(x):
    return str(x)

@fmt.register
def _(x: int):
    return f"int:{x}"

@fmt.register
def _(x: list):
    return f"list:{len(x)}"

@fmt.register
def _(x: dict):
    return f"dict:{list(x.keys())[:1]}"

answer = fmt(customers[0])`],
        }),
        pro({
          title: 'Using partial to fix a real default',
          use: ['tracks'],
          starter: 'from functools import partial\n\ndef convert(ms, unit="minutes"):\n    ...\n\nto_minutes = partial(convert, unit="minutes")\nanswer = round(to_minutes(tracks[0]["Milliseconds"]), 2)\n',
          given: '# tracks is a list of dictionaries. to_minutes will be convert with unit already fixed to "minutes".',
          brief: 'Write `convert(ms, unit="minutes")` returning `ms / 60000` for `"minutes"` or `ms / 1000` for any other unit. Store the rounded (2 decimals) result of `to_minutes` applied to the first real track’s duration in `answer`.',
          reference: py`from functools import partial

def convert(ms, unit="minutes"):
    return ms / 60000 if unit == "minutes" else ms / 1000

to_minutes = partial(convert, unit="minutes")
answer = round(to_minutes(tracks[0]["Milliseconds"]), 2)`,
          walkthrough: '`partial` bakes in the `unit="minutes"` keyword once, producing a narrower, single-purpose function — useful anywhere the original, more general `convert` would otherwise need repeating the same argument at every call site.',
          traps: [py`from functools import partial

def convert(ms, unit="minutes"):
    return ms / 60000 if unit == "minutes" else ms / 1000

to_minutes = partial(convert, unit="seconds")
answer = round(to_minutes(tracks[0]["Milliseconds"]), 2)`],
        }),
      ],
    },
    {
      id: 'py-pattern-matching-in-depth',
      title: 'Structural pattern matching in depth',
      blurb: 'Class patterns, mapping and sequence patterns, nested patterns, and guards.',
      kind: 'code',
      practice: {
        prompt: 'Write `evaluate(expr)`: `expr` is either a plain number, or a tuple `("add"|"mul"|"sub", left, right)` where `left`/`right` are themselves numbers or nested expression tuples. Evaluate it recursively using `match`.',
        starter: 'def evaluate(expr):\n    ...\n',
        solution: py`def evaluate(expr):
    match expr:
        case int() | float():
            return expr
        case ("add", a, b):
            return evaluate(a) + evaluate(b)
        case ("mul", a, b):
            return evaluate(a) * evaluate(b)
        case ("sub", a, b):
            return evaluate(a) - evaluate(b)
        case _:
            raise ValueError(f"unknown expr: {expr}")`,
        samples: ['evaluate(("add", 1, ("mul", 2, 3)))'],
        cases: [
          ['A nested expression', 'evaluate(("add", 1, ("mul", 2, 3)))'],
          ['A bare number', 'evaluate(5)'],
          ['Subtraction', 'evaluate(("sub", 10, 3))'],
          ['Nested on both sides', 'evaluate(("mul", ("add", 1, 1), ("add", 2, 2)))'],
          ['Subtraction nested inside addition', 'evaluate(("add", ("sub", 5, 2), 1))'],
        ],
        traps: [
          py`def evaluate(expr):
    match expr:
        case int() | float():
            return expr
        case ("add", a, b):
            return evaluate(a) + evaluate(b)
        case ("mul", a, b):
            return evaluate(a) + evaluate(b)
        case ("sub", a, b):
            return evaluate(a) - evaluate(b)
        case _:
            raise ValueError(f"unknown expr: {expr}")`,
          py`def evaluate(expr):
    match expr:
        case int() | float():
            return expr
        case ("add", a, b):
            return evaluate(a) + evaluate(b)
        case ("mul", a, b):
            return evaluate(a) * evaluate(b)
        case ("sub", a, b):
            return evaluate(b) - evaluate(a)
        case _:
            raise ValueError(f"unknown expr: {expr}")`,
        ],
      },
      real: [
        pro({
          title: 'Building expressions from real prices',
          use: ['tracks'],
          starter: 'def evaluate(expr):\n    ...\n\np1 = tracks[0]["UnitPrice"]\np2 = tracks[1]["UnitPrice"]\nanswer = round(evaluate(("add", p1, ("mul", p2, 2))), 4)\n',
          given: '# tracks is a list of dictionaries; p1 and p2 are two real UnitPrice values.',
          brief: 'Write `evaluate` as in the lesson. Store the rounded (4 decimals) result in `answer`.',
          reference: py`def evaluate(expr):
    match expr:
        case int() | float():
            return expr
        case ("add", a, b):
            return evaluate(a) + evaluate(b)
        case ("mul", a, b):
            return evaluate(a) * evaluate(b)
        case ("sub", a, b):
            return evaluate(a) - evaluate(b)
        case _:
            raise ValueError(f"unknown expr: {expr}")

p1 = tracks[0]["UnitPrice"]
p2 = tracks[1]["UnitPrice"]
answer = round(evaluate(("add", p1, ("mul", p2, 2))), 4)`,
          walkthrough: 'The recursion does not care whether a leaf value is a toy integer or a real price read from Chinook — `int() | float()` matches either, and the arithmetic works the same way.',
          traps: [py`p1 = tracks[0]["UnitPrice"]
p2 = tracks[1]["UnitPrice"]

def evaluate(expr):
    match expr:
        case int() | float():
            return expr
        case ("add", a, b):
            return evaluate(a) + evaluate(b)
        case ("mul", a, b):
            return evaluate(a) + evaluate(b)
        case ("sub", a, b):
            return evaluate(a) - evaluate(b)
        case _:
            raise ValueError(f"unknown expr: {expr}")

answer = round(evaluate(("add", p1, ("mul", p2, 2))), 4)`],
        }),
        pro({
          title: 'A deeper real expression tree',
          use: ['invoices'],
          starter: 'def evaluate(expr):\n    ...\n\nt1 = invoices[3]["Total"]\nt2 = invoices[4]["Total"]\nt3 = invoices[5]["Total"]\nanswer = round(evaluate(("sub", ("add", t1, t2), t3)), 4)\n',
          given: '# invoices is a list of dictionaries; t1, t2, t3 are three real invoice totals.',
          brief: 'Write `evaluate` as in the lesson. Store the rounded (4 decimals) result in `answer`.',
          reference: py`def evaluate(expr):
    match expr:
        case int() | float():
            return expr
        case ("add", a, b):
            return evaluate(a) + evaluate(b)
        case ("mul", a, b):
            return evaluate(a) * evaluate(b)
        case ("sub", a, b):
            return evaluate(a) - evaluate(b)
        case _:
            raise ValueError(f"unknown expr: {expr}")

t1 = invoices[3]["Total"]
t2 = invoices[4]["Total"]
t3 = invoices[5]["Total"]
answer = round(evaluate(("sub", ("add", t1, t2), t3)), 4)`,
          walkthrough: 'Each `case` peels off one layer of the tuple and recurses — a three-level-deep real expression is handled by the exact same three `case` branches as a one-level toy example.',
          traps: [py`t1 = invoices[3]["Total"]
t2 = invoices[4]["Total"]
t3 = invoices[5]["Total"]

def evaluate(expr):
    match expr:
        case int() | float():
            return expr
        case ("add", a, b):
            return evaluate(a) + evaluate(b)
        case ("mul", a, b):
            return evaluate(a) * evaluate(b)
        case ("sub", a, b):
            return evaluate(b) - evaluate(a)
        case _:
            raise ValueError(f"unknown expr: {expr}")

answer = round(evaluate(("sub", ("add", t1, t2), t3)), 4)`],
        }),
        pro({
          title: 'An unrecognised shape raises cleanly',
          use: ['tracks'],
          starter: 'def evaluate(expr):\n    ...\n\ndef safe_evaluate(expr):\n    try:\n        return evaluate(expr)\n    except ValueError:\n        return "invalid"\n\nanswer = (safe_evaluate(("divide", tracks[0]["UnitPrice"], 2)), safe_evaluate(tracks[0]["UnitPrice"]))\n',
          given: '# tracks is a list of dictionaries. "divide" is deliberately not one of the supported operations.',
          brief: 'Write `evaluate` as in the lesson (it should raise `ValueError` for an unrecognised shape, like `"divide"`). Store `(result_for_divide, result_for_a_plain_number)` in `answer`.',
          reference: py`def evaluate(expr):
    match expr:
        case int() | float():
            return expr
        case ("add", a, b):
            return evaluate(a) + evaluate(b)
        case ("mul", a, b):
            return evaluate(a) * evaluate(b)
        case ("sub", a, b):
            return evaluate(a) - evaluate(b)
        case _:
            raise ValueError(f"unknown expr: {expr}")

def safe_evaluate(expr):
    try:
        return evaluate(expr)
    except ValueError:
        return "invalid"

answer = (safe_evaluate(("divide", tracks[0]["UnitPrice"], 2)), safe_evaluate(tracks[0]["UnitPrice"]))`,
          walkthrough: 'The catch-all `case _` is what turns an unsupported shape into a clean, catchable `ValueError` instead of match silently falling through and returning `None`.',
          traps: [py`def evaluate(expr):
    match expr:
        case int() | float():
            return expr
        case ("add", a, b):
            return evaluate(a) + evaluate(b)
        case ("mul", a, b):
            return evaluate(a) * evaluate(b)
        case ("sub", a, b):
            return evaluate(a) - evaluate(b)
        case _:
            return None

def safe_evaluate(expr):
    try:
        return evaluate(expr)
    except ValueError:
        return "invalid"

answer = (safe_evaluate(("divide", tracks[0]["UnitPrice"], 2)), safe_evaluate(tracks[0]["UnitPrice"]))`],
        }),
      ],
    },
    {
      id: 'py-modern-python-features',
      title: 'What is new in modern Python: 3.10 to 3.14 highlights',
      blurb: 'match, union types with |, ExceptionGroup and except*, tomllib, and free-threaded builds.',
      kind: 'learn',
      check: [
        {
          q: 'What did `X | Y` for type hints (instead of `Union[X, Y]`) become possible in, and what does it demonstrate about how Python has been evolving?',
          options: [
            'It has always worked this way since Python 2',
            'Added in Python 3.10, it lets common typing patterns read as plain, unimported syntax — part of a broader trend of making frequently-used typing features feel like a natural part of the language rather than something bolted on via `typing` imports',
            'It only works inside string annotations',
            'It replaces the need for type checkers entirely',
          ],
          answer: 1,
          why: '`int | str` reads far more directly than `Union[int, str]`, and needing no import from `typing` for such a common case is a small but real usability improvement.',
        },
        {
          q: 'What was genuinely new about the `match` statement, added in Python 3.10?',
          options: [
            'Nothing; it is identical to a chain of if/elif',
            'Real structural pattern matching — destructuring tuples, dicts, and class instances directly in a `case` pattern, including nested and guarded patterns — well beyond what a chain of `if`/`elif` on equality checks alone could express as directly',
            'It only works on strings',
            'It replaces functions entirely',
          ],
          answer: 1,
          why: 'A `case Point(x=0, y=y)` pattern destructures and matches a class instance’s shape in one line, something an equivalent if/elif chain would need considerably more code to express clearly.',
        },
        {
          q: 'What problem does `ExceptionGroup` and `except*` (Python 3.11) solve?',
          options: [
            'They make exceptions faster',
            'They represent and handle the case where *multiple* unrelated exceptions occurred together (as from a `TaskGroup` running several tasks concurrently) — something a single `try`/`except` was never designed to express',
            'They are only used for logging',
            'They deprecate the older except syntax entirely',
          ],
          answer: 1,
          why: 'Before 3.11, there was no clean way to represent "three concurrent tasks failed with three different exceptions" as one catchable thing — `ExceptionGroup` is exactly that representation, and `except*` is how you catch specific types out of it.',
        },
        {
          q: 'What does `tomllib` (added to the standard library in Python 3.11) provide?',
          options: [
            'A new templating engine',
            'A built-in TOML parser — useful directly for reading `pyproject.toml` and similar config files without needing a third-party dependency just to parse TOML',
            'A replacement for JSON entirely',
            'A tool for writing TOML files (it is read-only, deliberately)',
          ],
          answer: 1,
          why: 'Since `pyproject.toml` itself is TOML, having a standard-library parser removes a small but common third-party dependency many projects previously needed just for this.',
        },
        {
          q: 'What is the practical status of free-threaded (no-GIL) Python builds and the JIT experiments in recent versions?',
          options: [
            'They are the stable, universal default already, with no caveats',
            'They are real, significant, still-maturing changes to the runtime — opt-in build variants that promise genuine multi-core threading and faster execution, but with an ecosystem (especially C extensions) still catching up to full compatibility',
            'They were abandoned and removed',
            'They only affect Python’s standard library, never user code',
          ],
          answer: 1,
          why: 'These are among the most significant changes to CPython’s execution model in years — genuinely promising, but not yet something to depend on as the default, production-ready experience for an arbitrary project and its dependencies.',
        },
      ],
    },
  ],
  checkpoint: [],
}
