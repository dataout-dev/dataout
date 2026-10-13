Not every column in a dataset is a number you can do arithmetic on. "Favorite programming language," "country of residence," and "did the customer churn: yes/no" are all perfectly good data — they just need a completely different toolkit than mean, median, and standard deviation.

You will learn:

- why you can't meaningfully average labels
- counts and proportions as the right summary for categories
- why bar charts beat pie charts for comparing many categories
- why mode is the one center-measure that still works here
- a caution about proportions from small samples

## Why averaging doesn't apply

Suppose a survey asks 100 people their favorite season, and the answers are stored as `1 = Winter, 2 = Spring, 3 = Summer, 4 = Fall`. It's tempting to compute the "average" of that column — but doing so would produce nonsense. A mean of 2.6 doesn't mean anything between "Spring" and "Summer"; the numbers are just arbitrary labels standing in for categories, not quantities with real distance between them. The same issue applies to zip codes, product IDs, and multiple-choice survey codes — if it's a label wearing a numeral's costume, arithmetic on it is meaningless, even though your spreadsheet will happily let you compute it anyway.

The fix is to recognize categorical data for what it is and reach for tools built for labels, not quantities.

## The right summary: counts and proportions

For categorical data, the natural summary is a **count** — how many responses fell into each category — or a **proportion** — what *share* of all responses that count represents. If 40 out of 100 survey respondents said "Summer," the count is 40 and the proportion is 0.40 (or 40%).

Proportions are usually more useful than raw counts whenever you want to compare across groups of different sizes. "40 people chose Summer" means something different if that's 40 out of 100 versus 40 out of 4,000 — the proportion (40% versus 1%) makes the comparison immediate without you having to do the division in your head every time.

## Visualizing categories: bar charts over pie charts

A **bar chart** — one bar per category, height showing count or proportion — is almost always the better default for categorical data, especially once you have more than three or four categories. Human eyes compare the *length* of bars along a shared baseline far more accurately than they compare the *angle* or *area* of pie slices. Once a pie chart has six or seven thin slices, telling which is actually bigger becomes a genuine squint, while the same data in a bar chart is an instant, confident comparison. Pie charts remain common because they're visually familiar and look good in a slide — but for *useful* comparison, especially beyond a couple of categories, a bar chart wins.

## Mode: the center-measure that still works

Recall from the mean/median/mode lesson: the **mode** — the most frequent value — is the one measure of "typical" that still makes sense for categorical data. If "Summer" got the most votes in that survey, the mode of the dataset is "Summer." There's no equivalent for mean or median here; a mode is simply the category with the highest count or proportion.

## A caution: small samples make proportions jumpy

Proportions computed from a small number of observations can swing wildly on very little evidence. If you survey just 5 people and 3 say "Summer," you'd report a 60% proportion — but flip just one person's answer and that proportion jumps to 40% or 80%. The same flip in a sample of 1,000 people barely moves the proportion at all. Before trusting (or sharing) a proportion, it's worth asking how many observations it's actually built on — a dramatic-sounding percentage from a tiny sample is often just noise wearing a precise-looking number.

## Common mistakes

- Averaging a column of category codes (like `1, 2, 3, 4` standing for labels) because it's technically stored as numbers.
- Defaulting to a pie chart out of habit, especially once there are more than a handful of categories to compare.
- Reporting a proportion without any sense of the sample size behind it, which can make a tiny, noisy sample sound as authoritative as a large one.
- Forgetting that mode is still available and meaningful for categorical data, even though mean and median are not.
