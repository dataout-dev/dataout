Union-find (also called "disjoint set union") answers two questions extremely fast, over and over: "are these two items in the same group?" and "merge these two groups into one." Both run in close to O(1) amortised time, which is remarkable given how simple the structure is.

You will learn:

- the parent-array representation of disjoint sets
- `find`, with **path compression**
- `union`, and why it must operate on **roots**, not raw items
- counting connected components after a series of unions
- a preview of Kruskal's algorithm, which is union-find applied to building a minimum spanning tree

## The parent array

Every item starts as its own group, pointing to itself:

```python
n = 5
parent = list(range(n))   # [0, 1, 2, 3, 4] — everyone is their own root
print(parent)
```

## find: walking up to the root

```python
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]   # path compression: point closer to the root
        x = parent[x]
    return x

print(find(3))
```

Two items are in the same group exactly when `find` returns the same root for both. **Path compression** — pointing a node directly at its grandparent as you walk past it — flattens the tree over time, so repeated calls to `find` get faster and faster.

## union: merge by root, not by raw value

```python
def union(a, b):
    ra, rb = find(a), find(b)
    if ra != rb:
        parent[ra] = rb

union(0, 1)
union(1, 2)
print(parent)
print(find(0) == find(2))
```

This is the detail that is easy to get wrong: `union(a, b)` must resolve `a` and `b` to their **current roots** first, and merge those roots — not just write `parent[a] = b` directly. If `a` was already merged into some other group earlier, `a` itself is no longer a root, and overwriting `parent[a]` directly can silently disconnect it from the rest of its group.

```python
# A common bug: merging raw indices instead of roots can split a
# group that was already connected through an earlier union.
n, parent = 4, [0, 1, 2, 3]
parent[0] = 1        # union(0, 1) the naive way
parent[1] = 2         # union(1, 2) the naive way — fine so far, still a clean chain
parent[0] = 3         # union(0, 3) the naive way — OVERWRITES parent[0], losing its link to 1 and 2!
print(parent)          # 0 and 3 are now connected, but disconnected from {1, 2} — wrong!
```

## Counting connected components

```python
def count_groups(n, pairs):
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb

    for a, b in pairs:
        union(a, b)

    return len({find(i) for i in range(n)})

print(count_groups(5, [(0, 1), (1, 2)]))
```

After every union, the number of distinct roots among all items is exactly the number of groups — merging never increases it, and every merge of two *different* groups decreases it by exactly one.

## A preview: Kruskal's algorithm

Kruskal's algorithm builds a minimum spanning tree by sorting all edges by weight, then adding each edge **unless** it would connect two nodes already in the same group (which would create a cycle). Union-find is exactly the tool that answers "are these two nodes already connected?" in that inner loop — you will meet the full algorithm later in this tier.

## Common mistakes

- Writing `union` to merge raw items instead of their resolved roots — this can silently split an already-connected group.
- Forgetting path compression, which still gives correct answers but degrades toward O(n) per `find` on a long, unbalanced chain of unions.
- Assuming `find(a) == find(b)` needs its own separate helper — it is just calling `find` on both and comparing the results.
