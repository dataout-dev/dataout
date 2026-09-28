You have met several error messages already. Each one is called an **exception**, and each has a name that tells you what kind of problem occurred. Recognising the common ones means you know at once where to look. This lesson is a field guide: the ten exceptions you will see most often, what usually causes them, and how to fix each one.

You will learn:

- how Python names its errors, and how to read the name
- the ten most common exceptions
- the typical cause and the typical fix of each

## An exception has a type and a message

Every error line has the form `TypeName: message`. The type is the category, and the message is the detail:

<!-- expect-error -->
```python
int("hello")
```

The result is `ValueError: invalid literal for int() with base 10: 'hello'`. The type is `ValueError`. The message says exactly which value was wrong.

## 1. SyntaxError

The code is not valid Python, so Python cannot even start. Look for a missing colon, bracket or quote, at or just before the line reported.

<!-- expect-error -->
```python
if 5 > 3
    print("yes")
```

## 2. IndentationError

The spaces at the start of a line are wrong: not indented after a colon, or indented for no reason.

<!-- expect-error -->
```python
for i in range(3):
print(i)
```

## 3. NameError

You used a name that does not exist. Usually a typo, a capital letter that does not match, or a variable you never assigned.

<!-- expect-error -->
```python
total = 10
print(totl)
```

## 4. TypeError

You used a value of the wrong type for an operation: adding text to a number, calling something that is not a function, or passing the wrong number of arguments.

<!-- expect-error -->
```python
"age: " + 36
```

Fix it by converting: `"age: " + str(36)`.

## 5. ValueError

The type is right but the value is not, such as converting text that is not a number.

<!-- expect-error -->
```python
float("12,5")
```

## 6. IndexError

You asked for a position in a list or string that does not exist.

<!-- expect-error -->
```python
items = [10, 20, 30]
items[3]
```

The valid positions are 0 to 2 (and -1 to -3). Check the length and remember that counting starts at 0.

## 7. KeyError

You asked a dictionary for a key that is not there. Use `get`, or check with `in` first.

<!-- expect-error -->
```python
person = {"name": "Ada"}
person["age"]
```

## 8. ZeroDivisionError

You divided by zero, often because a list was empty. Guard against it.

<!-- expect-error -->
```python
total = 0
count = 0
total / count
```

## 9. AttributeError

You asked for an attribute or method that the value does not have. This is common when a value is `None` instead of what you expected.

<!-- expect-error -->
```python
value = None
value.upper()
```

The message says `'NoneType' object has no attribute 'upper'`. Ask yourself why `value` is `None`. Often a function returned nothing, or a list method such as `sort()` was assigned to a name.

## 10. RecursionError

A function called itself too many times, almost always because it has no base case.

<!-- expect-error -->
```python
def forever(n):
    return forever(n + 1)

forever(0)
```

## A few more you will meet

- **FileNotFoundError**: the file path is wrong or the file does not exist.
- **ImportError / ModuleNotFoundError**: a module cannot be found. Check the spelling.
- **AssertionError**: an `assert` check failed.
- **KeyboardInterrupt**: someone stopped the program. In this course, that is the Stop button.
- **StopIteration**: an iterator has no more items.

## The exception family tree

Exceptions form a hierarchy. `KeyError` and `IndexError` are both kinds of `LookupError`. `ZeroDivisionError` is a kind of `ArithmeticError`. All of them are kinds of `Exception`. Later, when you learn to catch exceptions, you will use this family tree to catch a whole group at once.

## Strategy when you meet an error

1. Read the **type**: it names the category of the problem.
2. Read the **message**: it names the value or name at fault.
3. Read the **line number** and the code around it.
4. Ask what the values really are. Print them.

## Recap

- Every error is `Type: message`, and the type tells you the family of problem.
- `SyntaxError` and `IndentationError` stop the program before it starts.
- `NameError`, `TypeError`, `ValueError`, `IndexError`, `KeyError`, `ZeroDivisionError`, `AttributeError` and `RecursionError` are the everyday ones, each with a usual cause.
- Read the last line first, then the line number, then check the values.
