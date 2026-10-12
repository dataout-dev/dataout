Not every change deserves a commit. Sometimes you just need a clean working directory for a minute.

You will learn:

- what `git stash` actually saves and reverts
- how `git stash pop` brings it back

## The problem it solves

You're partway through editing a file — nowhere near ready to commit — and something urgent needs your attention on a clean tree. Committing half-finished work just to switch tasks pollutes your history. Stashing sets it aside without committing anything at all.

```text
$ git stash
Saved working directory and index state WIP
```

Your working directory now matches HEAD exactly — the in-progress change is tucked away, not lost.

## Doing the other thing

With a clean tree, go do whatever needed your attention — fix a typo, check something out, whatever it was. Commit that work normally. None of it is affected by what's sitting in the stash.

## Bringing your work back

```text
$ git stash pop
```

This re-applies the stashed changes to your working directory and removes the entry from the stash list — you're back exactly where you left off, on top of whatever else you did in the meantime.

## Common mistakes

- Forgetting to `pop` and later wondering where that in-progress work went — it's still in the stash, not lost, just not restored yet.
- Assuming `stash` commits anything. It doesn't touch your commit history at all — it's purely a working-directory/index snapshot, stored separately.
- Using `stash drop` when you meant `pop` — drop discards the stash entry without ever applying it to your working directory, which is exactly what you don't want if you still need that work.
