Real data almost never comes as a single flat list. A table is a **list of rows**, and each row is often a **dictionary**. A website response is a dictionary containing lists containing more dictionaries. Being comfortable with nested data is the bridge between what you have learned so far and real data work.

## The shape of a table

Here is a small table as a list of dictionaries. This is exactly how the penguin data you use in this course is stored:

```python
people = [
    {"name": "Ada", "age": 36, "city": "London"},
    {"name": "Bob", "age": 41, "city": "Paris"},
    {"name": "Cy", "age": 29, "city": "London"},
]
print(len(people))
print(people[0])
```

## Reaching inside

Read a value by chaining lookups, one for each level:

```python
people = [{"name": "Ada", "age": 36}, {"name": "Bob", "age": 41}]
print(people[1]["name"])
print(people[0]["age"] + 1)
```

`people[1]` is the second dictionary, and `["name"]` reads a value from it. Read a chain from left to right, one step at a time.

## Looping through the rows

```python
people = [{"name": "Ada", "age": 36}, {"name": "Bob", "age": 41}]
for person in people:
    print(person["name"], person["age"])
```

Each `person` is one dictionary.

## Pulling out one column

To get every value of one field, collect it in a loop:

```python
people = [{"name": "Ada", "age": 36}, {"name": "Bob", "age": 41}]
ages = []
for person in people:
    ages.append(person["age"])
print(ages)
print(sum(ages) / len(ages))
```

There is a shorter form, a *list comprehension*, that you will learn later: `[p["age"] for p in people]`.

## Filtering rows

Keep only the rows that pass a test:

```python
people = [
    {"name": "Ada", "age": 36, "city": "London"},
    {"name": "Bob", "age": 41, "city": "Paris"},
    {"name": "Cy", "age": 29, "city": "London"},
]
londoners = []
for person in people:
    if person["city"] == "London":
        londoners.append(person)
print(len(londoners))
```

## Finding the best row

Use the "biggest so far" pattern, but remember the whole row:

```python
people = [{"name": "Ada", "age": 36}, {"name": "Bob", "age": 41}, {"name": "Cy", "age": 29}]
oldest = people[0]
for person in people:
    if person["age"] > oldest["age"]:
        oldest = person
print(oldest["name"])
```

## Sorting rows

`sorted` takes a `key`, a function that says what to sort by. A `lambda` is a tiny function written in one line (see the functions section):

```python
people = [{"name": "Ada", "age": 36}, {"name": "Bob", "age": 41}, {"name": "Cy", "age": 29}]
by_age = sorted(people, key=lambda person: person["age"])
for person in by_age:
    print(person["name"], person["age"])
```

## Missing values

Real data has gaps. A field may be `None`, or a key may be missing altogether. Guard against both:

```python
row = {"name": "Ada", "age": None}
if row.get("age") is not None:
    print(row["age"] + 1)
else:
    print("age unknown")
```

`row.get("age")` is safe even when the key is missing.

## Building nested data

You can also build a table yourself. Notice that each row must be a new dictionary:

```python
table = []
for name, age in [("Ada", 36), ("Bob", 41)]:
    table.append({"name": name, "age": age})
print(table)
```

## Common mistakes

- Reading a key that some rows do not have. Use `get`.
- Comparing `None` with a number when a value is missing.
- Adding the same dictionary object to a list many times, and then changing it.
- Mixing up the levels: `people["name"]` on a list is a `TypeError`.

## Recap

- A table is a list of dictionaries. Read values with `rows[i]["field"]`.
- Loop over rows, collect a column, filter with `if`, and track the best row.
- `sorted(rows, key=lambda row: row["field"])` sorts rows.
- Guard against missing values with `get` and `is not None`.

## Your turn

In the **Practice** tab you are given a list of dictionaries called `rows`, each with a `name` and a `score`. Find the row with the highest score, the total of all scores, and the sorted list of names.
