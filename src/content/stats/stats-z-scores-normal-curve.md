A z-score tells you how many standard deviations a value sits from the mean — but "2.1 standard deviations away" isn't, by itself, a probability. This lesson connects that distance to an actual probability, using the shape of the normal curve you just met.

You will learn:

- how a z-score connects to a probability via the normal curve
- what the CDF (cumulative distribution function) represents
- how to reason through a worked example by hand
- when you want "probability below" versus "probability above"
- how this sets up the practice exercise for this lesson

## From distance to probability

A z-score converts any normal value into a standardized distance: z = (x − μ) / σ. A z-score of 0 means you're exactly at the mean. A z-score of 2 means you're two standard deviations above it. That distance is useful on its own, but the far more common question is: *given this distance, what fraction of the distribution lies beyond (or before) it?*

That's where the shape of the normal curve comes back in. Because the normal curve's area is heavily concentrated near the center and thins out in the tails, a given z-score distance always corresponds to a fixed, well-defined chunk of area under the curve — regardless of what the original mean and standard deviation were. A z-score of 2 always leaves about the same proportion of area beyond it, whether you started with heights in centimeters or exam scores out of 100.

## What the CDF represents

The cumulative distribution function (CDF) of the normal distribution answers one specific question: *what fraction of the area under the curve lies to the left of this point?* If you give it a z-score (or an x-value, together with μ and σ), it hands back a number between 0 and 1 — the probability of landing at or below that point.

Picture shading in the entire region of the bell curve to the left of some vertical line. The CDF is just the size of that shaded region, expressed as a fraction of the whole area (which, as you saw in the previous lesson, always totals 1). Move the line further right, and more area gets shaded, so the CDF value increases; move it left, and less gets shaded.

This is exactly the same idea as the empirical rule from the last lesson, just generalized. The empirical rule told you the area within ±1, ±2, and ±3 standard deviations. The CDF answers the same *kind* of question for *any* point, not just the three round numbers 1, 2, and 3.

## Reasoning through an example

Suppose exam scores are normally distributed with a mean of 75 and a standard deviation of 10. A student scores 85. Their z-score is (85 − 75) / 10 = 1.0 — exactly one standard deviation above the mean.

From the empirical rule, you already know that roughly 68% of the distribution sits within one standard deviation of the mean, split evenly on both sides (symmetry) — so about 34% sits between the mean and one standard deviation above it. Add that to the 50% that sits below the mean entirely, and you get roughly 84% of students scoring 85 or below. That 0.84-ish figure is exactly what a normal CDF evaluated at that point would return — the empirical rule is really just the CDF evaluated at the convenient round numbers 1, 2, and 3.

## Above vs. below — same tool, opposite question

The CDF always gives you area to the *left* — the probability of being at or below a value. Plenty of real questions ask the opposite: what's the probability of scoring *above* 85, or a part being *above* some stress threshold, or a process running *longer* than some time? Since the total area under any distribution is 1, the probability of being above a point is just 1 minus the CDF at that point. Choosing which one you actually want is a matter of reading the question carefully — "at least," "more than," "exceeds" usually points toward "above"; "at most," "no more than," "under" usually points toward "below."

For the practice exercise in this lesson, you'll build a small function that uses the normal CDF to answer exactly this kind of "what fraction falls below this value" question, given a value and the distribution's mean and standard deviation. The worked exam example above shows the reasoning; the function you write will do that same computation precisely, for any input, rather than relying on the rounded empirical-rule shortcuts.

## Common mistakes

- Forgetting that the CDF gives area to the *left*, and reporting it directly when the question actually asked for the probability *above* a value.
- Mixing up a z-score (a distance in standard deviations) with the probability itself (a number between 0 and 1) — they are related but are not the same quantity.
- Using the empirical rule's rounded figures (68/95/99.7) when a more exact, non-round z-score demands the actual CDF rather than an eyeballed approximation.
- Plugging in the raw value x where a standardized z-score was expected, or vice versa, without checking which form a particular formula or function wants.
