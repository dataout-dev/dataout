Creating a branch is only half the story. To actually work on one, you need to move HEAD there — and watch your entire working directory update to match.

You will learn:

- `git checkout <branch>` to switch to an existing branch
- `git switch <branch>`, the newer, more focused equivalent
- what actually happens to your files when you switch

## Switching branches

```text
$ git checkout draft
Switched to branch 'draft'
```

This does two things at once: it moves `HEAD` to point at `draft` instead of whatever branch you were on, and it rewrites every file in your working directory to match `draft`'s last commit exactly. If `draft` has a file `main` doesn't, it appears. If it's missing a file `main` has, that file disappears from your working directory (safely — it's still in `main`'s history).

## checkout vs switch

`git checkout` is the older, famously overloaded command — it also restores files (`git checkout -- <path>`, from an earlier lesson) and does several other things depending on its arguments. `git switch` was added later specifically to mean "change branches," and nothing else. Both work identically for this purpose; `switch` is just less ambiguous to read.

## Nothing is lost

Switching branches never deletes your commits. Whatever you committed on the branch you're leaving is still there, fully intact, waiting for you the moment you switch back to it. The only files affected are *uncommitted* ones — Git will refuse to switch if doing so would silently overwrite uncommitted changes.

## Common mistakes

- Expecting your uncommitted edits to "come with you" when you switch branches. They don't automatically transfer — commit, stash, or discard them first.
- Confusing "switched to a branch" with "created a branch." Switching to a name that doesn't exist yet is an error, not a shortcut for creating one (that's `-b`/`-c`, next lesson).
- Forgetting to check `git status` before switching, especially with uncommitted work in progress.
