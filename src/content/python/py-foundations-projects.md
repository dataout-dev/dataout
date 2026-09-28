Congratulations. You now know the core of Python: values, text, decisions, loops, collections and functions. This last lesson of the Foundations tier is a workshop. You will build three small programs from start to finish, using the method from the earlier lesson: understand the problem, plan, write the code and test it.

## Project 1: word frequency counter

**The problem.** Given some text, find its most common words.

**Plan it.**

```text
lower-case the text and split it into words
count how often each word appears
sort the words by count (largest first), then alphabetically
take the first n
```

**Write it.** We use a dictionary for the counts and `sorted` with a `key`:

```python
def top_words(text, n):
    counts = {}
    for word in text.lower().split():
        counts[word] = counts.get(word, 0) + 1
    ordered = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    return ordered[:n]

sample = "the cat and the hat and the bat"
print(top_words(sample, 2))
```

**Test it.** Try the awkward cases:

```python
print(top_words("", 3))
print(top_words("a A a", 5))
print(top_words("one two", 5))
```

Empty text gives an empty list, capitals do not create separate words, and asking for more words than exist just returns what there is.

## Project 2: a guessing game, without the guessing

Games are a nice way to practise loops. Here the computer plays both sides. It picks a secret number, and a helper finds it by always guessing the middle. That is called **binary search**, and it is how you find a name in a phone book.

```python
import random

random.seed(7)
secret = random.randint(1, 100)

low, high = 1, 100
guesses = 0
while True:
    guess = (low + high) // 2
    guesses += 1
    if guess == secret:
        break
    elif guess < secret:
        low = guess + 1
    else:
        high = guess - 1

print(secret, "found in", guesses, "guesses")
```

Every guess halves the range, so 100 numbers need at most 7 guesses. Try changing 100 to 1000. It needs only about 10.

## Project 3: a report from data

**The problem.** Given a list of dictionaries, print how many rows each group has, in alphabetical order, one per line.

```python
def count_report(rows, field):
    counts = {}
    for row in rows:
        counts[row[field]] = counts.get(row[field], 0) + 1
    lines = []
    for key in sorted(counts):
        lines.append(f"{key}: {counts[key]}")
    return "\n".join(lines)

rows = [{"species": "Adelie"}, {"species": "Gentoo"}, {"species": "Adelie"}]
print(count_report(rows, "species"))
```

This uses a dictionary to count, `sorted` to order the keys, an f-string to format and `join` to combine the lines. That is almost every skill of the tier in ten lines.

## How to make a project your own

Once something works, extend it:

- Make the word counter ignore punctuation.
- Let the report take a second field, so it counts pairs.
- Add a limit to the guessing game so it gives up after 5 guesses.

Each extension is a small new problem. Solve it with the same method.

## Check-list before you call it done

- Does it work on the examples you wrote at the start?
- Does it work on empty input and on a single item?
- Are the names clear, and is each function short?
- Do the functions return their results, rather than print them?

## What next?

You now have the basics. In Core Python you will go deeper into text and regular expressions, write more flexible functions, handle errors, work with files and explore the standard library. You will also meet more of the real, messy data that makes programming useful.

## Your turn

In the **Practice** tab you write `top_words(text, n)`, and then use these projects as a model for three challenges on the penguin data.
