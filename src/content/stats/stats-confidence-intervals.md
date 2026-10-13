A delivery app reports that its average delivery time is "28 to 34 minutes, with 95% confidence." It's tempting to read that as "there's a 95% chance the true average falls between 28 and 34." That reading is wrong — not in a pedantic, technical-footnote way, but in a way that changes what the number is actually allowed to tell you.

You will learn:

- the correct frequentist interpretation of a confidence interval, and the tempting-but-wrong one
- why "95% confidence" is a statement about a *method*, not about one specific interval
- how to read a real confidence interval correctly, with a worked example
- the two ingredients that build every confidence interval
- why a 99% confidence interval ends up wider than a 95% one, for the same data

## What a confidence interval actually is

A confidence interval (CI) is a range of plausible values for something you can't directly observe — usually a population mean or proportion — built from a sample. Instead of reporting a single number ("the average delivery time is 31 minutes") and pretending that number is exact, a CI reports a *range* along with how reliable the method used to build that range tends to be: "28 to 34 minutes, 95% confidence."

That range comes from two ingredients:

1. **A point estimate** — your best single guess, almost always the sample mean.
2. **A margin of error** — built from the standard error (how much sample means wobble, covered in the previous lesson) multiplied by a number tied to how confident you want to be.

Put together: `CI = point estimate ± margin of error`. A 31-minute sample mean with a margin of error of 3 minutes gives the 28–34 range.

## The interpretation that actually holds up

Here is the correct interpretation, stated as precisely as possible: if you repeated the entire sampling-and-interval-building process many times — drawing a new sample each time and constructing a new 95% CI each time — about 95% of those intervals would contain the true population mean. The other roughly 5% would simply miss it, through no error at all, just the ordinary luck of which sample happened to get drawn.

That is a statement about the long-run reliability of the *method*, not a probability statement about the one specific interval sitting in front of you. Once an interval has actually been calculated — say, [28, 34] — the true mean either is in that range or it isn't. There's no probability left to talk about for that one interval; the 95% describes how often this *process* succeeds, not your odds on this *particular* outcome.

Side by side, for that delivery-time interval of [28, 34] minutes:

- **Wrong:** "There is a 95% chance the true average delivery time is between 28 and 34 minutes."
- **Right:** "The method used to build this interval captures the true average delivery time in about 95% of repeated samples. 28 to 34 minutes is the plausible range this particular sample happened to produce."

The wrong version treats the true average like a random variable that's still up for grabs. It isn't — it's a fixed (if unknown) number. What's random is which sample you happened to draw, and therefore which interval you happened to compute.

It's also worth being explicit about what a CI is *not* claiming: it is not a statement about individual observations. "28 to 34 minutes" is the plausible range for the *average* delivery time across all deliveries — not a claim that 95% of individual deliveries fall in that window. Plenty of individual deliveries will be faster or slower than that.

## Why a 99% interval is wider than a 95% one

If you want to be right more often across repeated sampling — 99% of the time instead of 95% — you need to cast a wider net, because a narrower range is inherently less likely to capture the true value on any given draw. That's the real trade-off baked into every confidence interval: width versus reliability. A tighter, more useful-looking interval is less likely to actually contain the truth; demanding higher reliability costs you precision. Nothing about the data itself changes between a 95% and a 99% interval — only the multiplier applied to the margin of error changes, pushing the interval's edges further out.

Play with the simulator below to watch 50 simulated 95% intervals get built one after another, and see for yourself roughly how many of them end up missing the true mean — purely by chance, exactly as the method promises.

## Common mistakes

- Saying "there's a 95% chance the true value is in this interval" — the correct statement is about the method's long-run success rate, not this one interval's probability.
- Treating a confidence interval as a claim about individual data points, rather than about a population parameter like the mean.
- Assuming a narrower interval is automatically "better" — it's only better if it was built with the same confidence level; otherwise it may simply be less reliable.
- Forgetting that a 99% CI being wider than a 95% CI is not a flaw — it's the direct, necessary cost of demanding more reliability from the same data.
