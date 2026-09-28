A **regular expression** (regex) is a small pattern language for describing text. Instead of writing loops that look at one character at a time, you describe the *shape* of the text you want, and the `re` module finds it. Regular expressions are used everywhere: editors, command-line tools, databases and almost every programming language. This section is a full course. This first lesson tells you what regex is good for, when to avoid it, and how the `re` module is organised.

You will learn:

- what a regular expression is, with a first example
- where regex shines, and where it does not
- why you should try string methods first
- the main functions of the `re` module at a glance
- how to test a pattern

## A first pattern

Suppose you want to find the digits in a sentence. Without regex you need a loop. With regex, you write the shape "one or more digits":

```python
import re

sentence = "Order 66 shipped on day 1207"
print(re.findall(r"\d+", sentence))
```

The pattern `\d+` means "one or more digits". `re.findall` returns every match as a list of strings. Do not worry about the details yet. The rest of this section teaches every piece.

## Where regex shines

Regular expressions are excellent for **text with a recognisable shape**:

- **Validation**: does this look like a postal code, a version number, a phone number?
- **Extraction**: pull dates, prices, e-mail addresses or identifiers out of longer text.
- **Cleaning**: collapse runs of spaces, remove unwanted characters, normalise formats.
- **Splitting** on complicated separators, such as "a comma, or a semicolon, or an ampersand".

## Where regex fails

Regular expressions describe **flat patterns**. They cannot properly understand **nested** structure, such as HTML, JSON or code with brackets inside brackets. For those, use a real parser:

```python
import json

print(json.loads('{"a": [1, 2, {"b": 3}]}'))
```

A regex is also a poor choice when the format is defined by a library. Do not validate e-mail addresses "perfectly" with a pattern, or parse dates with a pattern when `datetime` can do it.

## Try string methods first

If a plain string method does the job, it is simpler and faster to read. Compare:

```python
line = "error: disk full"
print(line.startswith("error"))
print("disk" in line)
print(line.split(": ", 1)[1])
print(line.replace("error", "warning"))
```

Reach for regex when the text has **variation** that the methods cannot express, such as "any number of digits", "either of these words", or "a date in one of three layouts".

## A map of the re module

Here are the functions you will use most, and what each one does. You will meet each of them in detail later:

| Function | What it does |
| -------- | ------------ |
| `re.search(p, s)` | finds the **first** match anywhere in `s` |
| `re.match(p, s)` | matches only at the **start** of `s` |
| `re.fullmatch(p, s)` | the **whole** string must match |
| `re.findall(p, s)` | a list of **all** matches |
| `re.finditer(p, s)` | an iterator of match objects |
| `re.sub(p, repl, s)` | **replaces** matches |
| `re.split(p, s)` | **splits** the text at matches |
| `re.compile(p)` | prepares a pattern for reuse |

`search`, `match` and `fullmatch` return a **match object** when they succeed and `None` when they do not:

```python
m = re.search(r"\d+", "abc 123 def")
print(m)
print(m.group())
print(re.search(r"\d+", "no digits here"))
```

A match object knows the text it found (`group()`) and where (`span()`).

```python
m = re.search(r"\d+", "abc 123 def")
print(m.span(), m.start(), m.end())
```

## Raw strings

Regex patterns are full of backslashes, and Python also uses backslashes in ordinary strings. To avoid a clash, write patterns as **raw strings** with an `r` before the quote. In a raw string, a backslash is just a backslash:

```python
print("a\tb")
print(r"a\tb")
```

You will see `r"..."` in almost every pattern in this course. Get used to writing it.

## How to test a pattern

Build patterns in small steps. Try them on a few examples, including ones that **should not** match:

```python
pattern = r"\d{3}-\d{4}"
tests = ["555-1234", "55-1234", "5551234", "call 555-1234 now"]
for text in tests:
    print(f"{text!r:22} {bool(re.search(pattern, text))}")
```

If a pattern is hard to read, that is a sign to add comments or to use another approach. You will learn the verbose mode later in the section.

## "Now you have two problems"

A famous joke says: "Some people, when confronted with a problem, think 'I know, I'll use regular expressions.' Now they have two problems." The joke has a point. A regex that is too clever becomes unreadable. This course therefore teaches regex **and** the habits that keep it maintainable: small patterns, raw strings, comments, and tests.

## Common mistakes

- Using regex where `in`, `startswith` or `split` would be clearer.
- Forgetting the `r` before the string and getting strange backslash results.
- Using `re.match` when you meant `re.search`. `match` only looks at the start.
- Trying to parse HTML or JSON with patterns.

## Recap

- A regex describes the shape of text. `re` finds, checks, extracts, replaces and splits.
- Use it for variable but recognisable text. Use string methods, or a parser, when they fit better.
- `search`, `match` and `fullmatch` return a match object or `None`. `findall` returns a list.
- Write patterns as raw strings, and test them on good and bad examples.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
