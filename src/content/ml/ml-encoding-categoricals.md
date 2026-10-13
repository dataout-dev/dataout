A scikit-learn model speaks exactly one language: numbers, with no gaps. Every real dataset you'll use in this section speaks a different one — text categories, and holes where a value should be. Something has to translate between them before `.fit()` can run at all.

You will learn:

- why a model can't accept a raw text column
- one-hot encoding, and why it's the standard first move
- why a `NaN` crashes a model that a human would read right past
- a reasonable default strategy for missing predictor values

## Why text breaks a model

Internally, a model like `DecisionTreeClassifier` or `LogisticRegression` is doing arithmetic — comparing numbers, computing weighted sums. A column like `"Private"`, `"Self-emp"`, `"Federal-gov"` has no inherent numeric order or distance between its values, so handing it to `.fit()` directly either raises an error or (worse) gets silently misinterpreted.

## One-hot encoding

The standard fix is to turn one categorical column into several binary (0/1) columns, one per category:

```text
import pandas as pd
pd.get_dummies(pd.Series(["red", "blue", "red", "green"]))
```

This produces three columns — `blue`, `green`, `red` — each 0 or 1, with exactly one `1` per row. The model now sees pure numbers, and the categories are represented without inventing a false sense of order between them (which you would accidentally do if you just mapped `"red"→0, "blue"→1, "green"→2` and fed that single column in instead — that implies `"green"` is somehow "more" than `"red"`, which is meaningless).

## Why missing values crash things, not just confuse them

A person reading a spreadsheet with a blank cell understands "we don't know this one" and reasons around it. A model's arithmetic has no such concept — `NaN` propagates through calculations and typically causes an outright error when you call `.fit()`. This is a harder requirement than it sounds: *every* feature column you use must be fully populated, not just "mostly populated."

## A reasonable default for missing predictors

There's no universally correct answer, but a reasonable default for a first pass: for numeric columns, fill missing values with the column's median (computed on the training set only — see the leakage lesson for why that matters); for categorical columns, either fill with the most common category or add an explicit `"missing"` category of its own. Both are simple, defensible choices for a first model — more sophisticated approaches exist, but they're not necessary to get a working pipeline running.

## Common mistakes

- Feeding a raw text column directly into `.fit()` and being confused by the resulting error.
- Label-encoding a category as a single ordered number (0, 1, 2, ...) when the categories have no real order, implying a false relationship to the model.
- Computing a fill value (like a column median) from the full dataset instead of the training set only — a subtle form of the leakage problem from the previous lesson.
- Forgetting that a brand-new category appearing only in the test set (never seen during training) needs a deliberate plan, since one-hot encoding the train and test sets separately can silently produce mismatched columns.
