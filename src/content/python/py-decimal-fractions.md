Floating point numbers are fast, but they cannot store most decimal fractions exactly, and that is a problem when you handle **money** or need exact results. Python has two other number types in the standard library for these jobs: `Decimal` for exact decimal arithmetic, and `Fraction` for exact ratios.

You will learn:

- why floats are inexact
- `Decimal`: creating, contexts, rounding with `quantize`
- rounding modes
- `Fraction` and exact arithmetic
- the numeric tower
- rules for handling money
- the trap of creating a `Decimal` from a float

## Floats are inexact

```python
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
print(sum([0.1] * 10) == 1.0)
print(f"{0.1:.20f}")
```

The number `0.1` cannot be written exactly in binary, just like `1/3` cannot be written exactly in decimal. The tiny errors are harmless in science, but a shop that adds up 0.1 ten thousand times must not lose cents.

## Decimal

`Decimal` works in **base ten**, as people do:

```python
from decimal import Decimal

print(Decimal("0.1") + Decimal("0.2"))
print(Decimal("0.1") + Decimal("0.2") == Decimal("0.3"))
print(sum([Decimal("0.1")] * 10))
print(Decimal("10") / Decimal("4"), Decimal("1") / Decimal("3"))
print(Decimal("2.50") * 3, Decimal("2.50") * Decimal("1.2"))
```

Notice that `Decimal` remembers how many digits you wrote: `Decimal("2.50")` keeps its trailing zero. By default, it calculates with 28 significant digits.

## Never create a Decimal from a float

The float has **already** lost the exactness before `Decimal` sees it:

```python
print(Decimal(0.1))
print(Decimal("0.1"))
print(Decimal(str(0.1)))
```

Always create a `Decimal` from a **string** (or an integer). If you have a float, convert it with `str` (or better, fix the source that produced it).

## Rounding with quantize

`quantize` rounds a `Decimal` to the same number of places as an example. The usual example for money is `Decimal("0.01")`:

```python
from decimal import Decimal, ROUND_HALF_UP, ROUND_HALF_EVEN, ROUND_DOWN

price = Decimal("2.675")
cent = Decimal("0.01")
print(price.quantize(cent))
print(price.quantize(cent, rounding=ROUND_HALF_UP))
print(price.quantize(cent, rounding=ROUND_HALF_EVEN))
print(price.quantize(cent, rounding=ROUND_DOWN))
print(round(2.675, 2), round(Decimal("2.675"), 2))
```

The default rounding of a `Decimal` is **half to even** (also called banker's rounding), where an exact half goes to the nearest even digit. Shops usually want **half up**, so choose the mode explicitly. The other modes include `ROUND_UP`, `ROUND_DOWN`, `ROUND_CEILING` and `ROUND_FLOOR`.

## Splitting money exactly

Suppose a bill of 100.00 is shared between 3 people. Rounding each share gives 33.33 three times, and a cent goes missing. The fix is to work in **whole cents**, and give the leftover cents to the first shares:

```python
def split_money(total, n):
    cents = int((Decimal(total) * 100).to_integral_value())
    base, extra = divmod(cents, n)
    shares = [base + 1 if i < extra else base for i in range(n)]
    return [str((Decimal(s) / 100).quantize(Decimal("0.01"))) for s in shares]

print(split_money("100.00", 3))
print(sum(Decimal(s) for s in split_money("100.00", 3)))
```

The shares always add up to the total. Working in integers (cents) is the safest way of all. Many payment systems store money as an integer number of cents for exactly this reason.

## Contexts

The **context** holds the precision and rounding mode of the calculations. `localcontext` changes them for a block only:

```python
from decimal import localcontext

with localcontext() as ctx:
    ctx.prec = 5
    print(Decimal(1) / Decimal(7))
print(Decimal(1) / Decimal(7))
```

## Fraction

`Fraction` stores an **exact ratio** of two integers, and calculates without any rounding:

```python
from fractions import Fraction

a = Fraction(1, 3)
b = Fraction(1, 6)
print(a + b, a * b, a / b)
print(Fraction("0.75"), Fraction(0.5), Fraction(3, 12))
print(float(Fraction(1, 3)))
print(Fraction(1, 3) + Fraction(2, 3) == 1)
print(Fraction(22, 7).limit_denominator(10))
```

A `Fraction` is always reduced to lowest terms. It is ideal for exact ratios, probabilities, and music or recipes, but its numbers can grow large.

## The numeric tower

Python's number types form a **hierarchy** (`int`, `Fraction`, `float` and `complex`, from the most exact to the most general), and mixing them follows rules. An `int` works with everything, a `Fraction` mixed with a `float` gives a `float`, and `Decimal` is a separate family that stays strict:

```python
print(Fraction(1, 2) + 1, Fraction(1, 2) + 0.5)
print(Decimal("1.5") + 1)

try:
    Decimal("1.5") + 0.5
except TypeError as error:
    print("TypeError:", error)
```

`Decimal` refuses to mix with `float` on purpose, because the result would be ambiguous. Convert one of them explicitly.

## Rules for money

1. Use `Decimal` (from strings) or **integer cents**. Never floats.
2. Choose the rounding mode on purpose (usually half up), and round **once**, at the end of a calculation.
3. When you split an amount, make sure the parts add up to the total.
4. Store the currency together with the amount.
5. Format only for display.

## Common mistakes

- Creating `Decimal(0.1)` from a float.
- Using `round` on a float for money.
- Assuming that rounding every part of a split keeps the total.
- Mixing `Decimal` and `float`, and getting a `TypeError`.

## Recap

- Floats are inexact. Use `Decimal` for exact decimal arithmetic, and `Fraction` for exact ratios.
- Build `Decimal` from strings, and round with `quantize` and an explicit rounding mode.
- Work in integer cents when you split amounts, and hand out the extra cents.

## Your turn

In the **Practice** tab you write `split_money(total, n)`. Then three challenges use the Chinook store.
