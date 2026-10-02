You don't have to stand on a branch to look at it. `git log` and `git diff` can both inspect any branch directly, which is often faster than switching back and forth just to compare.

You will learn:

- `git log <branch>` to see a branch's history without switching to it
- `git log main..feature` to see exactly what feature has that main doesn't
- `git diff <refA> <refB>` to see the actual content difference between two branches

## Looking at a branch without switching

```text
$ git log feature --oneline
9f2a001 feature step 2
c771d4e feature step 1
a40f1c2 base
```

This lists `feature`'s history exactly as if you'd switched to it — but you're still standing wherever you were. The same works for `git diff feature` style comparisons, and for reading files: `git show feature:path/to/file.js` shows that file's content on `feature`, no checkout required.

## The double-dot range

```text
$ git log main..feature --oneline
9f2a001 feature step 2
c771d4e feature step 1
```

`main..feature` means "commits reachable from `feature` but not from `main`" — precisely the commits `feature` has that haven't made it back to `main` yet. This is the single fastest way to answer "how far ahead is this branch?"

## Diffing two branches directly

`git diff main feature` (or `main...feature` for a slightly different comparison) shows the actual line-by-line content differences between the two branch tips, file by file — handy for a final review before merging.

## Common mistakes

- Switching branches just to run `git log`, when `git log <branch>` would answer the question without moving anywhere.
- Reading `main..feature` backwards. The order matters: it's "what's in the second ref that isn't in the first."
- Assuming comparing branches requires them to have a common ancestor relationship you need to reason about manually — Git works this out for you from the commit graph.
