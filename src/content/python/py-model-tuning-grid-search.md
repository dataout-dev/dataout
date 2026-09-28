Most models have hyperparameters — settings chosen before training, not learned from data. Grid and randomized search automate trying combinations of them, evaluated by cross-validation, so the choice is not just a guess.

You will learn:

- `GridSearchCV` and `RandomizedSearchCV`
- nested validation, briefly
- learning curves
- early stopping, briefly

## GridSearchCV

```python
from sklearn.model_selection import GridSearchCV
from sklearn.svm import SVC

X = [[0], [1], [2], [3], [7], [8], [9], [10]]
y = [0, 0, 0, 0, 1, 1, 1, 1]
param_grid = {"C": [0.1, 1, 10], "kernel": ["linear", "rbf"]}
grid = GridSearchCV(SVC(), param_grid, cv=3)
grid.fit(X, y)
print(grid.best_params_)
print(round(grid.best_score_, 3))
```

`GridSearchCV` tries **every** combination in the grid (here, `3 * 2 = 6` combinations), scoring each with cross-validation, and keeps the best. `best_params_`/`best_score_` report the winner.

## RandomizedSearchCV

```python
from sklearn.model_selection import RandomizedSearchCV
from sklearn.svm import SVC
from scipy.stats import uniform

X = [[0], [1], [2], [3], [7], [8], [9], [10]]
y = [0, 0, 0, 0, 1, 1, 1, 1]
param_dist = {"C": uniform(0.1, 10)}
search = RandomizedSearchCV(SVC(kernel="linear"), param_dist, n_iter=5, cv=3, random_state=0)
search.fit(X, y)
print(round(search.best_params_["C"], 2))
```

When the grid would be too large to try exhaustively (many hyperparameters, or continuous ranges), `RandomizedSearchCV` samples a fixed number of random combinations instead — usually finding a similarly good result far faster than a full grid.

## Nested validation, briefly

Using the *same* cross-validation both to choose hyperparameters and to report the final score is slightly optimistic (the score already influenced the choice). Nested cross-validation wraps an **outer** loop (for honest evaluation) around an **inner** loop (for tuning), so the outer test folds never influence which hyperparameters were tried — more expensive to run, but the more rigorous way to report a tuned model's real performance.

## Learning curves

```python
from sklearn.model_selection import learning_curve
from sklearn.linear_model import LogisticRegression
import numpy as np

rng = np.random.default_rng(0)
X = rng.normal(size=(200, 2))
y = (X[:, 0] + X[:, 1] > 0).astype(int)
sizes, train_scores, test_scores = learning_curve(LogisticRegression(), X, y, cv=3, train_sizes=[0.2, 0.5, 1.0])
print(sizes)
print(test_scores.mean(axis=1).round(3))
```

A learning curve plots performance against training-set size: if the training and validation scores are both low and close together, more data alone will not help much (the model itself is too simple); if training performance is high but validation performance lags well behind, more data is more likely to close that gap.

## Early stopping, briefly

Some models (gradient boosting, neural networks) train iteratively and can be told to stop as soon as validation performance stops improving, rather than running for a fixed number of iterations regardless — a practical way to avoid overfitting without needing to guess the right number of iterations in advance.

## Watch out: tuning on the test set

Running a grid search, then evaluating the winning combination on the exact same data used to score every candidate, reuses that data twice — once to pick, once to "confirm" the pick, which is not an independent check at all. The test set needs to stay untouched until the very end, exactly as in earlier lessons.

## Common mistakes

- Evaluating a tuned model's final performance on the same folds used to select it.
- Reaching for `GridSearchCV` on a huge combinatorial space where `RandomizedSearchCV` would be far more practical.
- Reading a learning curve's shape backwards — a small train/validation gap does not always mean "good", it can mean "underfitting".
- Tuning many hyperparameters at once on a small dataset, risking overfitting the tuning process itself.

## Recap

- `GridSearchCV` tries every combination; `RandomizedSearchCV` samples a fixed number, better for large search spaces.
- Nested cross-validation avoids the slight optimism of tuning and evaluating on the same folds.
- A learning curve reveals whether more data, a more flexible model, or neither would help most.
- The test set must stay untouched by any tuning decision, exactly like the base train/test rule.

## Your turn

In the **Practice** tab you write `best_params(X, y)`. Then three challenges use real data.
