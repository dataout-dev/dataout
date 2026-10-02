In practice, you almost never create a branch and leave it unused — you create one specifically to start working on it immediately. Git has a shortcut for exactly that.

You will learn:

- `git checkout -b <name>` to create and switch in one command
- `git switch -c <name>`, the modern equivalent
- the normal day-to-day shape of starting new work

## One command, two effects

```text
$ git checkout -b fix-typo
Switched to a new branch 'fix-typo'
```

This is exactly equivalent to running `git branch fix-typo` immediately followed by `git checkout fix-typo` — Git just bundles the two into one step, because doing them separately would be pointless busywork almost every time.

## The normal workflow

```text
$ git checkout -b fix-typo
$ echo "Welcome to the project" > README.md
$ git add README.md
$ git commit -m "Fix typo in README"
```

Everything from here happens on `fix-typo`. `main` is completely unaffected until you later merge `fix-typo` back into it (a later lesson). This is the standard loop for any new piece of work: branch off, commit your changes there, merge back when ready.

## Starting from somewhere other than HEAD

You can also give `-b` a specific starting point: `git checkout -b hotfix v1.2.0` creates `hotfix` starting from the `v1.2.0` tag instead of your current commit — useful for patching an old release without pulling in newer, unrelated changes.

## Common mistakes

- Committing directly on `main` out of habit, then realizing afterward you meant to branch first. (There's a fix for this — `git branch` plus a bit of history surgery — but starting on a branch avoids the problem entirely.)
- Picking a starting point without thinking about it. `-b` defaults to branching from your *current* commit, which is usually, but not always, what you want.
- Forgetting the new branch doesn't exist anywhere else (like a remote) until you explicitly push it — more on that in a later tier.
