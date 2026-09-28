Almost every real Python project uses libraries written by other people. This lesson explains how to install them safely, why every project should have its **own** isolated environment, and how to record what a project needs, so that anyone can rebuild it. The commands here are run in a **terminal on your own computer**, not in the browser playground, so the examples are shown as text.

You will learn:

- why virtual environments exist
- creating and activating one with `venv`
- installing and removing packages with `pip`
- `requirements.txt`, and why to pin versions
- `pyproject.toml` basics
- newer tools: `uv` and `pipx`
- the danger of installing into the global Python

## The problem

Imagine two projects on one computer. Project A needs version 1 of a library, and project B needs version 2. If there is only one place where libraries are installed, one of the projects breaks. Worse, installing a library globally can break tools that your operating system depends on.

The answer is a **virtual environment**: a private folder with its own Python and its own set of installed packages, for one project only.

## Creating an environment

The `venv` module ships with Python. From your project folder, in a terminal:

```text
python -m venv .venv
```

This makes a folder called `.venv`. The name is a convention, and most editors and tools look for it. Add the folder to `.gitignore`, because it should never go into version control.

## Activating it

Activation tells your terminal to use the Python and the tools from that folder:

```text
# macOS and Linux
source .venv/bin/activate

# Windows (PowerShell)
.venv\Scripts\Activate.ps1
```

Your prompt then shows `(.venv)`. To leave the environment, run `deactivate`. You can also skip activation and call `.venv/bin/python` directly.

From inside a running program, you can check whether it is in an environment:

```python
import sys

print(sys.prefix != sys.base_prefix or "not in a venv, or this is the playground")
```

## Installing packages with pip

`pip` is the package installer. It downloads libraries from the **Python Package Index** (PyPI):

```text
python -m pip install requests
python -m pip install "requests>=2.31,<3"
python -m pip install --upgrade requests
python -m pip uninstall requests
python -m pip list
python -m pip show requests
```

Prefer `python -m pip` to plain `pip`. It makes sure that the `pip` belonging to *that* Python is used.

## Recording what you need: requirements.txt

`pip freeze` lists every installed package with its **exact version**. Save it to a file, and anyone can rebuild the same environment:

```text
python -m pip freeze > requirements.txt
python -m pip install -r requirements.txt
```

A `requirements.txt` looks like this:

```text
requests==2.32.3
rich==13.7.1
pandas>=2.2,<3
```

## Why pin versions?

Without a fixed version, `pip install rich` installs **today's** latest release, and the project can behave differently next month, or on a colleague's computer. **Pinning** with `==` makes the environment reproducible. The cost is that you must update deliberately. Many teams keep two files: a short list of the direct requirements, and a fully pinned lock file that is generated from it.

## pyproject.toml

Modern projects describe themselves in a file called `pyproject.toml`, in the TOML format that you met earlier:

```text
[project]
name = "shop-tools"
version = "0.1.0"
description = "Small tools for a shop"
requires-python = ">=3.11"
dependencies = [
    "requests>=2.31",
    "rich",
]

[project.optional-dependencies]
dev = ["pytest", "ruff"]
```

It holds the name, version, the needed Python version, the dependencies, and the settings of tools such as formatters and test runners. You can install a project from a folder that contains one with `python -m pip install .`, and install it in editable mode while you work on it with `python -m pip install -e .`.

## uv and pipx

Two newer tools are worth knowing:

- **`uv`** is a very fast replacement for `pip` and `venv`, with its own project management (`uv init`, `uv add requests`, `uv run script.py`).
- **`pipx`** installs **command-line applications** (such as formatters and linters) each in its own environment, so they do not disturb your projects: `pipx install ruff`.

## Never install into the global Python

If you run `pip install` without an active environment, the package goes into the **system-wide** Python. This can break tools that need a certain version, cause permission errors, and make it impossible to know which project needs what. Modern Linux systems even refuse to do it, with a message about an "externally managed environment". The answer is always the same: **create a virtual environment first.**

## A checklist for a new project

1. Create a folder, and `python -m venv .venv`.
2. Activate it.
3. `python -m pip install` what you need.
4. `python -m pip freeze > requirements.txt`, or write a `pyproject.toml`.
5. Add `.venv/` to `.gitignore`.
6. Write in the README how to rebuild the environment.

## Common mistakes

- Installing packages without an active environment.
- Committing the `.venv` folder.
- Forgetting to update `requirements.txt` after installing something.
- Not pinning versions, and then finding that the project breaks on another computer.
- Mixing up two Pythons: the one that runs your program and the one that `pip` installs into.

## Recap

- A virtual environment gives each project its own Python and packages.
- `python -m venv .venv`, activate it, and use `python -m pip install`.
- `requirements.txt` and `pip freeze` (or `pyproject.toml`) make the environment reproducible. Pin versions.
- `uv` and `pipx` are useful newer tools.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
