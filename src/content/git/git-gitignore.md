Not everything sitting in your project folder belongs in history: build output, logs, local secrets, dependency caches. `.gitignore` tells Git to stop offering to track them.

You will learn:

- writing a `.gitignore`
- common patterns (`*.log`, `build/`)
- what happens to already-tracked files (a gotcha)
- why this matters beyond tidiness

## Writing a .gitignore

```text
build/
*.log
.env
node_modules/
```

A trailing slash (`build/`) matches a directory and everything inside it. A leading `*` (`*.log`) matches any file with that extension, anywhere in the project. `.gitignore` is itself just a text file — usually committed, so the ignore rules are shared with everyone who clones the repository.

## Ignored files disappear from status

```text
$ git status
On branch main
Untracked files:
	src/app.js
```

Once `.gitignore` excludes `build/output.log`, `git status` stops mentioning it entirely, and `git add .` silently skips it too. This is the main point: ignored files stop being noise in every status check and every `add`, without you having to remember to exclude them manually each time.

## The gotcha: ignoring doesn't untrack

```text
$ git rm --cached secrets.env
```

If a file is *already committed*, adding it to `.gitignore` afterwards does nothing — Git keeps tracking files it already knows about regardless of ignore rules. You have to explicitly stop tracking it first (`git rm --cached`, which removes it from the repository but leaves it on disk), and *then* `.gitignore` will keep it out going forward.

## Common mistakes

- Adding a pattern to `.gitignore` and assuming it retroactively removes an already-committed file from history — it doesn't.
- Committing secrets before ever adding a `.gitignore`, at which point they're in history permanently (not just in the latest commit) unless history itself is rewritten.
- Forgetting to commit `.gitignore` itself, so nobody else who clones the repo gets the same ignore rules.
