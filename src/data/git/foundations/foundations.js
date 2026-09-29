const learn = (id, title, blurb, check) => ({ id, title, blurb, kind: 'learn', check })

export const foundationsSection = {
  id: 'foundations',
  title: 'Git Foundations',
  intro: 'Everything else in this path builds on this loop: init, add, commit, log — and how to undo mistakes.',
  lessons: [
    learn(
      'git-why-version-control',
      'What version control solves, and why Git',
      'Before any commands: what problem is this actually solving?',
      [
        {
          q: 'What problem does version control mainly solve?',
          options: [
            'Making files load faster',
            'Tracking how a project changes over time, and letting you go back to any earlier point',
            'Automatically fixing bugs in code',
            'Compressing files to save disk space',
          ],
          answer: 1,
          why: 'Version control keeps a full history of every change, so you can see what changed, when, why, and undo it if needed.',
        },
        {
          q: 'Without version control, a common way people "save versions" of a project is by hand — for example, folders named final, final_v2, final_v2_ACTUAL. What is the main problem with this?',
          options: [
            'It uses too many folder icons',
            "There's no reliable record of what changed between versions, who changed it, or why",
            'It only works on Windows',
            'It makes the project run slower',
          ],
          answer: 1,
          why: 'Manual copies give you snapshots but no history: no diffs, no messages explaining why something changed, no way to combine work from two people safely.',
        },
        {
          q: 'Git is a "distributed" version control system. What does that mean?',
          options: [
            'Git only works when you are connected to the internet',
            'Every clone of a repository has the full history, not just a pointer to changes on a central server',
            'Git spreads a project across multiple physical hard drives automatically',
            'Multiple people must edit the same file literally at the same time',
          ],
          answer: 1,
          why: 'Unlike older centralized systems, a git clone is a full copy of the project’s entire history. You can commit, branch and view history completely offline.',
        },
        {
          q: 'In Git, what is a "commit"?',
          options: [
            'A saved snapshot of the whole project at a point in time, with a message describing what changed',
            'A single line of code',
            'A backup that only Git support engineers can access',
            'A request to merge two files',
          ],
          answer: 0,
          why: 'A commit records the state of every tracked file at that moment, plus metadata (author, message, timestamp, and a link to the previous commit).',
        },
        {
          q: 'Why does it matter that commits form a chain, each one pointing back to the one before it?',
          options: [
            "It doesn't matter, it's just an implementation detail",
            'It lets Git reconstruct the entire history of the project and safely undo or replay changes',
            'It makes the repository take up less disk space',
            'It is required for Git to work on Windows specifically',
          ],
          answer: 1,
          why: 'That chain (the commit history) is what every other git feature is built on: log, diff, reset, revert, branching and merging all walk this chain.',
        },
      ]
    ),
    learn(
      'git-mental-model',
      'Repositories, working directory, staging area, commits: the mental model',
      'The three areas every git command moves things between.',
      [
        {
          q: 'What are the three areas Git manages for a tracked project?',
          options: [
            'The internet, your hard drive, and the cloud',
            'The working directory, the staging area (index), and the commit history (.git)',
            'RAM, cache, and disk',
            'Local branch, remote branch, and tag',
          ],
          answer: 1,
          why: 'This three-area model — working directory, staging area, repository — is the mental model every git command operates on.',
        },
        {
          q: 'You edit a file in your project folder. Which area reflects that change immediately, before you run any git command?',
          options: ['The staging area', 'The last commit', 'The working directory', 'The remote repository'],
          answer: 2,
          why: 'The working directory is just your normal project folder. Editing a file changes the working directory; Git only notices when you ask it to (status, add, etc).',
        },
        {
          q: 'What does `git add <file>` actually do?',
          options: [
            'It permanently saves the file to history',
            'It copies the file’s current content into the staging area, marking it ready to be included in the next commit',
            'It uploads the file to a remote server',
            'It deletes the file from the working directory',
          ],
          answer: 1,
          why: '`git add` stages a snapshot of the file as it is right now. If you edit the file again afterwards, you’d need to `git add` it again to stage the new changes.',
        },
        {
          q: 'Why does Git have a separate staging area instead of just committing the whole working directory every time?',
          options: [
            "It doesn't serve any real purpose, it's legacy design",
            'It lets you build up exactly the commit you want, choosing which changes go in even if you’ve changed several files',
            'It makes commits load faster',
            'It is required for the internet connection to work',
          ],
          answer: 1,
          why: 'The staging area lets you group related changes into one clean commit and leave unrelated changes for later, instead of always committing everything you’ve touched.',
        },
        {
          q: 'After `git commit`, where does the snapshot of the staged content go?',
          options: [
            'It stays in the staging area forever',
            'It is recorded permanently in the repository’s history (inside the .git folder), and the staging area becomes empty again for the next round',
            'It is deleted to save space',
            'It is sent to a remote server automatically',
          ],
          answer: 1,
          why: 'A commit moves the staged snapshot into the permanent history graph. The staging area then reflects "no pending changes" again, ready for the next set of edits.',
        },
      ]
    ),
    {
      id: 'git-init-first-commit',
      title: 'git init and your first commit',
      blurb: 'Turn a plain folder into a git repository, and make your first commit.',
      kind: 'code',
      practice: {
        prompt:
          'This folder has one file, notes.txt, but it isn’t a git repository yet. Turn it into one, stage notes.txt, and make your first commit.',
        seed: { uninitialized: true, files: { 'notes.txt': 'shopping list\n- eggs\n- bread\n' } },
        starter: [],
        reference: ['git init', 'git add notes.txt', 'git commit -m "Add shopping list"'],
        traps: [
          ['git init', 'git add notes.txt'],
          ['git init', 'git commit -m "Add shopping list"'],
        ],
        cases: [
          { label: 'the folder is now a git repository', check: "(await branch()) !== null" },
          { label: 'exactly one commit exists', check: '(await commitCount()) === 1' },
          { label: 'notes.txt is tracked at HEAD', check: "(await fileAt('HEAD', 'notes.txt')) !== null" },
          { label: 'the working tree is clean', check: 'clean()' },
        ],
        walkthrough:
          'Run `git init` to create the .git folder. Then `git add notes.txt` to stage it, and `git commit -m "..."` to record the first snapshot.',
      },
    },
    {
      id: 'git-status-diff',
      title: 'git status and git diff: seeing what changed',
      blurb: 'Before you stage or commit anything, look at what actually changed.',
      kind: 'code',
      practice: {
        prompt:
          'a.txt has an unstaged edit, and there’s a new untracked file b.txt. Stage a.txt’s change, but leave b.txt untouched for now.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'Add a.txt', files: { 'a.txt': 'line one\nline two\n' } }],
          workingChanges: { 'a.txt': 'line one\nline two, edited\n', 'b.txt': 'a brand new file\n' },
        },
        starter: [],
        reference: ['git add a.txt'],
        traps: [['git add .'], ['git add b.txt']],
        cases: [
          { label: 'a.txt is staged as modified', check: "(await fileStatus('a.txt')).staged === 'modified'" },
          { label: 'b.txt is still untracked, not staged', check: "(await fileStatus('b.txt')).untracked === true" },
        ],
        walkthrough: 'Run `git status` (or `git status -s`) to see both files, then `git add a.txt` to stage only that one.',
      },
    },
    {
      id: 'git-add-staging',
      title: 'git add: staging changes, including partial hunks',
      blurb: 'Build the commit you want by choosing exactly what to stage.',
      kind: 'code',
      practice: {
        prompt:
          'README.md has an unstaged edit, and there’s a new file feature.js. Stage only feature.js — leave README.md’s edit unstaged for a separate commit later.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'Initial project', files: { 'README.md': '# My Project\n' } }],
          workingChanges: { 'README.md': '# My Project\n\nStill a work in progress.\n', 'feature.js': 'console.log("feature")\n' },
        },
        starter: [],
        reference: ['git add feature.js'],
        traps: [['git add .']],
        cases: [
          { label: 'feature.js is staged as a new file', check: "(await fileStatus('feature.js')).staged === 'added'" },
          { label: 'README.md is not staged', check: "(await fileStatus('README.md')).staged === null" },
          { label: 'README.md still shows an unstaged edit', check: "(await fileStatus('README.md')).unstaged === 'modified'" },
        ],
        walkthrough:
          'Stage just the new file with `git add feature.js`. Real git can also stage part of a file’s changes with `git add -p` (patch mode) — this sandbox grades at the whole-file level, but the idea is the same: choose exactly what goes into the next commit.',
      },
    },
    {
      id: 'git-commit-messages',
      title: 'git commit: writing commit messages that hold up',
      blurb: 'A commit message is for the person reading the history later — often you.',
      kind: 'code',
      practice: {
        prompt:
          'Two files are already staged: a bug fix and a small changelog update. Commit them with a message that would actually mean something six months from now.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'Initial release', files: { 'app.js': 'console.log("v1")\n', 'CHANGELOG.md': '# Changelog\n' } }],
          stagedChanges: {
            'app.js': 'console.log("v1.1 - fixed crash on empty input")\n',
            'CHANGELOG.md': '# Changelog\n\n- Fix crash when input is empty\n',
          },
        },
        starter: [],
        reference: ['git commit -m "Fix crash on empty input and update changelog"'],
        traps: [['git commit -m "wip"'], ['git commit -m "fix"'], ['git commit -m "updates"']],
        cases: [
          { label: 'a new commit was created', check: '(await commitCount()) === 2' },
          {
            label: 'the message is descriptive, not a placeholder',
            check:
              "(await commitCount()) === 2 && !['wip','fix','fixes','update','updates','stuff','changes','misc','asdf'].includes((await log())[0].message.trim().toLowerCase()) && (await log())[0].message.trim().length >= 15",
          },
        ],
        walkthrough:
          'Commit the already-staged changes with a message that says what changed and, ideally, why: `git commit -m "Fix crash on empty input and update changelog"`.',
      },
    },
    {
      id: 'git-log-history',
      title: 'git log: reading history',
      blurb: 'The commit history is a timeline. git log is how you read it.',
      kind: 'code',
      practice: {
        prompt: 'There are two commits already. Add a third one for a new contact page, then check with git log that all three show up, newest first.',
        seed: {
          defaultBranch: 'main',
          commits: [
            { message: 'Add index page', files: { 'index.html': '<h1>Home</h1>\n' } },
            { message: 'Add about page', files: { 'about.html': '<h1>About</h1>\n' } },
          ],
        },
        starter: [],
        reference: [{ write: { 'contact.html': '<h1>Contact</h1>\n' } }, 'git add contact.html', 'git commit -m "Add contact page"'],
        traps: [
          [{ write: { 'contact.html': '<h1>Contact</h1>\n' } }, 'git add contact.html'],
          [{ write: { 'contact.html': '<h1>Contact</h1>\n' } }, 'git add contact.html', 'git commit -m "wip"'],
        ],
        cases: [
          { label: 'three commits exist', check: '(await commitCount()) === 3' },
          { label: 'the newest commit is the contact page, listed first', check: "(await log())[0].message === 'Add contact page'" },
          { label: 'the oldest commit is still last in the log', check: "(await log())[2].message === 'Add index page'" },
        ],
        walkthrough: 'Create contact.html, `git add contact.html`, then `git commit -m "Add contact page"`. Run `git log --oneline` to see all three commits, newest first.',
      },
    },
    {
      id: 'git-gitignore',
      title: '.gitignore: keeping noise out of your repo',
      blurb: 'Not everything in your project folder belongs in history.',
      kind: 'code',
      practice: {
        prompt:
          'There’s a new source file, src/app.js, and a generated log file, build/output.log, sitting untracked. Ignore build output and log files, then commit only the real source file.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'Initial commit', files: { 'README.md': '# Project\n' } }],
          workingChanges: { 'src/app.js': 'console.log("hello")\n', 'build/output.log': 'debug line 1\n' },
        },
        starter: [],
        reference: [{ write: { '.gitignore': 'build/\n*.log\n' } }, 'git add .', 'git commit -m "Add app.js, ignore build output"'],
        traps: [['git add .', 'git commit -m "add everything"']],
        cases: [
          { label: '.gitignore was committed', check: "(await fileAt('HEAD', '.gitignore')) !== null" },
          { label: 'src/app.js was committed', check: "(await fileAt('HEAD', 'src/app.js')) !== null" },
          { label: 'the log file was never committed', check: "(await fileAt('HEAD', 'build/output.log')) === null" },
          { label: 'working tree is clean', check: 'clean()' },
        ],
        walkthrough:
          'Create a .gitignore with `build/` and `*.log`, then `git add .` — Git will skip anything matching those patterns — and commit.',
      },
    },
    {
      id: 'git-restore-checkout',
      title: 'Undoing uncommitted changes: checkout and restore',
      blurb: 'You broke a file and haven’t committed yet. Get the last committed version back.',
      kind: 'code',
      practice: {
        prompt: 'a.txt used to say "original". Someone (you) broke it. Throw away the uncommitted change and get the committed version back.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'Add a.txt', files: { 'a.txt': 'original\n' } }],
          workingChanges: { 'a.txt': 'accidentally broke it\n' },
        },
        starter: [],
        reference: ['git restore a.txt'],
        traps: [['git add a.txt']],
        cases: [
          { label: 'a.txt matches the last commit again', check: "(await file('a.txt')) === 'original\\n'" },
          { label: 'working tree is clean', check: 'clean()' },
        ],
        walkthrough: '`git restore a.txt` throws away the uncommitted change and puts back what was last committed. (The older equivalent is `git checkout -- a.txt`.)',
      },
    },
    {
      id: 'git-reset-modes',
      title: 'Undoing commits: git reset (soft, mixed, hard)',
      blurb: 'Three ways to move history backwards, and they are not the same.',
      kind: 'code',
      practice: {
        prompt: 'The last commit broke the build. Throw it away completely — history and working tree both — using git reset.',
        seed: {
          defaultBranch: 'main',
          commits: [
            { message: 'Add app.js', files: { 'app.js': 'console.log("v1")\n' } },
            { message: 'Broken change', files: { 'app.js': 'console.log("v2 - syntax error' } },
          ],
        },
        starter: [],
        reference: ['git reset --hard HEAD~1'],
        traps: [['git reset --soft HEAD~1'], ['git reset HEAD~1'], ['git reset --hard HEAD']],
        cases: [
          { label: 'the broken commit is gone', check: "(await commitCount()) === 1" },
          { label: 'app.js in the working tree matches the good version', check: "(await file('app.js')) === 'console.log(\"v1\")\\n'" },
          { label: 'working tree is clean', check: 'clean()' },
        ],
        walkthrough:
          '`git reset --hard HEAD~1` moves the branch back one commit and makes the index and working tree match it exactly. `--soft` would only move the branch (keeping your changes staged); the default (`--mixed`) would unstage them but leave them in your working tree.',
      },
    },
    {
      id: 'git-revert',
      title: 'git revert: undoing safely on shared history',
      blurb: 'Once history is shared with others, you undo by adding a new commit — not by rewriting the old ones.',
      kind: 'code',
      practice: {
        prompt: 'The last commit broke greet.txt, and it’s already been shared with the team. Undo it safely, without rewriting history.',
        seed: {
          defaultBranch: 'main',
          commits: [
            { message: 'Add greeting', files: { 'greet.txt': 'Hello\n' } },
            { message: 'Break greeting', files: { 'greet.txt': 'Oops\n' } },
          ],
        },
        starter: [],
        reference: ['git revert HEAD'],
        traps: [['git reset --hard HEAD~1']],
        cases: [
          { label: 'a new commit was added (history was not rewritten)', check: '(await commitCount()) === 3' },
          { label: 'the new commit says it reverts something', check: "(await log())[0].message.toLowerCase().includes('revert')" },
          { label: 'greet.txt is back to the good content', check: "(await file('greet.txt')) === 'Hello\\n'" },
        ],
        walkthrough:
          '`git revert HEAD` creates a brand new commit that undoes the changes from the target commit, without deleting it from history. That makes it safe to use even after other people have already pulled the bad commit.',
      },
    },
    {
      id: 'git-show-diff-commits',
      title: 'Viewing old versions: git show and diffing commits',
      blurb: 'Digging into what a specific commit actually changed.',
      kind: 'code',
      practice: {
        prompt:
          'app.js has been changed since the very first commit. Use git show (or git log -p) to see what it looked like back then, then save that exact original content into a new file, old-app.js, and commit it.',
        seed: {
          defaultBranch: 'main',
          commits: [
            { message: 'Initial version', files: { 'app.js': 'console.log("v1")\n' } },
            { message: 'Update greeting', files: { 'app.js': 'console.log("v2")\n' } },
          ],
        },
        starter: [],
        reference: [{ write: { 'old-app.js': 'console.log("v1")\n' } }, 'git add old-app.js', 'git commit -m "Snapshot the original app.js"'],
        traps: [[{ write: { 'old-app.js': 'console.log("v2")\n' } }, 'git add old-app.js', 'git commit -m "snapshot"']],
        cases: [
          { label: 'old-app.js has the ORIGINAL content, not the current one', check: "(await fileAt('HEAD', 'old-app.js')) === 'console.log(\"v1\")\\n'" },
          { label: 'the snapshot was committed', check: '(await commitCount()) === 3' },
        ],
        walkthrough:
          '`git show <first-commit-oid>` (or `git log -p`) shows what changed in that commit, including the old file content. Copy it into old-app.js, then add and commit.',
      },
    },
    {
      id: 'git-tags',
      title: 'Tags: marking releases',
      blurb: 'A tag is a permanent, named pointer to one exact commit — perfect for releases.',
      kind: 'code',
      practice: {
        prompt: 'The current commit is ready to ship. Mark it as release v1.0.0.',
        seed: {
          defaultBranch: 'main',
          commits: [
            { message: 'Prepare release', files: { 'app.js': 'console.log("ready")\n' } },
            { message: 'Fix release bug', files: { 'app.js': 'console.log("ready, fixed")\n' } },
          ],
        },
        starter: [],
        reference: ['git tag v1.0.0'],
        traps: [['git tag v1.0.0 HEAD~1']],
        cases: [
          { label: 'tag v1.0.0 exists', check: "(await tags()).includes('v1.0.0')" },
          { label: 'v1.0.0 points at the current commit', check: "(await tagTarget('v1.0.0')) === (await head())" },
        ],
        walkthrough: '`git tag v1.0.0` tags the current commit (HEAD). To tag a different commit, pass its ref: `git tag v1.0.0 <ref>`.',
      },
    },
    {
      id: 'git-workshop-cleanup',
      title: 'Workshop: clean up a messy working directory',
      blurb: 'Everything from this tier, on one repo that got away from you.',
      kind: 'code',
      practice: {
        prompt:
          'This repo is a mess: the last commit accidentally included a debug file, README.md has an unwanted manual edit, there’s a stray temp.log lying around, and app.js was never committed. Clean it all up: throw away the broken commit, make sure README.md matches history again, stop tracking log files, and get app.js committed properly.',
        seed: {
          defaultBranch: 'main',
          commits: [
            { message: 'Initial commit', files: { 'README.md': '# Recipe Notes\n' } },
            { message: 'oops committed debug code', files: { 'debug.js': 'console.log("DEBUG DO NOT SHIP")\n' } },
          ],
          workingChanges: { 'README.md': '# Recipe Notes\n\nmaybe delete this project idk\n', 'temp.log': 'noisy debug output\n', 'app.js': 'console.log("recipe app")\n' },
        },
        starter: [],
        reference: [
          'git reset --hard HEAD~1',
          { write: { '.gitignore': '*.log\n' } },
          'git add .',
          'git commit -m "Add app.js, ignore log files"',
        ],
        traps: [
          [{ write: { '.gitignore': '*.log\n' } }, 'git add .', 'git commit -m "cleanup"'],
          ['git reset --soft HEAD~1', { write: { '.gitignore': '*.log\n' } }, 'git add .', 'git commit -m "cleanup"'],
        ],
        cases: [
          { label: 'the broken debug commit is gone', check: "(await fileAt('HEAD', 'debug.js')) === null" },
          { label: 'README.md matches history again (the manual edit is gone)', check: "(await file('README.md')) === '# Recipe Notes\\n'" },
          { label: 'app.js is committed', check: "(await fileAt('HEAD', 'app.js')) !== null" },
          { label: '.gitignore is committed', check: "(await fileAt('HEAD', '.gitignore')) !== null" },
          { label: 'temp.log was never committed', check: "(await fileAt('HEAD', 'temp.log')) === null" },
          { label: 'working tree is clean', check: 'clean()' },
        ],
        walkthrough:
          '`git reset --hard HEAD~1` throws away the broken commit and, as a side effect, restores README.md to match that commit too (it never touches untracked files like temp.log or app.js). Then ignore log files, stage what is left, and commit.',
      },
    },
  ],
}
