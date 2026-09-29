You edited a file, haven't committed yet, and now wish you hadn't touched it at all. Getting back the last committed version is one command.

You will learn:

- `git restore` for unstaged changes
- `git restore --staged` for un-staging (without losing the edit)
- the older, equivalent `git checkout --` syntax
- why this only works before you commit

## Throwing away an uncommitted edit

```text
$ git restore a.txt
```

This overwrites `a.txt` in your working directory with the version from the last commit, discarding whatever you'd changed. There's no undo for this specific action — the previous uncommitted content is gone (though the last *committed* version is, of course, always safe in history).

## Un-staging without losing the edit

```text
$ git add a.txt      # staged by mistake
$ git restore --staged a.txt
```

This is a different, gentler operation: it moves a.txt back out of the staging area, but keeps your edit in the working directory. Useful when you staged something too early, not when you want to discard the change entirely.

## The older syntax

```text
$ git checkout -- a.txt
```

Before `git restore` existed (Git 2.23+), this was — and still is — the way to discard an uncommitted change to a specific file. `git restore` was introduced specifically because `git checkout` had become overloaded (it also switches branches, which is a completely different operation covered in the next tier) — but both do the same thing here.

## Common mistakes

- Reaching for `git reset` when you just want to discard an *uncommitted* change to one file — `reset` operates on commits, `restore`/`checkout --` operates on the working directory.
- Running `git restore` and being surprised the edit is gone for good — there's no staging area or history entry to recover an uncommitted change from.
- Confusing `git restore file` (discard the edit) with `git restore --staged file` (just un-stage it, edit stays).
