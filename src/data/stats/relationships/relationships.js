const learn = (id, title, blurb, check, widget) => ({ id, title, blurb, kind: 'learn', check, ...(widget ? { widget } : {}) })

export const relationshipsSection = {
  id: 'relationships',
  title: 'Relationships & Real-World Analysis',
  intro: 'Correlation, regression, group comparisons, and the fallacies that trip up real analysis.',
  lessons: [
    learn(
      'stats-correlation-vs-causation',
      'Correlation vs. causation',
      'Two things moving together is not the same as one making the other happen. The classic trap, in detail.',
      [
        {
          q: 'Ice cream sales and drowning deaths are strongly correlated across the year. What is the most likely explanation?',
          options: [
            'Ice cream causes drowning',
            'A third, common cause — hot weather — drives both ice cream sales and swimming (and therefore drowning risk) up at the same time',
            'Drowning causes people to buy ice cream',
            'The correlation must be a calculation error',
          ],
          answer: 1,
          why: 'This is the textbook "confounding variable" example: a hidden factor (summer heat) independently drives both variables, creating a correlation with no direct causal link between them.',
        },
        {
          q: 'What is a "confounding variable"?',
          options: [
            'A variable that is measured incorrectly',
            'A third variable that influences both of the variables you are studying, creating a misleading apparent relationship between them',
            'Any variable with high variance',
            'A variable with missing data',
          ],
          answer: 1,
          why: "A confounder is the hidden hand behind many spurious correlations — it's the first thing to suspect when a correlation seems to defy common sense.",
        },
        {
          q: 'What is the most reliable way to establish that A actually CAUSES B, rather than just correlates with it?',
          options: [
            'A very high correlation coefficient',
            'A well-designed controlled experiment — e.g. randomly assigning subjects to receive A or not, and comparing outcomes',
            'A large sample size alone',
            'Correlation at p < 0.05',
          ],
          answer: 1,
          why: 'Random assignment is what breaks the link between confounders and treatment: if groups are randomized, any resulting difference in outcome cannot be explained by a pre-existing confounder.',
        },
        {
          q: 'Does "correlation does not imply causation" mean correlation is useless for understanding the world?',
          options: [
            'Yes, correlation is never useful',
            'No — correlation is often a valuable clue that something is worth investigating further, it just cannot alone settle WHY the relationship exists',
            'Yes, only experiments have any value',
            'No, correlation always implies causation in practice',
          ],
          answer: 1,
          why: "Correlation is a legitimate starting point for a hypothesis. The error is treating it as the finish line — assuming the causal story without checking for confounders or running an experiment.",
        },
        {
          q: 'A study finds that students who eat breakfast have higher test scores. Which confound is worth checking before concluding breakfast causes better scores?',
          options: [
            'None — the result can be trusted immediately',
            'Household income or family stability might independently affect both whether a student eats breakfast and their academic performance',
            'Breakfast cannot possibly relate to test scores',
            'The sample size is definitely too small',
          ],
          answer: 1,
          why: "A classic real-world confound: families with more stability and resources are more likely to provide both a regular breakfast AND the broader support that improves school performance — the breakfast itself may be a marker, not the cause.",
        },
      ]
    ),
    learn(
      'stats-pearson-correlation',
      'The Pearson correlation coefficient',
      'Putting a precise number, r, on "how linear" a relationship is.',
      [
        {
          q: 'What range of values can the Pearson correlation coefficient (r) take?',
          options: ['0 to 1', '0 to 100', '-1 to 1', '-infinity to infinity'],
          answer: 2,
          why: 'r = 1 is a perfect positive linear relationship, r = -1 is a perfect negative one, and r = 0 means no linear relationship at all — everything else falls between.',
        },
        {
          q: 'What does r = 0 tell you about two variables?',
          options: [
            'They have no relationship of any kind',
            'There is no detectable LINEAR relationship — a strong non-linear (e.g. curved) relationship could still exist',
            'One variable causes the other',
            'The data must be identical',
          ],
          answer: 1,
          why: 'Pearson\'s r is blind to anything that is not a straight-line pattern — a perfect U-shape can produce an r very close to 0 despite an obviously strong relationship.',
        },
        {
          q: 'Why is r considered "unit-free" or "standardized"?',
          options: [
            'It is not actually unit-free',
            'It is built from standardized (z-scored) versions of each variable, so it does not depend on whether you measured in dollars, inches, or anything else',
            'It only works on percentages',
            'It requires converting data to ranks first',
          ],
          answer: 1,
          why: "Because it's based on standardized deviations from each variable's own mean, r comes out the same whether your x-axis is in meters or millimeters — only the shape of the relationship matters.",
        },
        {
          q: 'In the widget above, what happened to the scatter of points as you pushed the target correlation toward 0?',
          options: [
            'The points formed a tighter line',
            'The points spread into a shapeless cloud with no clear linear pattern',
            'The points disappeared',
            'Nothing visibly changed',
          ],
          answer: 1,
          why: "At r near 0, knowing a point's x value gives you essentially no information about where its y value will land — hence the shapeless cloud.",
        },
        {
          q: 'An r of 0.3 and an r of 0.9 are both "positive correlations." What differs between them?',
          options: [
            'Nothing of importance',
            'r = 0.9 describes a much tighter, more predictable linear relationship than r = 0.3, which is positive but noisy and weak',
            'r = 0.3 means the variables are unrelated',
            'r = 0.9 means one variable causes the other',
          ],
          answer: 1,
          why: 'The magnitude of r (how far from 0) tells you the STRENGTH of the linear relationship — 0.3 is a weak trend buried in noise, 0.9 is a strong, nearly line-like pattern.',
        },
      ],
      'correlation-regression-playground'
    ),
    learn(
      'stats-linear-regression',
      'Simple linear regression: fitting a line',
      'Going from "these move together" to an actual equation you can use to predict.',
      [
        {
          q: 'What does simple linear regression produce that correlation alone does not?',
          options: [
            'A single number describing relationship strength',
            'An actual equation (a slope and intercept) that lets you predict y from a given x',
            'Proof of causation',
            'A p-value',
          ],
          answer: 1,
          why: 'Correlation tells you how strong and which direction a linear relationship is; regression goes further and gives you the literal line (y = slope·x + intercept) to make predictions with.',
        },
        {
          q: 'In the equation y = slope · x + intercept, what does the slope represent?',
          options: [
            'The starting value of y when x = 0',
            'How much y is expected to change for each one-unit increase in x',
            'The correlation coefficient',
            'The variance of y',
          ],
          answer: 1,
          why: 'Slope is the rate of change: a slope of 2.5 means "for every +1 in x, y is predicted to go up by 2.5."',
        },
        {
          q: 'How does simple linear regression choose "the best" line to fit through a scatter of points?',
          options: [
            'It picks a line at random',
            'It finds the line that minimizes the sum of squared vertical distances (residuals) between the actual points and the line',
            'It connects the first and last point',
            'It always passes through the origin',
          ],
          answer: 1,
          why: '"Least squares" is the standard method: square each point\'s vertical miss from the line (so positive and negative misses do not cancel out), and find the line that minimizes the total.',
        },
        {
          q: 'If the true relationship between x and y is actually curved (e.g. exponential), what happens if you force a straight line onto it?',
          options: [
            'The line will fit perfectly regardless',
            'The line will systematically miss in a patterned way — overshooting in some regions and undershooting in others — because a straight line cannot capture curvature',
            'Linear regression automatically detects and corrects for curves',
            'Nothing, linear regression works equally well on any shape',
          ],
          answer: 1,
          why: 'A straight line is a straight line — it has no way to bend toward a truly curved pattern, and the pattern of its misses (residuals) would reveal that mismatch, which the next lesson covers.',
        },
        {
          q: 'Why is "simple" in "simple linear regression" specifically referring to using just ONE predictor variable?',
          options: [
            'It means the math involved is trivial',
            'It distinguishes this case (one x predicting one y) from multiple regression, which uses several predictor variables at once',
            'It means the model always has zero error',
            'There is no meaningful distinction',
          ],
          answer: 1,
          why: "This path briefly previews multiple regression later in this tier — simple linear regression is the one-predictor foundation that idea builds on.",
        },
      ],
      'correlation-regression-playground:regression'
    ),
    {
      id: 'stats-residuals-r-squared',
      title: 'Residuals & R²: how good is the fit?',
      blurb: 'The line is drawn. Now: how much does it actually explain, and how much is left over?',
      kind: 'code',
      practice: {
        prompt:
          'Write `fit_line(x, y)`: using `np.polyfit(x, y, 1)` to fit a line predicting `y` from `x`, return a dict with `"slope"`, `"intercept"`, and `"r_squared"` (1 minus the ratio of residual sum of squares to total sum of squares), each rounded to 4 decimals.',
        starter: 'import numpy as np\n\ndef fit_line(x, y):\n    ...\n',
        solution:
          'import numpy as np\n\ndef fit_line(x, y):\n    x = np.asarray(x, dtype=float)\n    y = np.asarray(y, dtype=float)\n    slope, intercept = np.polyfit(x, y, 1)\n    pred = slope * x + intercept\n    ss_res = np.sum((y - pred) ** 2)\n    ss_tot = np.sum((y - y.mean()) ** 2)\n    r_squared = 1 - ss_res / ss_tot\n    return {\n        "slope": round(float(slope), 4),\n        "intercept": round(float(intercept), 4),\n        "r_squared": round(float(r_squared), 4),\n    }',
        samples: ['fit_line([1.0, 2.0, 3.0, 4.0, 5.0], [2.1, 3.9, 6.2, 7.8, 10.1])'],
        cases: [
          ['A near-perfect linear relationship', 'fit_line([1.0, 2.0, 3.0, 4.0, 5.0], [2.1, 3.9, 6.2, 7.8, 10.1])'],
          ['A noisier relationship', 'fit_line([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], [5.0, 3.0, 8.0, 4.0, 9.0, 7.0])'],
          ['A negative slope', 'fit_line([1.0, 2.0, 3.0, 4.0], [10.0, 7.0, 5.0, 2.0])'],
        ],
        traps: [
          'import numpy as np\n\ndef fit_line(x, y):\n    x = np.asarray(x, dtype=float)\n    y = np.asarray(y, dtype=float)\n    slope, intercept = np.polyfit(y, x, 1)\n    pred = slope * x + intercept\n    ss_res = np.sum((y - pred) ** 2)\n    ss_tot = np.sum((y - y.mean()) ** 2)\n    r_squared = 1 - ss_res / ss_tot\n    return {\n        "slope": round(float(slope), 4),\n        "intercept": round(float(intercept), 4),\n        "r_squared": round(float(r_squared), 4),\n    }',
        ],
      },
    },
    learn(
      'stats-multiple-regression-intro',
      'A gentle intro to multiple regression',
      'Real outcomes rarely have just one cause. What changes when you add a second predictor?',
      [
        {
          q: 'What is the main difference between simple and multiple regression?',
          options: [
            'Multiple regression cannot produce an equation',
            'Multiple regression predicts y using two or more predictor variables at once, instead of just one',
            'They are exactly the same technique',
            'Multiple regression only works on categorical data',
          ],
          answer: 1,
          why: 'y = b0 + b1·x1 + b2·x2 + ... — the idea extends naturally, just with one coefficient per added predictor.',
        },
        {
          q: 'In multiple regression, how is the coefficient for one predictor typically interpreted?',
          options: [
            'As the total effect of that predictor, ignoring all others',
            "As the expected change in y for a one-unit increase in that predictor, HOLDING ALL OTHER predictors in the model constant",
            'As the correlation between that predictor and y',
            'It cannot be interpreted at all',
          ],
          answer: 1,
          why: '"Holding other variables constant" is the key phrase — a coefficient in a multi-predictor model isolates that variable\'s own relationship with y, controlling for the others.',
        },
        {
          q: 'Why might adding a second predictor change the coefficient estimated for the first one, compared to a simple regression with just that one predictor?',
          options: [
            'It should never change',
            'If the two predictors are correlated with each other, some of what looked like the first predictor\'s effect in isolation may actually be explained by the second one',
            'Coefficients are always identical regardless of what else is in the model',
            'Multiple regression recalculates the data itself',
          ],
          answer: 1,
          why: "This is exactly the confounding-variable idea from earlier, formalized: adding a relevant second predictor can reveal that some of the first variable's apparent effect was really coming from its correlation with the second.",
        },
        {
          q: 'A model predicting house price from both square footage and number of bedrooms might find bedroom count has a surprisingly small effect once square footage is included. Why could that happen?',
          options: [
            'Bedrooms never matter for price',
            'Square footage and bedroom count are themselves correlated (bigger houses tend to have more bedrooms), so square footage may already be capturing most of what bedroom count would explain alone',
            'The model is definitely broken',
            'This can never happen in regression',
          ],
          answer: 1,
          why: "This is a very common, very real pattern: once you control for the strongly related variable (square footage), the second variable's own marginal contribution shrinks because it was partly redundant.",
        },
        {
          q: 'Is this lesson expected to make you fluent in multiple regression?',
          options: [
            'Yes, this is the complete treatment',
            'No — this is explicitly framed as a gentle introduction to the idea; building real fluency with multiple regression is its own, deeper topic beyond this path\'s scope',
            'Multiple regression was fully covered in the practice exercise',
            'There is nothing more to learn about this topic',
          ],
          answer: 1,
          why: "This path's job is to build the conceptual foundation (what multiple regression IS and why coefficients behave as they do) — the full mechanics are intentionally left for deeper, dedicated study.",
        },
      ]
    ),
    learn(
      'stats-anova-intuition',
      'Comparing groups: an intuition for ANOVA',
      'Why you cannot just run a bunch of t-tests when you have more than two groups.',
      [
        {
          q: 'You want to compare average sales across 5 different store regions. Why is running 10 separate pairwise t-tests a bad idea?',
          options: [
            'It is actually the recommended approach',
            'Each test carries its own false-positive risk, and running many of them inflates the overall chance of a false "significant" finding somewhere, purely by chance',
            't-tests cannot compare numeric data',
            'Because 10 tests take too long to compute',
          ],
          answer: 1,
          why: "This is the multiple-comparisons problem previewed in the last tier — more tests means more chances for a false positive to sneak through, even if nothing is really different.",
        },
        {
          q: 'What does ANOVA (Analysis of Variance) test, in one sentence?',
          options: [
            'Whether exactly two groups have equal means',
            'Whether there is a statistically significant difference among the means of three or more groups, using a single combined test',
            'Whether a dataset is normally distributed',
            'The correlation between two variables',
          ],
          answer: 1,
          why: 'ANOVA asks one combined question — "are any of these group means different?" — rather than testing every possible pair separately.',
        },
        {
          q: "What does a significant ANOVA result (a small p-value) tell you, and what does it NOT tell you?",
          options: [
            'It tells you exactly which groups differ from each other',
            'It tells you that SOME difference exists among the group means somewhere; it does not by itself say which specific group or groups differ',
            'It tells you there is no difference anywhere',
            'ANOVA always identifies the single worst-performing group',
          ],
          answer: 1,
          why: "A significant ANOVA is an invitation to dig further (with follow-up comparisons) — it flags that something is different among the groups without pinpointing exactly where.",
        },
        {
          q: 'ANOVA literally stands for "Analysis of Variance." Why does comparing group MEANS involve looking at VARIANCE?',
          options: [
            'It is just a coincidental name with no real connection',
            'ANOVA works by comparing the variance BETWEEN group means to the variance WITHIN each group — if between-group variance is large relative to within-group noise, the means are likely genuinely different',
            'Variance and mean are mathematically identical',
            'ANOVA ignores variance entirely',
          ],
          answer: 1,
          why: "That's the clever mechanism underneath: it reframes 'are the means different' as 'is the spread BETWEEN groups large compared to the ordinary spread WITHIN each group'.",
        },
        {
          q: 'If you only had 2 groups to compare, would you need ANOVA instead of a two-sample t-test?',
          options: [
            'Yes, ANOVA is required for any comparison',
            'No — for exactly two groups, a two-sample t-test and a one-way ANOVA are equivalent; ANOVA\'s real value shows up with three or more groups',
            'No, t-tests can never be used for group comparisons',
            'ANOVA and t-tests measure completely unrelated things',
          ],
          answer: 1,
          why: "ANOVA generalizes the two-group comparison to any number of groups — with just two, it reduces to the same question a t-test already answers.",
        },
      ]
    ),
    {
      id: 'stats-chi-square-test',
      title: 'The chi-square test for categorical relationships',
      blurb: 'When both variables are categories, not numbers, means and correlation stop being the right tool.',
      kind: 'code',
      practice: {
        prompt:
          'Write `chi_square_pvalue(table)`: given `table`, a list of lists representing a contingency table of counts, use `scipy.stats.chi2_contingency` (with its default settings) and return the p-value as a plain float.',
        starter: 'from scipy import stats\n\ndef chi_square_pvalue(table):\n    ...\n',
        solution: 'from scipy import stats\n\ndef chi_square_pvalue(table):\n    result = stats.chi2_contingency(table)\n    return float(result.pvalue)',
        samples: ['chi_square_pvalue([[12, 8], [7, 13]])'],
        cases: [
          ['A 2x2 table where Yates’ correction matters', 'chi_square_pvalue([[12, 8], [7, 13]])'],
          ['A stronger 2x2 association', 'chi_square_pvalue([[50, 10], [10, 50]])'],
          ['A 3x2 table', 'chi_square_pvalue([[20, 30], [25, 15], [10, 40]])'],
        ],
        traps: ['from scipy import stats\n\ndef chi_square_pvalue(table):\n    result = stats.chi2_contingency(table, correction=False)\n    return float(result.pvalue)'],
      },
    },
    learn(
      'stats-survivorship-bias-regression-to-mean',
      'Statistical fallacies: survivorship bias & regression to the mean',
      'Two different ways your data can quietly mislead you, just by how it was collected or observed.',
      [
        {
          q: 'What is "survivorship bias"?',
          options: [
            'A bias toward measuring the tallest people',
            'Drawing conclusions only from the cases that "survived" some selection process, while ignoring the ones that did not — and did not make it into your data at all',
            'A statistical test for medical survival rates',
            'Any form of sampling error',
          ],
          answer: 1,
          why: "The classic example: studying only successful companies to find 'traits of success' ignores every failed company that had the same traits — you only ever see the survivors.",
        },
        {
          q: 'WWII analysts studying bullet-hole patterns on returning planes wanted to reinforce the most-hit areas — until a key insight. What was it?',
          options: [
            'The most-hit areas should be reinforced, as planned',
            'The planes in the dataset all SURVIVED being hit in those areas — the planes hit in the areas with no holes recorded were the ones that never made it back at all',
            'There was no issue with the original plan',
            'The data was simply too small to use',
          ],
          answer: 1,
          why: "This is the canonical survivorship bias story: the areas that looked 'safe to be hit' (no holes on returning planes) were actually the most critical, because planes hit there never returned to be studied.",
        },
        {
          q: 'What is "regression to the mean"?',
          options: [
            'Linear regression using only the mean',
            'An extreme measurement tends to be followed by a measurement closer to the average, often just due to natural variability rather than any real change',
            'A technique for computing the mean',
            'A rule that all measurements eventually equal the mean exactly',
          ],
          answer: 1,
          why: 'If part of why a result was extreme was just random luck, that luck is unlikely to repeat — so the next measurement tends to drift back toward "typical," with no intervention required.',
        },
        {
          q: 'A rookie athlete has an outstanding first season and then a more average second season ("the sophomore slump"). What does regression to the mean suggest about this, alongside any real skill changes?',
          options: [
            'The athlete must have gotten worse at the sport',
            'Some of that spectacular first season was likely favorable variance/luck that would not be expected to repeat, so a more typical season afterward is statistically unsurprising on its own',
            'This has nothing to do with statistics',
            'It proves the first season was fake',
          ],
          answer: 1,
          why: "This doesn't rule out real skill or fatigue factors — it just flags that part of any extreme result (good or bad) is often noise, which naturally fades on the next measurement.",
        },
        {
          q: 'A company gives extra coaching to the worst-performing salespeople of the month, and next month they usually "improve." What should this result make you cautious about?',
          options: [
            'Nothing, the coaching obviously worked',
            'Some of that improvement may simply be regression to the mean (an unusually bad month is unlikely to repeat), not clear evidence the coaching itself caused the change',
            'The salespeople must have been lying about their numbers',
            'This situation has nothing to do with regression to the mean',
          ],
          answer: 1,
          why: "Without a comparison group (salespeople who did NOT get coaching), it's hard to separate 'the coaching worked' from 'an unusually bad month was always likely to be followed by a more typical one.'",
        },
      ]
    ),
    learn(
      'stats-multiple-comparisons',
      'Multiple comparisons & why more tests means more false positives',
      'Formalizing a problem this path has hinted at twice already: testing many things inflates your error rate.',
      [
        {
          q: 'If you run 20 independent hypothesis tests, each at α = 0.05, roughly what is the chance of AT LEAST ONE false positive among them, even if every null hypothesis is true?',
          options: ['5%', 'About 64%', '100%', '0%'],
          answer: 1,
          why: '1 − (1 − 0.05)^20 ≈ 0.64. Each individual test still has only a 5% false-positive rate, but across 20 of them, the chance that at least one slips through climbs fast.',
        },
        {
          q: 'What is the "family-wise error rate"?',
          options: [
            'The error rate of a single test',
            'The probability of making at least one Type I error across a whole family (group) of tests performed together',
            'The error rate for categorical data specifically',
            'A measure of sample size',
          ],
          answer: 1,
          why: "This is the quantity that balloons as you run more tests — it's the overall risk across the whole set, not any one test's own 5%.",
        },
        {
          q: 'What does the Bonferroni correction do, at a high level?',
          options: [
            'It increases your significance threshold to find more results',
            'It divides your significance threshold (e.g. 0.05) by the number of tests you are running, making each individual test stricter to control the overall family-wise error rate',
            'It removes the need for a null hypothesis',
            'It only applies to ANOVA',
          ],
          answer: 1,
          why: 'Testing 20 hypotheses with Bonferroni means each one now needs p < 0.05/20 = 0.0025 to count as significant — a much higher bar, which keeps the overall false-positive risk near the original 5%.',
        },
        {
          q: 'A data team scans 100 different user segments looking for ANY segment where a new feature "significantly" changed behavior, using the standard α = 0.05 for each segment test. What should you expect?',
          options: [
            'Zero false positives, since α = 0.05 is strict',
            'Roughly 5 segments to show up as "significant" purely by chance, even if the feature truly did nothing anywhere',
            'All 100 segments will show significance',
            'This approach has no statistical risk at all',
          ],
          answer: 1,
          why: '100 tests × 5% expected false-positive rate ≈ 5 spurious "findings" — this is exactly the data-dredging risk that connects back to the p-hacking lesson in the previous tier.',
        },
        {
          q: 'Does correcting for multiple comparisons mean you should never run more than one test on your data?',
          options: [
            'Yes, only ever run a single test',
            'No — it means when you DO run many tests, you should adjust your significance threshold (or otherwise account for the number of tests) rather than treating each one as if it were the only test you ran',
            'Multiple comparisons corrections eliminate the need for a null hypothesis',
            'This issue only applies to ANOVA, never to t-tests',
          ],
          answer: 1,
          why: 'Exploring many hypotheses is often a legitimate part of analysis — the responsible move is adjusting your standard of evidence to match how much searching you actually did, not avoiding the search altogether.',
        },
      ]
    ),
    learn(
      'stats-choosing-the-right-test',
      'Choosing the right test',
      'A map of everything this path has covered, organized around one practical question: which test do I actually run?',
      [
        {
          q: 'You want to compare the average order value between two independent groups of customers. Which family of test fits?',
          options: ['Chi-square test', 'A two-sample (independent) t-test', 'ANOVA', 'Simple linear regression'],
          answer: 1,
          why: 'Two independent groups, comparing means — the independent two-sample t-test is the direct tool for exactly this question.',
        },
        {
          q: 'You want to test whether gender (categorical) is associated with product category preference (categorical). Which test fits?',
          options: ['A t-test', 'Linear regression', 'A chi-square test of independence', 'ANOVA'],
          answer: 2,
          why: 'Two categorical variables call for a contingency-table approach — the chi-square test of independence is built exactly for this.',
        },
        {
          q: 'You want to compare average response time across FOUR different server regions. Which test is the natural first choice?',
          options: ['A single two-sample t-test', 'One-way ANOVA', 'A chi-square test', 'Simple correlation'],
          answer: 1,
          why: 'More than two groups, comparing means — this is squarely ANOVA\'s use case, avoiding the multiple-comparisons inflation of running six separate t-tests.',
        },
        {
          q: 'You want to quantify how strongly advertising spend predicts revenue, both numeric variables, and build an equation to estimate revenue from a spend amount. Which tool fits best?',
          options: ['Chi-square test', 'ANOVA', 'Linear regression (and correlation to gauge strength first)', 'A paired t-test'],
          answer: 2,
          why: 'Two numeric variables, wanting both a strength measure and a predictive equation — this is exactly the correlation-then-regression combination from earlier in this tier.',
        },
        {
          q: 'Why does this lesson\'s decision-tree widget ask "what kind of data, how many groups" before anything else?',
          options: [
            'Those details are irrelevant to picking a test',
            'The right statistical test is determined mainly by the TYPES of variables involved (numeric vs. categorical) and HOW MANY groups or variables you have — getting those two facts right narrows the choice immediately',
            'All tests are interchangeable regardless of data type',
            'It is just an arbitrary ordering',
          ],
          answer: 1,
          why: "Every test this path covered maps to a specific combination of variable types and group counts — once you know those two things, the right test is rarely ambiguous.",
        },
      ],
      'test-selector-decision-tree'
    ),
    learn(
      'stats-communicating-results',
      'Communicating results honestly',
      'The analysis is only as good as what the reader walks away believing.',
      [
        {
          q: 'Which is the more honest way to report a hypothesis test result?',
          options: [
            '"We proved the new design works."',
            '"We found a statistically significant difference (p = 0.02); the new design increased conversion by an estimated 1.2 percentage points, with a 95% CI of [0.3, 2.1]."',
            '"The p-value was small, so this is definitely true forever."',
            '"We ran a test." (with no further detail)',
          ],
          answer: 1,
          why: 'Good reporting states the effect size and its uncertainty, not just a binary "significant/not significant" verdict — it lets the reader judge practical importance, not just statistical existence.',
        },
        {
          q: 'Why should a report distinguish between statistical significance and practical significance?',
          options: [
            'They always mean the same thing',
            'A tiny, practically meaningless effect can still be statistically significant with enough data — readers need to know the actual SIZE of the effect, not just whether it cleared a p-value threshold',
            'Practical significance cannot be measured',
            'This distinction only matters in academic papers',
          ],
          answer: 1,
          why: "This connects directly back to the p-values lesson: 'significant' answers 'probably not pure noise', while effect size answers 'does this actually matter for the business or the reader.'",
        },
        {
          q: 'What should an honest analysis disclose about its own limitations?',
          options: [
            'Nothing — limitations undermine the findings',
            'Things like sample size, potential confounders not controlled for, how many comparisons were tested, and any assumptions the chosen test relied on',
            'Only disclose limitations if specifically asked',
            'Limitations are only relevant for academic publications',
          ],
          answer: 1,
          why: "Transparency about what the analysis could NOT rule out is part of making it trustworthy — it's the opposite instinct from p-hacking's 'hide the parts that don't help the story.'",
        },
        {
          q: 'Why is a plain-language summary ("what this means for you") an important part of communicating a statistical result, even alongside the full technical detail?',
          options: [
            'It is unnecessary if the numbers are already correct',
            'Most readers of a report are not statisticians, and a correct but jargon-heavy result that nobody understands or acts on correctly fails at its actual job',
            'Plain language summaries always replace the need for rigor',
            'It has no bearing on how trustworthy an analysis is',
          ],
          answer: 1,
          why: "The entire point of running the analysis was usually to inform a decision — if the people making that decision can't correctly interpret the result, the statistical rigor underneath does not help them.",
        },
        {
          q: 'A report says "this change improved the metric." What question should a careful reader immediately ask?',
          options: [
            'Nothing, the claim should be accepted as stated',
            '"Improved compared to what, by how much, with what uncertainty, and is that difference likely to be real or just noise?"',
            'Whether the report used enough colors in its chart',
            'Whether the metric was measured in the correct currency',
          ],
          answer: 1,
          why: 'Every one of those follow-up questions maps to a concept from this path — baseline comparison, effect size, confidence interval, and p-value/significance — which is exactly the toolkit a careful reader (and writer) should reach for.',
        },
      ]
    ),
    {
      id: 'stats-workshop-full-analysis',
      title: 'Tier capstone: a full statistical analysis on real data',
      blurb: 'Descriptive stats, correlation, and regression, computed together as one finished analysis.',
      kind: 'code',
      practice: {
        prompt:
          'Write `full_analysis(x, y)`: given two numeric arrays, return a dict with `"mean_x"`, `"mean_y"` (each rounded to 2 decimals), `"correlation"` (Pearson r via `np.corrcoef`, rounded to 4 decimals), and `"slope"` (from `np.polyfit(x, y, 1)`, rounded to 4 decimals).',
        starter: 'import numpy as np\n\ndef full_analysis(x, y):\n    ...\n',
        solution:
          'import numpy as np\n\ndef full_analysis(x, y):\n    x = np.asarray(x, dtype=float)\n    y = np.asarray(y, dtype=float)\n    corr = np.corrcoef(x, y)[0, 1]\n    slope = np.polyfit(x, y, 1)[0]\n    return {\n        "mean_x": round(float(x.mean()), 2),\n        "mean_y": round(float(y.mean()), 2),\n        "correlation": round(float(corr), 4),\n        "slope": round(float(slope), 4),\n    }',
        samples: ['full_analysis([1.0, 2.0, 3.0, 4.0, 5.0], [2.0, 4.1, 5.9, 8.2, 9.8])'],
        cases: [
          ['A strong positive relationship', 'full_analysis([1.0, 2.0, 3.0, 4.0, 5.0], [2.0, 4.1, 5.9, 8.2, 9.8])'],
          ['A weak, noisy relationship', 'full_analysis([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], [5.0, 3.0, 8.0, 4.0, 9.0, 7.0])'],
          ['A negative relationship', 'full_analysis([1.0, 2.0, 3.0, 4.0], [10.0, 7.0, 5.0, 2.0])'],
        ],
        traps: [
          'import numpy as np\n\ndef full_analysis(x, y):\n    x = np.asarray(x, dtype=float)\n    y = np.asarray(y, dtype=float)\n    corr = np.corrcoef(x, y)[0, 1]\n    slope = np.polyfit(x, y, 1)[0]\n    return {\n        "mean_x": round(float(y.mean()), 2),\n        "mean_y": round(float(x.mean()), 2),\n        "correlation": round(float(corr), 4),\n        "slope": round(float(slope), 4),\n    }',
        ],
      },
    },
  ],
}
