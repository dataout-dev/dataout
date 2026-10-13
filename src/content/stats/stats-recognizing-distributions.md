You now know four distributions by name — normal, binomial, Poisson, and uniform — plus the big idea (the CLT) that connects them to almost anything else. The harder, more practical skill is recognizing *which one fits a given real-world situation* before you've done any calculation at all. This lesson is a field guide for exactly that.

You will learn:

- how to match a real scenario to the right distribution, by asking the right questions
- the four scenario patterns covered in this tier and their matching distributions
- why the choice actually matters for downstream analysis, not just as a labeling exercise
- a few ambiguous cases that deserve a second look before you commit to one

## The field guide

Start by asking what you're actually counting or measuring, then match it to one of these patterns:

**"I'm counting rare-ish events over a fixed span of time or space, with no natural upper limit on the count" → Poisson.** Support tickets per hour, defects per batch, customer arrivals per minute. The giveaway is that there's no fixed "number of trials" — events just happen, scattered across a continuous window, at some average rate.

**"I have a fixed number of independent yes/no trials, and I'm counting successes" → binomial.** Twenty free throws, a hundred coin flips, five hundred independent customers each either converting or not. The giveaway is a countable, fixed n (you know in advance how many trials there will be) and a consistent per-trial success probability p.

**"Every outcome in some range is exactly as likely as every other" → uniform.** A fair die, a random number generator producing a value between two bounds, a process you genuinely believe has no preferred value anywhere in its range. The giveaway is the *absence* of any reason to expect clustering anywhere.

**"It's a natural continuous measurement built up from lots of small independent influences" → approximately normal.** Heights, measurement errors, standardized test scores, and (thanks to the CLT) sample means of almost anything, given a large enough sample. The giveaway is less a single obvious cue and more an accumulation of many small factors pushing a value up or down in roughly symmetric ways.

## Why this choice actually matters

Picking the wrong distributional assumption isn't just an academic slip — it changes the numbers you report. If you model a rare-event count with a normal distribution instead of a Poisson, you might compute a nonsensical negative lower bound for something that can never go below zero (a defect count, say). If you model fixed-trial success counts with a normal approximation when n is small, you can get a probability estimate for a case that the real binomial distribution says is essentially impossible, or vice versa. If you assume data is normal when it's actually heavily skewed, methods that rely on normality (certain confidence intervals and hypothesis tests, which you'll meet in the next tier) can quietly give you more confidence than the data actually supports.

Downstream, whoever uses your analysis — a business deciding on staffing levels from a ticket-rate forecast, an engineer setting a tolerance from a measurement distribution — inherits whatever distributional assumption you baked in. Getting the shape right isn't decoration on top of "the real analysis"; for a lot of problems, it *is* the real analysis.

## A few cases that deserve a second look

Not every situation drops neatly into one bucket. A process that looks Poisson at first glance (support tickets) might actually have a *changing* rate across the day (quiet overnight, busy during business hours) — closer to several different Poisson processes stitched together than one clean one, as the earlier lesson on the Poisson distribution noted. A binomial-looking situation (free throws) might have correlated trials if the person taking them gets measurably more confident after a streak of makes, mildly violating the independence the binomial model assumes. A seemingly normal measurement might actually be bounded at zero (many physical quantities can't go negative) and show a slight skew near that boundary that a pure normal model would miss.

None of this means the field guide above is wrong — it means real data deserves a quick sanity check against its assumptions (does the rate look constant? are the trials really independent? is the data actually symmetric, or does it pile up near a boundary?) rather than a reflexive match-and-move-on.

## Common mistakes

- Reaching for the normal distribution by default because it's the most familiar, even when the scenario is clearly a counting problem (Poisson or binomial) rather than a continuous measurement.
- Applying the binomial distribution to a situation where the number of trials isn't actually fixed or known in advance.
- Assuming a Poisson process's rate is constant without checking whether the underlying situation changes over the window being measured.
- Picking a distribution and never revisiting that choice even when the data clearly doesn't fit it well (for instance, a strong skew in something you assumed was normal).
