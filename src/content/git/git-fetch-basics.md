The safest remote command in git: it can never change your own branch or lose any of your work.

You will learn:

- exactly what `git fetch` downloads and where it puts it
- why your own branch is guaranteed to be untouched
- how to look at what a fetch brought in

## What fetch moves

```text
$ git fetch
From https://github.com/your-team/project.git
 * branch            main       -> FETCH_HEAD
```

`git fetch` downloads every commit the remote has that you don't, and updates your remote-tracking branches (`origin/main`, and so on) to match. That's the entire effect. Your own `main` branch — its tip, its working files — doesn't move even one commit.

```text
before fetch:        main (you) ---- origin/main (stale)
                                           |
                                    origin's real main has moved on

after fetch:          main (you)          origin/main (now caught up)
```

## Why this matters

Because fetch can't touch your current work, it's always safe to run — even in the middle of something else. Many people run it constantly just to stay aware of what's changed, without committing to merging anything yet.

## Looking at what you fetched

```text
$ git log origin/main --oneline
9f2a001 Add login feature
a40f1c2 Initial commit
```

You can inspect a remote-tracking branch exactly like any other branch — `git log origin/main`, `git diff main origin/main`, even check out a file from it — all without merging anything into your own branch. The next lesson practices exactly this kind of inspection.

## Common mistakes

- Expecting `fetch` to update your working files. It never touches them — only the tracking branches move.
- Confusing a stale `origin/main` with reality. If you haven't fetched recently, what you see when you inspect `origin/main` may already be out of date on the real remote.
- Running `pull` when you meant to just look around with `fetch` first, and ending up with an unwanted merge.
