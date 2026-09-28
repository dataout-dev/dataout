This lesson begins a short tour of **design patterns**: named, reusable solutions to problems that come up again and again in object-oriented code. **Creational patterns** are about **how objects get built**. You will meet the factory function, the registry-based abstract factory, the builder, and a pointed warning about the most famous pattern of all: the singleton.

You will learn:

- the factory function: hiding *which* class gets built
- an abstract factory built from a registry (connecting back to the metaclass section's registration idea)
- the builder pattern, for objects with many optional parts
- why singletons are usually a bad idea in Python, and what to use instead
- the prototype idea, via `copy`

## The factory function

A **factory** is a function whose job is to build and return an object, hiding the decision of exactly **which** class to instantiate:

```python
class Circle:
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

class Square:
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2

def make_shape(spec):
    kind = spec["kind"]
    if kind == "circle":
        return Circle(spec["radius"])
    if kind == "square":
        return Square(spec["side"])
    raise ValueError(f"unknown shape kind: {kind}")

shapes = [make_shape({"kind": "circle", "radius": 2}), make_shape({"kind": "square", "side": 3})]
print([round(s.area(), 2) for s in shapes])
```

Code that calls `make_shape` never needs to know `Circle` or `Square` exist by name — it just describes what it wants, in data.

## An abstract factory via a registry

Instead of one growing `if`/`elif` chain (an Open/Closed violation from the previous lesson), a **registry** lets each shape register itself, and the factory just looks the kind up:

```python
shape_registry = {}

def shape(kind):
    def decorator(cls):
        shape_registry[kind] = cls
        return cls
    return decorator

@shape("circle")
class Circle:
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

@shape("square")
class Square:
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2

def make_shape(spec):
    cls = shape_registry[spec["kind"]]
    return cls(**{k: v for k, v in spec.items() if k != "kind"})

print(round(make_shape({"kind": "circle", "radius": 4}).area(), 2))
```

Adding a `Triangle` needs only a new `@shape("triangle")` class — `make_shape` itself never changes, which is the Open/Closed Principle in action. This is the same decorator-based registration idea from the metaclasses lesson, now used for a genuinely common purpose.

## The builder pattern

When an object has **many optional parts**, and constructing it in one giant call would be unreadable, a **builder** assembles it step by step:

```python
class Pizza:
    def __init__(self, size, toppings):
        self.size = size
        self.toppings = toppings

    def __repr__(self):
        return f"Pizza({self.size}, {self.toppings})"

class PizzaBuilder:
    def __init__(self, size):
        self.size = size
        self.toppings = []

    def add(self, topping):
        self.toppings.append(topping)
        return self

    def build(self):
        return Pizza(self.size, list(self.toppings))

pizza = PizzaBuilder("large").add("cheese").add("mushroom").add("olives").build()
print(pizza)
```

Each `add` returns `self`, allowing the calls to **chain**. `build()` produces the final, immutable-in-spirit result. This shape (chained calls, then a final `build`) is common enough that you will recognise it immediately in other libraries once you have built one yourself.

## Why singletons are risky in Python

The classic **singleton** pattern guarantees a class has only **one** instance, globally, for the whole program:

```python
class SingletonConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

a = SingletonConfig()
b = SingletonConfig()
print(a is b)
```

This works, but it is usually the **wrong** tool. A singleton is really just a global variable wearing a disguise, and it inherits every problem global mutable state has: it makes testing hard (state leaks between tests unless carefully reset), it hides a dependency that a function secretly relies on, and it makes code harder to reason about, because "the one instance" can be changed from anywhere.

## The Pythonic alternative: a module-level instance

Python **modules** are already singletons — a module is only ever imported (and its top-level code only ever run) once, and then cached. A plain module-level object gives you the same "there is only one" guarantee, with far less ceremony and no `__new__` trickery:

```python
class _Config:
    def __init__(self):
        self.debug = False

config = _Config()
```

Anyone who does `from mymodule import config` gets the **same** object, automatically. If you need the dependency to be explicit and testable (usually the better choice), pass `config` into whatever needs it, rather than reaching for a global at all — the dependency-injection lesson, later in this section, develops that idea properly.

## The prototype idea

A **prototype** builds new objects by **copying** an existing, pre-configured one, rather than constructing from scratch each time — exactly the `copy`/`deepcopy` tools from earlier in this tier, used deliberately as a creation strategy:

```python
import copy

default_settings = {"theme": "light", "font_size": 12, "options": {"autosave": True}}

def new_settings():
    return copy.deepcopy(default_settings)

user_settings = new_settings()
user_settings["theme"] = "dark"
print(default_settings["theme"], user_settings["theme"])
```

## Common mistakes

- Growing one giant `if`/`elif` factory function instead of a registry, and having to edit it for every new type.
- Reaching for a singleton where a module-level instance, or an explicitly passed-in object, would be simpler and more testable.
- Forgetting `return self` in a builder's chained methods.
- Deep-copying a prototype only shallowly, and sharing nested mutable state by accident (the copying-objects lesson's exact trap).

## Your turn

In the **Practice** tab you write `make_shape(spec)`, a factory function. Then three challenges use real data.
