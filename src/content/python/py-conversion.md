Data rarely arrives in the type you need. A number typed by a user is text. A CSV file contains only text. A year might be stored as `2007` in one place and `"2007"` in another. In this lesson you learn to convert between types safely, and what to do when a conversion fails.

## The conversion functions

Each basic type has a function of the same name that converts to it:

```python
print(int("42"))
print(float("3.14"))
print(str(99))
print(bool(0))
```

Try to combine text and numbers and Python complains, as you saw earlier. Converting fixes it:

```python
age = 30
"I am " + str(age) + " years old"
```

## int(): whole numbers

`int()` turns text or a float into a whole number. When given a float, it **cuts off** the decimals, it does not round:

```python
print(int("15"))
print(int(3.99))
print(int(-3.99))
```

`int(-3.99)` is `-3`, because cutting off moves toward zero. If you want rounding, use `round()` first.

The text must look like a whole number. `int("3.5")` is an error:

<!-- expect-error -->
```python
int("3.5")
```

To convert that text, go through `float()` first: `int(float("3.5"))`.

## float() and str()

`float()` accepts text that looks like a number, including ones with exponents:

```python
print(float("2.5"))
print(float("1e3"))
print(float(7))
```

`str()` turns anything into text, which is handy for building messages:

```python
str(3.0)
```

## bool() and the surprise

`bool()` follows the truthiness rules. Any non-empty text is `True`, even the word `"False"`:

```python
print(bool("False"))
print(bool(""))
print(bool(0.0))
```

If you have text that says `"True"` or `"False"`, compare it instead: `text == "True"`.

## What happens when it cannot convert?

If the text does not look like the target type, Python raises a **`ValueError`**:

<!-- expect-error -->
```python
int("twenty")
```

Later you will learn to catch errors and carry on. For now, remember that user input and file data can be messy, so conversions can fail.

## Cleaning before converting

Numbers in real data often contain commas, spaces or symbols. Remove them first:

```python
text = " 1,234 "
cleaned = text.strip().replace(",", "")
int(cleaned)
```

`strip()` removes spaces at the ends and `replace(",", "")` deletes the commas. You will meet these string tools in the next section.

## Implicit conversion

In one case Python converts for you: mixing `int` and `float` in arithmetic. The result is a float:

```python
print(3 + 0.5)
print(type(3 + 0.5))
```

## Common mistakes

- Concatenating text and numbers without converting.
- Thinking `int(3.9)` gives 4.
- Expecting `bool("False")` to be `False`.
- Converting text that has commas, currency symbols or spaces without cleaning it first.

## Recap

- `int()`, `float()`, `str()` and `bool()` convert between the basic types.
- `int()` cuts decimals toward zero. Use `round()` if you want rounding.
- A failed conversion raises a `ValueError`.
- Clean messy text before converting it.
