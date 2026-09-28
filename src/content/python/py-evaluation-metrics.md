Accuracy alone can be deeply misleading, especially when classes are imbalanced. This lesson covers the metrics that actually answer "how good is this model, for what I care about?"

You will learn:

- the confusion matrix
- precision, recall and F1
- ROC and AUC
- regression metrics: MAE, RMSE, R-squared

## The confusion matrix

```python
from sklearn.metrics import confusion_matrix

y_true = [1, 0, 1, 1, 0, 0]
y_pred = [1, 0, 0, 1, 0, 1]
print(confusion_matrix(y_true, y_pred))
```

Rows are the true class, columns the predicted class: the diagonal is correct predictions; everything off the diagonal is a specific kind of mistake — worth reading directly rather than only looking at a single summary number.

## Precision and recall

```python
from sklearn.metrics import precision_score, recall_score, f1_score

y_true = [1, 0, 1, 1, 0, 0]
y_pred = [1, 0, 0, 1, 0, 1]
print(precision_score(y_true, y_pred))
print(recall_score(y_true, y_pred))
print(f1_score(y_true, y_pred))
```

**Precision**: of everything predicted positive, what fraction actually was? **Recall**: of everything that actually was positive, what fraction did the model catch? They trade off against each other, and which one matters more depends entirely on the cost of each mistake — a spam filter cares more about precision (do not lose real email); a cancer screening test cares more about recall (do not miss a real case). **F1** is their harmonic mean, a single number balancing both.

## Watch out: accuracy on imbalanced data

```python
from sklearn.metrics import accuracy_score

y_true = [0] * 95 + [1] * 5
y_pred = [0] * 100
print(accuracy_score(y_true, y_pred))
```

A model that predicts "never positive" scores 95% accuracy here, while catching **zero** of the actual positive cases — a stark illustration of why accuracy alone is a poor metric whenever one class dominates.

## ROC and AUC

```python
from sklearn.metrics import roc_auc_score

y_true = [0, 0, 1, 1]
y_proba = [0.1, 0.4, 0.35, 0.8]
print(roc_auc_score(y_true, y_proba))
```

The ROC curve plots the true-positive rate against the false-positive rate across every possible threshold; AUC (area under that curve) summarises it in one number — `1.0` is perfect ranking, `0.5` is no better than random guessing. Unlike accuracy or F1, AUC uses the predicted **probabilities**, not just the final class labels, and does not depend on picking one specific threshold.

## Regression metrics

```python
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

y_true = [3.0, 5.0, 2.5, 7.0]
y_pred = [2.5, 5.5, 2.0, 8.0]
print(mean_absolute_error(y_true, y_pred))
print(root_mean_squared_error(y_true, y_pred))
print(r2_score(y_true, y_pred))
```

MAE (mean absolute error) reports the average size of a mistake, in the target's own units. RMSE is similar but penalises large errors more heavily, since it squares them before averaging. R-squared reports the fraction of the target's variance the model explains, on a scale that (unlike MAE/RMSE) does not depend on the target's units.

## Choosing a metric from business cost

Before picking a metric, ask: what does a false positive cost, compared to a false negative? A fraud detector's false positive (blocking a real transaction) might be mildly annoying; its false negative (missing real fraud) might be expensive — that asymmetry should drive whether precision, recall, or a custom cost-weighted metric matters most, not a generic default like accuracy.

## Common mistakes

- Reporting accuracy alone on an imbalanced dataset.
- Optimising for precision when the real cost of a missed case (recall) was actually higher, or the reverse.
- Comparing RMSE values computed on data with different units or scales.
- Using AUC to compare models when only one fixed threshold will ever actually be used in production, and a threshold-specific metric would answer the real question better.

## Recap

- A confusion matrix shows exactly what kind of mistakes a classifier makes, not just how many.
- Precision and recall trade off; F1 balances them; the right choice depends on the cost of each mistake.
- AUC evaluates ranking quality across every threshold, using predicted probabilities.
- MAE, RMSE and R-squared are the standard regression metrics, each with a different sensitivity to large errors.

## Your turn

In the **Practice** tab you write `pr(y_true, y_pred)`. Then three challenges use real data.
