Everything up to now has been about pulling other people's work in. Push is how your own work reaches them.

You will learn:

- what `git push` uploads, and to where
- what a clean push looks like when nothing has changed on the remote

## Sending your commits outward

```text
$ git push
To https://github.com/your-team/project.git
   a40f1c2..5c2a9f1  main -> main
```

`git push` uploads whatever commits your current branch has that the remote doesn't, and moves the matching branch on the remote to point at your new tip. If origin hasn't changed since you last synced, this is a clean fast-forward on the remote's side too — nothing to combine, it just catches up.

Your local `origin/main` tracking branch also updates afterward, so it still accurately reflects where the remote now is.

## Before you can push

You need a commit to push in the first place, and the remote needs to already know about everything your branch is built on top of. If you've never connected a remote at all, you'd need `git remote add` first (or you'd already have one from `git clone`).

```text
$ git log --oneline
5c2a9f1 Add changelog entry
a40f1c2 Initial commit

$ git push
```

## Common mistakes

- Forgetting to commit before pushing — push only sends committed history, never uncommitted working-directory changes.
- Expecting push to work if origin has moved on since you last synced. That's the rejected case, covered next — push isn't always this simple.
- Assuming push also updates your *local* view of other branches on the remote. It only affects the one branch you're pushing.
