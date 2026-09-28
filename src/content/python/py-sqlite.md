You have been using SQL in another part of DataOut. Python can talk to SQL databases too, and its standard library includes **SQLite**, a complete database that lives in a single file (or in memory). This lesson shows how to create tables, insert and query data from Python, and, above all, how to keep your queries safe.

You will learn:

- connecting to a database
- executing statements, `executemany` and transactions
- **parameters**, and why you must never build SQL with string formatting
- reading rows as tuples or as dictionaries
- in-memory databases for experiments and tests
- turning a query into a list of dictionaries
- indexes and how to check whether a query is fast

## Connecting

```python
import sqlite3

con = sqlite3.connect(":memory:")
print(type(con).__name__)
```

`":memory:"` is a database that lives only in RAM, and vanishes when the connection closes. It is perfect for learning and for tests. With a file name, `sqlite3.connect("shop.db")` creates or opens a real file.

## Creating a table and inserting

`execute` runs one SQL statement:

```python
con.execute("CREATE TABLE product (id INTEGER PRIMARY KEY, name TEXT, price REAL)")
con.execute("INSERT INTO product (name, price) VALUES ('pen', 1.5)")
con.execute("INSERT INTO product (name, price) VALUES ('ink', 8.0)")

rows = con.execute("SELECT id, name, price FROM product").fetchall()
print(rows)
```

`execute` returns a **cursor**. `fetchall()` returns all the rows as a list of tuples, `fetchone()` returns the next row (or `None`), and you can also loop over the cursor.

## Parameters: never format SQL by hand

Values that come from a user, or from anywhere else, must **never** be pasted into SQL text with an f-string or `+`. That is how **SQL injection** happens, one of the most common security holes in the world:

```python
name = "x'; DROP TABLE product; --"
dangerous = f"SELECT * FROM product WHERE name = '{name}'"
print(dangerous)
```

The name closes the quote, and adds a second command. Instead, use **placeholders**: a `?` in the SQL, and a tuple of values as the second argument. The database treats the values only as data, never as code:

```python
rows = con.execute("SELECT name FROM product WHERE name = ?", (name,)).fetchall()
print(rows)

con.execute("INSERT INTO product (name, price) VALUES (?, ?)", ("cap", 12.25))
print(con.execute("SELECT COUNT(*) FROM product").fetchone())
```

Note the comma in `(name,)`: a tuple with a single item needs it. You can also use **named** placeholders with a dictionary:

```python
print(con.execute("SELECT name FROM product WHERE price > :limit", {"limit": 5}).fetchall())
```

**Placeholders work for values only**, not for table or column names. If a name comes from outside, check it against a fixed list of allowed names.

## executemany

`executemany` runs the same statement for many rows:

```python
more = [("tape", 2.25), ("glue", 3.0), ("clip", 0.5)]
con.executemany("INSERT INTO product (name, price) VALUES (?, ?)", more)
print(con.execute("SELECT COUNT(*), ROUND(SUM(price), 2) FROM product").fetchone())
```

## Transactions

Changes are made inside a **transaction**, and become permanent only when you `commit`. If something goes wrong, `rollback` undoes **everything since the last commit**. So far we have not committed, and the inserts above are still pending. Let us save them first:

```python
con.commit()
```

Using the connection as a context manager commits on success and rolls back on an exception:

```python
try:
    with con:
        con.execute("INSERT INTO product (name, price) VALUES (?, ?)", ("bad", 1.0))
        raise RuntimeError("something failed")
except RuntimeError:
    pass

print(con.execute("SELECT COUNT(*) FROM product WHERE name = 'bad'").fetchone())
```

The insert was undone, so the count is 0. Note that the `with con:` block **does not close** the connection. Call `con.close()` when you are done.

## Rows as dictionaries

Tuples are hard to read. Setting `row_factory` to `sqlite3.Row` lets you use column names, and `dict(row)` makes a real dictionary:

```python
con.row_factory = sqlite3.Row
row = con.execute("SELECT * FROM product WHERE name = 'pen'").fetchone()
print(row["name"], row["price"])
print(dict(row))
print(row.keys())
```

A small helper turns any query into a list of dictionaries:

```python
def query(con, sql, params=()):
    return [dict(row) for row in con.execute(sql, params).fetchall()]

print(query(con, "SELECT name, price FROM product WHERE price < ? ORDER BY price", (3,)))
```

## Aggregation

All the SQL you know works as it does elsewhere, and you can use Python to combine it with the other tools:

```python
print(query(con, "SELECT COUNT(*) AS n, MIN(price) AS lowest, MAX(price) AS highest FROM product"))
```

## Indexes

An **index** makes look-ups on a column fast. `EXPLAIN QUERY PLAN` shows how SQLite will run a query, so you can check whether an index is used:

```python
plan = con.execute("EXPLAIN QUERY PLAN SELECT * FROM product WHERE name = 'pen'").fetchall()
print("SCAN" in plan[0][3])

con.execute("CREATE INDEX idx_product_name ON product(name)")
plan = con.execute("EXPLAIN QUERY PLAN SELECT * FROM product WHERE name = 'pen'").fetchall()
print("idx_product_name" in plan[0][3])
```

Without the index, SQLite **scans** the whole table. With it, it **searches** the index.

## Built-in data in this course

The playground gives you a helper for the built-in data sets, and behind it is exactly this module. You can open them yourself:

```python
from dataout import sql

print(sql("chinook", "SELECT COUNT(*) AS n FROM Genre")[0]["n"])
```

## Common mistakes

- Building SQL text with f-strings or `+` and user data.
- Forgetting the comma in a one-item tuple: `(name)` is not a tuple.
- Forgetting to `commit`, so the changes are lost.
- Trying to use a placeholder for a table or column name.
- Never closing the connection.

## Recap

- `sqlite3.connect(":memory:")` gives a throw-away database. A file name gives a real one.
- `execute`, `executemany`, `fetchone` and `fetchall` are the main tools.
- **Always** use `?` placeholders for values. It prevents SQL injection.
- `with con:` commits on success and rolls back on an error.
- `row_factory = sqlite3.Row` gives named columns.

## Your turn

In the **Practice** tab you write `db_sum(rows)`, which loads rows into an in-memory table and sums a column. Then three challenges use the Chinook store.
