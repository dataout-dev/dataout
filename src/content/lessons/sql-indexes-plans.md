## Why is my query slow?

On a table of 100 rows every query is instant. On 100 million, the way the database finds rows starts to matter. This lesson is about what happens under the hood.

## Scan or search

Take `SELECT * FROM orders WHERE customer_id = 7`.

- **Without an index**, the database has no shortcut, so it reads **every row** and checks each one. This is a **scan**. The time grows with the size of the table.
- **With an index** on `customer_id`, it jumps straight to the matching rows, the way you'd use the index at the back of a book instead of reading every page. This is a **search**, and it stays fast as the table grows.

## Creating an index

```sql
CREATE INDEX idx_orders_customer ON orders(customer_id);
```

The database keeps a sorted structure of `customer_id` values pointing at the rows. Queries that filter, join or sort on that column can use it. You don't change the query at all: the database decides to use the index.

## Reading a query plan

Ask the database what it intends to do:

```sql
EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE customer_id = 7;
```

| Before the index | After the index |
| ---------------- | --------------- |
| `SCAN orders` | `SEARCH orders USING INDEX idx_orders_customer (customer_id=?)` |

The words to look for are **SCAN** (reads everything) and **SEARCH** (uses an index).

## Indexes aren't free

- They take **disk space**.
- They make writes **slower**: every `INSERT`, `UPDATE` or `DELETE` must also update the index.
- So add indexes for columns you often **filter, join or sort by**, not on every column.

## When an index doesn't help

- The filter matches most of the table (an index on a yes/no column).
- A function wraps the column: `WHERE LOWER(email) = ...` can't use a plain index on `email`.
- A pattern starts with a wildcard: `LIKE '%son'`.
- The table is tiny.

## Keep in mind

- Primary keys are indexed automatically.
- Measure before and after. "It should be faster" isn't evidence.
- This lesson's test is a question about the ideas, rather than a query.
