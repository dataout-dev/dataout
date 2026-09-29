A script that only ever runs with hard-coded values is not really a tool yet — a real command-line application accepts arguments, validates them, and fails clearly when given something it cannot handle.

You will learn:

- designing a CLI's shape before coding it
- sub-commands with argparse
- validation and help text
- exit codes
- reading stdin, briefly
- testing a CLI by passing argv directly
- click and typer, briefly

## Designing a CLI

Before writing any `argparse` code, it helps to write out the commands as a user would actually type them: `mytool add 2 3`, `mytool list --limit 5`. This upfront design catches awkward shapes (should `--limit` be positional? should `add` really be a sub-command, or a flag?) far more cheaply than discovering them after the parser is half-built.

## Sub-commands with argparse

```python
import argparse

parser = argparse.ArgumentParser(prog="mytool")
sub = parser.add_subparsers(dest="command")

add_parser = sub.add_parser("add", help="Add two numbers")
add_parser.add_argument("x", type=int)
add_parser.add_argument("y", type=int)

list_parser = sub.add_parser("list", help="List items")
list_parser.add_argument("--limit", type=int, default=10)

args = parser.parse_args(["add", "2", "3"])
print(vars(args))
```

`add_subparsers` is how a single program supports distinct commands (`git commit`, `git push`) each with their own arguments — `dest="command"` records which sub-command was actually chosen, alongside that sub-command's own parsed arguments.

## Validation and help text

```python
import argparse

parser = argparse.ArgumentParser(description="A tiny demo tool.")
parser.add_argument("count", type=int, help="How many items to process")
parser.add_argument("--verbose", action="store_true", help="Print extra detail")

args = parser.parse_args(["5", "--verbose"])
print(args.count, args.verbose)
```

`type=int` validates and converts in one step — passing a non-numeric string raises a clear parsing error automatically, with no manual `try`/`except` needed in your own code. `help=` text feeds directly into the auto-generated `--help` output, which is worth writing even for a tool only you will ever run.

## Exit codes

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("n", type=int)

try:
    args = parser.parse_args(["not-a-number"])
except SystemExit as e:
    print(f"argparse exited with code {e.code}")
```

A failed parse calls `sys.exit(2)` internally (raising `SystemExit`, which is normally allowed to propagate and actually exit the process) — by convention, `0` means success and any non-zero code signals failure to whatever shell or script invoked the program, which is how shell scripts chain commands together (`mytool && next_step`, which only runs `next_step` if `mytool` exited `0`).

## Reading stdin, briefly

```python
import sys

# for line in sys.stdin:
#     process(line)
```

A well-behaved command-line tool often accepts input either as an argument or, if none is given, from `stdin` — letting it be used both standalone and piped: `cat data.txt | mytool`.

## Testing a CLI by passing argv

```python
import argparse

def build_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument("n", type=int)
    return parser

def test_parses_positive_number():
    args = build_parser().parse_args(["5"])
    assert args.n == 5

test_parses_positive_number()
print("CLI test passed")
```

Structuring the parser-building code as its own function (rather than only at module import time) is what makes a CLI testable at all — a test calls `parse_args([...])` directly with a real `argv`-shaped list, no actual subprocess or terminal involved.

## click and typer, briefly

`argparse` is in the standard library and requires no dependency, at the cost of a more verbose API. `click` and `typer` are popular third-party alternatives — `click` uses decorators to define commands and options; `typer` (built on click) derives the CLI almost entirely from ordinary type-hinted function signatures, trading a small dependency for noticeably less boilerplate on a larger CLI.

## Watch out: parsing sys.argv by hand

```python
import sys

# args = sys.argv[1:]
# if args[0] == "add":
#     x = int(args[1])
#     ...
```

Hand-rolling argument parsing re-implements (usually worse) everything `argparse` already gives you for free: help text, type conversion and validation, clear error messages, and consistent `--flag`/`-f` handling — worth reaching for a real parser even for a "quick" script.

## Common mistakes

- Forgetting `type=int` (or similar) and comparing an argument that is actually still a string.
- Hand-parsing `sys.argv` instead of using `argparse`, `click`, or `typer`.
- Never testing a CLI by passing a real `argv` list, only by running it manually in a terminal.
- Ignoring the exit code a CLI produces, breaking any shell script that depends on it to detect failure.
