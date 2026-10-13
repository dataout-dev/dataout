A lot of real questions boil down to: "I'm going to try this a fixed number of times, each attempt either succeeds or fails, and I want to know how many successes to expect." That's the binomial distribution's entire job description.

You will learn:

- the two parameters that define a binomial distribution: n and p
- why independence between trials is required
- how to compute the expected number of successes
- a worked example with free-throw shooting
- why the binomial shape starts looking normal as n grows

## Trials, successes, and the two parameters

The binomial distribution describes the number of successes across a fixed number of independent yes/no trials. It's defined by exactly two parameters:

- **n** — the number of trials (fixed in advance, not random).
- **p** — the probability of success on any single trial (the same for every trial).

Each individual trial is sometimes called a Bernoulli trial: it has exactly two outcomes, success or failure, with no middle ground. The binomial distribution tracks the *total count of successes* across n of these trials, not any single trial's outcome.

## Why independence matters here

For the binomial distribution's formulas to apply correctly, each trial's outcome must be independent of every other trial's outcome — the same requirement you saw in the previous lesson. If trials influence each other (a streaky shooter who gets more confident after makes, or drawing cards without replacement where earlier draws change later odds), the actual distribution of successes departs from the clean binomial shape, and the standard formulas for its mean and spread no longer hold exactly.

This is why "20 independent coin flips" is a textbook-perfect binomial setup, while "20 shots in a row by a player who might be streaky" is a more debatable one in practice — useful as an approximation, but not a guaranteed match.

## Expected value: n times p

The expected number of successes in a binomial setting is simply:

```text
E[successes] = n × p
```

This makes intuitive sense: if each of n trials succeeds with probability p on average, the total expected successes scales directly with both how many trials you run and how likely each one is to succeed.

## A worked example: free throws

Suppose a basketball player makes free throws independently, each with a 70% chance of success (p = 0.7), and attempts 20 of them in a practice session (n = 20). The expected number of makes is:

```text
E[successes] = 20 × 0.7 = 14
```

Fourteen made free throws is the *average* outcome across many repetitions of this 20-shot session — not a guarantee for any single session. Some sessions will land on 12, others on 16, others (less often) on 9 or 18. The binomial distribution describes exactly how likely each possible count from 0 to 20 is, given those same n and p values — and the bulk of that probability clusters around 14, tapering off the further you get from it in either direction.

## From lumpy to bell-shaped as n grows

For small n, the binomial distribution can look quite lopsided, especially when p is far from 0.5. Flip a strongly biased coin (p = 0.9) only 3 times, and the distribution of "number of heads" is heavily skewed toward 2 and 3, with almost no weight near 0.

But as n grows large, something notable happens: the binomial distribution's shape increasingly resembles the normal distribution's bell curve, centered near n × p, even when p itself is far from 0.5. This isn't a coincidence — it's an early preview of the Central Limit Theorem you'll meet later in this tier, which explains *why* sums and averages of many independent trials tend toward a normal shape regardless of the shape of each individual trial. Twenty free throws is already large enough for the binomial distribution's shape to look noticeably bell-like rather than sharply lopsided, especially with p = 0.7 sitting reasonably close to the middle of its range.

Play with the explorer below to build the intuition before moving on.

## Common mistakes

- Treating correlated or streaky trials as if they were independent — the binomial formulas assume independence and silently give the wrong answer when it's violated.
- Confusing n (the number of trials) with the number of successes — n is fixed in advance; the number of successes is the random outcome you're studying.
- Assuming the expected value (n × p) is also the *most likely single outcome* in every case — it's usually close, but for small n and extreme p, the mode can land elsewhere.
- Forgetting that p must stay the same across every trial for the standard binomial formulas to apply.
