Programs constantly need to build sentences out of values: "Hello, Ada, you have 3 messages", or a report line with aligned columns and neat decimals. The modern, readable way to do this in Python is the **f-string**. In this lesson you will learn how to embed values in text and how to control exactly how they look.

## Your first f-string

Put the letter `f` in front of the opening quote. Anything inside curly brackets is worked out and inserted:

```python
name = "Ada"
age = 36
print(f"{name} is {age} years old")
```

The brackets can hold any expression, not just names:

```python
price = 4.5
quantity = 3
print(f"Total: {price * quantity}")
print(f"Shout: {name.upper()}!")
```

Compare that with the older way of joining pieces with `+` and `str()`:

```python
name = "Ada"
age = 36
print(name + " is " + str(age) + " years old")
```

The f-string is shorter and there is no need to convert numbers by hand.

## Showing the name and the value

Adding an equals sign after the expression prints both, which is a great debugging trick:

```python
total = 12
count = 4
print(f"{total=}, {count=}")
```

## Formatting numbers

After the expression you can put a colon and a **format specifier**. It says how to show the value.

```python
value = 3.14159265
print(f"{value:.2f}")
print(f"{value:.4f}")
print(f"{value:10.2f}|")
```

- `.2f` means "a float with 2 digits after the point".
- `10.2f` also asks for a total width of 10 characters, padded with spaces on the left.

Whole numbers, large numbers and percentages have their own specifiers:

```python
big = 1234567
share = 0.4567
print(f"{big:,}")
print(f"{share:.1%}")
print(f"{7:03d}")
```

- `,` adds thousands separators.
- `%` multiplies by 100 and adds a percent sign.
- `03d` means "a whole number, padded with zeros to width 3".

## Aligning text

You can set a width and an alignment. `<` left, `>` right and `^` centre:

```python
print(f"|{'left':<10}|")
print(f"|{'right':>10}|")
print(f"|{'mid':^10}|")
```

Notice the single quotes inside the double-quoted f-string. Using different quotes avoids clashes.

This is how you make tables line up:

```python
print(f"{'Adelie':<12}{152:>5}")
print(f"{'Gentoo':<12}{124:>5}")
print(f"{'Chinstrap':<12}{68:>5}")
```

## Other formats you will see

You may also meet `str.format()` and `%` formatting in older code:

```python
print("{} is {}".format("Ada", 36))
print("%s is %d" % ("Ada", 36))
```

They work, but f-strings are clearer, so prefer them.

## Curly brackets themselves

To show a real `{`, double it:

```python
print(f"{{braces}} and {1 + 1}")
```

## Common mistakes

- Forgetting the `f` before the quote. Then `{name}` is printed literally.
- Reusing the same kind of quote inside the brackets as outside.
- Confusing rounding with formatting. `f"{x:.2f}"` changes how a number is shown, not the number.
- Forgetting a colon before the format, or putting the spec in the wrong order.

## Recap

- `f"...{expression}..."` builds text from values.
- `{value:.2f}` shows two decimals, `{value:,}` adds thousands separators, `{value:.1%}` shows a percent.
- `<`, `>`, `^` with a width align text.
- `{x=}` prints the name and value.

## Your turn

In the **Practice** tab you are given a `name` and a `value`. Build one line of a report: the name padded to a width of 10, followed by the value with 2 decimals.
