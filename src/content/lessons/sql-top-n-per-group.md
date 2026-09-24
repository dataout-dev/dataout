## "The best two of each"

"Top 5 products" is easy: sort and `LIMIT 5`. But "the top **2 reps in each region**" is different. `LIMIT` cuts the **whole** result, so it can't restart for every group. This is one of the most common interview questions in SQL.

| region | rep    | amount |
| ------ | ------ | ------ |
| North  | Chitra | 300    |
| North  | Ben    | 500    |
| North  | Asha   | 300    |
| South  | Dev    | 200    |
| South  | Esha   | 150    |
| South  | Farah  | 50     |

## The recipe

1. **Number** the rows inside each group with `ROW_NUMBER()`.
2. **Filter** on that number in an outer query.

```sql
WITH ranked AS (
  SELECT region, rep, amount,
         ROW_NUMBER() OVER (
           PARTITION BY region
           ORDER BY amount DESC, rep
         ) AS rn
  FROM sales
)
SELECT region, rep, amount
FROM ranked
WHERE rn <= 2
ORDER BY region, amount DESC, rep;
```

| region | rep  | amount |
| ------ | ---- | ------ |
| North  | Ben  | 500    |
| North  | Asha | 300    |
| South  | Dev  | 200    |
| South  | Esha | 150    |

## Why the extra query?

A window function's result (`rn`) doesn't exist yet when `WHERE` runs, so you can't write `WHERE ROW_NUMBER() ... <= 2`. Compute it in a CTE (or subquery), then filter it outside.

## The tie-breaker

Chitra and Asha both sold 300, and only one of them gets the second place in North. Sort by `amount DESC` alone and the choice is **arbitrary**: it might change from one run to the next. Adding `rep` to the `ORDER BY` decides it the same way every time. **Every "top N" needs a tie-breaker.**

## ROW_NUMBER, RANK or DENSE_RANK?

- `ROW_NUMBER()`: exactly N rows per group, ties broken by your tie-breaker.
- `RANK()` / `DENSE_RANK()`: keep **all** tied rows, so you may get more than N.

Pick the one that matches the question: "exactly two reps", or "everyone who ranks in the top two".

## Keep in mind

- `PARTITION BY` defines the groups, `ORDER BY` inside `OVER` defines "best".
- For just the single best row per group, filter `rn = 1`.
