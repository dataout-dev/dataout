Stacks and queues are both "a list you only touch at the ends" — the difference is entirely about *which* end, and that difference changes everything from undo history to breadth-first search.

You will learn:

- LIFO (stack) versus FIFO (queue), and where each shows up in real systems
- why `list` is a fine stack but a bad queue
- checking balanced brackets with a stack
- the monotonic stack pattern, for "next greater element"-style problems

## Stack: last in, first out

```python
history = []
history.append("type")     # push
history.append("bold")
history.append("italic")
print(history.pop())        # undo the most recent action: "italic"
print(history)
```

A plain Python `list` is a perfectly good stack: `.append()` and `.pop()` (with no argument) both operate on the end, and both are O(1).

## Queue: first in, first out

```python
from collections import deque

pending = deque(["a", "b", "c"])
print(pending.popleft())    # serve the oldest item first: "a"
pending.append("d")
print(list(pending))
```

For a queue, use `collections.deque`, not `list`. `deque.popleft()` is O(1); `list.pop(0)` is O(n), because every remaining item has to shift down to fill the gap at the front. A `deque` is a doubly linked block structure designed for O(1) operations at **both** ends.

## Balanced brackets with a stack

```python
def balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in ")]}":
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack

print(balanced("([{}])"))
print(balanced("([)]"))
```

Every opening bracket is pushed. Every closing bracket must match whatever is currently on **top** of the stack — that "most recent first" behaviour is exactly why a stack, not a queue, solves this. `([)]` fails because the `)` arrives while `[` (not `(`) is on top.

## Monotonic stacks: next greater element

A monotonic stack keeps its contents in sorted order at all times, by popping anything that would break that order before pushing. It answers "what is the next bigger thing to the right?" for every element, in a single O(n) pass:

```python
def next_greater(nums):
    result = [None] * len(nums)
    stack = []  # indices, with decreasing values
    for i, v in enumerate(nums):
        while stack and nums[stack[-1]] < v:
            result[stack.pop()] = v
        stack.append(i)
    return result

print(next_greater([2, 1, 5, 3, 4]))
```

Each index goes on the stack once and comes off at most once, so the total work across the whole `while` loop, summed over every iteration, is still O(n) — even though it looks like a loop inside a loop.

## Common mistakes

- Using `list.pop(0)` as if it were a cheap queue operation — it is O(n).
- Using `if` instead of `while` when popping a monotonic stack, which only resolves one waiting element instead of every element that the new value beats.
- Forgetting that a stack answers "who is on top", not "who arrived first" — mixing the two up gives you a queue's answer to a stack's question.
