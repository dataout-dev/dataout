Python source is never executed directly — it is first compiled to **bytecode**, a lower-level set of instructions the interpreter's evaluation loop actually runs. The `dis` module lets you look directly at that bytecode.

You will learn:

- compilation to bytecode
- reading `dis.dis` output
- the evaluation stack
- why local variables are faster than globals
- the specialising adaptive interpreter, briefly

## Compiling to bytecode

```python
def add_one(x):
    return x + 1

print(add_one.__code__.co_code[:10])   # raw bytecode, as bytes - not meant to be read directly
```

Every function object carries a `__code__` object, and inside it, `co_code`: the raw compiled bytecode. Reading raw bytes is not useful directly — `dis` decodes them into something readable.

## Reading dis.dis output

```python
import dis

def add_one(x):
    return x + 1

dis.dis(add_one)
```

Each line names an operation (`LOAD_FAST`, `LOAD_CONST`, `BINARY_OP`, `RETURN_VALUE`, and a `RESUME` at the very top since Python 3.11) and, where relevant, its argument. `LOAD_FAST x` pushes the local variable `x` onto a stack; `LOAD_CONST 1` pushes the constant `1`; `BINARY_OP` pops both and pushes their sum; `RETURN_VALUE` pops the final result and returns it.

## The evaluation stack

```python
import dis

def compute(a, b, c):
    return a + b * c

dis.dis(compute)
```

CPython's interpreter is stack-based: each instruction pushes values onto (or pops them from) a stack. `a + b * c` pushes `a`, then `b`, then `c`, multiplies the top two, then adds — the same order of operations you would get evaluating the expression by hand with a stack of scratch paper.

## Why local variables are faster than globals

```python
import dis

x = 10

def reads_global():
    return x + 1

def reads_local(x):
    return x + 1

dis.dis(reads_global)
print("---")
dis.dis(reads_local)
```

`reads_global` compiles to `LOAD_GLOBAL`, which looks the name up in the module's namespace dictionary every single call. `reads_local` compiles to `LOAD_FAST`, which reads directly from a fixed slot in an array — no dictionary lookup at all. This is measurable in a hot loop: pulling a frequently-used global into a local variable before the loop starts is a small, real optimisation.

## The specialising adaptive interpreter (3.11+)

Since Python 3.11, the interpreter can *specialise* certain instructions at runtime based on the actual types it sees — a generic `BINARY_OP` for `a + b` can be quietly replaced with a faster, int-specific version once it has observed that `a` and `b` are always ints at that call site. This happens automatically and is part of why recent Python versions are meaningfully faster than older ones on ordinary code, with no changes needed to the source.

## Watch out: reading bytecode as a stable API

```python
import dis

def f(x):
    return x + 1

dis.dis(f)   # the exact instruction names and count can change between Python versions
```

Bytecode is a CPython implementation detail, not a public, guaranteed-stable interface — the exact instructions for the same source line have changed noticeably between recent Python versions (the 3.11 rewrite is a good example). `dis` is a tool for understanding and comparing, not something to build a program's actual logic on top of.

## Common mistakes

- Treating a specific bytecode sequence as a stable contract to write code against, instead of a debugging and learning tool.
- Assuming two functions that produce the same result must compile to the same bytecode — they very often do not.
- Micro-optimising based on instruction count alone, without measuring actual wall-clock time (bytecode instructions are not all equally expensive).
- Forgetting that a global lookup inside a loop is a real, measurable cost worth avoiding in genuinely hot code.
