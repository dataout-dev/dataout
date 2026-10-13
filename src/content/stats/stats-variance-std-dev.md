Two datasets can have the exact same mean and look nothing alike. One is tightly bunched around that mean; the other is scattered all over the place. The mean alone can't tell them apart — you need a number that measures *spread*.

You will learn:

- why a measure of center alone is never enough
- what variance measures: average squared distance from the mean
- why we take the square root of variance to get standard deviation
- how to work through a small example by hand
- a first, brief look at population vs. sample spread (ddof)

## Why center isn't the whole story

Consider two small classes of five test scores each:

```text
Class A: 70, 72, 68, 71, 69   (mean = 70)
Class B: 20, 95, 100, 60, 75  (mean = 70)
```

Both classes have a mean score of exactly 70. But Class A is a group of students performing consistently close to that average, while Class B has students scattered from a 20 to a perfect 100. If you only reported "the mean score was 70" for both classes, you'd be hiding something important — the two classes have wildly different stories, and the mean can't tell them apart. You need a second number that captures how *spread out* the values are around the center.

## Range: the simplest spread measure

The crudest measure of spread is the **range** — maximum minus minimum. For Class A, that's 72 − 68 = 4. For Class B, it's 100 − 20 = 80. That already shows a huge difference, but range has an obvious weakness: it only looks at the two most extreme values and ignores everyone else. A single unusually high or low value can make the range huge even if everyone else is tightly clustered.

## Variance: average squared distance from the mean

**Variance** fixes this by using *every* value, not just the two extremes. The recipe is:

1. Find the mean.
2. For each value, find how far it is from the mean (the "deviation").
3. Square each deviation (this makes every term positive, and penalizes large deviations more than small ones).
4. Average those squared deviations.

Let's do this by hand for a small dataset: `[2, 4, 4, 4, 5, 5, 7, 9]`.

```text
mean = (2+4+4+4+5+5+7+9) / 8 = 40 / 8 = 5

deviations from mean: -3, -1, -1, -1, 0, 0, 2, 4
squared deviations:    9,  1,  1,  1, 0, 0, 4, 16

sum of squared deviations = 9+1+1+1+0+0+4+16 = 32
variance = 32 / 8 = 4
```

That dataset has a variance of 4. Squaring the deviations is what makes variance so sensitive to outliers — a value twice as far from the mean contributes *four times* as much to the total, not twice as much. That's a useful property (it penalizes extreme spread heavily) but it also means variance is in "squared units," which brings us to the next step.

## Standard deviation: back to the original units

If your data is measured in dollars, variance is measured in *dollars squared* — a unit that doesn't mean anything intuitively. **Standard deviation** is just the square root of variance, which brings the number back into the original units of the data. For the example above, the standard deviation is √4 = 2.

Standard deviation is the number you'll see quoted constantly in practice ("scores averaged 70 with a standard deviation of 8") precisely because it's interpretable in the same units as the data itself — you can say "most values fall within about one standard deviation of the mean" in a way that actually means something.

## A quick note on population vs. sample

There's a subtlety worth knowing about but not obsessing over yet: when you compute variance from an entire *population*, you divide by the count of values (as above). When you compute it from a *sample* and want to estimate the population's variance, you divide by one less than the count instead — a small correction usually called `ddof` (delta degrees of freedom) in code. The intuition and the mechanics above are identical either way; the divisor is the only thing that changes, and you'll see exactly why that correction exists in a later tier. For now, it's enough to know the adjustment exists and to not be surprised when you see a `ddof=1` argument somewhere.

## Common mistakes

- Reporting only the mean and assuming that's a complete description of a dataset — always pair it with a spread measure.
- Forgetting to square the deviations before averaging (which would make positive and negative deviations cancel out to something close to zero).
- Confusing variance and standard deviation — remember standard deviation is the square root of variance, and is the one in the data's original units.
- Assuming "low variance" always means "good" — it depends entirely on context; sometimes spread is exactly what you're looking for.
