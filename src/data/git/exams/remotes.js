const code = (c) => ({ kind: 'code', points: 10, ...c })
const mcq = (c) => ({ kind: 'mcq', points: 10, ...c })

const REPO = 'https://github.com/dataout-labs/notebook-sync.git'

export const remotesExam = [
  code({
    id: 'git-exam-r1',
    task: `Clone the "notebook-sync" project from ${REPO}.`,
    seed: {
      remote: {
        commits: [
          { message: 'Initial commit', files: { 'README.md': '# Notebook Sync\n' } },
          { message: 'Add sync engine', files: { 'sync.js': 'function sync() {}\n' } },
        ],
      },
    },
    starter: [],
    reference: [`git clone ${REPO}`],
    traps: [['git init']],
    cases: [
      { label: 'log has 2 commits', check: '(await log()).length === 2' },
      { label: 'origin is configured', check: 'await hasRemote()' },
    ],
    walkthrough: 'git clone copies the full history, sets up the origin remote, and checks out a tracking local branch, all in one step.',
  }),
  mcq({
    id: 'git-exam-r2',
    q: 'What does origin/main represent in your local repository?',
    options: [
      'A live mirror that updates the instant origin changes',
      "A snapshot of where origin's main was as of your last fetch, pull, or clone",
      'The exact same branch object as your local main',
      'A branch that only the remote server can see',
    ],
    answer: 1,
    why: 'Remote-tracking branches are snapshots, updated only when you explicitly sync — never live.',
  }),
  code({
    id: 'git-exam-r3',
    task: `Connect this existing repo to origin at ${REPO}, without fetching anything yet.`,
    seed: { commits: [{ message: 'Local start', files: { 'a.txt': '1\n' } }] },
    starter: [],
    reference: [`git remote add origin ${REPO}`],
    traps: [[`git remote add upstream ${REPO}`]],
    cases: [
      { label: 'origin configured with the correct url', check: `(await remotes()).some((r) => r.remote === 'origin' && r.url === '${REPO}')` },
      { label: 'history untouched', check: '(await log()).length === 1' },
    ],
    walkthrough: 'git remote add just records a name-to-url mapping — it never fetches or changes anything by itself.',
  }),
  mcq({
    id: 'git-exam-r4',
    q: 'After running git fetch, which of these is true?',
    options: [
      'Your local main branch has already been updated to match origin',
      'Only the origin/main tracking ref moved — your own main branch is untouched until you merge or pull',
      "Fetch deletes any local commits not on origin",
      'Fetch is identical to push, but in reverse',
    ],
    answer: 1,
    why: 'Fetch only updates remote-tracking refs. Your own branches never move until you merge, pull, or rebase explicitly.',
  }),
  code({
    id: 'git-exam-r5',
    task: "origin has a new commit you don't have yet, and your main hasn't moved. Pull it in.",
    seed: {
      remote: { commits: [{ message: 'Initial commit', files: { 'README.md': '# Notebook Sync\n' } }] },
      cloneFromRemote: { url: REPO },
      remoteAdvanceAfterClone: { commits: [{ message: 'Add export feature', files: { 'export.js': 'function exportData() {}\n' } }] },
    },
    starter: [],
    reference: ['git pull'],
    traps: [['git fetch']],
    cases: [
      { label: 'main now has 2 commits', check: '(await commitCount()) === 2' },
      { label: 'clean fast-forward, no merge commit', check: '(await log())[0].parents.length <= 1' },
    ],
    walkthrough: "With main unchanged since cloning, git pull is a straightforward fast-forward — main's pointer just slides forward to match origin/main.",
  }),
  mcq({
    id: 'git-exam-r6',
    q: 'A merge during git pull creates conflict markers in a file. What are the correct next steps?',
    options: [
      'git push immediately to let the server resolve it',
      'Edit the file to the content you want, remove the markers, git add it, then git commit',
      'Delete the file entirely and commit that',
      'git pull --force',
    ],
    answer: 1,
    why: 'Resolving a conflict from a pull works exactly like resolving any merge conflict: edit, stage, commit.',
  }),
  code({
    id: 'git-exam-r7',
    task: 'A pull is already mid-conflict on status.txt. Resolve it by keeping "status: approved", then complete the merge.',
    seed: {
      remote: { commits: [{ message: 'Initial commit', files: { 'status.txt': 'status: draft\n' } }] },
      cloneFromRemote: { url: REPO },
      commits: [{ message: 'My update', files: { 'status.txt': 'status: ready\n' } }],
      remoteAdvanceAfterClone: { commits: [{ message: "Team's update", files: { 'status.txt': 'status: approved\n' } }] },
      pullAttempt: {},
    },
    starter: [],
    reference: [{ write: { 'status.txt': 'status: approved\n' } }, 'git add status.txt', 'git commit -m "Merge origin/main"'],
    traps: [[{ write: { 'status.txt': 'status: approved\n' } }, 'git add status.txt']],
    cases: [
      { label: 'resolved correctly', check: "(await file('status.txt')) === 'status: approved\\n'" },
      { label: 'no markers remain', check: "!(await conflicted('status.txt'))" },
      { label: 'real merge commit (two parents)', check: '(await log())[0].parents.length === 2' },
    ],
    walkthrough: 'Edit the file to its resolved content, git add it, then a plain git commit finishes the paused merge.',
  }),
  mcq({
    id: 'git-exam-r8',
    q: "git push is rejected with a non-fast-forward error. What does this mean?",
    options: [
      'Your internet connection dropped mid-push',
      "The remote has at least one commit you don't have locally — you need to integrate it (fetch/pull) before your push can be accepted",
      'You do not have permission to push, ever',
      'Your commit messages are too long',
    ],
    answer: 1,
    why: 'Git refuses a push that would silently overwrite commits the remote already has — fetch or pull first, then push.',
  }),
  code({
    id: 'git-exam-r9',
    task: "origin has a commit you don't, and you have one it doesn't. Get your work onto origin.",
    seed: {
      remote: { commits: [{ message: 'Initial commit', files: { 'README.md': '# Notebook Sync\n' } }] },
      cloneFromRemote: { url: REPO },
      commits: [{ message: 'My commit', files: { 'mine.txt': 'work\n' } }],
      remoteAdvanceAfterClone: { commits: [{ message: "Teammate's commit", files: { 'theirs.txt': 'other work\n' } }] },
    },
    starter: [],
    reference: ['git pull', 'git push'],
    traps: [['git push']],
    cases: [
      { label: 'remote has all 4 commits (base, yours, theirs, and the merge)', check: '(await remoteLog()).length === 4' },
      { label: 'both files present on remote', check: "(await remoteFileAt('main', 'mine.txt')) !== null && (await remoteFileAt('main', 'theirs.txt')) !== null" },
    ],
    walkthrough: "The first push would be rejected since origin has a commit you don't. Pulling integrates it (cleanly, since the files differ), and only then does the push succeed.",
  }),
  mcq({
    id: 'git-exam-r10',
    q: 'What does -u (or --set-upstream) do on a push?',
    options: [
      'Forces the push even if rejected',
      'Records which remote branch this local branch tracks, so future bare git push/git pull work without arguments',
      'Deletes the remote branch first',
      'Uploads your entire commit history regardless of what changed',
    ],
    answer: 1,
    why: "-u sets up tracking in the same step as the push — exactly what you want the first time you push a brand-new branch.",
  }),
]
