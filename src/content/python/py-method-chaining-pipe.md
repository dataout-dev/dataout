A method chain reads top to bottom in exactly the order the computation happens: filter, then transform, then group, then summarise — each line building directly on the one before.

You will learn:

- chaining `assign`, `query`, `sort_values` and more in one expression
- writing a custom step with `.pipe`
- keeping a long chain readable
- when a chain hides too much state

## A basic chain

```python
import pandas as pd

df = pd.DataFrame({"score": [95, 40, 88, 60], "active": [True, True, False, True]})
result = (
    df
    .query("active")
    .assign(passed=lambda d: d["score"] >= 60)
    .sort_values("score", ascending=False)
)
print(result)
```

Wrapping the chain in parentheses lets each `.method()` sit on its own line — much easier to read (and to diff, in version control) than one very long line.

## lambda inside assign

```python
import pandas as pd

df = pd.DataFrame({"price": [10.0, 20.0]})
result = df.assign(with_tax=lambda d: d["price"] * 1.2)
print(result)
```

Using a `lambda d: ...` inside `.assign` (referring to the frame **as it exists at that point in the chain**, not the original `df`) lets a later step build on a column an earlier step in the *same* chain just added.

## Custom steps with .pipe

```python
import pandas as pd

def add_bucket(df):
    return df.assign(bucket=pd.cut(df["score"], bins=[0, 60, 80, 100], labels=["low", "mid", "high"]))

df = pd.DataFrame({"score": [45, 72, 95]})
result = df.pipe(add_bucket).sort_values("score")
print(result)
```

`.pipe(func)` calls `func(current_frame)` and continues the chain with whatever it returns — the way to slot a **custom, named** transformation into a chain, instead of writing it as one more built-in-looking line that is really doing something bespoke.

## Debugging a chain

A chain that fails partway through can be hard to inspect, since there is no intermediate variable to look at. Breaking it into a few named steps while developing (then chaining once it works) is a reasonable middle ground:

```python
import pandas as pd

df = pd.DataFrame({"score": [95, 40, 88]})
step1 = df.query("score > 50")
step2 = step1.assign(passed=True)
print(step2)
```

## Watch out: chains that hide state

```python
import pandas as pd

df = pd.DataFrame({"score": [95, 40, 88]})
result = (
    df
    .assign(passed=lambda d: d["score"] >= 60)
    .query("passed")
    .drop(columns="passed")
)
print(result)
```

This chain adds a column purely to filter on it, then removes it again — perfectly correct, but a reader has to trace the whole chain to realise `passed` never actually survives. A short comment (or a slightly less clever chain) is a fair trade for a reader's five seconds of confusion.

## Common mistakes

- Referring to the *original* `df` inside a chain's lambda, instead of the intermediate `d` the chain has built up to that point.
- Writing every custom transformation inline instead of a named `.pipe(func)` step, which loses a natural place to give it a docstring or a test.
- Chaining so many steps that a single failure gives no clue which one broke.
- Building a column purely as scratch state and dropping it later, without a comment explaining why.

## Recap

- Wrapping a chain in parentheses lets each method sit on its own readable line.
- `lambda d: ...` inside `.assign` refers to the frame as built up **so far** in the chain, not the original.
- `.pipe(func)` slots a named, custom step into a chain like any built-in method.
- Break a failing chain into named intermediate steps to debug it, then re-chain once it works.

## Your turn

In the **Practice** tab you write `pipeline(df)`. Then three challenges use real flight data.
