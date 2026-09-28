Linear and logistic regression are the two workhorses to reach for first: simple, fast, interpretable, and a strong baseline before trying anything more complex.

You will learn:

- fit, predict and score
- reading coefficients and the intercept
- regularisation with Ridge and Lasso
- logistic regression's probabilities and thresholds

## fit, predict, score

```python
from sklearn.linear_model import LinearRegression

X_train = [[1], [2], [3], [4]]
y_train = [2, 4, 6, 8]
model = LinearRegression()
model.fit(X_train, y_train)
print(model.predict([[5], [6]]))
print(model.score([[5], [6]], [10, 12]))
```

`fit` learns the model's parameters from training data; `predict` applies it to new inputs; `score` (R-squared, for a regressor) evaluates it against known correct answers.

## Coefficients and intercept

```python
from sklearn.linear_model import LinearRegression

X = [[1], [2], [3], [4]]
y = [3, 5, 7, 9]
model = LinearRegression().fit(X, y)
print(model.coef_, model.intercept_)
```

`coef_` is the learned slope(s) — one per feature; `intercept_` is the constant term. Together they say exactly what line (or hyperplane, with more features) the model fits.

## Regularisation: Ridge and Lasso

```python
from sklearn.linear_model import Ridge, Lasso

X = [[1, 1], [2, 2.1], [3, 2.9], [4, 4.2]]
y = [2, 4, 6, 8]
ridge = Ridge(alpha=1.0).fit(X, y)
lasso = Lasso(alpha=1.0).fit(X, y)
print(ridge.coef_)
print(lasso.coef_)
```

Both add a penalty for large coefficients, which helps when features are correlated or there are many of them relative to the data. Ridge shrinks coefficients smoothly toward zero; Lasso can push some **exactly** to zero, effectively selecting a subset of features.

## Watch out: unscaled features with regularisation

```python
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler

X = [[1, 1000], [2, 2000], [3, 2900], [4, 4200]]
y = [2, 4, 6, 8]
raw = Ridge(alpha=1.0).fit(X, y)
scaled_X = StandardScaler().fit_transform(X)
scaled = Ridge(alpha=1.0).fit(scaled_X, y)
print(raw.coef_)
print(scaled.coef_)
```

The penalty term treats every coefficient's *size* equally, but a feature measured in the thousands naturally needs a much smaller coefficient than one measured in single digits — without scaling first, regularisation ends up penalising features unevenly, in a way that has nothing to do with how useful they actually are.

## Logistic regression: probabilities and thresholds

```python
from sklearn.linear_model import LogisticRegression

X = [[1], [2], [3], [8], [9], [10]]
y = [0, 0, 0, 1, 1, 1]
model = LogisticRegression().fit(X, y)
print(model.predict_proba([[5]]))
print(model.predict([[5]]))
```

`predict_proba` returns a probability for each class; `predict` applies the default 0.5 threshold to turn that into a hard 0/1 decision. For an imbalanced problem, or one where false positives and false negatives cost differently, choosing a different threshold on `predict_proba`'s output (rather than accepting the default 0.5) is often the right move.

## Multiclass logistic regression

```python
from sklearn.linear_model import LogisticRegression

X = [[1], [2], [10], [11], [20], [21]]
y = [0, 0, 1, 1, 2, 2]
model = LogisticRegression().fit(X, y)
print(model.predict([[1.5], [10.5], [20.5]]))
```

scikit-learn's `LogisticRegression` handles more than two classes automatically, without any extra setup.

## Common mistakes

- Applying Ridge/Lasso regularisation to unscaled features with very different natural ranges.
- Treating `predict`'s default 0.5 threshold as the only option, when the task's costs argue for a different one.
- Reading a coefficient's size as "importance" without checking the features were on comparable scales first.
- Choosing Lasso expecting exact zeros, then being confused when strongly correlated features split the effect between them instead.

## Recap

- `fit`/`predict`/`score` is the standard scikit-learn workflow for any estimator.
- Ridge shrinks coefficients smoothly; Lasso can zero some out entirely, acting like feature selection.
- Scale features before regularising, so the penalty treats every feature's contribution fairly.
- `predict_proba` gives probabilities; `predict`'s 0.5 threshold is a default, not a law.

## Your turn

In the **Practice** tab you write `fit_lr(X_train, y_train, X_test, y_test)`. Then three challenges use real data.
