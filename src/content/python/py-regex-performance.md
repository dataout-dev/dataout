Most regular expressions run in a blink. A few can take **minutes, hours or forever** on a text of only a few dozen characters. This is called **catastrophic backtracking**, and it has brought down real websites. This lesson explains why it happens, how to spot the dangerous shapes, and how to debug and speed up your patterns.

You will learn:

- how a harmless-looking pattern can explode
- what ReDoS is, and why it matters
- how to time patterns safely
- ways to fix a slow pattern
- how to debug with `re.DEBUG` and small tests
- what the third-party `regex` module adds

## How backtracking can explode

Recall that the engine tries a choice and, if the rest fails, goes back and tries another. A pattern where the *same text can be matched in many different ways* forces the engine to try all of them before it can say "no match".

The classic example is a nested quantifier:

```python
import re
import time

def timed(pattern, text):
    start = time.perf_counter()
    result = re.match(pattern, text)
    return bool(result), time.perf_counter() - start

for n in (10, 14, 18, 20):
    text = "a" * n + "!"
    found, seconds = timed(r"(a+)+$", text)
    print(n, found, "slow" if seconds > 0.05 else "fast")
```

The pattern `(a+)+$` on the text `aaaa...!` has to try every way of splitting the `a` characters between the inner and outer plus. There are roughly `2^n` ways. Each extra `a` **doubles** the time. Only a handful of extra characters turns a fraction of a second into an hour. (We keep `n` small here so that the page stays responsive.)

## The dangerous shapes

The danger comes from a repeated group whose inside can match the same text in more than one way:

- **Nested quantifiers**: `(a+)+`, `(a*)*`, `(\w+\s*)*`
- **Overlapping alternatives** inside a repeat: `(a|aa)+`, `(\d|\d\d)+`
- **Adjacent overlapping parts**: `\d+\d+`, `.*.*.*`

```python
for pattern in [r"(a|aa)+$", r"^\d+\d+$"]:
    for n in (14, 18):
        found, seconds = timed(pattern, "1" * n + "x" if "d" in pattern else "a" * n + "!")
        print(f"{pattern:10} n={n}", "slow" if seconds > 0.02 else "fast")
```

## ReDoS

**ReDoS** (regular expression denial of service) is an attack. Someone sends a specially built text to a website whose validation pattern has one of these shapes, and the server spends all its time on that one request. Because it takes only a small input to cause a huge delay, this has taken down large websites.

The lessons for you:

- **Never** accept a **pattern** from a user and run it on your server.
- Be careful running your own pattern on **untrusted, long** text.
- Limit the size of the text before matching.

## Fixing a slow pattern

**1. Remove the ambiguity.** Say exactly what each part matches, so there is only one way to match:

```python
fast = r"a+$"
found, seconds = timed(fast, "a" * 5000 + "!")
print(found, "fast" if seconds < 0.5 else "slow")
```

`a+$` means the same as `(a+)+$` (for whole runs of `a`), but with no nesting there is only one way to match it.

**2. Use specific classes.** `[^"]*` instead of `.*"`. The engine cannot run past the quote, so it never needs to back up over it.

**3. Use possessive quantifiers or atomic groups** (Python 3.11 and later) when you know that backtracking cannot help:

```python
found, seconds = timed(r"(?>a+)+$", "a" * 5000 + "!")
print(found, "fast" if seconds < 0.5 else "slow")
```

**4. Anchor the pattern** so it fails fast when the start is wrong.

**5. Do not use a regex at all.** A simple `str.isdigit()` or `split` beats a pattern that can misbehave.

## Timing your patterns

Use `time.perf_counter` or the `timeit` module, and try at least one **long non-matching** text. Slow patterns are usually slowest when they *fail*, so test the failure case:

```python
import timeit

pattern = re.compile(r"[a-z]+@[a-z]+\.com")
seconds = timeit.timeit(lambda: pattern.search("x" * 100), number=200)
print(seconds < 1)
```

## Debugging a pattern

Build the pattern in small steps, testing after each step. The flag `re.DEBUG` prints how the engine understands the pattern, which is a good check that the parentheses group as you meant:

```python
re.compile(r"(a|b)+c", re.DEBUG)
```

Also print what you actually matched: `m.group()`, `m.span()` and `m.groups()` will show you at once when a pattern grabbed too much.

## The regex module

The third-party module **`regex`** (installed with pip, not part of the standard library) is a drop-in extension of `re`. It adds Unicode properties (`\p{L}` for "any letter"), variable-length lookbehind, fuzzy matching, recursive patterns and more. Nearly all `re` patterns work unchanged.

```python
print("regex is optional; re is enough for this course")
```

## Common mistakes

- Nesting quantifiers, like `(\w+)*`.
- Testing a pattern only on inputs that match.
- Running user-provided patterns.
- Using `.*` where a specific class would do.

## Recap

- Patterns where one text can be matched in many ways can take exponential time. That is catastrophic backtracking.
- ReDoS is the attack that abuses it. Never run untrusted patterns, and limit the size of untrusted text.
- Fix it by removing ambiguity, using specific classes, possessive or atomic groups, and anchors.
- Test the **failing** case, and time your patterns.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
