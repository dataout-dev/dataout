You now have an entire toolkit for describing a dataset: measures of center, measures of spread, a five-number summary, z-scores, shape, and a way to flag outliers. This workshop is about putting them together in the right *order* — because reaching for the wrong tool first is one of the most common ways beginners (and plenty of experienced analysts) mislead themselves.

You will learn:

- a repeatable order of operations for exploring any new numerical dataset
- why shape comes before center
- why center comes before spread
- why outliers get checked last, not first
- how this tier's ideas combine into one coherent habit

## The trap: jumping straight to the mean

Handed a brand-new column of numbers, the instinctive move is to compute the mean immediately. You've seen throughout this tier exactly why that's risky on its own: the mean says nothing about whether the data is symmetric or skewed, says nothing about whether it's secretly two groups mixed together, and can be quietly dragged somewhere unrepresentative by a handful of extreme values you haven't even looked for yet. A mean computed before you understand the shape of your data is a number you can't actually interpret with confidence.

## A better order of operations

A more reliable habit works in this order:

**1. Look at the shape first.** Before computing anything, picture the data — is it roughly one bump (unimodal), two bumps (bimodal, maybe two groups mixed together), or lopsided with a long tail in one direction (skewed)? This single step tells you which summary numbers are even going to be trustworthy. A bimodal shape is a signal to consider splitting the data into groups before summarizing further; a skewed shape is a signal that mean and median are about to disagree.

**2. Then center.** With the shape in mind, pick center measures that match it. On a roughly symmetric, unimodal dataset, mean and median will likely agree and either is fine to lead with. On a skewed dataset, lead with the median, and report the mean alongside it only with the skew noted — the gap between the two is itself useful information.

**3. Then spread.** Center alone, as you saw early in this tier, never tells the whole story — two datasets sharing a mean can look nothing alike. Standard deviation (for roughly symmetric data) or the interquartile range (for skewed data, since it's robust to the same kind of lopsidedness that throws off the mean) rounds out the picture: not just "where is the data centered" but "how tightly packed is it around there."

**4. Check for outliers last.** Only once you have a sense of shape, center, and spread does it make sense to run something like the 1.5×IQR rule. Checking too early — before you know whether the data is naturally heavy-tailed or skewed — risks flagging perfectly ordinary values as "unusual" just because the rule assumed a shape that doesn't match your data. Checking last means you're interpreting flagged points with real context already in hand, rather than treating the rule's output as the first and only thing you know about the dataset.

## Walking through a new dataset

Imagine you're handed a column of customer order values from an online store you've never looked at before. Following the order above: a quick histogram shows a single peak with a long tail stretching toward large values — unimodal but clearly right-skewed, which immediately tells you to lean on the median over the mean. The median order value turns out to be modest, while the mean is noticeably higher — exactly the gap you'd expect from that right-skew, confirming the shape you saw. The interquartile range shows most orders cluster in a fairly tight band. Finally, running an outlier check turns up a handful of unusually large orders — and because you already know the distribution is right-skewed by nature (a few big spenders are entirely plausible for a store), you're in a much better position to judge which of those flagged orders are genuine big purchases worth celebrating, versus which might be a data-entry mistake worth a second look.

Notice that every step used something you already built earlier in this tier — nothing here is a new formula, only a disciplined order for applying the ones you already have.

## Common mistakes

- Computing a mean and standard deviation as the very first step, before any look at shape.
- Running an outlier check before understanding whether the dataset is naturally skewed or heavy-tailed, and misreading ordinary values as anomalies.
- Reporting a single center number without its matching spread number alongside it.
- Treating this order as a rigid script rather than a habit — real exploration loops back (a discovered outlier might change how you think about the shape, which might send you back to step one).
