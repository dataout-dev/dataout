A workshop lesson: no new scikit-learn functions, just the whole loop — define the target, build a baseline, wrap it in a pipeline, evaluate properly, and write down the limitations honestly.

You will learn:

- defining a target from a real question
- exploring and cleaning before modelling
- building a baseline before anything fancier
- evaluating with the right split and metric
- error analysis and stating limitations

## Define the target

"Predict penguin species from body measurements" is a real, well-posed classification target. "Predict whether a song will be popular" is vaguer — popular by what measure, at what threshold? Turning a fuzzy real-world question into one specific column to predict is the first, and often most important, step.

## Explore and clean

```python
import pandas as pd

df = pd.DataFrame({
    "bill_length_mm": [39.1, 39.5, None, 46.5],
    "species": ["Adelie", "Adelie", "Adelie", "Gentoo"],
})
print(df.isna().sum())
print(df["species"].value_counts())
```

Checking missingness and class balance before modelling avoids surprises later — a rare class needs `stratify`; a heavily missing column needs a decision (impute, or drop it) made deliberately, not by accident.

## A baseline first

```python
from sklearn.dummy import DummyClassifier

X = [[1], [2], [3], [4]]
y = [0, 0, 0, 1]
baseline = DummyClassifier(strategy="most_frequent")
baseline.fit(X, y)
print(baseline.score(X, y))
```

`DummyClassifier` (or `DummyRegressor`) predicts using a trivial rule (the most frequent class, here) with no real learning at all — any real model needs to clearly beat this baseline to prove it is actually learning something, not just exploiting an imbalanced target.

## A pipeline

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X = [[39.1, 3750], [39.5, 3800], [46.5, 5200], [46.1, 5400], [40.3, 3250], [45.2, 5000]]
y = ["Adelie", "Adelie", "Gentoo", "Gentoo", "Adelie", "Gentoo"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=0, stratify=y)
pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression())])
pipe.fit(X_train, y_train)
print(pipe.score(X_test, y_test))
```

Wrapping every preprocessing step and the model together in one `Pipeline` keeps the whole workflow reproducible and avoids leaking test data, exactly as covered in the preprocessing lesson.

## Evaluate properly

A single train/test split gives one number; cross-validation gives a steadier one. Whichever is used, the metric should match the real question — accuracy for a roughly balanced classification target, precision/recall/F1 for an imbalanced one, RMSE or R-squared for a regression target.

## Error analysis

```python
from sklearn.metrics import confusion_matrix

y_true = ["Adelie", "Adelie", "Gentoo", "Gentoo", "Chinstrap"]
y_pred = ["Adelie", "Chinstrap", "Gentoo", "Gentoo", "Chinstrap"]
labels = ["Adelie", "Chinstrap", "Gentoo"]
print(confusion_matrix(y_true, y_pred, labels=labels))
```

Looking at *which* mistakes a model makes (which pair of classes gets confused, which kind of row is hardest) is usually more useful for deciding what to try next than the overall accuracy number alone.

## Writing up the limitations

A short, honest note on what the model does not do well — which class it confuses most, how much data it was trained on, whether the features available are really enough to answer the question fully — is part of a finished piece of work, not an admission of failure. It is what lets someone else (including a future you) trust the result appropriately instead of over-relying on it.

## Common mistakes

- Building a complex model before ever checking a trivial baseline's score.
- Reporting only accuracy on an imbalanced target.
- Skipping error analysis and reporting only one summary metric.
- Leaving out limitations, giving a false impression the model is more reliable than it is.

## Recap

- Turn a vague question into one precise, codeable target before modelling anything.
- A `DummyClassifier`/`DummyRegressor` baseline is the bar any real model needs to clear.
- A `Pipeline` keeps preprocessing and modelling together, evaluated with a metric that matches the real question.
- Error analysis and a stated set of limitations are part of the finished result, not optional extras.

## Your turn

In the **Practice** tab you write `species_model(df)`. Then three challenges use the real penguins data.
