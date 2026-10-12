Why `git push` and `git pull` can run with no arguments at all, once a branch knows where it belongs.

You will learn:

- what "upstream tracking" actually means
- when a branch gets it automatically, and when you have to set it yourself

## A remembered default, nothing more

A branch with an upstream set just remembers which remote branch it corresponds to — that's the entire feature. It lets `git push` and `git pull`, typed with zero arguments, know exactly where to send or fetch from, instead of you having to spell out `git push origin main` every single time.

```text
$ git push
To https://github.com/your-team/project.git
   a40f1c2..5c2a9f1  main -> main
```

That bare `git push` only works because `main` already has `origin/main` recorded as its upstream.

## When it's set automatically

`git clone` sets this up for you immediately — the branch you land on after cloning already tracks the matching branch on the remote you cloned from. That's why you've been able to run bare `git pull`/`git push` in every lesson in this section so far, without ever typing `origin main` explicitly.

## When you have to set it yourself

A branch you create locally — `git checkout -b feature-x` — has no remote counterpart yet. The first time you push it, you need to say where it should go *and* ask git to remember that for next time:

```text
$ git push -u origin feature-x
```

`-u` (short for `--set-upstream`) does the push and records the tracking relationship in one step. After that, a bare `git push`/`git pull` on `feature-x` works exactly like it does on `main`.

## Common mistakes

- Forgetting `-u` the first time you push a new branch, then being confused why a later bare `git push` complains it doesn't know where to send things.
- Assuming every branch automatically tracks something. Only the branch you land on after `clone` does — anything you create afterward needs an explicit first push.
- Thinking `-u` does something different to the push itself. It's the same upload, plus one extra bit of bookkeeping.
