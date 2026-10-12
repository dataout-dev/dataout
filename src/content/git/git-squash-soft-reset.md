A trail of "wip", "wip more", "wip done" commits is useful while you're working and noise forever after. Squashing cleans it up.

You will learn:

- how `--soft` reset differs from `--hard` and the default (mixed)
- combining it with one commit to squash history

## The three reset modes, side by side

All three move the current branch's pointer. They differ in what else they touch:

- `--soft` — moves the branch pointer only. The index and working tree are untouched, so everything from the commits you "undid" stays staged, ready to commit again.
- (default, mixed) — moves the pointer and resets the index, but leaves the working tree alone.
- `--hard` — moves the pointer, resets the index, **and** overwrites the working tree to match. Any uncommitted or "undone" work is gone.

## Squashing with --soft

```text
$ git reset --soft HEAD~3
$ git commit -m "Add search feature"
```

The reset rewinds the branch pointer past three commits, but since it's `--soft`, every file change those three commits made is still staged, as if you'd just run `git add` on all of it in one go. A single `git commit` turns all three into one clean commit.

```text
before:  base -- wip1 -- wip2 -- wip3   (3 messy commits)
after:   base -- "Add search feature"   (1 clean commit, same final content)
```

## Why not --hard here

`--hard` would have thrown away the actual file changes those commits made, not just the commit boundaries between them — you'd be left with none of the work, not a clean version of it. `--soft` is specifically for reshaping commit *history* without touching the *content*.

## Common mistakes

- Reaching for `--hard` out of habit when the goal is to preserve the work, just restructure how it's committed.
- Resetting the wrong number of commits back — count carefully, or check with `git log --oneline` first.
- Forgetting this only works on commits that are entirely yours and not yet shared — squashing already-pushed, already-pulled-by-others commits needs a force-push afterward (covered later in this tier) and real coordination with anyone who already has them.
