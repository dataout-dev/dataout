Git's single most protective moment: refusing to let your push silently erase commits the remote already has.

You will learn:

- exactly why a push gets rejected
- the standard fix, and why it's always the same shape

## Why it happens

If a teammate pushed to the remote after your last sync, and you try to push your own new commit, git stops you:

```text
$ git push
! [rejected]        main -> main (fetch first)
error: failed to push some refs
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
```

This isn't a bug or bad luck — it's git refusing to let a push overwrite history the remote already has, which pushing your (now-stale) branch directly on top of would otherwise do.

## The fix is always the same

```text
$ git pull
$ git push
```

Pull brings the remote's new commit in (merging it with yours — cleanly if you didn't touch the same lines, with a conflict to resolve if you did, exactly like the last few lessons covered). Once your branch is a proper descendant of the remote's current tip, the push that follows succeeds normally.

```text
reject:   main (you, behind)  ----X---->  origin/main (ahead)

after pull:  main (now includes origin's commit too)  ---->  origin/main

then push succeeds, since main is now ahead of what origin has
```

## Common mistakes

- Reaching for `git push --force` the moment a push is rejected. That genuinely does overwrite the remote's history — exactly what the rejection exists to prevent — and can throw away a teammate's work. Pull first; force-push only once you're certain you mean to override something.
- Pulling, then forgetting to push again afterward — the whole point was to get your commit onto the remote.
- Assuming a rejection means something is broken locally. It just means the remote moved; integrating it is a completely normal part of collaborating.
