The mean and standard deviation summarize a dataset with two numbers, but both can be thrown off badly by a single outlier. The five-number summary takes a different approach — five numbers built from *position*, not magnitude — that sketches the whole shape of a dataset while staying remarkably hard to fool.

You will learn:

- what the five numbers are: minimum, Q1, median, Q3, maximum
- what a quartile actually means
- how a box plot turns those five numbers into a picture
- what the whiskers represent and the 1.5×IQR convention
- why this summary resists outliers better than mean and standard deviation

## The five numbers

Sort your data from smallest to largest, and five landmarks fall out of it naturally:

- **Minimum** — the smallest value.
- **Q1 (first quartile)** — the value one-quarter of the way through the sorted data; 25% of values fall below it.
- **Median (Q2)** — the value halfway through; 50% of values fall below it (this is the same median from the mean/median/mode lesson).
- **Q3 (third quartile)** — the value three-quarters of the way through; 75% of values fall below it.
- **Maximum** — the largest value.

Together, these five numbers divide your sorted data into four roughly equal-sized chunks, each holding about 25% of the values. That's the core idea behind a "quartile" — it literally means a quarter.

## A worked example

Take twelve sorted exam scores: `55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 90, 95`.

- Minimum = 55, Maximum = 95.
- Median (the midpoint of all 12 values) sits between the 6th and 7th values: (68 + 70) / 2 = 69.
- Q1 is the median of the lower half (`55, 58, 60, 62, 65, 68`): (60 + 62) / 2 = 61.
- Q3 is the median of the upper half (`70, 72, 75, 78, 90, 95`): (75 + 78) / 2 = 76.5.

So the five-number summary is: 55, 61, 69, 76.5, 95. Notice the two highest scores (90 and 95) are considerably higher than the rest of the pack — that gap is exactly the kind of thing this summary is built to expose.

## From five numbers to a box plot

A **box plot** is the five-number summary drawn as a picture. A box stretches from Q1 to Q3 (so the box itself contains the middle 50% of the data — this width is called the **interquartile range**, or **IQR** = Q3 − Q1), with a line inside it marking the median. Lines called **whiskers** extend out from the box toward the minimum and maximum — but usually not all the way.

## Whiskers and the 1.5×IQR rule

By a common convention, whiskers don't stretch to the true minimum and maximum. Instead, they stop at the most extreme value that still falls within **1.5 × IQR** of the box edges. Any point beyond that is drawn as a separate dot and flagged as a potential outlier, rather than being absorbed into the whisker.

For the exam scores above, IQR = 76.5 − 61 = 15.5, so 1.5 × IQR = 23.25. The upper whisker boundary is Q3 + 23.25 = 99.75 — since the max (95) is below that, both 90 and 95 stay inside the whisker here and wouldn't be flagged. But if one more student had scored 105, that point would land outside the boundary and get drawn as a separate dot, visually calling it out as unusual. You'll use this exact 1.5×IQR rule again, more formally, in the outliers lesson later in this tier.

## Why this summary is robust

The mean and standard deviation use every value's exact *magnitude*, which is exactly why one huge outlier can drag them far from where most of the data actually sits. The five-number summary only cares about *rank order* — where a value falls once everything is sorted — so a value becoming more extreme (say, that 95 becoming a 150) doesn't move Q1, the median, or Q3 at all; it just gets further from the box, still clearly flagged as unusual. Statisticians call this property **robustness**, and it's the main reason box plots are a go-to tool for a first honest look at a new dataset, especially one you suspect might have outliers or weird data-entry errors in it.

## Common mistakes

- Assuming whiskers always reach the true min/max — with the 1.5×IQR convention, they usually don't once outliers exist.
- Confusing IQR (a single number, Q3 − Q1, describing spread) with the box itself (a range of values).
- Treating every dot beyond the whiskers as automatically wrong data — flagging is just a hint to investigate, not a verdict (more on this in the outliers lesson).
- Forgetting that quartiles split *sorted rank*, not raw value — Q1 isn't "25% of the maximum value," it's "the value 25% of the way through the sorted list."

Play with the explorer below to watch the box plot rebuild itself as you drag an outlier around.
