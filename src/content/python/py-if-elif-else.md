So far your programs have run every line, one after another. Real programs make decisions: if the password is wrong, show an error; if the temperature is high, print a warning; otherwise carry on. In Python you make decisions with `if`, `elif` and `else`.

## The if statement

An `if` statement runs a block of code only when a condition is `True`:

```python
temperature = 31
if temperature > 30:
    print("It is hot")
print("Done")
```

Look closely at the shape:

- the condition comes after `if`, and the line ends with a **colon**
- the code to run is **indented** by four spaces
- the last `print` is not indented, so it runs whatever the answer was

Change the temperature to `20` and run it again. The first message disappears, but "Done" stays.

## else: the other case

`else` runs when the condition is not true:

```python
age = 15
if age >= 18:
    print("adult")
else:
    print("minor")
```

Exactly one of the two blocks always runs.

## elif: more than two cases

For several cases, add `elif` (short for "else if"). Python checks the conditions from the top, and runs the **first** one that is true. Then it skips the rest:

```python
score = 82
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
print(grade)
```

Because of this "first true wins" rule, the order of your conditions matters. Look at what goes wrong if we start with the smallest limit:

```python
score = 95
if score >= 70:
    grade = "C"
elif score >= 90:
    grade = "A"
print(grade)
```

A score of 95 is at least 70, so the first block wins, and the `elif` is never reached. **Put the most specific condition first.**

## Conditions can be anything that is true or false

You can use everything you learned in the comparisons lesson: `==`, `<`, `and`, `or`, `not`, `in`.

```python
mass = 4200
sex = "female"
if mass > 4000 and sex == "female":
    print("large female")
```

## Only one branch, but any number of lines

Each block can hold as many lines as you like, as long as they are indented the same amount:

```python
n = 7
if n % 2 == 0:
    parity = "even"
    print("this number is divisible by 2")
else:
    parity = "odd"
    print("this number is not divisible by 2")
print(parity)
```

## An empty block: pass

Sometimes you want a block that does nothing yet. Python does not allow an empty block, so use the placeholder `pass`:

```python
n = 3
if n > 100:
    pass
else:
    print("small")
```

## Common mistakes

- Forgetting the colon at the end of the `if`, `elif` or `else` line.
- Using `=` instead of `==` in a condition. Python reports a syntax error.
- Getting the order wrong when the conditions overlap, as in the 95 example above.
- Forgetting to indent, or indenting different amounts.
- Writing `elif` when you meant a separate `if`. An `elif` only runs when the earlier tests failed.

## Recap

- `if condition:` runs an indented block when the condition is true.
- `else:` handles everything else, and `elif` adds more cases.
- Python takes the first true branch. Order overlapping conditions from most to least specific.
- Blocks are marked by a colon and indentation. Use `pass` for an empty block.
