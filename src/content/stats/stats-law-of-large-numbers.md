Flip a fair coin 10 times and landing on 7 heads, 3 tails wouldn't surprise anyone. Flip it a million times and landing on 700,000 heads would be front-page news — something would clearly be wrong with the coin. Same coin, same 50/50 odds each flip, wildly different expectations about how close to 50/50 the result should land. That gap is the Law of Large Numbers.

You will learn:

- the intuition behind the Law of Large Numbers
- why 10 flips can easily look lopsided but a million flips won't
- the difference between short-run noise and long-run convergence
- how simulating randomness with a seeded random number generator makes results reproducible
- how this lesson's practice exercise will let you see the law in action

## Short-run noise, long-run convergence

The Law of Large Numbers says that as you repeat a random process more and more times, the average of your results gets closer and closer to the true underlying probability. It does *not* say that small samples should already look like the true probability — in fact it specifically explains why they often don't.

With just 10 coin flips, a result like 7 heads and 3 tails (a 70/30 split) is well within normal variation for a fair coin — flip 10 fair coins many times and a 70/30-or-more-extreme split happens quite often. The "noise" from a small number of trials can easily push the observed fraction noticeably away from 0.5 in either direction, purely by chance, with nothing wrong with the coin at all.

Scale up to a million flips, and that same kind of noise gets drowned out. It's not that each individual flip becomes less random — it's that the accumulated *effect* of random fluctuations, relative to the total number of flips, shrinks. A million flips landing at 70% heads would require an almost impossibly long streak of bad luck for a genuinely fair coin; it's far more likely something about the coin or the flipping process is actually biased.

## Why this happens, intuitively

Every individual flip contributes one data point to a running average. Early on, a single unlucky or lucky streak can swing that running average substantially, because there's so little else to balance it against. As more flips accumulate, any one flip (or even a moderate streak of them) becomes a proportionally tinier contribution to the overall average — the earlier swings don't disappear, but they get diluted by everything that comes after.

This is why casinos and insurance companies can run on razor-thin per-event edges and still expect highly predictable profits in aggregate: across enough repetitions, the noise of any individual outcome washes out, and the long-run average converges toward the true expected value.

## Simulating randomness, reproducibly

You can't always flip a physical coin a million times to see this play out, but you can simulate it. A computer's random number generator can stand in for the coin, producing a long sequence of simulated flips far faster than any person could flip a real one.

There's a subtlety worth knowing before you simulate anything: by default, "random" code produces a different sequence every time you run it, which makes results hard to check or reproduce. The fix is a **seed** — a starting value you feed to the random number generator that makes its entire sequence of "random" outputs fully deterministic and repeatable. Run the same simulation twice with the same seed, and you get back the exact same sequence of simulated flips both times, even though the sequence itself looks random. This is invaluable for debugging, for checking your own work, and for letting someone else reproduce your exact results — a graded exercise can check your output precisely because the seed pins down what "correct" looks like.

## What you'll build

In the practice exercise for this lesson, you'll write a small simulation that flips a large number of (virtual) coins using a seeded random number generator and reports back what fraction came up heads. Watching that fraction for a small number of trials versus a much larger number is the most direct way to feel the Law of Large Numbers at work, rather than just reading about it: with few trials, expect to see the fraction wander noticeably away from 0.5; with many trials, expect it to settle in close.

## Common mistakes

- Expecting a small sample to already closely match the true probability — that expectation is exactly what the Law of Large Numbers warns against.
- Concluding a coin (or process) is biased from a small number of trials showing a lopsided result, when that result is still well within normal random variation.
- Forgetting to set a seed, then being unable to reproduce or debug a simulation's exact results.
- Confusing the Law of Large Numbers with "the universe evens things out" superstition (like believing a coin is "due" for tails after a heads streak) — the law is about averages over many trials, not about any mechanism correcting future individual outcomes.
