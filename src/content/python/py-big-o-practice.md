Before you optimise anything, you need a way to talk about cost that does not depend on which computer you own. Big-O notation does that: it describes how the **number of operations** an algorithm performs grows as the input grows, ignoring constant factors and small-input noise.

You will learn:

- what O(1), O(log n), O(n), O(n log n) and O(n squared) mean in practice
- best, average and worst case, and why they can differ
- amortised cost, using `list.append` as the running example
- how to read a piece of code and estimate its complexity by counting loops

## The common growth classes

```python
def constant(items):
    return items[0]                 # O(1) — one step, however big items is

def linear(items):
    total = 0
    for x in items:                 # O(n) — one step per item
        total += x
    return total

def quadratic(items):
    pairs = []
    for a in items:                 # O(n^2) — a loop inside a loop
        for b in items:
            pairs.append((a, b))
    return pairs

print(len(quadratic([1, 2, 3])))
```

A useful trick: **double the input size** and watch what happens to the operation count. O(1) barely moves. O(n) roughly doubles. O(n squared) roughly quadruples (2 squared). This is exactly what `growth_class` in the practice below asks you to check, from measured counts rather than from reading code.

## Best, average and worst case

Searching for a value in an unsorted list of n items is O(n) in the worst case (the value is last, or missing) but the *best* case — the value is first — is O(1). When people say "this algorithm is O(n)" without qualification, they usually mean the worst case, since that is the guarantee you can actually rely on.

## Amortised cost: list.append

```python
items = []
for i in range(5):
    items.append(i)                 # usually O(1); occasionally the list
                                     # must grow into a bigger block and
                                     # copy everything, which is O(n)
print(items)
```

Python's list over-allocates room when it grows, so the expensive "copy everything" step happens rarely — and when you spread that occasional cost over all the cheap appends in between, the *average* cost per append is still O(1). That is what "amortised O(1)" means: not that every single call is cheap, but that the total cost over many calls divided by the number of calls is cheap.

## Space complexity

Big-O also applies to memory. A function that builds a new list the same size as its input uses O(n) extra space; one that only tracks a running total uses O(1) extra space, no matter how big the input is. When two algorithms have the same time complexity, the one using less space is often the better choice.

## Common mistakes

- Judging complexity from a single run on one input size — you need at least two sizes (ideally with one **doubled**, as the practice does) to see a trend at all.
- Forgetting that small n hides everything: a O(n squared) algorithm can easily beat an O(n log n) one when n is tiny, because constant factors dominate before the growth rate takes over.
- Treating "the loop runs n times" as the whole story when the loop's *body* also does O(n) work (like a `.remove()` on a list) — that combination is O(n squared), not O(n).
