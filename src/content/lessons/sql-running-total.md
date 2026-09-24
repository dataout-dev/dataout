## Adding up as you go

A running (cumulative) total answers "how much so far?": year-to-date revenue, a bank balance, total flights since January. You can't do it with `GROUP BY`, which collapses rows. A window aggregate can.

| id | amount |
| -- | ------ |
| 1  | 50     |
| 2  | 30     |
| 3  | 20     |
| 4  | 100    |

## SUM() OVER (ORDER BY ...)

```sql
SELECT id, amount,
       SUM(amount) OVER (ORDER BY id) AS running_total
FROM payments;
```

| id | amount | running_total |
| -- | ------ | ------------- |
| 1  | 50     | 50            |
| 2  | 30     | 80            |
| 3  | 20     | 100           |
| 4  | 100    | 200           |

With an `ORDER BY` inside `OVER`, the sum covers **every row from the start up to the current one**. Any aggregate works: `AVG` gives a running average, `COUNT` a running count.

Without `ORDER BY`, the window is the whole table, and every row gets the grand total (200):

```sql
SUM(amount) OVER ()
```

## Aggregate first, then run the window

To get a running total per month, you need the per-month numbers before the window can add them up. Window functions can't appear inside `GROUP BY`, so use a CTE:

```sql
WITH monthly AS (
  SELECT month, COUNT(*) AS flights
  FROM flights
  GROUP BY month
)
SELECT month, flights,
       SUM(flights) OVER (ORDER BY month) AS running_flights
FROM monthly
ORDER BY month;
```

## Per-group running totals

Add `PARTITION BY` to restart the total for each group:

```sql
SUM(amount) OVER (PARTITION BY customer ORDER BY paid_on)
```

## Keep in mind

- The window's `ORDER BY` decides what "so far" means. Order by the wrong column and the totals are meaningless.
- If several rows tie on the ordering column, they are added **together** in the default frame. Order by a unique column (or add a tie-breaker) for a row-by-row total.
- The last row's running total equals the plain grand total, a handy check.
