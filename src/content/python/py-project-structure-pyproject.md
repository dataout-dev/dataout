A script you run with `python myfile.py` and a real, installable Python package look almost nothing alike on disk. This lesson is a map of the structure and configuration a project grows into once other people (or your future self, in six months) need to install and depend on it reliably.

This is a reading lesson: project structure, packaging metadata and lock files are about a real project directory and a real package index, which this single-file browser playground does not have. The ideas apply directly the first time you turn a script into a real package.

You will learn:

- the src layout, and what it actually protects against
- `pyproject.toml` as the standard metadata file
- dependencies and extras
- entry points
- version pinning and lock files

## The src layout

```text
myproject/
├── pyproject.toml
├── src/
│   └── mypackage/
│       ├── __init__.py
│       └── core.py
└── tests/
    └── test_core.py
```

Putting the package under `src/` instead of directly in the project root means running `pytest` from the project root cannot accidentally import `mypackage` straight from the source tree — it has to find the *installed* version instead. Without `src/`, a broken packaging configuration can go unnoticed for a long time, since tests keep passing against local files regardless of whether the package would actually work once installed elsewhere.

## pyproject.toml

```text
[project]
name = "mypackage"
version = "0.1.0"
dependencies = [
    "requests>=2.28",
]

[project.optional-dependencies]
dev = ["pytest", "ruff"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

This one file replaces what used to be spread across `setup.py`, `setup.cfg`, and various tool-specific config files — project metadata, dependencies, and which build backend to use, all in one standard, tool-agnostic format.

## Dependencies and extras

`dependencies` lists what every install needs. `optional-dependencies` (extras) group together dependencies most users do not need — testing tools, documentation generators, an optional database driver — installed only on request: `pip install mypackage[dev]`.

## Entry points

```text
[project.scripts]
mytool = "mypackage.cli:main"
```

This registers a real command-line program: after `pip install`, typing `mytool` on the command line runs `mypackage.cli.main()` — the user never needs to know or care about that underlying module path.

## Version pinning and lock files

```text
dependencies = ["requests>=2.28,<3"]
```

A version *range* like this in `pyproject.toml` says "anything compatible is fine" — but two installs on different days can still resolve to different exact versions within that range. A lock file (produced by `uv`, `pip-tools`, `poetry`, and similar tools) pins the *exact* resolved versions that were actually installed and tested, so a CI run today and a teammate's install next month get identical dependencies.

## Watch out: skipping the lock file for "simple" projects

A project with no lock file can pass CI today and fail tomorrow purely because a dependency released a new version in between — with no code change on your part at all. Committing a lock file (and installing from it in CI) is what makes "it works on my machine" less likely to become "it broke in CI for no reason I can see."

## Common mistakes

- Skipping the src layout and having tests accidentally pass against local files that would never actually work once packaged.
- Cramming every dependency (including development-only tools) into the main `dependencies` list instead of an extra.
- Forgetting to commit a lock file, letting dependency versions silently drift between environments.
- Registering an entry point that points at a function which does not actually exist, only discovering the mistake after a real install.
