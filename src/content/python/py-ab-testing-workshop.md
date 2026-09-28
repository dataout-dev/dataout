A/B testing puts hypothesis testing to work on a specific, common shape of question: does version B convert better than version A? This workshop builds the whole flow, including the ways it commonly goes wrong.

You will learn:

- designing a test before running it
- sample size and power, briefly
- the two-proportion z-test
- the peeking problem, and why it inflates false positives
- writing a decision memo

## Designing the test

Before collecting any data: what is the **one** metric that decides success (conversion rate, not five different metrics tried afterward)? What is the **minimum difference** worth caring about (a 0.1% lift might be real but not worth acting on)? How long will the test run, and what sample size is needed to detect that minimum difference reliably? Deciding all of this up front is what makes the later analysis trustworthy.

## Sample size and power

**Power** is the probability of detecting a real effect of a given size, if one truly exists. A test with too few samples has low power — it might easily miss a real, meaningful difference just from noise. Sample size calculators (or a simulation, drawing many synthetic A/B datasets with a known true effect and checking how often the test detects it) are the standard way to decide how much data a test actually needs before running it.

## The two-proportion z-test

```python
import numpy as np
from scipy import stats

a_conv, a_n = 50, 1000
b_conv, b_n = 65, 1000

p1, p2 = a_conv / a_n, b_conv / b_n
p_pool = (a_conv + b_conv) / (a_n + b_n)
se = np.sqrt(p_pool * (1 - p_pool) * (1 / a_n + 1 / b_n))
z = (p1 - p2) / se
p_value = 2 * (1 - stats.norm.cdf(abs(z)))
print(round(z, 3), round(p_value, 4))
```

The **pooled** standard error (using the combined conversion rate `p_pool`, not each group's own rate separately) is the standard choice under the null hypothesis that both groups truly share one conversion rate — exactly what the test is asking whether the data is consistent with.

## Interpreting the result

A small p-value here means the observed difference between A and B would be unlikely if they truly converted at the same rate — evidence B is genuinely different, in the direction observed. It is still worth checking the **size** of the difference (an effect size, or simply the raw percentage-point lift) alongside the p-value, exactly as with any hypothesis test.

## The peeking problem

```python
import numpy as np
from scipy import stats

rng = np.random.default_rng(0)
false_positives = 0
checks_per_run = 10
for _ in range(500):
    a = rng.binomial(1, 0.1, size=1000)
    b = rng.binomial(1, 0.1, size=1000)
    for checkpoint in range(50, 1001, 1000 // checks_per_run):
        _, p = stats.ttest_ind(a[:checkpoint], b[:checkpoint])
        if p < 0.05:
            false_positives += 1
            break
print(false_positives / 500)
```

Both groups here are simulated with the **same** true conversion rate — any "significant" result is a false positive by construction. Checking the test's p-value repeatedly as data trickles in, and stopping the moment it first crosses the significance threshold ("peeking"), inflates the true false-positive rate well past the nominal 5%, since each additional look is another chance for the p-value to dip below the threshold by pure noise. The standard fixes: decide the sample size in advance and check only once at the end, or use a testing method specifically designed to allow legitimate repeated looks (a "sequential" test).

## Writing the decision memo

A short, useful memo states: what was tested, the sample sizes and duration, the observed conversion rates and lift, the p-value **and** a plain-language effect size, and a clear recommendation — ship, don't ship, or run longer for more data. A reader should not need to re-run the analysis themselves to understand what happened and why the recommendation follows from it.

## Common mistakes

- Choosing the metric or the analysis method *after* seeing the data, rather than before running the test.
- Checking the test repeatedly and stopping as soon as it looks significant.
- Reporting a p-value with no mention of the actual size of the lift.
- Running a test with too few samples to reliably detect the minimum difference that was supposed to matter.

## Recap

- Decide the metric, minimum meaningful effect, and sample size *before* running an A/B test.
- The pooled two-proportion z-test is the standard tool for comparing two conversion rates.
- Peeking at a test repeatedly and stopping early inflates the real false-positive rate well beyond the nominal threshold.
- A decision memo needs the p-value, the effect size, and a clear recommendation — not just a number.

## Your turn

In the **Practice** tab you write `ab_test(a_conv, a_n, b_conv, b_n)`. Then three challenges use real data.
