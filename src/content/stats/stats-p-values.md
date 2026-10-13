A p-value of 0.04 gets reported, and somewhere down the line someone summarizes it as "there's a 96% chance this effect is real." That sentence is wrong, and it's wrong in a way that's so common it might be the single most frequently misquoted number across all of science and data analysis. Getting this one definition exactly right is worth the careful read.

You will learn:

- the correct, precise definition of a p-value
- the two most common ways people misread it, and why each one is wrong
- how the conventional α = 0.05 threshold is used to make a decision
- a concrete worked example with a specific p-value
- why a tiny p-value doesn't automatically mean a practically important effect

## What a p-value actually is

A **p-value** is the probability of observing data at least as extreme as what you actually got, **assuming the null hypothesis is true**. That conditional clause — "assuming H0 is true" — is not a footnote. It's the entire definition. A p-value never steps outside the hypothetical world where H0 holds; it only tells you how surprising your data would look *within* that world.

Picture testing whether a coin is fair (H0: it's fair, 50/50) by flipping it 20 times and getting 16 heads. The p-value here answers one specific question: "if the coin really were fair, how likely would it be to see 16-or-more heads (or, for a two-tailed test, a result this far from 10-10 in either direction) out of 20 flips, just from ordinary randomness?" If that probability turns out to be small — say, 0.012 — it means a result this lopsided would be a fairly rare thing to see from a genuinely fair coin. That rarity is the evidence against H0.

## The misreading that just won't die

Here is the single most common misinterpretation: **"the p-value is the probability that H0 is true"** (or, equivalently, "the probability that the effect is real"). This is not what a p-value measures, and the two numbers can be wildly different. A p-value starts by *assuming* H0 is true and asks about the data; it never flips around to ask about the probability of H0 itself, given the data. Answering that reversed question honestly would require a different statistical framework entirely (a Bayesian one, which needs a prior belief about how likely H0 was before you even collected data) — plain p-values simply don't contain that information, no matter how tempting it is to read it in.

So for that coin example with p = 0.012: the correct statement is "if this coin were fair, there'd be about a 1.2% chance of seeing a result this extreme just from randomness." The incorrect statement is "there's a 98.8% chance the coin is unfair." The first sentence is a fact about the data under an assumption. The second sentence is a claim about the assumption itself — and the p-value was never built to answer that.

## The α = 0.05 convention

To turn a p-value into an actual yes/no decision, most fields pre-agree on a threshold, called **alpha (α)**, commonly set at 0.05. If the p-value comes in *below* α, the result is called "statistically significant," and H0 is rejected in favor of H1. A p-value of 0.04 crosses a 0.05 threshold and would conventionally be called significant; a p-value of 0.09 would not.

It's worth being clear that 0.05 is a widely-used convention, not a law of nature — some fields use stricter thresholds (like 0.01 or smaller) when false positives are especially costly, such as approving a new drug.

## Small p-value ≠ big, important effect

A tiny p-value (0.0001, say) tells you the observed data would be very surprising under H0 — nothing more. It does not tell you the effect is *large* or *practically meaningful*. With a sufficiently large sample, even a trivially small, practically irrelevant effect can produce a very small p-value, simply because large samples make the test extremely sensitive to even faint signals. "Statistically significant" answers the narrow question "is this probably not just random noise?" — it does not answer "does this matter enough to act on?" That second question depends on the *size* of the effect, not just its p-value, and gets a full, dedicated treatment in a later tier on effect size.

Try shading the rejection region and sliding the observed z-statistic in the widget below to watch exactly how the p-value responds as a result gets more or less extreme.

## Common mistakes

- Reading a p-value as "the probability H0 is true" or "the probability the effect is real" — it's neither.
- Treating α = 0.05 as a hard scientific law rather than a widely-used, adjustable convention.
- Assuming a very small p-value automatically means a large or important effect, rather than checking the effect size directly.
- Forgetting that the p-value is calculated under the assumption that H0 is true — it can never, by construction, tell you the probability of H0 itself.
