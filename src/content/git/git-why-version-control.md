Before you type a single git command, it's worth being clear about what problem you're actually solving. Every project changes over time — files get edited, features get added, bugs get introduced and fixed. Without a system for tracking that, most people fall back on manual copies: `project_final`, `project_final_v2`, `project_final_v2_ACTUAL`. It works, badly, until it doesn't.

You will learn:

- what version control actually tracks
- why manual copies fall apart
- what "distributed" means for Git specifically
- what a commit is
- why the commit history is the whole point

## What version control tracks

A version control system records every change to a project — not just the current state, but the entire sequence of states that led to it. For each change it can tell you what changed, when, and (if the person committing did their job) why. That history is the actual product; the current state of your files is just the most recent entry in it.

## Why manual copies fall apart

```text
project_final/
project_final_v2/
project_final_v2_ACTUAL/
project_final_v2_ACTUAL_reallyfinal/
```

None of these folders can tell you what changed between them. There's no diff, no message explaining the reasoning, and no way to safely combine work from two people without manually comparing files by eye. It also scales terribly: ten changes means ten folders, thousands of changes means an unmanageable mess.

## Git is distributed

Older, centralized version control systems kept the full history on one server; your machine held just the current files plus a thin connection back to that server. Git is different: cloning a git repository copies its *entire history* to your machine. You can commit, branch, inspect old versions, and search history completely offline — the network is only needed to synchronize with other copies (more on that in the Remotes & Collaboration tier).

## Commits are the unit of history

A commit is a snapshot of every tracked file at one point in time, tagged with an author, a timestamp, a message, and a link back to the commit before it. That chain of links — this commit's parent, and its parent's parent, and so on — is what "history" means in Git. Every other feature in this path (log, diff, branching, undoing mistakes) is really just a way of reading or rewriting that chain.

## Common mistakes

- Treating version control as "just a backup" — the history and messages are worth as much as the files themselves.
- Assuming Git needs a server or an internet connection to be useful day to day. It doesn't; committing, branching and viewing history are all fully local.
- Skipping straight to commands without this mental model — every command in this tier will make more sense once you see it as "move a snapshot between these areas."
