You don't have to merge the moment you fetch. Looking first — and deciding deliberately — is often the better habit.

You will learn:

- how to compare your branch against a remote-tracking branch
- why this is useful before committing to a merge or pull

## Comparing without merging

Once you've fetched, `origin/main` and your own `main` are just two ordinary branches you can compare, the same way you'd compare any two local branches.

```text
$ git log main --oneline
a40f1c2 Initial commit

$ git log origin/main --oneline
8c1d4e0 Add logout feature
3b9f221 Add login feature
a40f1c2 Initial commit
```

Here it's immediately clear: `origin/main` has two commits your `main` doesn't yet. `git log main..origin/main` (the double-dot range syntax) gives you exactly that list directly, without needing to eyeball two separate logs:

```text
$ git log main..origin/main --oneline
8c1d4e0 Add logout feature
3b9f221 Add login feature
```

## Why bother looking first

For a small personal project, you might not care — just pull and move on. On a shared project, looking first lets you catch things worth knowing about before they're tangled into a merge: a breaking change, a file you were also about to edit, a commit message that tells you to coordinate with someone before continuing.

`git diff main origin/main` goes a step further, showing the actual content differences, not just the commit list.

## Common mistakes

- Assuming you need to merge immediately after every fetch. Looking first, and merging only when you're ready, is a completely normal and often better workflow.
- Forgetting the double-dot range only shows commits reachable from the second ref but not the first — `main..origin/main` and `origin/main..main` answer two different questions.
- Checking out `origin/main` directly to "look around" and accidentally starting to work there. Reading its log/diff doesn't require checking it out at all.
