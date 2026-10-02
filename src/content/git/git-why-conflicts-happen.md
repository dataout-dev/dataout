A three-way merge works automatically as long as the two sides touched different things. A conflict is what happens when they didn't.

You will learn:

- exactly what triggers a merge conflict
- how Git represents a conflict inside a file
- that a conflict is routine, not a mistake

## What triggers a conflict

If both branches changed the *same lines* of the *same file* in *different* ways since their common ancestor, Git has no reasonable way to pick a winner on its own. Changing different files, or even different lines of the same file, merges automatically — a conflict specifically needs genuine overlap.

## What a conflict looks like

```text
$ git merge feature
Auto-merging config.txt
CONFLICT (content): Merge conflict in config.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Opening `config.txt` reveals markers written directly into the file:

```text
<<<<<<< HEAD
timeout=45
=======
timeout=60
>>>>>>> feature
```

Everything between `<<<<<<< HEAD` and `=======` is your current branch's version. Everything between `=======` and `>>>>>>> feature` is the incoming branch's version. Git pauses the merge right here and waits for a human decision.

## Resolving it

You edit the file by hand — keep one side, keep the other, or write something that combines both — and delete the markers entirely. Then `git add` the file to mark it resolved, and `git commit` to finish the merge, which the next lesson walks through directly.

## Common mistakes

- Committing a file that still has `<<<<<<<` / `=======` / `>>>>>>>` markers left in it by accident — always double-check the resolved content before adding it.
- Treating a conflict as something to panic about. It means two legitimate changes overlapped; nothing is broken or lost.
- Forgetting *which* conflict-marker section is "yours" versus "theirs" — the label right after `<<<<<<<` and `>>>>>>>` always tells you.
