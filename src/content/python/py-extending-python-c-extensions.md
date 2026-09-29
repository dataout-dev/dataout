Not every problem fits comfortably inside pure Python's performance envelope. This lesson is a map of the ways real projects step outside it — calling existing C libraries, writing new compiled extensions, and the modern alternatives to hand-written C.

This is a reading lesson: compiling and loading native extensions needs a real compiler toolchain and filesystem, which this browser-based playground does not have. The ideas apply directly the first time a project actually needs one of these.

You will learn:

- why projects extend Python at all
- `ctypes`, for calling existing C libraries
- the C API and `cffi`, briefly
- Cython and `mypyc`
- Rust via PyO3
- when *not* to reach for any of this

## Why extend Python

Two distinct motivations come up: reusing an existing compiled library that only has a C interface (no Python bindings exist yet), or genuinely needing more raw performance than CPython's interpreter loop can give a CPU-bound inner loop, even after algorithmic improvements.

## ctypes: calling existing C libraries

```text
import ctypes

libm = ctypes.CDLL("libm.so.6")   # the C math library, on Linux
libm.sqrt.restype = ctypes.c_double
libm.sqrt.argtypes = [ctypes.c_double]
print(libm.sqrt(16.0))
```

`ctypes` is a foreign-function interface built into the standard library: describe a C function's argument and return types, and call straight into an already-compiled shared library, no compiler needed on your end at all.

## The C API and cffi

```text
// a small excerpt of what a hand-written C extension looks like
static PyObject* fast_sum(PyObject* self, PyObject* args) {
    PyObject* list;
    if (!PyArg_ParseTuple(args, "O", &list)) return NULL;
    // ... iterate the list in C, summing values ...
    return PyLong_FromLong(total);
}
```

Writing directly against CPython's C API gives full control (and full responsibility for correct reference counting) over a new extension module. `cffi` is a higher-level alternative for calling C code that, unlike raw `ctypes`, can also parse C header declarations directly, reducing how much you need to hand-transcribe.

## Cython

```text
# example.pyx
def fast_sum(list values):
    cdef long total = 0
    cdef long v
    for v in values:
        total += v
    return total
```

Cython looks like Python with optional static type declarations (`cdef long total`), and compiles down to a real C extension. The key appeal: you can start from working, ordinary Python and add types only to the specific hot loop that actually needs the speedup, rather than rewriting the whole thing in C.

## mypyc

```text
mypyc mymodule.py
```

`mypyc` compiles Python code that already has type annotations — the same style you write for mypy to check — directly into a C extension. If a module is already precisely typed for static-checking purposes, `mypyc` can turn those same annotations into a real runtime speedup with comparatively little extra work.

## Rust via PyO3

```text
#[pyfunction]
fn fast_sum(values: Vec<i64>) -> i64 {
    values.iter().sum()
}
```

PyO3 provides ergonomic bindings between Rust and CPython. Rust's compiler enforces memory safety at compile time, ruling out a whole category of bugs (use-after-free, buffer overruns, data races) that hand-written C extensions are historically prone to — a major reason Rust extensions have become increasingly common in the Python ecosystem for new, performance-sensitive code.

## When not to

Extending Python is real engineering overhead: a build step, a compiled artifact per platform, and a steeper debugging experience than pure Python. It only pays for itself once profiling (from an earlier lesson) has actually identified a genuine, unavoidable bottleneck — reaching for a C extension before confirming *where* the time actually goes is a common and expensive mistake.

## Watch out: premature extension-writing

The right order is always the same: write it in Python first, measure, try an algorithmic or data-structure fix, measure again, and only then consider stepping outside pure Python for the specific hot path profiling actually points to — never for a function that merely "feels like it should be slow".

## Common mistakes

- Reaching for a C extension before profiling confirms where time is actually being spent.
- Writing raw C API code by hand when Cython or PyO3 would get the same result with far less manual reference-counting risk.
- Extending an entire module when only one small inner loop actually needed the speedup.
- Underestimating the ongoing cost of maintaining a compiled extension across multiple platforms and Python versions.
