A program often needs to find files: to read a data file, to save a report, to look for every image in a folder. Python has a modern tool for this, `pathlib`, that treats a path as an **object** with useful methods, instead of a string that you have to cut and glue by hand.

You will learn:

- how to build a path with `Path` and the `/` operator
- the parts of a path: `name`, `stem`, `suffix`, `parent`
- how to ask about a path: `exists`, `is_file`, `is_dir`
- how to list and search folders: `iterdir`, `glob`, `rglob`
- reading and writing small files through a path
- how `os.path` fits in
- why you should not hard-code path separators

## A note about the playground

The code in this course runs in your browser. It has its own **private, temporary** file system, separate from your computer, and everything you write there disappears when you reload the page. That is safe, and it means we can try every example with real files. On your own computer, the code works the same way, but with your real folders.

The examples here create a temporary folder with the `tempfile` module, and work inside it.

## Path objects

```python
from pathlib import Path

report = Path("data") / "reports" / "sales.csv"
print(report)
print(type(report).__name__)
```

The `/` operator joins parts. It uses the right separator for the operating system, so the same code works on Windows (`\`) and on Linux and macOS (`/`). Never build paths by gluing strings with `"/"` or `"\\"`.

## The parts of a path

A `Path` knows its own structure:

```python
p = Path("data/reports/sales.2024.csv")
print(p.name)
print(p.stem)
print(p.suffix)
print(p.suffixes)
print(p.parent)
print(p.parts)
```

- `name` is the last part, with its extension.
- `stem` is the name without the **last** suffix.
- `suffix` is the extension, with the dot.
- `parent` is the folder that holds it.

To make a new path from an old one, use `with_name`, `with_suffix` and `with_stem`:

```python
print(p.with_suffix(".txt"))
print(p.with_name("summary.csv"))
print(p.with_stem("sales_clean"))
```

They do not touch any file. They only build a new path.

## Asking questions

```python
import tempfile

folder = Path(tempfile.mkdtemp())
notes = folder / "notes.txt"
notes.write_text("first line\nsecond line\n", encoding="utf-8")

print(notes.exists(), notes.is_file(), notes.is_dir())
print(folder.is_dir())
print((folder / "missing.txt").exists())
print(notes.stat().st_size)
```

`exists`, `is_file` and `is_dir` do not raise errors for a missing path. They answer `False`.

## Making folders

```python
sub = folder / "archive" / "2024"
sub.mkdir(parents=True, exist_ok=True)
print(sub.is_dir())
```

`parents=True` creates the missing folders on the way, and `exist_ok=True` means no error if it is already there.

## Listing folders

`iterdir()` lists what is directly inside a folder. `glob(pattern)` finds the entries that match a pattern, and `rglob` searches **every level below**:

```python
(folder / "a.csv").write_text("x")
(folder / "b.csv").write_text("y")
(folder / "archive" / "old.csv").write_text("z")

print(sorted(p.name for p in folder.iterdir()))
print(sorted(p.name for p in folder.glob("*.csv")))
print(sorted(p.name for p in folder.rglob("*.csv")))
print(sorted(str(p.relative_to(folder)) for p in folder.rglob("*.csv")))
```

The order of `iterdir` is not guaranteed, so use `sorted` when it matters. `relative_to` shows a path relative to the folder, which is easier to read.

## Reading and writing small files

`Path` has shortcuts for whole-file reads and writes:

```python
data = folder / "hello.txt"
data.write_text("Hello, café!\n", encoding="utf-8")
print(data.read_text(encoding="utf-8"))
print(data.read_bytes())
```

Always give the `encoding`, as the unicode lesson explained. For big files, you read line by line with `open`, which the next lesson covers.

## Changing and removing

```python
target = folder / "renamed.txt"
data.rename(target)
print(data.exists(), target.exists())
target.unlink()
print(target.exists())
```

`unlink` deletes a file. Use `rmdir` for an **empty** folder. To remove a whole tree, `shutil.rmtree` exists, but be careful, because there is no undo.

## os.path

Older code uses the `os.path` functions on plain strings:

```python
import os.path

print(os.path.join("data", "sales.csv"))
print(os.path.splitext("archive.tar.gz"))
print(os.path.basename("/a/b/c.txt"), os.path.dirname("/a/b/c.txt"))
```

It does the same jobs. You will read it in other people's code, but for new code `pathlib` is clearer.

## The current folder and the home folder

```python
print(Path.cwd().is_absolute())
print(Path("data/../data/x.csv").resolve().is_absolute())
print(Path("~").expanduser().is_absolute())
```

`resolve()` turns a path into an absolute one and simplifies `..`. A **relative** path depends on where the program runs, which is a common source of "file not found" errors.

## Common mistakes

- Building paths with string concatenation and hard-coded `/` or `\`.
- Depending on the current folder without knowing what it is.
- Forgetting that `with_suffix` only builds a path and does not rename the file.
- Deleting with `rmtree` without checking the path first.

## Recap

- `Path("a") / "b"` builds paths that work on every operating system.
- `name`, `stem`, `suffix` and `parent` take a path apart. `with_suffix` and friends build new ones.
- `exists`, `is_file` and `is_dir` ask questions. `iterdir`, `glob` and `rglob` list and search.
- `read_text` and `write_text` handle small files. Always say the `encoding`.

## Your turn

In the **Practice** tab you write `suffixed(name, suffix)`, which adds a suffix before the extension. Then three challenges use the Chinook store.
