A function defined **inside** another function can use the outer function's variables, even after the outer function has finished. This is called a **closure**, and it is the basis of function factories, callbacks and decorators. This lesson explains how closures work, when to use `nonlocal`, and the classic bug that catches everybody once.

You will learn:

- functions defined inside functions
- how an inner function captures variables
- `nonlocal` for changing a captured variable
- function factories such as `make_multiplier`
- the late-binding bug in loops, and how to fix it
- closures compared with classes

## A function inside a function

```python
def outer():
    message = "hello"

    def inner():
        return message.upper()

    return inner

shout = outer()
print(shout())
```

`outer` has finished, but `inner` still remembers `message`. Python keeps the variable alive because the inner function refers to it. That remembered variable is called a **free variable**, and the inner function together with its variables is a **closure**.

## Function factories

A **factory** is a function that builds and returns other functions, each configured by its arguments:

```python
def make_multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5), triple(5))
```

Each call to `make_multiplier` makes a **new** closure with its own `factor`. You can inspect what a closure captured:

```python
print(double.__closure__[0].cell_contents)
print(double.__code__.co_freevars)
```

## Changing a captured variable

An inner function can **read** a variable of the enclosing function without any declaration. But an assignment makes the name **local** to the inner function, so this fails:

<!-- expect-error -->
```python
def make_counter():
    count = 0

    def increment():
        count += 1
        return count

    return increment

counter = make_counter()
counter()
```

The error says the local variable `count` was used before it was assigned. Python saw `count +=` and decided `count` belongs to `increment`. Declare it with `nonlocal` to say "the one from the enclosing function":

```python
def make_counter(start=0):
    count = start

    def increment():
        nonlocal count
        count += 1
        return count

    return increment

counter = make_counter()
print(counter(), counter(), counter())

other = make_counter(100)
print(other(), counter())
```

Each counter has its own `count`, so `other` and `counter` do not affect each other.

`nonlocal` looks in the enclosing functions. It is different from `global`, which refers to the module level.

## Mutable state without nonlocal

If the captured value is a **mutable object**, such as a list, you can change it without `nonlocal`, because you modify the object and do not assign to the name:

```python
def make_logger():
    lines = []

    def log(text):
        lines.append(text)
        return len(lines)

    return log

log = make_logger()
log("a")
print(log("b"))
```

## The loop-variable capture bug

Closures capture the **variable**, not its value at that moment. This is called **late binding**, and it causes a famous bug when you build functions in a loop:

```python
functions = []
for i in range(3):
    functions.append(lambda: i)

print([f() for f in functions])
```

You might expect `[0, 1, 2]`, but you get `[2, 2, 2]`. All three lambdas share the **same** `i`, and by the time they are called, the loop has finished and `i` is 2.

The fix is to bind the current value when you create the function, with a **default argument**, because defaults are evaluated immediately:

```python
functions = []
for i in range(3):
    functions.append(lambda i=i: i)

print([f() for f in functions])
```

Another clean fix is a factory function, which gives every closure its own variable:

```python
def make_returner(value):
    return lambda: value

functions = [make_returner(i) for i in range(3)]
print([f() for f in functions])
```

## Closures or classes?

A closure with `nonlocal` state is a lightweight object with one behaviour. When you need several methods, or state that people should look at, a class is clearer. A useful rule: **one function with a little private state is a closure. Several functions sharing state is a class.** You learn classes in the next tier.

## Common mistakes

- Assigning to a captured variable without `nonlocal`.
- Building functions in a loop and expecting each one to keep its own loop value.
- Using `global` when `nonlocal` was needed, or the other way round.
- Making closures over large objects and keeping them alive for longer than needed.

## Recap

- An inner function remembers the variables of the function that made it. Together they are a closure.
- Factories return functions configured by their arguments.
- `nonlocal` lets an inner function rebind a captured variable.
- Late binding means all closures in a loop share the loop variable. Fix it with a default argument or a factory.

## Your turn

In the **Practice** tab you write `make_counter(start=0)`. Then three challenges use the Chinook store.
