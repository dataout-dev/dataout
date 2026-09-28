Correct arithmetic and a correct-looking test can still support a wrong conclusion. This lesson is a tour of the ways that happens — worth knowing before trusting any analysis, including your own.

You will learn:

- Simpson's paradox
- selection and survivorship bias
- base-rate neglect
- multiple testing and p-hacking
- being sceptical of your own result

## Simpson's paradox

A trend visible in every subgroup can reverse when the subgroups are combined. Classic setup: treatment A has a *higher* success rate than treatment B in mild cases, and a *higher* success rate in severe cases too — but B has a higher *overall* success rate, because B happened to be given to far more mild (easier) cases overall. The lurking variable (case severity) affects both which treatment was chosen and the outcome, distorting the combined comparison. The fix is always the same: check whether an important grouping variable was averaged away before combining the data.

## Selection bias

If the data collection process itself excludes certain cases, whatever conclusion comes out only describes the cases that made it in — not the whole population it might look like it describes. A survey only reachable online excludes people without internet access; a customer-satisfaction survey only reaches customers who did not simply leave silently.

## Survivorship bias

The classic version: examining only aircraft that returned from missions to decide where to add armor, while ignoring that the planes which were hit in the areas that actually mattered never made it back to be examined at all. Studying only currently-successful companies, currently-active users, or funds still in existence today all share the same flaw — the failures that dropped out are exactly the cases missing from the visible data.

## Base-rate neglect

A test that is 99% accurate sounds reassuring — but if the condition it detects only occurs in 1 in 10,000 people, most positive results will still be false alarms, purely because the condition is so rare that even a small false-positive rate produces more false positives than true ones in absolute terms. Ignoring how common (or rare) something actually is before interpreting a test result is base-rate neglect.

## Multiple testing and p-hacking

Running 20 independent tests at a 5% significance threshold, purely by chance, makes finding at least one "significant" result quite likely even if nothing real is going on. **p-hacking** describes actively (even if not always deliberately) searching for that lucky significant result — trying several outcome variables, several subgroups, or several ways of slicing the data, and reporting only whichever combination happened to cross the threshold. Deciding the analysis plan (which test, on which outcome, for which group) **before** looking at the results is the most reliable defence.

## Watch out: reporting only what worked

A results section that only shows the charts and tests that supported the conclusion, silently leaving out the ones that did not, is a milder version of the same problem — even without any single incorrect number, the *selection* of what gets shown can itself be the misleading part.

## Being sceptical of your own result

A healthy habit before trusting a surprising finding: would you believe this result if it came from someone else's analysis? Could an unequal grouping (Simpson's paradox), a filtered population (selection or survivorship bias), a rare-event base rate, or an unreported number of attempts (multiple testing) explain it instead of the story you want to tell? Checking your own strongest results the hardest, rather than your weakest ones, is the discipline that actually catches these problems before they reach someone else.

## Common mistakes

- Aggregating data across an important group without checking the trend holds within each group separately.
- Drawing conclusions from a dataset that silently excludes the cases that "didn't make it" for some reason.
- Interpreting a test's accuracy without accounting for how rare the thing it detects actually is.
- Running many tests or many subgroup slices and reporting only the significant one, without correction or disclosure.

## Recap

- Simpson's paradox: a trend in every subgroup can reverse when subgroups are combined.
- Selection and survivorship bias both come from missing, not just noisy, data.
- Base-rate neglect ignores how common the thing being tested for actually is.
- Multiple testing without correction, or reporting only favourable results, inflates apparent evidence for a false finding.
