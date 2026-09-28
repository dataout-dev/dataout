Files and data are often **compressed**: to save space, to move faster over a network, or to bundle many files into one. Python's standard library can read and write the common formats: gzip for a single compressed file, zip for archives with many files, and tar for Unix-style bundles.

You will learn:

- compressing and decompressing bytes with `gzip`
- measuring the compression ratio
- reading and writing zip archives with `zipfile`
- a look at `tarfile`
- working in memory, without files
- streaming
- the zip-slip security problem

## gzip

`gzip` compresses a single stream of bytes. The simplest use is with bytes in memory:

```python
import gzip

text = ("The quick brown fox jumps over the lazy dog. " * 100).encode("utf-8")
packed = gzip.compress(text)
print(len(text), len(packed))
print(gzip.decompress(packed) == text)
```

Repeated text compresses very well. Random data barely compresses at all, and short text can even grow because of the header. The **compression ratio** is a handy number:

```python
ratio = len(packed) / len(text)
print(f"{ratio:.1%}")
```

## gzip files

`gzip.open` works like `open`, but it compresses or decompresses on the fly. Use `"wt"` and `"rt"` for text mode, with an encoding:

```python
import tempfile
from pathlib import Path

folder = Path(tempfile.mkdtemp())
path = folder / "notes.txt.gz"

with gzip.open(path, "wt", encoding="utf-8") as file:
    for i in range(3):
        file.write(f"line {i}\n")

with gzip.open(path, "rt", encoding="utf-8") as file:
    print(file.read().splitlines())

print(path.stat().st_size < 100)
```

Programs can read a compressed log file line by line, as if it were a normal one, and without unpacking it to the disk first.

## zip archives

A **zip** file holds **many files**, each compressed separately, with a directory of what is inside. `zipfile.ZipFile` opens one for reading (`"r"`), writing (`"w"`) or appending (`"a"`):

```python
import zipfile

archive = folder / "bundle.zip"
with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as bundle:
    bundle.writestr("readme.txt", "hello archive")
    bundle.writestr("data/one.csv", "a,b\n1,2\n")
    bundle.writestr("data/two.csv", "a,b\n3,4\n")

with zipfile.ZipFile(archive) as bundle:
    print(bundle.namelist())
    print(bundle.read("readme.txt").decode("utf-8"))
    for info in bundle.infolist():
        print(info.filename, info.file_size, info.compress_size)
```

`writestr` adds a file from data in memory, and `write(path)` adds a file from the disk. `namelist` lists the names inside, `read(name)` returns the bytes, and `open(name)` returns a file-like object for streaming.

## Extracting

`extract` and `extractall` write the files to a folder:

```python
target = folder / "unpacked"
with zipfile.ZipFile(archive) as bundle:
    bundle.extractall(target)

print(sorted(str(p.relative_to(target)) for p in target.rglob("*") if p.is_file()))
```

## Zip in memory

The archive does not need a real file. Any file-like object works, so you can build a zip in a `BytesIO` and send it over a network, or use it in a test:

```python
import io

buffer = io.BytesIO()
with zipfile.ZipFile(buffer, "w") as bundle:
    bundle.writestr("a.txt", "alpha")
    bundle.writestr("b.txt", "beta")

print(len(buffer.getvalue()) > 0)
with zipfile.ZipFile(io.BytesIO(buffer.getvalue())) as bundle:
    print({name: bundle.read(name) for name in bundle.namelist()})
```

## tar

**Tar** bundles many files into one, mostly on Linux and macOS. It is often combined with gzip to make `.tar.gz` files. `tarfile` reads and writes them:

```python
import tarfile

tar_path = folder / "bundle.tar.gz"
with tarfile.open(tar_path, "w:gz") as tar:
    info = tarfile.TarInfo("hello.txt")
    content = b"hello tar"
    info.size = len(content)
    tar.addfile(info, io.BytesIO(content))

with tarfile.open(tar_path, "r:gz") as tar:
    print(tar.getnames())
    print(tar.extractfile("hello.txt").read())
```

## Streaming

Do not read a big compressed file all at once. Loop over it, or read it in blocks, so that only a small part is in memory:

```python
with gzip.open(path, "rt", encoding="utf-8") as file:
    count = sum(1 for _ in file)
print(count)
```

## Zip-slip: a security warning

An archive stores the **names** of its files, and a hostile archive can use names like `../../etc/passwd`. If a program blindly extracts it, files are written **outside** the target folder, over important files. This is the **zip-slip** attack. A careful program checks each name before extracting:

```python
def safe_names(names, target):
    target = Path(target).resolve()
    safe = []
    for name in names:
        destination = (target / name).resolve()
        if destination == target or target in destination.parents:
            safe.append(name)
    return safe

print(safe_names(["ok.txt", "sub/file.txt", "../evil.txt", "/etc/passwd"], folder))
```

Recent versions of Python's `extractall` also protect against some of this, and the `tarfile` module has extraction **filters** for the same reason. Even so, **never extract an archive from an untrusted source without checking it**. Another risk is a **zip bomb**, a tiny archive that expands to terabytes. Check the sizes first (`info.file_size`).

## Common mistakes

- Using text mode on a compressed file and forgetting the encoding, or using binary mode and getting bytes.
- Expecting every file to shrink. Already compressed files (JPEG, MP4, zip) do not.
- Extracting untrusted archives without checking the names.
- Reading a huge compressed file completely into memory.

## Recap

- `gzip.compress` and `decompress` handle bytes. `gzip.open(path, "rt")` reads and writes compressed text.
- `zipfile.ZipFile` reads, writes and lists archives with many files, in memory or on disk.
- `tarfile` handles `.tar.gz` bundles.
- Stream large files, and never extract untrusted archives without checking the names and sizes.

## Your turn

In the **Practice** tab you write `gzip_ratio(text)`. Then three challenges use the Chinook store.
