A class can inherit from **more than one** parent at once. That immediately raises a question: if two parents both define the same method, which one wins? Python answers this with a precise, computable order called the **method resolution order** (MRO). This lesson builds your intuition for it, step by step, including the notorious "diamond".

You will learn:

- multiple inheritance syntax
- `__mro__` and `mro()`
- the diamond problem
- how Python computes the order (C3 linearisation, in plain terms)
- how `super()` follows the MRO, not just "the parent"

## Multiple inheritance

```python
class Flyer:
    def move(self):
        return "flies"

class Swimmer:
    def move(self):
        return "swims"

class Duck(Flyer, Swimmer):
    pass

d = Duck()
print(d.move())
```

`Duck` lists two parents. Since both define `move`, Python has to pick one — here, `Flyer.move`, because `Flyer` is listed first.

## __mro__

Every class has an `__mro__`: the exact order Python searches when looking up a name.

```python
print([cls.__name__ for cls in Duck.__mro__])
print(Duck.mro() == list(Duck.__mro__))
```

Reading it: Python looks on `Duck` itself first, then `Flyer`, then `Swimmer`, then `object` (the ultimate ancestor of everything). The first match along this list wins, which is exactly why `Duck().move()` used `Flyer`'s version.

## The diamond

The **diamond problem** is what happens when two parents share a common ancestor:

```python
class Animal:
    def move(self):
        return "moves somehow"

class Flyer(Animal):
    def move(self):
        return "flies"

class Swimmer(Animal):
    def move(self):
        return "swims"

class Duck(Flyer, Swimmer):
    pass

print([cls.__name__ for cls in Duck.__mro__])
```

Naively, you might expect `Animal` to appear twice (once through each parent) — but the MRO lists it **once**, and always **after** both `Flyer` and `Swimmer`. Python's algorithm guarantees that a shared ancestor comes after all of its children, and that the order you listed the parents in (`Flyer` before `Swimmer`) is respected.

## How the order is computed, in plain terms

Python uses an algorithm called **C3 linearisation**. You do not need to compute it by hand, but the two rules that matter in practice are:

1. A class always comes **before** its parents.
2. If a class lists several parents, they appear in the **order you listed them**, and this order is preserved consistently for every class that inherits from them later.

If these rules cannot be satisfied consistently (a genuinely contradictory hierarchy), Python refuses to create the class, with a `TypeError` about an inconsistent MRO, rather than guessing:

<!-- expect-error -->
```python
class A:
    pass

class B(A):
    pass

class C(A, B):
    pass
```

Here `C(A, B)` demands `A` before `B`, but `B` already inherits from `A`, so `A` must come **after** `B` too — a contradiction, and Python raises immediately rather than picking an arbitrary order.

## super() follows the MRO, not "the parent"

This is the detail that trips people up most: `super()` does **not** mean "my direct parent class". It means "the **next** class in the MRO, after this one". In single inheritance the two coincide, which is why it feels like "the parent" — but with multiple inheritance, they can differ:

```python
class A:
    def greet(self):
        return "A"

class B(A):
    def greet(self):
        return "B -> " + super().greet()

class C(A):
    def greet(self):
        return "C -> " + super().greet()

class D(B, C):
    def greet(self):
        return "D -> " + super().greet()

print(D().greet())
print([cls.__name__ for cls in D.__mro__])
```

`D`'s `super()` goes to `B`. `B`'s `super()` goes to `C` (not `A`!), because that is the next class after `B` in `D`'s MRO. `C`'s `super()` finally reaches `A`. Each class's `super()` call **cooperates**, walking the whole chain exactly once — this is why well-designed classes for multiple inheritance always call `super()` rather than naming a parent directly, a pattern the next lesson explores in depth.

## When multiple inheritance is worth it

Multiple inheritance is most successful for small, focused **mixins** (the next lesson), each adding one capability, combined with a class that provides the core behaviour. Two large, independent hierarchies combined "just because" tend to produce exactly the diamond confusion this lesson describes — use it deliberately, not by accident.

## Common mistakes

- Assuming `super()` always means "my direct parent".
- Listing parents in an order that does not reflect priority, and being surprised which method wins.
- Fighting an MRO error by reordering base classes randomly instead of understanding the contradiction.
- Reaching for multiple inheritance when a single, focused hierarchy (or composition, covered soon) would be clearer.

## Your turn

In the **Practice** tab you write `mro_names(cls)`, returning the class names of a hierarchy's method resolution order. Then three challenges use real data.
