The simplest branch operation there is: make a new pointer, without going anywhere.

You will learn:

- `git branch <name>` to create a branch without switching to it
- `git branch` (no arguments) to list every branch
- how to tell which branch is currently checked out

## Creating a branch

```text
$ git branch reporting
$ git branch
* main
  reporting
```

`git branch reporting` creates a new branch called `reporting`, pointing at whatever commit `HEAD` currently is. Notice what *didn't* happen: you're still on `main` (marked with `*`). This command only ever creates a pointer — it never moves you anywhere.

## Listing branches

Running `git branch` with no arguments lists every local branch, with an asterisk next to whichever one is currently checked out. This is the fastest way to answer "what branches exist, and where am I?" without digging through `git log`.

## Why create a branch without switching?

Sometimes you want to mark "the current state of this project" with a name before you go off and do something else — a release branch, a backup point before a risky experiment, or a placeholder for someone else to pick up. `git branch <name>` does exactly that and nothing more.

## Common mistakes

- Expecting `git branch reporting` to switch you to it. It deliberately doesn't — that's what `git checkout -b` (covered soon) is for.
- Forgetting that a brand-new branch starts out identical to wherever you created it from. It only starts to differ once you check it out and commit something new there.
- Not noticing the `*` in `git branch`'s output and assuming you've moved when you haven't.
