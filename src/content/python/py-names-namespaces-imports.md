Every name you use — a variable, a function, an imported module — is looked up according to a precise, well-defined set of rules. Understanding them explains some of Python's more surprising error messages before they ever surprise you.

You will learn:

- LEGB: the order a name is searched for
- the compile-time decision about which names are local
- `globals()` versus `locals()`
- module caching and `sys.modules`
- finders, loaders and import hooks, briefly
- circular imports

## LEGB

```python
x = "global"

def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print(x)   # finds the Local one first
    inner()
    print(x)       # finds the Enclosing one (outer's own x)

outer()
print(x)           # finds the Global one
```

A name lookup checks **L**ocal, then **E**nclosing (any surrounding function), then **G**lobal (module level), then **B**uilt-in (`len`, `print`, and so on) — stopping at the first scope where it actually finds the name.

## The compile-time "is this local" decision

```python
count = 0

def broken():
    print(count)   # UnboundLocalError, not the global `count`
    count = 1

# broken()  # would raise: cannot access local variable 'count' where it is not associated with a value
```

Python decides at *compile time*, by scanning the whole function body for assignments, which names are local to that function — for the entire function, not line by line. Because `count = 1` appears anywhere in `broken`, `count` is treated as local for the *whole* function, so the earlier `print(count)` fails looking for a local that has not been assigned yet, rather than quietly falling back to the global.

```python
count = 0

def fixed():
    global count
    print(count)
    count = 1

fixed()
print(count)
```

`global count` tells Python explicitly: this name refers to the module-level `count`, not a new local one.

## globals() and locals()

```python
y = 10

def show():
    z = 20
    print(list(locals().keys()))

show()
globals()["y"] = 99
print(y)
```

`globals()` is the real, live module namespace — writing into it (as above) genuinely changes `y`. `locals()` inside a function is typically a **snapshot** for inspection; mutating the dictionary it returns is not guaranteed to change the actual local variables, since CPython optimises local access in a way that does not go through a real dictionary at all.

## Module caching

```python
import sys

before = "json" in sys.modules
import json
after = "json" in sys.modules
print(before, after)
```

The first `import json` runs `json`'s module-level code and stores the resulting module object in `sys.modules["json"]`. Every later `import json` anywhere in the program just returns that cached object — module-level side effects (like a `print` at the top of a file) only ever run once per process.

## Finders, loaders and import hooks

When you write `import something`, Python asks a series of **finders** whether they know where `something` lives (a file on disk, a zip archive, a frozen module built into the interpreter), and the matching finder hands back a **loader** that knows how to actually execute it. This system is pluggable — libraries occasionally register custom finders to support importing from unusual places (a network location, an encrypted archive), though this is rare in ordinary application code.

## Lazy imports

```python
def convert_to_dataframe(rows):
    import pandas as pd   # imported only when this function is actually called
    return pd.DataFrame(rows)
```

Importing inside a function delays the cost (and the dependency) until that code path actually runs — useful for an optional, heavy dependency that most callers of a module never actually need.

## Watch out: circular imports

```text
# a.py
import b
def use_b():
    return b.value

# b.py
import a          # a is still mid-import here - this often fails or gets a half-initialised module
value = 42
```

If `a.py` imports `b.py` at the top level, and `b.py` imports `a.py` back at its own top level, whichever one runs first finds the other only partially initialised. The usual fixes: move one of the imports inside a function (delaying it until both modules have fully loaded), or restructure the code so the dependency is not actually mutual.

## Common mistakes

- Referencing a name inside a function before assigning to it anywhere in that function, not realising the later assignment already made it local for the whole function.
- Trying to mutate a function's locals through the dict `locals()` returns, and being confused when it has no effect.
- Being surprised that a module-level `print` only fires once, after being imported from multiple places.
- Structuring two modules so they depend on each other at the top level, then fighting circular import errors instead of restructuring the dependency.
