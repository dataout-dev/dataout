A single train/test split gives one estimate of performance, which depends partly on the luck of exactly which rows landed in the test set. Cross-validation averages over several splits, for a more stable estimate.

You will learn:

- `train_test_split`, with `stratify` and a seed
- k-fold and stratified k-fold cross-validation
- `cross_val_score`
- choosing an evaluation metric

## train_test_split

```python
from sklearn.model_selection import train_test_split

X = [[1], [2], [3], [4], [5], [6], [7], [8]]
y = [0, 0, 0, 0, 1, 1, 1, 1]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)
print(len(X_train), len(X_test))
```

`random_state` fixes the shuffle, so the same split can be reproduced later — essential for comparing models fairly and for grading in this playground.

## stratify

```python
from sklearn.model_selection import train_test_split

X = list(range(20))
y = [0] * 18 + [1] * 2
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=0, stratify=y)
print(y_test.count(1))
```

Without `stratify`, a random split of an imbalanced dataset (only 2 examples of class `1` here) could easily put both, or neither, of the rare class into the test set. `stratify=y` keeps the same class proportions in both the train and test sets.

## k-fold cross-validation

```python
from sklearn.model_selection import KFold

X = list(range(10))
kf = KFold(n_splits=5)
for train_idx, test_idx in kf.split(X):
    print(list(test_idx))
```

k-fold cross-validation splits the data into `k` equal-sized folds, using each one as the test set exactly once (with the other `k - 1` as training), giving `k` separate performance estimates to average.

## Stratified k-fold

```python
from sklearn.model_selection import StratifiedKFold

X = list(range(10))
y = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1]
skf = StratifiedKFold(n_splits=3)
for train_idx, test_idx in skf.split(X, y):
    print([y[i] for i in test_idx])
```

`StratifiedKFold` keeps class proportions consistent across every fold — the classification default in scikit-learn's `cross_val_score`, for exactly the imbalance reason `stratify` addresses in a plain split.

## cross_val_score

```python
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression

X = [[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]]
y = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
model = LogisticRegression(max_iter=1000)
scores = cross_val_score(model, X, y, cv=5)
print(scores)
print(scores.mean())
```

`cross_val_score` handles the fold-splitting, fitting and scoring in one call, returning one score per fold — averaging them is the usual summary, though looking at the individual fold scores (are they all similar, or wildly different?) is worth doing too.

## Choosing a metric

`cross_val_score`'s default metric depends on the model type (accuracy for a classifier, R-squared for a regressor); the `scoring=` argument switches to something else (`"precision"`, `"neg_mean_squared_error"`, and many more) when accuracy or R-squared is not actually the number that matters most for the task.

## Watch out: leaking test data during tuning

Using cross-validation to pick a model or hyperparameters, then reporting **that same cross-validation score** as the final result, is subtly optimistic — the score was already used to make a choice. A separate, untouched test set (or a nested cross-validation, covered in a later lesson) is needed for a genuinely honest final number.

## Common mistakes

- Splitting an imbalanced dataset without `stratify`, risking a test set with almost none of the rare class.
- Reporting a cross-validation score that was also used to choose the model or its hyperparameters.
- Comparing two models on different random splits, rather than the same folds.
- Forgetting `random_state`, and getting a different, non-reproducible split each run.

## Recap

- `random_state` makes a split reproducible; `stratify` keeps class balance consistent in imbalanced data.
- k-fold (or stratified k-fold, for classification) cross-validation averages over several splits for a steadier estimate.
- `cross_val_score` handles the whole fold loop in one call.
- A score used to choose a model cannot honestly be reported as that model's final, unbiased performance.

## Your turn

In the **Practice** tab you write `cv_accuracy(X, y)`. Then three challenges use real data.
