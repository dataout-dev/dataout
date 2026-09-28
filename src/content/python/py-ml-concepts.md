Machine learning is, at its core, a fitting problem: find a function that maps inputs to outputs well, using examples instead of hand-written rules. This lesson lays out the vocabulary and the two failure modes worth knowing before writing any model code.

You will learn:

- features and targets
- supervised versus unsupervised learning
- training, validation and test sets
- overfitting and underfitting
- data leakage

## Features and targets

A **feature** is one measured input (a penguin's bill length, a flight's distance); the **target** is what you are trying to predict (the species, whether the flight is late). A dataset for supervised learning is a table of features plus one target column.

## Supervised versus unsupervised

**Supervised** learning has a known target for every training example: **regression** predicts a number (a price, a temperature); **classification** predicts a category (spam or not, which species). **Unsupervised** learning has no target at all — **clustering** groups similar examples together; **dimensionality reduction** (like PCA, covered later) compresses many features into fewer, while keeping as much of the real structure as possible.

## Training, validation and test sets

- **Training set**: what the model actually learns from.
- **Validation set**: used to compare choices (which model, which hyperparameters) without touching the test set.
- **Test set**: touched exactly once, at the very end, to report an honest estimate of real-world performance.

Cross-validation (the next lesson) is a way of getting validation-like feedback without permanently setting aside a separate validation set.

## Overfitting and underfitting

```python
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

rng = np.random.default_rng(0)
x = np.linspace(0, 1, 15).reshape(-1, 1)
y = np.sin(2 * np.pi * x.ravel()) + rng.normal(0, 0.1, size=15)

simple = LinearRegression().fit(x, y)
complex_model = make_pipeline(PolynomialFeatures(14), LinearRegression()).fit(x, y)

print(round(simple.score(x, y), 3))
print(round(complex_model.score(x, y), 3))
```

The very flexible (degree-14 polynomial) model fits this small training set almost perfectly — but with so few points and so much flexibility, it is very likely memorising noise rather than the real underlying curve, and would probably perform poorly on new points. The plain linear model, too simple for this curved relationship, underfits both the training data and anything new. A model with just the right amount of flexibility for the amount of data available is the target — checked by comparing training and validation/test performance, not training performance alone.

## Data leakage

```python
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

X = np.array([[1.0], [2.0], [3.0], [100.0], [101.0], [102.0]])
y = np.array([0, 0, 0, 1, 1, 1])

wrong_scaler = StandardScaler().fit(X)
X_scaled_wrong = wrong_scaler.transform(X)
X_train_wrong, X_test_wrong = train_test_split(X_scaled_wrong, test_size=0.33, random_state=0, shuffle=False)

X_train, X_test = train_test_split(X, test_size=0.33, random_state=0, shuffle=False)
right_scaler = StandardScaler().fit(X_train)
X_test_scaled_right = right_scaler.transform(X_test)

print(X_test_wrong[0])
print(X_test_scaled_right[0])
```

Fitting the scaler on the whole dataset (`wrong_scaler`) lets the test set's own values influence the mean and standard deviation used to scale it — a small leak of information from data that is supposed to be unseen. Fitting the scaler on the training data only, then applying it to the test set, is the correct order, and the numbers above genuinely differ to show it.

## Common mistakes

- Fitting any preprocessing step (scaler, imputer, encoder) before splitting into train and test.
- Judging a model only by its training performance, never checking validation or test performance.
- Reaching for a very flexible model on a very small dataset without expecting it to overfit.
- Repeatedly checking the test set while tuning choices, quietly turning it into a second validation set.

## Recap

- Features are inputs; the target is what is being predicted. Supervised learning has a target; unsupervised learning does not.
- Training, validation and test sets serve different roles — the test set is touched once, at the end.
- Overfitting memorises training noise; underfitting misses real structure — both hurt performance on new data.
- Any preprocessing step must be fit on training data only, never on the full dataset before splitting.
