Once you know `for` and `while`, you will find that most loops are variations of a handful of patterns. Learn to recognise them and you will write loops quickly and correctly. This lesson covers the five patterns you will use again and again.

We will loop over a piece of text so each example is small, but the same shapes work on any data.

## 1. Accumulate

Build up a total, a longer string or a running product. Set the starting value before the loop:

```python
total = 0
for digit in "2024":
    total += int(digit)
print(total)
```

## 2. Count

Count how many items meet a condition. Start at 0 and add 1 when the test passes:

```python
count = 0
for letter in "banana":
    if letter == "a":
        count += 1
print(count)
```

## 3. Search

Find the first item that meets a condition, and stop. Use `break` (or track a position) so you do not read further than needed:

```python
position = -1
for i in range(len("hello world")):
    if "hello world"[i] == " ":
        position = i
        break
print(position)
```

Here `-1` means "not found", the same convention as `find()`.

You can also keep the item itself:

```python
found = None
for letter in "abc123":
    if letter.isdigit():
        found = letter
        break
print(found)
```

## 4. Find the largest or smallest

Keep a "best so far" and replace it whenever something better comes along. The starting value matters. Use the first item, or a value that is guaranteed to lose:

```python
biggest = ""
for letter in "python":
    if letter > biggest:
        biggest = letter
print(biggest)
```

An empty string is smaller than every letter, so the first letter always replaces it. For numbers, a common mistake is to start `biggest = 0`. That is wrong when every value can be negative.

## 5. Filter and build

Collect only the items that pass a test, into a new string or list:

```python
result = ""
for letter in "Hello World":
    if letter.isupper():
        result += letter
print(result)
```

This builds a text. Later you will build lists the same way.

## Combining the patterns

Real loops often mix them. For example, count and total at the same time to get an average:

```python
count = 0
total = 0
for digit in "2468":
    count += 1
    total += int(digit)
print(total / count)
```

## Does the loop really do what you think?

Trace a loop by hand with a small input. Write down the variables after each round:

| round | letter | count |
| ----- | ------ | ----- |
| start | | 0 |
| 1 | b | 0 |
| 2 | a | 1 |
| 3 | n | 1 |
| 4 | a | 2 |

If your table matches the output, the loop is probably right. If not, you have found the bug.

## Common mistakes

- Forgetting to reset the accumulator when you loop again.
- Starting a "biggest" search at `0` when values can be negative.
- Using `continue` or `break` at the wrong place.
- Building a result and forgetting to use it after the loop.

## Recap

- Accumulate, count, search, find the extreme, filter: five patterns cover most loops.
- Decide the starting value first.
- A search can stop early with `break`.
- Trace a small case by hand to check the logic.

## Your turn

In the **Practice** tab you are given a text. Count its vowels, and find the position of its first capital letter, or `-1` if there is none.
