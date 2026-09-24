## Rows have no natural order

A table is like a bag of rows. Unless you ask for an order, the database can return them in whatever order is convenient, and that can change. To get a **reliable** order, use `ORDER BY`.

| title   | year | rating |
| ------- | ---- | ------ |
| Dune    | 2021 | 8.0    |
| Arrival | 2016 | 8.0    |
| Cars    | 2006 | 7.1    |
| Up      | 2009 | 8.3    |

## Sorting

```sql
SELECT title, rating
FROM movies
ORDER BY rating;
```

By default the order is **ascending** (`ASC`): smallest first. Add `DESC` for the reverse:

```sql
ORDER BY rating DESC;    -- highest rating first
```

## Breaking ties

Dune and Arrival share a rating of 8.0. Which comes first? Without more instructions, it is not defined. Add a second column:

```sql
SELECT title, rating
FROM movies
ORDER BY rating DESC, title ASC;
```

| title   | rating |
| ------- | ------ |
| Up      | 8.3    |
| Arrival | 8.0    |
| Dune    | 8.0    |
| Cars    | 7.1    |

The first column decides; later columns only matter when earlier ones tie. Each column has its own `ASC` or `DESC`.

## Keep in mind

- `ORDER BY` goes near the end of the query, after `WHERE`.
- In SQLite, `NULL` sorts **first** in ascending order and last in descending order.
- You can sort by a calculation or an alias: `ORDER BY price * quantity DESC`.
- Whenever you need "the top" of something, add a tie-breaker. It makes your answer the same every time.
