Every programmer spends a lot of time finding bugs. The good news is that debugging is a **skill**, and you can learn a routine that works. This lesson gives you a method, a tour of the tools, and habits that save hours.

You will learn:

- a five-step debugging routine
- how to read a traceback
- printing, and printing better
- the `traceback` module
- the debugger `pdb`, its commands and `breakpoint()`
- techniques: rubber ducking, bisecting, and minimal examples

## The routine

When something goes wrong, follow these steps:

1. **Reproduce** the bug. Find the smallest input that shows it, every time.
2. **Isolate** it. Find which function, or which line, is at fault.
3. **Hypothesise**. Ask yourself: what could cause this? Write down one guess.
4. **Fix** one thing, and test the guess.
5. **Test** again, then add a test so the bug cannot come back.

The most common mistake is changing many things at once. Then you do not know which change mattered, and you may introduce new bugs.

## Read the traceback first

A traceback tells you where the program stopped and how it got there. Read from the **bottom**:

```text
Traceback (most recent call last):
  File "shop.py", line 12, in <module>
    total = order_total(items)
  File "shop.py", line 7, in order_total
    return sum(item["price"] * item["qty"] for item in items)
KeyError: 'qty'
```

The last line names the error: a `KeyError` for `'qty'`. The line above it shows the code, and the lines above that show who called it. In this case one of the items has no `qty`. The fix is not in `order_total`, but wherever the items came from.

You can produce the same text from code with the `traceback` module:

```python
import traceback

def order_total(items):
    return sum(item["price"] * item["qty"] for item in items)

try:
    order_total([{"price": 2, "qty": 3}, {"price": 5}])
except KeyError:
    text = traceback.format_exc()
    print(text.splitlines()[-1])
    print(len(text.splitlines()) >= 4)
```

## Print better

The simplest debugging tool is `print`. Make it clear:

```python
items = [{"price": 2, "qty": 3}, {"price": 5}]
for i, item in enumerate(items):
    print(f"item {i}: {item!r}")

value = "42 "
print(f"{value=}")
print(f"{len(value)=}")
```

The `!r` shows the `repr`, which reveals hidden spaces and quote marks. The `=` in an f-string prints both the expression and its value. Use `pprint` for big nested data:

```python
from pprint import pprint

pprint({"customer": {"name": "Ada", "orders": [{"id": 1, "total": 9.5}, {"id": 2, "total": 12.0}]}}, width=40)
```

Remove your debugging prints when you are done. A better habit is to use the `logging` module, which you meet later in this section.

## Binary search for the bug

If the bug is somewhere in a long process, do not read every line. **Bisect**. Check the state in the **middle**. If it is already wrong, the bug is in the first half. If it is still right, it is in the second half. Repeat. In ten steps you can find a bug among a thousand lines.

```python
steps = [lambda x: x + 1, lambda x: x * 2, lambda x: x - 3, lambda x: x // 0, lambda x: x + 5]

def find_failing_step(value):
    for number, step in enumerate(steps, start=1):
        try:
            value = step(value)
        except Exception as error:
            return number, type(error).__name__
    return None

print(find_failing_step(10))
```

## The debugger

`pdb` is Python's built-in **debugger**. It stops the program at a chosen line, and lets you look at the variables and run the code one line at a time. You start it by writing `breakpoint()` in your code. It is interactive, so you use it in a terminal on your own computer, not in the browser playground:

```text
def order_total(items):
    breakpoint()          # the program stops here
    return sum(item["price"] * item["qty"] for item in items)
```

When it stops, you see a `(Pdb)` prompt. The most useful commands:

| Command | What it does |
| ------- | ------------ |
| `p expression` | print the value of an expression |
| `pp expression` | pretty-print it |
| `n` (next) | run the next line, stepping **over** calls |
| `s` (step) | run the next line, stepping **into** calls |
| `c` (continue) | run until the next breakpoint or the end |
| `l` (list) | show the code around the current line |
| `w` (where) | show the call stack |
| `b 25` | set a breakpoint at line 25 |
| `q` (quit) | leave the debugger |

You can also debug after a crash. Running `python -m pdb script.py` stops at the error, so you can inspect the state at the moment of failure. Editors such as VS Code and PyCharm give you the same power with a graphical interface: click next to a line to set a breakpoint, and look at the variables in a panel.

## Rubber duck debugging

Explain the problem, line by line, out loud, to a rubber duck (or a colleague, or a note). Very often, you find the mistake while explaining, because you are forced to state what the code **really** does instead of what you **think** it does.

## The minimal example

If you must ask someone for help, prepare a **minimal reproducible example**: the smallest program that still shows the bug. Building it often shows you the cause, because you remove everything that does not matter.

```python
def buggy_average(numbers):
    total = 0
    for n in numbers:
        total += n
    return total / len(numbers)

print(buggy_average([1, 2, 3]))
print(buggy_average([2, 2]))
```

## Reading other people's traces

When you read a traceback from a library, the last lines are usually **your** code calling the library. The library's own frames come first. Start with the error message, then look for the **last frame that is in your own files**. That is where your mistake most probably is.

## Bug-prone areas

- **Off-by-one** errors in ranges and slices.
- **Mutable default** arguments.
- **Aliasing**: two names for the same list.
- A variable that has **the wrong type** (text instead of a number).
- **Silent** failures, where an exception was caught and ignored.
- Assumptions about **empty** input.

## Common mistakes

- Changing many things at once.
- Trying to fix the code before you can make the bug happen every time.
- Ignoring the error message, or reading only the top of the traceback.
- Leaving debugging prints in the finished program.

## Recap

- Follow the routine: reproduce, isolate, hypothesise, fix, test.
- Read the traceback from the bottom, and find your last frame.
- Print with `repr` and `f"{x=}"`. Use `pprint` for nested data.
- `pdb` and `breakpoint()` let you step through the code.
- Bisect, explain to a duck, and build a minimal example.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
