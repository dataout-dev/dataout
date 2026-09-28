One module is enough for a small script. A larger project needs many, arranged in folders. A **package** is a folder of modules that you can import as a unit. This lesson shows how to lay out a package, how imports inside it work, how to design the public interface with `__all__`, and how to turn a script into a well-organised set of modules.

You will learn:

- what makes a folder a package
- `__init__.py` and namespace packages
- absolute and relative imports
- controlling what a package exposes, with `__all__`
- splitting a script into modules
- the trap of running a module inside a package as a script

## A package is a folder

A folder that contains a file named `__init__.py` is a **regular package**. The file can be empty. The modules inside it are imported with dots:

```text
shop/
    __init__.py
    cart.py
    pricing.py
    payment/
        __init__.py
        cards.py
```

```text
import shop.cart
from shop.pricing import total
from shop.payment import cards
```

Let us build a real package in a temporary folder, and use it:

```python
import sys
import tempfile
from pathlib import Path

root = Path(tempfile.mkdtemp())
package = root / "shopdemo"
package.mkdir()
(package / "__init__.py").write_text("", encoding="utf-8")
(package / "pricing.py").write_text(
    "TAX = 0.2\n\ndef with_tax(price):\n    return round(price * (1 + TAX), 2)\n",
    encoding="utf-8",
)

sys.path.insert(0, str(root))

import importlib
importlib.invalidate_caches()
import shopdemo.pricing
print(shopdemo.pricing.with_tax(10))
print(shopdemo.__name__, shopdemo.pricing.__name__)
```

Importing `shopdemo.pricing` first imports the package `shopdemo` (running its `__init__.py`), and then the module.

## The role of __init__.py

`__init__.py` runs when the package is imported. It can be empty, or it can define the **public interface**: names that users of your package need, so that they do not have to know the internal file layout:

```python
(package / "__init__.py").write_text(
    "from .pricing import with_tax\n\n__all__ = ['with_tax']\n__version__ = '1.0'\n",
    encoding="utf-8",
)

importlib.reload(shopdemo)
from shopdemo import with_tax

print(with_tax(50))
print(shopdemo.__version__)
```

Now `from shopdemo import with_tax` works, and you may reorganise the files inside later without breaking the users.

## Absolute and relative imports

Inside a package, a module can import a sibling in two ways:

- **Absolute**: the full path from the top: `from shopdemo.pricing import with_tax`. It is clear, and works from anywhere.
- **Relative**: starting from the current package with dots: `from .pricing import with_tax` (same package), `from ..other import name` (the parent package).

```python
(package / "cart.py").write_text(
    "from .pricing import with_tax\n\ndef cart_total(prices):\n    return round(sum(with_tax(p) for p in prices), 2)\n",
    encoding="utf-8",
)

importlib.invalidate_caches()
import shopdemo.cart
print(shopdemo.cart.cart_total([10, 20]))
```

Relative imports are shorter, and keep working if you rename the top folder. Many teams prefer absolute imports for clarity. Either is fine, but be consistent.

## __all__

`__all__` is a list of the names that `from package import *` should import, and it documents the **public API**. Names that start with an underscore are, by convention, private:

```python
namespace = {}
exec("__all__ = ['visible']\ndef visible():\n    return 1\ndef _hidden():\n    return 2\n", namespace)
print(namespace["__all__"])
print([name for name in namespace if not name.startswith("_")])
```

## Namespace packages

A folder **without** `__init__.py` can also be imported, as a **namespace package**. It has fewer features, and is mainly used to let several folders share one package name. For a normal project, always add the `__init__.py`.

## Splitting a script into modules

Suppose you have a 300-line script. A good split follows what the code **does**:

1. `models.py`: the data definitions
2. `storage.py`: reading and writing files
3. `logic.py`: the calculations
4. `cli.py` or `main.py`: the entry point that connects them

A module should have **one clear purpose**, a name that says it, and few dependencies on the others. The dependencies should point one way, usually towards the simplest modules.

## Running a module inside a package

Here is a common trap. Running `python shop/cart.py` directly makes Python treat `cart.py` as a **script**, not as a part of the package, so its relative imports fail with *"attempted relative import with no known parent package"*. The right way is to run it as a module, from the folder that contains the package:

```text
python -m shopdemo.cart
```

The `-m` flag runs the module **inside** the package, so the relative imports work. Programs can also be launched through a `__main__.py` file inside the package, so that `python -m shopdemo` runs it:

```python
(package / "__main__.py").write_text(
    "from .cart import cart_total\n\nif __name__ == '__main__':\n    print('total:', cart_total([5, 5]))\n",
    encoding="utf-8",
)

import runpy

importlib.invalidate_caches()
runpy.run_module("shopdemo", run_name="__main__")
```

## Finding the layout of a package

`pkgutil` and `importlib.resources` can list the modules of a package, and read data files that ship with it:

```python
import pkgutil

print(sorted(m.name for m in pkgutil.iter_modules(shopdemo.__path__)))
```

## Cleaning up

```python
for name in [n for n in sys.modules if n == "shopdemo" or n.startswith("shopdemo.")]:
    del sys.modules[name]
sys.path.remove(str(root))
print(str(root) in sys.path)
```

## Common mistakes

- Forgetting `__init__.py` in a folder that should be a regular package.
- Running a file inside a package as a script, and getting relative import errors.
- Putting too much logic in `__init__.py`. Keep it as a thin public interface.
- Cyclic dependencies between the modules of a package.
- Changing the internal layout of a package that other people already use.

## Recap

- A package is a folder with an `__init__.py`. Import its modules with dots.
- `__init__.py` runs on import, and can present a tidy public interface. `__all__` lists the public names.
- Use absolute imports for clarity, or relative ones (`.`, `..`) inside the package.
- Run package modules with `python -m package.module`.

## Your turn

In the **Practice** tab you write `import_order(modules)`, which finds an order in which modules can be loaded. Then three challenges use the Chinook store.
