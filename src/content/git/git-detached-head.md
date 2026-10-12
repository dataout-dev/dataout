Every lesson so far has had you sitting on a branch. What happens when you check out something that isn't one?

You will learn:

- what "detached HEAD" actually means
- how you land there
- why it's a real, useful state — not an error

## HEAD, normally

Normally, HEAD points at a branch, and that branch points at a commit:

```text
HEAD -> main -> a40f1c2
```

Committing advances `main`, and HEAD comes along for free because it's just pointing at `main`'s name, not a commit directly.

## Checking out something that isn't a branch

```text
$ git checkout a40f1c2
Note: switching to 'a40f1c2'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state by switching back to a branch.

HEAD is now at a40f1c2
```

There's no branch named `a40f1c2` for HEAD to follow, so it just points at that commit directly:

```text
HEAD -> a40f1c2        (main still points wherever it was)
```

`main` itself never moved. You're just standing at a specific point in history, looking around.

## Why this is useful, not a trap

Detached HEAD is exactly what you want for glancing at an old tag, checking what a specific commit's state looked like, or trying something experimental without needing to create a throwaway branch first. The one thing to remember: if you commit while detached and then switch to a branch without saving that work (a new branch, via `git checkout -b`), those commits become unreachable from anywhere.

## Getting back

```text
$ git checkout main
```

Checking out any branch name re-attaches HEAD to it — there's nothing special to undo, you just moved HEAD again, the same way you always do.

## Common mistakes

- Panicking at the "detached HEAD" message as if something broke. Nothing did — you just checked out a commit instead of a branch.
- Committing real work while detached and then switching branches without first creating a branch to hold onto it.
- Forgetting that `main` (or whatever branch you were on) is completely unaffected by anything you do while detached, unless you explicitly move it.
