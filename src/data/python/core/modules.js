import { py, chi } from './common.js'

const TEMP_FOLDER = py`import tempfile
from pathlib import Path
folder = Path(tempfile.mkdtemp())
`

export const modulesAndTooling = {
  id: 'modules-packages-tooling',
  title: 'Modules, packages and tooling',
  intro: 'Organising code and running it from the command line.',
  lessons: [
    {
      id: 'py-import-system',
      title: 'The import system: modules, __name__ and search paths',
      blurb: 'Modules run once, sys.modules, sys.path and the main guard.',
      kind: 'learn',
      check: [
        {
          q: 'What does `sys.modules` contain?',
          options: [
            'The names of all files on the computer',
            'A dictionary (cache) of the modules that have already been imported',
            'The list of installed packages',
            'The functions of the current file',
          ],
          answer: 1,
          why: 'When you import a module, Python looks in `sys.modules` first. That is why the file of a module runs only once.',
        },
        {
          q: 'A file has this at the bottom. When does the `print` run?\n\n```python\nif __name__ == "__main__":\n    print("hello")\n```',
          options: [
            'Every time the file is imported',
            'Only when the file is run as a program, not when it is imported',
            'Never',
            'Only on Windows',
          ],
          answer: 1,
          why: 'When a file is run directly, `__name__` is `"__main__"`. When it is imported, `__name__` is the module name.',
        },
        {
          q: 'You create a file called `random.py` next to your script, and now `import random` gives strange errors. Why?',
          options: [
            'Python does not allow that file name',
            'Your folder is searched first, so your file hides the standard `random` module',
            'The standard module was deleted',
            'You forgot `__init__.py`',
          ],
          answer: 1,
          why: 'The folder of your script is first in `sys.path`. A file that has the name of a standard module shadows it.',
        },
        {
          q: 'Which of these is a good way to fix a circular import between modules `a` and `b`?',
          options: [
            'Import `a` twice',
            'Move the shared code into a third module that both import',
            'Rename both modules',
            'Use `from a import *`',
          ],
          answer: 1,
          why: 'A cycle usually means the modules are too tightly connected. A third module removes the loop. Importing inside a function is another option.',
        },
        {
          q: 'What is `sys.path`?',
          options: [
            'The path of the current file',
            'The ordered list of folders where Python searches for modules',
            'The path of the Python program',
            'A dictionary of environment variables',
          ],
          answer: 1,
          why: 'Python goes through `sys.path` from the first folder to the last and imports the first module it finds with the right name.',
        },
      ],
    },
    {
      id: 'py-packages',
      title: 'Packages, __init__ and relative imports',
      blurb: 'Package layout, public interfaces, relative imports and python -m.',
      kind: 'code',
      practice: {
        prompt: 'Write `import_order(modules)`. The argument is a dictionary that maps a **module name** to its **source code** (text). Return a list of the module names in an order in which they can be **loaded**: every module comes **after** the modules of this dictionary that it imports.\n\nA module imports another with a line `import name` (possibly `import a, b`, or `import name as x`) or `from name import something`. Imports of names that are **not** in the dictionary (like `os`) are ignored.\n\nWhen several modules are ready, choose the **alphabetically first**. If the modules import each other in a **cycle**, return `None`.',
        starter: 'def import_order(modules):\n    ...\n',
        solution: py`def import_order(modules):
    deps = {}
    for name, source in modules.items():
        found = set()
        for line in source.splitlines():
            words = line.split()
            if len(words) >= 2 and words[0] == "import":
                for part in " ".join(words[1:]).split(","):
                    found.add(part.split()[0])
            elif len(words) >= 2 and words[0] == "from":
                found.add(words[1])
        deps[name] = {d for d in found if d in modules and d != name}
    order = []
    remaining = dict(deps)
    while remaining:
        ready = sorted(n for n, d in remaining.items() if d <= set(order))
        if not ready:
            return None
        order.append(ready[0])
        del remaining[ready[0]]
    return order`,
        samples: ['import_order({"a": "import b", "b": ""})'],
        cases: [
          ['A chain', 'import_order({"a": "import b", "b": ""})'],
          ['Three modules in a line', 'import_order({"app": "import lib", "lib": "import util", "util": ""})'],
          ['Independent modules', 'import_order({"zeta": "", "alpha": "", "mid": ""})'],
          ['A from-import', 'import_order({"a": "from b import x", "b": "x = 1"})'],
          ['A diamond', 'import_order({"top": "import left\\nimport right", "left": "import base", "right": "import base", "base": ""})'],
          ['Imports of other modules are ignored', 'import_order({"a": "import os\\nimport sys", "b": "import a"})'],
          ['Several names in one import', 'import_order({"a": "import c, b", "b": "", "c": ""})'],
          ['An alias', 'import_order({"x": "import y as z", "y": ""})'],
          ['A cycle', 'import_order({"a": "import b", "b": "import a"})'],
          ['No modules', 'import_order({})'],
          ['The alphabetical choice', 'import_order({"b": "import a", "a": "", "c": ""})'],
        ],
        traps: [
          py`def import_order(modules):
    deps = {}
    for name, source in modules.items():
        found = set()
        for line in source.splitlines():
            words = line.split()
            if len(words) >= 2 and words[0] == "import":
                for part in " ".join(words[1:]).split(","):
                    found.add(part.split()[0])
            elif len(words) >= 2 and words[0] == "from":
                found.add(words[1])
        deps[name] = {d for d in found if d in modules and d != name}
    order = []
    remaining = dict(deps)
    while remaining:
        ready = [n for n, d in remaining.items() if d <= set(order)]
        if not ready:
            return None
        order.append(ready[0])
        del remaining[ready[0]]
    return order`,
          py`def import_order(modules):
    deps = {}
    for name, source in modules.items():
        found = set()
        for line in source.splitlines():
            words = line.split()
            if len(words) >= 2 and words[0] == "import":
                for part in " ".join(words[1:]).split(","):
                    found.add(part.split()[0])
        deps[name] = {d for d in found if d in modules and d != name}
    order = []
    remaining = dict(deps)
    while remaining:
        ready = sorted(n for n, d in remaining.items() if d <= set(order))
        if not ready:
            return None
        order.append(ready[0])
        del remaining[ready[0]]
    return order`,
          py`def import_order(modules):
    deps = {}
    for name, source in modules.items():
        found = set()
        for line in source.splitlines():
            words = line.split()
            if len(words) >= 2 and words[0] == "import":
                for part in " ".join(words[1:]).split(","):
                    found.add(part.split()[0])
            elif len(words) >= 2 and words[0] == "from":
                found.add(words[1])
        deps[name] = found
    order = []
    remaining = dict(deps)
    while remaining:
        ready = sorted(n for n, d in remaining.items() if d <= set(order))
        if not ready:
            return None
        order.append(ready[0])
        del remaining[ready[0]]
    return order`,
          py`def import_order(modules):
    deps = {}
    for name, source in modules.items():
        found = set()
        for line in source.splitlines():
            words = line.split()
            if len(words) >= 2 and words[0] == "import":
                for part in " ".join(words[1:]).split(","):
                    found.add(part.split()[0])
            elif len(words) >= 2 and words[0] == "from":
                found.add(words[1])
        deps[name] = {d for d in found if d in modules and d != name}
    order = []
    remaining = dict(deps)
    while remaining:
        ready = sorted(n for n, d in remaining.items() if d <= set(order))
        if not ready:
            return []
        order.append(ready[0])
        del remaining[ready[0]]
    return order`,
          py`def import_order(modules):
    deps = {}
    for name, source in modules.items():
        found = set()
        for line in source.splitlines():
            words = line.split()
            if len(words) >= 2 and words[0] == "import":
                found.add(words[1])
            elif len(words) >= 2 and words[0] == "from":
                found.add(words[1])
        deps[name] = {d for d in found if d in modules and d != name}
    order = []
    remaining = dict(deps)
    while remaining:
        ready = sorted(n for n, d in remaining.items() if d <= set(order))
        if not ready:
            return None
        order.append(ready[0])
        del remaining[ready[0]]
    return order`,
        ],
      },
      real: [
        chi({
          title: 'Write and import your own module',
          use: ['tracks'],
          hidden: TEMP_FOLDER + 'import importlib\nimport sys\nsys.path.insert(0, str(folder))\nsys.modules.pop("mytools", None)\n',
          starter: '# 1. write the module file mytools.py into folder\n# 2. call importlib.invalidate_caches()\n# 3. import it and use it\nanswer = None\n',
          given: '# folder is an empty temporary folder that is already on sys.path. importlib is imported.',
          brief: 'Write a file `mytools.py` into `folder` that defines `shorten(text, n)`: the text itself when it has **at most `n` characters**, and otherwise the first **`n - 1`** characters followed by `"…"` (the single ellipsis character). Call `importlib.invalidate_caches()`, then `import mytools`. Store in `answer` the list of `mytools.shorten(name, 17)` for the names of the **first five tracks**.',
          reference: py`(folder / "mytools.py").write_text(
    'def shorten(text, n):\n'
    '    if len(text) <= n:\n'
    '        return text\n'
    '    return text[: n - 1] + "…"\n',
    encoding="utf-8",
)
importlib.invalidate_caches()
import mytools

answer = [mytools.shorten(t["Name"], 17) for t in tracks[:5]]`,
          walkthrough: 'A module is only a file that is on `sys.path`. Because the file was created after Python looked at the folder, `invalidate_caches` makes sure that the new file is noticed.',
          traps: [py`(folder / "mytools.py").write_text(
    'def shorten(text, n):\n'
    '    return text[:n]\n',
    encoding="utf-8",
)
importlib.invalidate_caches()
import mytools

answer = [mytools.shorten(t["Name"], 17) for t in tracks[:5]]`, py`(folder / "mytools.py").write_text(
    'def shorten(text, n):\n'
    '    if len(text) < n:\n'
    '        return text\n'
    '    return text[: n - 1] + "…"\n',
    encoding="utf-8",
)
importlib.invalidate_caches()
import mytools

answer = [mytools.shorten(t["Name"], 17) for t in tracks[:5]]`],
        }),
        chi({
          title: 'The main guard',
          hidden: TEMP_FOLDER + 'import importlib\nimport runpy\nimport sys\n(folder / "tool.py").write_text(\n    "results = []\\n"\n    "def double(x):\\n    return x * 2\\n"\n    "if __name__ == \'__main__\':\\n    results.append(\'ran as a script\')\\n",\n    encoding="utf-8",\n)\nimportlib.invalidate_caches()\nsys.path.insert(0, str(folder))\nsys.modules.pop("tool", None)\n',
          starter: '# import tool, and also run the file as a program with runpy\nanswer = None\n',
          given: '# folder holds tool.py, which appends a message to its list results only when it runs as a script. runpy and sys are imported.',
          brief: '`import tool` normally. Then run the **same file as a program** with `runpy.run_path(str(folder / "tool.py"), run_name="__main__")`. Store in `answer` a tuple: the `results` list of the **imported** module, and the `results` list in the namespace returned by **`run_path`**.',
          reference: py`import tool

namespace = runpy.run_path(str(folder / "tool.py"), run_name="__main__")
answer = (tool.results, namespace["results"])`,
          walkthrough: 'When the file is imported, `__name__` is `"tool"`, so the guarded block is skipped. When it is run as `"__main__"`, the block runs. Each run has its own copy of `results`.',
          traps: [py`import tool

namespace = runpy.run_path(str(folder / "tool.py"))
answer = (tool.results, namespace["results"])`, py`import tool

namespace = runpy.run_path(str(folder / "tool.py"), run_name="__main__")
answer = (namespace["results"], tool.results)`],
        }),
        chi({
          title: 'Import by name',
          hidden: 'import importlib\nspecs = ["math.sqrt", "statistics.mean", "json.dumps"]\nvalues = [16, [1, 2, 3], {"a": 1}]\n',
          starter: '# for each "module.function" text, import the module by name and call the function\nanswer = []\n',
          given: '# specs holds "module.function" names. values holds one argument for each of them.',
          brief: 'Each item of `specs` is a text like `"math.sqrt"`. Split it at the **last dot** into a module name and a function name, import the module with `importlib.import_module`, and call the function with the matching value from `values`. Store the list of the three results in `answer`.',
          reference: py`answer = []
for spec, value in zip(specs, values):
    module_name, _, function_name = spec.rpartition(".")
    function = getattr(importlib.import_module(module_name), function_name)
    answer.append(function(value))`,
          walkthrough: '`rpartition` cuts at the last dot, so a module name that has dots of its own would also work. `getattr` looks a function up by its name.',
          traps: [py`answer = []
for spec, value in zip(specs, values):
    function = importlib.import_module(spec)
    answer.append(function(value))`, py`answer = []
for spec, value in zip(specs, values):
    module_name, _, function_name = spec.rpartition(".")
    function = getattr(importlib.import_module(module_name), function_name)
    answer.append(function)`],
        }),
      ],
    },
    {
      id: 'py-venv-pip',
      title: 'Virtual environments, pip, requirements and pyproject.toml',
      blurb: 'Isolating projects, installing packages and recording dependencies.',
      kind: 'learn',
      check: [
        {
          q: 'Why should each project have its own virtual environment?',
          options: [
            'It makes Python run faster',
            'Each project keeps its own set of packages and versions, so projects cannot break each other',
            'Python needs it to start',
            'It removes the need for `pip`',
          ],
          answer: 1,
          why: 'Two projects may need different versions of the same library. Separate environments keep them apart.',
        },
        {
          q: 'Which command records the exact versions of the installed packages?',
          options: ['`python -m pip freeze`', '`python -m pip show`', '`python -m venv`', '`python -m pip search`'],
          answer: 0,
          why: '`pip freeze` lists every package with its version, ready to be saved in `requirements.txt`.',
        },
        {
          q: 'Why do teams pin versions (`requests==2.32.3`) in `requirements.txt`?',
          options: [
            'To make installation slower',
            'So that everyone, on every computer and at every time, gets the same versions',
            'Because `pip` cannot install unpinned packages',
            'To save disk space',
          ],
          answer: 1,
          why: 'Unpinned packages install the newest version at that moment, so the project may behave differently later or elsewhere.',
        },
        {
          q: 'What is `pyproject.toml`?',
          options: [
            'A compiled program',
            'A configuration file, in TOML format, that describes a project: its name, version, dependencies and tool settings',
            'A log file',
            'A virtual environment',
          ],
          answer: 1,
          why: 'It is the standard place for project metadata and for the settings of many tools.',
        },
        {
          q: 'What is the risk of running `pip install` with no environment active?',
          options: [
            'Nothing',
            'The package goes into the global Python, which can break other tools and mix up projects',
            'The package is installed twice',
            'The computer restarts',
          ],
          answer: 1,
          why: 'Global installs are hard to track and can conflict with software your system depends on. Create a virtual environment first.',
        },
      ],
    },
    {
      id: 'py-stdlib-map',
      title: 'A map of the standard library',
      blurb: 'Categories of modules, exploring with dir and finding the right one.',
      kind: 'learn',
      check: [
        {
          q: 'Which standard module would you use to work with dates and times?',
          options: ['`calendar` only', '`datetime`', '`random`', '`heapq`'],
          answer: 1,
          why: '`datetime` provides `date`, `time`, `datetime` and `timedelta`. `zoneinfo` adds time zones.',
        },
        {
          q: 'Which built-in function lists the names that a module or object has?',
          options: ['`list()`', '`dir()`', '`type()`', '`id()`'],
          answer: 1,
          why: '`dir(module)` returns the names in it, and `module.__doc__` holds its documentation.',
        },
        {
          q: 'Which standard module reads and writes CSV files?',
          options: ['`csv`', '`table`', '`sheet`', '`excel`'],
          answer: 0,
          why: 'The `csv` module handles quoting, delimiters and headers, so you never need to split the lines by hand.',
        },
        {
          q: 'You need to count how often each word appears. What should you check first?',
          options: ['Whether `collections.Counter` already does it', 'Whether you can write a long loop', 'Whether a third-party library exists', 'Nothing'],
          answer: 0,
          why: 'Before writing your own helper, look for a standard one. `Counter` is tested and does the job in one line.',
        },
        {
          q: 'Which of these is **not** part of the standard library?',
          options: ['`json`', '`pathlib`', '`requests`', '`sqlite3`'],
          answer: 2,
          why: '`requests` is a very popular third-party package that you install with `pip`. The others come with Python.',
        },
      ],
    },
    {
      id: 'py-cli-argparse',
      title: 'The command line: sys.argv, argparse and environment variables',
      blurb: 'Arguments, options, flags, sub-commands, exit codes and streams.',
      kind: 'code',
      practice: {
        prompt: 'Write `parse_cli(argv)` with **`argparse`**. It parses the **list** of texts `argv` (do not read `sys.argv`) and returns a **dictionary** with these keys, in this order:\n\n- `"filename"`: a required positional argument\n- `"count"`: an option `-c` or `--count`, converted to an **integer**, with the default **1**\n- `"verbose"`: a flag `-v` or `--verbose`, `False` when it is not given',
        starter: 'import argparse\n\ndef parse_cli(argv):\n    ...\n',
        solution: py`import argparse

def parse_cli(argv):
    parser = argparse.ArgumentParser(prog="tool")
    parser.add_argument("filename")
    parser.add_argument("-c", "--count", type=int, default=1)
    parser.add_argument("-v", "--verbose", action="store_true")
    return vars(parser.parse_args(argv))`,
        samples: ['parse_cli(["data.csv", "--count", "3"])'],
        cases: [
          ['Only a file name', 'parse_cli(["data.csv"])'],
          ['A long option', 'parse_cli(["data.csv", "--count", "3"])'],
          ['A flag before the name', 'parse_cli(["-v", "data.csv"])'],
          ['Short forms', 'parse_cli(["data.csv", "-c", "5", "--verbose"])'],
          ['An equals sign', 'parse_cli(["x", "--count=7"])'],
          ['A number is converted', 'parse_cli(["x", "-c", "12"])["count"] + 1'],
          ['The option in front', 'parse_cli(["-c", "2", "-v", "file.txt"])'],
        ],
        traps: [
          py`import argparse

def parse_cli(argv):
    parser = argparse.ArgumentParser(prog="tool")
    parser.add_argument("filename")
    parser.add_argument("-c", "--count", default=1)
    parser.add_argument("-v", "--verbose", action="store_true")
    return vars(parser.parse_args(argv))`,
          py`import argparse

def parse_cli(argv):
    parser = argparse.ArgumentParser(prog="tool")
    parser.add_argument("filename")
    parser.add_argument("-c", "--count", type=int)
    parser.add_argument("-v", "--verbose", action="store_true")
    return vars(parser.parse_args(argv))`,
          py`import argparse

def parse_cli(argv):
    parser = argparse.ArgumentParser(prog="tool")
    parser.add_argument("filename")
    parser.add_argument("-c", "--count", type=int, default=1)
    parser.add_argument("-v", "--verbose", action="store_true")
    return parser.parse_args(argv)`,
          py`import argparse

def parse_cli(argv):
    parser = argparse.ArgumentParser(prog="tool")
    parser.add_argument("filename")
    parser.add_argument("-c", "--count", type=int, default=1)
    parser.add_argument("-v", "--verbose", action="store_true")
    return vars(parser.parse_args())`,
          py`import argparse

def parse_cli(argv):
    parser = argparse.ArgumentParser(prog="tool")
    parser.add_argument("filename")
    parser.add_argument("-c", "--count", type=int, default=1)
    parser.add_argument("-v", "--verbose", action="store_false")
    return vars(parser.parse_args(argv))`,
        ],
      },
      real: [
        chi({
          title: 'Filter tracks from the command line',
          use: ['tracks'],
          hidden: 'import argparse\nargv = ["--min-price", "0.99", "--genre-id", "1"]\n',
          starter: '# build a parser with --min-price (a number, default 0) and --genre-id (an integer, optional)\n# parse argv, and count the tracks that match\nanswer = None\n',
          given: '# argv is a list of texts, as if typed in a terminal. argparse is imported.',
          brief: 'Build an `ArgumentParser` with the option `--min-price` (a **float**, default `0`) and `--genre-id` (an **integer**, default `None`). Parse `argv`. Store in `answer` the number of tracks with `UnitPrice` **at least** `min_price` and, **when a genre id was given**, with that `GenreId`.',
          reference: py`parser = argparse.ArgumentParser()
parser.add_argument("--min-price", type=float, default=0)
parser.add_argument("--genre-id", type=int, default=None)
args = parser.parse_args(argv)
answer = sum(
    1
    for t in tracks
    if t["UnitPrice"] >= args.min_price and (args.genre_id is None or t["GenreId"] == args.genre_id)
)`,
          walkthrough: 'The dashes in the option name become underscores in the attribute (`args.min_price`). `type=float` and `type=int` convert the text, so the comparison with the numbers works.',
          traps: [py`parser = argparse.ArgumentParser()
parser.add_argument("--min-price", type=float, default=0)
parser.add_argument("--genre-id", type=int, default=None)
args = parser.parse_args(argv)
answer = sum(1 for t in tracks if t["UnitPrice"] >= args.min_price)`, py`parser = argparse.ArgumentParser()
parser.add_argument("--min-price", type=float, default=0)
parser.add_argument("--genre-id", type=int, default=None)
args = parser.parse_args(argv)
answer = sum(1 for t in tracks if t["UnitPrice"] > args.min_price and t["GenreId"] == args.genre_id)`],
        }),
        chi({
          title: 'Read settings from the environment',
          hidden: 'import os\nos.environ["DATAOUT_LIMIT"] = "7"\nos.environ.pop("DATAOUT_MISSING", None)\n',
          starter: '# read DATAOUT_LIMIT as an integer (default 3) and DATAOUT_MISSING as text (default "none")\nanswer = None\n',
          given: '# os is imported. DATAOUT_LIMIT was set to "7". DATAOUT_MISSING does not exist.',
          brief: 'Read the environment variable `DATAOUT_LIMIT` as an **integer**, with the default `3`, and `DATAOUT_MISSING` as text, with the default `"none"`. Store them in `answer` as a tuple `(limit, missing)`.',
          reference: py`limit = int(os.environ.get("DATAOUT_LIMIT", 3))
missing = os.environ.get("DATAOUT_MISSING", "none")
answer = (limit, missing)`,
          walkthrough: 'Environment values are always text, so the limit has to be converted. `get` with a default avoids the `KeyError` for a variable that is not set.',
          traps: [py`limit = os.environ.get("DATAOUT_LIMIT", 3)
missing = os.environ.get("DATAOUT_MISSING", "none")
answer = (limit, missing)`, py`limit = int(os.environ.get("DATAOUT_LIMIT", 3))
missing = os.environ.get("DATAOUT_MISSING")
answer = (limit, missing)`],
        }),
        chi({
          title: 'A tiny pipeline',
          use: ['tracks'],
          hidden: 'import contextlib\nimport io\nimport sys\nsys.stdin = io.StringIO("\\n".join(str(t["UnitPrice"]) for t in tracks[:5]) + "\\n\\n")\nbuffer = io.StringIO()\n',
          starter: '# read the prices from sys.stdin, add them up, and print the total with 2 decimals\n# while the output is redirected into buffer\nanswer = buffer.getvalue()\n',
          given: '# sys.stdin holds one price per line (and a blank line at the end). contextlib, io and sys are imported.',
          brief: 'Read `sys.stdin` line by line, skipping **blank** lines, and add up the prices as floats. Then print the total with **2 decimals** using `print` **inside** `contextlib.redirect_stdout(buffer)`. Store `buffer.getvalue()` in `answer`.',
          reference: py`total = sum(float(line) for line in sys.stdin if line.strip())
with contextlib.redirect_stdout(buffer):
    print(f"{total:.2f}")
answer = buffer.getvalue()`,
          walkthrough: 'A stream can be looped over like a file. `redirect_stdout` sends everything that `print` writes into the buffer, so the output can be captured and tested.',
          traps: [py`total = sum(float(line) for line in sys.stdin if line.strip())
print(f"{total:.2f}")
answer = buffer.getvalue()`, py`total = sum(float(line) for line in sys.stdin if line.strip())
with contextlib.redirect_stdout(buffer):
    print(f"{total:.1f}")
answer = buffer.getvalue()`],
        }),
      ],
    },
  ],
  checkpoint: [],
}
