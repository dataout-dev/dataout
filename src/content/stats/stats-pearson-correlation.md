"These two things seem related" is a vague feeling. The Pearson correlation coefficient, almost always written as a lowercase *r*, turns that feeling into a single precise number that says exactly how linear a relationship is, and in which direction.

You will learn:

- the -1 to 1 range of r and what each extreme means
- what r near 0 does and doesn't tell you
- why r is "unit-free," and why that matters
- the practical difference between a weak and a strong positive correlation
- how to read r off a scatter plot by eye, roughly

## The range: -1 to 1

Pearson's r always falls between -1 and 1, no matter what's being measured:

- **r = 1** is a perfect positive linear relationship: every single point falls exactly on an upward-sloping line. As x goes up, y goes up, with zero scatter around that line.
- **r = -1** is a perfect negative linear relationship: as x goes up, y goes down, again with every point sitting exactly on the line.
- **r = 0** means no detectable *linear* relationship at all — knowing x gives you no useful information for predicting whether y will be higher or lower than average.

Everything else falls somewhere in between, and the sign tells you the direction: positive r means the two variables tend to rise together, negative r means one tends to rise as the other falls. The magnitude (how far from 0, ignoring the sign) tells you how tightly the points cluster around that trend.

## r = 0 doesn't mean "no relationship"

This is the single most important trap with Pearson's r: it measures only *linear* relationships. Imagine a dataset shaped like a U — y is high when x is very low, dips down as x increases toward the middle, and rises again as x gets large. That's an extremely strong, perfectly predictable relationship (if you know x, you can say a lot about y), but a straight line drawn through it would be roughly flat, and r would come out close to 0. Pearson's r would report "no linear relationship," which is true, while completely missing that a real, strong, *curved* relationship is sitting right there in the data.

This is why a scatter plot is worth looking at even after you've computed r. The number alone can't tell you the shape of what it's describing — it only tells you how well a straight line fits.

## Why r is unit-free

Pearson's r is built from standardized versions of each variable: for every point, you measure how many standard deviations it sits above or below its own variable's mean, for both x and y, and combine those standardized distances across all the points. Because both variables get rescaled onto the same "standard deviations from the mean" footing before being compared, the units they started in — dollars, centimeters, seconds, anything — cancel out completely.

The practical payoff is that r means the same thing no matter what you're measuring. The correlation between height in centimeters and weight in kilograms is exactly the same number as the correlation between height in inches and weight in pounds. You never have to ask "is 0.6 a big correlation for *this* kind of data" — 0.6 means the same strength of linear relationship everywhere, which is part of why r is such a widely reported statistic.

## Weak vs. strong: 0.3 versus 0.9

Both 0.3 and 0.9 are "positive correlations," but they describe very different realities. An r of 0.9 describes a tight, almost line-like cloud of points — if you plotted it, you'd see a clear trend with only a little scatter around it, and knowing x would let you predict y fairly precisely. An r of 0.3 describes a real but weak and noisy trend — there's a genuine tendency for y to rise a bit as x rises, but the scatter around that trend is large, and plenty of individual points will buck the overall pattern. Knowing x at r = 0.3 improves your guess about y only modestly over just guessing the average.

In practice, treat r = 0.9 as "this is a reliable, strong pattern worth building on," and r = 0.3 as "there's something here, but it's not going to let you make confident individual predictions" — it might still be a meaningful finding (plenty of real-world relationships, like diet and health outcomes, only ever show correlations in the 0.2–0.4 range), just not a tight, mechanical one.

Play with the playground below to build the intuition — watch how the scatter tightens or spreads out as you drag the target correlation toward 1, -1, or 0.
