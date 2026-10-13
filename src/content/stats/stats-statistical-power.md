A study runs, finds no statistically significant effect, and gets reported as "the treatment doesn't work." But there's a third possibility nobody mentioned: the study might simply never have had a realistic chance of detecting the effect, even if it's genuinely there. That chance has a name — statistical power — and ignoring it is one of the quietest, most common ways research goes wrong.

You will learn:

- what statistical power means, formally: 1 − β
- the main things that increase power
- how to responsibly interpret a non-significant result from a study that might have been underpowered
- why researchers run a power analysis before collecting any data, not after
- why a significant result from a very low-power study deserves extra scrutiny

## Power: the flip side of a miss

**Statistical power** is the probability that a test correctly detects a real effect when one genuinely exists — formally, `power = 1 − β`, where β is the Type II error (miss) rate from the previous lesson. A test with 80% power will, on average, successfully detect a real effect of the assumed size in 8 out of 10 studies run under those conditions, and miss it in the other 2.

High power is desirable for the obvious reason: it means your test is actually capable of doing its job. A test with low power is one where even a genuinely real, meaningful effect has a good chance of slipping through undetected — not because the effect isn't there, but because the test simply wasn't sensitive enough to catch it.

## What increases power

Three main levers push power upward:

- **A larger sample size.** More data narrows the sampling distributions involved, making a real effect easier to distinguish from ordinary noise. This is usually the most practical lever to pull.
- **A larger true effect size.** Bigger, more obvious effects are inherently easier to detect than subtle ones — this isn't something you can control directly, but it affects how much power you'll need to reliably catch the effect you're looking for.
- **A less strict α**, sometimes. Allowing a higher false-positive rate makes it easier to also catch true positives — though this comes at the direct cost of more Type I errors, so it's rarely the first lever reached for.

## Reading a non-significant result responsibly

Suppose a company tests a new onboarding flow on a modest sample and finds no statistically significant improvement in retention. The tempting conclusion is "the new flow doesn't help." The more responsible conclusion, especially if the sample was small, is: "we did not find strong enough evidence that the new flow helps — but this study may simply not have had enough power to detect an effect of a realistic, meaningful size, even if one exists."

These are genuinely different claims. "We found no evidence" is a statement about what a particular, possibly underpowered study managed to detect. "There is no effect" is a much stronger claim about reality, and a non-significant result from a low-power study is weak support for it either way — the effect could easily be real and simply too small, relative to the noise and sample size, for this particular study to have caught it.

## Why run a power analysis first

A **power analysis**, done *before* collecting any data, estimates how large a sample you'd need to have a reasonable chance (commonly targeting 80% power) of detecting an effect of some meaningful, pre-specified size. Running it in advance avoids a costly, deflating scenario: spending weeks or months collecting data, only to end up with a study so small that even a real, important effect would likely have gone undetected — leaving you stuck with an ambiguous "no significant result" that can't distinguish "there's no effect" from "we just didn't have the sensitivity to see it."

## The flip side: suspicious significant results from low-power studies

There's a subtler, counterintuitive caution worth flagging: when a very low-power study *does* manage to turn up a statistically significant result, that result is more likely than usual to be an inflated or exaggerated estimate of the true effect. In a low-power setting, only unusually large, extreme-looking observed effects clear the significance bar at all — so the ones that do clear it are a biased, overly dramatic sample of what's really going on, not a representative one.

## Common mistakes

- Reporting a non-significant result as proof that an effect doesn't exist, without considering whether the study had enough power to detect it in the first place.
- Skipping a power analysis and discovering only after data collection that the sample was too small to realistically detect anything of interest.
- Assuming power is purely a function of sample size, ignoring that the true effect size and chosen α also shape it.
- Trusting a significant finding from an obviously underpowered study at face value, without the extra skepticism it deserves.
