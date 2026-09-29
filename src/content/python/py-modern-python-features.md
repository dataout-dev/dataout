Python has kept moving fast. A quick tour of what changed across 3.10 through 3.14 is worth having, if only to recognise code that uses a feature you have not seen before.

You will learn:

- match statements (3.10)
- union types with | (3.10)
- better error messages (3.10+)
- ExceptionGroup and except* (3.11)
- tomllib (3.11)
- type parameter syntax (3.12)
- f-string improvements (3.12)
- free-threaded builds and JIT experiments (3.13+)

## match (3.10)

Covered in depth earlier in this section — real structural pattern matching, destructuring tuples, dicts, and class instances directly in a `case`, well beyond a chain of `if`/`elif` equality checks.

## Union types with | (3.10)

```python
def process(value: int | str) -> str:
    return str(value)

print(process(5), process("hi"))
```

`int | str` reads directly as "int or str" without importing `Union` from `typing` — a small but frequently-used ergonomic improvement, since union types show up constantly in real signatures.

## Better error messages (3.10+)

Recent Python versions point much more precisely at the actual problem — a missing closing bracket, or the exact attribute that does not exist, rather than a vague error several lines away from the real cause. This is easy to take for granted once you are used to it, but it noticeably shortens the debugging loop for a beginner (or anyone, on an unfamiliar codebase).

## ExceptionGroup and except* (3.11)

Covered hands-on in the concurrency section — `TaskGroup` can raise an `ExceptionGroup` representing several tasks' failures at once, and `except*` is the syntax for catching specific exception types out of that group.

## tomllib (3.11)

```python
import tomllib

data = tomllib.loads("""
[project]
name = "myproject"
version = "1.0"
""")
print(data["project"]["name"])
```

A built-in TOML parser, useful directly for reading `pyproject.toml`-style config without a third-party dependency just for parsing.

## Type parameter syntax (3.12)

```python
def first[T](items: list[T]) -> T:
    return items[0]

print(first([1, 2, 3]))
```

`def first[T](...)` declares a generic function's type parameter inline, without the separate `TypeVar("T")` declaration the earlier typing lesson's generics example needed — a more concise syntax for the same idea.

## f-string improvements (3.12)

```python
name = "Ada"
print(f"hello {name.replace("a", "4")}")   # nested quotes of the same kind, not allowed before 3.12
```

Before 3.12, an f-string's `{...}` expression could not reuse the same quote character as the f-string itself. This restriction was lifted, making some expressions (especially ones calling string methods with literal arguments) noticeably less awkward to write.

## Free-threaded builds and JIT experiments (3.13+)

Covered earlier: an opt-in free-threaded (no-GIL) build variant enabling genuine multi-core threading, alongside early just-in-time compilation experiments aimed at making ordinary code faster without any changes to it — both real, significant, still-maturing changes to the runtime rather than the default, guaranteed experience yet.

## Watch out: relying on features your users' Python lacks

```python
# def handler[T](x: T) -> T:  # 3.12+ only syntax
#     return x

def handler(x):
    return x
```

A library or script using `int | str` (3.10+), `except*` (3.11+), or `def f[T](...)` (3.12+) simply will not run on an older interpreter — worth checking your project's declared minimum Python version before adopting a brand-new syntax feature, especially for a published library other people will install.

## Common mistakes

- Using a feature from a newer Python version in a library that claims to support older ones.
- Assuming free-threaded Python is already the ecosystem-wide default rather than an opt-in, still-maturing build.
- Missing `except*`/`ExceptionGroup` entirely and wondering why a `TaskGroup` failure does not get caught by a plain `except`.
- Not knowing `tomllib` exists and reaching for a third-party TOML library unnecessarily on 3.11+.
