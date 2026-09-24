## Dates in SQLite

Most databases have a special date type. SQLite doesn't: it stores dates as **text** in the ISO format `YYYY-MM-DD` (or `YYYY-MM-DD HH:MM:SS`). It works well because that format has a useful property: sorted alphabetically, it is also sorted by time.

| id | order_date | amount |
| -- | ---------- | ------ |
| 1  | 2024-01-05 | 100    |
| 2  | 2024-01-20 | 50     |
| 3  | 2024-02-11 | 70     |

## Comparing dates

Because of that property, ordinary comparisons work:

```sql
SELECT * FROM orders
WHERE order_date >= '2024-01-15';
```

```sql
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31'
```

For "a whole month" it is safer to use `>= first day` and `< first day of next month`, because dates with a time part (`2024-01-31 14:00:00`) sort after `'2024-01-31'`.

## Pulling out parts with strftime

`strftime(format, date)` extracts pieces:

| Code | Meaning |
| ---- | ------- |
| `%Y` | year, like `2024` |
| `%m` | month, `01` to `12` |
| `%d` | day of the month |
| `%w` | weekday, `0` is Sunday |

```sql
SELECT strftime('%Y-%m', order_date) AS month,
       SUM(amount) AS revenue
FROM orders
GROUP BY month
ORDER BY month;
```

| month   | revenue |
| ------- | ------- |
| 2024-01 | 150     |
| 2024-02 | 70      |

## Date arithmetic

```sql
SELECT date('2024-01-31', '+1 day');       -- 2024-02-01
SELECT date('now');                        -- today
SELECT julianday('2024-03-01') - julianday('2024-01-01');   -- 60 days apart
```

## Keep in mind

- `strftime` returns **text**, so the year `2024` comes back as `'2024'`.
- Group by `%Y-%m`, not just `%m`. Otherwise March 2023 and March 2024 land in the same bucket.
- Other databases use different functions (`EXTRACT`, `DATE_TRUNC`), but the ideas are the same.
