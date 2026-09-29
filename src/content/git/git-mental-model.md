Every git command you'll ever run moves something between three areas. Once this model clicks, commands stop feeling like magic incantations and start feeling like the only sensible way to do the thing they do.

You will learn:

- the three areas: working directory, staging area, repository
- what "modified", "staged" and "committed" actually mean
- why Git bothers with a separate staging area at all
- how a commit relates to the staging area afterwards

## The three areas

```text
working directory  --git add-->  staging area  --git commit-->  repository (history)
```

- **Working directory**: your actual project folder, exactly as you see it in a file explorer. Editing a file changes this area, and only this area — Git doesn't notice until you ask it to.
- **Staging area** (also called "the index"): a holding area for exactly the changes you want in your *next* commit. `git add` copies a file's current content here.
- **Repository**: the permanent, committed history, stored inside the hidden `.git` folder. `git commit` moves whatever is staged into a new, permanent snapshot here.

## Why bother with staging?

You could imagine a simpler tool that just commits the entire working directory every time. Git deliberately doesn't work that way. Say you've been fixing a bug *and* experimenting with an unrelated feature at the same time — the staging area lets you `git add` only the bug fix's files, commit that as one clean change, and leave the experiment uncommitted for later. Without staging, every commit would be an unsorted grab-bag of whatever you happened to be touching.

## Following one change through all three areas

```text
$ echo "v2" > notes.txt        # working directory now differs from history
$ git status                    # shows notes.txt as "modified"
$ git add notes.txt             # staging area now has the v2 content
$ git status                    # shows notes.txt as "staged" / "to be committed"
$ git commit -m "Update notes"  # v2 is now permanent history
$ git status                    # nothing to commit — all three areas agree again
```

After the commit, working directory, staging area and the latest commit all match. That "nothing to commit, working tree clean" message is Git telling you exactly that.

## Common mistakes

- Forgetting that editing a file again *after* `git add`-ing it means the staging area now has the old content — you need to `git add` it again to stage the new edit.
- Assuming `git commit` on its own commits everything you've changed. It only commits what's staged.
- Confusing "staged" with "committed" — staged changes are still local and can be un-staged with no history left behind; committed changes are permanent (though still undoable, which the rest of this tier covers).
