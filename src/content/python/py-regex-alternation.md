Sometimes text can take one of several forms: "cat or dog", "Mr, Mrs or Ms", "a date with dashes or slashes". The pipe `|` lets you list alternatives, and parentheses limit how far the choice reaches. This lesson shows how to choose, group and order alternatives correctly.

You will learn:

- how the `|` operator works
- why alternation has the lowest precedence
- how to group with parentheses
- how the order of alternatives changes the match
- optional groups

## The pipe

`a|b` matches `a` **or** `b`:

```python
import re

print(re.findall(r"cat|dog", "a cat and a dog and a bird"))
print(re.findall(r"gr(?:a|e)y", "gray grey"))
```

You can list as many alternatives as you like: `red|green|blue`.

## Lowest precedence

The pipe has the **lowest** priority of all operators. It splits the pattern into two complete halves. So this pattern:

```python
print(re.findall(r"^cat|dog$", "cat is here, dog is here"))
```

means "`^cat` **or** `dog$`". It is not "either cat or dog, from the start to the end". This trips up many people. To restrict the choice, put it inside parentheses:

```python
print(re.fullmatch(r"cat|dog", "cat") is not None)
print(re.search(r"^(cat|dog)$", "dog") is not None)
print(re.search(r"^(cat|dog)$", "dog food"))
```

The same applies to boundaries. The pattern `\bcat|dog\b` is *not* "the whole word cat or dog". Write `\b(?:cat|dog)\b`.

```python
print(re.findall(r"\bcat|dog\b", "concatenate dogs cat"))
print(re.findall(r"\b(?:cat|dog)\b", "concatenate dogs cat"))
```

## Grouping

Parentheses do two jobs: they **group** parts and they **capture** what matched (the next lessons use capturing). When you only want to group, write `(?:...)`, a **non-capturing group**:

```python
print(re.findall(r"(?:Mr|Mrs|Ms)\.? [A-Z][a-z]+", "Mr Smith, Mrs. Jones and Ms Lee"))
```

The `\.?` makes the dot after the title optional.

## The order of alternatives

The engine tries alternatives **from left to right** and takes the **first** one that lets the whole pattern match. That means the order can change the result:

```python
print(re.findall(r"cat|category", "category cat"))
print(re.findall(r"category|cat", "category cat"))
```

In the first, `cat` wins in the word `category`, and leaves `egory` behind. In the second, the longer word is tried first. When alternatives start the same way, list the **longer ones first**.

If the alternatives are followed by more pattern, the engine backtracks and the shorter one can still work:

```python
print(re.findall(r"(?:cat|category)s?\b", "categorys cats"))
```

## Alternation with anchors

To check that a whole text is one of the options, use `fullmatch`, or wrap the choices:

```python
titles = re.compile(r"(?:mr|mrs|ms|dr)\.?", re.IGNORECASE)
for text in ["Mr", "MRS.", "dr.", "prof", "Mrsx"]:
    print(text, bool(titles.fullmatch(text)))
```

The `re.IGNORECASE` flag ignores case. You learn all flags in a later lesson.

## Optional groups

A `?` after a group makes the whole group optional. This is the way to write "a date, optionally followed by a time":

```python
pattern = r"\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2})?"
print(re.findall(pattern, "2024-03-15 and 2024-03-16 08:30"))
```

The group `(?: \d{2}:\d{2})?` is either there, whole, or not there at all.

## Alternation versus a class

For **single characters**, a class is shorter and faster than alternation. `[abc]` and `a|b|c` are equal, but only the class reads well:

```python
print(re.findall(r"[abc]", "cab"))
print(re.findall(r"a|b|c", "cab"))
```

Use alternation for **words and longer pieces**, and a class for single characters.

## Common mistakes

- Writing `^a|b$` when you mean `^(a|b)$`.
- Listing a short alternative before a longer one that starts the same way.
- Using a capturing group when a non-capturing group would do, and getting extra results from `findall`.
- Using `a|b|c` instead of `[abc]`.

## Recap

- `a|b` matches either side. It has the lowest precedence, so group it with parentheses.
- `(?:...)` groups without capturing.
- The engine tries alternatives left to right, so put longer alternatives first.
- `(...)?` makes a whole group optional.

## Your turn

In the **Practice** tab you write `is_title(s)`, which recognises titles such as `Mr.` or `dr`. Then three challenges use the Chinook store.
