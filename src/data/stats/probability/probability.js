const learn = (id, title, blurb, check, widget) => ({ id, title, blurb, kind: 'learn', check, ...(widget ? { widget } : {}) })

export const probabilitySection = {
  id: 'probability',
  title: 'Probability & Distributions',
  intro: 'Why randomness has shape, and why the Central Limit Theorem runs the whole show.',
  lessons: [
    learn(
      'stats-what-is-probability',
      'What is probability?',
      'Sample spaces, events, and the one rule every probability question reduces to.',
      [
        {
          q: 'What is a "sample space" in probability?',
          options: [
            'The size of your dataset',
            'The set of every possible outcome of a random process',
            'A random sample drawn from a population',
            'The most likely outcome',
          ],
          answer: 1,
          why: 'For a coin flip, the sample space is {heads, tails}. For a die roll, it is {1,2,3,4,5,6}. Probability always starts by naming every possible outcome.',
        },
        {
          q: 'A fair six-sided die is rolled once. What is the probability of rolling a number greater than 4?',
          options: ['1/6', '2/6 (1/3)', '4/6 (2/3)', '1/2'],
          answer: 1,
          why: 'Two outcomes (5 and 6) out of six equally likely outcomes satisfy "greater than 4": 2/6, which simplifies to 1/3.',
        },
        {
          q: 'What must be true of the probabilities of every outcome in a sample space?',
          options: ['They must all be equal', 'They must each be between 0 and 1, and sum to exactly 1 across the whole sample space', 'They must sum to 100', 'There is no requirement'],
          answer: 1,
          why: 'Probability is a budget of 1 (or 100%) spread across every possible outcome — this is the one hard constraint everything else follows from.',
        },
        {
          q: 'What is an "event" in probability, as distinct from an "outcome"?',
          options: [
            'They mean exactly the same thing',
            'An outcome is one specific result; an event is any subset of outcomes you care about (e.g. "rolling an even number" covers three outcomes)',
            'An event always has probability 1',
            'An event is only used for categorical data',
          ],
          answer: 1,
          why: '"Rolling a 4" is one outcome. "Rolling an even number" is an event made of three outcomes {2, 4, 6}. Its probability is the sum of its outcomes\' probabilities.',
        },
        {
          q: 'Why does this path start with probability before diving into statistical inference later?',
          options: [
            'It does not matter where you start',
            'Inference is fundamentally about reasoning backward from data to what process plausibly produced it — and you cannot reason about that without first understanding how random processes behave',
            'Probability is a separate, unrelated subject',
            'To make the curriculum longer',
          ],
          answer: 1,
          why: "Confidence intervals and p-values (coming in the next tier) are really just probability statements about what sampling would produce under certain assumptions — that machinery needs this foundation first.",
        },
      ]
    ),
    learn(
      'stats-independent-dependent-events',
      'Independent vs. dependent events',
      'Does knowing the outcome of one event change the odds of the other?',
      [
        {
          q: 'Two events are "independent" when...',
          options: [
            'They always happen together',
            'Knowing the outcome of one event gives you no information about the probability of the other',
            'They can never both happen',
            'They have equal probability',
          ],
          answer: 1,
          why: 'Flipping two separate coins: knowing the first came up heads tells you nothing about the second — that is independence.',
        },
        {
          q: 'You draw a card from a deck, do NOT replace it, then draw again. Are the two draws independent?',
          options: ['Yes, draws are always independent', 'No — removing the first card changes the composition of the deck, which changes the odds for the second draw', 'Only if the first card was a face card', 'Independence does not apply to cards'],
          answer: 1,
          why: 'This is "sampling without replacement" — a classic dependent-events setup. If you drew an Ace first, there are now only 3 Aces left among 51 cards instead of 4 among 52.',
        },
        {
          q: 'For two INDEPENDENT events A and B, how do you find P(A and B)?',
          options: ['P(A) + P(B)', 'P(A) × P(B)', 'P(A) − P(B)', 'max(P(A), P(B))'],
          answer: 1,
          why: 'The multiplication rule for independent events: multiply their individual probabilities. Two fair coins both landing heads: 0.5 × 0.5 = 0.25.',
        },
        {
          q: 'Why would multiplying probabilities (the independence rule) give the WRONG answer for dependent events?',
          options: [
            'Multiplication is never valid in probability',
            'Because the second event\'s probability actually changes depending on the first event\'s outcome, so you need the correct conditional probability, not the original unconditional one',
            'It always gives the right answer regardless',
            'Dependent events cannot be combined at all',
          ],
          answer: 1,
          why: 'For dependent events you need P(A) × P(B given A) — using the plain, unconditional P(B) ignores exactly the information that made the events dependent in the first place.',
        },
        {
          q: 'A/B testing in product analytics usually assumes which property about how users are assigned to groups?',
          options: [
            'That assignment is dependent on the outcome being measured',
            'That assignment to test vs. control is independent of any other factor that could affect the outcome',
            'That every user must see both versions',
            'That the sample size does not matter',
          ],
          answer: 1,
          why: "If assignment to 'A' or 'B' were secretly correlated with something that affects the metric (say, more loyal users ending up in one group), the comparison would be contaminated — random, independent assignment is what makes the comparison fair.",
        },
      ]
    ),
    learn(
      'stats-normal-distribution',
      'The normal distribution & the empirical rule',
      'The single most important shape in statistics, and the 68-95-99.7 rule that comes with it.',
      [
        {
          q: 'What does the empirical rule (68-95-99.7 rule) state about a normal distribution?',
          options: [
            'Exactly 68% of values are below the mean',
            'About 68% of values fall within 1 standard deviation of the mean, 95% within 2, and 99.7% within 3',
            'It only applies to sample sizes over 1000',
            'It describes the shape of any distribution, not just normal ones',
          ],
          answer: 1,
          why: 'This rule is specific to the (approximately) normal, bell-shaped distribution, and it is one of the most quoted facts in all of statistics.',
        },
        {
          q: 'A normal distribution has mean 100 and standard deviation 15. Roughly what range covers 95% of values?',
          options: ['85 to 115', '70 to 130', '55 to 145', '100 to 115'],
          answer: 1,
          why: '95% falls within μ ± 2σ: 100 ± (2 × 15) = 70 to 130.',
        },
        {
          q: 'What are the two parameters that fully define a normal distribution\'s shape?',
          options: ['Minimum and maximum', 'Mean (μ) and standard deviation (σ)', 'Median and mode', 'Sample size and range'],
          answer: 1,
          why: 'μ sets where the bell is centered; σ sets how wide or narrow it is. Those two numbers are everything you need to draw the entire curve.',
        },
        {
          q: 'Why is the normal distribution so central to statistics, beyond just describing some datasets well?',
          options: [
            'It is the only distribution that ever occurs in nature',
            'Thanks to the Central Limit Theorem (coming up later in this tier), the distribution of sample means tends toward normal even when the underlying data is not normal at all',
            'It is simply the easiest to draw',
            'It has no special importance',
          ],
          answer: 1,
          why: "This is the real reason the normal curve shows up constantly in inferential statistics — not because every raw dataset is normal, but because averages of samples tend to be, almost regardless of the original shape.",
        },
        {
          q: 'If a value is 3 standard deviations above the mean of a normal distribution, is that common or rare?',
          options: ['Extremely common — happens about half the time', 'Quite rare — only about 0.15% of values fall above +3σ', 'Impossible', 'Depends entirely on the sample size'],
          answer: 1,
          why: 'Since 99.7% falls within ±3σ, only 0.3% falls outside that range total, split between both tails — so above +3σ alone is about 0.15%.',
        },
      ],
      'distribution-explorer:normal'
    ),
    {
      id: 'stats-z-scores-normal-curve',
      title: 'Z-scores revisited: using the normal curve',
      blurb: 'Convert any normal value to "how many standard deviations away", then read off a probability.',
      kind: 'code',
      practice: {
        prompt:
          'Write `prob_below(x, mu, sigma)`: using `scipy.stats.norm`, return the probability that a value drawn from a Normal(`mu`, `sigma`) distribution is less than `x`, as a plain float.',
        starter: 'from scipy import stats\n\ndef prob_below(x, mu, sigma):\n    ...\n',
        solution: 'from scipy import stats\n\ndef prob_below(x, mu, sigma):\n    return float(stats.norm.cdf(x, loc=mu, scale=sigma))',
        samples: ['prob_below(100, 100, 15)'],
        cases: [
          ['At the mean, should be 0.5', 'prob_below(100, 100, 15)'],
          ['One sigma below the mean', 'prob_below(85, 100, 15)'],
          ['Two sigma above the mean', 'prob_below(130, 100, 15)'],
          ['A different distribution entirely', 'prob_below(50, 40, 5)'],
        ],
        traps: [
          'from scipy import stats\n\ndef prob_below(x, mu, sigma):\n    return float(1 - stats.norm.cdf(x, loc=mu, scale=sigma))',
          'from scipy import stats\n\ndef prob_below(x, mu, sigma):\n    return float(stats.norm.pdf(x, loc=mu, scale=sigma))',
        ],
      },
    },
    learn(
      'stats-binomial-distribution',
      'The binomial distribution',
      'Counting successes across a fixed number of yes/no trials.',
      [
        {
          q: 'A binomial distribution models what kind of situation?',
          options: [
            'A continuous measurement like height',
            'The number of successes in a fixed number of independent yes/no trials, each with the same success probability',
            'The average of a sample',
            'A relationship between two numeric variables',
          ],
          answer: 1,
          why: 'Classic examples: number of heads in 10 coin flips, number of defective items in a batch of 50 — fixed trial count, two outcomes each, same probability each time.',
        },
        {
          q: 'What are the two parameters of a binomial distribution?',
          options: ['Mean and standard deviation', 'n (number of trials) and p (probability of success on each trial)', 'Minimum and maximum', 'Median and mode'],
          answer: 1,
          why: 'Everything about the shape — including its mean (n×p) — follows from just these two numbers.',
        },
        {
          q: 'What is the expected number of successes in 50 trials with a 20% success probability?',
          options: ['5', '10', '20', '25'],
          answer: 1,
          why: 'Expected successes = n × p = 50 × 0.20 = 10.',
        },
        {
          q: 'Why do the binomial trials need to be independent for the distribution to apply correctly?',
          options: [
            'They do not need to be independent',
            'If one trial\'s outcome changes the probability of the next (dependence), the simple n-choose-k formula no longer describes the real probabilities',
            'Independence only matters for continuous data',
            'Because otherwise n would be undefined',
          ],
          answer: 1,
          why: 'The binomial formula assumes every trial has the exact same success probability p, unaffected by previous trials — sampling without replacement from a small population would violate this.',
        },
        {
          q: 'As n gets large in a binomial distribution (with p not too close to 0 or 1), what shape does it start to resemble?',
          options: ['Uniform', 'A bell shape, approximately normal', 'A flat line', 'A single spike'],
          answer: 1,
          why: "This is a preview of the Central Limit Theorem later in this tier: sums (and the binomial count is really a sum of 0/1 outcomes) tend toward a normal shape as the number of trials grows.",
        },
      ],
      'distribution-explorer:binomial'
    ),
    learn(
      'stats-poisson-distribution',
      'The Poisson distribution',
      'Counting rare events over a fixed window of time or space.',
      [
        {
          q: 'What kind of situation does a Poisson distribution model?',
          options: [
            'A fixed number of yes/no trials',
            'The number of times a rare, independent event occurs in a fixed interval of time or space, given an average rate',
            'A continuous measurement',
            'The relationship between two variables',
          ],
          answer: 1,
          why: 'Classic examples: number of customer support tickets per hour, number of typos per page, number of earthquakes per year in a region.',
        },
        {
          q: 'What is the single parameter (λ, "lambda") of a Poisson distribution?',
          options: ['The number of trials', 'The average rate of occurrence over the interval', 'The standard deviation', 'The maximum possible count'],
          answer: 1,
          why: 'λ is both the mean AND the variance of a Poisson distribution — a distinctive feature that sets it apart from most other distributions.',
        },
        {
          q: 'A website gets an average of 4 signup errors per hour (λ = 4). Is observing exactly 10 errors in one particular hour impossible?',
          options: [
            'Yes, it would be impossible',
            'No — it is unlikely but not impossible; Poisson counts can exceed the average, just with shrinking probability the further they stray',
            'Only if λ were higher than 10',
            'Poisson distributions cannot have values above their mean',
          ],
          answer: 1,
          why: 'Poisson has no hard upper limit — higher counts just become increasingly improbable the further they are from λ.',
        },
        {
          q: 'How does a Poisson distribution with a small λ (like 1) typically look, compared to one with a large λ (like 30)?',
          options: [
            'Identical shape either way',
            'Small λ: noticeably right-skewed, piled up near zero. Large λ: increasingly symmetric and bell-shaped',
            'Small λ is always symmetric, large λ is always skewed',
            'λ has no effect on shape, only on the x-axis labels',
          ],
          answer: 1,
          why: 'Since counts cannot go below zero, a small λ bunches the distribution against that floor (skewed); a large λ has room to spread symmetrically on both sides.',
        },
        {
          q: 'What key assumption would break if you tried to model "number of customers at checkout right after a big storewide sale starts" with a plain Poisson?',
          options: [
            'Nothing would break',
            'The constant-average-rate assumption — the rate of customers almost certainly spikes right when the sale starts, so it is not one steady λ over the window',
            'Poisson only works for very large counts',
            'Poisson requires continuous data',
          ],
          answer: 1,
          why: 'Poisson assumes events occur at a roughly constant average rate throughout the interval. A rate that visibly changes partway through (a sale starting) violates that assumption.',
        },
      ],
      'distribution-explorer:poisson'
    ),
    learn(
      'stats-uniform-distribution',
      'The uniform distribution & why shape matters',
      'Every outcome equally likely — the simplest distribution, and a useful contrast to everything else.',
      [
        {
          q: 'In a uniform distribution over [0, 10], what is true about the probability density across that range?',
          options: ['It peaks in the middle', 'It is flat — every value in the range is equally likely', 'It decreases steadily', 'It is zero everywhere'],
          answer: 1,
          why: 'That flat, constant density is exactly what "uniform" means — no value in the range is favored over any other.',
        },
        {
          q: 'What is the mean of a uniform distribution over [a, b]?',
          options: ['a', 'b', '(a + b) / 2', 'a × b'],
          answer: 2,
          why: 'By symmetry, the midpoint of the range is the mean — there is no reason for the average to lean toward either end.',
        },
        {
          q: '`random.random()` style functions (producing a value between 0 and 1) are typically modeling what distribution?',
          options: ['Normal', 'Poisson', 'Binomial', 'Uniform'],
          answer: 3,
          why: 'A "uniform random number generator" is the textbook use case: every value in [0, 1) is meant to be equally likely.',
        },
        {
          q: 'Why does comparing the uniform distribution to the normal distribution help build intuition?',
          options: [
            'They are actually the same distribution',
            'Seeing a perfectly flat shape next to a peaked bell shape makes it concrete that "distribution shape" is a real, visualizable property, not just an abstract formula',
            'There is no pedagogical benefit',
            'Uniform distributions do not have a shape',
          ],
          answer: 1,
          why: 'Contrast is often the fastest way to build intuition — a flat rectangle next to a bell curve makes "shape" tangible in a way neither alone would.',
        },
        {
          q: 'If you wanted to simulate "a fair die roll" using a continuous uniform distribution, what would you need to do?',
          options: [
            'Nothing, they are identical',
            'Generate a continuous uniform value and then map/round it into one of 6 discrete buckets — a plain continuous uniform cannot itself produce only 6 exact outcomes',
            'Just use λ = 6',
            'It is impossible to simulate a die with a uniform distribution',
          ],
          answer: 1,
          why: "A continuous uniform distribution produces any value in a range (infinitely many); a fair die needs exactly 6 discrete, equally likely outcomes — a related but different (discrete uniform) idea.",
        },
      ],
      'distribution-explorer:uniform'
    ),
    {
      id: 'stats-law-of-large-numbers',
      title: 'Simulating randomness: the Law of Large Numbers',
      blurb: 'Why a fair coin flipped a million times lands close to 50/50, even though any 10 flips might not.',
      kind: 'code',
      practice: {
        prompt:
          'Write `coin_fraction(trials, seed)`: using **one call** `rng = np.random.default_rng(seed)` then **one call** `rng.integers(0, 2, size=trials)` (0=tails, 1=heads), return the fraction of heads as a plain float.',
        starter: 'import numpy as np\n\ndef coin_fraction(trials, seed):\n    ...\n',
        solution:
          'import numpy as np\n\ndef coin_fraction(trials, seed):\n    rng = np.random.default_rng(seed)\n    flips = rng.integers(0, 2, size=trials)\n    return float(flips.mean())',
        samples: ['coin_fraction(1000, 0)'],
        cases: [
          ['A moderate number of trials', 'coin_fraction(1000, 0)'],
          ['A different seed', 'coin_fraction(1000, 1)'],
          ['A much larger number of trials', 'coin_fraction(50000, 7)'],
        ],
        traps: [
          'import numpy as np\n\ndef coin_fraction(trials, seed):\n    rng = np.random.default_rng(seed)\n    flips = rng.integers(0, 2, size=trials)\n    return float((flips == 0).mean())',
        ],
      },
    },
    learn(
      'stats-central-limit-theorem',
      'The Central Limit Theorem',
      'No matter the shape of the original population, the distribution of sample means tends toward normal as the sample grows.',
      [
        {
          q: 'What does the Central Limit Theorem (CLT) say?',
          options: [
            'Every dataset is normally distributed',
            'As sample size increases, the distribution of the sample mean tends toward a normal distribution, regardless of the shape of the original population',
            'Larger samples always have smaller means',
            'It only applies to data that is already normal',
          ],
          answer: 1,
          why: "The CLT is specifically about the sampling distribution of the MEAN, not about the raw data itself — and the striking part is it barely cares what the original population looked like.",
        },
        {
          q: 'In the widget above, why did the sampling distribution of the mean look narrow and bell-shaped at n=50, even when the population was heavily skewed?',
          options: [
            'The simulation was broken',
            'That is the CLT in action: averaging more values per sample both symmetrizes the shape and shrinks its spread',
            'Skewed populations cannot produce sample means',
            'It only looked that way by coincidence',
          ],
          answer: 1,
          why: "This is the single most important experiment to internalize in this whole tier — larger n means the sample mean's own distribution gets both more normal-shaped and more tightly clustered.",
        },
        {
          q: 'According to the CLT, what happens to the spread of the sampling distribution of the mean as sample size n increases?',
          options: ['It increases', 'It stays exactly the same', 'It decreases, proportional to 1/√n', 'It becomes undefined'],
          answer: 2,
          why: 'The standard error of the mean is σ/√n — bigger samples produce means that cluster more tightly around the true population mean.',
        },
        {
          q: 'Roughly how large does a sample usually need to be for the CLT approximation to work reasonably well, as a common rule of thumb?',
          options: ['n = 2', 'n = 30 or more, for most reasonably-shaped populations', 'n = 1,000,000', 'The CLT does not depend on n at all'],
          answer: 1,
          why: "n ≥ 30 is a commonly cited (if rough) rule of thumb; more heavily skewed populations may need a larger n before the normal approximation looks good.",
        },
        {
          q: 'Why is the CLT often called the most important theorem in all of statistics?',
          options: [
            'It is not actually that important',
            'It is the reason confidence intervals and hypothesis tests (built on an assumption of normality) can be applied to sample means even when the underlying data is not normal at all',
            'It only matters for teaching purposes',
            'It guarantees every analysis will be correct',
          ],
          answer: 1,
          why: "Nearly every technique in the next tier — confidence intervals, t-tests, p-values — leans on the sample mean behaving approximately normally. The CLT is why that assumption is usually safe to make.",
        },
      ],
      'clt-simulator'
    ),
    learn(
      'stats-clt-why-it-matters',
      'Why the CLT is the most important idea in statistics',
      'Connecting the simulation you just ran to everything that is about to come next.',
      [
        {
          q: 'A single sample mean is itself a random variable. What does that mean in practice?',
          options: [
            'The sample mean is always wrong',
            'If you repeated the same sampling process again, you would very likely get a slightly different sample mean each time — it has its own distribution',
            'The sample mean is a fixed constant, identical to the population mean',
            'It means nothing in practice',
          ],
          answer: 1,
          why: "Every sample is just one draw from many possible samples you could have taken. The CLT describes the shape of ALL the sample means you could have gotten, not just the one you happened to compute.",
        },
        {
          q: 'What does the "standard error" (SE) actually measure?',
          options: [
            'The error in your calculation',
            'The standard deviation of the sampling distribution of the mean — i.e. how much sample means tend to vary from sample to sample',
            'The size of the population',
            'The difference between the mean and the median',
          ],
          answer: 1,
          why: 'Standard deviation describes spread in the raw data; standard error specifically describes spread in the sample MEAN across repeated sampling — a distinct, often much smaller, quantity.',
        },
        {
          q: 'Why does a political poll of 1,000 people give a more reliable estimate of national opinion than a poll of 20 people?',
          options: [
            'It does not — sample size does not matter',
            'By the CLT, a larger sample produces a sample mean (or proportion) with a smaller standard error — the estimate clusters more tightly around the true value',
            'Because 1,000 people always vote the same way',
            'Because larger samples eliminate all forms of bias',
          ],
          answer: 1,
          why: "More data per sample narrows the sampling distribution of the mean — it does NOT fix other issues like a biased sampling method, which is a separate concern from sample size.",
        },
        {
          q: 'Does the CLT mean a larger sample size fixes a biased sampling method (e.g. only surveying people on one website)?',
          options: [
            'Yes, any sample size issue is a bias issue',
            'No — bias is a systematic error in HOW you sampled; the CLT is about variability from sample to sample given an already-fair sampling method. A bigger biased sample is still biased.',
            'Yes, the CLT guarantees unbiased results',
            'The CLT and bias are unrelated concepts that never interact',
          ],
          answer: 1,
          why: "This is a common and costly confusion. More data narrows your confidence interval around whatever the data tends to show — but if the sampling method itself is skewed, you just get a more confident wrong answer.",
        },
        {
          q: 'How does the CLT set up the next tier of this path (Inferential Statistics)?',
          options: [
            'It does not connect to anything else',
            'Confidence intervals and hypothesis tests both rely on knowing the (approximate) shape of the sampling distribution of the mean — which is exactly what the CLT guarantees',
            'The next tier replaces the CLT with a different rule',
            'The CLT is only used for simulations, not real analysis',
          ],
          answer: 1,
          why: "Every formula you'll see for a confidence interval or a p-value in the next tier is quietly leaning on the CLT to justify treating the sample mean as approximately normal.",
        },
      ]
    ),
    learn(
      'stats-recognizing-distributions',
      'Recognizing distributions in real data',
      'A quick field guide: which shape should you reach for, given what you are counting or measuring?',
      [
        {
          q: 'You are counting "number of login failures in the next hour" for a service with a steady average rate. Which distribution fits best?',
          options: ['Normal', 'Binomial', 'Poisson', 'Uniform'],
          answer: 2,
          why: 'Counting rare, independent events over a fixed time window at a roughly constant average rate is the signature Poisson setup.',
        },
        {
          q: 'You run exactly 200 independent coin-flip-style A/B test exposures, each either "converted" or "not converted" with the same probability. Which distribution models the total conversion count?',
          options: ['Poisson', 'Binomial', 'Normal', 'Uniform'],
          answer: 1,
          why: "Fixed number of trials (200), two outcomes each, same probability each time — that's the textbook binomial setup.",
        },
        {
          q: 'A random number generator is supposed to return any integer from 1 to 100 with exactly equal chance. What distribution describes it?',
          options: ['Normal', 'Binomial', 'Poisson', 'Uniform (discrete)'],
          answer: 3,
          why: '"Equal chance for every value in a range" is the definition of uniform.',
        },
        {
          q: 'A dataset of adult heights in centimeters, from a large general population, is most likely to resemble which shape?',
          options: ['Poisson', 'Uniform', 'Approximately normal', 'Binomial'],
          answer: 2,
          why: 'Many naturally-occurring continuous measurements (height, measurement error, etc.) cluster symmetrically around a typical value — a classic approximately-normal pattern.',
        },
        {
          q: 'Why is "which distribution fits" a genuinely useful question to ask, rather than just academic trivia?',
          options: [
            'It is purely academic and has no practical use',
            'Picking the right distributional assumption affects which formulas, tests, and probability statements are valid for your data — a wrong assumption gives confidently wrong answers',
            'All distributions give the same answers anyway',
            'It only matters for exam questions',
          ],
          answer: 1,
          why: "Confidence intervals, hypothesis tests, and simulations all build on an assumed distribution. Picking the wrong one doesn't just lose precision — it can make your conclusions outright wrong.",
        },
      ]
    ),
    {
      id: 'stats-workshop-simulate-distributions',
      title: 'Tier workshop: simulate and compare distributions',
      blurb: 'Generate samples from two different distributions and compare their behavior directly.',
      kind: 'code',
      practice: {
        prompt:
          'Write `compare_means(n, seed)`: using **one call** `rng = np.random.default_rng(seed)`, draw `n` samples from a Normal(50, 10) via `rng.normal(50, 10, size=n)`, then `n` samples from a Uniform(0, 100) via `rng.uniform(0, 100, size=n)` (in that order, two separate calls). Return `(normal_mean, uniform_mean)` as a tuple of floats, each rounded to 2 decimals.',
        starter: 'import numpy as np\n\ndef compare_means(n, seed):\n    ...\n',
        solution:
          'import numpy as np\n\ndef compare_means(n, seed):\n    rng = np.random.default_rng(seed)\n    normal_sample = rng.normal(50, 10, size=n)\n    uniform_sample = rng.uniform(0, 100, size=n)\n    return (round(float(normal_sample.mean()), 2), round(float(uniform_sample.mean()), 2))',
        samples: ['compare_means(500, 0)'],
        cases: [
          ['A moderate sample size', 'compare_means(500, 0)'],
          ['A different seed', 'compare_means(500, 3)'],
          ['A larger sample size', 'compare_means(5000, 1)'],
        ],
        traps: [
          'import numpy as np\n\ndef compare_means(n, seed):\n    rng = np.random.default_rng(seed)\n    uniform_sample = rng.uniform(0, 100, size=n)\n    normal_sample = rng.normal(50, 10, size=n)\n    return (round(float(normal_sample.mean()), 2), round(float(uniform_sample.mean()), 2))',
        ],
      },
    },
  ],
}
