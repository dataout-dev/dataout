A function is only as useful as what it gives back. In this lesson you look closely at `return`: returning several values at once, returning early, and the difference between returning a result and changing something.

## Return ends the function

The moment Python reaches `return`, the function stops and hands back the value. Any lines after it never run:

```python
def check(n):
    if n < 0:
        return "negative"
    return "not negative"

print(check(-5))
print(check(5))
```

Notice the second `return` is not inside an `else`. It does not need to be, because the first `return` already left the function when the condition was true.

## Returning several values

A function can return more than one value by returning a **tuple**. The caller can unpack it:

```python
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 9, 1, 4])
print(low, high)
```

`return a, b` is the same as `return (a, b)`.

## None means "nothing to give back"

A function with no `return`, or with a bare `return`, gives `None`. That is also a handy way to say "no answer":

```python
def find_first_even(numbers):
    for n in numbers:
        if n % 2 == 0:
            return n
    return None

print(find_first_even([1, 3, 4, 6]))
print(find_first_even([1, 3, 5]))
```

If the loop finishes without finding anything, the function returns `None`. Callers can test for it with `is None`.

## Early returns for bad input

Guard clauses, which you learned earlier, are at their best in functions. Handle the special cases first and return straight away:

```python
def average(numbers):
    if not numbers:
        return None
    return sum(numbers) / len(numbers)

print(average([2, 4]))
print(average([]))
```

## Return or print?

Beginners often print inside a function when they should return. Printing is for people. Returning is for programs.

```python
def add_print(a, b):
    print(a + b)

def add_return(a, b):
    return a + b

total = add_return(2, 3) * 10
print(total)
```

Only the returning version can be used inside a further calculation. As a rule, make functions **return** their result, and let the calling code decide what to do with it, including printing.

## Returning versus changing

A function can affect the outside world in two ways: it can **return** a value, or it can **change** something that was passed in, such as a list. Compare:

```python
def add_end_changing(items):
    items.append("end")

def add_end_returning(items):
    return items + ["end"]

names = ["Ada"]
add_end_changing(names)
print(names)

names = ["Ada"]
new_names = add_end_returning(names)
print(names, new_names)
```

The first changes the caller's list and returns nothing. The second leaves it alone and returns a new list. Returning a new value is usually easier to reason about. If you do change an argument, say so clearly in the function's documentation.

## Multiple return statements

A function can have many `return` lines, but each call executes only one. Keep the number small, and make sure every path returns something sensible:

```python
def sign(n):
    if n > 0:
        return "positive"
    elif n < 0:
        return "negative"
    return "zero"

print(sign(3), sign(-2), sign(0))
```

## Common mistakes

- Printing when you should return, so the result is `None`.
- Forgetting a `return` on one of the paths of the function.
- Writing code after a `return` and expecting it to run.
- Unpacking a returned tuple into the wrong number of names.

## Recap

- `return` stops the function and hands back a value.
- Return several values as a tuple, and unpack them at the call.
- No `return` means `None`, which is a good way to say "not found".
- Prefer returning new values to changing the arguments.

## Your turn

In the **Practice** tab you write `min_max_mean(nums)`. It returns the smallest value, the largest and the mean rounded to 2 decimals as a tuple, or `None` for an empty list.
