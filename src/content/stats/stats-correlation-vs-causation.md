Every summer, ice cream sales and drowning deaths rise and fall together almost in lockstep. If you only looked at that pattern, you might conclude that eating ice cream makes people drown — which is obviously absurd, but the data really does show that relationship. Untangling why two things move together, without assuming one causes the other, is one of the most important skills in all of statistics.

You will learn:

- why two variables can move together without either one causing the other
- what a confounding variable is, with a worked example
- why a controlled experiment with random assignment is the gold standard for establishing causation
- that correlation is still a valuable clue, not a worthless one
- a second confound to practice spotting it in the wild

## The ice cream and drowning trap

Picture a chart with two lines: monthly ice cream sales and monthly drowning deaths, both rising sharply every June through August and falling every winter. The two lines track each other closely. Did ice cream cause the drownings? Did drowning somehow cause people to buy more ice cream? Neither — both are driven by a third factor that the chart doesn't show: hot weather. When it's hot, more people buy ice cream, and more people go swimming, which means more opportunities for drowning. The heat is doing all the causal work. Ice cream and drowning are correlated only because they share a common cause, not because either one influences the other.

This is the single most important lesson about correlation: a relationship between A and B tells you that A and B tend to change together, but it says nothing on its own about *why*. The "why" could be "A causes B," "B causes A," "both are caused by C," or even pure coincidence in a small enough dataset.

## What a confounding variable is

A **confounding variable** (or confounder) is a third factor that influences both of the variables you're studying, creating an apparent relationship between them where no direct causal link exists. In the ice cream example, weather is the confounder. Confounders are sneaky precisely because they're often invisible in the data you're looking at — nobody put "average daily temperature" on the chart, so the relationship between ice cream and drowning looks mysterious until you go looking for what else might be changing at the same time.

Spotting a likely confounder usually starts with a simple question: is there something else, often boring and obvious once you think of it, that could independently push both of these variables in the same direction? Seasonal effects, economic conditions, and population size are extremely common confounders in real-world data because they quietly affect almost everything.

## Why experiments settle the question

Looking at existing data, no matter how much of it you have, can't fully rule out confounding — there's always a chance some unmeasured factor is driving both sides of the relationship. The reliable way to establish that A actually *causes* B is a **controlled experiment with random assignment**: you take a group of subjects, randomly assign some to receive A and others not to, and compare outcomes between the two groups.

Randomization is the key move. If subjects are assigned to groups by chance, any confounding variable — known or unknown — should end up roughly evenly spread across both groups. Age, income, prior health, weather on the day they were tested, anything at all: random assignment scrambles all of it so that, on average, the two groups differ only in whether they got A. If the outcomes then differ meaningfully between groups, there's no confounder left to blame, because randomization already neutralized every one, even the ones nobody thought to measure.

This is why clinical drug trials randomly assign patients to drug or placebo rather than simply comparing people who happened to take the drug against people who didn't. The second approach — just comparing existing groups — is exactly the kind of correlational evidence that confounders can corrupt.

## Correlation is still useful

None of this means correlation is worthless. A strong correlation is often the very first clue that something interesting is happening and worth investigating further. Nobody runs an expensive, carefully randomized experiment on a hunch pulled from thin air — they run it because an observed correlation suggested a hypothesis worth testing properly. Correlation is a legitimate starting point for a question; the error is treating it as the finish line, announcing a causal story the moment two lines on a chart happen to move together.

## A second example: breakfast and test scores

Studies sometimes find that students who eat breakfast have higher test scores, and headlines occasionally turn that into "breakfast makes kids smarter." But before accepting that causal story, it's worth asking what else might differ between breakfast-eaters and non-eaters. Household stability and income are a strong candidate: families with more resources and more consistent routines are more likely to provide a regular breakfast *and* more likely to provide the broader support — quiet study space, consistent sleep schedules, help with homework — that independently improves school performance. Breakfast itself might be doing very little of the causal work; it may simply be a marker of a more stable home environment that's doing the real lifting. That doesn't mean breakfast is irrelevant to kids' performance, only that the raw correlation alone can't tell you how much of the effect is really breakfast versus everything correlated with eating it.

## Common mistakes

- Assuming that because A and B are correlated, A must cause B (or jumping straight to "B causes A" instead, without considering either option is wrong).
- Failing to ask "what third factor could independently affect both of these?" before accepting a causal explanation.
- Treating a large sample size as something that rules out confounding — a bigger sample makes a correlation more precise, not more causal.
- Dismissing correlation entirely just because it can't prove causation — it's still a legitimate, useful signal for deciding what to investigate next.
