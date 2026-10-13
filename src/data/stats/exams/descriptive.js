const code = (c) => ({ kind: 'code', points: 10, starter: 'answer = ', ...c })
const mcq = (c) => ({ kind: 'mcq', points: 10, ...c })

export const descriptiveExam = [
  mcq({
    id: 'stats-descriptive-exam-1',
    q: 'A dataset is {4, 5, 5, 6, 200}. Why is the mean so much higher than the median here?',
    options: [
      'The median is calculated incorrectly',
      'The value 200 pulls the mean up since every value is weighted into the sum, while the median only cares about the middle position',
      'There is no real difference between them',
      'The mean is always wrong on small datasets',
    ],
    answer: 1,
    why: 'Mean is sensitive to magnitude; median is purely positional. One large outlier can drag the mean far from where "most of the data" sits.',
  }),
  code({
    id: 'stats-descriptive-exam-2',
    given: 'import numpy as np\n\na = [23.0, 45.0, 12.0, 67.0, 34.0, 29.0, 51.0]\n# a is a list of numbers; numpy is already imported.',
    task: 'Store `(mean, median)` of `a` in `answer`, as a tuple of two floats.',
    reference: 'import numpy as np\narr = np.asarray(a, dtype=float)\nanswer = (float(arr.mean()), float(np.median(arr)))',
    traps: ['import numpy as np\narr = np.asarray(a, dtype=float)\nanswer = (float(np.median(arr)), float(arr.mean()))'],
    walkthrough: 'Compute both with numpy and store them as `(mean, median)`, in that order.',
  }),
  mcq({
    id: 'stats-descriptive-exam-3',
    q: 'Dataset A has values tightly clustered near its mean. Dataset B has the same mean but values scattered far apart. What statistic captures this difference?',
    options: ['Mode', 'Standard deviation', 'Median', 'Count'],
    answer: 1,
    why: 'Standard deviation measures exactly this: how far, on average, values sit from the mean. Two equal means can hide wildly different spreads.',
  }),
  code({
    id: 'stats-descriptive-exam-4',
    given: 'import numpy as np\n\nx = 60.0\na = [23.0, 45.0, 12.0, 67.0, 34.0, 29.0, 51.0]\n',
    task: 'Using the population standard deviation (`ddof=0`), compute the z-score of `x` relative to `a` and store it (as a float) in `answer`.',
    reference: 'import numpy as np\narr = np.asarray(a, dtype=float)\nanswer = float((x - arr.mean()) / arr.std())',
    traps: ['import numpy as np\narr = np.asarray(a, dtype=float)\nanswer = float((x - arr.mean()) / arr.std(ddof=1))'],
    walkthrough: 'Subtract the mean of `a` from `x`, then divide by the population standard deviation of `a`.',
  }),
  mcq({
    id: 'stats-descriptive-exam-5',
    q: 'In a box plot, what does the box itself (not the whiskers) represent?',
    options: ['The full range of the data', 'The middle 50% of the data, from Q1 to Q3', 'Just the median', 'The mean plus one standard deviation'],
    answer: 1,
    why: 'The box spans the interquartile range (IQR) — Q1 to Q3 — which covers the middle half of the sorted data.',
  }),
  code({
    id: 'stats-descriptive-exam-6',
    given: 'import numpy as np\n\nx = 18.0\na = [10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0]\n',
    task: 'Using the 1.5×IQR rule, store `True` in `answer` if `x` is an outlier relative to `a`, else `False`.',
    reference:
      'import numpy as np\narr = np.asarray(a, dtype=float)\nq1, q3 = np.percentile(arr, [25, 75])\niqr = q3 - q1\nlo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr\nanswer = bool(x < lo or x > hi)',
    traps: [
      'import numpy as np\narr = np.asarray(a, dtype=float)\nq1, q3 = np.percentile(arr, [25, 75])\niqr = q3 - q1\nlo, hi = q1 - iqr, q3 + iqr\nanswer = bool(x < lo or x > hi)',
    ],
    walkthrough: 'Compute Q1 and Q3 of `a`, derive the IQR, and check if `x` falls outside `[Q1 - 1.5*IQR, Q3 + 1.5*IQR]`. At 1.5x the bound is wide enough that x = 18 is NOT an outlier; at the stricter 1x it would be.',
  }),
  mcq({
    id: 'stats-descriptive-exam-7',
    q: 'A histogram shows two distinct, separated peaks. What should that make you suspect about the underlying data?',
    options: [
      'The data is definitely corrupted',
      'The dataset may actually be a mix of two different underlying groups, rather than one uniform population',
      'You need a smaller sample',
      'The mean must be wrong',
    ],
    answer: 1,
    why: 'A bimodal shape is a classic clue that two different subpopulations are mixed together — splitting by a hidden category often reveals two cleaner, unimodal shapes.',
  }),
  mcq({
    id: 'stats-descriptive-exam-8',
    q: 'A distribution is right-skewed (a long tail stretching toward high values). How do its mean and median typically compare?',
    options: ['Mean is below the median', 'Mean is above the median', 'They are always exactly equal', 'There is no reliable relationship'],
    answer: 1,
    why: 'The long right tail pulls the mean upward since it factors in every extreme value, while the median — purely positional — barely moves.',
  }),
  code({
    id: 'stats-descriptive-exam-9',
    given: 'import numpy as np\n\na = [23.0, 45.0, 12.0, 67.0, 34.0, 29.0, 51.0]\n',
    task: 'Store the five-number summary of `a` — `(min, q1, median, q3, max)` — in `answer`, as a tuple of 5 floats.',
    reference:
      'import numpy as np\narr = np.asarray(a, dtype=float)\nq1, q3 = np.percentile(arr, [25, 75])\nanswer = (float(arr.min()), float(q1), float(np.median(arr)), float(q3), float(arr.max()))',
    traps: [
      'import numpy as np\narr = np.asarray(a, dtype=float)\nq1, q3 = np.percentile(arr, [25, 75])\nanswer = (float(arr.min()), float(q3), float(np.median(arr)), float(q1), float(arr.max()))',
    ],
    walkthrough: 'Get Q1 and Q3 via `np.percentile(arr, [25, 75])`, then assemble the tuple in order: min, Q1, median, Q3, max.',
  }),
  mcq({
    id: 'stats-descriptive-exam-10',
    q: 'Why is "mode" the only one of mean, median, and mode that also works on purely categorical data (like favorite color)?',
    options: [
      'It does not actually work on categorical data',
      'Mode just counts which label appears most often — no arithmetic or sort order is required, unlike mean or median',
      'Categorical data has no meaningful center at all',
      'Mode requires the data to be numeric first',
    ],
    answer: 1,
    why: "Mean needs addition and division, median needs an order to sort by — categories have neither. Mode only needs to count occurrences.",
  }),
  mcq({
    id: 'stats-descriptive-exam-11',
    q: "What is the core mechanism behind Simpson's paradox?",
    options: [
      'Random measurement error',
      'An uneven group size across subgroups that gets hidden once the subgroups are combined into one overall average, letting a true subgroup trend reverse overall',
      'It only ever happens in medical studies',
      'It means averages can never be trusted for anything',
    ],
    answer: 1,
    why: 'When one comparison group is weighted very differently across subgroups, combining them into one number can let that imbalance flip the overall trend, even though every individual subgroup comparison agreed.',
  }),
  code({
    id: 'stats-descriptive-exam-12',
    given: 'import numpy as np\n\na = [23.0, 45.0, 12.0, 67.0, 34.0, 29.0, 51.0]\n',
    task: 'Store the **population** standard deviation (`ddof=0`) of `a` in `answer`, as a float.',
    reference: 'import numpy as np\narr = np.asarray(a, dtype=float)\nanswer = float(arr.std())',
    traps: ['import numpy as np\narr = np.asarray(a, dtype=float)\nanswer = float(arr.std(ddof=1))'],
    walkthrough: 'Use `.std()` with its default `ddof=0` for the population standard deviation.',
  }),
]
