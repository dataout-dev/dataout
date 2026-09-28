Sometimes the fastest way to answer a question is to let a real database do the work: `sqlite3`, pandas' `read_sql`/`to_sql`, and SQLAlchemy all connect Python to SQL, each at a different level of control.

You will learn:

- querying with `sqlite3` directly
- `pd.read_sql` and `to_sql`
- SQLAlchemy Core: `create_engine` and `text()`
- pushing work into SQL versus doing it in pandas

## sqlite3 directly

```python
import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE orders (id INTEGER, total REAL)")
conn.executemany("INSERT INTO orders VALUES (?, ?)", [(1, 50.0), (2, 150.0), (3, 200.0)])
cursor = conn.execute("SELECT * FROM orders WHERE total >= ?", (100,))
print(cursor.fetchall())
```

`:memory:` creates a database that exists only for the connection's lifetime — perfect for examples and tests, with the exact same API as a real file-backed database.

## Parameter binding

```python
import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE t (name TEXT)")
name = "Robert'); DROP TABLE t; --"
conn.execute("INSERT INTO t VALUES (?)", (name,))
print(conn.execute("SELECT * FROM t").fetchall())
```

The `?` placeholder, paired with a separate `params` tuple, is not just a convenience — it is what keeps a value like the mischievous one above as **data**, never as part of the SQL command itself. Building a query string by hand with an f-string or `+` instead is exactly the SQL injection vulnerability this pattern prevents.

## pd.read_sql and to_sql

```python
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
df = pd.DataFrame({"name": ["Ada", "Grace"], "score": [95, 88]})
df.to_sql("people", conn, index=False)
result = pd.read_sql("SELECT * FROM people WHERE score > 90", conn)
print(result)
```

`to_sql` writes a DataFrame straight into a table; `read_sql` reads a query's results straight back as one — pandas handles the type mapping in both directions.

## SQLAlchemy Core

```python
from sqlalchemy import create_engine, text
import pandas as pd

engine = create_engine("sqlite://")
with engine.begin() as conn:
    conn.execute(text("CREATE TABLE orders (id INTEGER, total REAL)"))
    conn.execute(text("INSERT INTO orders VALUES (:id, :total)"), [{"id": 1, "total": 50.0}, {"id": 2, "total": 150.0}])

result = pd.read_sql(text("SELECT * FROM orders WHERE total >= :min_total"), engine, params={"min_total": 100})
print(result)
```

SQLAlchemy's `text()` with **named** parameters (`:min_total`, matched against a dict) is a style many people find clearer than positional `?` placeholders, especially once a query has more than one or two parameters. `pd.read_sql` needs a real SQLAlchemy `Engine` (from `create_engine`) to accept a `text()` query this way — a plain `sqlite3` connection only understands plain query strings with `?` placeholders, the style shown earlier. The same engine-based API additionally supports real client-server databases (Postgres, MySQL) without changing how the code is written, and an ORM layer for mapping tables to Python classes, beyond what this lesson covers.

## Pushing work into SQL versus pandas

A `WHERE` clause, a `GROUP BY`, or a `JOIN` can usually run either in the database (before the result even reaches Python) or in pandas (after loading everything). For a large table, filtering and aggregating in SQL first — so only the smaller, already-summarised result crosses into Python — is often far faster than pulling every row across just to filter most of them straight back out.

## Watch out: loading whole tables needlessly

```python
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE big (id INTEGER, category TEXT)")
conn.executemany("INSERT INTO big VALUES (?, ?)", [(i, "a" if i % 2 else "b") for i in range(1000)])

wasteful = pd.read_sql("SELECT * FROM big", conn)
wasteful_result = wasteful[wasteful["category"] == "a"]

efficient = pd.read_sql("SELECT * FROM big WHERE category = 'a'", conn)
print(len(wasteful_result), len(efficient))
```

Both give the same answer here, but the second version never transfers the rows that were going to be filtered out anyway — the difference is invisible on a toy table and very real on a large one.

## Common mistakes

- Building SQL query strings with string formatting instead of parameter binding, opening the door to SQL injection.
- Loading an entire large table into pandas just to filter most of it back out immediately.
- Forgetting that `to_sql` needs `if_exists=` set explicitly (`"replace"`, `"append"`, or the default `"fail"`) when a table might already exist.
- Reaching for a full SQLAlchemy ORM setup when a plain `sqlite3` connection and a few queries would have been simpler.

## Recap

- `sqlite3` gives direct SQL access; parameter binding (`?` or named `:param`) keeps values safely separated from SQL syntax.
- `pd.read_sql`/`to_sql` move data between a database and a DataFrame in either direction.
- SQLAlchemy's `text()` offers named parameters and, with a full engine, support for real client-server databases.
- Push filtering and aggregation into SQL when the source table is large; only bring back what is actually needed.

## Your turn

In the **Practice** tab you write `query_df(conn, min_total)`. Then three challenges use real data.
