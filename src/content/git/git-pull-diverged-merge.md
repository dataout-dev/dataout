You committed something locally. Someone else committed something to the remote. Neither of you knew about the other's work — pull is how it comes back together.

You will learn:

- why a fast-forward isn't possible once both sides have moved
- what pull does instead

## Two independent paths

```text
                    5c2a9f1 (main, your commit)
                   /
      a40f1c2 ----
                   \
                    8c1d4e0 (origin/main, their commit)
```

Once both your branch and `origin/main` have commits the other doesn't have, there's no straight line to slide a pointer along — git has to actually combine the two histories into something new.

## What pull does here

```text
$ git pull
Merge made by the 'ort' strategy.
 theirs.js | 1 +
 mine.js   | 1 +
 2 files changed, 2 insertions(+)
```

Exactly like merging two local branches, `git pull` creates a new commit with **two parents** — one from your previous `main`, one from `origin/main` — combining both sets of changes. As long as the two sides didn't touch the same lines of the same file, this happens automatically, with no input needed from you.

```text
                    5c2a9f1
                   /         \
      a40f1c2 ----             ---- 2e8b031 (new merge commit)
                   \         /
                    8c1d4e0
```

## Common mistakes

- Expecting this to always be a fast-forward, and being confused when a merge commit shows up instead. Once both sides have diverged, a real merge commit is exactly correct, not a sign of a problem.
- Forgetting that this merge is subject to the exact same conflict rules as any other merge — if both sides touched the same lines, you'll get a conflict instead (the next lesson covers resolving one).
- Thinking you need to `fetch` first and merge manually. `git pull` already does both steps together.
