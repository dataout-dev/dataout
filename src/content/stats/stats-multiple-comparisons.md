This path has already hinted at this problem twice — once when discussing why you shouldn't run a pile of pairwise t-tests instead of ANOVA, and once in the previous tier's lesson on p-hacking. It's time to make the idea precise: the more hypothesis tests you run, the more likely you are to find a "significant" result purely by chance, even when nothing real is going on.

You will learn:

- the family-wise error rate, and why it grows with more tests
- the worked calculation behind "20 tests at 5% gives about a 64% chance of a false positive somewhere"
- the Bonferroni correction, at a conceptual level
- a realistic data-team scenario where this bites
- how this connects back to the p-hacking lesson from the previous tier

## The problem, stated precisely

A single hypothesis test run at the standard significance level, α = 0.05, has a 5% chance of a false positive — finding "significance" even when the null hypothesis is actually true. That 5% is a risk most people are comfortable accepting for one test. The trouble starts when you run many tests at once and still think of each one as carrying only a 5% risk, in isolation, as if the others didn't exist.

## The worked calculation: 20 tests, about 64%

Suppose you run 20 completely independent hypothesis tests, each at α = 0.05, and suppose every single null hypothesis happens to be true (nothing real is actually going on anywhere). Each individual test still has a 95% chance of correctly reporting "not significant," and a 5% chance of a false positive.

The chance that *all 20* tests correctly come back non-significant, assuming independence, is 0.95 multiplied by itself 20 times: 0.95²⁰, which works out to roughly 0.36, or 36%. That means the chance that *at least one* of the 20 tests throws a false positive is 1 minus that: 1 − 0.36 ≈ 0.64, or about 64%. Run 20 independent tests on pure noise, and you have roughly a two-in-three chance that at least one of them will look "significant" anyway — not because anything real happened, but purely because you gave chance 20 separate opportunities to produce a fluke.

This is the **family-wise error rate**: the probability of making at least one false-positive (Type I) error across a whole family of tests considered together, as opposed to any single test's own, much smaller, individual error rate.

## The Bonferroni correction

The most direct fix is to make each individual test stricter in proportion to how many tests you're running, so the *overall* family-wise error rate comes back down to something like your original target. The **Bonferroni correction** does this by dividing your significance threshold by the number of tests: testing 20 hypotheses with an overall target of 5% means each individual test now needs p < 0.05/20 = 0.0025 to count as significant, a substantially higher bar than the usual 0.05.

This conceptually restores the original guarantee: if every null hypothesis is true, the chance of at least one false positive across the whole family stays close to your intended 5%, rather than ballooning to 64%. The tradeoff is that a stricter per-test threshold also makes it harder to detect genuine effects (more false negatives) — Bonferroni is a conservative, blunt-but-reliable tool, not a free lunch.

## A realistic data-team scenario

Imagine a data team rolls out a new feature and, rather than testing one pre-registered hypothesis, scans 100 different user segments looking for *any* segment where the feature produced a "significant" change in behavior, each tested at the standard α = 0.05. Even if the feature truly did nothing anywhere, you should expect roughly 5 of those 100 segment tests to come back "significant" by pure chance — 100 tests times a 5% false-positive rate each. Someone who picks out one of those 5 "winning" segments and writes it up as a real finding, without correcting for having searched 100 of them, has essentially rediscovered a Bonferroni-sized problem without realizing it.

## Connecting back to p-hacking

This is precisely the mechanism behind the p-hacking lesson from the previous tier: p-hacking is, among other things, the practice of running many tests, many subgroup analyses, or many slightly different versions of an analysis, and reporting only the one that happened to come back significant — while ignoring that running many attempts is exactly what makes a false positive likely in the first place. Multiple-comparisons correction is the honest, disclosed version of running many tests; p-hacking is running many tests and hiding that fact from the reader. The math behind why both are dangerous is the same 64%-style calculation worked through above.

None of this means you should only ever run one test. Exploring many hypotheses is often a completely legitimate part of analysis — the responsible move is adjusting your standard of evidence (via Bonferroni or a similar correction) to match how much searching you actually did, rather than avoiding exploration altogether or pretending you only ever tested the one hypothesis that happened to pan out.

## Common mistakes

- Running many tests and reporting each one's p-value against the usual 0.05 threshold, as if the others didn't exist.
- Searching through many subgroups or segments for "any" significant result, then reporting just that one without disclosing how many were checked.
- Treating Bonferroni's stricter threshold as a flaw in the method, rather than the necessary cost of controlling the overall false-positive rate across many tests.
- Concluding that multiple-comparisons problems mean you should never explore more than one hypothesis — the fix is correcting for how many tests you ran, not avoiding the search.
