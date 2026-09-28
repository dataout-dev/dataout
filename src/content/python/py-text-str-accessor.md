The `.str` accessor runs ordinary string operations across an entire column at once, and handles missing values gracefully — no need to check for `NaN` before calling a string method yourself.

You will learn:

- `str.lower`, `strip`, `split`, `contains`, `extract`, `replace`, `len`
- how `.str` handles `NaN` automatically
- combining `.str` with real regular expressions

## The basics

```python
import pandas as pd

s = pd.Series(["  Ada  ", "GRACE", "Alan"])
print(s.str.strip())
print(s.str.lower())
print(s.str.len())
```

Every `.str` method returns a new Series, the same length as the original, one result per row.

## contains and extract

```python
import pandas as pd

s = pd.Series(["error: disk full", "ok", "error: timeout"])
print(s.str.contains("error"))
print(s.str.extract(r"error: (.+)"))
```

`.str.contains` treats its argument as a **regular expression by default** (not a plain substring), which matters the moment your search text contains a character like `.` or `(` that regex treats specially. `.str.extract` pulls out the text matched by a capture group `(...)`, returning `NaN` for rows where the pattern does not match at all.

## Watch out: contains treats the pattern as a regex

```python
import pandas as pd

s = pd.Series(["3.14", "3x14", "2.71"])
print(s.str.contains("3.14"))
```

Here `.` in the pattern means "any character", so `"3x14"` matches too — probably not intended. Pass `regex=False` for a literal substring search, or escape the special characters (`re.escape(...)`, or a raw string with `\.`) when you do want a regex but need a literal dot.

## replace

```python
import pandas as pd

s = pd.Series(["cat", "hat", "bat"])
print(s.str.replace("at", "og", regex=False))
print(s.str.replace(r"^.at$", "match", regex=True))
```

`.str.replace` also defaults to treating the pattern as a regex; `regex=False` switches to a literal substring replace.

## split

```python
import pandas as pd

s = pd.Series(["Ada Lovelace", "Grace Hopper"])
print(s.str.split(" "))
print(s.str.split(" ", expand=True))
```

Without `expand=True`, each row becomes a list; with it, the pieces spread out into separate columns.

## How NaN passes through

```python
import pandas as pd

s = pd.Series(["Hello", None, "World"])
print(s.str.upper())
print(s.str.contains("ell"))
```

A missing entry stays missing through almost every `.str` method — no error, and no need for you to filter it out first.

## Common mistakes

- Forgetting that `.str.contains`/`.str.replace` treat their pattern as regex by default, and being surprised when `.`, `(`, or `*` behave specially.
- Writing a capture group in `.str.extract` and forgetting it returns `NaN` (not an error) when the pattern simply does not match a row.
- Assuming `.str.split(" ")` always produces the same number of pieces per row when using `expand=True` on genuinely uneven text.
- Calling a plain Python string method (like `s.lower()`) directly on a Series, instead of going through `.str`.

## Recap

- `.str` methods run across a whole column at once and pass `NaN` through safely.
- `.contains`/`.replace`/`.extract` treat their pattern as a regex by default; use `regex=False` for a literal match.
- `.extract` returns `NaN` for a row where the pattern does not match.
- `.split(..., expand=True)` spreads pieces into separate columns.

## Your turn

In the **Practice** tab you write `add_feature_col(df)`, extracting a featured artist from a title. Then three challenges use real data.
