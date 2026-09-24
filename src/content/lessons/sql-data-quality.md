## Can I trust this data?

Analysts spend a surprising share of their time asking that question. Bad data gives confident but wrong answers, so a good habit is to write **checks** that expose problems before you build on the data.

## Checks that should return nothing

The most useful kind of check is a query whose **correct result is zero rows**. Any row it returns is a problem:

```sql
-- order lines that point at a product which doesn't exist
SELECT oi.*
FROM order_items oi
LEFT JOIN products p ON p.id = oi.product_id
WHERE p.id IS NULL;
```

```sql
-- quantities that make no sense
SELECT * FROM order_items WHERE quantity <= 0;
```

```sql
-- dates in the future
SELECT * FROM orders WHERE order_date > date('now');
```

Run them regularly. If a check that used to return nothing suddenly returns 200 rows, something upstream broke.

## Reconciliation: does it add up?

Compare the same number computed two ways. If total revenue from `orders` differs from the total from `order_items`, one of them is wrong.

## Surfacing odd values

A order line records the **price actually charged**, which can differ from the list price. That is a discount worth looking at:

| order_id | product  | list_price | sold_price |
| -------- | -------- | ---------- | ---------- |
| 1        | Pen      | 20         | 15         |
| 2        | Backpack | 200        | 150        |

```sql
SELECT order_id, product,
       ROUND(100.0 * (list_price - sold_price) / list_price, 1) AS discount_pct
FROM order_lines
WHERE sold_price < list_price
ORDER BY order_id, product;
```

Note `100.0`, not `100`: whole-number division would round the percentage down to 0 or 25 (lesson 2).

## Measuring how bad it is

Count instead of listing, and split by group:

```sql
SELECT carrier, COUNT(*) AS flights_without_plane
FROM flights f
LEFT JOIN planes p ON p.tailnum = f.tailnum
WHERE p.tailnum IS NULL
GROUP BY carrier;
```

This is the anti-join from lesson 18 again, now used as a data-quality tool.

## Keep in mind

- A check that returns rows doesn't tell you **why**. Investigate before you "fix" the data.
- Missing values (`NULL`), duplicates, orphaned keys, impossible numbers and inconsistent labels are the usual suspects.
- Write down your checks. They are part of the analysis.
