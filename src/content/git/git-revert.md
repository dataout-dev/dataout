`git reset` rewrites history by moving the branch pointer backwards. That's fine on commits only you have ever seen. Once a commit has been shared — pushed, pulled by someone else, merged into a shared branch — rewriting it out of existence causes real problems for everyone else who already has it. `git revert` undoes a commit's changes without deleting it.

You will learn:

- what `git revert` actually does
- why it's safe on shared history
- how it differs from `git reset`
- reading a revert commit in the log

## What revert does

```text
$ git revert HEAD
[main 4a5b6c7] Revert "Break greeting"
```

Instead of moving the branch pointer backwards, `git revert` looks at what the target commit changed, computes the *opposite* of that change, and commits it as a brand new commit. History keeps growing forward — nothing is deleted or rewritten, including the bad commit itself, which is still right there in the log for context.

## Why this matters for shared history

```text
history with reset:   A---B---D          (C is gone; anyone who already
                                            pulled A-B-C-D is now out of sync)

history with revert:  A---B---C---D---E   (E undoes C; everyone's history
                                            stays consistent)
```

If commit C has already been pushed and pulled by teammates, resetting it away leaves your local branch and their local branch pointing at genuinely different histories — the next push/pull cycle turns into a mess. A revert commit, by contrast, is just a normal new commit that happens to undo an earlier one; everyone can pull it exactly like any other change.

## Reading a revert in the log

```text
$ git log --oneline
4a5b6c7 Revert "Break greeting"
9f8e7d6 Break greeting
1a2b3c4 Add greeting
```

The bad commit is still visible — which is often useful context for *why* the revert happened — but its effect on the actual files is undone by the commit on top of it.

## Common mistakes

- Reaching for `git reset --hard` on a commit that's already been pushed, because it "feels" more thorough — it isn't safer, it's riskier for anyone else sharing that history.
- Expecting `git revert` to remove the bad commit from the log — it doesn't; it adds a new commit that cancels its effect out.
- Reverting a commit that later commits also depend on, without checking first whether that causes a conflict (more on resolving those in the next tier).
