A rebase replays your commits one at a time. When one of them conflicts, it pauses — and expects a specific way of telling it to keep going.

You will learn:

- what a mid-rebase conflict looks like
- why `rebase --continue` is different from a plain commit

## The pause

```text
$ git rebase main
Auto-merging shared.txt
CONFLICT (content): Merge conflict in shared.txt
error: could not apply 9f2a001... feature edit
```

Just like a merge conflict, the file gets real `<<<<<<<` / `=======` / `>>>>>>>` markers written into it, and the rebase stops right there, mid-sequence, waiting for you.

## Resolving it

```text
$ git status
You are currently rebasing.
  (fix conflicts and run "git rebase --continue")
  (use "git rebase --abort" to check out the original branch)
```

Edit the file to the content you want, remove the markers, then:

```text
$ git add shared.txt
$ git rebase --continue
```

## Why --continue, not a plain commit

This is the one real difference from resolving a merge conflict. `git rebase --continue` does two things: it finishes the current step as a commit (reusing the original commit's message, unless you explicitly reword it), *and* it resumes replaying anything still left in the rebase sequence. A plain `git commit` would only do the first part — it would resolve this one step's content, but the rebase would be left in a confused, still-technically-open state, since nothing told it to move on to whatever's next.

For a rebase replaying just one commit (like this one), there's nothing left to replay afterward either way — but the habit matters, because longer rebases absolutely do have more steps waiting.

## Backing out entirely

```text
$ git rebase --abort
```

If you change your mind mid-conflict, this restores the branch to exactly where it was before you ran rebase at all — same as `merge --abort` does for a merge.

## Common mistakes

- Running a plain `git commit` instead of `git rebase --continue` after resolving — it looks like it worked (the content is right), but the rebase state doesn't get properly closed out.
- Forgetting to `git add` the resolved file before continuing — `--continue` commits whatever is currently staged, same as any commit.
- Not realizing `--abort` is available if a conflict turns out to be more than you want to deal with right now.
