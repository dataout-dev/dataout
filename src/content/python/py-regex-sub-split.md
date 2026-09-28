Finding text is one thing. **Changing** it is often the goal: masking an e-mail address, normalising a phone number, or converting `snake_case` to `camelCase`. `re.sub` replaces matches, and `re.split` cuts text at matches. Both are among the most useful functions in the module.

You will learn:

- `re.sub` with a replacement string
- group references in the replacement: `\1` and `\g<name>`
- replacing with a **function**
- `count`, `flags` and `subn`
- `re.split`, including capturing groups and `maxsplit`

## re.sub

`re.sub(pattern, replacement, text)` returns a **new** string where every match is replaced:

```python
import re

print(re.sub(r"\d", "#", "call 555-1234"))
print(re.sub(r"\s+", " ", "too    many\t\tspaces"))
print(re.sub(r"[aeiou]", "", "regular expressions"))
```

The original string is unchanged, because strings are immutable. Use `count` to stop after a number of replacements:

```python
print(re.sub(r"\d", "#", "1-2-3-4", count=2))
```

## Using groups in the replacement

In the replacement text, `\1`, `\2` (and so on) stand for the captured groups. `\g<name>` refers to a named group:

```python
print(re.sub(r"(\w+) (\w+)", r"\2 \1", "Ada Lovelace"))
print(re.sub(r"(?P<y>\d{4})-(?P<m>\d{2})-(?P<d>\d{2})", r"\g<d>/\g<m>/\g<y>", "2024-03-15"))
```

Always write the replacement as a raw string. In a normal string, `"\1"` would be a control character. A backslash followed by a digit *after* a group, such as `\1` followed by `0`, needs the form `\g<1>0` to avoid `\10`:

```python
print(re.sub(r"(\d)", r"\g<1>0", "1 2"))
```

## Backslashes in the replacement

The replacement is processed: `\n` becomes a new line, `\\` becomes one backslash, and unknown escapes of letters are errors. To insert text you do not control literally, pass a **function**, which is not processed:

```python
snippet = r"C:\new"
print(re.sub(r"path", lambda m: snippet, "path"))
```

## Replacing with a function

If the replacement is a function, it is called with each **match object**, and its return value is used. This gives you the full power of Python for each replacement:

```python
def double(m):
    return str(int(m.group()) * 2)

print(re.sub(r"\d+", double, "3 apples and 10 pears"))
```

A well-known example converts `snake_case` to `camelCase`. Capture the letter after each underscore and capitalise it:

```python
def to_camel(name):
    return re.sub(r"_([a-z])", lambda m: m.group(1).upper(), name)

print(to_camel("snake_case_words"))
```

## Case and flags

You can pass `flags=` to change how the pattern behaves, for example to ignore case. Positional arguments after `count` are confusing, so **name them**:

```python
print(re.sub(r"cat", "dog", "Cat cat CAT", flags=re.IGNORECASE))
```

## subn: how many were replaced?

`re.subn` returns a tuple: the new text **and** the number of replacements:

```python
text, n = re.subn(r"\s+", " ", "a   b    c")
print(text, n)
```

## Masking sensitive text

A very common use is hiding part of a value. Here we mask everything before the `@` sign except the first letter:

```python
def mask_email(email):
    return re.sub(r"(?<=.)[^@](?=[^@]*@)", "*", email)

print(mask_email("ada.lovelace@example.org"))
```

The pattern replaces a non-`@` character that has something before it (so the first letter stays) and that is followed by more characters and then an `@`.

## re.split

`re.split(pattern, text)` cuts the text at each match, like `str.split`, but with a pattern as the separator:

```python
print(re.split(r"[,;]\s*", "a, b;c,   d"))
print(re.split(r"\s+", "  leading and trailing  "))
print(re.split(r"\d+", "ab12cd345ef"))
```

Notice that the split with `\s+` on text that starts with spaces keeps empty strings at the ends. `text.split()` would remove them, so use `.split()` for plain white space, and `re.split` for patterns.

`maxsplit` limits the number of cuts:

```python
print(re.split(r"\s+", "one two three four", maxsplit=2))
```

## Keeping the separators

If the pattern contains a **capturing group**, the separators are included in the result:

```python
print(re.split(r"([,;])", "a,b;c"))
print(re.split(r"\s*(and|&)\s*", "Ann and Bob & Cy"))
```

Use a non-capturing group `(?:...)` if you do **not** want them:

```python
print(re.split(r"\s*(?:and|&)\s*", "Ann and Bob & Cy"))
```

## Splitting on an empty match

Since Python 3.7, a pattern that can match the empty string also splits there. That can be useful, for instance to split before every capital letter:

```python
print(re.split(r"(?=[A-Z])", "splitCamelCaseText"))
```

## Common mistakes

- Forgetting that `sub` returns a new string and not using the result.
- Writing the replacement as a normal string and getting control characters from `\1`.
- Passing `flags` as the fourth positional argument, which is `count`.
- Using a capturing group in `split` by accident, and getting the separators in the result.

## Recap

- `re.sub(p, repl, text)` replaces matches. `repl` can use `\1`, `\g<name>`, or be a function.
- `count=` limits replacements, `flags=` changes behaviour and `subn` also reports how many.
- `re.split` cuts at pattern matches. Capturing groups keep the separators, and `maxsplit` limits the cuts.

## Your turn

In the **Practice** tab you write `to_camel(s)` with `re.sub`. Then three challenges use the Chinook store.
