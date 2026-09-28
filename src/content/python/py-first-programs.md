You have run your first lines. Now let's write small programs properly. In this lesson you will learn how `print` really works, how to leave notes for yourself in your code, and why the spaces at the start of a line matter so much in Python.

You will learn:

- how to show text and numbers with `print`, and how to control what it prints between and after items
- how to write comments that help the next reader
- what indentation is and why Python uses it
- how to write one instruction per line

## print, in detail

You have already used `print`. It shows things on the screen. You give it what to show inside brackets. The things inside the brackets are called **arguments**.

```python
print("Python")
print(42)
print(3.5)
```

Text needs quotes. Numbers do not. You can print several things at once by separating them with commas. Python puts a single space between them:

```python
print("Total:", 12, "items")
```

You can change the separator with `sep` and what comes at the end with `end`. Normally `print` ends the line, so the next `print` starts on a new line. Setting `end` changes that:

```python
print("a", "b", "c", sep="-")
print("no new line", end=" ... ")
print("continued here")
```

Run it and look at each line of output. The first line prints `a-b-c`. The second and third stay on the same line because we replaced the line break with `" ... "`.

## Comments: notes for humans

A **comment** starts with `#`. Python ignores everything from the `#` to the end of the line. Comments are for people, not for the computer.

```python
# This whole line is a comment and does nothing
print("Hello")  # A comment can also follow code
```

Good comments explain **why**, not what. The code already says *what* it does.

```python
# Weak comment: adds 1 to count
count = 1

# Better comment: we start at 1 because the first row is the header
count = 1
```

You can also use comments to switch a line off for a moment while you test something. Programmers call this *commenting out*. Try adding a `#` in front of a `print` line and run it again.

## One statement per line

In Python, each line is normally one instruction. There is no semicolon at the end. When a line is finished, you press Enter and start the next one.

```python
print("one")
print("two")
```

You can put several statements on one line with a semicolon, but you almost never should. It makes code harder to read.

## Indentation is part of the grammar

Some languages use curly brackets to group lines of code. Python uses **indentation**, the spaces at the start of a line. Lines that belong together are indented by the same amount. The standard is **four spaces**.

Here is a preview of code that has an indented block. Do not worry about `if` for now. It is explained later. Just look at how the spaces work.

```python
if 5 > 3:
    print("five is bigger")
    print("this line is also inside")
print("this line is outside")
```

The first two `print` lines are inside the block, because they are indented. The last line is not, so it always runs.

If the indentation is wrong, Python tells you:

<!-- expect-error -->
```python
print("start")
    print("oops")
```

You get `IndentationError: unexpected indent`. There is no reason to indent that second line, so Python refuses.

> **Rule of thumb.** Use four spaces for each level of indentation, and never mix tabs and spaces in the same file. In the editor you can press **Tab** to indent.

## Blank lines

Blank lines are ignored by Python, so use them to group related lines and make your code easier to read.

```python
# Step 1: greeting
print("Hello!")

# Step 2: the question
print("How are you?")
```

## Common mistakes

- **Forgetting the quotes** around text. `print(Hello)` looks for a thing called `Hello` and fails with a `NameError`.
- **Mixing quote styles.** `"Hello'` starts with one kind of quote and ends with another. Use the same kind on both sides.
- **Indenting a line by accident.** A stray space at the start of a line causes an `IndentationError`.
- **Forgetting the brackets.** `print "Hello"` is a syntax error in Python 3. Always write `print("Hello")`.

## Recap

- `print(...)` shows values. Use commas to print several things, `sep` to change what goes between them and `end` to change what comes after.
- Comments start with `#`. Explain *why*, not *what*.
- One statement per line.
- Indentation is meaningful. Use four spaces.

## Your turn

In the **Practice** tab you are given three variables, `year`, `month` and `day`. Use a single `print` call, and its `sep` argument, to show them as a date such as `2024/5/17`.
