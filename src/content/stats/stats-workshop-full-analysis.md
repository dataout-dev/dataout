Four tiers ago, this path started with a simple promise: given a pile of numbers, learn to describe them well. Every tier since has added another layer on top of that. This capstone is where all of it finally runs together, on real data, as one finished analysis instead of four separate lessons.

You will learn:

- how a real statistical analysis actually flows, start to finish
- where descriptive statistics fits into that flow, and why it comes first
- where thinking about distributions and sampling fits in
- where hypothesis testing or confidence intervals fit in
- where correlation and regression fit in, and why they usually come last

## Describe first

Every real analysis should start exactly where this path did, in its very first tier: just look at the data and describe it. What's the typical value for each variable — a mean, a median? How spread out are the values? Are there outliers that might be data-entry errors or genuinely unusual cases worth a second look? Skipping this step and jumping straight to a sophisticated test on data you haven't actually looked at is one of the most common ways a real analysis goes wrong — a test's output is only as trustworthy as the data feeding it, and the only way to catch an obvious problem (a corrupted column, an impossible value, a wildly skewed distribution) is to look first.

## Think about what distribution and sampling assumptions apply

Tier two of this path dealt with probability distributions and what a sample can and can't tell you about the population it came from. A real analysis has to carry that thinking forward: is this data roughly symmetric, or heavily skewed? Does it look like it was drawn from something close to a normal distribution, which many classic tests lean on, or does it have a very different shape that calls for more caution? Is the sample actually representative of the population you want to draw conclusions about, or could it be systematically missing certain kinds of cases? None of this changes the numbers you're about to compute, but it changes how much weight you should put on the conclusions that follow.

## Decide what you actually need: a test, or an interval

Tier three introduced hypothesis testing and confidence intervals — the machinery for deciding whether an observed pattern is likely to be real or could plausibly be explained by chance alone, and for expressing how precisely you've pinned down an effect. A real analysis has to decide, upfront, which of these questions it's actually trying to answer. Sometimes the right output is a yes-or-no-flavored test ("is this difference likely real?"); sometimes it's a range ("the true effect is probably somewhere between X and Y"), which is usually the more informative of the two, since it conveys both the estimate and its uncertainty in one package. Either way, this is the step where "does this pattern mean anything" gets a rigorous answer, rather than an eyeballed guess from the descriptive stats alone.

## Finally, look at relationships between variables

Only once the data has been described, its distributional quirks considered, and the right testing framework chosen does it make sense to turn to this tier's own territory: how do variables relate to each other? A correlation coefficient gives a quick read on the strength and direction of a linear relationship between two numeric variables. Regression goes further, turning that relationship into an actual predictive equation, with its slope telling you how much one variable is expected to change for a one-unit change in the other. This is deliberately the *last* step in the sequence, not the first — correlation and regression are only trustworthy once you already understand what the underlying data looks like, what assumptions are reasonable, and whether an observed pattern has been properly checked against chance.

## Putting it together

A finished analysis isn't a single number — it's this whole chain, end to end: describe the data honestly, understand its shape and where it came from, test or estimate carefully, and only then characterize how variables move together. Each tier of this path handed you one link in that chain. This capstone exercise asks you to run several of those links back to back on the same dataset, producing descriptive summaries, a correlation, and a regression slope as pieces of one coherent story about the data — the same way a real analysis, done properly, actually gets built.

## Common mistakes

- Jumping straight to correlation or regression without first describing the data or checking whether its shape matches what the chosen method assumes.
- Treating this capstone (or any single analysis) as "just run the four tiers' tools in order" rather than genuinely letting each step inform the next — a weird distribution found during description should change how you interpret everything downstream.
- Reporting a correlation or regression result without the context from the earlier steps — sample size, whether assumptions held, whether the result was statistically distinguishable from noise.
- Forgetting that this whole chain exists to answer a real question about the data, not to mechanically produce four kinds of output for their own sake.
