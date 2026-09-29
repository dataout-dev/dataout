A linked list gives up the one thing arrays are good at — instant access by index — in exchange for O(1) insertion and deletion anywhere, as long as you already hold a reference to the right spot. It is built from small `Node` objects, each pointing to the next.

You will learn:

- building a singly linked list from `Node(val, next)` objects
- inserting and deleting a node given a reference to it
- reversing a list in place, by relinking pointers rather than copying values
- detecting a cycle with the two-pointer ("tortoise and hare") technique

## Nodes and pointers

```python
class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

# 1 -> 2 -> 3 -> None
head = Node(1, Node(2, Node(3, None)))

values = []
node = head
while node:
    values.append(node.val)
    node = node.next
print(values)
```

Each node only knows about the *next* one. There is no way to jump straight to the fifth element — you must walk from the head, one `.next` at a time, which makes indexing O(n).

## Reversing in place

The practice below asks you to reverse a list by relinking pointers, not by reading out the values and building a new list. The standard technique keeps three references as it walks forward once:

```python
def reverse(head):
    prev = None
    while head:
        nxt = head.next      # save where we were going next
        head.next = prev     # point backwards instead
        prev = head          # prev catches up
        head = nxt           # advance to the saved next node
    return prev

def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out

print(to_list(reverse(Node(1, Node(2, Node(3))))))
```

The order of those four lines inside the loop matters: `nxt` must be saved **before** `head.next` is overwritten, or the rest of the list is lost forever — that single line is the most common bug in this exercise.

## Cycle detection: two pointers

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

a = Node(1)
b = Node(2)
a.next = b
b.next = a          # a cycle: b points back to a
print(has_cycle(a))
```

A slow pointer moves one step at a time, a fast pointer moves two. If there is a cycle, the fast pointer eventually laps the slow one and they land on the *same node* (`is`, not `==`); if the list ends, the fast pointer reaches `None` first.

## Common mistakes

- Overwriting `head.next` before saving it in a temporary variable — this silently truncates the rest of the list.
- Forgetting to update the **head** reference after reversing, so the caller still has a pointer into the middle of the new order.
- Comparing nodes with `==` instead of `is` when looking for a cycle — two nodes can hold equal values without being the same node.
