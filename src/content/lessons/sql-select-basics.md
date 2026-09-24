## Your first query

A database stores information in **tables**, like spreadsheets with named columns. To read data out of a table you write a **query**, and nearly every query starts with `SELECT`.

Here is a small table called `products`:

| id | name     | price | stock |
| -- | -------- | ----- | ----- |
| 1  | Notebook | 40    | 120   |
| 2  | Pen      | 10    | 500   |
| 3  | Backpack | 150   | 35    |

## Choosing columns

`SELECT` says **which columns** you want. `FROM` says **which table** to read them from.

```sql
SELECT name, price
FROM products;
```

| name     | price |
| -------- | ----- |
| Notebook | 40    |
| Pen      | 10    |
| Backpack | 150   |

Two things to notice:

- Columns come back in the order **you** type them. `SELECT price, name` would flip them.
- The query only **reads**. The table itself is never changed.

## Every column: the star

`*` is shorthand for "all columns":

```sql
SELECT * FROM products;
```

It is handy for a first look at a table. In real work, name the columns you need: results are smaller, and your query keeps working if someone adds a column later.

## Keep in mind

- Separate column names with commas, with no comma after the last one.
- A semicolon at the end is good style. Many tools need it when there is more than one query.
- SQL keywords such as `SELECT` are not case sensitive. Most people capitalise them so they stand out.

**Next:** you'll learn to calculate new columns and give them names.
