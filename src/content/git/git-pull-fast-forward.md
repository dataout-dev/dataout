The everyday case: you haven't touched your branch, the remote has moved on, and bringing it in is a single command.

You will learn:

- what `git pull` does under the hood
- why this particular case is just a fast-forward, with no merge commit

## Pull is two steps in one

```text
$ git pull
```

is exactly equivalent to:

```text
$ git fetch
$ git merge origin/main
```

When your own branch hasn't diverged — you haven't made any commits of your own since you last synced — that merge step is a fast-forward: your branch's pointer simply slides forward to match `origin/main`. No new commit is created, because there's nothing to combine; it's a straight line.

```text
      a40f1c2 (main, before)
           \
            9f2a001 (origin/main)

                 |  git pull
                 v

      a40f1c2 ---- 9f2a001 (main, origin/main)
```

## What it looks like

```text
$ git pull
Updating a40f1c2..9f2a001
Fast-forward
 feature.js | 1 +
 1 file changed, 1 insertion(+)
```

Your working files update to match automatically — same as a fast-forward merge of any two local branches.

## Common mistakes

- Expecting a merge commit to appear in the log after every pull. A fast-forward specifically doesn't create one.
- Being surprised when a *later* pull (after you've made your own commits) behaves differently — that's the diverged case, covered next, and it genuinely does need a real merge.
- Forgetting you need to be on the branch you want updated — `git pull` always updates whatever's currently checked out.
