import { dat, pdf, py } from './common.js'

export const pandasLessonsC = [
  {
    id: 'py-merge-join',
    title: 'Merge and join in depth',
    blurb: 'merge how= inner/left/right/outer, on/left_on/right_on, suffixes and validate=.',
    kind: 'code',
    practice: {
      prompt: 'Write `with_airline(flights, airlines)`: add the airline name to every flight by joining on `carrier`, **keeping every flight** even if no matching airline is found.',
      starter: 'import pandas as pd\n\ndef with_airline(flights, airlines):\n    ...\n',
      solution: py`import pandas as pd

def with_airline(flights, airlines):
    return flights.merge(airlines, on="carrier", how="left")`,
      samples: ['with_airline(pd.DataFrame({"carrier": ["AA", "BB"]}), pd.DataFrame({"carrier": ["AA"], "name": ["Alpha Air"]})).to_dict("records")'],
      cases: [
        ['Every flight is kept, even unmatched', 'with_airline(pd.DataFrame({"carrier": ["AA", "BB"]}), pd.DataFrame({"carrier": ["AA"], "name": ["Alpha Air"]})).to_dict("records")'],
        ['The row count matches the flights side', 'len(with_airline(pd.DataFrame({"carrier": ["AA", "BB", "AA"]}), pd.DataFrame({"carrier": ["AA"], "name": ["Alpha Air"]})))'],
        ['A matched name', 'with_airline(pd.DataFrame({"carrier": ["AA"]}), pd.DataFrame({"carrier": ["AA"], "name": ["Alpha Air"]}))["name"].tolist()'],
        ['An airline with no matching flight is dropped, not added', 'len(with_airline(pd.DataFrame({"carrier": ["AA"]}), pd.DataFrame({"carrier": ["AA", "ZZ"], "name": ["Alpha Air", "Zed Air"]})))'],
      ],
      traps: [
        py`import pandas as pd

def with_airline(flights, airlines):
    return flights.merge(airlines, on="carrier", how="inner")`,
        py`import pandas as pd

def with_airline(flights, airlines):
    return flights.merge(airlines, on="carrier", how="right")`,
        py`import pandas as pd

def with_airline(flights, airlines):
    return flights.merge(airlines, on="carrier", how="outer")`,
      ],
    },
    real: [
      pdf({
        title: 'Adding airline names to real flights',
        use: ['flights', 'airlines'],
        starter: 'sample = pd.concat([flights[["carrier"]].head(5), pd.DataFrame({"carrier": ["ZZ"]})], ignore_index=True)\nanswer = ...\n',
        given: '# flights and airlines are already DataFrames. sample mixes 5 real carriers with one made-up, unmatched one ("ZZ").',
        brief: 'Join `sample` with `airlines` on `carrier`, keeping every row of `sample`. Store `(rows_before, rows_after)` in `answer` — they should be equal, since a left join never drops a row from the left side, even the unmatched one.',
        reference: py`sample = pd.concat([flights[["carrier"]].head(5), pd.DataFrame({"carrier": ["ZZ"]})], ignore_index=True)
before = len(sample)
joined = sample.merge(airlines, on="carrier", how="left")
answer = (before, len(joined))`,
        walkthrough: 'A left join keeps every row of the left side (`sample`) regardless of whether a match exists on the right, which is exactly why the row counts are equal here, even with the unmatched "ZZ" row.',
        traps: [py`sample = pd.concat([flights[["carrier"]].head(5), pd.DataFrame({"carrier": ["ZZ"]})], ignore_index=True)
before = len(sample)
joined = sample.merge(airlines, on="carrier", how="inner")
answer = (before, len(joined))`],
      }),
      pdf({
        title: 'The oldest aircraft that ever flew',
        use: ['flights', 'planes'],
        starter: 'answer = ...\n',
        given: '# flights and planes are already DataFrames.',
        brief: 'Join `flights` with `planes` on `tailnum` (inner join is fine here), then find the minimum `year` (the plane\'s manufacture year) among the joined rows. Store the year as an `int` in `answer`.',
        reference: py`joined = flights.merge(planes, on="tailnum", how="inner")
answer = int(joined["year"].min())`,
        walkthrough: 'An inner join only keeps flights that actually matched a known plane, which is fine here since the question is only about planes that flew.',
        traps: [py`joined = flights.merge(planes, on="tailnum", how="inner")
answer = int(joined["year"].max())`],
      }),
      pdf({
        title: 'Planes that never flew',
        use: ['flights', 'planes'],
        starter: 'answer = ...\n',
        given: '# flights and planes are already DataFrames.',
        brief: 'Find how many distinct `tailnum`s in `planes` never appear in `flights` at all (an anti-join, using `~.isin(...)`). Store the count as an `int` in `answer`.',
        reference: py`flown = set(flights["tailnum"].dropna())
answer = int((~planes["tailnum"].isin(flown)).sum())`,
        walkthrough: '`.isin(flown)` checks membership against the set of tailnums that actually appear in `flights`; negating it with `~` keeps exactly the ones that never did.',
        traps: [py`flown = set(flights["tailnum"].dropna())
answer = int((planes["tailnum"].isin(flown)).sum())`],
      }),
    ],
  },
  {
    id: 'py-combining-concat-combine-first',
    title: 'Combining frames: concat, append patterns and combine_first',
    blurb: 'concat along rows and columns, keys, aligning columns, and combine_first.',
    kind: 'code',
    practice: {
      prompt: 'Write `stack_months(frames)`: given a list of DataFrames (one per month, in order), stack them into one DataFrame with an added `month` column (`1` for the first frame, `2` for the second, and so on), and a fresh, continuous index.',
      starter: 'import pandas as pd\n\ndef stack_months(frames):\n    ...\n',
      solution: py`import pandas as pd

def stack_months(frames):
    return pd.concat([f.assign(month=i + 1) for i, f in enumerate(frames)], ignore_index=True)`,
      samples: ['stack_months([pd.DataFrame({"x": [1]}), pd.DataFrame({"x": [2, 3]})]).to_dict("records")'],
      cases: [
        ['Two small frames', 'stack_months([pd.DataFrame({"x": [1]}), pd.DataFrame({"x": [2, 3]})]).to_dict("records")'],
        ['A fresh, continuous index', 'stack_months([pd.DataFrame({"x": [1]}, index=[5]), pd.DataFrame({"x": [2]}, index=[9])]).index.tolist()'],
        ['Three frames', 'stack_months([pd.DataFrame({"x": [1]}), pd.DataFrame({"x": [2]}), pd.DataFrame({"x": [3]})])["month"].tolist()'],
      ],
      traps: [
        py`import pandas as pd

def stack_months(frames):
    return pd.concat([f.assign(month=i) for i, f in enumerate(frames)], ignore_index=True)`,
        py`import pandas as pd

def stack_months(frames):
    return pd.concat([f.assign(month=i + 1) for i, f in enumerate(frames)])`,
        py`import pandas as pd

def stack_months(frames):
    return pd.concat(frames, ignore_index=True)`,
      ],
    },
    real: [
      pdf({
        title: 'Stacking two months of real flights',
        use: ['flights'],
        starter: 'jan = flights[flights["month"] == 1][["carrier", "distance"]].head(3)\nfeb = flights[flights["month"] == 2][["carrier", "distance"]].head(3)\nanswer = ...\n',
        given: '# flights is already a DataFrame. jan and feb already hold 3 real rows each.',
        brief: 'Stack `jan` and `feb` with `pd.concat`, adding a `source` column (`"jan"` for the first, `"feb"` for the second), with a fresh index. Store `(total_rows, source_counts, index_is_fresh)` in `answer`, where `index_is_fresh` checks the index is exactly `0..n-1`.',
        reference: py`jan = flights[flights["month"] == 1][["carrier", "distance"]].head(3)
feb = flights[flights["month"] == 2][["carrier", "distance"]].head(3)
stacked = pd.concat([jan.assign(source="jan"), feb.assign(source="feb")], ignore_index=True)
fresh = stacked.index.tolist() == list(range(len(stacked)))
answer = (len(stacked), stacked["source"].value_counts().to_dict(), fresh)`,
        walkthrough: '`ignore_index=True` gives the combined frame a fresh `0..n-1` index instead of keeping (and possibly repeating) each piece\'s original index.',
        traps: [py`jan = flights[flights["month"] == 1][["carrier", "distance"]].head(3)
feb = flights[flights["month"] == 2][["carrier", "distance"]].head(3)
stacked = pd.concat([jan.assign(source="jan"), feb.assign(source="feb")])
fresh = stacked.index.tolist() == list(range(len(stacked)))
answer = (len(stacked), stacked["source"].value_counts().to_dict(), fresh)`],
      }),
      pdf({
        title: 'Filling gaps with combine_first',
        use: ['flights'],
        starter: 'primary = flights["dep_delay"].head(6).copy()\nprimary.iloc[1] = None\nprimary.iloc[4] = None\nbackup = pd.Series([0.0] * 6)\nanswer = ...\n',
        given: '# flights is already a DataFrame. primary has 2 real values deliberately blanked out; backup offers a 0 fallback for every position.',
        brief: 'Use `.combine_first` to fill `primary`\'s gaps from `backup`, **without** losing any of `primary`\'s real values. Store the result as a list in `answer`.',
        reference: py`primary = flights["dep_delay"].head(6).copy()
primary.iloc[1] = None
primary.iloc[4] = None
backup = pd.Series([0.0] * 6)
answer = primary.combine_first(backup).tolist()`,
        walkthrough: '`.combine_first` keeps every value from `primary` that already exists, and only reaches into `backup` for the positions that were missing.',
        traps: [py`primary = flights["dep_delay"].head(6).copy()
primary.iloc[1] = None
primary.iloc[4] = None
backup = pd.Series([0.0] * 6)
answer = backup.combine_first(primary).tolist()`],
      }),
      pdf({
        title: 'Combining three small carrier samples',
        use: ['flights'],
        starter: 'parts = [flights[flights["carrier"] == c][["carrier"]].head(2) for c in ["AA", "UA", "DL"]]\nanswer = ...\n',
        given: '# flights is already a DataFrame. parts already holds up to 2 real rows for each of 3 carriers.',
        brief: 'Stack every frame in `parts` into one, with `keys=["AA", "UA", "DL"]` (producing a two-level index). Store the outer level of that index as a list in `answer`.',
        reference: py`parts = [flights[flights["carrier"] == c][["carrier"]].head(2) for c in ["AA", "UA", "DL"]]
combined = pd.concat(parts, keys=["AA", "UA", "DL"])
answer = combined.index.get_level_values(0).tolist()`,
        walkthrough: '`keys=` labels which original frame each stacked row came from, as the **outer** level of a new two-level (MultiIndex) index.',
        traps: [py`parts = [flights[flights["carrier"] == c][["carrier"]].head(2) for c in ["AA", "UA", "DL"]]
combined = pd.concat(parts, keys=["AA", "UA", "DL"])
answer = combined.index.get_level_values(1).tolist()`],
      }),
    ],
  },
  {
    id: 'py-pivot-crosstab',
    title: 'Pivot tables and crosstab',
    blurb: 'pivot versus pivot_table, aggfunc, fill_value, margins, and crosstab.',
    kind: 'code',
    practice: {
      prompt: 'Write `delay_pivot(df)`: return a pivot table of the mean `dep_delay`, with `origin` as rows and `month` as columns, rounded to 1 decimal.',
      starter: 'import pandas as pd\n\ndef delay_pivot(df):\n    ...\n',
      solution: py`import pandas as pd

def delay_pivot(df):
    return df.pivot_table(index="origin", columns="month", values="dep_delay", aggfunc="mean").round(1)`,
      samples: ['delay_pivot(pd.DataFrame({"origin": ["A", "A", "B"], "month": [1, 2, 1], "dep_delay": [10.0, 20.0, 5.0]})).to_dict()'],
      cases: [
        ['A small pivot', 'delay_pivot(pd.DataFrame({"origin": ["A", "A", "B"], "month": [1, 2, 1], "dep_delay": [10.0, 20.0, 5.0]})).to_dict()'],
        ['Rows are the distinct origins', 'sorted(delay_pivot(pd.DataFrame({"origin": ["A", "B", "A"], "month": [1, 1, 1], "dep_delay": [10.0, 20.0, 30.0]})).index)'],
        ['Averaging within a cell', 'float(delay_pivot(pd.DataFrame({"origin": ["A", "A"], "month": [1, 1], "dep_delay": [10.0, 30.0]})).loc["A", 1])'],
      ],
      traps: [
        py`import pandas as pd

def delay_pivot(df):
    return df.pivot_table(index="origin", columns="month", values="dep_delay", aggfunc="sum").round(1)`,
        py`import pandas as pd

def delay_pivot(df):
    return df.pivot_table(index="month", columns="origin", values="dep_delay", aggfunc="mean").round(1)`,
      ],
    },
    real: [
      pdf({
        title: 'Flights by origin and month',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Build a pivot table counting flights, `origin` as rows and `month` as columns (`aggfunc="size"`, `fill_value=0`). Store the value for `origin="JFK"`, `month=1`, as an `int`, in `answer`.',
        reference: py`pivot = flights.pivot_table(index="origin", columns="month", values="carrier", aggfunc="size", fill_value=0)
answer = int(pivot.loc["JFK", 1])`,
        walkthrough: '`aggfunc="size"` counts rows in each (origin, month) cell; `fill_value=0` turns a combination with no flights into `0` instead of `NaN`.',
        traps: [py`pivot = flights.pivot_table(index="month", columns="origin", values="carrier", aggfunc="size", fill_value=0)
answer = int(pivot.loc["JFK", 1])`],
      }),
      pdf({
        title: "A carrier's average delay by origin",
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Build a pivot table of mean `dep_delay`, `carrier` as rows and `origin` as columns, rounded to 1 decimal. Store the shape (`(rows, cols)`) in `answer`.',
        reference: py`pivot = flights.pivot_table(index="carrier", columns="origin", values="dep_delay", aggfunc="mean").round(1)
answer = pivot.shape`,
        walkthrough: 'The pivot has one row per distinct carrier and one column per distinct origin, with the mean delay in each cell.',
        traps: [py`pivot = flights.pivot_table(index="origin", columns="carrier", values="dep_delay", aggfunc="mean").round(1)
answer = pivot.shape`],
      }),
      pdf({
        title: 'Genre by year with crosstab',
        use: ['songs'],
        starter: 'sample = songs.head(50)\nanswer = ...\n',
        given: '# songs is already a DataFrame. sample already holds the first 50 real rows.',
        brief: 'Count rows by `explicit_track` using `.value_counts()` (the one-column special case of what `pd.crosstab` generalises to two columns). Store the dict of counts (plain ints) in `answer`.',
        reference: py`sample = songs.head(50)
answer = sample["explicit_track"].value_counts().astype(int).to_dict()`,
        walkthrough: '`.value_counts()` is the one-column special case of the same idea `pd.crosstab` generalises to two.',
        traps: [py`sample = songs.head(50)
answer = {str(k): int(v) for k, v in sample["explicit_track"].value_counts(normalize=True).items()}`],
      }),
    ],
  },
  {
    id: 'py-reshaping-melt-stack',
    title: 'Reshaping: melt, stack, unstack and wide versus long',
    blurb: 'Tidy data, melt with id_vars/value_vars, stack and unstack.',
    kind: 'code',
    practice: {
      prompt: 'Write `to_long(df)`: given a wide DataFrame with an `id` column and several year columns (like `"2021"`, `"2022"`), return a long-form DataFrame with columns `id`, `year`, `value`.',
      starter: 'import pandas as pd\n\ndef to_long(df):\n    ...\n',
      solution: py`import pandas as pd

def to_long(df):
    return df.melt(id_vars=["id"], var_name="year", value_name="value")`,
      samples: ['to_long(pd.DataFrame({"id": [1, 2], "2021": [10, 20], "2022": [30, 40]})).to_dict("records")'],
      cases: [
        ['Two ids, two years', 'to_long(pd.DataFrame({"id": [1, 2], "2021": [10, 20], "2022": [30, 40]})).to_dict("records")'],
        ['The right number of rows', 'len(to_long(pd.DataFrame({"id": [1, 2, 3], "2021": [1, 2, 3], "2022": [4, 5, 6], "2023": [7, 8, 9]})))'],
        ['Column names', 'sorted(to_long(pd.DataFrame({"id": [1], "2021": [10]})).columns)'],
      ],
      traps: [
        py`import pandas as pd

def to_long(df):
    return df.melt(id_vars=["id"], var_name="value", value_name="year")`,
        py`import pandas as pd

def to_long(df):
    return df`,
      ],
    },
    real: [
      pdf({
        title: 'Reshaping monthly flight counts',
        use: ['flights'],
        starter: 'wide = flights.groupby("month").size().reset_index(name="count").pivot_table(values="count", columns="month").assign(region="NYC")\nanswer = ...\n',
        given: '# flights is already a DataFrame. wide is a single-row frame with one column per month, plus a region label.',
        brief: 'Convert `wide` to long form with `pd.melt`, keeping `region` as the id column, naming the value columns `month` and the values `count`. Store the number of resulting rows (an `int`) in `answer`.',
        reference: py`wide = flights.groupby("month").size().reset_index(name="count").pivot_table(values="count", columns="month").assign(region="NYC")
long = wide.melt(id_vars=["region"], var_name="month", value_name="count")
answer = int(len(long))`,
        walkthrough: 'Every non-id column of `wide` becomes one row of `long`, so the row count after melting equals the number of month columns.',
        traps: [py`wide = flights.groupby("month").size().reset_index(name="count").pivot_table(values="count", columns="month").assign(region="NYC")
long = wide.melt(id_vars=["region"], var_name="month", value_name="count")
answer = int(len(long)) + 1`],
      }),
      pdf({
        title: 'Unstacking a grouped Series',
        use: ['flights'],
        starter: 'grouped = flights.head(30).groupby(["origin", "carrier"]).size()\nanswer = ...\n',
        given: '# flights is already a DataFrame. grouped is a real MultiIndex Series of counts, from the first 30 rows.',
        brief: 'Use `.unstack()` to turn `grouped` into a wide DataFrame (origin as rows, carrier as columns), filling any missing combination with `0`. Store the shape (`(rows, cols)`) in `answer`.',
        reference: py`grouped = flights.head(30).groupby(["origin", "carrier"]).size()
wide = grouped.unstack(fill_value=0)
answer = wide.shape`,
        walkthrough: '`.unstack()` moves the **inner** index level (here, `carrier`) out to become columns, turning a long Series into a wide table.',
        traps: [py`grouped = flights.head(30).groupby(["origin", "carrier"]).size()
wide = grouped.unstack(level=0, fill_value=0)
answer = wide.shape`],
      }),
      pdf({
        title: 'Stacking a small wide frame of penguin stats',
        use: ['penguins'],
        starter: 'wide = penguins.groupby("species")[["bill_length_mm", "bill_depth_mm"]].mean().round(1)\nanswer = ...\n',
        given: '# penguins is already a DataFrame. wide already holds real per-species averages of two measurements.',
        brief: 'Use `.stack()` to turn `wide` into a long Series indexed by `(species, measurement)`. Store its length (an `int`) in `answer`.',
        reference: py`wide = penguins.groupby("species")[["bill_length_mm", "bill_depth_mm"]].mean().round(1)
long = wide.stack()
answer = int(len(long))`,
        walkthrough: '`.stack()` moves the columns down into a new, inner level of the index, one row per original (row, column) pair — 3 species times 2 measurements here.',
        traps: [py`wide = penguins.groupby("species")[["bill_length_mm", "bill_depth_mm"]].mean().round(1)
long = wide.stack()
answer = int(len(long)) - 1`],
      }),
    ],
  },
  {
    id: 'py-multiindex',
    title: 'MultiIndex and hierarchical data',
    blurb: 'Creating a MultiIndex, selecting with loc and xs, swaplevel and sort_index.',
    kind: 'code',
    practice: {
      prompt: 'Write `totals(df)`: given columns `origin`, `carrier` and `amount`, return the sum of `amount` per `(origin, carrier)` combination, as a MultiIndex Series.',
      starter: 'import pandas as pd\n\ndef totals(df):\n    ...\n',
      solution: py`import pandas as pd

def totals(df):
    return df.groupby(["origin", "carrier"])["amount"].sum()`,
      samples: ['list(totals(pd.DataFrame({"origin": ["A", "A", "B"], "carrier": ["X", "X", "Y"], "amount": [10, 20, 5]})).items())'],
      cases: [
        ['A small frame', 'list(totals(pd.DataFrame({"origin": ["A", "A", "B"], "carrier": ["X", "X", "Y"], "amount": [10, 20, 5]})).items())'],
        ['The index has two levels', 'totals(pd.DataFrame({"origin": ["A"], "carrier": ["X"], "amount": [1]})).index.nlevels'],
        ['Selecting one combination', 'float(totals(pd.DataFrame({"origin": ["A", "B"], "carrier": ["X", "Y"], "amount": [10, 20]})).loc[("A", "X")])'],
      ],
      traps: [
        py`import pandas as pd

def totals(df):
    return df.groupby(["origin", "carrier"])["amount"].mean()`,
        py`import pandas as pd

def totals(df):
    return df.groupby(["carrier", "origin"])["amount"].sum()`,
      ],
    },
    real: [
      pdf({
        title: 'Total distance per (origin, carrier)',
        use: ['flights'],
        starter: 'sample = flights.head(40)\nanswer = ...\n',
        given: '# flights is already a DataFrame. sample already holds the first 40 real rows.',
        brief: 'Return the total `distance` per `(origin, carrier)` from `sample`, as a MultiIndex Series, and store `int(result.loc[("JFK", "B6")])` in `answer` if that combination exists — otherwise store `None`.',
        reference: py`sample = flights.head(40)
totals = sample.groupby(["origin", "carrier"])["distance"].sum()
answer = int(totals.loc[("JFK", "B6")]) if ("JFK", "B6") in totals.index else None`,
        walkthrough: 'A tuple `(origin_value, carrier_value)` looks up one specific combination directly in a MultiIndex Series.',
        traps: [py`sample = flights.head(40)
totals = sample.groupby(["origin", "carrier"])["distance"].sum()
answer = int(totals.loc[("B6", "JFK")]) if ("B6", "JFK") in totals.index else None`],
      }),
      pdf({
        title: 'Slicing one origin out of a MultiIndex',
        use: ['flights'],
        starter: 'sample = flights.head(40)\ntotals = sample.groupby(["origin", "carrier"])["distance"].sum()\nanswer = ...\n',
        given: '# flights is already a DataFrame. totals is a real MultiIndex Series over (origin, carrier).',
        brief: 'Using `.xs`, select just the `"JFK"` slice of `totals` (dropping the outer level). Store the result as a dict in `answer`.',
        reference: py`sample = flights.head(40)
totals = sample.groupby(["origin", "carrier"])["distance"].sum()
answer = totals.xs("JFK").to_dict()`,
        walkthrough: '`.xs(key)` selects a cross-section at the outer level, dropping that level from the result — equivalent to `.loc["JFK"]` here, but `.xs` also works cleanly on inner levels with `level=`.',
        traps: [py`sample = flights.head(40)
totals = sample.groupby(["origin", "carrier"])["distance"].sum()
answer = totals.xs("EWR").to_dict()`],
      }),
      pdf({
        title: 'Swapping the levels of a MultiIndex',
        use: ['flights'],
        starter: 'sample = flights.head(40)\ntotals = sample.groupby(["origin", "carrier"])["distance"].sum()\nanswer = ...\n',
        given: '# flights is already a DataFrame. totals is a real MultiIndex Series over (origin, carrier).',
        brief: 'Using `.swaplevel()`, reorder `totals` to `(carrier, origin)` instead. Store the resulting index\'s **level names**, as a list, in `answer`.',
        reference: py`sample = flights.head(40)
totals = sample.groupby(["origin", "carrier"])["distance"].sum()
swapped = totals.swaplevel()
answer = list(swapped.index.names)`,
        walkthrough: '`.swaplevel()` reorders the levels of a MultiIndex without changing any of the underlying data.',
        traps: [py`sample = flights.head(40)
totals = sample.groupby(["origin", "carrier"])["distance"].sum()
answer = list(totals.index.names)`],
      }),
    ],
  },
  {
    id: 'py-window-rolling',
    title: 'Window functions: rolling, expanding, ewm, shift and diff',
    blurb: 'Rolling means and sums, expanding, ewm, shift/diff, and cumulative sums.',
    kind: 'code',
    practice: {
      prompt: 'Write `rolling7(s)`: return the 7-row rolling average of Series `s`, using `min_periods=1` so the first few rows average whatever is actually available so far.',
      starter: 'import pandas as pd\n\ndef rolling7(s):\n    ...\n',
      solution: py`import pandas as pd

def rolling7(s):
    return s.rolling(7, min_periods=1).mean()`,
      samples: ['rolling7(pd.Series([1.0, 2.0, 3.0])).tolist()'],
      cases: [
        ['Fewer than 7 values', 'rolling7(pd.Series([1.0, 2.0, 3.0])).tolist()'],
        ['Exactly 7 values', 'rolling7(pd.Series([1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0])).tolist()'],
        ['More than 7 values', 'rolling7(pd.Series([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0])).tolist()'],
      ],
      traps: [
        py`import pandas as pd

def rolling7(s):
    return s.rolling(7).mean()`,
        py`import pandas as pd

def rolling7(s):
    return s.rolling(7, min_periods=1).sum()`,
      ],
    },
    real: [
      pdf({
        title: 'A rolling average of daily flight counts',
        use: ['flights'],
        starter: 'daily = flights.groupby("flight_date").size().sort_index()\nanswer = ...\n',
        given: '# flights is already a DataFrame. daily is the real number of flights per date, sorted by date.',
        brief: 'Compute a 7-day rolling average of `daily`, with `min_periods=1`, rounded to 1 decimal. Store the **last** value in `answer`.',
        reference: py`daily = flights.groupby("flight_date").size().sort_index()
rolled = daily.rolling(7, min_periods=1).mean().round(1)
answer = float(rolled.iloc[-1])`,
        walkthrough: 'Sorting by date first is essential — a rolling window only makes sense when consecutive rows really are consecutive in time.',
        traps: [py`daily = flights.groupby("flight_date").size().sort_index()
rolled = daily.rolling(7, min_periods=1).mean().round(1)
answer = float(rolled.iloc[0])`],
      }),
      pdf({
        title: 'Month-over-month change with diff',
        use: ['flights'],
        starter: 'by_month = flights.groupby("month").size().sort_index()\nanswer = ...\n',
        given: '# flights is already a DataFrame. by_month is the real number of flights per month, in order.',
        brief: 'Using `.diff()`, compute the change in flight count from each month to the next. Store the value for **month 2** (the change from month 1 to month 2), as an `int`, in `answer`.',
        reference: py`by_month = flights.groupby("month").size().sort_index()
changes = by_month.diff()
answer = int(changes.loc[2])`,
        walkthrough: '`.diff()` subtracts each value from the one before it, aligned by position; the very first entry has nothing to subtract from, so it becomes `NaN`.',
        traps: [py`by_month = flights.groupby("month").size().sort_index()
changes = by_month.diff(periods=-1)
answer = int(changes.loc[2])`],
      }),
      pdf({
        title: 'An expanding total of daily flights',
        use: ['flights'],
        starter: 'daily = flights.groupby("flight_date").size().sort_index().head(10)\nanswer = ...\n',
        given: '# flights is already a DataFrame. daily already holds the first 10 real days, sorted.',
        brief: "Using `.expanding()`, compute the running (cumulative) sum of `daily`. Store the **last** value, as an `int`, in `answer`.",
        reference: py`daily = flights.groupby("flight_date").size().sort_index().head(10)
running = daily.expanding().sum()
answer = int(running.iloc[-1])`,
        walkthrough: 'An expanding window always starts from the very first row, growing by one each time — its last value is simply the total of everything so far, the same as `.cumsum()`.',
        traps: [py`daily = flights.groupby("flight_date").size().sort_index().head(10)
running = daily.rolling(3).sum()
answer = int(running.iloc[-1])`],
      }),
    ],
  },
]
