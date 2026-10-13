Not every distribution needs a peak. Sometimes the most accurate description of a situation is "every outcome in this range is exactly as likely as every other one" — no favorite value, no clustering anywhere. That's the uniform distribution, and it turns out to be a genuinely useful contrast for understanding what "shape" even means in a distribution.

You will learn:

- what a flat density actually describes
- the mean of a uniform distribution, (a+b)/2
- the random-number-generator framing of uniform randomness
- how the uniform distribution's flatness contrasts with the normal distribution's peak
- the difference between discrete and continuous uniform distributions

## A flat density

The uniform distribution describes a situation where every value (or outcome) within some range is equally likely, and nothing outside that range is possible at all. For a continuous uniform distribution between a lower bound a and an upper bound b, the probability density is completely flat across that interval — a horizontal line, rather than the bell-shaped curve you've seen elsewhere in this tier — and exactly zero outside of [a, b].

Nothing is favored. If a = 0 and b = 10, the value 2.3 is no more and no less likely to occur in any small neighborhood than the value 7.8 — both are governed by the same flat density across the entire range.

## The mean is just the midpoint

Because every value in the range is equally weighted, the mean of a uniform distribution sits exactly at the midpoint of its bounds:

```text
mean = (a + b) / 2
```

For a uniform distribution between 0 and 10, the mean is (0 + 10) / 2 = 5 — dead center, exactly as you'd expect from a distribution with no lean toward either end. Compare this to the normal distribution, where the mean was a separate parameter you had to specify directly; here, it falls straight out of the bounds themselves, because flatness forces the balance point to be the midpoint.

## The random-number-generator framing

The simplest way to build intuition for the uniform distribution is through a plain random number generator. When you ask a computer for "a random number between 0 and 1," it's (ideally) drawing from a continuous uniform distribution over [0, 1] — every value in that range, down to arbitrary precision, is equally likely to come up. This is precisely why uniform random draws are the raw building block underneath most other kinds of simulated randomness: a Poisson-distributed count, a normally distributed sample, a shuffled deck of cards — all of them, under the hood, are typically constructed by transforming draws from a uniform distribution into the shape you actually want.

## Contrast with the normal distribution

The normal distribution you met earlier in this tier is defined by its *peak* — values near the mean are more likely, and likelihood tapers off the further you move away. The uniform distribution has no peak at all, by design: nothing is more or less likely than anything else within its bounds, and the "likelihood" simply stops abruptly at the edges rather than tapering off gradually.

This contrast is worth sitting with, because it makes the abstract idea of "distribution shape" concrete. Shape isn't just "where's the mean" — it's the entire pattern of which values are relatively common and which are relatively rare. A normal distribution and a uniform distribution can even share the exact same mean and still look nothing alike, because shape captures something the mean alone never does.

## Discrete vs. continuous uniform

A uniform distribution can be either discrete or continuous, depending on what you're modeling. A fair six-sided die is a **discrete** uniform distribution: the outcomes are the separate whole numbers {1, 2, 3, 4, 5, 6}, each with probability exactly 1/6, and nothing in between (there's no such outcome as "2.5"). A randomly generated fraction between 0 and 1 is a **continuous** uniform distribution: any real number in that range is a possible outcome, and there are infinitely many of them, so no single exact value has positive probability — only ranges of values do (the probability of landing between 0.2 and 0.3 is a meaningful, nonzero number, even though the probability of landing on exactly 0.25 is effectively zero).

Play with the explorer below to build the intuition before moving on.

## Common mistakes

- Assuming a uniform distribution has "no mean" or "no meaningful average" just because nothing is favored — it has a perfectly well-defined mean, simply at the midpoint.
- Treating discrete and continuous uniform distributions as interchangeable — a die roll and a random fraction behave quite differently when it comes to the probability of any single exact value.
- Assuming flat always means "boring" or "uninformative" — a flat prior or flat assumption is a meaningful modeling choice in its own right, not an absence of one.
- Forgetting that the uniform distribution assigns exactly zero probability outside its bounds, unlike the normal distribution's thin-but-nonzero tails stretching indefinitely.
