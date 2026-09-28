Sometimes you want to match text **only if** it is preceded or followed by something else, without making that something part of the match. **Lookahead** and **lookbehind** do exactly that. They are called *zero-width assertions*: they check the surroundings, but they do not consume any characters.

You will learn:

- positive and negative lookahead: `(?=...)` and `(?!...)`
- positive and negative lookbehind: `(?<=...)` and `(?<!...)`
- the fixed-width rule for lookbehind in Python
- combining lookaheads to validate passwords
- inserting thousands separators with only `re.sub`

## Positive lookahead: (?=...)

The pattern `X(?=Y)` matches `X` **only when it is followed by** `Y`. The `Y` is checked, but it is not part of the match:

```python
import re

print(re.findall(r"\w+(?=@)", "ann@site.org bob@x.com"))
print(re.findall(r"\d+(?= dollars)", "5 dollars, 7 euros, 12 dollars"))
```

The match contains only the digits, not the word `dollars`. This is convenient when you want the number but need the context to find it.

## Negative lookahead: (?!...)

`X(?!Y)` matches `X` **only when it is not followed by** `Y`:

```python
print(re.findall(r"\b\w+(?!\.)\b", "one. two three."))
print(re.findall(r"\bfoo(?!bar)\w*", "foobar foobaz food"))
```

The second pattern finds words that begin with `foo` but are not `foobar...`.

## Positive lookbehind: (?<=...)

`(?<=Y)X` matches `X` **only when it is preceded by** `Y`:

```python
print(re.findall(r"(?<=\$)\d+", "cost $30, 40 euros, $5"))
print(re.findall(r"(?<=#)\w+", "#python and #regex, not python"))
```

The first pattern finds numbers written with a dollar sign, but does not include the `$` itself in the result.

## Negative lookbehind: (?<!...)

`(?<!Y)X` matches `X` **only when it is not preceded by** `Y`:

```python
print(re.findall(r"(?<!\$)\b\d+\b", "cost $30, 40 euros, $5"))
print(re.findall(r"(?<!the )\bcat\b", "the cat and a cat"))
```

## Lookaround does not consume

This is the key idea. A normal pattern moves forward through the text as it matches. A lookaround only *peeks*. That means the same text can be examined many times, and two lookarounds can look at the same place:

```python
print(re.findall(r"(?=(\w\w))", "abcd"))
```

The empty match at each position sees the next two letters, so the result contains overlapping pairs. That is a neat trick for finding overlapping matches, which normal patterns cannot do.

## Lookbehind must be fixed width

In Python's `re`, the text inside a lookbehind must have a **fixed length**. `(?<=abc)` is fine, but `(?<=a|bc)` has branches of different lengths, and that is not allowed:

<!-- expect-error -->
```python
re.compile(r"(?<=a|bc)x")
```

You can use several lookbehinds, one per fixed length, or restructure the pattern with a capturing group. (The third-party `regex` module allows variable-length lookbehind.)

## Password rules with lookaheads

Lookaheads can be stacked at the start of a pattern. Each one checks a different rule **from the same position**. This is the standard way to write a password policy in one pattern:

```python
policy = re.compile(r"(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}")

for password in ["Abcdef12", "abcdef12", "ABCDEF12", "Abcdefgh", "Ab1"]:
    print(f"{password:10}", bool(policy.fullmatch(password)))
```

The pattern reads: "starting here, somewhere ahead there is a lower-case letter, **and** somewhere ahead there is an upper-case letter, **and** a digit, and the whole text is at least 8 characters long". Because lookaheads consume nothing, all four rules are checked from the start.

## Thousands separators

A famous example inserts commas into a number. The comma goes at every position that has **groups of exactly three digits after it**, up to the end of the digits:

```python
def add_commas(digits):
    return re.sub(r"(?<=\d)(?=(?:\d{3})+$)", ",", digits)

print(add_commas("1234567"))
print(add_commas("123"))
print(add_commas("1000"))
```

Read the pattern as: at a position that has a digit before it (`(?<=\d)`) and, after it, one or more groups of three digits up to the end (`(?=(?:\d{3})+$)`), insert a comma. The match itself is *empty*, and `sub` puts the comma there. In real code, use `format(n, ",")`. The pattern is a good exercise in reading lookarounds.

## Common mistakes

- Putting the lookahead **before** the thing it should check, so it checks the wrong place.
- Using a variable-width lookbehind.
- Forgetting that the lookaround text is **not** in the match.
- Making a lookahead like `(?=.*x)` slow on very long text.

## Recap

- `(?=...)` and `(?!...)` check what follows. `(?<=...)` and `(?<!...)` check what precedes.
- They match a position and consume nothing, so they can be stacked.
- A lookbehind needs a fixed width in Python.
- Lookaheads are the standard tool for password rules.

## Your turn

In the **Practice** tab you write `add_commas(s)`, using only `re.sub`. Then three challenges use the Chinook store.
