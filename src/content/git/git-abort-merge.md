Sometimes, mid-conflict, the right call is to not merge at all right now. Git lets you back out completely, as if you'd never run `git merge`.

You will learn:

- `git merge --abort` and exactly what it restores
- when aborting is the right call instead of resolving
- that nothing about this is destructive to either branch's real history

## Backing out entirely

```text
$ git merge feature
CONFLICT (content): Merge conflict in data.txt
Automatic merge failed; fix conflicts and then commit the result.

$ git merge --abort
```

After this, your working directory, staging area, and `HEAD` are all back to exactly how they were the instant before you ran `git merge` — conflict markers gone, no partial resolution left lying around, nothing staged.

## What it does *not* touch

Aborting a merge never changes either branch's actual commit history. `main` still has every commit it had before; `feature` is completely untouched. All that gets thrown away is the *in-progress, uncommitted* merge attempt itself — nothing permanent ever happened in the first place, since the merge was never completed with a commit.

## When to reach for this

- You realize partway through resolving that you need more context (ask a teammate, check requirements) before deciding how to resolve it.
- You merged the wrong branch entirely.
- The conflict turns out to be bigger than expected and you'd rather tackle it as its own focused piece of work.

## Common mistakes

- Trying to manually undo a conflicted merge by editing files back by hand instead of using `--abort` — easy to get wrong, and `--abort` does it correctly in one step.
- Running `--abort` when there's no merge in progress — Git will tell you there's nothing to abort.
- Assuming abort deletes the `feature` branch or its commits. It only cancels the *attempt* to merge it in.
