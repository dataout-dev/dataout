"The data is skewed" and "it has heavy tails" are two of the most common phrases in statistics, and both are just precise names for shapes you can already recognize by eye in a histogram. Giving them names lets you talk about those shapes precisely instead of just waving at a picture.

You will learn:

- what right-skew and left-skew mean, with concrete examples
- how skew changes the relationship between the mean and the median
- what kurtosis (heavy vs. light tails) means intuitively
- why checking skew matters before you report "the average" of something

## Skew: which way does the tail point?

**Skewness** describes how lopsided a distribution is — specifically, which direction its longer tail stretches.

- **Right-skewed** (also called positively skewed): most values cluster on the lower end, with a long tail stretching out toward higher values. Income is the textbook example — most people earn somewhere in a moderate range, but a smaller number of very high earners stretch the right tail a long way out.
- **Left-skewed** (negatively skewed): the mirror image — most values cluster on the higher end, with a long tail stretching toward lower values. Age at retirement in a population with a legal minimum retirement age can look like this: a cluster near the upper end, with a tail of people who retired unusually early stretching to the left.

A distribution with no meaningful skew in either direction — roughly symmetric, like many bell-shaped curves — is simply called **symmetric**.

## How skew drags the mean away from the median

Recall the earlier lesson: the mean is pulled toward extreme values, while the median mostly ignores them. Skew is exactly where that difference shows up in practice.

In a right-skewed distribution like income, the long tail of unusually high earners pulls the mean upward, past the median. That's precisely why "average income" (the mean) in a city or country is typically reported as noticeably higher than what a "typical" resident — the median earner — actually makes. The gap between mean and median is, in a rough sense, a readable signal of how skewed the data is: the bigger that gap, the more one-sided the distribution's tail is.

For a left-skewed distribution, the relationship flips: the tail of unusually low values pulls the mean *below* the median.

## Kurtosis: how heavy are the extremes?

**Kurtosis** describes a different property: how much of the data sits in the extreme tails of the distribution, rather than near the center. Two distributions can have the same mean, the same standard deviation, and even look similarly symmetric, and still differ a lot in kurtosis.

- **High kurtosis** ("heavy tails" or "fat tails"): more of the data is concentrated very close to the mean than you'd expect, *but* there's also a non-trivial amount of data way out in the extremes — more extreme outliers than a typical bell curve would produce. Financial returns are a famous real-world example: most days are quiet and clustered near zero, but extreme crash or spike days happen more often than a simple bell curve would predict.
- **Low kurtosis** ("light tails"): values are spread more evenly across the range, with fewer extreme outliers than a standard bell curve, and a flatter overall shape.

The practical takeaway with kurtosis isn't to memorize the formula — it's to know that "heavy tails" is a warning sign that extreme events happen more often than a naive bell-curve assumption would suggest, which matters a lot in fields like finance and risk analysis.

## Why this matters before reporting "the average"

If you report a single mean without checking skew, you risk stating a number that describes almost nobody in your dataset — as with income, where the mean can sit well above what most people actually experience. The fix is cheap: look at a histogram (or just compare the mean to the median) before you hand someone a single summary number. If they're close together, the mean is a fair description. If they're far apart, you likely have a skewed distribution, and reporting the median — or both numbers, with an explanation — will tell a far more honest story.

## Common mistakes

- Reporting only the mean for a known right-skewed variable (income, house prices, wait times) without checking whether the median tells a different story.
- Assuming "skewed" is a flaw in the data rather than a real, often expected, feature of it.
- Confusing skew (which direction the tail points) with kurtosis (how heavy the tails are) — they describe different things and a distribution can have either without the other.
- Eyeballing skew from a single histogram with a misleading bin width — check that the shape holds up before concluding a dataset is skewed.

Play with the explorer below to watch the mean and median pull apart as the skew slider moves.
