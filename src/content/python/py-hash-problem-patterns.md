A huge fraction of "clever" interview-style problems are really just "remember what you have already seen" — and a dict, keyed by value, is the tool that remembers in O(1).

You will learn:

- the two-sum pattern: one pass, a dict of "value seen so far"
- frequency maps for counting and grouping
- finding the first unique element
- prefix sums combined with a dict, for subarray-sum problems

## Two-sum in one pass

The brute-force approach checks every pair — O(n squared). The dict approach remembers, for each number already seen, what it would need to complete the target:

```python
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        need = target - n
        if need in seen:
            return [seen[need], i]
        seen[n] = i
    return None

print(two_sum([2, 7, 11, 15], 9))
```

The key insight: check `need in seen` **before** adding the current number to `seen`. Checking after would let a number pair with *itself* at the same index, which is not a valid pair.

## Frequency maps

```python
from collections import Counter

words = ["a", "b", "a", "c", "b", "a"]
counts = Counter(words)
print(counts)
print(counts.most_common(1))
```

`Counter` is a dict specialised for counting — `counts[word] += 1` would work too (with `.get(word, 0)`), but `Counter` also gives you `.most_common()` for free.

## Anagram groups

```python
words = ["eat", "tea", "tan", "ate", "nat", "bat"]
groups = {}
for w in words:
    key = "".join(sorted(w))
    groups.setdefault(key, []).append(w)
print(list(groups.values()))
```

Two words are anagrams exactly when their **sorted letters** are identical — so the sorted letters make a perfect dict key for grouping them.

## First unique element

```python
from collections import Counter

def first_unique(items):
    counts = Counter(items)
    for item in items:
        if counts[item] == 1:
            return item
    return None

print(first_unique(["a", "b", "a", "c", "b"]))
```

One pass to count everything, a second pass (over the *original* order) to find the first item whose count is exactly one — both passes are O(n), so the whole thing is still O(n), not O(n squared).

## Prefix sums with a dict

```python
def subarrays_summing_to(nums, target):
    count = 0
    prefix_sum = 0
    seen = {0: 1}   # an empty prefix sums to 0, and it "exists" once
    for n in nums:
        prefix_sum += n
        count += seen.get(prefix_sum - target, 0)
        seen[prefix_sum] = seen.get(prefix_sum, 0) + 1
    return count

print(subarrays_summing_to([1, 2, 3, -2, 5], 3))
```

If two prefix sums differ by exactly `target`, the numbers between them sum to `target`. A dict of "how many times have I seen this prefix sum before" turns "count all subarrays summing to k" into a single O(n) pass.

## Common mistakes

- Checking `n in seen` (using the number itself) instead of `need in seen` (using what would complete the pair) — these solve different problems.
- Forgetting duplicates: a naive `set` of values loses the count and the position information a dict keeps.
- Building the anagram key with `sorted(w)` (a list) instead of `"".join(sorted(w))` (a string) — lists are not hashable and cannot be dict keys.
