const code = (c) => ({ kind: 'code', points: 10, ...c })
const mcq = (c) => ({ kind: 'mcq', points: 10, ...c })

export const branchingExam = [
  code({
    id: 'git-exam-b1',
    task: 'Create a branch called "release-prep" and switch to it, in a single command.',
    seed: {
      defaultBranch: 'main',
      commits: [{ message: 'Initial commit', files: { 'app.js': 'console.log("v1")\n' } }],
    },
    starter: [],
    reference: ['git checkout -b release-prep'],
    traps: [['git branch release-prep']],
    cases: [
      { label: 'release-prep exists', check: "(await branches()).includes('release-prep')" },
      { label: 'you are on release-prep', check: "(await branch()) === 'release-prep'" },
    ],
    walkthrough: '`git checkout -b release-prep` (or `git switch -c release-prep`) creates and switches in one step.',
  }),
  mcq({
    id: 'git-exam-b2',
    q: 'What is a Git branch, technically?',
    options: [
      'A full duplicate copy of every project file',
      'A small, movable pointer to a single commit',
      'A permanent snapshot that can never move',
      'A folder on a remote server',
    ],
    answer: 1,
    why: 'A branch is just a ref holding a commit hash. Moving it (via commit or merge) never duplicates any project files.',
  }),
  code({
    id: 'git-exam-b3',
    task: 'main hasn’t moved since "feature" branched off. Merge feature into main.',
    seed: {
      defaultBranch: 'main',
      commits: [{ message: 'base', files: { 'a.txt': 'v1\n' } }],
      branches: [{ name: 'feature', commits: [{ message: 'feature change', files: { 'a.txt': 'v2\n' } }] }],
      checkout: 'main',
    },
    starter: [],
    reference: ['git merge feature'],
    traps: [['git merge --no-ff feature']],
    cases: [
      { label: 'main matches feature’s content', check: "(await file('a.txt')) === 'v2\\n'" },
      { label: 'it was a true fast-forward (no extra commit)', check: '(await commitCount()) === 2' },
    ],
    walkthrough: 'With main unchanged, feature is a straight-line ahead, so Git just moves main’s pointer forward — no new commit needed.',
  }),
  mcq({
    id: 'git-exam-b4',
    q: 'When does Git create a real two-parent merge commit instead of just fast-forwarding?',
    options: [
      'Always, every single time you run git merge',
      'Only when you pass --no-ff, never otherwise',
      'Whenever the branch being merged in has genuinely diverged — the current branch has commits of its own that aren’t on the other branch',
      'Only on the first merge a repository ever does',
    ],
    answer: 2,
    why: 'A fast-forward is possible only when the current branch is a straight-line ancestor of what’s being merged in. Once both sides have independent commits, Git must create a real merge commit to combine them (or you can force one anytime with --no-ff).',
  }),
  code({
    id: 'git-exam-b5',
    task: 'Both main and feature added different files since they diverged. Merge feature into main.',
    seed: {
      defaultBranch: 'main',
      commits: [{ message: 'base', files: { 'README.md': '# Project\n' } }],
      branches: [
        { name: 'feature', commits: [{ message: 'add search', files: { 'search.js': 'function search() {}\n' } }] },
        { name: 'main', commits: [{ message: 'add logging', files: { 'logger.js': 'function log() {}\n' } }] },
      ],
    },
    starter: [],
    reference: ['git merge feature'],
    traps: [['git checkout feature', 'git merge main']],
    cases: [
      { label: 'search.js is present', check: "(await file('search.js')) === 'function search() {}\\n'" },
      { label: 'logger.js is present', check: "(await file('logger.js')) === 'function log() {}\\n'" },
      { label: 'a real merge commit (two parents) was created', check: '(await log())[0].parents.length === 2' },
      { label: 'you ended up on main', check: "(await branch()) === 'main'" },
    ],
    walkthrough: 'Non-overlapping changes on both sides merge automatically into one new two-parent commit.',
  }),
  mcq({
    id: 'git-exam-b6',
    q: 'In a conflicted file, what does the content between `<<<<<<< main` and `=======` represent?',
    options: [
      'A corrupted section of the file that must be deleted',
      'The content from your current branch (the one marked after <<<<<<<)',
      'The content from the branch being merged in',
      'A comment Git inserts automatically and should be kept',
    ],
    answer: 1,
    why: 'The label right after `<<<<<<<` names whose version comes first — your current branch’s. The version after `=======` (up to `>>>>>>>`) is theirs.',
  }),
  code({
    id: 'git-exam-b7',
    task: 'A merge of "feature" into "main" is already in progress and hit a conflict in config.txt. Resolve it by keeping "timeout=60" (feature’s value), then complete the merge.',
    seed: {
      defaultBranch: 'main',
      commits: [{ message: 'base', files: { 'config.txt': 'timeout=30\n' } }],
      branches: [
        { name: 'feature', commits: [{ message: 'bump timeout for feature', files: { 'config.txt': 'timeout=60\n' } }] },
        { name: 'main', commits: [{ message: 'bump timeout for main', files: { 'config.txt': 'timeout=45\n' } }] },
      ],
      mergeAttempt: { into: 'main', from: 'feature' },
    },
    starter: [],
    reference: [{ write: { 'config.txt': 'timeout=60\n' } }, 'git add config.txt', 'git commit -m "Merge feature into main"'],
    traps: [[{ write: { 'config.txt': 'timeout=60\n' } }, 'git add config.txt']],
    cases: [
      { label: 'config.txt resolved correctly', check: "(await file('config.txt')) === 'timeout=60\\n'" },
      { label: 'no conflict markers remain', check: "!(await conflicted('config.txt'))" },
      { label: 'the merge completed as a two-parent commit', check: '(await log())[0].parents.length === 2' },
    ],
    walkthrough: 'Edit the file to its resolved content, `git add` it, then a plain `git commit` finishes the paused merge.',
  }),
  mcq({
    id: 'git-exam-b8',
    q: 'git branch -d refuses to delete a branch in which situation?',
    options: [
      'When the branch name is longer than 20 characters',
      "When the branch has commits that aren't reachable from your current branch — i.e. it hasn't actually been merged anywhere",
      'When the branch was created more than a week ago',
      'It never refuses — -d and -D always behave identically',
    ],
    answer: 1,
    why: '`-d` is the safe delete: it checks the branch is fully merged first. `-D` skips that check and deletes regardless, which can lose commits for good.',
  }),
  code({
    id: 'git-exam-b9',
    task: '"old-feature" was already merged into main. Delete it.',
    seed: {
      defaultBranch: 'main',
      commits: [{ message: 'base', files: { 'a.txt': 'v1\n' } }],
      branches: [{ name: 'old-feature', commits: [{ message: 'old feature work', files: { 'a.txt': 'v2\n' } }] }],
      mergeAttempt: { into: 'main', from: 'old-feature' },
      checkout: 'main',
    },
    starter: [],
    reference: ['git branch -d old-feature'],
    traps: [['git branch -m old-feature archived-feature']],
    cases: [
      { label: 'only main remains', check: "(await branches()).length === 1 && (await branches()).includes('main')" },
      { label: 'main’s content is intact', check: "(await file('a.txt')) === 'v2\\n'" },
    ],
    walkthrough: '`git branch -d` succeeds here with no complaint, because every commit on old-feature is already reachable from main.',
  }),
  mcq({
    id: 'git-exam-b10',
    q: 'A teammate suggests rebasing a feature branch onto main instead of merging, to keep history linear. What is the real tradeoff?',
    options: [
      'Rebase is strictly safer than merge in every situation, with no downsides',
      'Rebase rewrites the branch’s commits into brand-new ones (different hashes) — fine on a branch only you use, risky on one others have already pulled',
      'Rebase permanently deletes commit history with no way to recover it',
      'There is no real difference — rebase and merge always produce identical results',
    ],
    answer: 1,
    why: 'Rebasing replays commits onto a new base, giving them new identities. That’s why the common rule is "never rebase a branch other people are already building on."',
  }),
]
