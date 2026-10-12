const learn = (id, title, blurb, check) => ({ id, title, blurb, kind: 'learn', check })

const REPO = 'https://github.com/dataout-labs/launchpad.git'

export const remotesSection = {
  id: 'remotes',
  title: 'Remotes & Collaboration',
  intro: 'Your commits don’t help anyone until they’re somewhere others can see them. A remote is just another git repository — usually one you can’t edit directly — that you exchange commits with.',
  lessons: [
    learn(
      'git-what-is-a-remote',
      'What a remote actually is',
      'Not magic — just another git repository your local repo can exchange commits with.',
      [
        {
          q: 'What is a "remote" in Git?',
          options: [
            'A directory Git watches for changes automatically',
            'Another copy of the same repository — often on a server — that your local repo can exchange commits with',
            "A special branch that can't be deleted",
            'A setting that enables internet access for Git',
          ],
          answer: 1,
          why: 'A remote is just another git repository. You exchange commits with it explicitly, via fetch/push — nothing happens automatically in the background.',
        },
        {
          q: 'What is "origin"?',
          options: [
            'A reserved Git keyword that always means GitHub',
            'Just a conventional name for whichever remote you cloned from or added — not special to Git itself',
            'The very first commit in any repository',
            'A branch that can never be merged',
          ],
          answer: 1,
          why: '`origin` is a default name `git clone` happens to use — you could name a remote anything. Git treats it like any other remote name.',
        },
        {
          q: 'What is a remote-tracking branch like `origin/main`?',
          options: [
            "A live, always-current mirror of origin's main branch",
            "A local snapshot of where origin's main branch was as of your last fetch — it only updates when you fetch or pull",
            'A branch that only exists on the server, never locally',
            'The same object as your own local main branch',
          ],
          answer: 1,
          why: 'Remote-tracking branches are local bookmarks, updated only when you explicitly fetch or pull — not a live connection to the server.',
        },
        {
          q: "After cloning a repo, if you never run git fetch or git pull again, what happens to origin/main in your local copy?",
          options: [
            'It automatically updates whenever origin changes',
            'It stays frozen at whatever origin looked like when you cloned',
            'Git deletes it after a week',
            'It becomes identical to your local main forever',
          ],
          answer: 1,
          why: 'Tracking refs only move when you explicitly fetch or pull — Git never checks the network on its own.',
        },
        {
          q: "Why can't you usually edit a real remote repository's files directly, the way you edit your own working directory?",
          options: [
            "It's against the law",
            "It's typically a server you don't have a shell on — you interact with it only through Git's fetch/push protocol, not by editing files there",
            'Remotes are permanently read-only and can never receive new commits',
            'Remotes only store commit messages, not file contents',
          ],
          answer: 1,
          why: "You interact with a real remote purely through git operations (fetch, push) — there's no direct filesystem access, which is exactly why collaboration flows through commits.",
        },
      ]
    ),
    learn(
      'git-fetch-pull-push-map',
      'Fetch, pull, and push — the conceptual map',
      'Three different directions of movement. Mixing them up is the most common beginner mistake.',
      [
        {
          q: 'What does git fetch do?',
          options: [
            'Downloads new commits from the remote AND merges them into your current branch',
            'Downloads new commits from the remote into remote-tracking branches, without touching your local branches',
            'Uploads your local commits to the remote',
            "Deletes commits the remote doesn't have",
          ],
          answer: 1,
          why: 'Fetch only updates remote-tracking refs like origin/main — your own branches and working files are completely untouched.',
        },
        {
          q: 'What does git pull do, essentially?',
          options: [
            'Exactly the same thing as git fetch',
            'git fetch followed by merging the result into your current branch',
            'Uploads commits to origin',
            'Deletes your uncommitted changes',
          ],
          answer: 1,
          why: "Pull is fetch plus an automatic merge (or rebase, if configured) — it's the only one of the three that actually changes your current branch.",
        },
        {
          q: 'What does git push do?',
          options: [
            "Downloads the remote's latest commits",
            "Uploads your local branch's commits to update the matching branch on the remote",
            'Creates a brand-new remote repository',
            'Renames your current branch',
          ],
          answer: 1,
          why: 'Push is the one direction that sends your work outward, updating the remote to include commits it was missing.',
        },
        {
          q: 'Why would git push ever be rejected?',
          options: [
            'Pushing is always instantly accepted no matter what',
            "The remote has a commit you don't have locally yet — pushing would overwrite history it already has, so Git refuses until you integrate that first",
            'Your internet connection is too fast',
            'You are only allowed to push once per day',
          ],
          answer: 1,
          why: "Git protects the remote from silently losing commits — if it's moved on since you last synced, you need to fetch/pull before you can push.",
        },
        {
          q: "You want to see what's new on the remote WITHOUT touching your own current work yet. Which single command is the right one?",
          options: ['git push', 'git pull', 'git fetch', 'git commit'],
          answer: 2,
          why: 'Fetch is the inspect-only move — it brings the information in without merging anything into your current branch.',
        },
      ]
    ),
    {
      id: 'git-clone-basics',
      title: 'git clone: getting a remote onto your machine',
      blurb: 'Copies a whole history, sets up tracking, and checks out a branch — all in one command.',
      kind: 'code',
      practice: {
        prompt: `Clone the team's "launchpad" project from ${REPO} — it already has a history you don't have yet.`,
        seed: {
          remote: {
            commits: [
              { message: 'Initial commit', files: { 'README.md': '# Launchpad\n' } },
              { message: 'Add server entrypoint', files: { 'server.js': 'console.log("starting...")\n' } },
            ],
          },
        },
        starter: [],
        reference: [`git clone ${REPO}`],
        traps: [['git init'], [{ write: { 'README.md': '# Launchpad\n' } }, 'git add README.md', 'git commit -m "Initial commit"']],
        cases: [
          { label: 'log has the full remote history (2 commits)', check: '(await log()).length === 2' },
          { label: 'on the main branch', check: "(await branch()) === 'main'" },
          { label: 'origin remote is configured', check: 'await hasRemote()' },
          { label: 'local main matches origin/main exactly', check: '(await head()) === (await trackingHead())' },
          { label: 'server.js is present with the right content', check: "(await file('server.js')) === 'console.log(\"starting...\")\\n'" },
        ],
        walkthrough: `git clone ${REPO} copies every commit from the remote's history into a brand-new local repo, sets up origin as a remote pointing at that url, creates origin/main as a remote-tracking branch, and checks out a local main that starts out identical to it.`,
      },
    },
    {
      id: 'git-remote-add',
      title: 'git remote add: connecting an existing repo',
      blurb: 'Already have local history? Point it at a remote without fetching anything yet.',
      kind: 'code',
      practice: {
        prompt: `You already have a local repo with its own history. Connect it to the team's remote at ${REPO} by adding it as "origin" — don't fetch or pull anything yet.`,
        seed: { commits: [{ message: 'Local start', files: { 'notes.txt': 'local work\n' } }] },
        starter: [],
        reference: [`git remote add origin ${REPO}`],
        traps: [[`git remote add upstream ${REPO}`], [`git clone ${REPO}`]],
        cases: [
          { label: 'origin remote configured with the correct url', check: `(await remotes()).some((r) => r.remote === 'origin' && r.url === '${REPO}')` },
          { label: 'local history is untouched (still just your 1 commit)', check: '(await log()).length === 1' },
          { label: 'notes.txt still has your local content', check: "(await file('notes.txt')) === 'local work\\n'" },
        ],
        walkthrough: "git remote add origin <url> just records a name-to-url mapping in your repo's config — it doesn't fetch or change anything yet. You'd run git fetch or git pull separately to actually bring in its history.",
      },
    },
    {
      id: 'git-fetch-basics',
      title: 'git fetch: downloading without merging',
      blurb: 'Bring in new commits from origin — your own branch stays exactly where it was.',
      kind: 'code',
      practice: {
        prompt: "The team pushed a new commit to origin since you cloned. Fetch it — without touching your own main branch.",
        seed: {
          remote: { commits: [{ message: 'Initial commit', files: { 'README.md': '# Launchpad\n' } }] },
          cloneFromRemote: { url: REPO },
          remoteAdvanceAfterClone: { commits: [{ message: 'Add login feature', files: { 'login.js': 'function login() {}\n' } }] },
        },
        starter: [],
        reference: ['git fetch'],
        traps: [['git pull'], ['git remote -v']],
        cases: [
          { label: 'origin/main now shows 2 commits', check: '(await trackingLog()).length === 2' },
          { label: "login.js is visible via origin (not yet merged into your main)", check: "(await remoteFileAt('main', 'login.js')) === 'function login() {}\\n'" },
          { label: 'your local main is untouched', check: '(await log()).length === 1' },
        ],
        walkthrough: 'git fetch copies every new commit from origin into your local copy and moves the origin/main tracking ref to match — but it never touches your own main branch or working files. You decide separately (with merge or pull) whether and when to bring those changes in.',
      },
    },
    {
      id: 'git-inspect-before-merging',
      title: 'Inspecting what a fetch brought in',
      blurb: "You've fetched — now look before you merge.",
      kind: 'code',
      practice: {
        prompt: "You've already fetched, so origin/main has 2 more commits than your main. Without merging anything, figure out exactly how many, then write that number into answer.txt on main and commit it.",
        seed: {
          remote: { commits: [{ message: 'Initial commit', files: { 'README.md': '# Launchpad\n' } }] },
          cloneFromRemote: { url: REPO },
          remoteAdvanceAfterClone: {
            commits: [
              { message: 'Add login feature', files: { 'login.js': 'function login() {}\n' } },
              { message: 'Add logout feature', files: { 'logout.js': 'function logout() {}\n' } },
            ],
          },
          fetchAfterClone: true,
        },
        starter: [],
        reference: [{ write: { 'answer.txt': '2\n' } }, 'git add answer.txt', 'git commit -m "Record how far origin has moved"'],
        traps: [
          [{ write: { 'answer.txt': '1\n' } }, 'git add answer.txt', 'git commit -m "answer"'],
          [{ write: { 'answer.txt': '2\n' } }, 'git add answer.txt', 'git commit -m "answer"', 'git merge origin/main'],
        ],
        cases: [
          { label: 'answer.txt says 2', check: "(await file('answer.txt')) === '2\\n'" },
          { label: 'nothing was merged — just your one answer commit on top', check: '(await commitCount()) === 2' },
        ],
        walkthrough: 'Comparing git log origin/main against git log main (or git log main..origin/main) lists exactly the commits origin has that main doesn’t yet — two of them here, without merging or switching anything.',
      },
    },
    {
      id: 'git-pull-fast-forward',
      title: 'git pull: the clean case',
      blurb: "Fetch and merge in one step — when your branch hasn't moved, it's just a fast-forward.",
      kind: 'code',
      practice: {
        prompt: "Your main hasn't changed since you cloned, and origin has moved on. Pull the latest changes in.",
        seed: {
          remote: { commits: [{ message: 'Initial commit', files: { 'README.md': '# Launchpad\n' } }] },
          cloneFromRemote: { url: REPO },
          remoteAdvanceAfterClone: { commits: [{ message: 'Add feature flag support', files: { 'feature.js': 'export const ready = true\n' } }] },
        },
        starter: [],
        reference: ['git pull'],
        traps: [['git fetch'], ['git merge origin/main']],
        cases: [
          { label: 'main now has 2 commits', check: '(await commitCount()) === 2' },
          { label: 'the new file from origin is present', check: "(await file('feature.js')) === 'export const ready = true\\n'" },
          { label: 'it was a clean fast-forward (no extra merge commit)', check: '(await log())[0].parents.length <= 1' },
        ],
        walkthrough: "Since your main hasn't diverged, git pull (fetch + merge in one step) just fast-forwards — main's pointer slides forward to match origin/main, no new merge commit needed.",
      },
    },
    {
      id: 'git-pull-diverged-merge',
      title: "git pull when both sides moved",
      blurb: 'You committed locally, they committed on origin — pull combines both.',
      kind: 'code',
      practice: {
        prompt: 'You made a local commit, and so did the team (on origin) — your histories have diverged. Pull to bring origin’s work in and combine it with yours.',
        seed: {
          remote: { commits: [{ message: 'Initial commit', files: { 'README.md': '# Launchpad\n' } }] },
          cloneFromRemote: { url: REPO },
          commits: [{ message: 'My local change', files: { 'mine.js': 'local work\n' } }],
          remoteAdvanceAfterClone: { commits: [{ message: 'Team change', files: { 'theirs.js': 'team work\n' } }] },
        },
        starter: [],
        reference: ['git pull'],
        traps: [['git fetch'], ['git merge origin/main']],
        cases: [
          { label: 'both your and the team’s changes are present', check: "(await filesAt('HEAD')).includes('mine.js') && (await filesAt('HEAD')).includes('theirs.js')" },
          { label: 'a real merge commit was created (two parents)', check: '(await log())[0].parents.length === 2' },
        ],
        walkthrough: "Both sides added commits independently since you cloned, so there's no straight line to fast-forward along — git pull combines them into a new two-parent merge commit, same as merging any other diverged branch.",
      },
    },
    {
      id: 'git-pull-conflict',
      title: 'When a pull conflicts',
      blurb: 'Same mechanics as a conflicted merge — because under the hood, that’s exactly what it is.',
      kind: 'code',
      practice: {
        prompt: 'You and the team both edited the same line of shared.txt since you cloned. A pull was attempted and hit a conflict — resolve it by keeping the team’s version, and complete the merge.',
        seed: {
          remote: { commits: [{ message: 'Initial commit', files: { 'shared.txt': 'status: draft\n' } }] },
          cloneFromRemote: { url: REPO },
          commits: [{ message: 'My status update', files: { 'shared.txt': 'status: in review\n' } }],
          remoteAdvanceAfterClone: { commits: [{ message: "Team's status update", files: { 'shared.txt': 'status: approved\n' } }] },
          pullAttempt: {},
        },
        starter: [],
        reference: [{ write: { 'shared.txt': 'status: approved\n' } }, 'git add shared.txt', 'git commit -m "Merge origin/main, keep team status"'],
        traps: [
          [{ write: { 'shared.txt': 'status: approved\n' } }, 'git add shared.txt'],
          [{ write: { 'shared.txt': 'status: mixed\n' } }, 'git add shared.txt', 'git commit -m "merge"'],
        ],
        cases: [
          { label: 'shared.txt resolved to the team’s version', check: "(await file('shared.txt')) === 'status: approved\\n'" },
          { label: 'no conflict markers remain', check: "!(await conflicted('shared.txt'))" },
          { label: 'the merge completed as a real two-parent commit', check: '(await log())[0].parents.length === 2' },
          { label: 'the merge is no longer in progress', check: '!(await mergeInProgress())' },
        ],
        walkthrough: "This repo was already mid-pull when the conflict hit, exactly how a real git pull would leave it. Resolve shared.txt by hand to the content you want, git add it, then a plain git commit finishes the paused merge — identical to finishing any other conflicted merge.",
      },
    },
    {
      id: 'git-push-basics',
      title: 'git push: sharing your commits',
      blurb: 'Upload your branch so origin — and your team — has it too.',
      kind: 'code',
      practice: {
        prompt: "You've committed locally and origin hasn't changed since you cloned. Push your commit up.",
        seed: {
          remote: { commits: [{ message: 'Initial commit', files: { 'README.md': '# Launchpad\n' } }] },
          cloneFromRemote: { url: REPO },
          commits: [{ message: 'Add changelog entry', files: { 'CHANGELOG.md': '- Initial release\n' } }],
        },
        starter: [],
        reference: ['git push'],
        traps: [['git commit --amend -m "oops"'], ['git fetch']],
        cases: [
          { label: 'the remote now has 2 commits', check: '(await remoteLog()).length === 2' },
          { label: 'CHANGELOG.md is visible on the remote', check: "(await remoteFileAt('main', 'CHANGELOG.md')) === '- Initial release\\n'" },
          { label: 'your local tracking ref caught up too', check: '(await trackingLog()).length === 2' },
        ],
        walkthrough: "With nothing new on origin since you cloned, this is a straightforward fast-forward push — your commit uploads, origin's main moves to match, and your own origin/main tracking ref updates to reflect it.",
      },
    },
    {
      id: 'git-push-rejected',
      title: 'When a push gets rejected',
      blurb: 'Origin moved on without you — integrate its changes before yours can land.',
      kind: 'code',
      practice: {
        prompt: 'You committed locally, but the team also pushed to origin since you cloned — your branches have diverged. Pull first, then push.',
        seed: {
          remote: { commits: [{ message: 'Initial commit', files: { 'README.md': '# Launchpad\n' } }] },
          cloneFromRemote: { url: REPO },
          commits: [{ message: 'My local commit', files: { 'mine.js': 'work\n' } }],
          remoteAdvanceAfterClone: { commits: [{ message: 'Teammate pushed first', files: { 'theirs.js': 'other work\n' } }] },
        },
        starter: [],
        reference: ['git pull', 'git push'],
        traps: [['git pull'], ['git push']],
        cases: [
          { label: 'the remote now has all 4 commits (base, yours, theirs, and the merge)', check: '(await remoteLog()).length === 4' },
          { label: 'both files are present on the remote', check: "(await remoteFileAt('main', 'mine.js')) !== null && (await remoteFileAt('main', 'theirs.js')) !== null" },
          { label: 'your local branch is fully in sync with origin', check: '(await head()) === (await trackingHead())' },
        ],
        walkthrough: "A first git push here would be rejected — origin has a commit (the teammate's) that you don't have yet, so Git refuses to overwrite it. git pull brings that commit in and merges it with yours (clean, since they touched different files), and only then does git push succeed, since your branch is now a proper descendant of origin's.",
      },
    },
    learn(
      'git-upstream-tracking',
      'Upstream tracking branches',
      'Why git push and git pull can run with zero arguments once a branch knows where it belongs.',
      [
        {
          q: 'What does it mean for a local branch to have an "upstream" (tracking) branch set?',
          options: [
            'It is permanently locked to that remote branch and can never push anywhere else',
            'It just remembers which remote branch it corresponds to, so bare git push/git pull know where to go without typing the remote and branch name every time',
            'It means the branch has been deleted',
            'It is a security feature that encrypts your commits',
          ],
          answer: 1,
          why: "Upstream tracking is just a remembered default — it saves typing, it doesn't restrict anything.",
        },
        {
          q: 'When does a newly created local branch typically NOT have an upstream set yet?',
          options: [
            'Never — all branches always have one automatically',
            "Right after you create it locally (git branch / git checkout -b) — it doesn't know about any remote until you push it there",
            'Only on weekends',
            'Only if the branch name is longer than 10 characters',
          ],
          answer: 1,
          why: "A brand-new local branch has no remote counterpart yet — you have to push it and set tracking before bare push/pull will know where it goes.",
        },
        {
          q: 'What does git push -u origin feature-x (or --set-upstream) do beyond a normal push?',
          options: [
            'Nothing different at all',
            'It pushes the branch to origin AND records that feature-x should track origin/feature-x, so future plain git push/git pull on this branch just work',
            'It deletes the branch from your local machine after pushing',
            'It force-pushes, overwriting anything already there',
          ],
          answer: 1,
          why: "-u does the push and sets up tracking in one step — that's specifically why it's worth using the first time you push a new branch.",
        },
        {
          q: "After you've set upstream tracking once for a branch, what can you type instead of git push origin feature-x?",
          options: ['git upload', 'A bare git push', 'git send', 'There is no shorter form, ever'],
          answer: 1,
          why: 'Once tracking is set, Git already knows the remote and branch — a bare git push (or git pull) is enough.',
        },
        {
          q: 'You clone a repository with git clone <url>. Does the branch you land on already have upstream tracking set?',
          options: [
            'No — clone never sets this up; you must always configure it by hand afterward',
            'Yes — clone automatically sets your checked-out branch to track the matching branch on the remote you cloned from',
            'Only if you pass a special --track flag',
            "Only for branches named 'main'",
          ],
          answer: 1,
          why: "Clone sets this up for you immediately — it's only branches you create yourself afterward (like a new feature branch) that need an explicit -u the first time you push them.",
        },
      ]
    ),
    {
      id: 'git-push-new-branch',
      title: 'Pushing a brand-new branch',
      blurb: 'Share work origin has never seen before, and set it up to track there.',
      kind: 'code',
      practice: {
        prompt: `You built a feature on a new local branch called "dark-mode". origin doesn't have this branch yet. Push it there for the first time, setting it to track origin.`,
        seed: {
          remote: { commits: [{ message: 'Initial commit', files: { 'README.md': '# Launchpad\n' } }] },
          cloneFromRemote: { url: REPO },
          branches: [{ name: 'dark-mode', commits: [{ message: 'Add dark mode toggle', files: { 'theme.js': 'let dark = true\n' } }] }],
          checkout: 'dark-mode',
        },
        starter: [],
        reference: ['git push -u origin dark-mode'],
        traps: [['git commit --amend -m "oops"'], ['git branch -m dark-mode renamed-feature']],
        cases: [
          { label: 'origin now has a dark-mode branch', check: "(await remoteBranches()).includes('dark-mode')" },
          { label: 'its content matches what you pushed', check: "(await remoteFileAt('dark-mode', 'theme.js')) === 'let dark = true\\n'" },
          { label: 'your local tracking ref was set up too', check: "(await trackingHead('origin/dark-mode')) !== null" },
        ],
        walkthrough: 'git push -u origin dark-mode uploads the branch to origin for the very first time AND sets up tracking, so from now on a bare git push/git pull while on dark-mode knows exactly where to go.',
      },
    },
    {
      id: 'git-workshop-collaboration',
      title: 'Workshop: clone, branch, ship',
      blurb: 'The full loop — clone a real project, build a feature in isolation, and push it for the team to see.',
      kind: 'code',
      practice: {
        prompt: `Clone the team's project from ${REPO}. Then create a new branch called "search-bar", add search.js with the content "function search() {}\\n", commit it, and push the branch to origin so your teammates can see it.`,
        seed: {
          remote: {
            commits: [
              { message: 'Initial commit', files: { 'README.md': '# Launchpad\n' } },
              { message: 'Add config loader', files: { 'config.js': 'module.exports = {}\n' } },
            ],
          },
        },
        starter: [],
        reference: [
          `git clone ${REPO}`,
          'git checkout -b search-bar',
          { write: { 'search.js': 'function search() {}\n' } },
          'git add search.js',
          'git commit -m "Add search bar"',
          'git push -u origin search-bar',
        ],
        traps: [
          [`git clone ${REPO}`, { write: { 'search.js': 'function search() {}\n' } }, 'git add search.js', 'git commit -m "Add search bar"'],
          [`git clone ${REPO}`, 'git checkout -b search-bar', { write: { 'search.js': 'function search() {}\n' } }, 'git add search.js', 'git commit -m "Add search bar"'],
        ],
        cases: [
          { label: 'origin now has a search-bar branch', check: "(await remoteBranches()).includes('search-bar')" },
          { label: 'it contains your search.js', check: "(await remoteFileAt('search-bar', 'search.js')) === 'function search() {}\\n'" },
          { label: "origin's main is untouched by your feature work", check: "(await remoteFileAt('main', 'search.js')) === null" },
          { label: 'you ended up on search-bar locally, with everything cloned', check: "(await branch()) === 'search-bar' && (await filesAt('HEAD')).includes('config.js')" },
        ],
        walkthrough: "git clone brings in the team's existing history. Creating search-bar and committing there (instead of directly on main) keeps your feature isolated until it's ready. git push -u origin search-bar uploads it as a brand-new branch and sets up tracking — main itself is never touched by any of this, exactly as a real feature-branch workflow should look.",
      },
    },
  ],
}
