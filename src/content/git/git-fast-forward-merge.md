The simplest possible merge isn't really a "merge" at all — it's Git noticing it doesn't need to do any real work.

You will learn:

- what `git merge` does when the target branch hasn't moved
- why this is called a "fast-forward"
- how to force a real merge commit anyway with `--no-ff`

## When a fast-forward happens

```text
      a40f1c2 (main)
           \
            9f2a001 (feature)
```

If `main` hasn't gained any commits of its own since `feature` branched off, then `feature` is simply "main, plus some more commits" — a straight line. Merging `feature` into `main` in this situation doesn't require combining anything; Git just moves `main`'s pointer forward to match `feature`'s.

```text
$ git checkout main
$ git merge feature
Updating a40f1c2..9f2a001
Fast-forward
```

After this, `main` and `feature` point at the exact same commit. No new commit was created — history just got a little longer in a straight line.

## Forcing a merge commit anyway

```text
$ git merge --no-ff feature
```

Sometimes you *want* a visible record that "feature was merged here," even when a fast-forward was possible — some teams prefer this so the commit graph always shows exactly where each piece of work landed. `--no-ff` creates a real merge commit regardless.

## Common mistakes

- Assuming every merge creates a new commit. A fast-forward specifically does not, unless you ask for one.
- Being surprised that `git log` shows no distinct "merge commit" after a fast-forward — there isn't one to show.
- Forgetting you need to be *on* the receiving branch (`main`, here) before running `git merge <other-branch>` — merge always combines "the other branch" into whatever you currently have checked out.
