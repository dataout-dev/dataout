import { dat, pdf, py } from './common.js'

export const pandasLessonsA = [
  {
    id: 'py-series-index',
    title: 'Series and the Index',
    blurb: 'Series as a labelled array, index alignment, and vectorised operations.',
    kind: 'code',
    practice: {
      prompt: 'Write `add_series(a, b)`: add two pandas `Series` together, aligned by label, treating a label missing from one side as `0` instead of producing `NaN`.',
      starter: 'import pandas as pd\n\ndef add_series(a, b):\n    ...\n',
      solution: py`import pandas as pd

def add_series(a, b):
    return a.add(b, fill_value=0)`,
      samples: ['add_series(pd.Series([1, 2, 3], index=["a", "b", "c"]), pd.Series([10, 20, 30], index=["a", "b", "c"])).to_dict()'],
      cases: [
        ['Same labels', 'add_series(pd.Series([1, 2, 3], index=["a", "b", "c"]), pd.Series([10, 20, 30], index=["a", "b", "c"])).to_dict()'],
        ['A label missing from b', 'add_series(pd.Series([1, 2, 3], index=["a", "b", "c"]), pd.Series([10, 20], index=["a", "b"])).to_dict()'],
        ['A label missing from a', 'add_series(pd.Series([1, 2], index=["a", "b"]), pd.Series([10, 20, 30], index=["a", "b", "c"])).to_dict()'],
        ['Disjoint labels', 'add_series(pd.Series([1], index=["x"]), pd.Series([2], index=["y"])).to_dict()'],
        ['Return type', 'type(add_series(pd.Series([1], index=["a"]), pd.Series([2], index=["a"]))).__name__'],
      ],
      traps: [
        py`import pandas as pd

def add_series(a, b):
    return a + b`,
        py`import pandas as pd

def add_series(a, b):
    return (a + b).fillna(0)`,
        py`import pandas as pd

def add_series(a, b):
    return a.combine_first(b)`,
      ],
    },
    real: [
      dat({
        title: 'Combining sales counts from two sources',
        use: ['genres'],
        starter: 'names = [g["Name"] for g in genres[:5]]\nimport pandas as pd\na = pd.Series([10, 20, 30, 40, 50], index=names)\nb = pd.Series([1, 2, 3], index=names[:3])\nanswer = ...\n',
        given: '# genres is a list of dictionaries. a and b are Series built from 5 real genre names (b only covers the first 3).',
        brief: 'Add `a` and `b`, aligned by genre name, treating a genre missing from `b` as 0. Store the result as a dict in `answer`.',
        reference: py`names = [g["Name"] for g in genres[:5]]
import pandas as pd
a = pd.Series([10, 20, 30, 40, 50], index=names)
b = pd.Series([1, 2, 3], index=names[:3])
answer = a.add(b, fill_value=0).to_dict()`,
        walkthrough: '`.add(..., fill_value=0)` treats a label missing from one side as 0 before adding, instead of producing `NaN`.',
        traps: [py`names = [g["Name"] for g in genres[:5]]
import pandas as pd
a = pd.Series([10, 20, 30, 40, 50], index=names)
b = pd.Series([1, 2, 3], index=names[:3])
answer = (a + b).to_dict()`],
      }),
      dat({
        title: 'Combining carrier counts from two airports',
        use: ['flights'],
        starter: 'import pandas as pd\nlga = pd.Series([f["carrier"] for f in flights if f["origin"] == "LGA"][:30]).value_counts()\njfk = pd.Series([f["carrier"] for f in flights if f["origin"] == "JFK"][:30]).value_counts()\nanswer = ...\n',
        given: '# flights is a list of dictionaries. lga and jfk are real carrier-count Series from two different origins.',
        brief: 'Add `lga` and `jfk`, aligned by carrier, treating a carrier missing from either side as 0. Store the result as a dict of plain ints in `answer`.',
        reference: py`import pandas as pd
lga = pd.Series([f["carrier"] for f in flights if f["origin"] == "LGA"][:30]).value_counts()
jfk = pd.Series([f["carrier"] for f in flights if f["origin"] == "JFK"][:30]).value_counts()
total = lga.add(jfk, fill_value=0).astype(int)
answer = total.to_dict()`,
        walkthrough: '`value_counts()` indexes by the distinct values seen; two different sets of carriers align on their shared labels and fill in 0 for the rest.',
        traps: [py`import pandas as pd
lga = pd.Series([f["carrier"] for f in flights if f["origin"] == "LGA"][:30]).value_counts()
jfk = pd.Series([f["carrier"] for f in flights if f["origin"] == "JFK"][:30]).value_counts()
total = (lga + jfk).astype(int)
answer = total.to_dict()`],
      }),
      dat({
        title: 'Filling gaps between two overlapping genre counts',
        use: ['genres'],
        starter: 'import pandas as pd\nnames_x = [g["Name"] for g in genres[:4]]\nnames_y = [g["Name"] for g in genres[2:6]]\nyear1 = pd.Series(range(1, 5), index=names_x)\nyear2 = pd.Series(range(10, 14), index=names_y)\nanswer = ...\n',
        given: '# genres is a list of dictionaries. year1 and year2 are Series over overlapping (but not identical) sets of real genre names.',
        brief: 'Add `year1` and `year2`, aligned by genre name, treating a missing genre on either side as 0. Store the result as a dict in `answer`.',
        reference: py`import pandas as pd
names_x = [g["Name"] for g in genres[:4]]
names_y = [g["Name"] for g in genres[2:6]]
year1 = pd.Series(range(1, 5), index=names_x)
year2 = pd.Series(range(10, 14), index=names_y)
answer = year1.add(year2, fill_value=0).to_dict()`,
        walkthrough: 'Two overlapping but not identical sets of labels line up where they share a genre, and each Series contributes 0 wherever the other has nothing.',
        traps: [py`import pandas as pd
names_x = [g["Name"] for g in genres[:4]]
names_y = [g["Name"] for g in genres[2:6]]
year1 = pd.Series(range(1, 5), index=names_x)
year2 = pd.Series(range(10, 14), index=names_y)
answer = (year1 + year2).to_dict()`],
      }),
    ],
  },
  {
    id: 'py-dataframes-creating',
    title: 'DataFrames: creating and inspecting',
    blurb: 'DataFrame from dicts, lists and records; shape, dtypes, describe and value_counts.',
    kind: 'code',
    practice: {
      prompt: 'Write `summarise(df, col)`: return a dict with `"count"` (non-missing values), `"mean"`, `"min"` and `"max"` (as plain floats) for column `col` of DataFrame `df`.',
      starter: 'import pandas as pd\n\ndef summarise(df, col):\n    ...\n',
      solution: py`import pandas as pd

def summarise(df, col):
    s = df[col]
    return {"count": int(s.count()), "mean": float(s.mean()), "min": float(s.min()), "max": float(s.max())}`,
      samples: ['summarise(pd.DataFrame({"x": [1, 2, 3, 4]}), "x")'],
      cases: [
        ['A simple column', 'summarise(pd.DataFrame({"x": [1, 2, 3, 4]}), "x")'],
        ['Count excludes missing values', 'summarise(pd.DataFrame({"x": [1.0, None, 3.0]}), "x")'],
        ['A different column of the same frame', 'summarise(pd.DataFrame({"x": [1, 2], "y": [10, 20]}), "y")'],
        ['Negative numbers', 'summarise(pd.DataFrame({"x": [-5, 0, 5]}), "x")'],
        ['All keys are present', 'sorted(summarise(pd.DataFrame({"x": [1, 2]}), "x").keys())'],
      ],
      traps: [
        py`import pandas as pd

def summarise(df, col):
    s = df[col]
    return {"count": len(s), "mean": float(s.mean()), "min": float(s.min()), "max": float(s.max())}`,
        py`import pandas as pd

def summarise(df, col):
    s = df[col]
    return {"count": int(s.count()), "mean": float(s.sum()), "min": float(s.min()), "max": float(s.max())}`,
        py`import pandas as pd

def summarise(df, col):
    s = df[col]
    return {"count": int(s.count()), "mean": float(s.mean()), "min": float(s.max()), "max": float(s.min())}`,
      ],
    },
    real: [
      pdf({
        title: 'Shape and dtypes of the flights table',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame, loaded from the real dataset.',
        brief: 'Store `(number_of_rows, number_of_columns)` and the dtype **kind** (a one-character string, e.g. `"i"`, `"f"`, `"O"`) of the `distance` column, as `(rows, cols, kind)`, in `answer`.',
        reference: py`answer = (flights.shape[0], flights.shape[1], flights["distance"].dtype.kind)`,
        walkthrough: '`.shape` is `(rows, columns)`; `.dtype.kind` reports the general category of a column\'s type without depending on the exact bit width.',
        traps: [py`answer = (flights.shape[1], flights.shape[0], flights["distance"].dtype.kind)`],
      }),
      pdf({
        title: 'Describing arrival delay',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Using `summarise`-style logic (count, mean, min, max as plain floats/ints), summarise the `arr_delay` column. Store the dict in `answer`.',
        reference: py`s = flights["arr_delay"]
answer = {"count": int(s.count()), "mean": float(s.mean()), "min": float(s.min()), "max": float(s.max())}`,
        walkthrough: '`arr_delay` has real missing values (cancelled flights); `.count()` correctly excludes them, while `len(s)` would not.',
        traps: [py`s = flights["arr_delay"]
answer = {"count": len(s), "mean": float(s.mean()), "min": float(s.min()), "max": float(s.max())}`],
      }),
      pdf({
        title: 'First rows of the Spotify songs',
        use: ['songs'],
        starter: 'answer = ...\n',
        given: '# songs is already a DataFrame.',
        brief: 'Store the **first 3 rows** of `songs`, restricted to the `track` and `artist` columns, as a list of records, in `answer`.',
        reference: py`answer = songs[["track", "artist"]].head(3).to_dict("records")`,
        walkthrough: '`head(3)` takes the first 3 rows; selecting the two columns first keeps the records small and focused.',
        traps: [py`answer = songs[["track", "artist"]].tail(3).to_dict("records")`],
      }),
    ],
  },
  {
    id: 'py-reading-writing-data',
    title: 'Reading and writing data: CSV, JSON, Parquet, SQL',
    blurb: 'read_csv options, to_csv, read_json, and the encoding and leading-zero traps.',
    kind: 'code',
    practice: {
      prompt: 'Write `load(text, dtypes)`: parse CSV text (with a header row) into a DataFrame using `pd.read_csv`, applying the given `dtypes` mapping (column name to type) via its `dtype=` parameter.',
      starter: 'import pandas as pd\nimport io\n\ndef load(text, dtypes):\n    ...\n',
      solution: py`import pandas as pd
import io

def load(text, dtypes):
    return pd.read_csv(io.StringIO(text), dtype=dtypes)`,
      samples: ['load("""a,b\n1,2\n3,4""", {"a": int, "b": int}).to_dict("records")'],
      cases: [
        ['The parsed rows', 'load("""a,b\n1,2\n3,4""", {"a": int, "b": int}).to_dict("records")'],
        ['IDs with leading zeros are preserved as text', 'load("""id\n007\n042""", {"id": str}).to_dict("records")'],
        ['Number of rows', 'len(load("""a\n1\n2\n3""", {"a": int}))'],
        ['Column names', 'list(load("""x,y\n1,2""", {"x": int, "y": int}).columns)'],
      ],
      traps: [
        py`import pandas as pd
import io

def load(text, dtypes):
    return pd.read_csv(io.StringIO(text))`,
        py`import pandas as pd
import io

def load(text, dtypes):
    return pd.read_csv(io.StringIO(text), dtype=str)`,
        py`import pandas as pd
import io

def load(text, dtypes):
    return pd.read_csv(text, dtype=dtypes)`,
      ],
    },
    real: [
      pdf({
        title: 'Round-tripping tracks through CSV text',
        use: ['tracks'],
        starter: 'import io\nsmall = tracks.head(3)[["Name", "Milliseconds"]]\ntext = small.to_csv(index=False)\nanswer = ...\n',
        given: '# tracks is already a DataFrame. text already holds 3 real rows, rendered as CSV.',
        brief: 'Parse `text` back into a DataFrame with `pd.read_csv` and `io.StringIO`, using `dtype={"Milliseconds": int}`. Store the result as a list of records in `answer`.',
        reference: py`import io
small = tracks.head(3)[["Name", "Milliseconds"]]
text = small.to_csv(index=False)
parsed = pd.read_csv(io.StringIO(text), dtype={"Milliseconds": int})
answer = parsed.to_dict("records")`,
        walkthrough: '`to_csv(index=False)` renders the DataFrame as CSV text without an extra index column; `pd.read_csv` with `io.StringIO` reads a string exactly the way it would read a file.',
        traps: [py`import io
small = tracks.head(3)[["Name", "Milliseconds"]]
text = small.to_csv(index=False)
parsed = pd.read_csv(io.StringIO(text))
parsed["Milliseconds"] = parsed["Milliseconds"].astype(str)
answer = parsed.to_dict("records")`],
      }),
      pdf({
        title: 'Round-tripping songs through JSON text',
        use: ['songs'],
        starter: 'import io\nsmall = songs.head(3)[["track", "artist", "spotify_streams"]]\ntext = small.to_json(orient="records")\nanswer = ...\n',
        given: '# songs is already a DataFrame. text already holds 3 real rows, rendered as a JSON array of records.',
        brief: 'Parse `text` back into a DataFrame with `pd.read_json` and `io.StringIO`. Store the result as a list of records in `answer`.',
        reference: py`import io
small = songs.head(3)[["track", "artist", "spotify_streams"]]
text = small.to_json(orient="records")
parsed = pd.read_json(io.StringIO(text))
answer = parsed.to_dict("records")`,
        walkthrough: '`orient="records"` produces a JSON array of objects, one per row, which `pd.read_json` parses back into the same shape.',
        traps: [py`import io
small = songs.head(3)[["track", "artist", "spotify_streams"]]
text = small.to_json(orient="records")
parsed = pd.read_json(io.StringIO(text), orient="split")
answer = parsed.to_dict("records")`],
      }),
      pdf({
        title: 'Reading CSV with a missing-value marker',
        use: ['tracks'],
        starter: 'import io\np1, p2 = tracks["UnitPrice"].iloc[0], tracks["UnitPrice"].iloc[1]\ntext = f"""price,qty\n{p1},10\nMISSING,5\n{p2},20"""\nanswer = ...\n',
        given: '# tracks is already a DataFrame. text mixes two real prices with a literal "MISSING" marking a missing one.',
        brief: 'Parse `text` with `pd.read_csv` and `io.StringIO`, telling pandas that the text `"MISSING"` marks a missing value (`na_values="MISSING"`). Store the result as a list of records in `answer`.',
        reference: py`import io
p1, p2 = tracks["UnitPrice"].iloc[0], tracks["UnitPrice"].iloc[1]
text = f"""price,qty
{p1},10
MISSING,5
{p2},20"""
parsed = pd.read_csv(io.StringIO(text), na_values="MISSING")
answer = parsed.to_dict("records")`,
        walkthrough: '`na_values="MISSING"` tells `read_csv` to treat that exact text as missing, converting it to a real `NaN` instead of leaving the literal string `"MISSING"` in the column (which would silently turn the whole column into text). Pandas only recognises a handful of markers like `"NA"` or `"NaN"` automatically; anything else needs to be named explicitly.',
        traps: [py`import io
p1, p2 = tracks["UnitPrice"].iloc[0], tracks["UnitPrice"].iloc[1]
text = f"""price,qty
{p1},10
MISSING,5
{p2},20"""
parsed = pd.read_csv(io.StringIO(text))
answer = parsed.to_dict("records")`],
      }),
    ],
  },
  {
    id: 'py-selecting-loc-iloc',
    title: 'Selecting data: [], loc, iloc, at and iat',
    blurb: 'Column selection, label versus position, and slicing with loc (inclusive) and iloc (exclusive).',
    kind: 'code',
    practice: {
      prompt: 'Write `block(df)`: return rows at **positions** 10 through 19 inclusive, restricted to columns `"a"` and `"b"`, using `iloc` for the rows and `loc` (or plain column selection) for the columns — in that order.',
      starter: 'import pandas as pd\n\ndef block(df):\n    ...\n',
      solution: py`import pandas as pd

def block(df):
    return df.iloc[10:20].loc[:, ["a", "b"]]`,
      samples: ['block(pd.DataFrame({"a": range(30), "b": range(30), "c": range(30)})).shape'],
      cases: [
        ['The shape is (10, 2)', 'block(pd.DataFrame({"a": range(30), "b": range(30), "c": range(30)})).shape'],
        ['The columns kept', 'list(block(pd.DataFrame({"a": range(30), "b": range(30), "c": range(30)})).columns)'],
        ['The first value of the block', 'int(block(pd.DataFrame({"a": range(30), "b": range(30), "c": range(30)}))["a"].iloc[0])'],
        ['The last value of the block', 'int(block(pd.DataFrame({"a": range(30), "b": range(30), "c": range(30)}))["a"].iloc[-1])'],
      ],
      traps: [
        py`import pandas as pd

def block(df):
    return df.iloc[10:19].loc[:, ["a", "b"]]`,
        py`import pandas as pd

def block(df):
    return df.loc[10:20, ["a", "b"]]`,
        py`import pandas as pd

def block(df):
    return df.iloc[10:20].loc[:, ["a", "c"]]`,
      ],
    },
    real: [
      pdf({
        title: 'Selecting three columns of flights',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Using plain column selection, return `carrier`, `origin` and `dep_delay` for the first 5 rows, as a list of records, in `answer`.',
        reference: py`answer = flights[["carrier", "origin", "dep_delay"]].head(5).to_dict("records")`,
        walkthrough: 'A list of column names inside `[...]` selects several columns at once, in that order.',
        traps: [py`answer = flights[["carrier", "origin", "distance"]].head(5).to_dict("records")`],
      }),
      pdf({
        title: 'Slicing a block of February flights by position',
        use: ['flights'],
        starter: 'feb = flights[flights["month"] == 2].reset_index(drop=True)\nanswer = ...\n',
        given: '# flights is already a DataFrame. feb keeps only February, reindexed from 0.',
        brief: 'Using `iloc`, return rows at positions 0 through 4 (5 rows) of `feb`, columns `carrier` and `distance` only. Store as a list of records in `answer`.',
        reference: py`feb = flights[flights["month"] == 2].reset_index(drop=True)
answer = feb.iloc[0:5][["carrier", "distance"]].to_dict("records")`,
        walkthrough: '`iloc` always counts positions, `0` up to (not including) `5`, regardless of what the index labels happen to be.',
        traps: [py`feb = flights[flights["month"] == 2].reset_index(drop=True)
answer = feb.iloc[0:6][["carrier", "distance"]].to_dict("records")`],
      }),
      pdf({
        title: "The first 50 Spotify songs' titles",
        use: ['songs'],
        starter: 'answer = ...\n',
        given: '# songs is already a DataFrame.',
        brief: 'Using `loc`, return the `track` column for row **labels** 0 through 49 **inclusive** (50 rows, since `loc` includes both ends). Store the list of titles in `answer`.',
        reference: py`answer = songs.loc[0:49, "track"].tolist()`,
        walkthrough: 'Unlike `iloc`, a `loc` slice includes its final label — `0:49` is 50 rows, not 49.',
        traps: [py`answer = songs.loc[0:50, "track"].tolist()`],
      }),
    ],
  },
  {
    id: 'py-filtering-masks-query',
    title: 'Filtering: masks, query, isin and between',
    blurb: 'Boolean masks with & | ~, isin, between, and how NaN behaves in comparisons.',
    kind: 'code',
    practice: {
      prompt: 'Write `long_delays(df, minutes)`: return the rows of `df` whose `dep_delay` is **at least** `minutes`, in their original order.',
      starter: 'import pandas as pd\n\ndef long_delays(df, minutes):\n    ...\n',
      solution: py`import pandas as pd

def long_delays(df, minutes):
    return df[df["dep_delay"] >= minutes]`,
      samples: ['long_delays(pd.DataFrame({"dep_delay": [5, 65, -3, 120]}), 60).to_dict("records")'],
      cases: [
        ['A mix of delays', 'long_delays(pd.DataFrame({"dep_delay": [5, 65, -3, 120]}), 60).to_dict("records")'],
        ['The boundary is inclusive', 'long_delays(pd.DataFrame({"dep_delay": [59, 60, 61]}), 60).to_dict("records")'],
        ['Missing values are excluded', 'long_delays(pd.DataFrame({"dep_delay": [100.0, None, 200.0]}), 50).to_dict("records")'],
        ['None qualify', 'len(long_delays(pd.DataFrame({"dep_delay": [1, 2, 3]}), 1000))'],
        ['A very early departure is not "long"', 'long_delays(pd.DataFrame({"dep_delay": [-100, 5]}), 60).to_dict("records")'],
        ['Original order is kept', 'long_delays(pd.DataFrame({"dep_delay": [80, 10, 70, 5]}), 50)["dep_delay"].tolist()'],
      ],
      traps: [
        py`import pandas as pd

def long_delays(df, minutes):
    return df[df["dep_delay"] > minutes]`,
        py`import pandas as pd

def long_delays(df, minutes):
    return df.sort_values("dep_delay")[df["dep_delay"] >= minutes]`,
        py`import pandas as pd

def long_delays(df, minutes):
    return df[df["dep_delay"].abs() >= minutes]`,
      ],
    },
    real: [
      pdf({
        title: 'Flights delayed over two hours in January',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Filter to January flights (`month == 1`) with `dep_delay` over 120 minutes. Store the **count** (an `int`) in `answer`.',
        reference: py`mask = (flights["month"] == 1) & (flights["dep_delay"] > 120)
answer = int(mask.sum())`,
        walkthrough: 'Two boolean masks, each in parentheses, combine with `&` into one mask that is `True` only where both conditions hold.',
        traps: [py`mask = (flights["month"] == 1) | (flights["dep_delay"] > 120)
answer = int(mask.sum())`],
      }),
      pdf({
        title: 'JFK to LAX flights',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Using `.isin` or plain equality, count the flights with `origin == "JFK"` and `dest == "LAX"`. Store the count (an `int`) in `answer`.',
        reference: py`mask = (flights["origin"] == "JFK") & (flights["dest"] == "LAX")
answer = int(mask.sum())`,
        walkthrough: 'Both conditions must hold at once for the same row, which is exactly what `&` between two boolean masks expresses.',
        traps: [py`mask = flights["origin"].isin(["JFK", "LAX"])
answer = int(mask.sum())`],
      }),
      pdf({
        title: 'Flights with missing arrival delay',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Count how many rows have a **missing** `arr_delay` (use `.isna()`, not `== None`). Store the count (an `int`) in `answer`.',
        reference: py`answer = int(flights["arr_delay"].isna().sum())`,
        walkthrough: '`NaN` never equals anything, including itself, so `== None` or `== float("nan")` silently matches nothing; `.isna()` is the correct, explicit check.',
        traps: [py`answer = int((flights["arr_delay"] == None).sum())`],
      }),
    ],
  },
  {
    id: 'py-creating-transforming-columns',
    title: 'Creating and transforming columns',
    blurb: 'assign, arithmetic on columns, map/replace, and np.where for conditional columns.',
    kind: 'code',
    practice: {
      prompt: 'Write `add_speed(df)`: return a **new** DataFrame (the input must not change) with an added `speed` column, `distance / air_time * 60` (miles per hour), rounded to 1 decimal.',
      starter: 'import pandas as pd\n\ndef add_speed(df):\n    ...\n',
      solution: py`import pandas as pd

def add_speed(df):
    return df.assign(speed=(df["distance"] / df["air_time"] * 60).round(1))`,
      samples: ['add_speed(pd.DataFrame({"distance": [120.0], "air_time": [60.0]}))["speed"].tolist()'],
      cases: [
        ['A simple row', 'add_speed(pd.DataFrame({"distance": [120.0], "air_time": [60.0]}))["speed"].tolist()'],
        ['Several rows', 'add_speed(pd.DataFrame({"distance": [300.0, 600.0], "air_time": [60.0, 120.0]}))["speed"].tolist()'],
        ['The original columns survive', 'sorted(add_speed(pd.DataFrame({"distance": [120.0], "air_time": [60.0]})).columns)'],
        ['Does not mutate the input', 'df = pd.DataFrame({"distance": [120.0], "air_time": [60.0]})\nadd_speed(df)\nlist(df.columns)'],
      ],
      traps: [
        py`import pandas as pd

def add_speed(df):
    df["speed"] = (df["distance"] / df["air_time"] * 60).round(1)
    return df`,
        py`import pandas as pd

def add_speed(df):
    return df.assign(speed=(df["distance"] / df["air_time"]).round(1))`,
        py`import pandas as pd

def add_speed(df):
    return df.assign(speed=(df["air_time"] / df["distance"] * 60).round(1))`,
      ],
    },
    real: [
      pdf({
        title: 'Speed of every flight',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Add a `speed` column (`distance / air_time * 60`, rounded to 1 decimal) without mutating `flights`. Store the **mean** speed, ignoring missing values, rounded to 2 decimals, in `answer`.',
        reference: py`with_speed = flights.assign(speed=(flights["distance"] / flights["air_time"] * 60).round(1))
answer = round(float(with_speed["speed"].mean()), 2)`,
        walkthrough: '`.assign` returns a new frame with the extra column, leaving `flights` itself untouched; the mean then ignores the rows where `air_time` (and so `speed`) is missing.',
        traps: [py`with_speed = flights.assign(speed=(flights["air_time"] / flights["distance"] * 60).round(1))
answer = round(float(with_speed["speed"].mean()), 2)`],
      }),
      pdf({
        title: 'Categorising delays with np.where',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame.',
        brief: 'Add a column `late` that is `True` when `dep_delay > 15`, else `False` (missing counts as not late). Store how many rows are `late`, as an `int`, in `answer`.',
        reference: py`with_flag = flights.assign(late=np.where(flights["dep_delay"] > 15, True, False))
answer = int(with_flag["late"].sum())`,
        walkthrough: 'A comparison against a missing value is always `False`, so cancelled flights (with no `dep_delay`) are correctly excluded from "late" here.',
        traps: [py`with_flag = flights.assign(late=np.where(flights["dep_delay"] >= 15, True, False))
answer = int(with_flag["late"].sum())`],
      }),
      pdf({
        title: 'Departure time in minutes since midnight',
        use: ['flights'],
        starter: 'answer = ...\n',
        given: '# flights is already a DataFrame. dep_time is stored as an HHMM number, e.g. 517 means 5:17 am.',
        brief: 'Add a column `dep_minutes` converting `dep_time` (an HHMM number) into minutes since midnight: `(dep_time // 100) * 60 + dep_time % 100`. Store the value for the **first** row, as an `int`, in `answer`.',
        reference: py`with_minutes = flights.assign(dep_minutes=(flights["dep_time"] // 100) * 60 + flights["dep_time"] % 100)
answer = int(with_minutes["dep_minutes"].iloc[0])`,
        walkthrough: 'Integer division by 100 recovers the hour; the remainder is the minute, so the formula reconstructs total minutes since midnight without ever parsing text.',
        traps: [py`with_minutes = flights.assign(dep_minutes=flights["dep_time"])
answer = int(with_minutes["dep_minutes"].iloc[0])`],
      }),
    ],
  },
]
