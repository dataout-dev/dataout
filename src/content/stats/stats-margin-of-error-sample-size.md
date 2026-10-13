A poll with 100 respondents has a wide, almost useless margin of error. A poll with 10,000 respondents on the same question is noticeably tighter. It's tempting to assume that 100x more data buys you 100x more precision — but the real relationship is far less generous, and understanding exactly how much less generous is the key to not wasting a research budget.

You will learn:

- what margin of error actually is, and how it's built from the standard error
- why increasing sample size shrinks the margin of error
- the 1/√n relationship, and why it means "half the margin of error costs four times the data"
- how to work through that relationship with real numbers
- why there's a point past which collecting more data stops being worth it

## Margin of error, built from standard error

The **margin of error** is the "give or take" part of an estimate — the ± in "31 minutes, give or take 3." It's calculated as the standard error multiplied by a number tied to your desired confidence level (commonly 1.96 for 95% confidence, which is where that familiar "roughly 2 standard errors" rule of thumb comes from).

Since the standard error itself is `s / √n` (sample spread divided by the square root of sample size), the margin of error inherits that same relationship with `n`. Bigger samples produce smaller standard errors, which produce smaller margins of error — a more precise, more useful estimate.

## The 1/√n relationship, and why it's a trap

Here's the part that catches people off guard: because the sample size sits *under a square root*, precision does not scale in a simple 1-to-1 way with how much data you collect.

Walk through it with numbers. Suppose a poll of n = 100 has a standard error that, after multiplying by 1.96, gives a margin of error of about ±10 percentage points — too wide to be useful. To cut that margin of error exactly in **half**, down to ±5 points, you don't need twice the data. You need **four times** the data: n = 400. Halving a margin of error requires quadrupling the sample size, every time, because `√4 = 2` — doubling the thing inside the square root only doubles the square root's *input*, while the margin of error shrinks in proportion to the square root's *output*.

Scale that up further: going from n = 100 to n = 10,000 is a 100x increase in sample size. The standard error (and the margin of error riding on it) shrinks by a factor of `√100 = 10` — a real, substantial improvement, but nowhere near the 100x improvement a naive guess might expect.

## Diminishing returns on ever-larger samples

This square-root relationship has a practical, often expensive consequence: the first chunk of data you collect buys you a lot of precision, and each additional chunk buys you progressively less. Going from n = 10 to n = 40 (4x the data) cuts your margin of error in half. Going from n = 10,000 to n = 40,000 — also 4x the data, but a vastly larger and more expensive undertaking — cuts the margin of error in half again, by exactly the same proportion. The *relative* improvement is identical; the *cost* of achieving it is wildly different.

This is why survey researchers, pollsters, and A/B test designers don't simply chase "more data is always better" without limit. At some point, the next few thousand respondents or the next few weeks of a test buy a shrinking sliver of extra precision for a real, mounting cost — and a smaller, cheaper sample that's merely "precise enough" for the decision at hand is often the more sensible choice than chasing a marginally tighter interval.

It's also worth noting what *doesn't* shrink the margin of error: a noisier, more variable underlying population (a bigger `s`) pushes it back up, which is why a highly variable measurement — say, household income rather than shoe size — needs a proportionally larger sample to reach the same precision as a more consistent one.

Try dragging the sample-size slider below and watch exactly how fast — or how slowly — the margin of error responds, to build a feel for this trade-off before relying on it in practice.

## Common mistakes

- Assuming doubling the sample size halves the margin of error — it actually takes quadrupling the sample size to achieve that.
- Chasing an ever-larger sample without weighing the shrinking precision gained against the real cost of collecting more data.
- Forgetting that a more variable population needs a larger sample to reach the same precision as a more consistent one, all else equal.
- Treating margin of error as fixed once chosen — it depends on your confidence level, your sample's spread, and your sample size all at once, and changing any one of them changes it.
