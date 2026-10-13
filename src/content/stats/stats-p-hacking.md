If you set your significance threshold at α = 0.05 and run exactly one test, you've accepted a genuine 5% risk of a false positive. Run twenty tests and report only the one that happened to cross the line, and that tidy 5% risk quietly turns into something closer to a near-certainty that *something* would have looked significant, whether or not anything real was going on.

You will learn:

- what p-hacking actually is, in practice
- how running many tests multiplies your real false-positive risk, with a worked example
- why p-hacking is usually unintentional rather than deliberate fraud
- the basic defense against accidentally p-hacking your own analysis
- why this problem gets its own full, dedicated lesson later in the curriculum

## What p-hacking actually looks like

**P-hacking** is the practice of trying many different analyses — different subgroups, different metrics, different cutoffs, different ways of slicing the same dataset — until one of them crosses the significance threshold (commonly p < 0.05), and then reporting only that one result as if it were the single analysis you'd planned all along. It rarely looks like outright fraud. It usually looks like ordinary, reasonable-seeming exploration: "let's also check if the effect shows up just for mobile users," "let's try excluding this one outlier," "let's see if it's significant if we measure over 14 days instead of 7." Any one of those checks, on its own, is a perfectly legitimate question. The problem is doing many of them and reporting only the one that "worked."

## The math behind why this is so dangerous

Here's the worked example that makes the danger concrete. Suppose you run 20 completely unrelated hypothesis tests, and in every single one, the null hypothesis is actually true — there's genuinely no effect anywhere. At α = 0.05, each individual test has a 5% chance of a false positive, purely from random noise. Across 20 independent tests, the expected number of false positives is `20 × 0.05 = 1`. Statistically, you should *expect* about one "significant" result to pop up by pure chance alone, even though nothing real is happening anywhere in the data.

If a team runs those same 20 tests — say, 20 different marketing metrics against a control group — and reports only the single one that came back significant, they're very likely reporting exactly that expected-by-chance false positive, dressed up as a real discovery. The 5% false-positive rate was always true *per test*, not per project — and a project with many tests inherits a much higher overall chance that at least one of them looks significant for no real reason.

## Why it's usually not deliberate fraud

Most p-hacking doesn't happen because someone is consciously trying to deceive anyone. It happens because exploratory analysis naturally involves a long sequence of small, individually reasonable-seeming decisions — which subgroup to check, which outlier to exclude, which time window to use — and there's a very human, very natural pull toward the decisions that happen to produce the result you were hoping to find. Nobody has to intend to cheat for this bias to creep in; the incentive to find *a* significant result, combined with enough small analytical choices, is often enough on its own.

## The defense: decide before you look

The core defense is deciding your hypothesis and your full analysis plan — which metric, which subgroup, which cutoff, which time window — *before* looking at the results, and sticking to that plan regardless of what the data shows. This is sometimes called pre-registration. If you genuinely do need to run multiple tests (which is often unavoidable in real analysis), the significance threshold itself needs to be adjusted to account for how many tests you're running — a topic called correcting for multiple comparisons, which gets a full, dedicated lesson of its own in a later tier, because the correction methods and trade-offs involved deserve more room than a quick mention here.

## Common mistakes

- Trying many subgroups, metrics, or cutoffs and reporting only the one that happened to cross p < 0.05.
- Assuming a 5% significance threshold stays a 5% real-world risk no matter how many tests you run against the same question.
- Treating p-hacking as something only dishonest researchers do, rather than something that can creep into anyone's exploratory analysis unnoticed.
- Deciding on a hypothesis or cutoff *after* seeing which choice makes the result look best, instead of committing to it beforehand.
