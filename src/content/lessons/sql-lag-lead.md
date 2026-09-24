## Comparing with the row before

"Is revenue up or down compared with last month?" needs each row to see **the previous row**. With `LAG` it can.

| month   | revenue |
| ------- | ------- |
| 2024-01 | 100     |
| 2024-02 | 250     |
| 2024-03 | 300     |

## LAG and LEAD

- `LAG(x)` returns the value of `x` from the **previous** row.
- `LEAD(x)` returns it from the **next** row.

```sql
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS previous
FROM monthly_sales;
```

| month   | revenue | previous |
| ------- | ------- | -------- |
| 2024-01 | 100     | *NULL*   |
| 2024-02 | 250     | 100      |
| 2024-03 | 300     | 250      |

January has nothing before it, so `LAG` gives `NULL`.

## Change over time

Subtract:

```sql
SELECT month, revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change
FROM monthly_sales;
```

| month   | revenue | change |
| ------- | ------- | ------ |
| 2024-01 | 100     | *NULL* |
| 2024-02 | 250     | 150    |
| 2024-03 | 300     | 50     |

Since `NULL` minus anything is `NULL`, January's change is `NULL`, which is honest: there's nothing to compare with.

## Options

```sql
LAG(revenue, 2)        -- two rows back
LAG(revenue, 1, 0)     -- use 0 instead of NULL when there is no previous row
LAG(x) OVER (PARTITION BY region ORDER BY month)   -- restart for each region
```

## Keep in mind

- **Always give the window an `ORDER BY`.** "Previous" only means something in a defined order, and without one you get whichever row the database reads first.
- `LAG` looks at the previous **row**, not the previous month. If a month is missing from your data, it will compare with the month before that.
- Percentage change: `100.0 * (revenue - prev) / prev`. Watch for `prev = 0`, and use `NULLIF(prev, 0)`.
