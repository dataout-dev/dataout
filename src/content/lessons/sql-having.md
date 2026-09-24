## Filtering groups

`WHERE` removes rows **before** grouping. But what if you want to filter on the result of an aggregate, such as "cities with at least 2 customers"? The count doesn't exist until the rows are grouped, so `WHERE` can't see it.

| name   | city  |
| ------ | ----- |
| Asha   | Pune  |
| Ben    | Pune  |
| Chitra | Delhi |
| Dev    | Delhi |
| Esha   | Delhi |
| Farah  | Goa   |

## HAVING

`HAVING` filters groups **after** they are built:

```sql
SELECT city, COUNT(*) AS customers
FROM customers
GROUP BY city
HAVING COUNT(*) >= 2
ORDER BY customers DESC;
```

| city  | customers |
| ----- | --------- |
| Delhi | 3         |
| Pune  | 2         |

Goa has only one customer, so its group is thrown away.

## WHERE or HAVING?

| | `WHERE` | `HAVING` |
| - | ------- | -------- |
| Filters | rows | groups |
| Runs | before `GROUP BY` | after `GROUP BY` |
| Can use aggregates? | no | yes |

You can use both in one query:

```sql
SELECT city, COUNT(*) AS customers
FROM customers
WHERE name <> 'Asha'        -- rows first
GROUP BY city
HAVING COUNT(*) >= 2;       -- groups after
```

## Order of evaluation

Keep this sequence in your head, since it explains most SQL errors:

**FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY**

That is why you can't use a `SELECT` alias inside `WHERE` (it doesn't exist yet), but you can in `ORDER BY`.

## Keep in mind

- A condition that doesn't involve an aggregate belongs in `WHERE`. It is faster, because there are fewer rows to group.
- `>= 2` and `> 2` are different. Check the boundary.
