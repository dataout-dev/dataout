Three commands, three different directions. Mixing them up is the single most common way beginners confuse themselves with remotes.

You will learn:

- what each of fetch, pull, and push actually moves, and in which direction
- why `pull` is really just two other commands glued together
- why `push` sometimes refuses to run

## The three directions

```text
origin  <---- fetch ----  you      (download only, nothing merges)
origin  <---- pull  ----  you      (download, then merge into your branch)
origin  ----  push  ---->  you      (upload your branch's commits)
```

**`git fetch`** downloads anything new from the remote into your remote-tracking branches (`origin/main`, etc.) and stops there. Your own branches and working files are completely untouched. It's purely informational — a safe way to see what's changed before deciding what to do about it.

**`git pull`** is `git fetch` immediately followed by merging the result into whatever branch you currently have checked out. It's the one command of the three that can actually change your own branch and working files.

**`git push`** goes the other way: it uploads your current branch's commits to update the matching branch on the remote.

## Why push can be refused

Push is the only one of the three that can fail for a reason beyond "no network." If the remote has a commit you don't have locally — because a teammate pushed first — git refuses the push outright, rather than silently overwriting history the remote already has.

```text
$ git push
! [rejected]        main -> main (fetch first)
error: failed to push some refs
```

The fix is always the same shape: bring the remote's new commit in first (`fetch` + merge, or just `pull`), then push again. A later lesson in this section walks through exactly this.

## Common mistakes

- Running `fetch` and expecting your own branch to have changed. It never does — that's `pull`'s job.
- Running `pull` when you only wanted to look at what's new, and getting a merge you weren't ready for. If you just want to inspect, `fetch` is the safer first move.
- Treating a rejected push as a sign something is broken. It's git protecting the remote's history — integrate first, then push again.
