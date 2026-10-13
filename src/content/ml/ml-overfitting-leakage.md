A model that looks spectacular while you're building it and falls apart the moment it meets real data has almost always fallen into one of exactly two traps: it memorized rather than learned, or one of its features was secretly giving away the answer.

You will learn:

- what overfitting actually is, beyond "the model is too complex"
- why strong training performance can be a warning sign, not good news
- what data leakage is, and why it's sneakier than it sounds
- how to ask, feature by feature, whether it's fair to use

## Overfitting: memorizing instead of learning

A model has an enormous amount of flexibility to fit whatever pattern — including pure noise — happens to exist in its training data. Pushed far enough, a model can essentially memorize the training set: achieving near-perfect performance there while having learned nothing that generalizes to new rows. This is overfitting, and it's exactly why the train/test split exists: training performance tells you how well the model memorized; test performance tells you how well it actually learned something transferable.

A useful habit: whenever training accuracy is dramatically higher than test accuracy, treat that gap itself as a warning sign, not just two separate numbers.

## Leakage: a feature that gives away the answer

Leakage is different, and often harder to spot, because it doesn't show up as a gap between training and test performance — a leaky feature can make BOTH look great, consistently, because the test set has the same leak. Leakage happens when a feature contains information that would not actually be available at the moment you'd need to make a real prediction, or that is so tightly bound to the target that using it barely counts as prediction at all.

The Student Performance project in this section builds this directly in: predicting a student's final grade (`G3`) is a genuinely useful, hard problem using features like study habits and family background. Predicting it from their *first and second period grades* (`G1`, `G2`) is a different, much easier problem — because those earlier grades are so strongly correlated with the final one that the model barely has to learn anything. Whether that's a problem depends entirely on what question you're actually trying to answer.

## The test that catches most leakage

For any feature you're considering, ask: "would I actually have this piece of information, in exactly this form, at the moment I need to make this prediction for real?" A feature computed using information from the future relative to your prediction point, or a feature that is really just a disguised restatement of the target, both fail this test. This single question catches the overwhelming majority of real leakage cases, long before any metric would reveal it to you.

## Why this matters more than any specific technique

Of everything in this five-lesson sequence, data leakage is the trap most likely to actually bite you in real work — not because it's conceptually hard, but because it's easy to miss when you're excited about a feature that seems to help a lot. A model that looks 95% accurate because of leakage is strictly worse than an honest 70% model, because the 95% number will actively mislead whoever relies on it once it meets the real world.

## Common mistakes

- Treating a big jump in accuracy from adding one feature as automatically good news, without asking why that feature helps so much.
- Only checking for overfitting (training vs. test gap) and assuming that catches every reliability problem — it doesn't catch leakage, which affects both sets equally.
- Including a feature that is technically available but was only recorded *after* the outcome you're predicting already happened.
- Deciding a feature is "fine" just because it isn't literally the target column, without tracing where its information actually comes from.
