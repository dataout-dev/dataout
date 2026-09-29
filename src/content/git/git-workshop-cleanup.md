Real repositories get messy. Someone commits something they shouldn't have, an edit sits around half-finished, a generated file sneaks into the working directory. This workshop is one repo with all of that at once — a chance to use everything from this tier together, in the order that actually makes sense.

You will learn:

- deciding what to fix first when several things are wrong at once
- combining reset, restore, .gitignore and commit in one cleanup
- why order matters (a hard reset can fix more than one problem at once)

## Reading the mess before touching anything

```text
$ git log --oneline
9f8e7d6 oops committed debug code
1a2b3c4 Initial commit

$ git status
On branch main
Changes not staged for commit:
	modified:   README.md
Untracked files:
	app.js
	temp.log
```

Before running anything, take stock: one bad commit sitting on top of history, one file with an unwanted manual edit, and two untracked files — one that should be committed, one that shouldn't exist in history at all.

## A sensible order

```text
$ git reset --hard HEAD~1     # throw away the bad commit entirely
$ git status                   # check what's left
```

Fixing the commit first, with a hard reset, is deliberate: it also resets any *tracked* file (like README.md) back to match that earlier commit, in one step — no separate `git restore` needed afterward. It does **not** touch untracked files, so `app.js` and `temp.log` are still sitting there afterward, exactly as before.

```text
$ echo "*.log" > .gitignore
$ git add .
$ git commit -m "Add app.js, ignore log files"
```

With the bad commit and the bad edit both gone, what's left is genuinely new work: ignore the log file, stage everything real, and commit it properly.

## Why order matters here

Doing the `.gitignore` step *before* the reset would have worked too, but doing the reset first means you're never staging or half-committing on top of a commit you're about to throw away anyway — fewer steps to reason about, and no risk of the bad commit's content leaking into your cleanup by accident.

## Common mistakes

- Cleaning up on top of the bad commit instead of removing it first, leaving its unwanted content in history even after everything else looks tidy.
- Using `git reset --soft` or the default (`--mixed`) here, expecting the working tree to get cleaned up too — only `--hard` touches tracked files in the working directory.
- Forgetting that `.gitignore` only prevents *future* additions of a pattern — it does nothing to a file that's already committed.
