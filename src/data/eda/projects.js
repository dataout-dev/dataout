const guided = (p) => ({ kind: 'guided', ...p })
const unguided = (p) => ({ kind: 'unguided', ...p })

export const edaProjects = [
  guided({
    id: 'eda-titanic',
    dataset: 'titanic',
    title: 'Who survived the Titanic, and why does the data make that hard to answer cleanly?',
    tagline: 'Missing ages, missing cabins, and a name field hiding a feature.',
    blurb: 'A first guided pass: profile it, confront the missingness, engineer one feature, answer one real question.',
    intro:
      "The Titanic passenger manifest is the most famous messy dataset in data science for a reason: it looks simple " +
      "(survived or not, a handful of columns) and is not. `Age` is missing for about 1 in 5 passengers and `Cabin` " +
      "for more than 3 in 4. Load it with `rows('titanic')`, follow the four steps below in your own notebook, and " +
      "use the checklist at the end to decide for yourself when you're done.",
    steps: [
      {
        id: 'profile',
        title: 'Step 1 · Profile it',
        body:
          "Load the data into a DataFrame with `pd.DataFrame(rows('titanic'))`. Check its shape, its dtypes, and " +
          'print the first few rows. Specifically answer: how many passengers are there, and which columns have ' +
          'missing values (and how many)?',
      },
      {
        id: 'missingness',
        title: 'Step 2 · Decide what to do about Age and Cabin',
        body:
          '`Age` is missing for about 20% of passengers — too much to just drop those rows without losing a fifth ' +
          'of your data. `Cabin` is missing for more than 75% — arguably too sparse to be very useful as-is. Pick ' +
          'and justify an approach for each (for example: a reasoned fill value for `Age`, like the median per ' +
          'passenger class; and either dropping `Cabin` or reducing it to "has a recorded cabin or not").',
      },
      {
        id: 'feature',
        title: 'Step 3 · Engineer one feature from Name',
        body:
          'The `Name` column embeds a title (Mr., Mrs., Miss, Master, Dr., ...) as free text. Extract it into its ' +
          'own column — this is a classic example of a feature that is *in* the data but not given to you as a ' +
          'column.',
      },
      {
        id: 'question',
        title: 'Step 4 · Answer one real question',
        body:
          'Using what you have cleaned and engineered, answer: did survival rate differ meaningfully by passenger ' +
          'class, sex, or the title you extracted? Pick at least one of these and show the actual numbers, not just ' +
          'an impression.',
      },
    ],
    checklist: [
      'Reported the dataset shape and which columns have missing values',
      'Made (and can explain) a specific decision about Age and about Cabin',
      'Extracted a title from Name into its own column',
      'Answered a specific survival-rate question with actual numbers, not just a guess',
    ],
    verify: [
      {
        id: 'row-count',
        label: 'Total passenger count',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('titanic'))\n",
        task: 'Store the total number of passengers (rows) in `answer`, as an integer.',
        reference: 'answer = int(len(df))',
        traps: ['answer = int(df["Survived"].sum())'],
        walkthrough: 'The row count of the DataFrame is simply `len(df)`.',
      },
      {
        id: 'age-missing',
        label: 'Missing Age count',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('titanic'))\n",
        task: 'Store the number of passengers with a missing `Age` in `answer`, as an integer.',
        reference: 'answer = int(df["Age"].isna().sum())',
        traps: ['answer = int((df["Age"] == 0).sum())'],
        walkthrough: '`.isna()` flags `None`/`NaN`, and `.sum()` counts the `True` values.',
      },
    ],
  }),
  guided({
    id: 'eda-online-retail',
    dataset: 'online-retail',
    title: 'Did this online retailer actually grow month over month, after you remove the noise?',
    tagline: 'Cancellations, anonymous customers, and a question that needs real cleaning first.',
    blurb: 'A transactional dataset where the "obvious" answer changes once you handle cancellations correctly.',
    intro:
      "This is 2 months of real invoice line items from a UK online retailer. Load it with " +
      "`rows('online-retail')`. About 1 in 3 rows has no `CustomerID` (real anonymous transactions), and " +
      "cancelled orders are mixed in disguised as an `InvoiceNo` starting with the letter C and a negative " +
      "`Quantity` — not flagged any other way. Follow the steps below, then decide for yourself when the checklist " +
      'is satisfied.',
    steps: [
      {
        id: 'profile',
        title: 'Step 1 · Profile it',
        body:
          'Load the data and check its shape and dtypes. How many distinct invoices are there, and how many rows ' +
          'have no `CustomerID`?',
      },
      {
        id: 'cancellations',
        title: 'Step 2 · Find and separate the cancellations',
        body:
          'Identify every row that is a cancellation (an `InvoiceNo` starting with "C"). Confirm that these rows ' +
          'also have a negative `Quantity`. Decide how you will treat them for a revenue calculation — excluded ' +
          'entirely, or netted against the original sale?',
      },
      {
        id: 'revenue',
        title: 'Step 3 · Compute real revenue per invoice line',
        body:
          'Revenue is not a given column here — it is `Quantity * UnitPrice`. Compute it, then decide what (if ' +
          'anything) to do about the handful of rows where `UnitPrice` is 0 (which earn no revenue regardless of ' +
          'quantity).',
      },
      {
        id: 'question',
        title: 'Step 4 · Answer one real question',
        body:
          'With cancellations handled, did daily or weekly revenue trend up, down, or stay flat across the two ' +
          'months in this data? Show the actual numbers behind your answer, not just a chart.',
      },
    ],
    checklist: [
      'Reported how many rows have no CustomerID, without just dropping them unexamined',
      'Identified cancellation rows and made an explicit decision about how to treat them',
      'Computed revenue per line item correctly',
      'Answered the revenue-trend question with real numbers',
    ],
    verify: [
      {
        id: 'cancel-count',
        label: 'Cancellation row count',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('online-retail'))\n",
        task: 'Store the number of rows whose `InvoiceNo` starts with "C" in `answer`, as an integer.',
        reference: 'answer = int(df["InvoiceNo"].str.startswith("C").sum())',
        traps: ['answer = int((df["Quantity"] < 0).sum())'],
        walkthrough: 'Cancellations are identified by the InvoiceNo prefix, not by sign of Quantity alone (though the two should agree).',
      },
      {
        id: 'missing-customer',
        label: 'Rows with no CustomerID',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('online-retail'))\n",
        task: 'Store the number of rows with a missing `CustomerID` in `answer`, as an integer.',
        reference: 'answer = int(df["CustomerID"].isna().sum())',
        traps: ['answer = int((df["CustomerID"] == "").sum())'],
        walkthrough: 'A missing CustomerID loads as a real null (NaN/None), not an empty string, so `.isna()` is the right check.',
      },
    ],
  }),
  guided({
    id: 'eda-adult-census',
    dataset: 'adult-census',
    title: 'Who reports over $50K income, once you deal with the hidden "?" values?',
    tagline: 'Missing values disguised as a normal-looking category.',
    blurb: 'The missingness here never shows up as NULL — it is a literal "?" sitting in three columns.',
    intro:
      "This is 1994 US Census data: 32,561 people, with the task of predicting who earns over $50K a year. Load it " +
      "with `rows('adult-census')`. The twist: there is no NULL anywhere in this file. Missing values in " +
      '`workclass`, `occupation` and `native_country` are recorded as a literal `"?"` string instead. Follow the ' +
      'steps below.',
    steps: [
      {
        id: 'profile',
        title: 'Step 1 · Profile it, and find the disguised missingness',
        body:
          'Check the shape and dtypes. Then specifically look for the string `"?"` in every text column — do not ' +
          'rely on a null-count check alone, since it will report zero missing values here even though they exist.',
      },
      {
        id: 'decide',
        title: 'Step 2 · Decide how to handle the "?" rows',
        body:
          'Once you have found them, decide: drop those rows, replace "?" with a real missing marker and keep them, ' +
          'or recode "?" as its own explicit category ("unknown")? There is a real argument for more than one of ' +
          'these — pick one and be ready to say why.',
      },
      {
        id: 'compare',
        title: 'Step 3 · Compare income by one categorical column',
        body:
          'Pick one cleaned categorical column (education, marital_status, or another of your choice) and compute ' +
          'the proportion of each category that reports income over $50K ("income" is already a >50K / <=50K label).',
      },
      {
        id: 'question',
        title: 'Step 4 · Answer one real question',
        body:
          'Does hours_per_week relate to reported income level in this data? Show the actual comparison (for ' +
          'example, average hours_per_week for each income group), not just an assumption.',
      },
    ],
    checklist: [
      'Found the "?" sentinel in the relevant columns (not just checked for NULL)',
      'Made and can justify a specific decision for handling those rows',
      'Compared income by at least one categorical column with real numbers',
      "Answered the hours_per_week question with the actual comparison",
    ],
    verify: [
      {
        id: 'question-marks',
        label: 'Rows with "?" in workclass',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('adult-census'))\n",
        task: 'Store the number of rows where `workclass` equals `"?"` in `answer`, as an integer.',
        reference: 'answer = int((df["workclass"] == "?").sum())',
        traps: ['answer = int(df["workclass"].isna().sum())'],
        walkthrough: 'This dataset never uses NULL for missing values — only the literal string "?".',
      },
      {
        id: 'over-50k',
        label: 'Share earning over $50K',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('adult-census'))\n",
        task: 'Store the fraction (0 to 1, as a float) of all rows where `income` equals `">50K"` in `answer`, rounded to 4 decimals.',
        reference: 'answer = round(float((df["income"] == ">50K").mean()), 4)',
        traps: ['answer = round(float((df["income"] == ">50K").sum()), 4)'],
        walkthrough: '`.mean()` on a boolean Series gives the fraction that is True directly.',
      },
    ],
  }),
  guided({
    id: 'eda-airbnb-asheville',
    dataset: 'airbnb-asheville',
    title: 'What actually drives Airbnb price in Asheville, once price is a real number?',
    tagline: 'Price is text. Reviews are missing for listings that have never been booked.',
    blurb: "Type coercion first, then a real look at what's associated with price.",
    intro:
      "2,865 Airbnb listings from Asheville, NC. Load it with `rows('airbnb-asheville')`. `price` arrives as text " +
      '(`"$98.60"`), not a number, and a listing with zero reviews has NULL for every review-related column — that ' +
      'is a real, meaningful state, not an error. Follow the steps below.',
    steps: [
      {
        id: 'profile',
        title: 'Step 1 · Profile it',
        body: 'Check shape and dtypes. Confirm `price` loads as text, and find how many listings have no price at all.',
      },
      {
        id: 'parse-price',
        title: 'Step 2 · Parse price into a real number',
        body:
          'Strip the "$" (and any thousands commas, though prices here are all under $1,000) and convert `price` to ' +
          'a float column. Decide what to do with the listings that have no price.',
      },
      {
        id: 'reviews',
        title: 'Step 3 · Understand the review-score nulls',
        body:
          'Check how many listings have a null `review_scores_rating`, and confirm (by checking `number_of_reviews`) ' +
          'that these are listings with zero reviews, not a data error.',
      },
      {
        id: 'question',
        title: 'Step 4 · Answer one real question',
        body:
          'Using your cleaned price column, does `room_type` (entire home vs. private room vs. shared room) relate ' +
          'to price? Show the actual average or median price per room type.',
      },
    ],
    checklist: [
      'Converted price from text to a real number',
      'Reported how many listings have no price, and decided what to do about them',
      'Confirmed that missing review scores correspond to zero-review listings',
      'Answered the price-by-room-type question with real numbers',
    ],
    verify: [
      {
        id: 'no-price',
        label: 'Listings with no price',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('airbnb-asheville'))\n",
        task: 'Store the number of listings with a missing `price` in `answer`, as an integer.',
        reference: 'answer = int(df["price"].isna().sum())',
        traps: ['answer = int((df["price"] == "").sum())'],
        walkthrough: 'A listing with no price loads as a real null, not an empty string.',
      },
      {
        id: 'median-price',
        label: 'Median price (parsed)',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('airbnb-asheville'))\n",
        task: 'Parse `price` (strip the "$" and any thousands commas) into a float column and store the median price, rounded to 2 decimals, in `answer`.',
        reference:
          'prices = df["price"].dropna().str.replace("$", "", regex=False).str.replace(",", "", regex=False).astype(float)\nanswer = round(float(prices.median()), 2)',
        traps: [
          'prices = df["price"].dropna().str.replace("$", "", regex=False).str.replace(",", "", regex=False).astype(float)\nanswer = round(float(prices.mean()), 2)',
        ],
        walkthrough: 'Drop the nulls first, strip the dollar sign AND any thousands commas (some Asheville listings price over $1,000), convert to float, then take the median (not the mean) as asked.',
      },
    ],
  }),
  unguided({
    id: 'eda-openfoodfacts',
    dataset: 'openfoodfacts',
    title: 'Investigate US food products and their nutrition data',
    tagline: 'Crowd-sourced, sparse, and genuinely inconsistent — pick your own angle.',
    blurb: 'An open-ended investigation on 5,445 US products from the crowd-sourced Open Food Facts database.',
    intro:
      "This is a themed slice of Open Food Facts: 5,445 US products, with brand, category, label and nutrition data. " +
      "Load it with `rows('openfoodfacts')`. It is crowd-sourced, so completeness varies hugely from product to " +
      "product — most nutrient columns are missing for roughly half the rows, and `nutriscore_grade` sometimes " +
      'holds the literal text `"unknown"` or `"not-applicable"` instead of a real grade. There is no reference ' +
      "answer here — pick **one** question below (or bring your own) and investigate it in your notebook.\n\n" +
      '**Some starting points:**\n' +
      '- Which categories of product tend to be the least complete (most missing nutrition data), and does that ' +
      'change what conclusions you could trust about them?\n' +
      '- Among products with a real nutriscore_grade, how does sugars_100g or salt_100g actually differ between ' +
      'grades?\n' +
      '- Do products with more labels (organic, non-GMO, etc., recorded in the `labels` column) tend to have ' +
      'different nutrition profiles than products with none?',
    checklist: [
      'Chose and clearly stated one specific question',
      'Explicitly handled the "unknown"/"not-applicable" sentinel values in nutriscore_grade rather than treating them as real grades',
      'Compared at least two groups (categories, grades, or label-presence) with real numbers',
      'Wrote 2-3 sentences summarizing the finding',
    ],
    verify: [
      {
        id: 'unknown-grade',
        label: 'Products with a disguised missing grade',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('openfoodfacts'))\n",
        task: 'Store the number of products where `nutriscore_grade` equals `"unknown"` in `answer`, as an integer.',
        reference: 'answer = int((df["nutriscore_grade"] == "unknown").sum())',
        traps: ['answer = int(df["nutriscore_grade"].isna().sum())'],
        walkthrough: 'The sentinel here is the literal string "unknown", separate from genuine nulls.',
      },
      {
        id: 'complete-nutrients',
        label: 'Products with real energy data',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('openfoodfacts'))\n",
        task: 'Store the number of products with a non-missing `energy_kcal_100g` in `answer`, as an integer.',
        reference: 'answer = int(df["energy_kcal_100g"].notna().sum())',
        traps: ['answer = int(len(df))'],
        walkthrough: '`.notna()` is the complement of `.isna()` — it flags the rows that DO have a real value.',
      },
    ],
  }),
  unguided({
    id: 'eda-world-dev-indicators',
    dataset: 'world-dev-indicators',
    title: 'Investigate 20 years of global development indicators',
    tagline: 'Wide-to-long reshaping already done for you — the gaps and the aggregates are not.',
    blurb: 'An open-ended investigation across GDP, life expectancy, population, CO2 and poverty, 2003-2023.',
    intro:
      "5 World Bank indicators for ~215 countries and regions, 2003-2023, already reshaped into one row per " +
      "country/year. Load it with `rows('world-dev-indicators')`. Two real gotchas: the `country` column mixes " +
      'real countries with aggregates the World Bank reports the same way ("World", "Sub-Saharan Africa", "Arab ' +
      'World", ...) — nothing filters those out for you. And coverage varies hugely by indicator: poverty_rate_pct ' +
      'in particular is only reported for a fraction of country-years. Pick **one** question below (or bring your ' +
      "own).\n\n" +
      '**Some starting points:**\n' +
      '- Is there a visible relationship between gdp_per_capita_usd and life_expectancy_years across countries, and ' +
      'does it hold up once you exclude the regional aggregates?\n' +
      '- How has co2_per_capita_tonnes changed over the 20 years for a handful of countries you pick?\n' +
      '- Which countries have the most complete data across all 5 indicators, and which have the least — and does ' +
      'that pattern itself tell you something?',
    checklist: [
      'Chose and clearly stated one specific question',
      'Explicitly excluded (or explicitly chose to keep, with a reason) the non-country aggregate rows',
      'Accounted for the very different coverage/missingness across the 5 indicators',
      'Wrote 2-3 sentences summarizing the finding',
    ],
    verify: [
      {
        id: 'distinct-entities',
        label: 'Distinct country/region names',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('world-dev-indicators'))\n",
        task: 'Store the number of distinct values in `country` in `answer`, as an integer.',
        reference: 'answer = int(df["country"].nunique())',
        traps: ['answer = int(df["country_code"].nunique())'],
        walkthrough: 'Note this count includes the non-country aggregates — that is itself worth noticing.',
      },
      {
        id: 'poverty-coverage',
        label: 'Rows with a reported poverty rate',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('world-dev-indicators'))\n",
        task: 'Store the number of rows with a non-missing `poverty_rate_pct` in `answer`, as an integer.',
        reference: 'answer = int(df["poverty_rate_pct"].notna().sum())',
        traps: ['answer = int(len(df))'],
        walkthrough: 'This is a small fraction of all rows — a concrete number for how sparse this particular indicator is.',
      },
    ],
  }),
  unguided({
    id: 'eda-student-performance',
    dataset: 'student-performance',
    title: 'Investigate what relates to student grades',
    tagline: 'Two subjects, two tables, no shared key to match students between them.',
    blurb: 'An open-ended investigation on survey and grade data for Portuguese secondary school students.',
    intro:
      "Survey and grade data for 395 math students and 649 Portuguese-language students at two Portuguese secondary " +
      "schools. This dataset has two tables, so load each explicitly: `rows('student-performance', 'student_math')` " +
      "and `rows('student-performance', 'student_portuguese')`. Some students appear in both (same student, two " +
      'subjects), but there is no shared ID column to match them — that join, if you want it, has to be approximate ' +
      '(same school, sex, age and a few other fields) or skipped entirely. Grades (G1, G2, G3) are on a 0-20 scale, ' +
      "not a percentage. Pick **one** question below (or bring your own).\n\n" +
      '**Some starting points:**\n' +
      '- Does weekly alcohol consumption (Dalc/Walc, both 1-5 ratings) relate to final grade (G3) in either subject?\n' +
      "- How much do G1 (first period) and G3 (final) grades actually agree — do students who start weak usually " +
      "finish weak?\n" +
      '- Does internet access at home (the `internet` yes/no column) relate to grades once you also account for ' +
      "studytime?",
    checklist: [
      'Chose and clearly stated one specific question',
      'Used the correct table(s) for the chosen subject(s), loaded with the right table name',
      'Did not treat G1/G2/G3 as a percentage or treat Likert-scale columns as if they were grades',
      'Wrote 2-3 sentences summarizing the finding',
    ],
    verify: [
      {
        id: 'math-rows',
        label: 'Math student count',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('student-performance', 'student_math'))\n",
        task: 'Store the number of students in the math table in `answer`, as an integer.',
        reference: 'answer = int(len(df))',
        traps: ["answer = int(df['G3'].sum())"],
        walkthrough: 'Row count of the math table.',
      },
      {
        id: 'avg-final-grade',
        label: 'Average final grade (Portuguese)',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('student-performance', 'student_portuguese'))\n",
        task: 'Store the average `G3` (final grade) for the Portuguese-language table in `answer`, rounded to 2 decimals.',
        reference: 'answer = round(float(df["G3"].mean()), 2)',
        traps: ['answer = round(float(df["G1"].mean()), 2)'],
        walkthrough: 'G3 is the final-period grade, distinct from G1 (first period) and G2 (second period).',
      },
    ],
  }),
  unguided({
    id: 'eda-storm-events',
    dataset: 'storm-events',
    title: 'Investigate storm damage and risk across 6 states',
    tagline: 'Damage estimates as text, lots of event-type-specific nulls, and real free text.',
    blurb: 'An open-ended investigation on 19,250 NOAA storm events from 2023 in Texas, Oklahoma, California, Florida, North Dakota and Louisiana.',
    intro:
      "19,250 real storm/weather events from 2023. Load it with `rows('storm-events')`. `DAMAGE_PROPERTY` and " +
      '`DAMAGE_CROPS` are text like `"40.00K"` or `"2.00M"`, not numbers. `TOR_F_SCALE`, `BEGIN_LAT` and `BEGIN_LON` ' +
      'only apply to certain event types, so most rows have them as null — that is structural, not an error. ' +
      "`EVENT_NARRATIVE` is real free text written by NOAA staff. Pick **one** question below (or bring your own).\n\n" +
      '**Some starting points:**\n' +
      '- Once you parse DAMAGE_PROPERTY into a real number, which EVENT_TYPE causes the most total property damage ' +
      'across these 6 states, and is that the same event type that happens most often?\n' +
      '- Does one state stand out for a specific event type (for example, hail in Oklahoma, or drought in Texas)?\n' +
      '- Is there a relationship between an event having a recorded magnitude and the severity of its outcome ' +
      '(injuries, deaths or damage)?',
    checklist: [
      'Chose and clearly stated one specific question',
      'Parsed DAMAGE_PROPERTY and/or DAMAGE_CROPS from text (K/M suffixes) into real numbers before using them',
      'Did not treat the structural nulls in TOR_F_SCALE/BEGIN_LAT/BEGIN_LON as if they were data-quality errors',
      'Wrote 2-3 sentences summarizing the finding',
    ],
    verify: [
      {
        id: 'event-type-count',
        label: 'Distinct event types',
        given: "import pandas as pd\ndf = pd.DataFrame(rows('storm-events'))\n",
        task: 'Store the number of distinct `EVENT_TYPE` values in `answer`, as an integer.',
        reference: 'answer = int(df["EVENT_TYPE"].nunique())',
        traps: ['answer = int(df["STATE"].nunique())'],
        walkthrough: 'Count of distinct values in the EVENT_TYPE column.',
      },
      {
        id: 'parsed-damage',
        label: 'Total property damage (parsed)',
        given: "import pandas as pd\nimport re\ndf = pd.DataFrame(rows('storm-events'))\n",
        task:
          'Write a helper that parses a `DAMAGE_PROPERTY` string like `"40.00K"` or `"2.00M"` into a float dollar ' +
          'amount (K = thousands, M = millions; a missing value parses to 0). Store the total summed across all rows ' +
          'in `answer`, rounded to 2 decimals.',
        reference:
          'def parse_damage(v):\n    if pd.isna(v) or v == "":\n        return 0.0\n    multipliers = {"K": 1_000, "M": 1_000_000}\n    suffix = v[-1]\n    if suffix in multipliers:\n        return float(v[:-1]) * multipliers[suffix]\n    return float(v)\n\nanswer = round(float(df["DAMAGE_PROPERTY"].apply(parse_damage).sum()), 2)',
        traps: [
          'def parse_damage(v):\n    if pd.isna(v) or v == "":\n        return 0.0\n    return float(v.rstrip("KM"))\n\nanswer = round(float(df["DAMAGE_PROPERTY"].apply(parse_damage).sum()), 2)',
        ],
        walkthrough: 'The suffix changes the multiplier (K = thousand, M = million) — stripping it without applying the multiplier silently undercounts everything in millions.',
      },
    ],
  }),
]
