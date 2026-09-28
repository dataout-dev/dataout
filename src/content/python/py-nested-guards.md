Decisions inside decisions are common, and a beginner's code quickly turns into a staircase of ever-deeper indentation. In this lesson you learn to flatten it with **guard clauses**, which handle the bad cases first and leave the main path easy to read.

## The nesting problem

Suppose you want to check a password. Here is a first attempt:

```python
password = "Secret123"
if len(password) >= 8:
    if any(ch.isdigit() for ch in password):
        if password != password.lower():
            result = "ok"
        else:
            result = "needs a capital letter"
    else:
        result = "needs a digit"
else:
    result = "too short"
print(result)
```

It works, but you have to read to the very bottom to see what happens when the length is wrong. The **good** outcome is buried three levels deep, and each `else` is far from its `if`.

A quick note on `any(...)`: it is true when at least one item in the group passes the test. Here it asks whether any character in the password is a digit.

## Guard clauses: check the problem first

A guard clause tests for a bad case and deals with it immediately. What is left is the normal flow.

```python
password = "Secret123"

if len(password) < 8:
    result = "too short"
elif not any(ch.isdigit() for ch in password):
    result = "needs a digit"
elif password == password.lower():
    result = "needs a capital letter"
else:
    result = "ok"

print(result)
```

The same rules, but now the code is flat. Each condition is tested in order, the first problem wins, and the final `else` is the happy path. It reads like a checklist.

## Inside functions: return early

When you learn functions, guard clauses become even more natural, because you can leave the function at once with `return`:

```text
def check(password):
    if len(password) < 8:
        return "too short"
    if not any(ch.isdigit() for ch in password):
        return "needs a digit"
    if password == password.lower():
        return "needs a capital letter"
    return "ok"
```

There is no `else`, because each `return` ends the function. The code needs no nesting at all.

## Validate first, then act

A good habit for any program is to **validate the input before using it**. Handle missing, empty or impossible values first, and only then do the real work:

```python
mass = None
if mass is None:
    verdict = "missing"
elif mass <= 0:
    verdict = "impossible"
elif mass < 3000:
    verdict = "light"
else:
    verdict = "normal"
print(verdict)
```

Notice that we test `mass is None` before comparing `mass <= 0`. Comparing `None` with a number would crash, so the guard protects the later lines.

## Decision tables

If your rules feel tangled, write them as a small table first: each row is a condition and its result.

| Condition | Result |
| --------- | ------ |
| shorter than 8 characters | too short |
| no digit | needs a digit |
| no capital | needs a capital letter |
| anything else | ok |

Then translate the rows straight into `if`, `elif` and `else`, in the same order.

## Common mistakes

- Nesting deeper and deeper instead of flattening with `elif`.
- Putting guards in the wrong order so that a later condition crashes on bad data.
- Using a separate `if` for each rule when only the first matching one should apply.
- Leaving out the final `else`, so the good case has no result.

## Recap

- Deep nesting makes decisions hard to follow.
- Check the problem cases first, in order, and end with the normal case.
- Inside functions, `return` early instead of nesting.
- Put the guards that protect later tests (like `is None`) before them.
- A small decision table is a good way to plan the rules.
