## Which different values exist?

A column usually repeats values. If you list the `city` of 1,000 orders, you'll see Pune hundreds of times. To see each value **once**, use `DISTINCT`.

| customer | city   |
| -------- | ------ |
| Asha     | Pune   |
| Ben      | Delhi  |
| Chitra   | Pune   |
| Dev      | *NULL* |
| Esha     | Delhi  |

```sql
SELECT DISTINCT city
FROM orders;
```

| city   |
| ------ |
| Pune   |
| Delhi  |
| *NULL* |

`NULL` counts as a value too, so it appears once. Filter it out if you don't want it:

```sql
SELECT DISTINCT city
FROM orders
WHERE city IS NOT NULL
ORDER BY city;
```

## DISTINCT works on the whole row

With more than one column, `DISTINCT` removes rows where **all** the columns repeat:

```sql
SELECT DISTINCT city, customer FROM orders;
```

Two rows with the same city but different customers both stay. Only exact duplicate rows go.

## When to use it

- Listing categories, cities, statuses: "what are the possible values?"
- Checking data: if `SELECT DISTINCT status` shows both `shipped` and `Shipped`, you've found messy data.

## Keep in mind

- `DISTINCT` needs the database to compare all rows, so on huge tables it can be slow.
- Don't use it to hide duplicates you don't understand. If you get unexpected duplicates, find out why. A join is often the cause.
- Counting the different values comes later: `COUNT(DISTINCT city)`.
