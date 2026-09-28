CSV and JSON cover a great deal, but you will meet other text formats too: XML in older systems and documents, INI and TOML for configuration, and YAML for configuration in many tools. This lesson shows how to read each of them, and how to choose between them.

You will learn:

- XML with `xml.etree.ElementTree`
- INI files with `configparser`
- TOML with `tomllib`
- YAML, and the safe way to load it
- how to choose a format
- security warnings for untrusted data

## XML

XML describes data with nested **tags**. Python's `xml.etree.ElementTree` parses it into a tree of elements:

```python
import xml.etree.ElementTree as ET

text = """
<library>
  <book id="1"><title>Dune</title><year>1965</year></book>
  <book id="2"><title>Emma</title><year>1815</year></book>
</library>
"""
root = ET.fromstring(text)
print(root.tag, len(root))
for book in root.findall("book"):
    print(book.get("id"), book.findtext("title"), int(book.findtext("year")))
```

An element has a `tag`, a dictionary of `attrib` (or `get`), its `text`, and children. `find` returns the first match, `findall` returns all, and `findtext` returns the text of a child. A **path** such as `.//title` searches at every depth:

```python
print([t.text for t in root.findall(".//title")])
print(root.find("book[@id='2']/title").text)
```

You can also build XML and write it out:

```python
library = ET.Element("library")
book = ET.SubElement(library, "book", id="3")
ET.SubElement(book, "title").text = "Ulysses"
print(ET.tostring(library, encoding="unicode"))
```

## INI files and configparser

INI files have `[sections]` with `key = value` lines. They are common for small configuration files:

```python
import configparser

ini = """
[server]
host = localhost
port = 8080
debug = yes

[paths]
data = /var/data
"""
config = configparser.ConfigParser()
config.read_string(ini)
print(config.sections())
print(config["server"]["host"])
print(config.getint("server", "port") + 1)
print(config.getboolean("server", "debug"))
print(config.get("server", "timeout", fallback="30"))
```

Every value is text. `getint`, `getfloat` and `getboolean` convert it, and `fallback` gives a default when the key is missing.

## TOML

TOML is a newer configuration format with real types (numbers, booleans, lists, dates), and it is the format of `pyproject.toml`. Python reads it with the standard `tomllib` (Python 3.11 and later):

```python
import tomllib

document = """
title = "Example"

[server]
host = "localhost"
ports = [8000, 8001]
debug = true

[[users]]
name = "Ada"

[[users]]
name = "Alan"
"""
config = tomllib.loads(document)
print(config["server"]["ports"])
print([u["name"] for u in config["users"]])
print(type(config["server"]["debug"]).__name__)
```

`tomllib` can only **read**. To write TOML you need a third-party package.

## YAML

YAML is popular for configuration (in Docker, CI systems and many tools), and is easy for people to read. It is **not** in the standard library. You install `PyYAML` with `pip`, and then use `yaml.safe_load`:

```text
import yaml

data = yaml.safe_load("""
name: Ada
languages: [en, fr]
address:
  city: London
""")
```

The example is shown as text here, because `PyYAML` may not be installed. What matters is one **security rule**: use `safe_load`, and never `yaml.load` without a safe loader, because full YAML can build arbitrary Python objects, and even run code, from the file.

## Which format should you use?

| Format | Good for | Watch out for |
| ------ | -------- | ------------- |
| **CSV** | tables of flat data | no types, no nesting |
| **JSON** | data exchange, APIs, nested data | no comments, no dates |
| **TOML** | configuration files | read-only in the standard library |
| **INI** | very simple configuration | everything is text, no nesting |
| **YAML** | human-edited configuration | indentation mistakes, security |
| **XML** | documents, older systems | verbose, security |

A useful rule: JSON between programs, TOML or YAML for settings that people edit, CSV for tables.

## Security

Files that come from other people **can be hostile**. Two examples to know:

- **XML** can define "entities" that expand into gigabytes of text (the *billion laughs* attack). The `defusedxml` package protects against this. Do not parse untrusted XML with the standard parser without care.
- **YAML** `load` and **pickle** can run code. Only use the safe loaders, and never unpickle data from an untrusted source.

## Common mistakes

- Expecting `configparser` to give numbers or booleans without `getint` and `getboolean`.
- Using `yaml.load` on files you do not control.
- Forgetting that XML text and attributes are always strings.
- Choosing YAML when a plain JSON or TOML file would be simpler and safer.

## Recap

- `ElementTree` parses XML: `find`, `findall`, `findtext`, `get`.
- `configparser` reads INI files, with `getint`, `getboolean` and `fallback`.
- `tomllib` reads TOML with real types. `yaml.safe_load` reads YAML (with a third-party package).
- Choose the simplest format that fits, and never load untrusted data with an unsafe loader.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
