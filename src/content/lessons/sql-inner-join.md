## Why data is split across tables

A well-designed database doesn't repeat itself. An author's name is stored **once**, in an `authors` table, and each book just remembers the author's **id**.

**authors**

| id | name    |
| -- | ------- |
| 1  | Tagore  |
| 2  | Narayan |

**books**

| id | title        | author_id |
| -- | ------------ | --------- |
| 1  | Gitanjali    | 1         |
| 2  | Malgudi Days | 2         |
| 3  | Orphan Book  | *NULL*    |

`author_id` is a **foreign key**: it points at a row in another table. To see titles next to author names, you need to put the two tables together. That is a **join**.

## INNER JOIN

```sql
SELECT b.title, a.name AS author
FROM books b
JOIN authors a ON a.id = b.author_id;
```

| title        | author  |
| ------------ | ------- |
| Gitanjali    | Tagore  |
| Malgudi Days | Narayan |

Read it as: *for each book, find the author whose `id` equals the book's `author_id`, and combine them.*

- `JOIN` on its own means `INNER JOIN`.
- `ON` says how the tables match up.
- `b` and `a` are **aliases**: short names for the tables.

## Rows without a match disappear

The "Orphan Book" has no author, so it has nothing to join with, and an inner join **drops** it. Only rows that match on **both** sides survive. (The next lesson shows how to keep them.)

## Qualify your columns

Both tables have a column called `id`. Writing just `id` is ambiguous and SQL raises an error. Prefix it with the alias: `a.id`, `b.id`.

## Common mistakes

- **Forgetting `ON`.** Joining with no condition pairs **every** row with **every** row (a "cross join"). Two tables of 1,000 rows give a million rows.
- **Joining on the wrong columns.** Join key to key: `a.id = b.author_id`, not `a.id = b.id`.

## Keep in mind

Filter and sort as usual after a join: `WHERE a.name = 'Tagore'`.
