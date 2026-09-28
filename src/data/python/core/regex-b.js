import { py, rx } from './common.js'

export const regexSecond = [
  {
    id: 'py-regex-backrefs',
    title: 'Backreferences and repeated patterns',
    blurb: '\\1 and (?P=name): matching the same text again.',
    kind: 'code',
    practice: {
      prompt: 'Write `first_repeat(s)`. It returns the **first word that is immediately repeated** in the text, for example `"this is is a test"` gives `"is"`.\n\n- Words are runs of letters, digits and underscores, separated by white space.\n- Ignore the case when comparing, and return the word in **lower case**.\n- A word that only *starts* a longer word does not count (`the theory` has no repeat).\n- Return `None` when nothing is repeated in a row.',
      starter: 'import re\n\ndef first_repeat(s):\n    ...\n',
      solution: py`import re

def first_repeat(s):
    m = re.search(r"\b(\w+)\s+\1\b", s, re.IGNORECASE)
    return m.group(1).lower() if m else None`,
      samples: ['first_repeat("this is is a test")', 'first_repeat("no repeats here")'],
      cases: [
        ['A repeated word', 'first_repeat("this is is a test")'],
        ['Two repeats, the first one wins', 'first_repeat("the the cat cat")'],
        ['No repeats', 'first_repeat("no repeats here")'],
        ['Different case', 'first_repeat("Is is fine")'],
        ['A word that starts the next word', 'first_repeat("the theory")'],
        ['A new line between the words', 'first_repeat("a\\na")'],
        ['The same word but not in a row', 'first_repeat("the cat the dog")'],
        ['A word repeated three times', 'first_repeat("go go go")'],
        ['An empty text', 'first_repeat("")'],
      ],
      traps: [
        py`import re

def first_repeat(s):
    m = re.search(r"\b(\w+)\s+\1\b", s)
    return m.group(1).lower() if m else None`,
        py`import re

def first_repeat(s):
    m = re.search(r"\b(\w+)\s+\1", s, re.IGNORECASE)
    return m.group(1).lower() if m else None`,
        py`import re

def first_repeat(s):
    m = re.search(r"\b(\w+)\s+\1\b", s, re.IGNORECASE)
    return m.group(1) if m else None`,
        py`import re

def first_repeat(s):
    seen = set()
    for word in s.lower().split():
        if word in seen:
            return word
        seen.add(word)
    return None`,
      ],
    },
    real: [
      rx({
        title: 'Doubled words in track names',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Count the track names that contain a **word repeated immediately** (`Hey Hey`, `Bye bye`), ignoring case. Both words must be whole words. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.search(r"\b(\w+)\s+\1\b", t["Name"], re.I))`,
        walkthrough: 'The group `(\\w+)` captures a word and `\\1` requires the same text again after white space. The `\\b` marks stop it from matching part of a longer word. `re.I` also applies to the backreference.',
        traps: [py`answer = sum(1 for t in tracks if re.search(r"\b(\w+)\b.*\b\1\b", t["Name"], re.I))`, py`answer = sum(1 for t in tracks if re.search(r"\b(\w+)\s+\1", t["Name"], re.I))`],
      }),
      rx({
        title: 'Double letters',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Count the track names that contain **three of the same letter in a row** (for example `Feeel`), ignoring case. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.search(r"([A-Za-z])\1\1", t["Name"], re.I))`,
        walkthrough: 'Capture one letter and require it twice more with `\\1\\1`. With `re.I`, a backreference matches without regard to case, so `aAa` counts.',
        traps: [py`answer = sum(1 for t in tracks if re.search(r"([A-Za-z])\1", t["Name"], re.I))`, py`answer = sum(1 for t in tracks if re.search(r"(\w)\1\1", t["Name"], re.I))`],
      }),
      rx({
        title: 'The same first and last character',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Count the track names of **two or more characters** whose **first and last characters are the same** (case matters). Use one group and a backreference. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.fullmatch(r"(.).*\1", t["Name"], re.S))`,
        walkthrough: 'The first character is captured by `(.)`. Then anything, then `\\1` is the same character at the end. `fullmatch` covers the whole name, and one-character names cannot match because they need two characters.',
        traps: [py`answer = sum(1 for t in tracks if re.fullmatch(r"(.).*\1", t["Name"], re.S | re.I))`, py`answer = sum(1 for t in tracks if re.fullmatch(r"(.).*\1", t["Name"][:-1] if t["Name"].endswith(".") else t["Name"], re.S))`],
      }),
    ],
  },
  {
    id: 'py-regex-lookaround',
    title: 'Lookahead and lookbehind',
    blurb: 'Zero-width assertions: (?=...), (?!...), (?<=...), (?<!...).',
    kind: 'code',
    practice: {
      prompt: 'Write `add_commas(s)`. The text `s` is made only of digits. Return it with a **comma between every group of three digits**, counted from the right, using **only `re.sub`** and a pattern with lookarounds.\n\n`"1234567"` becomes `"1,234,567"`, and `"123"` stays `"123"`. An empty text stays empty.',
      starter: 'import re\n\ndef add_commas(s):\n    ...\n',
      solution: py`import re

def add_commas(s):
    return re.sub(r"(?<=\d)(?=(?:\d{3})+$)", ",", s)`,
      samples: ['add_commas("1234567")', 'add_commas("123")'],
      cases: [
        ['Seven digits', 'add_commas("1234567")'],
        ['Three digits', 'add_commas("123")'],
        ['Four digits', 'add_commas("1000")'],
        ['Six digits', 'add_commas("123456")'],
        ['Two digits', 'add_commas("12")'],
        ['A long number', 'add_commas("1234567890")'],
        ['An empty text', 'add_commas("")'],
        ['Nine digits', 'add_commas("100200300")'],
      ],
      traps: [
        py`import re

def add_commas(s):
    return re.sub(r"(?=(?:\d{3})+$)", ",", s)`,
        py`import re

def add_commas(s):
    return re.sub(r"(?<=\d)(?=\d{3})", ",", s)`,
        py`import re

def add_commas(s):
    return re.sub(r"(?<=\d)(?=(?:\d{3})+$)", " ", s)`,
        py`import re

def add_commas(s):
    return re.sub(r"(?<=\d)(?=(?:\d{2})+$)", ",", s)`,
      ],
    },
    real: [
      rx({
        title: 'Total revenue with separators',
        use: ['invoices'],
        given: '# invoices is a list of dictionaries with a "Total" key (dollars, as a number).',
        brief: 'Add up all the invoice totals and convert the sum to **whole cents** (`round(sum * 100)`). Store in `answer` the cents as text **with a comma between every group of three digits**, using `re.sub` with lookarounds on `str(cents)`.',
        reference: py`cents = round(sum(inv["Total"] for inv in invoices) * 100)
answer = re.sub(r"(?<=\d)(?=(?:\d{3})+$)", ",", str(cents))`,
        walkthrough: 'The comma goes at every position that has a digit before it and a whole number of digit groups after it up to the end. The match is empty, so `sub` simply inserts the commas.',
        traps: [py`cents = round(sum(inv["Total"] for inv in invoices) * 100)
answer = re.sub(r"(?=(?:\d{3})+$)", ",", str(cents))`, py`dollars = round(sum(inv["Total"] for inv in invoices))
answer = re.sub(r"(?<=\d)(?=(?:\d{3})+$)", ",", str(dollars))`],
      }),
      rx({
        title: 'The word after "Love"',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'For every track name, find the word that comes **right after** `Love ` (capital L, then a space) using a **lookbehind**, so that the match holds only the word. Store in `answer` the **sorted list of the different words** found.',
        reference: py`found = set()
for t in tracks:
    found.update(re.findall(r"(?<=Love )\w+", t["Name"]))
answer = sorted(found)`,
        walkthrough: 'The lookbehind `(?<=Love )` checks the text before the match but leaves it out of the result, so `findall` returns just the word. A set removes repeats.',
        traps: [py`found = set()
for t in tracks:
    found.update(re.findall(r"Love \w+", t["Name"]))
answer = sorted(found)`, py`found = set()
for t in tracks:
    found.update(re.findall(r"(?<=love )\w+", t["Name"]))
answer = sorted(found)`],
      }),
      rx({
        title: 'What is inside the brackets',
        use: ['albums'],
        given: '# albums is a list of dictionaries with a "Title" key, such as "BBC Sessions [Disc 1] [Live]".',
        brief: 'Use a lookbehind and a lookahead to find the text **inside square brackets**, without the brackets themselves. Store in `answer` the **sorted list of the different bracketed texts** over all album titles.',
        reference: py`found = set()
for a in albums:
    found.update(re.findall(r"(?<=\[)[^\]]+(?=\])", a["Title"]))
answer = sorted(found)`,
        walkthrough: '`(?<=\\[)` requires an opening bracket before, and `(?=\\])` a closing bracket after. Neither is part of the match, so `findall` returns the inner text only.',
        traps: [py`found = set()
for a in albums:
    found.update(re.findall(r"\[[^\]]+\]", a["Title"]))
answer = sorted(found)`, py`found = []
for a in albums:
    found.extend(re.findall(r"(?<=\[)[^\]]+(?=\])", a["Title"]))
answer = sorted(found)`],
      }),
    ],
  },
  {
    id: 'py-regex-functions',
    title: 'The re functions: match, search, fullmatch, findall, finditer',
    blurb: 'Which function for which job, compiled patterns and overlapping matches.',
    kind: 'code',
    practice: {
      prompt: 'Write `all_starts(pattern, s)`. It returns a **list of the start positions** of every match of the regular expression `pattern` in the text `s`, **including matches that overlap**.\n\nFor example, `"aa"` in `"aaaa"` starts at `0`, `1` and `2`. Return an empty list if there is no match.',
      starter: 'import re\n\ndef all_starts(pattern, s):\n    ...\n',
      solution: py`import re

def all_starts(pattern, s):
    return [m.start() for m in re.finditer(f"(?={pattern})", s)]`,
      samples: ['all_starts("aa", "aaaa")', 'all_starts("x", "abc")'],
      cases: [
        ['Overlapping matches', 'all_starts("aa", "aaaa")'],
        ['Matches that do not overlap', 'all_starts("ab", "abab")'],
        ['No match', 'all_starts("x", "abc")'],
        ['A real pattern', 'all_starts("a.c", "abcaxc")'],
        ['Digits', 'all_starts(r"\\d\\d", "1234")'],
        ['A match at the end', 'all_starts("c", "abc")'],
        ['An empty text', 'all_starts("a", "")'],
        ['Words', 'all_starts("ana", "banana")'],
      ],
      traps: [
        py`import re

def all_starts(pattern, s):
    return [m.start() for m in re.finditer(pattern, s)]`,
        py`import re

def all_starts(pattern, s):
    return re.findall(f"(?={pattern})", s)`,
        py`import re

def all_starts(pattern, s):
    result = []
    i = s.find(pattern)
    while i != -1:
        result.append(i)
        i = s.find(pattern, i + 1)
    return result`,
        py`import re

def all_starts(pattern, s):
    return [m.start() + 1 for m in re.finditer(f"(?={pattern})", s)]`,
      ],
    },
    real: [
      rx({
        title: 'Overlapping double vowels',
        use: ['tracks'],
        hidden: 'text = " ".join(t["Name"].lower() for t in tracks)\n',
        given: '# text is every track name in lower case, joined with spaces.',
        brief: 'Count the **overlapping** pairs of the same vowel in a row (`aa`, `ee`, `ii`, `oo` or `uu`). In `eee` there are **two** overlapping pairs. Store the count in `answer`.',
        reference: py`answer = len(re.findall(r"(?=(aa|ee|ii|oo|uu))", text))`,
        walkthrough: 'A normal search would use up the characters it matched. The lookahead only peeks, so the search moves on by one character each time and finds every overlapping pair.',
        traps: [py`answer = len(re.findall(r"aa|ee|ii|oo|uu", text))`, py`answer = len(re.findall(r"(?=(aa|ee|oo))", text))`],
      }),
      rx({
        title: 'Where does "Love" start?',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Use `finditer` (or `search`) to find the position of the first whole word `Love` (capital L) in each name that has it. Store in `answer` the **list of these start positions** for the **first eight** such names, in order.',
        reference: py`answer = []
for t in tracks:
    m = re.search(r"\bLove\b", t["Name"])
    if m:
        answer.append(m.start())
answer = answer[:8]`,
        walkthrough: 'A match object knows where it is: `start()` is the index of its first character. Names without the word give `None`, so test it first.',
        traps: [py`answer = []
for t in tracks:
    m = re.search(r"\bLove\b", t["Name"])
    if m:
        answer.append(m.end())
answer = answer[:8]`, py`answer = []
for t in tracks:
    m = re.search(r"Love", t["Name"])
    if m:
        answer.append(m.start())
answer = answer[:8]`],
      }),
      rx({
        title: 'Names of two or three words',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Compile a pattern and count the track names that consist of **exactly two or three words**. A word is a run of letters, digits or underscores, and the words are separated by **single spaces**. There must be nothing else in the name. Store the count in `answer`.',
        reference: py`pattern = re.compile(r"\w+(?: \w+){1,2}")
answer = sum(1 for t in tracks if pattern.fullmatch(t["Name"]))`,
        walkthrough: 'The first word, then one or two more each preceded by a space. `fullmatch` requires that the whole name has this shape, while `match` or `search` would accept longer names.',
        traps: [py`pattern = re.compile(r"\w+(?: \w+){1,2}")
answer = sum(1 for t in tracks if pattern.match(t["Name"]))`, py`pattern = re.compile(r"\w+(?: \w+){1,2}")
answer = sum(1 for t in tracks if pattern.search(t["Name"]))`],
      }),
    ],
  },
  {
    id: 'py-regex-sub-split',
    title: 'sub, subn and split: replacing and splitting with patterns',
    blurb: 'Replace with groups and functions, and split on patterns.',
    kind: 'code',
    practice: {
      prompt: 'Write `to_camel(s)`. It converts `snake_case` to `camelCase` using `re.sub` with a **function**.\n\nEvery underscore that is followed by a **lower case letter** is removed, and that letter becomes upper case. Any other underscore stays.',
      starter: 'import re\n\ndef to_camel(s):\n    ...\n',
      solution: py`import re

def to_camel(s):
    return re.sub(r"_([a-z])", lambda m: m.group(1).upper(), s)`,
      samples: ['to_camel("snake_case_words")', 'to_camel("single")'],
      cases: [
        ['Three words', 'to_camel("snake_case_words")'],
        ['Two words', 'to_camel("a_b")'],
        ['One word', 'to_camel("single")'],
        ['An empty text', 'to_camel("")'],
        ['A digit after the underscore', 'to_camel("x_1_y")'],
        ['A double underscore', 'to_camel("a__b")'],
        ['A leading underscore', 'to_camel("_private_name")'],
        ['Already camel case', 'to_camel("alreadyCamel")'],
      ],
      traps: [
        py`import re

def to_camel(s):
    return re.sub(r"_(\w)", lambda m: m.group(1).upper(), s)`,
        py`import re

def to_camel(s):
    return s.title().replace("_", "")`,
        py`import re

def to_camel(s):
    return re.sub(r"_([a-z])", lambda m: m.group(1).upper(), s, count=1)`,
        py`import re

def to_camel(s):
    return re.sub(r"_([a-z])", r"\1", s)`,
      ],
    },
    real: [
      rx({
        title: 'Mask e-mail addresses',
        use: ['customers'],
        given: '# customers is a list of dictionaries with an "Email" key, such as "ada@example.org".',
        brief: 'For the **first three customers**, replace every character before the `@` **except the first one** with `*`, and keep the rest. For example `ada@example.org` becomes `a**@example.org`. Store the list of three masked addresses in `answer`.',
        reference: py`answer = [re.sub(r"(?<=.)[^@](?=[^@]*@)", "*", c["Email"]) for c in customers[:3]]`,
        walkthrough: 'The lookbehind `(?<=.)` skips the first character, `[^@]` picks one character that is not the at sign, and the lookahead checks that an `@` still follows. Each such character is replaced by a star.',
        traps: [py`answer = [re.sub(r"[^@](?=[^@]*@)", "*", c["Email"]) for c in customers[:3]]`, py`answer = [re.sub(r"(?<=.)[^@]", "*", c["Email"]) for c in customers[:3]]`],
      }),
      rx({
        title: 'Normalise phone numbers',
        use: ['customers'],
        given: '# customers is a list of dictionaries. "Phone" is text such as "+1 (514) 721-4711", or None.',
        brief: 'Remove **everything that is not a digit** from each `Phone`. Skip customers without a phone. Store in `answer` the list of the cleaned numbers of the **first five** customers that have one.',
        reference: py`cleaned = [re.sub(r"\D", "", c["Phone"]) for c in customers if c["Phone"]]
answer = cleaned[:5]`,
        walkthrough: '`\\D` matches any character that is not a digit, so replacing it with nothing keeps only the digits.',
        traps: [py`cleaned = [re.sub(r"[ ()-]", "", c["Phone"]) for c in customers if c["Phone"]]
answer = cleaned[:5]`, py`cleaned = [re.sub(r"\D", "", c["Phone"]) for c in customers if c["Phone"]]
answer = cleaned[-5:]`],
      }),
      rx({
        title: 'Split composer lists',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries. "Composer" is text such as "F. Baltes, S. Kaufman & U. Dirkschneider", or None.',
        brief: 'Composers are separated by a comma, an ampersand, a slash **or** a semicolon, with optional spaces around it. Split every `Composer` with `re.split`, and count the **different individual names**. Skip `None` and empty pieces. Store the count in `answer`.',
        reference: py`names = set()
for t in tracks:
    if t["Composer"]:
        for piece in re.split(r"\s*[,&/;]\s*", t["Composer"]):
            if piece:
                names.add(piece)
answer = len(names)`,
        walkthrough: 'One class holds all four separators, with `\\s*` on each side to absorb the spaces. Empty pieces can appear at the ends, so they are skipped.',
        traps: [py`names = set()
for t in tracks:
    if t["Composer"]:
        for piece in t["Composer"].split(","):
            if piece.strip():
                names.add(piece.strip())
answer = len(names)`, py`names = set()
for t in tracks:
    if t["Composer"]:
        for piece in re.split(r"[,&/;]", t["Composer"]):
            if piece:
                names.add(piece)
answer = len(names)`],
      }),
    ],
  },
  {
    id: 'py-regex-flags',
    title: 'Flags and verbose patterns',
    blurb: 'IGNORECASE, MULTILINE, DOTALL, inline flags and VERBOSE.',
    kind: 'code',
    practice: {
      prompt: 'Write `phone_digits(s)`. If the **whole** text is a 10-digit phone number, return its digits as one text; otherwise return `None`.\n\nThe number has an **area code** of three digits (optionally in round brackets), an **exchange** of three digits and a **number** of four digits. Between the parts there may be one space, dot or hyphen, or nothing.\n\nWrite the pattern in **verbose mode** with a comment for each part.',
      starter: 'import re\n\ndef phone_digits(s):\n    ...\n',
      solution: py`import re

PHONE = re.compile(
    r"""
    \(?(\d{3})\)?    # area code, maybe in brackets
    [\s.-]?          # a separator
    (\d{3})          # exchange
    [\s.-]?          # a separator
    (\d{4})          # number
    """,
    re.VERBOSE,
)

def phone_digits(s):
    m = PHONE.fullmatch(s)
    return "".join(m.groups()) if m else None`,
      samples: ['phone_digits("(555) 123-4567")', 'phone_digits("555-1234")'],
      cases: [
        ['Brackets and a hyphen', 'phone_digits("(555) 123-4567")'],
        ['Dots', 'phone_digits("555.123.4567")'],
        ['Spaces', 'phone_digits("555 123 4567")'],
        ['Only digits', 'phone_digits("5551234567")'],
        ['Hyphens', 'phone_digits("555-123-4567")'],
        ['No space after the bracket', 'phone_digits("(555)123-4567")'],
        ['Too short', 'phone_digits("555-1234")'],
        ['Too long', 'phone_digits("55512345678")'],
        ['Letters', 'phone_digits("abc-def-ghij")'],
        ['Text around it', 'phone_digits("call 555-123-4567")'],
      ],
      traps: [
        py`import re

def phone_digits(s):
    m = re.search(r"\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})", s)
    return "".join(m.groups()) if m else None`,
        py`import re

PHONE = re.compile(
    r"""
    \(?(\d{3})\)?    # area code
    [\s.-]?          # a separator
    (\d{3})          # exchange
    [\s.-]?          # a separator
    (\d{4})          # number
    """
)

def phone_digits(s):
    m = PHONE.fullmatch(s)
    return "".join(m.groups()) if m else None`,
        py`import re

def phone_digits(s):
    m = re.fullmatch(r"\(?(\d{3})\)?[\s.-](\d{3})[\s.-](\d{4})", s)
    return "".join(m.groups()) if m else None`,
        py`import re

def phone_digits(s):
    m = re.fullmatch(r"\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})", s)
    return m.groups() if m else None`,
      ],
    },
    real: [
      rx({
        title: 'Names that start with "the"',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Count the track names that **start with the whole word** `the`, in any mix of upper and lower case. Use a flag so that you do not have to write the pattern twice. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.match(r"the\b", t["Name"], re.IGNORECASE))`,
        walkthrough: '`re.IGNORECASE` makes `The`, `THE` and `the` all match. The `\\b` stops `Theory` and `Thermal` from counting.',
        traps: [py`answer = sum(1 for t in tracks if re.match(r"the\b", t["Name"]))`, py`answer = sum(1 for t in tracks if re.match(r"the", t["Name"], re.IGNORECASE))`],
      }),
      rx({
        title: 'Lines that end with a question mark',
        use: ['tracks'],
        hidden: 'text = "\\n".join(t["Name"] for t in tracks)\n',
        given: '# text is every track name on its own line.',
        brief: 'Use **one** `re.findall` call with the MULTILINE flag to count the **lines that end with a question mark**. Store the count in `answer`.',
        reference: py`answer = len(re.findall(r"\?$", text, re.MULTILINE))`,
        walkthrough: 'Without `re.MULTILINE`, `$` only matches at the very end of the whole text. With it, `$` matches at the end of every line.',
        traps: [py`answer = len(re.findall(r"\?$", text))`, py`answer = len(re.findall(r"\?", text, re.MULTILINE))`],
      }),
      rx({
        title: 'A verbose pattern for US phones',
        use: ['customers'],
        given: '# customers is a list of dictionaries. "Phone" is text such as "+1 (514) 721-4711", or None.',
        brief: 'Write a **verbose** pattern (`re.VERBOSE`) with a comment on each part, for a phone number of the form `+1 (ddd) ddd-dddd` (a plus, a one, a space, three digits in brackets, a space, three digits, a hyphen, four digits). Count the customers whose `Phone` matches **completely**. Store the count in `answer`.',
        reference: py`pattern = re.compile(
    r"""
    \+1          # the country code
    [ ]          # a space
    \(\d{3}\)    # the area code in brackets
    [ ]          # a space
    \d{3}        # the exchange
    -            # a hyphen
    \d{4}        # the number
    """,
    re.VERBOSE,
)
answer = sum(1 for c in customers if c["Phone"] and pattern.fullmatch(c["Phone"]))`,
        walkthrough: 'In verbose mode, white space in the pattern is ignored, so a real space is written as `[ ]` (or `\\ `). The `#` starts a comment that explains the part.',
        traps: [py`pattern = re.compile(
    r"""
    \+1          # the country code
    \(\d{3}\)    # the area code
    \d{3}-\d{4}  # the number
    """,
    re.VERBOSE,
)
answer = sum(1 for c in customers if c["Phone"] and pattern.fullmatch(c["Phone"]))`, py`pattern = re.compile(r"\+1 \(\d{3}\) \d{3}-\d{4}")
answer = sum(1 for c in customers if c["Phone"] and pattern.search(c["Phone"])) + 1`],
      }),
    ],
  },
  {
    id: 'py-regex-recipes',
    title: 'Regex recipes: e-mail, phone, dates, URLs, IPs and log lines',
    blurb: 'Practical patterns, their limits and log-line parsing.',
    kind: 'code',
    practice: {
      prompt: 'Write `parse_log(line)`. It parses a web-server log line such as\n\n`203.0.113.9 - - [10/Oct/2024:13:55:36 +0000] "GET /index.html HTTP/1.1" 200 2326`\n\nand returns a **dictionary** with the keys `"ip"`, `"time"` (the text inside the square brackets), `"method"`, `"path"` and `"status"` (an **integer**).\n\nThe size at the end can be a number or `-`. If the line does not have this layout, return `None`.',
      starter: 'import re\n\ndef parse_log(line):\n    ...\n',
      solution: py`import re

LOG = re.compile(
    r'(?P<ip>\S+) \S+ \S+ \[(?P<time>[^\]]+)\] "(?P<method>[A-Z]+) (?P<path>\S+) [^"]*" (?P<status>\d{3}) (?:\d+|-)'
)

def parse_log(line):
    m = LOG.fullmatch(line)
    if m is None:
        return None
    result = m.groupdict()
    result["status"] = int(result["status"])
    return result`,
      samples: ['parse_log(\'203.0.113.9 - - [10/Oct/2024:13:55:36 +0000] "GET /index.html HTTP/1.1" 200 2326\')', 'parse_log("not a log line")'],
      cases: [
        ['A normal line', py`parse_log('203.0.113.9 - - [10/Oct/2024:13:55:36 +0000] "GET /index.html HTTP/1.1" 200 2326')`],
        ['A POST with a query', py`parse_log('10.0.0.5 - - [01/Jan/2025:00:00:01 +0100] "POST /api/items?id=7 HTTP/1.1" 201 512')`],
        ['A missing page', py`parse_log('192.168.1.1 - - [02/Feb/2025:10:20:30 +0000] "GET /nope HTTP/2" 404 -')`],
        ['A server error', py`parse_log('8.8.4.4 - - [03/Mar/2025:23:59:59 -0500] "DELETE /x HTTP/1.1" 500 12')`],
        ['Other user fields', py`parse_log('192.0.2.1 user1 alice [05/May/2025:08:00:00 +0000] "GET /a HTTP/1.1" 200 15')`],
        ['Text after the line', py`parse_log('1.1.1.1 - - [10/Oct/2024:13:55:36 +0000] "GET / HTTP/1.1" 200 12 extra')`],
        ['Not a log line', 'parse_log("not a log line")'],
        ['An empty line', 'parse_log("")'],
        ['A missing status', py`parse_log('1.1.1.1 - - [10/Oct/2024:13:55:36 +0000] "GET / HTTP/1.1"')`],
      ],
      traps: [
        py`import re

def parse_log(line):
    m = re.fullmatch(r'(?P<ip>\S+) \S+ \S+ \[(?P<time>[^\]]+)\] "(?P<method>[A-Z]+) (?P<path>\S+) [^"]*" (?P<status>\d{3}) (?:\d+|-)', line)
    return m.groupdict() if m else None`,
        py`import re

def parse_log(line):
    m = re.fullmatch(r'(?P<ip>.*) - - \[(?P<time>.*)\] "(?P<method>.*) (?P<path>.*) .*" (?P<status>\d+) .*', line)
    if m is None:
        return None
    result = m.groupdict()
    result["status"] = int(result["status"])
    return result`,
        py`import re

def parse_log(line):
    m = re.search(r'(?P<ip>\S+) \S+ \S+ \[(?P<time>[^\]]+)\] "(?P<method>[A-Z]+) (?P<path>\S+) [^"]*" (?P<status>\d{3})', line)
    if m is None:
        return None
    result = m.groupdict()
    result["status"] = int(result["status"])
    return result`,
        py`import re

def parse_log(line):
    m = re.fullmatch(r'(?P<ip>\S+) \S+ \S+ \[(?P<time>[^\]]+)\] "(?P<method>[A-Z]+) (?P<path>\S+) [^"]*" (?P<status>\d{3}) (?:\d+|-)', line)
    result = m.groupdict()
    result["status"] = int(result["status"])
    return result`,
      ],
    },
    real: [
      rx({
        title: 'Which e-mail addresses are bad?',
        use: ['customers'],
        hidden: 'emails = [c["Email"] for c in customers] + ["bad@", "no-at.example.com", "x@y", "ok@site.org", "two@@x.org", "a b@site.com"]\n',
        given: '# emails is a list of e-mail addresses. Some of them were added by hand, and are broken.',
        brief: 'Write a pattern for the **rough shape** of an e-mail address: one or more of letters, digits, `_`, `.`, `+` or `-`, then `@`, then a domain with **at least one dot** made of letters, digits, `_` or `-`. Store in `answer` the **list of the addresses that do not match completely**, in their original order.',
        reference: py`pattern = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")
answer = [e for e in emails if not pattern.fullmatch(e)]`,
        walkthrough: 'The domain part has a first label and then one or more `.label` groups, so `x@y` fails. `fullmatch` makes sure there is nothing extra, which rejects `two@@x.org` and `a b@site.com`.',
        traps: [py`answer = [e for e in emails if not re.fullmatch(r".+@.+", e)]`, py`pattern = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")
answer = [e for e in emails if not pattern.search(e)]`],
      }),
      rx({
        title: 'How many different domains?',
        use: ['customers'],
        given: '# customers is a list of dictionaries with an "Email" key.',
        brief: 'Extract the **domain** (everything after the `@`) of each customer e-mail, in **lower case**. Store in `answer` the number of **different** domains.',
        reference: py`domains = set()
for c in customers:
    m = re.search(r"@([\w.-]+)$", c["Email"])
    if m:
        domains.add(m.group(1).lower())
answer = len(domains)`,
        walkthrough: 'The group after the `@` holds the domain, and `$` makes it run to the end. Lower-casing before adding to the set makes `Site.com` and `site.com` the same domain.',
        traps: [py`domains = set()
for c in customers:
    m = re.search(r"\.([a-z]+)$", c["Email"])
    if m:
        domains.add(m.group(1))
answer = len(domains)`, py`answer = len(customers)`],
      }),
      rx({
        title: 'How many phone formats?',
        use: ['customers'],
        given: '# customers is a list of dictionaries. "Phone" is text, or None.',
        brief: 'Replace **each digit** of a phone number by `9` (one `9` for each digit) to get its **format**, for example `+9 (999) 999-9999`. Store in `answer` the number of **different formats** among the customers that have a phone.',
        reference: py`formats = {re.sub(r"\d", "9", c["Phone"]) for c in customers if c["Phone"]}
answer = len(formats)`,
        walkthrough: 'Replacing every digit by the same character hides the actual numbers and keeps only the layout. A set counts the different layouts.',
        traps: [py`formats = {re.sub(r"\d+", "9", c["Phone"]) for c in customers if c["Phone"]}
answer = len(formats)`, py`formats = {c["Phone"] for c in customers if c["Phone"]}
answer = len(formats)`],
      }),
    ],
  },
  {
    id: 'py-regex-performance',
    title: 'Performance, catastrophic backtracking and debugging regex',
    blurb: 'Why some patterns explode, ReDoS and how to fix and debug them.',
    kind: 'learn',
    check: [
      {
        q: 'Which pattern is the most likely to suffer from catastrophic backtracking?',
        options: ['`\\d{3}-\\d{4}`', '`(a+)+$`', '`[a-z]+@[a-z]+`', '`^\\w+$`'],
        answer: 1,
        why: 'A repeated group whose content is itself repeated (nested quantifiers) can match the same text in exponentially many ways.',
      },
      {
        q: 'What is ReDoS?',
        options: [
          'A Python module for regular expressions',
          'An attack that sends a crafted text so that a slow pattern keeps the server busy',
          'A flag that makes patterns faster',
          'A way to write patterns in verbose mode',
        ],
        answer: 1,
        why: 'Regular expression denial of service abuses patterns with catastrophic backtracking: a small input can cost enormous time.',
      },
      {
        q: 'Which is a good way to make a pattern safer?',
        options: [
          'Add more nested groups',
          'Remove the ambiguity, so that each part matches text in only one way, and prefer specific classes such as `[^"]*` to `.*`',
          'Use `re.DOTALL` on every pattern',
          'Remove all anchors',
        ],
        answer: 1,
        why: 'When there is only one way to match, the engine has nothing to try again. Specific classes cannot run past their delimiters.',
      },
      {
        q: 'A web application lets users type their own regular expression, which the server then runs on its data. What is the problem?',
        options: [
          'There is none',
          'A user can supply a pattern with catastrophic backtracking, and freeze the server',
          'Regular expressions cannot be typed',
          'Only capital letters will work',
        ],
        answer: 1,
        why: 'Never run patterns from untrusted users. Use plain text search, or limit both the pattern and the time.',
      },
      {
        q: 'How should you test a pattern for speed?',
        options: [
          'Only on text that matches',
          'Also on a **long text that does not match**, because failing is often the slowest case',
          'By counting the number of characters in the pattern',
          'You cannot',
        ],
        answer: 1,
        why: 'A slow pattern usually explodes when it fails, because the engine has to try every possible way before it gives up.',
      },
    ],
  },
  {
    id: 'py-regex-workshop',
    title: 'Regex workshop: cleaning a messy dataset and parsing logs',
    blurb: 'A guided project that cleans contact lines and reports the rejects.',
    kind: 'code',
    practice: {
      prompt: 'Write `clean_contacts(lines)`. Each line should hold **three fields**: a name, a phone number and an e-mail address, separated by a comma, a semicolon or a pipe (`|`), with optional spaces around the separator.\n\nReturn a **tuple** `(good, rejects)`:\n\n- `good`: a list of dictionaries with the keys `"name"`, `"phone"` and `"email"`, in the order of the input.\n- `rejects`: the list of the **original lines** that could not be cleaned, in the same order.\n\nThe rules:\n\n- **name**: the words are separated by exactly one space, and each word is capitalised (`ada LOVELACE` becomes `Ada Lovelace`).\n- **phone**: only the digits remain, and there must be **7 to 15** digits.\n- **email**: lower case, and it must fully match a **rough e-mail shape**: `[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+`.\n- A line without exactly three fields is rejected.',
      starter: 'import re\n\ndef clean_contacts(lines):\n    ...\n',
      solution: py`import re

SEPARATOR = re.compile(r"\s*[,;|]\s*")
EMAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")

def clean_contacts(lines):
    good, rejects = [], []
    for line in lines:
        fields = SEPARATOR.split(line.strip())
        if len(fields) != 3:
            rejects.append(line)
            continue
        name, phone, email = fields
        name = " ".join(word.capitalize() for word in name.split())
        phone = re.sub(r"\D", "", phone)
        email = email.strip().lower()
        if not name or not 7 <= len(phone) <= 15 or not EMAIL.fullmatch(email):
            rejects.append(line)
            continue
        good.append({"name": name, "phone": phone, "email": email})
    return good, rejects`,
      samples: ['clean_contacts(["  ada LOVELACE ,  +44 20 7946 0958 , Ada@Example.ORG "])'],
      cases: [
        ['One clean line', 'clean_contacts(["Grace Hopper;555.010.9999;grace.hopper@navy.mil"])'],
        ['Messy spaces and case', 'clean_contacts(["  ada   LOVELACE ,  +44 20 7946 0958 , Ada@Example.ORG "])'],
        ['A phone that is too short', 'clean_contacts(["Alan Turing | 12345 | alan@x.org"])'],
        ['A broken e-mail', 'clean_contacts(["Alan Turing | 5550101234 | alan@bletchley"])'],
        ['The wrong number of fields', 'clean_contacts(["only one field", "a,b,c,d"])'],
        ['A mix of good and bad', 'clean_contacts(["Ann Lee, (555) 010-4242, ann@x.co.uk", "bad line", "Bo Ray|55501012|bo@y.org"])'],
        ['No lines', 'clean_contacts([])'],
        ['A phone that is too long', 'clean_contacts(["Cy Zed, 1234567890123456, cy@z.net"])'],
      ],
      traps: [
        py`import re

SEPARATOR = re.compile(r"\s*[,;|]\s*")
EMAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")

def clean_contacts(lines):
    good, rejects = [], []
    for line in lines:
        fields = SEPARATOR.split(line.strip())
        if len(fields) != 3:
            rejects.append(line)
            continue
        name, phone, email = fields
        name = " ".join(word.capitalize() for word in name.split())
        phone = re.sub(r"\D", "", phone)
        email = email.strip()
        if not name or not 7 <= len(phone) <= 15 or not EMAIL.fullmatch(email):
            rejects.append(line)
            continue
        good.append({"name": name, "phone": phone, "email": email})
    return good, rejects`,
        py`import re

SEPARATOR = re.compile(r"\s*[,;|]\s*")
EMAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")

def clean_contacts(lines):
    good, rejects = [], []
    for line in lines:
        fields = SEPARATOR.split(line.strip())
        if len(fields) != 3:
            rejects.append(line)
            continue
        name, phone, email = fields
        name = name.title()
        phone = re.sub(r"\D", "", phone)
        email = email.strip().lower()
        if not name or not 7 <= len(phone) <= 15 or not EMAIL.fullmatch(email):
            rejects.append(line)
            continue
        good.append({"name": name, "phone": phone, "email": email})
    return good, rejects`,
        py`import re

SEPARATOR = re.compile(r"\s*[,;|]\s*")
EMAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")

def clean_contacts(lines):
    good, rejects = [], []
    for line in lines:
        fields = SEPARATOR.split(line.strip())
        if len(fields) != 3:
            rejects.append(line)
            continue
        name, phone, email = fields
        name = " ".join(word.capitalize() for word in name.split())
        phone = re.sub(r"[^\d+]", "", phone)
        email = email.strip().lower()
        if not name or not 7 <= len(phone) <= 15 or not EMAIL.fullmatch(email):
            rejects.append(line)
            continue
        good.append({"name": name, "phone": phone, "email": email})
    return good, rejects`,
        py`import re

SEPARATOR = re.compile(r"\s*[,;|]\s*")
EMAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")

def clean_contacts(lines):
    good, rejects = [], []
    for line in lines:
        fields = SEPARATOR.split(line.strip())
        if len(fields) != 3:
            rejects.append(line)
            continue
        name, phone, email = fields
        name = " ".join(word.capitalize() for word in name.split())
        phone = re.sub(r"\D", "", phone)
        email = email.strip().lower()
        if not name or not len(phone) >= 1 or not EMAIL.fullmatch(email):
            rejects.append(line)
            continue
        good.append({"name": name, "phone": phone, "email": email})
    return good, rejects`,
        py`import re

SEPARATOR = re.compile(r"\s*[,;|]\s*")
EMAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")

def clean_contacts(lines):
    good = []
    for line in lines:
        fields = SEPARATOR.split(line.strip())
        if len(fields) != 3:
            continue
        name, phone, email = fields
        name = " ".join(word.capitalize() for word in name.split())
        phone = re.sub(r"\D", "", phone)
        email = email.strip().lower()
        if not name or not 7 <= len(phone) <= 15 or not EMAIL.fullmatch(email):
            continue
        good.append({"name": name, "phone": phone, "email": email})
    return good`,
      ],
    },
    real: [
      rx({
        title: 'Phone numbers of a plausible length',
        use: ['customers'],
        given: '# customers is a list of dictionaries. "Phone" is text such as "+55 (12) 3923-5555", or None.',
        brief: 'Clean each `Phone` to its **digits only**. Count the customers whose cleaned number has **10 to 12 digits** (both included). Customers without a phone are not counted. Store the count in `answer`.',
        reference: py`answer = 0
for c in customers:
    if c["Phone"]:
        digits = re.sub(r"\D", "", c["Phone"])
        if 10 <= len(digits) <= 12:
            answer += 1`,
        walkthrough: 'First remove every character that is not a digit, then check the length. Always test for `None` before you use a text function on a value.',
        traps: [py`answer = 0
for c in customers:
    if c["Phone"]:
        digits = re.sub(r"[ ()-]", "", c["Phone"])
        if 10 <= len(digits) <= 12:
            answer += 1`, py`answer = 0
for c in customers:
    if c["Phone"]:
        digits = re.sub(r"\D", "", c["Phone"])
        if 7 <= len(digits) <= 15:
            answer += 1`],
      }),
      rx({
        title: 'The most common tags in track names',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key. Some names have tags in brackets, such as "Song (Live)" or "Song [Remix]".',
        brief: 'Find the **tags**: the text inside round `(...)` or square `[...]` brackets (no brackets nested), in **lower case** with the spaces at both ends removed. Store in `answer` the **three most common tags** as a list, most common first. If two tags are equally common, the one that comes first alphabetically goes first.',
        reference: py`counts = {}
for t in tracks:
    for round_tag, square_tag in re.findall(r"\(([^()]*)\)|\[([^\[\]]*)\]", t["Name"]):
        tag = (round_tag or square_tag).strip().lower()
        counts[tag] = counts.get(tag, 0) + 1
answer = [tag for tag, n in sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:3]]`,
        walkthrough: 'A pattern with two groups gives a pair for each match, and only one of them has text. Taking the one that is not empty gives the tag. A sort by count and then by name gives a stable top three.',
        traps: [py`counts = {}
for t in tracks:
    for round_tag, square_tag in re.findall(r"\(([^()]*)\)|\[([^\[\]]*)\]", t["Name"]):
        tag = (round_tag or square_tag).strip()
        counts[tag] = counts.get(tag, 0) + 1
answer = [tag for tag, n in sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:3]]`, py`counts = {}
for t in tracks:
    for round_tag in re.findall(r"\(([^()]*)\)", t["Name"]):
        tag = round_tag.strip().lower()
        counts[tag] = counts.get(tag, 0) + 1
answer = [tag for tag, n in sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:3]]`],
      }),
      rx({
        title: 'Repair the dates',
        use: ['invoices'],
        hidden: 'dates = [inv["InvoiceDate"][:10] for inv in invoices[:3]] + ["2011/05/06", "6.5.2011", "2011-5-6", "May 2011", "31.12.1999", "1999-12-31 23:59"]\n',
        given: '# dates is a list of text. Some are already in the form YYYY-MM-DD, others use / or . or have single-digit parts.',
        brief: 'Convert each date to **`YYYY-MM-DD`** (with zero padding). Three layouts are accepted: `YYYY-M-D` and `YYYY/M/D` (year first), and `D.M.YYYY` (day first). The **whole text** must fit. Anything else becomes `None`. Store the list of results, in order, in `answer`.',
        reference: py`def repair(text):
    m = re.fullmatch(r"(\d{4})[-/](\d{1,2})[-/](\d{1,2})", text)
    if m:
        y, mo, d = m.groups()
    else:
        m = re.fullmatch(r"(\d{1,2})\.(\d{1,2})\.(\d{4})", text)
        if not m:
            return None
        d, mo, y = m.groups()
    return f"{y}-{int(mo):02d}-{int(d):02d}"

answer = [repair(d) for d in dates]`,
        walkthrough: 'Try each layout in turn with `fullmatch`. Capture the parts, put them in the same names whatever the layout, and format with `:02d` to add the missing zero. A date that fits none gives `None`.',
        traps: [py`def repair(text):
    m = re.search(r"(\d{4})[-/](\d{1,2})[-/](\d{1,2})", text)
    if m:
        y, mo, d = m.groups()
    else:
        m = re.search(r"(\d{1,2})\.(\d{1,2})\.(\d{4})", text)
        if not m:
            return None
        d, mo, y = m.groups()
    return f"{y}-{int(mo):02d}-{int(d):02d}"

answer = [repair(d) for d in dates]`, py`def repair(text):
    m = re.fullmatch(r"(\d{4})[-/](\d{1,2})[-/](\d{1,2})", text)
    if m:
        y, mo, d = m.groups()
    else:
        m = re.fullmatch(r"(\d{1,2})\.(\d{1,2})\.(\d{4})", text)
        if not m:
            return None
        mo, d, y = m.groups()
    return f"{y}-{int(mo):02d}-{int(d):02d}"

answer = [repair(d) for d in dates]`],
      }),
    ],
  },
]
