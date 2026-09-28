Lists are useful because you can change them. Python gives every list a set of **methods** to add, remove, find and rearrange items. This lesson covers the ones you will use every week.

## Adding items

`append` adds one item to the end. `extend` adds every item of another group. `insert` puts an item at a chosen position:

```python
nums = [1, 2, 3]
nums.append(4)
print(nums)

nums.extend([5, 6])
print(nums)

nums.insert(0, 99)
print(nums)
```

Be careful with `append` and lists. Appending a list adds it as **one item**:

```python
nums = [1, 2]
nums.append([3, 4])
print(nums)
```

Use `extend` when you want to add the items themselves.

## Removing items

```python
letters = ["a", "b", "c", "b"]
letters.remove("b")
print(letters)

last = letters.pop()
print(last, letters)

first = letters.pop(0)
print(first, letters)
```

- `remove(value)` deletes the **first** item equal to `value`. It raises an error if there is none.
- `pop()` removes and **returns** the last item. `pop(i)` removes the item at position `i`.
- `del letters[0]` also deletes by position, and `letters.clear()` empties the list.

## Finding items

```python
letters = ["a", "b", "c", "b"]
print(letters.index("b"))
print(letters.count("b"))
print("z" in letters)
```

`index` gives the position of the first match, and raises an error if it is missing. `count` says how often an item appears.

## Sorting and reversing

`sort()` sorts the list **in place** and returns `None`. `reverse()` flips it in place:

```python
nums = [3, 1, 2]
nums.sort()
print(nums)
nums.sort(reverse=True)
print(nums)
nums.reverse()
print(nums)
```

A very common bug is to write `nums = nums.sort()`. That sets `nums` to `None`, because `sort` returns nothing. Use `sorted(nums)` when you want a new sorted list and want to keep the original.

## Methods change the list, functions make new ones

This difference is the most important idea in this lesson.

| Changes the list | Gives a new value |
| ---------------- | ----------------- |
| `nums.sort()` | `sorted(nums)` |
| `nums.reverse()` | `reversed(nums)` |
| `nums.append(x)` | `nums + [x]` |

```python
nums = [3, 1, 2]
ordered = sorted(nums)
print(nums, ordered)
```

## Copying a list

To make an independent copy, use `copy()` or a full slice:

```python
a = [1, 2, 3]
b = a.copy()
b.append(4)
print(a, b)
```

Without the copy, `b = a` would point both names at the same list. The copying lesson explains why.

## Lists and strings

`split` turns a string into a list, and `join` turns a list of strings back into text:

```python
words = "the quick brown fox".split()
print(words)
print("-".join(words))
```

## Common mistakes

- Writing `nums = nums.sort()` or `nums = nums.append(1)`. These methods return `None`.
- Using `remove` on an item that is not in the list.
- Appending a list when you meant to extend.
- Changing a list while looping over it.

## Recap

- `append`, `extend` and `insert` add. `remove`, `pop`, `del` and `clear` delete.
- `index` and `count` search, and `sort` and `reverse` change the list in place.
- Methods that change a list return `None`. Use `sorted` for a new sorted list.
- `copy()` makes an independent copy.

## Your turn

In the **Practice** tab you are given a list `items` and a value `new`. Add the value to the end, sort the list in place, and record the largest item and how many items there are.
