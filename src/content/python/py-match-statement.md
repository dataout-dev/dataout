When a value can take many forms, a long chain of `if` and `elif` gets tiring. Python 3.10 added the **`match` statement**, which compares a value against a list of patterns and runs the first one that fits. It is especially good when the value has a shape, such as a command with parts.

## The basic form

```python
day = "sat"
match day:
    case "sat":
        print("weekend")
    case "sun":
        print("weekend")
    case "mon":
        print("back to work")
    case _:
        print("some other day")
```

Each `case` is a pattern. Python checks them from the top and runs the first that matches. The underscore `_` is the **wildcard**: it matches anything, so it works as a final "else".

## Several values in one case

Join alternatives with `|`:

```python
day = "sun"
match day:
    case "sat" | "sun":
        print("weekend")
    case _:
        print("weekday")
```

## Capturing a value

A name in a pattern **captures** whatever matched, so you can use it inside the block:

```python
command = "load data.csv"
match command.split():
    case ["load", filename]:
        print("loading", filename)
    case ["quit"]:
        print("bye")
    case _:
        print("unknown command")
```

The pattern `["load", filename]` matches a list of exactly two items whose first is `"load"`. The second one is captured in `filename`.

Watch out: a plain name in a pattern is a **capture**, not a comparison. `case x:` always matches and stores the value in `x`. To compare with a constant, use a literal such as `"sat"`.

## Patterns for tuples

Tuples and lists both work. You can also take "the rest":

```python
command = ("move", 3, 4)
match command:
    case ("move", x, y):
        print(f"moving to {x}, {y}")
    case ("say", text):
        print(text)
    case ("quit",):
        print("bye")
    case _:
        print("unknown")
```

Try changing `command` to `("say", "hi")`, then to `("quit",)`, then to something unexpected.

## Guards

Add an `if` after a pattern to require more:

```python
point = (3, 0)
match point:
    case (x, 0):
        print("on the horizontal axis at", x)
    case (0, y):
        print("on the vertical axis at", y)
    case (x, y) if x == y:
        print("on the diagonal")
    case _:
        print("somewhere else")
```

## Matching None and dictionaries

`None` can be a pattern too, and dictionaries can be matched by their keys:

```python
value = None
match value:
    case None:
        print("nothing")
    case _:
        print("something")
```

```python
row = {"species": "Adelie", "island": "Torgersen"}
match row:
    case {"species": "Adelie"}:
        print("an Adelie penguin")
    case _:
        print("another species")
```

## When to use match

Use `match` when you are choosing between many shapes or values, especially when you want to pull parts out. For one or two simple conditions, `if` is clearer.

## Common mistakes

- Forgetting the colon after `match value` or after a `case`.
- Expecting a name to compare instead of capture.
- Forgetting a final `case _` and getting no result for unexpected values.
- Putting a broad pattern before a narrow one. The first match wins.

## Recap

- `match value:` followed by `case pattern:` blocks. The first match runs.
- `_` matches anything, and `|` combines alternatives.
- Names capture parts of the value, and `if` adds a guard.
- Use `match` for many shapes and `if` for simple choices.
