## Comparing two lists

You already know `UNION` (everything from both lists). Two more set operations answer different questions:

| Operation | Returns |
| --------- | ------- |
| `UNION` | rows in **either** query |
| `INTERSECT` | rows in **both** queries |
| `EXCEPT` | rows in the **first** query but **not** the second |

**orders**

| customer | month |
| -------- | ----- |
| Asha     | 1     |
| Ben      | 1     |
| Ben      | 2     |
| Chitra   | 2     |
| Dev      | 1     |

## EXCEPT: who left?

"Customers who ordered in month 1 but not in month 2":

```sql
SELECT customer FROM orders WHERE month = 1
EXCEPT
SELECT customer FROM orders WHERE month = 2;
```

| customer |
| -------- |
| Asha     |
| Dev      |

Ben ordered in both months, so he's removed.

## INTERSECT: who stayed?

```sql
SELECT customer FROM orders WHERE month = 1
INTERSECT
SELECT customer FROM orders WHERE month = 2;
```

That returns only Ben.

## How they compare rows

- They compare **whole rows**, so select just the column(s) that identify what you're comparing (here, `customer`).
- They **remove duplicates** automatically, so Dev appearing twice would still show once.
- Both queries need the same number of columns, matched by position.
- `ORDER BY` goes once, at the very end.

## Alternatives

The same questions can be answered with `NOT EXISTS`, `IN` and joins. Set operations often read closer to the question in English, which is why analysts like them for "in A but not B" comparisons.

## Keep in mind

- Order matters for `EXCEPT`: A except B is not B except A.
- Using `SELECT DISTINCT` inside each side isn't necessary, but it does no harm.
- To compare on several columns, select them all: `SELECT origin, dest ... EXCEPT SELECT origin, dest ...`.
