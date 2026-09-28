Every value in Python has a **type**. The type decides what the value is and what you can do with it. You can add two numbers, but you cannot add a number to a word and get anything sensible. Knowing the basic types is like knowing the difference between nouns and verbs. It makes everything else easier.

You will learn:

- the five basic types: `int`, `float`, `str`, `bool` and `None`
- how to ask Python what type something is
- why the type decides which operations work
- what "truthy" and "falsy" mean, and the difference between mutable and immutable

## Asking for the type

The built-in `type()` tells you the type of any value:

```python
type(42)
```

```python
type("hello")
```

Python answers with `<class 'int'>` and `<class 'str'>`. A **class** is another word for a type. You will not build your own until much later.

## int: whole numbers

An `int` is a whole number, positive, negative or zero. Python's integers can be enormous. There is no fixed limit.

```python
year = 2025
big = 2 ** 100
print(year, big)
```

## float: numbers with a decimal point

A `float` is a number with a fractional part. Any number written with a `.` is a float, even `3.0`.

```python
price = 4.99
ratio = 3.0
print(type(price), type(ratio))
```

`3` and `3.0` are equal in value, but they are different types.

## str: text

A `str` (string) is text: a sequence of characters between quotes. Single and double quotes do the same job.

```python
name = "Ada"
greeting = 'Hello'
print(greeting, name)
```

Strings get a whole section of their own later in this tier.

## bool: True and False

A `bool` has only two values, `True` and `False`. They are written with a capital first letter, and no quotes. Comparisons produce them:

```python
5 > 3
```

```python
10 == 11
```

Booleans are what programs use to make decisions, as you will see soon.

## None: nothing here

`None` is a special value that means "no value". It is the only value of its type, `NoneType`. It is used when something has not been set, or when a function has nothing to give back.

```python
result = None
print(result)
type(result)
```

A missing measurement in a data table is often stored as `None`. The penguin data you will use later does exactly that.

## Types decide what works

The same symbol can do different things depending on the type:

```python
print(2 + 3)
print("2" + "3")
```

With numbers, `+` adds. With strings, `+` joins. Now try to mix them:

<!-- expect-error -->
```python
"5" + 5
```

You get a `TypeError`: Python cannot add text to a number, and it will not guess. If you meant to join, turn the number into text first. If you meant to add, turn the text into a number. You will learn how in the lesson on conversion.

Multiplying a string by a whole number repeats it, which is surprising but very handy:

```python
"ha" * 3
```

## Checking types in code

`isinstance(value, type)` answers "is this value of that type?" with `True` or `False`:

```python
isinstance(5, int)
```

```python
isinstance("5", int)
```

The text `"5"` looks like a number, but it is a `str`. This is a very common source of confusion in real data, where numbers often arrive as text.

## Truthy and falsy

When Python needs a yes-or-no answer, any value can stand in for a boolean:

- **Falsy** values count as `False`: `0`, `0.0`, the empty string `""`, `None`, and empty containers such as `[]`.
- Everything else is **truthy**.

```python
print(bool(0), bool(""), bool(None))
print(bool(7), bool("text"), bool(" "))
```

Notice that a string containing only a space is truthy, because it is not empty.

## Mutable and immutable, at a glance

Numbers, strings, booleans and `None` are **immutable**: once created, a value never changes. When you write `x = x + 1` you make a *new* number and move the label. Some types, such as lists, are **mutable**: you can change them in place. That distinction matters a lot later, and we will return to it in the collections section.

## Common mistakes

- Treating `"5"` (text) as the number `5`.
- Writing `true` or `false` in lower case. Python needs `True` and `False`.
- Forgetting that `3` and `3.0` are different types, even though they are equal.
- Using `None` where you meant `0` or an empty string. They are all different.

## Recap

- The five basic types are `int`, `float`, `str`, `bool` and `None`.
- `type()` and `isinstance()` tell you what you have.
- The type decides which operations work: `+` adds numbers and joins strings, but mixing them is a `TypeError`.
- Zero, empty text and `None` are falsy. Almost everything else is truthy.

## Your turn

In the **Practice** tab you are given a variable called `value`. Store its type in a variable called `kind`.
