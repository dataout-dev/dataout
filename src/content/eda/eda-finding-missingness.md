`NaN` is the easy case. Real datasets hide missing values in far sneakier places — a literal `"?"`, an empty string, a `"N/A"`, a `-200` sentinel standing in for "the sensor didn't report anything." If you only check for `NaN`, you will miss most of it.

You will learn:

- how to count genuine nulls in a column
- why "missing" sometimes looks like a perfectly normal value
- how to check for sentinel values on purpose, not by accident
- why the right response to missingness is a decision, not a reflex

## The easy 80%: real nulls

```text
df.isna().sum()        # null count per column
df["col"].isna().sum() # for one column
```

`.isna()` catches `None` and `NaN` — the cases where the data format itself has a concept of "nothing here." This is the missingness you'll find immediately, and it's usually the smaller problem.

## The sneaky 20%: disguised missingness

Some datasets never use a real null at all. The 1994 US Census data used later in this section's projects marks missing `workclass`, `occupation` and `native_country` values with the literal string `"?"` — and a null-count check on that column reports **zero** missing values, because there genuinely are none; the "missing" values are a normal-looking string instead.

Other common disguises:
- An empty string `""` (looks blank, is not technically null)
- A placeholder like `"N/A"`, `"none"`, `"unknown"`, `"not-applicable"`
- A sentinel number like `-1`, `-200`, or `9999` standing in for "no reading"

None of these show up in `.isna().sum()`. You have to go looking for them — usually by printing a column's unique values (`df["col"].unique()`) and asking "does any one of these look like it's standing in for 'nothing'?"

## Why this is a decision, not a reflex

Once you've found missing values — real or disguised — the next step is not automatically "fill them in" or "drop the rows." Each option has a cost:

- **Drop the rows.** Simple, but if 25% of a column is missing, you just threw away a quarter of your data — and if the missingness isn't random (maybe certain customer types never share a value), you've also biased what's left.
- **Fill with a placeholder** (a median, a mode, an explicit "unknown" category). Keeps the row, but every filled value is now a guess dressed up as data, and downstream statistics computed on that column are quietly less trustworthy.
- **Leave it missing, and only exclude it from calculations that specifically need that column.** Often the most honest option — but it means a dataset-wide row count and a per-column count can legitimately differ.

There is no universally correct choice. The point of this lesson is to make the decision *visible and deliberate*, instead of an unexamined default.

## Common mistakes

- Trusting `.isna().sum()` as the complete missingness picture without checking for disguised sentinels.
- Silently dropping every row with any missing value, without checking how much data (and which rows) that actually removes.
- Filling missing values with 0 by default, even when 0 is a real, meaningful value elsewhere in that same column.
- Forgetting that a "fixed" column still carries the scars of its original missingness — filled values should usually be flagged, not treated as equally trustworthy as the real ones.
