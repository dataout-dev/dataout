The concept lesson covered what reflog tracks. This is the moment it actually saves you.

You will learn:

- causing (and recovering from) the classic accidental `reset --hard`
- confirming you recovered the real commit, not a recreation

## The mistake

```text
$ git commit -m "commit 2: important fix"
$ git reset --hard HEAD~1
```

That second command just threw away "commit 2" — or so it looks:

```text
$ git log --oneline
3c8e012 commit 1: setup
```

## Finding it

```text
$ git reflog
3c8e012 HEAD@{0}: reset: moving to HEAD~1
9f2a001 HEAD@{1}: commit: commit 2: important fix
3c8e012 HEAD@{2}: commit: commit 1: setup
```

`HEAD@{1}` is exactly where you were right before the reset — the important fix commit, still fully intact as a real object.

## Recovering it

```text
$ git reset --hard HEAD@{1}
$ git log --oneline
9f2a001 commit 2: important fix
3c8e012 commit 1: setup
```

Back exactly where you were before the mistake.

## Why this beats just redoing the work

If the lost commit touched several files, or represented real thought you don't want to redo from memory, reflog recovery gets you back the *exact same commit object* — not a lookalike you recreate by hand. Retyping the change and making a brand-new commit would end up with the same file content, but a genuinely different commit (different oid, different history) — reflog recovery is the only way to get the original one back.

## Common mistakes

- Panicking and trying to manually redo lost work before checking `git reflog` first — usually unnecessary.
- Misreading the reflog's indices — `HEAD@{1}` is "one move ago," not "the first commit" or any other count you might assume.
- Not reading the reflog message column, which names what each entry actually was (a commit, a reset, etc.) — useful context beyond just the oid.
