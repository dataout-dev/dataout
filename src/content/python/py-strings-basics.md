Almost all real-world data starts as text: names, addresses, e-mails, product descriptions, log lines. In Python, text is called a **string**, and knowing how to create and combine strings is a skill you will use every day. This lesson covers the basics, from quotes to the surprising way a string refuses to be changed.

You will learn:

- three ways to write string literals
- escape sequences such as `\n` and `\t`, and raw strings
- how to join and repeat strings
- how to measure a string with `len()`
- why strings are immutable

## Quotes: single, double and triple

A string literal is text between quotes. Single and double quotes do exactly the same thing:

```python
print('Hello')
print("Hello")
```

Having both is useful when the text itself contains a quote. Choose the kind that is not inside the text:

```python
print("It's a lovely day")
print('She said "hello"')
```

For text over several lines, use **triple quotes**:

```python
poem = """Roses are red,
Violets are blue."""
print(poem)
```

## Escape sequences

Sometimes you need a character that is hard to type, such as a new line or a tab. You write it with a backslash and a letter. Python turns the pair into one special character:

| Written | Means |
| ------- | ----- |
| `\n` | a new line |
| `\t` | a tab |
| `\\` | one backslash |
| `\'` and `\"` | a quote mark inside a string |

```python
print("first line\nsecond line")
print("name:\tAda")
print("She said \"hi\"")
```

## Raw strings

Backslashes cause trouble with Windows paths and, later, with patterns for searching text. A **raw string** starts with an `r` and treats backslashes as ordinary characters:

```python
print("C:\new\table")
print(r"C:\new\table")
```

The first line breaks at `\n` and `\t`. The second prints the path exactly as typed. You will use raw strings a lot when you reach regular expressions.

## Joining and repeating

`+` joins strings. `*` with a whole number repeats one. Neither changes the originals. Each makes a new string:

```python
first = "Ada"
last = "Lovelace"
print(first + " " + last)
print("-" * 20)
```

Notice that we had to add the space ourselves. Python joins exactly what you give it, nothing more.

## Length

`len()` counts the characters in a string, including spaces:

```python
len("Hello, world")
```

An empty string, `""`, has length 0.

## Strings never change

A string is **immutable**: once created, its characters cannot be altered. You cannot assign to one letter:

<!-- expect-error -->
```python
word = "cat"
word[0] = "b"
```

To get a different string, you build a new one and give it the name:

```python
word = "cat"
word = "b" + word[1:]
word
```

The pieces you used (`word[1:]`) are explained in the next lesson. The point here is that changing text always means creating new text.

## Common mistakes

- Forgetting to close a quote, which gives a `SyntaxError`.
- Mixing quote types, such as `"Hello'`.
- Forgetting the spaces when joining: `"Ada" + "Lovelace"` gives `AdaLovelace`.
- Trying to change one character of a string in place.
- Adding a number to a string without converting it first.

## Recap

- Use single, double or triple quotes. Pick the kind that avoids escaping.
- `\n`, `\t` and `\\` are escape sequences. Raw strings (`r"..."`) switch them off.
- `+` joins, `*` repeats, `len()` counts.
- Strings are immutable. To change one, build a new one.

## Your turn

In the **Practice** tab you are given a variable `name`. Build a greeting and a matching underline from it.
