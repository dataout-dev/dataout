Merging isn't the only way to bring a branch up to date with another. Rebasing achieves a similar goal through a completely different mechanism — and leaves a different-shaped history behind.

You will learn:

- what `git rebase` actually does, commit by commit
- how it differs from a merge in the resulting history shape
- why rebasing rewrites commits, and what that implies

## What rebase does

```text
      a40f1c2 (base)
       /      \
  main progress   feature step 1, step 2
```

`git rebase main` (run while on `feature`) takes every commit `feature` has that `main` doesn't, sets them aside, moves `feature`'s starting point to match main's current tip, and replays each of those commits on top, one at a time, in their original order.

```text
$ git rebase main
Successfully rebased onto <main's tip>.

$ git log --oneline
f91a004 feature step 2
c204e81 feature step 1
8b31cc0 main progress
a40f1c2 base
```

## Merge vs rebase, visually

A merge preserves the fork-and-rejoin shape and adds a two-parent commit on top. A rebase erases the fork entirely — the result reads as if `feature`'s commits had been written *after* `main`'s progress all along, in one straight line, with no merge commit at all.

## The catch: new commit identities

Replaying a commit doesn't reuse its original hash — rebase creates a brand-new commit with the same changes and message, but a different identity (the parent changed, and a commit's hash depends on its parent). This is exactly why the standard rule is: **only rebase a branch that's still private to you.** Rebasing a branch other people have already built on top of rewrites history out from under them.

## Common mistakes

- Rebasing a branch that's already been shared and built upon elsewhere — this is the one real danger with rebase.
- Expecting `git log` to show a merge commit after a rebase. There isn't one; that's the entire point.
- Confusing "replays commits" with "copies commits unchanged" — the content is equivalent, but the commit objects themselves are genuinely new.
