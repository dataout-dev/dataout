Beyond plain numbers, NumPy has dtypes for dates, and a way to store rows with **named, differently-typed fields** in one array.

You will learn:

- integer, float, bool and string dtypes, and `astype`
- structured arrays
- `datetime64` and `timedelta64`
- `nan` and masked arrays

## astype

```python
import numpy as np

a = np.array([1.7, 2.3, 3.9])
print(a.astype(int))
print(a.astype(str))
```

`astype` converts to a new dtype, **truncating** (not rounding) when going from float to int.

## Structured arrays

A structured array stores rows with named fields of different types, like a tiny, fixed-schema table:

```python
import numpy as np

dt = np.dtype([("name", "U10"), ("age", "i4")])
people = np.array([("Ada", 36), ("Grace", 85)], dtype=dt)
print(people["name"])
print(people["age"])
print(people[0])
```

`"U10"` means "Unicode string, up to 10 characters"; `"i4"` means "4-byte integer". Fields are accessed by name, like dictionary keys.

## datetime64 and timedelta64

```python
import numpy as np

d = np.array(["2024-01-01", "2024-02-15"], dtype="datetime64[D]")
print(d)
print(d[1] - d[0])
print(d + np.timedelta64(10, "D"))
```

`datetime64[D]` stores whole days; other units (`"s"`, `"ns"`, `"M"`, `"Y"`, ...) are available too. Subtracting two dates gives a `timedelta64`; adding a `timedelta64` shifts a date.

```python
import numpy as np

print(np.busday_count("2024-01-01", "2024-01-08"))
print(np.is_busday("2024-01-06"))
```

`np.busday_count` and `np.is_busday` understand weekends (Monday to Friday counts as business days by default), which is exactly what a naive day-count subtraction does not.

## Watch out: NaN in integer arrays

<!-- expect-error -->
```python
import numpy as np

np.array([1, 2, None], dtype=int)
```

`nan` is a special **floating-point** value; there is no equivalent for integers, so this raises `TypeError`. If a numeric column might have missing values, it needs a float dtype (where `None` becomes `nan` automatically) or a nullable/masked representation instead.

## A glance at masked arrays

```python
import numpy as np
import numpy.ma as ma

a = ma.masked_array([1, 2, -999, 4], mask=[False, False, True, False])
print(a.mean())
```

`numpy.ma` marks specific entries as missing without needing a float `nan`, and aggregations automatically ignore masked entries — an older alternative to `nan`-aware functions, still occasionally seen in the wild.

## Common mistakes

- Trying to put `None`/`nan` into an integer array directly, instead of switching to a float dtype.
- Doing plain calendar-day subtraction on dates when the real question was about **business** days.
- Forgetting that `astype(int)` truncates toward zero rather than rounding.
- Choosing a structured-array string field too short for the real data, silently truncating it.

## Recap

- `astype` converts dtypes, truncating float-to-int conversions.
- Structured arrays give named, typed fields in one array, like tiny fixed-schema rows.
- `datetime64`/`timedelta64` support date arithmetic; `busday_count`/`is_busday` understand weekends.
- Integer arrays cannot hold `nan`; missing numeric data needs a float dtype (or a masked array).

## Your turn

In the **Practice** tab you write `business_days(a, b)`. Then three challenges use real dates.
