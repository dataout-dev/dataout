A **flag** changes how a whole pattern behaves. There are flags for ignoring case, for making `^` and `$` work on every line, for letting the dot match new lines, and, most useful of all for maintainable code, for writing patterns over several lines with comments. This lesson covers all of them.

You will learn:

- `re.IGNORECASE`, `re.MULTILINE`, `re.DOTALL`, `re.ASCII`
- inline flags such as `(?i)`, and scoped flags such as `(?i:...)`
- `re.VERBOSE` for readable patterns with comments
- how to combine flags
- a common pitfall about white space in verbose mode

## The flags

| Flag | Short | Effect |
| ---- | ----- | ------ |
| `re.IGNORECASE` | `re.I` | ignore case |
| `re.MULTILINE` | `re.M` | `^` and `$` match at each line |
| `re.DOTALL` | `re.S` | `.` also matches a new line |
| `re.VERBOSE` | `re.X` | allow white space and comments in the pattern |
| `re.ASCII` | `re.A` | `\w`, `\d`, `\s` and `\b` use only ASCII |
| `re.UNICODE` | `re.U` | Unicode behaviour (already the default for text) |

## Ignoring case

```python
import re

print(re.findall(r"python", "Python PYTHON python"))
print(re.findall(r"python", "Python PYTHON python", re.IGNORECASE))
```

## Every line

Without `re.MULTILINE`, `^` and `$` see only the start and end of the whole text:

```python
text = "first line\nsecond line\nthird line"
print(re.findall(r"^\w+", text))
print(re.findall(r"^\w+", text, re.MULTILINE))
print(re.findall(r"\w+$", text, re.M))
```

## The dot and new lines

By default, `.` matches everything **except** a new line. With `re.DOTALL`, it matches new lines too, so `.*` can run across lines:

```python
block = "start\nmiddle\nend"
print(re.findall(r"start.*end", block))
print(re.findall(r"start.*end", block, re.DOTALL))
```

## ASCII versus Unicode

In Python 3, `\w`, `\d` and `\b` understand all scripts. With `re.ASCII`, they use only ASCII letters and digits:

```python
print(re.findall(r"\w+", "naïve café"))
print(re.findall(r"\w+", "naïve café", re.ASCII))
```

## Combining flags

Combine flags with the `|` operator:

```python
print(re.findall(r"^error.*$", "ERROR one\nok\nerror two", re.I | re.M))
```

## Inline flags

You can put a flag **inside** the pattern, which is handy when you cannot pass a `flags` argument, for example in a configuration file:

```python
print(re.findall(r"(?i)python", "Python PYTHON"))
print(re.findall(r"(?im)^error", "Error 1\nok\nERROR 2"))
```

An inline flag at the start applies to the whole pattern. You can also **scope** a flag to a part of the pattern with `(?i:...)`, and switch it off with `(?-i:...)`:

```python
print(re.findall(r"(?i:hello) World", "HELLO World, hello world"))
```

Only the word `hello` ignores case. `World` still has to match exactly.

## Verbose patterns

Long patterns are unreadable. With `re.VERBOSE`, the engine **ignores** white space and lets you write `#` comments, so you can lay a pattern out in parts:

```python
phone = re.compile(
    r"""
    \(?          # optional opening bracket
    (\d{3})      # area code
    \)?          # optional closing bracket
    [\s.-]?      # a separator: space, dot or dash
    (\d{3})      # exchange
    [\s.-]?      # separator
    (\d{4})      # number
    """,
    re.VERBOSE,
)

for text in ["(555) 123-4567", "555.123.4567", "5551234567"]:
    print(phone.search(text).groups())
```

Comments explain **why** each part is there, and each part can be changed on its own line. Good regex code in real projects nearly always looks like this.

## White space in verbose mode

Because the engine ignores white space, a **literal** space must be escaped or placed in a class. A `#` that you mean literally needs escaping too:

```python
pattern = re.compile(r"hello\ world  # a literal space, escaped", re.X)
print(bool(pattern.fullmatch("hello world")))
pattern = re.compile(r"hello[ ]world", re.X)
print(bool(pattern.fullmatch("hello world")))
```

Forgetting this is a very common bug: the pattern `hello world` in verbose mode means `helloworld`.

## Common mistakes

- Passing a flag as the third argument of `sub` (that is `count`). Use `flags=`.
- Forgetting `re.MULTILINE` when working with several lines.
- Forgetting to escape a space or `#` in verbose mode.
- Putting an inline flag in the middle of a pattern. In current Python it must be at the start, or scoped like `(?i:...)`.

## Recap

- `re.I`, `re.M`, `re.S`, `re.X` and `re.A` change how a pattern behaves. Combine them with `|`.
- Inline flags `(?i)` and scoped flags `(?i:...)` do the same inside the pattern.
- `re.VERBOSE` lets you lay out a pattern over several lines with comments.
- In verbose mode, escape a literal space or `#`.

## Your turn

In the **Practice** tab you write a verbose pattern for phone numbers in `phone_digits(s)`. Then three challenges use the Chinook store.
