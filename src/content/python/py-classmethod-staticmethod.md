Not every method needs an instance to work on. This lesson introduces two special kinds of method — `classmethod` and `staticmethod` — and their most common use: **alternative constructors**, extra ways to build an object besides the default `__init__`.

You will learn:

- `@classmethod` and the `cls` parameter
- `@staticmethod`, and how it differs from a classmethod
- writing alternative constructors like `from_string` and `from_dict`
- how alternative constructors interact with inheritance
- when a plain module-level function is the better choice

## The problem: only one __init__

`__init__` has a fixed job: it initialises `self` with the arguments it is given. But real data does not always arrive in that shape. Suppose you often receive a player as one text: `"Ada:95"`. You could parse it before calling the constructor every time, but that is easy to forget and to get wrong in more than one place.

## classmethod: an alternative constructor

A **classmethod** receives the **class** itself as its first argument, conventionally named `cls`, instead of an instance. That lets it build and return a **new instance**:

```python
class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    @classmethod
    def from_string(cls, text):
        name, score = text.split(":")
        return cls(name, int(score))

    def __repr__(self):
        return f"Player({self.name!r}, {self.score})"

p = Player.from_string("Ada:95")
print(p.name, p.score)
```

Two things to notice. First, `from_string` is called on the **class**, `Player.from_string(...)`, not on an instance. Second, it uses `cls(...)` rather than `Player(...)` to build the result — that small habit is what makes alternative constructors work correctly with inheritance, shown below.

## staticmethod: no automatic argument at all

A **staticmethod** receives **neither** `self` nor `cls`. It behaves like a plain function that happens to live inside the class, usually because it is closely related to it:

```python
class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    @staticmethod
    def is_valid_name(name):
        return bool(name) and name.isalpha()

print(Player.is_valid_name("Ada"), Player.is_valid_name("A1"))
```

A static method could just as well be a module-level function; putting it on the class is purely for organisation, to say "this belongs conceptually with `Player`".

## classmethod versus staticmethod

| | Receives | Typical use |
| - | -------- | ----------- |
| instance method | `self` | ordinary behaviour that needs the instance's data |
| `@classmethod` | `cls` | alternative constructors, or anything that needs the *class*, not one instance |
| `@staticmethod` | nothing extra | a helper that is related to the class but needs no instance or class data |

## Several alternative constructors

A class can have as many named constructors as it needs, each with a clear name that says what it expects:

```python
class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    @classmethod
    def from_string(cls, text):
        name, score = text.split(":")
        return cls(name, int(score))

    @classmethod
    def from_dict(cls, data):
        return cls(data["name"], data["score"])

    @classmethod
    def rookie(cls, name):
        return cls(name, 0)

a = Player.from_dict({"name": "Grace", "score": 88})
b = Player.rookie("Alan")
print(a.name, a.score, b.name, b.score)
```

Compare this with a single `__init__` that tries to guess what kind of argument it was given. Separate, named constructors are far easier to read and to call correctly.

## Why cls, and not the class name directly?

Using `cls(...)` instead of writing `Player(...)` matters once **subclasses** exist (the next section covers inheritance properly). A classmethod inherited by a subclass still builds an instance of the **subclass**, because `cls` is bound to whichever class the method was actually called through:

```python
class PremiumPlayer(Player):
    pass

premium = PremiumPlayer.from_string("Zoe:100")
print(type(premium).__name__)
```

If `from_string` had said `return Player(name, int(score))` instead, this would have wrongly produced a plain `Player`, even when called on `PremiumPlayer`.

## When a module-level function is better

Not everything belongs on the class. If a function does not need to know anything about the class's internals and is useful on its own, a plain function is simpler and more discoverable:

```python
def parse_score_line(text):
    name, score = text.split(":")
    return name, int(score)

print(parse_score_line("Ada:95"))
```

Reach for a classmethod specifically when the result should be **an instance of the class** (or of whichever subclass it was called on). Reach for a staticmethod mainly for readability, when a closely related helper does not need `self` or `cls` at all — a plain module function usually works just as well.

## Common mistakes

- Writing `Player(...)` instead of `cls(...)` inside a classmethod, which breaks subclassing.
- Forgetting the `@classmethod` or `@staticmethod` decorator, so Python still passes `self` where you did not expect it.
- Using a staticmethod when a classmethod was really needed (for example, to build an instance).
- Cramming unrelated helpers onto a class just because they mention its name.

## Recap

- `@classmethod` methods receive the class as `cls`, and are the standard way to write alternative constructors.
- `@staticmethod` methods receive nothing automatic; they are ordinary functions grouped under the class for organisation.
- Alternative constructors should build with `cls(...)`, so subclasses get the right type.

## Your turn

In the **Practice** tab you add a `from_string` classmethod to a `Player` class. Then three challenges use real data.
