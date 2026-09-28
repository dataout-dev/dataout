Beyond the numeric/text/boolean basics, pandas has a few specialised dtypes worth knowing about before they surprise you: `category`, the nullable numeric/boolean/string types, and newer Arrow-backed columns.

You will learn:

- numeric downcasting with `astype`
- the `category` dtype, and why it helps memory and ordering
- nullable integer, boolean and string dtypes
- Arrow-backed dtypes, briefly
- `errors="coerce"`, and the hidden danger of `object` columns

## Downcasting

```python
import pandas as pd

s = pd.Series([1, 2, 3])
print(s.dtype)
print(s.astype("int8").dtype)
print(s.astype("float32").dtype)
```

A smaller numeric type uses less memory per value, at the cost of a smaller representable range (or less precision for floats) — safe only when the real data is known to fit comfortably.

## category

```python
import pandas as pd

s = pd.Series(["A", "B", "A", "A", "C"] * 1000)
print(s.memory_usage(deep=True))
print(s.astype("category").memory_usage(deep=True))
```

A column with a small number of distinct values, repeated many times, uses far less memory as `category`: each distinct value is stored once, and every row just holds a small integer code pointing at it. `category` can also be given an explicit, meaningful **order** (for example, `"low" < "medium" < "high"`), which plain text cannot express.

## Nullable dtypes

```python
import pandas as pd

s = pd.Series([1, 2, None], dtype="Int64")
print(s)
print(s.isna())
```

Plain NumPy-backed `int64` has no way to represent "missing" at all — pandas has traditionally solved this by upcasting a column with a missing integer to `float64` (so it can hold `NaN`), which is surprising if you were not expecting a whole-number column to suddenly become floating point. The nullable `"Int64"` (capital I), `"boolean"` and `"string"` dtypes hold real missing values (`pd.NA`) directly, without that silent upcast.

## Arrow-backed dtypes, briefly

Recent pandas versions can back a column with Apache Arrow's columnar memory format instead of NumPy, particularly worthwhile for `string` columns, which Arrow can store and process considerably faster. You will meet this as a `dtype_backend="pyarrow"` option on a reader function, or an explicit `astype("string[pyarrow]")`, without needing to change anything else about how you use the column.

## errors="coerce"

```python
import pandas as pd

s = pd.Series(["1", "2", "not a number"])
print(pd.to_numeric(s, errors="coerce"))
```

`errors="coerce"` turns any value that cannot be converted into `NaN`, instead of raising — useful once you have already decided that a genuinely unparseable entry should simply become "missing".

## Watch out: object columns hiding mixed types

```python
import pandas as pd

s = pd.Series([1, "two", 3.0, None])
print(s.dtype)
print([type(v).__name__ for v in s])
```

`object` is pandas' catch-all dtype for anything that does not fit a single, uniform, recognised type. It happily stores an `int`, a `str`, a `float` and `None` side by side in the very same column — a real source of confusing bugs later, when code that assumed "this column is all numbers" meets the one row that is not.

## Common mistakes

- Downcasting a numeric column without checking that every real value actually fits the smaller type.
- Reading a column with missing integers and being surprised it silently became `float64`, instead of reaching for a nullable dtype on purpose.
- Assuming an `object` column is uniformly typed just because most of it "looks like" numbers or text.
- Forgetting that `category` needs `.cat.reorder_categories(...)` (or an explicit `ordered=True` category) to actually compare in a meaningful order, not just alphabetically.

## Recap

- Downcasting trades memory for a smaller representable range; check the data actually fits first.
- `category` stores few, repeated values efficiently and can carry a real order.
- Nullable `"Int64"`/`"boolean"`/`"string"` dtypes hold `pd.NA` directly, avoiding a silent upcast to float.
- `object` columns can silently mix real Python types; do not assume uniformity just because it usually holds one kind of value.
