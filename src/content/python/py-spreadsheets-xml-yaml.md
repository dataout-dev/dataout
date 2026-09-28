Not every data source arrives as a tidy CSV. Spreadsheets carry visual formatting that has nothing to do with the data; XML and YAML each structure data hierarchically, in their own syntax, for different typical uses.

You will learn:

- typical spreadsheet workflows and their pitfalls
- XML with `xml.etree.ElementTree`
- YAML for configuration
- pitfalls when the source is hand-edited

## Spreadsheet workflows

Reading an Excel file into pandas normally uses `pd.read_excel`, backed by a package like `openpyxl` (reading is the common case; writing typically uses `xlsxwriter` or `openpyxl`). Neither package is available in this browser-based playground, so this lesson describes the workflow rather than running it — everything here still applies directly the moment you are working in an ordinary Python environment: `pd.read_excel("file.xlsx", sheet_name="Sheet1")` reads a specific sheet exactly like `read_csv` reads a file, with similar `dtype`/`parse_dates`/`usecols` options.

A spreadsheet export that started life as something a person edited by hand often needs real cleaning first: a title row above the actual header, a "notes" row squeezed in below the data, merged cells that only pandas can partially reconstruct, or a second sheet holding a legend that is not really tabular data at all.

## XML with ElementTree

```python
import xml.etree.ElementTree as ET

xml_text = """
<catalog>
  <book id="1"><title>Learning Python</title><price>29.99</price></book>
  <book id="2"><title>Data Science 101</title><price>19.99</price></book>
</catalog>
"""
root = ET.fromstring(xml_text)
for book in root.findall("book"):
    print(book.get("id"), book.find("title").text, book.find("price").text)
```

`ET.fromstring` parses XML text into a tree of `Element` objects; `.find`/`.findall` search by tag name, `.get("attr")` reads an attribute, and `.text` reads the text content directly inside a tag.

## XML to a DataFrame

```python
import xml.etree.ElementTree as ET
import pandas as pd

xml_text = """
<catalog>
  <book id="1"><title>Learning Python</title><price>29.99</price></book>
  <book id="2"><title>Data Science 101</title><price>19.99</price></book>
</catalog>
"""
root = ET.fromstring(xml_text)
rows = [{"id": b.get("id"), "title": b.find("title").text, "price": float(b.find("price").text)} for b in root.findall("book")]
print(pd.DataFrame(rows))
```

Building a list of dicts (one per record) and handing it to `pd.DataFrame` is usually the most direct route from a parsed XML tree to a tidy table — the same pattern that turns any list of similar-shaped records into a DataFrame, regardless of where they came from.

## YAML for configuration

A YAML config file for, say, a data pipeline might look like:

```yaml
database:
  host: localhost
  port: 5432
tables:
  - orders
  - customers
retries: 3
```

The nesting is expressed purely through indentation, with no braces or quotes required around most values — part of why YAML is a common choice for hand-written configuration, even though it represents exactly the same kind of nested data a JSON file could. Reading it in Python (with the third-party `PyYAML` package, not shown running here) is a single `yaml.safe_load(text)` call, returning ordinary nested dicts and lists — the same shape `json.loads` would give for equivalent JSON.

## Watch out: merged cells and stray notes

A spreadsheet with a merged title cell spanning several columns, or a footnote row left in below the real data, both parse "successfully" — there is no error — but the resulting DataFrame silently contains junk rows or misaligned columns that only become obvious once something downstream breaks. Always look at `.head()` and `.tail()` (and the dtypes) of anything read from a hand-maintained source before trusting it.

## Common mistakes

- Trusting that a spreadsheet or hand-edited YAML/XML file parses cleanly just because it loaded without an error.
- Forgetting a specific `sheet_name` and silently reading the wrong sheet's data.
- Assuming indentation in YAML is cosmetic; inconsistent indentation is a real parsing error, not a style choice.
- Reaching for full XML/YAML parsing machinery when the source is really just a simple flat list that a CSV would have represented more simply.

## Recap

- Spreadsheet exports often carry non-tabular structure (merged cells, notes, multiple sheets) that needs cleaning before analysis.
- `xml.etree.ElementTree` parses XML into a searchable tree; building a list of dicts is the usual bridge to a DataFrame.
- YAML represents the same nested data as JSON, with an indentation-based syntax favoured for hand-written configuration.
- Always inspect data freshly parsed from a hand-maintained source before trusting it.
