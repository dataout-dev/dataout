import { py, chi } from './common.js'

export const functionalTools = {
  id: 'functions-and-functional-tools',
  title: 'Functions and functional tools',
  intro: 'Everything that makes Python functions flexible.',
  lessons: [
    {
      id: 'py-args-kwargs',
      title: '*args, **kwargs, keyword-only and positional-only parameters',
      blurb: 'Flexible signatures, unpacking and forwarding arguments.',
      kind: 'code',
      practice: {
        prompt: 'Write `total(*nums, scale=1)`. It accepts **any number of numbers** and returns their **sum multiplied by `scale`**.\n\n`scale` can only be given **by name**. With no numbers, the total is `0`.',
        starter: 'def total(*nums, scale=1):\n    ...\n',
        solution: py`def total(*nums, scale=1):
    return sum(nums) * scale`,
        samples: ['total(1, 2, 3)', 'total(1, 2, 3, scale=10)'],
        cases: [
          ['Several numbers', 'total(1, 2, 3)'],
          ['With a scale', 'total(1, 2, 3, scale=10)'],
          ['No numbers', 'total()'],
          ['One number and a scale', 'total(5, scale=2)'],
          ['Decimals', 'total(1.5, 2.5)'],
          ['A scale of zero', 'total(4, 5, scale=0)'],
          ['Negative numbers', 'total(-1, -2, scale=3)'],
          ['A scale and no numbers', 'total(scale=7)'],
        ],
        traps: [
          py`def total(nums, scale=1):
    return sum(nums) * scale`,
          py`def total(*nums, scale=1):
    return sum(nums)`,
          py`def total(scale=1, *nums):
    return sum(nums) * scale`,
          py`def total(*nums, scale=1):
    return sum(nums) + scale`,
        ],
      },
      real: [
        chi({
          title: 'The longest names from several lists',
          use: ['artists', 'albums', 'genres'],
          hidden: 'a = [x["Name"] for x in artists[:50]]\nb = [x["Title"] for x in albums[:50]]\nc = [x["Name"] for x in genres]\n',
          starter: 'def top_names(*groups, n=3):\n    ...\n\nanswer = top_names(a, b, c, n=4)\n',
          given: '# a, b and c are three lists of names.',
          brief: 'Write `top_names(*groups, n=3)`. It combines **any number of lists** and returns the `n` **longest** texts, longest first. Texts of equal length are in alphabetical order. The last line calls it with `n=4`.',
          reference: py`def top_names(*groups, n=3):
    everything = [name for group in groups for name in group]
    return sorted(everything, key=lambda name: (-len(name), name))[:n]

answer = top_names(a, b, c, n=4)`,
          walkthrough: '`*groups` collects the lists into a tuple, and `n` after it is keyword-only. A comprehension with two `for` parts flattens the lists, and a tuple as the sort key gives the length first and the name second.',
          traps: [py`def top_names(*groups, n=3):
    everything = [name for group in groups for name in group]
    return sorted(everything, key=lambda name: (-len(name), name))[:3]

answer = top_names(a, b, c, n=4)`, py`def top_names(*groups, n=3):
    everything = [name for group in groups for name in group]
    return sorted(everything, key=lambda name: (len(name), name))[:n]

answer = top_names(a, b, c, n=4)`],
        }),
        chi({
          title: 'A total with options',
          use: ['tracks'],
          starter: 'def format_total(*prices, decimals=2, currency="USD"):\n    ...\n\nanswer = format_total(*[t["UnitPrice"] for t in tracks[:10]], decimals=1)\n',
          given: '# The last line unpacks the prices of ten tracks into separate arguments.',
          brief: 'Write `format_total(*prices, decimals=2, currency="USD")`. It returns the sum of the prices as text with `decimals` decimal places, a space, and the currency, for example `"9.90 USD"`. The last line uses `*` to unpack a list.',
          reference: py`def format_total(*prices, decimals=2, currency="USD"):
    return f"{sum(prices):.{decimals}f} {currency}"

answer = format_total(*[t["UnitPrice"] for t in tracks[:10]], decimals=1)`,
          walkthrough: 'The width of the format can itself come from a variable: `{value:.{decimals}f}`. The star in the call spreads the list into separate positional arguments.',
          traps: [py`def format_total(*prices, decimals=2, currency="USD"):
    return f"{sum(prices):.2f} {currency}"

answer = format_total(*[t["UnitPrice"] for t in tracks[:10]], decimals=1)`, py`def format_total(*prices, decimals=2, currency="USD"):
    return f"{sum(prices):.{decimals}f}"

answer = format_total(*[t["UnitPrice"] for t in tracks[:10]], decimals=1)`],
        }),
        chi({
          title: 'Forward every argument',
          use: ['tracks'],
          hidden: 'names = [t["Name"] for t in tracks]\n',
          starter: 'def call_with_name(function, *args, **kwargs):\n    ...\n\nanswer = call_with_name(max, names, key=len)\n',
          given: '# names is a list of all track names.',
          brief: 'Write `call_with_name(function, *args, **kwargs)`. It calls `function` with **all the other arguments** and returns a tuple: the **name of the function** (`function.__name__`) and its result. The last line uses it with `max` and a `key`.',
          reference: py`def call_with_name(function, *args, **kwargs):
    return function.__name__, function(*args, **kwargs)

answer = call_with_name(max, names, key=len)`,
          walkthrough: 'Anything the caller passes after `function` is collected by `*args` and `**kwargs`, and spread again in the call. That is how a wrapper passes everything through.',
          traps: [py`def call_with_name(function, *args, **kwargs):
    return function.__name__, function(*args)

answer = call_with_name(max, names, key=len)`, py`def call_with_name(function, *args, **kwargs):
    return function(*args, **kwargs)

answer = call_with_name(max, names, key=len)`],
        }),
      ],
    },
    {
      id: 'py-closures',
      title: 'Closures, nonlocal and function factories',
      blurb: 'Inner functions, captured variables and the loop capture bug.',
      kind: 'code',
      practice: {
        prompt: 'Write `make_counter(start=0)`. It returns a **function**. Each time that function is called, it **adds 1** to its own count and returns the **new count**.\n\nThe first call after `make_counter(10)` returns `11`. Two counters made separately must not affect each other.',
        starter: 'def make_counter(start=0):\n    ...\n',
        solution: py`def make_counter(start=0):
    count = start

    def increment():
        nonlocal count
        count += 1
        return count

    return increment`,
        samples: ['(lambda c: [c(), c(), c()])(make_counter())'],
        cases: [
          ['A default counter', '(lambda c: [c(), c(), c()])(make_counter())'],
          ['A counter that starts at 10', '(lambda c: [c(), c(), c()])(make_counter(10))'],
          ['Two independent counters', '(lambda a, b: [a(), a(), b(), a(), b()])(make_counter(), make_counter(100))'],
          ['A negative start', '(lambda c: [c(), c(), c()])(make_counter(-2))'],
          ['A single call', 'make_counter(5)()'],
        ],
        traps: [
          py`total = 0

def make_counter(start=0):
    global total

    def increment():
        global total
        total += 1
        return total + start

    return increment`,
          py`def make_counter(start=0):
    count = start

    def increment():
        nonlocal count
        count += 1
        return count - 1

    return increment`,
          py`def make_counter(start=0):
    count = 0

    def increment():
        nonlocal count
        count += 1
        return count

    return increment`,
          py`def make_counter(start=0):
    count = start

    def increment():
        count += 1
        return count

    return increment`,
        ],
      },
      real: [
        chi({
          title: 'Fix the loop capture bug',
          starter: 'functions = []\nfor i in range(1, 4):\n    functions.append(lambda x: x * i)\n\nanswer = [f(10) for f in functions]\n',
          given: '# The code below has a bug: every function ends up using the same i.',
          brief: 'The code builds three functions that multiply by 1, 2 and 3. But all of them multiply by 3. **Fix** it, so that `answer` is `[10, 20, 30]`.',
          reference: py`functions = []
for i in range(1, 4):
    functions.append(lambda x, i=i: x * i)

answer = [f(10) for f in functions]`,
          walkthrough: 'A lambda looks up `i` when it is called, so all three see the final value. A default argument `i=i` is evaluated when the lambda is created, and freezes the current value.',
          traps: [py`functions = []
for i in range(1, 4):
    functions.append(lambda x: x * i)

answer = [f(10) for f in functions]`, py`functions = []
for i in range(1, 4):
    functions.append(lambda x, i=i: x + i)

answer = [f(10) for f in functions]`],
        }),
        chi({
          title: 'A tax factory',
          use: ['tracks'],
          starter: 'def make_taxer(rate):\n    ...\n\ntaxers = {"low": make_taxer(0.05), "high": make_taxer(0.2)}\nanswer = {name: round(sum(taxer(t["UnitPrice"]) for t in tracks[:100]), 2) for name, taxer in taxers.items()}\n',
          given: '# The last lines build two taxers and total the first hundred track prices with each.',
          brief: 'Write `make_taxer(rate)`. It returns a function that takes a **price** and returns `price * (1 + rate)`. Each taxer must remember its own rate.',
          reference: py`def make_taxer(rate):
    def taxer(price):
        return price * (1 + rate)
    return taxer

taxers = {"low": make_taxer(0.05), "high": make_taxer(0.2)}
answer = {name: round(sum(taxer(t["UnitPrice"]) for t in tracks[:100]), 2) for name, taxer in taxers.items()}`,
          walkthrough: 'Each call to `make_taxer` creates a new inner function that captures its own `rate`. The two taxers therefore give different results.',
          traps: [py`def make_taxer(rate):
    def taxer(price):
        return price * (1 + 0.05)
    return taxer

taxers = {"low": make_taxer(0.05), "high": make_taxer(0.2)}
answer = {name: round(sum(taxer(t["UnitPrice"]) for t in tracks[:100]), 2) for name, taxer in taxers.items()}`, py`def make_taxer(rate):
    def taxer(price):
        return price * rate
    return taxer

taxers = {"low": make_taxer(0.05), "high": make_taxer(0.2)}
answer = {name: round(sum(taxer(t["UnitPrice"]) for t in tracks[:100]), 2) for name, taxer in taxers.items()}`],
        }),
        chi({
          title: 'A running maximum',
          use: ['tracks'],
          starter: 'def make_max_tracker():\n    ...\n\ntrack = make_max_tracker()\nanswer = [track(t["Milliseconds"]) for t in tracks[:12]]\n',
          given: '# The last lines feed the lengths of the first twelve tracks to the tracker.',
          brief: 'Write `make_max_tracker()`. It returns a function `track(value)` that remembers the **largest value seen so far** (including the current one) and returns it. Use `nonlocal`.',
          reference: py`def make_max_tracker():
    best = None

    def track(value):
        nonlocal best
        if best is None or value > best:
            best = value
        return best

    return track

track = make_max_tracker()
answer = [track(t["Milliseconds"]) for t in tracks[:12]]`,
          walkthrough: 'The inner function rebinds `best`, so it needs `nonlocal`. Starting from `None` means the first value is always accepted.',
          traps: [py`def make_max_tracker():
    def track(value):
        return value
    return track

track = make_max_tracker()
answer = [track(t["Milliseconds"]) for t in tracks[:12]]`, py`def make_max_tracker():
    best = None

    def track(value):
        nonlocal best
        if best is None or value < best:
            best = value
        return best

    return track

track = make_max_tracker()
answer = [track(t["Milliseconds"]) for t in tracks[:12]]`],
        }),
      ],
    },
    {
      id: 'py-higher-order',
      title: 'Higher-order functions: map, filter, reduce and key functions',
      blurb: 'Functions as values, key= and composition.',
      kind: 'code',
      practice: {
        prompt: 'Write `compose(*funcs)`. It returns a **new function** that takes one value and passes it through every function in `funcs`, **from left to right**: the result of the first goes into the second, and so on.\n\nWith no functions, the new function returns its argument unchanged.',
        starter: 'def compose(*funcs):\n    ...\n',
        solution: py`def compose(*funcs):
    def combined(value):
        for func in funcs:
            value = func(value)
        return value
    return combined`,
        samples: ['compose(str.strip, str.lower)("  AbC ")'],
        cases: [
          ['Two string functions', 'compose(str.strip, str.lower)("  AbC ")'],
          ['One function', 'compose(len)("abcd")'],
          ['No functions', 'compose()(5)'],
          ['The order matters', 'compose(lambda x: x + 1, lambda x: x * 2)(3)'],
          ['A pipeline of types', 'compose(str.split, len)("a b c")'],
          ['Reusable', '(lambda f: (f(1), f(2)))(compose(lambda x: x + 1, lambda x: x * 2))'],
          ['Three functions', 'compose(str.upper, str.strip, lambda s: s + "!")("  hi ")'],
        ],
        traps: [
          py`def compose(*funcs):
    def combined(value):
        for func in reversed(funcs):
            value = func(value)
        return value
    return combined`,
          py`from functools import reduce

def compose(*funcs):
    return lambda value: reduce(lambda acc, f: f(acc), funcs)`,
          py`def compose(*funcs):
    return [f for f in funcs]`,
          py`def compose(*funcs):
    def combined(value):
        for func in funcs:
            value = func(value)
            return value
    return combined`,
        ],
      },
      real: [
        chi({
          title: 'The priciest tracks',
          use: ['tracks'],
          given: '# tracks is a list of dictionaries with "Name" and "UnitPrice".',
          brief: 'Sort the tracks with a **key function**: the highest `UnitPrice` first, and tracks with the same price in **alphabetical order** of `Name`. Store in `answer` the **names of the first five**.',
          reference: py`ordered = sorted(tracks, key=lambda t: (-t["UnitPrice"], t["Name"]))
answer = [t["Name"] for t in ordered[:5]]`,
          walkthrough: 'A tuple key sorts by its first item and then by the second. Negating the price puts the largest first without needing `reverse=True`, which would also reverse the names.',
          traps: [py`ordered = sorted(tracks, key=lambda t: (t["UnitPrice"], t["Name"]), reverse=True)
answer = [t["Name"] for t in ordered[:5]]`, py`ordered = sorted(tracks, key=lambda t: (t["UnitPrice"], t["Name"]))
answer = [t["Name"] for t in ordered[:5]]`],
        }),
        chi({
          title: 'The biggest invoices',
          use: ['invoices'],
          hidden: 'from operator import itemgetter\n',
          given: '# invoices is a list of dictionaries. itemgetter is already imported.',
          brief: 'Find the **five invoices with the highest `Total`**. If two have the same total, the one with the **higher `InvoiceId`** comes first. Store in `answer` the list of their `InvoiceId` values.',
          reference: py`ordered = sorted(sorted(invoices, key=itemgetter("InvoiceId"), reverse=True), key=itemgetter("Total"), reverse=True)
answer = [inv["InvoiceId"] for inv in ordered[:5]]`,
          walkthrough: 'Sorting is stable, so you can sort twice: first by the tie-breaker, then by the main key. `itemgetter("Total")` is a tidy way to write the key.',
          traps: [py`ordered = sorted(invoices, key=itemgetter("Total"), reverse=True)
answer = [inv["InvoiceId"] for inv in ordered[:5]]`, py`ordered = sorted(invoices, key=itemgetter("Total"))
answer = [inv["InvoiceId"] for inv in ordered[:5]]`],
        }),
        chi({
          title: 'Chain small cleaning functions',
          use: ['tracks'],
          hidden: 'def compose(*funcs):\n    def combined(value):\n        for func in funcs:\n            value = func(value)\n        return value\n    return combined\n',
          given: '# compose is already defined: compose(f, g)(x) means g(f(x)).',
          brief: 'Build `clean = compose(...)` from three steps, in this order: **remove spaces at the ends**, **lower case**, and **remove every character that is not a letter, a digit or a space**. Apply it to every track name. Store in `answer` the number of **different** cleaned names.',
          reference: py`clean = compose(
    str.strip,
    str.lower,
    lambda s: "".join(ch for ch in s if ch.isalnum() or ch == " "),
)
answer = len({clean(t["Name"]) for t in tracks})`,
          walkthrough: 'Each step is a small function of one argument, so they chain with `compose`. Storing the results in a set counts the different cleaned names.',
          traps: [py`clean = compose(str.strip, lambda s: "".join(ch for ch in s if ch.isalnum() or ch == " "))
answer = len({clean(t["Name"]) for t in tracks})`, py`clean = compose(str.strip, str.lower)
answer = len({clean(t["Name"]) for t in tracks})`],
        }),
      ],
    },
    {
      id: 'py-comprehensions',
      title: 'Comprehensions: list, dict, set and generator',
      blurb: 'Filtering, conditional values, nesting and generator expressions.',
      kind: 'code',
      practice: {
        prompt: 'Write `long_word_lengths(words)`. It returns a **dictionary** that maps each word **longer than 3 characters** to its length. Words with 3 characters or fewer are left out.',
        starter: 'def long_word_lengths(words):\n    ...\n',
        solution: py`def long_word_lengths(words):
    return {word: len(word) for word in words if len(word) > 3}`,
        samples: ['long_word_lengths(["apple", "fig", "banana"])'],
        cases: [
          ['A mix', 'long_word_lengths(["apple", "fig", "banana"])'],
          ['Exactly three is left out', 'long_word_lengths(["one", "four"])'],
          ['Exactly four is kept', 'long_word_lengths(["abcd"])'],
          ['An empty list', 'long_word_lengths([])'],
          ['Only short words', 'long_word_lengths(["a", "to", "the"])'],
          ['A repeated word', 'long_word_lengths(["kiwi", "kiwi", "plum"])'],
        ],
        traps: [
          py`def long_word_lengths(words):
    return {word: len(word) for word in words if len(word) >= 3}`,
          py`def long_word_lengths(words):
    return [len(word) for word in words if len(word) > 3]`,
          py`def long_word_lengths(words):
    return {word: len(word) for word in words}`,
          py`def long_word_lengths(words):
    return {word: len(word) for word in words if len(word) > 4}`,
        ],
      },
      real: [
        chi({
          title: 'Very long tracks',
          use: ['tracks'],
          given: '# tracks is a list of dictionaries with "TrackId" and "Milliseconds".',
          brief: 'Use **one dictionary comprehension**. For every track **longer than 10 minutes** (strictly), map its `TrackId` to its length in **whole seconds** (`Milliseconds // 1000`). Store the dictionary in `answer`.',
          reference: py`answer = {t["TrackId"]: t["Milliseconds"] // 1000 for t in tracks if t["Milliseconds"] > 10 * 60 * 1000}`,
          walkthrough: 'The condition at the end filters the tracks, and the part in front builds each key and value. Ten minutes is `10 * 60 * 1000` milliseconds.',
          traps: [py`answer = {t["TrackId"]: t["Milliseconds"] // 1000 for t in tracks if t["Milliseconds"] > 5 * 60 * 1000}`, py`answer = {t["TrackId"]: t["Milliseconds"] / 1000 for t in tracks if t["Milliseconds"] > 10 * 60 * 1000}`],
        }),
        chi({
          title: 'E-mails by country',
          use: ['customers'],
          given: '# customers is a list of dictionaries with "Country" and "Email".',
          brief: 'Build a dictionary that maps each country to the **sorted list of the e-mail addresses** of its customers, but only for the countries with **three or more** customers. Store it in `answer`.',
          reference: py`groups = {}
for c in customers:
    groups.setdefault(c["Country"], []).append(c["Email"])
answer = {country: sorted(emails) for country, emails in groups.items() if len(emails) >= 3}`,
          walkthrough: 'First group the addresses by country, then use a dictionary comprehension to sort each list and to keep only the big groups.',
          traps: [py`groups = {}
for c in customers:
    groups.setdefault(c["Country"], []).append(c["Email"])
answer = {country: sorted(emails) for country, emails in groups.items() if len(emails) >= 2}`, py`groups = {}
for c in customers:
    groups.setdefault(c["Country"], []).append(c["Email"])
answer = {country: emails for country, emails in groups.items() if len(emails) >= 3}`],
        }),
        chi({
          title: 'How many different lengths?',
          use: ['tracks'],
          given: '# tracks is a list of dictionaries with "Milliseconds".',
          brief: 'Use a **set comprehension** to find the different track lengths **in whole seconds** (`Milliseconds // 1000`). Store in `answer` a tuple with the **number of different lengths** and the **shortest and longest** of them.',
          reference: py`lengths = {t["Milliseconds"] // 1000 for t in tracks}
answer = (len(lengths), min(lengths), max(lengths))`,
          walkthrough: 'A set drops the repeats, so its length is the number of different values. `min` and `max` work on any collection of numbers.',
          traps: [py`lengths = {t["Milliseconds"] for t in tracks}
answer = (len(lengths), min(lengths), max(lengths))`, py`lengths = [t["Milliseconds"] // 1000 for t in tracks]
answer = (len(lengths), min(lengths), max(lengths))`],
        }),
      ],
    },
    {
      id: 'py-iterators',
      title: 'Iterators and the iteration protocol',
      blurb: 'Iterable versus iterator, next, StopIteration and one-shot iterators.',
      kind: 'learn',
      check: [
        {
          q: 'What is the difference between an iterable and an iterator?',
          options: [
            'There is none',
            'An iterable can produce an iterator with `iter`. An iterator hands out its items one at a time with `next`',
            'An iterator is always a list',
            'An iterable can be used only once',
          ],
          answer: 1,
          why: 'A list is iterable: `iter(list)` gives a fresh iterator each time. The iterator keeps track of the position.',
        },
        {
          q: 'What does this print?\n\n```python\nit = iter([1, 2, 3])\nprint(list(it))\nprint(list(it))\n```',
          options: ['`[1, 2, 3]` twice', '`[1, 2, 3]` then `[]`', '`[]` twice', 'An error'],
          answer: 1,
          why: 'An iterator is one-shot. The first `list` uses up all its items.',
        },
        {
          q: 'Which exception does `next()` raise when the items have run out?',
          options: ['`IndexError`', '`KeyError`', '`StopIteration`', '`EOFError`'],
          answer: 2,
          why: '`StopIteration` is the signal that an iterator is finished. A `for` loop catches it for you.',
        },
        {
          q: 'What does `next(iter([]), "none")` return?',
          options: ['`None`', '`"none"`', 'It raises `StopIteration`', '`[]`'],
          answer: 1,
          why: 'The second argument of `next` is a default that is returned instead of raising `StopIteration`.',
        },
        {
          q: 'Which of these is an **iterator**, not just an iterable?',
          options: ['`[1, 2, 3]`', '`"abc"`', '`range(3)`', '`iter("abc")`'],
          answer: 3,
          why: 'Lists, strings and ranges are iterable, but only `iter(...)` returns an iterator that can be passed to `next`.',
        },
      ],
    },
    {
      id: 'py-generators',
      title: 'Generators: yield, yield from and pipelines',
      blurb: 'Lazy sequences, pipelines, batching and infinite generators.',
      kind: 'code',
      practice: {
        prompt: 'Write `running_total(nums)` as a **generator function**. It **yields** the running total after each number: the first number, then the sum of the first two, and so on.\n\nDo not build a list. Use `yield`.',
        starter: 'def running_total(nums):\n    ...\n',
        solution: py`def running_total(nums):
    total = 0
    for n in nums:
        total += n
        yield total`,
        samples: ['list(running_total([3, 1, 4, 1, 5]))'],
        cases: [
          ['A list of numbers', 'list(running_total([3, 1, 4, 1, 5]))'],
          ['An empty list', 'list(running_total([]))'],
          ['One number', 'list(running_total([7]))'],
          ['Negative numbers', 'list(running_total([5, -8, 2]))'],
          ['Decimals', 'list(running_total([0.5, 0.25]))'],
          ['It is a generator', 'type(running_total([1, 2])).__name__'],
          ['It works with any iterable', 'list(running_total(range(1, 5)))'],
          ['It is lazy', 'next(running_total(iter([4, 1])))'],
        ],
        traps: [
          py`def running_total(nums):
    total = 0
    result = []
    for n in nums:
        total += n
        result.append(total)
    return result`,
          py`def running_total(nums):
    total = 0
    yield total
    for n in nums:
        total += n
        yield total`,
          py`def running_total(nums):
    for n in nums:
        yield n`,
          py`def running_total(nums):
    total = 0
    for n in nums:
        total += n
    yield total`,
        ],
      },
      real: [
        chi({
          title: 'Stream the large invoices',
          use: ['invoices'],
          hidden: 'from itertools import islice\n',
          starter: 'def large_invoices(invoices, limit):\n    ...\n\nanswer = [inv["InvoiceId"] for inv in islice(large_invoices(invoices, 13.86), 8)]\n',
          given: '# islice is already imported. The last line takes only the first eight results.',
          brief: 'Write the **generator** `large_invoices(invoices, limit)`. It yields every invoice whose `Total` is **greater than** `limit`, in the original order. The last line takes the first eight with `islice`.',
          reference: py`def large_invoices(invoices, limit):
    for inv in invoices:
        if inv["Total"] > limit:
            yield inv

answer = [inv["InvoiceId"] for inv in islice(large_invoices(invoices, 13.86), 8)]`,
          walkthrough: 'A generator that filters is a `for` loop with an `if` and a `yield`. Because it is lazy, `islice` stops it after eight results and the rest of the invoices are never looked at.',
          traps: [py`def large_invoices(invoices, limit):
    for inv in invoices:
        if inv["Total"] >= limit:
            yield inv

answer = [inv["InvoiceId"] for inv in islice(large_invoices(invoices, 13.86), 8)]`, py`def large_invoices(invoices, limit):
    for inv in invoices:
        if inv["Total"] < limit:
            yield inv

answer = [inv["InvoiceId"] for inv in islice(large_invoices(invoices, 13.86), 8)]`],
        }),
        chi({
          title: 'Batches of tracks',
          use: ['tracks'],
          starter: 'def batches(items, size):\n    ...\n\nanswer = ([len(b) for b in batches(tracks, 1000)], [len(b) for b in batches(tracks[:3000], 1000)])\n',
          given: '# The last line lists the sizes of the batches for all the tracks, and for the first 3000 tracks.',
          brief: 'Write the generator `batches(items, size)`. It yields **lists** of `size` items, in order. The **last** list may be shorter. Nothing is yielded for an empty input.',
          reference: py`def batches(items, size):
    batch = []
    for item in items:
        batch.append(item)
        if len(batch) == size:
            yield batch
            batch = []
    if batch:
        yield batch

answer = ([len(b) for b in batches(tracks, 1000)], [len(b) for b in batches(tracks[:3000], 1000)])`,
          walkthrough: 'Collect items until the batch is full, yield it and start a new one. After the loop, the last, smaller batch must still be yielded.',
          traps: [py`def batches(items, size):
    batch = []
    for item in items:
        batch.append(item)
        if len(batch) == size:
            yield batch
            batch = []

answer = ([len(b) for b in batches(tracks, 1000)], [len(b) for b in batches(tracks[:3000], 1000)])`, py`def batches(items, size):
    batch = []
    for item in items:
        batch.append(item)
        if len(batch) == size:
            yield batch
            batch = []
    yield batch

answer = ([len(b) for b in batches(tracks, 1000)], [len(b) for b in batches(tracks[:3000], 1000)])`],
        }),
        chi({
          title: 'Even Fibonacci numbers',
          starter: 'def fibonacci():\n    ...\n\nanswer = 0\n',
          given: '# The Fibonacci numbers start 1, 2, 3, 5, 8, 13, 21, ...',
          brief: 'Write an **infinite generator** `fibonacci()` that yields 1, 2, 3, 5, 8, ... (each number is the sum of the two before it). Then add up the **even** numbers that do **not exceed 4 000 000**, and store the total in `answer`.',
          reference: py`def fibonacci():
    a, b = 1, 2
    while True:
        yield a
        a, b = b, a + b

answer = 0
for n in fibonacci():
    if n > 4_000_000:
        break
    if n % 2 == 0:
        answer += n`,
          walkthrough: 'The generator never ends, so the consumer decides when to stop: the `break` leaves the loop as soon as a number is too large. Every Fibonacci number is used once, and the memory use stays tiny.',
          traps: [py`def fibonacci():
    a, b = 1, 2
    while True:
        yield a
        a, b = b, a + b

answer = 0
for n in fibonacci():
    if n > 4_000_000:
        break
    answer += n`, py`def fibonacci():
    a, b = 1, 2
    while True:
        yield a
        a, b = b, a + b

answer = 0
for n in fibonacci():
    if n >= 4_000_000:
        break
    if n % 2 == 1:
        answer += n`],
        }),
      ],
    },
    {
      id: 'py-decorators',
      title: 'Decorators: wrapping behaviour',
      blurb: 'Wrappers, @, functools.wraps and decorators with arguments.',
      kind: 'code',
      practice: {
        prompt: 'Write the decorator `counted(fn)`. It returns a wrapper function that:\n\n- calls `fn` with **any arguments** and returns its **result**,\n- keeps the number of calls in an attribute `calls` of the wrapper (`0` before the first call),\n- keeps the **name** of the original function (use `functools.wraps`).\n\nEach decorated function has its own count.',
        starter: 'from functools import wraps\n\ndef counted(fn):\n    ...\n',
        solution: py`from functools import wraps

def counted(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return fn(*args, **kwargs)

    wrapper.calls = 0
    return wrapper`,
        samples: ['(lambda f: (f(1), f(2), f.calls))(counted(lambda x: x * 2))'],
        cases: [
          ['Results and calls', '(lambda f: (f(1), f(2), f.calls))(counted(lambda x: x * 2))'],
          ['Zero calls at the start', 'counted(lambda: 1).calls'],
          ['Keyword arguments', '(lambda f: (f(a=1, b=2), f.calls))(counted(lambda a, b: a - b))'],
          ['Independent counts', '(lambda f, g: (f(), f(), g(), f.calls, g.calls))(counted(lambda: 1), counted(lambda: 2))'],
          ['The name is kept', 'counted(len).__name__'],
          ['Any number of arguments', '(lambda f: (f(1, 2, 3), f.calls))(counted(lambda *a: sum(a)))'],
        ],
        traps: [
          py`from functools import wraps

def counted(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        fn(*args, **kwargs)

    wrapper.calls = 0
    return wrapper`,
          py`from functools import wraps

def counted(fn):
    counted.calls = getattr(counted, "calls", 0)

    @wraps(fn)
    def wrapper(*args, **kwargs):
        counted.calls += 1
        wrapper.calls = counted.calls
        return fn(*args, **kwargs)

    wrapper.calls = 0
    return wrapper`,
          py`def counted(fn):
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return fn(*args, **kwargs)

    wrapper.calls = 0
    return wrapper`,
          py`from functools import wraps

def counted(fn):
    @wraps(fn)
    def wrapper(*args):
        wrapper.calls += 1
        return fn(*args)

    wrapper.calls = 0
    return wrapper`,
        ],
      },
      real: [
        chi({
          title: 'Remember repeated lookups',
          use: ['tracks'],
          hidden: 'names = {t["TrackId"]: t["Name"] for t in tracks}\ncalls = {"n": 0}\n\ndef lookup(track_id):\n    calls["n"] += 1\n    return names[track_id]\n',
          starter: 'def memoize(fn):\n    ...\n\nlookup = memoize(lookup)\nfor t in tracks[:200]:\n    lookup(t["TrackId"] % 20 + 1)\nanswer = calls["n"]\n',
          given: '# lookup(track_id) returns a track name, and counts in calls["n"] how often it really runs.',
          brief: 'Write the decorator `memoize(fn)`: the first time it sees a **positional argument** it calls `fn` and stores the result. Later calls with the same argument use the stored result. The last lines call the lookup 200 times. Store the number of **real** calls in `answer`.',
          reference: py`def memoize(fn):
    cache = {}

    def wrapper(*args):
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]

    return wrapper

lookup = memoize(lookup)
for t in tracks[:200]:
    lookup(t["TrackId"] % 20 + 1)
answer = calls["n"]`,
          walkthrough: 'The cache is a dictionary inside the decorator. It is shared by every call of the wrapper, and the arguments tuple is the key. There are only 20 different ids, so the lookup really runs 20 times.',
          traps: [py`def memoize(fn):
    def wrapper(*args):
        return fn(*args)

    return wrapper

lookup = memoize(lookup)
for t in tracks[:200]:
    lookup(t["TrackId"] % 20 + 1)
answer = calls["n"]`, py`def memoize(fn):
    def wrapper(*args):
        cache = {}
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]

    return wrapper

lookup = memoize(lookup)
for t in tracks[:200]:
    lookup(t["TrackId"] % 20 + 1)
answer = calls["n"]`],
        }),
        chi({
          title: 'Log every call',
          hidden: 'log = []\n',
          starter: 'from functools import wraps\n\ndef logged(fn):\n    ...\n\n@logged\ndef add(a, b):\n    return a + b\n\n@logged\ndef greet(name):\n    return "hi " + name\n\nadd(1, 2)\ngreet("Ada")\nadd(5, 7)\nanswer = log\n',
          given: '# log is an empty list. The decorated functions are called at the bottom.',
          brief: 'Write the decorator `logged(fn)`. Every time the decorated function is called, append a text to `log` such as `add(1, 2)` or `greet(\'Ada\')`: the function name, then the arguments written with `repr` and joined with `", "`. The call must still **return the result**.',
          reference: py`from functools import wraps

def logged(fn):
    @wraps(fn)
    def wrapper(*args):
        log.append(f"{fn.__name__}({', '.join(repr(a) for a in args)})")
        return fn(*args)

    return wrapper

@logged
def add(a, b):
    return a + b

@logged
def greet(name):
    return "hi " + name

add(1, 2)
greet("Ada")
add(5, 7)
answer = log`,
          walkthrough: '`repr` shows text with its quotes, which is what you want in a log. `wraps` keeps `fn.__name__` correct, and the wrapper returns whatever the function returned.',
          traps: [py`from functools import wraps

def logged(fn):
    @wraps(fn)
    def wrapper(*args):
        log.append(f"{fn.__name__}({', '.join(str(a) for a in args)})")
        return fn(*args)

    return wrapper

@logged
def add(a, b):
    return a + b

@logged
def greet(name):
    return "hi " + name

add(1, 2)
greet("Ada")
add(5, 7)
answer = log`, py`from functools import wraps

def logged(fn):
    @wraps(fn)
    def wrapper(*args):
        log.append(f"wrapper({', '.join(repr(a) for a in args)})")
        return fn(*args)

    return wrapper

@logged
def add(a, b):
    return a + b

@logged
def greet(name):
    return "hi " + name

add(1, 2)
greet("Ada")
add(5, 7)
answer = log`],
        }),
        chi({
          title: 'A decorator with an argument',
          hidden: 'out = []\n',
          starter: 'from functools import wraps\n\ndef repeat(times):\n    ...\n\n@repeat(3)\ndef note(text):\n    out.append(text)\n\nnote("a")\nnote("b")\nanswer = out\n',
          given: '# out is an empty list. note appends the text to it.',
          brief: 'Write `repeat(times)`, a decorator **with an argument**: the decorated function is called `times` times each time it is used. The last lines call `note` twice. `answer` should show that each call appended its text three times.',
          reference: py`from functools import wraps

def repeat(times):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = fn(*args, **kwargs)
            return result

        return wrapper

    return decorator

@repeat(3)
def note(text):
    out.append(text)

note("a")
note("b")
answer = out`,
          walkthrough: 'A decorator with arguments has three layers: `repeat(times)` returns `decorator`, which takes the function and returns `wrapper`. `@repeat(3)` calls the outer function first.',
          traps: [py`from functools import wraps

def repeat(times):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            return fn(*args, **kwargs)

        return wrapper

    return decorator

@repeat(3)
def note(text):
    out.append(text)

note("a")
note("b")
answer = out`, py`from functools import wraps

def repeat(times):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            for _ in range(times + 1):
                fn(*args, **kwargs)

        return wrapper

    return decorator

@repeat(3)
def note(text):
    out.append(text)

note("a")
note("b")
answer = out`],
        }),
      ],
    },
    {
      id: 'py-functools-itertools',
      title: 'functools and itertools tour',
      blurb: 'partial, cache, groupby, combinations, accumulate and more.',
      kind: 'code',
      practice: {
        prompt: 'Write `all_pairs(items)`. It returns a **list of tuples**: every **unordered pair** of items from the list, in the order that `itertools.combinations` gives them. An item is never paired with itself, and `(a, b)` and `(b, a)` count once.',
        starter: 'from itertools import combinations\n\ndef all_pairs(items):\n    ...\n',
        solution: py`from itertools import combinations

def all_pairs(items):
    return list(combinations(items, 2))`,
        samples: ['all_pairs([1, 2, 3])'],
        cases: [
          ['Three items', 'all_pairs([1, 2, 3])'],
          ['An empty list', 'all_pairs([])'],
          ['One item', 'all_pairs([9])'],
          ['Four items', 'all_pairs(["a", "b", "c", "d"])'],
          ['Two items', 'all_pairs(["x", "y"])'],
          ['Repeated values are still separate items', 'all_pairs([1, 1, 2])'],
        ],
        traps: [
          py`from itertools import permutations

def all_pairs(items):
    return list(permutations(items, 2))`,
          py`from itertools import product

def all_pairs(items):
    return list(product(items, repeat=2))`,
          py`from itertools import combinations

def all_pairs(items):
    return [list(pair) for pair in combinations(items, 2)]`,
          py`from itertools import combinations_with_replacement

def all_pairs(items):
    return list(combinations_with_replacement(items, 2))`,
        ],
      },
      real: [
        chi({
          title: 'Group invoices by country',
          use: ['invoices'],
          hidden: 'from itertools import groupby\n',
          given: '# invoices is a list of dictionaries with "BillingCountry". groupby is already imported.',
          brief: 'Use `groupby` to count the invoices per `BillingCountry`. Remember that `groupby` needs the data **sorted by the same key**. Store in `answer` the **first five** `(country, count)` pairs in alphabetical order of the country.',
          reference: py`key = lambda inv: inv["BillingCountry"]
pairs = [(country, len(list(group))) for country, group in groupby(sorted(invoices, key=key), key=key)]
answer = pairs[:5]`,
          walkthrough: '`groupby` starts a new group whenever the key changes, so the data must be sorted first. Each group is a lazy iterator, so `list(group)` turns it into something you can measure.',
          traps: [py`key = lambda inv: inv["BillingCountry"]
pairs = [(country, len(list(group))) for country, group in groupby(invoices, key=key)]
answer = sorted(pairs)[:5]`, py`key = lambda inv: inv["BillingCountry"]
pairs = [(country, len(list(group)) + 1) for country, group in groupby(sorted(invoices, key=key), key=key)]
answer = pairs[:5]`],
        }),
        chi({
          title: 'Pairs of genres',
          use: ['genres'],
          hidden: 'from itertools import combinations\n',
          given: '# genres is a list of dictionaries with "Name". combinations is already imported.',
          brief: 'Take the names of the **first eight genres**. Consider all unordered pairs of different genres. Store in `answer` the number of pairs in which the two names have **at least 18 characters** together (add the two lengths).',
          reference: py`names = [g["Name"] for g in genres[:8]]
answer = sum(1 for a, b in combinations(names, 2) if len(a) + len(b) >= 18)`,
          walkthrough: '`combinations(names, 2)` gives each unordered pair once, so eight names give 28 pairs. The condition then counts those where the lengths add up to 20 or more.',
          traps: [py`from itertools import permutations
names = [g["Name"] for g in genres[:8]]
answer = sum(1 for a, b in permutations(names, 2) if len(a) + len(b) >= 18)`, py`names = [g["Name"] for g in genres[:8]]
answer = sum(1 for a, b in combinations(names, 2) if len(a) + len(b) > 18)`],
        }),
        chi({
          title: 'Running revenue',
          use: ['invoices'],
          hidden: 'from itertools import accumulate\n',
          given: '# invoices is a list of dictionaries with "Total". accumulate is already imported.',
          brief: 'Use `accumulate` to compute the **running total** of the `Total` of the **first ten invoices**. Store in `answer` the list of the ten running totals, each **rounded to 2 decimals**.',
          reference: py`answer = [round(x, 2) for x in accumulate(inv["Total"] for inv in invoices[:10])]`,
          walkthrough: '`accumulate` gives the running sum by default, and it accepts a generator expression. Rounding removes the tiny float errors.',
          traps: [py`answer = [round(sum(inv["Total"] for inv in invoices[:10]), 2)]`, py`answer = [round(x, 2) for x in accumulate((inv["Total"] for inv in invoices[:10]), max)]`],
        }),
      ],
    },
    {
      id: 'py-recursion-memo',
      title: 'Recursion in depth: memoisation and its limits',
      blurb: 'Recursive thinking, the memo, the recursion limit and loops.',
      kind: 'code',
      practice: {
        prompt: 'Write `ways_to_change(amount, coins)`. It returns **how many different combinations of coins** add up to `amount`. Each coin value can be used as many times as you like, and the **order does not matter** (`1 + 2` and `2 + 1` are the same way).\n\nThe amount `0` can be made in exactly **one** way (with no coins).',
        starter: 'def ways_to_change(amount, coins):\n    ...\n',
        solution: py`from functools import cache

def ways_to_change(amount, coins):
    coins = tuple(coins)

    @cache
    def go(remaining, index):
        if remaining == 0:
            return 1
        if remaining < 0 or index == len(coins):
            return 0
        return go(remaining - coins[index], index) + go(remaining, index + 1)

    return go(amount, 0)`,
        samples: ['ways_to_change(5, [1, 2, 5])'],
        cases: [
          ['A small amount', 'ways_to_change(5, [1, 2, 5])'],
          ['Zero can be made one way', 'ways_to_change(0, [1, 2])'],
          ['Impossible', 'ways_to_change(3, [2])'],
          ['A larger amount', 'ways_to_change(100, [1, 5, 10, 25, 50])'],
          ['No coins', 'ways_to_change(10, [])'],
          ['One coin fits exactly', 'ways_to_change(7, [7])'],
          ['The order of the coins is irrelevant', 'ways_to_change(5, [5, 2, 1])'],
          ['A big total', 'ways_to_change(300, [1, 5, 10, 25])'],
        ],
        traps: [
          py`from functools import cache

def ways_to_change(amount, coins):
    coins = tuple(coins)

    @cache
    def go(remaining):
        if remaining == 0:
            return 1
        if remaining < 0:
            return 0
        return sum(go(remaining - c) for c in coins)

    return go(amount)`,
          py`from functools import cache

def ways_to_change(amount, coins):
    coins = tuple(coins)

    @cache
    def go(remaining, index):
        if remaining == 0:
            return 1
        if remaining < 0 or index == len(coins):
            return 0
        return go(remaining - coins[index], index + 1) + go(remaining, index + 1)

    return go(amount, 0)`,
          py`from functools import cache

def ways_to_change(amount, coins):
    coins = tuple(coins)

    @cache
    def go(remaining, index):
        if remaining <= 0:
            return 1
        if index == len(coins):
            return 0
        return go(remaining - coins[index], index) + go(remaining, index + 1)

    return go(amount, 0)`,
          py`def ways_to_change(amount, coins):
    return 1 if amount == 0 else 0`,
        ],
      },
      real: [
        chi({
          title: 'A big Fibonacci number',
          starter: 'from functools import cache\n\ndef fib(n):\n    ...\n\nanswer = fib(90)\n',
          given: '# fib(0) is 0, fib(1) is 1, and every later number is the sum of the two before it.',
          brief: 'Write a **recursive** `fib(n)` and speed it up with `@cache`. Without the cache, `fib(90)` would take longer than a human life. Store `fib(90)` in `answer`.',
          reference: py`from functools import cache

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

answer = fib(90)`,
          walkthrough: 'With the cache, each value from 0 to 90 is computed once, and every other call is a look-up. Python integers do not overflow, so the answer is exact.',
          traps: [py`from functools import cache

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

answer = fib(89)`, py`from functools import cache

@cache
def fib(n):
    if n < 2:
        return 1
    return fib(n - 1) + fib(n - 2)

answer = fib(90)`],
        }),
        chi({
          title: 'Paths through a grid',
          starter: 'from functools import cache\n\ndef paths(rows, cols):\n    ...\n\nanswer = paths(12, 12)\n',
          given: '# You start at the top left of a grid and may only move right or down.',
          brief: 'Write `paths(rows, cols)`: the number of different routes from the top-left cell to the bottom-right cell of a grid with that many rows and columns, moving only **right** or **down**. A grid with one row or one column has exactly one route. Use recursion with `@cache`.',
          reference: py`from functools import cache

@cache
def paths(rows, cols):
    if rows == 1 or cols == 1:
        return 1
    return paths(rows - 1, cols) + paths(rows, cols - 1)

answer = paths(12, 12)`,
          walkthrough: 'The last move into the corner came from above or from the left, so the count is the sum of the counts for those two smaller grids. The base case is a single row or column.',
          traps: [py`from functools import cache

@cache
def paths(rows, cols):
    if rows == 1 or cols == 1:
        return 1
    return paths(rows - 1, cols) + paths(rows, cols - 1) + 1

answer = paths(12, 12)`, py`from functools import cache

@cache
def paths(rows, cols):
    if rows == 0 or cols == 0:
        return 1
    return paths(rows - 1, cols) + paths(rows, cols - 1)

answer = paths(12, 12)`],
        }),
        chi({
          title: 'Team sizes',
          use: ['employees'],
          starter: 'def team_size(employee_id):\n    ...\n\nanswer = {e["EmployeeId"]: team_size(e["EmployeeId"]) for e in employees}\n',
          given: '# employees is a list of dictionaries. "ReportsTo" is the EmployeeId of the manager, or None for the top.',
          brief: 'Write the recursive function `team_size(employee_id)`: the number of people who report to that employee **directly or indirectly** (the employee is not counted). The last line does it for every employee.',
          reference: py`def team_size(employee_id):
    total = 0
    for e in employees:
        if e["ReportsTo"] == employee_id:
            total += 1 + team_size(e["EmployeeId"])
    return total

answer = {e["EmployeeId"]: team_size(e["EmployeeId"]) for e in employees}`,
          walkthrough: 'Each direct report counts as one, plus everyone in that person\'s own team. An employee with no reports has a team of 0, which is the base case.',
          traps: [py`def team_size(employee_id):
    return sum(1 for e in employees if e["ReportsTo"] == employee_id)

answer = {e["EmployeeId"]: team_size(e["EmployeeId"]) for e in employees}`, py`def team_size(employee_id):
    total = 1
    for e in employees:
        if e["ReportsTo"] == employee_id:
            total += team_size(e["EmployeeId"])
    return total

answer = {e["EmployeeId"]: team_size(e["EmployeeId"]) for e in employees}`],
        }),
      ],
    },
  ],
  checkpoint: [],
}
