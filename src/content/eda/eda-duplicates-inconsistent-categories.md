The same real-world thing can show up twice in your data under two different disguises: literally duplicated as a row, or spelled three different ways across a category column. Both quietly inflate or scatter counts that should be clean.

You will learn:

- how to check for exact duplicate rows
- why "duplicate" sometimes means "same thing, different key" rather than identical rows
- how whitespace and casing silently split one category into several
- a simple normalization pattern for cleaning categorical text

## Exact duplicates

```text
df.duplicated().sum()       # count of exact duplicate rows
df[df.duplicated(keep=False)]  # see all copies of each duplicate
```

`.duplicated()` flags rows that are byte-for-byte identical to an earlier row. This sounds like it should be rare, but it happens constantly in real pipelines — a record ingested twice, a scrape re-run that appended instead of replaced, an export job that double-counted a batch. One of the government datasets used later in this section's projects has a small number of genuinely duplicated rows straight from the source, not introduced by anything you did.

## Duplicates that aren't identical

A trickier case: the same real entity appears twice, but the rows aren't identical — maybe a customer record was updated between two exports, so the later copy has a different timestamp or a corrected field. `.duplicated()` alone won't catch this, because the rows differ. You need to duplicate-check on a *subset* of columns that should uniquely identify the entity (`df.duplicated(subset=["customer_id"])`) rather than the whole row.

## When a category is really three categories

Open any real categorical column and you will eventually find something like this:

```text
"Gold", " gold ", "GOLD", "gold"
```

To a person, these are obviously the same category. To `.value_counts()`, they are four different ones — which means a category that should show as the clear majority instead gets split into several smaller, individually-unremarkable-looking groups. This is one of the most common ways a real pattern in data hides in plain sight.

The standard fix is a simple normalization pass: lowercase everything, strip leading/trailing whitespace, and re-check. This single step — `.str.strip().str.lower()` — routinely merges what looked like five categories back into the one real category they always were.

## Common mistakes

- Checking for duplicates only on the whole row, missing cases where the same entity appears twice with slightly different data.
- Running `.value_counts()` on a categorical column and taking the result at face value without checking for casing/whitespace variants first.
- Normalizing a category column's casing but forgetting that typos (`"Golde"` vs `"Gold"`) are a related, harder problem normalization alone won't fix.
- Deduplicating rows without first deciding which copy to keep when they are *not* identical — an arbitrary "keep the first one" can silently discard the more recent, more correct record.
