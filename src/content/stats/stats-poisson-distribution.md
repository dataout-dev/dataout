Some things don't have a natural "number of trials" at all — you can't say how many "attempts" led to 7 customer support tickets between 2pm and 3pm. The Poisson distribution is built for exactly this kind of counting problem: rare-ish events scattered across a fixed window of time or space.

You will learn:

- the single parameter, lambda, that defines a Poisson distribution
- why lambda is simultaneously the mean and the variance
- a worked example with support tickets per hour
- why small lambda looks skewed and large lambda looks more symmetric
- the constant-rate assumption, and a case where it breaks

## One parameter: lambda

The Poisson distribution describes the number of events occurring in a fixed window, given a single parameter, **lambda (λ)** — the average rate of events per window. If support tickets arrive at an average rate of 3 per hour, λ = 3 for the "per hour" window. There's no separate "number of trials" the way there is for the binomial; events can in principle happen at any instant within the window, and you're simply counting how many land inside it.

This makes the Poisson distribution the natural fit whenever you're counting occurrences of something relatively rare, scattered across a continuous span, rather than counting successes out of a fixed, countable number of attempts.

## Lambda does double duty: mean and variance

One of the Poisson distribution's distinctive features is that its single parameter serves two jobs at once: λ is both the **mean** (expected count) and the **variance** (a measure of spread) of the distribution. A Poisson distribution with λ = 3 has an average of 3 events per window *and* a variance of 3 — you can't independently dial up the spread without also changing the average, unlike the normal distribution's two separate knobs.

A practical consequence: as λ grows, the *absolute* spread grows too (since variance grows with λ), but the *relative* spread (spread relative to the mean) shrinks. Counts become proportionally more predictable at higher rates, even though the raw range of plausible counts widens.

## A worked example: support tickets

Suppose a support team receives support tickets at an average rate of λ = 4 per hour. In any given hour, the actual count might be 2, or 4, or 7 — the Poisson distribution tells you how likely each specific count is, given that the long-run average is 4. Counts close to 4 (the mean) are the most probable; counts far above or below 4 become increasingly unlikely, though never strictly impossible — technically, Poisson-distributed counts can be any non-negative integer, with the probability simply thinning out for values far from λ.

## Skewed near zero, more symmetric at scale

When λ is small — say, λ = 0.5, an average of one event every two hours — the distribution is noticeably skewed: 0 events is actually the single most likely outcome, 1 event is somewhat likely, and counts of 4 or 5 in one window are rare. The distribution can't dip below zero, so with a small mean, it piles up near that lower boundary and stretches out to the right.

As λ grows larger — say, λ = 50 — the distribution starts looking much more symmetric and bell-shaped, clustering fairly evenly around 50 in both directions. This is the same phenomenon you saw with the binomial distribution: as the "scale" of a counting distribution grows, its shape increasingly resembles the normal curve, another preview of the Central Limit Theorem waiting later in this tier.

## The constant-rate assumption

The Poisson distribution assumes events occur at a *constant* average rate throughout the window, and independently of each other. This is a real assumption, not a technicality, and it breaks in identifiable ways. If a support team's ticket rate is normally λ = 4 per hour but a site-wide sale just started and problems are now pouring in at a much higher rate, the "constant rate" assumption is violated — you're no longer looking at one Poisson process, but effectively two different ones stitched together (before the sale, and during it). Applying a single Poisson model with one λ across that entire window would systematically mis-describe the busier period, since the true underlying rate changed partway through.

Play with the explorer below to build the intuition before moving on.

## Common mistakes

- Using a single λ to model a process whose underlying rate clearly changes within the window (a sale, a holiday, a system outage).
- Forgetting that the Poisson distribution has no natural upper bound on the count, even though very high counts become extremely unlikely.
- Confusing λ as a rate "per window" with a probability — λ can exceed 1 (you can average more than one event per hour), unlike a probability, which cannot.
- Assuming events are independent of each other when they might cluster (one support ticket often triggers related follow-up tickets), which violates the independence the Poisson model assumes.
