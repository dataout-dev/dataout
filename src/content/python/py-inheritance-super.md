A `Dog` and a `Cat` are both `Animal`s: they share a name, and each makes its own sound. Writing that similarity out by hand in two unrelated classes would duplicate code and hide the relationship. **Inheritance** lets one class build directly on another, reusing what is common and changing only what differs.

You will learn:

- the subclass syntax, and what "is-a" means
- inheriting attributes and methods for free
- calling the parent's method with `super()`
- extending a method versus fully overriding it
- the classic bug: forgetting to call `super().__init__()`

## A base class

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} makes a sound"

generic = Animal("Some creature")
print(generic.speak())
```

## Subclassing

`class Dog(Animal):` says "a `Dog` **is an** `Animal`, plus whatever I add here". A subclass with no body of its own inherits **everything**:

```python
class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow"

tom = Cat("Tom")
print(tom.name)
print(tom.speak())
print(isinstance(tom, Animal), isinstance(tom, Cat))
```

`Cat` never defined `__init__`, yet `Cat("Tom")` works, because Python looks it up on `Animal` when it is not found on `Cat` itself — the same attribute lookup order from earlier lessons, now spanning two classes. `Cat` **overrides** `speak`, replacing the parent's version entirely for cat instances.

## Calling the parent with super()

Sometimes a subclass needs **more** than the parent's `__init__` sets up, but does not want to repeat the parent's own logic. `super()` gives you a proxy for the parent, so you can call its methods and then add your own work:

```python
class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed

    def speak(self):
        return f"{self.name} says Woof ({self.breed})"

rex = Dog("Rex", "Labrador")
print(rex.name, rex.breed)
print(rex.speak())
```

`super().__init__(name)` runs `Animal.__init__` on this same instance, setting `self.name`, exactly as if `Animal("Rex")` alone had built it. Then `Dog.__init__` continues, adding `breed`. This is **extending**: keep the parent's behaviour, and add to it.

## The classic bug: forgetting super().__init__

If a subclass defines its own `__init__` **without** calling `super().__init__(...)`, the parent's setup never runs, and the attributes it would have created simply do not exist:

<!-- expect-error -->
```python
class BrokenDog(Animal):
    def __init__(self, name, breed):
        self.breed = breed

rex = BrokenDog("Rex", "Labrador")
print(rex.name)
```

The error is an `AttributeError: 'BrokenDog' object has no attribute 'name'`. Whenever a subclass overrides `__init__`, ask: does the parent's `__init__` still need to run? Almost always, yes.

## Extending versus overriding

- **Extending**: call `super().method(...)`, then add more. Used above for `__init__`.
- **Overriding**: replace the parent's method completely, with no call to `super()` at all. Used above for `speak` in `Cat`.

Both are legitimate. Choose extending when the parent's version does useful, still-correct work that you want to keep; choose overriding when the child's behaviour is genuinely different.

## Inheritance models "is-a"

Reach for inheritance when the relationship is genuinely "a `Dog` is a kind of `Animal`". If the relationship is really "a `Car` **has an** `Engine`", inheritance is the wrong tool — the design principles section later in this tier calls this out properly, but it is worth keeping in mind from the start: do not inherit from a class merely to reuse a method that has nothing to do with an is-a relationship.

## Checking the relationship in code

```python
print(isinstance(rex, Dog), isinstance(rex, Animal))
print(issubclass(Dog, Animal), issubclass(Animal, Dog))
```

`isinstance` asks about one **object**; `issubclass` asks about the relationship between two **classes**. Both understand inheritance: a `Dog` instance is reported as an instance of `Animal` too.

## Common mistakes

- Forgetting `super().__init__(...)` in a subclass that defines its own `__init__`.
- Calling `Animal.__init__(self, name)` by name instead of `super().__init__(name)` (it works for simple cases, but `super()` is the idiom, and behaves correctly with more advanced inheritance you meet later in this section).
- Using inheritance for a "has-a" relationship that does not fit "is-a".
- Overriding a method and accidentally changing what callers expect it to do (more on this next lesson).

## Recap

- `class Child(Parent):` inherits every attribute and method, and can override any of them.
- `super().method(...)` calls the parent's version, typically to extend `__init__`.
- Forgetting `super().__init__(...)` is the most common inheritance bug: parent attributes silently never get set.
- `isinstance` and `issubclass` understand the whole inheritance chain.

## Your turn

In the **Practice** tab you build an `Animal` base class with `Dog` and `Cat` subclasses. Then three challenges use real data.
