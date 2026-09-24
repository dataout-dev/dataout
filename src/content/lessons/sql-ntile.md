## Splitting rows into groups of equal size

"Top 25% of customers", "bottom third of products by price", "deciles": all of these split an ordered list into **equal-sized groups**. `NTILE(n)` does it.

| name         | price |
| ------------ | ----- |
| Mug          | 180   |
| Backpack     | 150   |
| Desk Lamp    | 90    |
| Water Bottle | 60    |
| Notebook     | 40    |
| Pen          | 10    |

## NTILE

```sql
SELECT name, price,
       NTILE(3) OVER (ORDER BY price DESC) AS price_band
FROM products;
```

| name         | price | price_band |
| ------------ | ----- | ---------- |
| Mug          | 180   | 1          |
| Backpack     | 150   | 1          |
| Desk Lamp    | 90    | 2          |
| Water Bottle | 60    | 2          |
| Notebook     | 40    | 3          |
| Pen          | 10    | 3          |

The six rows are dealt into three bands of two. Band 1 holds the most expensive third because we sorted `DESC`.

## Uneven sizes

Seven rows into three bands doesn't divide evenly. The **first** bands get the extra rows: sizes 3, 2, 2. If there are fewer rows than bands, some bands stay empty.

## Common variations

| Want | Use |
| ---- | --- |
| Quartiles | `NTILE(4)` |
| Deciles | `NTILE(10)` |
| Percentiles | `NTILE(100)` |
| Top 10% | `NTILE(10)` and keep band 1 |

## NTILE splits by rows, not by value

Two products with almost the same price can land in different bands, if the cut falls between them. Bands are equal in **count**, not in price range. If you want equal price ranges, use `CASE` with fixed cut-offs (lesson 14).

## Keep in mind

- The direction of the `ORDER BY` decides whether band 1 is the top or the bottom.
- Ties on the ordering column can fall into different bands, arbitrarily. Add a tie-breaker for a repeatable result.
- Add `PARTITION BY` to split each group separately (quartiles within each region).
