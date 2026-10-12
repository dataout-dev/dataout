Two commits landed in the wrong order. Fixing it combines two tools you already know: reset and cherry-pick.

You will learn:

- tagging commits as a stable way to reference them mid-rewrite
- replaying them back in a different order

## The problem with "just moving" a commit

Git doesn't let you reorder commits in place — a commit's position is defined by its parent, so "moving" one really means recreating the ones after it. The safe way to do this deliberately is: tag what you have, reset back to before any of it, then cherry-pick each piece back on in the order you actually want.

## Tagging first

```text
$ git tag orig-feature HEAD
$ git tag orig-tests HEAD~1
```

Tags are permanent pointers — unlike a branch, nothing about them changes when you move the branch itself. Tagging each commit by name *before* touching anything gives you a stable way to refer back to them, even after the branch they were on has moved.

## Resetting and replaying in the new order

```text
$ git reset --hard HEAD~2
$ git cherry-pick orig-feature
$ git cherry-pick orig-tests
```

The hard reset drops both commits from the branch (the tags still point at them, so nothing is actually lost). Cherry-picking `orig-feature` first, then `orig-tests`, rebuilds the branch with the same two commits' content — just in the order you wanted.

```text
before:  base -- "Add tests" -- "Add feature"
after:   base -- "Add feature" -- "Add tests"
```

## Common mistakes

- Resetting before tagging — once the branch has moved, you've lost your only easy way to reference the original commits by name.
- Cherry-picking in the same order they were in originally, which doesn't actually fix anything.
- Forgetting the tags are still sitting there afterward — harmless, but worth knowing they exist if you later wonder why `git tag` lists more than you expected.
