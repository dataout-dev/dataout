Why can a function use its own variables without disturbing the ones outside? What happens when a function calls another function, which calls another? This lesson answers these questions. It is a little more abstract than the earlier ones, but understanding **scope** and the **call stack** will save you from a whole class of confusing bugs.

You will learn:

- what a local variable is, and where a name is visible
- the rule Python uses to look up a name (LEGB)
- what the call stack is, and how a function call works step by step
- why global variables are risky, and what `global` and `nonlocal` do

## Local variables

A name created inside a function exists only inside that function:

```python
def make_greeting():
    message = "Hello"
    return message + "!"

print(make_greeting())
```

Outside the function, `message` does not exist:

<!-- expect-error -->
```python
def make_greeting():
    message = "Hello"
    return message + "!"

make_greeting()
print(message)
```

You get a `NameError`. The function's variables are created when it is called and forgotten when it returns. Parameters are local variables too.

## Same name, different variable

Because locals are separate, two functions can use the same names without any clash. A function can even reuse a name that exists outside it:

```python
x = "outside"

def test():
    x = "inside"
    return x

print(test())
print(x)
```

The `x` inside the function is a brand new local variable. The outer `x` is untouched.

## Where does Python look for a name? LEGB

When your code uses a name, Python looks for it in four places, in this order:

1. **L**ocal: inside the current function.
2. **E**nclosing: inside any function that contains this one.
3. **G**lobal: at the top level of the file.
4. **B**uilt-in: names Python provides, such as `len` and `print`.

It stops at the first place that has the name. So a function can *read* a global variable without any special step:

```python
rate = 0.2

def add_tax(price):
    return price * (1 + rate)

print(add_tax(100))
```

## Assigning creates a local

The catch: as soon as a function *assigns* to a name, Python treats it as local for the *whole* function. This causes a famous error:

<!-- expect-error -->
```python
counter = 0

def bump():
    counter = counter + 1
    return counter

bump()
```

`UnboundLocalError`: Python sees `counter =` inside the function, decides `counter` is local, and then complains that you are reading it before giving it a value.

## global: changing a global name

If you really do want to change the global variable, declare it with `global`:

```python
counter = 0

def bump():
    global counter
    counter += 1

bump()
bump()
print(counter)
```

This works, but use it sparingly. Global variables let any function change your data from afar, which makes bugs hard to find. It is nearly always better to pass values in as arguments and return results.

## The call stack

Every time a function is called, Python creates a fresh **frame**: a small workspace that holds the function's local variables and remembers where to go back to. Frames are stacked on top of each other. This pile is the **call stack**.

```python
def c():
    return "c done"

def b():
    return "b then " + c()

def a():
    return "a then " + b()

print(a())
```

Follow the stack. `a` is called and gets a frame. It calls `b`, which gets a frame on top. `b` calls `c`, which gets a frame on top of that. `c` returns, and its frame is removed. Then `b` finishes, and then `a`. The last function called is the first to finish.

This is exactly what a traceback shows you: the frames on the stack when the error happened, with the deepest one last.

## Functions inside functions, and nonlocal

A function can be defined inside another. The inner one can read the outer one's variables (the **enclosing** scope). To change one, use `nonlocal`:

```python
def make_counter():
    count = 0

    def next_value():
        nonlocal count
        count += 1
        return count

    return next_value

counter = make_counter()
print(counter(), counter(), counter())
```

Each call to `make_counter` creates its own `count`, and the inner function remembers it. This is called a **closure**, and you will meet it again in the second tier.

## Mutable arguments cross the boundary

Scope protects names, but not objects. If you pass a list into a function and the function changes it, the caller sees the change, because both names refer to the same list:

```python
def add_one(items):
    items.append(1)

data = []
add_one(data)
print(data)
```

## Common mistakes

- Expecting a function's variables to exist after it returns.
- Assigning to a global name inside a function without `global`, and getting an `UnboundLocalError`.
- Overusing global variables instead of parameters and return values.
- Naming a local variable the same as a built-in, such as `list` or `sum`.

## Recap

- Names created in a function are local and disappear when it returns.
- Python looks up names in the order Local, Enclosing, Global, Built-in.
- Assigning to a name inside a function makes it local for the whole function.
- Each call gets a frame on the call stack, and the last call is the first to finish.
- `global` and `nonlocal` change outer names. Pass values in and return results instead whenever you can.
