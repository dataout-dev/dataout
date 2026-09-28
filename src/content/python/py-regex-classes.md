The dot matches any character, which is often too much. A **character class** lets you say exactly which characters are allowed at one position: "a vowel", "a digit", "a letter or an underscore". This lesson covers classes, ranges and the handy shorthands.

You will learn:

- how to write a class with `[...]`
- ranges such as `a-z`
- negated classes with `[^...]`
- the shorthands `\d`, `\w`, `\s` and their opposites
- what changes inside a class, and the position of `-` and `^`

## A set of characters

Square brackets match **one** character from the list inside:

```python
import re

print(re.findall(r"[aeiou]", "regular expressions"))
print(re.findall(r"gr[ae]y", "grey gray gruy"))
```

The pattern `gr[ae]y` means: `g`, `r`, then either `a` or `e`, then `y`.

## Ranges

Inside a class, `a-z` means every letter from `a` to `z`. You can put several ranges and single characters together:

```python
print(re.findall(r"[a-z]+", "abc DEF ghi"))
print(re.findall(r"[A-Za-z]+", "abc DEF ghi"))
print(re.findall(r"[0-9a-f]+", "ff 0a zz 19"))
```

Here `+` means "one or more" (you learn it fully in the next lesson). Without it, each match would be a single character.

## Negated classes

A caret **at the start** of a class turns it around: the class matches any character that is **not** in the list:

```python
print(re.findall(r"[^aeiou ]+", "regular expressions"))
print(re.findall(r"[^0-9]+", "ab12cd345"))
```

A negated class also matches a new line, unless you list it. That is a common surprise.

## Shorthand classes

Some classes are used so often that they have short names:

| Shorthand | Meaning | Same as |
| --------- | ------- | ------- |
| `\d` | a digit | `[0-9]` |
| `\D` | not a digit | `[^0-9]` |
| `\w` | a "word" character: letter, digit or underscore | `[A-Za-z0-9_]` |
| `\W` | not a word character | |
| `\s` | white space: space, tab, new line and similar | |
| `\S` | not white space | |

```python
text = "Order #66: 3 items, total 19.99"
print(re.findall(r"\d+", text))
print(re.findall(r"\w+", text))
print(re.findall(r"\S+", text))
print(re.findall(r"\s", "a b\tc\nd"))
```

In Python 3, `\w` and `\d` are **Unicode-aware** for text, so `\w` also matches letters such as `é` and `ß`, and `\d` matches digits from other scripts. Use `[0-9]` when you need only ASCII digits, or the `re.ASCII` flag.

```python
print(re.findall(r"\w+", "café naïve"))
print(re.findall(r"[a-z]+", "café naïve"))
```

## The dot again

The dot `.` is a class too: everything except the new line. Use it when you truly do not care about the character:

```python
print(re.findall(r"\d.\d", "1-2 3x4 56"))
```

## Special characters inside a class

Most metacharacters lose their special meaning **inside** `[...]`. A dot is just a dot, and `+` is just a plus:

```python
print(re.findall(r"[.+*]", "a.b+c*d"))
```

Only a few characters are still special inside a class:

- `^` is special **at the start** (it negates). Anywhere else it is literal.
- `-` is special **between** two characters (a range). At the very start or very end, it is literal.
- `]` ends the class. Put it first, or escape it as `\]`.
- `\` still escapes.

```python
print(re.findall(r"[a-]", "a-b"))
print(re.findall(r"[-a]", "a-b"))
print(re.findall(r"[a^]", "a^b"))
print(re.findall(r"[\]]", "a]b"))
```

You can also use shorthands inside a class. `[\w.-]+` means "word characters, dots and hyphens", which is a common shape for file names:

```python
print(re.findall(r"[\w.-]+", "report-1.final.csv and notes_2.txt"))
```

## Combining classes

A pattern is a sequence of parts, and each part matches at its own position. This pattern matches "a letter, a digit, a letter":

```python
print(re.findall(r"[A-Za-z]\d[A-Za-z]", "a1b 22 c3 D4e"))
```

Postal codes in many countries follow shapes like this. Canadian codes look like `K1A 0B1`:

```python
print(re.findall(r"[A-Z]\d[A-Z] \d[A-Z]\d", "Send to K1A 0B1 or V6B 4Y8, not 12345"))
```

## Common mistakes

- Writing `[a-Z]`. The range must go from the lower to the higher code, so use `[a-zA-Z]`.
- Putting a `-` between two characters by accident, which makes an unintended range.
- Forgetting that `\w` includes the underscore and, in Python 3, non-English letters.
- Expecting `[^abc]` to fail on a new line. It matches it.

## Recap

- `[abc]` matches one of the listed characters. `[a-z]` is a range. `[^abc]` is anything else.
- `\d`, `\w`, `\s` and their capitals (`\D`, `\W`, `\S`) are shorthand classes.
- Inside a class, most characters are literal. Watch `^`, `-`, `]` and `\`.
- Without a quantifier, a class matches exactly one character.

## Your turn

In the **Practice** tab you write `words(s)`, which returns the words made only of letters and apostrophes. Then three challenges use the Chinook store.
