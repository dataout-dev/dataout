## Giving missing values a default

`NULL` is honest, but it makes reports ugly and calculations awkward. `COALESCE` replaces `NULL` with something more useful.

| name   | phone  | email              |
| ------ | ------ | ------------------ |
| Asha   | 98200  | *NULL*             |
| Ben    | *NULL* | ben@example.com    |
| Chitra | 98111  | chitra@example.com |
| Dev    | *NULL* | *NULL*             |

## COALESCE

`COALESCE(a, b, c, ...)` returns the **first argument that is not `NULL`**:

```sql
SELECT name,
       COALESCE(phone, email, 'none') AS contact
FROM contacts;
```

| name   | contact            |
| ------ | ------------------ |
| Asha   | 98200              |
| Ben    | ben@example.com    |
| Chitra | 98111              |
| Dev    | none               |

Read it left to right as a chain of fallbacks: try the phone, then the email, then the text `'none'`. Chitra has both, and the phone wins because it comes first.

## Common uses

- **Default labels:** `COALESCE(category, 'Uncategorised')`
- **Zero instead of missing in maths:** `COALESCE(discount, 0)`. Otherwise `price - NULL` is `NULL`.
- **Choosing between columns:** the example above.

## NULLIF: the opposite

`NULLIF(a, b)` returns `NULL` when the two values are equal, and `a` otherwise. Its classic use is avoiding a divide-by-zero error:

```sql
SELECT total / NULLIF(count, 0) FROM stats;
```

If `count` is `0`, the divisor becomes `NULL`, and the result is `NULL` instead of an error.

## Keep in mind

- The **order of arguments** is the order of preference. Swap them and you change the answer.
- All the arguments should be the same kind of value, or you'll get surprising conversions.
- `COALESCE` changes only the **result**. It doesn't update the table.
