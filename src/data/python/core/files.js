import { py, chi } from './common.js'

const TEMP_FOLDER = py`import tempfile
from pathlib import Path
folder = Path(tempfile.mkdtemp())
`

export const filesAndFormats = {
  id: 'files-and-data-formats',
  title: 'Files and data formats',
  intro: 'Getting data in and out of a program.',
  lessons: [
    {
      id: 'py-paths',
      title: 'Paths with pathlib and os',
      blurb: 'Path objects, name parts, searching folders and building paths.',
      kind: 'code',
      practice: {
        prompt: 'Write `suffixed(name, suffix)`. It inserts `suffix` **before the extension** of a file name, and returns the new name as text.\n\n`suffixed("a.csv", "_clean")` is `"a_clean.csv"`. Only the **last** extension counts (`"archive.tar.gz"` becomes `"archive.tar_clean.gz"`). A name with no extension gets the suffix at the end. A folder in front of the name (`"data/a.csv"`) is kept, always written with `/`.',
        starter: 'from pathlib import PurePosixPath\n\ndef suffixed(name, suffix):\n    ...\n',
        solution: py`from pathlib import PurePosixPath

def suffixed(name, suffix):
    path = PurePosixPath(name)
    return str(path.with_name(path.stem + suffix + path.suffix))`,
        samples: ['suffixed("a.csv", "_clean")', 'suffixed("README", "_old")'],
        cases: [
          ['A simple name', 'suffixed("a.csv", "_clean")'],
          ['Several dots', 'suffixed("report.final.csv", "_v2")'],
          ['No extension', 'suffixed("README", "_old")'],
          ['A hidden file', 'suffixed(".gitignore", "_old")'],
          ['A folder in front', 'suffixed("data/a.csv", "_clean")'],
          ['A double extension', 'suffixed("archive.tar.gz", "_copy")'],
          ['An empty suffix', 'suffixed("a.csv", "")'],
          ['A deeper folder', 'suffixed("x/y/z.txt", "-1")'],
        ],
        traps: [
          py`def suffixed(name, suffix):
    return name + suffix`,
          py`def suffixed(name, suffix):
    return name.replace(".", suffix + ".")`,
          py`def suffixed(name, suffix):
    stem, ext = name.rsplit(".", 1)
    return stem + suffix + "." + ext`,
          py`def suffixed(name, suffix):
    stem = name.split(".")[0]
    return stem + suffix + "." + name.split(".", 1)[-1]`,
        ],
      },
      real: [
        chi({
          title: 'Count the files per extension',
          use: ['tracks'],
          hidden: 'from pathlib import PurePosixPath\nfiles = [f"music/{t[\'AlbumId\']}/{t[\'TrackId\']}.{\'mp3\' if t[\'MediaTypeId\'] == 1 else \'m4a\'}" for t in tracks]\n',
          given: '# files is a list of paths such as "music/12/3.mp3". PurePosixPath is already imported.',
          brief: 'Use the `suffix` of a `PurePosixPath` to count the files per extension. Store in `answer` a dictionary that maps each extension (with its dot, for example `".mp3"`) to the number of files.',
          reference: py`answer = {}
for f in files:
    ext = PurePosixPath(f).suffix
    answer[ext] = answer.get(ext, 0) + 1`,
          walkthrough: 'A `Path` knows its own extension, so no string cutting is needed. `suffix` includes the dot, and dictionary counting does the rest.',
          traps: [py`answer = {}
for f in files:
    ext = PurePosixPath(f).stem
    answer[ext] = answer.get(ext, 0) + 1`, py`answer = {}
for f in files:
    ext = PurePosixPath(f).suffix.lstrip(".")
    answer[ext] = answer.get(ext, 0) + 1`],
        }),
        chi({
          title: 'How many folders?',
          use: ['tracks'],
          hidden: 'from pathlib import PurePosixPath\nfiles = [f"music/{t[\'AlbumId\']}/{t[\'TrackId\']}.mp3" for t in tracks]\n',
          given: '# files is a list of paths such as "music/12/3.mp3". PurePosixPath is already imported.',
          brief: 'Every file is inside an album folder (its `parent`). Store in `answer` a tuple: the **number of different folders**, and the **name of the folder** (`parent.name`) that holds the **most files**. If two folders tie, choose the one whose name is smaller as text.',
          reference: py`counts = {}
for f in files:
    parent = PurePosixPath(f).parent
    counts[parent] = counts.get(parent, 0) + 1
best = min(counts, key=lambda p: (-counts[p], p.name))
answer = (len(counts), best.name)`,
          walkthrough: 'A `parent` path can be used as a dictionary key, so counting works directly. The key function sorts by the count (negated), and then by the folder name.',
          traps: [py`counts = {}
for f in files:
    parent = PurePosixPath(f).parent
    counts[parent] = counts.get(parent, 0) + 1
best = min(counts, key=lambda p: counts[p])
answer = (len(counts), best.name)`, py`counts = {}
for f in files:
    parent = PurePosixPath(f).parent
    counts[parent] = counts.get(parent, 0) + 1
best = min(counts, key=lambda p: (-counts[p], p.name))
answer = (len(counts), str(best))`],
        }),
        chi({
          title: 'Rename with a new stem',
          use: ['tracks'],
          hidden: 'from pathlib import PurePosixPath\nfiles = [f"music/{t[\'AlbumId\']}/{t[\'TrackId\']}.mp3" for t in tracks[:5]]\n',
          given: '# files is a list of five paths such as "music/1/1.mp3". PurePosixPath is already imported.',
          brief: 'Build a new path for each file, with `_old` added to the **stem** and the extension kept: `music/1/1.mp3` becomes `music/1/1_old.mp3`. Store in `answer` the list of the five new paths as **text**.',
          reference: py`answer = []
for f in files:
    p = PurePosixPath(f)
    answer.append(str(p.with_stem(p.stem + "_old")))`,
          walkthrough: '`with_stem` builds a new path with a different stem, and does not touch any file. Converting with `str` gives the text.',
          traps: [py`answer = [str(PurePosixPath(f).with_suffix(".old")) for f in files]`, py`answer = [f + "_old" for f in files]`],
        }),
      ],
    },
    {
      id: 'py-text-files',
      title: 'Reading and writing text files and context managers',
      blurb: 'open, with, reading line by line, appending and StringIO.',
      kind: 'code',
      practice: {
        prompt: 'Write `wc(text)`, like the Unix command. It returns a tuple `(lines, words, characters)` for the text:\n\n- **lines**: the number of lines (a last line without a new line at the end still counts)\n- **words**: the number of words (separated by any white space)\n- **characters**: the number of characters in the text, including new lines',
        starter: 'def wc(text):\n    ...\n',
        solution: py`def wc(text):
    return len(text.splitlines()), len(text.split()), len(text)`,
        samples: ['wc("one two\\nthree\\n")'],
        cases: [
          ['Two lines', 'wc("one two\\nthree\\n")'],
          ['No new line at the end', 'wc("one two\\nthree")'],
          ['An empty text', 'wc("")'],
          ['A blank line in the middle', 'wc("a\\n\\nb")'],
          ['Windows line endings', 'wc("a b\\r\\nc\\r\\n")'],
          ['Extra spaces', 'wc("  a   b  ")'],
          ['Accents', 'wc("café crème\\n")'],
          ['Only new lines', 'wc("\\n\\n")'],
        ],
        traps: [
          py`def wc(text):
    return text.count("\n"), len(text.split()), len(text)`,
          py`def wc(text):
    return len(text.split("\n")), len(text.split()), len(text)`,
          py`def wc(text):
    return len(text.splitlines()), len(text.split(" ")), len(text)`,
          py`def wc(text):
    return len(text.splitlines()), len(text.split()), len(text.strip())`,
        ],
      },
      real: [
        chi({
          title: 'Write a file and read it back',
          use: ['tracks'],
          hidden: TEMP_FOLDER,
          starter: 'path = folder / "names.txt"\n# write the names of the first 100 tracks, one per line, then read the file back\nanswer = None\n',
          given: '# folder is an empty temporary folder (a Path object). tracks is a list of dictionaries with a "Name" key.',
          brief: 'Write the names of the **first 100 tracks** into `names.txt`, **one per line** (open the file with `with` and `encoding="utf-8"`). Read the file back. Store in `answer` a tuple: the **number of lines** in the file, and the **longest line**. If two lines tie, the first one wins.',
          reference: py`path = folder / "names.txt"
with open(path, "w", encoding="utf-8") as file:
    for t in tracks[:100]:
        file.write(t["Name"] + "\n")

with open(path, encoding="utf-8") as file:
    lines = [line.rstrip("\n") for line in file]
answer = (len(lines), max(lines, key=len))`,
          walkthrough: '`write` does not add a new line, so we add it ourselves. A file is iterable, so the loop reads one line at a time, and `rstrip("\\n")` removes the new line from each.',
          traps: [py`path = folder / "names.txt"
with open(path, "w", encoding="utf-8") as file:
    for t in tracks[:100]:
        file.write(t["Name"])

with open(path, encoding="utf-8") as file:
    lines = [line.rstrip("\n") for line in file]
answer = (len(lines), max(lines, key=len))`, py`path = folder / "names.txt"
with open(path, "w", encoding="utf-8") as file:
    for t in tracks[:100]:
        file.write(t["Name"] + "\n")

with open(path, encoding="utf-8") as file:
    lines = [line for line in file]
answer = (len(lines), max(lines, key=len))`],
        }),
        chi({
          title: 'Stream the lines of a file',
          use: ['tracks'],
          hidden: 'import io\nfile = io.StringIO("\\n".join(t["Name"] for t in tracks))\n',
          given: '# file behaves like an open text file with one track name per line. Loop over it, do not call read().',
          brief: 'Loop over `file` line by line. Count the lines whose text (**without** the new line at the end) is **longer than 30 characters**. Store the count in `answer`.',
          reference: py`answer = 0
for line in file:
    if len(line.rstrip("\n")) > 30:
        answer += 1`,
          walkthrough: 'Every line keeps its `"\\n"` (except perhaps the last), so it has to be removed before measuring. A loop over the file reads one line at a time.',
          traps: [py`answer = 0
for line in file:
    if len(line) > 30:
        answer += 1`, py`answer = 0
for line in file:
    if len(line.rstrip("\n")) >= 30:
        answer += 1`],
        }),
        chi({
          title: 'Write, then append',
          hidden: TEMP_FOLDER,
          starter: 'path = folder / "log.txt"\n# write two lines, then append two more, then read all lines\nanswer = None\n',
          given: '# folder is an empty temporary folder (a Path object).',
          brief: 'Write the lines `"start"` and `"middle"` to `log.txt` with mode `"w"`. Then **append** `"end"` and `"done"` with mode `"a"`, so nothing is lost. Read the file back and store the **list of its lines** in `answer`.',
          reference: py`path = folder / "log.txt"
with open(path, "w", encoding="utf-8") as file:
    file.write("start\nmiddle\n")
with open(path, "a", encoding="utf-8") as file:
    file.write("end\ndone\n")
answer = path.read_text(encoding="utf-8").splitlines()`,
          walkthrough: 'Mode `"w"` erases the file, and mode `"a"` adds to the end. Opening the file with `"w"` a second time would have lost the first two lines.',
          traps: [py`path = folder / "log.txt"
with open(path, "w", encoding="utf-8") as file:
    file.write("start\nmiddle\n")
with open(path, "w", encoding="utf-8") as file:
    file.write("end\ndone\n")
answer = path.read_text(encoding="utf-8").splitlines()`, py`path = folder / "log.txt"
with open(path, "w", encoding="utf-8") as file:
    file.write("start\nmiddle\n")
with open(path, "a", encoding="utf-8") as file:
    file.write("end\ndone\n")
answer = path.read_text(encoding="utf-8")`],
        }),
      ],
    },
    {
      id: 'py-csv',
      title: 'CSV in depth',
      blurb: 'reader, DictReader, writers, quoting and streaming.',
      kind: 'code',
      practice: {
        prompt: 'Write `csv_total(text)`. The text is a CSV table with a header row that has a column called `total` (it may have other columns, in any order). Return the **sum of the `total` column** as a float.\n\nBlank totals are skipped. Values may be surrounded by spaces, and a value in quotes may contain commas. A table with only a header gives `0.0`.',
        starter: 'import csv\nimport io\n\ndef csv_total(text):\n    ...\n',
        solution: py`import csv
import io

def csv_total(text):
    total = 0.0
    for row in csv.DictReader(io.StringIO(text)):
        value = row["total"].strip()
        if value:
            total += float(value)
    return total`,
        samples: ['csv_total("name,total\\nAda,10.5\\nAlan,7\\n")'],
        cases: [
          ['A simple table', 'csv_total("name,total\\nAda,10.5\\nAlan,7\\n")'],
          ['A blank total', 'csv_total("name,total\\nAda,10\\nGrace,\\n")'],
          ['A quoted comma', 'csv_total(\'name,total\\n"Smith, John",10\\nAda,5\\n\')'],
          ['The columns in another order', 'csv_total("total,name\\n3,a\\n4,b\\n")'],
          ['Only a header', 'csv_total("name,total\\n")'],
          ['Spaces around values', 'csv_total("name,total\\nAda, 5 \\n")'],
          ['Negative numbers', 'csv_total("name,total\\na,-2.5\\nb,10\\n")'],
          ['Extra columns', 'csv_total("id,name,total,city\\n1,a,2,x\\n2,b,3,y\\n")'],
        ],
        traps: [
          py`import csv
import io

def csv_total(text):
    total = 0.0
    for line in text.splitlines()[1:]:
        value = line.split(",")[1].strip()
        if value:
            total += float(value)
    return total`,
          py`import csv
import io

def csv_total(text):
    total = 0.0
    for row in csv.DictReader(io.StringIO(text)):
        total += float(row["total"])
    return total`,
          py`import csv
import io

def csv_total(text):
    total = 0
    for row in csv.DictReader(io.StringIO(text)):
        value = row["total"].strip()
        if value:
            total += int(float(value))
    return total`,
          py`import csv
import io

def csv_total(text):
    rows = list(csv.reader(io.StringIO(text)))
    return sum(float(row[1]) for row in rows[1:] if row[1].strip())`,
        ],
      },
      real: [
        chi({
          title: 'Revenue per country from CSV text',
          use: ['invoices'],
          hidden: 'import csv\nimport io\nbuffer = io.StringIO()\nwriter = csv.DictWriter(buffer, fieldnames=["InvoiceId", "BillingCountry", "Total"], extrasaction="ignore")\nwriter.writeheader()\nwriter.writerows(invoices)\ntext = buffer.getvalue()\n',
          given: '# text is CSV text with the columns InvoiceId, BillingCountry and Total. csv and io are already imported.',
          brief: 'Read `text` with `csv.DictReader`. Add up `Total` (as numbers) for each `BillingCountry`. Store in `answer` the **three countries with the highest revenue** as a list of `(country, revenue)` pairs, highest first, with the revenue **rounded to 2 decimals**.',
          reference: py`revenue = {}
for row in csv.DictReader(io.StringIO(text)):
    country = row["BillingCountry"]
    revenue[country] = revenue.get(country, 0) + float(row["Total"])
best = sorted(revenue.items(), key=lambda item: -item[1])[:3]
answer = [(country, round(total, 2)) for country, total in best]`,
          walkthrough: 'Every value from a CSV file is text, so `Total` needs `float`. Then it is ordinary dictionary summing, sorting and rounding.',
          traps: [py`revenue = {}
for row in csv.DictReader(io.StringIO(text)):
    country = row["BillingCountry"]
    revenue[country] = revenue.get(country, 0) + 1
best = sorted(revenue.items(), key=lambda item: -item[1])[:3]
answer = [(country, round(total, 2)) for country, total in best]`, py`revenue = {}
for row in csv.DictReader(io.StringIO(text)):
    country = row["BillingCountry"]
    revenue[country] = revenue.get(country, 0) + float(row["Total"])
best = sorted(revenue.items(), key=lambda item: item[1])[:3]
answer = [(country, round(total, 2)) for country, total in best]`],
        }),
        chi({
          title: 'Write only the big invoices',
          use: ['invoices'],
          hidden: 'import csv\nimport io\n',
          starter: 'buffer = io.StringIO()\n# write a header and the invoices with a Total over 10\nlines = buffer.getvalue().splitlines()\nanswer = (len(lines), lines[0] if lines else None)\n',
          given: '# csv and io are already imported. invoices is a list of dictionaries.',
          brief: 'Use `csv.DictWriter` with the columns `InvoiceId`, `BillingCountry` and `Total` (in this order) to write into `buffer` a **header** and **only the invoices whose `Total` is above 10**. The last line reports the number of lines and the first one.',
          reference: py`buffer = io.StringIO()
writer = csv.DictWriter(buffer, fieldnames=["InvoiceId", "BillingCountry", "Total"], extrasaction="ignore")
writer.writeheader()
writer.writerows(inv for inv in invoices if inv["Total"] > 10)
lines = buffer.getvalue().splitlines()
answer = (len(lines), lines[0] if lines else None)`,
          walkthrough: '`writeheader` writes the column names, and `writerows` accepts a generator of dictionaries. `extrasaction="ignore"` skips the keys that are not columns.',
          traps: [py`buffer = io.StringIO()
writer = csv.DictWriter(buffer, fieldnames=["InvoiceId", "BillingCountry", "Total"], extrasaction="ignore")
writer.writerows(inv for inv in invoices if inv["Total"] > 10)
lines = buffer.getvalue().splitlines()
answer = (len(lines), lines[0] if lines else None)`, py`buffer = io.StringIO()
writer = csv.DictWriter(buffer, fieldnames=["InvoiceId", "BillingCountry", "Total"], extrasaction="ignore")
writer.writeheader()
writer.writerows(inv for inv in invoices if inv["Total"] >= 0)
lines = buffer.getvalue().splitlines()
answer = (len(lines), lines[0] if lines else None)`],
        }),
        chi({
          title: 'Customers without a company',
          use: ['customers'],
          hidden: 'import csv\nimport io\nbuffer = io.StringIO()\nwriter = csv.DictWriter(buffer, fieldnames=["CustomerId", "FirstName", "Company"], extrasaction="ignore")\nwriter.writeheader()\nwriter.writerows(customers)\ntext = buffer.getvalue()\n',
          given: '# text is CSV text. A missing Company was written as an empty value. csv and io are already imported.',
          brief: 'Read `text` with `csv.DictReader` and count the customers whose `Company` is an **empty text**. Store the count in `answer`.',
          reference: py`answer = sum(1 for row in csv.DictReader(io.StringIO(text)) if row["Company"] == "")`,
          walkthrough: 'CSV has no `None`. The writer turned it into an empty value, and the reader gives it back as an empty string.',
          traps: [py`answer = sum(1 for row in csv.DictReader(io.StringIO(text)) if row["Company"] is None)`, py`answer = sum(1 for row in csv.DictReader(io.StringIO(text)) if row["Company"] != "")`],
        }),
      ],
    },
    {
      id: 'py-json',
      title: 'JSON in depth',
      blurb: 'loads, dumps, custom encoders, JSON Lines and nested data.',
      kind: 'code',
      practice: {
        prompt: 'Write `flatten(d)`. It takes a dictionary that may contain other dictionaries, and returns a **flat dictionary** whose keys are the paths joined with a dot.\n\n`{"a": {"b": 1}}` becomes `{"a.b": 1}`. Values that are **not** dictionaries (numbers, text, lists) are kept as they are. A nested empty dictionary gives no keys. Keys are converted to text.',
        starter: 'def flatten(d):\n    ...\n',
        solution: py`def flatten(d, prefix=""):
    result = {}
    for key, value in d.items():
        name = f"{prefix}.{key}" if prefix else str(key)
        if isinstance(value, dict):
            result.update(flatten(value, name))
        else:
            result[name] = value
    return result`,
        samples: ['flatten({"a": {"b": 1}, "c": 2})'],
        cases: [
          ['One level of nesting', 'flatten({"a": {"b": 1}})'],
          ['Deeper nesting', 'flatten({"a": {"b": 1, "c": {"d": 2}}, "e": 3})'],
          ['Already flat', 'flatten({"x": 1, "y": "two"})'],
          ['An empty dictionary', 'flatten({})'],
          ['A nested empty dictionary', 'flatten({"a": {}, "b": 1})'],
          ['Lists are kept whole', 'flatten({"a": [1, {"b": 2}]})'],
          ['Number keys become text', 'flatten({1: {2: "x"}})'],
          ['Three levels', 'flatten({"a": {"b": {"c": {"d": None}}}})'],
          ['A number key at the top', 'flatten({1: "a"})'],
        ],
        traps: [
          py`def flatten(d):
    result = {}
    for key, value in d.items():
        if isinstance(value, dict):
            for inner, x in value.items():
                result[f"{key}.{inner}"] = x
        else:
            result[key] = value
    return result`,
          py`def flatten(d, prefix=""):
    result = {}
    for key, value in d.items():
        name = f"{prefix}_{key}" if prefix else str(key)
        if isinstance(value, dict):
            result.update(flatten(value, name))
        else:
            result[name] = value
    return result`,
          py`def flatten(d, prefix=""):
    result = {}
    for key, value in d.items():
        name = f"{prefix}.{key}" if prefix else str(key)
        if isinstance(value, dict):
            result.update(flatten(value, name))
        elif isinstance(value, list):
            for i, item in enumerate(value):
                result[f"{name}.{i}"] = item
        else:
            result[name] = value
    return result`,
          py`def flatten(d, prefix=""):
    result = {}
    for key, value in d.items():
        name = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            result.update(flatten(value, name))
        else:
            result[name] = value
    return result`,
        ],
      },
      real: [
        chi({
          title: 'Invoice totals as JSON',
          use: ['invoices'],
          hidden: 'import json\n',
          given: '# invoices is a list of dictionaries with "CustomerId" and "Total". json is already imported.',
          brief: 'Add up the invoice totals of the customers **8, 9 and 10** (`CustomerId`), each **rounded to 2 decimals**. Store in `answer` the result of `json.dumps` for the dictionary that maps the customer id, **as text**, to the total, with **`sort_keys=True`** and the **compact** separators `(",", ":")`.',
          reference: py`totals = {}
for inv in invoices:
    if inv["CustomerId"] in (8, 9, 10):
        key = str(inv["CustomerId"])
        totals[key] = totals.get(key, 0) + inv["Total"]
totals = {key: round(value, 2) for key, value in totals.items()}
answer = json.dumps(totals, sort_keys=True, separators=(",", ":"))`,
          walkthrough: '`sort_keys` sorts the keys as **text**, so `"10"` comes before `"8"`. The separators remove the spaces after the colon and the comma.',
          traps: [py`totals = {}
for inv in invoices:
    if inv["CustomerId"] in (8, 9, 10):
        key = str(inv["CustomerId"])
        totals[key] = totals.get(key, 0) + inv["Total"]
totals = {key: round(value, 2) for key, value in totals.items()}
answer = json.dumps(totals, separators=(",", ":"))`, py`totals = {}
for inv in invoices:
    if inv["CustomerId"] in (8, 9, 10):
        key = str(inv["CustomerId"])
        totals[key] = totals.get(key, 0) + inv["Total"]
totals = {key: round(value, 2) for key, value in totals.items()}
answer = json.dumps(totals, sort_keys=True)`],
        }),
        chi({
          title: 'Dates in JSON',
          use: ['invoices'],
          hidden: 'import json\nfrom datetime import datetime\nrecords = [{"invoice": i["InvoiceId"], "date": datetime.strptime(i["InvoiceDate"], "%Y-%m-%d %H:%M:%S")} for i in invoices[:3]]\n',
          given: '# records is a list of dictionaries whose "date" is a datetime object, which JSON cannot store.',
          brief: 'Convert `records` to JSON text with `json.dumps`. Give it a **`default` function** that turns a `datetime` into its **date only** in ISO form (`YYYY-MM-DD`, without the time). Store the JSON text in `answer`.',
          reference: py`answer = json.dumps(records, default=lambda value: value.date().isoformat())`,
          walkthrough: 'The `default` function is called for every value that JSON does not understand. Returning a text makes it valid. `date().isoformat()` gives `2009-01-01`.',
          traps: [py`answer = json.dumps(records, default=lambda value: value.isoformat())`, py`answer = json.dumps(records, default=str)`],
        }),
        chi({
          title: 'Parse and total an order list',
          use: ['invoices'],
          hidden: 'import json\norders_json = json.dumps([{"id": i["InvoiceId"], "total": i["Total"]} for i in invoices[:20]])\n',
          given: '# orders_json is JSON text: a list of objects with "id" and "total". json is already imported.',
          brief: 'Parse `orders_json` with `json.loads`. Store in `answer` a tuple: the **number of orders** and the **sum of their totals**, rounded to 2 decimals.',
          reference: py`orders = json.loads(orders_json)
answer = (len(orders), round(sum(o["total"] for o in orders), 2))`,
          walkthrough: '`json.loads` turns the text into a list of dictionaries. Numbers stay numbers, so they can be added directly.',
          traps: [py`orders = json.loads(orders_json)
answer = (len(orders), round(sum(o["id"] for o in orders), 2))`, py`orders = json.loads(orders_json)
answer = (len(orders_json), round(sum(o["total"] for o in orders), 2))`],
        }),
      ],
    },
    {
      id: 'py-other-formats',
      title: 'XML, YAML, TOML and INI: other text formats',
      blurb: 'ElementTree, configparser, tomllib and safe YAML loading.',
      kind: 'learn',
      check: [
        {
          q: 'Which module in the standard library reads TOML files?',
          options: ['`toml`', '`tomllib`', '`configparser`', '`yaml`'],
          answer: 1,
          why: '`tomllib` (Python 3.11 and later) reads TOML. It cannot write it. `configparser` is for INI files.',
        },
        {
          q: 'A `configparser` file has `port = 8080`. What is `config["server"]["port"]`?',
          options: ['The integer `8080`', 'The text `"8080"`', '`None`', 'A float'],
          answer: 1,
          why: 'INI values are always text. Use `config.getint("server", "port")` to get an integer.',
        },
        {
          q: 'You read a YAML file that somebody else sent you. Which call is the safe one?',
          options: ['`yaml.load(text)`', '`yaml.safe_load(text)`', '`eval(text)`', '`pickle.loads(text)`'],
          answer: 1,
          why: 'Full YAML loading can build arbitrary Python objects and even run code. `safe_load` only builds plain data.',
        },
        {
          q: 'Which format is the best default for sending nested data between two programs?',
          options: ['CSV', 'JSON', 'INI', 'A pickle file'],
          answer: 1,
          why: 'JSON is simple, well supported everywhere, and safe to read. CSV is flat, INI has no nesting, and a pickle can run code.',
        },
        {
          q: 'What does `root.find("book")` return in `xml.etree.ElementTree`?',
          options: ['A list of all `book` children', 'The first `book` child element, or `None`', 'The text of the first book', 'A dictionary'],
          answer: 1,
          why: '`find` returns the first matching element (or `None`). `findall` returns all of them, and `findtext` returns the text.',
        },
      ],
    },
    {
      id: 'py-binary-data',
      title: 'Binary data: bytes, struct, base64, hashlib and pickle',
      blurb: 'Bytes, packing numbers, encoding, fingerprints and pickle safety.',
      kind: 'learn',
      check: [
        {
          q: 'What does `b"Hi!"[0]` give?',
          options: ['`b"H"`', '`72`', '`"H"`', 'An error'],
          answer: 1,
          why: 'Indexing a `bytes` object gives an integer from 0 to 255. Slicing gives `bytes`.',
        },
        {
          q: 'What is base64?',
          options: [
            'A strong encryption method',
            'A way to write any bytes using only text characters, which anyone can decode',
            'A compression format',
            'A kind of hash',
          ],
          answer: 1,
          why: 'Base64 is an encoding, not encryption. It makes binary data safe to put in text, and makes it about a third bigger.',
        },
        {
          q: 'Why must you never unpickle data from an untrusted source?',
          options: [
            'It is very slow',
            'A crafted pickle can run arbitrary code as soon as it is loaded',
            'Pickles are always corrupt',
            'It uses too much memory',
          ],
          answer: 1,
          why: 'Unpickling rebuilds objects, and that can be made to call any function. Use JSON for data that others will read.',
        },
        {
          q: 'What does `struct.pack(">H", 1)` return?',
          options: ['`b"\\x01\\x00"`', '`b"\\x00\\x01"`', '`b"1"`', '`1`'],
          answer: 1,
          why: 'The `>` means big-endian (most significant byte first) and `H` is a two-byte unsigned number, so 1 is `00 01`.',
        },
        {
          q: 'Which is the right way to store user passwords?',
          options: [
            'With a plain `md5` hash',
            'With a plain `sha256` hash',
            'With a slow, salted password hashing function made for it, such as `hashlib.scrypt` or a dedicated library',
            'Encoded with base64',
          ],
          answer: 2,
          why: 'Plain fast hashes can be guessed at enormous speed. Password hashing is deliberately slow and uses a random salt.',
        },
      ],
    },
    {
      id: 'py-sqlite',
      title: 'sqlite3 from Python',
      blurb: 'Connections, parameters, transactions, rows as dictionaries and indexes.',
      kind: 'code',
      practice: {
        prompt: 'Write `db_sum(rows)`. The rows are `(name, amount)` pairs. Create an **in-memory** SQLite database with a table `item(name TEXT, amount REAL)`, insert all the rows with **placeholders** (`?`), and return the **sum of `amount`** calculated by **SQL**.\n\nFor no rows, return `0`. Names may contain quote marks (`"O\'Brien"`).',
        starter: 'import sqlite3\n\ndef db_sum(rows):\n    ...\n',
        solution: py`import sqlite3

def db_sum(rows):
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE item (name TEXT, amount REAL)")
    con.executemany("INSERT INTO item (name, amount) VALUES (?, ?)", rows)
    total = con.execute("SELECT SUM(amount) FROM item").fetchone()[0]
    con.close()
    return total if total is not None else 0`,
        samples: ['db_sum([("a", 1), ("b", 2.5)])'],
        cases: [
          ['Two rows', 'db_sum([("a", 1), ("b", 2.5)])'],
          ['No rows', 'db_sum([])'],
          ['One row', 'db_sum([("x", 7)])'],
          ['A quote in a name', 'db_sum([("O\'Brien", 5), ("Ann", 1.5)])'],
          ['Negative amounts', 'db_sum([("a", -3), ("b", 10)])'],
          ['A dangerous name', 'db_sum([("x\'); DROP TABLE item; --", 2)])'],
          ['Many rows', 'db_sum([(str(i), i) for i in range(100)])'],
        ],
        traps: [
          py`import sqlite3

def db_sum(rows):
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE item (name TEXT, amount REAL)")
    for name, amount in rows:
        con.execute(f"INSERT INTO item (name, amount) VALUES ('{name}', {amount})")
    total = con.execute("SELECT SUM(amount) FROM item").fetchone()[0]
    return total if total is not None else 0`,
          py`import sqlite3

def db_sum(rows):
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE item (name TEXT, amount REAL)")
    con.executemany("INSERT INTO item (name, amount) VALUES (?, ?)", rows)
    return con.execute("SELECT SUM(amount) FROM item").fetchone()[0]`,
          py`import sqlite3

def db_sum(rows):
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE item (name TEXT, amount REAL)")
    con.executemany("INSERT INTO item (name, amount) VALUES (?, ?)", rows)
    return con.execute("SELECT COUNT(amount) FROM item").fetchone()[0]`,
          py`import sqlite3

def db_sum(rows):
    con = sqlite3.connect(":memory:")
    con.execute("CREATE TABLE item (name TEXT, amount REAL)")
    con.executemany("INSERT INTO item (name, amount) VALUES (?, ?)", rows[:-1])
    total = con.execute("SELECT SUM(amount) FROM item").fetchone()[0]
    return total if total is not None else 0`,
        ],
      },
      real: [
        chi({
          title: 'Load Chinook into SQLite',
          use: ['tracks', 'genres'],
          hidden: 'import sqlite3\n',
          starter: 'con = sqlite3.connect(":memory:")\n# create the tables track(id, name, genre_id) and genre(id, name), insert the rows,\n# then run one query with a JOIN\nanswer = None\n',
          given: '# tracks and genres are lists of dictionaries. sqlite3 is already imported.',
          brief: 'Create the two tables in an **in-memory** database, and fill them with `executemany` and `?` placeholders. Then run **one query** that joins them and finds the **three genres with the most tracks**. Store in `answer` a list of `(genre name, count)` tuples, the largest count first.',
          reference: py`con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE track (id INTEGER, name TEXT, genre_id INTEGER)")
con.execute("CREATE TABLE genre (id INTEGER, name TEXT)")
con.executemany("INSERT INTO track VALUES (?, ?, ?)", [(t["TrackId"], t["Name"], t["GenreId"]) for t in tracks])
con.executemany("INSERT INTO genre VALUES (?, ?)", [(g["GenreId"], g["Name"]) for g in genres])
answer = con.execute(
    "SELECT genre.name, COUNT(*) AS n FROM track JOIN genre ON genre.id = track.genre_id GROUP BY genre.id ORDER BY n DESC LIMIT 3"
).fetchall()`,
          walkthrough: 'The lists are turned into rows with comprehensions and inserted with `executemany`. The join, grouping and ordering are ordinary SQL, and `fetchall` returns the rows as a list of tuples.',
          traps: [py`con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE track (id INTEGER, name TEXT, genre_id INTEGER)")
con.execute("CREATE TABLE genre (id INTEGER, name TEXT)")
con.executemany("INSERT INTO track VALUES (?, ?, ?)", [(t["TrackId"], t["Name"], t["GenreId"]) for t in tracks])
con.executemany("INSERT INTO genre VALUES (?, ?)", [(g["GenreId"], g["Name"]) for g in genres])
answer = con.execute(
    "SELECT genre.name, COUNT(*) AS n FROM track JOIN genre ON genre.id = track.genre_id GROUP BY genre.id ORDER BY n ASC LIMIT 3"
).fetchall()`, py`con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE track (id INTEGER, name TEXT, genre_id INTEGER)")
con.execute("CREATE TABLE genre (id INTEGER, name TEXT)")
con.executemany("INSERT INTO track VALUES (?, ?, ?)", [(t["TrackId"], t["Name"], t["GenreId"]) for t in tracks])
con.executemany("INSERT INTO genre VALUES (?, ?)", [(g["GenreId"], g["Name"]) for g in genres])
answer = con.execute(
    "SELECT genre.name, COUNT(*) AS n FROM track JOIN genre ON genre.id = track.genre_id GROUP BY genre.id ORDER BY n DESC LIMIT 5"
).fetchall()`],
        }),
        chi({
          title: 'A safe search',
          use: ['tracks'],
          hidden: 'import sqlite3\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE track (id INTEGER, name TEXT)")\ncon.executemany("INSERT INTO track VALUES (?, ?)", [(t["TrackId"], t["Name"]) for t in tracks])\nwords = ["love", "it\'s", "x\'; DROP TABLE track; --"]\n',
          starter: 'answer = []\n# for each word, count the tracks whose name contains it, with a placeholder\n',
          given: '# con is a database with a table track(id, name). words are texts that a user typed, and one is hostile.',
          brief: 'For each word in `words` (in order), count the tracks whose `name` **contains** the word, using `LIKE ?` with a **placeholder** (never build the SQL with an f-string). Put the pattern `"%" + word + "%"` in the parameters. Store the list of the three counts in `answer`.',
          reference: py`answer = []
for word in words:
    n = con.execute("SELECT COUNT(*) FROM track WHERE name LIKE ?", ("%" + word + "%",)).fetchone()[0]
    answer.append(n)`,
          walkthrough: 'The pattern is passed as a parameter, so the quote in `it\'s`, and the hostile text, are treated as plain data. The third count is 0, and the table is still there.',
          traps: [py`answer = []
for word in words:
    n = con.execute(f"SELECT COUNT(*) FROM track WHERE name LIKE '%{word}%'").fetchone()[0]
    answer.append(n)`, py`answer = []
for word in words:
    n = con.execute("SELECT COUNT(*) FROM track WHERE name = ?", (word,)).fetchone()[0]
    answer.append(n)`],
        }),
        chi({
          title: 'Does the index help?',
          use: ['tracks'],
          hidden: 'import sqlite3\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE track (id INTEGER, name TEXT)")\ncon.executemany("INSERT INTO track VALUES (?, ?)", [(t["TrackId"], t["Name"]) for t in tracks])\nquery = "EXPLAIN QUERY PLAN SELECT * FROM track WHERE name = ?"\n',
          starter: 'before = con.execute(query, ("Rock",)).fetchall()\n# create an index on track(name), then look at the plan again\nanswer = None\n',
          given: '# query is an EXPLAIN QUERY PLAN statement. The 4th column of each row of its result describes the plan.',
          brief: 'Create an **index** on `track(name)`, and run the plan again. Store in `answer` a tuple of two booleans: does the plan **before** the index contain the word `SCAN`, and does the plan **after** the index contain the words `USING INDEX`?',
          reference: py`before = con.execute(query, ("Rock",)).fetchall()
con.execute("CREATE INDEX idx_track_name ON track(name)")
after = con.execute(query, ("Rock",)).fetchall()
answer = ("SCAN" in before[0][3], "USING INDEX" in after[0][3])`,
          walkthrough: 'Without an index SQLite has to scan the whole table. After `CREATE INDEX`, the plan says that it searches using the index instead.',
          traps: [py`before = con.execute(query, ("Rock",)).fetchall()
after = con.execute(query, ("Rock",)).fetchall()
answer = ("SCAN" in before[0][3], "USING INDEX" in after[0][3])`, py`before = con.execute(query, ("Rock",)).fetchall()
con.execute("CREATE INDEX idx_track_name ON track(name)")
after = con.execute(query, ("Rock",)).fetchall()
answer = ("SCAN" in after[0][3], "USING INDEX" in before[0][3])`],
        }),
      ],
    },
    {
      id: 'py-compression',
      title: 'Compression and archives: gzip and zipfile',
      blurb: 'gzip, zip archives, tar, streaming and the zip-slip warning.',
      kind: 'code',
      practice: {
        prompt: 'Write `compress_report(text)`. Encode the text with **UTF-8**, compress the bytes with `gzip.compress`, and then decompress them again.\n\nReturn a tuple of two booleans: **(1)** does the decompressed text (decoded from UTF-8) **equal the original**, and **(2)** is the compressed data **smaller than the encoded bytes**, in number of bytes?',
        starter: 'import gzip\n\ndef compress_report(text):\n    ...\n',
        solution: py`import gzip

def compress_report(text):
    data = text.encode("utf-8")
    packed = gzip.compress(data)
    restored = gzip.decompress(packed).decode("utf-8")
    return restored == text, len(packed) < len(data)`,
        samples: ['compress_report("hello " * 100)', 'compress_report("a")'],
        cases: [
          ['Repeated text shrinks', 'compress_report("hello " * 100)'],
          ['A tiny text grows', 'compress_report("a")'],
          ['An empty text', 'compress_report("")'],
          ['A short text with accents', 'compress_report("é" * 20)'],
          ['A long text with accents', 'compress_report("naïve café " * 50)'],
          ['A short varied text', 'compress_report("abcdefghij")'],
          ['Lines', 'compress_report("line\\n" * 200)'],
        ],
        traps: [
          py`import gzip

def compress_report(text):
    data = text.encode("utf-8")
    packed = gzip.compress(data)
    restored = gzip.decompress(packed).decode("utf-8")
    return restored == text, len(packed) > len(data)`,
          py`import gzip

def compress_report(text):
    data = text.encode("utf-8")
    packed = gzip.compress(data)
    restored = gzip.decompress(packed).decode("utf-8")
    return restored == text, len(packed) < len(text)`,
          py`import gzip

def compress_report(text):
    data = text.encode("utf-8")
    packed = gzip.compress(data)
    restored = gzip.decompress(packed).decode("latin-1")
    return restored == text, len(packed) < len(data)`,
        ],
      },
      real: [
        chi({
          title: 'Compress the track names',
          use: ['tracks'],
          hidden: 'import gzip\ntext = "\\n".join(t["Name"] for t in tracks)\n',
          given: '# text holds every track name, one per line. gzip is already imported.',
          brief: 'Encode `text` with UTF-8, compress it with `gzip.compress` and decompress it again. Store in `answer` a tuple: **is the compressed data less than half the size** of the encoded bytes, and **is the decompressed text equal to `text`**?',
          reference: py`data = text.encode("utf-8")
packed = gzip.compress(data)
answer = (len(packed) < len(data) / 2, gzip.decompress(packed).decode("utf-8") == text)`,
          walkthrough: 'Text with many repeated words compresses well. Decoding with the same encoding restores the original exactly.',
          traps: [py`data = text.encode("utf-8")
packed = gzip.compress(data)
answer = (len(packed) < len(data) / 100, gzip.decompress(packed).decode("utf-8") == text)`, py`data = text.encode("utf-8")
packed = gzip.compress(data)
answer = (len(packed) < len(data) / 2, gzip.decompress(packed).decode("latin-1") == text)`],
        }),
        chi({
          title: 'A zip archive in memory',
          use: ['genres'],
          hidden: 'import io\nimport zipfile\nbuffer = io.BytesIO()\n',
          starter: '# write one file per genre for the first three genres into buffer,\n# named genres/<GenreId>.txt, with the genre name inside\nanswer = None\n',
          given: '# genres is a list of dictionaries. buffer is an empty in-memory buffer. io and zipfile are already imported.',
          brief: 'Create a zip archive **inside `buffer`** with a file `genres/<GenreId>.txt` for each of the **first three genres**, holding the genre name as text. Then open the archive again from the bytes and store in `answer` a tuple: the **list of the names** in the archive, and the **list of the texts** inside them, in the same order.',
          reference: py`with zipfile.ZipFile(buffer, "w") as bundle:
    for g in genres[:3]:
        bundle.writestr(f"genres/{g['GenreId']}.txt", g["Name"])

with zipfile.ZipFile(io.BytesIO(buffer.getvalue())) as bundle:
    names = bundle.namelist()
    answer = (names, [bundle.read(name).decode("utf-8") for name in names])`,
          walkthrough: '`writestr` adds a file from text or bytes, and the archive is written into the buffer. `namelist` and `read` show what is inside.',
          traps: [py`with zipfile.ZipFile(buffer, "w") as bundle:
    for g in genres[:3]:
        bundle.writestr(f"{g['GenreId']}.txt", g["Name"])

with zipfile.ZipFile(io.BytesIO(buffer.getvalue())) as bundle:
    names = bundle.namelist()
    answer = (names, [bundle.read(name).decode("utf-8") for name in names])`, py`with zipfile.ZipFile(buffer, "w") as bundle:
    for g in genres[:3]:
        bundle.writestr(f"genres/{g['GenreId']}.txt", g["GenreId"])

with zipfile.ZipFile(io.BytesIO(buffer.getvalue())) as bundle:
    names = bundle.namelist()
    answer = (names, [bundle.read(name).decode("utf-8") for name in names])`],
        }),
        chi({
          title: 'Stream a compressed file',
          use: ['tracks'],
          hidden: TEMP_FOLDER + 'import gzip\npath = folder / "names.txt.gz"\nwith gzip.open(path, "wt", encoding="utf-8") as f:\n    for t in tracks:\n        f.write(t["Name"] + "\\n")\n',
          given: '# path is a gzip file with one track name per line, written in UTF-8. gzip is already imported.',
          brief: 'Open `path` with `gzip.open` in **text mode** with the right encoding, and loop over it line by line. Count the lines whose name (without the new line) is **longer than 40 characters**. Store the count in `answer`.',
          reference: py`answer = 0
with gzip.open(path, "rt", encoding="utf-8") as file:
    for line in file:
        if len(line.rstrip("\n")) > 40:
            answer += 1`,
          walkthrough: 'Mode `"rt"` decompresses and decodes, so `len` counts characters. The file is streamed, so only one line is in memory at a time.',
          traps: [py`answer = 0
with gzip.open(path, "rb") as file:
    for line in file:
        if len(line.rstrip(b"\n")) > 40:
            answer += 1`, py`answer = 0
with gzip.open(path, "rt", encoding="utf-8") as file:
    for line in file:
        if len(line) > 40:
            answer += 1`],
        }),
      ],
    },
  ],
  checkpoint: [],
}
