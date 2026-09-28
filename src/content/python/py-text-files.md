Reading and writing text files is one of the most useful skills in programming. This lesson covers `open`, the modes, how to read line by line, why you should use a `with` statement, and how to test file code without touching the disk.

You will learn:

- `open` and its modes
- the `with` statement and why it matters
- reading the whole file, one line at a time, or in chunks
- writing and appending
- encoding and new lines
- writing a file safely
- file-like objects and `io.StringIO` for testing

## Opening a file

`open(path, mode, encoding=...)` returns a **file object**. The most common modes:

| Mode | Meaning |
| ---- | ------- |
| `"r"` | read text (the default) |
| `"w"` | write text, **erasing** the file first |
| `"a"` | append text at the end |
| `"x"` | write, but fail if the file already exists |
| `"rb"`, `"wb"` | read and write **bytes** |

The temporary folder from the last lesson gives us a safe place to practise:

```python
import tempfile
from pathlib import Path

folder = Path(tempfile.mkdtemp())
path = folder / "poem.txt"

file = open(path, "w", encoding="utf-8")
file.write("Roses are red\n")
file.write("Violets are blue\n")
file.close()

print(path.read_text(encoding="utf-8"))
```

The file must be **closed**, so that everything is really saved and the operating system can release it. It is easy to forget, or to skip it when an error happens in the middle.

## The with statement

A `with` statement closes the file for you, **even if an error occurs**:

```python
with open(path, "a", encoding="utf-8") as file:
    file.write("Sugar is sweet\n")

print(file.closed)
```

After the block, `file.closed` is `True`. **Always use `with` for files.** The object after `as` is the file, and the code inside the block is the only place where it is open. This is called a **context manager**.

## Reading

There are several ways to read, depending on the size of the file:

```python
with open(path, encoding="utf-8") as file:
    everything = file.read()
print(len(everything))

with open(path, encoding="utf-8") as file:
    first = file.readline()
    rest = file.readlines()
print(repr(first))
print(len(rest))
```

- `read()` returns the whole content as one string.
- `readline()` returns the next line.
- `readlines()` returns a list of all lines.

For **big** files, do not load everything. A file is **iterable**, and gives one line at a time, so it needs almost no memory:

```python
with open(path, encoding="utf-8") as file:
    for number, line in enumerate(file, start=1):
        print(number, line.rstrip("\n"))
```

Each line keeps its `"\n"` at the end. `rstrip("\n")` (or `line.strip()`) removes it.

## Counting lines, words and characters

A small, classic task combines those ideas:

```python
def wc(text):
    lines = text.splitlines()
    words = text.split()
    return len(lines), len(words), len(text)

with open(path, encoding="utf-8") as file:
    print(wc(file.read()))
```

Notice that `wc` works on **text**, not on a file. That makes it easy to test. The function that opens the file is a thin layer around it.

## Writing lines

`write` does not add a newline. `writelines` writes a list of strings and does not add newlines either. `print(..., file=f)` does add one:

```python
lines = ["one", "two", "three"]
out = folder / "numbers.txt"

with open(out, "w", encoding="utf-8") as file:
    for line in lines:
        print(line, file=file)

print(out.read_text(encoding="utf-8").splitlines())
```

## Mode "w" erases

Opening with `"w"` **truncates** the file at once, before you write anything. Use `"a"` to add to the end, and `"x"` when you must not overwrite:

<!-- expect-error -->
```python
with open(out, "x", encoding="utf-8") as file:
    file.write("this fails: the file already exists")
```

## Encoding and new lines

Say the encoding, always. Otherwise Python uses the default of the computer, which differs between systems. For text files, `newline` controls how line endings are converted. The default (universal newlines) is right for text files. For CSV files, you will set `newline=""`, as the next lessons show.

```python
sample = folder / "unicode.txt"
sample.write_text("café ✓", encoding="utf-8")
print(sample.read_bytes())
print(sample.read_text(encoding="utf-8"))
```

## Writing safely

If your program crashes while it is writing, the file may be left half-written. A safe pattern writes into a **temporary file**, and then **renames** it over the real one. A rename is atomic on most systems:

```python
def save_text(path, text):
    path = Path(path)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(text, encoding="utf-8")
    temporary.replace(path)

save_text(folder / "settings.txt", "mode=fast\n")
print((folder / "settings.txt").read_text(encoding="utf-8"))
```

Readers of the file then see either the old version or the new one, and never a half-written one.

## File-like objects and StringIO

Many functions accept **any object that behaves like a file**. `io.StringIO` is a text buffer in memory, with the same methods. It is ideal for tests, because no disk is used:

```python
import io

def count_lines(file):
    return sum(1 for _ in file)

print(count_lines(io.StringIO("a\nb\nc\n")))
with open(path, encoding="utf-8") as real:
    print(count_lines(real))
```

The same function works with a real file and with a fake one. Design your functions to **take a file-like object** (or plain text), and not a file name, when you can.

## Common mistakes

- Forgetting to close the file, or not using `with`.
- Opening with `"w"` and erasing data that you wanted to keep.
- Forgetting `encoding="utf-8"`.
- Reading a huge file with `read()` when a loop over the lines would do.
- Forgetting that lines keep their new line character.

## Recap

- Use `with open(path, mode, encoding="utf-8") as file:` so the file is always closed.
- `read`, `readline`, `readlines`, or a loop over the file. The loop is best for big files.
- `"w"` erases, `"a"` appends and `"x"` refuses to overwrite.
- Write to a temporary file and rename, so the result is never half-written.
- `io.StringIO` is a fake file, which is great for tests.

## Your turn

In the **Practice** tab you write `wc(text)`, which counts lines, words and characters. Then three challenges use the Chinook store.
