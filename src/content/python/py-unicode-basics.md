Sooner or later you will see a strange symbol in your data, such as `Ã©` where you expected `é`. Or you will find that a "single letter" has a length of 2. Both come from how computers store text. This lesson gives you the simple picture, so that those surprises stop being mysterious.

You will learn:

- what a character code is, and how `ord()` and `chr()` show it
- the difference between Unicode and an encoding such as UTF-8
- why the length of a string is not the same as its size in bytes
- why one visible character can be several code points

## Everything is a number

A computer stores numbers, so every character needs a number. The early standard, **ASCII**, gave a number from 0 to 127 to English letters, digits and punctuation. `ord()` gives the number of a character, and `chr()` goes the other way:

```python
print(ord("A"))
print(ord("a"))
print(chr(65))
print(chr(97))
```

Notice that a capital `A` (65) and a small `a` (97) are different numbers. That is why comparisons are case sensitive, and why capitals sort before lower-case letters.

## Unicode: a number for every character

ASCII has no `é`, no Greek `π`, no Chinese characters and no emoji. **Unicode** is a huge list that gives every character in the world's writing systems its own number, called a **code point**. Python strings are sequences of Unicode code points:

```python
print(ord("é"))
print(ord("π"))
print(chr(8364))
print("café")
```

`é` is how you write a code point by its hexadecimal number. This is why Python handles text from any language without extra work.

## Encoding: turning characters into bytes

Files and networks carry **bytes**, not characters. An **encoding** is a rule for turning code points into bytes and back. The most common one is **UTF-8**:

```python
text = "café"
data = text.encode("utf-8")
print(data)
print(len(text), len(data))
```

The string has 4 characters, but the bytes take 5, because UTF-8 uses two bytes for `é`. UTF-8 uses one byte for plain English letters, so English text looks the same in ASCII and UTF-8.

To go back, decode the bytes:

```python
data = b"caf\xc3\xa9"
data.decode("utf-8")
```

## Mojibake: using the wrong encoding

The strange `Ã©` that appears in bad data is called **mojibake**. It happens when bytes written in one encoding are read with another:

```python
data = "café".encode("utf-8")
print(data.decode("latin-1"))
```

The bytes are the same. Reading them as Latin-1 instead of UTF-8 produces garbage. When you open a file, say which encoding it uses, and prefer UTF-8.

## One visible character, many code points

Some characters can be written as a base letter plus a combining accent. They look identical, but their lengths differ:

```python
one = "é"
two = "é"
print(one, two)
print(len(one), len(two))
print(one == two)
```

Both print as `é`. The first is a single code point, and the second is `e` plus a combining accent. They are not equal, which can break a search or a comparison. Python's `unicodedata` module can convert both to the same form:

```python
import unicodedata

one = "é"
two = "é"
unicodedata.normalize("NFC", one) == unicodedata.normalize("NFC", two)
```

Emoji, flags and many accented letters are built from several code points, so `len()` counts code points, not what you see on screen.

## Common mistakes

- Assuming one character is always one byte.
- Reading a file with the wrong encoding and getting mojibake.
- Comparing text with combining characters without normalising it first.
- Assuming `len(text)` is the number of visible characters.

## Recap

- `ord()` and `chr()` convert between characters and their numbers.
- Unicode gives every character a code point. An encoding such as UTF-8 turns those into bytes.
- `len` counts characters, and encoded text can be longer in bytes.
- Wrong encodings produce mojibake, and `unicodedata.normalize` makes look-alike text equal.
