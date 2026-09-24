## Real questions need more than two tables

"Which customers spent the most?" involves three tables: who the customer is, what orders they placed, and what was in each order.

**customers** `id, name` &nbsp;·&nbsp; **orders** `id, customer_id, status` &nbsp;·&nbsp; **order_items** `order_id, qty, price`

## Read joins as a path

Chain the joins one at a time, and follow the keys:

```
customers  →  orders  →  order_items
   id       customer_id     order_id
```

```sql
SELECT c.name, o.id AS order_id, oi.qty, oi.price
FROM customers c
JOIN orders o       ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id;
```

Each `JOIN ... ON` connects the next table to one already in the query. Now every row is one item, with its customer's name attached.

## Then aggregate

Revenue is a **per-row calculation**, `qty * price`, that you then sum for each customer:

```sql
SELECT c.name,
       SUM(oi.qty * oi.price) AS revenue
FROM customers c
JOIN orders o       ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'delivered'
GROUP BY c.id, c.name
ORDER BY revenue DESC, c.name
LIMIT 3;
```

Four ideas working together: joins build the rows, `WHERE` filters them, `GROUP BY` buckets them, and `ORDER BY` with `LIMIT` picks the top.

## Things to check

- **Filter before you sum.** Without `WHERE o.status = 'delivered'`, cancelled orders inflate revenue.
- **Group by the id**, not only the name. Two customers can share a name, and grouping by name alone would merge them.
- **Sanity-check row counts.** Join first, without the aggregate, and look at a few rows. If the numbers look doubled, a join is duplicating rows.
- **Tie-breakers.** When two customers have the same revenue, add `c.name` to the `ORDER BY` so the "top 3" is always the same.

## Keep in mind

You can join as many tables as you need. Add them one at a time and run the query after each, so you always know which join broke it.
