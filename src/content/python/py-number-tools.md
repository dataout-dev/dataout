Python comes with a set of ready-made tools for working with numbers. You do not need to write them yourself, and they are faster and more reliable than anything you would write in your first year. In this lesson you will meet the built-in number functions, the `math` module and the `random` module.

## Built-in number functions

These are always available. No setup is needed.

```python
print(abs(-7))
print(min(4, 9, 2))
print(max(4, 9, 2))
print(sum([1, 2, 3, 4]))
print(round(3.14159, 2))
print(pow(2, 10))
print(divmod(17, 5))
```

- `abs(x)` is the distance from zero, so it removes the minus sign.
- `min(...)` and `max(...)` give the smallest and largest value.
- `sum(...)` adds up a whole list of numbers. Lists come later. For now, treat it as "a group of numbers in square brackets".
- `round(x, n)` rounds to `n` decimal places.
- `pow(a, b)` is the same as `a ** b`.
- `divmod(a, b)` gives the quotient and the remainder together, as a pair.

## The math module

Some tools live in **modules**: collections of related functions. To use one you first **import** it:

```python
import math

print(math.sqrt(49))
print(math.pi)
print(math.floor(3.7))
print(math.ceil(3.2))
```

- `math.sqrt(x)` is the square root.
- `math.pi` is the value of pi.
- `math.floor(x)` rounds down and `math.ceil(x)` rounds up, to a whole number.

Here are a few more that you will meet often:

```python
import math

print(math.log(100, 10))
print(math.hypot(3, 4))
print(math.gcd(12, 18))
```

`math.hypot(3, 4)` gives the length of the long side of a right-angled triangle with sides 3 and 4, which is 5. `math.gcd` finds the greatest common divisor.

To see everything a module offers, type `dir(math)`, or read the official documentation.

## The random module

`random` gives you random numbers and choices. It is used in games, simulations and sampling.

```python
import random

random.seed(42)
print(random.randint(1, 6))
print(random.random())
print(random.choice(["red", "green", "blue"]))
```

- `random.randint(a, b)` returns a whole number from `a` to `b`, **including both ends**.
- `random.random()` returns a float from 0 up to (but not including) 1.
- `random.choice(list)` picks one item from a list.

### Seeds and repeatability

Computers do not produce truly random numbers. They follow a formula that *looks* random. The **seed** is where the formula starts. If you set the same seed, you get the same "random" numbers every time. That is what you want when you need results you can check.

```python
import random

random.seed(7)
first = random.randint(1, 100)
random.seed(7)
second = random.randint(1, 100)
first == second
```

> **Warning.** The `random` module is fine for games and data work, but it is **not secure**. Never use it for passwords or tokens. Python has a separate `secrets` module for that.

## Common mistakes

- Forgetting `import math` and getting a `NameError`.
- Writing `sqrt(9)` instead of `math.sqrt(9)`.
- Thinking `randint(1, 6)` can never return 6. It can, because both ends are included.
- Forgetting the seed when you need repeatable results.

## Recap

- Built-ins such as `abs`, `min`, `max`, `sum`, `round` and `divmod` need no import.
- `import math` gives you `sqrt`, `pi`, `floor`, `ceil`, `hypot`, `gcd` and more.
- `random` gives random numbers. Set a seed for repeatable results.
- `random` is not for secrets.
