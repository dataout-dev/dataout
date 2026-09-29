Branches move — the whole point of a branch is that its tip keeps advancing as you commit. Sometimes you want a pointer that *doesn't* move: a permanent marker on one exact commit, usually to mark a release. That's a tag.

You will learn:

- creating a tag
- tagging a commit other than HEAD
- lightweight vs annotated tags
- why tags matter for releases

## Tagging the current commit

```text
$ git tag v1.0.0
```

This creates a tag named `v1.0.0` pointing at HEAD — whatever commit you're currently on. Unlike a branch, a tag never moves on its own; it stays attached to that exact commit forever (unless you explicitly delete or force-move it).

## Tagging a specific commit

```text
$ git log --oneline
9f8e7d6 Fix release bug
1a2b3c4 Prepare release

$ git tag v1.0.0 1a2b3c4
```

You don't have to tag HEAD — pass a commit reference as the second argument to tag any commit in history, useful when you realize after the fact which commit was actually the real release point.

## Lightweight vs annotated tags

```text
$ git tag v1.0.0                                  # lightweight: just a name -> commit pointer
$ git tag -a v1.0.0 -m "First stable release"     # annotated: has its own message, author, date
```

A lightweight tag is just a named pointer, nothing more. An annotated tag is a full object in its own right, with a message, tagger name and date — the recommended choice for anything you'd call a real release, since it carries its own record of *why* this commit was tagged.

## Why this matters

```text
$ git checkout v1.0.0   # inspect exactly what shipped in that release, any time
```

Tags give you a stable, permanent name for "what we actually shipped," independent of whatever branches do afterward. Long after `main` has moved on through hundreds of new commits, `v1.0.0` still points at exactly the commit that went out the door.

## Common mistakes

- Tagging the wrong commit because you assumed HEAD was where you thought it was — check `git log` first.
- Using only lightweight tags for real releases, losing the "who tagged this and why" context that annotated tags capture.
- Forgetting that, like branches, tags need to be explicitly pushed to a remote to be shared (covered in the Remotes & Collaboration tier) — creating one locally doesn't publish it anywhere by itself.
