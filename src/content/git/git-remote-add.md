Not every repository starts life with `git clone`. Sometimes you have local history first, and need to connect it to a remote afterward.

You will learn:

- when you'd use `git remote add` instead of `git clone`
- what it does (and, just as importantly, what it doesn't)
- how to inspect and remove remotes

## When you need this

If you started a project locally with `git init` and built up some history, there's no remote connected yet — `git remote -v` would print nothing. `git remote add` is how you connect that existing local repository to a remote, by name.

```text
$ git remote add origin https://github.com/your-team/project.git
```

This is purely a configuration change. It records "the name `origin` means this url" — nothing is downloaded, nothing is uploaded, and your existing local commits are completely untouched.

## Inspecting and removing

```text
$ git remote -v
origin  https://github.com/your-team/project.git (fetch)
origin  https://github.com/your-team/project.git (push)

$ git remote remove origin
```

`git remote -v` ("verbose") lists every configured remote and its url. `git remote remove <name>` (or `rm`) disconnects one — again, purely a config change, your commits stay exactly as they are.

## After adding, you still need to sync

Adding a remote doesn't bring anything in. If the remote already has history you want, you'd follow up with `git fetch` or `git pull` — covered in the next lessons. Think of `remote add` as plugging in the cable; it doesn't start the transfer by itself.

## Common mistakes

- Expecting `remote add` to fetch or merge anything. It only records the connection.
- Using a name other than `origin` without a reason, then being confused later when a tutorial assumes `origin` exists. `origin` is just the conventional first choice — nothing stops you from using something else deliberately, but match what your team expects.
- Forgetting you can have more than one remote at once — for example `origin` (your own fork) and `upstream` (the project you forked from).
