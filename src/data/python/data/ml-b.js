import { dat, py } from './common.js'

const skl = (c) => dat({ ...c, hidden: 'import numpy as np\n' + (c.hidden ?? '') })

export const mlLessonsB = [
  {
    id: 'py-preprocessing-pipelines',
    title: 'Preprocessing and pipelines',
    blurb: 'StandardScaler, encoders, imputers, ColumnTransformer, and Pipeline to avoid leakage.',
    kind: 'code',
    practice: {
      prompt: 'Write `make_pipeline_score(X_train, y_train, X_test, y_test)`: build a `Pipeline` with a `SimpleImputer()`, then a `StandardScaler()`, then a `LogisticRegression(max_iter=1000)`, fit it, and return its accuracy on the test data.',
      starter: 'from sklearn.pipeline import Pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\ndef make_pipeline_score(X_train, y_train, X_test, y_test):\n    ...\n',
      solution: py`from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

def make_pipeline_score(X_train, y_train, X_test, y_test):
    pipe = Pipeline([
        ("impute", SimpleImputer()),
        ("scale", StandardScaler()),
        ("model", LogisticRegression(max_iter=1000)),
    ])
    pipe.fit(X_train, y_train)
    return float(pipe.score(X_test, y_test))`,
      samples: ['round(make_pipeline_score([[0], [1], [2], [None]], [0, 0, 1, 1], [[3], [0]], [1, 0]), 3)'],
      cases: [
        ['A dataset with a missing value', 'round(make_pipeline_score([[0], [1], [2], [None]], [0, 0, 1, 1], [[3], [0]], [1, 0]), 3)'],
        ['Returns a plain float', 'type(make_pipeline_score([[0], [1], [2], [None]], [0, 0, 1, 1], [[3], [0]], [1, 0])) is float'],
      ],
      traps: [
        py`from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

def make_pipeline_score(X_train, y_train, X_test, y_test):
    pipe = Pipeline([
        ("scale", StandardScaler()),
        ("model", LogisticRegression(max_iter=1000)),
    ])
    pipe.fit(X_train, y_train)
    return float(pipe.score(X_test, y_test))`,
        py`from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

def make_pipeline_score(X_train, y_train, X_test, y_test):
    pipe = Pipeline([
        ("impute", SimpleImputer()),
        ("scale", StandardScaler()),
        ("model", LogisticRegression(max_iter=1000)),
    ])
    pipe.fit(X_train, y_train)
    return float(pipe.score(X_train, y_train))`,
      ],
    },
    real: [
      skl({
        title: 'A pipeline handling missing penguin measurements',
        use: ['penguins'],
        starter: 'from sklearn.pipeline import Pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nsub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo")]\nX = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]\ny = [0 if p["species"] == "Adelie" else 1 for p in sub]\nn = len(X)\nsplit = int(n * 0.8)\nX_train, X_test = X[:split], X[split:]\ny_train, y_test = y[:split], y[split:]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. X includes rows with a real missing measurement (None), left in on purpose.',
        brief: 'Using the same pipeline as the practice, fit on the training data and store the test accuracy, rounded to 3 decimals, in `answer`.',
        reference: py`from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo")]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
pipe = Pipeline([
    ("impute", SimpleImputer()),
    ("scale", StandardScaler()),
    ("model", LogisticRegression(max_iter=1000)),
])
pipe.fit(X_train, y_train)
answer = round(float(pipe.score(X_test, y_test)), 3)`,
        walkthrough: 'The `SimpleImputer` fills any missing measurement (with the column mean, by default) automatically as part of the pipeline, so a real, imperfect dataset can flow straight through without a separate cleaning step.',
        traps: [py`from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo")]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
pipe = Pipeline([
    ("impute", SimpleImputer(strategy="most_frequent")),
    ("scale", StandardScaler()),
    ("model", LogisticRegression(max_iter=1000)),
])
pipe.fit(X_train, y_train)
answer = round(float(pipe.score(X_test, y_test)), 3)`],
      }),
      skl({
        title: 'Comparing a pipeline with and without scaling',
        use: ['songs'],
        starter: 'from sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nsub = [s for s in songs if s["spotify_streams"] is not None and s["spotify_popularity"] is not None][:300]\nX = [[s["spotify_streams"], s["spotify_popularity"]] for s in sub]\ny = [s["explicit_track"] for s in sub]\nn = len(X)\nsplit = int(n * 0.8)\nX_train, X_test = X[:split], X[split:]\ny_train, y_test = y[:split], y[split:]\nanswer = ...\n',
        given: '# songs is a list of dictionaries. X mixes a huge-range column (streams) with a small-range one (popularity).',
        brief: 'Fit a pipeline **with** `StandardScaler` and one **without**, both ending in `LogisticRegression(max_iter=1000)`. Store `(with_scaling, without_scaling)` test accuracy, each rounded to 3 decimals, in `answer`.',
        reference: py`from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
sub = [s for s in songs if s["spotify_streams"] is not None and s["spotify_popularity"] is not None][:300]
X = [[s["spotify_streams"], s["spotify_popularity"]] for s in sub]
y = [s["explicit_track"] for s in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
with_scale = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
with_scale.fit(X_train, y_train)
without_scale = Pipeline([("model", LogisticRegression(max_iter=1000))])
without_scale.fit(X_train, y_train)
answer = (round(float(with_scale.score(X_test, y_test)), 3), round(float(without_scale.score(X_test, y_test)), 3))`,
        walkthrough: 'A huge-range column like raw stream counts can dominate a model that is sensitive to feature scale; standardising first puts every feature on a comparable footing.',
        traps: [py`from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
sub = [s for s in songs if s["spotify_streams"] is not None and s["spotify_popularity"] is not None][:300]
X = [[s["spotify_streams"], s["spotify_popularity"]] for s in sub]
y = [s["explicit_track"] for s in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
without_scale = Pipeline([("model", LogisticRegression(max_iter=1000))])
without_scale.fit(X_train, y_train)
with_scale = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
with_scale.fit(X_train, y_train)
answer = (round(float(without_scale.score(X_test, y_test)), 3), round(float(with_scale.score(X_test, y_test)), 3))`],
      }),
      skl({
        title: 'Saving and loading a fitted pipeline',
        use: ['penguins'],
        starter: 'import joblib, io\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nsub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None]\nX = [[p["bill_length_mm"]] for p in sub]\ny = [0 if p["species"] == "Adelie" else 1 for p in sub]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. X and y already hold real features and labels.',
        brief: 'Fit a `Pipeline` (scaler + logistic regression) on all of `X`/`y`, save it to an in-memory buffer with `joblib.dump`, load it back with `joblib.load`, and check the loaded pipeline gives the **same** prediction as the original for the first row. Store that boolean in `answer`.',
        reference: py`import joblib, io
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None]
X = [[p["bill_length_mm"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
pipe.fit(X, y)
buffer = io.BytesIO()
joblib.dump(pipe, buffer)
buffer.seek(0)
loaded = joblib.load(buffer)
answer = bool(loaded.predict(X[:1])[0] == pipe.predict(X[:1])[0])`,
        walkthrough: '`joblib` serialises a fitted pipeline (including every step\'s learned parameters) so it can be saved once and reloaded later without retraining.',
        traps: [py`import joblib, io
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None]
X = [[p["bill_length_mm"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
pipe.fit(X, y)
buffer = io.BytesIO()
joblib.dump(pipe, buffer)
buffer.seek(0)
loaded = joblib.load(buffer)
fresh_unfit = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
answer = bool(loaded.predict(X[:1])[0] == fresh_unfit.predict(X[:1])[0])`],
      }),
    ],
  },
  {
    id: 'py-clustering-dimensionality-reduction',
    title: 'Clustering and dimensionality reduction',
    blurb: 'k-means, choosing k, PCA for compression and visualisation, and silhouette score.',
    kind: 'code',
    practice: {
      prompt: 'Write `cluster(X, k)`: using `KMeans(n_clusters=k, random_state=0, n_init=10)`, fit and return the cluster label of each point, as a list of ints.',
      starter: 'from sklearn.cluster import KMeans\n\ndef cluster(X, k):\n    ...\n',
      solution: py`from sklearn.cluster import KMeans

def cluster(X, k):
    model = KMeans(n_clusters=k, random_state=0, n_init=10)
    labels = model.fit_predict(X)
    return [int(v) for v in labels]`,
      samples: ['cluster([[0, 0], [0.1, 0], [10, 10], [10.1, 10]], 2)'],
      cases: [
        ['Two obvious clusters', 'len(set(cluster([[0, 0], [0.1, 0], [10, 10], [10.1, 10]], 2)))'],
        ['Same-cluster points share a label', 'labels = cluster([[0, 0], [0.1, 0], [10, 10], [10.1, 10]], 2)\nlabels[0] == labels[1]'],
        ['Different clusters get different labels', 'labels = cluster([[0, 0], [0.1, 0], [10, 10], [10.1, 10]], 2)\nlabels[0] != labels[2]'],
        ['Uses every column, not just the first', 'labels = cluster([[0, 0], [0, 1], [10, 0], [10, 100]], 2)\nlabels[0] == labels[2]'],
      ],
      traps: [
        py`from sklearn.cluster import KMeans

def cluster(X, k):
    model = KMeans(n_clusters=k, random_state=0, n_init=10)
    X_first_col_only = [[row[0]] for row in X]
    labels = model.fit_predict(X_first_col_only)
    return [int(v) for v in labels]`,
        py`from sklearn.cluster import KMeans

def cluster(X, k):
    model = KMeans(n_clusters=k + 1, random_state=0, n_init=10)
    labels = model.fit_predict(X)
    return [int(v) for v in labels]`,
      ],
    },
    real: [
      skl({
        title: 'Clustering penguins by body measurements',
        use: ['penguins'],
        starter: 'from sklearn.cluster import KMeans\nfrom sklearn.preprocessing import StandardScaler\nsub = [p for p in penguins if p["bill_length_mm"] is not None and p["body_mass_g"] is not None][:100]\nX = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. X already holds 100 real (bill length, mass) pairs.',
        brief: 'Standardise `X` with `StandardScaler`, then cluster into 3 groups with `KMeans(n_clusters=3, random_state=0, n_init=10)`. Store the number of points in the **largest** cluster, as an `int`, in `answer`.',
        reference: py`from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from collections import Counter
sub = [p for p in penguins if p["bill_length_mm"] is not None and p["body_mass_g"] is not None][:100]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
scaled = StandardScaler().fit_transform(X)
model = KMeans(n_clusters=3, random_state=0, n_init=10)
labels = model.fit_predict(scaled)
answer = int(max(Counter(labels).values()))`,
        walkthrough: 'Standardising first matters here: bill length (tens of millimetres) and body mass (thousands of grams) are on very different scales, and k-means measures plain distance, which would otherwise be dominated by mass alone.',
        traps: [py`from sklearn.cluster import KMeans
sub = [p for p in penguins if p["bill_length_mm"] is not None and p["body_mass_g"] is not None][:100]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
model = KMeans(n_clusters=3, random_state=0, n_init=10)
labels = model.fit_predict(X)
from collections import Counter
answer = int(max(Counter(labels).values()))`],
      }),
      skl({
        title: 'Silhouette score for a choice of k',
        use: ['penguins'],
        starter: 'from sklearn.cluster import KMeans\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import silhouette_score\nsub = [p for p in penguins if p["bill_length_mm"] is not None and p["body_mass_g"] is not None][:100]\nX = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]\nscaled = StandardScaler().fit_transform(X)\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. scaled already holds 100 real, standardised (bill length, mass) pairs.',
        brief: 'Compute the silhouette score for `k=2` and `k=3` clusters (`KMeans(n_clusters=k, random_state=0, n_init=10)` each). Store `(score_k2, score_k3)`, each rounded to 3 decimals, in `answer`.',
        reference: py`from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
sub = [p for p in penguins if p["bill_length_mm"] is not None and p["body_mass_g"] is not None][:100]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
scaled = StandardScaler().fit_transform(X)
labels2 = KMeans(n_clusters=2, random_state=0, n_init=10).fit_predict(scaled)
labels3 = KMeans(n_clusters=3, random_state=0, n_init=10).fit_predict(scaled)
answer = (round(float(silhouette_score(scaled, labels2)), 3), round(float(silhouette_score(scaled, labels3)), 3))`,
        walkthrough: 'The silhouette score measures how well-separated clusters are (higher is better, up to 1); comparing it across a few candidate values of `k` is a standard way to choose a reasonable number of clusters.',
        traps: [py`from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
sub = [p for p in penguins if p["bill_length_mm"] is not None and p["body_mass_g"] is not None][:100]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
scaled = StandardScaler().fit_transform(X)
labels2 = KMeans(n_clusters=2, random_state=0, n_init=10).fit_predict(scaled)
labels3 = KMeans(n_clusters=3, random_state=0, n_init=10).fit_predict(scaled)
answer = (round(float(silhouette_score(scaled, labels3)), 3), round(float(silhouette_score(scaled, labels2)), 3))`],
      }),
      skl({
        title: 'PCA for compressing two features into one',
        use: ['penguins'],
        starter: 'from sklearn.decomposition import PCA\nfrom sklearn.preprocessing import StandardScaler\nsub = [p for p in penguins if p["bill_length_mm"] is not None and p["body_mass_g"] is not None][:50]\nX = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]\nscaled = StandardScaler().fit_transform(X)\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. scaled already holds 50 real, standardised (bill length, mass) pairs.',
        brief: 'Fit `PCA(n_components=1, random_state=0)` on `scaled`. Store the **explained variance ratio** of the single component, rounded to 3 decimals, in `answer`.',
        reference: py`from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
sub = [p for p in penguins if p["bill_length_mm"] is not None and p["body_mass_g"] is not None][:50]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
scaled = StandardScaler().fit_transform(X)
pca = PCA(n_components=1, random_state=0)
pca.fit(scaled)
answer = round(float(pca.explained_variance_ratio_[0]), 3)`,
        walkthrough: 'The explained variance ratio says what fraction of the original data\'s spread the compressed, single-number summary still captures — the higher it is, the less was lost by reducing to one dimension.',
        traps: [py`from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
sub = [p for p in penguins if p["bill_length_mm"] is not None and p["body_mass_g"] is not None][:50]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
scaled = StandardScaler().fit_transform(X)
pca = PCA(n_components=1, random_state=0)
pca.fit(X)
answer = round(float(pca.explained_variance_ratio_[0]), 3)`],
      }),
    ],
  },
  {
    id: 'py-model-tuning-grid-search',
    title: 'Model tuning: grid search, overfitting and learning curves',
    blurb: 'GridSearchCV, RandomizedSearchCV, nested validation, and learning curves.',
    kind: 'code',
    practice: {
      prompt: 'Write `best_params(X, y)`: using `GridSearchCV(LogisticRegression(max_iter=1000), {"C": [0.1, 1.0, 10.0]}, cv=3)`, fit it and return `grid.best_params_`.',
      starter: 'from sklearn.model_selection import GridSearchCV\nfrom sklearn.linear_model import LogisticRegression\n\ndef best_params(X, y):\n    ...\n',
      solution: py`from sklearn.model_selection import GridSearchCV
from sklearn.linear_model import LogisticRegression

def best_params(X, y):
    grid = GridSearchCV(LogisticRegression(max_iter=1000), {"C": [0.1, 1.0, 10.0]}, cv=3)
    grid.fit(X, y)
    return grid.best_params_`,
      samples: ['best_params([[0], [1], [2], [3], [4], [5], [6], [7], [8]], [0, 0, 0, 1, 1, 1, 1, 1, 1])'],
      cases: [
        ['A separable dataset', 'sorted(best_params([[0], [1], [2], [3], [4], [5], [6], [7], [8]], [0, 0, 0, 1, 1, 1, 1, 1, 1]).keys())'],
        ['The value is one of the grid options', 'best_params([[0], [1], [2], [3], [4], [5], [6], [7], [8]], [0, 0, 0, 1, 1, 1, 1, 1, 1])["C"] in [0.1, 1.0, 10.0]'],
        ['The exact best C chosen', 'best_params([[0], [1], [2], [3], [4], [5], [6], [7], [8]], [0, 0, 0, 1, 1, 1, 1, 1, 1])["C"]'],
      ],
      traps: [
        py`from sklearn.model_selection import GridSearchCV
from sklearn.linear_model import LogisticRegression

def best_params(X, y):
    grid = GridSearchCV(LogisticRegression(max_iter=1000), {"C": [10.0, 100.0, 1000.0]}, cv=3)
    grid.fit(X, y)
    return grid.best_params_`,
        py`from sklearn.model_selection import GridSearchCV
from sklearn.linear_model import LogisticRegression

def best_params(X, y):
    grid = GridSearchCV(LogisticRegression(max_iter=1000), {"C": [1.0, 10.0, 100.0]}, cv=3)
    grid.fit(X, y)
    return grid.best_params_`,
      ],
    },
    real: [
      skl({
        title: 'Tuning C for penguin classification',
        use: ['penguins'],
        starter: 'from sklearn.model_selection import GridSearchCV\nfrom sklearn.linear_model import LogisticRegression\nsub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]\nX = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]\ny = [0 if p["species"] == "Adelie" else 1 for p in sub]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. X and y already hold real features and labels.',
        brief: 'Using the same grid search as the practice, store `(best_params, best_score)`, with `best_score` rounded to 3 decimals, in `answer`.',
        reference: py`from sklearn.model_selection import GridSearchCV
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
grid = GridSearchCV(LogisticRegression(max_iter=1000), {"C": [0.1, 1.0, 10.0]}, cv=3)
grid.fit(X, y)
answer = (grid.best_params_, round(float(grid.best_score_), 3))`,
        walkthrough: '`GridSearchCV` tries every value in the grid with cross-validation and reports both the winning parameters and the score that won.',
        traps: [py`from sklearn.model_selection import GridSearchCV
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
grid = GridSearchCV(LogisticRegression(max_iter=1000), {"C": [0.1, 1.0, 10.0]}, cv=5)
grid.fit(X, y)
answer = (grid.best_params_, round(float(grid.best_score_), 3))`],
      }),
      skl({
        title: 'Comparing the tuned model to a default one',
        use: ['penguins'],
        starter: 'from sklearn.model_selection import GridSearchCV, train_test_split\nfrom sklearn.linear_model import LogisticRegression\nsub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]\nX = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]\ny = [0 if p["species"] == "Adelie" else 1 for p in sub]\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. X_train/X_test/y_train/y_test already hold a real, fixed, seeded split.',
        brief: 'Grid-search `C` (as in the practice) on the training data only, then compare the tuned model\'s test accuracy to a default `LogisticRegression(max_iter=1000)`\'s test accuracy. Store `(tuned_acc, default_acc, tuned_cv_score)`, each rounded to 4 decimals, in `answer`.',
        reference: py`from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
grid = GridSearchCV(LogisticRegression(max_iter=1000), {"C": [0.1, 1.0, 10.0]}, cv=3)
grid.fit(X_train, y_train)
tuned_acc = grid.score(X_test, y_test)
default_model = LogisticRegression(max_iter=1000)
default_model.fit(X_train, y_train)
default_acc = default_model.score(X_test, y_test)
answer = (round(float(tuned_acc), 4), round(float(default_acc), 4), round(float(grid.best_score_), 4))`,
        walkthrough: 'Tuning on the training data only, then evaluating once on the held-out test data, keeps the final comparison honest — the test set never influenced which `C` was chosen or how good it looked during tuning (`best_score_`), even if the final test accuracy happens to look similar either way.',
        traps: [py`from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
grid = GridSearchCV(LogisticRegression(max_iter=1000), {"C": [0.1, 1.0, 10.0]}, cv=3)
grid.fit(X, y)
tuned_acc = grid.score(X_test, y_test)
default_model = LogisticRegression(max_iter=1000)
default_model.fit(X_train, y_train)
default_acc = default_model.score(X_test, y_test)
answer = (round(float(tuned_acc), 4), round(float(default_acc), 4), round(float(grid.best_score_), 4))`],
      }),
      skl({
        title: 'A learning curve by hand',
        use: ['penguins'],
        starter: 'from sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\nsub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]\nX = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]\ny = [0 if p["species"] == "Adelie" else 1 for p in sub]\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. X_train/X_test/y_train/y_test already hold a real, fixed, seeded split.',
        brief: 'Fit a `LogisticRegression(max_iter=1000)` on just the **first 10** training rows, and separately on **all** training rows. Store `(small_test_acc, full_test_acc)`, each rounded to 3 decimals, in `answer`.',
        reference: py`from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)
sub_small = LogisticRegression(max_iter=1000)
sub_small.fit(X_train[:10], y_train[:10])
sub_full = LogisticRegression(max_iter=1000)
sub_full.fit(X_train, y_train)
answer = (round(float(sub_small.score(X_test, y_test)), 3), round(float(sub_full.score(X_test, y_test)), 3))`,
        walkthrough: 'Plotting test accuracy against training-set size like this, for several sizes, is exactly what a learning curve shows — usually rising and then levelling off as more data stops adding much benefit.',
        traps: [py`from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)
sub_small = LogisticRegression(max_iter=1000)
sub_small.fit(X_train[:10], y_train[:10])
sub_full = LogisticRegression(max_iter=1000)
sub_full.fit(X_train, y_train)
answer = (round(float(sub_full.score(X_test, y_test)), 3), round(float(sub_small.score(X_test, y_test)), 3))`],
      }),
    ],
  },
  {
    id: 'py-text-features-tfidf',
    title: 'Text features: bag of words, TF-IDF and NLTK basics',
    blurb: 'Tokenising, stop words, CountVectorizer and TfidfVectorizer.',
    kind: 'code',
    practice: {
      prompt: 'Write `tfidf_shape(docs)`: fit a `TfidfVectorizer` on `docs` and return the shape (`rows, columns`) of the resulting matrix.',
      starter: 'from sklearn.feature_extraction.text import TfidfVectorizer\n\ndef tfidf_shape(docs):\n    ...\n',
      solution: py`from sklearn.feature_extraction.text import TfidfVectorizer

def tfidf_shape(docs):
    vec = TfidfVectorizer()
    matrix = vec.fit_transform(docs)
    return matrix.shape`,
      samples: ['tfidf_shape(["the cat sat", "the dog ran"])'],
      cases: [
        ['Two short documents', 'tfidf_shape(["the cat sat", "the dog ran"])'],
        ['One document', 'tfidf_shape(["hello world"])'],
        ['Repeated words do not add extra columns', 'tfidf_shape(["cat cat cat", "dog dog"])'],
      ],
      traps: [
        py`from sklearn.feature_extraction.text import TfidfVectorizer

def tfidf_shape(docs):
    vec = TfidfVectorizer(stop_words="english")
    matrix = vec.fit_transform(docs)
    return matrix.shape`,
        py`from sklearn.feature_extraction.text import TfidfVectorizer

def tfidf_shape(docs):
    vec = TfidfVectorizer()
    matrix = vec.fit_transform(docs)
    return (matrix.shape[1], matrix.shape[0])`,
      ],
    },
    real: [
      skl({
        title: 'TF-IDF of real song titles',
        use: ['songs'],
        starter: 'from sklearn.feature_extraction.text import TfidfVectorizer\ntitles = [s["track"] for s in songs[:100]]\nanswer = ...\n',
        given: '# songs is a list of dictionaries. titles already holds 100 real track titles.',
        brief: 'Fit a `TfidfVectorizer` on `titles`. Store the number of rows (should equal 100) and the number of distinct words found, as `(rows, cols)`, in `answer`.',
        reference: py`from sklearn.feature_extraction.text import TfidfVectorizer
titles = [s["track"] for s in songs[:100]]
vec = TfidfVectorizer()
matrix = vec.fit_transform(titles)
answer = matrix.shape`,
        walkthrough: 'Each row is one title; each column is one distinct word (a "term") seen across every title — real text tends to produce far more columns than words in any single document, since most documents use only a small fraction of the whole vocabulary.',
        traps: [py`from sklearn.feature_extraction.text import TfidfVectorizer
titles = [s["track"] for s in songs[:100]]
vec = TfidfVectorizer(stop_words="english")
matrix = vec.fit_transform(titles)
answer = matrix.shape`],
      }),
      skl({
        title: 'Finding the highest-TF-IDF word in one title',
        use: ['songs'],
        starter: 'from sklearn.feature_extraction.text import TfidfVectorizer\ntitles = [s["track"] for s in songs[:50]]\nanswer = ...\n',
        given: '# songs is a list of dictionaries. titles already holds 50 real track titles.',
        brief: 'Fit a `TfidfVectorizer` on `titles`. For the **first** title, find the word (from `vec.get_feature_names_out()`) with the highest TF-IDF weight in its row. Store that word, as a plain string, in `answer`.',
        reference: py`from sklearn.feature_extraction.text import TfidfVectorizer
titles = [s["track"] for s in songs[:50]]
vec = TfidfVectorizer()
matrix = vec.fit_transform(titles)
row = matrix[0].toarray()[0]
words = vec.get_feature_names_out()
answer = str(words[row.argmax()])`,
        walkthrough: 'TF-IDF weights a word higher when it is frequent in one document but rare across the whole collection — the highest-weighted word in a title is often its most distinctive one, not just its most common.',
        traps: [py`from sklearn.feature_extraction.text import TfidfVectorizer
titles = [s["track"] for s in songs[:50]]
vec = TfidfVectorizer()
matrix = vec.fit_transform(titles)
row = matrix[0].toarray()[0]
words = vec.get_feature_names_out()
answer = str(words[row.argmin()])`],
      }),
      skl({
        title: 'Vocabulary size with and without stop words',
        use: ['tracks'],
        starter: 'from sklearn.feature_extraction.text import TfidfVectorizer\nnames = [t["Name"] for t in tracks[:200]]\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. names already holds 200 real track names.',
        brief: 'Fit two `TfidfVectorizer`s on `names`, one with `stop_words="english"` and one without. Store `(without_stopwords, with_stopwords)` vocabulary sizes, as `(int, int)`, in `answer`.',
        reference: py`from sklearn.feature_extraction.text import TfidfVectorizer
names = [t["Name"] for t in tracks[:200]]
without_sw = TfidfVectorizer().fit(names)
with_sw = TfidfVectorizer(stop_words="english").fit(names)
answer = (len(without_sw.get_feature_names_out()), len(with_sw.get_feature_names_out()))`,
        walkthrough: 'Removing common English stop words ("the", "of", "and") always shrinks (or leaves unchanged) the vocabulary, since it only ever removes terms, never adds them.',
        traps: [py`from sklearn.feature_extraction.text import TfidfVectorizer
names = [t["Name"] for t in tracks[:200]]
without_sw = TfidfVectorizer().fit(names)
with_sw = TfidfVectorizer(stop_words="english").fit(names)
answer = (len(with_sw.get_feature_names_out()), len(without_sw.get_feature_names_out()))`],
      }),
    ],
  },
  {
    id: 'py-ml-workshop-spotify-penguins',
    title: 'ML workshop: predicting on Spotify and penguins',
    blurb: 'Define the target, build a baseline and a pipeline, evaluate, and note the limitations.',
    kind: 'code',
    practice: {
      prompt: 'Write `species_model(df)`: given a DataFrame with `bill_length_mm`, `bill_depth_mm`, `flipper_length_mm`, `body_mass_g` and `species` columns (already only two species, no missing values), split with `train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)`, fit a `Pipeline` (`StandardScaler` then `LogisticRegression(max_iter=1000)`), and return the test accuracy.',
      starter: 'import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\ndef species_model(df):\n    ...\n',
      solution: py`import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

def species_model(df):
    features = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
    X = df[features]
    y = df["species"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
    pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
    pipe.fit(X_train, y_train)
    return float(pipe.score(X_test, y_test))`,
      samples: ['round(species_model(pd.DataFrame({"bill_length_mm": list(range(40, 70)), "bill_depth_mm": list(range(20, 50)), "flipper_length_mm": list(range(180, 210)), "body_mass_g": list(range(3000, 6000, 100)), "species": ["A"] * 13 + ["B", "A", "B"] + ["B"] * 14})), 3)'],
      cases: [
        ['A mostly-separable toy dataset with two mislabelled rows', 'round(species_model(pd.DataFrame({"bill_length_mm": list(range(40, 70)), "bill_depth_mm": list(range(20, 50)), "flipper_length_mm": list(range(180, 210)), "body_mass_g": list(range(3000, 6000, 100)), "species": ["A"] * 13 + ["B", "A", "B"] + ["B"] * 14})), 3)'],
        ['Returns a plain float', 'type(species_model(pd.DataFrame({"bill_length_mm": list(range(40, 70)), "bill_depth_mm": list(range(20, 50)), "flipper_length_mm": list(range(180, 210)), "body_mass_g": list(range(3000, 6000, 100)), "species": ["A"] * 13 + ["B", "A", "B"] + ["B"] * 14}))) is float'],
      ],
      traps: [
        py`import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

def species_model(df):
    features = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
    X = df[features]
    y = df["species"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=2, stratify=y)
    pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
    pipe.fit(X_train, y_train)
    return float(pipe.score(X_test, y_test))`,
        py`import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

def species_model(df):
    features = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
    X = df[features]
    y = df["species"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
    pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
    pipe.fit(X_train, y_train)
    return float(pipe.score(X_train, y_train))`,
      ],
    },
    real: [
      dat({
        title: 'Full species pipeline on real penguins',
        use: ['penguins'],
        starter: 'import pandas as pd\nsub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None and p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]\ndf = pd.DataFrame(sub)\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. df is a real DataFrame with two species and no missing measurements.',
        brief: 'Use `species_model`-style logic on `df`. Store `(test_accuracy, number_of_test_rows)`, the accuracy rounded to 3 decimals, in `answer`.',
        reference: py`import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None and p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]
df = pd.DataFrame(sub)
features = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
X = df[features]
y = df["species"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
pipe.fit(X_train, y_train)
answer = (round(float(pipe.score(X_test, y_test)), 3), int(len(X_test)))`,
        walkthrough: 'Adelie and Gentoo differ enough across these four measurements that this pipeline should reach very high accuracy — a believable baseline before trying anything fancier. Reporting how many rows the test set actually held keeps the split itself (not just the resulting score) part of what is checked.',
        traps: [py`import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None and p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]
df = pd.DataFrame(sub)
features = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
X = df[features]
y = df["species"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=0, stratify=y)
pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
pipe.fit(X_train, y_train)
answer = (round(float(pipe.score(X_test, y_test)), 3), int(len(X_test)))`],
      }),
      dat({
        title: 'A harder three-species version',
        use: ['penguins'],
        starter: 'import pandas as pd\nsub = [p for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None and p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]\ndf = pd.DataFrame(sub)\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. df now includes all three real species.',
        brief: 'Using the same pipeline approach (all three species this time), store the test accuracy, rounded to 3 decimals, in `answer`.',
        reference: py`import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None and p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]
df = pd.DataFrame(sub)
features = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
X = df[features]
y = df["species"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
pipe.fit(X_train, y_train)
answer = round(float(pipe.score(X_test, y_test)), 3)`,
        walkthrough: 'Adding a third species (Chinstrap, which overlaps Adelie more than Gentoo does) is a good example of how a baseline\'s accuracy can shift once a task gets a little harder — worth noting honestly rather than only reporting the easier two-species result.',
        traps: [py`import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None and p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]
df = pd.DataFrame(sub)
features = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
X = df[features]
y = df["species"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
pipe.fit(X_train, y_train)
answer = round(float(pipe.score(X_train, y_train)), 3)`],
      }),
      dat({
        title: 'Error analysis: which species gets confused?',
        use: ['penguins'],
        starter: 'import pandas as pd\nsub = [p for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None and p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]\ndf = pd.DataFrame(sub)\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. df includes all three real species.',
        brief: 'Fit the same three-species pipeline, then build a confusion matrix (`sklearn.metrics.confusion_matrix`) on the test predictions, using `labels=sorted(df["species"].unique())`. Store the confusion matrix as a list of lists (plain ints) in `answer`.',
        reference: py`import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix
sub = [p for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None and p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]
df = pd.DataFrame(sub)
features = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
X = df[features]
y = df["species"]
labels = sorted(y.unique())
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
pipe.fit(X_train, y_train)
preds = pipe.predict(X_test)
cm = confusion_matrix(y_test, preds, labels=labels)
answer = cm.tolist()`,
        walkthrough: 'A confusion matrix shows exactly which species get mixed up with which — a single accuracy number can hide that one specific pair (often the two most visually similar species) accounts for almost all the mistakes.',
        traps: [py`import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix
sub = [p for p in penguins if p["bill_length_mm"] is not None and p["bill_depth_mm"] is not None and p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]
df = pd.DataFrame(sub)
features = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
X = df[features]
y = df["species"]
labels = sorted(y.unique())
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
pipe = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000))])
pipe.fit(X_train, y_train)
preds = pipe.predict(X_test)
cm = confusion_matrix(preds, y_test, labels=labels)
answer = cm.tolist()`],
      }),
    ],
  },
]
