A **tuple** is like a list that cannot be changed. It is written with round brackets and is perfect for a small group of values that belong together and should stay together: a point on a map, a date, a name and an age.

## Creating a tuple

```python
point = (3, 4)
person = ("Ada", 36)
print(point, person)
```

Access is just like a list:

```python
point = (3, 4)
print(point[0])
print(point[-1])
print(len(point))
```

The main difference: you cannot change a tuple.

<!-- expect-error -->
```python
point = (3, 4)
point[0] = 10
```

That raises a `TypeError`. To "change" a tuple you build a new one.

## The one-item tuple

The comma is what makes a tuple, not the brackets. A single item needs a trailing comma:

```python
one = (5,)
not_a_tuple = (5)
print(type(one), type(not_a_tuple))
```

You can even leave out the brackets: `t = 1, 2, 3` is a tuple.

## Unpacking

You can split a tuple into separate names in one line. The number of names must match:

```python
point = (3, 4)
x, y = point
print(x, y)
```

This is what happens when you write `a, b = b, a` to swap values: Python builds a tuple on the right and unpacks it on the left.

Use `*name` to collect the rest:

```python
scores = (90, 72, 85, 60)
first, *others = scores
print(first, others)
```

## Returning several values

Later, when you write functions, tuples are how a function gives back more than one thing. You have already seen it in `divmod`:

```python
quotient, remainder = divmod(17, 5)
print(quotient, remainder)
```

## Tuples as keys and in sets

Because tuples cannot change, they can be used where lists cannot, such as the keys of a dictionary or the items of a set:

```python
visits = {(1, 2): "shop", (3, 4): "home"}
print(visits[(3, 4)])
```

## Looping with unpacking

Unpacking works directly in a `for` loop, which you saw with `enumerate` and `zip`:

```python
pairs = [("Ada", 36), ("Bob", 41)]
for name, age in pairs:
    print(name, "is", age)
```

## Comparing and sorting

Tuples are compared item by item, from the left. That makes sorting a list of tuples easy:

```python
people = [("Bob", 41), ("Ada", 36), ("Ada", 20)]
print(sorted(people))
```

## Tuple or list?

- Use a **tuple** for a fixed group of related values, such as `(latitude, longitude)`.
- Use a **list** for a collection that can grow or shrink, such as all the scores.

## Common mistakes

- Forgetting the comma in a one-item tuple.
- Trying to change a tuple in place.
- Unpacking into the wrong number of names.
- Using a list where a tuple is needed as a dictionary key.

## Recap

- A tuple is an ordered group that cannot be changed, written `(a, b, c)`.
- `x, y = point` unpacks it, and `first, *rest = t` collects the remainder.
- A one-item tuple needs a comma.
- Tuples can be keys and set items, and they compare item by item.

## Your turn

In the **Practice** tab you are given a tuple `record` containing a species, a count and an average mass. Unpack it into three names and build a smaller tuple with just the first two.
