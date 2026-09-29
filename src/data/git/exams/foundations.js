const code = (c) => ({ kind: 'code', points: 10, ...c })
const mcq = (c) => ({ kind: 'mcq', points: 10, ...c })

export const foundationsExam = [
  code({
    id: 'git-exam-1',
    task: 'This folder has one file, setup.py, but is not a git repository yet. Initialize it, stage setup.py, and commit it with a real message.',
    seed: { uninitialized: true, files: { 'setup.py': 'print("hello")\n' } },
    starter: [],
    reference: ['git init', 'git add setup.py', 'git commit -m "Add setup script"'],
    traps: [['git init', 'git add setup.py']],
    cases: [
      { label: 'the folder is a git repository', check: '(await branch()) !== null' },
      { label: 'exactly one commit exists', check: '(await commitCount()) === 1' },
      { label: 'working tree is clean', check: 'clean()' },
    ],
    walkthrough: '`git init`, then `git add setup.py`, then `git commit -m "..."`.',
  }),
  mcq({
    id: 'git-exam-2',
    q: 'Why does Git have a separate staging area instead of committing the whole working directory every time you run git commit?',
    options: [
      'It makes commits load faster',
      'It lets you choose exactly which changes go into the next commit, even when several files are touched',
      'It is required for Git to work without an internet connection',
      "It doesn't serve a real purpose, it's legacy design",
    ],
    answer: 1,
    why: 'The staging area lets you build one clean, focused commit even if your working directory currently has several unrelated changes in it.',
  }),
  code({
    id: 'git-exam-3',
    task: 'a.txt and b.txt both have unstaged edits. Stage only a.txt’s change — leave b.txt unstaged.',
    seed: {
      defaultBranch: 'main',
      commits: [{ message: 'Add files', files: { 'a.txt': 'a v1\n', 'b.txt': 'b v1\n' } }],
      workingChanges: { 'a.txt': 'a v2\n', 'b.txt': 'b v2\n' },
    },
    starter: [],
    reference: ['git add a.txt'],
    traps: [['git add .']],
    cases: [
      { label: 'a.txt is staged as modified', check: "(await fileStatus('a.txt')).staged === 'modified'" },
      { label: 'b.txt is not staged', check: "(await fileStatus('b.txt')).staged === null" },
    ],
    walkthrough: '`git add a.txt` stages only that file, leaving b.txt’s edit unstaged.',
  }),
  mcq({
    id: 'git-exam-4',
    q: 'You committed a change locally — nobody else has seen it — and want to throw it away completely, along with any uncommitted edits on top of it. Which command actually does that?',
    options: ['git reset --soft HEAD~1', 'git reset --hard HEAD~1', 'git revert HEAD', 'git restore HEAD~1'],
    answer: 1,
    why: 'Only `--hard` resets the working tree as well as the branch pointer and the index. `--soft` and the default (`--mixed`) both leave the working tree (and, for soft, the index too) untouched.',
  }),
  code({
    id: 'git-exam-5',
    task: 'src/main.py should be committed. cache/data.tmp is generated output and should never be. Set this up and commit properly.',
    seed: {
      defaultBranch: 'main',
      commits: [{ message: 'Initial commit', files: { 'README.md': '# Project\n' } }],
      workingChanges: { 'src/main.py': 'print("run")\n', 'cache/data.tmp': 'scratch data\n' },
    },
    starter: [],
    reference: [{ write: { '.gitignore': 'cache/\n*.tmp\n' } }, 'git add .', 'git commit -m "Add main.py, ignore cache files"'],
    traps: [['git add .', 'git commit -m "add everything"']],
    cases: [
      { label: '.gitignore was committed', check: "(await fileAt('HEAD', '.gitignore')) !== null" },
      { label: 'src/main.py was committed', check: "(await fileAt('HEAD', 'src/main.py')) !== null" },
      { label: 'the tmp file was never committed', check: "(await fileAt('HEAD', 'cache/data.tmp')) === null" },
      { label: 'working tree is clean', check: 'clean()' },
    ],
    walkthrough: 'Ignore `cache/` and `*.tmp`, then `git add .` skips the generated file automatically, and commit.',
  }),
  code({
    id: 'git-exam-6',
    task: 'The last commit broke the deploy config. Throw it away completely — history and working tree both.',
    seed: {
      defaultBranch: 'main',
      commits: [
        { message: 'Add server.js', files: { 'server.js': 'listen(3000)\n' } },
        { message: 'Broken deploy config', files: { 'server.js': 'listen(BROKEN_PORT\n' } },
      ],
    },
    starter: [],
    reference: ['git reset --hard HEAD~1'],
    traps: [['git reset --soft HEAD~1'], ['git reset HEAD~1']],
    cases: [
      { label: 'the broken commit is gone', check: '(await commitCount()) === 1' },
      { label: 'server.js matches the good version', check: "(await file('server.js')) === 'listen(3000)\\n'" },
      { label: 'working tree is clean', check: 'clean()' },
    ],
    walkthrough: '`git reset --hard HEAD~1` moves the branch back one commit and resets the index and working tree to match.',
  }),
  mcq({
    id: 'git-exam-7',
    q: 'A teammate already pulled your last commit before you noticed it was broken. What is the safe way to undo it?',
    options: [
      'git reset --hard HEAD~1, then tell them to reset the same way',
      'git revert HEAD, then push the new commit like any other',
      'Delete the remote repository and start over',
      'git checkout HEAD~1 and keep working in that detached state permanently',
    ],
    answer: 1,
    why: 'Revert adds a new commit undoing the change, so everyone’s history stays consistent. Resetting a commit that others already have creates a mismatch between your history and theirs.',
  }),
  code({
    id: 'git-exam-8',
    task: 'The last commit broke config.txt, and it’s already been shared with the team. Undo it safely, without rewriting history.',
    seed: {
      defaultBranch: 'main',
      commits: [
        { message: 'Add config', files: { 'config.txt': 'timeout=30\n' } },
        { message: 'Break config', files: { 'config.txt': 'timeout=BROKEN\n' } },
      ],
    },
    starter: [],
    reference: ['git revert HEAD'],
    traps: [['git reset --hard HEAD~1']],
    cases: [
      { label: 'a new commit was added, not a rewritten history', check: '(await commitCount()) === 3' },
      { label: 'the new commit mentions reverting', check: "(await log())[0].message.toLowerCase().includes('revert')" },
      { label: 'config.txt is back to the good content', check: "(await file('config.txt')) === 'timeout=30\\n'" },
    ],
    walkthrough: '`git revert HEAD` adds a new commit undoing the bad one, leaving the bad commit visible in history but its effect cancelled out.',
  }),
  code({
    id: 'git-exam-9',
    task: 'Tag the "Stable release" commit as v2.0.0 — note that it is NOT the current HEAD (a hotfix commit landed after it).',
    seed: {
      defaultBranch: 'main',
      commits: [
        { message: 'Stable release', files: { 'app.js': 'console.log("stable")\n' } },
        { message: 'Post-release hotfix', files: { 'notes.txt': 'unrelated hotfix note\n' } },
      ],
    },
    starter: [],
    reference: ['git tag v2.0.0 HEAD~1'],
    traps: [['git tag v2.0.0']],
    cases: [
      { label: 'tag v2.0.0 exists', check: "(await tags()).includes('v2.0.0')" },
      { label: 'v2.0.0 points at the stable release commit, not HEAD', check: "(await tagTarget('v2.0.0')) === (await log())[1].oid" },
    ],
    walkthrough: '`git tag v2.0.0 HEAD~1` tags the commit one before HEAD, not HEAD itself. Passing no ref at all would tag whatever HEAD currently is.',
  }),
  mcq({
    id: 'git-exam-10',
    q: 'In `git status -s` (short) output, a line reads `?? notes.txt`. What does that mean?',
    options: [
      'notes.txt is staged and ready to commit',
      'notes.txt has unstaged modifications',
      'notes.txt is untracked — Git has never seen it before',
      'notes.txt is ignored by .gitignore',
    ],
    answer: 2,
    why: '`??` marks an untracked file: not staged, not committed, not previously known to Git at all. A file matched by .gitignore would not appear in status output at all.',
  }),
]
