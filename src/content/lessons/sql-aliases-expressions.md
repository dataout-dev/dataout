## Columns can be calculations

A column in `SELECT` doesn't have to be a stored value. It can be a **calculation** built from stored values.

| name     | price |
| -------- | ----- |
| Notebook | 40    |
| Pen      | 10.5  |
| Backpack | 150   |

```sql
SELECT name, price * 2
FROM products;
```

SQL does arithmetic with `+`, `-`, `*` and `/`. The result works, but the column heading would be the ugly text `price * 2`.

## Naming a result with AS

`AS` gives a column a readable name, called an **alias**:

```sql
SELECT name, price * 2 AS double_price
FROM products;
```

| name     | double_price |
| -------- | ------------ |
| Notebook | 80           |
| Pen      | 21           |
| Backpack | 300          |

An alias exists only in the result. Nothing is renamed in the table.

## Rounding

Calculations can produce long decimals. `ROUND(value, digits)` tidies them:

```sql
SELECT name, ROUND(price * 1.18, 2) AS price_with_gst
FROM products;
```

`ROUND(x, 2)` keeps two decimal places; `ROUND(x)` rounds to a whole number.

## Watch out: whole-number division

When **both** numbers are whole, SQLite throws away the remainder:

```sql
SELECT 7 / 2;      -- 3, not 3.5
SELECT 7 / 2.0;    -- 3.5
```

If you need a decimal answer, make one side a decimal (`2.0`, not `2`). This is one of the most common silent bugs in SQL.

## Keep in mind

- A calculation involving `NULL` (a missing value) gives `NULL`.
- Use short, clear alias names with no spaces: `price_with_gst`, not `Price With GST`.
