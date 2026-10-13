By now this path has handed you a whole toolbox: t-tests, ANOVA, chi-square, correlation, regression. The hard part in practice is rarely running the test once you know which one to use — it's figuring out which one actually fits the question in front of you. This lesson is a map of the whole path, organized around that one practical decision.

You will learn:

- the two questions that narrow down the right test almost immediately
- when to reach for a t-test, and which kind
- when to reach for ANOVA instead of several t-tests
- when to reach for a chi-square test
- when to reach for correlation and regression, together or separately

## The two questions that narrow it down fast

Nearly every test in this path can be chosen correctly by answering two questions, in order:

1. **What type of data do you have?** Is the outcome you care about numeric (something you can average — sales, response time, test score) or categorical (a label — plan type, region, yes/no)? And is the *relationship* you're studying between two numeric variables, or between a numeric outcome and categorical groups, or between two categorical variables?
2. **How many groups or variables are involved?** One group compared to a fixed benchmark? Two groups? Three or more groups? Two continuous variables?

Those two answers alone eliminate almost every wrong option. The rest of this lesson walks through the major combinations.

## Numeric outcome, two groups → t-test

If you're comparing the average of a numeric outcome between exactly two independent groups — average order value for customers who saw version A of a page versus version B, average response time for two server regions — a **two-sample (independent) t-test** is the direct tool. It asks whether the difference between the two group averages is bigger than what ordinary sampling noise would produce on its own.

*Worked example*: comparing average order value between two groups of customers, those shown a redesigned checkout page and those shown the old one. Two groups, one numeric outcome — straight to a two-sample t-test.

## Numeric outcome, three or more groups → ANOVA

Once you have three or more groups to compare on a numeric outcome, resist the urge to just run a t-test on every pair. As covered earlier in this tier, that approach inflates your overall false-positive rate through the multiple-comparisons problem. **One-way ANOVA** handles this correctly: one combined test asking whether *any* of the group averages differ, with a single, controlled false-positive rate.

*Worked example*: comparing average response time across four different server regions. Four groups, one numeric outcome — one-way ANOVA, not six separate t-tests.

## Two categorical variables → chi-square

When both the variables you're relating are categories rather than numbers — gender and product preference, device type and subscription plan — means and correlation don't apply at all, because neither variable has a numeric scale. The **chi-square test of independence**, built around a contingency table of counts, is the tool for exactly this situation.

*Worked example*: testing whether gender is associated with product category preference. Both variables are categorical — a chi-square test of independence is the natural fit, not a t-test or ANOVA.

## Two numeric variables → correlation and regression

When both variables are numeric and you want to know how strongly they're related, or build an equation to predict one from the other, you're in correlation-and-regression territory from earlier in this tier. **Pearson's r** gives you a quick read on the strength and direction of the linear relationship; **simple linear regression** goes further and produces an actual predictive equation, with **R²** telling you how much of the outcome's variation that equation actually explains.

*Worked example*: quantifying how strongly advertising spend predicts revenue, and building an equation to estimate revenue from a given spend amount — two numeric variables, wanting both a strength measure and a predictive formula. Correlation first (how strong is this?), then regression (here's the equation).

## One group against a known benchmark

Though covered in the previous tier rather than this one, it's worth keeping in the same mental map: if you have a *single* group's numeric outcome and want to compare it against a known or hypothesized value (is this factory's average output different from the target of 500 units a day?), that's a **one-sample t-test** — no second group involved at all.

## Why the two questions come first

Every single test covered in this path maps to a specific combination of variable types and group counts. A chi-square test is wrong the moment one of your variables is genuinely numeric; ANOVA is overkill (and a plain t-test is simpler and sufficient) the moment you only have two groups; correlation and regression both require two numeric variables and fall apart on categories. Getting the two questions — what type of data, and how many groups or variables — answered correctly first means the right test is rarely ambiguous afterward. The widget below turns this whole map into something you can click through interactively, scenario by scenario, until the pattern sticks.
