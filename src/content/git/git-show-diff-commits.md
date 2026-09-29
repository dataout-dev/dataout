History is only useful if you can actually look inside it. `git show` inspects one specific commit in detail; `git diff` (with two refs) compares any two points in history directly.

You will learn:

- `git show <commit>` for one commit's full details and diff
- `git diff <ref1> <ref2>` for comparing two arbitrary points
- finding old content without switching your current branch around
- short vs full commit hashes

## git show

```text
$ git show 1a2b3c4
commit 1a2b3c4...
Author: DataOut Learner <learner@dataout.dev>
Date:   Tue Nov 14 2023

    Initial version

diff --git a/app.js b/app.js
--- /dev/null
+++ b/app.js
@@ -0,0 +1,1 @@
+console.log("v1")
```

`git show <commit>` prints that commit's metadata (author, date, message) followed by the diff it introduced relative to its parent. Leave off the argument and it shows HEAD — the current commit — by default.

## Comparing two arbitrary commits

```text
$ git diff 1a2b3c4 9f8e7d6
diff --git a/app.js b/app.js
--- a/app.js
+++ b/app.js
@@ -1 +1 @@
-console.log("v1")
+console.log("v2")
```

`git diff` isn't limited to "working directory vs staging area" — give it two commit references and it compares those two snapshots directly, regardless of how many commits sit between them or what your current branch is doing.

## Finding old content

```text
$ git log --oneline
9f8e7d6 Update greeting
1a2b3c4 Initial version

$ git show 1a2b3c4:app.js
console.log("v1")
```

`git log -p` (pair it with `--oneline` for a compact list, drop it for full detail) walks every commit's diff in order — often the fastest way to find *when* a particular line was introduced or changed, without switching branches or touching your working directory at all.

## Common mistakes

- Assuming you need to check out an old commit to see what a file looked like back then — `git show <ref>:<path>` (or reading the diff from `git show <ref>`) does it without moving anything.
- Confusing commit order in `git diff a b` — it shows changes going *from* a *to* b, so reversing the arguments flips every `+`/`-`.
- Forgetting that a short hash (`1a2b3c4`) and its full form refer to the exact same commit — Git just shows an abbreviation that's unique enough to be unambiguous.
