`git add` is how you build exactly the commit you want, even when your working directory has several unrelated changes sitting in it at once.

You will learn:

- staging individual files
- staging everything with `git add .`
- staging part of a file's changes (patch mode)
- why staging selectively matters

## Staging one file at a time

```text
$ git add feature.js
```

This stages `feature.js` exactly as it currently exists on disk. If you edit `feature.js` again afterwards, the staging area still has the *older* version until you `git add` it again — staging is a snapshot, not a live link.

## Staging everything

```text
$ git add .
$ git add -A
```

Both stage every changed and new file in (and below) the current directory. Convenient when you genuinely want everything you've touched in one commit — risky when you don't, since it's easy to accidentally sweep up an unrelated experiment or a file that should have gone in `.gitignore`.

## Staging part of a file: patch mode

```text
$ git add -p file.py
```

Real Git can stage individual *hunks* (contiguous blocks of changed lines) within a single file, one at a time, answering `y`/`n`/`s` (split) for each. This is how you separate "the bug fix" from "the unrelated cleanup" even when both happened in the same file during the same editing session. This sandbox grades at the whole-file level, but the underlying idea — stage precisely what belongs in this commit, nothing more — is the same skill.

## Common mistakes

- Reaching for `git add .` out of habit and committing something that wasn't ready (a debug print, an unrelated experiment).
- Assuming staging a file "locks in" that version forever — editing it again means it's out of sync with the staging area until re-added.
- Never learning patch mode, and as a result mixing unrelated changes into the same commit by default.
