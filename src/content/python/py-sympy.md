Everything else in this tier computes with numbers. SymPy computes with **symbols** — exact algebra, calculus and equation-solving, the way you would do it by hand, without ever rounding to a floating-point approximation unless you ask it to.

You will learn:

- symbols and expressions
- simplifying and solving equations
- derivatives and integrals
- converting a symbolic result to a numeric function

## Symbols and expressions

```python
import sympy as sp

x, y = sp.symbols("x y")
expr = x**2 + 2*x*y + y**2
print(expr)
print(sp.expand(expr))
print(sp.factor(expr))
```

`sp.symbols` creates symbolic variables; ordinary Python operators build up an expression tree from them, which SymPy can then manipulate exactly.

## Parsing text into an expression

```python
import sympy as sp

expr = sp.sympify("x**2 + 3*x + 2")
print(expr)
print(sp.factor(expr))
```

`sp.sympify` turns a **string** into a symbolic expression — the bridge between text (say, from a user or a config file) and SymPy's internal representation, and how this tier's practice exercise receives its input.

## Solving equations

```python
import sympy as sp

x = sp.symbols("x")
solutions = sp.solve(sp.Eq(x**2, 9), x)
print(solutions)

a, b = sp.symbols("a b")
system = sp.solve([sp.Eq(a + b, 10), sp.Eq(a - b, 4)], [a, b])
print(system)
```

`sp.solve` finds exact solutions, including (as with `x**2 = 9`) more than one when they exist, and can solve a system of several equations for several unknowns at once.

## Derivatives

```python
import sympy as sp

x = sp.symbols("x")
expr = x**3 + 2*x**2 - 5*x
print(sp.diff(expr, x))
print(sp.diff(expr, x, 2))
```

`sp.diff(expr, x)` differentiates with respect to `x`; a third argument (`2`, here) takes the second derivative — exact symbolic results, not a numerical approximation.

## Integrals

```python
import sympy as sp

x = sp.symbols("x")
expr = 2 * x
print(sp.integrate(expr, x))
print(sp.integrate(expr, (x, 0, 5)))
```

Without bounds, `sp.integrate` returns the indefinite integral (up to a constant, which SymPy omits); with `(x, low, high)`, it computes the definite integral directly.

## Series expansion

```python
import sympy as sp

x = sp.symbols("x")
expr = sp.exp(x)
print(sp.series(expr, x, 0, 4))
```

`sp.series` gives a truncated Taylor series around a point — here, the first few terms of `e^x` around `x = 0`.

## Converting to a fast numeric function

```python
import sympy as sp

x = sp.symbols("x")
expr = x**2 + 3*x
f = sp.lambdify(x, expr, "numpy")
print(f(5))
```

Symbolic computation is exact but slow for repeated evaluation; `sp.lambdify` compiles an expression into an ordinary (fast) Python/NumPy function once the symbolic work is done — the practical bridge from "worked out the formula" to "evaluate it a million times".

## Watch out: exponential expression swell

Repeatedly expanding or substituting into a symbolic expression can make it grow enormous surprisingly fast (a polynomial's size can explode with repeated operations) — `sp.simplify` (or a more targeted function like `sp.factor`/`sp.cancel`) is often necessary to keep an expression from becoming unreadable or slow to work with further.

## Common mistakes

- Differentiating or solving with respect to the wrong symbol, especially when an expression only defines one variable but the code passes in another.
- Forgetting `sp.sympify` when starting from a plain string.
- Treating a symbolic result as a number without first converting it (`float(...)`, or `sp.lambdify` for repeated use).
- Letting an expression grow unchecked through repeated substitution without ever simplifying it.

## Recap

- `sp.symbols` and ordinary operators build exact symbolic expressions; `sp.sympify` parses one from text.
- `sp.solve` finds exact solutions to equations, including systems of several at once.
- `sp.diff`/`sp.integrate` compute exact derivatives and integrals; `sp.series` gives a truncated expansion.
- `sp.lambdify` converts a finished symbolic expression into a fast numeric function.

## Your turn

In the **Practice** tab you write `derivative(expr)`. Then three challenges use real data.
