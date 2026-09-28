Programming means giving a computer a list of clear instructions and letting it follow them. That is all a program is. The computer does not understand what you want. It only does exactly what you wrote, one step at a time, very fast and without getting tired.

By the end of this lesson you will know:

- what a program is and what Python is
- how Python reads and runs your code
- the difference between an expression and a statement
- three ways of running Python: a script, a notebook and the interactive prompt

## A program is a recipe

Think of a recipe: "boil water, add pasta, wait ten minutes, drain." A cook can follow it because each step is clear and comes in a fixed order. A program works the same way. The difference is that the reader is a computer, so it has no common sense to fill the gaps. If a step is missing, it does not guess.

Here is your first program. It has one instruction: show some text on the screen. Press **Run** to try it.

```python
print("Hello, world!")
```

`print` is a built-in tool that shows something on the screen. The text inside the quotes is what gets shown. Try changing the words and running it again. You cannot break anything.

## What is Python?

Python is a **programming language**: a set of words and rules you can use to write instructions a computer accepts. There are hundreds of languages. Python is popular for a few reasons:

- it reads almost like English, so it is easier to learn than most languages
- it is used everywhere: data analysis, websites, automation, science and AI
- it has a huge library of ready-made tools, so you rarely start from nothing

You will use it in this course to work with real data, such as measurements of penguins and sales in a music store.

## How Python runs your code

When you run a Python program, a program called the **interpreter** reads your text (the *source code*) and carries out the instructions. It goes from the top to the bottom, one line at a time, in order.

Run this example. Notice that the lines run in the order you wrote them.

```python
print("First")
print("Second")
print("Third")
```

Order matters. If you swap two lines, the output changes. Try it: move the second `print` above the first and run it again.

> **Good to know.** Python checks your whole program for grammar mistakes before it runs the first line. If a line is written in a way Python cannot read, it stops and tells you where the problem is. You will learn to read those messages in the next lesson.

## Expressions and statements

Two words you will hear all the time:

- An **expression** is a piece of code that has a value. `2 + 3` is an expression. Its value is `5`.
- A **statement** is a complete instruction that *does* something. `print("Hi")` is a statement.

You can type an expression on its own and Python will show its value. In this course, the last line of an example is shown automatically:

```python
2 + 3
```

```python
"snow" + "man"
```

Python did the arithmetic and joined the words. You did not have to ask it to print anything, because the last line of an example is shown for you. In a normal program file you would use `print` to see a value.

## Three places to run Python

You will meet Python in three forms:

| Form | What it is | Good for |
| ---- | ---------- | -------- |
| **Script** | A text file ending in `.py`, run from top to bottom | Real programs and automation |
| **Interactive prompt (REPL)** | You type one line, Python answers straight away | Quick experiments |
| **Notebook** | Cells of code and notes that you run one at a time | Exploring data and learning |

The examples in this lesson behave like a notebook, and the [Python playground](/playground/python) gives you a full notebook of your own. In a notebook, the variables you create in one cell stay available in the next.

## Why the computer is "literal"

The most important habit to build is to be exact. Compare these two lines. Run both.

```python
print("Hello")
```

```python
print("hello")
```

Only the first letter changed, and so did the output. Python treats a capital `H` and a small `h` as different characters. It also cares about spaces, quotes and brackets. It never says "close enough".

That sounds strict, but it becomes a strength. Because the computer is literal, the same program gives the same answer every time.

## Common mistakes

- **Expecting Python to guess what you meant.** If you forget a bracket or a quote, Python will not repair it. It will report an error.
- **Typing curly quotes.** If you copy code from a web page or a document, the quotes may be curly. Python needs straight quotes (`"` or `'`).
- **Being afraid to run code.** Errors are normal and harmless. Reading them is a skill, and you will practise it in the next lesson.

## Recap

- A program is a list of precise instructions. Python follows them from top to bottom.
- The interpreter reads your source code and runs it.
- An expression has a value. A statement does something.
- Python is literal: capital letters, spaces and quotes all matter.
- You can run Python as a script, at the prompt, or in a notebook.

Now check what you learned with the questions below.
