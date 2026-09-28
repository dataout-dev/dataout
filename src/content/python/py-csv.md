CSV (comma-separated values) is the most common format for tables of data. It looks simple, but there are traps: values that contain commas, quotes or new lines, different separators, and header rows. The standard `csv` module handles all of them, so you should not split lines by hand.

You will learn:

- why `line.split(",")` is not enough
- `csv.reader` and `csv.DictReader`
- `csv.writer` and `csv.DictWriter`
- quoting, delimiters and dialects
- converting the types of the values
- streaming a large file
- the `newline=""` rule

## Why not just split?

Look at this small file. The second row has a comma **inside** a quoted value:

```python
text = 'name,city\n"Smith, John",Paris\nAda,London\n'
for line in text.splitlines():
    print(line.split(","))
```

The first row is split into three pieces, which is wrong. The `csv` module understands quotes:

```python
import csv
import io

for row in csv.reader(io.StringIO(text)):
    print(row)
```

`csv.reader` takes any iterable of lines, so we can feed it an in-memory text with `io.StringIO`. A real file works the same way. Every value it returns is a **string**, and rows are lists.

## DictReader

`csv.DictReader` uses the **first row as the header**, and gives every row as a dictionary. That is much easier to read than remembering column numbers:

```python
data = "name,total\nAda,10.5\nAlan,7\nGrace,\n"
reader = csv.DictReader(io.StringIO(data))
print(reader.fieldnames)
for row in reader:
    print(row)
```

Notice the empty value for `Grace`, which arrives as an empty string. All the values are text, so you convert them yourself:

```python
def csv_total(text):
    total = 0.0
    for row in csv.DictReader(io.StringIO(text)):
        value = row["total"].strip()
        if value:
            total += float(value)
    return total

print(csv_total(data))
```

## Writing

`csv.writer` writes rows. It adds the quotes when they are needed:

```python
buffer = io.StringIO()
writer = csv.writer(buffer)
writer.writerow(["name", "note"])
writer.writerow(["Ada", "likes maths, and music"])
writer.writerow(["Alan", 'said "hello"'])
print(buffer.getvalue())
```

`DictWriter` writes dictionaries, and you name the columns:

```python
buffer = io.StringIO()
writer = csv.DictWriter(buffer, fieldnames=["name", "total"])
writer.writeheader()
writer.writerows([{"name": "Ada", "total": 10.5}, {"name": "Alan", "total": 7}])
print(buffer.getvalue())
```

Numbers are converted to text as they are written. `None` becomes an empty value.

## Real files: the newline rule

When you write a CSV **file**, open it with `newline=""`. The `csv` module manages the line endings itself, and without this you can get blank lines between rows on Windows:

```python
import tempfile
from pathlib import Path

folder = Path(tempfile.mkdtemp())
path = folder / "sales.csv"

with open(path, "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["item", "qty"])
    writer.writerows([["pen", 3], ["ink", 12]])

with open(path, newline="", encoding="utf-8") as file:
    for row in csv.DictReader(file):
        print(row["item"], int(row["qty"]))
```

Use `newline=""` for reading as well.

## Other delimiters and quoting

Some files use tabs, semicolons or pipes. Pass the `delimiter`. You can also control how values are quoted:

```python
tabs = "a\tb\n1\t2\n"
print(list(csv.reader(io.StringIO(tabs), delimiter="\t")))

buffer = io.StringIO()
csv.writer(buffer, quoting=csv.QUOTE_ALL).writerow(["a", 1, "b c"])
print(buffer.getvalue().strip())

buffer = io.StringIO()
csv.writer(buffer, delimiter=";", quotechar="'").writerow(["x;y", "z"])
print(buffer.getvalue().strip())
```

A **dialect** is a named bundle of these settings. `csv.excel` (the default) and `csv.excel_tab` are built in. `csv.Sniffer` can even guess the delimiter from a sample.

## Converting types

CSV has no types. Convert each column when you read it, and decide what an empty value means:

```python
def read_orders(text):
    orders = []
    for row in csv.DictReader(io.StringIO(text)):
        orders.append({
            "id": int(row["id"]),
            "total": float(row["total"]) if row["total"] else None,
        })
    return orders

print(read_orders("id,total\n1,9.99\n2,\n"))
```

## Streaming large files

`csv.reader` and `DictReader` read **one row at a time**, so they can process a file that is far bigger than your memory. Do not build a list of all the rows unless you need one:

```python
def total_for(text, column):
    return sum(float(row[column]) for row in csv.DictReader(io.StringIO(text)) if row[column])

print(total_for("a,b\n1,2\n3,4\n5,\n", "b"))
```

## Header problems

Real files often have surprises: extra spaces in the header, a blank first line, a byte order mark (BOM) at the start of a file saved by some programs (read those with `encoding="utf-8-sig"`), or duplicate column names. Clean the header first:

```python
raw = "﻿Name , Total\nAda,5\n"
reader = csv.reader(io.StringIO(raw))
header = [h.strip().lstrip("﻿").lower() for h in next(reader)]
print(header)
```

## Common mistakes

- Splitting CSV lines with `split(",")`.
- Forgetting `newline=""` on real files.
- Forgetting that every value is text, and adding numbers as strings.
- Reading a whole huge file into a list.
- Not handling empty values.

## Recap

- Use the `csv` module: `reader`, `DictReader`, `writer` and `DictWriter`.
- All values are strings. Convert the ones you need, and decide what "empty" means.
- Open real files with `newline=""` and an `encoding`.
- Readers work one row at a time, so big files are fine.

## Your turn

In the **Practice** tab you write `csv_total(text)`. Then three challenges use the Chinook store.
