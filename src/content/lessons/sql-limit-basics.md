## Why LIMIT exists

A real table can hold millions of rows. Often you only want a handful: a quick peek at the data, or "the top 5". `LIMIT` caps how many rows a query returns.

Here is a small table called `books`:

| title         | price |
| ------------- | ----- |
| Deep Work     | 350   |
| Atomic Habits | 500   |
| Dune          | 250   |
| Sapiens       | 450   |
| Wings of Fire | 200   |

```sql
SELECT * FROM books LIMIT 2;
```

This returns **at most 2 rows** instead of all five. But notice the question it raises: *which* two?

## The catch: "first" needs an order

A table has no built-in "first" row. If you don't say how to order the rows, the database returns them in whatever order is convenient. That is often the order they were added, but nothing guarantees it, it can differ between databases, and it can change as the data grows.

So `LIMIT` on its own gives you *some* rows, not a reliable answer to "the cheapest" or "the most expensive". To get a meaningful answer, sort first.

## Sorting with ORDER BY

`ORDER BY` sorts the rows by a column:

```sql
SELECT * FROM books ORDER BY price;
```

| title         | price |
| ------------- | ----- |
| Wings of Fire | 200   |
| Dune          | 250   |
| Deep Work     | 350   |
| Sapiens       | 450   |
| Atomic Habits | 500   |

By default the sort goes from smallest to largest. This is called **ascending**, and you can spell it out with `ASC`. To go from largest to smallest, add `DESC`:

```sql
SELECT * FROM books ORDER BY price DESC;
```

## Putting them together

Sort first, then keep only the rows you want. Here are the two most expensive books:

```sql
SELECT * FROM books ORDER BY price DESC LIMIT 2;
```

The database does it in two steps:

1. `ORDER BY price DESC` puts the most expensive book at the top.
2. `LIMIT 2` keeps only the first two rows of that sorted list.

| title         | price |
| ------------- | ----- |
| Atomic Habits | 500   |
| Sapiens       | 450   |

Change `DESC` to `ASC` (or leave it out) and you flip the question: you would get the cheapest books instead.

## The order of the parts

The parts of a query always go in this order:

1. `SELECT` (which columns)
2. `FROM` (which table)
3. `WHERE` (which rows, optional)
4. `ORDER BY` (how to sort, optional)
5. `LIMIT` (how many to keep, optional)

`LIMIT` always comes last. For example, the two most expensive books that cost under 400:

```sql
SELECT * FROM books WHERE price < 400 ORDER BY price DESC LIMIT 2;
```

| title     | price |
| --------- | ----- |
| Deep Work | 350   |
| Dune      | 250   |

> **Watch out:** writing `LIMIT 2` *before* `ORDER BY` is a syntax error. `LIMIT` goes at the very end.

## LIMIT is a maximum, not a promise

`LIMIT 5` means "no more than 5 rows". If the table only has 2 rows, you get 2 rows. There is no error and nothing gets padded. Your query should work whether the table is big, small, or has fewer rows than the limit.

## Common mistakes

- **Forgetting `ORDER BY`.** `LIMIT 3` alone returns *some* three rows, not "the top three".
- **Sorting the wrong way.** Cheapest first is `ASC`, most expensive first is `DESC`. Re-read the task to check which one it asks for.
- **Off by one.** `LIMIT 3` returns three rows, not two and not four.
- **Copying the sample.** A query that only works for the sample rows (for example one that names specific products) will fail on other data.

## Putting it to use

Switch to the **Practice** tab when you are ready. Use **Run** to check your query on the sample data, then **Submit** to test it against several hidden tables. The hidden tables have different products and different prices, so your query needs to describe the rule (sorted by what, and how many) rather than the answer.

## Recap

- `LIMIT n` keeps at most `n` rows.
- Without `ORDER BY`, *which* rows you get is not guaranteed.
- `ORDER BY column` sorts ascending (`ASC`); add `DESC` to sort the other way.
- Sort first, then limit: `ORDER BY ... LIMIT ...`, with `LIMIT` last.
- If there are fewer rows than the limit, you simply get them all.
