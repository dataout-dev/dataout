Every Python program of any size is split into **modules**. You have written `import math` many times. This lesson looks behind the statement: what a module actually is, where Python finds it, why it runs only once, and how to write a file that works both as a program and as a library.

You will learn:

- what a module is, and the forms of `import`
- the module cache `sys.modules`
- the search path `sys.path`
- `if __name__ == "__main__":`
- circular imports, and how to break them
- reloading a module
- why you must not name your file like a standard library module

## A module is a file

A **module** is simply a Python file. When you import it, Python runs the file from top to bottom **once**, and gives you an object whose attributes are the names defined in the file.

```python
import math

print(type(math).__name__)
print(math.pi)
print(math.__name__)
print("sqrt" in dir(math))
```

You can even make a module object by hand:

```python
import types

tools = types.ModuleType("tools")
exec("def double(x):\n    return x * 2\n", tools.__dict__)
print(tools.double(21))
```

## The forms of import

```python
import statistics
from statistics import mean, median
from statistics import stdev as sd
import statistics as stats

print(statistics.mean([1, 2, 3]), mean([4, 5]), sd([1, 2, 3, 4]), stats.median([3, 1, 2]))
```

- `import module` gives you the module, and you write `module.name`.
- `from module import name` gives you just the name in your own namespace.
- `as` gives it another name.
- `from module import *` imports every public name. **Avoid it**: you can no longer tell where a name comes from, and names can silently overwrite each other.

## Modules run once: sys.modules

When you import a module, Python first looks in the **cache** `sys.modules`, a dictionary of the modules that are already loaded. If it is there, you get the same object again, and the file does not run a second time:

```python
import sys
import json

print("json" in sys.modules)
import json as second_reference
print(second_reference is json)
print(sys.modules["json"] is json)
```

That is why module-level code that prints something appears only the first time. It also means a module works as a shared, single instance, which is a simple way to keep settings that many parts of a program use.

## Where Python looks: sys.path

If the module is not in the cache, Python searches the folders listed in `sys.path`, **in order**. It contains the folder of your script, the folders in the environment variable `PYTHONPATH`, the standard library, and `site-packages`, where `pip` installs libraries:

```python
import sys

print(type(sys.path).__name__)
print(len(sys.path) > 0)
print(all(isinstance(p, str) for p in sys.path))
```

You can add your own folder. Let us create a module on disk, and import it:

```python
import sys
import tempfile
from pathlib import Path

folder = Path(tempfile.mkdtemp())
(folder / "greeter_demo.py").write_text('print("greeter_demo is running")\nMESSAGE = "hello"\n', encoding="utf-8")

sys.path.insert(0, str(folder))
import importlib
importlib.invalidate_caches()
import greeter_demo
print(greeter_demo.MESSAGE)
```

The print inside the module ran once, at the import. Importing again does nothing, because of the cache. (Notice `importlib.invalidate_caches()`: when a program creates a module file **while it runs**, Python's list of files in the folder may be out of date, and this call refreshes it.)

```python
import greeter_demo
print(greeter_demo.__file__.endswith("greeter_demo.py"))
```

## __name__ and the main guard

Every module has a `__name__`. When you **import** it, that is the module's name. When you **run the file as a program**, it is the special value `"__main__"`. This lets one file be both a library and a script:

```python
import runpy

script = folder / "tool_demo.py"
script.write_text(
    'def double(x):\n    return x * 2\n\n'
    'if __name__ == "__main__":\n    print("running as a script:", double(21))\n',
    encoding="utf-8",
)

importlib.invalidate_caches()
import tool_demo
print(tool_demo.__name__)
print(tool_demo.double(4))

_ = runpy.run_path(str(script), run_name="__main__")
```

Importing `tool_demo` printed nothing, because the block under the guard did not run. Running it as a program did. **Always put the code that does the work of a program under this guard.** Then other files can import your functions without side effects.

## Circular imports

A **circular import** happens when module `a` imports `b` and `b` imports `a`. Python has half-loaded `a` when `b` asks for it, and you get an `ImportError` or an `AttributeError`:

```python
(folder / "circ_a.py").write_text("import circ_b\nVALUE_A = 1\ndef use_b():\n    return circ_b.VALUE_B\n", encoding="utf-8")
(folder / "circ_b.py").write_text("import circ_a\nVALUE_B = 2\ndef use_a():\n    return circ_a.VALUE_A\n", encoding="utf-8")

importlib.invalidate_caches()
import circ_a
print(circ_a.use_b())
```

This particular case works, because each module only uses the *other module*, not one of its names, at import time. But `from circ_a import VALUE_A` inside `circ_b` would have failed. Ways to break a cycle:

- **Restructure**: move the shared code into a third module that both import.
- **Import inside the function** that needs it, so the import runs later.
- Import the *module*, and not the name (`import a` instead of `from a import x`).

A cycle is usually a sign that two modules are too tightly connected, so restructuring is the best cure.

## Reloading

Because of the cache, editing a file does not change the module that is already loaded. `importlib.reload` runs the file again, into the same module object:

```python
(folder / "greeter_demo.py").write_text('MESSAGE = "changed"\n', encoding="utf-8")
print(greeter_demo.MESSAGE)
importlib.reload(greeter_demo)
print(greeter_demo.MESSAGE)
```

Reloading is a tool for interactive work. In a normal program, restart it instead.

## Importing by name

`importlib.import_module` imports a module from a **string**, which is how plug-in systems find code:

```python
import importlib

module = importlib.import_module("collections")
print(module.Counter("aab").most_common(1))
```

## Do not shadow the standard library

Because your own folder comes **first** in `sys.path`, a file that you name like a standard module hides it. A file called `random.py` next to your script means `import random` finds **yours**. You then see strange errors such as *"module 'random' has no attribute 'randint'"*. The same goes for a file named `json.py`, `csv.py`, `email.py`, `test.py` and many more. Choose distinctive names for your own modules.

```python
import sys

sys.path.remove(str(folder))
for name in ("greeter_demo", "tool_demo", "circ_a", "circ_b"):
    sys.modules.pop(name, None)
print(str(folder) in sys.path)
```

## Common mistakes

- Naming your file after a standard library module.
- Using `from module import *`.
- Putting program code at the top level of a module, and not under the main guard.
- Creating circular imports instead of restructuring.
- Expecting an edited module to update in a running program.

## Recap

- A module is a file, run once at the first import and cached in `sys.modules`.
- Python searches `sys.path` in order.
- `if __name__ == "__main__":` separates the program from the library.
- Break circular imports by restructuring, by importing later, or by importing the module.
- Never shadow a standard library module.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
