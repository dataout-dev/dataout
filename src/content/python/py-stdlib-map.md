Python is often described as "batteries included". Its **standard library** contains hundreds of modules that come with every Python installation, with no `pip install` needed. Many programs that people write with a third-party package could be done with a standard module. Knowing what exists is one of the best time-savers in programming. This lesson is a map of the territory, and shows how to find your way around it.

You will learn:

- how big the standard library is, and how to list it
- a tour by category
- how to explore a module with `dir` and docstrings
- how to find the right module for a job
- how to read the official documentation
- why to avoid reinventing the wheel

## How big is it?

```python
import sys

names = sorted(sys.stdlib_module_names)
print(len(names) > 200)
print(names[:8])
print("json" in names, "requests" in names)
```

Hundreds of modules. Things like `json` are in the list, and third-party libraries such as `requests` or `numpy` are not.

## A tour by category

**Text**

- `string`, `re`, `textwrap`, `difflib`, `unicodedata`

**Data types**

- `datetime`, `zoneinfo`, `calendar`, `collections`, `heapq`, `bisect`, `array`, `enum`, `dataclasses`, `typing`, `copy`, `pprint`

**Numbers and maths**

- `math`, `cmath`, `decimal`, `fractions`, `random`, `statistics`, `itertools`, `functools`, `operator`

**Files and storage**

- `pathlib`, `os`, `shutil`, `tempfile`, `glob`, `fnmatch`, `io`

**Data formats**

- `csv`, `json`, `xml`, `tomllib`, `configparser`, `pickle`, `sqlite3`, `struct`, `base64`, `hashlib`

**Compression**

- `gzip`, `zipfile`, `tarfile`, `bz2`, `lzma`, `zlib`

**Programs and the system**

- `sys`, `os`, `subprocess`, `argparse`, `logging`, `platform`, `time`, `signal`

**Concurrency**

- `threading`, `multiprocessing`, `concurrent.futures`, `asyncio`, `queue`

**Networking and the web**

- `urllib`, `http`, `socket`, `email`, `html`, `ssl`

**Development tools**

- `unittest`, `doctest`, `pdb`, `timeit`, `cProfile`, `traceback`, `inspect`, `importlib`

## Exploring a module

Two built-in functions are your first tools. `dir(module)` lists the names in it, and `__doc__` holds its documentation:

```python
import statistics

print([name for name in dir(statistics) if not name.startswith("_")][:10])
print(statistics.__doc__.strip().splitlines()[0])
print(statistics.mean.__doc__.strip().splitlines()[0])
```

In a terminal on your own computer, `help(statistics.mean)` shows the full text, and `python -m pydoc statistics` prints the documentation of a module.

## Look at the signature

The `inspect` module can tell you how to call a function:

```python
import inspect
import statistics

print(inspect.signature(statistics.quantiles))
print(inspect.signature(round))
```

## Finding the right module

When you have a job to do, ask yourself: "is this a common problem?" If yes, there is probably a module. Some examples of questions and answers:

| I need to... | Look at |
| ------------ | ------- |
| count things | `collections.Counter` |
| work with dates | `datetime` |
| parse command-line options | `argparse` |
| copy or delete whole folders | `shutil` |
| run another program | `subprocess` |
| measure how long code takes | `time.perf_counter`, `timeit` |
| generate all combinations | `itertools` |
| store a small database | `sqlite3` |
| make a temporary file | `tempfile` |
| find files by pattern | `pathlib.Path.glob` |
| compare two texts | `difflib` |

The search box in the official documentation at `docs.python.org` also finds modules by keyword, and the **Library Reference** is the most useful page to bookmark.

## A few quick wins

```python
import difflib
import textwrap
import shutil
import platform

print(difflib.SequenceMatcher(None, "colour", "color").ratio())
print(difflib.get_close_matches("aple", ["apple", "maple", "grape"]))
print(textwrap.dedent("""
    indented text
      stays relative
""").strip())
print(shutil.which("definitely-not-a-program"))
print(platform.python_version_tuple()[0])
```

None of these needed an installation.

## How to read the documentation

A standard library page usually has: a short **description**, the **functions and classes** with their arguments, **examples**, and **notes** on which Python version added a feature ("Added in version 3.12"). Read the description and the first examples before the reference. The notes also warn you about security problems and platform differences.

## Do not reinvent the wheel

Before you write a helper, check: does the standard library have it? People often write their own code for things that exist and are well tested, such as parsing dates, counting items, merging dictionaries, working with paths, or a priority queue. The standard version has been used by millions, and handles edge cases that you have not thought about yet.

Sometimes a third-party package is the better answer (for example `requests` is friendlier than `urllib` for web requests, and `pandas` is far more powerful for tables). But start by checking the standard library.

## Common mistakes

- Writing a function that the standard library already has.
- Installing a package for something that a standard module does.
- Naming your own file after a standard module (see the import system lesson).
- Not reading the version notes, and using a function that older Pythons do not have.

## Recap

- The standard library has hundreds of modules, grouped by job: text, data types, numbers, files, formats, compression, system, concurrency, networking and tools.
- Explore with `dir`, `__doc__`, `inspect.signature`, and the official documentation.
- Look for a standard tool before you write your own or install a package.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
