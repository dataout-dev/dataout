Loops become really useful when you use them to solve small numeric puzzles: adding up the digits of a number, testing whether a number is prime, finding the greatest common divisor. These are classic exercises, and each one teaches a habit you will reuse. Along the way you will meet the important trick of stopping a loop early.

## Digit sums

To add up the digits of a number, turn it into text and loop over the characters:

```python
n = 2024
total = 0
for digit in str(n):
    total += int(digit)
print(total)
```

There is an arithmetic way, which is worth knowing. The remainder after dividing by 10 is the last digit, and floor division by 10 removes it:

```python
n = 2024
total = 0
while n > 0:
    total += n % 10
    n = n // 10
print(total)
```

## Testing for a prime number

A prime is a whole number greater than 1 with no divisors except 1 and itself. To test by **trial division**, try every possible divisor:

```python
n = 29
is_prime = n > 1
for d in range(2, n):
    if n % d == 0:
        is_prime = False
        break
print(is_prime)
```

The moment we find a divisor, we know the answer, so we `break`.

### You only need to go to the square root

If `n` has a divisor bigger than its square root, it must also have a matching one smaller. So it is enough to test up to `sqrt(n)`. That makes a big difference for large numbers:

```python
n = 10007
is_prime = n > 1
d = 2
while d * d <= n:
    if n % d == 0:
        is_prime = False
        break
    d += 1
print(is_prime)
```

The test `d * d <= n` avoids using a square root function.

## Greatest common divisor

The greatest common divisor (gcd) of two numbers is the biggest number that divides both. A simple loop counts down from the smaller number:

```python
a, b = 12, 18
gcd = 1
for d in range(min(a, b), 0, -1):
    if a % d == 0 and b % d == 0:
        gcd = d
        break
print(gcd)
```

Euclid's algorithm, from over two thousand years ago, is much faster:

```python
a, b = 12, 18
while b != 0:
    a, b = b, a % b
print(a)
```

## Factors of a number

List all numbers that divide `n` exactly:

```python
n = 36
factors = ""
for d in range(1, n + 1):
    if n % d == 0:
        factors += str(d) + " "
print(factors)
```

## Watch the size

A loop that tries every divisor up to `n` does about `n` rounds. For `n = 10 billion` that is far too slow, while stopping at the square root needs only about 100,000. Knowing when to stop is often the difference between a program that finishes and one that does not.

## Common mistakes

- Treating 1 as a prime. It is not, and `n > 1` guards against that.
- Testing divisors past the square root, which wastes time.
- Forgetting to `break` once the answer is known.
- Using `/` when you mean `//`, so the number becomes a float and the digit trick breaks.

## Recap

- Digits: loop over `str(n)`, or use `% 10` and `// 10`.
- A number is prime when nothing from 2 up to its square root divides it.
- The gcd can be found by counting down, or faster with Euclid's `a, b = b, a % b`.
- Stop early whenever the answer is known.

## Your turn

In the **Practice** tab you are given a whole number `n`. Compute the sum of its digits in `digit_sum`, and whether it is a prime number in `is_prime`.
