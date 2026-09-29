Tests check behaviour. A whole other category of tool checks the code itself, before it even runs: style, likely bugs, import order, and complexity that makes a function hard to reason about.

This is a reading lesson: linters, formatters and pre-commit hooks are command-line tools that need a real project directory and terminal, which this browser-based playground does not have. The ideas apply directly the first time you set one up in a real repository.

You will learn:

- PEP 8 and what a linter actually checks
- ruff and black, and how a linter differs from a formatter
- import sorting
- complexity checks
- pre-commit hooks
- running these tools in CI

## PEP 8 and linters

PEP 8 is Python's style guide: naming conventions, whitespace, line length, and more. A linter like `ruff` (or the older `flake8`) checks a codebase against rules like these automatically, flagging violations — and, importantly, also flagging likely *bugs*: an unused import, a variable assigned but never read, a comparison that is always true.

```text
$ ruff check .
pricing.py:12:1: F401 'json' imported but unused
pricing.py:30:5: E712 comparison to True should be 'if cond is True:' or 'if cond:'
```

## ruff and black: linter vs formatter

A **linter** reports problems for a human to act on; a **formatter** like `black` rewrites the code into one consistent style automatically, with no configuration debate to have — black has very few options on purpose. Running `black .` before every commit means nobody argues about where to put a trailing comma ever again.

```text
$ black .
reformatted pricing.py
1 file reformatted.
```

Many teams run both: `ruff` for correctness-flavoured issues, `black` (or `ruff format`) purely for layout.

## Import sorting

A linter or a dedicated tool (`isort`, or `ruff`'s own import-sorting rules) enforces a consistent order for imports — standard library, then third-party, then local — so that import blocks stop being a source of noisy, unrelated diffs in every pull request.

## Complexity checks

A cyclomatic-complexity check counts the number of independent paths through a function — every `if`, `for`, `while`, `and`, `or` adds one. A function that scores very high on this metric usually has so many branches that no single test can realistically exercise all the combinations, which is exactly the kind of function most likely to hide an untested bug.

## pre-commit hooks

```text
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    hooks:
      - id: ruff
      - id: ruff-format
```

Once installed, these hooks run automatically every time you attempt a commit, blocking it if a check fails. This catches an obvious style or lint issue *before* it enters version-control history at all, rather than in a later, more annoying round-trip through code review.

## Running tools in CI

Running the same checks in continuous integration matters even when every developer has pre-commit installed locally, because a hook can be skipped (`git commit --no-verify`) or simply never installed on someone's machine. CI is the one gate every change has to pass, regardless of what any individual contributor remembered to set up.

```text
# a CI step, roughly
- run: ruff check .
- run: ruff format --check .
- run: pytest
```

## Watch out: fighting the formatter

```text
# don't manually re-format code a formatter already owns —
# your hand-tuned spacing will just get overwritten (and cause a noisy diff) on the next run
def f(a,   b ):
    return a+b
```

Once a formatter is adopted, manual reformatting is wasted effort and a common source of merge noise. Configure the tool, run it, and stop thinking about layout — that is the entire point of adopting one.

## Common mistakes

- Treating a linter's suggestions as optional style opinions rather than fixing the genuine bugs it also reports (unused variables, always-true comparisons).
- Skipping pre-commit locally and relying only on CI to catch problems, turning every review into a slow "please fix formatting" round-trip.
- Letting import order or spacing devolve into per-developer preference instead of a single, automatically enforced standard.
- Ignoring a high complexity warning on a function that keeps attracting bugs, instead of splitting it into smaller pieces.
