A hypothesis test asks: if there were really no effect, how surprising would this data be? A small enough p-value means "quite surprising", which is the evidence a test looks for — never proof, and never a guarantee the effect is real.

You will learn:

- the null and alternative hypothesis
- reading a p-value correctly
- one-sample, two-sample and paired t-tests
- chi-square tests and one-way ANOVA
- effect sizes, and why they matter alongside a p-value

## Null and alternative

The **null hypothesis** (`H0`) is the "nothing interesting is happening" baseline — usually "no difference between the groups", or "no relationship between these variables". The **alternative** (`H1`) is what you actually suspect. A test never *proves* the null false; it measures how consistent the observed data is with it.

## Reading a p-value correctly

```python
from scipy import stats

group_a = [5.1, 4.9, 5.0, 5.2, 4.8]
group_b = [5.9, 6.1, 6.0, 5.8, 6.2]
result = stats.ttest_ind(group_a, group_b)
print(round(result.pvalue, 4))
```

The p-value is `P(data this extreme or more | the null hypothesis is true)` — **not** `P(the null hypothesis is true | this data)`, a very common and understandable confusion. A small p-value (as here) means "if there really were no difference, data this extreme would show up only rarely by chance alone" — strong evidence against the null, but never proof.

## t-tests: one-sample, two-sample, paired

```python
from scipy import stats

sample = [5.2, 4.8, 5.1, 4.9, 5.3]
print(stats.ttest_1samp(sample, popmean=5.0))

group_a = [5.1, 5.3, 5.0, 5.2]
group_b = [4.8, 4.9, 4.7, 5.0]
print(stats.ttest_ind(group_a, group_b))

before = [70, 72, 68, 75]
after = [72, 74, 70, 78]
print(stats.ttest_rel(before, after))
```

A one-sample t-test compares a sample's mean to a fixed number; an independent two-sample test compares two separate groups; a **paired** test compares two measurements taken from the *same* subjects (before/after), which is more sensitive when the pairing itself removes a lot of irrelevant variation.

## chi-square: independence between categories

```python
from scipy import stats
import numpy as np

table = np.array([[30, 10], [20, 40]])
chi2, p, dof, expected = stats.chi2_contingency(table)
print(round(chi2, 2), round(p, 4))
```

A chi-square test of independence checks whether two categorical variables (rows and columns of a contingency table) are related, or whether the observed counts are consistent with them being independent.

## One-way ANOVA: more than two groups

```python
from scipy import stats

group_a = [5.1, 5.3, 5.0]
group_b = [4.8, 4.9, 4.7]
group_c = [6.0, 6.2, 5.9]
result = stats.f_oneway(group_a, group_b, group_c)
print(round(result.statistic, 2), round(result.pvalue, 4))
```

ANOVA tests whether **at least one** group's mean differs from the others; a significant result says "somewhere there's a difference" without saying which pair — a follow-up (post-hoc) test is needed to pin that down.

## Effect sizes

```python
import numpy as np

group_a = np.array([5.1, 5.3, 5.0, 5.2])
group_b = np.array([4.8, 4.9, 4.7, 5.0])
pooled_std = np.sqrt((group_a.var(ddof=1) + group_b.var(ddof=1)) / 2)
cohens_d = (group_a.mean() - group_b.mean()) / pooled_std
print(round(cohens_d, 2))
```

A p-value says whether an effect is likely to be real; it says nothing about whether the effect is **large enough to matter**. With enough data, even a tiny, practically meaningless difference can produce a very small p-value — an effect size (like Cohen's d here) reports the size of the difference itself, independent of sample size.

## Watch out: p-hacking and multiple comparisons

Running many tests and reporting only the ones that happened to come out significant (or repeatedly tweaking what counts as the "outcome" until one test succeeds) inflates the real false-positive rate far beyond the nominal 5% — a problem covered in depth in a later lesson on statistics pitfalls.

## Common mistakes

- Reading a p-value as the probability the null hypothesis is true.
- Using an independent two-sample test on paired (before/after, same-subject) data, throwing away the pairing's extra sensitivity.
- Reporting only the p-value with no effect size, leaving a reader unable to judge practical importance.
- Running ANOVA, finding significance, and stopping without a follow-up test to see which groups actually differ.

## Recap

- A p-value measures how surprising the data would be *if the null hypothesis were true* — not the probability the null is true.
- Choose one-sample, independent two-sample, or paired t-tests based on how the data was actually collected.
- Chi-square tests categorical independence; ANOVA tests whether any of several group means differ.
- Report an effect size alongside a p-value — statistical significance and practical importance are different questions.

## Your turn

In the **Practice** tab you write `two_sample_t(a, b)`. Then three challenges use real data.
