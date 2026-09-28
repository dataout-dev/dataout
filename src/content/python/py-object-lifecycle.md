You have used `__init__` many times, but it is not actually where an object's life begins. This lesson looks at the full lifecycle: creation with `__new__`, initialisation with `__init__`, and what happens at the end — reference counting, cycles, and why relying on cleanup-on-deletion is risky.

You will learn:

- how `__new__` creates the (empty) instance, before `__init__` runs
- reference counting, and when an object is actually freed
- reference cycles, and the cyclic garbage collector
- `__del__`, and why it is unreliable for cleanup
- `weakref`, briefly
- context managers as the better alternative for cleanup

## __new__ creates, __init__ initialises

`SomeClass(args)` actually does two steps: `__new__` builds a bare instance, and then `__init__` fills it in:

```python
class Traced:
    def __new__(cls, *args, **kwargs):
        print("new: creating an instance")
        instance = super().__new__(cls)
        return instance

    def __init__(self, name):
        print("init: setting up", name)
        self.name = name

t = Traced("x")
print(t.name)
```

You almost never need to override `__new__` yourself. The two cases where people do are subclassing an immutable built-in (like `str` or `tuple`, because there is no "empty instance" to fill in afterwards) and certain metaprogramming tricks in later lessons. For ordinary classes, `__init__` is all you write.

## Reference counting

CPython (the usual Python implementation) frees an object as soon as its **reference count** — the number of names and containers pointing at it — reaches zero:

```python
import sys

x = [1, 2, 3]
print(sys.getrefcount(x))
y = x
print(sys.getrefcount(x))
del y
print(sys.getrefcount(x))
```

(`getrefcount` itself briefly holds one extra reference while it runs, so the numbers are one higher than you might expect — the important part is that they go up and down.) Once the last reference disappears, the memory is reclaimed right away. This is why simple Python programs rarely need to think about memory management at all.

## Reference cycles

Reference counting alone cannot free objects that point to **each other**, keeping each other's count above zero forever, even though nothing outside can reach them:

```python
class Node:
    def __init__(self, name):
        self.name = name
        self.partner = None

a = Node("a")
b = Node("b")
a.partner = b
b.partner = a
print(a.partner.name, b.partner.name)
```

`a` and `b` reference each other. If you then did `del a; del b`, plain reference counting could never bring either count to zero. Python's **cyclic garbage collector** runs periodically in the background and finds exactly these unreachable cycles, freeing them anyway:

```python
import gc

print(gc.isenabled())
collected = gc.collect()
print(collected >= 0)
```

You essentially never need to call `gc.collect()` yourself; it is shown here only so you know it exists.

## __del__: a finaliser, not a destructor

`__del__` runs when an object is about to be freed:

```python
class Loud:
    def __init__(self, name):
        self.name = name

    def __del__(self):
        print(f"goodbye from {self.name}")

def make_one():
    Loud("temporary")
    print("function ending")

make_one()
```

This looks tidy, but `__del__` has real problems: its **timing is not guaranteed** (an object caught in a reference cycle may be finalised much later, or, in unusual cases, not at all before the program exits), it must never raise (exceptions inside `__del__` are only printed, not propagated), and it makes an object's cleanup invisible at the call site, unlike an explicit `close()`.

## weakref: referencing without keeping alive

A `weakref` points at an object **without** increasing its reference count, so it does not by itself keep the object alive. It is used for caches and observer lists, where you want to know about an object only while something else still needs it:

```python
import weakref

class Resource:
    pass

r = Resource()
ref = weakref.ref(r)
print(ref() is r)
del r
print(ref())
```

Once the only strong reference (`r`) is gone, the weak reference resolves to `None` instead of keeping the `Resource` alive.

## The better alternative: context managers

For anything that truly needs cleanup — files, network connections, locks — do not rely on `__del__` at all. Use a **context manager** (the `with` statement), which you already used for files, and which you will learn to write for your own classes in the data model section of this tier:

```python
class Connection:
    def __enter__(self):
        print("open")
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        print("close")
        return False

with Connection() as conn:
    print("using the connection")
```

Cleanup here happens at a precise, visible point in the code, whether or not an exception occurred, and it does not depend on the garbage collector's timing at all.

## Common mistakes

- Overriding `__new__` when overriding `__init__` was all that was needed.
- Relying on `__del__` to close a file or a network connection reliably and promptly.
- Letting an exception happen inside `__del__` and being surprised it does not stop the program.
- Assuming Python is purely reference-counted and cycles are never collected.

## Recap

- `__new__` creates the raw instance; `__init__` fills it in. You almost never override `__new__`.
- CPython frees an object the moment its reference count reaches zero; cycles need the separate cyclic collector.
- `__del__` runs at an unpredictable time and must never raise. Prefer explicit cleanup with context managers.
- `weakref` references an object without keeping it alive.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
