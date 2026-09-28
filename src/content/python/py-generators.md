A **generator** is a function that produces a sequence of values **one at a time**, pausing between them. Instead of building a whole list in memory, it hands out each item when asked. That makes it perfect for large data, for infinite sequences and for building step-by-step pipelines.

You will learn:

- how `yield` differs from `return`
- how a generator pauses and resumes
- lazy pipelines that chain generators
- `yield from`
- infinite generators
- a preview of sending values into a generator

## yield instead of return

A function that contains `yield` is a **generator function**. Calling it does not run the body. It returns a generator object:

```python
def count_up(limit):
    n = 1
    while n <= limit:
        yield n
        n += 1

gen = count_up(3)
print(gen)
print(next(gen))
print(next(gen))
print(next(gen))
```

Each `next` runs the function **until the next `yield`**, hands out that value, and pauses with all its local variables intact. When the function ends, `StopIteration` is raised, so a `for` loop stops on its own:

```python
for n in count_up(4):
    print(n, end=" ")
print()
print(list(count_up(4)))
```

## Watching it pause

Add prints to see the order of events:

```python
def noisy():
    print("start")
    yield "a"
    print("middle")
    yield "b"
    print("end")

it = noisy()
print("created")
print(next(it))
print(next(it))
print(list(it))
```

Nothing ran when the generator was created. It also shows that after the final `yield`, the remaining code runs until the function ends.

## Lazy means memory friendly

A list holds all the values at once. A generator holds only the current one. So this works, and needs almost no memory, even for a huge range:

```python
def squares(limit):
    for n in range(limit):
        yield n * n

print(sum(squares(1_000_000)))
```

Also, a generator does only the work you ask for. Taking the first five items of an enormous sequence costs five steps.

```python
from itertools import islice

print(list(islice(squares(10**12), 5)))
```

## Pipelines

Generators can be **chained**. Each stage takes an iterable, and yields items to the next. No stage builds a list:

```python
def numbers():
    for n in range(1, 21):
        yield n

def only_even(items):
    for n in items:
        if n % 2 == 0:
            yield n

def times_ten(items):
    for n in items:
        yield n * 10

pipeline = times_ten(only_even(numbers()))
print(list(pipeline))
```

The pipeline is like a factory line: each item goes through every stage before the next item starts. Generator expressions make short stages easy:

```python
pipeline = (n * 10 for n in (n for n in range(1, 21)) if n % 2 == 0)
print(list(pipeline)[:3])
```

## Running totals and state

A generator keeps its variables between items, so it is a natural way to write anything that has a running state:

```python
def running_total(numbers):
    total = 0
    for n in numbers:
        total += n
        yield total

print(list(running_total([3, 1, 4, 1, 5])))
```

## yield from

`yield from other` passes on every item of another iterable. It replaces a small loop:

```python
def chain(*iterables):
    for iterable in iterables:
        yield from iterable

print(list(chain([1, 2], "ab", range(3))))
```

It is especially neat for **recursive** generators, such as walking through nested lists:

```python
def flatten(items):
    for item in items:
        if isinstance(item, list):
            yield from flatten(item)
        else:
            yield item

print(list(flatten([1, [2, [3, 4]], 5])))
```

## Infinite generators

A generator does not need to end. Combined with `islice`, or a `break` in a loop, it is safe:

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice

print(list(islice(fibonacci(), 10)))
```

## Batching

Reading data in **chunks** is a common use. This generator yields lists of at most `size` items:

```python
def batches(items, size):
    batch = []
    for item in items:
        batch.append(item)
        if len(batch) == size:
            yield batch
            batch = []
    if batch:
        yield batch

print(list(batches(range(7), 3)))
```

Do not forget the last, smaller batch after the loop.

## A generator can be used only once

Like every iterator, a generator is used up after one pass:

```python
gen = (n for n in range(3))
print(list(gen))
print(list(gen))
```

If you need to go through the data again, call the generator function again to get a fresh one.

## Sending values in (a preview)

A generator can also **receive** values with `send`. This is more advanced, and is used for coroutines:

```python
def averager():
    total = 0
    count = 0
    average = None
    while True:
        value = yield average
        total += value
        count += 1
        average = total / count

avg = averager()
next(avg)
print(avg.send(10), avg.send(20), avg.send(30))
```

The first `next` runs up to the first `yield`. Then each `send` gives a value to the `yield` expression, and gets the next result back.

## Common mistakes

- Expecting the function body to run when you call the generator function.
- Using a generator twice.
- Using `return value` in a generator and expecting it to be produced. It ends the generator instead.
- Forgetting to yield the final partial batch.

## Recap

- `yield` produces a value and pauses. The function resumes where it stopped.
- Generators are lazy: they hold one item at a time and can be infinite.
- Chain generators into pipelines, and delegate with `yield from`.
- A generator is exhausted after one pass.

## Your turn

In the **Practice** tab you write the generator `running_total(nums)`. Then three challenges use the Chinook store.
