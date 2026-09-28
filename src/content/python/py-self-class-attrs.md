Attributes can live in two different places: on each **instance** separately, or shared once on the **class**. Confusing the two is one of the most common object-oriented bugs in Python, especially when the shared attribute is a mutable list or dictionary. This lesson makes the difference precise.

You will learn:

- how `self` is passed to a method, in detail
- class attributes, shared by every instance
- a class attribute used as a counter
- the mutable-class-attribute bug, and how to avoid it
- when a class attribute is the right tool

## Instance attributes: one copy per object

You already know these: values set with `self.name = value` inside a method, usually `__init__`. Each instance has its own.

## Class attributes: one copy, shared

A value written directly in the class body, not inside a method, belongs to the **class**, and every instance shares the same one:

```python
class Dog:
    species = "Canis familiaris"

    def __init__(self, name):
        self.name = name

rex = Dog("Rex")
fido = Dog("Fido")
print(rex.species, fido.species)
print(Dog.species)
```

Reading `rex.species` looks first on the instance (nothing there), then finds it on the class. Both dogs share the exact same string.

## Counting instances

A class attribute is perfect for information that belongs to the **class as a whole**, such as how many instances exist:

```python
class Tracked:
    count = 0

    def __init__(self):
        Tracked.count += 1

Tracked()
Tracked()
Tracked()
print(Tracked.count)
```

Notice `Tracked.count += 1`, written on the **class**, not `self.count += 1`. That distinction matters, and the next section shows why.

## The trap: assigning through self

Writing `self.count += 1` does **not** update the shared class attribute. It reads `count` from the class (since the instance has none yet), computes a new value, and then creates a **new instance attribute** with that name, which now shadows the class one for this instance only:

```python
class Bad:
    count = 0

    def __init__(self):
        self.count += 1

a = Bad()
b = Bad()
print(a.count, b.count, Bad.count)
```

Each instance now has its own `count` of `1`, and the shared `Bad.count` never moved. Whenever you want to **change** a class-level value, assign to the class name explicitly: `ClassName.attribute = ...`.

## The mutable class attribute bug

This trap is worse when the class attribute is a **mutable** object, like a list, because every instance reads the *same* list, and mutating it (not reassigning it) affects everyone:

```python
class ShoppingCart:
    items = []

    def add(self, item):
        self.items.append(item)

cart1 = ShoppingCart()
cart2 = ShoppingCart()
cart1.add("apple")
print(cart2.items)
```

`cart2` never called `add`, but it sees `"apple"`, because `self.items.append(...)` mutated the **one shared list**. The fix is to give each instance its **own** list, in `__init__`:

```python
class ShoppingCart:
    def __init__(self):
        self.items = []

    def add(self, item):
        self.items.append(item)

cart1 = ShoppingCart()
cart2 = ShoppingCart()
cart1.add("apple")
print(cart1.items, cart2.items)
```

**Rule of thumb:** mutable state that should differ between instances belongs in `__init__`, assigned to `self`. Only genuinely shared, usually immutable, values belong directly in the class body.

## How self is actually passed

When Python evaluates `rex.bark()`, it does two things: it looks up `bark` starting from the type of `rex`, and it **binds** that function to `rex`, producing what is called a **bound method**. Calling the bound method supplies `rex` as the first argument automatically:

```python
class Dog:
    def bark(self):
        return f"{self.name}: Woof!"

    def __init__(self, name):
        self.name = name

rex = Dog("Rex")
bound = rex.bark
print(bound)
print(bound())
print(Dog.bark(rex))
```

`rex.bark` is a bound method object, remembering both the function and `rex`. `Dog.bark` (accessed on the class) is just the plain function, and needs the instance passed explicitly.

## Common mistakes

- Writing `self.count += 1` and expecting the class-level count to change.
- Using a mutable default like `[]` or `{}` as a class attribute for per-instance data.
- Forgetting that reading a class attribute through an instance works fine; it is only *writing* through `self` that creates a shadowing instance attribute.

## Recap

- Attributes set in the class body are shared. Attributes set with `self.x = ...` are per-instance.
- `self.count += 1` creates a new instance attribute; assign to `ClassName.count` to change the shared one.
- Never use a mutable object as a class attribute for data that should differ per instance — put it in `__init__`.

## Your turn

In the **Practice** tab you write `Tracked`, a class that counts its own instances. Then three challenges use real data.
