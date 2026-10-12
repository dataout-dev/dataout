Time to actually land in detached HEAD yourself, rather than just reading about it.

You will learn:

- checking out a commit directly, by a relative reference
- confirming you're genuinely detached, not just confused

## Stepping to a specific commit

```text
$ git checkout HEAD~1
Note: switching to 'HEAD~1'.
...
HEAD is now at a40f1c2
```

`HEAD~1` isn't a branch name — it's a relative reference, "one commit before whatever HEAD currently points to." Checking it out moves HEAD there directly, with no branch to follow along.

## Confirming the state

```text
$ git status
HEAD detached at a40f1c2
```

Real git's status output says exactly this when detached, instead of the usual `On branch <name>` — a clear signal you're not on a branch right now.

## The branch you left is untouched

Whatever branch you were on before (say, `main`) still points exactly where it did. You can confirm this by checking its content directly — it hasn't moved just because you stepped away from it.

## This is different from a reset

It's worth contrasting this with `git reset --hard HEAD~1`, which you've already used earlier in this tier. Reset actually **moves the branch you're on** backward. Checking out `HEAD~1` directly does not move any branch — it just detaches HEAD and leaves you standing at that commit, with the branch itself completely unaffected.

## Common mistakes

- Confusing `git checkout HEAD~1` (non-destructive, just moves where you're looking) with `git reset --hard HEAD~1` (destructive to the current branch's position).
- Forgetting you can use any relative reference here, not just a raw hash — `HEAD~2`, `HEAD^`, a tag name, all work the same way.
- Not checking `git status` or `git branch` to confirm you're actually detached — it's easy to assume without verifying.
