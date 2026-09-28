In Foundations you defined functions with a fixed list of parameters. Real functions are more flexible: `print` accepts any number of values, `sorted` has options that you can only give by name, and many functions pass their arguments on to another function. This lesson shows the tools Python gives you to write such functions.

You will learn:

- `*args`: collecting any number of positional arguments
- `**kwargs`: collecting any number of keyword arguments
- unpacking a list or dictionary into a call with `*` and `**`
- keyword-only parameters, with a bare `*`
- positional-only parameters, with `/`
- forwarding arguments to another function
- the mutable default argument trap

## *args: any number of positional arguments

A parameter with a star in front collects all the extra positional arguments into a **tuple**:

```python
def total(*numbers):
    print(numbers)
    return sum(numbers)

print(total(1, 2, 3))
print(total())
```

The name `args` is a convention. Any name works, but `*args` is what readers expect.

## **kwargs: any number of keyword arguments

Two stars collect the extra **keyword** arguments into a **dictionary**:

```python
def describe(**details):
    for key, value in details.items():
        print(f"{key} = {value}")

describe(name="Ada", born=1815)
```

You can combine ordinary parameters with both. The order is fixed: normal parameters, then `*args`, then `**kwargs`:

```python
def log(level, *messages, **options):
    sep = options.get("sep", " ")
    print(level.upper() + ":", sep.join(str(m) for m in messages))

log("info", "started", 3, "workers")
log("warn", "disk", "full", sep="-")
```

## Unpacking into a call

The same stars work in reverse when you **call** a function. `*` spreads a list or tuple into positional arguments, and `**` spreads a dictionary into keyword arguments:

```python
def volume(length, width, height):
    return length * width * height

sizes = [2, 3, 4]
print(volume(*sizes))

named = {"height": 4, "length": 2, "width": 3}
print(volume(**named))
```

You can spread more than one thing in a call, and mix them with ordinary arguments:

```python
first = [1, 2]
second = [3, 4]
print([*first, 99, *second])
print({**{"a": 1}, **{"b": 2}, "c": 3})
```

## Keyword-only parameters

Any parameter that comes **after** `*args` (or after a bare `*`) can only be given by name. That makes calls easier to read, and avoids mistakes with options that are easy to mix up:

```python
def scale(*numbers, factor=1, offset=0):
    return [n * factor + offset for n in numbers]

print(scale(1, 2, 3))
print(scale(1, 2, 3, factor=10))
print(scale(1, 2, 3, factor=2, offset=1))
```

Here, `factor` and `offset` must be spelled out. A bare star, without a name, does the same without collecting extra arguments:

```python
def connect(host, *, port=80, secure=False):
    return f"{'https' if secure else 'http'}://{host}:{port}"

print(connect("example.com", port=8080))
```

<!-- expect-error -->
```python
connect("example.com", 8080)
```

## Positional-only parameters

A `/` in the parameter list says that every parameter **before** it can only be given by position. Many built-in functions work this way, for example `len(obj=[1])` is not allowed:

```python
def half(x, /):
    return x / 2

print(half(10))
```

<!-- expect-error -->
```python
half(x=10)
```

Positional-only parameters let you rename a parameter later without breaking callers. They also allow a keyword name to be used in `**kwargs` without a clash.

## Forwarding arguments

A function often wraps another one, adding some behaviour and passing everything else through. `*args` and `**kwargs` make it work for **any** arguments:

```python
def shout(function, *args, **kwargs):
    result = function(*args, **kwargs)
    return str(result).upper()

print(shout(sorted, ["b", "a"], reverse=True))
print(shout("{} {}".format, "hi", "there"))
```

This is the pattern behind decorators, which you meet in a later lesson.

## The mutable default argument

A default value is created **once**, when the function is defined, not each time it is called. If the default is a list or dictionary and the function changes it, the change stays for the next call:

```python
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("a"))
print(add_item("b"))
```

The second call shows `['a', 'b']`. The list from the first call survived. The standard fix uses `None` as the default and makes a fresh list inside:

```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(add_item("a"))
print(add_item("b"))
```

## Common mistakes

- Using a list or dictionary as a default value.
- Forgetting that `*args` is a tuple and `**kwargs` a dictionary.
- Putting `*args` after a keyword-only parameter, or `**kwargs` before `*args`.
- Passing a keyword-only parameter by position.

## Recap

- `*args` collects extra positional arguments into a tuple, and `**kwargs` collects keyword arguments into a dictionary.
- `*` and `**` in a call unpack a sequence and a dictionary.
- After `*`, parameters are keyword-only. Before `/`, they are positional-only.
- Use `None` as the default for mutable values.

## Your turn

In the **Practice** tab you write `total(*nums, scale=1)`. Then three challenges use the Chinook store.
