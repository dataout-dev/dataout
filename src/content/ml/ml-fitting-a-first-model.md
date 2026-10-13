Every predictive model, however sophisticated, boils down to the same three lines: fit it on data with known answers, ask it to predict on data without them, and look at what it says.

You will learn:

- the fit/predict pattern every scikit-learn model shares
- what a `DecisionTreeClassifier` actually is, at a conceptual level
- how to read a model's predictions
- why your very first model doesn't need to be good to be worth building

## The universal pattern

```text
model = DecisionTreeClassifier(random_state=0)
model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

`X_train` is your feature table (one row per example, one column per feature). `y_train` is the known correct answer for each of those rows. `.fit()` is where the actual learning happens — the model looks at the relationship between features and answers in the training data. `.predict()` then applies whatever it learned to new feature rows, producing a guess for each one.

This exact three-line shape works for almost every model in scikit-learn — logistic regression, random forests, support vector machines — which is deliberate: it lets you swap one model for another without rewriting the rest of your pipeline.

## What a decision tree is doing

A `DecisionTreeClassifier` builds a sequence of yes/no questions about your features — "is `Fare` above 50?", then "is `Pclass` equal to 1?" — learned from the training data, ending in a prediction at each branch's end. It's one of the easiest models to build intuition for, because you could (in principle) trace through its exact questions by hand and see why it reached a particular answer for a particular row. That's a genuinely useful property while you're still learning what "fitting a model" even means.

## Reading the output

`model.predict(X_test)` returns one prediction per row of `X_test`, in the same order. For a classifier, that's typically the predicted class (like `0` or `1`). It's easy to glance at this and feel like you're done — but a list of predictions by itself tells you nothing about whether they're any *good*. That's the subject of the next lesson.

## Your first model doesn't need to be good

It is extremely tempting to want your first attempt to already be impressive. Resist that. The actual goal of a first model is to get the full pipeline — features in, fit, predict, (eventually) evaluate — working end to end on real data, so that improving it afterward is a matter of changing one piece at a time rather than debugging everything simultaneously. A deliberately simple first model that runs correctly is more valuable than an ambitious one you can't get working.

## Common mistakes

- Passing data that still has missing values or text categories directly into `.fit()` — scikit-learn models need clean numeric input (the subject of a later lesson in this section).
- Fitting on the test set, or on the full dataset, instead of the training set only.
- Treating the first model's predictions as a final answer rather than a baseline to measure improvement against.
- Assuming a more complex model is automatically better — a simple model that is easy to understand is often the right choice to start with, even if you plan to try something fancier later.
