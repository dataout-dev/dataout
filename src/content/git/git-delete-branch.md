A branch whose work has already landed somewhere else is just clutter in your branch list. Git makes deleting it safe by checking first.

You will learn:

- `git branch -d` to delete a branch Git can confirm is fully merged
- `git branch -D` to force-delete one regardless
- why this safety check matters

## The safe delete

```text
$ git branch -d old-feature
Deleted branch old-feature (was 9f2a001).
```

`-d` only succeeds if every commit on `old-feature` is already reachable from your current branch — in other words, nothing on it would actually be lost by deleting the pointer. If that's true, the branch name disappears, but the commits themselves stay in history forever (still reachable through whatever branch they got merged into).

## When Git refuses

```text
$ git branch -d risky-experiment
error: the branch 'risky-experiment' is not fully merged.
If you are sure you want to delete it, use 'git branch -D risky-experiment'.
```

This means `risky-experiment` has at least one commit that no other branch can reach. Deleting it anyway would make that work genuinely unrecoverable through normal means.

## Forcing it anyway

`-D` is shorthand for "delete, and skip the safety check." Use it deliberately, when you're certain the unmerged work is one you actually want to throw away — an abandoned spike, a branch that turned out to be a dead end.

## Common mistakes

- Reaching for `-D` out of habit whenever `-d` complains, instead of reading *why* it complained first.
- Deleting a branch and being surprised its commits vanished — that only happens with `-D` on work that was never actually merged anywhere.
- Trying to delete the branch you're currently on. Switch to a different branch first.
