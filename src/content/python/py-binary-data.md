Not all data is text. Images, music, compressed files and network messages are **binary**: sequences of bytes that only make sense with the right rules. This lesson introduces the tools for reading and writing bytes, packing numbers into them, encoding them safely as text, fingerprinting them, and the one tool that you should treat with great care: `pickle`.

You will learn:

- `bytes` and `bytearray`
- reading and writing binary files
- `struct` for packing numbers into bytes
- endianness
- `base64` for text-safe encoding
- `hashlib` for fingerprints
- `pickle`, and why never to unpickle untrusted data

## bytes and bytearray

A `bytes` object is an **immutable** sequence of numbers from 0 to 255. A `bytearray` is the **changeable** version:

```python
data = b"Hi!"
print(data, len(data), list(data))
print(data[0], data[0:2])
print(bytes([72, 105, 33]))

buffer = bytearray(b"abc")
buffer[0] = 65
buffer.extend(b"def")
print(buffer, bytes(buffer))
```

Notice that indexing gives a **number**, not a one-byte object, and slicing gives `bytes`. Bytes have many of the methods of strings: `find`, `split`, `startswith`, `replace` and more. You can also write them in hexadecimal:

```python
print(bytes.fromhex("48 69 21"))
print(b"Hi!".hex())
print(b"Hi!".hex(" "))
```

## Binary files

Open a file with `"rb"` or `"wb"` to read and write bytes. There is no encoding, and no newline translation:

```python
import tempfile
from pathlib import Path

folder = Path(tempfile.mkdtemp())
path = folder / "data.bin"

with open(path, "wb") as file:
    file.write(bytes(range(10)))

with open(path, "rb") as file:
    first = file.read(4)
    rest = file.read()

print(first, rest)
print(path.stat().st_size)
```

`read(4)` reads at most four bytes, which is how you process a large file in blocks. Many file formats start with a few **magic bytes**, so a program can recognise them: PNG images begin with `\x89PNG`, and ZIP archives with `PK`.

## struct: numbers as bytes

The `struct` module converts between Python values and **packed bytes** with a fixed layout, as used by file formats and network protocols. A **format string** describes the layout:

```python
import struct

packed = struct.pack(">HH", 258, 3)
print(packed)
print(struct.unpack(">HH", packed))
print(struct.calcsize(">HH"))
```

Format characters include `B` (1 byte), `H` (2 bytes), `I` (4 bytes), `Q` (8 bytes), lower case for signed numbers, `f` and `d` for floats, and `s` for bytes. The first character sets the **byte order**.

## Endianness

A number that takes several bytes can be stored with its **most significant byte first** (big-endian, `>`), or its **least significant byte first** (little-endian, `<`). Network protocols use big-endian, and most computers use little-endian inside. Both sides must agree:

```python
print(struct.pack(">I", 1))
print(struct.pack("<I", 1))
print(int.from_bytes(b"\x00\x00\x01\x00", "big"))
print(int.from_bytes(b"\x00\x00\x01\x00", "little"))
print((258).to_bytes(2, "big"), (258).to_bytes(2, "little"))
```

Using the wrong byte order gives a wrong number, but no error, which makes this a nasty bug.

## base64: bytes as text

Some places, such as e-mail, JSON and URLs, can only carry text. **Base64** encodes any bytes using only letters, digits, `+` and `/`. It makes the data about a third bigger:

```python
import base64

encoded = base64.b64encode(b"Hello, \x00\xff bytes!")
print(encoded)
print(encoded.decode("ascii"))
print(base64.b64decode(encoded))
print(base64.urlsafe_b64encode(b"\xfb\xff\xfe"))
```

Base64 is **encoding**, not encryption. Anyone can decode it.

## hashlib: fingerprints

A **hash function** turns any data into a short, fixed-length fingerprint. The same data always gives the same hash, and a tiny change gives a completely different one. Hashes verify that a download is intact, and detect duplicate files:

```python
import hashlib

print(hashlib.sha256(b"hello").hexdigest())
print(hashlib.sha256(b"hellO").hexdigest()[:16])
print(hashlib.md5(b"hello").hexdigest())

hasher = hashlib.sha256()
for block in (b"hel", b"lo"):
    hasher.update(block)
print(hasher.hexdigest() == hashlib.sha256(b"hello").hexdigest())
```

The `update` form lets you hash a big file block by block. Use **SHA-256** (or better) for anything that matters. `md5` and `sha1` are broken for security, and are only acceptable for detecting accidental changes. **Never store passwords with a plain hash.** Use a dedicated function such as `hashlib.scrypt` or a library that is made for it.

## pickle: handle with care

`pickle` converts almost **any Python object** into bytes and back:

```python
import pickle

original = {"numbers": (1, 2, 3), "tags": {"a", "b"}, "nested": [1.5, None]}
blob = pickle.dumps(original)
print(type(blob).__name__, len(blob) > 10)
print(pickle.loads(blob) == original)
```

This is handy for caching your own data. But **unpickling can run any code**. A crafted pickle file executes commands on your computer as soon as you load it. So the rule is absolute: **never unpickle data that comes from an untrusted source**. For data that others will read, use JSON or another plain format.

## Common mistakes

- Opening a binary file in text mode, or the other way round.
- Mixing up byte orders when you pack numbers.
- Treating base64 as if it were encryption.
- Using MD5 or a plain hash for passwords.
- Loading a pickle file from an untrusted source.

## Recap

- `bytes` is immutable and `bytearray` changeable. Indexing gives numbers.
- Use `"rb"` and `"wb"` for binary files.
- `struct.pack` and `unpack` convert between values and bytes. The first character of the format sets the byte order.
- `base64` makes bytes safe as text. `hashlib` makes fingerprints.
- Never unpickle untrusted data.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
