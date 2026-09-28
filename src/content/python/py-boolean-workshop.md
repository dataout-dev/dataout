Boolean logic is the grammar of decision making, and small mistakes in it cause some of the trickiest bugs. This workshop lesson takes the ideas you know and sharpens them: truth tables, De Morgan's laws, the strange `xor`, and tests that check whole groups.

You will learn:

- how to work out the result of a condition with a truth table
- De Morgan's laws, and how to simplify negated conditions
- how to test "exactly one" and "at least two"
- how to choose between `any` and `all`

## Truth tables

A **truth table** lists every combination of inputs and the result. With two inputs there are four rows. You can print one:

```python
for a in (False, True):
    for b in (False, True):
        print(a, b, "and:", a and b, "or:", a or b)
```

Do not worry about the `for` lines. They are covered in the next section. Look at the output: `and` is `True` only in the last row, `or` is `False` only in the first.

Whenever a complicated condition confuses you, write the truth table by hand for a couple of rows. It is slow, but always right.

## De Morgan's laws

There are two rules for negating a combined condition. Negation flips `and` to `or`, and `or` to `and`:

- `not (a and b)` is the same as `(not a) or (not b)`
- `not (a or b)` is the same as `(not a) and (not b)`

Check that they hold for every input:

```python
for a in (False, True):
    for b in (False, True):
        print(
            (not (a and b)) == ((not a) or (not b)),
            (not (a or b)) == ((not a) and (not b)),
        )
```

You will see four lines of `True True`. The laws are useful for simplifying conditions. For example, "the user is not (an admin or a moderator)" becomes "the user is not an admin **and** not a moderator". A very common mistake is to forget to flip the operator:

```python
is_admin = False
is_moderator = True
print(not is_admin or not is_moderator)
print(not (is_admin or is_moderator))
```

The two lines give different answers. Only the second one is the true negation.

## Booleans behave like numbers

`True` counts as 1 and `False` as 0, so you can add booleans up:

```python
a, b, c = True, False, True
print(a + b + c)
```

That gives a neat way to count how many conditions hold.

## Exactly one, at least two

Using the count, "exactly one of three is true" is:

```python
a, b, c = True, False, False
print(a + b + c == 1)
```

And "at least two":

```python
a, b, c = True, True, False
print(a + b + c >= 2)
```

There is also the **exclusive or**, written `^` for booleans. It is true when the two inputs differ:

```python
print(True ^ False)
print(True ^ True)
```

Beware: chaining `a ^ b ^ c` is true when an *odd* number of inputs are true, so with three trues it is `True`, and that is not the same as "exactly one".

## any() versus all()

`any` is "is there at least one?" and `all` is "is it true for every one?". They are opposites in an interesting way:

```python
scores = [55, 72, 91]
print(any(score >= 90 for score in scores))
print(all(score >= 60 for score in scores))
print(not any(score < 60 for score in scores))
```

The last two lines give the same answer. "Every score is at least 60" is the same as "no score is below 60". An `all` can always be turned into a negated `any`, which is De Morgan for groups.

For an empty group, `all` is `True` (nothing breaks the rule) and `any` is `False` (nothing satisfies it):

```python
print(all([]), any([]))
```

## Testing your conditions

When you write a condition, test it with the boundaries: the smallest value, the largest, just inside and just outside the limit. It is at the edges that `<` versus `<=` mistakes show up.

## Common mistakes

- Negating `a and b` as `not a and not b`. That is not what De Morgan says.
- Using `^` on three inputs and expecting "exactly one".
- Assuming `all` on an empty group is false.
- Not testing the boundary values.

## Recap

- Use truth tables when a condition is confusing.
- `not (a and b)` is `(not a) or (not b)`, and `not (a or b)` is `(not a) and (not b)`.
- Booleans count as 0 and 1, so `a + b + c == 1` means exactly one.
- `all` is "every one", `any` is "at least one", and each can be written with the other.

## Your turn

In the **Practice** tab you are given three booleans `a`, `b` and `c`. Set `exactly_one` to `True` only when exactly one of them is `True`.
