A **decorator** is a function that takes another function and returns a new, improved one. You have probably seen the `@` symbol above a function definition. Decorators are used for timing, logging, caching, checking permissions and much more, and they let you add that behaviour **without changing the function itself**.

You will learn:

- how a decorator wraps a function
- the `@` syntax
- `functools.wraps`, and why you should always use it
- decorators with arguments
- practical examples: timing, logging, counting and caching

## Functions in, functions out

A decorator is built from ideas you already know: functions are values, and closures remember variables. Here is a decorator written by hand:

```python
def shout(function):
    def wrapper(*args, **kwargs):
        result = function(*args, **kwargs)
        return result.upper()
    return wrapper

def greet(name):
    return "hello, " + name

greet = shout(greet)
print(greet("ada"))
```

`shout` takes the original `greet`, and returns `wrapper`. We then replace the name `greet` with the wrapper. The wrapper calls the original, and changes the result.

## The @ syntax

The `@` line above a function is a shorthand for exactly that replacement:

```python
def shout(function):
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs).upper()
    return wrapper

@shout
def greet(name):
    return "hello, " + name

print(greet("ada"))
```

`@shout` above `def greet` means `greet = shout(greet)`. The wrapper takes `*args` and `**kwargs`, so it works for any function, whatever its parameters.

## The wrapper must return the result

A very common mistake is to forget the `return`. The decorated function then returns `None`:

```python
def careless(function):
    def wrapper(*args, **kwargs):
        function(*args, **kwargs)
    return wrapper

@careless
def add(a, b):
    return a + b

print(add(2, 3))
```

## functools.wraps

After decoration, the function's **name and documentation** are those of the wrapper, which is confusing in error messages and help:

```python
def plain(function):
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs)
    return wrapper

@plain
def add(a, b):
    "Add two numbers."
    return a + b

print(add.__name__, add.__doc__)
```

`functools.wraps` copies the name, docstring and other details from the original onto the wrapper:

```python
from functools import wraps

def better(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs)
    return wrapper

@better
def add(a, b):
    "Add two numbers."
    return a + b

print(add.__name__, add.__doc__)
print(add.__wrapped__(1, 2))
```

Use `@wraps(function)` in every decorator you write.

## Counting calls

The wrapper is an ordinary function, so it can have **attributes**. Here is a decorator that counts how often a function is called:

```python
from functools import wraps

def counted(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return function(*args, **kwargs)
    wrapper.calls = 0
    return wrapper

@counted
def hello():
    return "hi"

hello()
hello()
print(hello.calls)
```

## Timing

A timing decorator measures how long each call takes:

```python
import time
from functools import wraps

def timed(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return function(*args, **kwargs)
        finally:
            wrapper.last_seconds = time.perf_counter() - start
    wrapper.last_seconds = None
    return wrapper

@timed
def slow_sum(n):
    return sum(range(n))

print(slow_sum(100000))
print(slow_sum.last_seconds >= 0)
```

The `try`/`finally` records the time even when the function raises an error.

## Decorators with arguments

To give a decorator settings, add **one more level**: a function that takes the settings and returns the real decorator:

```python
from functools import wraps

def repeat(times):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = function(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say(word):
    print(word)
    return word

say("hey")
```

`@repeat(3)` first calls `repeat(3)`, which returns `decorator`, and then applies `decorator` to `say`. Three layers can look strange at first. Read them from the outside in: settings, function, call.

## Caching results

A decorator can remember earlier answers, so a repeated call with the same arguments does not have to be computed again. This is called **memoisation**:

```python
from functools import wraps

def memoize(function):
    cache = {}

    @wraps(function)
    def wrapper(*args):
        if args not in cache:
            cache[args] = function(*args)
        return cache[args]

    return wrapper

@memoize
def slow_square(n):
    print("computing", n)
    return n * n

print(slow_square(4))
print(slow_square(4))
```

The second call prints no "computing" line, because the answer came from the cache. The standard library already provides `functools.cache` and `lru_cache`, which you meet in a later lesson.

## Stacking decorators

You can apply several. They are applied from the bottom up, closest to the function first:

```python
def bold(f):
    return lambda *a: "<b>" + f(*a) + "</b>"

def italic(f):
    return lambda *a: "<i>" + f(*a) + "</i>"

@bold
@italic
def word(text):
    return text

print(word("hi"))
```

## Common mistakes

- Forgetting to `return` the result inside the wrapper.
- Forgetting `@wraps`, and losing the function's name and docstring.
- Writing `@repeat` when the decorator needs arguments and you meant `@repeat(3)`.
- Decorating a function and expecting the original to be unchanged. The name now refers to the wrapper.

## Recap

- A decorator takes a function and returns a wrapped one. `@name` is a shorthand for `f = name(f)`.
- The wrapper takes `*args, **kwargs` and returns the result of the original call.
- Use `functools.wraps` to keep the function's identity.
- A decorator with arguments has one more level: settings, function, wrapper.

## Your turn

In the **Practice** tab you write the decorator `counted(fn)`. Then three challenges use the Chinook store.
