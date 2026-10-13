A chart is not where an analysis ends. For exploratory work, it's usually where the real questions start — the moment something in the picture makes you go "wait, why does *that* happen?"

You will learn:

- why shape (not just a summary number) changes what you should trust
- how a scatter plot can reveal a relationship a correlation number would miss
- how to use a chart to generate your next question, not just answer the current one
- how this connects to the separate Statistics for Data Analysis path on this site

## Shape changes what a number means

This is a direct callback to the Statistics path's descriptive-statistics lessons: two columns can share the exact same mean and look nothing alike once you actually plot them. A histogram takes seconds to draw and immediately tells you things a single summary statistic cannot — is this roughly symmetric, or does it have a long tail? Is there one clear peak, or two (a sign two different groups might be mixed together)? Are there a handful of values sitting far off on their own?

None of that is visible in "the mean is 47.3." All of it is visible in a histogram.

## Scatter plots catch what correlation misses

A single correlation coefficient only measures *linear* association — how well a straight line fits. Plot two numeric columns against each other and you might see a clear, strong, genuinely useful relationship that happens to curve, cluster, or have a threshold effect a straight-line number would understate or miss entirely. Seeing the actual shape of a relationship, not just a single number summarizing it, is one of the best reasons to plot before (or alongside) computing.

## The real use of a chart during exploration

The most useful question a chart can answer during EDA is not "what is the answer" — it's "what looks surprising here, and why." A gap where you expected a smooth spread. A cluster that splits the data into two visibly different groups. A handful of points sitting far outside the rest. Each of those is an invitation to ask a follow-up question, often using the exact skills from the earlier lessons in this section: is that gap a sign of missing data? Is that unexpected cluster actually a duplicate-category problem in disguise? Is that handful of outlying points a data error, or the single most interesting finding in the dataset?

This is also where a bar chart of a categorical column's value counts earns its keep — it is often the fastest way to spot the near-duplicate category labels ("Gold" / " gold " / "GOLD") from the earlier lesson, because ten bars that should obviously be two or three jump out visually in a way a text table doesn't.

## Why this lesson doesn't re-teach distributions from scratch

If you've been through the Statistics for Data Analysis path on this site, the visual intuition for distributions, skew, and relationships was built there, with interactive widgets built specifically for seeing those ideas move. This lesson does not repeat that — it assumes it, and asks you to apply it to real data you are seeing for the first time, with all the missingness, duplicates and type problems the earlier lessons in this section covered. That combination — statistical intuition plus a healthy suspicion of the data itself — is the actual skill this whole section is building toward.

## Common mistakes

- Computing a summary statistic and never actually looking at a picture of the distribution behind it.
- Trusting a correlation coefficient alone for a relationship you haven't also looked at on a scatter plot.
- Treating a chart as a deliverable rather than a diagnostic — the goal during exploration is to generate better questions, not to produce a polished final chart.
- Making a bar chart of a messy categorical column and concluding something about "the categories" before normalizing near-duplicate labels first.
