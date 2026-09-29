Most code operates on data. Metaprogramming is code that operates on *code itself* — inspecting a function's signature, generating a class dynamically, or registering subclasses automatically as they are defined.

You will learn:

- getattr and setattr
- inspect: signatures and source
- dynamic class creation
- __init_subclass__ registries
- code generation, briefly
- eval and exec risks

## getattr and setattr

```python
class Config:
    pass

config = Config()
setattr(config, "debug", True)
print(getattr(config, "debug"))
print(getattr(config, "missing", "default value"))
```

`getattr`/`setattr` access an attribute *by name*, computed at runtime — useful when the attribute name itself is not known until the program is running (read from a config file, a CLI argument, another object).

## inspect: signatures and source

```python
import inspect

def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

sig = inspect.signature(greet)
print(list(sig.parameters))
print(inspect.getsource(greet))
```

`inspect.signature` gives you a function's parameters programmatically (names, defaults, annotations) — the same information a tool like `pytest` or a web framework uses internally to figure out what a function needs.

## Dynamic class creation

```python
def __init__(self, value):
    self.value = value

DynamicClass = type("DynamicClass", (object,), {"__init__": __init__, "greeting": "hi"})
instance = DynamicClass(42)
print(instance.value, instance.greeting)
```

`type(name, bases, namespace)` is the same mechanism the `class` statement itself compiles down to — calling it directly builds a class from data computed at runtime, useful for a framework generating classes from a schema rather than hand-writing each one.

## __init_subclass__ registries

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

print(sorted(Plugin.registry.keys()))
```

`__init_subclass__` runs automatically whenever a subclass is defined — a common pattern for building a plugin registry with zero manual registration code: just inheriting from `Plugin` is enough to be added to `registry`.

## Code generation, briefly

```python
template = "def {name}(x):\n    return x {op} {value}\n"
source = template.format(name="add_ten", op="+", value=10)
namespace = {}
exec(source, namespace)
add_ten = namespace["add_ten"]
print(add_ten(5))
```

Generating source text and `exec`-ing it can build a family of similar functions from a template — a legitimate technique used by some libraries (dataclasses does something like this internally), but one that trades readability and easy debugging for flexibility, so it is worth reaching for only when the alternative is genuinely more repetitive.

## eval and exec risks

```python
# eval("2 + 2") is fine on a literal you wrote yourself
print(eval("2 + 2"))

# eval(user_supplied_string) is NOT shown here - running arbitrary text as Python
# code is one of the most direct code-execution risks in the language, covered
# in the earlier security lesson
```

`eval`/`exec` on anything containing untrusted input is a direct code-execution vulnerability, not a hypothetical one — the security lesson earlier in this tier covers this in more depth.

## Watch out: metaprogramming as the first tool

```python
class Simple:
    def __init__(self, value):
        self.value = value

# a plain class is easier to read, debug, and type-check than
# a dynamically-generated one for a case this straightforward
```

Metaprogramming solves real problems (registries, generated boilerplate, framework internals), but it also makes code harder to read, harder to debug (a dynamically created function has a less helpful traceback), and harder for a type checker to reason about. Reaching for a plain class or function first, and only introducing metaprogramming once a genuine, repeated need shows up, keeps most code far more approachable.

## Common mistakes

- Reaching for `type()`/`exec`-based class or function generation before a much simpler plain definition would do.
- Using `eval`/`exec` on any input that could ever come from outside your own code.
- Building a dynamic solution so clever that a type checker (or the next reader) can no longer follow what is actually happening.
- Forgetting `super().__init_subclass__(**kwargs)` inside a custom `__init_subclass__`, breaking cooperative behaviour if the class hierarchy grows deeper later.
