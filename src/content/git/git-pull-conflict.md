A pull is a merge wearing a different hat. When it conflicts, it conflicts exactly the way any merge does.

You will learn:

- why a pull can conflict the same way a merge can
- that resolving it works identically to resolving any other conflict

## Same mechanism, different trigger

`git pull` runs `git merge` internally once it's fetched. If you and the remote both changed the *same lines* of the *same file* in different ways since you last synced, git hits the exact same wall a plain `git merge` would:

```text
$ git pull
Auto-merging shared.txt
CONFLICT (content): Merge conflict in shared.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Opening the file shows the familiar markers:

```text
<<<<<<< HEAD
status: in review
=======
status: approved
>>>>>>> origin/main
```

Everything between `<<<<<<< HEAD` and `=======` is your version. Everything between `=======` and `>>>>>>> origin/main` is the remote's. Exactly as with a local merge conflict, git pauses here and waits.

## Resolving it

Nothing about this is special to pulling — edit the file to the content you actually want, delete the markers, then:

```text
$ git add shared.txt
$ git commit -m "Merge origin/main"
```

The plain `git commit` finishes the paused merge as a real two-parent commit, same as finishing any other conflicted merge.

## Common mistakes

- Panicking because the conflict came from a `pull` instead of a `merge`. Under the hood it's identical — resolve it the same way.
- Committing a file that still has `<<<<<<<` / `=======` / `>>>>>>>` markers left in by accident.
- Running `git pull` again while a conflict is still unresolved — finish this one (or `git merge --abort` it) before trying to sync again.
