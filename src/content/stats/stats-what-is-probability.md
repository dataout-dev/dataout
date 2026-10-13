Every statistical claim you'll ever read — "there's a 70% chance of rain," "the test has a 5% false positive rate," "this drug works better than placebo with 95% confidence" — is a probability statement wearing different clothes. Before any of that makes sense, you need the handful of ideas probability is actually built from.

You will learn:

- what a sample space is
- what an event is, formally
- the one rule every probability question reduces to
- a worked example with a die and a coin
- why this path starts here instead of jumping straight to inference

## The sample space: everything that could happen

A sample space is just the complete list of possible outcomes of some random process, with no outcome left out and no outcome listed twice. Roll a standard six-sided die, and the sample space is {1, 2, 3, 4, 5, 6}. Flip a coin, and it's {heads, tails}. Flip two coins in a row, and it's {HH, HT, TH, TT} — four outcomes, not two, because "one heads and one tails" can happen in two distinguishable orders.

Writing out the sample space feels pedantic for something as simple as a coin, but it stops being optional the moment a problem gets even slightly more complex. Most probability mistakes trace back to an incomplete or double-counted sample space, not to bad arithmetic.

## An event is just a subset of outcomes

An event is any subset of the sample space — a collection of outcomes you've decided to group together because you care about them as a unit. "Rolling an even number" is the event {2, 4, 6}, a subset of the full six-outcome sample space. "Rolling a 5" is the event {5}, a subset with only one outcome. Events can be as broad or as narrow as the question demands; the sample space doesn't change, only which outcomes you're bundling together as "the thing I'm asking about."

This reframing matters because it turns "what's the probability of X?" into a concrete counting or measuring problem: how much of the sample space does the event X cover?

## The one rule: probabilities sum to 1

Here is the single rule that almost every other probability fact is a special case of: **the probabilities of all outcomes in a sample space add up to exactly 1.** Something has to happen, and the sample space is defined as the list of everything that could — so the total "weight" across it must account for the whole of certainty, no more and no less.

For a fair six-sided die, each of the 6 outcomes is equally likely, so each gets probability 1/6, and 6 × (1/6) = 1. For a fair coin, each outcome gets 1/2, and 1/2 + 1/2 = 1. The probability of an event is then just the sum of the probabilities of the outcomes inside it: "rolling an even number" sums the probabilities of {2, 4, 6}, giving 1/6 + 1/6 + 1/6 = 1/2.

Outcomes don't have to be equally likely for this rule to hold — a weighted die could have probabilities 0.1, 0.1, 0.1, 0.1, 0.1, 0.5 for its six faces, and they'd still need to sum to 1. Equal likelihood is a convenient special case, not a requirement.

## A worked example: die and coin together

Suppose you roll a die and flip a coin at the same time. The sample space has 12 outcomes: each of the 6 die faces paired with each of the 2 coin faces (1-H, 1-T, 2-H, 2-T, ..., 6-T). If every combination is equally likely, each gets probability 1/12, and all 12 sum to 1, as the rule demands.

Now ask: what's the probability of "an even die roll and heads"? That event is {2-H, 4-H, 6-H} — three outcomes out of twelve — so its probability is 3/12 = 1/4. Notice you didn't need a special formula; you just identified the matching outcomes and summed their probabilities, exactly as the core rule says.

## Why start here

Later tiers in this path will talk about confidence intervals, p-values, and hypothesis tests — tools for reasoning under uncertainty when you only have a sample, not the full picture. Every one of those tools is, underneath, a statement about a sample space and an event: "if the true effect were zero, how much of the space of possible sample outcomes would look at least this extreme?" Without the vocabulary of sample spaces and events now, that machinery would feel like a trick. With it, it's just this same rule applied to messier situations.

## Common mistakes

- Forgetting to list order-distinguishable outcomes separately (treating "one head, one tail" from two coin flips as a single outcome instead of two: HT and TH).
- Assuming all outcomes are equally likely by default — many real sample spaces (a weighted die, a biased coin, a skewed population) are not.
- Confusing an event with an outcome — an event can contain many outcomes, or just one, or (rarely) none at all.
- Double-counting outcomes across overlapping events, which silently breaks the "sums to 1" rule.
