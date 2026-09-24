## What is NULL?

Sometimes a value is simply **unknown**: a customer who didn't give an email, a penguin nobody could weigh. SQL stores that as `NULL`.

| id | name   | email              |
| -- | ------ | ------------------ |
| 1  | Asha   | asha@example.com   |
| 2  | Ben    | *NULL*             |
| 3  | Chitra | chitra@example.com |

`NULL` is **not** zero, and **not** an empty string. It means "we don't know".

## The trap: = NULL never works

You might try:

```sql
SELECT name FROM customers WHERE email = NULL;   -- returns nothing!
```

Comparing anything to an unknown value gives "unknown", not "true", and `WHERE` only keeps rows where the condition is true. Even `NULL = NULL` is unknown.

## The right way: IS NULL

```sql
SELECT name FROM customers WHERE email IS NULL;       -- Ben
SELECT name FROM customers WHERE email IS NOT NULL;   -- Asha, Chitra
```

`IS NULL` and `IS NOT NULL` are the only tests that work on missing values.

## NULL spreads

- `5 + NULL` is `NULL`.
- `NULL > 3` is unknown, so a `WHERE salary > 3` filter silently drops rows where `salary` is missing.
- `COUNT(email)` counts only rows where `email` is **not** `NULL`, while `COUNT(*)` counts every row.

## Keep in mind

- When a filter returns fewer rows than you expected, ask: is there a `NULL` in that column?
- Missing values are normal in real data. Checking for them is usually the first thing an analyst does.
- Later you'll meet `COALESCE`, which swaps a `NULL` for a default value.
