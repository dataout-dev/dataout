A program is not much use if it cannot remember things. Variables are how Python remembers. This is one of the most important ideas in the whole course, so we will go slowly.

You will learn:

- what a variable is, and the picture that helps you think about it correctly
- how to create, change and use variables
- the rules and habits for choosing names
- how to assign several names at once, and how to swap two values

## Giving a value a name

A **variable** is a name that refers to a value. You create one with the equals sign:

```python
age = 30
print(age)
```

Read `age = 30` as: "let the name `age` refer to the value `30`". The `=` here is called **assignment**. It is not the same as "equals" in maths. It means "take the value on the right and give it the name on the left".

Now you can use the name wherever you would use the value:

```python
price = 4
quantity = 3
price * quantity
```

The variables `price` and `quantity` still exist in the next example, because this notebook keeps them. That is how Python remembers.

## The picture: names are labels, not boxes

Many beginners imagine a variable as a box that holds a value. A better picture is a **label** (a sticky note) attached to a value. The value exists on its own, and a name is just a label stuck to it.

This picture explains a lot of behaviour later. For now, notice one consequence: you can have more than one label on the same value.

```python
a = 10
b = a
print(a, b)
```

Both names point to `10`.

## Changing a variable

Variables can be re-assigned. The label simply moves to a new value:

```python
score = 5
print(score)

score = 8
print(score)
```

You can use the old value to make the new one:

```python
score = 5
score = score + 1
score
```

Read that carefully: Python works out the right-hand side first (`5 + 1 = 6`), and then attaches the name `score` to the result. There is a shortcut for this very common pattern:

```python
score = 5
score += 1
score
```

`+=` means "add this to the variable". There are matching `-=`, `*=` and `/=`.

## Rules for names

A name can contain letters, digits and underscores, but:

- it cannot start with a digit (`2nd` is not allowed, `second` is)
- it cannot contain spaces or dashes (use `_` instead)
- it cannot be a Python keyword such as `if`, `for`, `class` or `None`
- capital letters count: `Score` and `score` are different names

The Python convention is called **snake_case**: lowercase words joined by underscores. Choose names that say what the value *is*.

```python
body_mass_g = 3750
species_count = 3
is_female = True
```

Compare `body_mass_g` with `x` or `bm`. The first tells the reader what it is. The other two force them to guess. Time you spend on a good name is repaid every time someone reads the code, including you next month.

> **Constants.** By convention, a value that should never change is written in capitals, like `MAX_SPEED = 120`. Python does not stop you from changing it, but it warns other programmers to leave it alone.

## Several at once, and swapping

You can give several names in one line:

```python
x, y = 3, 4
print(x, y)
```

The same trick swaps two values without a helper variable:

```python
a, b = 1, 2
a, b = b, a
print(a, b)
```

Python builds the pair `(b, a)` first, and only then assigns the names. That is why the swap works.

## What happens with a name that does not exist?

If you use a name before you create it, you get a `NameError`:

<!-- expect-error -->
```python
print(total)
```

The fix is to create it first. Names are case sensitive, so a typo such as `Total` versus `total` causes the same error.

## Deleting a name

`del` removes a name. You will rarely need it, but it shows that names and values are separate:

```python
temp = 99
del temp
```

## Common mistakes

- Using `=` when you mean to compare. To ask "are these equal?" you use `==`. You will meet it soon.
- Choosing names like `l`, `O` or `data1` that look confusing or say nothing.
- Using a variable before assigning it.
- Reusing a name for a different purpose halfway through a program.

## Recap

- A variable is a name attached to a value.
- `=` assigns. The right side is worked out first.
- Use snake_case names that describe the value.
- You can re-assign, use augmented assignment (`+=`), assign several names at once, and swap with `a, b = b, a`.

## Your turn

In the **Practice** tab you are given two variables, `a` and `b`. Swap them, so that `a` holds the value `b` had and the other way round. Think about why `a = b` followed by `b = a` does not work.
