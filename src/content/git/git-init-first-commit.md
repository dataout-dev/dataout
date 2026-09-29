Two commands turn any folder into a tracked project and record its first snapshot. Everything else in this path builds on this pair.

You will learn:

- `git init`
- staging and committing your first file
- what actually happens on disk

## git init

```text
$ git init
Initialized empty Git repository in .../.git/
```

`git init` creates a hidden `.git` folder in the current directory. That folder *is* the repository — it holds the entire object database, the staging area, and every ref (branch and tag) you'll ever create. Delete `.git` and the folder goes back to being an untracked pile of files; nothing else about your files changes.

## Your first commit

```text
$ git add notes.txt
$ git commit -m "Add shopping list"
[main a1b2c3d] Add shopping list
```

`git add notes.txt` stages the file's current content. `git commit -m "..."` takes whatever is staged and writes it into history as a new commit — the first one, with no parent. From here on, `git log` will show it.

## What's actually happening

Git doesn't store "diffs" the way some tools do. Every commit points to a full snapshot of the project's file tree at that moment (internally, deduplicated so unchanged files aren't stored twice). The first commit's tree has one file: `notes.txt`. Each later commit's tree points back to the one before it, forming the chain that `git log` walks.

## Common mistakes

- Running `git commit` before `git add` — with nothing staged, Git will refuse with "nothing to commit" (or, if the file is brand new and never staged, it won't even be mentioned).
- Forgetting the `-m "message"` — without it, Git tries to open a text editor for the message, which looks like the command hung.
- Re-running `git init` inside an already-initialized repo. It's harmless (Git just notices `.git` already exists) but it's not needed and won't reset anything.
