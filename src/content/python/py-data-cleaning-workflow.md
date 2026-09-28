Cleaning real data is not a fixed recipe — it is a small, repeatable workflow: look first, decide deliberately, and keep a record of what you did and why.

You will learn:

- profiling data before touching it
- standardising column names and types early
- fixing dates and handling duplicates and outliers
- documenting decisions, and keeping raw and clean copies separate

## Profile first

```python
import pandas as pd

df = pd.DataFrame({"Name ": ["Ada", "Grace", None], "Score": ["95", "88", "N/A"]})
print(df.info())
print(df.isna().sum())
```

Before writing a single cleaning line, look at the shape, the dtypes, and how much is missing — this tells you what actually needs fixing, rather than guessing.

## Standardise names and types early

```python
import pandas as pd

df = pd.DataFrame({"Name ": ["Ada", "Grace"], "Score": ["95", "88"]})
df.columns = df.columns.str.strip().str.lower()
df["score"] = pd.to_numeric(df["score"], errors="coerce")
print(df)
print(df.dtypes)
```

Trailing spaces, inconsistent casing, and numbers stored as text are exactly the kind of small inconsistencies worth fixing **once**, right away, instead of working around them in every later step.

## Fixing dates

```python
import pandas as pd

s = pd.Series(["2024-01-05", "01/20/2024", "not a date"])
print(pd.to_datetime(s, errors="coerce"))
```

Mixed date formats and genuinely unparseable text both need a decision: `errors="coerce"` turns anything unreadable into `NaT` (missing) rather than crashing, but it is worth checking **how many** rows that actually affects before moving on.

## Handling duplicates and outliers

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 2, 2], "value": [10, 500, 20]})
print(df.duplicated(subset=["id"]).sum())
print(df["value"].describe())
```

A duplicate check and a quick `.describe()` (looking at the min/max relative to the quartiles) are cheap first passes for two of the most common data problems — repeated rows, and a handful of implausible values.

## Documenting decisions

Every cleaning choice — "cancelled flights have no `dep_time`, so we treat a missing `dep_time` as cancelled, not as an error", "we dropped 12 rows with an impossible negative price" — is a judgement call, and it should be written down (a comment, a short markdown cell, a line in a report) so anyone reading the result later, including your future self, knows what happened and why.

## Keeping raw and clean copies

```python
import pandas as pd

raw = pd.DataFrame({"score": ["95", "88", "n/a"]})
clean = raw.copy()
clean["score"] = pd.to_numeric(clean["score"], errors="coerce")
print(raw)
print(clean)
```

`raw` never changes; every cleaning step builds `clean` from it. If a later step turns out to be a mistake, you redo it from `raw`, not from an already-damaged intermediate version.

## Watch out: silent row loss

```python
import pandas as pd

df = pd.DataFrame({"a": [1, None, 3], "b": [4, 5, None]})
before = len(df)
cleaned = df.dropna()
print(f"dropped {before - len(cleaned)} of {before} rows")
```

Reporting **how many** rows a cleaning step actually removed (not just performing the drop silently) turns an invisible side effect into something you can sanity-check.

## Common mistakes

- Cleaning before profiling, and fixing problems that were never actually there.
- Forgetting to check how many rows `errors="coerce"` quietly turned into missing values.
- Editing the raw data in place, losing the ability to redo a step differently later.
- Dropping duplicates or outliers without recording how many, or why.

## Recap

- Profile first: shape, dtypes, missing values, before any cleaning code.
- Standardise column names and types early, once, rather than working around inconsistencies repeatedly.
- Keep a raw copy untouched; build the clean version from it, documenting each real decision.
- Report the size of every cleaning step's effect, so nothing is silently lost.
