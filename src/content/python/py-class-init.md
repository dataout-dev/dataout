A **class** is a blueprint for objects that share the same shape and behaviour. This lesson writes your first classes: the `class` statement, the constructor `__init__`, instance attributes, and how Python looks an attribute up.

You will learn:

- the `class` statement and how to create instances
- `__init__`, the constructor
- instance attributes, and why every method starts with `self`
- creating many independent instances
- attribute lookup: instance first, then class
- why adding attributes on the fly is usually a bad idea

## Your first class

```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

box = Rectangle(3, 4)
print(box.width, box.height, box.area())
```

`class Rectangle:` defines a new type. `__init__` is the **constructor**: Python calls it automatically right after creating a new, empty instance, so it can set up the starting attributes. `Rectangle(3, 4)` creates an instance and calls `__init__(instance, 3, 4)` on it.

## self

Every method's first parameter is the instance it was called on, by convention named `self`. You never pass it explicitly; Python supplies it:

```python
print(box.area())
print(Rectangle.area(box))
```

Both lines do the same thing. `box.area()` is shorthand for looking up `area` on the class and calling it with `box` as the first argument. Forgetting `self` in a method definition is one of the most common beginner errors, and it produces a `TypeError` about a missing argument, because Python still passes the instance in.

## Instance attributes

`self.width = width` stores a value **on this particular instance**. Each instance keeps its own attributes, in its own private dictionary:

```python
a = Rectangle(2, 5)
b = Rectangle(10, 1)
print(a.width, b.width)
print(a.__dict__)
a.width = 99
print(a.width, b.width)
```

Changing `a.width` never touches `b`. They are separate objects.

## Creating many instances

A class is a factory. Call it as many times as you like:

```python
sizes = [(1, 1), (2, 3), (5, 5)]
boxes = [Rectangle(w, h) for w, h in sizes]
print([box.area() for box in boxes])
```

## Attribute lookup order

When you write `obj.name`, Python looks first on the **instance**, then on the **class** (and the classes it inherits from, which you meet next lesson). A method like `area` is found on the class, because it was defined with `def` inside the class body, not inside `__init__`:

```python
print("area" in box.__dict__)
print("area" in Rectangle.__dict__)
```

`area` lives on the class and is shared by every instance. `width` and `height` live separately, on each instance.

## Adding attributes dynamically

Because instances store their attributes in a dictionary, you *can* add a new one at any time, from outside the class:

```python
box.colour = "blue"
print(box.colour)

other = Rectangle(1, 1)
print(hasattr(other, "colour"))
```

This works, but it is usually a **bad idea**: `other` has no `colour`, so code that assumes every `Rectangle` has one will crash unpredictably. Declare every attribute your class needs inside `__init__`, so that every instance is created in a complete, consistent state.

## A class with default values

Parameters of `__init__` can have defaults, exactly like any function:

```python
class Rectangle:
    def __init__(self, width, height=None):
        self.width = width
        self.height = height if height is not None else width

    def area(self):
        return self.width * self.height

square = Rectangle(4)
print(square.width, square.height, square.area())
```

A `Rectangle(4)` with no height becomes a square.

## Common mistakes

- Forgetting `self` as the first parameter of a method.
- Writing `def __init__(self):` and forgetting to store the arguments as `self.x = x`.
- Adding attributes from outside the class, so that different instances have different shapes.
- Confusing `Rectangle` (the class, a blueprint) with `Rectangle(3, 4)` (an instance, one rectangle).

## Recap

- `class Name:` defines a blueprint. `Name(...)` creates an instance and calls `__init__`.
- `self` is the instance a method was called on; Python supplies it automatically.
- `self.attr = value` inside `__init__` gives every instance its own value.
- Attribute lookup checks the instance first, then the class.

## Your turn

In the **Practice** tab you write a `Rectangle` class with `width`, `height` and `area()`. Then three challenges build small classes from real data.
