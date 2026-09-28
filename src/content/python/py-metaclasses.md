You learned early in this tier that everything is an object, including classes themselves — a class is an **instance of `type`**. This closing insight opens the door to a genuinely advanced technique: **metaclasses**, which let you customise what happens when a class is *created*, not just when an instance is created from it. Most Python code never needs one, but understanding them clarifies what a class actually *is*.

You will learn:

- `type` as the class of classes
- creating a class dynamically with `type(name, bases, dict)`
- `__init_subclass__`, a lighter alternative for most needs
- class decorators, which solve many of the same problems even more simply
- when a metaclass is genuinely justified, and the classic pitfall

## type is the class of classes

```python
class Point:
    pass

print(type(Point))
print(type(Point()))
print(isinstance(Point, type))
```

Every class you have written is, itself, an instance of `type`. `class Point: pass` is really just a convenient syntax for asking `type` to build a new class object.

## Creating a class with type(name, bases, dict)

You can call `type` directly, with three arguments: the class's name, a tuple of base classes, and a dictionary of its attributes and methods:

```python
def greet(self):
    return f"hi, I'm {self.name}"

Person = type("Person", (), {"greet": greet, "species": "human"})

p = Person()
p.name = "Ada"
print(p.greet(), p.species)
print(type(Person))
```

This is exactly what the `class` statement compiles down to. Seeing it spelled out this way makes clear that a class body is just a way of building a dictionary of attributes, which `type` then turns into a class object.

## __init_subclass__: a lighter hook

Before reaching for a full metaclass, check whether `__init_subclass__` solves your problem — it runs automatically whenever a **subclass** is defined, without any of the complexity of a metaclass:

```python
class Plugin:
    registry = {}

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        Plugin.registry[cls.__name__] = cls

class CsvPlugin(Plugin):
    pass

class JsonPlugin(Plugin):
    pass

print(sorted(Plugin.registry))
```

Every time a class inherits from `Plugin`, it is automatically registered — no decorator, no metaclass, just a hook that fires at class-definition time.

## Class decorators: usually the simplest tool

A **class decorator** is a function that takes a class and returns one (often the same class, modified), applied with `@` exactly like a function decorator. For "do something when this class is defined", it is usually simpler than either of the above:

```python
registry = {}

def register(cls):
    registry[cls.__name__] = cls
    return cls

@register
class Cat:
    pass

@register
class Dog:
    pass

print(sorted(registry))
```

## When a real metaclass is justified

A metaclass customises **class creation itself** — the actual mechanics of how a `class` statement is turned into a class object — which none of the tools above do. Reach for one when you need to:

- validate or transform a class's **attributes** before the class object even exists,
- inject behaviour into **every** class in a family, automatically, in a way that plain inheritance cannot express, or
- control what happens when the class statement's namespace is built (an advanced technique using `__prepare__`, beyond this lesson's scope).

```python
class UpperAttrMeta(type):
    def __new__(mcs, name, bases, namespace):
        upper_namespace = {
            (key.upper() if not key.startswith("__") else key): value
            for key, value in namespace.items()
        }
        return super().__new__(mcs, name, bases, upper_namespace)

class Example(metaclass=UpperAttrMeta):
    greeting = "hi"

print(Example.GREETING)
```

Every attribute name in `Example`'s body was upper-cased **before** the class was even built — something no class decorator or `__init_subclass__` could do, because by the time either of those runs, the class already exists with its original names.

## The classic pitfall: metaclass conflicts

If two base classes have **different, incompatible metaclasses**, Python cannot combine them, and raises immediately:

<!-- expect-error -->
```python
class MetaA(type):
    pass

class MetaB(type):
    pass

class A(metaclass=MetaA):
    pass

class B(metaclass=MetaB):
    pass

class C(A, B):
    pass
```

This is one of the reasons metaclasses are used sparingly in real codebases: they do not compose as easily as mixins do, and combining two unrelated libraries that each define their own metaclass can become genuinely difficult.

## A decision guide

| You need to... | Reach for |
| --------------- | --------- |
| run code when a class is defined | a class decorator |
| run code when a class is **subclassed**, automatically for the whole family | `__init_subclass__` |
| change how the class's **own attributes are built**, before the class exists | a metaclass |

In practice, the overwhelming majority of "clever class tricks" you will ever need are class decorators or `__init_subclass__`. Recognise metaclasses when you meet them (often in frameworks such as ORMs), but reach for the simpler tools first.

## Common mistakes

- Reaching for a metaclass when `__init_subclass__` or a class decorator would do.
- Forgetting that two unrelated metaclasses cannot always be combined through multiple inheritance.
- Confusing `__init_subclass__` (runs per subclass, simple) with a metaclass's `__new__`/`__init__` (runs for every class using that metaclass, including indirectly, and controls the class-building mechanics themselves).

## Your turn

In the **Practice** tab you write `register(cls)`, a class decorator that records a class by name. Then three challenges use real data.
