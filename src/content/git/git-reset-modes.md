`git reset` moves your current branch pointer backwards (or to any commit, really) — but *what else* it touches depends entirely on which mode you use. Picking the wrong one is one of the most common ways people accidentally lose work.

You will learn:

- what all three modes share (moving the branch pointer)
- `--soft`: keep everything, just move history
- `--mixed` (the default): unstage, but keep the working tree
- `--hard`: discard everything back to that commit
- why `--hard` is the dangerous one

## What every mode does

```text
$ git reset --soft HEAD~1
$ git reset HEAD~1        # --mixed, the default
$ git reset --hard HEAD~1
```

All three move your branch's pointer back one commit, so `git log` will no longer show the commit you reset past. The difference is entirely about what happens to the staging area and the working directory.

## --soft: just rewind history

Moves the branch pointer only. Whatever that commit changed is now sitting *staged*, ready to be recommitted (perhaps with a different message, or combined into a different commit). Nothing in your working directory changes at all.

## --mixed (default): also unstage

Moves the branch pointer, and also resets the staging area to match the new HEAD. The changes from the undone commit are still in your working directory, just no longer staged — as if you'd edited the files but never run `git add`.

## --hard: discard everything

Moves the branch pointer, resets the staging area, **and** overwrites your working directory to match the new HEAD exactly. Any changes from the undone commit — staged, unstaged, all of it — are gone. This is the only one of the three that can destroy uncommitted work, so it's worth pausing before you run it.

```text
$ git reset --hard HEAD~1
HEAD is now at 9f8e7d6 Add app.js
```

(Untracked files that were never part of any commit are left alone by all three modes — only tracked, committed content is affected.)

## Common mistakes

- Running `--hard` out of habit when `--soft` or the default would have kept work you actually wanted.
- Forgetting that `--hard` discards *uncommitted* changes too, not just the target commit's changes.
- Using `git reset` on a commit that's already been shared with other people — that rewrites history they've already based work on. (`git revert`, next lesson, is the safe alternative there.)
