Sometimes you need exactly one commit from somewhere else — not the whole branch it lives on.

You will learn:

- what `git cherry-pick` actually does
- how it differs from merging

## Taking just one commit

```text
$ git cherry-pick hotfix
```

This takes the changes introduced by the tip commit of `hotfix` and applies them as a **brand-new commit** on your current branch. It's not the same commit object — same content, new commit, new parent (wherever you currently are), new oid.

```text
before:  main (you)        hotfix: base -- fix
after:   main: ... -- fix' (a new commit with the same changes)
```

## Why not just merge

Merging `hotfix` would bring in **everything** reachable from it — every commit on that branch, not just the one you need. If `hotfix` has a long history of its own work-in-progress, merging drags all of it onto your branch along with the one fix you actually wanted. Cherry-pick is surgical: exactly the commit you name, nothing else.

## You stay where you are

Cherry-pick doesn't switch branches. You pick a commit from somewhere else and it lands on whatever you currently have checked out — you never need to visit the source branch at all.

## Common mistakes

- Reaching for `merge` when you only wanted one specific commit, pulling in unrelated work along with it.
- Expecting the cherry-picked commit to have the same hash as the original. It doesn't — same changes, genuinely different commit object.
- Cherry-picking a commit that depends on earlier changes not yet present on your branch — it can conflict, the same way a merge can, if the context it expects isn't there.
