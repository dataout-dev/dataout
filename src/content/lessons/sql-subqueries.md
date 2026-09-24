## A query inside a query

Sometimes the answer to one question depends on the answer to another. "Which products cost more than average?" needs the average first. A **subquery** is a complete query, in parentheses, used inside another query.

| name         | price |
| ------------ | ----- |
| Notebook     | 40    |
| Pen          | 10    |
| Backpack     | 150   |
| Water Bottle | 60    |
| Desk Lamp    | 90    |

## A scalar subquery: one value

```sql
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);
```

The inner query returns a single number, `70`. The outer query then behaves as if you had written `WHERE price > 70`:

| name      | price |
| --------- | ----- |
| Backpack  | 150   |
| Desk Lamp | 90    |

Without a subquery you'd have to run one query, copy the answer, and paste it into another. The subquery does that for you, and stays correct when the data changes.

## A list subquery: IN

When the inner query returns a **column** of values, use `IN`:

```sql
SELECT name
FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE total > 500);
```

"Customers who have placed at least one order over 500."

## How to read a subquery

**From the inside out.** Run the inner query on its own first. It should make sense, and its result tells you what the outer query receives.

## Common mistakes

- **A scalar subquery must return one value.** If it returns several rows you'll get an error, or an arbitrary one.
- `>` vs `>=`: with `>` a product priced exactly at the average is excluded.
- Subqueries can also go in `FROM` (a "derived table") and in `SELECT`.

## Keep in mind

A subquery is fine for simple cases. When you find yourself nesting more than one level, switch to a CTE (lesson 26): same idea, easier to read.
