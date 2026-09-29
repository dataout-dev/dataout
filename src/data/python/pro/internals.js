import { py, pro } from './common.js'

export const howPythonWorksInside = {
  id: 'how-python-works-inside',
  title: 'How Python works inside',
  intro: 'The language runtime, made visible.',
  lessons: [
    {
      id: 'py-memory-model-refcounting',
      title: 'The memory model: names, objects, references and reference counting',
      blurb: 'Reference counts, interning, the cyclic garbage collector, weak references and tracemalloc.',
      kind: 'learn',
      check: [
        {
          q: 'What does CPython’s reference count on an object track?',
          options: [
            'How many times the object has been printed',
            'How many names and containers currently hold a reference to that object; it is freed the moment this reaches zero',
            'How old the object is',
            'How many methods the object has',
          ],
          answer: 1,
          why: 'CPython frees most objects immediately once their reference count drops to zero — no waiting for a garbage collector cycle, in the common case.',
        },
        {
          q: 'What does "interning" small integers and some strings mean?',
          options: [
            'They are stored on disk instead of memory',
            'CPython reuses one shared object for commonly-used small ints and certain string literals, so `a is b` can be `True` even without `a = b`',
            'They are converted to a different data type',
            'They cannot be garbage collected',
          ],
          answer: 1,
          why: 'This is a memory optimisation, not a language guarantee — relying on it (using `is` for value equality) is fragile because it is an implementation detail, not a promise.',
        },
        {
          q: 'Why does CPython need a *cyclic* garbage collector in addition to reference counting?',
          options: [
            'It does not — reference counting alone handles everything',
            'Two objects that reference each other (a cycle) never reach a reference count of zero on their own, even when nothing outside the cycle refers to either — the cyclic collector finds and frees these',
            'It exists purely for performance, with no correctness role',
            'It only matters for very large programs',
          ],
          answer: 1,
          why: 'A cycle like `a.other = b; b.other = a` keeps both reference counts above zero forever unless a separate collector detects the cycle is unreachable from anywhere else.',
        },
        {
          q: 'What is a weak reference (`weakref`) used for?',
          options: [
            'Making an object read-only',
            'Referring to an object without increasing its reference count, so the object can still be freed even while the weak reference exists — useful for caches that should not keep everything alive forever',
            'A reference that is slower than a normal one',
            'A reference that only works on strings',
          ],
          answer: 1,
          why: 'A cache holding *strong* references to every object it has ever seen would prevent any of them from ever being freed; a `weakref`-based cache does not have this problem.',
        },
        {
          q: 'What does `tracemalloc` help you do?',
          options: [
            'Speed up your code automatically',
            'Take snapshots of memory allocations and compare them, to find where memory is actually being allocated (and potentially leaked)',
            'Trace which functions call which other functions',
            'Format your code',
          ],
          answer: 1,
          why: '`tracemalloc` answers "what allocated this memory, and from where in my code", which is the key question when tracking down a memory leak.',
        },
      ],
    },
    {
      id: 'py-gil-threads-free-threading',
      title: 'The GIL, threads and free-threaded builds (reading)',
      blurb: 'What the Global Interpreter Lock is, its effect on CPU-bound vs I/O-bound code, and free-threaded builds.',
      kind: 'read',
      check: [
        {
          q: 'What does the Global Interpreter Lock (GIL) do in a standard CPython build?',
          options: [
            'It prevents Python from starting more than one process',
            'It ensures only one thread executes Python bytecode at a time, even on a multi-core machine, protecting CPython’s internal state from race conditions',
            'It only affects code that imports the `threading` module',
            'It has been completely removed from all Python builds',
          ],
          answer: 1,
          why: 'The GIL is a single lock around the interpreter’s core loop — simple and effective for safety, at the cost of true CPU parallelism between threads.',
        },
        {
          q: 'Why can threads still speed up I/O-bound code on a GIL build, even though only one thread runs Python bytecode at a time?',
          options: [
            'They cannot; threads never help on a GIL build',
            'The GIL is released while a thread waits on I/O (a network call, a disk read), so other threads can run Python code during that wait',
            'I/O-bound code does not use the GIL at all, ever',
            'Threads only help CPU-bound code, not I/O-bound code',
          ],
          answer: 1,
          why: 'Waiting for a network response involves no Python bytecode execution, so the GIL is free to let another thread make progress during that wait.',
        },
        {
          q: 'Why do threads typically NOT speed up CPU-bound Python code on a standard (GIL) build?',
          options: [
            'CPU-bound code cannot run in a thread at all',
            'The GIL only allows one thread to execute Python bytecode at a time, so multiple CPU-bound threads take turns rather than genuinely running in parallel',
            'CPU-bound code always crashes when threaded',
            'Threads are slower than a single-threaded loop for any workload',
          ],
          answer: 1,
          why: 'Without true parallel bytecode execution, splitting CPU-bound work across threads on a GIL build just adds thread-switching overhead on top of the same total work.',
        },
        {
          q: 'What changes in a "free-threaded" (no-GIL) CPython build?',
          options: [
            'Nothing measurable',
            'The GIL is removed (or made optional), allowing genuinely parallel execution of Python bytecode across threads — at the cost of needing much finer-grained internal locking to stay safe',
            'It only affects async code, not threads',
            'It removes the need for the `threading` module entirely',
          ],
          answer: 1,
          why: 'Free-threaded builds aim to let CPU-bound multi-threaded code actually use multiple cores, which the GIL has historically prevented — a major, still-maturing change to the runtime.',
        },
        {
          q: 'For CPU-bound work on a standard GIL build, what is the usual alternative to threads?',
          options: [
            'There is no alternative; CPU-bound work cannot be parallelised in Python',
            'Process-based parallelism (`multiprocessing`, or `concurrent.futures.ProcessPoolExecutor`), since each process has its own GIL and its own interpreter',
            'Switching to asyncio, which is faster for CPU-bound work',
            'Rewriting the code in a different indentation style',
          ],
          answer: 1,
          why: 'Separate processes each get their own GIL, so CPU-bound work genuinely runs in parallel across processes, at the cost of higher memory use and needing to serialise data between them.',
        },
      ],
    },
    {
      id: 'py-bytecode-dis',
      title: 'Bytecode and the dis module',
      blurb: 'Compilation to bytecode, the evaluation stack, and why local variables are faster than globals.',
      kind: 'code',
      practice: {
        prompt: 'Write `instr_count(fn)`: return the number of bytecode instructions in `fn`, using `dis.get_instructions`.',
        starter: 'import dis\n\ndef instr_count(fn):\n    ...\n',
        solution: py`import dis

def instr_count(fn):
    return len(list(dis.get_instructions(fn)))`,
        samples: ['instr_count(lambda: None)'],
        cases: [
          ['A one-line function has a small, fixed count', 'def f(x):\n    return x + 1\ninstr_count(f)'],
          ['A longer function has more instructions', 'def g(x):\n    y = x + 1\n    z = y * 2\n    return z - 1\ninstr_count(g)'],
          ['A lambda returning None is very short', 'instr_count(lambda: None)'],
          ['Equivalent functions have equal counts', 'def f(x):\n    return x + 1\ninstr_count(f) == instr_count(lambda x: x + 1)'],
          ['The result is always an int', 'isinstance(instr_count(lambda: 1), int)'],
        ],
        traps: [
          py`import dis

def instr_count(fn):
    return len(fn.__code__.co_code)`,
          py`import dis

def instr_count(fn):
    return len(list(dis.get_instructions(fn))) - 1`,
          py`import dis

def instr_count(fn):
    return len(set(i.opname for i in dis.get_instructions(fn)))`,
        ],
      },
      real: [
        pro({
          title: 'Comparing two ways to build a full name',
          use: ['customers'],
          starter: 'import dis\n\ndef instr_count(fn):\n    ...\n\ndef concat(c):\n    return c["FirstName"] + " " + c["LastName"]\n\ndef fstring(c):\n    return f"{c[\'FirstName\']} {c[\'LastName\']}"\n\nrow = customers[0]\nanswer = (concat(row) == fstring(row), isinstance(instr_count(concat), int))\n',
          given: '# customers is a list of dictionaries; row is the first customer.',
          brief: 'Write `instr_count` as in the lesson. Store `(concat(row) == fstring(row), isinstance(instr_count(concat), int))` in `answer` — both functions should build the same string.',
          reference: py`import dis

def instr_count(fn):
    return len(list(dis.get_instructions(fn)))

def concat(c):
    return c["FirstName"] + " " + c["LastName"]

def fstring(c):
    return f"{c['FirstName']} {c['LastName']}"

row = customers[0]
answer = (concat(row) == fstring(row), isinstance(instr_count(concat), int))`,
          walkthrough: 'Two functions can compute the exact same *result* through very different bytecode — `dis` is how you would actually go look, rather than guess, at which approach compiles to less work.',
          traps: [py`import dis

def instr_count(fn):
    return len(list(dis.get_instructions(fn)))

def concat(c):
    return c["FirstName"] + " " + c["LastName"]

def fstring(c):
    return f"{c['LastName']} {c['FirstName']}"

row = customers[0]
answer = (concat(row) == fstring(row), isinstance(instr_count(concat), int))`],
        }),
        pro({
          title: 'A short-circuit versus a full scan, in instructions',
          use: ['tracks'],
          starter: 'import dis\n\ndef instr_count(fn):\n    ...\n\ndef has_any(prices):\n    for p in prices:\n        if p > 0:\n            return True\n    return False\n\nprices = [t["UnitPrice"] for t in tracks[:5]]\nanswer = (has_any(prices), instr_count(has_any) == len(list(dis.get_instructions(has_any))))\n',
          given: '# tracks is a list of dictionaries; prices holds the first 5 UnitPrice values (all positive real prices).',
          brief: 'Write `instr_count` as in the lesson. Store `(has_any(prices), instr_count(has_any) == len(list(dis.get_instructions(has_any))))` in `answer` — the second value checks your `instr_count` against `dis` directly, so it should always be `True`.',
          reference: py`import dis

def instr_count(fn):
    return len(list(dis.get_instructions(fn)))

def has_any(prices):
    for p in prices:
        if p > 0:
            return True
    return False

prices = [t["UnitPrice"] for t in tracks[:5]]
answer = (has_any(prices), instr_count(has_any) == len(list(dis.get_instructions(has_any))))`,
          walkthrough: 'A loop with an early `return` compiles to a jump back to the loop test and a jump out on the `return` — visible directly in `dis.dis(has_any)`’s output as `JUMP_BACKWARD`/`RETURN_VALUE` instructions. Checking `instr_count` against `dis.get_instructions` directly is what actually catches a solution that counts something else (like raw bytes) instead.',
          traps: [py`import dis

def instr_count(fn):
    return len(fn.__code__.co_code)

def has_any(prices):
    for p in prices:
        if p > 0:
            return True
    return False

prices = [t["UnitPrice"] for t in tracks[:5]]
answer = (has_any(prices), instr_count(has_any) == len(list(dis.get_instructions(has_any))))`],
        }),
        pro({
          title: 'Local variables versus repeated lookups',
          use: ['tracks'],
          starter: 'import dis\n\ndef instr_count(fn):\n    ...\n\ndef total_slow():\n    return sum(t["UnitPrice"] for t in tracks[:20])\n\ndef total_fast(local_tracks):\n    return sum(t["UnitPrice"] for t in local_tracks)\n\nanswer = (round(total_slow(), 2), round(total_fast(tracks[:20]), 2), instr_count(total_fast) > 0)\n',
          given: '# tracks is a list of dictionaries. total_slow reads the global `tracks`; total_fast takes it as a local parameter instead.',
          brief: 'Write `instr_count` as in the lesson. Store `(total_slow(), total_fast(tracks[:20]), instr_count(total_fast) > 0)`, with the two totals rounded to 2 decimals, in `answer` — both should agree on the total.',
          reference: py`import dis

def instr_count(fn):
    return len(list(dis.get_instructions(fn)))

def total_slow():
    return sum(t["UnitPrice"] for t in tracks[:20])

def total_fast(local_tracks):
    return sum(t["UnitPrice"] for t in local_tracks)

answer = (round(total_slow(), 2), round(total_fast(tracks[:20]), 2), instr_count(total_fast) > 0)`,
          walkthrough: 'A local variable is fetched from a fast, fixed-slot array (`LOAD_FAST`); a global needs a dictionary lookup (`LOAD_GLOBAL`) every single time — the same reason a tight loop that reads a global repeatedly is worth rewriting to take it as a parameter or copy it into a local first.',
          traps: [py`import dis

def instr_count(fn):
    return len(list(dis.get_instructions(fn)))

def total_slow():
    return sum(t["UnitPrice"] for t in tracks[:20])

def total_fast(local_tracks):
    return sum(t["UnitPrice"] for t in local_tracks) + 1

answer = (round(total_slow(), 2), round(total_fast(tracks[:20]), 2), instr_count(total_fast) > 0)`],
        }),
      ],
    },
    {
      id: 'py-names-namespaces-imports',
      title: 'Names, namespaces and the import machinery',
      blurb: 'LEGB, globals() and locals(), module caches, finders and loaders, and circular imports.',
      kind: 'learn',
      check: [
        {
          q: 'What does "LEGB" describe?',
          options: [
            'A naming convention for classes',
            'The order Python searches for a name: Local, Enclosing, Global, Built-in — stopping at the first scope where the name is found',
            'The four phases of import',
            'A type of loop',
          ],
          answer: 1,
          why: 'A name lookup checks the innermost (function-local) scope first, then any enclosing function, then the module’s global scope, then Python’s built-ins, in that order.',
        },
        {
          q: 'When is a variable inside a function decided to be "local" to that function?',
          options: [
            'At runtime, the first time the line executes',
            'At compile time — if a name is assigned anywhere in a function body, Python treats it as local for the *entire* function, even on lines before that assignment',
            'Only if you write `local x` explicitly',
            'It is decided by the operating system',
          ],
          answer: 1,
          why: 'This is why referencing a global and then assigning to the same name later in the same function raises `UnboundLocalError` on the earlier reference — the whole function already treats that name as local.',
        },
        {
          q: 'What is the practical difference between `globals()` and `locals()`?',
          options: [
            'There is no difference',
            '`globals()` returns the actual, live module-level namespace dict (mutating it works); `locals()` returns a snapshot of local names inside a function, which is not guaranteed to affect real local variables if mutated',
            '`locals()` is faster than `globals()`',
            '`globals()` only works inside a class',
          ],
          answer: 1,
          why: 'CPython optimises local variable access, so `locals()` inside a function typically hands back a snapshot copy, not a live view you can safely write through.',
        },
        {
          q: 'Why does Python only execute a module’s top-level code once, no matter how many times it is imported?',
          options: [
            'It does not — every `import` re-runs the module',
            'The import system caches every imported module in `sys.modules`; a later `import` of the same module just returns the cached module object',
            'Modules are only allowed to be imported once per program by law of the language spec, with no mechanism behind it',
            'Only `__init__.py` files are cached',
          ],
          answer: 1,
          why: '`sys.modules` is the cache. A second `import foo` looks it up there instead of re-running `foo.py` from scratch, which is why top-level side effects (like a `print` at module level) only fire once.',
        },
        {
          q: 'What typically causes a circular import error?',
          options: [
            'Importing the same module twice in the same file',
            'Module A imports module B at the top level, and module B imports module A at the top level, so whichever finishes loading first finds the other still mid-initialisation, missing the names it needs',
            'Using relative imports at all',
            'A module importing the standard library',
          ],
          answer: 1,
          why: 'The fix is usually to delay one of the imports (move it inside a function, so it happens after both modules have finished loading) or restructure so the dependency is not mutual in the first place.',
        },
      ],
    },
    {
      id: 'py-attribute-lookup-call-protocol',
      title: 'Attribute lookup, descriptors and the full call protocol',
      blurb: 'The complete algorithm for obj.attr, data descriptors, __getattr__ fallbacks, and how super() finds the next class.',
      kind: 'learn',
      check: [
        {
          q: 'When you access `obj.attr`, where does Python look first: the instance’s own `__dict__`, or the class?',
          options: [
            'Always the class first, then the instance',
            'It depends: a *data descriptor* found on the class (one defining both `__get__` and `__set__`, like a `property`) takes priority over the instance `__dict__`; otherwise the instance `__dict__` is checked before falling back to the class',
            'Always the instance first, with no exceptions',
            'Python picks randomly',
          ],
          answer: 1,
          why: 'This is why a `property` on a class can still control access even if something has (incorrectly) also written the same name into `self.__dict__` — a data descriptor wins.',
        },
        {
          q: 'What is the difference between `__getattr__` and `__getattribute__`?',
          options: [
            'They are exactly the same method with two names',
            '`__getattribute__` runs for *every* attribute access; `__getattr__` only runs as a fallback, when normal lookup has already failed to find the attribute anywhere',
            '`__getattr__` is for classes, `__getattribute__` is for modules',
            'Neither is ever called automatically',
          ],
          answer: 1,
          why: 'Overriding `__getattribute__` is powerful but risky (it intercepts everything, including internal lookups); `__getattr__` is the much more common, safer hook for "handle attributes that don’t otherwise exist".',
        },
        {
          q: 'What is a "bound method", exactly?',
          options: [
            'A method that cannot be called',
            'The result of looking up a function attribute on an *instance*: Python wraps the function together with that instance, so `self` is filled in automatically on every call',
            'A method decorated with `@staticmethod`',
            'A method defined outside a class',
          ],
          answer: 1,
          why: '`instance.method` is not the same object as `Class.method` — accessing it through an instance produces a bound method object that already remembers which instance to pass as `self`.',
        },
        {
          q: 'How does `super().method()` decide which class’s `method` to call next?',
          options: [
            'It always calls the direct parent class, full stop',
            'It walks the Method Resolution Order (MRO) starting just after the *current* class, so with multiple inheritance it can skip past several classes depending on the full hierarchy, not just the immediate parent',
            'It is resolved randomly at runtime',
            'It calls every class in the hierarchy, in an unspecified order',
          ],
          answer: 1,
          why: 'With single inheritance, "next in the MRO" and "the parent" happen to be the same thing, which is why the distinction often goes unnoticed until multiple inheritance is involved.',
        },
        {
          q: 'What actually happens when you "call a class", e.g. `MyClass(1, 2)`?',
          options: [
            'Nothing special — classes cannot be called',
            'Python calls the class’s metaclass’s `__call__` (normally `type.__call__`), which itself calls `MyClass.__new__` to create the instance, then `MyClass.__init__` to initialise it',
            'It directly calls `__init__` with no other steps involved',
            'It calls `__repr__` first, then `__init__`',
          ],
          answer: 1,
          why: 'Instance creation is itself just another attribute-call-protocol case one level up: the metaclass defines what "calling a class" means, the same way a class defines what "calling an instance" means via `__call__`.',
        },
      ],
    },
    {
      id: 'py-extending-python-c-extensions',
      title: 'Extending Python: ctypes, C extensions and Cython (reading)',
      blurb: 'ctypes, the C API, cffi, Cython, mypyc, and Rust with PyO3.',
      kind: 'read',
      check: [
        {
          q: 'What does `ctypes` let you do?',
          options: [
            'Compile Python to C automatically',
            'Call functions in an existing compiled C library (a `.dll`/`.so`) directly from Python, without writing any C code yourself',
            'Add static types to Python',
            'Replace the CPython interpreter entirely',
          ],
          answer: 1,
          why: '`ctypes` is a foreign-function interface built into the standard library — it describes a C library’s function signatures to Python, then calls straight into the compiled code.',
        },
        {
          q: 'Why would a project write a C extension (via the C API, or a tool like Cython) instead of ctypes?',
          options: [
            'There is no reason; ctypes is always better',
            'A C extension can be significantly faster for CPU-bound inner loops, and can release the GIL during its own work, letting other Python threads run concurrently',
            'C extensions are easier to write than ctypes bindings',
            'C extensions do not need to be compiled',
          ],
          answer: 1,
          why: 'ctypes is convenient for calling *existing* C libraries; writing your own extension is about squeezing out CPU-bound performance CPython itself cannot reach, and controlling exactly when the GIL is released.',
        },
        {
          q: 'What does Cython let you do that plain Python cannot?',
          options: [
            'Nothing different from CPython',
            'Write Python-like syntax with optional static type declarations, which compiles down to C, giving large speedups for numeric, loop-heavy code specifically',
            'Run Python without an interpreter at all',
            'It is only for writing web servers',
          ],
          answer: 1,
          why: 'Cython’s value is precisely in the "optional" part: you start with working Python code and add static types only to the hot loops that actually need the speedup.',
        },
        {
          q: 'What does `mypyc` do?',
          options: [
            'It is another name for mypy',
            'It compiles already type-annotated Python (the same hints mypy checks) into a C extension, getting a real speedup from types you likely already wrote for checking purposes',
            'It converts Python into JavaScript',
            'It only works on Python 2',
          ],
          answer: 1,
          why: 'mypyc reuses your existing mypy-style annotations as compilation hints, rather than requiring a second, separate type-annotation effort just for performance.',
        },
        {
          q: 'Why has Rust (via PyO3) become a popular choice for new Python extensions?',
          options: [
            'Rust is required by the Python language specification',
            'It offers C-level performance with memory safety guarantees enforced by the compiler, reducing a whole class of bugs (crashes, memory corruption) that hand-written C extensions are prone to',
            'PyO3 makes Rust code run without compiling it',
            'It replaces the need for the C API entirely, for every use case',
          ],
          answer: 1,
          why: 'PyO3 provides ergonomic bindings between Rust and CPython, letting a project get near-C performance while leaning on Rust’s compiler to rule out entire categories of memory bugs up front.',
        },
      ],
    },
  ],
  checkpoint: [],
}
