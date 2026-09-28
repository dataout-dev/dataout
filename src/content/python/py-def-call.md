You have been *using* functions since your first lesson: `print`, `len`, `round` and `sorted` are all functions that someone else wrote. Now you learn to write your own. A **function** is a named, reusable block of code. It is the single most important tool for keeping programs organised, and you will use it in almost everything you write from now on.

## Why functions?

Imagine you need to convert grams to kilograms in ten places. You could copy the same line ten times, and when the rule changes you fix it ten times. With a function you write it once, give it a name, and use the name wherever you need it.

Functions give you three things:

- **No repetition.** Write it once, use it many times.
- **Names.** `to_kilograms(mass)` explains itself better than `mass / 1000`.
- **Testing.** A small function is easy to test on its own.

## Defining a function

You define a function with the keyword `def`, then a name, brackets and a colon. The indented block below it is the **body**:

```python
def greet():
    print("Hello!")
```

Running this only *defines* the function. Nothing is printed yet. To run it, **call** it by writing its name with brackets:

```python
def greet():
    print("Hello!")

greet()
greet()
```

Each call runs the body once.

## Giving a function input

Most functions need some input. You list names for the input, called **parameters**, inside the brackets:

```python
def greet(name):
    print("Hello,", name)

greet("Ada")
greet("Bob")
```

Here `name` is the parameter. The value you give when you call the function, such as `"Ada"`, is the **argument**. On each call, the parameter refers to the argument.

You can have several parameters, separated by commas:

```python
def add(a, b):
    print(a + b)

add(2, 3)
```

## Giving a value back: return

A function that only prints is not very reusable. It is better to **return** a value, so that the caller can use it:

```python
def add(a, b):
    return a + b

result = add(2, 3)
print(result * 10)
```

`return` ends the function immediately and hands back the value. You can store it, print it, or use it in another calculation.

The difference between `print` and `return` is one of the most common confusions:

- `print` shows something on the screen for a human. The function's result is still `None`.
- `return` gives a value back to the program.

```python
def double_print(n):
    print(n * 2)

def double_return(n):
    return n * 2

a = double_print(4)
b = double_return(4)
print(a, b)
```

The first variable is `None` because that function returned nothing.

## A function without return gives None

If a function reaches its end without a `return`, Python quietly returns `None`. That is normal for functions that only *do* something, such as printing.

## A complete example

Here is a function that calculates an average, with a guard for empty input:

```python
def average(numbers):
    if len(numbers) == 0:
        return 0
    return sum(numbers) / len(numbers)

print(average([2, 4, 6]))
print(average([]))
```

The function takes one parameter and has two `return` statements. The first one returns early for the empty case.

## Functions calling functions

A function can use another one:

```python
def to_kg(grams):
    return grams / 1000

def describe(name, grams):
    return f"{name} weighs {to_kg(grams)} kg"

print(describe("Penguin", 3750))
```

## Define before you call

Python reads the file from top to bottom, so a function must be defined before the line that calls it runs. Put your definitions first.

## Common mistakes

- Forgetting the colon or the indentation after `def`.
- Writing `greet` without brackets, which refers to the function without calling it.
- Printing when you meant to return, so the caller receives `None`.
- Forgetting to use the returned value. `add(2, 3)` on its own line does nothing visible.
- Calling a function before it is defined.

## Recap

- `def name(parameters):` followed by an indented body defines a function.
- Call it with `name(arguments)`.
- `return value` hands a result back, and a function with no `return` gives `None`.
- Prefer returning values over printing them, and keep each function small and named clearly.

## Your turn

In the **Practice** tab you write a function `average(nums)` that returns the mean of a list of numbers, or `0` for an empty list.
