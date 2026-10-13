Knowing that advertising spend and revenue are strongly correlated is nice, but it doesn't let you answer the question a manager actually wants answered: "if I spend $10,000 next month, what revenue should I expect?" That jump — from "these move together" to an actual number you can calculate — is what regression adds.

You will learn:

- what regression gives you beyond a correlation coefficient
- how to read a slope and an intercept in plain language
- the least-squares idea, intuitively, without heavy algebra
- what happens when you fit a straight line to a genuinely curved relationship
- what "simple" means in "simple linear regression"

## From a number to an equation

Pearson's r tells you how strong and in which direction a linear relationship is, as a single value between -1 and 1. **Simple linear regression** goes a step further: it finds the actual straight line — in the form `y = slope · x + intercept` — that best describes the relationship, so you can plug in any x and get a predicted y back out.

"Simple" here specifically means there's exactly one predictor variable, x, predicting one outcome, y. (Later in this tier you'll get a brief taste of multiple regression, which uses several predictors at once — simple linear regression is the one-predictor foundation that idea builds on.)

## Reading the slope and intercept

The **intercept** is the predicted value of y when x is exactly 0 — it's where the line crosses the y-axis. The **slope** is the more interesting number for most questions: it's the amount y is expected to change for every one-unit increase in x. A slope of 2.5 means "for every +1 in x, the model predicts y goes up by 2.5." If x is advertising spend in thousands of dollars and y is revenue in thousands of dollars, a slope of 2.5 says "every extra $1,000 of ad spend is associated with about $2,500 more in predicted revenue" — turning an abstract relationship into a number you can actually act on.

The sign of the slope matches the sign of the correlation you'd compute between the same two variables: a positive slope goes with positive correlation, negative with negative. But the slope carries extra information correlation doesn't: it's expressed in the actual units of x and y, not a unitless -1-to-1 number.

## How the line gets chosen: least squares

Infinitely many lines could be drawn through a scatter of points. Simple linear regression picks one specific line using the **least-squares** method, and the idea behind it is more intuitive than the name suggests.

For any candidate line, look at each point in your data and measure the vertical distance between where that point actually sits and where the line says it should sit, for that point's x value. That gap is called a **residual** — the bigger the gaps, the worse that line fits. Some residuals will be positive (the point sits above the line) and some negative (below it), so you can't just add them up — they'd partially cancel out even for a badly-fitting line. Squaring each residual before adding fixes that: every squared residual is positive, so the total only grows as the misses get bigger, in either direction. Least-squares regression is simply the line that makes this total — the sum of all the squared vertical misses — as small as possible. Among every line you could possibly draw, it's the one that minimizes the overall squared distance between the data and the prediction.

## Forcing a line onto a curve

What happens if the real relationship between x and y isn't a straight line at all — say, it curves upward faster and faster, like exponential growth? Linear regression doesn't know that and doesn't care; it will dutifully find *the best possible straight line*, because that's the only shape it's allowed to draw. But "best possible straight line" through a curved pattern is still a poor fit overall. The line will systematically miss in a patterned way: it will sit above the actual data in some stretches and below it in others, rather than scattering its misses randomly above and below like a good fit would. That patterned mis-fit is a visible clue — in the residuals themselves — that a straight line was the wrong tool for this particular relationship, which is exactly what the next lesson digs into.

Play with the playground below — the same scatter plot from the correlation lesson, now with a fitted line drawn on top, so you can see how the line reacts as you reshape the underlying data.
