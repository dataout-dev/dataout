const guided = (p) => ({ kind: 'guided', ...p })
const unguided = (p) => ({ kind: 'unguided', ...p })

export const mlProjects = [
  guided({
    id: 'ml-titanic',
    dataset: 'titanic',
    title: 'Predict who survived the Titanic',
    tagline: 'The classic first classifier, on the same dataset from the EDA path.',
    blurb: 'A clean binary target, mixed numeric and categorical features — the standard first project in predictive modeling.',
    intro:
      "You already explored this dataset in the EDA path. Now predict `Survived` from the other columns. Load it " +
      "with `pd.DataFrame(rows('titanic'))`. Follow the four steps below, at your own pace.",
    steps: [
      {
        id: 'target-features',
        title: 'Step 1 · Define the target and a first feature set',
        body:
          'The target is `Survived` (0 or 1). Pick a small first set of features to predict it with — `Pclass`, ' +
          '`Sex`, `Age`, `Fare` are a reasonable start. Note which of these have missing values (you profiled this ' +
          'already in the EDA path).',
      },
      {
        id: 'prepare',
        title: 'Step 2 · Prepare the features',
        body:
          'A model needs numbers, not text — encode `Sex` (for example, map it to 0/1). Decide what to do about ' +
          'missing `Age` values (a median fill is a reasonable, simple choice here).',
      },
      {
        id: 'split-fit',
        title: 'Step 3 · Split, then fit a first model',
        body:
          'Split into train and test sets with `train_test_split` (try `test_size=0.2, random_state=0`). Fit a ' +
          '`DecisionTreeClassifier` or `LogisticRegression` on the training set only.',
      },
      {
        id: 'evaluate',
        title: 'Step 4 · Evaluate honestly',
        body:
          "Compute accuracy on the TEST set (never the training set). Compare it to the baseline: what accuracy " +
          "would you get by always predicting the majority class? Does your model actually beat that baseline, " +
          "and by how much?",
      },
    ],
    checklist: [
      'Defined the target and a specific first feature set',
      'Handled missing Age and encoded Sex before fitting anything',
      'Split into train and test sets before fitting the model',
      'Compared test-set accuracy to the majority-class baseline, not just reported a number in isolation',
    ],
    verify: [
      {
        id: 'baseline-accuracy',
        label: 'Majority-class baseline accuracy',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('titanic'))\n",
        task: 'Store the accuracy of always predicting the majority class of `Survived`, rounded to 4 decimals, in `answer`.',
        reference: 'answer = round(float(df["Survived"].value_counts(normalize=True).max()), 4)',
        traps: ['answer = round(float(df["Survived"].mean()), 4)'],
        walkthrough: '`value_counts(normalize=True).max()` gives the proportion of the single most common class — that is exactly the accuracy a "always guess the majority" baseline achieves.',
      },
      {
        id: 'split-size',
        label: 'Train/test split size',
        given: "import pandas as pd\nfrom sklearn.model_selection import train_test_split\ndf = pd.DataFrame(rows('titanic'))\n",
        task: 'Using `train_test_split(df, test_size=0.2, random_state=0)`, store `(len(train), len(test))` in `answer`.',
        reference: 'train, test = train_test_split(df, test_size=0.2, random_state=0)\nanswer = (len(train), len(test))',
        traps: ['train, test = train_test_split(df, train_size=0.2, random_state=0)\nanswer = (len(train), len(test))'],
        walkthrough: 'The split sizes only depend on the total row count and `test_size` — they do not depend on which model or features you eventually use.',
      },
    ],
  }),
  guided({
    id: 'ml-adult-census',
    dataset: 'adult-census',
    title: 'Predict who reports over $50K income',
    tagline: 'Mostly categorical features this time — real encoding is unavoidable.',
    blurb: 'The "?" sentinel values from the EDA path need a decision before you can fit anything.',
    intro:
      "Predict `income` (`>50K` or `<=50K`) from the other columns. Load it with " +
      "`pd.DataFrame(rows('adult-census'))`. Most of the useful features here are categorical text, and three " +
      'columns use the literal `"?"` sentinel for missing values, exactly like in the EDA path. Follow the steps below.',
    steps: [
      {
        id: 'target-features',
        title: 'Step 1 · Define the target and features',
        body:
          'The target is `income`. Pick a first feature set mixing numeric (`age`, `hours_per_week`, ' +
          '`education_num`) and categorical (`workclass`, `marital_status`, `occupation`) columns.',
      },
      {
        id: 'handle-sentinel',
        title: 'Step 2 · Handle the "?" sentinel',
        body:
          'Decide what to do with rows where a chosen categorical feature is `"?"` — drop them, or keep `"?"` as ' +
          'its own valid category. Either is defensible; pick one and apply it consistently.',
      },
      {
        id: 'encode-split-fit',
        title: 'Step 3 · Encode, split, fit',
        body:
          'One-hot encode your categorical features (`pandas.get_dummies` is the simplest route). Split into ' +
          'train/test, then fit a classifier on the training set only.',
      },
      {
        id: 'evaluate',
        title: 'Step 4 · Evaluate honestly',
        body:
          'Compute test-set accuracy and compare it to the majority-class baseline. With income data this skewed, ' +
          'beating the baseline is a real, non-trivial bar.',
      },
    ],
    checklist: [
      'Made an explicit, consistent decision about rows with a "?" sentinel',
      'One-hot encoded every categorical feature actually used',
      'Split into train and test sets before fitting',
      "Compared test accuracy to the majority-class baseline",
    ],
    verify: [
      {
        id: 'baseline-accuracy',
        label: 'Majority-class baseline accuracy',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('adult-census'))\n",
        task: 'Store the accuracy of always predicting the majority class of `income`, rounded to 4 decimals, in `answer`.',
        reference: 'answer = round(float(df["income"].value_counts(normalize=True).max()), 4)',
        traps: ['answer = round(float((df["income"] == ">50K").mean()), 4)'],
        walkthrough: 'The majority class here is `<=50K`, not `>50K` — a baseline always guessing `>50K` would actually do worse than the true majority-class baseline.',
      },
      {
        id: 'clean-rows',
        label: 'Rows with a known workclass',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('adult-census'))\n",
        task: 'Store the number of rows where `workclass` is NOT the sentinel `"?"` in `answer`, as an integer.',
        reference: 'answer = int((df["workclass"] != "?").sum())',
        traps: ['answer = int(df["workclass"].notna().sum())'],
        walkthrough: 'This dataset never uses a real null for missing values — only the literal "?" — so `.notna()` alone would count every row, including the disguised-missing ones.',
      },
    ],
  }),
  guided({
    id: 'ml-airbnb-asheville',
    dataset: 'airbnb-asheville',
    title: 'Predict Airbnb price in Asheville',
    tagline: 'A regression project — the target is a number, not a category.',
    blurb: 'Needs the EDA price-parsing step first, then a first look at regression metrics.',
    intro:
      "Predict `price` from the other listing features. Load it with `pd.DataFrame(rows('airbnb-asheville'))`. " +
      'Unlike the first two projects, this target is continuous — you are predicting a number, which calls for ' +
      'different metrics than accuracy. Follow the steps below.',
    steps: [
      {
        id: 'parse-target',
        title: 'Step 1 · Parse the target',
        body:
          '`price` arrives as text (`"$98.60"`). Parse it into a float, and drop the roughly 1-in-10 listings with ' +
          'no price at all — you cannot train on a missing target.',
      },
      {
        id: 'features',
        title: 'Step 2 · Pick and prepare features',
        body:
          'Pick a first feature set — `accommodates`, `bedrooms`, `beds`, `room_type`, `neighbourhood_cleansed` are ' +
          'reasonable. Encode the categorical ones and decide how to handle missing `bedrooms`/`beds`.',
      },
      {
        id: 'split-fit',
        title: 'Step 3 · Split, then fit a regressor',
        body:
          'Split into train/test. Fit a regression model — `DecisionTreeRegressor` or `LinearRegression` both work ' +
          'for a first pass.',
      },
      {
        id: 'evaluate',
        title: 'Step 4 · Evaluate with regression metrics',
        body:
          'Compute mean absolute error (MAE) on the test set. Compare it to the baseline MAE of always predicting ' +
          'the training set\'s mean price — does your model actually beat that?',
      },
    ],
    checklist: [
      'Parsed price from text to a number and dropped listings with no price',
      'Prepared (encoded/filled) every feature actually used',
      'Split into train and test sets before fitting',
      'Compared test-set MAE to a mean-prediction baseline, not just reported MAE alone',
    ],
    verify: [
      {
        id: 'baseline-mae',
        label: 'Mean-prediction baseline MAE',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('airbnb-asheville'))\n",
        task:
          'Parse `price` (strip "$" and commas) into a float column, drop missing values, and store the mean ' +
          'absolute error of always predicting the mean price, rounded to 2 decimals, in `answer`.',
        reference:
          'prices = df["price"].dropna().str.replace("$", "", regex=False).str.replace(",", "", regex=False).astype(float)\nanswer = round(float((prices - prices.mean()).abs().mean()), 2)',
        traps: [
          'prices = df["price"].dropna().str.replace("$", "", regex=False).str.replace(",", "", regex=False).astype(float)\nanswer = round(float((prices - prices.median()).abs().mean()), 2)',
        ],
        walkthrough: 'The mean-prediction baseline specifically uses the mean, not the median — predicting the median minimizes a different error metric (MAE is actually minimized by the median, which is a neat fact, but the conventional "baseline" here is the mean).',
      },
      {
        id: 'priced-count',
        label: 'Listings with a real price',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('airbnb-asheville'))\n",
        task: 'Store the number of listings with a non-missing `price` in `answer`, as an integer.',
        reference: 'answer = int(df["price"].notna().sum())',
        traps: ['answer = int(len(df))'],
        walkthrough: 'Roughly 1 in 10 listings have no price at all — those rows have to be dropped before you can train or evaluate anything on this target.',
      },
    ],
  }),
  guided({
    id: 'ml-student-performance',
    dataset: 'student-performance',
    title: 'Predict final grade — and find the leakage',
    tagline: 'The most important lesson in this whole section, built into one project.',
    blurb: 'Two models, same data — one of them is cheating, and the numbers will show you which.',
    intro:
      "Predict `G3` (final grade, math table) from the other columns. Load it with " +
      "`pd.DataFrame(rows('student-performance', 'student_math'))`. This project has an explicit twist: you will " +
      'fit the SAME kind of model twice, once with a potential leakage problem and once without, and compare.',
    steps: [
      {
        id: 'baseline-model',
        title: 'Step 1 · A first model, without G1/G2',
        body:
          'Pick features that do NOT include `G1` or `G2` — things like `studytime`, `failures`, `absences`, ' +
          '`Medu`, `Fedu`, `internet`. Split, fit a regressor, and record the test-set MAE.',
      },
      {
        id: 'leaky-model',
        title: 'Step 2 · The same model, with G1 and G2 added',
        body:
          'Now add `G1` and `G2` (first and second period grades) to the SAME feature set, and refit. Record the ' +
          'test-set MAE again, using the same train/test split for a fair comparison.',
      },
      {
        id: 'compare',
        title: 'Step 3 · Compare the two',
        body:
          'How much did MAE improve by adding G1/G2? Is this a reasonable use of real, legitimately-available ' +
          'data (a teacher really would know a student\'s earlier grades) — or does it make the project trivial ' +
          'in a way that defeats the point of building a model at all?',
      },
      {
        id: 'question',
        title: 'Step 4 · Decide, and justify',
        body:
          'There is no single right answer here — in some real settings, using G1/G2 is completely legitimate ' +
          '(predicting a final grade from earlier grades IS a real, useful task). Write down which framing you' +
          ' think this dataset calls for, and why.',
      },
    ],
    checklist: [
      'Fit a model without G1/G2 and recorded its test MAE',
      'Fit the same kind of model with G1/G2 added, same split, and recorded its test MAE',
      'Compared the two MAE values directly',
      'Wrote a short justification for which framing (with or without G1/G2) is appropriate here, and why',
    ],
    verify: [
      {
        id: 'baseline-mae',
        label: 'Mean-prediction baseline MAE for G3',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('student-performance', 'student_math'))\n",
        task: 'Store the mean absolute error of always predicting the mean `G3`, rounded to 3 decimals, in `answer`.',
        reference: 'answer = round(float((df["G3"] - df["G3"].mean()).abs().mean()), 3)',
        traps: ['answer = round(float((df["G3"] - df["G3"].median()).abs().mean()), 3)'],
        walkthrough: 'The conventional regression baseline predicts the mean, not the median.',
      },
      {
        id: 'leakage-correlation',
        label: 'Correlation between G1 and G3',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('student-performance', 'student_math'))\n",
        task: 'Store the Pearson correlation between `G1` and `G3`, rounded to 4 decimals, in `answer`.',
        reference: 'answer = round(float(df["G1"].corr(df["G3"])), 4)',
        traps: ['answer = round(float(df["G2"].corr(df["G3"])), 4)'],
        walkthrough: 'This number is the quantitative version of the leakage warning — a very strong correlation is exactly why adding G1 (and G2) makes the prediction task dramatically easier.',
      },
    ],
  }),
  unguided({
    id: 'ml-world-dev-indicators',
    dataset: 'world-dev-indicators',
    title: 'Predict life expectancy from other country indicators',
    tagline: 'Open-ended regression on real, sparsely-reported global data.',
    blurb: 'An open-ended modeling investigation on the same World Bank data from the EDA path.',
    intro:
      "Predict `life_expectancy_years` from the other indicators. Load it with " +
      "`pd.DataFrame(rows('world-dev-indicators'))`. Remember from the EDA path: the `country` column mixes real " +
      "countries with regional aggregates, and coverage varies a lot by indicator — you'll need to decide how to " +
      "handle both before fitting anything. Pick **one** angle below (or bring your own).\n\n" +
      '**Some starting points:**\n' +
      '- Build a baseline model using just `gdp_per_capita_usd`, then see how much adding `co2_per_capita_tonnes` ' +
      'and `population` actually improves it.\n' +
      '- Does excluding the regional aggregate rows (keeping only real countries) change your model\'s performance ' +
      'meaningfully?\n' +
      '- How much does performance change if you only use country-years with ALL 5 indicators present, versus ' +
      'filling in what you can?',
    checklist: [
      'Chose and clearly stated one specific modeling angle',
      'Made an explicit decision about the non-country aggregate rows',
      'Split into train and test sets before fitting anything',
      'Compared test-set MAE to a mean-prediction baseline',
    ],
    verify: [
      {
        id: 'baseline-mae',
        label: 'Mean-prediction baseline MAE',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('world-dev-indicators'))\n",
        task:
          'Among rows with a non-missing `life_expectancy_years`, store the mean absolute error of always ' +
          'predicting the mean, rounded to 3 decimals, in `answer`.',
        reference:
          'vals = df["life_expectancy_years"].dropna()\nanswer = round(float((vals - vals.mean()).abs().mean()), 3)',
        traps: ['vals = df["life_expectancy_years"].fillna(0)\nanswer = round(float((vals - vals.mean()).abs().mean()), 3)'],
        walkthrough: 'Dropping the missing values before computing the baseline matters — treating a missing life expectancy as literally 0 (rather than excluding it) would badly distort both the mean and the error.',
      },
      {
        id: 'coverage',
        label: 'Rows with a reported life expectancy',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('world-dev-indicators'))\n",
        task: 'Store the number of rows with a non-missing `life_expectancy_years` in `answer`, as an integer.',
        reference: 'answer = int(df["life_expectancy_years"].notna().sum())',
        traps: ['answer = int(len(df))'],
        walkthrough: 'This is a meaningfully smaller number than the full row count — a concrete reminder of how much coverage varies by indicator.',
      },
    ],
  }),
  unguided({
    id: 'ml-openfoodfacts',
    dataset: 'openfoodfacts',
    title: 'Predict a product\'s Nutri-Score grade',
    tagline: 'Open-ended classification on crowd-sourced, heavily incomplete data.',
    blurb: 'An open-ended modeling investigation on the same Open Food Facts slice from the EDA path.',
    intro:
      "Predict `nutriscore_grade` (a, b, c, d or e) from the nutrient columns. Load it with " +
      "`pd.DataFrame(rows('openfoodfacts'))`. Remember from the EDA path: `nutriscore_grade` sometimes holds the " +
      'literal text `"unknown"` or `"not-applicable"` instead of a real grade — those rows need to be excluded ' +
      "from training and evaluation, not treated as a sixth category. Most nutrient columns are also missing for " +
      "roughly half the rows. Pick **one** angle below (or bring your own).\n\n" +
      '**Some starting points:**\n' +
      '- Build a model using only products with a complete set of nutrient values — how much data does that ' +
      'actually leave you with?\n' +
      '- Does `nova_group` (degree of processing) alone do a surprisingly good job of predicting the grade?\n' +
      '- How much worse does the model get if you fill missing nutrients with a column mean, instead of dropping ' +
      'those rows?',
    checklist: [
      'Chose and clearly stated one specific modeling angle',
      'Excluded the "unknown"/"not-applicable" sentinel rows from training and evaluation',
      'Split into train and test sets before fitting',
      'Compared test-set accuracy to the majority-class baseline',
    ],
    verify: [
      {
        id: 'real-grade-count',
        label: 'Products with a real grade',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('openfoodfacts'))\n",
        task: 'Store the number of products whose `nutriscore_grade` is one of `a`,`b`,`c`,`d`,`e` (not a sentinel) in `answer`, as an integer.',
        reference: 'answer = int(df["nutriscore_grade"].isin(["a", "b", "c", "d", "e"]).sum())',
        traps: ['answer = int(df["nutriscore_grade"].notna().sum())'],
        walkthrough: 'This dataset marks missing grades with the literal text "unknown" or "not-applicable" — `.notna()` would still count both of those as "present".',
      },
      {
        id: 'baseline-accuracy',
        label: 'Majority-class baseline, among real grades only',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('openfoodfacts'))\n",
        task: 'Among rows with a real grade (`a`-`e`), store the majority-class baseline accuracy, rounded to 4 decimals, in `answer`.',
        reference:
          'real = df[df["nutriscore_grade"].isin(["a", "b", "c", "d", "e"])]\nanswer = round(float(real["nutriscore_grade"].value_counts(normalize=True).max()), 4)',
        traps: [
          'answer = round(float(df["nutriscore_grade"].value_counts(normalize=True).max()), 4)',
        ],
        walkthrough: 'Computing the baseline over the FULL column (sentinels included) answers a different, less useful question than computing it only among rows you could actually train and evaluate on.',
      },
    ],
  }),
  unguided({
    id: 'ml-online-retail',
    dataset: 'online-retail',
    title: 'Predict whether an order will be cancelled',
    tagline: 'Open-ended classification on real transactional data.',
    blurb: 'An open-ended modeling investigation on the same Online Retail data from the EDA path.',
    intro:
      "Predict whether an invoice line is a cancellation (an `InvoiceNo` starting with `\"C\"`) from the other " +
      "columns. Load it with `pd.DataFrame(rows('online-retail'))`. Remember from the EDA path: cancellations are " +
      "identified by the InvoiceNo prefix, and about 1 in 3 rows has no `CustomerID`. Pick **one** angle below " +
      "(or bring your own).\n\n" +
      '**Some starting points:**\n' +
      '- Does `Quantity` alone (even before you know it is negative for cancellations) already separate the two ' +
      "classes almost perfectly — and if so, is that a fair feature to use, or is it leakage in disguise?\n" +
      '- Excluding `Quantity` entirely, can `UnitPrice`, `Country` and whether `CustomerID` is missing predict a ' +
      'cancellation at all?\n' +
      '- Does the model do differently well across different countries in this data?',
    checklist: [
      'Chose and clearly stated one specific modeling angle',
      'Considered whether a feature (especially Quantity) is actually fair to use, or a form of leakage',
      'Split into train and test sets before fitting',
      'Compared test-set accuracy to the majority-class baseline',
    ],
    verify: [
      {
        id: 'baseline-accuracy',
        label: 'Majority-class baseline accuracy',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('online-retail'))\ndf['is_cancelled'] = df['InvoiceNo'].str.startswith('C')\n",
        task: 'Store the majority-class baseline accuracy for `is_cancelled`, rounded to 4 decimals, in `answer`.',
        reference: 'answer = round(float(df["is_cancelled"].value_counts(normalize=True).max()), 4)',
        traps: ['answer = round(float(df["is_cancelled"].mean()), 4)'],
        walkthrough: 'Since cancellations are a small minority, the majority-class baseline is already quite high — a useful number to know before judging any model\'s accuracy.',
      },
      {
        id: 'cancel-rate',
        label: 'Share of rows that are cancellations',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('online-retail'))\n",
        task: 'Store the fraction of rows whose `InvoiceNo` starts with `"C"` in `answer`, rounded to 4 decimals.',
        reference: 'answer = round(float(df["InvoiceNo"].str.startswith("C").mean()), 4)',
        traps: ['answer = round(float((df["Quantity"] < 0).mean()), 4)'],
        walkthrough: 'Quantity being negative and InvoiceNo starting with "C" should agree almost everywhere, but the official definition of a cancellation here is the InvoiceNo prefix.',
      },
    ],
  }),
  unguided({
    id: 'ml-storm-events',
    dataset: 'storm-events',
    title: 'Predict whether a storm causes significant property damage',
    tagline: 'Open-ended classification, reframed around property damage rather than human harm.',
    blurb: 'An open-ended modeling investigation on the same NOAA storm events from the EDA path.',
    intro:
      "Predict whether a storm event's property damage exceeds $10,000, from the other columns. Load it with " +
      "`pd.DataFrame(rows('storm-events'))`. You'll need the same damage-parsing skill from the EDA path to turn " +
      '`DAMAGE_PROPERTY` (text like `"40.00K"`) into a real number before you can define this target at all. Pick ' +
      "**one** angle below (or bring your own).\n\n" +
      '**Some starting points:**\n' +
      '- Does `EVENT_TYPE` alone do most of the predictive work, or do `STATE` and `MAGNITUDE` add something real?\n' +
      '- Build a model using only events that have a recorded `MAGNITUDE` — how much of the dataset does that ' +
      'exclude, and does it change what the model can tell you?\n' +
      '- Is the model noticeably better or worse for one particular state in this data?',
    checklist: [
      'Parsed DAMAGE_PROPERTY into a real number before defining the target',
      'Chose and clearly stated one specific modeling angle',
      'Split into train and test sets before fitting',
      'Compared test-set accuracy to the majority-class baseline',
    ],
    verify: [
      {
        id: 'high-damage-rate',
        label: 'Share of events over $10K in property damage',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('storm-events'))\n",
        task:
          'Parse `DAMAGE_PROPERTY` (K/M suffixes, missing = 0) into dollars, and store the fraction of events ' +
          'exceeding $10,000 in `answer`, rounded to 4 decimals.',
        reference:
          'def parse_damage(v):\n    if pd.isna(v) or v == "":\n        return 0.0\n    multipliers = {"K": 1_000, "M": 1_000_000}\n    suffix = v[-1]\n    if suffix in multipliers:\n        return float(v[:-1]) * multipliers[suffix]\n    return float(v)\n\ndamage = df["DAMAGE_PROPERTY"].apply(parse_damage)\nanswer = round(float((damage > 10_000).mean()), 4)',
        traps: [
          'def parse_damage(v):\n    if pd.isna(v) or v == "":\n        return 0.0\n    return float(v.rstrip("KM"))\n\ndamage = df["DAMAGE_PROPERTY"].apply(parse_damage)\nanswer = round(float((damage > 10_000).mean()), 4)',
        ],
        walkthrough: 'Stripping the K/M suffix without applying its multiplier silently treats every value as if it were already in dollars, drastically undercounting events over the threshold.',
      },
      {
        id: 'baseline-accuracy',
        label: 'Majority-class baseline accuracy',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('storm-events'))\n",
        task:
          'Using the same damage parsing, store the majority-class baseline accuracy for "exceeds $10,000" in ' +
          '`answer`, rounded to 4 decimals.',
        reference:
          'def parse_damage(v):\n    if pd.isna(v) or v == "":\n        return 0.0\n    multipliers = {"K": 1_000, "M": 1_000_000}\n    suffix = v[-1]\n    if suffix in multipliers:\n        return float(v[:-1]) * multipliers[suffix]\n    return float(v)\n\ndamage = df["DAMAGE_PROPERTY"].apply(parse_damage)\ntarget = damage > 10_000\nanswer = round(float(target.value_counts(normalize=True).max()), 4)',
        traps: [
          'def parse_damage(v):\n    if pd.isna(v) or v == "":\n        return 0.0\n    multipliers = {"K": 1_000, "M": 1_000_000}\n    suffix = v[-1]\n    if suffix in multipliers:\n        return float(v[:-1]) * multipliers[suffix]\n    return float(v)\n\ndamage = df["DAMAGE_PROPERTY"].apply(parse_damage)\ntarget = damage > 10_000\nanswer = round(float(target.mean()), 4)',
        ],
        walkthrough: 'Most events do NOT exceed $10,000 in property damage, so the majority-class baseline is "always predict no" — its accuracy equals one minus the positive rate, not the positive rate itself.',
      },
    ],
  }),
]
