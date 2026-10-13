const learn = (id, title, blurb, check) => ({ id, title, blurb, kind: 'learn', check })

export const mlLessons = [
  {
    id: 'ml-train-test-split',
    title: 'Train/test split and why it matters',
    blurb: 'The single most important rule in predictive modeling: never grade a model on data it already saw.',
    kind: 'code',
    practice: {
      prompt:
        'Write `split_sizes(n, test_size)`: using `train_test_split` on `np.arange(n)` with that `test_size` fraction ' +
        'and `random_state=0`, return `(len(train_idx), len(test_idx))` as a tuple of two ints.',
      starter: 'import numpy as np\nfrom sklearn.model_selection import train_test_split\n\ndef split_sizes(n, test_size):\n    ...\n',
      solution:
        'import numpy as np\nfrom sklearn.model_selection import train_test_split\n\ndef split_sizes(n, test_size):\n    idx = np.arange(n)\n    train_idx, test_idx = train_test_split(idx, test_size=test_size, random_state=0)\n    return (len(train_idx), len(test_idx))',
      samples: ['split_sizes(100, 0.2)'],
      cases: [
        ['A round 100 rows, 20% test', 'split_sizes(100, 0.2)'],
        ['A smaller set, 25% test', 'split_sizes(40, 0.25)'],
        ['A 30% test split', 'split_sizes(200, 0.3)'],
      ],
      traps: [
        'import numpy as np\nfrom sklearn.model_selection import train_test_split\n\ndef split_sizes(n, test_size):\n    idx = np.arange(n)\n    train_idx, test_idx = train_test_split(idx, train_size=test_size, random_state=0)\n    return (len(train_idx), len(test_idx))',
      ],
    },
  },
  {
    id: 'ml-fitting-a-first-model',
    title: 'Fitting a first model',
    blurb: 'Fit, predict, done — the shortest possible path to a working (if not yet good) model.',
    kind: 'code',
    practice: {
      prompt:
        'Write `fit_and_predict(X_train, y_train, X_test)`: fit a `DecisionTreeClassifier(random_state=0)` on ' +
        '`X_train`/`y_train`, and return its predictions on `X_test` as a plain list of ints.',
      starter:
        'from sklearn.tree import DecisionTreeClassifier\n\ndef fit_and_predict(X_train, y_train, X_test):\n    ...\n',
      solution:
        'from sklearn.tree import DecisionTreeClassifier\n\ndef fit_and_predict(X_train, y_train, X_test):\n    model = DecisionTreeClassifier(random_state=0)\n    model.fit(X_train, y_train)\n    return [int(p) for p in model.predict(X_test)]',
      samples: ['fit_and_predict([[0], [1], [2], [3]], [0, 0, 1, 1], [[0], [3]])'],
      cases: [
        ['A clearly-separable toy set', 'fit_and_predict([[0], [1], [2], [3]], [0, 0, 1, 1], [[0], [3]])'],
        ['A slightly larger toy set', 'fit_and_predict([[0], [1], [2], [3], [4], [5]], [0, 0, 0, 1, 1, 1], [[1], [4]])'],
      ],
      traps: [
        'from sklearn.tree import DecisionTreeClassifier\n\ndef fit_and_predict(X_train, y_train, X_test):\n    model = DecisionTreeClassifier(random_state=0)\n    model.fit(X_test, y_train[: len(X_test)])\n    return [int(p) for p in model.predict(X_test)]',
      ],
    },
  },
  {
    id: 'ml-evaluating-honestly',
    title: 'Evaluating honestly',
    blurb: 'A model is only as impressive as the dumb baseline it beats.',
    kind: 'code',
    practice: {
      prompt:
        'Write `vs_baseline(y_true, y_pred)`: given true labels and predicted labels (lists of 0/1), return ' +
        '`(accuracy, baseline_accuracy)` — the real accuracy via `accuracy_score`, and the accuracy of a dumb ' +
        'baseline that always predicts the majority class in `y_true` — both as floats.',
      starter: 'from sklearn.metrics import accuracy_score\n\ndef vs_baseline(y_true, y_pred):\n    ...\n',
      solution:
        'from sklearn.metrics import accuracy_score\n\ndef vs_baseline(y_true, y_pred):\n    acc = float(accuracy_score(y_true, y_pred))\n    majority = max(set(y_true), key=y_true.count)\n    baseline_preds = [majority] * len(y_true)\n    baseline = float(accuracy_score(y_true, baseline_preds))\n    return (acc, baseline)',
      samples: ['vs_baseline([0, 0, 0, 1, 1], [0, 0, 1, 1, 1])'],
      cases: [
        ['A model that beats the baseline', 'vs_baseline([0, 0, 0, 1, 1], [0, 0, 1, 1, 1])'],
        ['A model no better than the baseline', 'vs_baseline([0, 0, 0, 0, 1], [0, 0, 0, 0, 0])'],
        ['A perfectly balanced set', 'vs_baseline([0, 0, 1, 1], [0, 1, 1, 0])'],
      ],
      traps: [
        'from sklearn.metrics import accuracy_score\n\ndef vs_baseline(y_true, y_pred):\n    acc = float(accuracy_score(y_true, y_pred))\n    majority = max(set(y_pred), key=y_pred.count)\n    baseline_preds = [majority] * len(y_true)\n    baseline = float(accuracy_score(y_true, baseline_preds))\n    return (acc, baseline)',
      ],
    },
  },
  learn(
    'ml-overfitting-leakage',
    'Overfitting and data leakage',
    'A model that looks great in testing and useless in reality has usually fallen for one of these two traps.',
    [
      {
        q: 'What is overfitting, in one sentence?',
        options: [
          'A model that trains too quickly',
          "A model that has learned the training data's noise and quirks so specifically that it fails to generalize to new data",
          'A model with too few features',
          'A model that uses too little training data',
        ],
        answer: 1,
        why: 'An overfit model memorizes rather than generalizes — it looks excellent on the exact rows it trained on and noticeably worse on anything new.',
      },
      {
        q: 'Why does evaluating a model on its own training data give a misleadingly optimistic picture?',
        options: [
          'It does not — training accuracy is always a fair estimate',
          'A model can partly memorize its training data, so its performance there is not a fair preview of how it handles data it has never seen',
          'Training data is always smaller than test data',
          'Training accuracy is always lower than test accuracy',
        ],
        answer: 1,
        why: 'This is exactly why the train/test split from the first lesson exists — the test set is the only honest preview of real-world performance.',
      },
      {
        q: 'What is "data leakage" in predictive modeling?',
        options: [
          'A bug that causes a program to crash',
          'A feature in the training data that, directly or indirectly, contains information about the target that would not actually be available at prediction time',
          'A model that uses too many features',
          'Missing values in the dataset',
        ],
        answer: 1,
        why: 'Leakage makes a model look great during development and then fail in the real world, because the "shortcut" feature that made prediction easy will not exist when you actually need to predict on new data.',
      },
      {
        q: 'A model predicting a student\'s final grade (G3) is given their first and second period grades (G1, G2) as features, and scores extremely well. What should that make you suspicious of?',
        options: [
          'Nothing — this is simply a very good model',
          'G1 and G2 are so strongly related to G3 that the model may just be restating an already-known trend rather than learning something genuinely predictive from independent features',
          'The model must have a bug',
          'The test set must be too small',
        ],
        answer: 1,
        why: 'This is a classic near-leakage case: G1/G2 are not technically "the answer," but they are so predictive of G3 that a model using them tells you much less than it appears to.',
      },
      {
        q: 'What is a reasonable defense against leakage, beyond just a correct train/test split?',
        options: [
          'Use as many features as possible, regardless of source',
          'For every feature, ask whether it would actually be available, in that exact form, at the moment you would need to make a real prediction',
          'Leakage cannot be prevented, only detected after the fact',
          'Always use the simplest possible model',
        ],
        answer: 1,
        why: "The train/test split catches a model memorizing training ROWS. It does not catch a feature that structurally gives away the answer — that requires actually thinking about where each feature comes from.",
      },
    ]
  ),
  {
    id: 'ml-encoding-categoricals',
    title: 'Encoding categorical features and handling missing predictors',
    blurb: "A model can't take a raw text column, or a gap, the way pandas can.",
    kind: 'code',
    practice: {
      prompt:
        'Write `one_hot_columns(values)`: given a list of category strings, use `pandas.get_dummies` to one-hot ' +
        'encode them, and return the resulting columns as a sorted list of strings.',
      starter: 'import pandas as pd\n\ndef one_hot_columns(values):\n    ...\n',
      solution:
        'import pandas as pd\n\ndef one_hot_columns(values):\n    dummies = pd.get_dummies(pd.Series(values))\n    return sorted(dummies.columns.tolist())',
      samples: ['one_hot_columns(["red", "blue", "red", "green"])'],
      cases: [
        ['Three categories', 'one_hot_columns(["red", "blue", "red", "green"])'],
        ['Two categories', 'one_hot_columns(["yes", "no", "yes", "yes"])'],
        ['A single repeated category', 'one_hot_columns(["only"])'],
      ],
      traps: [
        'import pandas as pd\n\ndef one_hot_columns(values):\n    dummies = pd.get_dummies(pd.Series(values), drop_first=True)\n    return sorted(dummies.columns.tolist())',
      ],
    },
  },
]
