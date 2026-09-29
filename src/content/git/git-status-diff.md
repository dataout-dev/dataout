Before you stage or commit anything, look at what actually changed. `git status` tells you *which* files changed; `git diff` tells you *what* changed inside them.

You will learn:

- reading `git status` (long and short form)
- reading `git diff` for unstaged changes
- reading `git diff --staged` for staged changes
- untracked vs modified vs staged

## git status

```text
$ git status
On branch main
Changes not staged for commit:
	modified:   a.txt

Untracked files:
	b.txt
```

Every file falls into one of a few states: unmodified (matches the last commit, not shown), modified-but-unstaged, staged, or untracked (Git has never seen this file before). `git status -s` shows the same information in a compact two-column code, e.g. ` M a.txt` (unstaged modification) or `?? b.txt` (untracked).

## git diff: unstaged changes

```text
$ git diff
diff --git a/a.txt b/a.txt
--- a/a.txt
+++ b/a.txt
@@ -1,2 +1,2 @@
 line one
-line two
+line two, edited
```

Lines starting with `-` were removed, `+` were added, and unmarked lines are context. Plain `git diff` (no arguments) compares your working directory against the staging area — which usually means "against the last commit," unless you've already staged some of the change.

## git diff --staged

```text
$ git add a.txt
$ git diff --staged
```

Once you stage a.txt, plain `git diff` goes quiet for that file (nothing *unstaged* left to show) — use `--staged` (or the older `--cached`) to see what's actually queued up for the next commit.

## Common mistakes

- Running `git commit` without checking `git status` first, and accidentally committing (or missing) a file.
- Confusing `git diff` and `git diff --staged` — they answer two different questions ("what haven't I staged yet" vs "what's about to be committed").
- Ignoring untracked files in `git status`, then being surprised later that they were never part of any commit.
