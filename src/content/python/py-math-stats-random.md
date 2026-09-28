Numbers are what computers are for. The standard library has good tools for maths, statistics, random numbers and secure random tokens. This lesson covers the four modules that you will use most: `math`, `statistics`, `random` and `secrets`.

You will learn:

- the functions and constants of `math`
- `statistics`: mean, median, mode, standard deviation, quantiles, correlation
- population versus sample standard deviation
- `random`: seeds, choices, sampling, shuffling and distributions
- `secrets` for tokens and passwords
- why `random` is not for security

## math

```python
import math

print(math.pi, math.e, math.tau)
print(math.sqrt(16), math.isqrt(17), math.pow(2, 10))
print(math.floor(-2.5), math.ceil(-2.5), math.trunc(-2.5), round(-2.5), round(3.5))
print(math.log(math.e), math.log10(1000), math.log2(8), math.log(8, 2))
print(math.sin(math.pi / 2), math.degrees(math.pi), math.radians(180))
print(math.gcd(12, 18), math.lcm(4, 6), math.factorial(5), math.comb(5, 2), math.prod([1, 2, 3, 4]))
print(math.hypot(3, 4), math.dist((0, 0), (3, 4)))
```

Note that `round` uses **banker's rounding** (`round(2.5)` is 2, and `round(3.5)` is 4), which rounds a half to the nearest even number.

Comparing floats with `==` is risky. `math.isclose` compares them with a tolerance:

```python
print(0.1 + 0.2 == 0.3, math.isclose(0.1 + 0.2, 0.3))
print(math.isnan(float("nan")), math.isinf(float("inf")))
print(math.fsum([0.1] * 10), sum([0.1] * 10))
```

`fsum` adds floats more accurately than `sum`.

## statistics

```python
import statistics

data = [2, 4, 4, 4, 5, 5, 7, 9]
print(statistics.mean(data))
print(statistics.median(data))
print(statistics.mode(data), statistics.multimode([1, 1, 2, 2, 3]))
print(statistics.pstdev(data))
print(statistics.stdev(data))
print(statistics.variance(data))
print(statistics.median([1, 3, 5, 7]))
```

The median of an **even** number of items is the average of the two middle ones.

## Population versus sample

There are two standard deviations, and choosing the wrong one is the classic mistake:

- `pstdev` is the **population** standard deviation. Use it when your data is **everything** you care about (all the students in this class).
- `stdev` is the **sample** standard deviation. Use it when your data is a **sample** from a larger group, and you want to estimate the spread of that group (a survey of 100 people from a city). It divides by `n - 1` and is slightly larger.

```python
print(round(statistics.pstdev(data), 3), round(statistics.stdev(data), 3))
```

`stdev` needs at least **two** items, and raises an error for one:

<!-- expect-error -->
```python
statistics.stdev([5])
```

## Quantiles and correlation

```python
values = list(range(1, 101))
print(statistics.quantiles(values, n=4))
print(statistics.quantiles(values, n=10)[0])

x = [1, 2, 3, 4, 5]
y = [2, 4, 5, 4, 5]
print(round(statistics.correlation(x, y), 3))
print(statistics.linear_regression(x, y))
```

`quantiles(data, n=4)` returns the three **quartile** cut points. `correlation` is a number from -1 to 1, and `linear_regression` gives the slope and intercept of the best straight line.

## random

The `random` module makes **pseudo-random** numbers, produced by a formula from a starting value called the **seed**. The same seed gives the same sequence, which is very useful for tests and for reproducible experiments:

```python
import random

random.seed(42)
first = [random.randint(1, 100) for _ in range(3)]
random.seed(42)
second = [random.randint(1, 100) for _ in range(3)]
print(first == second)

print(random.random() < 1.0)
print(random.uniform(1, 2) >= 1)
```

Useful functions:

```python
random.seed(7)
colours = ["red", "green", "blue", "yellow"]
print(random.choice(colours) in colours)
print(len(random.sample(colours, 2)), len(set(random.sample(colours, 2))))
deck = list(range(10))
random.shuffle(deck)
print(sorted(deck) == list(range(10)))
print(len(random.choices(colours, weights=[5, 1, 1, 1], k=6)))
print(random.gauss(0, 1) is not None, 0 <= random.randrange(0, 10, 2) < 10)
```

- `choice` picks one, and `sample` picks several **without** repeats.
- `choices` picks **with** replacement, and accepts `weights`.
- `shuffle` mixes a list in place.
- `gauss` and `normalvariate` give a normal distribution.

## Bootstrapping with a seed

A **bootstrap** estimates how uncertain an average is, by re-sampling the data with replacement many times. With a seed, it is repeatable:

```python
def bootstrap_means(data, rounds, seed):
    rng = random.Random(seed)
    return [statistics.mean(rng.choices(data, k=len(data))) for _ in range(rounds)]

means = bootstrap_means([3, 5, 4, 8, 6], rounds=1000, seed=1)
print(len(means), 3 < statistics.mean(means) < 8)
print(bootstrap_means([1, 2, 3], 3, seed=9) == bootstrap_means([1, 2, 3], 3, seed=9))
```

`random.Random(seed)` makes a **separate generator** with its own seed, so a function does not disturb the global one.

## secrets

`random` is **predictable**: if someone knows a few of its outputs, they can work out the rest. It must **never** be used for passwords, tokens or keys. The `secrets` module uses the operating system's secure source:

```python
import secrets
import string

token = secrets.token_hex(8)
print(len(token))
print(len(secrets.token_urlsafe(16)) > 16)
alphabet = string.ascii_letters + string.digits
password = "".join(secrets.choice(alphabet) for _ in range(12))
print(len(password))
print(secrets.compare_digest("abc", "abc"))
```

`compare_digest` compares two texts in constant time, which prevents timing attacks.

## Common mistakes

- Using `stdev` where you needed `pstdev`, or the other way round.
- Using `random` for passwords and tokens.
- Comparing floats with `==`.
- Forgetting that `stdev` and `variance` need at least two data points.
- Calling `random.seed` in the middle of a program and disturbing other code.

## Recap

- `math` has the functions and constants. Use `isclose` and `fsum` for floats.
- `statistics` has `mean`, `median`, `mode`, `pstdev` (population), `stdev` (sample), `quantiles` and `correlation`.
- `random` is reproducible with a seed, and separate `Random` objects keep it local.
- Use `secrets` for anything that needs to be unpredictable.

## Your turn

In the **Practice** tab you write `describe(nums)`. Then three challenges use the Chinook store.
