Computers store numbers, not letters. Every time a program shows or saves text, something must decide which numbers stand for which characters. Getting this wrong produces the strange symbols people call "mojibake", for example `Ã©` where you expected `é`. This lesson explains the difference between text (`str`) and data (`bytes`), and how to move between them safely.

You will learn:

- the difference between `str` and `bytes`
- how `encode` and `decode` convert between them
- the common encodings: UTF-8, Latin-1 and ASCII
- what to do with characters that do not fit (`errors=`)
- why one visible letter can have two different representations, and how normalisation fixes that
- how mojibake happens, and how to repair it

## Text is not bytes

A `str` is a sequence of **characters** (more exactly, Unicode code points). A `bytes` object is a sequence of **numbers from 0 to 255**. They are different types, and Python will not mix them:

```python
text = "café"
data = text.encode("utf-8")
print(text, len(text))
print(data, len(data))
print(type(text), type(data))
```

The word `café` has 4 characters but 5 bytes, because in UTF-8 the letter `é` needs two bytes.

## Encoding and decoding

- `text.encode(encoding)` turns text into bytes.
- `data.decode(encoding)` turns bytes back into text.

The rule to remember: **decode when data comes in, encode when data goes out, and work with `str` in between.**

```python
data = "naïve café".encode("utf-8")
print(data)
print(data.decode("utf-8"))
```

## Which encoding?

- **ASCII** has only 128 characters: English letters, digits and punctuation.
- **Latin-1** (also called ISO-8859-1) has 256 characters, one byte each, and covers Western European letters.
- **UTF-8** can represent **every** character in Unicode, using 1 to 4 bytes each. It is the standard for the web, and the right default.

```python
for encoding in ("utf-8", "latin-1", "utf-16"):
    print(encoding, len("é".encode(encoding)))
```

## Characters that do not fit

Not every encoding can hold every character. The `errors` argument decides what happens:

<!-- expect-error -->
```python
"Zoë".encode("ascii")
```

By default, `errors="strict"` raises a `UnicodeEncodeError`. You can choose another rule:

```python
word = "Zoë ✓"
print(word.encode("ascii", errors="replace"))
print(word.encode("ascii", errors="ignore"))
print(word.encode("ascii", errors="backslashreplace"))
print(word.encode("ascii", errors="xmlcharrefreplace"))
```

`ignore` loses information silently, so use it with care. `strict` is the safest.

Decoding has the same choices. Bytes that are not valid in the chosen encoding raise a `UnicodeDecodeError`:

<!-- expect-error -->
```python
b"caf\xe9".decode("utf-8")
```

The byte `\xe9` is `é` in Latin-1, but it is not a valid UTF-8 sequence.

## Mojibake

**Mojibake** happens when bytes are decoded with the *wrong* encoding. Here UTF-8 bytes are read as Latin-1:

```python
original = "café"
wrong = original.encode("utf-8").decode("latin-1")
print(wrong)
```

The damage is often reversible: run the steps backwards.

```python
repaired = wrong.encode("latin-1").decode("utf-8")
print(repaired)
```

The best fix is prevention. Always know the encoding of your data, and always state it when you open a file. In the files lesson later in this tier you will pass `encoding="utf-8"` to `open`.

## Code points

Every character has a number, its **code point**. `ord` gives the number and `chr` reverses it:

```python
print(ord("A"), ord("é"), ord("€"))
print(chr(9731))
print("é", "\N{GREEK SMALL LETTER PI}")
```

## One letter, two representations

The visible letter `é` can be stored as **one** code point (`U+00E9`), or as `e` followed by a **combining accent** (`U+0301`). They look the same, but they are not equal:

```python
one = "é"
two = "é"
print(one, two)
print(one == two)
print(len(one), len(two))
```

The `unicodedata` module can **normalise** text so that both forms become the same. `NFC` composes characters into single code points, and `NFD` decomposes them:

```python
import unicodedata

def same_text(a, b):
    return unicodedata.normalize("NFC", a) == unicodedata.normalize("NFC", b)

print(same_text(one, two))
print(len(unicodedata.normalize("NFD", one)))
```

A common trick to remove accents is to decompose, and then drop the combining marks:

```python
def strip_accents(text):
    decomposed = unicodedata.normalize("NFD", text)
    return "".join(ch for ch in decomposed if not unicodedata.combining(ch))

print(strip_accents("Ångström café"))
```

## Case in other languages

For comparing text without regard to case, use `casefold()`, which handles more languages than `lower()`:

```python
print("Straße".lower(), "Straße".casefold())
print("STRASSE".casefold() == "Straße".casefold())
```

## Common mistakes

- Opening files without stating an encoding, and getting different results on different computers.
- Treating `len` of text as its size in bytes.
- Using `errors="ignore"` and silently losing characters.
- Comparing text from different sources without normalising it.

## Recap

- `str` is text and `bytes` is data. Convert with `encode` and `decode`.
- Use UTF-8 unless you have a reason not to. Always state the encoding.
- `errors=` chooses what happens with characters that do not fit.
- Wrong decoding gives mojibake. Reverse the steps to repair it.
- Normalise (`NFC`) before comparing text, and use `casefold` to ignore case.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
