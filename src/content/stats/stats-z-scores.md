A score of 85 sounds good on a test out of 100. But is it good on a test where the class average was 90, and everyone scored within a point or two of each other? A z-score answers that question properly — it tells you exactly how unusual a value is, in units that work the same way no matter what's being measured.

You will learn:

- the z-score formula and what each piece means
- why standardizing makes values comparable across completely different scales
- how to read a z-score's sign and magnitude
- a worked example by hand

## The problem: raw values don't compare well

Suppose you score 85 on a test with a mean of 90 and a standard deviation of 2, and you score 78 on a different test with a mean of 70 and a standard deviation of 10. Which performance was actually better, relative to everyone else who took each test? Just looking at 85 versus 78 tells you nothing useful — the two tests have totally different scales. You need a way to describe "how unusual is this value" that doesn't depend on the particular units or range of the dataset it came from.

## The z-score formula

A **z-score** answers exactly that. For a value `x` in a dataset with mean `μ` ("mu") and standard deviation `σ` ("sigma"):

```text
z = (x - μ) / σ
```

In words: take the value, subtract the mean (so you now have how far above or below average it is), and divide by the standard deviation (so you now have that distance measured in "standard-deviation units" instead of raw units). The result is a single number that means the same thing no matter what the original data was measuring.

## Worked example

Back to the two tests. For the first test (mean 90, std dev 2, your score 85):

```text
z = (85 - 90) / 2 = -2.5
```

For the second test (mean 70, std dev 10, your score 78):

```text
z = (78 - 70) / 10 = 0.8
```

Even though 78 is a lower raw score than 85, its z-score of +0.8 is far better than the first test's z-score of −2.5. On the first test you scored two and a half standard deviations *below* average — a genuinely weak result relative to your classmates — while on the second test you scored almost a full standard deviation *above* average. The raw numbers were misleading; the z-scores tell the real story.

## Reading a z-score

A z-score has two pieces of information baked into it:

- **Sign**: positive means above the mean, negative means below the mean, zero means exactly average.
- **Magnitude**: how many standard deviations away from the mean that value sits. A z-score of 0 is perfectly average. A z-score of ±1 is a fairly ordinary distance from the mean. A z-score of ±2 or beyond starts to be unusual for many real datasets — far enough out that it's worth a second look, whether that means "impressively high" or "worth double-checking as a possible data error."

## Why standardizing matters beyond single comparisons

Z-scores aren't just for one-off comparisons like the test example. Standardizing an entire dataset (turning every value into its z-score) puts every variable on the same scale — which matters enormously once you start comparing or combining variables that were never measured the same way to begin with, like comparing "years of experience" to "annual salary." You'll run into this idea again once you start working with multiple variables together; for now, the key skill is computing and interpreting a single z-score correctly.

## Common mistakes

- Comparing raw values across different datasets instead of standardizing first — as the two-test example shows, this can flip which result actually looks better.
- Forgetting the sign — a z-score of −2 means notably *below* average, not just "2 units away from average" in some vague sense.
- Mixing up which standard deviation to divide by — always the standard deviation of the dataset the value came from, not some other dataset's.
- Treating any large z-score as automatically an error — it flags a value as unusual, which is a prompt to investigate, not an automatic verdict.
