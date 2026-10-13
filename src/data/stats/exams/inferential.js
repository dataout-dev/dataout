const code = (c) => ({ kind: 'code', points: 10, starter: 'answer = ', ...c })
const mcq = (c) => ({ kind: 'mcq', points: 10, ...c })

export const inferentialExam = [
  mcq({
    id: 'stats-inferential-exam-1',
    q: 'Why can\'t you just report your sample mean as "the exact truth" about the population mean?',
    options: [
      'You can, it is always exactly correct',
      'A different random sample from the same population would almost certainly give a slightly different mean — your sample is just one draw among many possible ones',
      'Sample means are always biased',
      'Population means do not really exist',
    ],
    answer: 1,
    why: 'Your sample mean is one point drawn from a whole distribution of possible sample means — that sampling variability is exactly why inference exists.',
  }),
  code({
    id: 'stats-inferential-exam-2',
    given: 'import numpy as np\n\na = [23.0, 45.0, 12.0, 67.0, 34.0, 29.0, 51.0]\n',
    task: 'Store the standard error of the mean of `a` (sample std with `ddof=1`, divided by √n) in `answer`, as a float.',
    reference: 'import numpy as np\narr = np.asarray(a, dtype=float)\nanswer = float(arr.std(ddof=1) / np.sqrt(len(arr)))',
    traps: ['import numpy as np\narr = np.asarray(a, dtype=float)\nanswer = float(arr.std(ddof=0) / np.sqrt(len(arr)))'],
    walkthrough: 'Standard error of the mean = sample standard deviation (ddof=1) divided by the square root of the sample size.',
  }),
  mcq({
    id: 'stats-inferential-exam-3',
    q: 'What does a 95% confidence interval actually mean?',
    options: [
      'There is a 95% chance the true population mean falls inside this specific interval',
      'If you repeated this sampling-and-interval process many times, about 95% of the resulting intervals would contain the true population mean',
      'You are 95% certain your sample mean is correct',
      '95% of the raw data falls inside the interval',
    ],
    answer: 1,
    why: 'The 95% describes the long-run reliability of the method across repeated sampling, not your certainty about this one already-computed interval.',
  }),
  mcq({
    id: 'stats-inferential-exam-4',
    q: 'To cut the margin of error of a confidence interval in HALF, roughly how much bigger does your sample need to be?',
    options: ['2× bigger', '4× bigger', 'Half as big', 'No change needed'],
    answer: 1,
    why: 'Standard error scales with 1/√n, so halving it requires quadrupling n.',
  }),
  mcq({
    id: 'stats-inferential-exam-5',
    q: 'What does the null hypothesis (H0) typically represent in a hypothesis test?',
    options: [
      'The claim you are hoping to prove',
      'A default "nothing interesting is happening" position — e.g. no effect or no difference — that you test the data against',
      'Whatever the sample mean happens to be',
      'The alternative hypothesis restated',
    ],
    answer: 1,
    why: 'H0 is the skeptical baseline. You only reject it if the observed data makes that position hard to believe.',
  }),
  mcq({
    id: 'stats-inferential-exam-6',
    q: 'What does a p-value of 0.02 actually represent?',
    options: [
      'A 2% chance the null hypothesis is true',
      'The probability of observing data at least as extreme as what you got, ASSUMING the null hypothesis is true',
      'A 98% chance the alternative hypothesis is true',
      'The probability that your result is important',
    ],
    answer: 1,
    why: 'A p-value conditions on H0 being true and measures how surprising the observed data would be under that assumption — it does not state the probability that any hypothesis is true.',
  }),
  code({
    id: 'stats-inferential-exam-7',
    given: 'from scipy import stats\n\na = [23, 25, 21, 24, 22]\nb = [30, 45, 28, 50, 33]\n',
    task: "Using `scipy.stats.ttest_ind` with `equal_var=False`, store the two-sided p-value comparing `a` and `b` in `answer`, as a float.",
    reference: 'from scipy import stats\nresult = stats.ttest_ind(a, b, equal_var=False)\nanswer = float(result.pvalue)',
    traps: ['from scipy import stats\nresult = stats.ttest_ind(a, b, equal_var=True)\nanswer = float(result.pvalue)'],
    walkthrough: "Welch's t-test (equal_var=False) does not assume the two groups have equal variance.",
  }),
  mcq({
    id: 'stats-inferential-exam-8',
    q: 'What is a Type I error?',
    options: [
      'Failing to reject a false null hypothesis',
      'Rejecting a null hypothesis that was actually true (a false positive)',
      'Using the wrong sample size',
      'A simple calculation mistake',
    ],
    answer: 1,
    why: 'A Type I error means concluding there was an effect when there really was not one.',
  }),
  mcq({
    id: 'stats-inferential-exam-9',
    q: 'Which of these generally INCREASES statistical power, holding everything else constant?',
    options: ['A smaller sample size', 'A larger sample size', 'A smaller true effect size', 'A stricter α with nothing else changed'],
    answer: 1,
    why: 'More data narrows the relevant sampling distributions, making a real effect easier to distinguish from noise — directly boosting power.',
  }),
  mcq({
    id: 'stats-inferential-exam-10',
    q: 'A team tests 20 unrelated metrics and reports only the one that came back "significant" at α = 0.05. What is the core issue?',
    options: [
      'There is no issue, significance is significance',
      'Running many tests and reporting only the "winner" massively inflates the real chance that the highlighted result is just noise',
      'The team should have used a smaller sample',
      'This is the statistically correct way to find real effects',
    ],
    answer: 1,
    why: 'Each test still carries its own 5% false-positive rate; across 20 tests, roughly 1 false positive is expected by chance alone — exactly the p-hacking / multiple-comparisons problem.',
  }),
  code({
    id: 'stats-inferential-exam-11',
    given: 'import numpy as np\n\na = [23.0, 25.0, 21.0, 24.0, 22.0, 26.0, 23.0, 24.0]\nseed = 4\ntrials = 2000\n',
    task: 'Using one call `rng = np.random.default_rng(seed)` then one call `rng.choice(a, size=(trials, len(a)), replace=True)`, compute each resample\'s mean (`axis=1`), and store the (2.5th, 97.5th) percentile as a tuple of two floats rounded to 3 decimals in `answer`.',
    reference:
      'import numpy as np\narr = np.asarray(a, dtype=float)\nrng = np.random.default_rng(seed)\nresamples = rng.choice(arr, size=(trials, len(arr)), replace=True)\nmeans = resamples.mean(axis=1)\nlo, hi = np.percentile(means, [2.5, 97.5])\nanswer = (round(float(lo), 3), round(float(hi), 3))',
    traps: [
      'import numpy as np\narr = np.asarray(a, dtype=float)\nrng = np.random.default_rng(seed)\nresamples = rng.choice(arr, size=(trials, len(arr)), replace=True)\nmeans = resamples.mean(axis=1)\nlo, hi = np.percentile(means, [5, 95])\nanswer = (round(float(lo), 3), round(float(hi), 3))',
    ],
    walkthrough: 'Resample with replacement, compute each resample\'s mean, and take the 2.5th/97.5th percentiles of those means for a 95% interval.',
  }),
  mcq({
    id: 'stats-inferential-exam-12',
    q: 'An underpowered study finds no statistically significant effect. What is the most responsible conclusion?',
    options: [
      'The effect definitely does not exist',
      'The study may simply not have had enough power to detect the effect even if it is real — absence of significance is not proof of absence of an effect',
      'The study proves the null hypothesis is true',
      'The result should be reported as strong evidence against the effect',
    ],
    answer: 1,
    why: 'Low power means real effects can hide in plain sight — a null result from an underpowered study is weak evidence either way, not proof of nothing happening.',
  }),
]
