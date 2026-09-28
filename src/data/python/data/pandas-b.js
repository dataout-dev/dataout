import { dat, pdf, py } from './common.js'

export const pandasLessonsB = [
  {
    id: 'py-sorting-ranking-duplicates',
    title: 'Sorting, ranking, top-N and duplicates',
    blurb: 'sort_values with multiple keys, nlargest/nsmallest, and duplicated/drop_duplicates.',
    kind: 'code',
    practice: {
      prompt: 'Write `top_n(df, col, n)`: return the `n` rows of `df` with the largest value in `col`, largest first.',
      starter: 'import pandas as pd\n\ndef top_n(df, col, n):\n    ...\n',
      solution: py`import pandas as pd

def top_n(df, col, n):
    return df.sort_values(col, ascending=False).head(n)`,
      samples: ['top_n(pd.DataFrame({"score": [50, 90, 70, 30]}), "score", 2).to_dict("records")'],
      cases: [
        ['Top 2 of 4', 'top_n(pd.DataFrame({"score": [50, 90, 70, 30]}), "score", 2).to_dict("records")'],
        ['Top 1', 'top_n(pd.DataFrame({"score": [50, 90, 70, 30]}), "score", 1).to_dict("records")'],
        ['n equals the row count', 'top_n(pd.DataFrame({"score": [50, 90, 70]}), "score", 3)["score"].tolist()'],
        ['A different column', 'top_n(pd.DataFrame({"a": [1, 2, 3], "b": [30, 10, 20]}), "b", 2)["a"].tolist()'],
      ],
      traps: [
        py`import pandas as pd

def top_n(df, col, n):
    return df.sort_values(col).head(n)`,
        py`import pandas as pd

def top_n(df, col, n):
    return df.sort_values(col, ascending=False).head(n + 1)`,
        py`import pandas as pd

def top_n(df, col, n):
    return df.head(n)`,
      ],
    },
    real: [
      pdf({
        title: 'The 5 longest tracks',
        use: ['tracks'],
        starter: 'answer = ...\n',
        given: '# tracks is already a DataFrame.',
        brief: 'Using `.nlargest`, return the 5 tracks with the longest `Milliseconds`, as a list of names, in `answer`.',
        reference: py`answer = tracks.nlargest(5, "Milliseconds")["Name"].tolist()`,
        walkthrough: '`.nlargest(n, col)` is a shortcut for sorting descending by `col` and taking the top `n`, without building the whole sorted frame first.',
        traps: [py`answer = tracks.nsmallest(5, "Milliseconds")["Name"].tolist()`],
      }),
      pdf({
        title: 'Top 3 songs by streams',
        use: ['songs'],
        starter: 'answer = ...\n',
        given: '# songs is already a DataFrame.',
        brief: 'Return the 3 songs with the highest `spotify_streams`, as a list of `(track, streams)` tuples, in `answer`.',
        reference: py`top = songs.nlargest(3, "spotify_streams")
answer = list(zip(top["track"], top["spotify_streams"].astype(int)))`,
        walkthrough: '`zip` pairs the two columns row-by-row; wrapping in `list` turns the tuples into something directly comparable.',
        traps: [py`top = songs.nsmallest(3, "spotify_streams")
answer = list(zip(top["track"], top["spotify_streams"].astype(int)))`],
      }),
      pdf({
        title: 'Duplicated flight numbers on the same day',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Using `.duplicated` on the combination of `flight` and `flight_date`, count how many rows are a **repeat** of an earlier one (not counting the first occurrence). Store the count (an `int`) in `answer`.',
        reference: py`answer = int(flights.duplicated(subset=["flight", "flight_date"]).sum())`,
        walkthrough: '`.duplicated()` marks every occurrence **after** the first as `True` by default, which is exactly "how many repeats", not "how many distinct combinations appear more than once".',
        traps: [py`answer = int(flights.duplicated(subset=["flight", "flight_date"], keep=False).sum())`],
      }),
    ],
  },
  {
    id: 'py-pandas-dtypes-categorical',
    title: 'Data types: astype, categoricals, nullable and Arrow dtypes',
    blurb: 'Numeric downcasting, category dtype, nullable integer/boolean/string dtypes, and Arrow-backed dtypes.',
    kind: 'learn',
    check: [
      {
        q: 'Why convert a text column with only a handful of repeated values (like a country name) to the `category` dtype?',
        options: [
          'It changes the values themselves',
          'It stores each distinct value once and refers to it by a small code, saving memory and speeding up operations like grouping',
          'It is required before any string method can be used',
          'It converts the text to numbers permanently, losing the original values',
        ],
        answer: 1,
        why: '`category` is a memory and speed optimisation for columns with few distinct values repeated many times; the original text is still there, just stored efficiently.',
      },
      {
        q: 'What problem do nullable dtypes like `"Int64"` (capital I) or `"boolean"` solve, compared to plain `int64`/`bool`?',
        options: [
          'They make arithmetic faster',
          'Plain NumPy-backed integer and boolean columns cannot hold a missing value at all; the nullable versions can, using `pd.NA`',
          'They are required for any column with more than 1000 rows',
          'They automatically sort the column',
        ],
        answer: 1,
        why: 'A NumPy `int64` array has no representation for "missing"; pandas\' nullable integer/boolean dtypes add one, using the special `pd.NA` marker instead of falling back to `float64` and `NaN`.',
      },
      {
        q: 'What is an Arrow-backed dtype in modern pandas?',
        options: [
          'A dtype only for dates',
          'A column backed by the Apache Arrow columnar memory format instead of NumPy, often faster and more memory-efficient, especially for strings',
          'A deprecated feature no longer used',
          'A dtype that can only be read, never written',
        ],
        answer: 1,
        why: 'Arrow-backed dtypes store data in the Arrow format, which several other tools also use, avoiding a NumPy-specific representation and offering real gains for strings and nullable numeric data.',
      },
      {
        q: 'Why is an `object` dtype column sometimes a hidden problem?',
        options: [
          'object columns are always faster',
          'object can silently hold a mix of real types (some rows a string, some a number, some None), which only shows up as bugs later',
          'object columns cannot contain text',
          'It is impossible to ever have an object column',
        ],
        answer: 1,
        why: 'object is pandas\' catch-all for anything that is not a recognised, uniform dtype. It happily mixes types row by row, which defeats type checks and vectorised operations until something eventually breaks.',
      },
      {
        q: 'What does downcasting a numeric column (e.g. from int64 to int8) trade away?',
        options: [
          'Nothing; it is always free',
          'Range: a smaller integer type holds fewer memory bytes per value, but can only represent a smaller range of numbers before overflowing',
          'It always makes calculations wrong',
          'It converts the column to text',
        ],
        answer: 1,
        why: 'A smaller integer or float type uses less memory, which matters for large data, but it can only represent a smaller range (or less precision) — safe only when the real data is known to fit.',
      },
    ],
  },
  {
    id: 'py-missing-data',
    title: 'Missing data',
    blurb: 'isna/notna, dropna options, fillna with values or methods, and interpolate.',
    kind: 'code',
    practice: {
      prompt: "Write `fill_median(df, col)`: return a **new** DataFrame (df must not change) where every missing value in `col` is replaced by that column's median.",
      starter: 'import pandas as pd\n\ndef fill_median(df, col):\n    ...\n',
      solution: py`import pandas as pd

def fill_median(df, col):
    return df.assign(**{col: df[col].fillna(df[col].median())})`,
      samples: ['fill_median(pd.DataFrame({"x": [1.0, None, 3.0]}), "x")["x"].tolist()'],
      cases: [
        ['A middle value is missing', 'fill_median(pd.DataFrame({"x": [1.0, None, 3.0]}), "x")["x"].tolist()'],
        ['Several missing values', 'fill_median(pd.DataFrame({"x": [1.0, None, 5.0, None, 9.0]}), "x")["x"].tolist()'],
        ['A skewed column, median not mean', 'fill_median(pd.DataFrame({"x": [1.0, None, 2.0, 100.0]}), "x")["x"].tolist()'],
        ['Nothing missing changes nothing', 'fill_median(pd.DataFrame({"x": [1.0, 2.0, 3.0]}), "x")["x"].tolist()'],
        ['Does not mutate the input', 'df = pd.DataFrame({"x": [1.0, None, 3.0]})\nfill_median(df, "x")\ndf["x"].isna().sum()'],
        ['A different column is untouched', 'sorted(fill_median(pd.DataFrame({"x": [1.0, None], "y": [None, 2.0]}), "x")["y"].isna().tolist())'],
      ],
      traps: [
        py`import pandas as pd

def fill_median(df, col):
    return df.assign(**{col: df[col].fillna(df[col].mean())})`,
        py`import pandas as pd

def fill_median(df, col):
    df[col] = df[col].fillna(df[col].median())
    return df`,
        py`import pandas as pd

def fill_median(df, col):
    return df.assign(**{col: df[col].fillna(0)})`,
      ],
    },
    real: [
      pdf({
        title: 'Share of flights with missing arrival delay',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: "Compute the fraction of rows with a missing `arr_delay`, rounded to 4 decimals, in `answer`.",
        reference: py`answer = round(float(flights["arr_delay"].isna().mean()), 4)`,
        walkthrough: '`.isna()` gives a boolean Series; the mean of a boolean Series is exactly the fraction that are `True`.',
        traps: [py`answer = round(float((flights["arr_delay"] == 0).mean()), 4)`],
      }),
      pdf({
        title: 'Comparing two ways of filling missing delay',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: "Fill missing `dep_delay` two ways: with `0`, and with the column's median. Store `(mean_filled_with_zero, mean_filled_with_median)`, both rounded to 2 decimals, in `answer`.",
        reference: py`with_zero = flights["dep_delay"].fillna(0)
with_median = flights["dep_delay"].fillna(flights["dep_delay"].median())
answer = (round(float(with_zero.mean()), 2), round(float(with_median.mean()), 2))`,
        walkthrough: "Filling with 0 pulls the average toward 0 (since most delays are small positive numbers); filling with the median usually changes the average far less, which is exactly why the choice of fill value matters.",
        traps: [py`with_zero = flights["dep_delay"].fillna(0)
with_median = flights["dep_delay"].fillna(flights["dep_delay"].mean())
answer = (round(float(with_zero.mean()), 2), round(float(with_median.mean()), 2))`],
      }),
      pdf({
        title: 'Dropping cancelled flights',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame. A cancelled flight has a missing dep_time.',
        brief: 'Using `.dropna`, drop rows with a missing `dep_time`. Store `(rows_before, rows_after)` in `answer`.',
        reference: py`before = len(flights)
after = len(flights.dropna(subset=["dep_time"]))
answer = (before, after)`,
        walkthrough: '`subset=["dep_time"]` drops a row only when **that** column is missing, leaving rows with other, unrelated missing values untouched.',
        traps: [py`before = len(flights)
after = len(flights.dropna())
answer = (before, after)`],
      }),
    ],
  },
  {
    id: 'py-text-str-accessor',
    title: 'Text data with the .str accessor and regex',
    blurb: 'str.lower/strip/split/contains/extract/replace, and how NaN passes through safely.',
    kind: 'code',
    practice: {
      prompt: `Write \`add_feature_col(df)\`: given a DataFrame with a \`"title"\` column, add a column \`"feature"\` holding the featured artist extracted from a pattern like \`"Song Name (feat. Some Artist)"\`, or \`None\` when there is no such pattern.`,
      starter: 'import pandas as pd\n\ndef add_feature_col(df):\n    ...\n',
      solution: py`import pandas as pd

def add_feature_col(df):
    return df.assign(feature=df["title"].str.extract(r"\(feat\. ([^)]+)\)")[0])`,
      samples: ['add_feature_col(pd.DataFrame({"title": ["Song (feat. Ada)"]}))["feature"].tolist()'],
      cases: [
        ['A title with a feature', 'add_feature_col(pd.DataFrame({"title": ["Song (feat. Ada)"]}))["feature"].tolist()'],
        ['A title with no feature', 'add_feature_col(pd.DataFrame({"title": ["Plain Song"]}))["feature"].isna().tolist()'],
        ['Several titles at once', 'add_feature_col(pd.DataFrame({"title": ["A (feat. X)", "B", "C (feat. Y)"]}))["feature"].tolist()'],
        ['The original column survives', 'sorted(add_feature_col(pd.DataFrame({"title": ["Song (feat. Ada)"]})).columns)'],
      ],
      traps: [
        py`import pandas as pd

def add_feature_col(df):
    return df.assign(feature=df["title"].str.extract(r"feat\. (.+)")[0])`,
        py`import pandas as pd

def add_feature_col(df):
    return df.assign(feature=df["title"].str.contains(r"feat\."))`,
        py`import pandas as pd

def add_feature_col(df):
    return df.assign(feature=df["title"].str.extract(r"\(feat\.([^)]+)\)")[0])`,
      ],
    },
    real: [
      pdf({
        title: 'Extracting featured artists in real song titles',
        use: ['songs'],
        starter: 'featured = songs[songs["track"].str.contains(r"\\(feat\\.", regex=True, na=False)].head(3)\nanswer = ...\n',
        given: '# songs is already a DataFrame. featured already holds 3 real titles that contain a "(feat." pattern.',
        brief: 'Add a `feature` column to `featured`, extracting the artist between `"(feat. "` and `")"`. Store the list of extracted names in `answer`.',
        reference: py`featured = songs[songs["track"].str.contains(r"\(feat\.", regex=True, na=False)].head(3)
with_feature = featured.assign(feature=featured["track"].str.extract(r"\(feat\. ([^)]+)\)")[0])
answer = with_feature["feature"].tolist()`,
        walkthrough: 'The capture group `([^)]+)` grabs everything up to (but not including) the closing parenthesis, which is exactly the featured artist\'s name.',
        traps: [py`featured = songs[songs["track"].str.contains(r"\(feat\.", regex=True, na=False)].head(3)
with_feature = featured.assign(feature=featured["track"].str.extract(r"\(feat\.([^)]+)\)")[0])
answer = with_feature["feature"].tolist()`],
      }),
      pdf({
        title: 'Normalising track name casing',
        use: ['tracks'],
        starter: 'answer = ...\n',
        given: '# tracks is already a DataFrame.',
        brief: "Add a column `lower_name` with every track's `Name`, lowercased and stripped of leading/trailing whitespace. Store the first 3 values in `answer`.",
        reference: py`with_lower = tracks.assign(lower_name=tracks["Name"].str.lower().str.strip())
answer = with_lower["lower_name"].head(3).tolist()`,
        walkthrough: '`.str` methods chain just like plain string methods, applied across the whole column at once.',
        traps: [py`with_lower = tracks.assign(lower_name=tracks["Name"].str.upper().str.strip())
answer = with_lower["lower_name"].head(3).tolist()`],
      }),
      pdf({
        title: "Splitting a customer's full name",
        use: ['customers'],
        starter: 'answer = ...\n',
        given: '# customers is already a DataFrame.',
        brief: 'Add a column `full_name` combining `FirstName` and `LastName` with a space, using `.str.cat` (not `+`). Store the first 3 values in `answer`.',
        reference: py`with_full = customers.assign(full_name=customers["FirstName"].str.cat(customers["LastName"], sep=" "))
answer = with_full["full_name"].head(3).tolist()`,
        walkthrough: '`.str.cat(other, sep=" ")` joins two string columns with a separator; unlike plain `+`, it also has options for handling missing values gracefully.',
        traps: [py`with_full = customers.assign(full_name=customers["LastName"].str.cat(customers["FirstName"], sep=" "))
answer = with_full["full_name"].head(3).tolist()`],
      }),
    ],
  },
  {
    id: 'py-dates-dt-resample',
    title: 'Dates and times: .dt, resample and time zones',
    blurb: 'to_datetime, the .dt accessor, date arithmetic, resample and time zones.',
    kind: 'code',
    practice: {
      prompt: 'Write `per_weekday(df, col)`: parse `df[col]` as dates and count how many rows fall on each weekday. Return a Series indexed `Monday` through `Sunday`, **in that order, all seven present** (0 for a day with no rows).',
      starter: 'import pandas as pd\n\ndef per_weekday(df, col):\n    ...\n',
      solution: py`import pandas as pd

ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

def per_weekday(df, col):
    days = pd.to_datetime(df[col]).dt.day_name()
    counts = days.value_counts()
    return counts.reindex(ORDER, fill_value=0).astype(int)`,
      samples: ['list(per_weekday(pd.DataFrame({"d": ["2024-01-01", "2024-01-01", "2024-01-02"]}), "d").items())'],
      cases: [
        ['Two Mondays, one Tuesday', 'list(per_weekday(pd.DataFrame({"d": ["2024-01-01", "2024-01-01", "2024-01-02"]}), "d").items())'],
        ['All seven days are present', 'list(per_weekday(pd.DataFrame({"d": ["2024-01-01"]}), "d").index)'],
        ['A day with zero rows is 0, not missing', 'int(per_weekday(pd.DataFrame({"d": ["2024-01-01"]}), "d")["Sunday"])'],
        ['The order is Monday first', 'list(per_weekday(pd.DataFrame({"d": ["2024-01-07", "2024-01-01"]}), "d").index)[:2]'],
      ],
      traps: [
        py`import pandas as pd

def per_weekday(df, col):
    days = pd.to_datetime(df[col]).dt.day_name()
    return days.value_counts()`,
        py`import pandas as pd

ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

def per_weekday(df, col):
    days = pd.to_datetime(df[col]).dt.day_name()
    counts = days.value_counts()
    return counts.reindex(ORDER, fill_value=0).astype(int)`,
        py`import pandas as pd

ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

def per_weekday(df, col):
    weekday_num = pd.to_datetime(df[col]).dt.weekday
    counts = weekday_num.value_counts()
    return counts.reindex(range(7), fill_value=0).astype(int)`,
      ],
    },
    real: [
      pdf({
        title: 'Flights per weekday',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Count how many flights fall on each weekday (Monday first, all seven present). Store the counts as a list of `(day, count)` tuples, in that order, in `answer`.',
        reference: py`ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
days = pd.to_datetime(flights["flight_date"]).dt.day_name()
counts = days.value_counts().reindex(ORDER, fill_value=0).astype(int)
answer = list(counts.items())`,
        walkthrough: '`.dt.day_name()` turns each date into its weekday name; `.reindex` guarantees every day appears, in the requested order.',
        traps: [py`ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
days = pd.to_datetime(flights["flight_date"]).dt.day_name()
counts = days.value_counts()
answer = list(counts.reindex(ORDER, fill_value=0).astype(int).sort_values(ascending=False).items())`],
      }),
      pdf({
        title: 'Reconstructing a real timestamp',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: "Build a real timestamp column from `flight_date` and `hour`/`minute`, using `pd.to_datetime` on the combined text. Store the **first** timestamp's hour (an `int`) in `answer`.",
        reference: py`combined = flights["flight_date"] + " " + flights["hour"].astype(str) + ":" + flights["minute"].astype(str)
stamp = pd.to_datetime(combined, format="%Y-%m-%d %H:%M")
answer = int(stamp.iloc[0].hour)`,
        walkthrough: 'Building the text first, then parsing it in one `pd.to_datetime` call with an explicit `format`, avoids ambiguity about how the pieces should combine.',
        traps: [py`combined = flights["flight_date"] + " " + flights["minute"].astype(str) + ":" + flights["hour"].astype(str)
stamp = pd.to_datetime(combined, format="%Y-%m-%d %H:%M")
answer = int(stamp.iloc[0].hour)`],
      }),
      pdf({
        title: 'Hourly delay pattern',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Group by `hour` and compute the mean `dep_delay` for each, rounded to 1 decimal. Store the hour (an `int`) with the **highest** mean delay in `answer`.',
        reference: py`by_hour = flights.groupby("hour")["dep_delay"].mean().round(1)
answer = int(by_hour.idxmax())`,
        walkthrough: '`.idxmax()` returns the **label** (here, the hour) of the largest value, not the value itself.',
        traps: [py`by_hour = flights.groupby("hour")["dep_delay"].mean().round(1)
answer = int(by_hour.idxmin())`],
      }),
    ],
  },
  {
    id: 'py-groupby-split-apply-combine',
    title: 'groupby: split, apply, combine',
    blurb: 'Grouping by one or many keys, size versus count, and iterating groups.',
    kind: 'code',
    practice: {
      prompt: 'Write `avg_delay_by_carrier(df)`: return the average `dep_delay` per `carrier`, rounded to 1 decimal, **worst (highest) first**.',
      starter: 'import pandas as pd\n\ndef avg_delay_by_carrier(df):\n    ...\n',
      solution: py`import pandas as pd

def avg_delay_by_carrier(df):
    return df.groupby("carrier")["dep_delay"].mean().round(1).sort_values(ascending=False)`,
      samples: ['list(avg_delay_by_carrier(pd.DataFrame({"carrier": ["A", "A", "B"], "dep_delay": [10, 30, 5]})).items())'],
      cases: [
        ['Two carriers', 'list(avg_delay_by_carrier(pd.DataFrame({"carrier": ["A", "A", "B"], "dep_delay": [10, 30, 5]})).items())'],
        ['Worst first', 'list(avg_delay_by_carrier(pd.DataFrame({"carrier": ["A", "B", "B"], "dep_delay": [5, 40, 60]})).index)'],
        ['One row per carrier', 'len(avg_delay_by_carrier(pd.DataFrame({"carrier": ["A", "B", "C"], "dep_delay": [1, 2, 3]})))'],
        ['A single carrier', 'list(avg_delay_by_carrier(pd.DataFrame({"carrier": ["A", "A"], "dep_delay": [10, 20]})).items())'],
      ],
      traps: [
        py`import pandas as pd

def avg_delay_by_carrier(df):
    return df.groupby("carrier")["dep_delay"].mean().round(1).sort_values(ascending=True)`,
        py`import pandas as pd

def avg_delay_by_carrier(df):
    return df.groupby("carrier")["dep_delay"].sum().round(1).sort_values(ascending=False)`,
        py`import pandas as pd

def avg_delay_by_carrier(df):
    return df.groupby("carrier")["dep_delay"].mean().round(1)`,
      ],
    },
    real: [
      pdf({
        title: 'Average delay per carrier',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Return the carrier with the **worst** (highest) average `dep_delay`, as a plain string, in `answer`.',
        reference: py`by_carrier = flights.groupby("carrier")["dep_delay"].mean()
answer = str(by_carrier.idxmax())`,
        walkthrough: 'Grouping by `carrier` and averaging `dep_delay` gives one number per carrier; `.idxmax()` names the worst one.',
        traps: [py`by_carrier = flights.groupby("carrier")["dep_delay"].mean()
answer = str(by_carrier.idxmin())`],
      }),
      pdf({
        title: 'Flights per origin',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: "Using `.size()` (not `.count()`), return the number of flights per `origin`, as a dict of plain ints, in `answer`.",
        reference: py`answer = flights.groupby("origin").size().astype(int).to_dict()`,
        walkthrough: '`.size()` counts rows per group regardless of missing values; `.count()` would instead count non-missing values in a specific column.',
        traps: [py`answer = flights.groupby("origin")["dep_delay"].count().astype(int).to_dict()`],
      }),
      pdf({
        title: 'The busiest day',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Group by `flight_date` and find the date with the **most** flights. Store that date as a string, in `answer`.',
        reference: py`by_day = flights.groupby("flight_date").size()
answer = str(by_day.idxmax())`,
        walkthrough: '`.idxmax()` on the per-day counts names the single busiest date.',
        traps: [py`by_day = flights.groupby("flight_date").size()
answer = str(by_day.idxmin())`],
      }),
    ],
  },
  {
    id: 'py-aggregation-agg-transform-filter',
    title: 'Aggregation: agg, named aggregation, transform and filter',
    blurb: 'Several aggregations at once, named aggregation, transform for per-group values.',
    kind: 'code',
    practice: {
      prompt: "Write `add_share(df)`: add a column `share`, each row's fraction of its `origin`'s total flights that belong to its own `carrier` (rounded to 3 decimals).",
      starter: 'import pandas as pd\n\ndef add_share(df):\n    ...\n',
      solution: py`import pandas as pd

def add_share(df):
    per_combo = df.groupby(["origin", "carrier"])["carrier"].transform("count")
    per_origin = df.groupby("origin")["carrier"].transform("count")
    return df.assign(share=(per_combo / per_origin).round(3))`,
      samples: ['add_share(pd.DataFrame({"origin": ["A", "A", "A", "B"], "carrier": ["X", "X", "Y", "X"]}))["share"].tolist()'],
      cases: [
        ['A simple split', 'add_share(pd.DataFrame({"origin": ["A", "A", "A", "B"], "carrier": ["X", "X", "Y", "X"]}))["share"].tolist()'],
        ['A single carrier gets a full share', 'add_share(pd.DataFrame({"origin": ["A", "A"], "carrier": ["X", "X"]}))["share"].tolist()'],
        ['Two origins are independent', 'add_share(pd.DataFrame({"origin": ["A", "B", "B"], "carrier": ["X", "Y", "Y"]}))["share"].tolist()'],
        ['The original columns survive', 'sorted(add_share(pd.DataFrame({"origin": ["A"], "carrier": ["X"]})).columns)'],
      ],
      traps: [
        py`import pandas as pd

def add_share(df):
    per_combo = df.groupby(["origin", "carrier"])["carrier"].transform("count")
    return df.assign(share=(per_combo / len(df)).round(3))`,
        py`import pandas as pd

def add_share(df):
    per_origin = df.groupby("origin")["carrier"].transform("count")
    return df.assign(share=(per_origin / len(df)).round(3))`,
        py`import pandas as pd

def add_share(df):
    per_combo = df.groupby(["origin", "carrier"])["carrier"].transform("count")
    per_origin = df.groupby("carrier")["origin"].transform("count")
    return df.assign(share=(per_combo / per_origin).round(3))`,
      ],
    },
    real: [
      pdf({
        title: "A carrier's share within its origin",
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: "Add a `share` column (each row's carrier's fraction of its origin's flights, rounded to 3 decimals). Store the value for the **first** row, in `answer`.",
        reference: py`per_combo = flights.groupby(["origin", "carrier"])["carrier"].transform("count")
per_origin = flights.groupby("origin")["carrier"].transform("count")
with_share = flights.assign(share=(per_combo / per_origin).round(3))
answer = float(with_share["share"].iloc[0])`,
        walkthrough: 'Two separate `transform` calls, one per grouping, broadcast a group-level count back onto every one of that group\'s original rows, ready to divide directly.',
        traps: [py`per_combo = flights.groupby(["origin", "carrier"])["carrier"].transform("count")
with_share = flights.assign(share=(per_combo / len(flights)).round(3))
answer = float(with_share["share"].iloc[0])`],
      }),
      pdf({
        title: 'Z-score of delay within each origin',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: "Add a `z` column: each row's `dep_delay` minus its **origin's** mean `dep_delay`, divided by its origin's standard deviation, ignoring missing values. Store the value for the first row, rounded to 3 decimals, in `answer`.",
        reference: py`mean_by_origin = flights.groupby("origin")["dep_delay"].transform("mean")
std_by_origin = flights.groupby("origin")["dep_delay"].transform("std")
with_z = flights.assign(z=(flights["dep_delay"] - mean_by_origin) / std_by_origin)
answer = round(float(with_z["z"].iloc[0]), 3)`,
        walkthrough: 'Both `transform` calls broadcast a per-origin summary back onto every row of that origin, so the standardisation happens within each origin group rather than across the whole table.',
        traps: [py`overall_mean = flights["dep_delay"].mean()
overall_std = flights["dep_delay"].std()
with_z = flights.assign(z=(flights["dep_delay"] - overall_mean) / overall_std)
answer = round(float(with_z["z"].iloc[0]), 3)`],
      }),
      pdf({
        title: 'Keeping only busy origins',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Using `.groupby(...).filter(...)`, keep only rows whose `origin` has more than 1000 flights in total. Store the number of **distinct origins** remaining, as an `int`, in `answer`.',
        reference: py`busy = flights.groupby("origin").filter(lambda g: len(g) > 1000)
answer = int(busy["origin"].nunique())`,
        walkthrough: '`.filter` keeps or drops **whole groups** based on a per-group condition, unlike `.transform` (which returns a value for every row) or a plain boolean mask (which cannot see a whole group at once).',
        traps: [py`busy = flights.groupby("origin").filter(lambda g: len(g) > 100000)
answer = int(busy["origin"].nunique())`],
      }),
    ],
  },
]
