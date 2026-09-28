This is the last lesson of the regular expression course. It is a **workshop**: a guided project that uses everything you have learned, on the kind of messy data you will meet in real work. You will clean names, phone numbers and dates, extract fields from semi-structured text, and write tests for your patterns.

You will learn:

- a method for cleaning messy data step by step
- how to keep patterns as named, documented pieces
- how to test patterns with a table of good and bad examples
- how to report what could not be cleaned

## The messy data

Imagine a contact list typed by many people. Nothing is consistent:

```python
raw = [
    "  ada LOVELACE ,  +44 (0)20 7946 0958 , Ada@Example.ORG ",
    "Grace Hopper;555.010.9999;grace.hopper@navy.mil",
    "alan turing | 5550101234 | alan@bletchley",
    "Katherine  Johnson,  (555) 010-4242 ,kjohnson@nasa.gov",
]
```

The separators differ (commas, semicolons, pipes), so does the case, and phone numbers use every layout. The goal is a clean record for each line: a proper name, digits-only phone number, lower-case e-mail, or a clear report of what is wrong.

## Step 1: split each line into three fields

The separators are a comma, a semicolon or a pipe, with optional spaces. One `re.split` call handles all of them:

```python
import re

SEPARATOR = re.compile(r"\s*[,;|]\s*")
parts = [SEPARATOR.split(line.strip()) for line in raw]
for p in parts:
    print(p)
```

Each line now has three parts: name, phone, e-mail. Splitting first, and cleaning each field separately, is much easier than one giant pattern.

## Step 2: clean the name

Collapse the extra spaces, and capitalise each word. Careful: `str.title()` breaks names like `O'Reilly`, but it works for this data.

```python
def clean_name(name):
    words = re.split(r"\s+", name.strip())
    return " ".join(word.capitalize() for word in words)

print([clean_name(p[0]) for p in parts])
```

## Step 3: clean the phone number

Keep the digits only. Then check the result has a **plausible length**: between 7 and 15 digits. If not, report it:

```python
def clean_phone(text):
    digits = re.sub(r"\D", "", text)
    if not 7 <= len(digits) <= 15:
        return None
    return digits

print([clean_phone(p[1]) for p in parts])
```

Note that the first phone number contains `(0)`, which is a trunk prefix that produces an extra `0`. A real system needs a rule for this. Data cleaning is often about **deciding rules**, and recording them.

## Step 4: clean the e-mail

Lower-case it, and check the rough shape. Use a verbose pattern with a comment for every part:

```python
EMAIL = re.compile(
    r"""
    [\w.+-]+          # the part before the @
    @
    [\w-]+            # the first part of the domain
    (?:\.[\w-]+)+     # at least one more part, like .org or .co.uk
    """,
    re.VERBOSE,
)

def clean_email(text):
    text = text.strip().lower()
    return text if EMAIL.fullmatch(text) else None

print([clean_email(p[2]) for p in parts])
```

The last e-mail, `alan@bletchley`, has no dot in the domain, so it is rejected. That is the intended result of the rule.

## Step 5: put it together, with a rejects list

A good cleaning function never silently drops data. It returns the records that worked, and the rows that did not, with the reason:

```python
def clean_contacts(lines):
    good, rejects = [], []
    for line in lines:
        fields = SEPARATOR.split(line.strip())
        if len(fields) != 3:
            rejects.append((line, "expected 3 fields"))
            continue
        name, phone, email = fields
        record = {"name": clean_name(name), "phone": clean_phone(phone), "email": clean_email(email)}
        problems = [key for key, value in record.items() if value is None]
        if problems:
            rejects.append((line, "bad " + ", ".join(problems)))
        else:
            good.append(record)
    return good, rejects

good, rejects = clean_contacts(raw)
print(len(good), "clean;", len(rejects), "rejected")
for line, why in rejects:
    print(why, "<-", line.strip())
```

## Step 6: test your patterns

Patterns need tests as much as any code. A small table of examples, with the expected answer, catches mistakes when you change a pattern later:

```python
email_cases = [
    ("ada@example.org", True),
    ("a.b+c@x.co.uk", True),
    ("no-at.com", False),
    ("a@b", False),
    ("two@@x.org", False),
]
for text, expected in email_cases:
    assert bool(EMAIL.fullmatch(text)) == expected, text
print("all", len(email_cases), "email cases pass")
```

Put good and bad examples in the table. A pattern that has only been shown texts it *should* match has not really been tested.

## Documenting

For every pattern you keep, write down:

1. **What it accepts** and **what it rejects**, in a sentence.
2. **Where the rules came from** (a standard, a data sample, a decision).
3. A few **example texts**, in a test.

## Common mistakes

- Trying to clean a whole line with one enormous pattern instead of splitting it into fields first.
- Silently discarding rows that fail. Report them.
- Changing a pattern without a test table to catch regressions.
- Rejecting valid data because the pattern is too strict for real names or addresses.

## Recap

- Split into fields first, and clean each field with its own small function.
- Write patterns as named, commented pieces (`re.VERBOSE`).
- Return the good records and a list of rejects with reasons.
- Keep a table of tests for your patterns, with both matching and non-matching cases.

## Your turn

In the **Practice** tab you write `clean_contacts(lines)`. Then three challenges clean the Chinook customer data.
