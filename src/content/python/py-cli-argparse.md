Many useful programs are used from a terminal with **arguments**: `python report.py sales.csv --top 5 --verbose`. This lesson shows how a program receives them, how `argparse` parses them for you (including generating the help text), and how programs read environment variables and connect to other programs through standard input and output.

You will learn:

- `sys.argv`, the raw list of arguments
- `argparse`: positional arguments, options, flags and types
- defaults, choices and help text
- sub-commands
- exit codes
- environment variables
- standard input and output in pipelines

## sys.argv

When you run a program, Python puts the words that you typed in the list `sys.argv`. The first item is the program name:

```python
import sys

print(type(sys.argv).__name__)
print(len(sys.argv) >= 1)
```

You could pick the arguments apart by hand, but that quickly becomes a mess of special cases. `argparse` does it well.

## argparse: the basics

You create a parser, describe the arguments, and call `parse_args`. To keep the examples runnable here, we pass a **list** of arguments to `parse_args`. In a real program, you call `parse_args()` with nothing, and it reads `sys.argv`:

```python
import argparse

parser = argparse.ArgumentParser(description="Show the top rows of a file")
parser.add_argument("filename")
parser.add_argument("--top", type=int, default=10, help="how many rows to show")
parser.add_argument("-v", "--verbose", action="store_true")

args = parser.parse_args(["sales.csv", "--top", "3", "-v"])
print(args.filename, args.top, args.verbose)
print(args)
```

- `"filename"` is a **positional** argument: it is required, and identified by its place.
- `"--top"` is an **option**, given by name, with a value. `type=int` converts the text, and `default` is used when it is missing.
- `action="store_true"` makes a **flag**: it is `True` when present and `False` otherwise.
- `"-v"` is a short alias of `"--verbose"`.

All of these forms work: `--top 3`, `--top=3`, and `-v`. Short flags can be combined (`-vq`).

## The result is a Namespace

`parse_args` returns a `Namespace`, an object whose attributes are the argument names. Convert it to a dictionary with `vars`:

```python
print(vars(parser.parse_args(["data.csv"])))
```

## Defaults, types and choices

```python
parser = argparse.ArgumentParser()
parser.add_argument("--format", choices=["csv", "json", "text"], default="text")
parser.add_argument("--rate", type=float, default=0.5)
parser.add_argument("--name", action="append", default=[])
parser.add_argument("numbers", nargs="*", type=int)

args = parser.parse_args(["--format", "json", "--name", "a", "--name", "b", "1", "2", "3"])
print(args.format, args.rate, args.name, args.numbers)
```

- `choices` restricts the allowed values.
- `action="append"` collects repeated options into a list.
- `nargs="*"` accepts any number of values (`"+"` means at least one, and `"?"` means one or none).

## Errors and help

If the arguments are wrong, `argparse` prints a clear message and **exits** the program with an error code. The user also gets `--help` automatically, built from your descriptions:

```python
import io
from contextlib import redirect_stdout

parser = argparse.ArgumentParser(prog="report", description="Make a report")
parser.add_argument("filename", help="the file to read")
parser.add_argument("--top", type=int, default=5, help="rows to show (default: %(default)s)")

buffer = io.StringIO()
with redirect_stdout(buffer):
    try:
        parser.parse_args(["--help"])
    except SystemExit as error:
        print("exit code", error.code)
print(buffer.getvalue())
```

Good help text is part of a good program. `%(default)s` inserts the default value.

## Sub-commands

Programs such as `git` have **sub-commands**: `git commit`, `git push`. Each one has its own arguments:

```python
parser = argparse.ArgumentParser(prog="tool")
sub = parser.add_subparsers(dest="command", required=True)

add = sub.add_parser("add", help="add an item")
add.add_argument("name")
add.add_argument("--qty", type=int, default=1)

remove = sub.add_parser("remove", help="remove an item")
remove.add_argument("name")

print(parser.parse_args(["add", "pen", "--qty", "4"]))
print(parser.parse_args(["remove", "ink"]).command)
```

## Exit codes

A program tells the shell how it went with its **exit code**: `0` means success, and anything else means an error. Use `sys.exit(code)` at the end of `main`:

```python
import sys

def main(argv):
    if not argv:
        print("nothing to do")
        return 1
    print("working on", argv[0])
    return 0

try:
    sys.exit(main(["file.txt"]))
except SystemExit as error:
    print("would exit with", error.code)
```

A tidy program has a `main(argv=None)` function that returns an exit code, and calls it under the main guard: `if __name__ == "__main__": sys.exit(main())`. That makes it easy to test, because you can call `main([...])` with any list of arguments.

## Environment variables

Environment variables are settings that the operating system passes to every program, such as `HOME`, `PATH`, or your own `MYAPP_DEBUG`. They live in `os.environ`, which behaves like a dictionary of text:

```python
import os

os.environ["DEMO_LIMIT"] = "7"
limit = int(os.environ.get("DEMO_LIMIT", "3"))
print(limit)
print(os.environ.get("DEMO_MISSING", "not set"))
del os.environ["DEMO_LIMIT"]
```

Values are always **text**, so convert them. Use `get` with a default, because a missing variable would raise a `KeyError`. Environment variables are the usual way to give a program **secrets** such as passwords and tokens without writing them in the source code.

## Standard input and output

Programs can be **chained** in a terminal: the output of one becomes the input of the next (`cat data.txt | python count.py | sort`). For this, your program reads from `sys.stdin` and writes to `sys.stdout`, which is what `input` and `print` use:

```python
import io
import sys

def total(stream):
    return sum(float(line) for line in stream if line.strip())

print(total(io.StringIO("1.5\n2.5\n\n4\n")))
```

Writing the function so that it takes a **stream** makes it easy to test, and the same function can read `sys.stdin` in the real program. Send error messages to `sys.stderr`, so that they do not mix into the data flowing through the pipe:

```python
print("warning: skipped a blank line", file=sys.stderr)
```

## Common mistakes

- Parsing `sys.argv` by hand when `argparse` would do.
- Forgetting `type=int`, and comparing text with numbers.
- Calling `parse_args()` in code that you want to test. Pass a list instead.
- Printing errors to standard output rather than standard error.
- Forgetting that environment variables are always text.

## Recap

- `sys.argv` is the raw list. `argparse` gives you positional arguments, options, flags, types, defaults, choices, help and sub-commands.
- `parse_args(list)` makes a program testable. The result is a `Namespace`.
- Return an exit code from `main`, and use `sys.exit`.
- Read settings from `os.environ`, and data from `sys.stdin`.

## Your turn

In the **Practice** tab you write `parse_cli(argv)` with `argparse`. Then three challenges use the Chinook store.
