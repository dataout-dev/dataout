A price stored as `"$1,200.00"` is not a number yet, no matter how number-shaped it looks. And once you do turn it into a real number, the single highest value in the column is not automatically a mistake — sometimes it's the most interesting row in the whole dataset.

You will learn:

- why a column can "look like" numbers while still being text
- a reliable pattern for parsing messy numeric-as-text columns
- the 1.5×IQR rule for flagging outliers (a callback to the Statistics path)
- why flagging an outlier and deleting it are two very different decisions

## Numbers that are secretly text

Real-world exports are full of numbers dressed up as text for human readability: a currency symbol, a thousands separator, a unit suffix.

```text
"$1,200.00"   ->  1200.0
"40.00K"      ->  40000.0
"2.00M"       ->  2000000.0
```

Each of these needs its own small parsing step before you can do arithmetic on it — strip the symbol, remove separators, and (for the K/M suffix case) multiply by the right factor. Skip this and pandas will either refuse outright (a clean type error) or, worse, silently keep the column as text and let you accidentally compare `"$80.00" > "$9.00"` as a *string* comparison, which does not do what you think it does.

## Finding outliers: the 1.5×IQR rule

Once a column is a real number, you can ask whether any values are unusually extreme. The rule used throughout this site's Statistics path works here too: compute the interquartile range (Q3 − Q1), then flag anything below `Q1 - 1.5*IQR` or above `Q3 + 1.5*IQR` as an outlier.

```text
q1, q3 = df["price"].quantile([0.25, 0.75])
iqr = q3 - q1
lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
outliers = df[(df["price"] < lo) | (df["price"] > hi)]
```

This is a rule of thumb, not a law — it flags candidates worth a human look, not a verdict.

## An outlier is a question, not an answer

Finding an extreme value is the start of an investigation, not the end of one. It might be:

- **A data entry error** — a misplaced decimal, an extra zero, a unit mix-up (dollars entered as cents).
- **A genuinely real, important extreme case** — the one listing that really is a luxury property, the one order that really was a bulk purchase.
- **A different population mixed into the same column** — commercial accounts accidentally included alongside individual customers, for instance.

Only the first of these is actually "wrong" and worth correcting or removing. The other two are real information — deleting them because they're inconvenient quietly biases your analysis toward only the typical case, which is sometimes exactly the thing you were supposed to be looking for.

## Common mistakes

- Trying to compute statistics on a numeric-looking column before confirming it actually parsed as a number.
- Treating every flagged outlier as an error to delete, without looking at even one of them first.
- Forgetting that parsing a messy column (stripping a "$" or a "K" suffix) needs to handle the *missing* values in that same column too, not just the well-formed ones.
- Using the 1.5×IQR rule on a column that is naturally skewed (like income or company size) without recognizing that "outlier" there often just means "the long tail this kind of data always has."
