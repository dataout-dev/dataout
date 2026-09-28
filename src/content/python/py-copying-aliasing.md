This lesson explains one of the most surprising things for new programmers, and the source of some of the most confusing bugs: you change one variable, and *another* variable changes too. Once you understand what is really going on, the mystery disappears.

You will learn:

- that a variable holds a reference to an object, not the object itself
- what an alias is, and how to spot one
- how to make a real copy, and the difference between shallow and deep copies
- what happens when you pass a list to a function

## Names are labels

You met this idea in the variables lesson: a name is a label attached to a value. When you assign one variable to another, you attach a *second label* to the *same* object. You do not make a copy.

```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)
print(b)
```

Both names show `[1, 2, 3, 4]`. There is only one list, and it has two names. `b` is an **alias** for `a`.

## Same object or equal object?

Python has two questions you can ask:

- `a == b` : do they have the same **value**?
- `a is b` : are they the very same **object**?

```python
a = [1, 2, 3]
b = a
c = [1, 2, 3]
print(a == b, a is b)
print(a == c, a is c)
```

`c` has equal content but is a different object. `id()` shows an object's identity number, which makes this visible:

```python
a = [1, 2, 3]
b = a
c = a.copy()
print(id(a) == id(b), id(a) == id(c))
```

## Why doesn't this happen with numbers?

Numbers, strings and tuples are **immutable**. You cannot change them in place, so sharing them is safe. Look at this:

```python
x = 10
y = x
y = y + 1
print(x, y)
```

`y = y + 1` creates a *new* number and moves the label `y` to it. `x` is untouched. The problem only appears with **mutable** objects such as lists, dictionaries and sets, which can be changed in place while several names point at them.

## Making a copy

To get an independent list, copy it. There are several equivalent ways:

```python
a = [1, 2, 3]
b = a.copy()
c = a[:]
d = list(a)
b.append(99)
print(a, b, c, d)
```

Dictionaries and sets have `.copy()` as well.

## Shallow copies and nested data

A copy made this way is **shallow**. It copies the outer list, but the items inside are still shared. That matters when the items are themselves mutable:

```python
outer = [[1, 2], [3, 4]]
shallow = outer.copy()
shallow[0].append(99)
print(outer)
```

Even though we changed the copy, the original changed too, because both lists share the *same inner lists*.

To copy everything, all the way down, use `deepcopy` from the `copy` module:

```python
import copy

outer = [[1, 2], [3, 4]]
deep = copy.deepcopy(outer)
deep[0].append(99)
print(outer)
print(deep)
```

## Functions and mutable arguments

When you pass a list to a function, the function receives an alias, not a copy. A function that changes its argument changes your data:

```python
def add_end(items):
    items.append("end")

names = ["Ada", "Bob"]
add_end(names)
print(names)
```

(You will learn to write functions soon. For now, notice the outcome.) This can be handy, but it can surprise a caller. A well-behaved function either documents the change or works on a copy.

## The mutable default argument trap

A related trap: a default value that is a list is created **once**, when the function is defined, and shared by every call. You will meet it again in the functions section. The safe pattern is `None` as the default and creating the list inside.

## Common mistakes

- Writing `b = a` and expecting a copy.
- Copying a list of lists with `.copy()` and being surprised the inner lists are shared.
- Changing a list passed to a function without meaning to.
- Using `is` to compare values. Use `==`. Keep `is` for `None`.

## Recap

- Assignment copies the label, not the object. Mutable objects can have several names.
- `==` compares values, `is` compares identity.
- `copy()`, `[:]` and `list()` make a shallow copy. `copy.deepcopy` copies nested data fully.
- Functions receive aliases of mutable arguments.

## Your turn

In the **Practice** tab you are given a list `original`. Make an alias and a real copy, then add 99 to the original. Record the length of each afterwards.
