Before a single line of plotting code, a chart starts with a question and an honesty check. This lesson is entirely conceptual — the coding lessons that follow put every idea here into practice.

You will learn:

- matching a chart type to the question being asked
- why position and length are judged more accurately than angle and area
- axes, baselines and truncation
- colour for meaning, not just decoration

## Match the chart to the question

- **Comparison** ("who has the most?") → a bar chart.
- **Trend** ("how has this changed?") → a line chart.
- **Distribution** ("what does the spread look like?") → a histogram or box plot.
- **Relationship** ("do these two move together?") → a scatter plot.
- **Part-to-whole** ("what share does each take?") → usually a bar chart of shares works better than a pie chart, especially past 3–4 categories.

Starting from the question, rather than "which chart do I already know how to make", is the single biggest factor in choosing well.

## Position and length beat angle and area

Humans judge the **position** of a point along a shared axis, and the **length** of a bar from a shared baseline, considerably more accurately than the **angle** of a pie slice or the **area** of a shape. This is not a matter of taste — it is well-replicated in perception research, and it is the main reason a simple bar chart usually communicates a comparison better than a pie chart, even though pie charts remain visually familiar.

## Axes, baselines and truncation

A bar chart's length is *read* relative to a zero baseline, by habit. Starting the axis somewhere above zero (to "zoom in" on small differences) makes a modest difference look dramatic, purely through the choice of where the axis begins — even if every number on the chart is completely accurate. A line chart is more forgiving of a non-zero baseline (since its point-to-point *slope* is what usually matters, not each point's raw length from zero), but it deserves the same scrutiny whenever the *height* itself is meant to be compared.

## Colour for meaning and accessibility

Colour communicates well for **categories** ("which series is which") and for **drawing attention** to one thing, but poorly for precise **quantitative** comparison — readers judge a subtle colour gradient far less exactly than a position on an axis. Colour choices also need to work for readers with colour vision differences: relying on red-versus-green as the *only* signal, with no other cue (a label, a different marker shape, a pattern), excludes some readers from the chart's message entirely.

## Annotation

A chart rarely speaks entirely for itself. A short annotation — an arrow, a highlighted point, a line marking a threshold — can point a reader directly at the specific piece of evidence behind a claim, instead of hoping they notice it among everything else on the chart.

## Watch out: dual axes and 3-D charts

A chart with two independent y-axes can make two unrelated series appear to move together, purely because of how each axis happens to be scaled — a strong, easy-to-produce illusion of a relationship that may not exist. A 3-D bar or pie chart adds a perspective effect that distorts exactly the position and area judgements discussed above, without adding any real information a 2-D version could not show more honestly.

## Common mistakes

- Choosing a chart type from habit or software defaults, rather than from the actual question being asked.
- Truncating a bar chart's axis to make a small difference look larger.
- Using colour as the *only* way to distinguish categories that also matter for colour-vision-different readers.
- Adding a 3-D effect that looks more impressive but actually distorts the comparison it is meant to support.

## Recap

- Start from the question (comparison, trend, distribution, relationship, part-to-whole), then choose the chart.
- Position and length are read more accurately than angle and area.
- A bar chart's baseline should usually start at zero; scrutinise any exception.
- Colour communicates category and draws attention; it is a weak channel for precise quantitative comparison.
