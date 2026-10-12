Something broke somewhere in the last dozen commits. Checking each one by hand would work — bisect does it in a fraction of the steps.

You will learn:

- how a bisect session narrows down a bug's origin
- marking commits good and bad as you go

## Starting a session

```text
$ git bisect start
$ git bisect bad
```

Marking `bad` with no argument marks the current commit (usually your tip, where you noticed the problem) as bad.

```text
$ git bisect good HEAD~4
```

Marking a known-good commit — one from before the bug existed — gives bisect both ends of a range to search. The moment both are set, it automatically checks out a commit roughly in the middle:

```text
Bisecting: 2 revisions left to test after this
[c37236b] checked out
```

## The loop

At each stop, inspect whatever tells you whether the bug is present — run the code, check a file, whatever applies — then report back:

```text
$ git bisect good
```

or

```text
$ git bisect bad
```

with no argument either way, since you're reporting on whatever bisect just checked out. Each answer eliminates roughly half of what's left, and bisect checks out the next midpoint automatically. Keep going until it tells you:

```text
c37236b is the first bad commit
```

That's it — you've found the exact commit that introduced the problem, without manually inspecting most of the range.

## Ending the session

```text
$ git bisect reset
```

This returns you to wherever you started (your original branch), undoing all the detached-HEAD checkouts bisect did along the way.

## Common mistakes

- Marking good/bad backwards — if your answers contradict each other, bisect's narrowing will be wrong.
- Forgetting `git bisect reset` at the end, leaving you in detached HEAD from the last checkout bisect did.
- Testing something unrelated to the actual bug at each stop — bisect only narrows correctly if your good/bad judgment is accurate every time.
