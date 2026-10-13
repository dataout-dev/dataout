const learn = (id, title, blurb, check) => ({ id, title, blurb, kind: 'learn', check })

export const edaLessons = [
  learn(
    'eda-profiling-a-dataset',
    'Profiling a new dataset',
    'Before you ask any real question, answer three boring ones: how big is this, what types are these columns, and what does a row even look like?',
    [
      {
        q: 'What is the first thing worth checking when you open a dataset you have never seen before?',
        options: [
          'Its final conclusion',
          'Its shape (rows and columns), the data type of each column, and a few sample rows',
          'The most complex statistical test available',
          'Nothing — go straight to analysis',
        ],
        answer: 1,
        why: 'You cannot reason about a dataset you cannot picture — shape, dtypes and a handful of sample rows are the fastest way to build that picture.',
      },
      {
        q: 'A column meant to hold numbers loads as text (an "object" dtype in pandas). What does that usually signal?',
        options: [
          'Nothing, it is a coincidence',
          'Something in that column is not a clean number — a stray symbol, a sentinel value, or inconsistent formatting',
          'The file is corrupted beyond use',
          'pandas made an arbitrary choice',
        ],
        answer: 1,
        why: 'pandas infers a column\'s dtype from its actual contents. If even one row has "$1,200" or "?" mixed in with real numbers, the whole column falls back to text.',
      },
      {
        q: 'Why check `df.shape` before doing anything else?',
        options: [
          'It is required by Python syntax',
          'Knowing the row and column count anchors every later number — "200 missing" means something very different in 300 rows versus 300,000',
          'It fixes missing values automatically',
          'It has no real use',
        ],
        answer: 1,
        why: 'A count only means something relative to the total. Profiling shape first gives every later finding a denominator.',
      },
      {
        q: 'What is a reasonable first question to ask about a brand-new dataset?',
        options: [
          '"What is the most advanced model I can fit to this?"',
          '"What is each row? What is each column? And where is this data likely to be wrong or incomplete?"',
          '"How can I make a chart as fast as possible?"',
          'There is no useful first question — just start computing',
        ],
        answer: 1,
        why: 'Understanding the grain of the data (what one row represents) and where it is likely to be messy shapes every decision that follows.',
      },
      {
        q: 'Why does this path start with profiling before anything about missing values, duplicates or outliers specifically?',
        options: [
          'It does not matter what order these come in',
          'Each later skill (finding missingness, duplicates, outliers) is really just a more targeted follow-up question once you already know the shape and types',
          'Profiling replaces the need for the other three skills entirely',
          'This lesson is just filler',
        ],
        answer: 1,
        why: 'Missingness, duplicates and outliers are all things you look FOR once you know what a clean row should look like — profiling is what tells you that.',
      },
    ]
  ),
  {
    id: 'eda-finding-missingness',
    title: 'Finding and understanding missingness',
    blurb: 'Not all missing data looks like NaN. Some of it is hiding in plain sight as a normal-looking value.',
    kind: 'code',
    practice: {
      prompt:
        'Write `missing_report(rows, sentinels)`: given a list of dicts `rows` and a list of extra "sentinel" strings that should also count as missing (e.g. `["?", "N/A", ""]`), return a dict mapping each key present in the rows to the count of values that are `None` OR equal to one of `sentinels`.',
      starter: 'def missing_report(rows, sentinels):\n    ...\n',
      solution:
        'def missing_report(rows, sentinels):\n    counts = {}\n    sentinel_set = set(sentinels)\n    for row in rows:\n        for key, value in row.items():\n            counts.setdefault(key, 0)\n            if value is None or value in sentinel_set:\n                counts[key] += 1\n    return counts',
      samples: ['missing_report([{"a": 1, "b": "?"}, {"a": None, "b": "x"}], ["?"])'],
      cases: [
        ['A simple two-row case', 'missing_report([{"a": 1, "b": "?"}, {"a": None, "b": "x"}], ["?"])'],
        ['No sentinels given, only None counts', 'missing_report([{"a": None, "b": 1}, {"a": 2, "b": None}], [])'],
        ['Multiple sentinel values', 'missing_report([{"a": "N/A"}, {"a": ""}, {"a": "ok"}], ["N/A", ""])'],
      ],
      traps: [
        'def missing_report(rows, sentinels):\n    counts = {}\n    sentinel_set = set(sentinels)\n    for row in rows:\n        for key, value in row.items():\n            counts.setdefault(key, 0)\n            if value is None:\n                counts[key] += 1\n    return counts',
      ],
    },
  },
  {
    id: 'eda-duplicates-inconsistent-categories',
    title: 'Finding duplicates and inconsistent categories',
    blurb: 'The same real-world thing can show up twice in your data — or the same category can be spelled three different ways.',
    kind: 'code',
    practice: {
      prompt:
        'Write `normalize_category(values)`: given a list of category strings that may differ only in case or surrounding whitespace (e.g. `"Gold"`, `" gold "`, `"GOLD"`), return a new list where each value is lowercased and stripped of leading/trailing whitespace, preserving order.',
      starter: 'def normalize_category(values):\n    ...\n',
      solution: 'def normalize_category(values):\n    return [v.strip().lower() for v in values]',
      samples: ['normalize_category(["Gold", " gold ", "GOLD", "Silver"])'],
      cases: [
        ['Mixed case and whitespace', 'normalize_category(["Gold", " gold ", "GOLD", "Silver"])'],
        ['Already clean', 'normalize_category(["a", "b", "c"])'],
        ['Tabs and newlines as whitespace too', 'normalize_category(["\\tBronze\\n", "bronze"])'],
      ],
      traps: ['def normalize_category(values):\n    return [v.lower() for v in values]'],
    },
  },
  {
    id: 'eda-outliers-type-problems',
    title: 'Spotting outliers and type problems',
    blurb: 'A price stored as "$1,200.00" is not a number yet. An outlier is not automatically an error.',
    kind: 'code',
    practice: {
      prompt:
        'Write `parse_price(values)`: given a list of price strings like `"$1,200.00"`, return a list of floats with the dollar sign and thousands commas removed (e.g. `"$1,200.00"` becomes `1200.0`). Values that are `None` should stay `None`.',
      starter: 'def parse_price(values):\n    ...\n',
      solution:
        'def parse_price(values):\n    result = []\n    for v in values:\n        if v is None:\n            result.append(None)\n        else:\n            result.append(float(v.replace("$", "").replace(",", "")))\n    return result',
      samples: ['parse_price(["$1,200.00", "$80.00", None])'],
      cases: [
        ['A mix of thousands and plain values', 'parse_price(["$1,200.00", "$80.00", None])'],
        ['No commas needed', 'parse_price(["$5.50", "$10.00"])'],
        ['A larger value', 'parse_price(["$12,345.67"])'],
      ],
      traps: ['def parse_price(values):\n    return [float(v.replace("$", "")) if v is not None else None for v in values]'],
    },
  },
  learn(
    'eda-visualizing-to-ask-questions',
    'Visualizing distributions and relationships to ask better questions',
    'A chart is not the end of an analysis — it is usually where the real questions start.',
    [
      {
        q: 'Why draw a histogram of a numeric column before computing its mean?',
        options: [
          'It is not actually useful',
          'The shape (skewed, bimodal, normal) changes how you should interpret — or even whether you should trust — a single summary number like the mean',
          'Histograms replace the need for any further analysis',
          'It is only useful for categorical data',
        ],
        answer: 1,
        why: 'This directly echoes the Statistics path\'s descriptive-statistics tier: shape changes what a single number like "the mean" is even telling you.',
      },
      {
        q: 'You plot two numeric columns on a scatter plot and see a clear curved (not straight-line) pattern. What does that suggest?',
        options: [
          'The two columns are definitely unrelated',
          'There is a real relationship, but a plain correlation coefficient (which only measures LINEAR association) might understate or miss it',
          'The chart is broken',
          'You should delete one of the columns',
        ],
        answer: 1,
        why: 'Seeing the shape directly, rather than jumping straight to a single correlation number, is exactly why visualizing comes before (or alongside) summarizing.',
      },
      {
        q: 'What is a reasonable way to use a visualization to find the next QUESTION, not just the next chart?',
        options: [
          'Make the chart as colorful as possible',
          'Look for anything in the chart that surprises you — an unexpected cluster, a gap, an outlier group — and ask "why does that happen?"',
          'Charts cannot generate new questions, only answer old ones',
          'Always use a pie chart regardless of the data',
        ],
        answer: 1,
        why: 'The most useful visualizations during exploration are the ones that make you go "wait, why does THAT happen" — that reaction is the engine of real EDA.',
      },
      {
        q: 'Why visualize a categorical column\'s value counts (a bar chart) before building, say, a model that uses that category?',
        options: [
          'There is no reason to',
          'To catch inconsistent or rare categories (typos, near-duplicate labels, a category with almost no rows) before they quietly distort anything built on top of them',
          'Bar charts are only decorative',
          'Categorical columns cannot be visualized',
        ],
        answer: 1,
        why: 'This is where the earlier lesson on inconsistent categories pays off visually — a bar chart with ten near-identical bars is often the fastest way to spot them.',
      },
      {
        q: 'How does this lesson connect to the separate Statistics for Data Analysis path on this site?',
        options: [
          'It does not connect at all',
          'The visual intuition for distributions, relationships and "what looks surprising" built there is exactly what you are applying here, now on real, messy, previously-unseen data',
          'This lesson replaces the need for that path',
          'They cover completely unrelated topics',
        ],
        answer: 1,
        why: 'This EDA section assumes and reuses that intuition rather than re-teaching it — it is about applying it to real, messy data you have not already been handed a clean version of.',
      },
    ]
  ),
]
