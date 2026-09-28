Now that you can take text apart, you can solve classic text puzzles. These are small, well-known problems: palindromes, anagrams, run-length encoding and simple ciphers. They are popular in interviews, but they also teach patterns you will use again and again: scanning from both ends, using a sorted "signature", counting characters and walking through a string in groups.

You will learn:

- how to check a palindrome, with cleaning and with two pointers
- how to test anagrams with a sorted signature or a counter
- run-length encoding and decoding
- the Caesar and Vigenère ciphers
- character frequency counting

## Palindromes

A **palindrome** reads the same forwards and backwards. The shortest check compares the text with its reverse:

```python
def is_palindrome(text):
    return text == text[::-1]

print(is_palindrome("level"), is_palindrome("hello"))
```

Real text needs **cleaning** first. Ignore case, spaces and punctuation, so that "A man, a plan, a canal: Panama" counts:

```python
def is_palindrome(text):
    cleaned = [ch.lower() for ch in text if ch.isalnum()]
    return cleaned == cleaned[::-1]

print(is_palindrome("A man, a plan, a canal: Panama"))
print(is_palindrome("Not a palindrome"))
```

## Two pointers

Comparing with a reversed copy uses extra memory. The **two-pointer** technique checks from both ends, moving inwards. It stops at the first mismatch:

```python
def is_palindrome(text):
    left, right = 0, len(text) - 1
    while left < right:
        if text[left] != text[right]:
            return False
        left += 1
        right -= 1
    return True

print(is_palindrome("racecar"), is_palindrome("abca"))
```

Two pointers appear in many other problems, so it is worth recognising the shape: a `left` and a `right` index that move towards each other.

## Anagrams

Two words are **anagrams** if they use exactly the same letters. The easy way is to sort the letters of each word, giving a "signature" that is the same for anagrams:

```python
def is_anagram(a, b):
    return sorted(a.lower()) == sorted(b.lower())

print(is_anagram("Listen", "Silent"))
print(is_anagram("apple", "papel"), is_anagram("apple", "pale"))
```

Sorting takes time proportional to `n log n`. Counting letters with `Counter` takes only `n`:

```python
from collections import Counter

def is_anagram(a, b):
    return Counter(a.lower()) == Counter(b.lower())

print(is_anagram("Dormitory", "dirtyroom"))
```

Grouping words by their signature finds all the anagram families in a list:

```python
words = ["listen", "silent", "enlist", "google", "gogole", "cat", "act"]
groups = {}
for word in words:
    groups.setdefault("".join(sorted(word)), []).append(word)
print(list(groups.values()))
```

## Character frequency

Counting how often each character appears is the base of many text tasks:

```python
from collections import Counter

counts = Counter("mississippi")
print(counts)
print(counts.most_common(2))
```

A first non-repeating character is a classic follow-up:

```python
def first_unique(text):
    counts = Counter(text)
    for ch in text:
        if counts[ch] == 1:
            return ch
    return None

print(first_unique("swiss"), first_unique("aabb"))
```

## Run-length encoding

**Run-length encoding** (RLE) compresses repeated characters: `aaabb` becomes `a3b2`. We walk through the text and count each run:

```python
def rle(text):
    if not text:
        return ""
    parts = []
    current = text[0]
    count = 1
    for ch in text[1:]:
        if ch == current:
            count += 1
        else:
            parts.append(f"{current}{count}")
            current = ch
            count = 1
    parts.append(f"{current}{count}")
    return "".join(parts)

print(rle("aaabbc"), rle(""), rle("z"))
```

Notice the two easy-to-forget parts: the empty text at the start, and the final run after the loop. Forgetting the final `append` is the most common bug.

The standard library can also do it with `itertools.groupby`, which gives you each run of equal items:

```python
from itertools import groupby

def rle(text):
    return "".join(f"{ch}{len(list(run))}" for ch, run in groupby(text))

print(rle("aaabbc"))
```

Decoding needs care when counts have more than one digit, so it is usually done with a regular expression, which you will meet later in this tier.

## The Caesar cipher

The **Caesar cipher** shifts each letter a fixed number of places along the alphabet. Letters wrap around, and other characters stay unchanged:

```python
def caesar(text, shift):
    result = []
    for ch in text:
        if "a" <= ch <= "z":
            result.append(chr((ord(ch) - ord("a") + shift) % 26 + ord("a")))
        elif "A" <= ch <= "Z":
            result.append(chr((ord(ch) - ord("A") + shift) % 26 + ord("A")))
        else:
            result.append(ch)
    return "".join(result)

secret = caesar("Hello, World!", 3)
print(secret)
print(caesar(secret, -3))
```

The `% 26` makes the alphabet wrap, and a negative shift decodes. This cipher is trivial to break, so it teaches you about the algorithm, not about security.

## The Vigenère cipher

The **Vigenère cipher** uses a *keyword*. Each letter of the message is shifted by the matching letter of the key, and the key repeats:

```python
def vigenere(text, key, decrypt=False):
    result = []
    position = 0
    for ch in text:
        if ch.isalpha() and ch.isascii():
            shift = ord(key[position % len(key)].lower()) - ord("a")
            if decrypt:
                shift = -shift
            base = ord("A") if ch.isupper() else ord("a")
            result.append(chr((ord(ch) - base + shift) % 26 + base))
            position += 1
        else:
            result.append(ch)
    return "".join(result)

coded = vigenere("Attack at dawn", "lemon")
print(coded)
print(vigenere(coded, "lemon", decrypt=True))
```

The key only advances on letters, so spaces do not use up a key letter.

## Common mistakes

- Comparing "A" with "a" in a palindrome or anagram test because you forgot to change the case.
- Leaving out the last run in run-length encoding.
- Getting the wrong result for empty text. Always test it.
- Shifting punctuation and spaces in a cipher.

## Recap

- Clean the text (case, punctuation) before you compare it.
- Palindromes: compare with the reverse, or use two pointers moving inwards.
- Anagrams: equal sorted letters, or equal `Counter` results.
- Run-length encoding walks through runs, and must not forget the final run.
- Ciphers shift letters with `ord`, `chr` and `%`.

## Your turn

In the **Practice** tab you write `rle(text)`. Then three challenges use text from the Chinook store.
