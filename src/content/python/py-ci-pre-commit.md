A check that only runs when a developer remembers to run it will eventually be skipped. Continuous integration (CI) and pre-commit hooks exist to make quality checks automatic instead of optional.

This is a reading lesson: real CI pipelines and Git hooks need a real repository, a real CI service, and real commit events, none of which exist in this single-session browser playground. The ideas apply directly to any real project's repository settings.

You will learn:

- what a typical CI pipeline runs
- matrix builds across Python versions
- caching in CI
- pre-commit hooks
- branch protection
- reading a CI failure

## What CI runs

```text
# .github/workflows/ci.yml (conceptually)
- run: ruff check .
- run: ruff format --check .
- run: mypy .
- run: pytest
- run: python -m build
```

A typical pipeline runs the same checks a careful developer would run locally — lint, format-check, type-check, tests, and often a build check — automatically, on every push and every pull request, regardless of who made the change or what they remembered to run beforehand.

## Matrix builds

```text
# roughly: run the whole pipeline once per combination
python-version: ["3.11", "3.12", "3.13", "3.14"]
os: ["ubuntu-latest", "windows-latest", "macos-latest"]
```

If a library claims to support four Python versions across three operating systems, a matrix build is what actually verifies every combination on every change — catching a version- or platform-specific bug (a module that behaves differently on Windows, a feature only available since 3.12) before a user on that specific combination ever hits it.

## Caching in CI

```text
# roughly: cache the resolved dependency environment between runs,
# keyed by a hash of the lock file, so it only rebuilds when dependencies change
```

Reinstalling every dependency from scratch on every single run wastes real time, especially for a large dependency tree. Caching the installed environment (invalidated only when the lock file actually changes) keeps CI feedback fast without sacrificing correctness.

## pre-commit hooks

```text
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    hooks:
      - id: ruff
      - id: ruff-format
  - repo: https://github.com/pre-commit/pre-commit-hooks
    hooks:
      - id: check-added-large-files
```

Once installed (`pre-commit install`), these run automatically on every `git commit`, catching an obvious lint or formatting problem in seconds, locally — before it ever becomes a CI failure someone has to notice, investigate, and push a fix for.

## Branch protection

```text
# repository settings (conceptually):
# - require pull request reviews before merging
# - require status checks (CI) to pass before merging
# - do not allow force-pushes to this branch
```

Branch protection is what turns "CI should pass before merging" from a polite convention into an actually enforced rule — without it, anyone can merge (or push directly) regardless of whether checks passed.

## Reading a CI failure

A CI failure log usually tells you, in order: which *job* failed (lint? tests? build?), which specific *step* within that job, and then the actual error output from that tool — reading top-to-bottom for the first real error (rather than the last line of output, which is often just "command exited with code 1") is usually the fastest way to find the actual cause.

## Watch out: a green CI badge is not a correctness guarantee

CI only catches what its checks actually check for. A test suite with real gaps, or a codebase with no type checking configured, can have perfectly green CI while still shipping real bugs — CI raises the floor on quality, it does not raise it all the way to "correct."

## Common mistakes

- Skipping pre-commit locally and relying entirely on CI to catch every issue, turning every review into a slow fix-and-repush cycle.
- Testing against only one Python version when the project claims to support several.
- Reinstalling dependencies from scratch on every CI run instead of caching them.
- Treating a passing CI run as proof of correctness rather than proof that the *specific checks configured* passed.
