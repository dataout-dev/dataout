Sharing a feature you've been working on in isolation — the moment a branch that only existed on your machine becomes visible to everyone else.

You will learn:

- how pushing a branch that doesn't exist on the remote yet is different
- why `-u` matters specifically for this case

## Pushing something origin has never seen

If you've been building a feature on your own local branch, the remote has no idea it exists yet. Pushing it is the same `git push` command, but needs to tell the remote both the branch name and that it should set up tracking:

```text
$ git push -u origin dark-mode
```

```text
To https://github.com/your-team/project.git
 * [new branch]      dark-mode -> dark-mode
branch 'dark-mode' set up to track 'origin/dark-mode'.
```

The `* [new branch]` line is how git signals this isn't updating an existing branch on the remote — it's creating one.

## Why -u here specifically

This is exactly the "branch you created yourself" case the previous lesson described: `dark-mode` has no upstream yet, because nothing has ever pushed it anywhere. `-u` does the push and sets `origin/dark-mode` as its tracking branch in the same step, so every push or pull after this first one can just be `git push` / `git pull`, no arguments needed.

## What your teammates see

Once pushed, anyone who fetches from the same remote will see `origin/dark-mode` appear as a new remote-tracking branch they can look at, check out, or build on — exactly the same way you first encountered any other branch on the remote.

## Common mistakes

- Pushing without `-u` the first time, which still works but leaves the branch without upstream tracking — every push after that needs the full `git push origin dark-mode` again until you set it.
- Forgetting the branch has to actually have commits on it before pushing does anything meaningful.
- Assuming the remote automatically "knows about" a local branch just because you created it. Nothing reaches the remote until you push.
