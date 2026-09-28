A list finds things by position: "the third item". But often you want to find something by *name*: "the age of Ada", "the mass of this penguin". For that, Python has the **dictionary**. It stores pairs of a **key** and a **value**, and looks up a value from its key instantly. Almost every real record you meet, from a row of a CSV file to data from a website, is a dictionary.

## Creating a dictionary

A dictionary is written with curly brackets. Each entry is `key: value`:

```python
penguin = {"species": "Adelie", "island": "Torgersen", "mass_g": 3750}
print(penguin)
```

Keys are usually strings, but they can be numbers or tuples. Each key appears once.

## Looking up a value

Put the key in square brackets:

```python
penguin = {"species": "Adelie", "island": "Torgersen", "mass_g": 3750}
print(penguin["species"])
print(penguin["mass_g"])
```

If the key is missing, you get a `KeyError`:

<!-- expect-error -->
```python
penguin = {"species": "Adelie"}
print(penguin["colour"])
```

## get(): a safe lookup

`get` returns `None` for a missing key, or a default that you choose:

```python
penguin = {"species": "Adelie"}
print(penguin.get("colour"))
print(penguin.get("colour", "unknown"))
```

Use `get` whenever a key might be missing.

## Adding and changing entries

Assign to a key. If it exists, the value is replaced. If not, a new entry is added:

```python
penguin = {"species": "Adelie"}
penguin["island"] = "Dream"
penguin["species"] = "Gentoo"
print(penguin)
```

`update` merges another dictionary in, and `del` or `pop` removes a key:

```python
d = {"a": 1, "b": 2}
d.update({"b": 20, "c": 3})
print(d)
removed = d.pop("a")
print(removed, d)
```

## Checking for a key

`in` checks the **keys**:

```python
penguin = {"species": "Adelie", "island": "Dream"}
print("island" in penguin)
print("Dream" in penguin)
print("colour" not in penguin)
```

The second line is `False`, because `"Dream"` is a value, not a key.

## keys, values and items

```python
penguin = {"species": "Adelie", "island": "Dream"}
print(list(penguin.keys()))
print(list(penguin.values()))
print(list(penguin.items()))
```

`items()` gives `(key, value)` pairs, which is perfect for looping:

```python
penguin = {"species": "Adelie", "island": "Dream"}
for key, value in penguin.items():
    print(key, "=", value)
```

A plain `for key in penguin:` loops over the keys.

## Order and size

Since Python 3.7, a dictionary remembers the order in which entries were added. `len(d)` gives the number of entries.

## Merging two dictionaries

```python
a = {"x": 1, "y": 2}
b = {"y": 20, "z": 30}
print(a | b)
```

Where both have a key, the right-hand value wins.

## Dictionaries with lists

The value can be anything, including a list:

```python
classes = {"Ada": [90, 85], "Bob": [72]}
classes["Bob"].append(80)
print(classes)
```

## Common mistakes

- Reading a key that might not exist without `get` or an `in` check.
- Thinking `in` looks at values. It looks at keys.
- Expecting a dictionary to have a fixed position for items, like a list.
- Using a list as a key. Keys must be unchangeable, so use a tuple instead.

## Recap

- A dictionary maps keys to values: `{"name": "Ada"}`.
- `d[key]` reads, `d[key] = value` sets, and `d.get(key, default)` is a safe read.
- `in` checks keys. `keys()`, `values()` and `items()` let you loop.
- `update`, `pop` and `|` combine and remove entries.

## Your turn

In the **Practice** tab you are given a dictionary `person`. Read its name, read its age with a safe default of 0, add a city, and count its entries.
