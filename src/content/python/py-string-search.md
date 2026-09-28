Real text is messy, and much of programming is asking questions about it. Does this name start with a capital? Is the word in the sentence? How many times does a letter appear? Where does the file extension begin? Python has a small set of tools for exactly these questions.

## The `in` operator

`in` asks whether one string appears inside another. The answer is `True` or `False`:

```python
text = "the quick brown fox"
print("quick" in text)
print("slow" in text)
print("slow" not in text)
```

It is case sensitive, so `"Quick"` would not match `"quick"`.

## Starts with and ends with

```python
filename = "penguins.csv"
print(filename.startswith("pen"))
print(filename.endswith(".csv"))
print(filename.endswith((".csv", ".tsv")))
```

Giving a group of options in brackets checks several endings at once.

## Finding a position

`find()` returns the index of the first match, or `-1` if there is none:

```python
text = "banana"
print(text.find("an"))
print(text.find("x"))
print(text.find("an", 2))
```

The optional second number says where to start looking. `rfind()` searches from the right. `index()` works like `find()`, but raises an error when the text is missing, which can be safer when a missing value is a bug.

## Counting

`count()` tells you how many times something appears, without overlapping:

```python
print("banana".count("a"))
print("banana".count("an"))
print("aaaa".count("aa"))
```

The last line is `2`, not `3`, because matches cannot overlap.

## Comparing text

Comparison operators work on strings by dictionary order, using each letter's code:

```python
print("apple" == "apple")
print("apple" < "banana")
print("Apple" < "apple")
```

Capital letters come before small ones, so a plain comparison is not the same as alphabetical order in a phone book.

To compare without caring about case, convert both first. `casefold()` is the strongest version of `lower()` and is safest for international text:

```python
a = "Straße"
b = "STRASSE"
print(a.lower() == b.lower())
print(a.casefold() == b.casefold())
```

## Sorting text

`sorted()` works on strings too. Use a key to ignore case:

```python
names = ["bob", "Alice", "carol"]
print(sorted(names))
print(sorted(names, key=str.lower))
```

You will meet `key=` again when you learn to sort lists.

## Combining tests

The questions combine with `and` and `or`:

```python
name = "Adelie Penguin"
name.startswith("A") and " " in name
```

## Common mistakes

- Forgetting that comparisons are case sensitive.
- Using `find()` and forgetting that `-1` means "not found", then using the `-1` as an index.
- Expecting `count` to count overlapping matches.
- Testing a value for truth with `if text.find("x"):`. It is false at position 0 and true when missing (`-1`). Use `in` or compare with `-1`.

## Recap

- `"a" in text` tests for a piece of text.
- `startswith` and `endswith` check the ends, `find` and `count` locate and count.
- Compare case-insensitively with `lower()` or `casefold()`.
- `sorted(..., key=str.lower)` sorts ignoring case.

## Your turn

In the **Practice** tab you are given a `filename`. Set a boolean `is_csv` that says whether it ends in `.csv`, ignoring capital letters.
