In Foundations you met the common exceptions. Now it is time to see how they are **related**. Python's exceptions form a family tree, and knowing it lets you catch a whole group at once, avoid catching too much, and read a long traceback with confidence.

You will learn:

- how an exception travels up the call stack
- the built-in hierarchy: `BaseException`, `Exception` and their children
- useful families: `LookupError`, `ArithmeticError`, `OSError`
- how to read a traceback with chained causes
- why you should never write `except BaseException`

## An exception travels up the stack

When an error is raised, Python stops the current function and looks for an `except` clause that handles it. If there is none, the exception moves to the **caller**, then to the caller's caller, until it reaches the top of the program, and the program stops with a traceback:

```python
def inner():
    return 1 / 0

def middle():
    return inner()

def outer():
    try:
        return middle()
    except ZeroDivisionError:
        return "caught in outer"

print(outer())
```

The error was raised in `inner`, passed through `middle` (which had no handler), and was caught in `outer`. Code that runs between the raise and the catch, such as the rest of `inner` and `middle`, is skipped.

## The hierarchy

Every exception is a class, and classes have parents. You can walk up the family tree with `__mro__` (the method resolution order):

```python
for cls in KeyError.__mro__:
    print(cls.__name__)
```

At the very top is `BaseException`. Just below it, `Exception` is the parent of nearly every error you will ever handle. The main branches look like this:

```text
BaseException
 +-- SystemExit, KeyboardInterrupt, GeneratorExit
 +-- Exception
      +-- ArithmeticError  (ZeroDivisionError, OverflowError, FloatingPointError)
      +-- LookupError      (IndexError, KeyError)
      +-- OSError          (FileNotFoundError, PermissionError, TimeoutError ...)
      +-- ValueError       (UnicodeError ...)
      +-- TypeError
      +-- NameError        (UnboundLocalError)
      +-- AttributeError
      +-- ImportError      (ModuleNotFoundError)
      +-- RuntimeError     (RecursionError, NotImplementedError)
      +-- AssertionError
      +-- StopIteration
      +-- ...
```

You can check the relationships in code:

```python
print(issubclass(KeyError, LookupError))
print(issubclass(ZeroDivisionError, ArithmeticError))
print(issubclass(FileNotFoundError, OSError))
print(issubclass(KeyError, Exception), issubclass(KeyboardInterrupt, Exception))
print(issubclass(UnicodeDecodeError, ValueError))
```

## Catching a family

An `except` clause catches the named class **and all its children**. So catching `LookupError` handles both a missing list position and a missing dictionary key:

```python
def first_item(container, key):
    try:
        return container[key]
    except LookupError:
        return "not found"

print(first_item([1, 2], 5))
print(first_item({"a": 1}, "b"))
print(first_item([1, 2], 1))
```

You can list several classes in a tuple, and use a name for the exception object:

```python
try:
    int("x")
except (ValueError, TypeError) as error:
    print(type(error).__name__, "->", error)
```

## Order matters

Python checks the `except` clauses **from top to bottom**, and uses the first one that fits. Put the **specific** classes before the general ones. A general class placed first would hide all the specific ones:

```python
try:
    {}["missing"]
except KeyError:
    print("a key error")
except LookupError:
    print("some other lookup error")
except Exception:
    print("anything else")
```

If you reverse the order and put `Exception` first, the other clauses can never run.

## The OSError family

Problems with files, networks and the operating system are all `OSError` (also called `IOError` and `EnvironmentError`, which are aliases). Its children describe what went wrong:

```python
try:
    open("/no/such/file.txt")
except FileNotFoundError as error:
    print("missing:", error.filename)
except PermissionError:
    print("not allowed")
except OSError as error:
    print("some other OS problem", error.errno)
```

## Exceptions carry information

An exception object has its message in `args`, and often more, such as `filename`, `errno` or `key`:

```python
try:
    {"a": 1}["b"]
except KeyError as error:
    print(error.args)
    print(repr(error))
```

## Reading a traceback with causes

When an error happens while another is being handled, Python shows both. The message *"During handling of the above exception, another exception occurred"* means that a new error was raised inside an `except` block. The message *"The above exception was the direct cause of the following exception"* means the code used `raise ... from ...` on purpose. Read the traceback from the **bottom**: the last line is the final error, and the lines above tell you how it came about.

```python
import traceback

def load(value):
    try:
        return int(value)
    except ValueError as error:
        raise RuntimeError("cannot load") from error

try:
    load("abc")
except RuntimeError as error:
    print(type(error.__cause__).__name__)
    text = "".join(traceback.format_exception(error))
    print(text.splitlines()[-1])
```

## Do not catch BaseException

`except BaseException` (and a bare `except:`, which is the same) also catches `KeyboardInterrupt` (the user pressing Ctrl+C or the Stop button) and `SystemExit`. Your program would then refuse to stop. Catch `Exception` at the very most, and catch specific classes whenever you can.

## Common mistakes

- Catching `Exception` where a specific class would do, and hiding real bugs.
- Putting a general `except` before a specific one.
- Using a bare `except:` that also stops Ctrl+C from working.
- Forgetting that a child class is caught by its parent's `except`.

## Recap

- An exception moves up the call stack until a matching `except` catches it.
- All the ones you will handle are children of `Exception`. `BaseException` also includes exit signals.
- An `except` for a parent catches all its children, so list specific ones first.
- Read a traceback from the bottom, and look for the words "direct cause" and "during handling".

## Check yourself

Work through the five questions on this page. This lesson has no practice.
