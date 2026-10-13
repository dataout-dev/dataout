Fitting a line is easy to do and easy to trust too much. Before relying on any regression line for a real decision, you need an honest answer to a harder question: how much of what's actually happening in your data does this line explain, and how much is it missing?

You will learn:

- what a residual is, concretely
- what R² measures and why it's framed as a fraction
- how to interpret R² = 1 versus R² = 0 versus everything between
- the conceptual recipe for computing R² from residuals
- when a low R² is still a meaningful result, versus when it's a warning sign

## Residuals: the line's leftovers

A **residual** is simply the gap between what actually happened and what the line predicted, for one data point: `residual = actual y − predicted y`. If a line predicts a house will sell for $310,000 and it actually sold for $295,000, the residual for that house is -$15,000. Every single point in your dataset has its own residual, and together they describe everything the line *failed* to capture — all the variation in y that isn't explained by x through this straight-line relationship.

A good fit has small residuals scattered without any obvious pattern above and below the line. A bad fit has large residuals, or — more revealingly — residuals that follow their own pattern (consistently positive for small x, consistently negative for large x), which usually means the relationship isn't actually linear at all.

## R²: the fraction explained

**R²** (R-squared) takes all those residuals and boils them down into one number: the fraction of the total variation in y that the line accounts for. It ranges from 0 to 1 (equivalently, 0% to 100%).

- **R² = 1** means the line explains all of the variation in y — every point sits exactly on the line, with zero residual anywhere. This almost never happens with real-world data.
- **R² = 0** means the line explains none of the variation — you'd do just as well predicting the plain average of y for every point as you would using the line.
- **R² = 0.65**, a very common kind of result, means the line accounts for 65% of the variation in y; the remaining 35% is left unexplained — due to other factors not in the model, measurement noise, or genuine randomness.

Note that R² is closely related to Pearson's r from earlier in this tier: for simple linear regression with one predictor, R² is literally r squared. A correlation of 0.8 corresponds to an R² of 0.64 — which is a useful reality check, since r is on an intuitive -1-to-1 scale, but R² is the number that directly answers "how much of y does this actually explain."

## The conceptual recipe

You don't need to memorize a formula to understand what's going on underneath R². The idea has two pieces:

1. **Total variation in y** — how spread out y is overall, ignoring x entirely, measured by comparing every actual y value to the overall average of y and looking at how big those gaps are (squared, so they don't cancel out — the same trick from the least-squares idea in the last lesson).
2. **Leftover variation after the line** — how spread out the *residuals* are, i.e. how big the gaps are between actual y and the line's predicted y, again squared and summed.

R² then asks: what fraction of that total variation did the line manage to soak up? Concretely, it's one minus the ratio of the leftover (residual) variation to the total variation. If the line's residuals are tiny compared to the total spread in y, that ratio is close to 0, and R² comes out close to 1 — the line ate up almost all the variation. If the residuals are nearly as large as the total spread in y, the line barely helped, and R² sits close to 0.

Working through this by hand on a small example, rather than jumping straight to code, is good practice before you build the function yourself in this lesson's exercise.

## When a low R² is fine, and when it's a red flag

A low R² is not automatically a failure. In fields studying genuinely noisy, multi-caused outcomes — human behavior, financial markets, biological variation — an R² of 0.2 or 0.3 from a single predictor can be a legitimately interesting and useful finding; most of what determines the outcome simply isn't captured by that one variable, and that's expected, not a sign of a broken analysis.

A low R² *is* a warning sign when you expected a tight mechanical relationship and didn't get one, or when the residual pattern reveals the real problem: a curved relationship forced into a straight line (as in the previous lesson), a few extreme outliers dragging the line off course, or an important predictor missing entirely. The number alone can't tell you which situation you're in — that's exactly why looking at the residuals, not just the final R² figure, matters.

## Common mistakes

- Treating R² as a measure of whether the relationship is real, rather than a measure of how much of the variation a specific line explains.
- Assuming a high R² proves the relationship is causal — it says nothing about causation, only about fit.
- Ignoring the shape of the residuals and looking only at the final R² number, which can hide a systematic curved pattern the line is missing.
- Expecting every R² to be close to 1 — for noisy, real-world, multi-caused data, a modest R² from a single predictor is often completely normal.
