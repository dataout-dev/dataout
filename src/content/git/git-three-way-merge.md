Once both branches have moved independently, there's no straight line left for Git to fast-forward along. This is where a merge becomes a real, new commit.

You will learn:

- why Git can't fast-forward once both sides have diverged
- how a three-way merge automatically combines non-overlapping changes
- what a merge commit's two parents actually mean

## Divergent history

```text
      a40f1c2 (base)
       /      \
  logger.js  search.js
   (main)    (feature)
```

Both `main` and `feature` added commits of their own after branching from the same base. Neither is a simple continuation of the other, so `git merge feature` (while on `main`) can't just slide a pointer forward.

## The three-way merge

Git looks at three points: the common ancestor (`base`), `main`'s tip, and `feature`'s tip. Since `main` only added `logger.js` and `feature` only added `search.js` — genuinely different, non-overlapping changes — Git can combine both automatically into one new commit:

```text
$ git merge feature
Merge made by the 'ort' strategy.
 search.js | 1 +
 1 file changed, 1 insertion(+)
```

## Two parents

```text
$ git log --oneline
f3a9c21 Merge branch 'feature'
9f2a001 add search
c88e123 add logging
a40f1c2 base
```

The merge commit is special: it records *two* parent commits instead of one — `main`'s tip and `feature`'s tip — which is exactly what makes it a merge rather than an ordinary commit. `git log` on its own only shows one line of that history at a time, but the merge commit itself remembers both.

## Common mistakes

- Expecting a merge commit whenever you run `git merge`. You only get one when a fast-forward genuinely isn't possible.
- Thinking a merge commit "belongs" to one branch more than the other. It has two equal parents; afterward, it's simply the new tip of whichever branch you ran `merge` from.
- Merging in the wrong direction — `git merge feature` while on `main` brings feature's work into main, not the reverse.
