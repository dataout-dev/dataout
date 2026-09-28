A string is a sequence of characters, and Python lets you pick any of them by position, or cut out whole pieces. This is called **indexing** and **slicing**. It is one of the tools you will reach for constantly, whether you are trimming a file extension, taking the first three letters of a code or reversing a word.

You will learn:

- how positions are numbered, from the front and from the back
- how to slice with `start:stop:step`
- the rule that makes slices easy to reason about
- what happens when you go out of range

## Positions start at zero

Each character has a position, called an **index**. The first character is at index `0`, not `1`:

```python
word = "Python"
print(word[0])
print(word[1])
print(word[5])
```

Picture the letters with their indexes written underneath:

```text
 P  y  t  h  o  n
 0  1  2  3  4  5
```

## Counting from the end

Negative numbers count backwards from the end. `-1` is the last character:

```python
word = "Python"
print(word[-1])
print(word[-2])
```

```text
 P  y  t  h  o  n
-6 -5 -4 -3 -2 -1
```

Asking for a position that does not exist is an error:

<!-- expect-error -->
```python
word = "Python"
word[10]
```

You get an `IndexError: string index out of range`.

## Slicing: a piece of the string

A slice is written `text[start:stop]`. It gives the characters from `start` **up to but not including** `stop`:

```python
word = "Python"
print(word[0:2])
print(word[2:5])
```

The "not including" rule is the one to remember. A useful trick: `stop - start` is the length of the slice. So `word[2:5]` has three characters.

You can leave out either end. A missing start means "from the beginning", and a missing stop means "to the end":

```python
word = "Python"
print(word[:3])
print(word[3:])
print(word[:])
```

Notice that `word[:3]` and `word[3:]` together give the whole word with no overlap and no gap. That is what the rule buys you.

Negative numbers work in slices too:

```python
word = "Python"
print(word[-3:])
print(word[:-1])
```

`word[-3:]` is the last three characters. `word[:-1]` is everything except the last one.

## The step

A third number sets how far to jump each time: `text[start:stop:step]`.

```python
digits = "0123456789"
print(digits[::2])
print(digits[1::2])
print(digits[::-1])
```

A step of `2` takes every other character. A step of `-1` walks backwards, which is the standard way to reverse a string.

## Slices are forgiving

A slice that goes past the end does not raise an error. It just stops:

```python
word = "Python"
print(word[2:100])
print(word[10:20] == "")
```

Only a single index, like `word[10]`, is strict.

## Slicing never changes the original

A slice always gives you a **new** string:

```python
word = "Python"
part = word[:2]
print(part, word)
```

## Common mistakes

- Starting to count at 1. The first position is 0.
- Forgetting that the stop position is not included, which causes off-by-one errors.
- Using a single index that is too large, which is an `IndexError`.
- Expecting slicing to change the original string.

## Recap

- Indexes start at 0. Negative indexes count from the end.
- `text[start:stop]` includes `start` and excludes `stop`.
- Leave out `start` or `stop` to go to an end. A third number is the step, and `[::-1]` reverses.
- Slices are forgiving, single indexes are not, and neither changes the original.

## Your turn

In the **Practice** tab you are given a string `s`. Pull out its first three characters, its last two, and a reversed copy.
