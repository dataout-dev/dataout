Code is read far more often than it is written. You will read your own code next week and not remember what you meant. Other people will read it too. This lesson is about writing code that is easy to read, because readable code is also easier to fix and to trust.

You will learn:

- the handful of style rules from PEP 8 that matter most
- how to choose names that explain themselves
- how to use blank lines, spacing and line length
- what a docstring is and when to write a comment

## Why style matters

Python has an official style guide called **PEP 8**. It is a list of habits that most Python programmers agree on. Following it means your code looks like everyone else's, and people can read it without effort.

Compare these two versions of the same program. Both work. Run them and see:

```python
x=3;y=4
z=(x**2+y**2)**0.5
print(z)
```

```python
side_a = 3
side_b = 4
hypotenuse = (side_a ** 2 + side_b ** 2) ** 0.5
print(hypotenuse)
```

The second one tells you what it is doing without a single comment. That is the goal.

## Five rules that cover most of it

**1. Use snake_case for names.** Lower-case words joined by underscores: `total_price`, `is_valid`. (Classes, much later, use `CapitalizedWords`.)

**2. Use four spaces per indentation level.** Never mix tabs and spaces.

**3. Put spaces around operators and after commas.** Write `a = b + c` and `print(a, b)`, not `a=b+c` and `print(a,b)`.

**4. Keep lines short.** Around 79 characters is the traditional limit. If a line gets long, split it.

**5. Use blank lines to group ideas.** One blank line separates steps inside a program. Two blank lines separate function definitions.

## Names that explain themselves

Good names are the single biggest gain in readability. Ask: would a stranger know what this holds?

| Weak | Better |
| ---- | ------ |
| `d` | `days_until_deadline` |
| `lst` | `penguin_masses` |
| `flag` | `is_adult` |
| `temp2` | `celsius_reading` |

A few habits:

- Use nouns for values (`total`, `species_list`) and question-like names for booleans (`is_empty`, `has_wings`).
- Do not use single letters, except for tiny loop counters such as `i` or well-known maths like `x` and `y`.
- Do not use names that look alike, such as `l`, `I` and `O`.
- Never shadow a built-in name. Calling a variable `list`, `type` or `sum` hides the real tool.

<!-- expect-error -->
```python
sum = 10
print(sum([1, 2, 3]))
```

That fails, because `sum` no longer refers to the built-in function. It refers to `10`.

## Comments and docstrings

A **comment** (`# ...`) explains something inside the code. Use them for the *why*, not the *what*.

A **docstring** is a piece of text in triple quotes at the top of a function, describing what it does. You will write them once you learn functions. The idea: comments are for people reading the code, while docstrings are for people *using* it.

```python
# Convert to kilograms because the model expects kg, not grams
mass_kg = 3750 / 1000
mass_kg
```

## Tools that do the tidying for you

Professional teams use formatters, such as **black**, and linters, such as **ruff**, to keep code tidy automatically. You do not need to install them now. Just know that they exist, and that the rules above are what they check.

## Common mistakes

- Cleverness. A short trick that saves one line but needs a minute to understand is not worth it.
- Comments that repeat the code (`# add one` above `count += 1`).
- Names that are too vague (`data`, `stuff`, `thing`).
- Overwriting a built-in name.

## Recap

- Follow PEP 8: snake_case, four-space indents, spaces around operators, short lines.
- Choose names that make comments unnecessary.
- Do not use built-in names for your own variables.
- Comments explain *why*; docstrings explain *what a function does*.
- Formatters and linters can enforce style for you.
