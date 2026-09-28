import { pdf, py } from './common.js'

export const pandasLessonsD = [
  {
    id: 'py-data-cleaning-workflow',
    title: 'The data cleaning workflow',
    blurb: 'Profiling data first, standardising columns and types, and documenting decisions.',
    kind: 'learn',
    check: [
      {
        q: 'Why profile a new dataset (shape, dtypes, missing values, obvious outliers) before writing any cleaning code?',
        options: [
          'It is not necessary; cleaning steps are the same for every dataset',
          'It reveals what actually needs fixing, so cleaning steps target real problems instead of guesses',
          'It permanently changes the data',
          'It only matters for very large files',
        ],
        answer: 1,
        why: 'Cleaning without first looking at the data risks fixing problems that do not exist and missing ones that do. A quick profile (`.info()`, `.describe()`, `.isna().sum()`) grounds every decision that follows.',
      },
      {
        q: 'Why keep a raw, untouched copy of the data alongside the cleaned version?',
        options: [
          'It wastes disk space for no reason',
          "If a cleaning decision later turns out to be wrong, you can redo it from the original data instead of from an already-damaged copy",
          'pandas requires two copies of every dataset',
          'It makes the file load faster',
        ],
        answer: 1,
        why: 'A cleaning step that turns out to be a mistake (a wrong assumption about a date format, an overly aggressive `dropna`) is only recoverable if the original data is still there, untouched.',
      },
      {
        q: 'What does "standardising column names and types early" make easier later?',
        options: [
          'Nothing; it is purely cosmetic',
          "Every later step (filtering, joining, grouping) can rely on consistent names and types, instead of re-discovering inconsistencies each time",
          'It automatically removes missing values',
          'It is only useful for column names, never types',
        ],
        answer: 1,
        why: 'Inconsistent casing, spacing, or types (a numeric-looking column stored as text, say) cause repeated small frictions throughout an analysis; fixing them once, early, pays off every time after.',
      },
      {
        q: 'What is the risk of a cleaning script that silently drops rows, with no record of how many or why?',
        options: [
          'There is no risk; fewer rows is always safer',
          "Silent row loss can quietly bias an analysis (for example, dropping every row with a missing value can remove a disproportionate share of one group), with nothing to reveal it happened",
          'pandas prevents rows from ever being dropped silently',
          'It only matters for datasets over a million rows',
        ],
        answer: 1,
        why: 'A dropped row is not automatically an error, but doing it without noticing (or logging) how many, and from where, makes it impossible to catch a real problem later.',
      },
      {
        q: 'Why write cleaning steps as a reproducible script (or notebook run top to bottom) rather than one-off edits typed at a prompt?',
        options: [
          'A script is not actually more reliable than manual edits',
          "A script can be re-run exactly, reviewed, and applied again when the raw data is refreshed; one-off manual edits are invisible and cannot be repeated reliably",
          'Manual edits are always faster and equally safe',
          'Only because it looks more professional',
        ],
        answer: 1,
        why: 'A reproducible cleaning script documents itself, can be reviewed like any other code, and produces the same result again the next time the same raw data needs cleaning.',
      },
    ],
  },
  {
    id: 'py-method-chaining-pipe',
    title: 'Method chaining, pipe and readable pipelines',
    blurb: 'assign, query, pipe and sort_values in one chain, and writing custom pipe steps.',
    kind: 'code',
    practice: {
      prompt: 'Write `pipeline(df)`: a **single chained expression** starting from `df` (with `dep_delay` and `carrier` columns) that drops rows with a missing `dep_delay`, adds a boolean `late` column (`dep_delay > 15`), then returns the **fraction** of `late` flights per carrier, rounded to 3 decimals, worst first.',
      starter: 'import pandas as pd\n\ndef pipeline(df):\n    ...\n',
      solution: py`import pandas as pd

def pipeline(df):
    return (
        df
        .dropna(subset=["dep_delay"])
        .assign(late=lambda d: d["dep_delay"] > 15)
        .groupby("carrier")["late"]
        .mean()
        .round(3)
        .sort_values(ascending=False)
    )`,
      samples: ['list(pipeline(pd.DataFrame({"carrier": ["A", "A", "B"], "dep_delay": [20.0, 5.0, 30.0]})).items())'],
      cases: [
        ['A small frame', 'list(pipeline(pd.DataFrame({"carrier": ["A", "A", "B"], "dep_delay": [20.0, 5.0, 30.0]})).items())'],
        ['A missing delay is dropped, not counted', 'list(pipeline(pd.DataFrame({"carrier": ["A", "A"], "dep_delay": [20.0, None]})).items())'],
        ['Worst carrier first', 'list(pipeline(pd.DataFrame({"carrier": ["A", "B", "B"], "dep_delay": [5.0, 20.0, 20.0]})).index)'],
      ],
      traps: [
        py`import pandas as pd

def pipeline(df):
    return (
        df
        .assign(late=lambda d: d["dep_delay"] > 15)
        .groupby("carrier")["late"]
        .mean()
        .round(3)
        .sort_values(ascending=False)
    )`,
        py`import pandas as pd

def pipeline(df):
    return (
        df
        .dropna(subset=["dep_delay"])
        .assign(late=lambda d: d["dep_delay"] > 15)
        .groupby("carrier")["late"]
        .mean()
        .round(3)
        .sort_values(ascending=True)
    )`,
      ],
    },
    real: [
      pdf({
        title: 'Chaining a delay pipeline on real flights',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Write a single chained expression: drop missing `dep_delay`, add `late` (`dep_delay > 15`), group by `origin`, and take the mean of `late`, rounded to 3 decimals. Store the result as a dict in `answer`.',
        reference: py`answer = (
    flights
    .dropna(subset=["dep_delay"])
    .assign(late=lambda d: d["dep_delay"] > 15)
    .groupby("origin")["late"]
    .mean()
    .round(3)
    .to_dict()
)`,
        walkthrough: 'Each step in the chain takes the previous result and transforms it, reading top to bottom in the same order the computation actually happens.',
        traps: [py`answer = (
    flights
    .assign(late=lambda d: d["dep_delay"] > 15)
    .groupby("origin")["late"]
    .mean()
    .round(3)
    .to_dict()
)`],
      }),
      pdf({
        title: 'A custom pipe step',
        use: ['flights'],
        starter: 'def add_speed(d):\n    return d.assign(speed=(d["distance"] / d["air_time"] * 60).round(1))\n\nanswer = ...\n',
        given: '# flights is already a DataFrame. add_speed is a plain function taking and returning a DataFrame.',
        brief: 'Using `.pipe(add_speed)` inside a chain, add the speed column, then compute the mean speed, ignoring missing values, rounded to 2 decimals. Store it in `answer`.',
        reference: py`def add_speed(d):
    return d.assign(speed=(d["distance"] / d["air_time"] * 60).round(1))

answer = round(float(flights.pipe(add_speed)["speed"].mean()), 2)`,
        walkthrough: '`.pipe(func)` calls `func(current_frame)`, which lets a custom function join a method chain exactly as if it were a built-in method.',
        traps: [py`def add_speed(d):
    return d.assign(speed=(d["air_time"] / d["distance"] * 60).round(1))

answer = round(float(flights.pipe(add_speed)["speed"].mean()), 2)`],
      }),
      pdf({
        title: 'A full chain from raw rows to a ranked summary',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: "Chain: keep only `origin == \"JFK\"`, drop missing `arr_delay`, group by `carrier`, take the mean `arr_delay` rounded to 1 decimal, and sort ascending (best first). Store the **best** carrier's name, as a plain string, in `answer`.",
        reference: py`best = (
    flights
    .query('origin == "JFK"')
    .dropna(subset=["arr_delay"])
    .groupby("carrier")["arr_delay"]
    .mean()
    .round(1)
    .sort_values()
)
answer = str(best.index[0])`,
        walkthrough: "Sorting ascending puts the smallest (least delayed, so \"best\") average first, and `.index[0]` names that top row's carrier.",
        traps: [py`best = (
    flights
    .query('origin == "JFK"')
    .dropna(subset=["arr_delay"])
    .groupby("carrier")["arr_delay"]
    .mean()
    .round(1)
    .sort_values(ascending=False)
)
answer = str(best.index[0])`],
      }),
    ],
  },
  {
    id: 'py-pandas-performance',
    title: 'pandas performance: dtypes, vectorising, chunking and copy-on-write',
    blurb: 'memory_usage, avoiding apply/iterrows, chunked reading, and Arrow-backed speedups.',
    kind: 'learn',
    check: [
      {
        q: 'Why does `df.iterrows()` tend to be one of the slowest ways to process a DataFrame?',
        options: [
          'It is actually the fastest option available',
          'It rebuilds a Series object for every single row, paying real overhead on each iteration, when a vectorised column operation could process the whole column at once',
          'iterrows is not a real pandas method',
          'It only works on very small frames',
        ],
        answer: 1,
        why: 'Vectorised operations run in one compiled pass over a whole column; `iterrows()` recreates Python objects row by row, which adds up fast on real-sized data.',
      },
      {
        q: 'How does converting a repeated-value text column to `category` typically help performance?',
        options: [
          'It changes the values themselves',
          'It stores each distinct value once and refers to it by a small integer code, reducing memory and speeding up grouping and comparisons',
          'It has no effect on performance, only appearance',
          'It converts the column to numbers, losing the text permanently',
        ],
        answer: 1,
        why: 'Repeated values (a country, a status flag) waste memory as full text every time; `category` stores each distinct value once and reuses a compact code, which also speeds up equality checks and grouping.',
      },
      {
        q: 'When is `chunksize=` on `read_csv` worth using?',
        options: [
          'Always, for every file, regardless of size',
          'When a file is too large to comfortably fit in memory at once, so it can be processed (e.g. aggregated) piece by piece',
          'Only for JSON files, never CSV',
          'It has no effect on memory use',
        ],
        answer: 1,
        why: '`chunksize=` turns `read_csv` into an iterator of smaller frames, letting you stream through a file larger than available memory instead of loading it all at once.',
      },
      {
        q: 'What does "copy-on-write" mode change about how pandas handles a filtered view of a DataFrame?',
        options: [
          'It makes every operation slower with no benefit',
          "It makes the safe behaviour (a filtered copy never silently affects the original) the guaranteed default, without needing to reason about whether a specific operation returns a view or a copy",
          'It disables filtering entirely',
          'It only applies to numeric columns',
        ],
        answer: 1,
        why: 'Copy-on-write removes a whole class of "did that operation return a view or a copy?" uncertainty, making the safe, non-mutating behaviour consistent everywhere.',
      },
      {
        q: 'Why can Arrow-backed string columns be faster than the traditional NumPy-object-backed ones?',
        options: [
          'They are not actually faster; the name is just newer',
          "Arrow stores strings in a compact, columnar layout designed for exactly this, avoiding the overhead of a NumPy object array holding one separate Python string per cell",
          'They only work with numbers, not real text',
          'They require rewriting all existing pandas code from scratch',
        ],
        answer: 1,
        why: "A NumPy object array of strings is really an array of pointers to separate Python string objects; Arrow's native string representation avoids that indirection and overhead.",
      },
    ],
  },
  {
    id: 'py-data-validation',
    title: 'Data validation and quality checks',
    blurb: 'Assertions on frames, uniqueness/range/referential checks, and failing loudly.',
    kind: 'code',
    practice: {
      prompt: "Write `validate(df)`: given columns `id`, `air_time`, return a list of problem descriptions found (any of `\"nulls in id\"`, `\"negative air_time\"`, `\"duplicate ids\"`), in that order, only including the ones that actually apply.",
      starter: 'import pandas as pd\n\ndef validate(df):\n    ...\n',
      solution: py`import pandas as pd

def validate(df):
    problems = []
    if df["id"].isna().any():
        problems.append("nulls in id")
    if (df["air_time"].dropna() < 0).any():
        problems.append("negative air_time")
    if df["id"].duplicated().any():
        problems.append("duplicate ids")
    return problems`,
      samples: ['validate(pd.DataFrame({"id": [1, 2, 3], "air_time": [10, 20, 30]}))'],
      cases: [
        ['A clean frame has no problems', 'validate(pd.DataFrame({"id": [1, 2, 3], "air_time": [10, 20, 30]}))'],
        ['A null id', 'validate(pd.DataFrame({"id": [1, None, 3], "air_time": [10, 20, 30]}))'],
        ['A negative air_time', 'validate(pd.DataFrame({"id": [1, 2], "air_time": [10, -5]}))'],
        ['A duplicate id', 'validate(pd.DataFrame({"id": [1, 1, 2], "air_time": [10, 20, 30]}))'],
        ['Two problems at once, in order', 'validate(pd.DataFrame({"id": [1, None], "air_time": [-5, 10]}))'],
      ],
      traps: [
        py`import pandas as pd

def validate(df):
    problems = []
    if df["id"].isna().any():
        problems.append("nulls in id")
    if (df["air_time"] < 0).any():
        problems.append("negative air_time")
    return problems`,
        py`import pandas as pd

def validate(df):
    problems = []
    if df["id"].isna().any():
        problems.append("nulls in id")
    if (df["air_time"].dropna() < 0).any():
        problems.append("negative air_time")
    if df["air_time"].duplicated().any():
        problems.append("duplicate ids")
    return problems`,
        py`import pandas as pd

def validate(df):
    problems = []
    if df["id"].duplicated().any():
        problems.append("duplicate ids")
    if (df["air_time"].dropna() < 0).any():
        problems.append("negative air_time")
    if df["id"].isna().any():
        problems.append("nulls in id")
    return problems`,
      ],
    },
    real: [
      pdf({
        title: 'Validating a sample of real flights',
        use: ['flights'],
        starter: 'sample = flights.head(20).copy()\nsample.loc[3, "distance"] = -100\nanswer = ...\n',
        given: '# flights is already a DataFrame. sample deliberately corrupts one row\'s distance to be negative.',
        brief: 'Check `sample` for any row with a negative `distance`. Store the count of such rows, as an `int`, in `answer`.',
        reference: py`sample = flights.head(20).copy()
sample.loc[3, "distance"] = -100
answer = int((sample["distance"] < 0).sum())`,
        walkthrough: 'A validation check like this is just a boolean mask and a count — simple, but it catches exactly the kind of data-entry mistake that would otherwise pass through silently.',
        traps: [py`sample = flights.head(20).copy()
sample.loc[3, "distance"] = -100
answer = int((sample["air_time"] < 0).sum())`],
      }),
      pdf({
        title: 'Checking for duplicate flight records',
        use: ['flights'],
        starter: 'sample = pd.concat([flights.head(10), flights.head(1)], ignore_index=True)\nanswer = ...\n',
        given: '# flights is already a DataFrame. sample deliberately repeats the very first row at the end.',
        brief: 'Check `sample` for fully duplicated rows (every column identical). Store the count, as an `int`, in `answer`.',
        reference: py`sample = pd.concat([flights.head(10), flights.head(1)], ignore_index=True)
answer = int(sample.duplicated().sum())`,
        walkthrough: '`.duplicated()` with no arguments compares **every** column; the repeated first row is flagged, and everything else is not.',
        traps: [py`sample = pd.concat([flights.head(10), flights.head(1)], ignore_index=True)
answer = int(sample.duplicated(keep=False).sum())`],
      }),
      pdf({
        title: 'A referential check against a lookup table',
        use: ['flights', 'airlines'],
        starter: 'sample = pd.concat([flights[["carrier"]].head(10), pd.DataFrame({"carrier": ["ZZ"]})], ignore_index=True)\nanswer = ...\n',
        given: '# flights and airlines are already DataFrames. sample adds one made-up, unknown carrier code.',
        brief: "Check that every `carrier` in `sample` actually exists in `airlines`. Store the list of unknown carrier codes (as plain strings) in `answer`.",
        reference: py`sample = pd.concat([flights[["carrier"]].head(10), pd.DataFrame({"carrier": ["ZZ"]})], ignore_index=True)
known = set(airlines["carrier"])
unknown = sample.loc[~sample["carrier"].isin(known), "carrier"].unique()
answer = sorted(str(c) for c in unknown)`,
        walkthrough: 'This is a **referential** integrity check: every value in one column should exist somewhere in another table, exactly the kind of thing a foreign key enforces in a real database.',
        traps: [py`sample = pd.concat([flights[["carrier"]].head(10), pd.DataFrame({"carrier": ["ZZ"]})], ignore_index=True)
known = set(airlines["carrier"])
unknown = sample.loc[sample["carrier"].isin(known), "carrier"].unique()
answer = sorted(str(c) for c in unknown)`],
      }),
    ],
  },
  {
    id: 'py-time-series-workshop',
    title: 'Time series workshop',
    blurb: 'Building a DatetimeIndex, resampling, rolling trends, and seasonality by hour or weekday.',
    kind: 'code',
    practice: {
      prompt: 'Write `busiest_day(df)`: given a column `ts` of real timestamps (one row per event), resample to daily counts and return the busiest date as a string (`"YYYY-MM-DD"`).',
      starter: 'import pandas as pd\n\ndef busiest_day(df):\n    ...\n',
      solution: py`import pandas as pd

def busiest_day(df):
    counts = pd.to_datetime(df["ts"]).dt.floor("D").value_counts()
    return str(counts.idxmax().date())`,
      samples: ['busiest_day(pd.DataFrame({"ts": ["2024-01-01 08:00", "2024-01-01 09:00", "2024-01-02 10:00"]}))'],
      cases: [
        ['One day is clearly busiest', 'busiest_day(pd.DataFrame({"ts": ["2024-01-01 08:00", "2024-01-01 09:00", "2024-01-02 10:00"]}))'],
        ['Ties broken by first occurrence in a sorted count', 'busiest_day(pd.DataFrame({"ts": ["2024-02-01 08:00"]}))'],
        ['Several events on the busiest day', 'busiest_day(pd.DataFrame({"ts": ["2024-03-01 01:00", "2024-03-01 02:00", "2024-03-01 03:00", "2024-03-02 01:00"]}))'],
      ],
      traps: [
        py`import pandas as pd

def busiest_day(df):
    counts = pd.to_datetime(df["ts"]).dt.floor("D").value_counts()
    return str(counts.idxmin().date())`,
        py`import pandas as pd

def busiest_day(df):
    counts = pd.to_datetime(df["ts"]).dt.floor("H").value_counts()
    return str(counts.idxmax())`,
      ],
    },
    real: [
      pdf({
        title: 'Daily flight counts',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Group by `flight_date` and find the busiest single day. Store the date as a string in `answer`.',
        reference: py`counts = flights.groupby("flight_date").size()
answer = str(counts.idxmax())`,
        walkthrough: 'Since `flight_date` is already one value per day, grouping and counting rows finds the busiest day directly, without needing a full `resample`.',
        traps: [py`counts = flights.groupby("flight_date").size()
answer = str(counts.idxmin())`],
      }),
      pdf({
        title: 'Weather versus delays, joined by date and hour',
        use: ['flights', 'weather'],
        starter: 'answer = ...\n',
        given: '# flights and weather are already DataFrames.',
        brief: "Join `flights` with `weather` on `[\"origin\", \"month\", \"day\", \"hour\"]`, then compute the correlation between `dep_delay` and `precip`, rounded to 3 decimals. Store it in `answer`.",
        reference: py`joined = flights.merge(weather, on=["origin", "month", "day", "hour"], how="inner")
answer = round(float(joined["dep_delay"].corr(joined["precip"])), 3)`,
        walkthrough: 'Correlating two columns of the same joined frame is a natural first question once weather and flight records share a key to join on.',
        traps: [py`joined = flights.merge(weather, on=["origin", "month", "day", "hour"], how="inner")
answer = round(float(joined["dep_delay"].corr(joined["wind_speed"])), 3)`],
      }),
      pdf({
        title: 'Monthly Spotify release counts',
        use: ['songs'],
        starter: 'answer = ...\n',
        given: '# songs is already a DataFrame.',
        brief: 'Parse `release_date`, group by month (`.dt.to_period("M")`), and find the month with the **most** releases. Store it as a string in `answer`.',
        reference: py`months = pd.to_datetime(songs["release_date"], errors="coerce").dt.to_period("M")
counts = months.value_counts()
answer = str(counts.idxmax())`,
        walkthrough: '`errors="coerce"` turns any unparseable date into `NaT` instead of raising, which `value_counts()` then simply ignores.',
        traps: [py`months = pd.to_datetime(songs["release_date"], errors="coerce").dt.to_period("M")
counts = months.value_counts()
answer = str(counts.idxmin())`],
      }),
    ],
  },
  {
    id: 'py-pandas-workshop-end-to-end',
    title: 'pandas workshop: an end-to-end analysis',
    blurb: 'Load, clean, join and aggregate real tables, and verify the result.',
    kind: 'code',
    practice: {
      prompt: 'Write `worst_routes(flights)`: given columns `origin`, `dest`, `arr_delay`, return the 10 `(origin, dest)` routes with the **worst average `arr_delay`**, considering only routes with **at least 200 flights**, worst first, as a list of `((origin, dest), avg_delay)` tuples, `avg_delay` rounded to 1 decimal.',
      starter: 'import pandas as pd\n\ndef worst_routes(flights):\n    ...\n',
      solution: py`import pandas as pd

def worst_routes(flights):
    by_route = flights.dropna(subset=["arr_delay"]).groupby(["origin", "dest"])["arr_delay"]
    counted = by_route.count()
    averaged = by_route.mean().round(1)
    eligible = averaged[counted >= 200].sort_values(ascending=False)
    return list(eligible.head(10).items())`,
      samples: ['len(worst_routes(pd.DataFrame({"origin": ["A"] * 250, "dest": ["B"] * 250, "arr_delay": [10.0] * 250})))'],
      cases: [
        ['A route with enough flights qualifies', 'worst_routes(pd.DataFrame({"origin": ["A"] * 250, "dest": ["B"] * 250, "arr_delay": [10.0] * 250}))'],
        ['A route with too few flights is excluded', 'worst_routes(pd.DataFrame({"origin": ["A"] * 5, "dest": ["B"] * 5, "arr_delay": [999.0] * 5}))'],
        ['Worst first among eligible routes', 'worst_routes(pd.DataFrame({"origin": ["A"] * 200 + ["C"] * 200, "dest": ["B"] * 200 + ["D"] * 200, "arr_delay": [5.0] * 200 + [50.0] * 200}))'],
        ['At most 10 routes', 'len(worst_routes(pd.DataFrame({"origin": [f"O{i}" for i in range(15) for _ in range(200)], "dest": ["X"] * 3000, "arr_delay": [float(i) for i in range(15) for _ in range(200)]})))'],
      ],
      traps: [
        py`import pandas as pd

def worst_routes(flights):
    by_route = flights.dropna(subset=["arr_delay"]).groupby(["origin", "dest"])["arr_delay"]
    averaged = by_route.mean().round(1).sort_values(ascending=False)
    return list(averaged.head(10).items())`,
        py`import pandas as pd

def worst_routes(flights):
    by_route = flights.dropna(subset=["arr_delay"]).groupby(["origin", "dest"])["arr_delay"]
    counted = by_route.count()
    averaged = by_route.mean().round(1)
    eligible = averaged[counted >= 200].sort_values(ascending=True)
    return list(eligible.head(10).items())`,
      ],
    },
    real: [
      pdf({
        title: 'The ten worst real routes',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Using the same logic as the practice, find the worst route (by average `arr_delay`, at least 200 flights). Store `(origin, dest)` as a tuple of strings in `answer`.',
        reference: py`by_route = flights.dropna(subset=["arr_delay"]).groupby(["origin", "dest"])["arr_delay"]
counted = by_route.count()
averaged = by_route.mean()
eligible = averaged[counted >= 200].sort_values(ascending=False)
answer = tuple(str(x) for x in eligible.index[0])`,
        walkthrough: 'Filtering by `counted >= 200` before sorting keeps the ranking from being dominated by a route with just a handful of unlucky flights.',
        traps: [py`by_route = flights.dropna(subset=["arr_delay"]).groupby(["origin", "dest"])["arr_delay"]
averaged = by_route.mean().sort_values(ascending=False)
answer = tuple(str(x) for x in averaged.index[0])`],
      }),
      pdf({
        title: 'Verifying the result against a manual filter',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'As a sanity check, count how many distinct `(origin, dest)` routes have **at least 200** non-missing-delay flights at all. Store the count as an `int` in `answer`.',
        reference: py`counted = flights.dropna(subset=["arr_delay"]).groupby(["origin", "dest"])["arr_delay"].count()
answer = int((counted >= 200).sum())`,
        walkthrough: 'A quick, independent count like this is exactly the kind of sanity check worth running before trusting a bigger analysis\'s output.',
        traps: [py`counted = flights.dropna(subset=["arr_delay"]).groupby(["origin", "dest"])["arr_delay"].count()
answer = int((counted >= 2000).sum())`],
      }),
      pdf({
        title: 'The single best route, by the same rule',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Among routes with at least 200 flights, find the one with the **lowest** (best) average `arr_delay`. Store `(origin, dest)` as a tuple of strings in `answer`.',
        reference: py`by_route = flights.dropna(subset=["arr_delay"]).groupby(["origin", "dest"])["arr_delay"]
counted = by_route.count()
averaged = by_route.mean()
eligible = averaged[counted >= 200].sort_values(ascending=True)
answer = tuple(str(x) for x in eligible.index[0])`,
        walkthrough: 'The same eligibility filter, just sorted the other way, finds the best route instead of the worst.',
        traps: [py`by_route = flights.dropna(subset=["arr_delay"]).groupby(["origin", "dest"])["arr_delay"]
averaged = by_route.mean().sort_values(ascending=True)
answer = tuple(str(x) for x in averaged.index[0])`],
      }),
    ],
  },
]
