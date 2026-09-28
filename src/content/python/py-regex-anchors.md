A pattern normally matches anywhere in the text. **Anchors** and **boundaries** pin the match to a position: the start of the text, the end, a line boundary, or the edge of a word. They do not match characters. They match a *position between* characters. Used well, they turn a loose search into a strict check.

You will learn:

- `^` and `$`, and how the MULTILINE flag changes them
- `\A` and `\Z`, the strict anchors
- `\b` and `\B` for word boundaries
- the difference between `match`, `search` and `fullmatch`
- the surprising new line before `$`

## Start and end of the text

`^` matches at the **start** of the text, and `$` matches at the **end**:

```python
import re

print(re.search(r"^cat", "cat on a mat"))
print(re.search(r"^cat", "the cat"))
print(re.search(r"mat$", "cat on a mat") is not None)
print(re.search(r"mat$", "a mat is here"))
```

Together they make a whole-string test. The pattern `^\d+$` says "the whole text is digits":

```python
print(bool(re.search(r"^\d+$", "12345")))
print(bool(re.search(r"^\d+$", "123a45")))
```

## MULTILINE: every line

By default, `^` and `$` look at the whole text. With the `re.MULTILINE` flag (or `re.M`), they match at the start and end of **each line**:

```python
text = "apple pie\nbanana split\napple tart"
print(re.findall(r"^apple.*", text))
print(re.findall(r"^apple.*", text, re.M))
print(re.findall(r"\w+$", text, re.M))
```

Use it when you work with text that has many lines, such as a log file.

## \A and \Z: always the whole text

`\A` matches only at the very start of the text, and `\Z` only at the very end. Unlike `^` and `$`, they **never** change with flags:

```python
print(re.findall(r"^\w+", text, re.M))
print(re.findall(r"\A\w+", text, re.M))
```

## The new line before $

Here is a well-known surprise. `$` matches at the end of the text **and also just before a final new line**:

```python
print(re.search(r"^\d+$", "123\n") is not None)
print(re.search(r"\A\d+\Z", "123\n") is not None)
```

The first result is `True`, which is often not what you want when you validate input. `\Z` is stricter. Even better, the next section shows a function that does the whole-string check for you.

## match, search and fullmatch

The three functions differ only in **where** the match must be:

| Function | The pattern must match |
| -------- | ---------------------- |
| `re.search` | anywhere in the text |
| `re.match` | at the **start** (like an implicit `^`) |
| `re.fullmatch` | the **whole** text (like an implicit `^...\Z`) |

```python
pattern = r"\d+"
for text in ["123", "123abc", "abc123"]:
    print(text, bool(re.match(pattern, text)), bool(re.search(pattern, text)), bool(re.fullmatch(pattern, text)))
```

`fullmatch` is the best tool for **validation**, because you do not need to write anchors at all.

## Word boundaries: \b

`\b` matches the **boundary between a word character and a non-word character** (or the edge of the text). It lets you find whole words:

```python
text = "the glove is a love story"
print(re.findall(r"love", text))
print(re.findall(r"\blove\b", text))
```

The first search also matched the `love` inside `glove`. The second only matches the whole word. `\B` is the opposite: it matches where there is **no** boundary:

```python
print(re.findall(r"\Bove", text))
```

Boundaries also solve the problem from the quantifier lesson: to match a number of exactly three digits, mark both sides.

```python
print(re.findall(r"\b\d{3}\b", "12 123 1234 456"))
```

## \b is special inside a class

There is one trap. Inside a character class, `\b` is a **backspace** character, not a boundary. Do not use `\b` between `[` and `]`.

```python
print(re.findall(r"[\b]", "a\bb"))
```

## Anchors do not consume characters

Anchors and boundaries match a *position*, not a character. When `\bcat\b` matches `cat`, the boundaries add nothing to the match text:

```python
m = re.search(r"\bcat\b", "the cat sat")
print(m.group(), m.span())
```

That is why they are called **zero-width**. The idea returns later with lookahead and lookbehind.

## Common mistakes

- Using `re.match` and expecting it to search the whole text.
- Forgetting `re.M` when you want `^` and `$` to work for each line.
- Validating with `^...$` and accepting text with a trailing new line. Use `fullmatch` instead.
- Searching for a short word without `\b` and finding it inside longer words.

## Recap

- `^` and `$` anchor to the start and end (per line with `re.M`). `\A` and `\Z` always mean the whole text.
- `search` looks anywhere, `match` at the start, `fullmatch` needs the whole text.
- `\b` is a word boundary, and `\B` is its opposite.
- Anchors match positions, not characters.

## Your turn

In the **Practice** tab you write `is_identifier(s)`, which checks a whole string. Then three challenges use the Chinook store.
