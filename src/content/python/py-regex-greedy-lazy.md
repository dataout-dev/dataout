Quantifiers such as `*` and `+` have a hidden habit: they take **as much as they can**. This is called being **greedy**, and it is the source of many regex surprises. This lesson explains greedy, lazy and possessive matching, and shows how the regex engine actually works.

You will learn:

- what greedy matching means, with the classic tag example
- lazy quantifiers: `*?`, `+?`, `??`, `{m,n}?`
- how backtracking works, step by step
- possessive quantifiers and atomic groups (Python 3.11 and later)
- how to avoid matching across delimiters

## Greedy by default

Consider text with two tags, and a pattern that finds "an angle bracket, anything, an angle bracket":

```python
import re

html = "<b>bold</b> and <i>italic</i>"
print(re.findall(r"<.*>", html))
```

You might expect four matches, one per tag. Instead there is **one** match that covers almost everything. The `.*` grabbed as many characters as possible, right to the end of the text, and then gave back only enough to let the final `>` match.

## Lazy quantifiers

Adding `?` after a quantifier makes it **lazy**: it takes as **few** characters as possible.

| Greedy | Lazy |
| ------ | ---- |
| `*` | `*?` |
| `+` | `+?` |
| `?` | `??` |
| `{m,n}` | `{m,n}?` |

```python
print(re.findall(r"<.*?>", html))
print(re.findall(r"<b>(.*?)</b>", html))
```

The lazy `.*?` stops at the **first** `>` that lets the whole pattern match. Now each tag is found separately.

## The question mark means two things

Do not confuse the two roles of `?`:

- After a character, class or group, it means "optional".
- After a **quantifier** (`*`, `+`, `?`, `{...}`), it means "lazy".

```python
print(re.findall(r"ab?", "abbb"))
print(re.findall(r"ab+?", "abbb"))
print(re.findall(r"ab+", "abbb"))
```

## A different fix: exclude the delimiter

A lazy quantifier is one fix. Often a more precise one is to say what the text **may not contain**. A negated class does that, and it is also faster:

```python
print(re.findall(r"<[^>]*>", html))
print(re.findall(r"<b>([^<]*)</b>", html))
```

`[^>]*` means "any number of characters that are not a closing bracket". It cannot run across a delimiter, so there is no need for laziness.

## How backtracking works

The regex engine tries the pattern from left to right. When a part **fails**, the engine goes back to an earlier choice, and tries another way. This is called **backtracking**.

Let us trace `<.*>` on the text `<a>b`:

1. `<` matches the first character.
2. `.*` greedily takes everything left: `a>b`.
3. Now `>` must match, but the text has ended. **Fail.**
4. Backtrack: `.*` gives back `b`. Then `>` must match `b`. **Fail.**
5. Backtrack again: `.*` gives back `>`. Then `>` matches. **Success**, with `<a>` as the match.

With the lazy `<.*?>`, the order is reversed. `.*?` takes nothing at first, checks `>`, then takes one character at a time until `>` fits. That is why lazy matching stops at the first closing bracket.

Both find *a* match, but they pick different ones. Greedy prefers the **longest** for each part, and lazy prefers the **shortest**.

## Backtracking has a cost

Most patterns backtrack a little, and it is not noticeable. Some patterns backtrack an enormous number of times, and that can freeze a program. That is a later lesson. The point to remember now: patterns that let the engine choose "how much" many times over can be slow, and **being specific** (such as `[^>]*` above) is a cheap way to avoid the problem.

## Possessive quantifiers and atomic groups

Python 3.11 added two tools that **forbid backtracking**:

- A **possessive quantifier** adds `+` after the quantifier: `*+`, `++`, `?+`. It takes as much as it can and never gives anything back.
- An **atomic group** `(?>...)` matches its content once and then commits to it.

```python
print(re.fullmatch(r"a*a", "aaa") is not None)
print(re.fullmatch(r"a*+a", "aaa") is not None)
print(re.fullmatch(r"(?>a*)a", "aaa") is not None)
```

The greedy `a*` gives up one `a` so the final `a` can match. The possessive `a*+` refuses to give anything back, so the final `a` has nothing to match, and the whole match fails. That looks strange, but it is useful. When you *know* the engine should not go back, a possessive quantifier saves time, and it makes failing matches fail quickly.

## Choosing between them

- Use the **default (greedy)** when the rest of the pattern limits the match.
- Use **lazy** when you want the shortest text between two markers.
- Prefer a **negated class** when the end marker is a single character.
- Use **possessive or atomic** for performance on patterns you know should not backtrack.

## Common mistakes

- Using `.*` between delimiters that appear more than once on a line.
- Reaching for `.*?` when `[^"]*` would be clearer and faster.
- Forgetting that `.` does not match a new line, so a lazy `.*?` does not cross lines unless you use the DOTALL flag.
- Using possessive quantifiers without testing them, because they change what matches.

## Recap

- Quantifiers are greedy by default and take as much as they can.
- Add `?` for lazy: `*?`, `+?`, `??`, `{m,n}?`.
- Backtracking is how the engine recovers from a failed attempt.
- A negated class such as `[^>]*` often beats a lazy quantifier.
- Possessive quantifiers `*+` and atomic groups `(?>...)` disable backtracking.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
