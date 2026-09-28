Welcome to Object-Oriented Python. Before you write your first class, it helps to see clearly what you have been using all along: **every single value in Python is an object**. Numbers, strings, functions, modules, even classes themselves. This lesson makes that idea concrete, and gives you the vocabulary — identity, type and value — that the rest of the tier builds on.

You will learn:

- what "everything is an object" really means
- `id()`, `type()` and the difference between `is` and `==`
- objects, names and references, in one picture
- that built-in values already have attributes and methods
- `dir()` and `vars()` for exploring an object

## Every value is an object

An **object** is a piece of data together with what you can do with it. In Python, that includes the "primitive" things other languages treat specially:

```python
print(type(42), type(3.14), type("hi"), type([1, 2]), type(print), type(type))
```

Every one of these is an **instance of a class**. `42` is an instance of `int`, `"hi"` is an instance of `str`, and even `print` is an instance of a function type. Classes are themselves objects, instances of `type`, which is why `type(type)` is `type`.

## Identity, type and value

Every object has three things:

- **Identity**: where it lives, which never changes. `id(obj)` returns a number that represents it.
- **Type**: what kind of object it is, which never changes either.
- **Value**: the data it holds, which *can* change for a mutable object.

```python
a = [1, 2, 3]
b = a
c = [1, 2, 3]
print(id(a) == id(b), id(a) == id(c))
print(a is b, a is c)
print(a == c)
```

`a` and `b` are **the same object**: two names for one identity. `a` and `c` are **different objects** that happen to hold **equal values**.

## is versus ==

- `is` compares **identity**: are these two names the same object?
- `==` compares **value**: do these hold equal data? (It calls `__eq__`, which you will meet later in this tier.)

```python
x = [1, 2]
y = [1, 2]
print(x == y, x is y)

name1 = "python"
name2 = "python"
print(name1 == name2, name1 is name2)
```

The last line often surprises people: short strings and small integers are **cached** by Python's implementation, so `is` can accidentally succeed for them. **Never rely on this.** Use `is` only for `None`, `True`, `False`, and for asking "are these the same object", never as a shortcut for equality.

```python
value = None
print(value is None)
print(value == None)
```

Both work here, but `is None` is the idiom, and it also works correctly for objects whose `__eq__` is unusual.

## Names are references, not boxes

A common misconception is that a variable is a box holding a value. In Python, a name is a **label attached to an object**. Assignment attaches the label to a (possibly different) object; it never copies data on its own:

```python
first = [1, 2, 3]
second = first
second.append(4)
print(first)

second = [9, 9]
print(first, second)
```

Appending through `second` changed the **one list** that both names pointed to. Rebinding `second` to a new list only moved that **one label**; `first` still points at the old object. This picture — names pointing at objects, objects living independently — explains aliasing bugs, function arguments, and why `copy` exists.

## Built-in values already have behaviour

Numbers and strings are not "just data". They are full objects, with methods:

```python
print((5).bit_length())
print("hello".upper())
print([3, 1, 2].__class__)
print((1).__add__(2))
```

`(1).__add__(2)` is what `1 + 2` actually calls, underneath. You will use this fact heavily later in this tier, when you teach your own classes to respond to `+`, `==`, `len()`, and more.

## Exploring an object

Two built-ins let you look inside anything:

```python
print(dir(3)[-8:])
print(vars(print)) if False else print(type(print))

class Empty:
    pass

e = Empty()
e.colour = "red"
print(vars(e))
print("colour" in dir(e))
```

`dir(obj)` lists the names available on it. `vars(obj)` shows its instance attributes as a dictionary (it fails on objects, like `3`, that store their value differently). Adding `e.colour = "red"` on the fly works because a plain object keeps its attributes in a dictionary — the next lesson explains exactly how.

## Common mistakes

- Using `is` to compare numbers or strings for equality.
- Believing `b = a` copies a list. It only copies the reference.
- Confusing a mutable object's changing **value** with its identity, which never changes.
- Forgetting that functions, modules and classes are objects too, and can be passed around like any other value.

## Recap

- Everything in Python is an object, with an identity, a type and a value.
- `is` compares identity; `==` compares value. Use `is` only for `None`/`True`/`False` and genuine identity questions.
- A name is a reference to an object, not a box that holds a copy.
- `dir()` and `vars()` let you inspect any object from the outside.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
