A branch name is just a label — and like any label, sometimes you get it wrong and want to fix it without starting over.

You will learn:

- `git branch -m <new-name>` to rename the branch you're currently on
- `git branch -m <old-name> <new-name>` to rename a different branch
- that renaming changes nothing about the commits themselves

## Renaming the current branch

```text
$ git branch
* temp-fix-dont-use-this-name
  main
$ git branch -m hotfix-login-crash
$ git branch
* hotfix-login-crash
  main
```

Same commits, same history, same working directory — only the label changed. This is purely a rename of the pointer's name; the commit it points to, and everything in it, is completely untouched.

## Renaming a branch you're not on

```text
$ git branch -m old-name new-name
```

Giving two names instead of one lets you rename a branch without switching to it first.

## Why this is always safe

Because a branch really is "just a pointer with a name" (the very first lesson in this tier), renaming it is as low-risk as renaming a file on your desktop — nothing downstream cares about the *name* of the branch a commit lives on, only about the commit itself.

## Common mistakes

- Creating a brand-new branch with the better name instead of renaming — this leaves the old, badly-named branch still sitting there, pointing at the same work.
- Forgetting the single-argument form (`-m <new-name>`) renames whatever branch you're *currently on*, not a branch you have to specify.
- Assuming a rename needs to happen before any work is pushed anywhere — pushing and remote-branch naming are a later tier's concern, not a blocker here.
