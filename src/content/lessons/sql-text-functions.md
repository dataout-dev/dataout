## Text is messy

Real text data has inconsistent capital letters, stray spaces, and several facts packed into one value (like an email address that contains both a name and a provider). SQL has functions to clean and slice it.

| id | email            |
| -- | ---------------- |
| 1  | Asha@Gmail.com   |
| 2  | ben@yahoo.co.in  |
| 3  | CHITRA@GMAIL.COM |

## The everyday functions

| Function | What it does | Example |
| -------- | ------------ | ------- |
| `LOWER(x)` / `UPPER(x)` | change case | `LOWER('Asha')` gives `asha` |
| `LENGTH(x)` | number of characters | `LENGTH('Asha')` gives `4` |
| `TRIM(x)` | remove spaces at both ends | `TRIM('  hi ')` gives `hi` |
| `SUBSTR(x, start, length)` | a slice of text (counting from 1) | `SUBSTR('Asha', 2, 2)` gives `sh` |
| `INSTR(x, find)` | position of `find` in `x`, or 0 | `INSTR('ben@y', '@')` gives `4` |
| `a \|\| b` | join text together | `'Hi ' \|\| name` |

## Putting them together

To get the part of an email **after** the `@`:

```sql
SELECT id,
       LOWER(SUBSTR(email, INSTR(email, '@') + 1)) AS domain
FROM users;
```

Step by step for `Asha@Gmail.com`:

1. `INSTR(email, '@')` is `5`, the position of the @.
2. `+ 1` moves to the character after it: `6`.
3. `SUBSTR(email, 6)` (with no length) takes everything from position 6 on: `Gmail.com`.
4. `LOWER` turns it into `gmail.com`.

## Why cleaning matters

If you group without `LOWER`, `Gmail.com` and `gmail.com` count as two different providers. Always normalise text before you group, compare or de-duplicate it.

## Keep in mind

- `SUBSTR` counts from **1**, not 0.
- If `INSTR` finds nothing it returns `0`, so `INSTR(x, '@') + 1` would be `1`, and you'd get the whole text back.
- Any function on `NULL` returns `NULL`.
