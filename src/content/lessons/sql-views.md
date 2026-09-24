## Saving a query under a name

Suppose several reports need "total delivered revenue per customer". You could paste the same 8-line query into each one. But then, when the definition changes (say, returns should be excluded), you have to fix it in every copy. A **view** stores the query once, under a name.

| id | customer | status    | amount |
| -- | -------- | --------- | ------ |
| 1  | Asha     | delivered | 80     |
| 2  | Asha     | delivered | 60     |
| 3  | Ben      | cancelled | 500    |
| 4  | Ben      | delivered | 90     |

## CREATE VIEW

```sql
CREATE VIEW delivered_totals AS
SELECT customer, SUM(amount) AS total
FROM orders
WHERE status = 'delivered'
GROUP BY customer;
```

Now `delivered_totals` behaves like a table:

```sql
SELECT customer, total
FROM delivered_totals
WHERE total > 100
ORDER BY total DESC;
```

| customer | total |
| -------- | ----- |
| Asha     | 140   |

## What a view is, and isn't

- A view stores **no data**, only the query. Every time you read from it, the database runs the query on the current data, so it is never out of date.
- You can join a view to other tables, filter it, and even build another view on top of it.
- It is a good place for a shared definition: everyone who uses `delivered_totals` agrees what "total" means.
- To remove it: `DROP VIEW delivered_totals;`.

## In this lesson's tests

The tests run your **whole script**: first `CREATE VIEW`, then the `SELECT`. The result of the **last** query is compared. Each run starts with a fresh database, so the view doesn't clash with a previous attempt.

If you use the **Run** button repeatedly in the same session, the second `CREATE VIEW` says the view already exists. Use `CREATE VIEW IF NOT EXISTS` or press **Reset**.

## Keep in mind

- A view can't make a slow query fast: it runs the same query underneath.
- Some databases offer **materialised views** that do store the results, trading freshness for speed.
- Name views for what they contain, like `delivered_totals`, not `view1`.
