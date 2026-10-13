const code = (c) => ({ kind: 'code', points: 10, starter: 'answer = ', ...c })
const mcq = (c) => ({ kind: 'mcq', points: 10, ...c })

export const relationshipsExam = [
  mcq({
    id: 'stats-relationships-exam-1',
    q: 'Ice cream sales and drowning deaths are strongly correlated across the year. What is the most likely explanation?',
    options: [
      'Ice cream causes drowning',
      'A common cause — hot weather — independently drives both ice cream sales and swimming (and therefore drowning risk) up at the same time',
      'Drowning causes people to buy ice cream',
      'The correlation must be a calculation error',
    ],
    answer: 1,
    why: 'This is the classic confounding-variable example: a hidden factor drives both variables, with no direct causal link between them.',
  }),
  mcq({
    id: 'stats-relationships-exam-2',
    q: 'What range of values can the Pearson correlation coefficient (r) take?',
    options: ['0 to 1', '0 to 100', '-1 to 1', '-infinity to infinity'],
    answer: 2,
    why: 'r = 1 is a perfect positive linear relationship, r = -1 a perfect negative one, and r = 0 means no linear relationship at all.',
  }),
  code({
    id: 'stats-relationships-exam-3',
    given: 'import numpy as np\n\nx = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0]\ny = [2.1, 3.9, 6.2, 7.8, 10.1, 12.3]\n',
    task: 'Store the Pearson correlation coefficient between `x` and `y` in `answer`, as a float, using `np.corrcoef`.',
    reference: 'import numpy as np\nxs = np.asarray(x, dtype=float)\nys = np.asarray(y, dtype=float)\nanswer = float(np.corrcoef(xs, ys)[0, 1])',
    traps: ['import numpy as np\nxs = np.asarray(x, dtype=float)\nys = np.asarray(y, dtype=float)\nanswer = float(np.cov(xs, ys)[0, 1])'],
    walkthrough: '`np.corrcoef` returns a 2x2 matrix; the off-diagonal entry [0, 1] is the correlation between the two arrays.',
  }),
  mcq({
    id: 'stats-relationships-exam-4',
    q: 'In the equation y = slope · x + intercept from simple linear regression, what does the slope represent?',
    options: ['The starting value of y when x = 0', 'How much y is expected to change for each one-unit increase in x', 'The correlation coefficient', 'The variance of y'],
    answer: 1,
    why: 'Slope is the rate of change: it tells you how much y moves, on average, for a one-unit move in x.',
  }),
  code({
    id: 'stats-relationships-exam-5',
    given: 'import numpy as np\n\nx = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0]\ny = [2.1, 3.9, 6.2, 7.8, 10.1, 12.3]\n',
    task: 'Using `np.polyfit(x, y, 1)`, store a tuple `(slope, intercept)` in `answer`, each rounded to 4 decimals.',
    reference: 'import numpy as np\nxs = np.asarray(x, dtype=float)\nys = np.asarray(y, dtype=float)\nslope, intercept = np.polyfit(xs, ys, 1)\nanswer = (round(float(slope), 4), round(float(intercept), 4))',
    traps: ['import numpy as np\nxs = np.asarray(x, dtype=float)\nys = np.asarray(y, dtype=float)\nslope, intercept = np.polyfit(ys, xs, 1)\nanswer = (round(float(slope), 4), round(float(intercept), 4))'],
    walkthrough: '`np.polyfit(x, y, 1)` fits a degree-1 polynomial (a line) predicting y from x, returning (slope, intercept).',
  }),
  mcq({
    id: 'stats-relationships-exam-6',
    q: 'What does R² (R-squared) represent for a fitted regression line?',
    options: [
      'The slope of the line',
      'The fraction of the variation in y that the line explains',
      'The number of data points',
      'The p-value of the regression',
    ],
    answer: 1,
    why: 'R² is the squared correlation — it quantifies how much of y\'s total variation is accounted for by the fitted line, from 0 (none) to 1 (all of it).',
  }),
  mcq({
    id: 'stats-relationships-exam-7',
    q: 'You want to compare average response time across FOUR different server regions. Which test is the natural first choice?',
    options: ['A single two-sample t-test', 'One-way ANOVA', 'A chi-square test', 'Simple correlation'],
    answer: 1,
    why: 'More than two groups, comparing means — this is ANOVA\'s use case, avoiding the inflated false-positive risk of many separate t-tests.',
  }),
  code({
    id: 'stats-relationships-exam-8',
    given: 'from scipy import stats\n\ntable = [[12, 8], [7, 13]]\n',
    task: 'Using `scipy.stats.chi2_contingency` with default settings, store the p-value of the contingency `table` in `answer`, as a float.',
    reference: 'from scipy import stats\nresult = stats.chi2_contingency(table)\nanswer = float(result.pvalue)',
    traps: ['from scipy import stats\nresult = stats.chi2_contingency(table, correction=False)\nanswer = float(result.pvalue)'],
    walkthrough: 'Pass the table directly to `chi2_contingency` and read off `.pvalue` from the result, using the default Yates\' correction setting.',
  }),
  mcq({
    id: 'stats-relationships-exam-9',
    q: 'What is "survivorship bias"?',
    options: [
      'A bias toward measuring the tallest cases',
      'Drawing conclusions only from the cases that "survived" some selection process, while the cases that did not survive never make it into the data at all',
      'A statistical test for medical survival rates',
      'Any form of sampling error',
    ],
    answer: 1,
    why: 'The classic WWII bullet-hole example: planes that survived being hit in certain spots were the ones studied — the planes hit in the truly critical spots never made it back to be counted.',
  }),
  mcq({
    id: 'stats-relationships-exam-10',
    q: 'If you run 20 independent hypothesis tests at α = 0.05, roughly what is the chance of at least one false positive, even if every null hypothesis is actually true?',
    options: ['5%', 'About 64%', '100%', '0%'],
    answer: 1,
    why: '1 − (1 − 0.05)^20 ≈ 0.64 — each test still has a 5% individual false-positive rate, but the chance that at least one of many slips through climbs quickly.',
  }),
  mcq({
    id: 'stats-relationships-exam-11',
    q: 'A report states "this change improved the metric," with no further detail. What should a careful reader ask?',
    options: [
      'Nothing, the claim should be taken at face value',
      '"Improved compared to what, by how much, with what uncertainty, and is that difference likely real or just noise?"',
      'Whether the chart used enough colors',
      'Whether the currency units were correct',
    ],
    answer: 1,
    why: 'Each of those questions maps to a tool from this path: baseline comparison, effect size, confidence interval, and statistical significance.',
  }),
  code({
    id: 'stats-relationships-exam-12',
    given: 'import numpy as np\n\nx = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0]\ny = [5.0, 3.0, 8.0, 4.0, 9.0, 7.0]\n',
    task: 'Fit a line with `np.polyfit(x, y, 1)`, then store R² (1 minus residual sum of squares over total sum of squares) in `answer`, rounded to 4 decimals.',
    reference:
      'import numpy as np\nxs = np.asarray(x, dtype=float)\nys = np.asarray(y, dtype=float)\nslope, intercept = np.polyfit(xs, ys, 1)\npred = slope * xs + intercept\nss_res = np.sum((ys - pred) ** 2)\nss_tot = np.sum((ys - ys.mean()) ** 2)\nanswer = round(float(1 - ss_res / ss_tot), 4)',
    traps: [
      'import numpy as np\nxs = np.asarray(x, dtype=float)\nys = np.asarray(y, dtype=float)\nanswer = round(float(np.corrcoef(xs, ys)[0, 1]), 4)',
    ],
    walkthrough: 'R² = 1 - (sum of squared residuals) / (sum of squared deviations from the mean of y).',
  }),
]
