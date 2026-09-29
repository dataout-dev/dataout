Writing correct Python is only part of working on a real project — nearly everything you ship goes through Git and, for most teams, GitHub (or a similar host). The habits here matter as much as the code itself.

This is a reading lesson: real commits, branches and pull requests need a real Git repository and a real remote host, which this single-session browser playground does not have. The ideas apply directly to any real repository — including this very curriculum, which is itself built this way.

You will learn:

- commits, branches, and pull requests
- useful branch strategies
- code review habits
- resolving conflicts
- `.gitignore` for Python
- semantic commit messages

## Commits, branches, pull requests

```text
git checkout -b add-retry-logic
# ... make changes ...
git add pricing.py
git commit -m "Add retry logic to the pricing API client"
git push -u origin add-retry-logic
# open a pull request on GitHub from this branch into main
```

A branch isolates a unit of work from the stable main branch. A pull request is the request to merge that branch back in — and, just as importantly, the place where review and automated checks happen *before* the change actually lands.

## Branch strategies

- **Feature branches**: one short-lived branch per change, merged via a pull request once ready — simple, and the most common default.
- **Trunk-based development**: very short-lived branches (often merged within a day), frequently behind feature flags for anything not yet ready for users — favoured by teams that deploy continuously.
- **Git Flow**: a heavier structure with dedicated `develop`, `release`, and `hotfix` branches — more process, sometimes appropriate for a project with scheduled releases, often overkill for a small team shipping continuously.

There is no universally "correct" choice — it depends on how the team actually releases software.

## Code review habits

A useful review comment explains *why* something should change, not just *that* it should ("this allocates a new list every iteration — pulling it outside the loop avoids that" beats "fix this"). Reviewing your own diff before requesting review from someone else also catches an embarrassing number of typos and leftover debug lines before another person's time is spent on them.

## Resolving conflicts

```text
<<<<<<< HEAD
def total(items):
    return sum(items)
=======
def total(items):
    return sum(i for i in items if i is not None)
>>>>>>> main
```

A conflict marker means two changes touched the same lines for a reason — the fix is to understand what *both* sides were trying to accomplish (here: someone added `None`-filtering) before deciding how to combine them, not to blindly keep one side and discard the other without reading it.

## .gitignore for Python

```text
__pycache__/
*.pyc
.venv/
.env
dist/
*.egg-info/
```

Compiled bytecode caches, a local virtual environment, and any file holding real secrets (`.env`) do not belong in version control — `.gitignore` keeps them from ever being accidentally committed in the first place, rather than relying on everyone remembering to `git add` carefully.

## Semantic commit messages

```text
feat: add retry logic to the pricing API client
fix: correct off-by-one in pagination
docs: clarify the return value of parse_price
chore: bump pytest to 8.x
```

A prefix like `feat:`, `fix:`, `docs:`, or `chore:` makes a project's history scannable at a glance, and can even drive automated changelog generation directly from commit messages — a convention worth adopting consistently if a team adopts it at all.

## Watch out: rewriting shared history

```text
git push --force origin main   # rewrites history everyone else has already based work on
```

Force-pushing to a branch other people have already pulled (especially a shared branch like `main`) can silently discard their work or leave their local repository pointing at commits that no longer exist upstream. Force-pushing your *own*, not-yet-shared feature branch (to clean up before opening a pull request) is common and safe; force-pushing a shared branch needs real coordination first.

## Common mistakes

- Committing directly to `main` instead of working on a branch, skipping review entirely.
- Writing a commit message that repeats the diff instead of explaining the reasoning behind it.
- Resolving a merge conflict by picking a side without understanding what the other side was actually trying to do.
- Force-pushing a branch other people are already using, without warning anyone first.
