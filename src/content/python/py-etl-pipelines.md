A data pipeline is code that runs repeatedly, not once — which changes what "correct" means. It needs to survive being re-run, handle a source that changes shape slightly, and fail loudly rather than silently when something is wrong.

You will learn:

- extract, transform, load
- batch versus streaming pipelines
- idempotent, re-runnable steps
- staging tables, schema drift, and logging

## Extract, transform, load

**Extract** pulls data from a source (an API, a database, a file drop). **Transform** cleans, reshapes and joins it into the shape the destination needs. **Load** writes the result to its destination (a warehouse table, a report, another API). Separating these stages clearly — even in a small script — makes each one independently testable and easier to reason about when something breaks.

```python
def extract():
    return [{"id": 1, "amount": 100}, {"id": 2, "amount": -50}]

def transform(rows):
    return [r for r in rows if r["amount"] > 0]

def load(rows):
    return len(rows)

raw = extract()
clean = transform(raw)
result = load(clean)
print(result)
```

## Batch versus streaming

A **batch** pipeline processes an accumulated chunk of data on a schedule — hourly, daily, whenever triggered. A **streaming** pipeline processes each event as it arrives, continuously. Batch is simpler to build and reason about; streaming reacts with much lower latency, at real added complexity (state that persists between events, handling events that arrive out of order, and so on). Most pipelines start as batch and only move to streaming once low latency is a genuine, specific requirement.

## Idempotence

A pipeline step is **idempotent** if running it again with the same input leaves the result exactly as if it had only run once — critical because pipelines *will* be re-run, whether from a scheduled retry after a transient failure or a deliberate reprocessing of old data.

```python
def load_idempotent(rows, existing_ids):
    new_ids = existing_ids | {r["id"] for r in rows}
    return new_ids

existing = {1, 2}
result = load_idempotent([{"id": 2}, {"id": 3}], existing)
print(result)
print(load_idempotent([{"id": 2}, {"id": 3}], result))
```

Using a **set** (or an upsert, in a real database) instead of a plain list-append means running the same batch twice changes nothing the second time — exactly the property a plain "append every row" load step would lack.

## Staging tables

Loading directly into a "live", already-in-use table risks a half-finished or buggy load leaving that table in a broken state mid-run. Loading into a separate **staging** table first, validating it, and only then swapping or copying it into the live table gives a clean point to check correctness (and to roll back) before anything downstream ever sees the new data.

## Schema drift

A source that quietly adds, renames, or removes a column ("schema drift") can break a pipeline that assumed a fixed shape — sometimes loudly (a missing column raises immediately), sometimes silently (an extra column is just ignored, or a renamed one shows up as entirely missing without an obvious error). Explicitly checking the expected columns are present, rather than assuming, turns a silent problem into a loud one.

## Logging and alerting

A pipeline that fails silently at 3am, with nobody finding out until a report looks wrong days later, is far worse than one that fails loudly and immediately notifies someone. Logging what ran, how many rows moved through each stage, and any errors encountered — plus alerting on real failures — is what makes it possible to trust an automated pipeline without watching it run by hand every time.

## Watch out: pipelines that cannot be re-run

A pipeline with no way to safely re-run a failed step (no idempotence, no staging area, no record of what already succeeded) turns every failure into a manual cleanup job — exactly the kind of operational pain the ideas in this lesson exist to avoid from the start, rather than retrofitting later under pressure.

## Common mistakes

- Building a "just append" load step and discovering the hard way it duplicates data on any retry.
- Loading directly into a live table with no staging step to validate against first.
- Assuming a source's shape will never change, with no check that would catch it if it did.
- Treating logging as optional, then having no way to diagnose a failure after the fact.

## Recap

- Extract, transform and load as separate, testable stages, even in a small script.
- Batch suits most needs; streaming trades real complexity for lower latency.
- Idempotent steps make re-running after a failure safe, not something to fear.
- Staging tables, schema checks, and real logging turn a fragile pipeline into a trustworthy one.
