Stash more than once and you've got a stack, not a single slot. Addressing the right entry matters.

You will learn:

- how multiple stashes are indexed
- the difference between `apply` and `drop` for a specific entry

## A stack, newest first

```text
$ git stash list
stash@{0}: newer work: scratch notes
stash@{1}: older work: add helper
```

`stash@{0}` is always the most recent stash. Every push before that shifts everything else up one index. This is the same reflog-style `@{n}` indexing you've seen elsewhere in this app — index 0 is "most recent," higher numbers are older.

## Restoring a specific one

```text
$ git stash apply 1
```

`apply <n>` restores that specific entry's changes to your working directory — **without** removing it from the list. If you might want the same stash again, or just aren't ready to commit to clearing it, `apply` is the safer choice over `pop`.

## Discarding one you don't need

```text
$ git stash drop 0
```

`drop <n>` removes an entry from the list without ever applying it. Whatever was in it is gone — there's no further confirmation, so make sure you don't need it first.

## Order matters when combining both

If you want to keep one stash and discard another, apply the one you're keeping *before* dropping anything — dropping an earlier entry shifts every later index down by one, so an index you were about to use might not mean what you think it means anymore.

## Common mistakes

- Dropping an entry before applying a different one you meant to keep, then discovering the index you wanted to apply has shifted.
- Confusing `stash@{1}` (older) with "the first one I made" when there have been more than two pushes — always check `stash list` rather than assuming.
- Using `pop` when you specifically wanted to address a non-default entry — `pop` always targets `stash@{0}` only; for anything else, `apply`/`drop` with an explicit index is what you want.
