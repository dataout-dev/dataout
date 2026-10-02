Every git command you've used so far worked on one single timeline. Branches are how Git lets more than one timeline exist at once, side by side, without them interfering with each other.

You will learn:

- what a branch actually is under the hood
- how a branch pointer moves as you commit
- why branching costs nothing, even in huge repositories

## A branch is a pointer, not a copy

```text
.git/refs/heads/main     -> a40f1c2...
.git/refs/heads/feature  -> a40f1c2...
```

That's genuinely it. A branch is a tiny file containing one commit hash. Creating a new branch just writes a new tiny file pointing at whatever commit you're currently on — nothing about your tracked files is duplicated, touched, or even read.

## How the pointer moves

```text
$ git log --oneline
a40f1c2 (HEAD -> main) Initial commit
$ git commit -m "Add feature"
$ git log --oneline
9b2e701 (HEAD -> main) Add feature
a40f1c2 Initial commit
```

Before the commit, `main` pointed at `a40f1c2`. After it, `main` points at `9b2e701`, and `9b2e701` records `a40f1c2` as its parent. The branch always "follows" the latest commit made while it's checked out.

## HEAD: one more pointer

`HEAD` is a pointer too — almost always pointing at the name of your current branch, which in turn points at a commit. Switching branches (the next lesson) just moves HEAD to point at a different branch name. Nothing about your commit history changes; only *which* tip you're currently looking at does.

## Common mistakes

- Thinking a branch "contains" its own private copy of every file. It doesn't — all branches share the exact same object database; only the *pointer* differs.
- Assuming branching is expensive or slow for large projects. It's one small file write, regardless of repository size.
- Confusing a branch with a commit. A commit is a permanent, unchanging snapshot. A branch is a label that can move to point at a *different* commit over time.
