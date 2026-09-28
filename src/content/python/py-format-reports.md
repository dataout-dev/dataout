Programs are often judged by what they print. A clean, aligned report is easy to read and easy to trust. In Foundations you met f-strings and a few format codes. Here you learn the whole format mini-language, and use it to build tables, money columns and percentages.

You will learn:

- the general shape of a format spec: fill, align, sign, width, grouping, precision, type
- how to align text and numbers in columns
- how to show money, percentages and durations
- how to build a small text table with a total row
- why floating point is risky for money

## The shape of a format spec

After a colon inside `{}` you write a **format spec**. Every part is optional, and they always appear in this order:

```text
[fill][align][sign][0][width][grouping][.precision][type]
```

Here are the pieces one at a time:

```python
n = 1234567.891
print(f"{n:,.2f}")
print(f"{n:>15,.1f}")
print(f"{42:05d}")
print(f"{42:+d}")
print(f"{0.256:.1%}")
print(f"{255:x} {255:b} {255:o}")
print(f"{12345678:e}")
```

The type letter at the end says how to show the value: `d` whole number, `f` fixed decimals, `e` scientific, `%` percentage, `x` hexadecimal, `b` binary.

## Width, fill and alignment

The **width** is the minimum number of characters. The **align** symbol chooses where the extra room goes: `<` left, `>` right, `^` centre. The **fill** character comes just before the alignment symbol:

```python
print(f"[{'left':<10}]")
print(f"[{'right':>10}]")
print(f"[{'mid':^10}]")
print(f"[{'mid':*^10}]")
print(f"[{7:>4}]")
```

Text is left-aligned by default, and numbers are right-aligned, which is why a column of numbers lines up on its digits.

## Widths that come from variables

A width can be a variable, written in its own braces. This is how you make a table adapt to its data:

```python
names = ["Ann", "Bartholomew", "Cy"]
width = max(len(name) for name in names)
for name in names:
    print(f"|{name:<{width}}|")
```

## Money and percentages

Use `,` for thousands separators and `.2f` for cents:

```python
price = 1299.5
print(f"${price:,.2f}")
share = 37 / 120
print(f"{share:.1%}")
```

Negative amounts are clearer with a sign rule. `+` always shows a sign, and a space leaves room for it:

```python
for change in (12.5, -3.25, 0):
    print(f"{change:+8.2f}|{change: 8.2f}")
```

## Building a table

Combine everything to print an aligned table with a total row. We compute the widths first, then format every line with them:

```python
rows = [("Coffee", 3.5), ("Sandwich", 7.25), ("Cake", 4.0)]
label_width = max(len(name) for name, _ in rows)
lines = []
for name, amount in rows:
    lines.append(f"{name:<{label_width}}  {amount:>8,.2f}")
total = sum(amount for _, amount in rows)
lines.append("-" * (label_width + 10))
lines.append(f"{'Total':<{label_width}}  {total:>8,.2f}")
print("\n".join(lines))
```

Building a list of lines and joining them once at the end is easy to test, because the function can *return* the text instead of printing it.

## ljust, rjust and center

The older string methods do the same alignment job. They are handy when you do not need the rest of the mini-language:

```python
print("id".ljust(6, ".") + "|")
print("id".rjust(6, ".") + "|")
print("id".center(6, ".") + "|")
print("7".zfill(3))
```

## Durations

A track length in milliseconds is much friendlier as `minutes:seconds`. Use `divmod`, and a zero-filled width for the seconds:

```python
def mmss(milliseconds):
    minutes, seconds = divmod(milliseconds // 1000, 60)
    return f"{minutes}:{seconds:02d}"

print(mmss(343719))
print(mmss(61000))
```

## Formatting with a dictionary or an object

`format_map` and nested lookups work inside the braces too:

```python
customer = {"name": "Ada", "total": 39.6}
print("{name} spent {total:.2f}".format_map(customer))
print(f"{customer['name']:>6}")
```

## Floats and money

Binary floating point cannot store most decimal fractions exactly:

```python
print(0.1 + 0.2)
print(f"{0.1 + 0.2:.2f}")
print(round(2.675, 2))
```

The last line shows `2.67`, not `2.68`, because `2.675` is really stored as `2.67499999...`. For **display**, format with `.2f`. For **adding up money**, professional code stores whole cents as integers, or uses the `Decimal` type that you meet later in this tier.

## Common mistakes

- Putting the parts of a spec in the wrong order, for example `{n:.2,f}`. The comma comes before the precision: `{n:,.2f}`.
- Forgetting that `f` needs a number, so `{"abc":.2f}` raises an error.
- Printing money with `round` instead of formatting it, and losing trailing zeros: `round(5.5, 2)` shows `5.5`, while `f"{5.5:.2f}"` shows `5.50`.
- Building a table with hard-coded widths that break when the data changes.

## Recap

- A format spec is `[fill][align][sign][0][width][grouping][.precision][type]`.
- `<`, `>` and `^` align, `,` groups thousands, `.2f` fixes decimals, `%` makes a percentage.
- Compute the column width from the data, and pass it in with nested braces.
- Format for display, but do not use floats as your source of truth for money.

## Your turn

In the **Practice** tab you write `render_table(rows)`, which returns an aligned table with a total row. Then three challenges use the Chinook invoices.
