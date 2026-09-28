Some probability questions are genuinely awkward to solve with a formula, but trivial to answer by simulating the situation thousands of times and counting. This lesson builds that habit on the classic birthday problem.

You will learn:

- events, probability and independence
- conditional probability
- the law of large numbers
- Monte Carlo estimation, and why the exact random-call pattern matters for reproducibility

## Events and independence

Two events are **independent** if knowing one happened tells you nothing about whether the other did — two different people's birthdays, assuming no special coincidence like twins, are independent of each other. Independence is what lets you multiply probabilities together (`P(A and B) = P(A) * P(B)`), which is not valid when events are related.

## Conditional probability

`P(A | B)` reads "the probability of A, **given that** B happened" — a different, usually different-valued, quantity from the plain `P(A)`. A classic mistake is silently swapping `P(A|B)` for `P(B|A)`, which are not generally equal (the probability a patient has a disease given a positive test is not the same as the probability of a positive test given they have the disease).

## The law of large numbers

```python
import numpy as np

rng = np.random.default_rng(0)
for n in [10, 1000, 100000]:
    flips = rng.integers(0, 2, size=n)
    print(n, flips.mean())
```

As the number of trials grows, the observed proportion (here, of "heads") converges toward the true underlying probability (`0.5`) — the theoretical justification for estimating a probability by simulating many trials and counting.

## The birthday problem, simulated

With `n` people in a room (birthdays independent, 365 equally likely days, ignoring leap years), what is the probability at least two share a birthday? The exact formula exists, but simulating it is more direct:

```python
import numpy as np

rng = np.random.default_rng(0)
n, trials = 23, 5000
days = rng.integers(0, 365, size=(trials, n))
has_match = [len(set(row)) < n for row in days]
print(np.mean(has_match))
```

Drawing every trial's `n` birthdays in **one call** (`size=(trials, n)`) rather than looping trial-by-trial is both faster and, for this playground's grading, exactly reproducible for a given seed.

## Watch out: the gambler's fallacy

After a fair coin lands heads five times in a row, the next flip is still exactly 50/50 — the coin has no memory. The mistaken belief that a "streak" makes the opposite outcome more likely (the gambler's fallacy) is a genuinely common intuition, and simulation is a good way to check it directly:

```python
import numpy as np

rng = np.random.default_rng(0)
flips = rng.integers(0, 2, size=100000)
after_five_heads = []
for i in range(5, len(flips)):
    if all(flips[i - 5:i] == 1):
        after_five_heads.append(flips[i])
print(np.mean(after_five_heads) if after_five_heads else "no streaks found")
```

The proportion of heads immediately after a streak of five heads should still be close to `0.5`, confirming independence held throughout.

## Why the exact call pattern matters here

Because a `Generator`'s draws are deterministic given a seed, but depend on the **exact sequence and shape** of calls made to it, two equally correct simulations (one drawing all `n * trials` numbers in a single call, another drawing them one person or one trial at a time) will generally **not** produce identical numbers for the same seed, even though both are statistically valid. Any exercise that grades against a specific seeded result needs to say precisely which call shape to use — exactly what this tier's practice prompts do whenever a seed is involved.

## Common mistakes

- Looping trial-by-trial when a single, shaped call would draw the same total randomness faster and more reproducibly.
- Confusing `P(A|B)` with `P(B|A)`.
- Believing a streak changes the odds of the next independent trial.
- Trusting a simulation's result from too few trials, where the "law of large numbers" has not yet had a chance to kick in.

## Recap

- Independent events multiply; conditional probability `P(A|B)` is not generally the same as `P(B|A)`.
- More trials converge toward the true probability; too few trials can mislead.
- A single, shaped random-draw call (rather than a loop) is both faster and reproducible for a given seed.
- A "streak" never changes the odds of a genuinely independent next trial.

## Your turn

In the **Practice** tab you write `birthday(n, trials=10000, seed=0)`. Then three challenges use real data.
