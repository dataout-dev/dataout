## One summary per category

An aggregate over the whole table gives one number. Often you want one number **per group**: orders per region, revenue per month, songs per artist. That is `GROUP BY`.

| region | amount |
| ------ | ------ |
| South  | 100    |
| North  | 250    |
| South  | 150    |
| East   | 80     |
| North  | 50     |

```sql
SELECT region, COUNT(*) AS orders, SUM(amount) AS revenue
FROM sales
GROUP BY region
ORDER BY region;
```

| region | orders | revenue |
| ------ | ------ | ------- |
| East   | 1      | 80      |
| North  | 2      | 300     |
| South  | 2      | 250     |

## How it works

`GROUP BY region` sorts the rows into **buckets**, one per distinct region. Then each aggregate runs **inside** its bucket. Read it as: *for each region, count the rows and sum the amounts.*

## The rule

Every column in `SELECT` must be one of two things:

1. In the `GROUP BY` list, or
2. Inside an aggregate function such as `COUNT` or `SUM`.

`SELECT region, amount ... GROUP BY region` is ambiguous: which of a region's several amounts should it show? Some databases refuse it. SQLite quietly picks one, which hides bugs, so avoid it.

## NULL is a group too

Rows with a missing region form their own bucket, and it shows up as `NULL`.

## Grouping by more than one column

```sql
GROUP BY region, status
```

gives one bucket per **combination**.

## Keep in mind

- Filter rows **before** grouping with `WHERE`. Filter groups **after** with `HAVING` (next lesson).
- You can `ORDER BY` an aggregate: `ORDER BY revenue DESC`.
- Group by an id when names might repeat: two customers can both be called Ravi.
