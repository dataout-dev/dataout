The tier's capstone: everything from this section, combined into the shape a real pre-PR cleanup actually takes.

You will learn:

- squashing a messy branch right before sharing it
- pushing a brand-new branch for the first time

## The situation

A feature branch with three "wip" commits is functionally done, but its history is noise — nobody reviewing a pull request wants to read through "wip", "wip more", "wip done". Clean it up before anyone else sees it.

## Squashing

```text
$ git reset --soft HEAD~3
$ git commit -m "Add notifications feature"
```

Same technique from earlier in this tier: `--soft` rewinds the branch pointer past all three commits while leaving every file change staged, so one commit combines them into a single clean one. All the actual work survives — only the commit *boundaries* change.

## Sharing it

```text
$ git push -u origin notifications
```

Since this branch has never been pushed before, this is a first push, not a force-push — `-u` uploads it and sets up tracking in the same step, exactly like you practiced earlier when sharing a brand-new branch for the first time.

## Why this order matters

Squashing *before* the first push means nobody else ever sees the messy intermediate commits at all — there's no history to rewrite later, no force-push required, no coordination needed with anyone. Cleaning up after a branch has already been shared is possible (that's what `--force-with-lease` from the previous lesson is for) but it's extra work and extra risk. Doing it before the first push is simpler whenever you have the choice.

## Common mistakes

- Pushing first and cleaning up after — turning a simple first push into a force-push situation unnecessarily.
- Using `--hard` instead of `--soft` when squashing, losing the actual work instead of just tidying the commit boundaries.
- Forgetting `-u` on a brand-new branch's first push and having to specify the remote and branch name by hand on every push after.
