Decision trees split the data on one feature at a time, repeatedly, until each region is fairly pure. Random forests and gradient boosting both combine many trees to fix a single tree's biggest weakness: how easily it overfits.

You will learn:

- decision trees, and how `max_depth` controls overfitting
- random forests, and feature importance
- gradient boosting, briefly
- interpreting feature importance carefully

## Decision trees and depth

```python
from sklearn.tree import DecisionTreeClassifier

X_train = [[1], [2], [3], [4], [5], [6], [7], [8]]
y_train = [0, 0, 0, 0, 1, 1, 1, 1]
shallow = DecisionTreeClassifier(max_depth=1, random_state=0).fit(X_train, y_train)
deep = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)
print(shallow.score(X_train, y_train))
print(deep.score(X_train, y_train))
```

A shallow tree (`max_depth=1`, a single split) is simple and unlikely to overfit, but may miss real structure; an unconstrained tree can keep splitting until every training point is perfectly classified — a strong sign of overfitting on anything but very clean, simple data. `random_state` matters here because ties between equally good splits are broken randomly.

## Random forests

```python
from sklearn.ensemble import RandomForestClassifier

X_train = [[1], [2], [3], [4], [5], [6], [7], [8]]
y_train = [0, 0, 0, 0, 1, 1, 1, 1]
forest = RandomForestClassifier(n_estimators=50, random_state=0)
forest.fit(X_train, y_train)
print(forest.score(X_train, y_train))
```

A random forest trains many trees, each on a random bootstrap sample of the data and a random subset of features at each split, then averages their votes. This combination of randomness is exactly what makes the forest far less prone to overfitting than any single deep tree.

## Feature importance

```python
from sklearn.ensemble import RandomForestClassifier

X_train = [[1, 5], [2, 4], [3, 6], [8, 5], [9, 4], [10, 6]]
y_train = [0, 0, 0, 1, 1, 1]
forest = RandomForestClassifier(n_estimators=50, random_state=0).fit(X_train, y_train)
print(forest.feature_importances_)
```

`feature_importances_` reports how much each feature contributed to reducing impurity across all the forest's splits — column 0 dominates here, because it is the one that actually separates the two classes; column 1 barely matters.

## Watch out: high-cardinality features

A feature with very many distinct values (a customer ID, say) can appear artificially "important" to a tree-based model, because it can always find a split that perfectly separates a handful of training points using that ID — a form of overfitting specific to tree-based feature importance, not a sign the feature is genuinely useful for new data.

## Gradient boosting, briefly

```python
from sklearn.ensemble import GradientBoostingClassifier

X_train = [[1], [2], [3], [4], [5], [6], [7], [8]]
y_train = [0, 0, 0, 0, 1, 1, 1, 1]
boosted = GradientBoostingClassifier(random_state=0)
boosted.fit(X_train, y_train)
print(boosted.score(X_train, y_train))
```

Gradient boosting builds trees **one at a time**, each one specifically trained to correct the errors the previous trees made — a different strategy from a random forest's independent, averaged trees, and often (though not always) more accurate, at the cost of being more sensitive to its settings and slower to train.

## Common mistakes

- Leaving a single decision tree unconstrained (`max_depth=None`, the default) on complex data and being surprised by overfitting.
- Reading feature importance as proof of a causal or even reliable relationship, without checking on held-out data.
- Treating a high-cardinality ID-like feature's high importance score as meaningful.
- Assuming gradient boosting always beats a random forest; it depends on the data and how carefully each is tuned.

## Recap

- `max_depth` and other constraints control how much a single decision tree can overfit.
- Random forests average many randomised trees, considerably reducing overfitting compared to one deep tree.
- `feature_importances_` reports each feature's contribution to the forest's splits — treat it as a clue, not a proof.
- Gradient boosting builds trees sequentially to correct previous errors, a different (and often stronger) strategy than averaging.

## Your turn

In the **Practice** tab you write `tree_acc(X_train, y_train, X_test, y_test)`. Then three challenges use real data.
