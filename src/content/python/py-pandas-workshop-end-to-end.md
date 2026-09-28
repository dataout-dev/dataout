A workshop lesson: no new pandas functions, just putting the whole toolkit together on one real question, end to end — define it, load and clean the data, join and aggregate, and check the result actually makes sense.

You will learn:

- turning a vague question into a precise one
- loading, cleaning, joining and aggregating in sequence
- verifying results before trusting them
- writing findings in words, not just numbers

## Define the question precisely

"Which routes have the worst delays?" is not yet precise enough to code against. "Among routes with **at least 200 flights** (so a lucky or unlucky handful does not dominate), which have the highest **average arrival delay**?" is something you can actually write a function for — the precision usually has to come from you, not from the data.

## Load, clean, join, aggregate

```python
import pandas as pd

flights = pd.DataFrame({
    "origin": ["JFK", "JFK", "LGA", "LGA", "JFK"],
    "dest": ["LAX", "LAX", "ORD", "ORD", "LAX"],
    "arr_delay": [10.0, None, 30.0, 25.0, 15.0],
})

cleaned = flights.dropna(subset=["arr_delay"])
by_route = cleaned.groupby(["origin", "dest"])["arr_delay"]
summary = by_route.agg(avg_delay="mean", n_flights="count").round(1)
print(summary)
```

Each step here is something from an earlier lesson; the workshop is choosing the right sequence of them for this specific question, not learning anything new.

## Applying the eligibility filter

```python
import pandas as pd

summary = pd.DataFrame(
    {"avg_delay": [12.0, 40.0, 8.0], "n_flights": [5, 250, 300]},
    index=pd.MultiIndex.from_tuples([("A", "B"), ("C", "D"), ("E", "F")], names=["origin", "dest"]),
)
eligible = summary[summary["n_flights"] >= 200].sort_values("avg_delay", ascending=False)
print(eligible)
```

The route with only 5 flights (`("A", "B")`) is excluded here, regardless of how extreme its average looks — exactly the situation the eligibility threshold exists to guard against.

## Verify before trusting

```python
import pandas as pd

flights = pd.DataFrame({"arr_delay": [10.0, None, 30.0, 25.0]})
total_rows = len(flights)
used_rows = flights["arr_delay"].notna().sum()
print(f"used {used_rows} of {total_rows} rows ({total_rows - used_rows} dropped for missing arr_delay)")
```

A quick sanity check like this — how many rows actually contributed to the answer — catches an accidental over-aggressive filter (or a join that silently multiplied rows) before it reaches a conclusion.

## Write the finding in words

A number alone ("`(JFK, LAX)`, 40.2 minutes") is not yet a finding. "Among routes with at least 200 flights in the data, JFK to LAX had the worst average arrival delay, at 40.2 minutes — nearly triple the overall average of 14 minutes" gives a reader the number **and** the context needed to judge whether it matters.

## Common mistakes

- Skipping the eligibility filter and letting a route with a handful of flights dominate the ranking.
- Reporting a result without checking how many rows actually contributed to it.
- Presenting a bare number without the comparison that makes it meaningful.
- Treating the first answer that runs without an error as automatically correct.

## Recap

- Turn a vague question into a precise, codeable one before writing anything.
- Sequence the tools you already know: clean, join, aggregate, filter for eligibility.
- Sanity-check row counts before trusting an aggregated result.
- A finding needs both the number and enough context for a reader to judge it.

## Your turn

In the **Practice** tab you write `worst_routes(flights)`. Then three challenges use the real flights data.
