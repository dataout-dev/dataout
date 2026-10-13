Every formula for a confidence interval or a hypothesis test you've seen so far has quietly assumed you know the population's true standard deviation. In the real world, you almost never do — you only have your sample's standard deviation, which is itself just an estimate with its own uncertainty. The t-test is what you reach for the moment that gap matters.

You will learn:

- why knowing only a sample's standard deviation (not the population's) changes which test you need
- the difference between a one-sample and a two-sample t-test
- what Welch's t-test is, and how it differs from Student's t-test
- why Welch's version is the safer default when you're not sure the two groups have equal variance

## Why a t-test instead of a z-test

A z-test (the kind built directly on the normal distribution, using a fixed, known population standard deviation) is clean and simple — but it assumes something that's almost never true in practice: that you already know exactly how spread out the population is, independent of your sample. Realistically, you only have your sample's own estimate of spread, and that estimate carries extra uncertainty of its own, especially with smaller samples.

The t-test accounts for that extra layer of uncertainty. It uses the same basic idea as a z-test — compare an observed difference to how much you'd expect that difference to wobble by chance — but swaps in the sample's estimated standard deviation and replaces the normal distribution with the slightly wider, "fatter-tailed" t-distribution, which gets closer to normal as the sample size grows and the standard-deviation estimate becomes more trustworthy.

## One-sample vs. two-sample

A **one-sample t-test** compares a single sample's mean against some known or hypothesized value. A coffee roaster claims its bags average 454 grams; you weigh a sample of 20 bags and ask whether their average is consistent with that claimed value, or significantly different from it. There's only one group of data and one fixed number to compare it to.

A **two-sample t-test** compares the means of *two separate* samples against each other — did the groups actually come from populations with the same average, or not? A classic setup: measure response times for users on an old website layout and a new one, and ask whether the two groups' average response times genuinely differ, or whether any difference you see is just sampling noise.

## Welch's t-test vs. Student's t-test

When comparing two groups, there's a further fork in the road: do the two groups have roughly the same amount of variability (variance), or not? **Student's t-test** (the original, classic version) assumes the two groups' variances are equal, and pools them together into a single estimate of spread. **Welch's t-test** drops that assumption — it lets each group have its own, separately estimated variance, and adjusts the test's degrees of freedom accordingly.

Picture comparing wait times at two coffee shops: Shop A is extremely consistent (every customer waits close to 4 minutes), while Shop B is wildly inconsistent (some customers wait 1 minute, others wait 12). Those two groups clearly don't share the same variance. Feeding that mismatch into Student's test, which assumes equal variance, can distort the result — sometimes making a real difference in average wait time look less reliable than it is, or vice versa.

In practice, you rarely know in advance whether two groups truly have equal variance, and testing for that first adds its own complications. Welch's test sidesteps the question entirely by never assuming equal variance in the first place — which costs essentially nothing when variances genuinely are equal, but protects you when they aren't. That asymmetry (little downside, real upside) is exactly why Welch's version has become the more commonly recommended default for comparing two independent groups, rather than something you reach for only in special cases.

## Common mistakes

- Using a z-test with an assumed, made-up population standard deviation instead of a t-test built on the sample's actual estimated spread.
- Confusing a one-sample t-test (comparing a sample to a fixed known value) with a two-sample t-test (comparing two samples to each other).
- Defaulting to Student's t-test out of habit without considering whether the two groups' variances actually look comparable.
- Assuming a statistically significant t-test result on its own tells you the difference is large or practically important — that still requires looking at the effect size, not just the test's p-value.
