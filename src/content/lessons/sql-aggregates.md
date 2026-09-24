## From many rows to one number

So far every query has returned rows. **Aggregate functions** collapse many rows into a single value: "how many orders?", "what's the average?", "what was the biggest?"

| id | customer | total | coupon |
| -- | -------- | ----- | ------ |
| 1  | Asha     | 100   | SAVE10 |
| 2  | Ben      | 250   | *NULL* |
| 3  | Chitra   | 60    | *NULL* |
| 4  | Dev      | 90    | SAVE10 |

## The five you'll use daily

| Function     | Returns                          |
| ------------ | -------------------------------- |
| `COUNT(*)`   | the number of rows               |
| `SUM(col)`   | the total of a column            |
| `AVG(col)`   | the average                      |
| `MIN(col)`   | the smallest value               |
| `MAX(col)`   | the largest value                |

```sql
SELECT COUNT(*) AS orders,
       SUM(total) AS revenue,
       AVG(total) AS average
FROM orders;
```

| orders | revenue | average |
| ------ | ------- | ------- |
| 4      | 500     | 125     |

## COUNT(*) vs COUNT(column)

This difference catches almost everyone once:

```sql
SELECT COUNT(*), COUNT(coupon) FROM orders;   -- 4 and 2
```

- `COUNT(*)` counts **rows**.
- `COUNT(coupon)` counts rows where `coupon` is **not `NULL`**.

`SUM`, `AVG`, `MIN` and `MAX` also ignore `NULL`s. The average of 10, 20 and a missing value is 15, not 10.

## Mixing aggregates with plain columns

`SELECT customer, COUNT(*) FROM orders` makes no sense on its own: one number for the whole table, but which customer? Aggregates and plain columns mix only with `GROUP BY`, which is the next lesson.

## Keep in mind

- With no rows at all, `COUNT(*)` is `0` but `SUM` and `AVG` are `NULL`.
- `AVG` of whole numbers gives a decimal in SQLite, so no `1.0 *` trick is needed here.
- `COUNT(DISTINCT city)` counts different values.
