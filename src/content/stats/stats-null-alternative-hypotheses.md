Before you can test whether anything "worked," you need to write down, in advance, two competing claims that cannot both be true — one skeptical, one hopeful — and let the data decide between them. Skip this step and it becomes very easy to convince yourself that whatever the data happened to show was the result you were looking for all along.

You will learn:

- what the null hypothesis (H0) represents, and why it's the skeptical default
- a concrete business example of stating H0 and its alternative
- why "failing to reject H0" is not the same as "proving H0 true"
- why H0 and the alternative hypothesis must be mutually exclusive
- the difference between a one-tailed and a two-tailed alternative hypothesis

## The null hypothesis: statistics' built-in skeptic

The **null hypothesis (H0)** is the default, "nothing interesting is happening" claim — no difference, no effect, no relationship — that you test your data against. It's deliberately boring on purpose. The whole logic of a hypothesis test is: assume H0 is true, then ask whether the data you actually observed would be a surprising thing to see under that assumption. If it would be surprising enough, you reject H0 in favor of something more interesting.

The **alternative hypothesis (H1)** is that "something interesting" claim — the one you're often actually hoping to find support for. It directly contradicts H0.

## A concrete example: does the new checkout design work?

Suppose a company redesigns its checkout page and wants to know whether the redesign changed the conversion rate. Before looking at a single data point, they'd state:

- **H0:** The new checkout design has no effect on conversion rate — it's the same as the old design.
- **H1:** The new checkout design *does* have an effect on conversion rate (changed it, in either direction).

Notice H0 is the cautious, "nothing changed" position, even though the company presumably redesigned the page *hoping* it would help. That's intentional — the null hypothesis isn't meant to represent what you want to be true, it's meant to represent the position you'd need good evidence to abandon.

## Failing to reject H0 is not the same as proving it true

If the checkout test comes back without enough evidence to reject H0, the honest conclusion is "we didn't find strong enough evidence that the design changed anything" — not "we have proven the design has zero effect." Those are very different claims. The test might have had too small a sample, too noisy a metric, or a genuinely tiny effect that's hard to detect (this exact issue gets its own full treatment two lessons from now, under statistical power). A hypothesis test is built to protect against believing in effects that aren't real; it was never built to *positively confirm* that an effect doesn't exist. Absence of evidence isn't evidence of absence.

## Why H0 and H1 must be mutually exclusive

H0 and H1 have to cover non-overlapping territory, because the entire test is structured as "evidence against H0 is evidence for H1." If H0 and H1 could both be true simultaneously, rejecting H0 wouldn't actually tell you anything definite about H1 — you'd have thrown out the skeptical position without landing anywhere specific. In the checkout example, H0 ("no effect") and H1 ("some effect, in either direction") can't both hold at once: either the design changed conversion or it didn't.

## One-tailed vs. two-tailed: does direction matter?

A **two-tailed** alternative hypothesis allows for change in *either* direction and is the more cautious, more common default: "the new drug *changes* recovery time" covers both speeding it up and slowing it down. A **one-tailed** alternative commits to a specific direction in advance: "the new drug *reduces* recovery time" only counts evidence of improvement — if the drug actually made recovery slower, a one-tailed test built around "reduces" wouldn't be structured to flag that as the kind of surprising result it's looking for.

The direction has to be chosen *before* looking at the data, based on genuine prior reasoning (like a drug's known mechanism), never after peeking at which direction the results happen to point — choosing it afterward quietly stacks the deck in your own favor.

## Common mistakes

- Writing H0 as the claim you're hoping to prove, rather than as the skeptical "nothing's going on" default.
- Treating "failed to reject H0" as equivalent to "H0 is proven true."
- Choosing a one-tailed test's direction *after* seeing which way the data leans, rather than deciding it in advance.
- Letting H0 and H1 overlap, which makes "rejecting H0" fail to clearly support any specific alternative.
