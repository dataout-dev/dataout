Here's a genuinely strange fact: it's possible for a trend to hold true inside *every single subgroup* of a dataset, and then completely reverse once you combine those subgroups together. This isn't a trick or a rare edge case — it's a well-known effect called Simpson's paradox, and it has fooled real researchers making real decisions.

You will learn:

- a concrete example where every subgroup favors one option but the combined data favors the other
- what actually causes the reversal
- how uneven group sizes create the illusion
- the practical defense: always check subgroup breakdowns before trusting an aggregate

## A concrete example: two treatments

Imagine a hospital compares two treatments for a condition, Treatment A and Treatment B, by looking at recovery rates. Patients come in with either a mild or a severe case of the condition, and the hospital tracks outcomes separately for each severity level.

```text
Mild cases:
  Treatment A: 90 out of 100 recover   (90%)
  Treatment B: 95 out of 100 recover   (95%)   <- B wins

Severe cases:
  Treatment A: 30 out of 100 recover   (30%)
  Treatment B: 10 out of 50  recover   (20%)   <- A wins... wait
```

Let's adjust the severe case slightly to make the paradox land cleanly, keeping it concrete:

```text
Mild cases:
  Treatment A:  90 out of 100 recover   (90%)   <- A gets mostly mild cases
  Treatment B:  95 out of 100 recover   (95%)   <- B wins mild

Severe cases:
  Treatment A:  30 out of 100 recover   (30%)   <- A gets many severe cases too
  Treatment B:   2 out of  10 recover   (20%)   <- A wins severe (30% > 20%)
```

So far Treatment B wins mild cases (95% vs 90%) and Treatment A wins severe cases (30% vs 20%). Now combine each treatment's totals across both groups:

```text
Treatment A combined: (90 + 30) out of (100 + 100) = 120/200 = 60%
Treatment B combined: (95 +  2) out of (100 +  10) = 97/110  ≈ 88%
```

Treatment B now looks dramatically better overall (88% vs 60%) — even though Treatment A actually won outright in the severe-case subgroup, and the two were close in the mild-case subgroup. Anyone looking only at the combined number would conclude Treatment B is clearly superior, missing that it only ever got tested on 10 severe patients while Treatment A took on 100 of the harder cases.

## What causes the reversal

The paradox isn't a calculation error — every number above is arithmetically correct. The reversal happens because the two treatments weren't given the same *mix* of patients. Treatment A was tested on far more severe cases (where recovery is harder for everyone) than Treatment B was. When you combine the groups, Treatment A's combined rate gets dragged down by having taken on a much larger share of the hard cases, while Treatment B's combined rate barely reflects the hard-case category at all, because it hardly saw any of those patients.

This is a specific case of **confounding**: a third factor (case severity, and how unevenly it was distributed between the two treatment groups) is influencing the combined result in a way that has nothing to do with which treatment is actually better. The combined percentage is quietly answering a different question than "which treatment works better" — it's partly answering "which treatment got the easier patients."

## The practical defense

The fix is cheap and should become a habit: **before trusting any aggregated comparison, check whether the same trend holds inside each meaningful subgroup**. If treatment, policy, or group comparisons flip direction once you combine categories, uneven group sizes or a hidden confounding factor are the first things to suspect. This matters well beyond medicine — it shows up in comparing university admission rates across departments, batting averages across different numbers of at-bats, and A/B test results where one variant happened to be shown disproportionately to a different audience segment. Any time someone hands you a single combined number as proof of a trend, the right question is: "does this hold up within each subgroup, or only after they've been mixed together?"

## Common mistakes

- Trusting a combined/aggregate statistic without ever checking whether the same direction holds within each subgroup.
- Assuming a reversal like this must be a data error, rather than a real mathematical consequence of uneven group sizes.
- Comparing two groups' overall rates without checking whether they were tested on comparably difficult or similarly sized sub-populations.
- Fixing the paradox by simply discarding one subgroup instead of reporting and reasoning about both subgroups honestly.
