Imagine someone hands you a spreadsheet with 50,000 rows of customer purchases and asks, "so, what's going on here?" You can't read 50,000 rows and hold them in your head. Statistics is the set of tools for answering questions like that anyway — not by looking at every row, but by boiling a huge pile of data down into a handful of numbers and pictures that still tell the truth about it.

You will learn:

- what descriptive statistics is actually for
- the difference between a population and a sample
- categorical versus numerical data
- why summarizing loses information, and why that's usually fine
- how this path will teach statistics — mostly by exploring, not memorizing formulas

## The problem statistics solves

Raw data, by itself, is not understanding. A column of ten thousand ages doesn't tell you anything on its own — it's just ten thousand numbers scrolling past. What you usually want to know is something smaller and more useful: "what's a typical age here?", "how spread out are people's ages?", "are there a few unusually old or young outliers?" Descriptive statistics is the branch of the field dedicated to answering exactly those questions — taking a dataset and producing a small set of numbers (and later, charts) that capture its most important features.

This path is the conceptual partner to this site's Python-for-Data track. That track shows you *how* to compute a mean or a standard deviation in code with `numpy` or `scipy`. This path is about *why* those numbers mean what they mean, and what they can and can't tell you — the intuition that makes the code actually useful instead of just a formula you copy-paste.

## Population vs. sample

A **population** is every single member of the group you actually care about — every voter in a country, every unit a factory will ever produce, every customer who could ever buy from a store. A **sample** is the smaller subset you actually managed to collect data on — the 1,000 voters you polled, the 200 units you tested, the 500 customers who filled out a survey.

Almost all real statistics is done on samples, because measuring an entire population is usually impossible, too slow, or too expensive. You poll 1,000 voters, not 150 million. You taste-test 20 cookies off the line, not every cookie the factory will ever bake. The entire reason statistics has rigor to it — rather than just "add up some numbers" — is that you're using a sample to make a claim about a population you never fully observed, and you need to be honest about how much that sample can and can't tell you.

This path starts with pure description — just summarizing whatever data you have in front of you, sample or not. The harder question of "how confident can I be that my sample reflects the real population?" is for a later tier (inference). For now, the goal is simpler: given some numbers, describe them well.

## Categorical vs. numerical data

Not all data is a number you can do arithmetic on. It helps to sort what you're looking at into two broad kinds right away:

- **Numerical data** is something you can meaningfully add, subtract, or average — height in centimeters, price in dollars, age in years. It usually comes in two flavors: *continuous* (can take any value in a range, like height) and *discrete* (countable whole numbers, like "number of children").
- **Categorical data** is a label, not a quantity — eye color, country of residence, yes/no survey answers, movie genre. You can count how often each category shows up, but "the average eye color" is meaningless.

This distinction matters because it decides which tools even apply. You'll see later in this tier that you can compute a mean for numerical data but not for categorical data — the *mode* (the most common value) is the one measure of "typical" that works for both.

## Why summarize at all?

Any summary necessarily throws information away. The mean of a dataset doesn't tell you about every individual value that produced it — two wildly different datasets can share the exact same mean. That sounds like a flaw, but it's actually the point: a summary is useful precisely *because* it discards the overwhelming majority of detail and keeps only what you asked for. The skill this path builds is choosing summaries that keep the detail that matters for your question, and recognizing when a summary is hiding something important (you'll meet a dramatic example of that later, in Simpson's paradox).

## How this path teaches

Formulas alone are easy to forget and easy to apply blindly. This path leans heavily on interactive exploration — dragging points on a number line, watching a histogram reshape as you change a slider — because statistical intuition is built by *seeing* how a number reacts when the underlying data changes, not by memorizing an equation. Where code does appear, later in this tier, it's there to make the concept concrete and checkable, not to be the main event.

## Common mistakes

- Treating "sample" and "population" as interchangeable — which one you're describing changes what claims you're allowed to make.
- Trying to average categorical data (like averaging zip codes or product categories) because it happens to be stored as numbers.
- Assuming a single summary number tells the whole story about a dataset — it never does, by design.
- Skipping the conceptual "why" and jumping straight to memorizing formulas, which tends to produce someone who can compute a statistic but not explain what it means.
