Python is a very good calculator, and arithmetic is where nearly every program starts. In this lesson you will learn the operators, the order in which Python applies them, and two that surprise almost everyone: `//` and `%`.

## The basic operators

```python
print(7 + 2)
print(7 - 2)
print(7 * 2)
print(7 / 2)
```

Addition, subtraction and multiplication do what you expect. Division with `/` always gives a `float`, even when the answer is a whole number:

```python
10 / 2
```

The answer is `5.0`, not `5`. Keep that in mind when you compare numbers or show them.

## Whole-number division and remainders

Two more operators work on whole numbers:

- `//` is **floor division**. It divides and throws away the fractional part.
- `%` is the **remainder** (also called modulo). It gives what is left over.

```python
print(17 // 5)
print(17 % 5)
```

Seventeen divided by five goes three times (`3 * 5 = 15`) with two left over. That is why the answers are `3` and `2`. They always fit together: `a == (a // b) * b + a % b`.

The remainder is very useful. For example, a number is even when its remainder after dividing by two is zero:

```python
14 % 2
```

## Powers

`**` raises a number to a power:

```python
print(2 ** 3)
print(9 ** 0.5)
```

The second line is a square root. Raising to the power `0.5` is the same thing.

## Order of operations

Python follows the same order as maths at school: brackets first, then powers, then multiplication and division, then addition and subtraction. Operators of the same rank go from left to right.

```python
print(2 + 3 * 4)
print((2 + 3) * 4)
print(2 ** 3 ** 2)
```

The last line is a surprise: `**` goes from right to left, so it is `2 ** (3 ** 2)`, which is 512. When you are not sure, add brackets. They cost nothing and make the meaning obvious.

## Negative numbers and floor division

Floor division rounds **down**, toward negative infinity, which is different from just dropping the decimals:

```python
print(7 // 2)
print(-7 // 2)
print(-7 % 2)
```

`-7 // 2` is `-4`, not `-3`, because -4 is the next whole number below -3.5. The remainder follows the same rule, so the identity `a == (a // b) * b + a % b` still holds.

## Updating a variable

You met `+=` in the variables lesson. The same shortcut exists for every operator:

```python
total = 10
total += 5
total *= 2
total
```

## Common mistakes

- Expecting `/` to give a whole number. It always gives a float. Use `//` when you want whole-number division.
- Forgetting brackets. `10 + 20 / 2` is 20, not 15.
- Dividing by zero, which raises a `ZeroDivisionError`.
- Assuming `-7 // 2` is `-3`.

## Recap

- `+ - * /` as expected, with `/` always giving a float.
- `//` is floor division, `%` is the remainder, `**` is power.
- Brackets first, then powers, then multiplication and division, then addition and subtraction.
- Floor division rounds down, which matters for negative numbers.
