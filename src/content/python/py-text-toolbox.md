In Foundations you learned to slice, search and change text with the everyday string methods. Real text is messier: it has extra spaces, odd separators, values that contain the separator itself, and long lines. This lesson adds the tools you need to take text apart and put it back together without surprises.

You will learn:

- `split` with a limit, `rsplit` and `partition` for splitting in exactly one place
- `splitlines` for text that has many lines
- `strip` with a set of characters
- `translate` and `maketrans` for replacing many characters at once
- `join` with a generator
- `textwrap` for wrapping and shortening long text

## split() and split(" ") are different

Called with no argument, `split()` splits on **any run of whitespace** and drops empty pieces. Called with `" "`, it splits on **every single space**, so extra spaces create empty pieces:

```python
line = "red   green blue"
print(line.split())
print(line.split(" "))
```

Unless you truly need to keep the empty pieces, use `split()` with no argument.

## Splitting in one place only

Sometimes a separator appears more than once, but you only want to cut at the first one. `split` accepts a second argument, `maxsplit`, the largest number of cuts:

```python
entry = "url=https://example.com/?a=1"
print(entry.split("=", 1))
```

`rsplit` does the same, but counts from the **right**. It is handy for a file name like `report.final.csv`, where only the last dot matters:

```python
name = "report.final.csv"
print(name.rsplit(".", 1))
```

## partition: the safe version

`partition(sep)` always returns **three** pieces: the text before the first separator, the separator itself, and the text after. If the separator is missing, you get the whole text and two empty strings, with no error:

```python
print("key=value=more".partition("="))
print("nothing here".partition("="))
```

That makes it easy to test for the separator, because the middle piece is empty when it was not found:

```python
key, sep, value = "colour=blue".partition("=")
if sep:
    print(key, "->", value)
```

`rpartition` works from the right.

## Text with many lines

`splitlines()` splits at every kind of line break and does not leave an empty piece at the end:

```python
text = "first\nsecond\r\nthird\n"
print(text.splitlines())
print(text.split("\n"))
```

Compare the two results. The `split("\n")` version keeps a stray empty string, and it leaves a `\r` behind.

## strip with characters

`strip()` removes whitespace at both ends. Given an argument, it removes **any of those characters**, in any order, from both ends. It does not remove a whole word:

```python
print("--title--".strip("-"))
print("  (hello)  ".strip().strip("()"))
print("xxabcxx".strip("x"))
print("www.example.com".lstrip("w."))
```

Notice the last line. `lstrip("w.")` removes any run of `w` and `.` characters from the left. To remove a *prefix* as a whole, use `removeprefix` and `removesuffix`:

```python
print("www.example.com".removeprefix("www."))
print("report.csv".removesuffix(".csv"))
```

## translate: replace many characters at once

`str.maketrans` builds a table that maps characters to replacements. `translate` applies it in a single pass:

```python
table = str.maketrans({"a": "4", "e": "3", "o": "0"})
print("leetspeak".translate(table))
```

You can also delete characters by mapping them to `None`, or build the table from two strings of equal length, plus a string of characters to delete:

```python
digits_only = str.maketrans("", "", " -()+")
print("+1 (555) 010-2030".translate(digits_only))
```

## join with a generator

`sep.join(items)` accepts any iterable of strings, including a generator expression. Convert non-text items first:

```python
numbers = [3, 14, 15, 92]
print(", ".join(str(n) for n in numbers))
print("".join(ch for ch in "a1b2c3" if ch.isalpha()))
```

## textwrap: long text

The standard `textwrap` module wraps text to a given width, shortens it with a placeholder, and removes common indentation:

```python
import textwrap

story = "Python was created by Guido van Rossum and first released in 1991."
print(textwrap.fill(story, width=30))
print(textwrap.shorten(story, width=30, placeholder="..."))
```

`shorten` cuts at a word boundary, so the result never breaks a word in half.

## Putting it together

Here is a small parser for a settings string. It uses `split`, `partition` and `strip` together, and it copes with blanks and with values that contain `=`:

```python
def parse(settings):
    result = {}
    for part in settings.split(";"):
        key, sep, value = part.partition("=")
        if sep:
            result[key.strip()] = value.strip()
    return result

print(parse("mode = fast; path=/a=b;;  level=3 ;"))
```

## Common mistakes

- Using `split(" ")` and getting empty strings from repeated spaces.
- Using `split("=")` when the value may also contain `=`. Use `partition` or `maxsplit`.
- Thinking `strip("abc")` removes the word `abc`. It removes the characters `a`, `b` and `c`.
- Forgetting that strings are immutable. Every one of these methods returns a **new** string.

## Recap

- `split()` with no argument handles any whitespace. `split(sep, n)` and `rsplit(sep, n)` limit the number of cuts.
- `partition` and `rpartition` always give three pieces and never raise an error.
- `splitlines()` is the right way to break text into lines.
- `strip(chars)` removes characters, while `removeprefix` and `removesuffix` remove a whole piece.
- `translate` with `maketrans` replaces or deletes many characters in one pass, and `textwrap` wraps and shortens text.

## Your turn

In the **Practice** tab you write `parse_pairs(s)`, which turns a text of `key=value` pairs into a dictionary. Then you meet three challenges on the Chinook store.
