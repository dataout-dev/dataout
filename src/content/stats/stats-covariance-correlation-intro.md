Everything so far in this tier has described a single variable at a time — one column of numbers. The moment you have two variables, a new and genuinely different question opens up: do they tend to move together?

You will learn:

- the intuition behind covariance: do two variables move together
- why raw covariance is hard to interpret on its own
- how correlation fixes that by standardizing covariance to a -1-to-1 scale
- why a correlation of 0 doesn't rule out a relationship
- where this goes next, in a later tier

## The question: do two variables move together?

Suppose you have, for a group of houses, both their square footage and their sale price. You'd probably guess that bigger houses tend to sell for more — but "tend to" is doing a lot of work in that sentence. How would you actually measure whether that's true, and how strongly?

The first idea worth having is simple: look at whether the two variables tend to be *above average at the same time* and *below average at the same time*. If large square footage usually comes with a high price, and small square footage usually comes with a low price, the two variables are moving together. If there's no such pattern — sometimes big houses are cheap, sometimes small houses are expensive, with no consistent relationship — they're not.

## Covariance: a first, rough measurement

**Covariance** turns that intuition into a number. For each house, it looks at how far that house's square footage is from the average square footage, and how far that house's price is from the average price, and multiplies those two deviations together. Do this for every house and average the results.

The sign tells you the direction: if above-average square footage tends to pair with above-average price (and below with below), most of those multiplied deviations come out positive, and covariance is positive — the two variables move together. If one tends to be high when the other is low, covariance comes out negative. If there's no consistent pattern, the positive and negative products tend to cancel out, and covariance lands close to zero.

The problem is the *size* of covariance is hard to interpret on its own. A covariance of "50,000" between square footage and price doesn't tell you, by itself, whether that's a strong relationship or a weak one — the number's scale depends entirely on the units you measured each variable in (square feet versus dollars versus square meters versus thousands of dollars), and changing units changes the covariance even though the underlying relationship hasn't changed at all.

## Correlation: the standardized, interpretable version

**Correlation** fixes exactly that problem by standardizing covariance — dividing it by the standard deviations of both variables involved. The result always lands somewhere between **-1 and +1**, no matter what units the original variables were measured in:

- **+1** means a perfect positive relationship — as one variable increases, the other increases in perfect lockstep.
- **-1** means a perfect negative relationship — as one increases, the other decreases in perfect lockstep.
- **0** means no *linear* relationship detected at all.
- Values in between describe everything in-between, in strength — a correlation of 0.8 describes a much stronger linear relationship than a correlation of 0.2.

Because correlation is unit-free and bounded, it's the number that actually gets reported and compared in practice, far more often than raw covariance.

## The catch: correlation of 0 doesn't mean "no relationship"

This is the single most important caveat to learn early: correlation specifically measures *linear* relationships — how well a straight line fits the pattern between the two variables. Two variables can be very strongly, predictably related in a *non-linear* way — for instance, one variable might be the exact square of the other, tracing out a perfect U-shaped curve — and still produce a correlation very close to 0, because a straight line is a genuinely bad fit for a U-shape even though the relationship is completely deterministic. A correlation of 0 tells you "no straight-line relationship was detected," not "these variables are unrelated." Always look at a scatter plot before trusting a correlation number alone.

## Where this goes next

This lesson is only a first look. A later tier in this path goes much deeper into this territory — including the famous warning that correlation does not imply causation, how to visually inspect a scatter plot for the kinds of non-linear patterns correlation can miss, and how regression builds directly on top of these same ideas to make actual predictions from one variable to another. For now, the goal is just to have the right first instinct: covariance measures "do they move together," correlation makes that measurement interpretable and comparable, and neither one tells the whole story by itself.

## Common mistakes

- Treating a correlation near 0 as proof that two variables are unrelated, without ever looking at a scatter plot to check for a non-linear pattern.
- Comparing raw covariance values across datasets measured in different units, where the comparison is meaningless.
- Assuming a strong correlation proves one variable causes the other — that question needs a different kind of evidence entirely, covered later in this path.
- Forgetting that correlation is bounded between -1 and +1, while covariance has no fixed scale at all.
