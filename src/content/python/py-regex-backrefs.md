A regular expression can look **back** at text it has already matched, and require the same text again. This is called a **backreference**. It lets you find doubled words, repeated letters and matching quote marks, which no pattern with only classes and quantifiers can do.

You will learn:

- how `\1`, `\2` and `(?P=name)` refer back to a group
- finding doubled words
- matching quotes that must pair up
- conditional patterns, briefly
- why backreferences can be slow

## A group can be matched again

After a group has matched, `\1` means "the exact same text that group matched". Compare these two patterns:

```python
import re

print(re.findall(r"(\w)\w*\1", "abca hello noon xyz"))
print(re.findall(r"(\w)\1", "aabbcd xx yz"))
```

The second pattern finds a character followed by itself (`aa`, `bb`, `xx`), so it captures the repeated letters. The first finds words that start and end with the same letter.

Compare it with `\w\w`, which matches any two word characters. With `\1`, the second character **must be the same** as the first.

## Doubled words

A classic proofreading task is finding a word that appears twice in a row:

```python
text = "This is is a test of the the system"
pattern = r"\b(\w+)\s+\1\b"
print([m.group(1) for m in re.finditer(pattern, text)])
```

The pattern reads: a word boundary, a word captured in group 1, white space, the same word again, a word boundary. The final `\b` stops it from matching `the theory`, where the second word only *begins* with the first.

To ignore case, add the flag. The backreference then compares case-insensitively:

```python
print(re.findall(r"\b(\w+)\s+\1\b", "Is is fine", re.IGNORECASE))
```

## Named backreferences

For a named group, refer back with `(?P=name)`:

```python
print(re.findall(r"\b(?P<word>\w+)\s+(?P=word)\b", text))
```

Some people find `(?P=word)` easier to read than `\1`, especially when a pattern has many groups.

## Matching paired quotes

A string can be written with single or with double quotes, but the closing quote must match the opening one. A backreference solves it:

```python
line = """say "hello there" and 'goodbye' or "it's fine" """
pattern = r"""(["'])(.*?)\1"""
for m in re.finditer(pattern, line):
    print(m.group(2))
```

The first group captures the opening quote. The lazy `.*?` takes the text, and `\1` requires the **same** kind of quote to close. That is why `"it's fine"` is read as one string, and the apostrophe inside does not end it.

## Backreferences are not just for words

Any group can be repeated. Here is a check for a repeated three-letter block, like `abcabc`:

```python
print(re.fullmatch(r"(\w{3})\1", "abcabc") is not None)
print(re.fullmatch(r"(\w{3})\1", "abcabd") is not None)
```

And HTML-like tags must open and close with the same name:

```python
print(re.findall(r"<(\w+)>(.*?)</\1>", "<b>bold</b> <i>it</i> <b>x</i>"))
```

The last piece `<b>x</i>` is not matched, because the closing tag does not repeat `b`.

## Conditional patterns

Regex can even check "if group 1 matched, then require this, else require that". The syntax is `(?(1)yes|no)`. A common use is optional brackets that must pair up:

```python
pattern = r"(\()?\d+(?(1)\))"
for text in ["(42)", "42", "(42", "42)"]:
    print(text, bool(re.fullmatch(pattern, text)))
```

Read it as: an optional opening bracket (group 1), digits, and then, **if** group 1 matched, a closing bracket. This is rarely needed. Mostly you will recognise it in someone else's code.

## Performance

Backreferences make the engine's job harder, because the pattern to compare with is only known at run time. Some patterns with several backreferences can get very slow on long text. If your task can be done another way, such as a `Counter` for repeated words, that is often faster and clearer:

```python
from collections import Counter

words = re.findall(r"\w+", "the cat and the hat and the bat".lower())
print([w for w, n in Counter(words).items() if n > 1])
```

## Common mistakes

- Counting groups wrongly, and writing `\2` when you meant `\1`.
- Forgetting the boundaries, so `\b(\w+)\s+\1` also matches `the theory`.
- Writing `\1` in a normal (not raw) string, where it becomes an unprintable character.
- Using a backreference to a group that never took part in the match.

## Recap

- `\1`, `\2` and `(?P=name)` match the same text again.
- They find doubled words, repeated blocks, paired quotes and matching tags.
- `(?(1)yes|no)` is a conditional, and rarely needed.
- They can be slow, so use another tool when you can.

## Your turn

In the **Practice** tab you write `first_repeat(s)`, which returns the first word that appears twice in a row. Then three challenges use the Chinook store.
