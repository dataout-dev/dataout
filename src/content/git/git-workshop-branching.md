Everything from this tier, in one realistic sequence: a feature that's ready to ship, a conflict standing in the way, and a branch to clean up once it's done.

You will learn:

- resolving a real conflict under slightly more realistic pressure
- completing a merge correctly, not just technically
- finishing the job by cleaning up afterward

## The situation

Two branches each changed the same status line in `shared.txt` for different reasons — `main` because something was blocking release, `feature` because the work is actually ready. A merge was already attempted and is currently paused on a conflict.

```text
<<<<<<< HEAD
status: blocked
=======
status: shipped
>>>>>>> feature
```

## Resolving with intent

This isn't a mechanical find-and-replace — it's a real decision. Here, feature's version should win: the whole point of this merge is to ship.

```text
$ git add shared.txt      # after editing the file to just: status: shipped
$ git commit
```

That single commit, with its two parents, is the permanent record that this decision was made and when.

## Cleaning up

```text
$ git branch -d feature
```

Once feature's work is safely part of `main`'s history, keeping the branch pointer around serves no purpose — and because it's fully merged, Git confirms that before deleting it.

## Common mistakes

- Resolving a conflict mechanically (picking whichever side is "easier") instead of actually deciding what the correct final content should be.
- Finishing the merge but forgetting the cleanup step — a repository full of long-dead branches makes it harder to see which work is actually still active.
- Deleting the branch *before* confirming the merge commit actually completed — always verify the merge first.
