const learn = (id, title, blurb, check) => ({ id, title, blurb, kind: 'learn', check })

export const branchingSection = {
  id: 'branching',
  title: 'Branching & Merging',
  intro: 'Branches let you work in isolation. Merging is how that isolated work rejoins everyone else’s — cleanly when possible, with your help when it conflicts.',
  lessons: [
    learn(
      'git-what-is-a-branch',
      'What a branch actually is',
      'Not a copy of your files — a movable pointer to one commit.',
      [
        {
          q: 'What is a Git branch, technically?',
          options: [
            'A full copy of all project files at a point in time',
            'A movable pointer (a small file containing a commit hash) that points to one specific commit',
            'A backup stored on a remote server',
            "A special kind of commit that can't be deleted",
          ],
          answer: 1,
          why: 'A branch is just a label pointing at a commit. Moving the branch (by committing, merging, etc.) just updates which commit it points to — no files are duplicated.',
        },
        {
          q: "When you make a new commit while on a branch, what happens to that branch's pointer?",
          options: [
            'It automatically moves forward to point at the new commit',
            'It stays pointing at the old commit forever',
            'It is deleted and a new one is created',
            'It starts pointing at main instead',
          ],
          answer: 0,
          why: 'Committing always advances the current branch to point at the new commit, which records the previous commit as its parent.',
        },
        {
          q: 'Why is creating a new branch in Git typically instant, even in a huge project?',
          options: [
            'Git secretly copies all files in the background later',
            'A branch is just a small ref file holding a commit hash — no project files are duplicated',
            'Git only allows branches in small projects',
            'Branches share a single file that nobody is allowed to edit',
          ],
          answer: 1,
          why: 'Because a branch is just a pointer, creating one is a tiny, instant write — completely independent of how large the project is.',
        },
        {
          q: 'What does "HEAD" usually point to?',
          options: [
            'The very first commit ever made',
            "The remote repository's main branch",
            'The branch you currently have checked out, which itself points to a commit',
            'A random commit chosen by Git',
          ],
          answer: 2,
          why: 'HEAD normally points at a branch name (not a commit directly). That branch points at a commit, so HEAD moves transparently as you switch branches or commit.',
        },
        {
          q: 'What is the main reason teams use branches instead of always committing to one single timeline?',
          options: [
            'Branches make the repository take up less space',
            'Branches let you work on something — a feature, a fix, an experiment — in isolation, without disturbing stable history until you choose to combine it',
            'Branches are required before Git allows any commit at all',
            "Branches automatically test your code for bugs",
          ],
          answer: 1,
          why: 'Isolation is the whole point: you can commit freely on a branch, even break things temporarily, with zero effect on anyone else until you merge.',
        },
      ]
    ),
    {
      id: 'git-branch-create-list',
      title: 'git branch: creating and listing branches',
      blurb: 'Make a new branch without disturbing where you currently are.',
      kind: 'code',
      practice: {
        prompt:
          'Create a new branch called "reporting" at the current commit — but do not switch to it. Stay on main.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'Initial commit', files: { 'app.js': 'console.log("v1")\n' } }],
        },
        starter: [],
        reference: ['git branch reporting'],
        traps: [['git checkout -b reporting']],
        cases: [
          { label: 'the reporting branch exists', check: "(await branches()).includes('reporting')" },
          { label: 'you are still on main', check: "(await branch()) === 'main'" },
        ],
        walkthrough:
          '`git branch reporting` creates a new branch pointer at the current commit without touching HEAD. `git checkout -b` (or `git switch -c`) would create it AND switch to it — not what was asked here.',
      },
    },
    {
      id: 'git-switch-branches',
      title: 'Switching branches: checkout and switch',
      blurb: 'Move HEAD to a different branch, and watch your working directory change with it.',
      kind: 'code',
      practice: {
        prompt: 'Switch to the existing "draft" branch and confirm its notes file is there.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'Initial commit', files: { 'report.txt': 'Q1 numbers\n' } }],
          branches: [{ name: 'draft', commits: [{ message: 'Add draft notes', files: { 'notes.txt': 'draft thoughts\n' } }] }],
          checkout: 'main',
        },
        starter: [],
        reference: ['git checkout draft'],
        traps: [['git checkout -b wrong-branch']],
        cases: [
          { label: 'you are now on the draft branch', check: "(await branch()) === 'draft'" },
          { label: "notes.txt is present after switching", check: "(await file('notes.txt')) === 'draft thoughts\\n'" },
        ],
        walkthrough:
          '`git checkout draft` (or the newer `git switch draft`) moves HEAD to the draft branch and updates every file in your working directory to match it, in one step.',
      },
    },
    {
      id: 'git-create-and-switch',
      title: 'Creating and switching in one step',
      blurb: '`git checkout -b` (or `git switch -c`) does both at once — the normal way to start new work.',
      kind: 'code',
      practice: {
        prompt:
          'README.md has a typo ("Wlecome"). Create a new branch called "fix-typo", switch to it in one command, fix the typo to say "Welcome", and commit the fix there — main should stay untouched.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'Initial commit', files: { 'README.md': 'Wlecome to the project\n' } }],
        },
        starter: [],
        reference: [
          'git checkout -b fix-typo',
          { write: { 'README.md': 'Welcome to the project\n' } },
          'git add README.md',
          'git commit -m "Fix typo in README"',
        ],
        traps: [[{ write: { 'README.md': 'Welcome to the project\n' } }, 'git add README.md', 'git commit -m "Fix typo"']],
        cases: [
          { label: 'a new branch fix-typo exists', check: "(await branches()).includes('fix-typo')" },
          { label: 'you are on fix-typo', check: "(await branch()) === 'fix-typo'" },
          { label: 'the typo is fixed there', check: "(await file('README.md')) === 'Welcome to the project\\n'" },
          { label: 'main is untouched', check: "(await fileAt('main', 'README.md')) === 'Wlecome to the project\\n'" },
        ],
        walkthrough:
          '`git checkout -b fix-typo` creates fix-typo at the current commit and switches to it immediately. Fixing and committing from there leaves main exactly as it was.',
      },
    },
    {
      id: 'git-compare-branches',
      title: 'Comparing branches without switching',
      blurb: 'git log and git diff can look at any branch — you don’t have to be standing on it.',
      kind: 'code',
      practice: {
        prompt:
          'The "feature" branch has some commits that main doesn’t have yet. Without switching branches, figure out exactly how many, then (while staying on main) write that number into answer.txt and commit it.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'base', files: { 'app.js': 'v1\n' } }],
          branches: [
            {
              name: 'feature',
              commits: [
                { message: 'feature step 1', files: { 'app.js': 'v2\n' } },
                { message: 'feature step 2', files: { 'app.js': 'v3\n' } },
              ],
            },
          ],
          checkout: 'main',
        },
        starter: [],
        reference: [{ write: { 'answer.txt': '2\n' } }, 'git add answer.txt', 'git commit -m "Record how far feature has diverged"'],
        traps: [
          [{ write: { 'answer.txt': '1\n' } }, 'git add answer.txt', 'git commit -m "answer"'],
          [{ write: { 'answer.txt': '2\n' } }, 'git add answer.txt', 'git commit -m "answer"', 'git checkout feature'],
        ],
        cases: [
          { label: 'answer.txt says 2', check: "(await file('answer.txt')) === '2\\n'" },
          { label: 'still on main', check: "(await branch()) === 'main'" },
          { label: "main's own history is unaffected", check: "(await fileAt('main', 'app.js')) === 'v1\\n'" },
        ],
        walkthrough:
          '`git log main..feature --oneline` (or comparing `git log feature` against `git log main`) lists exactly the commits feature has that main doesn’t — two of them here. No need to check anything out.',
      },
    },
    {
      id: 'git-fast-forward-merge',
      title: 'Fast-forward merges',
      blurb: 'When the target branch never moved, merging is just catching its pointer up.',
      kind: 'code',
      practice: {
        prompt: 'main hasn’t moved since "feature" branched off. Merge feature into main.',
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
          { label: 'main now matches feature’s content', check: "(await file('a.txt')) === 'v2\\n'" },
          { label: 'no extra merge commit was created (a true fast-forward)', check: '(await commitCount()) === 2' },
          { label: 'main and feature point at the exact same commit', check: "(await log('main'))[0].oid === (await log('feature'))[0].oid" },
        ],
        walkthrough:
          'Since main never moved, feature is already "ahead" in a straight line — Git just slides main’s pointer forward to match feature. No new commit is needed. `--no-ff` would force one anyway, which is why it’s the trap here.',
      },
    },
    {
      id: 'git-three-way-merge',
      title: 'Merges that create a real commit',
      blurb: 'When both sides moved independently, Git combines them into a brand-new merge commit.',
      kind: 'code',
      practice: {
        prompt: 'Both main and feature added different files since they diverged. Merge feature into main.',
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
          { label: 'search.js is present after merging', check: "(await file('search.js')) === 'function search() {}\\n'" },
          { label: 'logger.js is still present', check: "(await file('logger.js')) === 'function log() {}\\n'" },
          { label: 'a real merge commit was created (two parents)', check: '(await log())[0].parents.length === 2' },
          { label: 'you ended up on main', check: "(await branch()) === 'main'" },
        ],
        walkthrough:
          'Neither branch is a straight-line ahead of the other, so Git can’t just fast-forward. It automatically combines both sets of changes (they touch different files, so there’s nothing to conflict) into one new commit with two parents.',
      },
    },
    learn(
      'git-why-conflicts-happen',
      'Why merge conflicts happen',
      'Not a bug — just two changes Git genuinely can’t choose between on its own.',
      [
        {
          q: 'A merge conflict happens when...',
          options: [
            'Git cannot connect to the internet',
            'Two branches changed the exact same part of a file in different ways, and Git can’t automatically decide which version is "right"',
            'You tried to merge a branch into itself',
            'You forgot to run git add before committing',
          ],
          answer: 1,
          why: 'Git can automatically combine changes that don’t overlap. A conflict only happens when both sides touched the same lines differently and a human has to decide.',
        },
        {
          q: 'When a merge hits a conflict, what does Git do to the working directory?',
          options: [
            'Deletes the conflicting file entirely',
            'Leaves the file with special markers (<<<<<<<, =======, >>>>>>>) showing both versions, so you can decide',
            'Silently keeps your version and discards theirs with no warning',
            'Reverts you to the commit before the merge started, as if nothing happened',
          ],
          answer: 1,
          why: 'Git writes both conflicting versions into the file, separated by markers, and pauses the merge until you resolve it by hand.',
        },
        {
          q: 'In the markers below, what does the first section represent?\n\n```\n<<<<<<< main\nversion A\n=======\nversion B\n>>>>>>> feature\n```',
          options: [
            'An old, deleted version nobody wants',
            'The content from the branch you are currently on (main)',
            'The content from the feature branch',
            'A syntax error that broke the file',
          ],
          answer: 1,
          why: 'The label after the first marker (`<<<<<<< main`) names whose content follows — here, your current branch’s version comes first, then `theirs` after the `=======`.',
        },
        {
          q: 'After editing a conflicted file to keep the content you want (and removing the markers), what are the next two steps?',
          options: [
            'git commit immediately, markers and all',
            'git add the file, then git commit',
            'git push, then git pull',
            'git reset --hard, then start over',
          ],
          answer: 1,
          why: 'Staging the resolved file tells Git "this conflict is settled," and committing completes the paused merge as a normal (if two-parented) commit.',
        },
        {
          q: 'A merge conflict is best described as...',
          options: [
            'A bug in Git that rarely happens',
            'A normal, expected situation whenever two independent changes genuinely overlap — not a sign you did something wrong',
            'Something that can be permanently prevented by never using branches',
            'An error that corrupts your repository',
          ],
          answer: 1,
          why: 'Conflicts are just Git asking for help on a judgment call it can’t make safely on its own. Resolving one leaves your repository completely healthy.',
        },
      ]
    ),
    {
      id: 'git-resolve-merge-conflict',
      title: 'Resolving a merge conflict',
      blurb: 'Edit, stage, commit — the merge that was paused becomes a normal commit again.',
      kind: 'code',
      practice: {
        prompt:
          'A merge of "feature" into "main" is already in progress and hit a conflict in config.txt. Resolve it by keeping "timeout=60" (feature’s value), then complete the merge.',
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
        reference: [
          { write: { 'config.txt': 'timeout=60\n' } },
          'git add config.txt',
          'git commit -m "Merge feature into main, keep feature timeout"',
        ],
        traps: [
          [{ write: { 'config.txt': 'timeout=60\n' } }, 'git add config.txt'],
          [{ write: { 'config.txt': 'timeout=99\n' } }, 'git add config.txt', 'git commit -m "merge"'],
        ],
        cases: [
          { label: 'config.txt resolved to the agreed value', check: "(await file('config.txt')) === 'timeout=60\\n'" },
          { label: 'no conflict markers left in the file', check: "!(await conflicted('config.txt'))" },
          { label: 'the merge completed as a real merge commit', check: '(await log())[0].parents.length === 2' },
          { label: 'the merge is no longer in progress', check: '!(await mergeInProgress())' },
        ],
        walkthrough:
          'Edit config.txt to the content you want (no markers left), `git add config.txt` to mark it resolved, then a plain `git commit` — Git already remembers this commit needs two parents, so it finishes the merge for you.',
      },
    },
    {
      id: 'git-abort-merge',
      title: 'Backing out of a merge entirely',
      blurb: 'Changed your mind mid-conflict? git merge --abort undoes the whole attempt.',
      kind: 'code',
      practice: {
        prompt: 'A merge of "feature" into "main" hit a conflict in data.txt. Actually, now isn’t a good time — abort the merge and get back to a clean state.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'base', files: { 'data.txt': 'v1\n' } }],
          branches: [
            { name: 'feature', commits: [{ message: 'feature edit', files: { 'data.txt': 'feature-ver\n' } }] },
            { name: 'main', commits: [{ message: 'main edit', files: { 'data.txt': 'main-ver\n' } }] },
          ],
          mergeAttempt: { into: 'main', from: 'feature' },
        },
        starter: [],
        reference: ['git merge --abort'],
        traps: [[{ write: { 'data.txt': 'main-ver\n' } }, 'git add data.txt']],
        cases: [
          { label: 'the merge is no longer in progress', check: '!(await mergeInProgress())' },
          { label: 'data.txt is back to main’s pre-merge content', check: "(await file('data.txt')) === 'main-ver\\n'" },
          { label: 'working tree is clean', check: 'clean()' },
        ],
        walkthrough:
          '`git merge --abort` throws away the whole in-progress merge attempt, restoring every file to exactly how it was on main before you ran `git merge`.',
      },
    },
    {
      id: 'git-delete-branch',
      title: 'Deleting a merged branch',
      blurb: 'Once its work is safely part of another branch, a branch is just clutter.',
      kind: 'code',
      practice: {
        prompt: '"old-feature" was already merged into main. Delete it — it’s no longer needed.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'base', files: { 'a.txt': 'v1\n' } }],
          branches: [{ name: 'old-feature', commits: [{ message: 'old feature work', files: { 'a.txt': 'v2\n' } }] }],
          mergeAttempt: { into: 'main', from: 'old-feature' },
          checkout: 'main',
        },
        starter: [],
        reference: ['git branch -d old-feature'],
        traps: [['git branch -m old-feature archived-feature'], ['git checkout old-feature']],
        cases: [
          { label: 'old-feature is gone and only main remains', check: "(await branches()).length === 1 && (await branches()).includes('main')" },
          { label: 'main’s content is intact', check: "(await file('a.txt')) === 'v2\\n'" },
        ],
        walkthrough:
          '`git branch -d old-feature` deletes it — and succeeds without complaint because Git can see every commit on old-feature is already reachable from main. Deleting an unmerged branch this way would be refused (that’s what `-D` is for).',
      },
    },
    {
      id: 'git-rename-branch',
      title: 'Renaming a branch',
      blurb: 'A bad branch name is a quick fix — your commits come along for the ride.',
      kind: 'code',
      practice: {
        prompt: 'You’re on a branch called "temp-fix-dont-use-this-name". Rename it to "hotfix-login-crash" without losing your work.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'base', files: { 'a.txt': 'v1\n' } }],
          branches: [{ name: 'temp-fix-dont-use-this-name', commits: [{ message: 'wip', files: { 'a.txt': 'v2\n' } }] }],
        },
        starter: [],
        reference: ['git branch -m hotfix-login-crash'],
        traps: [['git checkout -b hotfix-login-crash']],
        cases: [
          { label: 'the new name exists', check: "(await branches()).includes('hotfix-login-crash')" },
          { label: 'the old name is gone', check: "!(await branches()).includes('temp-fix-dont-use-this-name')" },
          { label: 'you’re on the renamed branch with its commit intact', check: "(await branch()) === 'hotfix-login-crash' && (await file('a.txt')) === 'v2\\n'" },
        ],
        walkthrough:
          '`git branch -m <new-name>` renames the current branch in place — same commits, same history, just a better label. Creating a new branch alongside it (`checkout -b`) would leave the badly-named one still sitting there.',
      },
    },
    {
      id: 'git-rebase-basics',
      title: 'Rebasing onto an updated main',
      blurb: 'Replay your branch’s commits on top of the latest main, instead of merging them in.',
      kind: 'code',
      practice: {
        prompt:
          'main has moved on since "feature" branched off. Replay feature’s commits on top of the latest main, so the history reads as one straight line — no merge commit.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'base', files: { 'app.js': 'v1\n' } }],
          branches: [
            {
              name: 'feature',
              commits: [
                { message: 'feature step 1', files: { 'feature.js': 'step1\n' } },
                { message: 'feature step 2', files: { 'feature.js': 'step1\nstep2\n' } },
              ],
            },
            { name: 'main', commits: [{ message: 'main progress', files: { 'app.js': 'v2\n' } }] },
          ],
          checkout: 'feature',
        },
        starter: [],
        reference: ['git rebase main'],
        traps: [['git merge main']],
        cases: [
          { label: 'feature now includes main’s progress', check: "(await file('app.js')) === 'v2\\n'" },
          { label: 'feature’s own work is all still there', check: "(await file('feature.js')) === 'step1\\nstep2\\n'" },
          { label: 'history stayed linear — no merge commit', check: '(await log()).every((c) => c.parents.length <= 1)' },
          { label: 'all four commits are present', check: '(await commitCount()) === 4' },
        ],
        walkthrough:
          '`git rebase main` moves feature’s two commits off their old starting point and replays them, one at a time, on top of main’s current tip — giving a straight-line history instead of the fork-and-rejoin shape a merge would leave. This rewrites feature’s commits into new ones, which is why rebasing is only safe on a branch nobody else has already pulled.',
      },
    },
    {
      id: 'git-workshop-branching',
      title: 'Workshop: ship a feature, the full branching loop',
      blurb: 'Resolve a real conflict, complete the merge, and clean up after yourself.',
      kind: 'code',
      practice: {
        prompt:
          'A merge of "feature" into "main" hit a conflict on shared.txt’s status line. Resolve it in favor of shipping ("status: shipped"), complete the merge, then delete the feature branch — its work is now part of main.',
        seed: {
          defaultBranch: 'main',
          commits: [{ message: 'base', files: { 'shared.txt': 'status: pending\n', 'app.js': 'v1\n' } }],
          branches: [
            { name: 'feature', commits: [{ message: 'feature ready to ship', files: { 'shared.txt': 'status: shipped\n' } }] },
            { name: 'main', commits: [{ message: 'main blocks release', files: { 'shared.txt': 'status: blocked\n' } }] },
          ],
          mergeAttempt: { into: 'main', from: 'feature' },
        },
        starter: [],
        reference: [
          { write: { 'shared.txt': 'status: shipped\n' } },
          'git add shared.txt',
          'git commit -m "Merge feature into main, ship it"',
          'git branch -d feature',
        ],
        traps: [
          [{ write: { 'shared.txt': 'status: shipped\n' } }, 'git add shared.txt', 'git commit -m "merge"'],
          [{ write: { 'shared.txt': 'status: blocked\n' } }, 'git add shared.txt', 'git commit -m "merge"', 'git branch -d feature'],
        ],
        cases: [
          { label: 'shared.txt resolved to shipped', check: "(await file('shared.txt')) === 'status: shipped\\n'" },
          { label: 'the merge completed with a real merge commit', check: '(await log())[0].parents.length === 2' },
          { label: 'the merge is no longer in progress', check: '!(await mergeInProgress())' },
          { label: 'the feature branch was cleaned up', check: "!(await branches()).includes('feature')" },
        ],
        walkthrough:
          'Resolve shared.txt to the shipped content, stage and commit it to complete the paused merge, then `git branch -d feature` — safe now that every one of its commits is reachable from main.',
      },
    },
  ],
}
