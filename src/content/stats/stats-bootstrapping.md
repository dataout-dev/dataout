Every confidence interval formula so far has leaned on a known mathematical shape — the normal curve, the t-distribution — to describe how a sample mean would wobble across repeated sampling. But what if you don't trust that assumed shape, or there's no clean formula for the particular statistic you care about (say, a median, or a ratio of two things)? Bootstrapping sidesteps the formula entirely by resampling from the one dataset you actually have.

You will learn:

- the core bootstrap idea: resampling with replacement from your own data
- why this works as a stand-in for drawing many fresh samples from the real population
- how to turn a pile of resampled statistics into a confidence interval
- a conceptual walkthrough with small, trackable numbers
- when bootstrapping is especially useful compared to a formula-based interval

## The core idea: pretend your sample is the population

Every formula-based confidence interval you've seen relies on a mathematical shortcut: assume the sampling distribution of your statistic looks approximately normal (or t-distributed), and use that assumed shape to work out a margin of error. That shortcut is convenient, but it rests on an assumption — and for some statistics (a median, a correlation coefficient, a ratio), there either isn't a clean formula, or the normality assumption is shaky with the data you actually have.

**Bootstrapping** takes a different, more brute-force approach: treat your sample as if it *were* the population, and simulate drawing many new samples from it by resampling **with replacement** — meaning any given data point can be picked more than once in the same resample, and some original points might not get picked at all. For each resample, compute the statistic you care about (the mean, median, whatever it is). Do this hundreds or thousands of times, and you end up with a whole pile of resampled statistics — essentially a hand-built approximation of the sampling distribution, built directly from your actual data instead of from an assumed formula.

## A conceptual walkthrough with tiny numbers

Picture a tiny dataset of five customer ratings: `3, 4, 4, 5, 2`. Their mean is 3.6. To bootstrap a confidence interval for that mean, you'd resample five values *with replacement* from this same set of five numbers, over and over:

- Resample 1 might come out as `4, 2, 4, 3, 4` (the value 4 got picked three times; 5 never got picked) — mean 3.4.
- Resample 2 might come out as `5, 5, 3, 2, 4` — mean 3.8.
- Resample 3 might come out as `3, 4, 2, 2, 5` — mean 3.2.

Repeat this a few thousand times, and each resample produces its own slightly different mean. Collect all of those means into one big list, and that list's own spread is your hand-built approximation of the sampling distribution — built without ever assuming it's normal, t-shaped, or anything else in particular.

## Turning the pile of resampled statistics into an interval

Once you have thousands of resampled means sitting in a list, building a 95% confidence interval is almost anticlimactic: sort the list and read off the value at the 2.5th percentile and the value at the 97.5th percentile. Whatever lies between those two cutoffs covers the middle 95% of all the resampled results — and that range *is* your bootstrap confidence interval. No formula for standard error, no assumption about the shape of anything — just the data, resampled many times, and the spread of what came out.

## Why this is powerful

Bootstrapping earns its keep in exactly the situations where formula-based intervals get shaky: when there's no tidy textbook formula for the statistic you care about, when your sample is small or oddly shaped and you're not confident the normal-distribution assumption holds, or when you'd simply rather let the data speak for itself than lean on an assumed mathematical shape. The tradeoff is computational rather than mathematical — you need to actually run the resampling process (typically thousands of times) rather than plug numbers into a closed-form equation, which is a trivial cost for a computer but would have been impractical before computers were cheap and fast.

## Common mistakes

- Resampling *without* replacement — that just reproduces the original sample every time and defeats the entire purpose.
- Using too few resampling trials (a few dozen instead of thousands), which gives a noisy, unstable estimate of the interval's edges.
- Assuming bootstrapping fixes a biased or non-random original sample — it only reflects whatever is already in the data you give it, for better or worse.
- Forgetting that each resample needs to be the *same size* as the original sample to properly mimic the variability of a real re-draw.
