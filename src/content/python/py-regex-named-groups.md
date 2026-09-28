Numbered groups get hard to follow when a pattern grows. Is `group(4)` the year or the area code? **Named groups** give each captured part a name, so your code reads like the data. This lesson also covers non-capturing groups and the `groupdict` method, which turns a match into a dictionary in one step.

You will learn:

- how to name a group with `(?P<name>...)`
- how to read groups by name and with `groupdict()`
- non-capturing groups `(?:...)` and why they matter
- `lastgroup` and `lastindex`
- rules to keep patterns readable

## Named groups

Write `?P<name>` right after the opening parenthesis:

```python
import re

pattern = r"(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})"
m = re.search(pattern, "Paid on 2024-03-15.")
print(m.group("year"), m.group("month"), m.group("day"))
print(m["year"], m[2])
```

A named group is still numbered too, so `m.group(1)` also works. A match object also supports `m["name"]` as a shortcut.

## groupdict

`groupdict()` returns a dictionary of every **named** group. It is the quickest way to make a record from text:

```python
print(m.groupdict())
record = {key: int(value) for key, value in m.groupdict().items()}
print(record)
```

## A name-and-email example

Here is a pattern with three named parts, and a check on the result:

```python
line = "Ada Lovelace <ada@example.org>"
pattern = r"(?P<name>[^<]+?)\s*<(?P<email>[^>]+)>"
m = re.fullmatch(pattern, line)
if m:
    print(m.groupdict())
```

The parts are: a name of any characters except `<` (lazily, so that spaces before the `<` are not included), optional white space, then an address between angle brackets. Notice how the code for reading the result does not depend on group numbers.

## Non-capturing groups

When you need a group only to apply a quantifier or an alternation, write `(?:...)`. It groups **without** creating a numbered group:

```python
print(re.findall(r"(?:Mr|Mrs) (\w+)", "Mr Smith and Mrs Jones"))
print(re.findall(r"(Mr|Mrs) (\w+)", "Mr Smith and Mrs Jones"))
```

With capturing groups everywhere, your group numbers get shifted every time you add a bracket. Keep captures for the parts you want to **use**.

## Optional named groups

Named groups that do not take part are `None` in the dictionary:

```python
pattern = r"(?P<number>\d+)(?:\.(?P<decimal>\d+))?"
print(re.fullmatch(pattern, "42").groupdict())
print(re.fullmatch(pattern, "42.5").groupdict())
```

You can supply a default for those with `groupdict(default)`:

```python
print(re.fullmatch(pattern, "42").groupdict(default="0"))
```

## lastgroup and lastindex

When a pattern is made of several alternatives, each in its own group, `lastgroup` tells you which one matched. It is how simple tokenisers are built:

```python
token = re.compile(r"(?P<number>\d+)|(?P<word>[a-z]+)|(?P<space>\s+)|(?P<other>.)")
for m in token.finditer("go 42 now!"):
    if m.lastgroup != "space":
        print(m.lastgroup, repr(m.group()))
```

`lastindex` gives the number of the group that matched last. Both return `None` when there are no groups.

## Group names must be unique

Every name can be used only once in a pattern. Reusing a name is an error:

<!-- expect-error -->
```python
re.compile(r"(?P<x>a)(?P<x>b)")
```

If you need the same shape twice, give the groups different names, such as `start_year` and `end_year`.

## Using names in replacements and repeats

The `sub` function (next lessons) can refer to groups by name with `\g<name>`. A pattern can refer back to one of its own named groups with `(?P=name)`:

```python
print(re.sub(r"(?P<first>\w+) (?P<last>\w+)", r"\g<last>, \g<first>", "Ada Lovelace"))
print(re.findall(r"(?P<w>\w+) (?P=w)", "it is is a a test"))
```

The second pattern finds a word that is followed by **itself**. This is the subject of the next lesson.

## Keeping patterns readable

- Name every group you plan to use in code. Skip names for throwaway groups.
- Use non-capturing groups for everything else.
- Read results with `groupdict()` when you build a record.
- If the pattern is long, split it into named pieces and join them with Python, or use verbose mode (a later lesson).

```python
number = r"\d+"
date = rf"(?P<y>{number})-(?P<m>{number})-(?P<d>{number})"
print(re.fullmatch(date, "2024-3-5").groupdict())
```

## Common mistakes

- Forgetting the `P` in `(?P<name>...)`. Python needs it.
- Using the same group name twice.
- Using a capturing group where you only wanted grouping, and having `findall` return extra data.
- Assuming a named group always has a value. Optional ones can be `None`.

## Recap

- `(?P<name>...)` names a group. Read it with `m["name"]`, `m.group("name")` or `m.groupdict()`.
- `(?:...)` groups without capturing.
- Unused groups are `None` unless you give a default.
- `lastgroup` shows which alternative matched.

## Your turn

In the **Practice** tab you write `parse_contact(s)`, which turns a line into a dictionary with `name` and `email`. Then three challenges use the Chinook store.
