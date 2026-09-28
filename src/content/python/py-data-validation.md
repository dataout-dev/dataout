Validation turns "I think this data is fine" into something checked and provable: explicit rules a frame either passes or fails, run every time, instead of trusted by assumption.

You will learn:

- writing assertions and checks on a DataFrame
- uniqueness, range and referential checks
- collecting a validation report instead of stopping at the first problem
- failing loudly, on purpose

## A simple assertion

```python
import pandas as pd

df = pd.DataFrame({"price": [10.0, 20.0, 5.0]})
assert (df["price"] >= 0).all(), "found a negative price"
print("all prices are valid")
```

<!-- expect-error -->
```python
import pandas as pd

df = pd.DataFrame({"price": [10.0, 20.0, -5.0]})
assert (df["price"] >= 0).all(), "found a negative price"
print("never reached")
```

`assert condition, message` raises `AssertionError` with the given message the moment `condition` is false — a quick way to fail loudly the instant a rule is broken, rather than continuing on bad data.

## Uniqueness checks

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 2, 2, 3]})
print(df["id"].is_unique)
print(df["id"].duplicated().sum())
```

## Range checks

```python
import pandas as pd

df = pd.DataFrame({"age": [25, -3, 150, 40]})
valid_range = df["age"].between(0, 120)
print(df[~valid_range])
```

## Referential checks

```python
import pandas as pd

orders = pd.DataFrame({"customer_id": [1, 2, 99]})
customers = pd.DataFrame({"id": [1, 2, 3]})
unknown = ~orders["customer_id"].isin(customers["id"])
print(orders[unknown])
```

A referential check confirms that a value which is supposed to point somewhere else (a foreign key, in database terms) actually does — the same idea `merge`'s `validate=` checks for, applied directly.

## Collecting a report, not stopping at the first problem

```python
import pandas as pd

def validate(df):
    problems = []
    if df["id"].isna().any():
        problems.append("nulls in id")
    if df["id"].duplicated().any():
        problems.append("duplicate ids")
    if (df["price"] < 0).any():
        problems.append("negative price")
    return problems

df = pd.DataFrame({"id": [1, 1, None], "price": [10.0, -5.0, 20.0]})
print(validate(df))
```

A function that returns a **list** of every problem found (rather than raising on the very first one) gives a complete picture in one run — often far more useful than fixing one issue, re-running, and discovering the next.

## Failing loudly

Whether a validation failure should raise an exception (stopping a pipeline immediately) or just log a warning (letting it continue with a flagged, imperfect result) is a real design decision — but *silently* letting bad data through, with no check at all, is rarely the right choice either way.

## Common mistakes

- Checking a condition once by eye and trusting it will always hold, instead of writing the check down as code that runs every time.
- Stopping at the first failed check when a full report would have been more useful.
- Writing a range check that does not account for missing values (`NaN` is neither inside nor outside any range).
- Validating so late in a pipeline that the bad data has already caused damage upstream.

## Recap

- `assert condition, message` fails loudly and immediately when a rule is broken.
- Uniqueness, range and referential checks cover most everyday data-quality rules.
- A function returning a **list** of problems gives a full report in one pass, not just the first failure.
- Decide deliberately whether a failed check should stop a pipeline or just be logged — never leave it unchecked.

## Your turn

In the **Practice** tab you write `validate(df)`. Then three challenges use real flight data.
