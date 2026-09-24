## Does a related row exist?

Often you don't need the related rows themselves, only to know whether **any** exist: customers who have ordered, products nobody bought, students with no course.

**products**

| id | name      |
| -- | --------- |
| 1  | Notebook  |
| 2  | Pen       |
| 3  | Backpack  |

**order_items**

| order_id | product_id |
| -------- | ---------- |
| 1        | 2          |
| 1        | 1          |
| 2        | 2          |

## EXISTS and NOT EXISTS

`EXISTS (subquery)` is true when the subquery returns **at least one row**. It doesn't care what the row contains, so people write `SELECT 1`.

```sql
SELECT name
FROM products p
WHERE NOT EXISTS (
  SELECT 1
  FROM order_items oi
  WHERE oi.product_id = p.id
);
```

| name     |
| -------- |
| Backpack |

For each product, the database asks: "is there an order item for this product?" If not, the product is kept. This is a correlated subquery, and it can stop at the first match, which makes it efficient.

## Why not NOT IN?

`NOT IN` looks equivalent but has a nasty trap. Suppose one `order_items` row has a missing `product_id` (`NULL`):

```sql
WHERE id NOT IN (SELECT product_id FROM order_items)   -- returns NOTHING
```

`3 NOT IN (2, 1, NULL)` is "unknown", because it could be equal to the unknown value. So **no** row qualifies, and the query silently returns an empty result. `NOT EXISTS` doesn't have this problem.

**Rule of thumb: for "has none of", use `NOT EXISTS`.**

## Compared with LEFT JOIN

The anti-join from lesson 18 (`LEFT JOIN ... WHERE ... IS NULL`) gives the same answer. Use whichever you find clearer. `EXISTS` states the intent more directly: "there is no matching row".

## Keep in mind

- `EXISTS` returns true or false; it never produces duplicates, unlike a join.
- Selecting `1` or `*` inside `EXISTS` makes no difference.
