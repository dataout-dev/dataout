A mean and a standard deviation are two numbers. A histogram is a picture that can show you things those two numbers can't — like whether your data actually clusters in two completely separate groups that no single average would ever reveal.

You will learn:

- what a histogram actually shows
- how bin width changes what the same data appears to say
- unimodal versus bimodal shapes
- why a bimodal shape can be a clue that two groups are mixed together
- why looking at a histogram first beats jumping straight to the mean

## What a histogram is

A **histogram** takes a numerical variable, chops its range into consecutive intervals called **bins**, and draws a bar for each bin whose height shows how many values from the dataset fall inside it. It's a bar chart, but built from one continuous variable instead of pre-existing categories — the categories (the bins) are something you choose.

If you had the heights of 200 adults, a histogram might show a tall bar around 170cm, shorter bars tapering off toward 150cm and 195cm, and almost nothing beyond that — instantly giving you a sense of "where most people cluster" and "how spread out they are" in one glance, without reading a single number off a table.

## Bin width changes the picture

Here's the catch: the same dataset can look like a completely different distribution depending on how wide you make the bins.

- **Too few, too-wide bins** flatten everything into one or two giant bars, smoothing over real structure in the data — you lose the detail of exactly where values cluster.
- **Too many, too-narrow bins** turn the histogram into a jagged, noisy mess where each bar represents so few points that random noise looks like meaningful structure.

There's no single "correct" bin width for every dataset — it depends on how much data you have and how fine-grained a picture you need. The practical habit is to try a couple of different bin counts and see whether the *shape* you're seeing survives the change. If a pattern disappears the moment you adjust bin width slightly, it was probably noise, not signal.

## Unimodal vs. bimodal shapes

A histogram with one clear peak is called **unimodal** — most real-world measurements of a single, uniform group tend to look like this (adult heights within one population, for instance, cluster around a single typical value with a taper on either side).

A histogram with two distinct peaks is called **bimodal**. This is a much more interesting signal than it might first appear.

## Why bimodal shapes are a clue

A bimodal histogram often means your dataset is secretly *two different groups* mashed together into one variable. A classic example: plot the heights of a mixed group of adult men and women together, and you'll often see two overlapping peaks rather than one — because "height" in that combined dataset isn't really one population, it's two populations with different typical values, stacked on top of each other.

If you only reported the mean height of that mixed group, you'd get a number that doesn't describe either group well — it sits in the valley between the two real peaks, a value that few actual people in the dataset are close to. The histogram reveals a structural issue that the mean quietly papers over: maybe the data should be split by group before you summarize it at all.

## Why look at the histogram before the mean

This is the real argument for making a histogram one of the very first things you do with any new numerical variable. A mean, computed blindly, assumes there's one underlying "typical" group to be typical of. A quick histogram tells you whether that assumption is even reasonable before you commit to a summary number — whether the data is roughly one bell-shaped cluster, skewed off to one side, or secretly made of multiple groups that deserve to be looked at separately.

## Common mistakes

- Picking one bin width, deciding what the data "looks like," and never checking whether that impression survives a different bin width.
- Treating a bimodal shape as a graphing glitch rather than a meaningful signal that the data might contain mixed groups.
- Computing a mean or standard deviation before ever looking at a histogram, and missing structure that a single glance would have revealed.
- Assuming a histogram's shape is fixed and objective — the same data, binned differently, can tell visibly different stories.

Play with the explorer below to watch the same data reshape as the skew slider moves.
