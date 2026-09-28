JSON (JavaScript Object Notation) is the standard format for exchanging structured data between programs: web services return it, configuration files use it, and many databases can export it. It maps almost perfectly onto Python's dictionaries and lists, which is why working with it in Python is so pleasant.

You will learn:

- how JSON maps to Python types
- `json.loads` and `json.dumps` for text, `json.load` and `json.dump` for files
- pretty printing and sorting keys
- what does not survive a round trip
- handling dates and custom objects
- JSON Lines for big data
- walking through nested data

## JSON and Python

| JSON | Python |
| ---- | ------ |
| object `{}` | `dict` |
| array `[]` | `list` |
| string | `str` |
| number | `int` or `float` |
| `true`, `false` | `True`, `False` |
| `null` | `None` |

```python
import json

text = '{"name": "Ada", "age": 36, "languages": ["en", "fr"], "married": false, "spouse": null}'
person = json.loads(text)
print(person["languages"][1])
print(person["spouse"], type(person["age"]).__name__)
```

`loads` (load **s**tring) turns text into Python data. `dumps` does the opposite:

```python
print(json.dumps(person))
print(json.dumps([1, 2.5, "x", None, True]))
```

## Files

`json.load(file)` and `json.dump(data, file)` (without the `s`) read and write files directly:

```python
import tempfile
from pathlib import Path

folder = Path(tempfile.mkdtemp())
path = folder / "person.json"

with open(path, "w", encoding="utf-8") as file:
    json.dump(person, file, indent=2)

with open(path, encoding="utf-8") as file:
    again = json.load(file)

print(again == person)
print(path.read_text(encoding="utf-8").splitlines()[:3])
```

## Making it readable

`indent` gives a nicely laid out text. `sort_keys=True` gives the same order every time, which is helpful for comparing files. `ensure_ascii=False` keeps accented letters as they are:

```python
data = {"b": 1, "a": {"y": [1, 2], "x": "café"}}
print(json.dumps(data, indent=2, sort_keys=True))
print(json.dumps(data, ensure_ascii=False))
print(json.dumps(data, separators=(",", ":")))
```

The last form is the most compact, and is good for sending over a network.

## What does not survive

JSON is simpler than Python. A **round trip** (dump, then load) changes some things:

```python
original = {1: "int key", "t": (1, 2)}
print(json.loads(json.dumps(original)))
```

- **Keys** are always **strings**, so the integer key `1` comes back as `"1"`.
- **Tuples** become **lists**.
- Sets, dates, bytes and your own objects are **not** supported at all:

<!-- expect-error -->
```python
json.dumps({"tags": {"a", "b"}})
```

Also, `NaN` and infinity are accepted by default but are not valid JSON. Pass `allow_nan=False` when you must be strict.

## Errors

A text that is not valid JSON raises a `json.JSONDecodeError` (a kind of `ValueError`), and it tells you where:

<!-- expect-error -->
```python
json.loads('{"name": "Ada",}')
```

Real JSON has double quotes and no trailing commas, unlike Python or JavaScript literals.

## Dates and custom objects

For types JSON does not know, give `dumps` a **`default`** function that turns them into something it does know:

```python
from datetime import date, datetime

def encode(value):
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    if isinstance(value, set):
        return sorted(value)
    raise TypeError(f"cannot encode {type(value).__name__}")

print(json.dumps({"when": date(2024, 3, 15), "tags": {"b", "a"}}, default=encode))
```

To go the other way, `loads` accepts an **`object_hook`**, a function that is called with every decoded dictionary:

```python
def decode(d):
    if "when" in d:
        d["when"] = date.fromisoformat(d["when"])
    return d

result = json.loads('{"when": "2024-03-15", "n": 1}', object_hook=decode)
print(result["when"].year)
```

Dates are just text in JSON, so both sides need to agree on a format. ISO 8601 (`2024-03-15`) is the sensible choice.

## JSON Lines

A single JSON document has to be read as a whole. For **large** or **growing** data, many systems use **JSON Lines**: one JSON value per line. You can process it one line at a time:

```python
import io

log = '{"level": "info", "msg": "start"}\n{"level": "error", "msg": "boom"}\n{"level": "info", "msg": "end"}\n'
errors = [json.loads(line) for line in io.StringIO(log) if '"error"' in line]
print(errors)

output = io.StringIO()
for record in [{"id": 1}, {"id": 2}]:
    output.write(json.dumps(record) + "\n")
print(output.getvalue().splitlines())
```

## Walking nested data

Real JSON is often deeply nested. A small recursive function can flatten it into dotted keys:

```python
def flatten(data, prefix=""):
    result = {}
    for key, value in data.items():
        name = f"{prefix}.{key}" if prefix else str(key)
        if isinstance(value, dict):
            result.update(flatten(value, name))
        else:
            result[name] = value
    return result

print(flatten({"a": {"b": 1, "c": {"d": 2}}, "e": 3}))
```

## Thinking about the schema

A JSON file has no built-in structure rules. Before you trust the data, check that the keys you need are there and have the right types. Libraries such as `jsonschema` (third-party) can check a document against a description, and the validation habits from the errors section apply just as well.

## Common mistakes

- Expecting integer keys or tuples to survive a round trip.
- Trying to dump dates, sets or your own objects without a `default` function.
- Writing invalid JSON by hand: single quotes, trailing commas, comments.
- Forgetting `encoding="utf-8"` when saving or loading files.

## Recap

- `loads` and `dumps` work on text, `load` and `dump` on files.
- Objects become dictionaries and arrays become lists. Keys are always strings, and tuples become lists.
- `indent`, `sort_keys` and `ensure_ascii` control the output. `default` and `object_hook` extend the types.
- Use JSON Lines for big or streaming data.

## Your turn

In the **Practice** tab you write `flatten(d)`. Then three challenges use the Chinook store.
