There is exactly one rule in predictive modeling that, if you break it, makes every other number you report meaningless: never evaluate a model on data it has already seen.

You will learn:

- why evaluating on training data gives a falsely optimistic picture
- what `train_test_split` actually does
- how to choose a test size
- why the split has to happen before any fitting, not after

## The problem with grading your own homework

Imagine memorizing the answer key to a specific practice test, then being told you "passed" because you got every question right on that exact test. That tells you nothing about whether you understood the material — only that you memorized that one test. A model trained and then evaluated on the *same* rows has exactly this problem: a complex enough model can partly memorize its training data, so its accuracy there is not a fair preview of how it handles anything new.

## What train_test_split actually does

```text
from sklearn.model_selection import train_test_split

train, test = train_test_split(data, test_size=0.2, random_state=0)
```

This randomly divides your data into two separate sets. You fit the model on `train` only. You evaluate it on `test` only — rows the model has never been allowed to look at. Whatever performance the model shows on `test` is your honest estimate of how it would do on new, unseen data.

`random_state` fixes the randomness so the same split happens every time you rerun the code — useful for reproducibility, not a requirement for the idea to work.

## Choosing a test size

`test_size=0.2` (20% held out for testing) is a common default, and a reasonable one when you have a few hundred rows or more. The trade-off is simple: a bigger test set gives you a more reliable estimate of real-world performance, but leaves less data for the model to actually learn from. With very small datasets, people sometimes use more elaborate schemes (cross-validation) to squeeze more out of limited data — outside the scope of this first lesson, but good to know the name of.

## Split first, always

The split has to happen *before* you do anything else — before you fit, before you compute any statistic you plan to use as a feature, before you decide how to fill in missing values based on "the data." If you compute something like a column's mean using the *full* dataset and then use that number to fill gaps in both train and test, you've let a little bit of test-set information leak into training through the back door. The safe habit: split first, then do everything else only using the training set (and apply the exact same transformation, without re-deriving it, to the test set).

## Common mistakes

- Fitting a model, then evaluating it on the same data it was fit on, and reporting that number as "accuracy."
- Computing something from the full dataset (a mean to fill missing values, a category list) before splitting, letting test-set information leak into the training process.
- Treating a single train/test split as a precise, unchanging number rather than one estimate — a different `random_state` will give a somewhat different test score, especially on small datasets.
- Forgetting that `test_size` and `train_size` are not the same argument, and mixing them up silently flips which set is which.
