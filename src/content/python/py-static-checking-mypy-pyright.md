Writing type hints is only half the value — a **static type checker** reads them and tells you, before you ever run the code, where they do not actually line up. `mypy` and `pyright` are the two most widely used.

This is a reading lesson: running a type checker is a command-line, whole-project operation that needs a real filesystem and Python environment this browser-based playground does not provide. The ideas transfer directly the first time you run one on a real project.

You will learn:

- what running a type checker actually does
- reading a type-checker error
- gradual typing and mixed typed/untyped code
- strictness settings
- stubs and `py.typed`
- typing third-party code you do not control

## Running a type checker

```text
$ mypy pricing.py
pricing.py:12: error: Argument 1 to "apply_discount" has incompatible type "str"; expected "float"  [arg-type]
Found 1 error in 1 file (checked 1 source file)
```

Nothing here executes `pricing.py`. mypy reads the source, resolves every type hint, and checks that every call, assignment and return is consistent with the declared types — purely by reasoning about the code, the same way a human reviewer would trace through it by eye, just far more exhaustively.

## Reading an error

The error above names the file and line, which argument was wrong, what it actually was (`str`), and what was expected (`float`). Reading right-to-left ("expected float, got str") is usually the fastest way to see the fix — here, likely a value read from user input or a form that was never converted to a number.

## Gradual typing

Python does not require every line to be typed before a checker will run. A codebase can mix fully-typed modules with completely untyped ones, and mypy defaults to treating untyped code leniently (inferring `Any` rather than flagging every missing hint). This is what makes it realistic to introduce typing into a large, existing codebase incrementally, module by module, instead of needing a big-bang rewrite.

## Strictness settings

```text
# mypy.ini
[mypy]
strict = True
```

`--strict` (or the config equivalent) turns on a bundle of stronger checks: disallowing untyped function definitions, implicit `Any`, and more. A new project can reasonably start in strict mode from day one; an old, largely-untyped one usually adopts strictness gradually, tightening the settings as more of the code gets annotated.

## Stubs and py.typed

Some code cannot carry inline type hints — a C extension module, for instance, has no Python source to annotate. A `.pyi` **stub file** describes its types separately, with no implementation inside, just signatures. A package that *does* have reliable inline hints marks itself with a `py.typed` file, telling type checkers "trust these hints as a real contract", rather than treating an installed dependency as an unknown, untyped blob by default.

## Typing third-party code

```text
$ pip install types-requests
```

For a popular untyped (or partially typed) library, the community often maintains a separate stub-only package (`types-requests` for `requests`, and similar `types-*` packages for many others) that a type checker picks up automatically once installed, without touching the library itself.

## Watch out: a green mypy run is not a correctness proof

A type checker verifies that your types are *internally consistent* — it says nothing about whether the logic itself is right. A function correctly typed as `def total(prices: list[float]) -> float` can still sum the wrong list, apply the wrong tax rate, or have an off-by-one bug, and mypy will not notice any of it. Tests and type checking catch different classes of mistake.

## Common mistakes

- Expecting a type checker to catch logic bugs it was never designed to see.
- Reaching for `# type: ignore` on every inconvenient error instead of fixing the actual mismatch (or, when the checker really is wrong, narrowing the ignore to the specific error code).
- Never installing the stub package for a popular untyped dependency, and getting `Any` everywhere it is used instead of real checking.
- Adopting `--strict` on a large legacy codebase all at once, producing thousands of errors and making the whole effort feel unapproachable, instead of tightening settings incrementally.
