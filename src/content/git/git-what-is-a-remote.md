Everything you've done so far has lived entirely on your own machine. A remote is what lets that work reach anyone else.

You will learn:

- what a remote actually is (hint: it's not special)
- what `origin` means, and why it's just a convention
- what a remote-tracking branch like `origin/main` represents

## It's just another repository

A "remote" is another git repository — full stop. Usually it lives on a server you don't have direct file access to (GitHub, GitLab, a company's own server), but structurally it's the same kind of repo as the one on your machine: commits, branches, a history graph.

You never edit a remote's files directly. You interact with it only through git's own vocabulary: `clone`, `fetch`, `pull`, `push`. That boundary is deliberate — it's what makes collaboration predictable instead of chaotic.

```text
$ git remote -v
origin  https://github.com/your-team/project.git (fetch)
origin  https://github.com/your-team/project.git (push)
```

## Why "origin"

When you `git clone` a repository, git automatically names the remote you cloned from `origin`. That's it — a convention, not a rule. You could rename it, add a second remote called `upstream` for a fork's original source, or name your only remote anything you like. Git itself doesn't treat `origin` specially.

## Remote-tracking branches

After you clone (or fetch), your local repo gains branches like `origin/main` — these are **remote-tracking branches**. They record where `origin`'s `main` was the last time you synced with it. They are not live: if someone pushes a new commit to the real `origin`, your `origin/main` doesn't move until you run `fetch` or `pull` again.

```text
      a40f1c2 (main)             <- your own branch
      a40f1c2 (origin/main)      <- a snapshot of origin, from your last sync
```

This distinction — your own branches versus your remote-tracking branches — is the foundation for everything else in this section: fetch updates the tracking branches only, pull also updates your own branch, push sends your own branch's commits outward.

## Common mistakes

- Assuming `origin/main` is a live window into the server. It's a snapshot, frozen until your next fetch or pull.
- Thinking `origin` is a reserved word with special git behavior. It's a name, nothing more — some projects use different names entirely.
- Expecting to be able to open and edit a file "on the remote" the way you edit one locally. You can't — everything goes through commits, fetch, and push.
