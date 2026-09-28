import { py, rx } from './common.js'

export const regexFirst = [
  {
    id: 'py-regex-why',
    title: 'Why regex, when not to use it, and a map of the re module',
    blurb: 'What a pattern is, where it helps, and the main re functions.',
    kind: 'learn',
    check: [
      {
        q: 'Which job is regex **best** at?',
        options: [
          'Adding two numbers',
          'Finding every order code of the form `AB-1234` in a long text',
          'Parsing deeply nested HTML',
          'Sorting a list',
        ],
        answer: 1,
        why: 'Regex is made for text with a recognisable shape. Nested structures need a real parser.',
      },
      {
        q: 'Why should a pattern usually be written as a raw string, like `r"\\d+"`?',
        options: [
          'Raw strings run faster',
          'Backslashes are kept as they are, so Python does not change them before `re` sees them',
          'Raw strings ignore case',
          'Raw strings are required for every string',
        ],
        answer: 1,
        why: 'In a normal string, sequences such as `\\b` and `\\n` are changed by Python first. In a raw string, the backslash stays.',
      },
      {
        q: 'What does `re.match(r"\\d+", "abc 123")` return?',
        options: ['A match for `123`', '`None`, because `match` only looks at the start', 'An empty list', 'An error'],
        answer: 1,
        why: '`match` tries the pattern only at the start of the text. The text starts with `a`, so it fails. `search` would find `123`.',
      },
      {
        q: 'You only need to know whether a line starts with `"error"`. What is the best tool?',
        options: ['A long regular expression', '`line.startswith("error")`', 'A loop over every character', '`re.compile`'],
        answer: 1,
        why: 'When a plain string method does the job, it is simpler and clearer than a pattern.',
      },
      {
        q: 'What do `re.search`, `re.match` and `re.fullmatch` return when they do **not** find a match?',
        options: ['An empty string', '`False`', '`None`', 'They raise an exception'],
        answer: 2,
        why: 'They return a match object on success and `None` on failure, so you must check before using `.group()`.',
      },
    ],
  },
  {
    id: 'py-regex-literals',
    title: 'Literals, metacharacters and escaping',
    blurb: 'The special characters, the backslash, raw strings and re.escape.',
    kind: 'code',
    practice: {
      prompt: 'Write `has_dot_digit(s)`. It returns `True` when the text contains a **real dot** followed directly by a **digit**, and `False` otherwise.\n\nFor example `"v3.5"` is `True`, but `"3x5"` and `"end."` are `False`.',
      starter: 'import re\n\ndef has_dot_digit(s):\n    ...\n',
      solution: py`import re

def has_dot_digit(s):
    return re.search(r"\.\d", s) is not None`,
      samples: ['has_dot_digit("v3.5")', 'has_dot_digit("3x5")'],
      cases: [
        ['A dot and a digit', 'has_dot_digit("v3.5")'],
        ['No dot at all', 'has_dot_digit("3x5")'],
        ['A dot at the end', 'has_dot_digit("end.")'],
        ['A dot and a letter', 'has_dot_digit("a.b")'],
        ['The dot is first', 'has_dot_digit(".5")'],
        ['A digit before the dot', 'has_dot_digit("1.")'],
        ['A match later in the text', 'has_dot_digit("a.b 1.2")'],
        ['An empty text', 'has_dot_digit("")'],
      ],
      traps: [
        py`import re

def has_dot_digit(s):
    return re.search(r".\d", s) is not None`,
        py`import re

def has_dot_digit(s):
    return "." in s`,
        py`import re

def has_dot_digit(s):
    return re.fullmatch(r"\.\d", s) is not None`,
        py`import re

def has_dot_digit(s):
    return re.search(r"\.\D", s) is not None`,
      ],
    },
    real: [
      rx({
        title: 'Names with a bracketed part',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key. re is already imported.',
        brief: 'Count the track names that contain an opening **round bracket** and, somewhere after it, a closing one, such as `Song (Live)`. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.search(r"\(.*\)", t["Name"]))`,
        walkthrough: 'Both brackets are metacharacters, so each one needs a backslash. `.*` between them means "anything at all", so the pattern accepts any text inside the brackets.',
        traps: [py`answer = sum(1 for t in tracks if re.search(r"(.*)", t["Name"]))`, py`answer = sum(1 for t in tracks if re.search(r"\(.*\)$", t["Name"]))`],
      }),
      rx({
        title: 'Titles with a question mark',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key. re is already imported.',
        brief: 'Count the track names that contain a **question mark**. The question mark is a metacharacter, so it has to be escaped. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.search(r"\?", t["Name"]))`,
        walkthrough: 'On its own, `?` makes the previous item optional. With a backslash in front, `\\?` matches a real question mark.',
        traps: [py`answer = sum(1 for t in tracks if re.search(r".?", t["Name"]))`, py`answer = sum(1 for t in tracks if re.search(r"\?$", t["Name"]))`],
      }),
      rx({
        title: 'Search for user text safely',
        use: ['tracks'],
        hidden: 'queries = ["c++", "a.b", "(live)", "?"]\n',
        given: '# queries is a list of texts that a user typed. Some contain special characters.',
        brief: 'For each text in `queries`, in order, count the track names that contain it **literally**. Build the pattern with `re.escape`. Store the list of four counts in `answer`.',
        reference: py`answer = [sum(1 for t in tracks if re.search(re.escape(q), t["Name"])) for q in queries]`,
        walkthrough: '`re.escape` puts a backslash before every special character, so `c++` and `(live)` are searched as plain text instead of causing an error or matching too much.',
        traps: [py`answer = [sum(1 for t in tracks if q in t["Name"].lower()) for q in queries]`, py`answer = [sum(1 for t in tracks if re.search(re.escape(q), t["Name"], re.I)) for q in queries]`],
      }),
    ],
  },
  {
    id: 'py-regex-classes',
    title: 'Character classes, ranges and shorthands',
    blurb: 'Square brackets, ranges, negation and \\d \\w \\s.',
    kind: 'code',
    practice: {
      prompt: 'Write `words(s)`. It returns a **list of the words** in `s`, where a word is a run of **letters (a to z, either case) and apostrophes**.\n\nDigits, underscores, spaces, hyphens and other punctuation are not part of a word, so they separate words.',
      starter: 'import re\n\ndef words(s):\n    ...\n',
      solution: py`import re

def words(s):
    return re.findall(r"[A-Za-z']+", s)`,
      samples: ['words("Don\'t stop, it\'s 5 o\'clock!")'],
      cases: [
        ['Apostrophes stay inside words', 'words("Don\'t stop, it\'s o\'clock")'],
        ['Digits separate words', 'words("abc123def")'],
        ['Underscores separate words', 'words("snake_case here")'],
        ['Hyphens separate words', 'words("well-known fact")'],
        ['Upper and lower case', 'words("Hello World")'],
        ['Only digits', 'words("12345")'],
        ['An empty text', 'words("")'],
        ['Punctuation', 'words("Wait... what?! Yes.")'],
      ],
      traps: [
        py`import re

def words(s):
    return re.findall(r"\w+", s)`,
        py`import re

def words(s):
    return re.findall(r"[a-z']+", s)`,
        py`import re

def words(s):
    return re.findall(r"[A-Za-z]+", s)`,
        py`import re

def words(s):
    return re.findall(r"\S+", s)`,
      ],
    },
    real: [
      rx({
        title: 'Canadian postal codes',
        use: ['customers'],
        given: '# customers is a list of dictionaries. "PostalCode" is text, or None.',
        brief: 'A Canadian postal code looks like `K1A 0B1`: a capital letter, a digit, a capital letter, a space, a digit, a capital letter and a digit. Count the customers whose `PostalCode` has **exactly** this shape (skip `None`). Store the count in `answer`.',
        reference: py`answer = sum(1 for c in customers if c["PostalCode"] and re.fullmatch(r"[A-Z]\d[A-Z] \d[A-Z]\d", c["PostalCode"]))`,
        walkthrough: 'Each position is one class: `[A-Z]` for a letter and `\\d` for a digit, with a plain space in the middle. `fullmatch` makes sure there is nothing extra. Test for `None` first, because a missing value cannot be matched.',
        traps: [py`answer = sum(1 for c in customers if c["PostalCode"] and re.fullmatch(r"[A-Z]\d[A-Z]\d[A-Z]\d", c["PostalCode"]))`, py`answer = sum(1 for c in customers if c["PostalCode"] and re.fullmatch(r"\d{5}", c["PostalCode"]))`],
      }),
      rx({
        title: 'Numbered track names',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Some names start with a track number, such as `01 - Prowler`. Count the names that start with **two digits, a space, a hyphen and a space**. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.match(r"\d\d - ", t["Name"]))`,
        walkthrough: '`match` looks only at the start, which is exactly what we need. `\\d\\d` is two digits, and the rest is literal text.',
        traps: [py`answer = sum(1 for t in tracks if re.search(r"\d - ", t["Name"]))`, py`answer = sum(1 for t in tracks if re.match(r"\d - ", t["Name"]))`],
      }),
      rx({
        title: 'Names made only of letters and spaces',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Count the track names made **only** of letters (a to z, either case) and spaces, with nothing else. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.fullmatch(r"[A-Za-z ]+", t["Name"]))`,
        walkthrough: 'A class with a range for each case and a space, repeated with `+`, must cover the whole name, so `fullmatch` is the right function.',
        traps: [py`answer = sum(1 for t in tracks if re.fullmatch(r"[A-Za-z]+", t["Name"]))`, py`answer = sum(1 for t in tracks if re.fullmatch(r"[\w ]+", t["Name"]))`],
      }),
    ],
  },
  {
    id: 'py-regex-quantifiers',
    title: 'Quantifiers: *, +, ?, {m,n}',
    blurb: 'Repetition: zero or more, one or more, optional and exact counts.',
    kind: 'code',
    practice: {
      prompt: 'Write `is_code(s)`. It returns `True` when the **whole** text is **three capital letters followed by three digits**, such as `ABC123`.\n\nAnything else, including extra characters, lower case letters or too few or too many digits, is `False`.',
      starter: 'import re\n\ndef is_code(s):\n    ...\n',
      solution: py`import re

def is_code(s):
    return re.fullmatch(r"[A-Z]{3}\d{3}", s) is not None`,
      samples: ['is_code("ABC123")', 'is_code("AB123")'],
      cases: [
        ['A valid code', 'is_code("ABC123")'],
        ['Another valid code', 'is_code("XYZ000")'],
        ['Too few letters', 'is_code("AB123")'],
        ['Too many letters', 'is_code("ABCD123")'],
        ['Too few digits', 'is_code("ABC12")'],
        ['Too many digits', 'is_code("ABC1234")'],
        ['Lower case', 'is_code("abc123")'],
        ['A leading space', 'is_code(" ABC123")'],
        ['An empty text', 'is_code("")'],
      ],
      traps: [
        py`import re

def is_code(s):
    return re.search(r"[A-Z]{3}\d{3}", s) is not None`,
        py`import re

def is_code(s):
    return re.fullmatch(r"[A-Z]+\d+", s) is not None`,
        py`import re

def is_code(s):
    return re.fullmatch(r"[A-Za-z]{3}\d{3}", s) is not None`,
        py`import re

def is_code(s):
    return re.fullmatch(r"[A-Z]{3}\d{2,3}", s) is not None`,
      ],
    },
    real: [
      rx({
        title: 'Phones with a bracketed area code',
        use: ['customers'],
        given: '# customers is a list of dictionaries. "Phone" is text such as "+1 (514) 721-4711", or None.',
        brief: 'Count the customers whose `Phone` contains a **bracketed number of one or more digits**, like `(514)` or `(0)`. Skip `None`. Store the count in `answer`.',
        reference: py`answer = sum(1 for c in customers if c["Phone"] and re.search(r"\(\d+\)", c["Phone"]))`,
        walkthrough: 'The brackets are escaped because they are special. `\\d+` means "one or more digits", so it covers `(12)`, `(514)` and `(0)`.',
        traps: [py`answer = sum(1 for c in customers if c["Phone"] and re.search(r"\(\d\)", c["Phone"]))`, py`answer = sum(1 for c in customers if c["Phone"] and "(" in c["Phone"] and ")" not in c["Phone"])`],
      }),
      rx({
        title: 'Track names ending in a number',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Count the track names that **end** with a number of **two or more digits**, such as `Song 99`. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.search(r"\d{2,}$", t["Name"]))`,
        walkthrough: '`\\d{2,}` is "two or more digits", and the `$` at the end pins them to the end of the name.',
        traps: [py`answer = sum(1 for t in tracks if re.search(r"\d$", t["Name"]))`, py`answer = sum(1 for t in tracks if re.search(r"\d{2,}", t["Name"]))`],
      }),
      rx({
        title: 'Repeated punctuation',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Count the track names that contain **two or more punctuation marks in a row**, where a mark is `!`, `?` or `.`. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.search(r"[!?.]{2,}", t["Name"]))`,
        walkthrough: 'A class of the three marks, repeated at least twice. Inside a class the dot is literal, so it needs no backslash.',
        traps: [py`answer = sum(1 for t in tracks if re.search(r"[!?.]", t["Name"]))`, py`answer = sum(1 for t in tracks if re.search(r"[!?]{2,}", t["Name"]))`],
      }),
    ],
  },
  {
    id: 'py-regex-greedy-lazy',
    title: 'Greedy, lazy and possessive matching',
    blurb: 'Why .* grabs too much, lazy quantifiers and backtracking.',
    kind: 'learn',
    check: [
      {
        q: 'What does `re.findall(r"<.*>", "<b>x</b>")` return?',
        options: ['`["<b>", "</b>"]`', '`["<b>x</b>"]`', '`["x"]`', '`[]`'],
        answer: 1,
        why: 'The greedy `.*` takes as much as it can, up to the last `>`, so it makes one long match.',
      },
      {
        q: 'Which pattern matches each tag `<b>` and `</b>` separately?',
        options: ['`<.*>`', '`<.+>`', '`<.*?>`', '`<>`'],
        answer: 2,
        why: 'A `?` after a quantifier makes it lazy. `.*?` takes as few characters as it can, and stops at the first `>`.',
      },
      {
        q: 'You want the text between two double quotes, and the text itself has no quotes inside. What is a precise and fast pattern?',
        options: ['`".*"`', '`"[^"]*"`', '`".*?.*?"`', '`"\\w+"`'],
        answer: 1,
        why: 'A negated class cannot run past the closing quote, so it needs neither laziness nor much backtracking.',
      },
      {
        q: 'What is backtracking?',
        options: [
          'Reading the text from right to left',
          'The engine going back to an earlier choice and trying another way when the rest of the pattern fails',
          'Undoing a substitution',
          'Matching the same group twice',
        ],
        answer: 1,
        why: 'When a part of the pattern fails, the engine gives back some text (or tries another alternative) and tries again.',
      },
      {
        q: 'Does `re.fullmatch(r"a*+a", "aaa")` match, in Python 3.11 and later?',
        options: ['Yes', 'No, because the possessive `a*+` never gives back an `a`', 'It raises an error', 'Only with the DOTALL flag'],
        answer: 1,
        why: 'A possessive quantifier takes everything and refuses to backtrack, so the final `a` has nothing left to match.',
      },
    ],
  },
  {
    id: 'py-regex-anchors',
    title: 'Anchors and boundaries: ^, $, \\A, \\Z, \\b, \\B',
    blurb: 'Pinning a match to the start, the end or a word edge.',
    kind: 'code',
    practice: {
      prompt: 'Write `is_identifier(s)`. It returns `True` when the **whole** text is a valid identifier: it starts with a letter (a to z, either case) or an underscore, and continues with letters, digits or underscores.\n\nBe careful: a **trailing new line** makes the text invalid.',
      starter: 'import re\n\ndef is_identifier(s):\n    ...\n',
      solution: py`import re

def is_identifier(s):
    return re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", s) is not None`,
      samples: ['is_identifier("total_2")', 'is_identifier("2total")'],
      cases: [
        ['A simple name', 'is_identifier("name")'],
        ['Starts with an underscore', 'is_identifier("_x1")'],
        ['Digits inside', 'is_identifier("total_2")'],
        ['Starts with a digit', 'is_identifier("1abc")'],
        ['A hyphen', 'is_identifier("a-b")'],
        ['A space', 'is_identifier("a b")'],
        ['A trailing new line', 'is_identifier("abc\\n")'],
        ['An empty text', 'is_identifier("")'],
        ['A single letter', 'is_identifier("x")'],
      ],
      traps: [
        py`import re

def is_identifier(s):
    return re.search(r"^[A-Za-z_]\w*$", s) is not None`,
        py`import re

def is_identifier(s):
    return re.match(r"[A-Za-z_][A-Za-z0-9_]*", s) is not None`,
        py`import re

def is_identifier(s):
    return re.fullmatch(r"\w+", s) is not None`,
        py`import re

def is_identifier(s):
    return re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]+", s) is not None`,
      ],
    },
    real: [
      rx({
        title: 'The whole word "love"',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Count the track names that contain the **whole word** `love`, in any mix of upper and lower case. A name with `glove` or `lovely` does not count. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.search(r"\blove\b", t["Name"], re.I))`,
        walkthrough: 'The `\\b` on both sides demands a word boundary, so `love` cannot be part of a longer word. `re.I` ignores the case.',
        traps: [py`answer = sum(1 for t in tracks if "love" in t["Name"].lower())`, py`answer = sum(1 for t in tracks if re.search(r"\blove\b", t["Name"]))`],
      }),
      rx({
        title: 'Names that start with a digit',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Count the track names whose **first** character is a digit. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.search(r"^\d", t["Name"]))`,
        walkthrough: 'The caret pins the digit to the start of the name. Without it, the pattern would find a digit anywhere.',
        traps: [py`answer = sum(1 for t in tracks if re.search(r"\d", t["Name"]))`, py`answer = sum(1 for t in tracks if re.search(r"\d$", t["Name"]))`],
      }),
      rx({
        title: 'Names that end with the word "live"',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Count the track names whose **last word** is `live`, in any mix of upper and lower case, for example `Eu Vim Da Bahia - Live`. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.search(r"\blive$", t["Name"], re.I))`,
        walkthrough: 'The `\\b` makes sure that `live` is a whole word, and the `$` makes sure it is the last one.',
        traps: [py`answer = sum(1 for t in tracks if re.search(r"\blive\b", t["Name"], re.I))`, py`answer = sum(1 for t in tracks if re.search(r"live$", t["Name"]))`],
      }),
    ],
  },
  {
    id: 'py-regex-alternation',
    title: 'Alternation and grouping',
    blurb: 'The | operator, grouping and the order of alternatives.',
    kind: 'code',
    practice: {
      prompt: 'Write `is_title(s)`. It returns `True` when the **whole** text is one of the titles `mr`, `mrs`, `ms` or `dr`, in **any mix of upper and lower case**, followed by an **optional dot**.\n\nSo `Mr`, `MRS.` and `dr.` are titles. `prof`, `Mrsx` and `mr..` are not.',
      starter: 'import re\n\ndef is_title(s):\n    ...\n',
      solution: py`import re

def is_title(s):
    return re.fullmatch(r"(?:mr|mrs|ms|dr)\.?", s, re.IGNORECASE) is not None`,
      samples: ['is_title("Mr.")', 'is_title("prof")'],
      cases: [
        ['A title', 'is_title("Mr")'],
        ['With a dot and capitals', 'is_title("MRS.")'],
        ['Lower case with a dot', 'is_title("dr.")'],
        ['Another title', 'is_title("Ms")'],
        ['Not a title', 'is_title("prof")'],
        ['Extra letter', 'is_title("Mrsx")'],
        ['Just an M', 'is_title("M")'],
        ['Two dots', 'is_title("mr..")'],
        ['An empty text', 'is_title("")'],
      ],
      traps: [
        py`import re

def is_title(s):
    return re.fullmatch(r"mr|mrs|ms|dr\.?", s, re.IGNORECASE) is not None`,
        py`import re

def is_title(s):
    return re.fullmatch(r"(?:mr|mrs|ms|dr)\.?", s) is not None`,
        py`import re

def is_title(s):
    return re.search(r"(?:mr|mrs|ms|dr)\.?", s, re.IGNORECASE) is not None`,
        py`import re

def is_title(s):
    return re.match(r"(?:mr|mrs|ms|dr)", s, re.IGNORECASE) is not None`,
      ],
    },
    real: [
      rx({
        title: 'Manager or staff titles',
        use: ['employees'],
        given: '# employees is a list of dictionaries. "Title" is text such as "Sales Manager".',
        brief: 'Count the employees whose `Title` is **exactly** `Sales` or `IT` followed by a space and then one of `Manager` or `Staff`. (`Sales Support Agent` does not count.) Store the count in `answer`.',
        reference: py`answer = sum(1 for e in employees if re.fullmatch(r"(?:Sales|IT) (?:Manager|Staff)", e["Title"]))`,
        walkthrough: 'Each choice goes into its own group, so the pipe only chooses within it. `fullmatch` rejects `Sales Support Agent`.',
        traps: [py`answer = sum(1 for e in employees if re.fullmatch(r"Sales|IT (?:Manager|Staff)", e["Title"]))`, py`answer = sum(1 for e in employees if re.search(r"(?:Sales|IT) (?:Manager|Staff)", e["Title"]) or "Agent" in e["Title"])`],
      }),
      rx({
        title: 'Part 1, Part 2, Pt. 3',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key.',
        brief: 'Count the track names that contain the word `Part` or `Pt` (with an optional dot), then a space and a digit, such as `Exodus, Pt. 1` or `Lost (Pilot, Part 2)`. The word must start at a word boundary. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if re.search(r"\b(?:Part|Pt\.?) \d", t["Name"]))`,
        walkthrough: 'The alternatives sit inside a non-capturing group, so the `\\b` before it and the space and digit after it apply to both.',
        traps: [py`answer = sum(1 for t in tracks if re.search(r"Part|Pt\.? \d", t["Name"]))`, py`answer = sum(1 for t in tracks if re.search(r"\b(?:Part|Pt) \d", t["Name"]))`],
      }),
      rx({
        title: 'Several composers',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries. "Composer" is text, or None.',
        brief: 'Count the tracks whose `Composer` contains a slash, an ampersand **or** a semicolon (all three are ways to list several people). Skip `None`. Store the count in `answer`.',
        reference: py`answer = sum(1 for t in tracks if t["Composer"] and re.search(r"/|&|;", t["Composer"]))`,
        walkthrough: 'Each separator is one alternative. Since they are single characters, the class `[/&;]` would do just as well.',
        traps: [py`answer = sum(1 for t in tracks if t["Composer"] and re.search(r"/&;", t["Composer"]))`, py`answer = sum(1 for t in tracks if t["Composer"] and re.search(r"/|&", t["Composer"]))`],
      }),
    ],
  },
  {
    id: 'py-regex-groups',
    title: 'Capturing groups and match objects',
    blurb: 'group, groups, span, unused groups and findall with groups.',
    kind: 'code',
    practice: {
      prompt: 'Write `parse_date(s)`. If the **whole** text has the form `YYYY-MM-DD` (four digits, two digits, two digits, with hyphens), return a tuple of **three integers** `(year, month, day)`. Otherwise return `None`.\n\nYou do not need to check that the date exists.',
      starter: 'import re\n\ndef parse_date(s):\n    ...\n',
      solution: py`import re

def parse_date(s):
    m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", s)
    if m is None:
        return None
    return tuple(int(part) for part in m.groups())`,
      samples: ['parse_date("2024-03-15")', 'parse_date("15/03/2024")'],
      cases: [
        ['A normal date', 'parse_date("2024-03-15")'],
        ['Another date', 'parse_date("1999-12-31")'],
        ['Leading zeros become integers', 'parse_date("0900-01-02")'],
        ['One digit month', 'parse_date("2024-3-15")'],
        ['No hyphens', 'parse_date("20240315")'],
        ['Extra text before', 'parse_date("x2024-03-15")'],
        ['Extra text after', 'parse_date("2024-03-15 10:00")'],
        ['An empty text', 'parse_date("")'],
      ],
      traps: [
        py`import re

def parse_date(s):
    m = re.search(r"(\d{4})-(\d{2})-(\d{2})", s)
    if m is None:
        return None
    return tuple(int(part) for part in m.groups())`,
        py`import re

def parse_date(s):
    m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", s)
    if m is None:
        return None
    return m.groups()`,
        py`import re

def parse_date(s):
    m = re.fullmatch(r"(\d+)-(\d+)-(\d+)", s)
    if m is None:
        return None
    return tuple(int(part) for part in m.groups())`,
        py`import re

def parse_date(s):
    m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", s)
    return tuple(int(part) for part in m.groups())`,
      ],
    },
    real: [
      rx({
        title: 'Invoices per year',
        use: ['invoices'],
        given: '# invoices is a list of dictionaries. "InvoiceDate" is text such as "2009-01-01 00:00:00".',
        brief: 'Use a group to capture the **year** (the first four digits) of each `InvoiceDate`. Store in `answer` a dictionary that maps each year, as an **integer**, to the number of invoices in that year.',
        reference: py`answer = {}
for inv in invoices:
    year = int(re.match(r"(\d{4})-", inv["InvoiceDate"]).group(1))
    answer[year] = answer.get(year, 0) + 1`,
        walkthrough: 'The group `(\\d{4})` captures the year. `group(1)` is text, so convert it with `int`. Then count with a dictionary.',
        traps: [py`answer = {}
for inv in invoices:
    year = re.match(r"(\d{4})-", inv["InvoiceDate"]).group(1)
    answer[year] = answer.get(year, 0) + 1`, py`answer = {}
for inv in invoices:
    month = int(re.match(r"\d{4}-(\d{2})", inv["InvoiceDate"]).group(1))
    answer[month] = answer.get(month, 0) + 1`],
      }),
      rx({
        title: 'Titles of numbered tracks',
        use: ['tracks'],
        given: '# tracks is a list of dictionaries with a "Name" key, for example "01 - Prowler".',
        brief: 'Some names have the form `NN - Title`. Capture the **title** part. Store in `answer` the list of the titles of the **first five** tracks that have this form, in order.',
        reference: py`answer = []
for t in tracks:
    m = re.match(r"(\d+) - (.*)", t["Name"])
    if m:
        answer.append(m.group(2))
answer = answer[:5]`,
        walkthrough: 'Group 1 holds the number and group 2 holds the title. Only names that match have a match object, so test it before you use it.',
        traps: [py`answer = []
for t in tracks:
    m = re.match(r"(\d+) - (.*)", t["Name"])
    if m:
        answer.append(m.group(1))
answer = answer[:5]`, py`answer = []
for t in tracks:
    m = re.match(r"(\d+) - (.*)", t["Name"])
    if m:
        answer.append(m.group(2))
answer = answer[-5:]`],
      }),
      rx({
        title: 'US and Canadian area codes',
        use: ['customers'],
        given: '# customers is a list of dictionaries. "Phone" is text such as "+1 (514) 721-4711", or None.',
        brief: 'For phone numbers that start with `+1 (`, capture the three-digit **area code** in the brackets. Store in `answer` the **sorted list of the different area codes**.',
        reference: py`codes = set()
for c in customers:
    m = re.match(r"\+1 \((\d{3})\)", c["Phone"] or "")
    if m:
        codes.add(m.group(1))
answer = sorted(codes)`,
        walkthrough: 'The pattern starts with the literal `+1 (` (escaped), captures three digits, and needs the closing bracket. A set removes repeats and `sorted` orders them.',
        traps: [py`codes = set()
for c in customers:
    m = re.search(r"\((\d+)\)", c["Phone"] or "")
    if m:
        codes.add(m.group(1))
answer = sorted(codes)`, py`codes = []
for c in customers:
    m = re.match(r"\+1 \((\d{3})\)", c["Phone"] or "")
    if m:
        codes.append(m.group(1))
answer = sorted(codes)`],
      }),
    ],
  },
  {
    id: 'py-regex-named-groups',
    title: 'Named groups, non-capturing groups and groupdict',
    blurb: '(?P<name>...), (?:...) and turning a match into a dictionary.',
    kind: 'code',
    practice: {
      prompt: 'Write `parse_contact(s)`. The text has the form `Name <email>`, for example `Ada Lovelace <ada@x.org>`. Return a **dictionary** with the keys `"name"` and `"email"`.\n\n- The name is everything before the `<`, **without** the spaces at its end. It has at least one character.\n- The email is the text between `<` and `>` (at least one character, no spaces).\n- The **whole** text must have this form. If it does not, return `None`.',
      starter: 'import re\n\ndef parse_contact(s):\n    ...\n',
      solution: py`import re

def parse_contact(s):
    m = re.fullmatch(r"(?P<name>[^<]*[^<\s])\s*<(?P<email>[^>\s]+)>", s)
    return m.groupdict() if m else None`,
      samples: ['parse_contact("Ada Lovelace <ada@x.org>")', 'parse_contact("no email here")'],
      cases: [
        ['A normal contact', 'parse_contact("Ada Lovelace <ada@x.org>")'],
        ['A short name', 'parse_contact("Bob <b@y.com>")'],
        ['Extra spaces before the bracket', 'parse_contact("Cy Young  <cy@z.net>")'],
        ['No email', 'parse_contact("no email here")'],
        ['No name', 'parse_contact("<a@b.c>")'],
        ['An empty email', 'parse_contact("Ann <>")'],
        ['Text after the email', 'parse_contact("Ann <a@b.c> extra")'],
        ['An empty text', 'parse_contact("")'],
      ],
      traps: [
        py`import re

def parse_contact(s):
    m = re.fullmatch(r"(?P<name>[^<]+)<(?P<email>[^>\s]+)>", s)
    return m.groupdict() if m else None`,
        py`import re

def parse_contact(s):
    m = re.fullmatch(r"(?P<name>[^<]*[^<\s])\s*<(?P<email>[^>\s]+)>", s)
    return m.groups() if m else None`,
        py`import re

def parse_contact(s):
    m = re.search(r"(?P<name>[^<]*[^<\s])\s*<(?P<email>[^>\s]+)>", s)
    return m.groupdict() if m else None`,
        py`import re

def parse_contact(s):
    m = re.fullmatch(r"(?P<name>[^<]*[^<\s])\s*<(?P<email>[^>\s]+)>", s)
    return m.groupdict()`,
      ],
    },
    real: [
      rx({
        title: 'Customers per top-level domain',
        use: ['customers'],
        hidden: 'lines = [f"{c[\'FirstName\']} {c[\'LastName\']} <{c[\'Email\']}>" for c in customers]\n',
        given: '# lines is a list of text such as "Ada Lovelace <ada@example.org>".',
        brief: 'Use a **named group** `tld` to capture the last part of the e-mail domain (the letters after the final dot, for example `com`). Store in `answer` a dictionary that maps each `tld` to the number of lines that end with it.',
        reference: py`answer = {}
for line in lines:
    m = re.search(r"\.(?P<tld>[a-z]+)>$", line)
    tld = m["tld"]
    answer[tld] = answer.get(tld, 0) + 1`,
        walkthrough: 'The pattern anchors to the closing bracket at the end of the line, so the group is the last part of the address. `m["tld"]` reads it by name.',
        traps: [py`answer = {}
for line in lines:
    m = re.search(r"@(?P<tld>[^>]+)>$", line)
    tld = m["tld"]
    answer[tld] = answer.get(tld, 0) + 1`, py`answer = {}
for line in lines:
    m = re.search(r"\.(?P<tld>[a-z]+)>$", line)
    tld = m["tld"]
    answer[tld] = 1`],
      }),
      rx({
        title: 'Second-half invoices per year',
        use: ['invoices'],
        given: '# invoices is a list of dictionaries. "InvoiceDate" is text such as "2009-01-01 00:00:00".',
        brief: 'Use named groups `year` and `month`. Count the invoices dated in **July to December** (month 7 to 12), for each year. Store in `answer` a dictionary from the year (an **integer**) to the count.',
        reference: py`answer = {}
for inv in invoices:
    m = re.match(r"(?P<year>\d{4})-(?P<month>\d{2})", inv["InvoiceDate"])
    if int(m["month"]) >= 7:
        year = int(m["year"])
        answer[year] = answer.get(year, 0) + 1`,
        walkthrough: 'The named groups make the code readable: `m["month"]` is clearly the month. Convert both to integers before comparing and using them as keys.',
        traps: [py`answer = {}
for inv in invoices:
    m = re.match(r"(?P<year>\d{4})-(?P<month>\d{2})", inv["InvoiceDate"])
    if int(m["month"]) > 7:
        year = int(m["year"])
        answer[year] = answer.get(year, 0) + 1`, py`answer = {}
for inv in invoices:
    m = re.match(r"(?P<year>\d{4})-(?P<month>\d{2})", inv["InvoiceDate"])
    if int(m["month"]) < 7:
        year = int(m["year"])
        answer[year] = answer.get(year, 0) + 1`],
      }),
      rx({
        title: 'Phones by country code',
        use: ['customers'],
        given: '# customers is a list of dictionaries. "Phone" is text such as "+55 (12) 3923-5555", or None.',
        brief: 'Use a named group `country` to capture the digits after the `+`. Store in `answer` a dictionary from the country code (text) to the number of customers with that code. Skip customers without a `Phone`.',
        reference: py`answer = {}
for c in customers:
    m = re.match(r"\+(?P<country>\d+)", c["Phone"] or "")
    if m:
        answer[m["country"]] = answer.get(m["country"], 0) + 1`,
        walkthrough: 'The group matches every digit after the plus sign, so `+1`, `+55` and `+420` are each captured whole. A missing phone gives no match, so the test protects the code.',
        traps: [py`answer = {}
for c in customers:
    m = re.match(r"\+(?P<country>\d)", c["Phone"] or "")
    if m:
        answer[m["country"]] = answer.get(m["country"], 0) + 1`, py`answer = {}
for c in customers:
    m = re.match(r"\+(?P<country>\d+)", c["Phone"] or "")
    if m:
        answer[m["country"]] = 1`],
      }),
    ],
  },
]
