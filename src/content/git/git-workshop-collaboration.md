Every command from this section, in the order you'd actually use them on a real team: clone the project, build a feature in isolation, ship it.

You will learn:

- how clone, branch, commit, and push fit together as one real workflow
- why building on a branch — instead of directly on main — keeps things clean

## The full loop

```text
$ git clone https://github.com/your-team/project.git
$ git checkout -b search-bar
$ echo 'function search() {}' > search.js
$ git add search.js
$ git commit -m "Add search bar"
$ git push -u origin search-bar
```

Step by step:

1. **Clone** brings in the project's full existing history, with `main` checked out and tracking `origin/main`.
2. **Branch** (`checkout -b search-bar`) creates an isolated place to work — nothing you do here touches `main` until you explicitly merge it later.
3. **Commit** your change there, same as any other lesson in this app.
4. **Push with `-u`** uploads the brand-new branch to origin for the first time and sets up tracking, since nothing pushed it before.

## Why a branch, not main directly

Committing straight to `main` and pushing would work too, but it means every half-finished change is immediately visible to everyone, and `main` stops being a branch you can always trust to be in good shape. Building on `search-bar` instead keeps the feature contained — reviewable, mergeable, or even discardable — without ever touching the shared history until it's ready.

```text
origin/main  ----  (untouched by any of this)
      \
       search-bar  ----  your commit  ----  (pushed, visible to the team)
```

## What happens next, in a real project

Someone reviews the `search-bar` branch on the remote, maybe asks for changes, and eventually merges it into `main` — often through a pull request on whatever platform hosts the remote. That review-and-merge step itself is a tool-specific workflow (GitHub, GitLab, etc.) built on top of exactly the git mechanics you've just practiced.

## Common mistakes

- Committing the feature directly on `main` instead of a dedicated branch, losing the isolation that makes it easy to review or back out.
- Forgetting `-u` on a brand-new branch's first push, and being confused why a later bare `git push` doesn't know where to go.
- Assuming the clone step is optional if you "already have the files somehow." Clone is what sets up the real commit history and remote tracking — nothing else gives you that.
