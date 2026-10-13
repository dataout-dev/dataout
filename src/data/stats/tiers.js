export const statsTiers = [
  {
    id: 'descriptive',
    number: 1,
    name: 'Descriptive Statistics',
    tagline: 'Mean, median, spread, shape, and outliers — the vocabulary for describing any dataset.',
    audience: 'No stats background needed. Every idea starts with a picture, not a formula.',
    color: '#e6dcf3',
    entry: true,
    openLessons: true,
    examPassPercent: 70,
  },
  {
    id: 'probability',
    number: 2,
    name: 'Probability & Distributions',
    tagline: 'Why randomness has shape, and why the Central Limit Theorem runs the whole show.',
    audience: 'Finish Descriptive Statistics and pass its exam to unlock this tier.',
    color: '#d7e8f0',
    examPassPercent: 70,
  },
  {
    id: 'inferential',
    number: 3,
    name: 'Inferential Statistics',
    tagline: 'Confidence intervals, p-values, and hypothesis tests — and what they actually mean.',
    audience: 'Finish Probability & Distributions and pass its exam to unlock this tier.',
    color: '#f4e2d0',
    examPassPercent: 70,
  },
  {
    id: 'relationships',
    number: 4,
    name: 'Relationships & Real-World Analysis',
    tagline: 'Correlation, regression, group comparisons, and the fallacies that trip up real analysis.',
    audience: 'Finish Inferential Statistics and pass its exam to unlock this tier.',
    color: '#f6dccb',
    examPassPercent: 70,
  },
]

export const statsTierById = Object.fromEntries(statsTiers.map((t) => [t.id, t]))
