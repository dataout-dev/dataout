Every programmer, including people who have written code for twenty years, sees error messages every day. The difference between a beginner and an expert is not that the expert avoids errors. The expert can read them. In this lesson you will learn how.

You will learn:

- how to run code, stop it, and see its output
- how to use `print` to look at values
- how to read a traceback, the message Python shows when something goes wrong
- the three families of mistakes: syntax errors, runtime errors and logic errors

## Running code and seeing output

In this course you write code in an editor and press **Run**. If a program takes too long, for example because it loops forever, press **Stop**. Python restarts and nothing is damaged.

A program only *shows* what you tell it to show. To look at a value, use `print`:

```python
print("The answer is", 6 * 7)
```

`print` can take several things separated by commas and puts a space between them. When you are not sure what your code is doing, adding a `print` line to look at a value is the most useful thing you can do. Programmers call this **print debugging**.

## Your first error

Run this example. It contains a deliberate mistake.

<!-- expect-error -->
```python
print("Hello"
```

Python answers with a message like this:

```text
  File "<example>", line 1
    print("Hello"
         ^
SyntaxError: '(' was never closed
```

Read it from the bottom. The last line names the kind of error (`SyntaxError`) and explains it: an opening bracket was never closed. The lines above show *where*: the file, the line number, and the exact spot with a little arrow.

Fix it by adding the missing bracket and run it again.

## Anatomy of a traceback

When an error happens inside a bigger program, Python prints a **traceback**. It lists the chain of steps that led to the problem, oldest first, ending with the actual error. Run this:

<!-- expect-error -->
```python
def half(n):
    return n / 0

half(10)
```

Read it in this order:

1. **The last line** tells you what went wrong: `ZeroDivisionError: division by zero`.
2. **The line above it** shows the code that failed.
3. **The lines above that** show how the program got there: `half(10)` was called first, and that called the failing line.

Do not skim the message. Almost every error message tells you what is wrong and where. Read the last line first, then find the line number.

## Three families of mistakes

**1. Syntax errors.** The code breaks the rules of the language, like a sentence with no verb. Python refuses to run the program at all. Typical causes are a missing bracket, a missing quote or a missing colon.

**2. Runtime errors** (also called exceptions). The code is grammatical, but something goes wrong while it runs, such as dividing by zero or using a name that does not exist.

<!-- expect-error -->
```python
print(colour)
```

You get `NameError: name 'colour' is not defined`, because we never created `colour`.

**3. Logic errors.** The program runs without any error, but the answer is wrong. These are the hardest, because Python cannot tell you what you *meant*.

```python
average = 10 + 20 / 2
print(average)
```

You might have wanted the average of 10 and 20, which is 15. You get 20.0, because division happens before addition. The fix is to use brackets: `(10 + 20) / 2`. Python did exactly what you wrote.

## What to do when you see an error

1. Read the **last line**. What kind of error is it? What does the message say?
2. Find the **line number** and look at that line and the line just before it.
3. Check the usual suspects: brackets, quotes, colons, spelling, capital letters, indentation.
4. If you still do not see it, `print` the values around the problem.
5. Fix **one thing at a time** and run again. The first error often causes the later ones, so once it is fixed, the others may vanish.

> **Tip.** If you cannot solve an error, search for the message text with the word "Python". Millions of people have hit the same error before you.

## Common mistakes

- Reading the top of a long traceback and ignoring the bottom. The end is the most useful part.
- Changing many things at once, so you no longer know which change fixed it.
- Thinking an error means you are bad at this. It only means the computer needs a clearer instruction.

## Recap

- `print` lets you look at values. Use it whenever you are unsure.
- A traceback is read from the bottom: the error type, then the line, then the path that led there.
- Syntax errors stop the program before it starts. Runtime errors happen while it runs. Logic errors give a wrong answer without any message.
- Fix one thing at a time.
