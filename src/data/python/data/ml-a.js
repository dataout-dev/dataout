import { dat, py } from './common.js'

const skl = (c) => dat({ ...c, hidden: 'import numpy as np\n' + (c.hidden ?? '') })

export const mlLessonsA = [
  {
    id: 'py-ml-concepts',
    title: 'Machine learning concepts: supervised, unsupervised and data leakage',
    blurb: 'Features and targets, training/validation/test sets, overfitting, and data leakage.',
    kind: 'learn',
    check: [
      {
        q: 'What distinguishes supervised learning from unsupervised learning?',
        options: [
          'Supervised learning requires more data',
          'Supervised learning learns from labelled examples (features plus a known target); unsupervised learning finds structure in data with no target at all',
          'Unsupervised learning is always more accurate',
          'There is no real difference',
        ],
        answer: 1,
        why: 'Supervised learning (regression, classification) has a known correct answer to learn from for each example; unsupervised learning (clustering, dimensionality reduction) looks for structure without one.',
      },
      {
        q: 'Why split data into training, validation and test sets, rather than just training and test?',
        options: [
          'It is unnecessary; two sets are always enough',
          "The validation set lets you tune choices (which model, which hyperparameters) without ever looking at the test set, keeping the test set's final evaluation honest",
          'Validation data is only needed for very large datasets',
          'The three sets must always be the same size',
        ],
        answer: 1,
        why: 'Repeatedly checking performance on the test set while tuning choices would let information about the test set leak into those choices — the validation set exists to keep the final, one-time test evaluation trustworthy.',
      },
      {
        q: 'What does "overfitting" mean?',
        options: [
          'A model that trains too quickly',
          'A model that has learned the training data\'s noise and specific quirks so closely that it performs much worse on new, unseen data',
          'A model with too few parameters',
          'A model that only works on categorical data',
        ],
        answer: 1,
        why: 'An overfit model memorises training-set specifics rather than the general pattern, showing a large gap between strong training performance and weak performance on new data.',
      },
      {
        q: 'What does "underfitting" mean?',
        options: [
          'A model that is too complex',
          'A model too simple to capture the real pattern in the data, performing poorly on both training and new data',
          'A model with perfect training accuracy',
          'A synonym for overfitting',
        ],
        answer: 1,
        why: 'An underfit model has not captured enough of the real structure to do well even on the data it was trained on, let alone new data.',
      },
      {
        q: 'What is data leakage, and why is scaling data before splitting into train/test a common example of it?',
        options: [
          'Data leakage means losing rows of data by accident',
          "Data leakage happens when information from outside the training data (including from the test set) influences training; fitting a scaler on the whole dataset before splitting lets test-set statistics (like its mean) leak into the training process",
          'Data leakage only applies to time-series data',
          'It is not a real concern in practice',
        ],
        answer: 1,
        why: "Fitting any preprocessing step (a scaler, an imputer) on the full dataset before splitting means the training process has indirectly 'seen' information about the test set, giving an overly optimistic estimate of real-world performance.",
      },
    ],
  },
  {
    id: 'py-train-test-cv',
    title: 'Train/test split and cross-validation',
    blurb: 'train_test_split with stratify and seeds, k-fold cross-validation, and choosing metrics.',
    kind: 'code',
    practice: {
      prompt: 'Write `cv_accuracy(X, y)`: using `LogisticRegression(max_iter=1000)` and `cross_val_score(model, X, y, cv=5)`, return the **mean** cross-validated accuracy as a plain float.',
      starter: 'from sklearn.model_selection import cross_val_score\nfrom sklearn.linear_model import LogisticRegression\n\ndef cv_accuracy(X, y):\n    ...\n',
      solution: py`from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression

def cv_accuracy(X, y):
    model = LogisticRegression(max_iter=1000)
    scores = cross_val_score(model, X, y, cv=5)
    return float(scores.mean())`,
      samples: ['round(cv_accuracy([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]), 3)'],
      cases: [
        ['A clearly separable dataset', 'round(cv_accuracy([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]), 3)'],
        ['Returns a plain float', 'type(cv_accuracy([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1])) is float'],
        ['A between-0-and-1 value', '0.0 <= cv_accuracy([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]) <= 1.0'],
      ],
      traps: [
        py`from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression

def cv_accuracy(X, y):
    model = LogisticRegression(max_iter=1000)
    scores = cross_val_score(model, X, y, cv=3)
    return float(scores.mean())`,
        py`from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression

def cv_accuracy(X, y):
    model = LogisticRegression(max_iter=1000)
    scores = cross_val_score(model, X, y, cv=5)
    return float(scores.max())`,
      ],
    },
    real: [
      skl({
        title: 'Cross-validated accuracy for penguin species (two species)',
        use: ['penguins'],
        starter: 'from sklearn.model_selection import cross_val_score\nfrom sklearn.linear_model import LogisticRegression\nsub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]\nX = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]\ny = [0 if p["species"] == "Adelie" else 1 for p in sub]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. X and y already hold real bill-length/mass features and a 0/1 species label.',
        brief: 'Using `LogisticRegression(max_iter=1000)` and `cross_val_score(model, X, y, cv=5)`, store the mean cross-validated accuracy, rounded to 3 decimals, in `answer`.',
        reference: py`from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
model = LogisticRegression(max_iter=1000)
scores = cross_val_score(model, X, y, cv=5)
answer = round(float(scores.mean()), 3)`,
        walkthrough: 'Adelie and Gentoo differ enough in bill length and body mass that even a simple linear classifier should separate them well across every fold.',
        traps: [py`from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
model = LogisticRegression(max_iter=1000)
scores = cross_val_score(model, X, y, cv=10)
answer = round(float(scores.mean()), 3)`],
      }),
      skl({
        title: 'Cross-validated accuracy predicting explicit tracks',
        use: ['songs'],
        starter: 'from sklearn.model_selection import cross_val_score\nfrom sklearn.linear_model import LogisticRegression\nsub = [s for s in songs if s["spotify_streams"] is not None and s["spotify_popularity"] is not None][:300]\nX = [[s["spotify_streams"], s["spotify_popularity"]] for s in sub]\ny = [s["explicit_track"] for s in sub]\nanswer = ...\n',
        given: '# songs is a list of dictionaries. X and y already hold real features and the real explicit-track label.',
        brief: 'Using the same approach as the practice, store the mean cross-validated accuracy, rounded to 3 decimals, in `answer`.',
        reference: py`from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression
sub = [s for s in songs if s["spotify_streams"] is not None and s["spotify_popularity"] is not None][:300]
X = [[s["spotify_streams"], s["spotify_popularity"]] for s in sub]
y = [s["explicit_track"] for s in sub]
model = LogisticRegression(max_iter=1000)
scores = cross_val_score(model, X, y, cv=5)
answer = round(float(scores.mean()), 3)`,
        walkthrough: 'This is a much harder task than the penguins example — streams and popularity have little to do with explicitness — so a modest accuracy here is an honest, expected result, not a bug.',
        traps: [py`from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression
sub = [s for s in songs if s["spotify_streams"] is not None and s["spotify_popularity"] is not None][:300]
X = [[s["spotify_streams"], s["spotify_popularity"]] for s in sub]
y = [s["explicit_track"] for s in sub]
model = LogisticRegression(max_iter=1000)
scores = cross_val_score(model, X, y, cv=5, scoring="neg_log_loss")
answer = round(float(scores.mean()), 3)`],
      }),
      skl({
        title: 'A held-out estimate versus a single split',
        use: ['tracks'],
        starter: 'from sklearn.model_selection import cross_val_score, train_test_split\nfrom sklearn.linear_model import LogisticRegression\nsub = tracks[:200]\nX = [[t["Milliseconds"], t["UnitPrice"]] for t in sub]\ny = [1 if t["GenreId"] == 1 else 0 for t in sub]\nanswer = ...\n',
        given: '# tracks is a list of dictionaries. X and y already hold real features and a genre-1-or-not label.',
        brief: 'Compute the mean 5-fold cross-validated accuracy (as in the practice) for `X`/`y`, and separately, a **single** train/test split (`train_test_split(X, y, test_size=0.2, random_state=0)`, then fit and `.score`) accuracy. Store `(cv_mean, single_split)`, each rounded to 3 decimals, in `answer`.',
        reference: py`from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.linear_model import LogisticRegression
sub = tracks[:200]
X = [[t["Milliseconds"], t["UnitPrice"]] for t in sub]
y = [1 if t["GenreId"] == 1 else 0 for t in sub]
model = LogisticRegression(max_iter=1000)
scores = cross_val_score(model, X, y, cv=5)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
single_model = LogisticRegression(max_iter=1000)
single_model.fit(X_train, y_train)
answer = (round(float(scores.mean()), 3), round(float(single_model.score(X_test, y_test)), 3))`,
        walkthrough: 'Cross-validation averages over 5 different train/test splits, while a single split depends on the luck of exactly which rows landed in the test set — the two numbers are usually close but rarely identical.',
        traps: [py`from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.linear_model import LogisticRegression
sub = tracks[:200]
X = [[t["Milliseconds"], t["UnitPrice"]] for t in sub]
y = [1 if t["GenreId"] == 1 else 0 for t in sub]
model = LogisticRegression(max_iter=1000)
scores = cross_val_score(model, X, y, cv=5)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=1)
single_model = LogisticRegression(max_iter=1000)
single_model.fit(X_train, y_train)
answer = (round(float(scores.mean()), 3), round(float(single_model.score(X_test, y_test)), 3))`],
      }),
    ],
  },
  {
    id: 'py-linear-logistic-regression',
    title: 'Linear and logistic regression',
    blurb: 'fit, predict, score, coefficients, regularisation, and probabilities and thresholds.',
    kind: 'code',
    practice: {
      prompt: 'Write `fit_lr(X_train, y_train, X_test, y_test)`: fit a `LinearRegression`, and return its R-squared on the **test** data.',
      starter: 'from sklearn.linear_model import LinearRegression\n\ndef fit_lr(X_train, y_train, X_test, y_test):\n    ...\n',
      solution: py`from sklearn.linear_model import LinearRegression

def fit_lr(X_train, y_train, X_test, y_test):
    model = LinearRegression()
    model.fit(X_train, y_train)
    return float(model.score(X_test, y_test))`,
      samples: ['round(fit_lr([[1], [2], [3]], [2, 4, 6], [[4], [5]], [8, 10]), 3)'],
      cases: [
        ['A perfect linear relationship', 'round(fit_lr([[1], [2], [3]], [2, 4, 6], [[4], [5]], [8, 10]), 3)'],
        ['Returns a plain float', 'type(fit_lr([[1], [2], [3]], [2, 4, 6], [[4], [5]], [8, 10])) is float'],
        ['A poor fit gives a lower score', 'fit_lr([[1], [2], [3]], [2, 4, 6], [[4], [5]], [1, 100]) < 0.5'],
      ],
      traps: [
        py`from sklearn.linear_model import LinearRegression

def fit_lr(X_train, y_train, X_test, y_test):
    model = LinearRegression()
    model.fit(X_train, y_train)
    return float(model.score(X_train, y_train))`,
        py`from sklearn.linear_model import LinearRegression

def fit_lr(X_train, y_train, X_test, y_test):
    model = LinearRegression()
    model.fit(X_test, y_test)
    return float(model.score(X_test, y_test))`,
      ],
    },
    real: [
      skl({
        title: 'Predicting penguin mass from flipper length',
        use: ['penguins'],
        starter: 'from sklearn.linear_model import LinearRegression\nsub = [p for p in penguins if p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]\nX = [[p["flipper_length_mm"]] for p in sub]\ny = [p["body_mass_g"] for p in sub]\nn = len(X)\nsplit = int(n * 0.8)\nX_train, X_test = X[:split], X[split:]\ny_train, y_test = y[:split], y[split:]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. X_train/X_test/y_train/y_test already hold a real, fixed 80/20 split.',
        brief: 'Fit a `LinearRegression` on the training data, and store its R-squared on the test data, rounded to 3 decimals, in `answer`.',
        reference: py`from sklearn.linear_model import LinearRegression
sub = [p for p in penguins if p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["flipper_length_mm"]] for p in sub]
y = [p["body_mass_g"] for p in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
model = LinearRegression()
model.fit(X_train, y_train)
answer = round(float(model.score(X_test, y_test)), 3)`,
        walkthrough: 'Flipper length and body mass are strongly related in penguins, so even this single-feature model should explain a good share of the variation in the held-out data.',
        traps: [py`from sklearn.linear_model import LinearRegression
sub = [p for p in penguins if p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["flipper_length_mm"]] for p in sub]
y = [p["body_mass_g"] for p in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
model = LinearRegression()
model.fit(X_train, y_train)
answer = round(float(model.score(X_train, y_train)), 3)`],
      }),
      skl({
        title: "Predicting a song's popularity from streams",
        use: ['songs'],
        starter: 'from sklearn.linear_model import LinearRegression\nsub = [s for s in songs if s["spotify_streams"] is not None and s["spotify_popularity"] is not None][:400]\nX = [[s["spotify_streams"]] for s in sub]\ny = [s["spotify_popularity"] for s in sub]\nn = len(X)\nsplit = int(n * 0.8)\nX_train, X_test = X[:split], X[split:]\ny_train, y_test = y[:split], y[split:]\nanswer = ...\n',
        given: '# songs is a list of dictionaries. X_train/X_test/y_train/y_test already hold a real, fixed 80/20 split.',
        brief: 'Fit a `LinearRegression` and store its R-squared on the test data, rounded to 3 decimals, in `answer`.',
        reference: py`from sklearn.linear_model import LinearRegression
sub = [s for s in songs if s["spotify_streams"] is not None and s["spotify_popularity"] is not None][:400]
X = [[s["spotify_streams"]] for s in sub]
y = [s["spotify_popularity"] for s in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
model = LinearRegression()
model.fit(X_train, y_train)
answer = round(float(model.score(X_test, y_test)), 3)`,
        walkthrough: 'A low (even negative) R-squared here is a legitimate, informative result: raw stream counts alone are a weak predictor of a curated popularity score.',
        traps: [py`from sklearn.linear_model import LinearRegression
sub = [s for s in songs if s["spotify_streams"] is not None and s["spotify_popularity"] is not None][:400]
X = [[s["spotify_streams"]] for s in sub]
y = [s["spotify_popularity"] for s in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
model = LinearRegression()
model.fit(X_train, y_train)
answer = round(float(model.score(X_train, y_train)), 3)`],
      }),
      skl({
        title: 'Classifying species with logistic regression probabilities',
        use: ['penguins'],
        starter: 'from sklearn.linear_model import LogisticRegression\nsub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None]\nX = [[p["bill_length_mm"]] for p in sub]\ny = [0 if p["species"] == "Adelie" else 1 for p in sub]\nn = len(X)\nsplit = int(n * 0.8)\nX_train, X_test = X[:split], X[split:]\ny_train, y_test = y[:split], y[split:]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. X_train/X_test/y_train/y_test already hold a real, fixed 80/20 split.',
        brief: 'Fit a `LogisticRegression(max_iter=1000)`, and store the **predicted probability of class 1** (`model.predict_proba(X_test)[:, 1]`) for the first test row, rounded to 3 decimals, in `answer`.',
        reference: py`from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None]
X = [[p["bill_length_mm"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
answer = round(float(model.predict_proba(X_test)[:, 1][0]), 3)`,
        walkthrough: '`predict_proba` returns one probability per class per row; column `1` is the probability of the positive (Gentoo) class specifically.',
        traps: [py`from sklearn.linear_model import LogisticRegression
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None]
X = [[p["bill_length_mm"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
answer = round(float(model.predict_proba(X_test)[:, 0][0]), 3)`],
      }),
    ],
  },
  {
    id: 'py-trees-forests-boosting',
    title: 'Trees, random forests and gradient boosting',
    blurb: 'Decision trees, depth and overfitting, random forests, and feature importance.',
    kind: 'code',
    practice: {
      prompt: 'Write `tree_acc(X_train, y_train, X_test, y_test)`: fit a `DecisionTreeClassifier(random_state=0)` and return its accuracy on the test data.',
      starter: 'from sklearn.tree import DecisionTreeClassifier\n\ndef tree_acc(X_train, y_train, X_test, y_test):\n    ...\n',
      solution: py`from sklearn.tree import DecisionTreeClassifier

def tree_acc(X_train, y_train, X_test, y_test):
    model = DecisionTreeClassifier(random_state=0)
    model.fit(X_train, y_train)
    return float(model.score(X_test, y_test))`,
      samples: ['tree_acc([[0], [1], [2], [3]], [0, 0, 1, 1], [[0], [3]], [0, 1])'],
      cases: [
        ['A simple separable dataset', 'tree_acc([[0], [1], [2], [3]], [0, 0, 1, 1], [[0], [3]], [0, 1])'],
        ['Returns a plain float', 'type(tree_acc([[0], [1], [2], [3]], [0, 0, 1, 1], [[0], [3]], [0, 1])) is float'],
        ['Test accuracy, not training accuracy', 'tree_acc([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1], [[2], [7]], [1, 0])'],
        ['An alternating pattern needs more than one split', 'tree_acc([[0], [1], [2], [3], [4], [5], [6], [7]], [0, 0, 1, 1, 0, 0, 1, 1], [[1], [3], [5], [7]], [0, 1, 0, 1])'],
      ],
      traps: [
        py`from sklearn.tree import DecisionTreeClassifier

def tree_acc(X_train, y_train, X_test, y_test):
    model = DecisionTreeClassifier(random_state=0)
    model.fit(X_train, y_train)
    return float(model.score(X_train, y_train))`,
        py`from sklearn.tree import DecisionTreeClassifier

def tree_acc(X_train, y_train, X_test, y_test):
    model = DecisionTreeClassifier(random_state=0, max_depth=1)
    model.fit(X_train, y_train)
    return float(model.score(X_test, y_test))`,
      ],
    },
    real: [
      skl({
        title: 'A random forest for species classification',
        use: ['penguins'],
        starter: 'from sklearn.ensemble import RandomForestClassifier\nsub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]\nX = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]\ny = [0 if p["species"] == "Adelie" else 1 for p in sub]\nn = len(X)\nsplit = int(n * 0.8)\nX_train, X_test = X[:split], X[split:]\ny_train, y_test = y[:split], y[split:]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. X_train/X_test/y_train/y_test already hold a real, fixed 80/20 split.',
        brief: 'Fit a `RandomForestClassifier(n_estimators=50, random_state=0)`, and store its predicted probability of class 1 for the **first** test row (`model.predict_proba(X_test)[0, 1]`), rounded to 4 decimals, in `answer`.',
        reference: py`from sklearn.ensemble import RandomForestClassifier
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
model = RandomForestClassifier(n_estimators=50, random_state=0)
model.fit(X_train, y_train)
answer = round(float(model.predict_proba(X_test)[0, 1]), 4)`,
        walkthrough: '`random_state` fixes every source of randomness inside the forest (bootstrap sampling, feature selection at each split); the predicted probability (not just the final 0/1 class) is sensitive enough to show a different seed genuinely changes the fitted forest.',
        traps: [py`from sklearn.ensemble import RandomForestClassifier
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
model = RandomForestClassifier(n_estimators=50, random_state=1)
model.fit(X_train, y_train)
answer = round(float(model.predict_proba(X_test)[0, 1]), 4)`],
      }),
      skl({
        title: 'Feature importance from a random forest',
        use: ['penguins'],
        starter: 'from sklearn.ensemble import RandomForestClassifier\nsub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]\nX = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]\ny = [0 if p["species"] == "Adelie" else 1 for p in sub]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. X and y already hold real features and labels (no split needed here).',
        brief: 'Fit a `RandomForestClassifier(n_estimators=50, random_state=0)` on all of `X`/`y`. Store the **index** (0 or 1) of the more important feature, using `model.feature_importances_`, as an `int`, in `answer`.',
        reference: py`from sklearn.ensemble import RandomForestClassifier
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
model = RandomForestClassifier(n_estimators=50, random_state=0)
model.fit(X, y)
answer = int(model.feature_importances_.argmax())`,
        walkthrough: '`feature_importances_` reports how much each feature contributed to reducing impurity across the forest\'s splits; `.argmax()` names the single most influential one.',
        traps: [py`from sklearn.ensemble import RandomForestClassifier
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
model = RandomForestClassifier(n_estimators=50, random_state=0)
model.fit(X, y)
answer = int(model.feature_importances_.argmin())`],
      }),
      skl({
        title: 'Gradient boosting versus a single tree',
        use: ['penguins'],
        starter: 'from sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.tree import DecisionTreeClassifier\nsub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]\nX = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]\ny = [0 if p["species"] == "Adelie" else 1 for p in sub]\nn = len(X)\nsplit = int(n * 0.8)\nX_train, X_test = X[:split], X[split:]\ny_train, y_test = y[:split], y[split:]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. X_train/X_test/y_train/y_test already hold a real, fixed 80/20 split.',
        brief: 'Fit both a `GradientBoostingClassifier(random_state=0)` and a `DecisionTreeClassifier(max_depth=1, random_state=0)` on the same training data. Store `(boosted_proba, stump_accuracy)` — the boosted model\'s predicted probability of class 1 for the first test row, and the stump\'s test accuracy — the first rounded to 4 decimals and the second to 3, in `answer`.',
        reference: py`from sklearn.ensemble import GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
boosted = GradientBoostingClassifier(random_state=0)
boosted.fit(X_train, y_train)
stump = DecisionTreeClassifier(max_depth=1, random_state=0)
stump.fit(X_train, y_train)
answer = (round(float(boosted.predict_proba(X_test)[0, 1]), 4), round(float(stump.score(X_test, y_test)), 3))`,
        walkthrough: 'Gradient boosting combines many weak learners (each fixing the previous ones\' mistakes); its predicted probability (not just the final class) is sensitive enough that a different seed produces a genuinely different fitted model.',
        traps: [py`from sklearn.ensemble import GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["bill_length_mm"], p["body_mass_g"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
n = len(X)
split = int(n * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]
boosted = GradientBoostingClassifier(random_state=1)
boosted.fit(X_train, y_train)
stump = DecisionTreeClassifier(max_depth=1, random_state=0)
stump.fit(X_train, y_train)
answer = (round(float(boosted.predict_proba(X_test)[0, 1]), 4), round(float(stump.score(X_test, y_test)), 3))`],
      }),
    ],
  },
  {
    id: 'py-evaluation-metrics',
    title: 'Evaluation metrics: accuracy, precision, recall, ROC and RMSE',
    blurb: 'Confusion matrix, precision/recall/F1, class imbalance, ROC/AUC, and regression metrics.',
    kind: 'code',
    practice: {
      prompt: 'Write `pr(y_true, y_pred)`: return `(precision, recall)` for binary predictions, each rounded to 4 decimals.',
      starter: 'from sklearn.metrics import precision_score, recall_score\n\ndef pr(y_true, y_pred):\n    ...\n',
      solution: py`from sklearn.metrics import precision_score, recall_score

def pr(y_true, y_pred):
    return (round(float(precision_score(y_true, y_pred)), 4), round(float(recall_score(y_true, y_pred)), 4))`,
      samples: ['pr([1, 1, 0, 0, 1], [1, 0, 0, 0, 1])'],
      cases: [
        ['A mix of correct and incorrect predictions', 'pr([1, 1, 0, 0, 1], [1, 0, 0, 0, 1])'],
        ['Perfect predictions', 'pr([1, 0, 1, 0], [1, 0, 1, 0])'],
        ['A false positive hurts precision, not recall', 'pr([0, 0, 1, 1], [1, 0, 1, 1])'],
        ['A false negative hurts recall, not precision', 'pr([0, 0, 1, 1], [0, 0, 0, 1])'],
      ],
      traps: [
        py`from sklearn.metrics import precision_score, recall_score

def pr(y_true, y_pred):
    return (round(float(recall_score(y_true, y_pred)), 4), round(float(precision_score(y_true, y_pred)), 4))`,
        py`from sklearn.metrics import accuracy_score

def pr(y_true, y_pred):
    acc = round(float(accuracy_score(y_true, y_pred)), 4)
    return (acc, acc)`,
      ],
    },
    real: [
      skl({
        title: 'Precision and recall for a "late flight" classifier',
        use: ['flights'],
        starter: 'from sklearn.metrics import precision_score, recall_score\nfrom sklearn.linear_model import LogisticRegression\nsub = [f for f in flights if f["dep_delay"] is not None and f["distance"] is not None][:300]\nX = [[f["distance"]] for f in sub]\ny_true = [1 if f["dep_delay"] > 0 else 0 for f in sub]\nn = len(X)\nsplit = int(n * 0.8)\nmodel = LogisticRegression(max_iter=1000)\nmodel.fit(X[:split], y_true[:split])\ny_pred = model.predict(X[split:]).tolist()\nanswer = ...\n',
        given: '# flights is a list of dictionaries. y_pred already holds real predictions from a fitted model on the held-out portion.',
        brief: 'Store `(precision, recall)` for `y_true[split:]` versus `y_pred`, each rounded to 4 decimals, in `answer`.',
        reference: py`from sklearn.metrics import precision_score, recall_score
from sklearn.linear_model import LogisticRegression
sub = [f for f in flights if f["dep_delay"] is not None and f["distance"] is not None][:300]
X = [[f["distance"]] for f in sub]
y_true = [1 if f["dep_delay"] > 0 else 0 for f in sub]
n = len(X)
split = int(n * 0.8)
model = LogisticRegression(max_iter=1000)
model.fit(X[:split], y_true[:split])
y_pred = model.predict(X[split:]).tolist()
answer = (round(float(precision_score(y_true[split:], y_pred)), 4), round(float(recall_score(y_true[split:], y_pred)), 4))`,
        walkthrough: 'Distance alone is a weak predictor of any departure delay at all, so a modest precision and recall here is an honest result — the metrics are doing their job regardless of how good the underlying model is.',
        traps: [py`from sklearn.metrics import precision_score, recall_score
from sklearn.linear_model import LogisticRegression
sub = [f for f in flights if f["dep_delay"] is not None and f["distance"] is not None][:300]
X = [[f["distance"]] for f in sub]
y_true = [1 if f["dep_delay"] > 0 else 0 for f in sub]
n = len(X)
split = int(n * 0.8)
model = LogisticRegression(max_iter=1000)
model.fit(X[:split], y_true[:split])
y_pred = model.predict(X[split:]).tolist()
answer = (round(float(recall_score(y_true[split:], y_pred)), 4), round(float(precision_score(y_true[split:], y_pred)), 4))`],
      }),
      skl({
        title: 'RMSE for a mass-prediction model',
        use: ['penguins'],
        starter: 'from sklearn.metrics import root_mean_squared_error\nfrom sklearn.linear_model import LinearRegression\nsub = [p for p in penguins if p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]\nX = [[p["flipper_length_mm"]] for p in sub]\ny = [p["body_mass_g"] for p in sub]\nn = len(X)\nsplit = int(n * 0.8)\nmodel = LinearRegression()\nmodel.fit(X[:split], y[:split])\ny_pred = model.predict(X[split:])\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. y_pred already holds real predictions on the held-out portion.',
        brief: 'Store the root-mean-squared-error between `y[split:]` and `y_pred`, rounded to 2 decimals, in `answer`.',
        reference: py`from sklearn.metrics import root_mean_squared_error
from sklearn.linear_model import LinearRegression
sub = [p for p in penguins if p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["flipper_length_mm"]] for p in sub]
y = [p["body_mass_g"] for p in sub]
n = len(X)
split = int(n * 0.8)
model = LinearRegression()
model.fit(X[:split], y[:split])
y_pred = model.predict(X[split:])
answer = round(float(root_mean_squared_error(y[split:], y_pred)), 2)`,
        walkthrough: 'RMSE is in the same units as the target (grams, here), which makes it easy to read directly as "typically off by about this much".',
        traps: [py`from sklearn.metrics import root_mean_squared_error
from sklearn.linear_model import LinearRegression
sub = [p for p in penguins if p["flipper_length_mm"] is not None and p["body_mass_g"] is not None]
X = [[p["flipper_length_mm"]] for p in sub]
y = [p["body_mass_g"] for p in sub]
n = len(X)
split = int(n * 0.8)
model = LinearRegression()
model.fit(X[:split], y[:split])
y_pred = model.predict(X[:split])
answer = round(float(root_mean_squared_error(y[:split], y_pred)), 2)`],
      }),
      skl({
        title: 'AUC for a species classifier',
        use: ['penguins'],
        starter: 'from sklearn.metrics import roc_auc_score\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\nsub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None]\nX = [[p["bill_length_mm"]] for p in sub]\ny = [0 if p["species"] == "Adelie" else 1 for p in sub]\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0, stratify=y)\nmodel = LogisticRegression(max_iter=1000)\nmodel.fit(X_train, y_train)\nproba = model.predict_proba(X_test)[:, 1]\nanswer = ...\n',
        given: '# penguins is a list of dictionaries. proba already holds real predicted probabilities on a real, stratified, seeded held-out split.',
        brief: 'Store the ROC AUC score for `y_test` versus `proba`, rounded to 3 decimals, in `answer`.',
        reference: py`from sklearn.metrics import roc_auc_score
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None]
X = [[p["bill_length_mm"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0, stratify=y)
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
proba = model.predict_proba(X_test)[:, 1]
answer = round(float(roc_auc_score(y_test, proba)), 3)`,
        walkthrough: 'ROC AUC uses the predicted **probabilities**, not just the final 0/1 predictions, which is why `predict_proba` is passed in rather than `predict`; `stratify=y` also guarantees both classes actually appear in the test set, without which AUC is not even defined.',
        traps: [py`from sklearn.metrics import roc_auc_score
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
sub = [p for p in penguins if p["species"] in ("Adelie", "Gentoo") and p["bill_length_mm"] is not None]
X = [[p["bill_length_mm"]] for p in sub]
y = [0 if p["species"] == "Adelie" else 1 for p in sub]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0, stratify=y)
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
proba = model.predict_proba(X_test)[:, 0]
answer = round(float(roc_auc_score(y_test, proba)), 3)`],
      }),
    ],
  },
]
