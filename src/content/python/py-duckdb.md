DuckDB runs full SQL directly against pandas DataFrames (and Parquet or CSV files) with no separate loading step — a genuinely different way to reach for SQL syntax without a traditional client-server database anywhere in sight.

You will learn:

- querying a DataFrame with SQL, by name
- reading Parquet and CSV files directly
- window functions
- when DuckDB beats pandas

## Querying a DataFrame directly

```python
import duckdb
import pandas as pd

df = pd.DataFrame({"category": ["a", "a", "b", "b", "b"], "value": [10, 20, 5, 15, 25]})
result = duckdb.sql("SELECT category, SUM(value) AS total FROM df GROUP BY category")
print(result.df())
```

DuckDB inspects the calling code for a variable named `df` and queries it directly — no explicit registration step, no copying the data into a separate database first.

## Getting results back

```python
import duckdb
import pandas as pd

df = pd.DataFrame({"x": [1, 2, 3]})
result = duckdb.sql("SELECT * FROM df WHERE x > 1")
print(result.fetchall())
print(result.df())
```

`.fetchall()` returns plain Python tuples; `.df()` converts back into a pandas DataFrame — pick whichever shape the next step needs.

## Reading files directly

```python
import duckdb

result = duckdb.sql("SELECT 42 AS answer")
print(result.fetchall())
```

Beyond querying an in-memory DataFrame, DuckDB can query Parquet or CSV files directly by path (`SELECT * FROM 'data.parquet'`) without a separate read step — genuinely convenient for a quick look at a file without deciding on a full loading pipeline first.

## Window functions

```python
import duckdb
import pandas as pd

df = pd.DataFrame({"name": ["a", "b", "c", "d"], "score": [30, 10, 40, 20]})
result = duckdb.sql("SELECT name, score, RANK() OVER (ORDER BY score DESC) AS rnk FROM df")
print(result.df())
```

DuckDB supports the full range of standard SQL window functions (`RANK`, `ROW_NUMBER`, running sums with `OVER (... ORDER BY ...)`), which pandas can express too but often less directly than a query written the way a SQL analyst already thinks about it.

## When DuckDB beats pandas

DuckDB tends to shine on genuinely large, analytical queries — multi-table joins, heavy aggregation, data that does not comfortably fit in memory as a single pandas DataFrame — where its columnar, query-planning engine can be substantially faster than an equivalent chain of pandas operations. For small data and simple transformations, plain pandas is usually simpler and just as fast; reaching for DuckDB is most worthwhile once a query starts to feel awkward or slow to express the pandas way.

## Interoperability with Arrow

DuckDB can consume and produce Apache Arrow tables directly, which is part of why it interoperates smoothly with Polars, Parquet, and other Arrow-aware tools without extra conversion steps — the same "shared in-memory format" idea covered in the columnar formats lesson.

## Watch out: memory-hungry joins

A join between two large tables can, in the worst case, produce a result far larger than either input (if the join key repeats heavily on both sides) — a risk that exists in any SQL engine, DuckDB included, and worth checking for with a `COUNT(*)` before running a full join on genuinely large data.

## Common mistakes

- Converting a DataFrame to something else first, out of habit, when DuckDB could query it directly by name.
- Reaching for DuckDB on small, simple data where plain pandas would already be simplest.
- Forgetting DuckDB can read files directly, and loading them into pandas first for no reason.
- Not checking a join's expected result size before running it on large tables.

## Recap

- `duckdb.sql(...)` queries a DataFrame directly by variable name, no loading step needed.
- `.fetchall()`/`.df()` convert results to plain tuples or back to a DataFrame.
- DuckDB supports full SQL, including window functions, and reads Parquet/CSV files directly.
- It tends to beat pandas on large, complex analytical queries; small data usually does not need it.

## Your turn

In the **Practice** tab you write `duck_top5(df)`. Then three challenges use real flight data.
