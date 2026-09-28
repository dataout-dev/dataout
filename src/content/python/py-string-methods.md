Strings come with a toolbox of built-in functions, called **methods**. Instead of writing your own code to change case or strip spaces, you call one. Knowing the handful of methods you will use every day saves a lot of time.

## What is a method?

A method is a function that belongs to a value. You call it with a dot after the value:

```python
name = "ada lovelace"
print(name.upper())
print(name.title())
```

Methods do not change the original string, because strings are immutable. They return a new one. If you want to keep the result, give it a name:

```python
name = "ada lovelace"
name = name.title()
name
```

## Changing case

```python
text = "Hello World"
print(text.upper())
print(text.lower())
print(text.title())
print(text.capitalize())
print(text.swapcase())
```

`title()` capitalises every word, while `capitalize()` only capitalises the first letter of the whole string.

## Removing spaces

Data often has stray spaces at the ends. `strip()` removes them:

```python
messy = "   penguin  \n"
print(repr(messy.strip()))
print(repr(messy.lstrip()))
print(repr(messy.rstrip()))
```

`repr()` shows the string with its quotes, so you can see the spaces. `lstrip()` cuts the left side only, and `rstrip()` the right. You can also give `strip()` characters to remove: `"--hello--".strip("-")` gives `"hello"`.

## Splitting and joining

`split()` turns a string into a list of pieces. Without an argument it splits on any run of spaces:

```python
sentence = "the quick brown fox"
words = sentence.split()
print(words)
```

You can split on a chosen separator:

```python
row = "Adelie,Torgersen,39.1"
print(row.split(","))
```

`join()` does the opposite. It glues a list of strings together with a separator. The separator comes first, and the list goes in brackets:

```python
words = ["the", "quick", "brown", "fox"]
print("-".join(words))
print(" ".join(words))
```

The pair `split` and `join` is how programmers reshape text.

## Replacing

`replace(old, new)` swaps every occurrence of one piece of text for another:

```python
text = "1,234,567"
print(text.replace(",", ""))
print(text.replace(",", "", 1))
```

The optional third number limits how many replacements to make.

## Checking what a string is made of

These methods return `True` or `False`:

```python
print("2024".isdigit())
print("abc".isalpha())
print("abc123".isalnum())
print("   ".isspace())
print("HELLO".isupper())
```

They are handy for checking data before you convert it.

## Chaining methods

Because each method returns a string, you can chain them in one line. They run from left to right:

```python
raw = "   ADA lovelace  "
clean = raw.strip().lower().title()
clean
```

## Common mistakes

- Forgetting to keep the result. `name.upper()` on its own line changes nothing you can see later.
- Forgetting the brackets. `name.upper` without `()` refers to the method but does not call it.
- Using `split(" ")` when you meant `split()`. With a single space, two spaces in a row produce an empty piece.
- Thinking `join` is called on the list. It is called on the separator: `", ".join(items)`.

## Recap

- Methods are called with a dot and return new strings.
- Use `upper`, `lower`, `title` to change case, and `strip` to trim.
- `split` breaks a string into a list, `join` glues a list into a string.
- `replace` swaps text, and the `is...` methods test what a string contains.
- You can chain them.
