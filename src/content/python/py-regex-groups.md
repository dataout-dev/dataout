Finding text is only half the job. Usually you want the **pieces** of it: the year, month and day of a date, or the name and the number in a line. **Capturing groups** remember the part of the match inside parentheses, and **match objects** let you read them.

You will learn:

- how parentheses capture text
- `group`, `groups`, `start`, `end` and `span`
- how groups are numbered, including nested ones
- what happens with groups that did not take part
- the way `findall` changes when a pattern has groups

## Capturing with parentheses

Put parentheses around the part you want to keep:

```python
import re

m = re.search(r"(\d{4})-(\d{2})-(\d{2})", "Paid on 2024-03-15.")
print(m.group())
print(m.group(1), m.group(2), m.group(3))
print(m.groups())
```

`group()` (or `group(0)`) is the **whole match**. `group(1)` is the text of the first pair of parentheses, and so on. `groups()` returns all the captured groups as a tuple.

You can convert the pieces as you use them:

```python
year, month, day = (int(part) for part in m.groups())
print(year + 1, month, day)
```

## Numbering

Groups are numbered by the position of their **opening** parenthesis, counted from the left. With nested groups, the outer one comes first:

```python
m = re.search(r"((\d+)-(\d+)) (\w+)", "10-20 items")
print(m.group(1))
print(m.group(2), m.group(3))
print(m.group(4))
print(m.groups())
```

## Positions

A match object knows where the match is in the text:

```python
m = re.search(r"(\d+)", "abc 123 def")
print(m.start(), m.end(), m.span())
print(m.start(1), m.end(1), m.span(1))
```

That is useful for highlighting, or for replacing part of a string by slicing.

## Groups that did not take part

A group can be inside an optional part. If it is not used, its value is `None`:

```python
m = re.search(r"(\d+)(?:\.(\d+))?", "version 3")
print(m.groups())
m = re.search(r"(\d+)(?:\.(\d+))?", "version 3.14")
print(m.groups())
```

`group` also accepts a default for these cases through `groups(default)`:

```python
print(re.search(r"(\d+)(?:\.(\d+))?", "version 3").groups("0"))
```

## When there is no match

`search` returns `None` when it fails, and `None` has no `group`. Always check before you use the result:

```python
m = re.search(r"(\d+)-(\d+)", "no numbers here")
if m:
    print(m.group(1))
else:
    print("no match")
```

Forgetting the check gives an error that beginners meet very often: `AttributeError: 'NoneType' object has no attribute 'group'`. Python 3.8 and later has a handy way to test and use the match in one line:

```python
if m := re.search(r"(\d+)-(\d+)", "range 5-9"):
    print(int(m.group(2)) - int(m.group(1)))
```

## findall and groups

The result of `re.findall` **depends on the number of groups** in the pattern:

- No groups: a list of the whole matches.
- One group: a list of the text of that group.
- Several groups: a list of **tuples**, one item per group.

```python
text = "a1 b2 c3"
print(re.findall(r"[a-z]\d", text))
print(re.findall(r"[a-z](\d)", text))
print(re.findall(r"([a-z])(\d)", text))
```

If you only want to group, and not capture, use `(?:...)`. Otherwise `findall` gives you unexpected pieces. To get whole match objects, use `finditer`:

```python
for m in re.finditer(r"([a-z])(\d)", text):
    print(m.group(), m.groups(), m.span())
```

## Using a group result

A typical job: read a "key: value" line.

```python
line = "  Name :  Ada Lovelace "
m = re.fullmatch(r"\s*(\w+)\s*:\s*(.*?)\s*", line)
print(m.groups())
```

The `\s*` parts absorb the extra spaces, so the groups hold clean text. The lazy `.*?` followed by `\s*` keeps the trailing spaces out of the value.

## Common mistakes

- Calling `.group()` on `None` because the search failed.
- Counting groups by closing parentheses. Count the **opening** ones.
- Using `findall` with several groups and expecting whole matches.
- Forgetting that groups that did not take part are `None`, not empty text.

## Recap

- Parentheses capture. `group(0)` is the whole match, and `group(n)` is the n-th group.
- `groups()` returns all of them, `span()` gives positions, and unused groups are `None`.
- `findall` returns whole matches, single groups or tuples, depending on the pattern. `finditer` gives match objects.
- Always test for `None` after `search`, `match` or `fullmatch`.

## Your turn

In the **Practice** tab you write `parse_date(s)`, which extracts year, month and day. Then three challenges use the Chinook store.
