Once you have more than one commit, `git log` is how you actually read the history you've been building.

You will learn:

- reading the default `git log` output
- `git log --oneline` for a compact view
- how commits are ordered (newest first)
- a few other useful flags

## The default view

```text
$ git log
commit a1b2c3d4e5f6...
Author: DataOut Learner <learner@dataout.dev>
Date:   Tue Nov 14 2023

    Add contact page

commit 9f8e7d6c5b4a...
Author: DataOut Learner <learner@dataout.dev>
Date:   Tue Nov 14 2023

    Add about page
```

Each entry shows the full commit hash (a long hexadecimal id, unique to that exact snapshot), the author, the date, and the message. Commits are always listed **newest first** — the most recent commit is HEAD, and each one below it is an ancestor.

## The compact view

```text
$ git log --oneline
a1b2c3d Add contact page
9f8e7d6 Add about page
1a2b3c4 Add index page
```

`--oneline` shortens each hash to its first seven characters (still unique in practice for a small repo) and puts the message on the same line — the view you'll reach for most often once a repo has more than a handful of commits.

## A few other useful flags

```text
$ git log -p          # show the full diff for each commit
$ git log --stat      # show which files changed and by how much
$ git log -3          # only the last 3 commits
```

## Common mistakes

- Assuming `git log` shows changes in the order you made them chronologically top-to-bottom — it's the reverse: newest at the top.
- Confusing the full hash with the short one — both refer to the same commit, `git log --oneline`'s short form is just a convenient abbreviation.
- Not realizing `git log` only shows the history *reachable from your current branch* — commits on other branches won't appear until you look at them too (covered in the next tier).
