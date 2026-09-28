Correlation asks "do these move together?"; regression goes further, fitting a specific line (or curve) that predicts one from the other, with numbers you can read as "for each extra unit of x, y changes by this much".

You will learn:

- correlation, and what it does not tell you
- simple and multiple linear regression with `statsmodels`
- reading coefficients, R-squared and residuals
- prediction intervals, briefly

## Correlation and its limits

```python
import numpy as np

x = np.array([1, 2, 3, 4, 5])
y = np.array([2, 4, 5, 4, 5])
print(np.corrcoef(x, y)[0, 1])
```

Correlation ranges from -1 (perfect negative) to 1 (perfect positive), with 0 meaning no *linear* relationship — it can miss a strong but *curved* relationship entirely, and it never distinguishes "x causes y" from "y causes x" from "something else causes both".

## Simple linear regression

```python
import statsmodels.api as sm

x = [1, 2, 3, 4, 5]
y = [2.1, 3.9, 6.2, 7.8, 10.1]
X = sm.add_constant(x)
model = sm.OLS(y, X).fit()
print(model.params)
```

`sm.add_constant(x)` adds a column of 1s, letting the model fit an intercept as well as a slope — without it, `OLS` would fit a line forced through the origin. `model.params` is `[intercept, slope]`, in that order, for a simple regression built this way.

## Reading coefficients and R-squared

```python
import statsmodels.api as sm

x = [1, 2, 3, 4, 5]
y = [2.1, 3.9, 6.2, 7.8, 10.1]
X = sm.add_constant(x)
model = sm.OLS(y, X).fit()
print(model.rsquared)
print(model.summary())
```

The slope says "for every 1-unit increase in x, y changes by this much, on average". R-squared (between 0 and 1) says what **fraction of y's variation** the model explains — `model.summary()` prints a full report, including standard errors and p-values for each coefficient, useful for judging how confidently each one is estimated.

## Multiple regression

```python
import statsmodels.api as sm
import numpy as np

x1 = [1, 2, 3, 4, 5]
x2 = [5, 3, 4, 2, 1]
y = [10, 12, 16, 15, 18]
X = sm.add_constant(np.column_stack([x1, x2]))
model = sm.OLS(y, X).fit()
print(model.params)
```

With more than one predictor, `np.column_stack` combines them into one matrix before adding the constant; each coefficient then reads as "the effect of this variable, **holding the others constant**".

## Residuals

```python
import statsmodels.api as sm

x = [1, 2, 3, 4, 5]
y = [2.1, 3.9, 6.2, 7.8, 10.1]
X = sm.add_constant(x)
model = sm.OLS(y, X).fit()
print(model.resid)
```

A residual is the gap between an actual and predicted value; plotting residuals against `x` (or the predictions) is the standard check for whether a linear model is actually appropriate — a clear pattern in the residuals (a curve, a funnel shape) suggests the model is missing something.

## Prediction intervals, briefly

```python
import statsmodels.api as sm

x = [1, 2, 3, 4, 5]
y = [2.1, 3.9, 6.2, 7.8, 10.1]
X = sm.add_constant(x)
model = sm.OLS(y, X).fit()
new_x = sm.add_constant([6], has_constant="add")
prediction = model.get_prediction(new_x)
print(prediction.summary_frame(alpha=0.05))
```

A prediction interval expresses uncertainty about one **new, individual** point, wider than a confidence interval for the average prediction at that point — both come from `get_prediction`.

## Watch out: correlation is not causation

Ice cream sales and drowning incidents correlate strongly over a year — both rise in summer. Neither causes the other; a third factor (warm weather) drives both. A regression coefficient describes an *association* found in the data; establishing causation needs either a designed experiment (random assignment) or careful causal reasoning about confounding factors, not a regression fit alone.

## Common mistakes

- Forgetting `sm.add_constant`, silently forcing the fitted line through the origin.
- Reading a high R-squared as proof the model is "correct", without checking the residuals for a pattern.
- Interpreting a regression coefficient causally, from observational data alone.
- Confusing a prediction interval (for one new point) with a confidence interval (for the average response).

## Recap

- Correlation measures linear association only, and never establishes direction or causation by itself.
- `sm.add_constant` + `sm.OLS(y, X).fit()` fits a regression; `.params`, `.rsquared` and `.resid` are the key things to read.
- Multiple regression coefficients describe each variable's effect holding the others constant.
- A regression coefficient is an association in the data, not proof of a causal effect.

## Your turn

In the **Practice** tab you write `ols_fit(x, y)`. Then three challenges use real data.
