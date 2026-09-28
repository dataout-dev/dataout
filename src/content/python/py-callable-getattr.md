Two more special methods round out the "objects that feel built-in" theme: `__call__`, which lets an **instance** be used like a function, and the `__getattr__`/`__getattribute__` pair, which lets you intercept attribute access itself. Together they are the machinery behind decorators-as-classes, proxies, and dynamic wrappers.

You will learn:

- `__call__`, and objects that remember state between calls
- `__getattr__` for handling missing attributes
- `__getattribute__`, and why it is rarely what you want
- `__setattr__` and `__delattr__`
- `__dir__` for customising introspection
- the recursion trap inside `__setattr__`

## __call__: objects that act like functions

Any object with a `__call__` method can be used with `()`, exactly like a function:

```python
class CallCounter:
    def __init__(self):
        self.calls = 0

    def __call__(self, *args, **kwargs):
        self.calls += 1
        return f"call #{self.calls} with {args}"

counter = CallCounter()
print(counter(1, 2))
print(counter("x"))
print(counter.calls)
```

Unlike a plain function, a callable **object** can hold state between calls (here, `self.calls`) using ordinary instance attributes, and can offer additional methods and attributes alongside `__call__` itself. This is the same idea behind class-based decorators, and behind objects like `functools.partial`.

## __getattr__: a fallback for missing names

`__getattr__` is called **only when normal attribute lookup fails** — the instance and class do not have the name at all:

```python
class Config:
    def __init__(self, values):
        self.values = values

    def __getattr__(self, name):
        try:
            return self.values[name]
        except KeyError:
            raise AttributeError(name)

cfg = Config({"host": "localhost", "port": 8080})
print(cfg.host, cfg.port)
```

`cfg.host` is not a real attribute of `Config`; it exists only inside the `values` dictionary. `__getattr__` intercepts the failed lookup and answers on the dictionary's behalf, making dictionary keys read like attributes. Note the important detail: when the key truly does not exist, `__getattr__` raises `AttributeError` (not `KeyError`) — that is the exception Python (and things like `hasattr`) expect from a failed attribute lookup.

## __getattribute__: rarely what you want

`__getattribute__` is called for **every single** attribute access, successful or not — unlike `__getattr__`, which only fires on failure. Overriding it is powerful but dangerous, because it is so easy to create infinite recursion:

<!-- expect-error -->
```python
import sys
sys.setrecursionlimit(200)

class Loud:
    def __getattribute__(self, name):
        return self.name

Loud().anything
```

Every access, including `self.name` **inside** `__getattribute__` itself, re-triggers `__getattribute__`, forever. If you must override it, always fetch attributes through `object.__getattribute__(self, name)` to avoid calling yourself recursively. In practice, `__getattr__` is the right tool for nearly everything you will want to do; reach for `__getattribute__` only for advanced proxies.

## __setattr__ and the classic recursion bug

`__setattr__` intercepts **every** assignment to an attribute, including the ones inside `__init__`:

<!-- expect-error -->
```python
import sys
sys.setrecursionlimit(200)

class Broken:
    def __setattr__(self, name, value):
        self.__dict__[name] = value
        self.name = value

b = Broken()
b.x = 1
```

Wait — the recursion happens on the assignment `b.x = 1`, because `self.name = value` inside `__setattr__` is itself an assignment, so it calls `__setattr__` again, forever. The fix is to write directly into `self.__dict__`, or to call `super().__setattr__(name, value)`, never a plain `self.attr = ...` inside `__setattr__` itself:

```python
class Validated:
    def __setattr__(self, name, value):
        if name == "age" and value < 0:
            raise ValueError("age cannot be negative")
        super().__setattr__(name, value)

v = Validated()
v.age = 30
print(v.age)
```

<!-- expect-error -->
```python
class Validated:
    def __setattr__(self, name, value):
        if name == "age" and value < 0:
            raise ValueError("age cannot be negative")
        super().__setattr__(name, value)

v = Validated()
v.age = -1
```

(A single `@property` with a setter, from the earlier lesson, is usually a cleaner way to validate **one** named attribute; `__setattr__` is for when you need to intercept **every** attribute generically.)

## __delattr__

The equivalent hook for `del obj.name`:

```python
class Protected:
    def __delattr__(self, name):
        raise AttributeError(f"cannot delete {name}")

    def __init__(self):
        self.value = 1

p = Protected()
```

<!-- expect-error -->
```python
class Protected:
    def __delattr__(self, name):
        raise AttributeError(f"cannot delete {name}")

    def __init__(self):
        self.value = 1

p = Protected()
del p.value
```

## __dir__: customising introspection

`dir(obj)` calls `__dir__` if it is defined, which is useful for objects (like the `Config` above) whose "real" attributes are dynamic:

```python
class Config:
    def __init__(self, values):
        self.values = values

    def __getattr__(self, name):
        try:
            return self.values[name]
        except KeyError:
            raise AttributeError(name)

    def __dir__(self):
        return list(self.values.keys())

cfg = Config({"host": "localhost", "port": 8080})
print(sorted(dir(cfg)))
```

## Proxies: combining the ideas

A small logging proxy shows `__getattr__` and `__call__` working together, wrapping any object:

```python
class Proxy:
    def __init__(self, target):
        self._target = target

    def __getattr__(self, name):
        print(f"accessing {name}")
        return getattr(self._target, name)

proxy = Proxy([1, 2, 3])
print(proxy.append)
proxy.append(4)
print(proxy._target)
```

## Common mistakes

- Writing `self.name = value` inside `__setattr__` (infinite recursion). Use `super().__setattr__` or `self.__dict__[name] = value`.
- Raising `KeyError` instead of `AttributeError` from `__getattr__`, which breaks `hasattr` and normal attribute-error handling.
- Reaching for `__getattribute__` when `__getattr__` (fires only on failure) is all you need.
- Forgetting that `__getattr__` never fires for attributes that already exist — it is purely a fallback.

## Recap

- `__call__` lets instances behave like functions, with state carried between calls.
- `__getattr__` handles **missing** attributes; `__getattribute__` intercepts **every** access and is rarely needed.
- Inside `__setattr__`, always use `super().__setattr__` or `self.__dict__[...]`, never plain assignment, to avoid infinite recursion.
- `__dir__` customises what `dir()` reports.

## Your turn

In the **Practice** tab you write `CallCounter`, a callable that remembers how many times it was called. Then three challenges use real data.
