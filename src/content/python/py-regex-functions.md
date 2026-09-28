You have met the pieces of the pattern language. Now let us look at the tools that *use* a pattern: `match`, `search`, `fullmatch`, `findall` and `finditer`, and compiled patterns. Choosing the right function for the job avoids most beginner mistakes.

You will learn:

- which function to use for which job
- what each returns
- compiled patterns and when they help
- `pos` and `endpos`
- scanning with `finditer` and `span`

## Which function?

| You want to... | Use |
| -------------- | --- |
| know if the **whole** text has the shape | `fullmatch` |
| know if the text **starts** with the shape | `match` |
| find the **first** occurrence | `search` |
| get **every** occurrence as strings | `findall` |
| get every occurrence with its **position** and groups | `finditer` |

```python
import re

text = "ids: 17, 42 and 99"
print(re.search(r"\d+", text))
print(re.match(r"\d+", text))
print(re.fullmatch(r"\d+", "17"))
print(re.findall(r"\d+", text))
```

## Match objects versus lists

`search`, `match` and `fullmatch` return **one match object** or `None`. `findall` returns a **list of strings** (or tuples). `finditer` returns an **iterator of match objects**. Match objects carry more information: positions and all the groups.

```python
for m in re.finditer(r"\d+", text):
    print(m.group(), m.start(), m.end())
```

Use `findall` for a quick list of strings, and `finditer` when you need positions or groups.

## match only looks at the start

`re.match` is the function beginners get wrong most often. It succeeds only when the pattern matches at the **beginning** of the text:

```python
print(re.match(r"\d+", "abc 123"))
print(re.search(r"\d+", "abc 123"))
```

If you mean "anywhere", use `search`. If you mean "the whole text", use `fullmatch`. Reserve `match` for tokenisers and parsers that read from the start.

## Compiled patterns

`re.compile` turns a pattern into an object that has all the same functions as methods:

```python
number = re.compile(r"\d+")
print(number.search("abc 12"))
print(number.findall("1 22 333"))
print(number.fullmatch("4567") is not None)
```

Compiling has two benefits. You give the pattern **a name**, and it is built **once**. Python caches recently used patterns anyway, so the speed difference is small, but a named, compiled pattern at the top of a module is a good habit for anything you use often.

## pos and endpos

A compiled pattern's methods can search only part of the text, with `pos` (where to start) and `endpos` (where to stop):

```python
number = re.compile(r"\d+")
text = "12 34 56 78"
print(number.findall(text, 3))
print(number.findall(text, 3, 8))
```

Note that `^` still means the real start of the text, not `pos`. That is a subtle detail, and it is also why `match(text, pos)` is a good tool for scanners: it can match *at* a position.

## Scanning with spans

`finditer` and `span` let you mark up text without changing it. Here we underline every number:

```python
text = "cost 30 or 45"
marks = [" "] * len(text)
for m in re.finditer(r"\d+", text):
    for i in range(*m.span()):
        marks[i] = "^"
print(text)
print("".join(marks))
```

## All start positions, including overlaps

A normal search never overlaps: after a match, the next search continues **after** it. To find every start position, even overlapping ones, use a lookahead:

```python
def all_starts(pattern, text):
    return [m.start() for m in re.finditer(f"(?={pattern})", text)]

print(all_starts("aa", "aaaa"))
print([m.start() for m in re.finditer("aa", "aaaa")])
```

The zero-width lookahead consumes nothing, so every position is tried.

## Patterns from data

When a pattern comes from variables, combine `re.escape` and an f-string, and use `re.compile` for the result:

```python
words = ["cat", "c++", "a.b"]
pattern = re.compile("|".join(re.escape(w) for w in sorted(words, key=len, reverse=True)))
print(pattern.findall("I like cat, c++ and a.b but not axb"))
```

Sorting the alternatives from longest to shortest follows the rule from the alternation lesson.

## Common mistakes

- Using `re.match` and being surprised that it does not search.
- Forgetting that `search` returns `None` when it finds nothing.
- Using `findall` and losing the positions, when `finditer` is what you need.
- Compiling a pattern inside a loop instead of once outside it.

## Recap

- `fullmatch` for a whole-text test, `match` at the start, `search` anywhere.
- `findall` gives strings, and `finditer` gives match objects with positions.
- `re.compile` names and reuses a pattern. Its methods accept `pos` and `endpos`.
- A lookahead lets you find overlapping matches.

## Your turn

In the **Practice** tab you write `all_starts(pattern, s)`, which lists every start position, even when matches overlap. Then three challenges use the Chinook store.
