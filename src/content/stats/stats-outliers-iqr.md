You've already met outliers twice in this tier — as the point that drags a mean away from a median, and as the dot sitting outside a box plot's whiskers. Now it's time to actually define "outlier" precisely enough to detect one automatically, and to think honestly about what to do once you've found it.

You will learn:

- the mechanics of the 1.5×IQR rule for flagging outliers
- why flagging an outlier is not the same as deleting it
- the judgment call between "data error" and "genuine extreme value"
- a worked example by hand
- why domain knowledge matters more than the rule itself

## The 1.5×IQR rule, mechanically

You met the pieces of this rule already in the five-number summary lesson. To recap the mechanics:

1. Find Q1 and Q3 (the first and third quartiles).
2. Compute the IQR: `IQR = Q3 - Q1`.
3. Compute a lower fence: `Q1 - 1.5 * IQR`, and an upper fence: `Q3 + 1.5 * IQR`.
4. Any value below the lower fence, or above the upper fence, gets flagged as an outlier.

## A worked example

Take the dataset `[12, 14, 14, 15, 16, 16, 17, 18, 19, 41]`.

```text
Sorted: 12, 14, 14, 15, 16, 16, 17, 18, 19, 41

Q1 (25th percentile region): 14
Q3 (75th percentile region): 18

IQR = 18 - 14 = 4

lower fence = 14 - 1.5 * 4 = 14 - 6 = 8
upper fence = 18 + 1.5 * 4 = 18 + 6 = 24
```

Every value is between 8 and 24 except one: 41. It sits well above the upper fence of 24, so the rule flags it as an outlier. Nothing is below 8, so there are no low-end outliers here. Note that the rule didn't need to know anything about where this data came from — it's a purely mechanical check based on the shape of the data's own middle 50%.

## Flagging is not the same as handling

This is the part people skip past too quickly: the 1.5×IQR rule's job ends at *flagging*. It does not tell you what to do next, and "delete every flagged point" is very often the wrong move. Once something is flagged, you're choosing between (at least) two very different stories:

- **It's a data error.** A sensor glitched, someone mistyped a value, a unit conversion was applied twice. In this case, correcting or removing the point is usually the right call — it was never a real observation of the thing you're measuring.
- **It's a genuine, real extreme value.** A real customer really did spend 50 times the average order size. A real patient really did recover in half the typical time. These points aren't errors — they're exactly the kind of rare-but-real event your dataset should be capturing, and deleting them just because they're far from the pack can quietly erase the most important data point in the whole set.

Flagging that 41 in the example above doesn't tell you which of these two stories is true. It just tells you "look here" — the deciding work comes next.

## Why domain knowledge matters more than the rule

The 1.5×IQR threshold is a convention, not a law of nature — it was chosen because it works reasonably well across a lot of ordinary, roughly bell-shaped datasets, not because 1.5 is some fundamental constant. A dataset that's naturally heavy-tailed (like the kurtosis idea from an earlier lesson) will trip this rule constantly, flagging many points that aren't actually unusual for that particular kind of data. Knowing *what* you're measuring — whether extreme values are plausible, how the data was collected, what a sensor or survey error would even look like — is what actually lets you decide whether a flagged point deserves correction, removal, or a closer look and a note in your write-up. The rule is a flashlight pointed at candidates; it was never meant to be the judge.

## Common mistakes

- Automatically deleting every flagged point without asking whether it's a data error or a genuine extreme value.
- Treating the 1.5 multiplier as a fixed, universal law rather than a convention that can be adjusted for unusually shaped data.
- Running the rule once and never re-checking after correcting other data issues, which can shift Q1, Q3, and the fences themselves.
- Forgetting that the rule flags low outliers too — it's easy to only look for unusually high values and miss a suspiciously low one.
