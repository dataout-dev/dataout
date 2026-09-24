## Shorter ways to write common conditions

Two conditions come up so often that SQL gives them their own keywords.

| name  | category | price |
| ----- | -------- | ----- |
| Atlas | Books    | 100   |
| Novel | Books    | 250   |
| Robot | Toys     | 650   |
| Lamp  | Home     | 300   |

## IN: match a list

Instead of a chain of `OR`s:

```sql
WHERE category = 'Books' OR category = 'Toys' OR category = 'Home'
```

write:

```sql
WHERE category IN ('Books', 'Toys', 'Home')
```

Same result, easier to read and to edit. `NOT IN` matches everything **except** the listed values.

## BETWEEN: match a range

```sql
SELECT name, price
FROM products
WHERE price BETWEEN 100 AND 300;
```

| name  | price |
| ----- | ----- |
| Atlas | 100   |
| Novel | 250   |
| Lamp  | 300   |

`BETWEEN` **includes both ends**. It is exactly `price >= 100 AND price <= 300`. Atlas (100) and Lamp (300) are both in.

## Combining them

```sql
WHERE category IN ('Books', 'Toys')
  AND price BETWEEN 100 AND 500
```

## Keep in mind

- `BETWEEN 100 AND 300` needs the smaller number first. `BETWEEN 300 AND 100` matches nothing.
- Works on text and dates too: `order_date BETWEEN '2024-01-01' AND '2024-01-31'`.
- If you want to **exclude** an end, go back to `>` and `<`.
