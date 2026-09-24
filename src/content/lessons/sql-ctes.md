## Names make queries readable

Nested subqueries get hard to read: you have to dive into the middle to see what is happening. A **common table expression (CTE)** gives a subquery a **name**, so a query reads top to bottom like a recipe.

| rep    | amount |
| ------ | ------ |
| Asha   | 100    |
| Asha   | 50     |
| Ben    | 200    |
| Chitra | 40     |
| Chitra | 30     |

## Syntax

```sql
WITH totals AS (
  SELECT rep, SUM(amount) AS total
  FROM sales
  GROUP BY rep
)
SELECT rep, total
FROM totals
WHERE total > (SELECT AVG(total) FROM totals);
```

1. `WITH totals AS (...)` defines a temporary named result: one row per rep.
2. The main query then uses `totals` like any table.

Here the CTE is used **twice**: once for the rows, and once to compute the average of the totals. Writing that as nested subqueries would repeat the whole grouped query.

## A common trap it prevents

The question is "reps whose **total** is above the average **rep total**". The tempting shortcut compares each total with `AVG(amount)`, the average of *individual sales*. That is a different number, and a wrong answer. The CTE makes it obvious which average you mean.

## Several CTEs

Separate them with commas. Later ones can use earlier ones:

```sql
WITH totals AS (...),
     ranked AS (SELECT rep, total, RANK() OVER (ORDER BY total DESC) AS r FROM totals)
SELECT * FROM ranked WHERE r <= 3;
```

Build a complex query one step at a time and run each CTE on its own to check it.

## Keep in mind

- A CTE exists only for the one query that follows it.
- Choose names that say what the rows are: `monthly_revenue`, not `t1`.
- CTEs are for readability. They don't change what the query means, and the database may run them the same way as a subquery.
