Every real dataset you will ever open is a stranger. Before you trust a single number it produces, you owe it three boring questions: how big is this, what type is each column, and what does one row actually mean?

You will learn:

- how to check a dataset's shape and dtypes before anything else
- why a numeric-looking column sometimes loads as text
- what a row actually represents (the "grain" of the data)
- why profiling comes before missingness, duplicates or outliers

## Shape first

```text
df.shape          # (rows, columns)
df.dtypes         # one type per column
df.head()         # a few real rows
```

Three lines, and already you know more than most people bother to check. `shape` tells you the scale you're working at — "12 missing values" means something very different in a dataset of 50 rows versus 500,000. `dtypes` tells you how pandas interpreted each column. `head()` lets you eyeball a few actual rows instead of reasoning about the dataset in the abstract.

## When a number isn't a number

A column that should obviously be numeric — a price, an age, a count — sometimes loads with dtype `object` (pandas' catch-all for "not a clean numeric or date type"). That is never an accident. Somewhere in that column is a value that isn't a clean number: a stray `"$"`, a `"?"` placeholder, a thousands comma, a unit suffix like `"40.00K"`. pandas infers a column's type from *everything* in it — one bad apple and the whole column becomes text.

This is worth checking immediately, because it changes what you can do next. You cannot take the mean of a text column. You cannot compare "40.00K" to 50000 and get a sensible answer. Profiling dtypes up front saves you from a confusing error three steps later when you finally try to do math on it.

## What is a row, really?

Before computing anything, ask what one row represents. A row in a flight dataset is one flight. A row in a retail dataset might be one invoice *line item* — meaning one order with five products becomes five rows, not one. Get this wrong and every aggregate you compute downstream is subtly off (counting "orders" by counting rows would wildly overcount them).

This matters more than it sounds like it should. A huge share of real analysis mistakes — double-counting, averaging the wrong thing, joining on the wrong key — trace back to a wrong assumption about what a row means, made in the first five minutes and never revisited.

## Why this comes first

Every skill in the rest of this path — finding missing values, spotting duplicates, catching outliers — is really just a sharper follow-up question once you already know the shape of a clean row. You cannot notice that a value is *missing* if you don't know what *present* looks like. You cannot spot a *duplicate* without first knowing what makes two rows "the same thing twice." Profiling is the step that makes everything after it possible.

## Common mistakes

- Jumping straight to a chart or a statistic before checking shape and dtypes — you end up debugging a type error instead of learning something.
- Assuming a column's name tells you its meaning without checking a few real values (a column called `price` is not guaranteed to contain prices you can do math on yet).
- Treating "what is a row" as obvious — it rarely is, especially in transactional or multi-table data.
- Profiling once and never again — a dataset with multiple tables or a dataset you've filtered needs reprofiling, since dtypes and shape can change.
