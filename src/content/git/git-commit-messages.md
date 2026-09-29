A commit message is not for the computer — Git doesn't care what it says. It's for the next person reading the history, who is very often you, six months from now, trying to figure out why a line of code exists.

You will learn:

- what makes a commit message actually useful
- the "why, not just what" habit
- a common convention for structuring messages
- why "wip" / "fix" / "update" fail as messages

## What a good message answers

```text
Fix crash on empty input and update changelog
```

versus

```text
fix
```

The first tells a future reader (including you) what changed and gives enough context to know whether this commit is relevant to whatever they're investigating. The second tells them nothing beyond "something was fixed" — they'd have to read the full diff to find out what, every single time.

## Why, not just what

The diff itself already shows *what* changed line by line. A message that just restates the diff ("changed x to y") adds nothing. A message earns its place by explaining *why*: what problem this solves, what triggered the change, what tradeoff was made. "Fix crash on empty input" is minimal but still better than "fix", because it names the actual bug.

## A common structure

```text
Fix crash on empty input

The input parser assumed at least one field was always present.
Empty submissions from the contact form now hit that assumption
and raised an IndexError. Guard against it explicitly instead.
```

A short summary line (ideally under ~50 characters, written in the imperative — "Fix", not "Fixed" or "Fixes"), optionally followed by a blank line and a longer explanation for anything non-obvious.

## Common mistakes

- Messages like `wip`, `fix`, `stuff`, `updates` — technically valid, practically useless six months later.
- Writing the message in past tense ("Fixed the bug") instead of imperative ("Fix the bug") — a minor style point, but the convention nearly every project uses.
- Cramming multiple unrelated changes into one commit because writing one message for all of them felt easier than staging them separately.
