In the last lesson you saw that a function takes input through parameters. Python gives you a lot of flexibility here. You can give parameters default values, pass arguments by name, and accept a variable number of arguments. These features are what make well-written functions pleasant to use.

## Positional arguments

By default, arguments are matched to parameters **by position**: first to first, second to second.

```python
def describe(name, age):
    return f"{name} is {age}"

print(describe("Ada", 36))
print(describe(36, "Ada"))
```

The second call swaps the meaning, and Python cannot tell.

## Keyword arguments

You can name the parameter when you call the function. Then the order does not matter, and the call explains itself:

```python
def describe(name, age):
    return f"{name} is {age}"

print(describe(age=36, name="Ada"))
print(describe("Ada", age=36))
```

You can mix the two, but positional arguments must come first.

## Default values

Give a parameter a default with `=`. If the caller leaves it out, the default is used:

```python
def apply_discount(price, pct=10):
    return round(price * (1 - pct / 100), 2)

print(apply_discount(200))
print(apply_discount(200, 25))
print(apply_discount(200, pct=50))
```

Parameters with defaults must come **after** those without.

## The mutable default trap

Never use a list or dictionary as a default. It is created once, when the function is defined, and shared by every call:

```python
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("a"))
print(add_item("b"))
```

The second call shows `["a", "b"]`, which surprises almost everyone. The safe pattern uses `None` as the default:

```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(add_item("a"))
print(add_item("b"))
```

## Any number of arguments: *args

A parameter written `*args` collects all the extra positional arguments into a tuple:

```python
def total(*numbers):
    result = 0
    for n in numbers:
        result += n
    return result

print(total(1, 2, 3))
print(total())
```

## Named extras: **kwargs

A parameter written `**options` collects extra keyword arguments into a dictionary:

```python
def show(**details):
    for key, value in details.items():
        print(key, "=", value)

show(name="Ada", city="London")
```

## Unpacking when you call

The stars also work in the call, to spread a list or dictionary into arguments:

```python
def add(a, b, c):
    return a + b + c

values = [1, 2, 3]
print(add(*values))

named = {"a": 1, "b": 2, "c": 3}
print(add(**named))
```

## Keyword-only and positional-only

A bare `*` in the parameter list forces the rest to be passed by name:

```python
def connect(host, *, timeout=5):
    return f"{host} with timeout {timeout}"

print(connect("example.org", timeout=10))
```

This is good for options that are easy to confuse. A `/` does the opposite for parameters before it.

## Common mistakes

- Putting a parameter with a default before one without.
- Using a list or dictionary as a default value.
- Mixing up the order of positional arguments.
- Calling with too few or too many arguments, which raises a `TypeError` that tells you exactly what is missing.

## Recap

- Arguments match by position, or by name with keywords.
- `def f(x, y=5)` gives `y` a default. Use `None` for defaults that would be lists or dictionaries.
- `*args` collects extra positional arguments and `**kwargs` collects extra keyword ones.
- Stars in a call unpack a list or dictionary into arguments.

## Your turn

In the **Practice** tab you write `apply_discount(price, pct=10)` that returns the price after a percentage discount, rounded to 2 decimal places.
