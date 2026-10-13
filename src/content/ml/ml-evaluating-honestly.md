"My model is 94% accurate" sounds impressive right up until you learn that simply guessing the most common outcome every single time would have scored 93%. A number without a baseline to compare it to is not yet an evaluation.

You will learn:

- how to compute accuracy, and what it actually measures
- why you always need a baseline, not just a raw score
- precision and recall, for when accuracy alone is misleading
- how regression evaluation (MAE, RMSE) differs from classification evaluation

## Accuracy, and its blind spot

Accuracy is simply the fraction of predictions that were correct. It's intuitive and easy to compute — and it can be deeply misleading on an imbalanced dataset. If 93% of your data belongs to one class, a model that does nothing but predict that class every time scores 93% accuracy while having learned literally nothing useful.

## The baseline is not optional

This is why every evaluation in this section is paired with a baseline: what would a deliberately dumb strategy score? For classification, that's usually "always guess the most common class." For regression, it's usually "always guess the training set's mean." A real model's job is to beat that baseline by a meaningful margin — not just to produce a number that *sounds* high in isolation.

```text
baseline_accuracy = (majority class count) / (total count)
```

If your fitted model's test accuracy is barely above this number, it has told you very little. If it's well above, that's a real signal the features actually carry useful information about the target.

## Beyond accuracy: precision and recall

When the two classes matter differently — think "did this email get correctly flagged as spam" versus "did this patient get correctly flagged as having a condition" — accuracy alone can hide important failures. **Precision** asks: of everything the model flagged as positive, how much actually was? **Recall** asks: of everything that actually was positive, how much did the model catch? A model can have high accuracy while having terrible recall, simply by rarely predicting the rare class at all. This section doesn't require you to master every metric, but it's worth knowing these names exist and why accuracy alone isn't the whole story.

## Regression needs different metrics entirely

A regression target (like price, or a final grade) isn't "right or wrong" the way a class label is — it's a number that's closer or farther from the truth. Two common metrics:

- **MAE (mean absolute error)**: the average of `|predicted − actual|` across all test rows. Easy to interpret directly in the target's own units (dollars, grade points).
- **RMSE (root mean squared error)**: similar, but squares the errors before averaging (then takes the square root), which penalizes large misses more heavily than small ones.

Both need the same baseline discipline as classification: compare against "always predict the training mean" before trusting that a model has actually learned something.

## Common mistakes

- Reporting a raw accuracy or MAE number with no baseline to compare it to.
- Trusting accuracy alone on a dataset where one class is much more common than the other.
- Computing the baseline from the test set's own class distribution, rather than from what a model would have predicted without looking at the test set at all.
- Assuming a lower MAE always means a strictly "better" model — sometimes a small MAE improvement isn't worth the added complexity of the model that produced it.
