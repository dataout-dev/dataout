## From rows to columns

A `GROUP BY` gives you one **row** per category:

| customer | status    | orders |
| -------- | --------- | ------ |
| Asha     | delivered | 2      |
| Asha     | cancelled | 1      |
| Ben      | cancelled | 1      |

A report often wants one row per customer and **one column per status**, a cross-tab:

| customer | delivered | cancelled |
| -------- | --------- | --------- |
| Asha     | 2         | 1         |
| Ben      | 0         | 1         |

Turning rows into columns is called **pivoting**. Some databases have a `PIVOT` keyword. SQLite doesn't, but you don't need one.

## Conditional aggregation

Put a condition **inside** an aggregate. In SQLite a comparison is `1` when true and `0` when false, so summing it counts the rows that match:

```sql
SELECT customer,
       SUM(status = 'delivered') AS delivered,
       SUM(status = 'cancelled') AS cancelled
FROM orders
GROUP BY customer;
```

Each `SUM(...)` column counts only the rows for its status. One column per category you want to see.

## The portable version

Other databases don't treat a comparison as a number, so write it with `CASE`:

```sql
SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered
```

Same idea, and it works everywhere.

## Sums, not just counts

Replace the `1` with a value to pivot **amounts**:

```sql
SUM(CASE WHEN status = 'delivered' THEN amount ELSE 0 END) AS delivered_revenue
```

## Keep in mind

- You must know the categories in advance, because each becomes a column you write by hand. SQL can't create columns from the data.
- For a "total" column, add a plain `COUNT(*)`.
- Rows with a category you didn't pivot (like `shipped`) simply don't show up in any column, so check that your columns add up.
