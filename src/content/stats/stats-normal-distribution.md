If you had to bet on the shape of almost any large collection of natural measurements — heights, measurement errors, test scores, blood pressure readings — betting on the bell curve would win more often than betting on anything else. This lesson is about that shape, and the remarkably precise rule that comes bundled with it.

You will learn:

- what the normal distribution's bell shape represents
- the two parameters that completely define it
- the 68-95-99.7 empirical rule
- a worked numeric example using that rule
- why this particular distribution turns out to be so central to statistics

## The shape, and what it represents

The normal distribution (also called the Gaussian distribution, after Carl Friedrich Gauss) is a smooth, symmetric, bell-shaped curve. Most of the data piles up near the center, with progressively less data as you move further out in either direction — the tails get thinner and thinner but technically never quite touch zero. It's a *continuous* distribution: rather than assigning probability to individual exact values, it describes probability as *area under the curve* over a range of values.

Picture adult height in a large population. Very few people are extremely short or extremely tall; most people cluster fairly close to an average, with the number of people tapering off smoothly as you move toward either extreme. That tapering, symmetric clustering is exactly the shape the normal distribution describes.

## Two parameters, completely defining the curve

Unlike some distributions that need several knobs to describe, the normal distribution is fully specified by exactly two numbers:

- **Mean (μ)** — the center of the curve, where it peaks. This is also the balancing point: exactly half the distribution's area lies on either side of it.
- **Standard deviation (σ)** — how spread out the curve is. A small σ makes a tall, narrow bell; a large σ makes a short, wide one.

Change the mean and the whole curve slides left or right without changing its shape. Change the standard deviation and the curve stretches or compresses without changing its center. That's the entire vocabulary needed to describe any normal distribution — which is part of why it's so convenient to work with.

## The 68-95-99.7 rule

This is the single most useful fact about the normal distribution, and it's worth memorizing outright. For any normal distribution, no matter its specific mean or standard deviation:

- About **68%** of the data falls within **1 standard deviation** of the mean.
- About **95%** of the data falls within **2 standard deviations** of the mean.
- About **99.7%** of the data falls within **3 standard deviations** of the mean.

These percentages don't depend on what the mean or standard deviation actually *are* — they're a property of the normal shape itself, which is what makes the rule so portable.

## A worked example

Suppose adult heights in some population are normally distributed with a mean of 170 cm and a standard deviation of 8 cm. Applying the empirical rule directly:

- About 68% of people fall between 162 cm and 178 cm (170 ± 8).
- About 95% of people fall between 154 cm and 186 cm (170 ± 16).
- About 99.7% of people fall between 146 cm and 194 cm (170 ± 24).

Someone who is 186 cm tall is right at the edge of the 95% band — taller than roughly 97.5% of the population (the top half of that remaining 5%, since the curve is symmetric). Someone at 194 cm is near the extreme edge of almost the entire distribution. Notice how much work two numbers — a mean and a standard deviation — just did in pinning down the whole picture.

## Why the normal distribution is so central

Three things make the normal distribution the workhorse of statistics. First, many real processes genuinely produce roughly bell-shaped data, especially when a measurement is the sum of lots of small, independent influences. Second, it's mathematically convenient — a huge amount of statistical theory has closed-form answers specifically because the normal shape behaves so nicely under the hood. Third, and most surprisingly, something called the Central Limit Theorem (coming up later in this tier) guarantees that *averages* of almost any data tend toward a normal shape even when the original data itself isn't normal at all. That last fact is a big part of why confidence intervals and hypothesis tests — tools you'll meet soon — can lean on the normal distribution even when working with real-world data that looks nothing like a bell curve on its own.

Play with the explorer below to build the intuition before moving on.

## Common mistakes

- Assuming "68-95-99.7" only applies to one specific mean and standard deviation — it applies to *every* normal distribution, because it's a statement about proportions, not raw values.
- Mixing up standard deviation with the range of the data — a larger standard deviation means more spread, but it's not simply "the distance from smallest to largest value."
- Forgetting that the rule is approximate ("about" 68%, not exactly), even though it's precise enough to be useful for quick estimates.
- Assuming all real-world data is normal just because it's unimodal and roughly symmetric-looking — plenty of data is skewed or has heavier tails than a true normal curve.
