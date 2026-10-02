A paused merge isn't broken — it's waiting on exactly one decision from you. Make it, and the merge finishes like any other.

You will learn:

- how to read and resolve conflict markers
- that `git add` means "this conflict is settled," not just "stage this change"
- how to complete a paused merge with a normal commit

## The conflict, mid-merge

```text
$ git status
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both modified:   config.txt
```

Git tells you plainly what's unresolved and what your two options are: fix it and commit, or abort entirely (the next lesson).

## Resolving by hand

Open the conflicted file and decide what the final content should be:

```text
<<<<<<< HEAD
timeout=45
=======
timeout=60
>>>>>>> feature
```

becomes, say:

```text
timeout=60
```

Every marker line is gone, and only the content you actually want remains.

## Finishing the merge

```text
$ git add config.txt
$ git commit
```

This is the one place a plain `git commit`, with no `-m` needed if Git already filled in a default merge message, behaves specially: it completes the paused merge, automatically recording *both* branches as parents of the new commit — exactly like a normal three-way merge commit, just with your manual resolution baked in.

## Common mistakes

- Running `git commit` before resolving every conflicted file — Git will refuse if any file still has unresolved conflict markers and hasn't been `git add`-ed.
- Forgetting to `git add` the resolved file before committing, even after fixing its content.
- Writing the resolution but leaving stray marker lines behind by mistake.
