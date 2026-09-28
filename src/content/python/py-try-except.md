You know that exceptions exist and how they are organised. This lesson is about **handling** them well: catching the right errors, using `else` and `finally`, and knowing when to check first and when to ask forgiveness afterwards.

You will learn:

- catching specific exceptions, and several at once
- the `else` and `finally` clauses
- EAFP versus LBYL
- `raise` to re-raise an exception
- the danger of swallowing errors silently

## The basic shape

```python
def to_int(text):
    try:
        return int(text)
    except ValueError:
        return None

print(to_int("42"), to_int("abc"))
```

The code in `try` runs. If it raises an exception that matches an `except` clause, that clause runs and the program continues after the whole statement. Otherwise, the exception carries on upwards.

## Be specific

Catch **only** the exceptions you expect and know how to handle. The rest should still fail loudly, because they point at bugs:

<!-- expect-error -->
```python
def to_int(text):
    try:
        return int(text)
    except ValueError:
        return None

print(to_int(None))
```

Here `int(None)` raises a `TypeError`, which is a different kind of mistake, so this function lets it through instead of hiding it. If you *do* want to handle both, name both:

```python
def to_int(text):
    try:
        return int(text)
    except (ValueError, TypeError):
        return None

print(to_int("42"), to_int("abc"), to_int(None))
```

## Different handlers for different errors

You can have several `except` clauses. The first one that matches wins:

```python
def describe(value, index):
    try:
        return value[index]
    except IndexError:
        return "no such position"
    except KeyError:
        return "no such key"
    except TypeError:
        return "cannot index that"

print(describe([1, 2], 9))
print(describe({"a": 1}, "b"))
print(describe(5, 0))
print(describe([10, 20], 1))
```

## else: when nothing went wrong

The `else` clause runs only if the `try` block finished **without** an exception. It keeps the risky part small, so you do not catch errors from code that you did not mean to protect:

```python
def read_number(text):
    try:
        number = int(text)
    except ValueError:
        print("not a number")
        return None
    else:
        print("parsed", number)
        return number * 2

print(read_number("21"))
print(read_number("x"))
```

## finally: always runs

The `finally` clause runs **no matter what**: after success, after a handled error, even when the function returns or an error goes unhandled. It is the place for **cleanup**:

```python
def demo(value):
    try:
        print("working with", value)
        return 10 / value
    except ZeroDivisionError:
        print("cannot divide")
        return None
    finally:
        print("cleanup done")

print(demo(2))
print(demo(0))
```

Most of the time, a `with` statement (see the files lesson) does cleanup even more neatly, but `finally` is the tool underneath.

## The full shape

```python
def process(text):
    try:
        number = int(text)
    except ValueError:
        result = "bad input"
    else:
        result = number * 2
    finally:
        print("processed", repr(text))
    return result

print(process("4"), process("x"))
```

Order: `try`, then `except` clauses, then `else`, then `finally`.

## EAFP and LBYL

There are two styles of dealing with things that can go wrong:

- **LBYL**: "Look Before You Leap". Check first, then act.
- **EAFP**: "Easier to Ask Forgiveness than Permission". Just act, and handle the failure.

```python
data = {"name": "Ada"}

if "age" in data:
    age = data["age"]
else:
    age = 0

try:
    age = data["age"]
except KeyError:
    age = 0

print(age, data.get("age", 0))
```

Python programmers often prefer EAFP because it avoids race conditions (a file can disappear between your check and your open), and because it is shorter when success is the usual case. But use the simplest tool: `data.get("age", 0)` beats both.

## Re-raising

Sometimes you want to do something, such as log the error, and then let the exception continue. A bare `raise` inside `except` raises the same exception again:

```python
def careful(text):
    try:
        return int(text)
    except ValueError:
        print("logging the problem for", repr(text))
        raise

try:
    careful("nope")
except ValueError as error:
    print("caller got:", error)
```

## Swallowing errors

The most harmful pattern is an `except` that **hides** the problem:

```python
def bad(text):
    try:
        return int(text)
    except Exception:
        pass

print(bad("x"))
```

The function returns `None` for every possible problem, including bugs, and nobody ever finds out. If you catch an error, either **handle** it (a default, a retry, a message), or **log** it and re-raise it.

## Common mistakes

- A bare `except:` or `except Exception: pass`.
- Putting too much code inside `try`, so that you catch errors you did not expect.
- Catching a parent class when a child would do.
- Forgetting that `finally` runs even after a `return`.

## Recap

- Catch specific exceptions, and put specific clauses before general ones.
- `else` runs when there was no error, and `finally` always runs.
- EAFP (try and handle) is common in Python. Use the simplest tool for the job, such as `dict.get`.
- A bare `raise` re-raises. Never silently swallow errors.

## Your turn

In the **Practice** tab you write `parse_int(s, default=None)`. Then three challenges use the Chinook store.
