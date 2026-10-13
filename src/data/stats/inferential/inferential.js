const learn = (id, title, blurb, check, widget) => ({ id, title, blurb, kind: 'learn', check, ...(widget ? { widget } : {}) })

export const inferentialSection = {
  id: 'inferential',
  title: 'Inferential Statistics',
  intro: 'Confidence intervals, p-values, and hypothesis tests — and what they actually mean.',
  lessons: [
    learn(
      'stats-sample-vs-population-inference',
      'From sample to population: why inference exists',
      'You never get to measure everyone. Inference is the discipline of saying something trustworthy anyway.',
      [
        {
          q: 'What is "statistical inference", in one sentence?',
          options: [
            'Describing a dataset you already fully have',
            'Using a sample to draw a conclusion about the larger population it came from, while being honest about the uncertainty involved',
            'Guessing without any data',
            'Sorting data from largest to smallest',
          ],
          answer: 1,
          why: 'Everything in the previous two tiers described data you already had in hand. Inference is the leap from "here\'s my sample" to "here\'s what I believe about everyone".',
        },
        {
          q: 'Why can\'t you just report your sample mean as "the truth" about the population?',
          options: [
            'You can, it is always exactly correct',
            'A different random sample from the same population would almost certainly give a slightly different mean — your one sample is just one draw among many possible ones',
            'Sample means are always biased',
            'Population means do not exist',
          ],
          answer: 1,
          why: 'This is exactly the sampling-variability idea from the Central Limit Theorem tier — your sample mean is one point from a whole distribution of possible sample means.',
        },
        {
          q: 'Which of these is a goal of inferential statistics, as opposed to descriptive statistics?',
          options: [
            'Computing the mean of a dataset you already have',
            'Estimating a range of plausible values for a population parameter, based on a sample',
            'Drawing a histogram',
            'Sorting values from largest to smallest',
          ],
          answer: 1,
          why: 'Descriptive statistics summarizes what you have. Inferential statistics uses what you have to make a justified statement about what you do not have.',
        },
        {
          q: 'What tool from the Probability tier does nearly every technique in this tier depend on?',
          options: ['The five-number summary', 'The Central Limit Theorem', 'Bar charts', 'The mode'],
          answer: 1,
          why: "Confidence intervals and p-values both lean on knowing the (approximate) shape of the sampling distribution of the mean — which the CLT guarantees even when the raw data is not normal.",
        },
        {
          q: 'Is it possible for a perfectly correct inferential method to still give a wrong-feeling answer sometimes?',
          options: [
            'No, correct methods are never wrong',
            'Yes — by design, a 95% confidence interval will fail to capture the true value about 5% of the time, even when every step was done correctly',
            'Only if the sample size is 1',
            'Only for categorical data',
          ],
          answer: 1,
          why: "Inference deals in probabilities, not certainties. 'Correctly applied' and 'happened to be right this time' are different claims — this tier is about being honest about that gap.",
        },
      ]
    ),
    {
      id: 'stats-sampling-error-standard-error',
      title: 'Sampling error & the standard error',
      blurb: 'Quantifying exactly how much a sample mean tends to wobble from sample to sample.',
      kind: 'code',
      practice: {
        prompt: 'Write `standard_error(a)`: return the standard error of the mean of array `a` — the **sample** standard deviation (`ddof=1`) divided by the square root of `n` — as a plain float.',
        starter: 'import numpy as np\n\ndef standard_error(a):\n    ...\n',
        solution: 'import numpy as np\n\ndef standard_error(a):\n    a = np.asarray(a, dtype=float)\n    return float(a.std(ddof=1) / np.sqrt(len(a)))',
        samples: ['standard_error([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])'],
        cases: [
          ['A textbook example', 'standard_error([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])'],
          ['A larger sample, tighter spread', 'standard_error([10.0, 10.5, 9.5, 10.2, 9.8, 10.1, 9.9, 10.3, 9.7, 10.0])'],
          ['A small sample', 'standard_error([1.0, 5.0, 3.0])'],
        ],
        traps: [
          'import numpy as np\n\ndef standard_error(a):\n    a = np.asarray(a, dtype=float)\n    return float(a.std(ddof=0) / np.sqrt(len(a)))',
          'import numpy as np\n\ndef standard_error(a):\n    a = np.asarray(a, dtype=float)\n    return float(a.std(ddof=1) / len(a))',
        ],
      },
    },
    learn(
      'stats-confidence-intervals',
      'Confidence intervals: what "95% confident" really means',
      'Not "there is a 95% chance the true mean is in this range" — something subtly, importantly different.',
      [
        {
          q: 'What does "95% confidence interval" actually mean, in the frequentist sense this path uses?',
          options: [
            'There is a 95% chance the true population mean falls inside this specific interval',
            'If you repeated this same sampling-and-interval process many times, about 95% of the resulting intervals would contain the true population mean',
            'You are 95% certain your sample mean is correct',
            '95% of the data falls inside the interval',
          ],
          answer: 1,
          why: 'The 95% describes the long-run reliability of the METHOD across repeated sampling, not your certainty about this one specific interval — which either does or does not contain the true value, with no probability left once it is computed.',
        },
        {
          q: 'In the widget above, roughly how many of the 50 simulated 95% confidence intervals typically missed the true mean?',
          options: ['About 0', 'About 2-3 (roughly 5%)', 'About 25 (50%)', 'All of them'],
          answer: 1,
          why: "That's exactly what '95% confidence' promises over repeated sampling: a small, predictable fraction of intervals — around 5% — will simply miss, through no error in the method at all.",
        },
        {
          q: 'A 95% CI for average delivery time is [28 minutes, 34 minutes]. What is the most defensible interpretation?',
          options: [
            'Every delivery takes between 28 and 34 minutes',
            'The method used to construct this interval would capture the true average delivery time in about 95% of repeated samples — 28 to 34 minutes is the plausible range it gave this time',
            'There is a 95% chance any single delivery takes this long',
            '95% of deliveries fall in this range',
          ],
          answer: 1,
          why: 'A confidence interval is about the plausible range for the population AVERAGE, not a prediction about individual observations — that distinction trips people up constantly.',
        },
        {
          q: 'What two ingredients go into constructing a confidence interval for a mean?',
          options: [
            'The minimum and maximum of the data',
            'A point estimate (like the sample mean) and a margin of error built from the standard error',
            'The mode and the median',
            'Only the sample size',
          ],
          answer: 1,
          why: 'CI = estimate ± margin of error, where the margin of error is built from the standard error (spread of the sampling distribution) and a multiplier tied to your confidence level.',
        },
        {
          q: 'Why would a 99% confidence interval be wider than a 95% confidence interval, for the same data?',
          options: [
            'It would not be wider — confidence level does not affect width',
            'Demanding a higher hit rate across repeated sampling (99% vs 95%) requires casting a wider net to be right that often',
            'Because 99% intervals use a smaller sample',
            'Because 99% is always wrong',
          ],
          answer: 1,
          why: "There's a real trade-off here: a narrower interval is more useful but less likely to capture the truth; demanding more reliability (99%) costs you precision (width).",
        },
      ],
      'confidence-interval-simulator'
    ),
    learn(
      'stats-margin-of-error-sample-size',
      'Margin of error & sample size',
      'Why cutting your margin of error in half costs four times the data, not two.',
      [
        {
          q: 'The margin of error for a mean is built from standard error × a multiplier (like 1.96 for 95%). What shrinks the margin of error, all else equal?',
          options: ['A smaller sample size', 'A larger sample size', 'A higher confidence level', 'Nothing can change it'],
          answer: 1,
          why: 'Standard error = σ/√n, so bigger n directly shrinks the margin of error — more data means a more precise estimate.',
        },
        {
          q: 'To cut the margin of error in HALF, roughly how much bigger does your sample need to be?',
          options: ['2× bigger', '4× bigger', 'Half as big', 'No change needed'],
          answer: 1,
          why: 'Because standard error scales with 1/√n, halving it requires quadrupling n — the square-root relationship is the key, often surprising, fact here.',
        },
        {
          q: 'A poll with n=100 has a wide margin of error. A poll with n=10,000 on the same population has a much narrower one. Why?',
          options: [
            'The second poll asked better questions',
            'The 100x larger sample shrinks the standard error by a factor of √100 = 10, directly tightening the margin of error',
            'Sample size does not affect margin of error',
            'The second poll must be biased',
          ],
          answer: 1,
          why: '√10,000 / √100 = 100/10 = 10× — so the standard error (and with it, the margin of error) shrinks roughly tenfold.',
        },
        {
          q: 'If you need a very precise estimate (a tiny margin of error) for a highly variable (high σ) population, what should you expect?',
          options: [
            'It will be cheap and easy regardless',
            'You will likely need a large sample size, since both high variability and high precision demands push n upward',
            'Sample size will not need to change',
            'σ has no effect on required sample size',
          ],
          answer: 1,
          why: 'Required n scales with σ² for a fixed target margin of error — a noisier population needs proportionally more data to pin down just as precisely.',
        },
        {
          q: 'Is there a point where collecting more data stops being worth the shrinking margin of error?',
          options: [
            'No, more data is always worth any cost',
            'Often yes — the 1/√n relationship means early data reduces error fast, but later data buys diminishing returns for the same added cost',
            'More data always increases the margin of error',
            'This is not a real consideration in practice',
          ],
          answer: 1,
          why: 'Going from n=10 to n=40 cuts the margin of error in half; going from n=10,000 to n=40,000 also cuts it in half — but that second jump is a much bigger, often not-worth-it, cost for the same proportional gain.',
        },
      ],
      'confidence-interval-simulator:sample-size'
    ),
    learn(
      'stats-null-alternative-hypotheses',
      'Null and alternative hypotheses',
      'Before you can test anything, you need two competing, precisely-stated claims.',
      [
        {
          q: 'What does the null hypothesis (H0) typically represent?',
          options: [
            'The claim you are hoping to prove',
            'A default, "nothing interesting is happening" position — e.g. no difference, no effect — that you test the data against',
            'Whatever the sample mean happens to be',
            'The alternative hypothesis restated',
          ],
          answer: 1,
          why: "H0 is the skeptical baseline: 'no real effect, the observed difference is just random noise.' You only reject it if the data makes that position hard to believe.",
        },
        {
          q: 'A company tests whether a new checkout design increases conversion rate. What would be a reasonable null hypothesis?',
          options: [
            'The new design increases conversion',
            'The new design has no effect on conversion rate (conversion rate is the same as before)',
            'The new design definitely decreases conversion',
            'There is no null hypothesis needed',
          ],
          answer: 1,
          why: 'H0 is the "nothing changed" claim. The alternative hypothesis (H1) would be the claim that conversion actually did change.',
        },
        {
          q: 'Does a hypothesis test ever "prove" the null hypothesis is true?',
          options: [
            'Yes, failing to reject H0 proves it is true',
            'No — failing to reject H0 just means the data did not provide strong enough evidence against it, not positive proof that it is true',
            'Yes, but only with large samples',
            'Hypothesis tests never involve a null hypothesis',
          ],
          answer: 1,
          why: '"Fail to reject" is a weaker, more honest claim than "accept as true" — the data was simply not surprising enough, under H0, to abandon it.',
        },
        {
          q: 'Why must H0 and the alternative hypothesis (H1) be mutually exclusive?',
          options: [
            'They do not need to be',
            'Because the test is designed to weigh evidence for exactly one of two competing explanations — if they overlapped, "rejecting H0" would not clearly support H1',
            'Mutual exclusivity only matters for two-sample tests',
            'Because otherwise the sample size would be wrong',
          ],
          answer: 1,
          why: "The whole logic of hypothesis testing is 'if this result would be very unlikely under H0, that's evidence for H1 instead' — which only makes sense if H0 and H1 cannot both be true at once.",
        },
        {
          q: 'A one-tailed alternative hypothesis ("the new drug REDUCES recovery time") differs from a two-tailed one ("the new drug CHANGES recovery time") in what way?',
          options: [
            'They are identical in every respect',
            'A one-tailed test only looks for evidence of change in one specified direction; a two-tailed test looks for evidence of change in either direction',
            'One-tailed tests never use p-values',
            'Two-tailed tests cannot use real data',
          ],
          answer: 1,
          why: 'The direction specified in H1 determines which "tail" (or both tails) of the sampling distribution counts as evidence against H0 — this choice has to be made before looking at the data, not after.',
        },
      ]
    ),
    learn(
      'stats-p-values',
      'p-values: the most misunderstood number in statistics',
      'What a p-value is actually asking — and the two things it is NOT telling you.',
      [
        {
          q: 'What does a p-value actually represent?',
          options: [
            'The probability that the null hypothesis is true',
            'The probability of observing data at least as extreme as what you got, ASSUMING the null hypothesis is true',
            'The probability that your result is important',
            'The chance that you made an error',
          ],
          answer: 1,
          why: "This is the single most important sentence in this lesson: a p-value is a statement about how surprising your data would be IF H0 were true — nothing more.",
        },
        {
          q: 'A p-value of 0.03 is often misread as "there is a 97% chance the alternative hypothesis is true." Why is that wrong?',
          options: [
            'It is actually correct',
            'The p-value conditions on H0 being true and asks about the data; it says nothing about the probability that H0 or H1 is true given the data you observed',
            'p-values can never be 0.03',
            'Because 97% is too high a number',
          ],
          answer: 1,
          why: "This is a textbook and extremely common misinterpretation. The p-value never tells you P(hypothesis is true) — that would require a different (Bayesian) framework entirely.",
        },
        {
          q: 'In the widget above, as you slide the observed z-statistic further from 0, what happens to the p-value?',
          options: ['It increases', 'It decreases — more extreme results are less consistent with the null being true', 'It stays constant', 'It becomes negative'],
          answer: 1,
          why: "A larger (in magnitude) test statistic means the observed data would be rarer under H0 — and 'how rare' is literally what the p-value measures.",
        },
        {
          q: 'A common significance threshold is α = 0.05. If your p-value is 0.04, what is the conventional conclusion?',
          options: [
            'Fail to reject H0 (not significant)',
            'Reject H0 — the result is considered statistically significant at this threshold',
            'The test is invalid',
            'You need a bigger sample before concluding anything',
          ],
          answer: 1,
          why: 'By the usual convention, p < α means the result crosses the pre-agreed threshold for "surprising enough under H0 to reject it" — though the threshold of 0.05 itself is a convention, not a law of nature.',
        },
        {
          q: 'Does a very small p-value (like 0.0001) automatically mean the effect is large or practically important?',
          options: [
            'Yes, always',
            'No — with a large enough sample, even a tiny, practically meaningless effect can produce a very small p-value. Statistical significance and practical importance are different questions.',
            'No, small p-values are always meaningless',
            'p-values cannot be that small',
          ],
          answer: 1,
          why: "A later lesson on p-hacking and effect size digs into this further, but it's worth flagging now: 'statistically significant' answers 'is this probably not just noise', not 'does this matter.'",
        },
      ],
      'hypothesis-test-visualizer'
    ),
    {
      id: 'stats-t-tests',
      title: 'One-sample and two-sample t-tests',
      blurb: "When you don't know the population standard deviation (almost always), the t-test is the workhorse.",
      kind: 'code',
      practice: {
        prompt: "Write `welch_pvalue(a, b)`: using `scipy.stats.ttest_ind` with `equal_var=False` (Welch's t-test, which does not assume equal variances), return the two-sided p-value comparing samples `a` and `b`, as a plain float.",
        starter: 'from scipy import stats\n\ndef welch_pvalue(a, b):\n    ...\n',
        solution: 'from scipy import stats\n\ndef welch_pvalue(a, b):\n    result = stats.ttest_ind(a, b, equal_var=False)\n    return float(result.pvalue)',
        samples: ['welch_pvalue([23, 25, 21, 24, 22], [30, 45, 28, 50, 33])'],
        cases: [
          ['Two groups with clearly different spread', 'welch_pvalue([23, 25, 21, 24, 22], [30, 45, 28, 50, 33])'],
          ['Two very similar samples', 'welch_pvalue([10, 11, 9, 10, 10], [10, 10, 11, 9, 11])'],
          ['Two samples with a large, clear difference', 'welch_pvalue([1, 2, 1, 2, 1], [20, 22, 19, 21, 20])'],
        ],
        traps: ['from scipy import stats\n\ndef welch_pvalue(a, b):\n    result = stats.ttest_ind(a, b, equal_var=True)\n    return float(result.pvalue)'],
      },
    },
    learn(
      'stats-type-1-type-2-errors',
      'Type I and Type II errors',
      'Every hypothesis test risks two different, opposite kinds of mistake.',
      [
        {
          q: 'What is a Type I error?',
          options: [
            'Failing to reject a false null hypothesis',
            'Rejecting a null hypothesis that was actually true (a "false positive")',
            'Using the wrong sample size',
            'Computing the mean incorrectly',
          ],
          answer: 1,
          why: 'Type I error: you concluded there was an effect when there really was not one — a false alarm.',
        },
        {
          q: 'What is a Type II error?',
          options: [
            'Rejecting a true null hypothesis',
            'Failing to reject a null hypothesis that was actually false (a "missed detection")',
            'Choosing the wrong test',
            'A calculation mistake',
          ],
          answer: 1,
          why: 'Type II error: there really was an effect, but your test did not have enough evidence to detect it — a miss.',
        },
        {
          q: 'What does the significance level α directly control?',
          options: ['The Type II error rate', 'The Type I error rate — the probability of a false positive, if H0 is actually true', 'The sample size', 'The effect size'],
          answer: 1,
          why: 'Setting α = 0.05 means you have deliberately accepted a 5% long-run false-positive rate, in exchange for a workable decision rule.',
        },
        {
          q: 'In the widget above, what happened to β (the Type II error rate) as you increased the true effect size?',
          options: ['β increased', 'β decreased — a bigger, more obvious real effect is harder to miss', 'β stayed exactly the same', 'β became negative'],
          answer: 1,
          why: 'Bigger effects separate the null and alternative distributions more clearly, shrinking the overlap region that produces Type II errors.',
        },
        {
          q: 'Why can you not simultaneously drive both α and β to zero for a fixed sample size?',
          options: [
            'You actually can, with the right test',
            'Making the test stricter (lower α) to avoid false positives widens the region where real effects get missed (raises β), for a fixed amount of data — the two trade off against each other',
            'α and β are unrelated to each other',
            'Only α matters in practice',
          ],
          answer: 1,
          why: "This tension is fundamental: tightening your false-positive guard (lower α) without adding more data makes it easier for real effects to slip past undetected (higher β). More data is usually the only way to improve both at once.",
        },
      ],
      'hypothesis-test-visualizer:error-regions'
    ),
    learn(
      'stats-statistical-power',
      'Statistical power: why sample size matters',
      'Power is your test\'s ability to actually detect a real effect when one exists.',
      [
        {
          q: 'What is "statistical power" (formally)?',
          options: ['P(Type I error)', '1 − β: the probability of correctly rejecting a false null hypothesis (detecting a real effect)', 'The significance level α', 'The sample mean'],
          answer: 1,
          why: 'Power is the flip side of the Type II error rate — a high-power test is good at catching real effects when they exist.',
        },
        {
          q: 'Which of these generally INCREASES statistical power, holding everything else constant?',
          options: ['A smaller sample size', 'A larger sample size', 'A smaller true effect size', 'A stricter (smaller) α, with nothing else changed'],
          answer: 1,
          why: 'More data narrows the sampling distributions involved, making a real effect easier to distinguish from pure noise — directly boosting power.',
        },
        {
          q: 'An underpowered study (e.g. too small a sample) fails to find a statistically significant effect. What is the most responsible conclusion?',
          options: [
            'The effect definitely does not exist',
            'The study may simply not have had enough power to detect the effect even if it is real — absence of significance is not proof of absence of an effect',
            'The study proves the null hypothesis',
            'The result should be reported as a strong negative finding',
          ],
          answer: 1,
          why: "This is one of the most common misreadings of a 'non-significant' result. Low power means real effects can hide in plain sight — a null result from an underpowered study is weak evidence either way.",
        },
        {
          q: 'Why do researchers often run a "power analysis" BEFORE collecting any data?',
          options: [
            'It is just a formality with no real purpose',
            'To estimate the sample size needed to have a reasonable chance (e.g. 80% power) of detecting an effect of a meaningful size, before spending time and money collecting data',
            'Because it replaces the need for a null hypothesis',
            'Power analysis can only be done after data collection',
          ],
          answer: 1,
          why: 'Running a study too small to realistically detect anything wastes resources and risks exactly the "no significant effect, so was there even an effect?" ambiguity from the question above.',
        },
        {
          q: 'A test with very low power that DOES find a statistically significant result — what extra caution is worth applying?',
          options: [
            'None, significance is significance',
            'Counterintuitively, significant findings from low-power studies are more likely to be inflated or spurious estimates of the true effect size, because only unusually large observed effects clear the bar',
            'Low-power studies always underestimate effects',
            'Power has no relationship to the size of a significant finding',
          ],
          answer: 1,
          why: "If a study barely has the sensitivity to detect anything, the significant results that do slip through tend to be the most extreme (and often exaggerated) ones — a subtle but important caveat.",
        },
      ]
    ),
    learn(
      'stats-p-hacking',
      'Significance level misuse & p-hacking',
      'How "just try a few more things" quietly turns a 5% fluke rate into a near-certainty.',
      [
        {
          q: 'What is "p-hacking"?',
          options: [
            'A legitimate statistical technique for cleaning data',
            'Repeatedly tweaking an analysis (trying different subgroups, metrics, or cutoffs) until a result crosses the significance threshold, then reporting only that result',
            'Hacking into a database to fix p-values',
            'Using a p-value of exactly 0.05',
          ],
          answer: 1,
          why: "The core problem: if you test enough different things, something will cross p < 0.05 by pure chance — and reporting just that one 'win' hides how much searching it took to find it.",
        },
        {
          q: 'If you test 20 completely unrelated, truly null hypotheses at α = 0.05, roughly how many would you expect to come back "significant" by chance alone?',
          options: ['0', 'About 1', 'About 10', 'All 20'],
          answer: 1,
          why: "By definition, α = 0.05 means a 5% false-positive rate per test. 20 tests × 5% ≈ 1 false positive expected, purely from chance — this is exactly the multiple-comparisons problem the next tier covers in depth.",
        },
        {
          q: 'A team tests 15 different marketing metrics against a control group and reports only the single one that came back significant. What is the issue?',
          options: [
            'There is no issue, significance is significance',
            'Running many tests and reporting only the "winner" massively inflates the real chance that the highlighted result is just noise, since the 5% false-positive rate applies per test, not per project',
            'The issue is that 15 is too few tests',
            'This is the correct way to find real effects',
          ],
          answer: 1,
          why: "This is p-hacking in its most common real-world form (sometimes called 'multiple comparisons without correction') — selectively reporting the one test that happened to clear the bar, out of many that were tried.",
        },
        {
          q: 'What is a reasonable defense against accidentally p-hacking your own analysis?',
          options: [
            'Never run more than one test, ever',
            'Decide your hypothesis and analysis plan BEFORE looking at the results, and if you do run multiple tests, correct your significance threshold accordingly (covered in the next tier)',
            'Only report whichever result looks best',
            'Lower α to 0.5 to make everything significant',
          ],
          answer: 1,
          why: 'Pre-registering what you are testing (and how) before seeing the data removes the temptation — and the statistical damage — of searching for a result after the fact.',
        },
        {
          q: 'Is p-hacking always a deliberate, dishonest act?',
          options: [
            'Yes, it always requires intent to deceive',
            'No — it often happens through innocent-seeming choices made during exploratory analysis, like checking a few different cutoffs or subgroups and naturally gravitating toward the one that "worked"',
            'No, it is a myth and does not actually happen',
            'It only happens in academic research, never in industry',
          ],
          answer: 1,
          why: "This is part of why it's so pervasive and hard to fully eliminate — the incentive to find *a* significant result, combined with many small, reasonable-seeming analytical choices, can produce it without anyone intending to cheat.",
        },
      ]
    ),
    {
      id: 'stats-bootstrapping',
      title: 'Bootstrapping: resampling your way to confidence',
      blurb: 'When the formula-based confidence interval feels too rigid, resample from your own data instead.',
      kind: 'code',
      practice: {
        prompt:
          'Write `bootstrap_ci(a, seed, trials=2000)`: using **one call** `rng = np.random.default_rng(seed)`, then **one call** `rng.choice(a, size=(trials, len(a)), replace=True)` to draw all resamples at once, compute each resample\'s mean (`axis=1`), and return the (2.5th, 97.5th) percentile of those means as a 95% bootstrap confidence interval — a tuple of two floats, each rounded to 3 decimals.',
        starter: 'import numpy as np\n\ndef bootstrap_ci(a, seed, trials=2000):\n    ...\n',
        solution:
          'import numpy as np\n\ndef bootstrap_ci(a, seed, trials=2000):\n    a = np.asarray(a, dtype=float)\n    rng = np.random.default_rng(seed)\n    resamples = rng.choice(a, size=(trials, len(a)), replace=True)\n    means = resamples.mean(axis=1)\n    lo, hi = np.percentile(means, [2.5, 97.5])\n    return (round(float(lo), 3), round(float(hi), 3))',
        samples: ['bootstrap_ci([23.0, 25.0, 21.0, 24.0, 22.0, 26.0, 23.0, 24.0], 0)'],
        cases: [
          ['A moderate sample', 'bootstrap_ci([23.0, 25.0, 21.0, 24.0, 22.0, 26.0, 23.0, 24.0], 0)'],
          ['A different seed', 'bootstrap_ci([23.0, 25.0, 21.0, 24.0, 22.0, 26.0, 23.0, 24.0], 5)'],
          ['A more spread-out sample', 'bootstrap_ci([10.0, 50.0, 20.0, 45.0, 15.0, 30.0], 2)'],
        ],
        traps: [
          'import numpy as np\n\ndef bootstrap_ci(a, seed, trials=2000):\n    a = np.asarray(a, dtype=float)\n    rng = np.random.default_rng(seed)\n    resamples = rng.choice(a, size=(trials, len(a)), replace=True)\n    means = resamples.mean(axis=1)\n    lo, hi = np.percentile(means, [5, 95])\n    return (round(float(lo), 3), round(float(hi), 3))',
        ],
      },
    },
    {
      id: 'stats-workshop-ab-test',
      title: 'Tier workshop: design and run an A/B test',
      blurb: "Tie it together: a control group, a treatment group, and an honest read of what changed.",
      kind: 'code',
      practice: {
        prompt:
          'Write `ab_test(control, treatment)`: using `scipy.stats.ttest_ind(treatment, control, equal_var=False)`, return a dict with `"mean_diff"` (treatment\'s mean minus control\'s mean, rounded to 3 decimals) and `"p_value"` (rounded to 4 decimals).',
        starter: 'import numpy as np\nfrom scipy import stats\n\ndef ab_test(control, treatment):\n    ...\n',
        solution:
          'import numpy as np\nfrom scipy import stats\n\ndef ab_test(control, treatment):\n    control = np.asarray(control, dtype=float)\n    treatment = np.asarray(treatment, dtype=float)\n    result = stats.ttest_ind(treatment, control, equal_var=False)\n    return {\n        "mean_diff": round(float(treatment.mean() - control.mean()), 3),\n        "p_value": round(float(result.pvalue), 4),\n    }',
        samples: ['ab_test([20, 22, 19, 21, 23, 18], [25, 28, 24, 30, 26, 27])'],
        cases: [
          ['A clear improvement', 'ab_test([20, 22, 19, 21, 23, 18], [25, 28, 24, 30, 26, 27])'],
          ['No real difference', 'ab_test([20, 21, 19, 20, 22], [21, 20, 19, 21, 20])'],
          ['A decline in treatment', 'ab_test([40, 42, 38, 41, 39], [30, 33, 28, 31, 29])'],
        ],
        traps: [
          'import numpy as np\nfrom scipy import stats\n\ndef ab_test(control, treatment):\n    control = np.asarray(control, dtype=float)\n    treatment = np.asarray(treatment, dtype=float)\n    result = stats.ttest_ind(treatment, control, equal_var=False)\n    return {\n        "mean_diff": round(float(control.mean() - treatment.mean()), 3),\n        "p_value": round(float(result.pvalue), 4),\n    }',
          'import numpy as np\nfrom scipy import stats\n\ndef ab_test(control, treatment):\n    control = np.asarray(control, dtype=float)\n    treatment = np.asarray(treatment, dtype=float)\n    result = stats.ttest_ind(treatment, control, equal_var=True)\n    return {\n        "mean_diff": round(float(treatment.mean() - control.mean()), 3),\n        "p_value": round(float(result.pvalue), 4),\n    }',
        ],
      },
    },
  ],
}
