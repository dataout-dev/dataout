A medical test comes back positive for a disease the patient doesn't actually have. Another test comes back negative for a disease the patient actually does have. Both are mistakes, but they're opposite kinds of mistakes — and every single hypothesis test you'll ever run carries some risk of each one, no matter how carefully it's designed.

You will learn:

- what a Type I error (false positive) is, with a concrete example
- what a Type II error (false negative / miss) is, with a concrete example
- exactly what the significance level α controls
- why you can't drive both error rates to zero at once, for a fixed sample size
- how a bigger true effect size lowers the Type II error rate

## Type I error: the false alarm

A **Type I error** happens when you reject a true null hypothesis — you conclude something interesting is going on when, in reality, nothing is. In the medical testing world, this is the patient who tests positive for a disease they don't actually have: a false alarm. In a business context, it's launching a new feature because a test said it improved conversion, when in truth the apparent improvement was just random noise.

## Type II error: the miss

A **Type II error** happens when you fail to reject a false null hypothesis — there genuinely is an effect, but your test didn't find strong enough evidence to detect it. In the medical example, this is the patient who tests negative despite actually having the disease: a missed diagnosis. In the business example, it's a feature that truly does improve conversion, but the test came back inconclusive anyway — maybe the sample was too small, or the effect too subtle to show up clearly.

These two error types sit on opposite sides of the same decision. A test that's extremely cautious about ever declaring "there's an effect" will rarely commit a Type I error — but that same caution makes it more likely to miss real effects, raising its Type II error rate. A test that's eager to declare effects will catch more real ones, but also triggers more false alarms.

## What α directly controls

The significance level **α** (commonly set at 0.05) is, by definition, the Type I error rate — the probability of a false positive, assuming H0 is actually true. Setting α = 0.05 is a deliberate choice to accept a 5% long-run false-alarm rate, in exchange for a workable, standardized decision rule. Lowering α (say, to 0.01) makes false alarms rarer, which sounds purely good — until you notice what it does to the other kind of error.

## The error that's harder to pin a single letter to: β

The Type II error rate is usually called **β** (beta). Unlike α, which you choose directly when designing a test, β depends on several things at once: your sample size, how noisy your data is, and — critically — how large the real effect actually is. A tiny, genuinely real effect is easy to miss; a large, obvious one is hard to miss, even with a modest sample. As the true effect size grows, the gap between what H0 predicts and what's actually happening becomes more visible against the backdrop of ordinary sampling noise, and β shrinks accordingly.

## The fundamental tradeoff: you can't shrink both at once

Here's the uncomfortable mechanics underneath all of this: for a *fixed* sample size, making your test stricter about false positives (lowering α) necessarily makes it less sensitive to real effects (raising β), and vice versa. Picture a court trial that only convicts on overwhelming evidence — fewer innocent people get wrongly convicted (fewer Type I errors), but more genuinely guilty people walk free (more Type II errors). Loosen the standard of evidence, and the balance tips the other way.

The only way to improve both error rates *simultaneously* is usually to collect more data. A bigger sample narrows the sampling distributions involved, making it easier to tell a real effect apart from noise without having to trade one error type off against the other — which is exactly why sample size gets its own full lesson next, under statistical power.

Slide the true effect size in the widget below and watch the null and alternative distributions separate, and the error regions shrink and grow, before moving on.

## Common mistakes

- Mixing up which error is which — Type I is a false positive (rejecting a true H0); Type II is a false negative (failing to reject a false H0).
- Assuming lowering α is an unambiguous improvement, without noticing it raises β for the same sample size.
- Believing a test can be made simultaneously stricter about false positives and more sensitive to real effects without any added cost.
- Forgetting that β depends heavily on the true effect size — a test that misses tiny effects routinely might catch large ones easily.
