A binary search tree keeps every value in a position that makes both searching and staying sorted cheap — as long as the tree does not become lopsided.

You will learn:

- building trees recursively with `left`/`right` node references
- the three depth-first traversal orders: pre-order, in-order, post-order
- inserting and searching in a BST
- why in-order traversal of a BST always visits values in sorted order
- why recursion depth is a real risk on a skewed tree

## Building and traversing

```python
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

root = None
for v in [5, 3, 8, 1, 4]:
    root = insert(root, v)
```

Every value smaller than a node goes to its left subtree; everything else goes right. That single rule is what makes a BST searchable in O(height) instead of O(n).

## Three traversal orders

```python
def preorder(node, out):
    if node:
        out.append(node.val); preorder(node.left, out); preorder(node.right, out)

def inorder(node, out):
    if node:
        inorder(node.left, out); out.append(node.val); inorder(node.right, out)

def postorder(node, out):
    if node:
        postorder(node.left, out); postorder(node.right, out); out.append(node.val)

pre, ino, post = [], [], []
preorder(root, pre); inorder(root, ino); postorder(root, post)
print(pre, ino, post)
```

The three orders differ only in *when* the current node's value is recorded relative to its children: before both (pre-order), between them (in-order), or after both (post-order).

## In-order traversal is always sorted

This is the one fact worth memorising: for **any** valid BST, no matter what order the values were inserted in, an in-order traversal visits them in ascending order. That is a direct consequence of the "smaller goes left" rule applied consistently at every node — it is also a fast way to check whether a tree really is a valid BST (build it, walk it in-order, check the result is non-decreasing).

## Searching

```python
def search(root, target):
    node = root
    while node:
        if target == node.val:
            return True
        node = node.left if target < node.val else node.right
    return False

print(search(root, 4), search(root, 99))
```

Each comparison eliminates one whole subtree, so a balanced tree searches in O(log n) — but an unbalanced one degrades toward O(n).

## Watch out: recursion depth on skewed trees

```python
skewed = None
for v in range(300):            # inserted in sorted order!
    skewed = insert(skewed, v)
print("built a skewed tree of depth ~300")
```

Inserting already-sorted data produces a tree that is really just a linked list in disguise — every node has only a right child, height n instead of log n. A recursive traversal on a tree that deep can hit Python's recursion limit (or, in the browser, a stack limit well before that). Real-world BST implementations (like the `red-black tree` behind many standard library ordered maps in other languages) rebalance themselves precisely to avoid this.

## Common mistakes

- Confusing pre-order and in-order — only in-order is guaranteed sorted.
- Assuming a BST built from arbitrary insertion order is balanced — it is not, and its worst case (sorted input) is exactly the case that breaks recursion depth.
- Forgetting the equal-values rule: this lesson sends ties right, but any consistent rule works, as long as it is applied consistently everywhere the tree is built or searched.
