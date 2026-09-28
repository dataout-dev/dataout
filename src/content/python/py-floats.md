Decimal numbers on a computer are not quite what they seem. Sooner or later you will meet an answer like `0.30000000000000004` and wonder if Python is broken. It is not. This lesson explains what is going on, and how to write numeric code that does not get caught out.

You will learn:

- how Python stores whole numbers and decimal numbers differently
- why `0.1 + 0.2` is not exactly `0.3`
- how to round numbers and format them
- how to compare decimal numbers safely

## Integers: exact and unlimited

An `int` is stored exactly. It can be as large as your memory allows. There is no overflow, unlike in many other languages.

```python
2 ** 200
```

## Floats: fast, but approximate

A `float` is stored in binary, using a fixed amount of space. Some decimal numbers, such as `0.1`, cannot be written exactly in binary, just as one third cannot be written exactly in decimal (`0.3333...`). The computer keeps the closest value it can.

```python
0.1 + 0.2
```

You will see `0.30000000000000004`. Each of `0.1` and `0.2` is slightly off, and the small errors add up. This is not a Python bug. Every mainstream language behaves the same way, because it comes from how computers store numbers.

```python
print(0.1 + 0.2 == 0.3)
print(0.5 + 0.25 == 0.75)
```

Numbers made only of halves, quarters and so on (0.5, 0.25, 0.75) *are* exact in binary. That is why the second line is `True`.

> **Rule.** Never test two floats with `==` when they came from calculations.

## Rounding

`round(number, digits)` rounds to a given number of decimal places:

```python
print(round(3.14159, 2))
print(round(2.675, 2))
```

The second answer is `2.67`, not `2.68`, because `2.675` is really stored as a value just below it. Rounding also uses **banker's rounding** when a value is exactly halfway: it rounds to the nearest even number.

```python
print(round(0.5))
print(round(1.5))
print(round(2.5))
```

You get `0`, `2` and `2`. This avoids a bias that would build up if you always rounded halves upward.

## Showing a number with fixed decimals

Rounding changes the value. Often you only want to *show* it neatly. Use a format string (you will learn more in the text section):

```python
price = 4.5
print(f"{price:.2f}")
```

`.2f` means "two digits after the decimal point". The value is unchanged. Only the display is.

## Comparing floats safely

Instead of `==`, check whether two numbers are close enough. A simple way is to look at the size of the difference:

```python
a = 0.1 + 0.2
b = 0.3
abs(a - b) < 1e-9
```

`1e-9` is scientific notation for 0.000000001. Python also has a ready-made tool in the `math` module:

```python
import math
math.isclose(0.1 + 0.2, 0.3)
```

## Money and floats

Never store money in floats if exact cents matter. Use whole cents in an `int` (`499` instead of `4.99`), or the `Decimal` type from the last lesson of this section.

## Common mistakes

- Comparing floats with `==`.
- Assuming a number that prints as `0.3` is exactly `0.3`.
- Rounding too early. Keep full precision while you calculate, and round only when you show the result.
- Using floats for money.

## Recap

- Integers are exact. Floats are approximations stored in binary.
- `0.1 + 0.2` is `0.30000000000000004`, and that is normal.
- `round()` uses banker's rounding on exact halves.
- Compare floats with a tolerance: `abs(a - b) < small` or `math.isclose`.

## Your turn

In the **Practice** tab you are given two numbers, `x` and `y`. Set a variable called `close` to `True` when they are within `1e-9` of each other, and `False` otherwise.
