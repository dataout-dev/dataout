This tier started with the idea that a sample can responsibly say something about a population, and has built up, piece by piece, everything needed to make that claim rigorously: standard error, confidence intervals, hypotheses, p-values, t-tests, and the caution to never read a p-value alone. An A/B test is where all of those pieces finally work together on a single, concrete question: did this change actually help?

You will learn:

- how to frame a real A/B test end to end, from design through interpretation
- why random assignment to groups matters before any test is run
- how to choose a single, well-defined metric in advance
- how to run the right hypothesis test on the result
- why the effect size and the p-value need to be read together, never one without the other

## Step 1: random assignment

An A/B test starts before any data is collected, with how users get split into a **control** group (the existing experience) and a **treatment** group (the new one being tested). That split needs to be random — each user's assignment shouldn't depend on anything that could also affect the outcome you're measuring. If, say, more engaged or loyal users systematically ended up in the treatment group, any difference you later measure would be hopelessly tangled up with that pre-existing difference, not caused by the change itself. Random assignment is what lets you credit any later difference in outcomes to the treatment, rather than to whoever happened to end up where.

## Step 2: choosing a metric in advance

Before looking at any results, decide exactly which single metric will answer the question — average time-on-page, conversion rate, email open rate, whatever matters for the decision at hand — and commit to it. This is the same discipline from the p-hacking lesson: deciding the metric *after* peeking at a dozen candidate metrics and picking whichever one happens to look best is a direct path to a false positive dressed up as a finding.

Suppose a team wants to know whether a new email subject line increases open rates compared to the old one. They commit, in advance, to measuring open rate over a fixed one-week window, as the single metric that will decide the outcome.

## Step 3: running the right hypothesis test

With H0 ("no difference between control and treatment") and H1 ("there is a difference") stated, and two independent groups of data collected, the right tool is a two-sample t-test — specifically Welch's version, from a couple of lessons back, since you generally can't assume the control and treatment groups have identical variability in how they respond. The test produces two things worth holding onto: the observed difference between the two groups' means, and a p-value describing how surprising a difference this large (or larger) would be if H0 were actually true.

## Step 4: reading the effect size and the p-value together

This is the step most often skipped, and it's the one this entire tier has been building toward. Imagine the email subject line test comes back with: treatment group open rate is 0.3 percentage points higher than control, with p = 0.01. The p-value says this difference is unlikely to be pure noise. But a 0.3-point lift might be far too small to matter for the business, even though it's "statistically significant" with a large enough sample.

Now imagine the opposite: a 6 percentage-point lift, but p = 0.18 — not statistically significant, likely because the test ran on a modest sample. That's a result worth treating carefully rather than dismissing outright: a meaningfully large effect that the test simply didn't have enough power (two lessons back) to confirm with confidence yet.

Reading both numbers together is the only way to avoid either trap: a p-value alone tells you whether to trust that *some* difference is real, not whether that difference is big enough to act on; an effect size alone tells you how big the difference looked in this one sample, without telling you how much of that could just be sampling noise. The honest, complete read of an A/B test always reports both — "treatment increased the metric by X, a difference unlikely to be chance (p = Y)" — rather than leading with just one half of the picture.

## Common mistakes

- Letting assignment to control or treatment correlate with anything that could also affect the outcome, rather than keeping it genuinely random.
- Choosing the metric to report only after seeing which one looks most favorable.
- Reporting only the p-value ("it's significant!") without mentioning the actual size of the effect, or vice versa.
- Treating a non-significant result on a modest sample as proof the change had no effect, rather than considering whether the test had enough power to detect it.
