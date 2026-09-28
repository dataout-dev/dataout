You met shallow versus deep copying for lists and dictionaries back in Foundations. Custom objects raise the same question, with an extra twist: you can **customise** exactly how your own classes get copied. This lesson covers `copy.copy`, `copy.deepcopy`, and the `__copy__`/`__deepcopy__` hooks.

You will learn:

- `copy.copy`: a shallow copy of any object
- `copy.deepcopy`: a full, recursive copy
- the shared-reference bug inside a shallow copy of a container of containers
- `__copy__` and `__deepcopy__`, for custom behaviour
- immutability as an alternative to copying altogether

## Shallow copy of a plain object

```python
import copy

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p1 = Point(1, 2)
p2 = copy.copy(p1)
p2.x = 99
print(p1.x, p2.x)
```

For an object with only simple, immutable attributes (numbers, strings), a shallow copy behaves exactly like a fully independent copy: `p1` and `p2` do not affect each other, because assigning `p2.x = 99` merely rebinds `p2`'s own `x`, without touching `p1` at all.

## The shared-reference bug

The trouble starts when an attribute is itself a **mutable container**. A shallow copy copies the *reference* to that container, not the container's own contents:

```python
import copy

class Config:
    def __init__(self, options):
        self.options = options

original = Config({"debug": False})
shallow = copy.copy(original)
shallow.options["debug"] = True
print(original.options)
```

`shallow.options` and `original.options` are **the same dictionary**. Mutating it through one name is visible through the other — the identical aliasing hazard you first met with plain lists, now hiding inside an attribute.

## Deep copy: recursively independent

`copy.deepcopy` walks the whole object graph and makes a fresh copy of **everything**, including nested containers:

```python
import copy

original = Config({"debug": False})
deep = copy.deepcopy(original)
deep.options["debug"] = True
print(original.options, deep.options)
```

Now the two are genuinely independent, all the way down.

## Custom __copy__ and __deepcopy__

Sometimes the default recursive behaviour is not what you want — perhaps some part of an object should always be **shared** (a connection, a cache), even in a deep copy. Implementing `__copy__` and `__deepcopy__` lets you take full control:

```python
import copy

class Config:
    def __init__(self, options, shared_cache):
        self.options = options
        self.shared_cache = shared_cache

    def __deepcopy__(self, memo):
        new_options = copy.deepcopy(self.options, memo)
        return Config(new_options, self.shared_cache)

cache = {"loaded": True}
original = Config({"debug": False}, cache)
deep = copy.deepcopy(original)
deep.options["debug"] = True
print(original.options, deep.options)
print(deep.shared_cache is cache)
```

`options` is deep-copied (fully independent), but `shared_cache` is deliberately passed through unchanged — exactly the behaviour you often want for something like a database connection or a large read-only resource that should never be duplicated.

## The memo dictionary

The `memo` argument to `__deepcopy__` is a dictionary that `deepcopy` uses to remember what it has already copied, by object id — this is what lets `deepcopy` correctly handle an object that (directly or indirectly) **refers to itself**, without looping forever:

```python
import copy

class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

a = Node(1)
a.next = a
b = copy.deepcopy(a)
print(b.next is b)
```

Passing `memo` along whenever you call `copy.deepcopy` recursively inside your own `__deepcopy__` (as the `Config` example did) is important precisely for this reason, even in classes that are not self-referential themselves — it keeps the whole copy operation consistent.

## Immutability: avoiding the question entirely

The cleanest way to avoid copying bugs is often to **not need to copy at all**. An immutable (or frozen) object can be freely shared between as many names as you like, with no risk, because nothing can ever mutate it out from under another reference:

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: float
    y: float

p1 = Point(1, 2)
p2 = p1
print(p1 is p2, p1 == p2)
```

There is no meaningful difference between "sharing" and "copying" an immutable value — both are equally safe, because neither side can ever change it. This is the same idea the value-objects lesson develops further, later in this section.

## Choosing between copy, deepcopy, and immutability

- Use a **shallow copy** when an object's attributes are all immutable, or when sharing nested containers is genuinely intended.
- Use **deepcopy** when you need a fully independent structure, and are willing to pay the cost of copying everything.
- Prefer **immutable** value objects when you can, to remove the question altogether.

## Common mistakes

- Using `copy.copy` on an object with mutable attributes, and being surprised that changes leak through.
- Forgetting to pass `memo` along in a custom `__deepcopy__` when recursing into nested attributes.
- Deep-copying something that should be shared on purpose, such as a database connection or a large cache.

## Recap

- `copy.copy` makes a shallow copy: nested mutable attributes are still shared.
- `copy.deepcopy` recursively copies everything, using a `memo` dictionary to handle shared and self-referential structures safely.
- `__copy__`/`__deepcopy__` let a class control exactly what gets duplicated and what stays shared.
- Immutable value objects sidestep the whole question.

## Your turn

In the **Practice** tab you write a `Config` class whose `deepcopy` does not share nested dictionaries. Then three challenges use real data.
