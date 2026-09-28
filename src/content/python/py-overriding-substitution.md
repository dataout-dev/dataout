When you override a method, you are making a promise: **anywhere the parent class was expected, a subclass instance should work just as well.** This idea has a name — the **Liskov substitution principle** — and this lesson shows what it means in practice, with `isinstance`/`issubclass`, and what happens when an override breaks the promise.

You will learn:

- overriding, and extending with `super()`, revisited with a family of shapes
- `isinstance` and `issubclass` in real conditions
- the substitution idea, in plain language
- preconditions and postconditions across a hierarchy
- how a subclass can quietly change the meaning of a method

## A family of shapes

```python
class Shape:
    def area(self):
        raise NotImplementedError("subclasses must implement area()")

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

shapes = [Rectangle(3, 4), Circle(2)]
print([round(s.area(), 2) for s in shapes])
```

`Shape.area` raises on purpose: it exists only to say "every real shape must provide this", and is never meant to be called directly. (The abstract base classes lesson, later in this tier, gives you a way to **enforce** that instead of merely documenting it.)

## Writing code that works for any shape

The whole point of a shared base class is that code written against `Shape` works for **every** subclass, without knowing which one it has:

```python
def total_area(shapes):
    return sum(shape.area() for shape in shapes)

print(round(total_area(shapes), 2))
```

`total_area` never mentions `Rectangle` or `Circle`. Add a `Triangle` subclass tomorrow, and `total_area` keeps working with no changes at all. This is **substitutability**: anywhere a `Shape` is expected, any subclass instance can be substituted in.

## isinstance and issubclass in real conditions

```python
def describe(shape):
    if isinstance(shape, Circle):
        return f"a circle of radius {shape.radius}"
    if isinstance(shape, Rectangle):
        return f"a {shape.width}x{shape.height} rectangle"
    return "some shape"

for s in shapes:
    print(describe(s))

print(issubclass(Circle, Shape), issubclass(Circle, Rectangle))
```

`isinstance` checks work through the whole chain: a subclass instance passes `isinstance(x, Parent)` too, which is exactly what makes substitution work.

## The Liskov idea, in plain language

Named after Barbara Liskov, the principle says: **if `S` is a subclass of `T`, you should be able to use an `S` wherever a `T` is expected, without the caller noticing anything is wrong.** Concretely, an override should not:

- require **more** than the parent promised (a stricter precondition), or
- deliver **less** than the parent promised (a weaker postcondition), or
- raise a new kind of error that callers of the parent never had to expect.

## A violation, made concrete

Suppose `total_area` was written to trust that `area()` always returns a non-negative number, because that is what every sensible shape should promise. A subclass that breaks this quietly poisons any code that relies on it:

```python
class BuggyTriangle(Shape):
    def __init__(self, base, height):
        self.base = base
        self.height = height

    def area(self):
        return -(self.base * self.height / 2)

broken = [Rectangle(2, 2), BuggyTriangle(3, 4)]
print(total_area(broken))
```

Nothing crashes — that is exactly the danger. `total_area` still runs, but it silently gives a wrong answer, because `BuggyTriangle` violated the unwritten postcondition "an area is never negative". `total_area` did nothing wrong; the subclass broke the substitution promise.

## A subtler violation: a stricter precondition

```python
class PickyRectangle(Rectangle):
    def area(self):
        if self.width != self.height:
            raise ValueError("PickyRectangle only handles squares")
        return super().area()

odd_one_out = [Rectangle(2, 3), PickyRectangle(4, 4), PickyRectangle(2, 3)]
```

<!-- expect-error -->
```python
print(total_area(odd_one_out))
```

`Rectangle.area()` never raised for any width and height. `PickyRectangle` **narrows** what is accepted, which breaks any code that was written to trust the parent's wider promise. This is a Liskov violation even though, syntactically, everything overrides correctly.

## Common mistakes

- Overriding a method to accept a narrower range of inputs than the parent promised.
- Overriding a method to return a value outside the range callers were told to expect.
- Writing `isinstance` checks for every subclass inside code that should have stayed generic, defeating the point of polymorphism.
- Assuming "it compiles and runs" means the override is a safe substitute.

## Recap

- Code written against a base class should work, unmodified, for every subclass — that is substitutability.
- `isinstance`/`issubclass` follow the whole inheritance chain.
- An override that requires more or promises less than its parent violates the Liskov substitution principle, even without raising a syntax error.
- Design overrides to keep every promise the base class made.

## Your turn

In the **Practice** tab you write a `Shape` hierarchy and a `total_area(shapes)` function that works with any of them. Then three challenges use real data.
