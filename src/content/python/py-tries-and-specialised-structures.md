Sometimes a hash table or a tree is not quite the right shape for the problem. Autocomplete, range queries and "which group is this in" each have their own purpose-built structure.

You will learn:

- building a trie (prefix tree) for fast prefix lookups
- the idea behind segment trees and Fenwick trees for range queries
- a first look at union-find (disjoint sets) — covered properly in a later lesson
- when reaching for a specialised structure is worth the extra code

## Tries: a tree shaped like your words

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

def insert(root, word):
    node = root
    for ch in word:
        node = node.children.setdefault(ch, TrieNode())
    node.is_word = True

root = TrieNode()
for w in ["cat", "car", "care", "dog"]:
    insert(root, w)

node = root
for ch in "ca":
    node = node.children[ch]
print(node.children.keys())   # everything that can follow "ca"
```

Each node represents "the set of words sharing this prefix." Walking `prefix` characters down from the root lands you exactly on the subtree of every word that starts with it — finding all matches for a prefix costs O(prefix length + number of matches), completely independent of how many *other* words are in the trie.

## Watch out: memory of naive tries

A plain dict-of-children trie, as above, is simple but can use a lot of memory for large alphabets or long shared structure — production autocomplete systems often compress chains of single-child nodes (a "radix tree" / "compressed trie") to save space. For learning purposes and moderate word lists, the simple version is completely fine.

## Segment trees and Fenwick trees, briefly

Both answer **range queries** (sum, min, max over `arr[i:j]`) in O(log n), after an O(n) build — much better than recomputing the range from scratch (O(n) per query) every time the underlying array can also change:

```python
def prefix_sums(arr):
    out = [0]
    for x in arr:
        out.append(out[-1] + x)
    return out

# A plain prefix-sum array answers *sum* range queries in O(1),
# but rebuilding it after any update costs O(n).
# A Fenwick tree (binary indexed tree) answers the same query in
# O(log n) and also supports O(log n) point updates — the full
# implementation is a separate, focused exercise.
sums = prefix_sums([3, 1, 4, 1, 5, 9])
range_sum = sums[4] - sums[1]   # sum of arr[1:4]
print(range_sum)
```

The takeaway for now: when you need range queries **and** the array changes over time, a plain prefix-sum array is not enough — that is the gap segment trees and Fenwick trees fill.

## Union-find, at a glance

Union-find answers "are these two things in the same group?" and "merge these two groups" in close to O(1) per operation. It is covered in full, with path compression, in its own lesson shortly — for now, just recognise the shape of the problem: repeated unions and membership questions over a partition of items into groups.

## Choosing among specialised structures

- Need "all words starting with X"? A trie.
- Need "sum/min/max of a range, with updates"? A segment tree or Fenwick tree.
- Need "are these connected, and how many groups are there"? Union-find.
- Need neither prefixes nor ranges nor grouping — just fast lookup? A plain dict or set is almost always enough; reach for something specialised only when the problem's shape actually calls for it.

## Common mistakes

- Building a trie when a `set` of full words would answer the question just as well (a trie earns its cost specifically for **prefix** queries).
- Recomputing a range sum from scratch inside a loop of many queries, instead of a prefix-sum array (or a Fenwick tree, if updates are also needed).
- Reaching for a specialised structure "because it sounds efficient" without checking whether the problem actually needs range queries, prefixes or grouping at all.
