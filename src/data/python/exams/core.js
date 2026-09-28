const String_raw = String.raw

const LOAD = "tracks = rows('chinook', 'Track')\ninvoices = rows('chinook', 'Invoice')\n"

const code = (c) => ({ kind: 'code', points: 10, dataset: 'chinook', starter: 'answer = ', ...c, hidden: LOAD + (c.hidden ?? '') })

export const coreExam = [
  code({
    id: 'c-exam-1',
    hidden: String_raw`import re
lines = []
codes = [200, 200, 404, 500, 200, 301, 404, 200, 503, 200]
for i in range(60):
    lines.append(f'10.0.0.{i % 200} - - [10/Oct/2024:13:{i % 60:02d}:00 +0000] "GET /page{i} HTTP/1.1" {codes[i % 10]} {100 + i}')
`,
    given: '# lines holds 60 web-server log lines. re is already imported.',
    task: 'Each line ends with a **status code** and a size, after the quoted request. Use a regular expression to read the **status code** of every line. Store in `answer` a dictionary that maps every status code of **400 or more**, as an **integer**, to the number of lines that have it.',
    reference: String_raw`answer = {}
for line in lines:
    status = int(re.search(r'" (\d{3}) ', line).group(1))
    if status >= 400:
        answer[status] = answer.get(status, 0) + 1`,
    walkthrough: 'Capture the three digits that follow the closing quote and a space. Convert them to an integer before comparing.',
    traps: [String_raw`answer = {}
for line in lines:
    status = re.search(r'(\d{3})', line).group(1)
    if int(status) >= 400:
        answer[int(status)] = answer.get(int(status), 0) + 1`, String_raw`answer = {}
for line in lines:
    status = int(re.search(r'" (\d{3}) ', line).group(1))
    if status != 200:
        answer[status] = answer.get(status, 0) + 1`],
  }),
  code({
    id: 'c-exam-2',
    hidden: String_raw`import re
text = "Rent $1,299.50, food $85.20 and a coat for $199. Shipping was free, and the budget is $10,000 in total."
`,
    given: '# text is a sentence with prices. re is already imported.',
    task: 'Find **every price** in `text`: a dollar sign, then digits that may have **thousands commas** and an optional **decimal part of two digits** (`$1,299.50`, `$199`). Store in `answer` the **sum of the prices**, **rounded to 2 decimals**.',
    reference: String_raw`prices = re.findall(r"\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)", text)
answer = round(sum(float(p.replace(",", "")) for p in prices), 2)`,
    walkthrough: 'The pattern captures the digits after the dollar sign. Commas are removed before `float` converts the text. The trailing full stop of `$199.` is not part of a price, because a decimal part needs two digits.',
    traps: [String_raw`prices = re.findall(r"\$(\d+)", text)
answer = round(sum(float(p) for p in prices), 2)`, String_raw`prices = re.findall(r"\$(\d+\.?\d*)", text)
answer = round(sum(float(p) for p in prices), 2)`],
  }),
  code({
    id: 'c-exam-3',
    hidden: 'raw = ["+44 (0)20 7946 0958", "555.010.9999", "12345", "(555) 010-4242", "n/a", "1234567"]\nimport re\n',
    given: '# raw is a list of messy phone numbers. re is already imported.',
    task: 'Clean each phone number to its **digits only**. A number is **valid** when it has **7 to 15 digits**. Store in `answer` a tuple of two lists: the **cleaned valid numbers** (in order), and the **original texts** that were rejected (in order).',
    reference: String_raw`good, rejected = [], []
for text in raw:
    digits = re.sub(r"\D", "", text)
    if 7 <= len(digits) <= 15:
        good.append(digits)
    else:
        rejected.append(text)
answer = (good, rejected)`,
    walkthrough: '`\\D` matches everything that is not a digit, so removing it leaves the digits. The length test decides whether the number is valid, and the original text goes to the rejects.',
    traps: [String_raw`good, rejected = [], []
for text in raw:
    digits = re.sub(r"[ ()-]", "", text)
    if 7 <= len(digits) <= 15:
        good.append(digits)
    else:
        rejected.append(text)
answer = (good, rejected)`],
  }),
  {
    id: 'c-exam-4',
    kind: 'mcq',
    points: 10,
    q: 'A program should report whether a line contains a number, but this code prints `None` for the line `"order 66"`:\n\n```python\nimport re\nprint(re.match(r"\\d+", "order 66"))\n```\n\nWhat is the problem?',
    options: [
      '`\\d+` cannot match the digits 66',
      '`re.match` only matches at the **start** of the text. `re.search` finds the number anywhere',
      'The text needs `re.IGNORECASE`',
      '`print` cannot show a match object',
    ],
    answer: 1,
    why: 'The text starts with `o`, so `match` fails at the very first character. `re.search` scans the whole text.',
  },
  code({
    id: 'c-exam-5',
    hidden: 'from collections import Counter\n',
    given: '# invoices is a list of dictionaries with "BillingCountry" and "Total". Counter is already imported.',
    task: 'Add up the `Total` of the invoices for each `BillingCountry`. Store in `answer` the **five countries with the highest revenue** as a list of `(country, revenue)` pairs, highest first, the revenue **rounded to 2 decimals**. If two countries have the same revenue, the one that comes first alphabetically goes first.',
    reference: 'revenue = Counter()\nfor inv in invoices:\n    revenue[inv["BillingCountry"]] += inv["Total"]\nranked = sorted(revenue.items(), key=lambda pair: (-round(pair[1], 2), pair[0]))\nanswer = [(country, round(total, 2)) for country, total in ranked[:5]]',
    walkthrough: 'A `Counter` can add numbers, not only count. Sorting with a tuple key orders by revenue first and by name second.',
    traps: ['counts = Counter(inv["BillingCountry"] for inv in invoices)\nanswer = counts.most_common(5)', 'revenue = Counter()\nfor inv in invoices:\n    revenue[inv["BillingCountry"]] += inv["Total"]\nranked = sorted(revenue.items(), key=lambda pair: pair[1])\nanswer = [(country, round(total, 2)) for country, total in ranked[:5]]'],
  }),
  code({
    id: 'c-exam-6',
    hidden: 'from itertools import islice\n',
    starter: 'def big_invoices(invoices, limit):\n    ...\n\nanswer = [inv["InvoiceId"] for inv in islice(big_invoices(invoices, 13.86), 5)]\n',
    given: '# islice is already imported. The last line takes the first five results.',
    task: 'Write the **generator** `big_invoices(invoices, limit)`. It **yields**, one at a time and in the original order, every invoice whose `Total` is **greater than** `limit`. The last line collects the ids of the first five.',
    reference: 'def big_invoices(invoices, limit):\n    for inv in invoices:\n        if inv["Total"] > limit:\n            yield inv\n\nanswer = [inv["InvoiceId"] for inv in islice(big_invoices(invoices, 13.86), 5)]',
    walkthrough: 'A generator function uses `yield`. Because it is lazy, `islice` stops it after five results.',
    traps: ['def big_invoices(invoices, limit):\n    for inv in invoices:\n        if inv["Total"] >= limit:\n            yield inv\n\nanswer = [inv["InvoiceId"] for inv in islice(big_invoices(invoices, 13.86), 5)]', 'def big_invoices(invoices, limit):\n    for inv in invoices:\n        if inv["Total"] < limit:\n            yield inv\n\nanswer = [inv["InvoiceId"] for inv in islice(big_invoices(invoices, 13.86), 5)]'],
  }),
  code({
    id: 'c-exam-7',
    starter: 'from functools import wraps\n\ndef counted(fn):\n    ...\n\n@counted\ndef is_long(track):\n    return track["Milliseconds"] > 300_000\n\nflags = [is_long(t) for t in tracks[:100]]\nanswer = (sum(flags), is_long.calls)\n',
    given: '# The last lines apply is_long to 100 tracks, and report the number of long tracks and the number of calls.',
    task: 'Write the decorator `counted(fn)`. The wrapper must **return the result** of `fn`, accept any arguments, keep the function name (`functools.wraps`), and count the calls in an attribute `calls` that starts at `0`.',
    reference: 'from functools import wraps\n\ndef counted(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        return fn(*args, **kwargs)\n\n    wrapper.calls = 0\n    return wrapper\n\n@counted\ndef is_long(track):\n    return track["Milliseconds"] > 300_000\n\nflags = [is_long(t) for t in tracks[:100]]\nanswer = (sum(flags), is_long.calls)',
    walkthrough: 'The wrapper is a function, so it can hold an attribute. It increments the count, and returns whatever the original returned.',
    traps: ['from functools import wraps\n\ndef counted(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        fn(*args, **kwargs)\n\n    wrapper.calls = 0\n    return wrapper\n\n@counted\ndef is_long(track):\n    return track["Milliseconds"] > 300_000\n\nflags = [is_long(t) for t in tracks[:100]]\nanswer = (sum(flags), is_long.calls)', 'from functools import wraps\n\ndef counted(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        wrapper.calls = 1\n        return fn(*args, **kwargs)\n\n    wrapper.calls = 0\n    return wrapper\n\n@counted\ndef is_long(track):\n    return track["Milliseconds"] > 300_000\n\nflags = [is_long(t) for t in tracks[:100]]\nanswer = (sum(flags), is_long.calls)'],
  }),
  {
    id: 'c-exam-8',
    kind: 'mcq',
    points: 10,
    q: 'What does this print?\n\n```python\ndef add(item, items=[]):\n    items.append(item)\n    return items\n\nadd(1)\nprint(add(2))\n```',
    options: ['`[2]`', '`[1, 2]`', '`[1]`', 'An error'],
    answer: 1,
    why: 'The default list is created **once**, when the function is defined, and is shared by every call that does not pass its own list. The usual fix is `items=None` and a new list inside.',
  },
  code({
    id: 'c-exam-9',
    hidden: 'from datetime import datetime\n',
    given: '# invoices is a list of dictionaries with "CustomerId" and "InvoiceDate" (text such as "2009-01-01 00:00:00"). datetime is already imported.',
    task: 'For the customers **1, 2 and 3**, find the **number of days between their first and their last invoice**. Store in `answer` a dictionary from the customer id to that number of days.',
    reference: 'dates = {}\nfor inv in invoices:\n    if inv["CustomerId"] in (1, 2, 3):\n        when = datetime.strptime(inv["InvoiceDate"], "%Y-%m-%d %H:%M:%S")\n        dates.setdefault(inv["CustomerId"], []).append(when)\nanswer = {cid: (max(days) - min(days)).days for cid, days in dates.items()}',
    walkthrough: 'Collect the parsed dates of each customer, then subtract the earliest from the latest. The `days` of a `timedelta` is the whole number of days.',
    traps: ['dates = {}\nfor inv in invoices:\n    if inv["CustomerId"] in (1, 2, 3):\n        when = datetime.strptime(inv["InvoiceDate"], "%Y-%m-%d %H:%M:%S")\n        dates.setdefault(inv["CustomerId"], []).append(when)\nanswer = {cid: len(days) for cid, days in dates.items()}', 'dates = {}\nfor inv in invoices:\n    if inv["CustomerId"] in (1, 2, 3):\n        when = datetime.strptime(inv["InvoiceDate"], "%Y-%m-%d %H:%M:%S")\n        dates.setdefault(inv["CustomerId"], []).append(when)\nanswer = {cid: (min(days) - max(days)).days for cid, days in dates.items()}'],
  }),
  {
    id: 'c-exam-10',
    kind: 'mcq',
    points: 10,
    q: 'The pattern `^(\\w+\\s?)*$` becomes extremely slow on a long text of letters that ends with an exclamation mark. Which change fixes the problem?',
    options: [
      'Add the `re.IGNORECASE` flag',
      'Rewrite it so that each part can match text in only one way: `^\\w+(?:\\s\\w+)*$`',
      'Use `re.DOTALL`',
      'Test it on a longer text',
    ],
    answer: 1,
    why: 'The nested quantifiers let the engine split the same letters between the inner and the outer repeat in exponentially many ways. Removing the ambiguity leaves a single way to match.',
  },
]
