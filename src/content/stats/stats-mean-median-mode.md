Ask "what's a typical value in this dataset?" and there isn't one single correct answer — there are three common ones, and they can disagree with each other more than you'd expect.

You will learn:

- the definitions of mean, median, and mode
- how a single outlier can drag the mean but leave the median almost untouched
- when median is the more honest choice (income is the classic example)
- why mode is the only one of the three that also works on categorical data
- how to decide which measure fits a given dataset

## Mean: the balance point

The **mean** (what most people call "the average") is the sum of all values divided by how many there are. If five people earn $40k, $42k, $45k, $48k, and $50k, the mean is their sum (225k) divided by 5, which is $45k.

Mentally, the mean is the point where the dataset "balances" — like a seesaw, where every value pulls on the balance point proportional to its distance from it. That's exactly why the mean is so sensitive to extreme values: one value far out on the number line pulls the balance point a long way toward it, even if every other value stays put.

## Median: the middle value

The **median** is the value exactly in the middle once you sort the data — half the values are below it, half are above. For an odd number of values, it's the literal middle one; for an even number, it's the average of the two middle values.

Take that same group of five earners: $40k, $42k, $45k, $48k, $50k. Sorted, the middle value is $45k — same as the mean, in this case, because the data is fairly evenly spread.

Now suppose a sixth person joins the group who earns $500k. The mean jumps to about $120.8k — a number that doesn't describe *any* of the six people well, including the person who earns $500k. The median, recalculated on six sorted values, becomes the average of the two middle ones ($45k and $48k), landing at $46.5k — barely moved. The median only cares about *position*, not magnitude, so one extreme value can't drag it the way it drags the mean.

## When median wins: income and other skewed data

This is exactly why income, home prices, and wealth are almost always reported using the median rather than the mean. A handful of extremely high earners pull the mean income of a country or city upward, producing a number far higher than what a "typical" resident actually earns. The median tells you what the person in the middle of the distribution makes, which is usually the more honest answer to "what does a typical person here earn?"

As a rule of thumb: when a dataset has a long tail of extreme values in one direction (very common with money, house prices, and wait times), reach for the median. When the data is roughly symmetric with no dramatic outliers, the mean and median will be close, and the mean has the advantage of using every value's exact magnitude, not just its rank.

## Mode: the most frequent value

The **mode** is simply the value that appears most often. In a numerical dataset, a mode might not exist at all (if every value is unique) or there might be more than one (a "bimodal" dataset, which you'll meet again when looking at histograms).

The mode's real superpower is that it's the *only* one of the three measures that works on categorical data. You can't average "red," "blue," and "green," and there's no meaningful middle value to sort them into — but you can absolutely say which color appeared most often. If a survey asks people their favorite season and "summer" gets the most votes, the mode is "summer" — mean and median simply don't apply.

## Choosing between them

A quick mental checklist:

- Categorical data? Mode is your only option.
- Numerical data with no extreme outliers? Mean and median will usually tell a similar story — either works, though mean is more common by convention.
- Numerical data with a skew or outliers (income, house prices, response times)? Median is the more trustworthy "typical value."
- Want to know the single most common exact value (not just "typical")? Mode, even on numerical data — e.g., the most common number of bedrooms in a city's houses.

Play with the explorer below to see exactly how far one dragged point can pull the mean before the median even flinches.
