Rewriting already-shared history and pushing the result needs force. There's a safer way to force than you might think.

You will learn:

- why rewriting a pushed commit blocks a plain push
- what `--force-with-lease` checks that a blind `--force` doesn't

## Why the plain push fails

```text
$ git commit --amend -m "Finished feature"
$ git push
! [rejected]        main -> main (fetch first)
```

Amending rewrites your last commit into a genuinely different commit — different content, different oid. If that commit was already pushed, origin's version and your new version are now two different, unrelated commits sharing the same ancestor. A plain push is correctly rejected, the same "fetch first" rejection from earlier in this path — git can't tell this apart from a teammate having pushed something conflicting.

## Forcing it through, safely

```text
$ git push --force-with-lease
```

`--force-with-lease` pushes anyway, overriding the normal non-fast-forward check — but first it checks one thing: does origin's current state still match what you last saw (your own remote-tracking ref, from your last fetch or pull)? If it does — meaning nobody else has pushed since you last synced — the force goes through. If origin has moved since then, `--force-with-lease` refuses, exactly like a plain push would.

## Why not just --force

```text
$ git push --force
```

A blind `--force` skips that check entirely. It overrides regardless of what's actually on the remote right now — which means if a teammate pushed something in the time between your last fetch and this push, `--force` would silently discard their work with no warning. `--force-with-lease` is the same override, with a safety check that costs nothing when you're actually right that nobody else has touched it.

## Common mistakes

- Reaching for `--force` out of habit when `--force-with-lease` gives the same result safely in the common case (nobody else interfered).
- Rewriting commits that are shared with others without coordinating first — force-pushing is sometimes the right move, but it's still a disruptive one for anyone who already has the old version.
- Assuming `--force-with-lease` is slower or meaningfully different when nothing has gone wrong — it isn't; the safety check only ever matters when something *would* have gone wrong.
