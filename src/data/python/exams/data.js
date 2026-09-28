const py = String.raw

const LOAD =
  "import pandas as pd\nimport numpy as np\nflights = pd.DataFrame(rows('nycflights13', 'flights'))\npenguins = pd.DataFrame(rows('palmer-penguins', 'penguins'))\n"

const code = (c) => ({ kind: 'code', points: 10, dataset: 'nycflights13', starter: 'answer = ', ...c, hidden: LOAD + (c.hidden ?? '') })

export const dataExam = [
  code({
    id: 'data-exam-1',
    starter: 'a = np.array([[1.0, 100.0], [2.0, 300.0], [3.0, 200.0], [4.0, 400.0]])\nanswer = ...\n',
    given: '# a is a small 2-D array, columns on very different scales.',
    task: "Standardise every column of `a` (subtract each column's mean, divide by that column's standard deviation, `ddof=0`). Store `(mean_of_col0, std_of_col0)` of the *result*, rounded to 6 decimals, in `answer` (both should be effectively 0 and 1).",
    reference: py`a = np.array([[1.0, 100.0], [2.0, 300.0], [3.0, 200.0], [4.0, 400.0]])
z = (a - a.mean(axis=0)) / a.std(axis=0)
answer = (round(float(z[:, 0].mean()), 6), round(float(z[:, 0].std()), 6))`,
    walkthrough: 'Standardising by column (`axis=0`) makes every column have mean 0 and standard deviation 1, which is exactly what checking the result\'s own mean and std confirms.',
    traps: [py`a = np.array([[1.0, 100.0], [2.0, 300.0], [3.0, 200.0], [4.0, 400.0]])
z = (a - a.mean(axis=1, keepdims=True)) / a.std(axis=1, keepdims=True)
answer = (round(float(z[:, 0].mean()), 6), round(float(z[:, 0].std()), 6))`],
  }),
  {
    id: 'data-exam-2',
    kind: 'mcq',
    points: 10,
    q: 'A junior analyst writes `df[df["score"] > 90]["grade"] = "A"` to update a DataFrame, then finds `df` unchanged. What went wrong?',
    options: [
      'pandas does not support conditional assignment at all',
      '`df[mask]` builds a temporary, filtered copy; assigning into it (chained indexing) writes to that throwaway copy, not `df` itself — `df.loc[mask, "grade"] = "A"` is the safe, single-call form',
      'The condition `> 90` is invalid syntax',
      '`df` was read-only from the start',
    ],
    answer: 1,
    why: 'Chained indexing (`df[mask][col] = value`) performs two separate operations; the first can return a copy, so the assignment silently lands on that copy instead of the original frame. A single `.loc[mask, col] = value` call is the safe alternative.',
  },
  code({
    id: 'data-exam-3',
    starter: 'answer = ...\n',
    given: '# flights is already loaded as a DataFrame.',
    task: 'Find the 10 worst `(origin, dest)` routes by average `arr_delay`, considering only routes with at least 200 non-missing-delay flights. Store the single worst route as `(origin, dest)`, both plain strings, in `answer`.',
    reference: py`by_route = flights.dropna(subset=["arr_delay"]).groupby(["origin", "dest"])["arr_delay"]
counted = by_route.count()
averaged = by_route.mean()
eligible = averaged[counted >= 200].sort_values(ascending=False)
answer = tuple(str(x) for x in eligible.index[0])`,
    walkthrough: 'Filtering by `counted >= 200` before sorting keeps a route with only a handful of unlucky flights from dominating the ranking.',
    traps: [py`by_route = flights.dropna(subset=["arr_delay"]).groupby(["origin", "dest"])["arr_delay"]
averaged = by_route.mean().sort_values(ascending=False)
answer = tuple(str(x) for x in averaged.index[0])`],
  }),
  code({
    id: 'data-exam-4',
    starter: 'answer = ...\n',
    given: '# flights is already loaded as a DataFrame.',
    task: 'Build a pivot table of mean `dep_delay`, `origin` as rows and `month` as columns. Store the value for `origin="JFK"`, `month=7`, rounded to 2 decimals, in `answer`.',
    reference: py`pivot = flights.pivot_table(index="origin", columns="month", values="dep_delay", aggfunc="mean")
answer = round(float(pivot.loc["JFK", 7]), 2)`,
    walkthrough: 'A pivot table with `origin` as the index and `month` as the columns puts exactly one mean delay in each (origin, month) cell, read directly with `.loc`.',
    traps: [py`pivot = flights.pivot_table(index="month", columns="origin", values="dep_delay", aggfunc="mean")
answer = round(float(pivot.loc["JFK", 7]), 2)`],
  }),
  {
    id: 'data-exam-5',
    kind: 'mcq',
    points: 10,
    q: 'Asked to show whether flight delays differ by carrier (several carriers, one number per carrier to compare), which chart is the most honest, direct choice?',
    options: [
      'A pie chart, one slice per carrier',
      "A bar chart of average delay per carrier — position and length are judged far more accurately than a pie slice's angle for this kind of comparison",
      'A single 3-D pie chart for visual impact',
      'No chart is appropriate for this comparison',
    ],
    answer: 1,
    why: 'This is a comparison task with a handful of categories, which position/length (a bar chart) communicates far more accurately than angle or area (a pie chart) — and a 3-D effect would distort the comparison further, not help it.',
  },
  code({
    id: 'data-exam-6',
    starter: 'sample = [f["dep_delay"] for f in flights["dep_delay"].dropna().head(60).tolist()]\nanswer = ...\n',
    given: '# flights is already loaded as a DataFrame. sample is not actually needed as written below; use flights directly.',
    task: 'Using `rng = np.random.default_rng(0)`, bootstrap **2000** resamples of the first 60 non-missing `dep_delay` values (drawn with one call `rng.choice(a, size=(2000, len(a)), replace=True)`), and compute the **median** (not the mean) of each resample. Store the `(2.5th, 97.5th)` percentile of those medians, each rounded to 2 decimals, in `answer`.',
    reference: py`a = flights["dep_delay"].dropna().head(60).to_numpy(dtype=float)
rng = np.random.default_rng(0)
resamples = rng.choice(a, size=(2000, len(a)), replace=True)
medians = np.median(resamples, axis=1)
lo, hi = np.percentile(medians, [2.5, 97.5])
answer = (round(float(lo), 2), round(float(hi), 2))`,
    walkthrough: 'The bootstrap works identically for the median as for the mean: resample with replacement, compute the statistic on each resample, and read off percentiles of the resulting distribution.',
    traps: [py`a = flights["dep_delay"].dropna().head(60).to_numpy(dtype=float)
rng = np.random.default_rng(0)
resamples = rng.choice(a, size=(2000, len(a)), replace=True)
means = np.mean(resamples, axis=1)
lo, hi = np.percentile(means, [2.5, 97.5])
answer = (round(float(lo), 2), round(float(hi), 2))`],
  }),
  {
    id: 'data-exam-7',
    kind: 'mcq',
    points: 10,
    q: 'A two-sample t-test comparing two carriers\' delays returns a p-value of 0.02. What is the correct interpretation?',
    options: [
      'There is a 2% probability that the two carriers really have the same average delay',
      'If the two carriers truly had the same average delay, data at least this different would show up only about 2% of the time by chance — reasonably strong evidence against "no difference", not proof of one',
      'The test proves the two carriers definitely differ',
      'The p-value means 98% of flights were on time',
    ],
    answer: 1,
    why: 'A p-value is `P(data this extreme | the null hypothesis is true)`, never `P(the null hypothesis is true | this data)` — a common and important distinction covered in the hypothesis testing lesson.',
  },
  code({
    id: 'data-exam-8',
    starter: 'sub = penguins[penguins["species"].isin(["Adelie", "Gentoo"])].dropna(subset=["bill_length_mm", "body_mass_g"])\nanswer = ...\n',
    given: '# penguins is already loaded as a DataFrame. sub already holds two real species with no missing values in the two features used below.',
    task: 'Build `X` from `bill_length_mm` and `body_mass_g`, `y` from `species` (Adelie vs Gentoo). Split with `train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)`, fit a `Pipeline` (`StandardScaler` then `LogisticRegression(max_iter=1000)`), and report `(precision, recall)` for the positive class `"Gentoo"` on the test data, each rounded to 4 decimals, in `answer`.',
    reference: py`from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_score, recall_score

sub = penguins[penguins["species"].isin(["Adelie", "Gentoo"])].dropna(subset=["bill_length_mm", "body_mass_g"])
X = sub[["bill_length_mm", "body_mass_g"]]
y = sub["species"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
pipe.fit(X_train, y_train)
preds = pipe.predict(X_test)
answer = (
    round(float(precision_score(y_test, preds, pos_label="Gentoo")), 4),
    round(float(recall_score(y_test, preds, pos_label="Gentoo")), 4),
)`,
    walkthrough: '`pos_label="Gentoo"` tells precision/recall which class counts as "positive" — without it, scikit-learn would pick a class alphabetically or raise, neither of which is what was actually asked for.',
    traps: [py`from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_score, recall_score

sub = penguins[penguins["species"].isin(["Adelie", "Gentoo"])].dropna(subset=["bill_length_mm", "body_mass_g"])
X = sub[["bill_length_mm", "body_mass_g"]]
y = sub["species"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0, stratify=y)
pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
pipe.fit(X_train, y_train)
preds = pipe.predict(X_test)
answer = (
    round(float(precision_score(y_test, preds, pos_label="Gentoo")), 4),
    round(float(recall_score(y_test, preds, pos_label="Gentoo")), 4),
)`],
  }),
  {
    id: 'data-exam-9',
    kind: 'mcq',
    points: 10,
    q: 'Which of the following is an example of data leakage?',
    options: [
      'Splitting data into train and test sets before fitting anything',
      'Fitting a `StandardScaler` on the *entire* dataset, then splitting into train and test and using that same fitted scaler on both',
      'Fitting a `StandardScaler` only on the training data, then applying it to both the training and test data',
      'Using `stratify=y` when splitting an imbalanced classification target',
    ],
    answer: 1,
    why: "Fitting the scaler on the full dataset lets the test set's own mean and standard deviation influence how every value (including training values) gets scaled — a leak of test-set information into training, however small it looks. Fitting only on the training data (option 3) is the correct order.",
  },
  code({
    id: 'data-exam-10',
    starter: 'import sqlite3\nconn = sqlite3.connect(":memory:")\nflights[["carrier", "dep_delay"]].dropna().to_sql("f", conn, index=False)\nanswer = ...\n',
    given: '# flights is already loaded as a DataFrame. conn already holds it (carrier, dep_delay only, missing delays dropped) as a real SQL table.',
    task: 'First compute the average `dep_delay` per carrier with plain pandas (`groupby`). Then reproduce the *same* result with a SQL query against `conn` (`SELECT carrier, AVG(dep_delay) ... GROUP BY carrier`). Store `(pandas_avg_for_AA, sql_avg_for_AA)`, both rounded to 2 decimals, in `answer` — they should match.',
    reference: py`import sqlite3
conn = sqlite3.connect(":memory:")
flights[["carrier", "dep_delay"]].dropna().to_sql("f", conn, index=False)
pandas_result = flights.dropna(subset=["dep_delay"]).groupby("carrier")["dep_delay"].mean()
sql_result = pd.read_sql("SELECT carrier, AVG(dep_delay) AS avg_delay FROM f GROUP BY carrier", conn)
sql_aa = sql_result[sql_result["carrier"] == "AA"]["avg_delay"].iloc[0]
answer = (round(float(pandas_result["AA"]), 2), round(float(sql_aa), 2))`,
    walkthrough: 'pandas\' `groupby(...).mean()` and SQL\'s `GROUP BY ... AVG(...)` compute the exact same aggregation; reproducing a result both ways is a good sanity check that either implementation is correct.',
    traps: [py`import sqlite3
conn = sqlite3.connect(":memory:")
flights[["carrier", "dep_delay"]].dropna().to_sql("f", conn, index=False)
pandas_result = flights.dropna(subset=["dep_delay"]).groupby("carrier")["dep_delay"].mean()
sql_result = pd.read_sql("SELECT carrier, SUM(dep_delay) AS avg_delay FROM f GROUP BY carrier", conn)
sql_aa = sql_result[sql_result["carrier"] == "AA"]["avg_delay"].iloc[0]
answer = (round(float(pandas_result["AA"]), 2), round(float(sql_aa), 2))`],
  }),
]
