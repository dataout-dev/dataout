The simplest pattern is just ordinary text. The pattern `cat` matches the text `cat`. What makes regex powerful is that a few characters have a **special meaning**. This lesson introduces these special characters, called **metacharacters**, and shows how to match them literally when you need to.

You will learn:

- how a pattern made of plain letters behaves
- the list of metacharacters
- how to escape a metacharacter with a backslash
- `re.escape` for text that comes from a user
- why raw strings matter so much

## Literal characters

Letters, digits and most symbols match themselves:

```python
import re

print(re.search(r"cat", "the cat sat"))
print(re.search(r"cat", "the dog sat"))
print(re.findall(r"at", "cat sat on the mat"))
```

Matching is **case-sensitive** by default, so `cat` does not match `Cat`. Later you learn a flag to change that.

## The metacharacters

These characters are special:

```text
.  ^  $  *  +  ?  {  }  [  ]  \  |  (  )
```

Each one has a job, and you will learn them all in this section. The first one to know is the **dot**. It matches **any one character** except a new line:

```python
print(re.findall(r"c.t", "cat cot c9t ct cart"))
```

The pattern `c.t` matches `c`, then any one character, then `t`. That is why `cat`, `cot` and `c9t` match, but `ct` (no middle character) and `cart` (two characters) do not.

## Escaping with a backslash

What if you want to match a real dot? A backslash in front of a metacharacter **escapes** it, and makes it literal:

```python
text = "version 3.14 or 3x14"
print(re.findall(r"3.14", text))
print(re.findall(r"3\.14", text))
```

The unescaped dot matched the `x` too. The escaped `\.` matches only a true dot. The same works for all the others:

```python
print(re.findall(r"\(\d+\)", "call (555) or (12)"))
print(re.findall(r"\$\d+", "cost $30 and $5"))
print(re.findall(r"1\+1", "1+1=2 and 11"))
print(re.findall(r"a\|b", "a|b or a or b"))
```

Inside `\(\d+\)` the parentheses are literal, and `\d+` still means digits.

## The backslash plague

There is a trap. Python strings also use backslash as an escape, so `"\n"` is a new line. If you write patterns as ordinary strings, backslashes get processed **twice**:

```python
print(len("\\."), len(r"\."))
print(re.findall("\\.", "a.b"))
print(re.findall(r"\.", "a.b"))
```

Both find the dot, but the first is confusing to read. Worse, some sequences are quietly changed before the regex engine sees them:

```python
print(len("\b"), len(r"\b"))
```

In a normal string, `"\b"` is a single **backspace** character, but in a raw string `r"\b"` is two characters, the regex word boundary. **Always write patterns as raw strings.**

## Escaping text from a user

Suppose you search for whatever the user typed. The text may contain metacharacters that change the meaning of your pattern. `re.escape` adds the backslashes for you:

```python
user_text = "3.14 (approx)"
safe = re.escape(user_text)
print(safe)
print(re.search(safe, "pi is 3.14 (approx) here") is not None)
print(re.search(safe, "pi is 3x14 (approx) here"))
```

If you only need to find fixed text, `in` is simpler. `re.escape` is for when you build a bigger pattern around user text.

```python
word = "c++"
print(re.findall(r"\b" + re.escape(word) + r"\b", "I like c++ and c"))
```

## Matching special characters, one more time

To match characters that have a special role in the pattern, escape each of them:

| To match | Write |
| -------- | ----- |
| a dot | `\.` |
| a question mark | `\?` |
| a plus sign | `\+` |
| a star | `\*` |
| brackets | `\(` `\)` `\[` `\]` `\{` `\}` |
| a backslash | `\\` |
| a dollar or caret | `\$` `\^` |

```python
print(re.findall(r"\?", "who? what? where"))
print(re.findall(r"\\", r"C:\temp\file"))
```

Some characters, like `-`, `,` and `/`, do not need escaping outside of special places. If you are unsure, escaping a punctuation character is always safe.

## Common mistakes

- Forgetting to escape the dot in something like `3.14`, `file.txt` or `example.com`.
- Writing patterns without the raw prefix and having `\b` silently mean something else.
- Building a pattern from user text without `re.escape`.
- Escaping letters by accident: `\d` is a digit class, but `\y` is an error in modern Python.

## Recap

- Plain characters match themselves. Metacharacters (`. ^ $ * + ? { } [ ] \ | ( )`) have special meanings.
- `.` matches any single character except a new line.
- A backslash makes a metacharacter literal.
- Use raw strings, and `re.escape` for text you did not write.

## Your turn

In the **Practice** tab you write `has_dot_digit(s)`. Then three challenges use track names from the Chinook store.
