Integers and floats cover most work, but Python has a few more number types for special jobs. Money needs exact decimals. Recipes and ratios sometimes need exact fractions. Engineers and scientists use complex numbers. And computers themselves think in bits. This lesson is a short tour of them, so that you know they exist and when to reach for them.

You will learn:

- `Decimal` for exact decimal arithmetic, such as money
- `Fraction` for exact ratios
- `complex` for numbers with an imaginary part
- bitwise operators and number bases

## Decimal: exact decimal arithmetic

The float problem from the earlier lesson shows up whenever you add up prices. The `decimal` module fixes it by storing decimal digits exactly.

```python
from decimal import Decimal

print(Decimal("0.1") + Decimal("0.2"))
print(Decimal("0.1") + Decimal("0.2") == Decimal("0.3"))
```

Always create a `Decimal` from a **string**. If you pass a float, you copy its error along:

```python
from decimal import Decimal

print(Decimal(0.1))
print(Decimal("0.1"))
```

The first line shows the long, inexact value that a float really holds.

To round a Decimal to cents, use `quantize`:

```python
from decimal import Decimal, ROUND_HALF_UP

price = Decimal("2.675")
price.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
```

The result is `2.68`, which is what most people expect at a till.

## Fraction: exact ratios

A `Fraction` stores a whole-number numerator and denominator, so there is no rounding at all:

```python
from fractions import Fraction

a = Fraction(1, 3)
b = Fraction(1, 6)
print(a + b)
print(a * 3)
```

One third plus one sixth is exactly one half. Floats could never say so.

## complex: numbers with an imaginary part

Some maths and engineering problems use numbers of the form `a + bj`, where `j` is the square root of minus one. Python supports them directly:

```python
z = 3 + 4j
print(z.real, z.imag)
print(abs(z))
```

`abs(z)` gives the length of the number, which is 5 here. You will not need complex numbers often, but it is nice to know they are built in.

## Number bases and bit operations

Computers store numbers in binary. Python lets you write and view numbers in different bases:

```python
print(0b1010)
print(0xFF)
print(bin(10), hex(255), oct(8))
```

`0b` starts a binary literal, `0x` a hexadecimal one. The functions `bin`, `hex` and `oct` show a number in that base.

**Bitwise operators** work on the individual bits:

```python
print(6 & 3)
print(6 | 3)
print(6 ^ 3)
print(1 << 4)
print(32 >> 2)
```

| Operator | Meaning |
| -------- | ------- |
| `&` | AND: bits that are 1 in both |
| `\|` | OR: bits that are 1 in either |
| `^` | XOR: bits that differ |
| `<<` | shift left (multiply by powers of two) |
| `>>` | shift right (divide by powers of two) |

You will meet bit tricks in the algorithms tier. For everyday code you mostly use them for flags and low-level data.

## Which type should I use?

| Job | Use |
| --- | --- |
| Counting, indexing | `int` |
| Measurements, scientific values | `float` |
| Money, exact decimals | `Decimal` (or whole cents as `int`) |
| Exact ratios | `Fraction` |
| Signal processing, some maths | `complex` |

## Common mistakes

- Creating a `Decimal` from a float, which copies the inaccuracy.
- Mixing `Decimal` and `float` in one calculation. Python raises a `TypeError` because it will not guess.
- Using `Decimal` when a plain float would do. It is slower.

## Recap

- `Decimal("0.1")` and friends give exact decimal arithmetic. Use them for money.
- `Fraction` gives exact ratios.
- `complex` numbers are built in.
- `0b`, `0x`, `bin()` and `hex()` show other bases. `& | ^ << >>` work on bits.

## Your turn

In the **Practice** tab you are given two prices as text, `a` and `b`, such as `"0.10"` and `"0.20"`. Set `total` to their exact sum as a `Decimal`.
