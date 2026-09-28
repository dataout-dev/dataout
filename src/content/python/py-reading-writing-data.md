Real data usually starts life as a file. `read_csv` is the workhorse; `read_json`, Parquet and SQL cover the rest of what you will meet in this tier.

You will learn:

- `read_csv` options: `dtype`, `parse_dates`, `usecols`, `na_values`, `chunksize`
- `to_csv`, and round-tripping through text
- `read_json`
- a glance at Parquet, and why encoding matters

## read_csv and its options

```python
import pandas as pd
import io

text = "name,score\nAda,95\nGrace,88\n"
df = pd.read_csv(io.StringIO(text))
print(df)
print(df.dtypes)
```

`io.StringIO` lets `read_csv` read a plain string as if it were a file, which is exactly how the exercises in this lesson build test data.

```python
import pandas as pd
import io

text = "id,score\n007,95\n042,88\n"
default_df = pd.read_csv(io.StringIO(text))
fixed_df = pd.read_csv(io.StringIO(text), dtype={"id": str})
print(default_df)
print(fixed_df)
```

## Watch out: leading zeros lost in IDs

Without `dtype={"id": str}`, pandas infers `id` as a number, and `"007"` becomes `7` — the leading zeros are gone, silently, with no warning. Any identifier that merely *looks* numeric (IDs, zip codes, phone numbers) should usually be read as text on purpose.

## Useful read_csv options

```python
import pandas as pd
import io

text = "date,amount\n2024-01-01,10\n2024-01-02,NA\n"
df = pd.read_csv(io.StringIO(text), parse_dates=["date"], na_values="NA", usecols=["date", "amount"])
print(df.dtypes)
print(df)
```

`parse_dates` converts listed columns straight to real dates. `na_values` names extra strings (beyond pandas' own defaults) that should count as missing. `usecols` reads only the columns you actually need, which matters for very wide files.

For files too large to hold in memory at once, `chunksize=` turns `read_csv` into an iterator of smaller DataFrames, read one piece at a time — covered properly in a later lesson on working beyond memory.

## Writing back out

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Grace"], "score": [95, 88]})
print(df.to_csv(index=False))
```

`to_csv(index=False)` is the usual choice when the DataFrame's index is not itself meaningful data — otherwise it appears as an extra, unwanted column when the file is read back.

## read_json

```python
import pandas as pd
import io

text = '[{"name": "Ada", "score": 95}, {"name": "Grace", "score": 88}]'
df = pd.read_json(io.StringIO(text))
print(df)
```

`orient="records"` (a JSON array of objects, one per row) is the most common shape, and the default `read_json` expects.

## A glance at Parquet and SQL

Parquet is a compressed, columnar binary format — much faster to read and smaller on disk than CSV for large tabular data, at the cost of not being human-readable; `pd.read_parquet`/`to_parquet` mirror the CSV functions. Reading a SQL query straight into a DataFrame (`pd.read_sql`) is covered in the data sources section of this tier, once a database connection is available.

## Common mistakes

- Reading an ID-like column without forcing `dtype=str`, and losing leading zeros or letters that turn out to matter.
- Forgetting `index=False` on `to_csv`, then being confused by an extra unnamed column when reading it back.
- Assuming every missing-value marker is recognised automatically; unusual markers need `na_values`.
- Loading an entire huge file into memory when `usecols` or `chunksize` would have been enough.

## Recap

- `read_csv`/`to_csv` are the everyday CSV tools; `io.StringIO` lets you test them without real files.
- `dtype`, `parse_dates`, `na_values` and `usecols` shape how a file is actually parsed.
- ID-like columns need an explicit `dtype=str` to avoid silently losing leading zeros.
- `read_json` mirrors `read_csv` for JSON arrays of records; Parquet is a faster, compressed alternative for large data.

## Your turn

In the **Practice** tab you write `load(text, dtypes)`. Then three challenges round-trip real data through text.
