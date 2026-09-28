Real data needs preparation before most models can use it: missing values filled, categories encoded, numbers scaled. A `Pipeline` bundles every step together so the whole thing fits (and predicts) as one unit — and, critically, avoids leaking test data into that preparation.

You will learn:

- `StandardScaler` and `MinMaxScaler`
- `OneHotEncoder` and `OrdinalEncoder`
- imputers
- `ColumnTransformer` for different columns needing different treatment
- `Pipeline`, and why it prevents leakage

## Scaling

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

X = [[1], [2], [3], [100]]
print(StandardScaler().fit_transform(X).ravel())
print(MinMaxScaler().fit_transform(X).ravel())
```

`StandardScaler` centres to mean 0 and scales to standard deviation 1; `MinMaxScaler` rescales into a fixed range (`[0, 1]` by default). Which one is more appropriate depends on the model — distance-based methods (like k-means or k-NN) and anything regularised generally need one of the two; tree-based models do not need scaling at all.

## Encoding categories

```python
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder

X = [["red"], ["blue"], ["red"], ["green"]]
print(OneHotEncoder(sparse_output=False).fit_transform(X))

sizes = [["small"], ["large"], ["medium"]]
print(OrdinalEncoder(categories=[["small", "medium", "large"]]).fit_transform(sizes))
```

`OneHotEncoder` turns each category into its own 0/1 column, appropriate when categories have no real order (colours). `OrdinalEncoder` maps categories to numbers, appropriate only when they genuinely have one (small/medium/large) — using it on an unordered category would falsely imply one exists.

## Imputers

```python
from sklearn.impute import SimpleImputer

X = [[1.0], [2.0], [None], [4.0]]
print(SimpleImputer(strategy="mean").fit_transform(X).ravel())
print(SimpleImputer(strategy="median").fit_transform(X).ravel())
```

`SimpleImputer` fills missing values with a chosen strategy (mean, median, most frequent, or a constant) — the same idea as pandas' `fillna`, but as a fittable, pipeline-friendly step.

## ColumnTransformer

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

X = [[25, "red"], [30, "blue"], [45, "red"]]
transformer = ColumnTransformer([
    ("scale", StandardScaler(), [0]),
    ("encode", OneHotEncoder(sparse_output=False), [1]),
])
print(transformer.fit_transform(X))
```

Real data usually needs **different** treatment for different columns at once; `ColumnTransformer` applies each named transformer to its own list of columns, combining the results into one array.

## Pipeline

```python
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

X_train = [[1.0], [2.0], [None], [8.0], [9.0], [None]]
y_train = [0, 0, 0, 1, 1, 1]
pipe = Pipeline([
    ("impute", SimpleImputer()),
    ("scale", StandardScaler()),
    ("model", LogisticRegression()),
])
pipe.fit(X_train, y_train)
print(pipe.predict([[5.0]]))
```

A `Pipeline` chains steps so that calling `.fit(X_train, y_train)` fits every step **in order**, each one learning only from the training data passed through it — and `.score`/`.predict` on new data automatically applies every transform step (with parameters already learned from training) before the final model sees it.

## Watch out: fitting transformers on all data

```python
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

X = [[1.0], [2.0], [3.0], [100.0], [101.0], [102.0]]
X_train, X_test = train_test_split(X, test_size=0.33, random_state=0, shuffle=False)

leaky_scaler = StandardScaler().fit(X)
safe_scaler = StandardScaler().fit(X_train)
print(leaky_scaler.transform(X_test))
print(safe_scaler.transform(X_test))
```

Fitting the scaler on `X` (everything, including the test rows) lets the test data's own statistics influence how it gets scaled — a `Pipeline`, combined with correctly calling `.fit` only on the training split, avoids this by construction.

## Common mistakes

- Using `OrdinalEncoder` on categories with no real order, implying a relationship that is not there.
- Fitting a `ColumnTransformer` or scaler on the full dataset instead of the training split.
- Forgetting that tree-based models generally do not need feature scaling at all.
- Building preprocessing steps as separate, manual calls instead of one `Pipeline`, risking a step being applied inconsistently between training and prediction.

## Recap

- Scalers and encoders each address a different need: numeric range, categorical order (or lack of it), and missing values.
- `ColumnTransformer` applies different preprocessing to different columns in one step.
- `Pipeline` chains every step together, fitting each one only on the data it is given.
- Fit every preprocessing step on training data only — the same leakage risk covered in the ML concepts lesson.

## Your turn

In the **Practice** tab you write `make_pipeline_score(X_train, y_train, X_test, y_test)`. Then three challenges use real data.
