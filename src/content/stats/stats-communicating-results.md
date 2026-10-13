Running the right test and getting a clean result is only half the job. If the person reading your analysis walks away with the wrong idea — or no usable idea at all — the statistics underneath didn't actually help anyone, no matter how correctly you computed them.

You will learn:

- the difference between reporting "it was significant" and reporting a full result
- why statistical significance and practical significance are different questions
- what an honest analysis discloses about its own limitations
- why a plain-language summary matters even alongside full technical detail
- the questions a careful reader should ask of any claimed result

## "Significant" is not a complete sentence

It's tempting to boil a whole analysis down to a single word: significant, or not. But "we found a statistically significant difference" tells a reader almost nothing useful on its own — not how big the difference was, not how confident you really are in that size, and not whether it matters in practice. Compare that to: "we found a statistically significant difference (p = 0.02); the new design increased conversion by an estimated 1.2 percentage points, with a 95% confidence interval of [0.3, 2.1]." The second version gives the reader an actual effect size, a sense of how precisely it's been pinned down, and the raw evidence (the p-value) all together — everything they need to judge the result for themselves, instead of just taking a binary verdict on faith.

## Statistical significance versus practical significance

A result can be statistically significant and still be practically meaningless. With a large enough sample, even a tiny, real effect — a 0.02% increase in click-through rate, say — can clear a p-value threshold easily. Statistical significance answers one narrow question: "is this effect probably not just noise?" It says nothing about whether the effect is big enough to justify the cost of acting on it, which is a completely separate question that only the actual effect size (and the context around it — cost, risk, how many people it touches) can answer. A responsible report keeps these two questions visibly separate, rather than letting a small p-value imply importance it hasn't earned.

## What an honest analysis discloses

Transparency about an analysis's limitations is part of what makes its conclusions trustworthy, not a weakness to hide. A genuinely honest write-up discloses things like: the sample size the conclusion rests on (a result from 40 users carries a different weight than one from 40,000); confounding variables that weren't controlled for, if any plausible ones exist; how many comparisons or subgroups were actually tested before landing on the one being reported (tying directly back to the multiple-comparisons lesson); and any assumptions the chosen test depends on that might not perfectly hold.

This is the mirror image of p-hacking's instinct, from the previous tier, to quietly hide the parts of an analysis that don't support the preferred story. Disclosing limitations doesn't weaken a genuinely solid result — it's what lets a reader tell a genuinely solid result apart from one that's been dressed up to look more certain than it is.

## Why plain language still matters

Full technical detail — the test used, the p-value, the confidence interval, the sample size — should usually be available somewhere in a report. But most of the people who need to act on a result are not statisticians, and a technically correct result that nobody reading it actually understands fails at its real job, which is almost always to inform a decision. A short plain-language summary — "this change is likely to modestly increase signups, by somewhere between 0.3 and 2.1 percentage points; it's probably real but it's a small effect" — sitting right alongside the full technical detail lets both audiences get what they need from the same document, instead of forcing every reader to parse statistical notation to find out what actually happened.

## The questions a careful reader should ask

A report that says "this change improved the metric," with nothing else, should immediately prompt a few follow-up questions: improved *compared to what* baseline? By how much? With what uncertainty around that number? And is that difference big enough, relative to the noise, to be confident it's real rather than a fluke? Every one of those questions maps directly onto a concept this path has already covered — a baseline comparison, an effect size, a confidence interval, and statistical significance — and that's exactly the toolkit a careful reader (and an honest writer) should be reaching for before accepting, or presenting, any claim as settled.

## Common mistakes

- Reporting only "significant" or "not significant," with no effect size and no sense of uncertainty attached.
- Treating a small p-value as proof that an effect is large or important, rather than just unlikely to be pure noise.
- Omitting limitations — sample size, uncontrolled confounders, number of comparisons tried — because they seem to weaken the headline finding.
- Writing only for statisticians, leaving the people who actually have to make a decision from the result without a plain-language takeaway they can act on.
