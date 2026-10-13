const learn = (id, title, blurb, check, widget) => ({ id, title, blurb, kind: 'learn', check, ...(widget ? { widget } : {}) })

export const descriptiveSection = {
  id: 'descriptive',
  title: 'Descriptive Statistics',
  intro: 'Mean, median, spread, shape, and outliers — the vocabulary for describing any dataset.',
  lessons: [
    learn(
      'stats-what-statistics-does',
      'What statistics actually does',
      'Before any formulas: what problem is this field solving, and what is a "sample" versus a "population"?',
      [
        {
          q: 'What is the core job of descriptive statistics?',
          options: [
            'Predicting the stock market',
            'Summarizing a dataset with a small number of numbers so a person can grasp it without reading every row',
            'Proving a scientific theory is true',
            'Writing SQL queries faster',
          ],
          answer: 1,
          why: 'A spreadsheet with a million rows is unreadable. Descriptive statistics compresses it into a handful of numbers (mean, spread, shape) that still tell you something real.',
        },
        {
          q: 'What is the difference between a "population" and a "sample"?',
          options: [
            'A population is numeric data, a sample is categorical data',
            'A population is every member of the group you care about; a sample is the subset you actually measured',
            'They are different words for the same thing',
            'A sample is always bigger than a population',
          ],
          answer: 1,
          why: 'You rarely measure everyone. You measure a sample and use it to say something about the population it was drawn from — that gap is the whole reason inferential statistics exists.',
        },
        {
          q: 'Which of these is categorical data, not numerical?',
          options: ['A person\'s height in cm', 'A customer\'s subscription plan ("Free", "Pro", "Enterprise")', 'The temperature in Celsius', 'Daily revenue in dollars'],
          answer: 1,
          why: 'Categorical data names a group or label. Height, temperature, and revenue are all measured on a numeric scale.',
        },
        {
          q: 'Why do two datasets with the same mean still often look completely different?',
          options: [
            'The mean is always wrong',
            'The mean only describes the center — it says nothing about spread, shape, or outliers',
            'This never actually happens',
            'Because one dataset has more rows',
          ],
          answer: 1,
          why: 'Center and spread are separate questions. "Average temperature 20°C" could mean a mild, steady climate or a place that swings from -10°C to 50°C — the mean alone cannot tell you which.',
        },
        {
          q: 'Why learn statistics through interactive exploration instead of just memorizing formulas?',
          options: [
            'Formulas are never used in real analysis',
            'Seeing how a statistic reacts when you change the underlying data builds intuition for when a number is trustworthy versus misleading',
            'It is faster to memorize formulas',
            'There is no real difference',
          ],
          answer: 1,
          why: 'Knowing the formula for a mean does not tell you that one outlier can drag it far from where "most of the data" actually is. Watching it happen does.',
        },
      ]
    ),
    learn(
      'stats-mean-median-mode',
      'Measures of center: mean, median, mode',
      'Three different answers to "what is a typical value here?" — and why they can disagree.',
      [
        {
          q: 'What is the median of a dataset?',
          options: ['The most frequent value', 'The middle value when the data is sorted', 'The sum divided by the count', 'The largest value minus the smallest'],
          answer: 1,
          why: 'The median is a position-based measure: sort the data and take the middle value (or the average of the two middle values for an even count).',
        },
        {
          q: 'A dataset is {3, 4, 4, 5, 100}. Why is the mean so much higher than the median here?',
          options: [
            'The mean is calculated wrong',
            'The 100 pulls the mean up because every value is weighted into the sum; the median only cares about position, so it ignores how far away 100 is',
            'The median is always wrong when there are 5 values',
            'There is no real difference between them in this case',
          ],
          answer: 1,
          why: 'Mean = 23.2, median = 4. The mean is sensitive to magnitude; a single huge value can drag it far from "most of the data." The median only asks "what\'s in the middle slot?"',
        },
        {
          q: 'What is the mode of a dataset?',
          options: ['The middle value', 'The average value', 'The most frequently occurring value', 'The range of the data'],
          answer: 2,
          why: 'Mode is purely about frequency — it is the only one of the three center measures that works on categorical data too, since you cannot average or sort labels like "red" or "blue".',
        },
        {
          q: 'For which situation is the median usually the better choice of "typical value"?',
          options: [
            'A symmetric dataset with no outliers',
            'A dataset like household income, which is typically right-skewed with a few very large values',
            'Never — the mean is always better',
            'When the data is categorical',
          ],
          answer: 1,
          why: 'With income data, a handful of very high earners drag the mean well above what a "typical" household makes. The median describes the middle household, unaffected by how extreme the top earners are.',
        },
        {
          q: 'If mean and median are nearly equal, what does that typically suggest about the data?',
          options: ['The data is categorical', 'The dataset is roughly symmetric, without extreme outliers pulling the mean away from the middle', 'The data is sorted', 'The sample size is too small to trust'],
          answer: 1,
          why: "When there's no long tail or extreme outlier dragging the sum around, the mean and median land close together.",
        },
      ],
      'outlier-center-explorer'
    ),
    {
      id: 'stats-variance-std-dev',
      title: 'Measures of spread: range, variance, standard deviation',
      blurb: 'Two datasets can share a mean and still look nothing alike — spread is why.',
      kind: 'code',
      practice: {
        prompt:
          'Write `spread(a)`: return a 2-tuple `(variance, std)` — the **population** variance and standard deviation (`ddof=0`) of array `a` — both as plain floats.',
        starter: 'import numpy as np\n\ndef spread(a):\n    ...\n',
        solution:
          'import numpy as np\n\ndef spread(a):\n    a = np.asarray(a, dtype=float)\n    return (float(a.var()), float(a.std()))',
        samples: ['spread([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])'],
        cases: [
          ['A textbook example', 'spread([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])'],
          ['All identical values (spread should be 0)', 'spread([5.0, 5.0, 5.0, 5.0])'],
          ['Negative numbers', 'spread([-3.0, -1.0, 1.0, 3.0])'],
          ['A tightly clustered set', 'spread([10.0, 10.5, 9.5, 10.2, 9.8])'],
        ],
        traps: [
          'import numpy as np\n\ndef spread(a):\n    a = np.asarray(a, dtype=float)\n    return (float(a.var(ddof=1)), float(a.std(ddof=1)))',
          'import numpy as np\n\ndef spread(a):\n    a = np.asarray(a, dtype=float)\n    return (float(a.std()), float(a.var()))',
        ],
      },
    },
    learn(
      'stats-five-number-summary',
      'The five-number summary & box plots',
      'Minimum, Q1, median, Q3, maximum — five numbers that sketch the whole shape of a dataset.',
      [
        {
          q: 'What are the "five numbers" in a five-number summary?',
          options: [
            'Mean, median, mode, variance, standard deviation',
            'Minimum, first quartile (Q1), median, third quartile (Q3), maximum',
            'The five most common values',
            'The first five rows of the dataset',
          ],
          answer: 1,
          why: 'These five numbers split the sorted data into quarters, giving you both the center (median) and a sense of spread (the quartiles and extremes) in one glance.',
        },
        {
          q: 'What does the "box" in a box plot represent?',
          options: ['The full range of the data', 'The middle 50% of the data, from Q1 to Q3', 'Just the mean', 'The most frequent value'],
          answer: 1,
          why: 'The box spans the interquartile range (IQR) — Q3 minus Q1 — which is where the middle half of your data actually sits.',
        },
        {
          q: 'What do the "whiskers" extending from a box plot usually show?',
          options: ['Random noise', 'The range within 1.5×IQR of the box, with points beyond that often plotted separately as outliers', 'Always the full min and max, no exceptions', 'The mean ± one standard deviation'],
          answer: 1,
          why: 'The common convention caps whiskers at 1.5×IQR beyond the box; anything further out is usually flagged as a potential outlier rather than stretching the whisker to it.',
        },
        {
          q: 'Two box plots have the same median but very different box widths (IQRs). What does that tell you?',
          options: [
            'Nothing, box width is meaningless',
            'The dataset with the wider box has more spread in its middle 50% of values',
            'The wider box has a bigger sample size',
            'The datasets are identical',
          ],
          answer: 1,
          why: 'A wider box means Q1 and Q3 are farther apart — the middle half of the data is more spread out — even if the two datasets are "centered" at the same median.',
        },
        {
          q: 'Why is the five-number summary considered "robust" to outliers, unlike the mean and standard deviation?',
          options: [
            'It is not actually robust',
            'Every piece of it (min, quartiles, max, median) is based on position in the sorted order, not on the exact magnitude of extreme values',
            'It ignores all the data except the middle value',
            'It only works on small datasets',
          ],
          answer: 1,
          why: 'A median or quartile cares which value sits at a given rank, not how far away the extreme values are. One huge outlier can only ever become the new max — it cannot drag the whole summary toward it the way it drags a mean.',
        },
      ],
      'outlier-center-explorer:boxplot'
    ),
    {
      id: 'stats-z-scores',
      title: 'Z-scores & standardization',
      blurb: 'How many standard deviations from the mean is this one value, exactly?',
      kind: 'code',
      practice: {
        prompt: 'Write `zscores(a)`: return a list of the **population** z-score (using `ddof=0` std) for every value in array `a`, as plain floats, in the original order.',
        starter: 'import numpy as np\n\ndef zscores(a):\n    ...\n',
        solution:
          'import numpy as np\n\ndef zscores(a):\n    a = np.asarray(a, dtype=float)\n    m = a.mean()\n    s = a.std()\n    return [float((x - m) / s) for x in a]',
        samples: ['zscores([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])'],
        cases: [
          ['A textbook example', 'zscores([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])'],
          ['A symmetric set around 0', 'zscores([-4.0, -2.0, 0.0, 2.0, 4.0])'],
          ['Values all close together', 'zscores([100.0, 101.0, 99.0, 100.5, 99.5])'],
        ],
        traps: [
          'import numpy as np\n\ndef zscores(a):\n    a = np.asarray(a, dtype=float)\n    m = a.mean()\n    s = a.std(ddof=1)\n    return [float((x - m) / s) for x in a]',
          'import numpy as np\n\ndef zscores(a):\n    a = np.asarray(a, dtype=float)\n    m = a.mean()\n    return [float(x - m) for x in a]',
        ],
      },
    },
    learn(
      'stats-histograms',
      'Visualizing distributions: histograms',
      'A histogram is a bar chart of frequency — and the single most useful first picture of any dataset.',
      [
        {
          q: 'What does a histogram actually show?',
          options: [
            'How a value changes over time',
            'How many data points fall into each range ("bin") of values',
            'The relationship between two variables',
            'The exact value of every data point',
          ],
          answer: 1,
          why: 'A histogram groups continuous data into bins and counts how many values land in each one — turning a long list of numbers into a shape you can see.',
        },
        {
          q: 'If you make the bins of a histogram much wider, what typically happens?',
          options: ['Nothing changes', 'You lose detail — the histogram looks smoother but can hide real structure like two separate peaks', 'The data changes', 'The mean changes'],
          answer: 1,
          why: 'Bin width is a choice, not a fact about the data. Too wide and you blur two real clusters into one hump; too narrow and random noise looks like meaningful structure.',
        },
        {
          q: 'A histogram with one clear peak is called what?',
          options: ['Bimodal', 'Unimodal', 'Skewed', 'Uniform'],
          answer: 1,
          why: '"Unimodal" means one mode — one clear peak in the shape. "Bimodal" would mean two separate peaks, often a sign of two underlying groups mixed together.',
        },
        {
          q: 'You see a histogram with two distinct peaks, far apart. What should that make you suspect?',
          options: [
            'The data is definitely wrong',
            'The dataset might actually be a mix of two different underlying groups (e.g. two customer segments) rather than one uniform population',
            'You need a bigger sample',
            'The mean is incorrectly calculated',
          ],
          answer: 1,
          why: 'A bimodal shape is often a clue that "the data" is secretly two different stories — splitting by a hidden category (e.g. new vs. returning customers) can reveal two cleaner unimodal shapes.',
        },
        {
          q: 'Why is looking at a histogram usually a better first step than jumping straight to the mean?',
          options: [
            'Histograms are always more precise',
            'A single mean can look identical for very differently-shaped datasets; the histogram shows you the shape the mean is hiding',
            'The mean cannot be computed from a histogram',
            'There is no real benefit',
          ],
          answer: 1,
          why: 'Two datasets can have the exact same mean while one is symmetric and the other is wildly skewed or bimodal. A quick look at the shape catches that immediately.',
        },
      ],
      'histogram-shape-explorer'
    ),
    learn(
      'stats-skewness-kurtosis',
      'Shape of a distribution: skewness & kurtosis',
      'Giving a name to "which way does the tail point" and "how heavy are the extremes".',
      [
        {
          q: 'A distribution is "right-skewed" (positively skewed). What does that mean?',
          options: [
            'Most of the data is on the right side',
            'The bulk of the data is on the lower end, with a long tail stretching out toward higher values',
            'The mean is lower than the median',
            'The distribution is perfectly symmetric',
          ],
          answer: 1,
          why: 'Right-skew means a long tail on the right (high) side — think household income or house prices, where most values are modest but a few are very large.',
        },
        {
          q: 'In a right-skewed distribution, how do the mean and median typically compare?',
          options: ['Mean is below the median', 'Mean is above the median', 'They are always exactly equal', 'There is no reliable relationship'],
          answer: 1,
          why: 'The long right tail pulls the mean upward (it factors in every extreme value), while the median just sits at the middle position and barely moves.',
        },
        {
          q: 'What does "kurtosis" describe about a distribution?',
          options: [
            'How skewed it is',
            'How heavy its tails are — whether extreme values are more or less common than a normal distribution would predict',
            'The sample size',
            'The number of peaks',
          ],
          answer: 1,
          why: 'High kurtosis ("fat tails") means extreme values show up more often than a normal distribution would suggest — a real concern in, say, financial returns.',
        },
        {
          q: 'Why does it matter whether a dataset is skewed before you report "the average"?',
          options: [
            'It never matters',
            'On skewed data, the mean can give a misleading sense of what a "typical" value actually looks like, and the median is often more representative',
            'Skewed data cannot have an average',
            'Skew only affects categorical data',
          ],
          answer: 1,
          why: "Reporting just the mean income of a right-skewed population, for instance, overstates what a typical household actually earns — the median gives a fairer picture.",
        },
        {
          q: 'A perfectly symmetric distribution (like a normal distribution) has a skewness value close to what?',
          options: ['1', '-1', '0', '100'],
          answer: 2,
          why: 'Skewness near zero signals symmetry — no meaningful lean toward either tail.',
        },
      ],
      'histogram-shape-explorer:skew'
    ),
    learn(
      'stats-covariance-correlation-intro',
      'Covariance & correlation: a first look',
      'Do two variables tend to move together — and how would you even start measuring that?',
      [
        {
          q: 'What does a positive covariance between two variables suggest?',
          options: [
            'They are unrelated',
            'When one tends to be above its own average, the other tends to be above its own average too',
            'One variable causes the other',
            'The two variables are measured on the same scale',
          ],
          answer: 1,
          why: 'Covariance captures the direction of a joint relationship: positive means they tend to rise and fall together; negative means one tends to be high when the other is low.',
        },
        {
          q: 'Why is correlation generally more useful to report than raw covariance?',
          options: [
            'Correlation is always positive',
            'Correlation is standardized to always fall between -1 and 1, so it can be compared across variables measured on completely different scales',
            'Covariance is impossible to compute',
            'They are exactly the same thing',
          ],
          answer: 1,
          why: 'Covariance depends on the units of both variables (dollars, centimeters, etc.), so its raw size is hard to interpret. Correlation rescales it to a unit-free number between -1 and 1.',
        },
        {
          q: 'A correlation of 0 between two variables means what?',
          options: [
            'They are definitely unrelated in every sense',
            'There is no detectable *linear* relationship between them — a strong non-linear relationship could still exist',
            'One causes the other',
            'The data must be wrong',
          ],
          answer: 1,
          why: 'Correlation specifically measures linear association. Two variables can have a strong curved (e.g. U-shaped) relationship and still show a correlation near 0.',
        },
        {
          q: 'If two variables have a correlation of -0.9, what does that describe?',
          options: [
            'A weak relationship',
            'A strong relationship where, as one variable rises, the other tends to fall',
            'No relationship at all',
            'A relationship where one variable causes the other to fall',
          ],
          answer: 1,
          why: 'The magnitude (0.9) tells you the relationship is strong; the sign (negative) tells you the direction is inverse — not that one necessarily causes the other, which is a separate question entirely.',
        },
        {
          q: 'Why will this path come back to correlation again in a later tier, in much more depth?',
          options: [
            'It will not',
            'Because correlation is foundational to regression, and understanding when it misleads (e.g. "correlation isn\'t causation") takes more than one pass',
            'Because this lesson was incomplete',
            'Only to pad the curriculum',
          ],
          answer: 1,
          why: "This lesson is the first look at a tool that a later tier builds into full linear regression — plus the much more important question of what correlation can't tell you.",
        },
      ]
    ),
    learn(
      'stats-categorical-data',
      'Summarizing categorical data',
      'Not everything is a number. Counts, proportions, and bar charts for labels and categories.',
      [
        {
          q: 'What is the right way to summarize a categorical column, like "favorite color"?',
          options: ['Compute its mean', 'Compute its standard deviation', 'Count how often each category appears, often as a frequency or proportion', 'Sort it alphabetically'],
          answer: 2,
          why: "You can't average the labels \"red\" and \"blue\" — counts and proportions (what fraction chose each option) are the meaningful summary for categorical data.",
        },
        {
          q: 'What is a "proportion" in this context?',
          options: ['The total count', 'The count of one category divided by the total number of observations', 'The average value', 'The most common category'],
          answer: 1,
          why: 'A proportion turns a raw count into a fraction of the whole — "120 of 400 customers chose Pro" becomes the more comparable "30%".',
        },
        {
          q: 'Why is a bar chart usually better than a pie chart for comparing many categories?',
          options: [
            'Bar charts are always prettier',
            'Bar height makes it easy to compare many categories precisely; angle/area in a pie chart is harder for people to judge accurately, especially with many slices',
            'Pie charts cannot show more than two categories',
            'There is no real difference',
          ],
          answer: 1,
          why: "Human perception is much better at comparing the lengths of bars than the angles of pie slices, especially once you're past 3-4 categories.",
        },
        {
          q: '"Mode" is the one measure of center from earlier that also works on categorical data. Why?',
          options: [
            'It does not actually work on categorical data',
            'Mode just asks "which label appears most often" — no arithmetic required, unlike mean or median',
            'Categorical data has no center at all',
            'Mode requires sorting the categories',
          ],
          answer: 1,
          why: "Mean needs addition and division; median needs an order to sort by. Mode just needs to count — which is why it's the only center measure that survives on pure labels.",
        },
        {
          q: 'A survey shows 70% satisfied, 20% neutral, 10% dissatisfied, from 10 total respondents. What is the main concern?',
          options: [
            'Nothing, the percentages are fine',
            'With only 10 respondents, each person is worth 10 percentage points — the sample is almost certainly too small to generalize confidently',
            'Percentages cannot be used with small samples',
            'The categories are wrong',
          ],
          answer: 1,
          why: 'Small samples make proportions jumpy — one or two different responses would swing the percentages a lot. A later tier gives you the tools to quantify exactly how uncertain a small-sample proportion really is.',
        },
      ]
    ),
    {
      id: 'stats-outliers-iqr',
      title: 'Outliers: finding and handling them',
      blurb: 'A rule of thumb for flagging unusual values, and the judgment calls after that.',
      kind: 'code',
      practice: {
        prompt:
          'Write `iqr_outliers(a)`: using the 1.5×IQR rule (an outlier is below `Q1 - 1.5*IQR` or above `Q3 + 1.5*IQR`), return a list of the values in `a` that are outliers, in their original order, as floats.',
        starter: 'import numpy as np\n\ndef iqr_outliers(a):\n    ...\n',
        solution:
          'import numpy as np\n\ndef iqr_outliers(a):\n    arr = np.asarray(a, dtype=float)\n    q1, q3 = np.percentile(arr, [25, 75])\n    iqr = q3 - q1\n    lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr\n    return [float(x) for x in a if x < lo or x > hi]',
        samples: ['iqr_outliers([10.0, 12.0, 11.0, 13.0, 12.0, 11.0, 90.0])'],
        cases: [
          ['One obvious high outlier', 'iqr_outliers([10.0, 12.0, 11.0, 13.0, 12.0, 11.0, 90.0])'],
          ['No outliers at all', 'iqr_outliers([10.0, 11.0, 12.0, 13.0, 14.0])'],
          ['Two outliers, in their original (unsorted) order', 'iqr_outliers([100.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, -50.0])'],
          ['A borderline value — only an outlier under a stricter 1x-IQR rule, not the correct 1.5x rule', 'iqr_outliers([10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 20.0])'],
        ],
        traps: [
          'import numpy as np\n\ndef iqr_outliers(a):\n    arr = np.asarray(a, dtype=float)\n    q1, q3 = np.percentile(arr, [25, 75])\n    iqr = q3 - q1\n    lo, hi = q1 - iqr, q3 + iqr\n    return [float(x) for x in a if x < lo or x > hi]',
          'import numpy as np\n\ndef iqr_outliers(a):\n    arr = np.asarray(a, dtype=float)\n    q1, q3 = np.percentile(arr, [25, 75])\n    iqr = q3 - q1\n    lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr\n    return sorted(float(x) for x in a if x < lo or x > hi)',
        ],
      },
    },
    learn(
      'stats-simpsons-paradox',
      "Simpson's paradox & misleading averages",
      'A trend that holds in every subgroup can reverse completely once the subgroups are combined.',
      [
        {
          q: "What is Simpson's paradox, in one sentence?",
          options: [
            'Averages are always wrong',
            'A trend that appears in each individual subgroup of data can disappear or reverse when the subgroups are combined into one overall average',
            'It only applies to medical data',
            'It means correlation equals causation',
          ],
          answer: 1,
          why: "The classic form: treatment A beats treatment B in every single patient subgroup, yet B looks better overall — because the subgroups were weighted very differently in size.",
        },
        {
          q: 'What usually causes Simpson\'s paradox to happen?',
          options: [
            'Random bad luck',
            'An uneven group size (a confounding variable) across the subgroups that gets hidden once you combine everything into one average',
            'Measurement error',
            'It is purely a mathematical impossibility and cannot really happen',
          ],
          answer: 1,
          why: "If one subgroup is much larger in one comparison group than the other, combining averages lets that imbalance dominate the overall number, even though every individual comparison went the other way.",
        },
        {
          q: 'What is the practical defense against being fooled by Simpson\'s paradox?',
          options: [
            'Never compute an overall average',
            'Always check whether the trend holds up when you break the data down by relevant subgroups, not just the combined total',
            'Only trust the largest subgroup',
            'Ignore subgroup data entirely',
          ],
          answer: 1,
          why: 'Before trusting an overall average or trend, slice the data by the categories that might be hiding unequal weighting, and check the trend still holds in each slice.',
        },
        {
          q: 'A company reports its overall customer satisfaction rose this year. What question does Simpson\'s paradox suggest you ask?',
          options: [
            'Nothing, trust the overall number',
            'Did the mix of customer types/regions change this year in a way that could make the combined number misleading, even if satisfaction fell in some actual segments?',
            'Is satisfaction even measurable?',
            'Is the company lying?',
          ],
          answer: 1,
          why: "If, say, a low-satisfaction segment shrank as a share of the total customer base, the overall average can rise even if satisfaction didn't actually improve anywhere.",
        },
        {
          q: 'Does Simpson\'s paradox mean averages and aggregated statistics are useless?',
          options: [
            'Yes, never trust an average',
            'No — it means an aggregated number is a starting point, and checking it against reasonable subgroup breakdowns is part of doing the analysis responsibly',
            'Yes, only raw data can be trusted',
            'No, subgroup breakdowns are never necessary',
          ],
          answer: 1,
          why: "Aggregates are useful summaries, not final verdicts. The fix isn't to distrust every average — it's to sanity-check it against the subgroups that might be driving it.",
        },
      ]
    ),
    {
      id: 'stats-workshop-explore-dataset',
      title: 'Tier workshop: explore a real dataset',
      blurb: 'Everything from this tier, computed together on one dataset.',
      kind: 'code',
      practice: {
        prompt:
          'Write `summarize(a)`: return a dict with keys `"mean"`, `"median"`, `"std"` (population, `ddof=0`), and `"outliers"` — the 1.5×IQR outliers of `a`, as a list — covering every measure from this tier in one pass.',
        starter: 'import numpy as np\n\ndef summarize(a):\n    ...\n',
        solution:
          'import numpy as np\n\ndef summarize(a):\n    arr = np.asarray(a, dtype=float)\n    q1, q3 = np.percentile(arr, [25, 75])\n    iqr = q3 - q1\n    lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr\n    return {\n        "mean": float(arr.mean()),\n        "median": float(np.median(arr)),\n        "std": float(arr.std()),\n        "outliers": [float(x) for x in a if x < lo or x > hi],\n    }',
        samples: ['summarize([12.0, 14.0, 15.0, 16.0, 18.0, 20.0, 95.0])'],
        cases: [
          ['A dataset with one clear outlier', 'summarize([12.0, 14.0, 15.0, 16.0, 18.0, 20.0, 95.0])'],
          ['A clean dataset with no outliers', 'summarize([5.0, 6.0, 7.0, 8.0, 9.0])'],
          ['A dataset with a low-side outlier', 'summarize([-80.0, 10.0, 11.0, 12.0, 13.0, 14.0])'],
        ],
        traps: [
          'import numpy as np\n\ndef summarize(a):\n    arr = np.asarray(a, dtype=float)\n    q1, q3 = np.percentile(arr, [25, 75])\n    iqr = q3 - q1\n    lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr\n    return {\n        "mean": float(arr.mean()),\n        "median": float(np.median(arr)),\n        "std": float(arr.std(ddof=1)),\n        "outliers": [float(x) for x in a if x < lo or x > hi],\n    }',
        ],
      },
    },
  ],
}
