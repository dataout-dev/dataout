A `reset --hard` that drops a commit you needed feels catastrophic in the moment. It almost never actually is.

You will learn:

- what the reflog tracks
- why a commit "lost" by reset or rebase usually still exists
- the `HEAD@{n}` syntax for referencing it

## What reflog actually is

Every time HEAD moves — a commit, a reset, a checkout, a rebase — git records where it was. That record is the reflog: a local, chronological log of your own HEAD's movements.

```text
$ git reflog
a40f1c2 HEAD@{0}: reset: moving to HEAD~1
9f2a001 HEAD@{1}: commit: important fix
3c8e012 HEAD@{2}: commit: initial setup
```

`HEAD@{0}` is right now. `HEAD@{1}` is one move before that. Reading down the list is reading backward through your own recent history of HEAD positions — not the same thing as `git log`, which shows the commit graph itself.

## Why "losing" a commit usually isn't permanent

`git reset --hard` moves a branch pointer. It does not delete the commit object the pointer used to point at. If nothing else references that commit anymore, it's effectively invisible to `git log` — but the object itself is still sitting there, and the reflog remembers exactly where it was.

```text
$ git reset --hard HEAD~1
$ git log --oneline
3c8e012 initial setup
```

The "important fix" commit looks gone. It isn't — `HEAD@{1}` in the reflog above still points right at it.

## Recovering it

```text
$ git reset --hard HEAD@{1}
```

`HEAD@{1}` is a normal, usable reference, same as a branch name or a commit hash — anything that accepts a ref accepts it. This moves your branch back to point at the exact same commit object, fully recovering it.

## A purely local safety net

The reflog is never pushed, never shared, never part of the project's real history — it's bookkeeping about your own machine's HEAD movements. That's exactly what makes it reliable for this: it's not something a teammate's actions can interfere with.

## Common mistakes

- Treating a "lost" commit after reset/rebase as gone for good before checking `git reflog` first.
- Confusing `HEAD@{n}` (an index into the reflog) with `HEAD~n` (a count of parent commits back through history) — they answer different questions and usually point at different things.
- Assuming reflog entries last forever. Real git eventually garbage-collects old, unreferenced objects — but not immediately, which is exactly why this recovery window exists.
