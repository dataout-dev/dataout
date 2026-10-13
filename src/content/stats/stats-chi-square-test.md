Every test so far in this tier has dealt with numbers — means, slopes, correlations. But plenty of real questions are about categories instead: does device type relate to subscription plan? Does region relate to preferred payment method? You cannot average a category, so correlation and regression are simply the wrong tools here. You need something built for counts.

You will learn:

- why numeric tools like correlation break down for categorical variables
- what a contingency table is and how it organizes your data
- the chi-square logic: comparing observed counts to expected counts
- a worked example connecting device type and subscription plan
- how to think about the test conceptually before writing any code

## Why categorical data needs a different tool

Correlation and regression both depend on being able to do arithmetic on your variables — adding, averaging, measuring distances between values. That works fine for height, income, or temperature. It breaks down completely for something like "device type" with values like "phone," "tablet," and "desktop." There is no meaningful average of those three categories, and no sensible way to ask "how much does device type increase as subscription plan increases" because neither variable has a numeric scale to increase along.

When both variables you're studying are categorical, you need a test built around *counts* — how many observations fall into each combination of categories — rather than means or correlations.

## The contingency table

The natural way to organize two categorical variables together is a **contingency table**: a grid where each row is a category of one variable, each column is a category of the other, and each cell holds the count of observations that fall into that specific combination. For device type (phone, tablet, desktop) against subscription plan (free, paid), you'd get a 3-row-by-2-column table of six counts — how many phone users are on the free plan, how many phone users are on the paid plan, how many tablet users are on the free plan, and so on.

That table is the entire input to a chi-square test. It doesn't need the original list of individual users at all — just the tally of how many fell into each cell.

## The chi-square logic

The question a chi-square test of independence asks is: if device type and subscription plan were completely unrelated to each other, what counts would you *expect* to see in each cell, just based on the overall row and column totals? For example, if 60% of all users overall are on the paid plan, and unrelatedness held exactly, you'd expect roughly 60% of phone users, 60% of tablet users, and 60% of desktop users to be on the paid plan too — the proportions would be the same across every row.

The chi-square test compares those **expected counts** (what you'd see under "no relationship") against the **observed counts** (what you actually counted) across every cell in the table. The bigger the gap between observed and expected, overall, the less plausible it is that the two variables are truly unrelated — and the chi-square statistic turns that overall gap into a p-value, the same way other tests in this path do.

## Worked example

Say you tally subscription plan against device type for 1,000 users and notice that desktop users are paid subscribers far more often than their overall share would predict, while phone users lag behind it. If device type and plan were really unrelated, you'd expect each device type to show roughly the same paid-vs-free split as the overall population. A chi-square test tells you whether the differences you're seeing across devices are bigger than what ordinary sampling noise would produce, or whether they're well within the range you'd expect even if device type had nothing to do with plan choice at all.

Notice what the test does *not* require: it never needs you to compute an "average device type" or a correlation coefficient between the two variables. It works entirely off of counts arranged into the table — which is exactly why it's the right tool when both variables are categories rather than numbers.

## Common mistakes

- Trying to force a correlation coefficient or a mean onto categorical data that has no numeric scale.
- Looking only at raw counts without comparing them to what would be expected under "no relationship" — a cell with a big count isn't automatically evidence of an association if its row and column are just large overall.
- Confusing a significant chi-square result with knowing *how* two categories are related — the test flags that an association likely exists, without by itself describing its direction or shape.
- Applying a chi-square test when one variable is actually numeric — if you can meaningfully average it, a different tool (like correlation or a t-test) is usually a better fit.
