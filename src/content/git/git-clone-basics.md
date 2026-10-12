Every collaboration starts here: taking a repository that already exists somewhere else and getting a full, working copy of it onto your own machine.

You will learn:

- what `git clone` actually does, step by step
- what you end up with immediately afterward
- how it's different from `git init`

## What clone does

```text
$ git clone https://github.com/your-team/project.git
Cloning into 'project'...
done.
```

In one command, `git clone <url>`:

1. Copies the **entire history** — every commit, every branch — from the remote into a new local repository.
2. Configures that remote as `origin`, recording the url you cloned from.
3. Creates remote-tracking branches (`origin/main`, `origin/some-other-branch`, ...) for everything that existed on the remote.
4. Checks out a local branch (usually `main`) that starts out identical to `origin/main`.

Nothing here is partial or lazy — you get the real, full history immediately, not just the latest snapshot.

## Clone vs. init

`git init` starts a repository from *nothing* — no history, no remote, you build it up commit by commit. `git clone` starts from *something that already exists elsewhere* and gives you a complete, connected copy of it. You'll use `init` when starting a brand-new project from scratch, and `clone` whenever you're joining work that's already underway.

## Right after cloning

```text
$ git log --oneline
9f2a001 Add server entrypoint
a40f1c2 Initial commit

$ git remote -v
origin  https://github.com/your-team/project.git (fetch)
origin  https://github.com/your-team/project.git (push)

$ git branch -a
* main
  remotes/origin/main
```

Your local `main` and `origin/main` point at the exact same commit — they won't drift apart until you make your own commits, or until origin moves on and you haven't fetched yet.

## Common mistakes

- Expecting `clone` to only grab the latest file state, not the full history. It grabs everything.
- Forgetting that `origin` is set up automatically by clone — you don't need `git remote add` after cloning, only when connecting an *already-existing* local repo (the next lesson covers that case).
- Assuming you need to run `git init` first, then clone "into" it. Clone creates and initializes the directory itself.
