Every `for` loop you have written works through a hidden protocol. Lists, strings, dictionaries, files and `range` are all **iterable**, and Python walks through them with an **iterator**. Understanding this protocol explains why some objects can be used only once, how generators work, and how you can make your own classes work in a `for` loop.

You will learn:

- the difference between an iterable and an iterator
- `iter` and `next`
- what a `for` loop really does
- `StopIteration`
- one-shot iterators, and why they run out
- `iter(callable, sentinel)`
- a first look at `itertools`

## Iterable and iterator

An **iterable** is anything you can loop over. It has an `__iter__` method that returns an **iterator**. An **iterator** is an object that hands out one item at a time with `__next__`, and remembers its position.

```python
numbers = [10, 20, 30]
iterator = iter(numbers)
print(iterator)
print(next(iterator))
print(next(iterator))
print(next(iterator))
```

`iter(x)` asks an iterable for a fresh iterator, and `next(it)` asks the iterator for the next item.

## When the items run out

After the last item, `next` raises a `StopIteration` exception:

<!-- expect-error -->
```python
iterator = iter([1])
next(iterator)
next(iterator)
```

`next` also takes a default, which it returns instead of raising:

```python
iterator = iter([1])
print(next(iterator, "done"))
print(next(iterator, "done"))
```

## What a for loop really does

A `for` loop calls `iter` once, then calls `next` again and again until `StopIteration`. This `while` loop does the same:

```python
def my_for(iterable, body):
    iterator = iter(iterable)
    while True:
        try:
            item = next(iterator)
        except StopIteration:
            break
        body(item)

my_for(["a", "b"], print)
```

That is how a loop works on **anything** that follows the protocol.

## Iterators are used up

A list can be looped over many times, because each `iter(list)` call gives a **new** iterator. An iterator is **one-shot**. Once used, it stays empty. And an iterator is also iterable: `iter(iterator)` returns itself.

```python
numbers = [1, 2, 3]
it = iter(numbers)
print(list(it))
print(list(it))
print(iter(it) is it)
```

Many functions return iterators: `map`, `filter`, `zip`, `enumerate` and `reversed`. Convert with `list(...)` when you need the results twice.

```python
pairs = zip("ab", [1, 2])
print(list(pairs))
print(list(pairs))
```

## Mixing up the loop and the iterator

Advancing an iterator by hand inside a loop over the same iterator skips items:

```python
it = iter([1, 2, 3, 4, 5, 6])
for item in it:
    if item % 2 == 1:
        next(it, None)
    print(item, end=" ")
print()
```

The output shows that the loop and the `next` call **share** the same position. This can be a useful trick to skip items, but it surprises you if you do not expect it.

## Your own iterator

A class with `__iter__` and `__next__` is an iterator. This one counts down:

```python
class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

print(list(Countdown(4)))
for n in Countdown(2):
    print("tick", n)
```

Classes are covered in the next tier, so treat this as a preview. The next lesson shows that **generators** give you the same result with far less code.

## iter with a sentinel

`iter(callable, sentinel)` calls the function again and again, and stops when it returns the sentinel value. It is useful for reading blocks until there are no more:

```python
import io

stream = io.StringIO("abcdefgh")
chunks = list(iter(lambda: stream.read(3), ""))
print(chunks)
```

Here `stream.read(3)` returns an empty string at the end, and that is the sentinel that stops the loop.

## A first look at itertools

The `itertools` module is a toolbox of iterator builders. All of them are lazy:

```python
from itertools import count, islice, chain, cycle

print(list(islice(count(10, 5), 4)))
print(list(chain([1, 2], "ab", (3,))))
print(list(islice(cycle("xy"), 5)))
```

`count` counts up for ever, `cycle` repeats for ever, `islice` takes a slice of any iterator, and `chain` joins several. A later lesson covers the module in depth.

## Common mistakes

- Looping over an iterator twice, and finding it empty the second time.
- Calling `next` on a list. A list is iterable, but it is not an iterator, so use `next(iter(items))`.
- Modifying a list while looping over it.
- Forgetting that `map`, `filter` and `zip` are lazy.

## Recap

- An iterable has `__iter__`, which returns an iterator. An iterator has `__next__`.
- `for` calls `iter` once, and `next` until `StopIteration`.
- Iterators are one-shot. Iterables like lists can be iterated many times.
- `iter(callable, sentinel)` and `itertools` give you more ways to build iterators.

## Check yourself

Work through the five questions on this page. This lesson has no practice.
