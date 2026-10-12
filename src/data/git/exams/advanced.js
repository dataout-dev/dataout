const code = (c) => ({ kind: 'code', points: 10, ...c })
const mcq = (c) => ({ kind: 'mcq', points: 10, ...c })

export const advancedExam = [
  code({
    id: 'git-exam-a1',
    task: 'Check out the very first commit directly, by its relative reference, to look at the project in its original state.',
    seed: {
      commits: [
        { message: 'v1', files: { 'a.txt': 'original\n' } },
        { message: 'v2', files: { 'a.txt': 'updated\n' } },
      ],
    },
    starter: [],
    reference: ['git checkout HEAD~1'],
    traps: [['git checkout main']],
    cases: [
      { label: 'HEAD is detached', check: '(await branch()) === null' },
      { label: 'content matches the original commit', check: "(await file('a.txt')) === 'original\\n'" },
    ],
    walkthrough: 'Checking out a non-branch reference always detaches HEAD — Git has no branch to update to follow you there.',
  }),
  mcq({
    id: 'git-exam-a2',
    q: 'What does the reflog actually record?',
    options: [
      'Every file change ever made in the project',
      "A local, chronological log of everywhere HEAD has pointed on your own machine — commits, resets, checkouts, and more",
      'A list of every remote you have configured',
      "The commit history of everyone who's contributed",
    ],
    answer: 1,
    why: "Reflog tracks YOUR HEAD's movements locally — it's never pushed or shared, which is exactly why it's such a reliable personal safety net.",
  }),
  code({
    id: 'git-exam-a3',
    task: 'You’re mid-edit on notes.txt (uncommitted) but need to fix a typo in README.md first, on a clean tree. Stash your notes.txt work, fix the typo ("Teh" → "The") and commit it, then bring your WIP back.',
    seed: {
      commits: [{ message: 'init', files: { 'notes.txt': 'saved\n', 'README.md': 'Teh project\n' } }],
      workingChanges: { 'notes.txt': 'saved\nin-progress thought\n' },
    },
    starter: [],
    reference: ['git stash', { write: { 'README.md': 'The project\n' } }, 'git add README.md', 'git commit -m "Fix typo"', 'git stash pop'],
    traps: [['git stash', { write: { 'README.md': 'The project\n' } }, 'git add README.md', 'git commit -m "Fix typo"']],
    cases: [
      { label: 'the typo fix was committed', check: "(await fileAt('HEAD', 'README.md')) === 'The project\\n'" },
      { label: 'the WIP content is back', check: "(await file('notes.txt')) === 'saved\\nin-progress thought\\n'" },
      { label: 'nothing left in the stash', check: '(await stashList()).length === 0' },
    ],
    walkthrough: 'git stash saves uncommitted changes aside and cleans the working directory; git stash pop restores them and removes the entry from the list.',
  }),
  mcq({
    id: 'git-exam-a4',
    q: 'What is the difference between git stash apply and git stash pop?',
    options: [
      'There is no difference, they are aliases',
      'apply restores the changes but leaves the stash entry in the list; pop restores them AND removes the entry',
      'apply only works on the oldest stash; pop only works on the newest',
      'pop requires a clean working directory and apply does not',
    ],
    answer: 1,
    why: 'apply is "restore, but keep a copy around" — useful if you might want the same stash again elsewhere; pop is "restore and consume it."',
  }),
  code({
    id: 'git-exam-a5',
    task: 'Squash these two WIP commits into one commit titled "Add validation", keeping all the work.',
    seed: {
      commits: [
        { message: 'base', files: { 'readme.txt': 'readme\n' } },
        { message: 'wip: start validation', files: { 'validate.js': '// start\n' } },
        { message: 'wip: finish validation', files: { 'validate.js': '// start\n// done\n' } },
      ],
    },
    starter: [],
    reference: ['git reset --soft HEAD~2', 'git commit -m "Add validation"'],
    traps: [['git reset --hard HEAD~2', 'git commit -m "Add validation"']],
    cases: [
      { label: 'exactly 2 commits now', check: '(await commitCount()) === 2' },
      { label: 'all the work survived', check: "(await file('validate.js')) === '// start\\n// done\\n'" },
    ],
    walkthrough: '--soft reset moves the branch pointer back while keeping everything staged, so one commit combines it all; --hard would have discarded the actual file changes.',
  }),
  mcq({
    id: 'git-exam-a6',
    q: 'You need exactly ONE commit from a teammate’s long-running branch on your own branch right now. What is the right tool?',
    options: [
      'git merge — it always brings in exactly one commit',
      'git cherry-pick <commit> — applies just that commit’s changes as a new commit on your branch',
      'git clone the other branch separately',
      'git push --force',
    ],
    answer: 1,
    why: 'Merge brings in everything reachable from the other branch; cherry-pick is specifically for taking just one (or a few) individual commits.',
  }),
  code({
    id: 'git-exam-a7',
    task: 'A rebase of "feature" onto "main" is already mid-conflict in shared.txt. Resolve it by keeping "resolved", then continue the rebase.',
    seed: {
      commits: [{ message: 'base', files: { 'shared.txt': 'base\n' } }],
      branches: [
        { name: 'feature', commits: [{ message: 'feature edit', files: { 'shared.txt': 'feature\n' } }] },
        { name: 'main', commits: [{ message: 'main edit', files: { 'shared.txt': 'main\n' } }] },
      ],
      rebaseConflictAttempt: { onto: 'main', branch: 'feature' },
    },
    starter: [],
    reference: [{ write: { 'shared.txt': 'resolved\n' } }, 'git add shared.txt', 'git rebase --continue'],
    traps: [[{ write: { 'shared.txt': 'resolved\n' } }, 'git add shared.txt', 'git commit -m "manual"']],
    cases: [
      { label: 'resolved correctly', check: "(await file('shared.txt')) === 'resolved\\n'" },
      { label: 'the rebase is no longer in progress', check: '!(await rebaseInProgress())' },
    ],
    walkthrough: 'git rebase --continue (not a plain commit) both finishes the current step and properly resumes/closes out the rebase sequence.',
  }),
  mcq({
    id: 'git-exam-a8',
    q: 'What does git bisect help you do?',
    options: [
      'Automatically fix bugs without any input from you',
      'Binary-search through a range of commits between a known-good and known-bad one, narrowing down exactly which commit introduced a problem',
      'Merge two branches that have diverged significantly',
      'Delete all commits after a certain date',
    ],
    answer: 1,
    why: 'You mark endpoints good/bad, bisect checks out the midpoint each round, and you keep answering until it narrows to the single first-bad commit.',
  }),
  code({
    id: 'git-exam-a9',
    task: 'Commit a fix to a.txt, then accidentally reset --hard it away, and recover it using the reflog.',
    seed: { commits: [{ message: 'commit 1', files: { 'a.txt': 'v1\n' } }] },
    starter: [],
    reference: [
      { write: { 'a.txt': 'v2\n' } },
      'git add a.txt',
      'git commit -m "commit 2: fix"',
      'git reset --hard HEAD~1',
      'git reset --hard HEAD@{1}',
    ],
    traps: [[{ write: { 'a.txt': 'v2\n' } }, 'git add a.txt', 'git commit -m "commit 2: fix"', 'git reset --hard HEAD~1']],
    cases: [
      { label: 'the fix commit is recovered', check: '(await log()).length === 2' },
      { label: 'recovered the literal original commit', check: '(await head()) === (await reflog()).at(-1).oid' },
    ],
    walkthrough: 'HEAD@{1} is where HEAD was right before the accidental reset — resetting --hard to it moves the branch back to the still-intact original commit.',
  }),
  mcq({
    id: 'git-exam-a10',
    q: 'Why prefer --force-with-lease over a plain --force when pushing rewritten history?',
    options: [
      'They behave identically; --force-with-lease is just a longer way to type the same thing',
      '--force-with-lease still refuses to push if the remote has moved since you last synced — a plain --force overrides regardless, even silently discarding a teammate’s work',
      '--force-with-lease is slower but otherwise the same',
      '--force-with-lease only works on the main branch',
    ],
    answer: 1,
    why: '--force-with-lease checks the remote still matches what you last saw before overriding — the whole safety benefit over a blind --force.',
  }),
]
