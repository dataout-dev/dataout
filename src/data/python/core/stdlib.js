import { py, chi } from './common.js'

export const stdlibWorkshops = {
  id: 'standard-library-workshops',
  title: 'Standard library workshops',
  intro: 'The modules you will reach for weekly.',
  lessons: [
    {
      id: 'py-collections',
      title: 'collections: Counter, defaultdict, deque, namedtuple, ChainMap',
      blurb: 'Counting, grouping, queues, records and layered settings.',
      kind: 'code',
      practice: {
        prompt: 'Write `top_n(items, n)`. It returns a **list of `(item, count)` pairs** for the `n` most common items, **most common first**.\n\nItems with the **same count** are in **alphabetical order**. If there are fewer than `n` different items, return all of them. Case matters: `"A"` and `"a"` are different items.',
        starter: 'from collections import Counter\n\ndef top_n(items, n):\n    ...\n',
        solution: py`from collections import Counter

def top_n(items, n):
    counts = Counter(items)
    return sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))[:n]`,
        samples: ['top_n(["b", "a", "c", "a", "b", "d"], 2)'],
        cases: [
          ['A tie is alphabetical', 'top_n(["b", "a", "c", "a", "b", "d"], 2)'],
          ['A clear winner', 'top_n(["x", "y", "x", "x", "y", "z"], 2)'],
          ['More than there are', 'top_n(["a", "b"], 5)'],
          ['Asking for none', 'top_n(["a", "b"], 0)'],
          ['An empty list', 'top_n([], 3)'],
          ['Everything ties', 'top_n(["d", "c", "b", "a"], 3)'],
          ['Case matters', 'top_n(["a", "A", "a"], 2)'],
          ['Words from text', 'top_n("the cat and the hat and the bat".split(), 3)'],
        ],
        traps: [
          py`from collections import Counter

def top_n(items, n):
    return Counter(items).most_common(n)`,
          py`from collections import Counter

def top_n(items, n):
    counts = Counter(items)
    return sorted(counts.items(), key=lambda pair: (pair[1], pair[0]))[:n]`,
          py`from collections import Counter

def top_n(items, n):
    return dict(Counter(items).most_common(n))`,
          py`from collections import Counter

def top_n(items, n):
    counts = Counter(items)
    return sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))`,
        ],
      },
      real: [
        chi({
          title: 'The busiest billing countries',
          use: ['invoices'],
          hidden: 'from collections import Counter\n',
          given: '# invoices is a list of dictionaries with "BillingCountry". Counter is already imported.',
          brief: 'Count the invoices per `BillingCountry` with a `Counter`. Store in `answer` the **three countries with the most invoices** as `(country, count)` pairs, most first. When two countries have the **same count**, the one that comes first **alphabetically** goes first.',
          reference: py`counts = Counter(inv["BillingCountry"] for inv in invoices)
answer = sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))[:3]`,
          walkthrough: '`most_common` keeps ties in the order they were first seen, which is arbitrary here. Sorting the pairs with the count (negated) and then the name gives a result that never changes.',
          traps: [py`counts = Counter(inv["BillingCountry"] for inv in invoices)
answer = counts.most_common(3)`, py`counts = Counter(inv["BillingCountry"] for inv in invoices)
answer = sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))[:4]`],
        }),
        chi({
          title: 'Track counts by genre',
          use: ['tracks'],
          hidden: 'from collections import defaultdict\n',
          given: '# tracks is a list of dictionaries with "Name" and "GenreId". defaultdict is already imported.',
          brief: 'Use a `defaultdict(list)` to collect the **track names** for each `GenreId`. Store in `answer` a **normal dictionary** that maps the genre ids `1`, `2` and `3` to the **number of tracks** of that genre.',
          reference: py`groups = defaultdict(list)
for t in tracks:
    groups[t["GenreId"]].append(t["Name"])
answer = {gid: len(groups[gid]) for gid in (1, 2, 3)}`,
          walkthrough: 'The `defaultdict` starts an empty list the first time it sees a genre, so the loop needs no `if`. Then a dictionary comprehension reads the three sizes.',
          traps: [py`groups = {}
for t in tracks:
    groups[t["GenreId"]] = [t["Name"]]
answer = {gid: len(groups[gid]) for gid in (1, 2, 3)}`, py`groups = defaultdict(list)
for t in tracks:
    groups[t["GenreId"]].append(t["Name"])
answer = {gid: len(groups[gid]) for gid in (1, 2, 4)}`],
        }),
        chi({
          title: 'A sliding window of revenue',
          use: ['invoices'],
          hidden: 'from collections import deque\n',
          given: '# invoices is a list of dictionaries with "Total". deque is already imported.',
          brief: 'Use `deque(maxlen=5)` as a sliding window. For each of the **first ten invoices**, add its `Total` to the window and compute the **average of the totals in the window** (at most the last five), **rounded to 2 decimals**. Store the list of ten averages in `answer`.',
          reference: py`window = deque(maxlen=5)
answer = []
for inv in invoices[:10]:
    window.append(inv["Total"])
    answer.append(round(sum(window) / len(window), 2))`,
          walkthrough: 'A `deque` with `maxlen` drops the oldest item automatically when a new one is added, so the window never holds more than five totals.',
          traps: [py`window = deque(maxlen=3)
answer = []
for inv in invoices[:10]:
    window.append(inv["Total"])
    answer.append(round(sum(window) / len(window), 2))`, py`window = []
answer = []
for inv in invoices[:10]:
    window.append(inv["Total"])
    answer.append(round(sum(window) / len(window), 2))`],
        }),
      ],
    },
    {
      id: 'py-itertools-depth',
      title: 'itertools in depth: combinatorics and grouping recipes',
      blurb: 'product, permutations, combinations, groupby, tee and the recipes.',
      kind: 'code',
      practice: {
        prompt: 'Write `power_set(items)`. It returns the **list of all subsets** of the list, each as a **tuple** that keeps the order of the items. They come **by size**: first the empty tuple, then all the subsets of one item, then of two, and so on. Subsets of the same size are in the order of `itertools.combinations`.',
        starter: 'from itertools import combinations\n\ndef power_set(items):\n    ...\n',
        solution: py`from itertools import chain, combinations

def power_set(items):
    items = list(items)
    return list(chain.from_iterable(combinations(items, size) for size in range(len(items) + 1)))`,
        samples: ['power_set([1, 2, 3])'],
        cases: [
          ['Three items', 'power_set([1, 2, 3])'],
          ['No items', 'power_set([])'],
          ['One item', 'power_set(["a"])'],
          ['Two items', 'power_set(["x", "y"])'],
          ['The number of subsets of five items', 'len(power_set(range(5)))'],
          ['Four items', 'power_set("abcd")'],
        ],
        traps: [
          py`from itertools import chain, permutations

def power_set(items):
    items = list(items)
    return list(chain.from_iterable(permutations(items, size) for size in range(len(items) + 1)))`,
          py`from itertools import chain, combinations

def power_set(items):
    items = list(items)
    return list(chain.from_iterable(combinations(items, size) for size in range(1, len(items) + 1)))`,
          py`from itertools import chain, combinations

def power_set(items):
    items = list(items)
    return list(chain.from_iterable(combinations(items, size) for size in range(len(items))))`,
          py`from itertools import chain, combinations

def power_set(items):
    items = list(items)
    return [list(c) for c in chain.from_iterable(combinations(items, size) for size in range(len(items) + 1))]`,
        ],
      },
      real: [
        chi({
          title: 'Combinations of three genres',
          use: ['genres'],
          hidden: 'from itertools import combinations\nnames = [g["Name"] for g in genres[:10]]\n',
          given: '# names holds the names of the first ten genres. combinations is already imported.',
          brief: 'Consider every way to **choose three different genres** (the order does not matter). Store in `answer` how many of these selections have a **total name length below 28** characters.',
          reference: py`answer = sum(1 for combo in combinations(names, 3) if sum(len(n) for n in combo) < 28)`,
          walkthrough: '`combinations(names, 3)` produces each selection once, and the generator expression adds up the lengths and counts those that are short enough.',
          traps: [py`from itertools import permutations
answer = sum(1 for combo in permutations(names, 3) if sum(len(n) for n in combo) < 28)`, py`answer = sum(1 for combo in combinations(names, 3) if sum(len(n) for n in combo) <= 28)`],
        }),
        chi({
          title: 'Which pairs never happen?',
          use: ['tracks', 'genres'],
          hidden: 'from itertools import product\nmedia_types = rows("chinook", "MediaType")\n',
          given: '# tracks, genres and media_types are lists of dictionaries with "GenreId" and "MediaTypeId". product is already imported.',
          brief: 'Every track has a `GenreId` and a `MediaTypeId`. With `product`, list **all possible pairs** `(GenreId, MediaTypeId)`. Store in `answer` a tuple: the number of **possible** pairs, the number of pairs that **occur** in the tracks, and the number that **never occur**.',
          reference: py`possible = list(product([g["GenreId"] for g in genres], [m["MediaTypeId"] for m in media_types]))
present = {(t["GenreId"], t["MediaTypeId"]) for t in tracks}
answer = (len(possible), len(present), len(possible) - len(present))`,
          walkthrough: '`product` pairs every genre with every media type. A set of the pairs found in the tracks counts the distinct ones that occur, and the rest never happen.',
          traps: [py`from itertools import combinations
possible = list(combinations([g["GenreId"] for g in genres], 2))
present = {(t["GenreId"], t["MediaTypeId"]) for t in tracks}
answer = (len(possible), len(present), len(possible) - len(present))`, py`possible = list(product([g["GenreId"] for g in genres], [m["MediaTypeId"] for m in media_types]))
present = [(t["GenreId"], t["MediaTypeId"]) for t in tracks]
answer = (len(possible), len(present), len(possible) - len(present))`],
        }),
        chi({
          title: 'The longest run of the same price',
          use: ['tracks'],
          hidden: 'from itertools import groupby\n',
          given: '# tracks is a list of dictionaries with "UnitPrice". groupby is already imported.',
          brief: 'Go through the tracks **in their original order** and find the **longest run of consecutive tracks with the same `UnitPrice`**. Use `groupby` **without sorting**. Store in `answer` a tuple: the price and the length of that run.',
          reference: py`runs = [(price, len(list(group))) for price, group in groupby(t["UnitPrice"] for t in tracks)]
answer = max(runs, key=lambda run: run[1])`,
          walkthrough: '`groupby` groups **neighbours**, which is exactly what a run is. Sorting first would merge all the tracks of one price into a single group, which answers a different question.',
          traps: [py`prices = sorted(t["UnitPrice"] for t in tracks)
runs = [(price, len(list(group))) for price, group in groupby(prices)]
answer = max(runs, key=lambda run: run[1])`, py`runs = [(price, len(list(group))) for price, group in groupby(t["UnitPrice"] for t in tracks)]
answer = min(runs, key=lambda run: run[1])`],
        }),
      ],
    },
    {
      id: 'py-datetime',
      title: 'Dates and times: datetime, zoneinfo, time and calendar',
      blurb: 'date, datetime, timedelta, parsing, time zones and pitfalls.',
      kind: 'code',
      practice: {
        prompt: 'Write `days_between(first, second)`. Both arguments are dates as text in the ISO form `YYYY-MM-DD`. Return the **number of days between them** as a **non-negative integer**, whichever date comes first.',
        starter: 'from datetime import date\n\ndef days_between(first, second):\n    ...\n',
        solution: py`from datetime import date

def days_between(first, second):
    return abs((date.fromisoformat(second) - date.fromisoformat(first)).days)`,
        samples: ['days_between("2024-01-01", "2024-03-01")'],
        cases: [
          ['Across a leap February', 'days_between("2024-01-01", "2024-03-01")'],
          ['The other way round', 'days_between("2024-03-01", "2024-01-01")'],
          ['The same day', 'days_between("2024-05-05", "2024-05-05")'],
          ['A whole year', 'days_between("2023-03-01", "2024-03-01")'],
          ['A leap year', 'days_between("2024-01-01", "2025-01-01")'],
          ['The leap day itself', 'days_between("2024-02-28", "2024-03-01")'],
          ['Across the new year', 'days_between("2023-12-31", "2024-01-01")'],
        ],
        traps: [
          py`from datetime import date

def days_between(first, second):
    return (date.fromisoformat(second) - date.fromisoformat(first)).days`,
          py`from datetime import date

def days_between(first, second):
    a, b = date.fromisoformat(first), date.fromisoformat(second)
    return abs((b.year - a.year) * 365 + (b.month - a.month) * 30 + (b.day - a.day))`,
          py`from datetime import date

def days_between(first, second):
    return abs((date.fromisoformat(second) - date.fromisoformat(first)).days) + 1`,
        ],
      },
      real: [
        chi({
          title: 'Invoices per year',
          use: ['invoices'],
          hidden: 'from datetime import datetime\n',
          given: '# invoices is a list of dictionaries. "InvoiceDate" looks like "2009-01-01 00:00:00". datetime is already imported.',
          brief: 'Read each `InvoiceDate` with `datetime.strptime` (format `"%Y-%m-%d %H:%M:%S"`). Store in `answer` a dictionary that maps each **year** (an integer) to the **number of invoices** in that year.',
          reference: py`answer = {}
for inv in invoices:
    year = datetime.strptime(inv["InvoiceDate"], "%Y-%m-%d %H:%M:%S").year
    answer[year] = answer.get(year, 0) + 1`,
          walkthrough: '`strptime` turns the text into a `datetime`, which knows its `year`. Counting with a dictionary finishes the job.',
          traps: [py`answer = {}
for inv in invoices:
    month = datetime.strptime(inv["InvoiceDate"], "%Y-%m-%d %H:%M:%S").month
    answer[month] = answer.get(month, 0) + 1`, py`answer = {}
for inv in invoices:
    year = inv["InvoiceDate"][:4]
    answer[year] = answer.get(year, 0) + 1`],
        }),
        chi({
          title: 'The span of the data',
          use: ['invoices'],
          hidden: 'from datetime import datetime\n',
          given: '# invoices is a list of dictionaries with "InvoiceDate" text such as "2009-01-01 00:00:00". datetime is already imported.',
          brief: 'Parse the `InvoiceDate` of every invoice. Store in `answer` the **number of days between the earliest and the latest invoice** (the `.days` of the difference).',
          reference: py`dates = [datetime.strptime(inv["InvoiceDate"], "%Y-%m-%d %H:%M:%S") for inv in invoices]
answer = (max(dates) - min(dates)).days`,
          walkthrough: 'Subtracting two datetimes gives a `timedelta`, and its `days` attribute is the whole number of days.',
          traps: [py`dates = [datetime.strptime(inv["InvoiceDate"], "%Y-%m-%d %H:%M:%S") for inv in invoices]
answer = (max(dates) - min(dates)).total_seconds()`, py`dates = [datetime.strptime(inv["InvoiceDate"], "%Y-%m-%d %H:%M:%S") for inv in invoices]
answer = (max(dates) - min(dates)).days // 365`],
        }),
        chi({
          title: 'The latest invoice of each customer',
          use: ['invoices'],
          hidden: 'from datetime import datetime\n',
          given: '# invoices is a list of dictionaries with "CustomerId" and "InvoiceDate". datetime is already imported.',
          brief: 'For the customers **1, 2 and 3**, find the **most recent** invoice date. Store in `answer` a dictionary from the customer id to that date in ISO form **without the time** (`YYYY-MM-DD`).',
          reference: py`answer = {}
for inv in invoices:
    cid = inv["CustomerId"]
    if cid in (1, 2, 3):
        when = datetime.strptime(inv["InvoiceDate"], "%Y-%m-%d %H:%M:%S").date()
        if cid not in answer or when > answer[cid]:
            answer[cid] = when
answer = {cid: when.isoformat() for cid, when in answer.items()}`,
          walkthrough: 'Keep the largest date seen for each customer, then turn the dates into ISO text. Comparing real `date` objects is safer than comparing pieces of text.',
          traps: [py`answer = {}
for inv in invoices:
    cid = inv["CustomerId"]
    if cid in (1, 2, 3):
        when = datetime.strptime(inv["InvoiceDate"], "%Y-%m-%d %H:%M:%S").date()
        if cid not in answer or when < answer[cid]:
            answer[cid] = when
answer = {cid: when.isoformat() for cid, when in answer.items()}`, py`answer = {}
for inv in invoices:
    cid = inv["CustomerId"]
    if cid in (1, 2, 3) and cid not in answer:
        answer[cid] = inv["InvoiceDate"][:10]`],
        }),
      ],
    },
    {
      id: 'py-math-stats-random',
      title: 'math, statistics, random and secrets',
      blurb: 'Maths functions, descriptive statistics, seeds and secure tokens.',
      kind: 'code',
      practice: {
        prompt: 'Write `describe(nums)`. It returns a tuple `(mean, median, standard deviation)` of the list of numbers, each **rounded to 2 decimals**.\n\nUse the **sample** standard deviation (divide by `n - 1`). A list with **one** number has a standard deviation of `0.0`. The list is never empty.',
        starter: 'import statistics\n\ndef describe(nums):\n    ...\n',
        solution: py`import statistics

def describe(nums):
    mean = statistics.mean(nums)
    median = statistics.median(nums)
    spread = statistics.stdev(nums) if len(nums) > 1 else 0.0
    return round(mean, 2), round(median, 2), round(spread, 2)`,
        samples: ['describe([2, 4, 4, 4, 5, 5, 7, 9])'],
        cases: [
          ['A classic data set', 'describe([2, 4, 4, 4, 5, 5, 7, 9])'],
          ['An even count', 'describe([1, 2, 3, 4])'],
          ['One number', 'describe([5])'],
          ['Two numbers', 'describe([10, 20])'],
          ['Decimals', 'describe([1.5, 2.5, 3.5, 10.25])'],
          ['Negative numbers', 'describe([-5, 0, 5, 20])'],
          ['An odd count', 'describe([9, 1, 5])'],
        ],
        traps: [
          py`import statistics

def describe(nums):
    mean = statistics.mean(nums)
    median = statistics.median(nums)
    spread = statistics.pstdev(nums)
    return round(mean, 2), round(median, 2), round(spread, 2)`,
          py`import statistics

def describe(nums):
    mean = statistics.mean(nums)
    ordered = sorted(nums)
    median = ordered[len(ordered) // 2]
    spread = statistics.stdev(nums) if len(nums) > 1 else 0.0
    return round(mean, 2), round(median, 2), round(spread, 2)`,
          py`import statistics

def describe(nums):
    mean = statistics.mean(nums)
    median = statistics.median(nums)
    spread = statistics.stdev(nums) if len(nums) > 1 else 0.0
    return mean, median, spread`,
          py`import statistics

def describe(nums):
    mean = statistics.mean(nums)
    median = statistics.median(nums)
    spread = statistics.variance(nums) if len(nums) > 1 else 0.0
    return round(mean, 2), round(median, 2), round(spread, 2)`,
          py`import statistics

def describe(nums):
    mean = statistics.mean(nums)
    median = statistics.median(nums)
    spread = statistics.stdev(nums)
    return round(mean, 2), round(median, 2), round(spread, 2)`,
        ],
      },
      real: [
        chi({
          title: 'Summarise the invoice totals',
          use: ['invoices'],
          hidden: 'import statistics\n',
          given: '# invoices is a list of dictionaries with "Total". statistics is already imported.',
          brief: 'Store in `answer` a tuple with the **mean**, the **median** and the **sample standard deviation** of all the invoice totals, each **rounded to 2 decimals**.',
          reference: py`totals = [inv["Total"] for inv in invoices]
answer = (round(statistics.mean(totals), 2), round(statistics.median(totals), 2), round(statistics.stdev(totals), 2))`,
          walkthrough: 'The data is a sample of a shop\'s sales, so the sample standard deviation `stdev` is the right choice, and not `pstdev`.',
          traps: [py`totals = [inv["Total"] for inv in invoices]
answer = (round(statistics.mean(totals), 2), round(statistics.median(totals), 2), round(statistics.pstdev(totals), 2))`, py`totals = [inv["Total"] for inv in invoices]
answer = (round(statistics.median(totals), 2), round(statistics.mean(totals), 2), round(statistics.stdev(totals), 2))`],
        }),
        chi({
          title: 'Track length quartiles',
          use: ['tracks'],
          hidden: 'import statistics\n',
          given: '# tracks is a list of dictionaries with "Milliseconds". statistics is already imported.',
          brief: 'Convert the track lengths to **whole seconds** (`Milliseconds // 1000`). Store in `answer` the **three quartile cut points** (`statistics.quantiles` with `n=4`, the default method), each **rounded to 1 decimal**, as a list.',
          reference: py`seconds = [t["Milliseconds"] // 1000 for t in tracks]
answer = [round(q, 1) for q in statistics.quantiles(seconds, n=4)]`,
          walkthrough: '`quantiles(data, n=4)` returns three cut points that divide the sorted data into four equal parts. The middle one is the median.',
          traps: [py`seconds = [t["Milliseconds"] // 1000 for t in tracks]
answer = [round(q, 1) for q in statistics.quantiles(seconds, n=4)][::-1]`, py`seconds = [t["Milliseconds"] // 1000 for t in tracks]
answer = [round(q, 1) for q in statistics.quantiles(seconds, n=5)]`],
        }),
        chi({
          title: 'A seeded bootstrap',
          use: ['invoices'],
          hidden: 'import random\nimport statistics\n',
          given: '# invoices is a list of dictionaries with "Total". random and statistics are already imported.',
          brief: 'Make a **separate generator** with `random.Random(2024)`. Draw a **bootstrap sample** with `choices`: as many totals as there are invoices, chosen **with replacement**. Store in `answer` the **mean** of that sample, **rounded to 2 decimals**.',
          reference: py`totals = [inv["Total"] for inv in invoices]
rng = random.Random(2024)
sample = rng.choices(totals, k=len(totals))
answer = round(statistics.mean(sample), 2)`,
          walkthrough: 'With the same seed, the same numbers are drawn, so the answer is repeatable. A separate `Random` object keeps this experiment from disturbing the global generator.',
          traps: [py`totals = [inv["Total"] for inv in invoices]
rng = random.Random(1)
sample = rng.choices(totals, k=len(totals))
answer = round(statistics.mean(sample), 2)`, py`totals = [inv["Total"] for inv in invoices]
answer = round(statistics.mean(totals), 2)`],
        }),
      ],
    },
    {
      id: 'py-decimal-fractions',
      title: 'decimal, fractions and numbers',
      blurb: 'Exact money arithmetic, quantize and Fraction.',
      kind: 'code',
      practice: {
        prompt: 'Write `split_money(total, n)`. The `total` is an amount as **text** with two decimals (`"100.00"`), and `n` is the number of parts. Return a **list of `n` texts** with two decimals that **add up exactly to the total**.\n\nThe parts are as equal as possible. When cents are left over, the **first** parts get **one extra cent** each. `split_money("100.00", 3)` is `["33.34", "33.33", "33.33"]`.',
        starter: 'from decimal import Decimal\n\ndef split_money(total, n):\n    ...\n',
        solution: py`from decimal import Decimal

def split_money(total, n):
    cents = int((Decimal(total) * 100).to_integral_value())
    base, extra = divmod(cents, n)
    shares = [base + 1 if i < extra else base for i in range(n)]
    return [str((Decimal(s) / 100).quantize(Decimal("0.01"))) for s in shares]`,
        samples: ['split_money("100.00", 3)'],
        cases: [
          ['A hundred in three', 'split_money("100.00", 3)'],
          ['Ten in three', 'split_money("10.00", 3)'],
          ['One cent in three', 'split_money("0.01", 3)'],
          ['One part', 'split_money("5.00", 1)'],
          ['An even split', 'split_money("1.00", 4)'],
          ['Two parts of an odd amount', 'split_money("9.99", 2)'],
          ['A big amount', 'split_money("1234567.89", 7)'],
          ['Nothing to split', 'split_money("0.00", 3)'],
        ],
        traps: [
          py`def split_money(total, n):
    each = float(total) / n
    return [f"{each:.2f}" for _ in range(n)]`,
          py`from decimal import Decimal, ROUND_HALF_UP

def split_money(total, n):
    each = (Decimal(total) / n).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return [str(each) for _ in range(n)]`,
          py`from decimal import Decimal

def split_money(total, n):
    cents = int((Decimal(total) * 100).to_integral_value())
    base, extra = divmod(cents, n)
    shares = [base + 1 if i >= n - extra else base for i in range(n)]
    return [str((Decimal(s) / 100).quantize(Decimal("0.01"))) for s in shares]`,
          py`from decimal import Decimal

def split_money(total, n):
    cents = int((Decimal(total) * 100).to_integral_value())
    base = cents // n
    return [str((Decimal(base) / 100).quantize(Decimal("0.01"))) for _ in range(n)]`,
        ],
      },
      real: [
        chi({
          title: 'The exact total of all invoices',
          use: ['invoices'],
          hidden: 'from decimal import Decimal\n',
          given: '# invoices is a list of dictionaries with "Total" as a float. Decimal is already imported.',
          brief: 'Add up all the invoice totals **exactly**, with `Decimal`. Create each `Decimal` from the **text** of the float (`str`), never from the float itself. Store the total, as a `Decimal`, in `answer`.',
          reference: py`answer = sum((Decimal(str(inv["Total"])) for inv in invoices), Decimal("0"))`,
          walkthrough: '`Decimal(str(x))` gives the number as it is written. `sum` needs a `Decimal` start value, because the default start is the integer 0, which would work too, but stating it keeps the type clear.',
          traps: [py`answer = sum(inv["Total"] for inv in invoices)`, py`answer = round(sum(Decimal(str(inv["Total"])) for inv in invoices))`],
        }),
        chi({
          title: 'An exact share',
          use: ['invoices'],
          hidden: 'from fractions import Fraction\n',
          given: '# invoices is a list of dictionaries with "BillingCountry". Fraction is already imported.',
          brief: 'What fraction of all invoices are billed to the **USA**? Store it in `answer` as an **exact `Fraction`** (in lowest terms), and not as a float.',
          reference: py`usa = sum(1 for inv in invoices if inv["BillingCountry"] == "USA")
answer = Fraction(usa, len(invoices))`,
          walkthrough: 'A `Fraction` of two integers is exact, and is reduced automatically to lowest terms. Converting to `float` would lose that exactness.',
          traps: [py`usa = sum(1 for inv in invoices if inv["BillingCountry"] == "USA")
answer = usa / len(invoices)`, py`usa = sum(1 for inv in invoices if inv["BillingCountry"] != "USA")
answer = Fraction(usa, len(invoices))`],
        }),
        chi({
          title: 'Prices with tax, rounded to cents',
          use: ['invoices'],
          hidden: 'from decimal import Decimal, ROUND_HALF_UP\n',
          given: '# invoices is a list of dictionaries with "Total" as a float. Decimal and ROUND_HALF_UP are already imported.',
          brief: 'For the **first five invoices**, add a **19% tax** to the `Total` (multiply by `Decimal("1.19")`). Create the `Decimal` from the text of the float, and round to **cents** with `quantize` and **`ROUND_HALF_UP`**. Store the list of five `Decimal` values in `answer`.',
          reference: py`answer = [
    (Decimal(str(inv["Total"])) * Decimal("1.19")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    for inv in invoices[:5]
]`,
          walkthrough: '`quantize(Decimal("0.01"))` rounds to two decimals, and the `rounding` argument chooses the rule, so the result never depends on hidden defaults.',
          traps: [py`from decimal import ROUND_DOWN
answer = [
    (Decimal(str(inv["Total"])) * Decimal("1.19")).quantize(Decimal("0.01"), rounding=ROUND_DOWN)
    for inv in invoices[:5]
]`, py`answer = [round(inv["Total"] * 1.19, 2) for inv in invoices[:5]]`],
        }),
      ],
    },
    {
      id: 'py-heapq-bisect-queue',
      title: 'heapq, bisect, array and queue',
      blurb: 'Heaps, priority queues, sorted lists and binary search.',
      kind: 'code',
      practice: {
        prompt: 'Write `top_k(stream, k)`. The `stream` can be **any iterable**, even a generator that can be read only once. Return a **list of the `k` largest values**, the **largest first**, without sorting the whole stream.\n\nIf there are fewer than `k` values, return all of them, sorted the same way. For `k` equal to `0`, return an empty list.',
        starter: 'import heapq\n\ndef top_k(stream, k):\n    ...\n',
        solution: py`import heapq

def top_k(stream, k):
    return heapq.nlargest(k, stream)`,
        samples: ['top_k([5, 1, 9, 3, 7], 3)'],
        cases: [
          ['A list', 'top_k([5, 1, 9, 3, 7], 3)'],
          ['More than there are', 'top_k([4, 2], 5)'],
          ['Asking for none', 'top_k([1, 2, 3], 0)'],
          ['Duplicates', 'top_k([3, 3, 1, 3, 2], 3)'],
          ['Negative numbers', 'top_k([-5, -1, -9], 2)'],
          ['An iterator', 'top_k(iter([5, 1, 9, 3]), 2)'],
          ['A generator', 'top_k((x * x for x in range(10)), 3)'],
          ['An empty stream', 'top_k([], 3)'],
        ],
        traps: [
          py`import heapq

def top_k(stream, k):
    return heapq.nsmallest(k, stream)`,
          py`def top_k(stream, k):
    return sorted(stream)[-k:]`,
          py`def top_k(stream, k):
    return sorted(stream, reverse=True)[:k] if isinstance(stream, list) else stream[:k]`,
          py`import heapq

def top_k(stream, k):
    return sorted(heapq.nlargest(k, stream))`,
        ],
      },
      real: [
        chi({
          title: 'The longest tracks with nlargest',
          use: ['tracks'],
          hidden: 'import heapq\n',
          given: '# tracks is a list of dictionaries with "Name" and "Milliseconds". heapq is already imported.',
          brief: 'Use `heapq.nlargest` with a `key` to find the **five longest tracks** (by `Milliseconds`) without sorting all of them. Store in `answer` the list of their **names**, longest first.',
          reference: py`longest = heapq.nlargest(5, tracks, key=lambda t: t["Milliseconds"])
answer = [t["Name"] for t in longest]`,
          walkthrough: '`nlargest` accepts a `key`, just like `sorted`, and returns the items themselves. For a small `k` it is much cheaper than a full sort.',
          traps: [py`shortest = heapq.nsmallest(5, tracks, key=lambda t: t["Milliseconds"])
answer = [t["Name"] for t in shortest]`, py`longest = heapq.nlargest(5, tracks, key=lambda t: t["Milliseconds"])
answer = [t["Name"] for t in reversed(longest)]`],
        }),
        chi({
          title: 'Rank in a sorted list',
          use: ['invoices'],
          hidden: 'import bisect\ntotals = sorted(inv["Total"] for inv in invoices)\n',
          given: '# totals is a sorted list of the invoice totals. bisect is already imported.',
          brief: 'With `bisect`, find how many invoices have a total **below 5.94**, and how many have a total of **5.94 or less**. Store the two numbers in `answer` as a tuple, in that order.',
          reference: py`answer = (bisect.bisect_left(totals, 5.94), bisect.bisect_right(totals, 5.94))`,
          walkthrough: '`bisect_left` gives the position before equal items, which is also the number of smaller ones. `bisect_right` gives the position after them, which counts the equal ones too.',
          traps: [py`answer = (bisect.bisect_right(totals, 5.94), bisect.bisect_left(totals, 5.94))`, py`answer = (bisect.bisect_left(totals, 5.94), len(totals))`],
        }),
        chi({
          title: 'A priority queue of tasks',
          hidden: 'import heapq\ntasks = [(3, "c"), (1, "a"), (2, "b"), (1, "z"), (2, "d")]\n',
          given: '# tasks is a list of (priority, name) pairs. A small number means it is more urgent. heapq is already imported.',
          brief: 'Put the tasks in a **heap** and take them out one by one with `heappop`. Store in `answer` the **names in the order that they come out**. A smaller priority number comes first, and equal priorities are ordered by name.',
          reference: py`heap = []
for task in tasks:
    heapq.heappush(heap, task)
answer = [heapq.heappop(heap)[1] for _ in range(len(heap))]`,
          walkthrough: 'Tuples are compared item by item, so the priority decides first and the name breaks ties. `heappop` always returns the smallest one.',
          traps: [py`answer = [name for priority, name in sorted(tasks, reverse=True)]`, py`answer = [name for priority, name in tasks]`],
        }),
      ],
    },
    {
      id: 'py-type-hints',
      title: 'Type hints basics: annotations, Optional and unions',
      blurb: 'Annotating functions, containers, optional values and Callable.',
      kind: 'code',
      practice: {
        prompt: 'Write `find(items, key)` with **precise type hints**.\n\nIt returns the **position of the first item** equal to `key`, or `None` when it is not there. Annotate the parameters as `items: list[str]` and `key: str`, and the return value as `int | None`.',
        starter: 'def find(items, key):\n    ...\n',
        solution: py`def find(items: list[str], key: str) -> int | None:
    for index, item in enumerate(items):
        if item == key:
            return index
    return None`,
        samples: ['find(["a", "b", "c"], "b")'],
        cases: [
          ['The item is there', 'find(["a", "b", "c"], "b")'],
          ['The item is missing', 'find(["a", "b"], "z")'],
          ['An empty list', 'find([], "a")'],
          ['The first of two equal items', 'find(["x", "y", "x"], "x")'],
          ['The first position', 'find(["q"], "q")'],
          ['The hints of the parameters', '{k: v for k, v in find.__annotations__.items() if k != "return"}'],
          ['The hint of the result', 'find.__annotations__.get("return")'],
        ],
        traps: [
          py`def find(items, key):
    for index, item in enumerate(items):
        if item == key:
            return index
    return None`,
          py`def find(items: list[str], key: str):
    for index, item in enumerate(items):
        if item == key:
            return index
    return None`,
          py`def find(items: list[str], key: str) -> int | None:
    for index, item in enumerate(items):
        if item == key:
            return index
    return -1`,
          py`def find(items: list, key: str) -> int | None:
    for index, item in enumerate(items):
        if item == key:
            return index
    return None`,
          py`def find(items: list[str], key: str) -> int:
    for index, item in enumerate(items):
        if item == key:
            return index
    return None`,
        ],
      },
      real: [
        chi({
          title: 'A typed price lookup',
          use: ['tracks'],
          starter: 'def price_of(name, prices):\n    ...\n\nprices = {t["Name"]: t["UnitPrice"] for t in tracks}\nanswer = (price_of("Balls to the Wall", prices), price_of("No such track", prices), price_of.__annotations__["return"])\n',
          given: '# prices maps a track name to its UnitPrice. The last line calls the function, and reads its return hint.',
          brief: 'Write `price_of(name, prices)`. Annotate it: `name: str`, `prices: dict[str, float]`, and the return value as `float | None`. It returns the price of the track, or `None` when the name is not in the dictionary. Use `.get`.',
          reference: py`def price_of(name: str, prices: dict[str, float]) -> float | None:
    return prices.get(name)

prices = {t["Name"]: t["UnitPrice"] for t in tracks}
answer = (price_of("Balls to the Wall", prices), price_of("No such track", prices), price_of.__annotations__["return"])`,
          walkthrough: 'The hint `float | None` tells callers to expect a missing value, and type checkers then insist that they test for it. `dict.get` returns `None` for a missing key.',
          traps: [py`def price_of(name: str, prices: dict[str, float]) -> float:
    return prices.get(name)

prices = {t["Name"]: t["UnitPrice"] for t in tracks}
answer = (price_of("Balls to the Wall", prices), price_of("No such track", prices), price_of.__annotations__["return"])`, py`def price_of(name: str, prices: dict[str, float]) -> float | int | None:
    return prices.get(name)

prices = {t["Name"]: t["UnitPrice"] for t in tracks}
answer = (price_of("Balls to the Wall", prices), price_of("No such track", prices), price_of.__annotations__["return"])`],
        }),
        chi({
          title: 'A function that takes a function',
          use: ['tracks'],
          starter: 'from typing import Callable\n\ndef count_where(items, test):\n    ...\n\nanswer = (count_where(tracks, lambda t: t["UnitPrice"] > 1), count_where.__annotations__["return"])\n',
          given: '# The last line counts the tracks that cost more than 1, and reads the return hint. Callable is imported.',
          brief: 'Write `count_where(items, test)`, where `items` is a `list[dict]`, `test` is a `Callable[[dict], bool]`, and the result is an `int`. It counts the items for which `test(item)` is true. Annotate all three.',
          reference: py`from typing import Callable

def count_where(items: list[dict], test: Callable[[dict], bool]) -> int:
    return sum(1 for item in items if test(item))

answer = (count_where(tracks, lambda t: t["UnitPrice"] > 1), count_where.__annotations__["return"])`,
          walkthrough: '`Callable[[dict], bool]` reads as "a function that takes a dict and returns a bool". The hints do not change how the function runs, they describe it.',
          traps: [py`from typing import Callable

def count_where(items: list[dict], test: Callable[[dict], bool]) -> int:
    return sum(1 for item in items if not test(item))

answer = (count_where(tracks, lambda t: t["UnitPrice"] > 1), count_where.__annotations__["return"])`, py`from typing import Callable

def count_where(items: list[dict], test: Callable[[dict], bool]) -> bool:
    return sum(1 for item in items if test(item))

answer = (count_where(tracks, lambda t: t["UnitPrice"] > 1), count_where.__annotations__["return"])`],
        }),
        chi({
          title: 'Hints do not check anything',
          starter: 'def double(x: int) -> int:\n    return x * 2\n\nanswer = None\n',
          given: '# double is annotated with int, but Python does not check the hint at runtime.',
          brief: 'Store in `answer` a tuple of the results of `double("ab")`, `double(3.5)` and `double(4)`. Python happily runs all three, because **type hints are not enforced**.',
          reference: py`def double(x: int) -> int:
    return x * 2

answer = (double("ab"), double(3.5), double(4))`,
          walkthrough: 'Strings can be multiplied by a number, so `"ab" * 2` is `"abab"`. The hints only help editors and type checkers such as mypy to warn you before you run the program.',
          traps: [py`def double(x: int) -> int:
    return x * 2

answer = (double(2), double(3), double(4))`, py`def double(x: int) -> int:
    return x * 2

answer = (double("ab"), double(4))`],
        }),
      ],
    },
    {
      id: 'py-enum-shaped',
      title: 'enum, namedtuple, TypedDict and other shaped data',
      blurb: 'Enum, IntEnum, Flag, NamedTuple, TypedDict and dataclasses.',
      kind: 'code',
      practice: {
        prompt: 'Write an `Enum` called `Status` with the members `PENDING = "pending"`, `PAID = "paid"`, `SHIPPED = "shipped"`, `DELIVERED = "delivered"` and `CANCELLED = "cancelled"`.\n\nThen write `next_states(status)`. It returns a **list of the members** that an order may move to next:\n\n- from `PENDING`: `PAID` or `CANCELLED`\n- from `PAID`: `SHIPPED` or `CANCELLED`\n- from `SHIPPED`: `DELIVERED`\n- from `DELIVERED` and `CANCELLED`: nothing (an empty list)',
        starter: 'from enum import Enum\n\nclass Status(Enum):\n    ...\n\ndef next_states(status):\n    ...\n',
        solution: py`from enum import Enum

class Status(Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

TRANSITIONS = {
    Status.PENDING: [Status.PAID, Status.CANCELLED],
    Status.PAID: [Status.SHIPPED, Status.CANCELLED],
    Status.SHIPPED: [Status.DELIVERED],
    Status.DELIVERED: [],
    Status.CANCELLED: [],
}

def next_states(status):
    return list(TRANSITIONS[status])`,
        samples: ['[s.name for s in next_states(Status.PENDING)]'],
        cases: [
          ['From pending', '[s.name for s in next_states(Status.PENDING)]'],
          ['From paid', '[s.name for s in next_states(Status.PAID)]'],
          ['From shipped', '[s.name for s in next_states(Status.SHIPPED)]'],
          ['Delivered is final', '[s.name for s in next_states(Status.DELIVERED)]'],
          ['Cancelled is final', 'next_states(Status.CANCELLED)'],
          ['Look up by value', 'Status("shipped").name'],
          ['The values', '[s.value for s in Status]'],
          ['The number of members', 'len(Status)'],
          ['A member is not its value', 'Status.PAID == "paid"'],
          ['The list holds members', 'all(isinstance(s, Status) for s in next_states(Status.PENDING))'],
        ],
        traps: [
          py`from enum import Enum

class Status(Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

def next_states(status):
    order = list(Status)
    return [order[order.index(status) + 1]] if status not in (Status.DELIVERED, Status.CANCELLED) else []`,
          py`from enum import Enum

class Status(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

TRANSITIONS = {
    Status.PENDING: [Status.PAID, Status.CANCELLED],
    Status.PAID: [Status.SHIPPED, Status.CANCELLED],
    Status.SHIPPED: [Status.DELIVERED],
    Status.DELIVERED: [],
    Status.CANCELLED: [],
}

def next_states(status):
    return list(TRANSITIONS[status])`,
          py`from enum import Enum

class Status(Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

def next_states(status):
    return {
        Status.PENDING: ["paid", "cancelled"],
        Status.PAID: ["shipped", "cancelled"],
        Status.SHIPPED: ["delivered"],
    }.get(status, [])`,
          py`from enum import Enum

class Status(Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"

TRANSITIONS = {
    Status.PENDING: [Status.PAID],
    Status.PAID: [Status.SHIPPED],
    Status.SHIPPED: [Status.DELIVERED],
    Status.DELIVERED: [],
}

def next_states(status):
    return list(TRANSITIONS[status])`,
        ],
      },
      real: [
        chi({
          title: 'Classify the track lengths',
          use: ['tracks'],
          hidden: 'from enum import Enum\n\nclass Length(Enum):\n    SHORT = "short"\n    MEDIUM = "medium"\n    LONG = "long"\n',
          starter: 'def classify(seconds):\n    ...\n\nanswer = {}\n',
          given: '# The enum Length has the members SHORT, MEDIUM and LONG. tracks is a list of dictionaries with "Milliseconds".',
          brief: 'Write `classify(seconds)`: `Length.SHORT` below **180** seconds, `Length.LONG` above **360** seconds, and `Length.MEDIUM` otherwise (both limits belong to `MEDIUM`). Use the length in **whole seconds** (`Milliseconds // 1000`) of each track. Store in `answer` a dictionary that maps each member\'s **value** (`"short"`, ...) to the number of tracks of that length.',
          reference: py`def classify(seconds):
    if seconds < 180:
        return Length.SHORT
    if seconds > 360:
        return Length.LONG
    return Length.MEDIUM

answer = {}
for t in tracks:
    key = classify(t["Milliseconds"] // 1000).value
    answer[key] = answer.get(key, 0) + 1`,
          walkthrough: 'The function returns a **member**, not a string, so a typo cannot slip through. Members have a `value`, which is what we use as the dictionary key.',
          traps: [py`def classify(seconds):
    if seconds <= 180:
        return Length.SHORT
    if seconds >= 360:
        return Length.LONG
    return Length.MEDIUM

answer = {}
for t in tracks:
    key = classify(t["Milliseconds"] // 1000).value
    answer[key] = answer.get(key, 0) + 1`, py`def classify(seconds):
    if seconds < 180:
        return Length.SHORT
    if seconds > 300:
        return Length.LONG
    return Length.MEDIUM

answer = {}
for t in tracks:
    key = classify(t["Milliseconds"] // 1000).value
    answer[key] = answer.get(key, 0) + 1`],
        }),
        chi({
          title: 'A record as a NamedTuple',
          use: ['tracks'],
          hidden: 'from typing import NamedTuple\n',
          starter: 'class Item(NamedTuple):\n    ...\n\nanswer = None\n',
          given: '# NamedTuple is imported. tracks is a list of dictionaries with "TrackId", "Name" and "Milliseconds".',
          brief: 'Define a `NamedTuple` class `Item` with the fields `id: int`, `name: str` and `seconds: int`. Build one `Item` for each of the **first three tracks** (`seconds` is `Milliseconds // 1000`). Store in `answer` the list of the three items converted with `._asdict()`, converted to plain `dict` objects.',
          reference: py`class Item(NamedTuple):
    id: int
    name: str
    seconds: int

items = [Item(t["TrackId"], t["Name"], t["Milliseconds"] // 1000) for t in tracks[:3]]
answer = [dict(item._asdict()) for item in items]`,
          walkthrough: 'A `NamedTuple` is a tuple whose items have names, so `_asdict` can turn each record into a dictionary that keeps the field order.',
          traps: [py`class Item(NamedTuple):
    id: int
    name: str
    milliseconds: int

items = [Item(t["TrackId"], t["Name"], t["Milliseconds"]) for t in tracks[:3]]
answer = [dict(item._asdict()) for item in items]`, py`class Item(NamedTuple):
    id: int
    name: str
    seconds: int

items = [Item(t["TrackId"], t["Name"], t["Milliseconds"] // 1000) for t in tracks[:2]]
answer = [dict(item._asdict()) for item in items]`],
        }),
        chi({
          title: 'Permissions as flags',
          use: ['employees'],
          hidden: 'from enum import Flag, auto\n\nclass Permission(Flag):\n    READ = auto()\n    WRITE = auto()\n    ADMIN = auto()\n',
          starter: 'def permissions_for(title):\n    ...\n\nanswer = {e["Title"]: permissions_for(e["Title"]).value for e in employees}\n',
          given: '# Permission is a Flag with READ, WRITE and ADMIN. employees is a list of dictionaries with "Title".',
          brief: 'Write `permissions_for(title)`: the title `"General Manager"` gets **all three** permissions combined with `|`. Any **other title that contains `Manager`** gets `READ | WRITE`. Everybody else gets `READ` only. The last line maps each title to the **number** (`.value`) of its permissions.',
          reference: py`def permissions_for(title):
    if title == "General Manager":
        return Permission.READ | Permission.WRITE | Permission.ADMIN
    if "Manager" in title:
        return Permission.READ | Permission.WRITE
    return Permission.READ

answer = {e["Title"]: permissions_for(e["Title"]).value for e in employees}`,
          walkthrough: 'Flags combine with `|`, and each member has its own bit, so `READ | WRITE` has the value 1 + 2 = 3, and all three together give 7. The order of the checks matters: the general manager also contains `Manager`.',
          traps: [py`def permissions_for(title):
    if "Manager" in title:
        return Permission.READ | Permission.WRITE
    if title == "General Manager":
        return Permission.READ | Permission.WRITE | Permission.ADMIN
    return Permission.READ

answer = {e["Title"]: permissions_for(e["Title"]).value for e in employees}`, py`def permissions_for(title):
    if title == "General Manager":
        return Permission.ADMIN
    if "Manager" in title:
        return Permission.READ | Permission.WRITE
    return Permission.READ

answer = {e["Title"]: permissions_for(e["Title"]).value for e in employees}`],
        }),
      ],
    },
  ],
  checkpoint: [],
}
