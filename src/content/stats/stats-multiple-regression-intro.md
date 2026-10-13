A house's price isn't determined by square footage alone, a student's test score isn't determined by hours studied alone, and revenue isn't determined by ad spend alone. Almost every outcome worth predicting has more than one thing pushing on it at once. Multiple regression is what you reach for when you want to account for more than one predictor at the same time.

You will learn:

- what changes when you move from one predictor to several
- how to read a coefficient as "holding other variables constant"
- why adding a correlated second predictor can shrink the first predictor's apparent effect
- a worked example with house price, square footage, and bedroom count
- that this is a gentle first taste, not full fluency

## From one predictor to several

Simple linear regression (from earlier in this tier) finds the best line for predicting y from a single x: `y = slope · x + intercept`. **Multiple regression** extends the same idea to two or more predictors at once: `y = b0 + b1·x1 + b2·x2 + ...`, with one coefficient for every predictor you include. Instead of asking "how does y relate to x1 alone," you're asking "how does y relate to x1 and x2 and x3, all considered together, simultaneously."

The mechanics for finding the best-fitting coefficients extend the least-squares idea from simple regression — still minimizing the total squared gap between actual and predicted y — just across more dimensions. The part worth focusing on conceptually, though, isn't the fitting procedure; it's how to *read* the result.

## "Holding other variables constant"

In a model with several predictors, each coefficient is interpreted as the expected change in y for a one-unit increase in that particular predictor, **while holding every other predictor in the model fixed**. If a model predicting salary from years of experience and education level gives years-of-experience a coefficient of 2,000, that means "among people with the *same* education level, each additional year of experience is associated with about $2,000 more in predicted salary." It is explicitly not describing the raw, unconditional relationship between experience and salary across everyone — it's isolating experience's own contribution, net of whatever education level is already explaining.

This phrase — "holding other variables constant" — is the single most important thing to internalize about multiple regression. It's also exactly why a coefficient can change, sometimes a lot, depending on what else is in the model with it.

## Why adding a predictor can shrink another's coefficient

If two predictors are themselves correlated with each other, some of what looked like the first predictor's effect, when it was alone in a simple regression, may actually have been borrowed from its relationship with the second predictor. Once you add the second predictor into the model, the first one's coefficient can shrink — sometimes dramatically — because the model now has a more direct way to explain the part of y that both predictors were associated with.

This is the confounding-variable idea from earlier in this tier, formalized into a technique: instead of just *worrying* that a confounder might be distorting a simple relationship, multiple regression lets you put a plausible confounder directly into the model and see how much of the original effect survives.

## Worked example: house price, square footage, and bedrooms

Suppose you fit a simple regression predicting house price from number of bedrooms alone, and find a sizeable positive coefficient — each extra bedroom is associated with a meaningful jump in price. That seems reasonable on its own. But bedroom count and square footage are themselves strongly correlated in most housing markets: bigger houses tend to have more bedrooms. Now fit a multiple regression predicting price from *both* square footage and bedroom count together. It's common to find that bedroom count's coefficient shrinks substantially, sometimes close to zero, while square footage carries most of the predictive weight.

The interpretation isn't "bedrooms don't matter for price" — it's that once you hold square footage constant, having an extra bedroom in the *same* amount of total space (meaning smaller rooms) doesn't add much value on its own. Most of what the simple regression credited to "bedroom count" was really coming along for the ride with square footage, because the two are so closely linked in real housing data.

## A gentle taste, not full fluency

This lesson is deliberately a brief introduction to what multiple regression *is* and why its coefficients behave the way they do — not a complete treatment of the technique. Real fluency with multiple regression involves more: checking that predictors aren't so strongly correlated with each other that the model becomes unstable, choosing which predictors belong in a model at all, and interpreting interactions between predictors. All of that is genuinely its own, deeper topic, intentionally left outside the scope of this path. The goal here is simply that the next time you see a regression coefficient described as "controlling for X," you'll know exactly what that phrase means and why it can change a number you thought you already understood.

## Common mistakes

- Reading a multiple regression coefficient as the predictor's total, unconditional effect, rather than its effect holding the other predictors constant.
- Assuming a shrunken coefficient means that predictor "doesn't matter," rather than recognizing it may simply be sharing credit with a correlated predictor already in the model.
- Expecting this lesson to make you fully fluent in building and validating multiple regression models — that's genuinely more advanced material.
- Forgetting that the same confounding logic from the correlation-vs-causation lesson is exactly what's happening here, just handled with an actual technique instead of just a warning.
