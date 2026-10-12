const learn = (id, title, blurb, check) => ({ id, title, blurb, kind: 'learn', check })

const REPO = 'https://github.com/dataout-labs/launchpad.git'

export const advancedSection = {
  id: 'advanced',
  title: 'Advanced Git & Real Workflows',
  intro: 'The everyday loop is second nature by now. This section covers the tools that come out when something goes wrong, history needs cleaning up before a PR, or you’re hunting down exactly which commit broke something.',
  lessons: [
    learn(
      'git-detached-head',
      'Detached HEAD state',
      'Checking out a commit directly, instead of a branch, puts you somewhere real but temporary.',
      [
        {
          q: 'What does it mean for HEAD to be "detached"?',
          options: [
            'Your repository is corrupted and needs to be re-cloned',
            'HEAD points directly at a commit instead of at a branch name — there is no branch following you around as you commit',
            'You have permanently lost all your commit history',
            'You are offline and cannot sync with a remote',
          ],
          answer: 1,
          why: 'Normally HEAD points at a branch, which points at a commit. Detached HEAD skips the branch — HEAD points straight at a commit.',
        },
        {
          q: 'What typically puts you into detached HEAD state?',
          options: [
            'Running git commit on any branch',
            'Checking out a specific commit, tag, or other non-branch reference instead of a branch name',
            'Running git status',
            'Creating a new branch with git branch',
          ],
          answer: 1,
          why: 'git checkout <commit> (or <tag>) has nothing to attach a branch pointer to, so HEAD just points at that commit directly.',
        },
        {
          q: 'If you make new commits while in detached HEAD and then switch to a branch without saving your work, what happens to those commits?',
          options: [
            'They automatically merge into the branch you switch to',
            'They become unreachable from any branch and are effectively lost (until garbage collected) unless you created a branch or tag pointing at them first',
            'Git refuses to let you switch branches until you commit',
            'They are automatically converted into a stash',
          ],
          answer: 1,
          why: 'With no branch pointing at them, those commits become orphaned the moment you move HEAD elsewhere — real git keeps them a while via its own reflog, but nothing references them directly.',
        },
        {
          q: 'How do you get out of detached HEAD and back to normal branch-based work?',
          options: [
            'You cannot — detached HEAD is permanent',
            'Check out a branch name, e.g. git checkout main',
            'Run git reset --hard',
            'Delete the repository and clone again',
          ],
          answer: 1,
          why: 'Checking out any branch name re-attaches HEAD to it — the detached state was only ever about what HEAD currently points at.',
        },
        {
          q: 'Why is detached HEAD actually useful, rather than just a trap to avoid?',
          options: [
            'It is never useful — it should always be avoided',
            'It lets you look around at (or experiment from) a specific point in history — like an old tag — without needing to create a branch just to glance at it',
            'It permanently speeds up all git commands',
            'It is required before you can push',
          ],
          answer: 1,
          why: 'Inspecting an old release, or trying something experimental from a specific commit, is exactly what detached HEAD is for — you just need to create a branch (git checkout -b) before committing if you want to keep any work you do there.',
        },
      ]
    ),
    learn(
      'git-reflog-safety-net',
      'The reflog: your safety net',
      'A reset or rebase that "loses" a commit almost never actually destroys it right away.',
      [
        {
          q: 'What does git reflog track?',
          options: [
            'Every change ever made to every file in the project',
            'A local, chronological record of everywhere HEAD has pointed — every commit, reset, checkout, and more',
            'A list of all remotes you have ever connected to',
            'The commit messages of everyone who has ever contributed',
          ],
          answer: 1,
          why: 'Reflog is a log of HEAD movements on your own machine — not part of the project history itself, and not something that gets pushed or shared.',
        },
        {
          q: 'You just ran git reset --hard and realized it dropped a commit you needed. Is that commit actually gone?',
          options: [
            'Yes, permanently and immediately, with no way to recover it',
            'No — the commit object itself still exists; only the branch pointer moved away from it, and the reflog remembers where it used to be',
            'It depends on whether you had a backup',
            'Only if you also ran git gc at the same moment',
          ],
          answer: 1,
          why: "Reset moves a branch pointer; it doesn't delete the commit object the pointer used to reference. As long as you can find its oid (via reflog), it's recoverable.",
        },
        {
          q: 'What does HEAD@{2} refer to?',
          options: [
            'The second branch in alphabetical order',
            'Where HEAD was 2 entries ago in the reflog — HEAD@{0} is the current position, HEAD@{1} is one move before that, and so on',
            'The commit 2 days ago',
            'A syntax error — this is not valid git',
          ],
          answer: 1,
          why: 'The @{n} syntax indexes into the reflog, not into commit history by count or time — it answers "where was HEAD n moves ago," which is exactly what you need after an accidental reset.',
        },
        {
          q: "Once you find a lost commit's position via reflog, how do you actually recover it?",
          options: [
            'You cannot — reflog is read-only, for viewing history only',
            'Reset your branch to that reflog entry, e.g. git reset --hard HEAD@{2}',
            'Email the git maintainers',
            'Reinstall git',
          ],
          answer: 1,
          why: "HEAD@{n} is a normal, usable reference — anything that accepts a ref (reset, checkout, cherry-pick) accepts it too.",
        },
        {
          q: 'Is the reflog shared with your team when you push?',
          options: [
            'Yes, it is pushed along with your commits',
            'No — it is purely local to your own machine and is never transmitted anywhere',
            'Only if you use git push --with-reflog',
            'Only the most recent entry is shared',
          ],
          answer: 1,
          why: "Reflog is local bookkeeping about YOUR HEAD's movements, not part of the shared commit graph — it's exactly why it's such a good personal safety net.",
        },
      ]
    ),
    {
      id: 'git-stash-save-restore',
      title: "git stash: save and restore work-in-progress",
      blurb: 'Switch tasks without committing half-finished work — or losing it.',
      kind: 'code',
      practice: {
        prompt: 'You’re mid-edit on config.js (uncommitted) but need to fix an urgent typo in README.md first, on a clean tree. Stash your config.js work, fix the typo ("Projcet" → "Project") and commit that fix, then bring your WIP back.',
        seed: {
          commits: [{ message: 'init', files: { 'config.js': 'module.exports = { debug: false }\n', 'README.md': '# Projcet\n' } }],
          workingChanges: { 'config.js': 'module.exports = { debug: true } // WIP\n' },
        },
        starter: [],
        reference: ['git stash', { write: { 'README.md': '# Project\n' } }, 'git add README.md', 'git commit -m "Fix typo"', 'git stash pop'],
        traps: [
          ['git stash', { write: { 'README.md': '# Project\n' } }, 'git add README.md', 'git commit -m "Fix typo"'],
          ['git stash', { write: { 'README.md': '# Project\n' } }, 'git add README.md', 'git commit -m "Fix typo"', 'git stash drop'],
        ],
        cases: [
          { label: 'the typo fix was committed', check: "(await fileAt('HEAD', 'README.md')) === '# Project\\n'" },
          { label: 'your WIP config.js change is back', check: "(await file('config.js')) === 'module.exports = { debug: true } // WIP\\n'" },
          { label: 'nothing left in the stash', check: '(await stashList()).length === 0' },
        ],
        walkthrough: "`git stash` saves your uncommitted changes aside and reverts the working directory to match HEAD — a clean slate for the typo fix. `git stash pop` brings the saved WIP back AND removes it from the stash list, unlike `apply` (next lesson), which brings it back but leaves a copy behind.",
      },
    },
    {
      id: 'git-stash-multiple',
      title: 'Working with multiple stashes',
      blurb: 'Stashes stack up — list, apply, and drop them by index.',
      kind: 'code',
      practice: {
        prompt: "You have two stashes sitting around from earlier work. Restore ONLY the older one (the first one you stashed), and get rid of the newer one entirely — you don't need it.",
        seed: {
          commits: [{ message: 'init', files: { 'base.txt': 'base\n' } }],
          stashed: [
            { message: 'older work: add helper', changes: { 'helper.js': 'function helper() {}\n' } },
            { message: 'newer work: scratch notes', changes: { 'scratch.txt': 'ignore me\n' } },
          ],
        },
        starter: [],
        reference: ['git stash apply 1', 'git stash drop 0'],
        traps: [
          ['git stash drop 0', 'git stash apply 1'],
          ['git stash pop'],
        ],
        cases: [
          { label: 'the older stash content is restored (helper.js present)', check: "(await file('helper.js')) === 'function helper() {}\\n'" },
          { label: 'the newer stash content was discarded, not restored', check: "(await file('scratch.txt')) === null" },
          { label: 'the newer stash entry is gone, the older one remains', check: '(await stashList()).length === 1' },
        ],
        walkthrough: '`git stash list` shows the newest stash at stash@{0} and older ones at higher indices. `git stash apply <n>` restores a specific entry without removing it from the list; `git stash drop <n>` removes an entry without ever applying it. Apply the older one first, then drop the newer one — dropping first would shift the older entry’s index down to 0, not 1.',
      },
    },
    {
      id: 'git-checkout-detached',
      title: 'Checking out a commit directly',
      blurb: 'Step into history without disturbing any branch.',
      kind: 'code',
      practice: {
        prompt: "Check out the commit before the current one directly, by its relative reference (not a branch name), to see the project's earlier state.",
        seed: {
          commits: [
            { message: 'first commit', files: { 'a.txt': 'v1\n' } },
            { message: 'second commit', files: { 'a.txt': 'v2\n' } },
          ],
        },
        starter: [],
        reference: ['git checkout HEAD~1'],
        traps: [['git checkout main'], ['git reset --hard HEAD~1']],
        cases: [
          { label: 'HEAD is detached (not on any branch)', check: '(await branch()) === null' },
          { label: 'content matches the earlier commit', check: "(await file('a.txt')) === 'v1\\n'" },
          { label: 'main itself is untouched (still at the later commit)', check: "(await fileAt('main', 'a.txt')) === 'v2\\n'" },
        ],
        walkthrough: "`git checkout HEAD~1` moves you to the previous commit directly — since that's not a branch name, Git can't update any branch pointer to follow you, so you land in detached HEAD state instead. main itself never moves; you're just looking around from a specific point in history. Compare this with `git reset --hard`, which actually relocates the branch you're on, rather than just stepping off it temporarily.",
      },
    },
    {
      id: 'git-squash-soft-reset',
      title: 'Squashing commits with a soft reset',
      blurb: 'Turn a trail of WIP commits into one clean one, without losing any work.',
      kind: 'code',
      practice: {
        prompt: 'You made three small WIP commits that should really be one clean commit. Squash all three into a single commit titled "Add search feature", without losing any of the actual work.',
        seed: {
          commits: [
            { message: 'base', files: { 'readme.txt': 'readme\n' } },
            { message: 'wip: start search', files: { 'search.js': '// start\n' } },
            { message: 'wip: more search', files: { 'search.js': '// start\n// more\n' } },
            { message: 'wip: finish search', files: { 'search.js': '// start\n// more\n// done\n' } },
          ],
        },
        starter: [],
        reference: ['git reset --soft HEAD~3', 'git commit -m "Add search feature"'],
        traps: [
          ['git reset --hard HEAD~3', 'git commit -m "Add search feature"'],
          ['git reset --soft HEAD~1', 'git commit -m "Add search feature"'],
        ],
        cases: [
          { label: 'exactly 2 commits now (base + squashed)', check: '(await commitCount()) === 2' },
          { label: 'the squashed commit has the right message', check: "(await log())[0].message === 'Add search feature'" },
          { label: 'all the work survived (final search.js content intact)', check: "(await file('search.js')) === '// start\\n// more\\n// done\\n'" },
        ],
        walkthrough: '`git reset --soft HEAD~3` moves the branch pointer back 3 commits WITHOUT touching the index or working tree — so all the file changes from those 3 commits stay staged, ready to be committed as one. A single `git commit` afterward turns all of it into one clean commit. (`--hard` would have thrown the actual file changes away, not just the commit boundaries.)',
      },
    },
    {
      id: 'git-cherry-pick-single',
      title: 'git cherry-pick: applying one commit elsewhere',
      blurb: 'Bring in exactly one commit from another branch, without merging the whole thing.',
      kind: 'code',
      practice: {
        prompt: "A teammate's \"hotfix\" branch has exactly one commit you need on main right now — without merging the whole branch. Apply just that commit.",
        seed: {
          commits: [{ message: 'base', files: { 'app.js': 'v1\n' } }],
          branches: [{ name: 'hotfix', commits: [{ message: 'Fix crash on startup', files: { 'app.js': 'v1 // fixed\n' } }] }],
          checkout: 'main',
        },
        starter: [],
        reference: ['git cherry-pick hotfix'],
        traps: [['git merge hotfix'], ['git checkout hotfix']],
        cases: [
          { label: 'the fix is present on main', check: "(await file('app.js')) === 'v1 // fixed\\n'" },
          { label: 'main gained exactly one new commit', check: '(await commitCount()) === 2' },
          { label: 'a new commit was created (not just fast-forwarded to match hotfix)', check: "(await log())[0].oid !== (await log('hotfix'))[0].oid" },
          { label: 'you stayed on main (cherry-pick does not switch branches)', check: "(await branch()) === 'main'" },
        ],
        walkthrough: 'git cherry-pick copies the CONTENT of a single commit and creates a brand-new commit with it on your current branch — not the same commit object, just the same changes. Merging the whole hotfix branch would have brought in everything on it (and here, since main never diverged, would have just fast-forwarded to literally become hotfix — a very different outcome from cherry-picking just the one commit you needed).',
      },
    },
    {
      id: 'git-reorder-cherry-pick',
      title: 'Reordering commits',
      blurb: 'Two commits landed in the wrong order — fix it with a reset and a couple of cherry-picks.',
      kind: 'code',
      practice: {
        prompt: 'Your branch has two commits in the wrong order: "Add tests" landed before "Add feature", but it should read the other way for a clean history. Fix the order (Add feature, then Add tests), keeping both commits’ content.',
        seed: {
          commits: [{ message: 'base', files: { 'readme.txt': 'readme\n' } }],
          branches: [
            {
              name: 'feature',
              commits: [
                { message: 'Add tests', files: { 'tests.js': 'test code\n' } },
                { message: 'Add feature', files: { 'feature.js': 'feature code\n' } },
              ],
            },
          ],
          checkout: 'feature',
        },
        starter: [],
        reference: [
          'git tag orig-feature HEAD',
          'git tag orig-tests HEAD~1',
          'git reset --hard HEAD~2',
          'git cherry-pick orig-feature',
          'git cherry-pick orig-tests',
        ],
        traps: [
          [
            'git tag orig-feature HEAD',
            'git tag orig-tests HEAD~1',
            'git reset --hard HEAD~2',
            'git cherry-pick orig-tests',
            'git cherry-pick orig-feature',
          ],
          ['git reset --hard HEAD~1'],
        ],
        cases: [
          { label: 'both commits are still present (feature.js and tests.js)', check: "(await filesAt('HEAD')).includes('feature.js') && (await filesAt('HEAD')).includes('tests.js')" },
          { label: 'Add feature now comes before Add tests', check: "(await log())[0].message === 'Add tests' && (await log())[1].message === 'Add feature'" },
          { label: 'exactly 3 commits total (base + feature + tests)', check: '(await commitCount()) === 3' },
        ],
        walkthrough: 'Tag each original commit by name first (orig-feature, orig-tests) so they stay referenceable even after moving the branch — then reset --hard back to base (dropping both from the branch, though the tags still point to them) and cherry-pick them back on in the order you actually want.',
      },
    },
    {
      id: 'git-rebase-conflict-continue',
      title: 'When a rebase conflicts',
      blurb: 'Resolve it in place, then tell the rebase to keep going.',
      kind: 'code',
      practice: {
        prompt: 'A rebase of "feature" onto "main" is already in progress and hit a conflict in shared.txt. Resolve it by keeping "combined change", then continue the rebase.',
        seed: {
          commits: [{ message: 'base', files: { 'shared.txt': 'base\n' } }],
          branches: [
            { name: 'feature', commits: [{ message: 'feature edit', files: { 'shared.txt': 'feature change\n' } }] },
            { name: 'main', commits: [{ message: 'main edit', files: { 'shared.txt': 'main change\n' } }] },
          ],
          rebaseConflictAttempt: { onto: 'main', branch: 'feature' },
        },
        starter: [],
        reference: [{ write: { 'shared.txt': 'combined change\n' } }, 'git add shared.txt', 'git rebase --continue'],
        traps: [
          [{ write: { 'shared.txt': 'combined change\n' } }, 'git add shared.txt'],
          [{ write: { 'shared.txt': 'combined change\n' } }, 'git add shared.txt', 'git commit -m "manual"'],
        ],
        cases: [
          { label: 'shared.txt resolved correctly', check: "(await file('shared.txt')) === 'combined change\\n'" },
          { label: 'no conflict markers remain', check: "!(await conflicted('shared.txt'))" },
          { label: 'the rebase is no longer in progress', check: '!(await rebaseInProgress())' },
        ],
        walkthrough: 'Resolve shared.txt by hand, `git add` it to mark it resolved, then `git rebase --continue` — not a plain `git commit`. Continue finishes this step AND resumes replaying anything left in the rebase, properly clearing the in-progress state; a plain commit would resolve the content but leave the rebase technically still open.',
      },
    },
    {
      id: 'git-log-filtering',
      title: 'Filtering commit history',
      blurb: 'Narrow git log down to exactly the commits you care about.',
      kind: 'code',
      practice: {
        prompt: "Find out how many commits were authored by someone whose name contains \"Dana\", then write that count into answer.txt on main and commit it.",
        seed: {
          commits: [
            { message: 'Initial setup', files: { 'a.txt': '1\n' } },
            { message: 'Add login', files: { 'login.js': 'function login() {}\n' }, author: { name: 'Dana Lee', email: 'dana@dataout.dev' } },
            { message: 'Fix typo', files: { 'a.txt': '2\n' } },
            { message: 'Add logout', files: { 'logout.js': 'function logout() {}\n' }, author: { name: 'Dana Lee', email: 'dana@dataout.dev' } },
            { message: 'Update readme', files: { 'readme.txt': 'r\n' } },
          ],
        },
        starter: [],
        reference: [{ write: { 'answer.txt': '2\n' } }, 'git add answer.txt', 'git commit -m "Record Dana\'s commit count"'],
        traps: [
          [{ write: { 'answer.txt': '3\n' } }, 'git add answer.txt', 'git commit -m "answer"'],
          [{ write: { 'answer.txt': '5\n' } }, 'git add answer.txt', 'git commit -m "answer"'],
        ],
        cases: [
          { label: 'answer.txt says 2', check: "(await file('answer.txt')) === '2\\n'" },
          { label: 'exactly one answer commit was added', check: '(await commitCount()) === 6' },
        ],
        walkthrough: '`git log --author=Dana` filters the log down to just the commits whose author name contains that text — two of them here. Combined with `git log branchA..branchB` from earlier in this path, author and range filters are the two most common ways to cut a long history down to exactly what you’re looking for.',
      },
    },
    {
      id: 'git-bisect-workshop',
      title: 'git bisect: finding which commit broke something',
      blurb: 'A guided binary search through history, instead of checking every commit by hand.',
      kind: 'code',
      practice: {
        prompt: 'Somewhere between the first commit and the current tip (5 commits total), calc.js’s add function got broken — it now subtracts instead of adding. Bisect to find exactly which version introduced the bug, then write just its number (1-5) into answer.txt on main and commit it.',
        seed: {
          commits: [
            { message: 'v1', files: { 'calc.js': 'function add(a,b){return a+b}\n' } },
            { message: 'v2', files: { 'calc.js': 'function add(a,b){return a+b}\nfunction sub(a,b){return a-b}\n' } },
            { message: 'v3', files: { 'calc.js': 'function add(a,b){return a-b} // BUG\nfunction sub(a,b){return a-b}\n' } },
            { message: 'v4', files: { 'calc.js': 'function add(a,b){return a-b} // BUG\nfunction sub(a,b){return a-b}\nfunction mul(a,b){return a*b}\n' } },
            { message: 'v5', files: { 'calc.js': 'function add(a,b){return a-b} // BUG\nfunction sub(a,b){return a-b}\nfunction mul(a,b){return a*b}\nfunction div(a,b){return a/b}\n' } },
          ],
        },
        starter: [],
        reference: [
          'git bisect start',
          'git bisect bad',
          'git bisect good HEAD~4',
          'git bisect bad',
          'git bisect good',
          'git bisect reset',
          { write: { 'answer.txt': '3\n' } },
          'git add answer.txt',
          'git commit -m "Found the culprit: v3"',
        ],
        traps: [
          [{ write: { 'answer.txt': '2\n' } }, 'git add answer.txt', 'git commit -m "wrong"'],
          [{ write: { 'answer.txt': '4\n' } }, 'git add answer.txt', 'git commit -m "wrong"'],
        ],
        cases: [
          { label: 'answer.txt correctly identifies v3', check: "(await file('answer.txt')) === '3\\n'" },
          { label: 'the bisect session ended cleanly, back on main', check: "!(await bisectInProgress()) && (await branch()) === 'main'" },
        ],
        walkthrough: '`git bisect start`, then mark the current tip bad and an old known-good commit good — bisect checks out the midpoint automatically. Inspect calc.js there, mark it good or bad based on whether the bug is present, and repeat; each answer halves the remaining range until bisect names the exact first bad commit. `git bisect reset` returns you to where you started once you’re done.',
      },
    },
    {
      id: 'git-reflog-recovery',
      title: 'Recovering a lost commit with reflog',
      blurb: 'An accidental reset --hard almost never actually destroys your work.',
      kind: 'code',
      practice: {
        prompt: 'Commit your fix to a.txt, then accidentally run `git reset --hard HEAD~1` and realize afterward it threw that commit away. Use the reflog to recover it.',
        seed: { commits: [{ message: 'commit 1: setup', files: { 'a.txt': 'v1\n' } }] },
        starter: [],
        reference: [
          { write: { 'a.txt': 'v2 fixed\n' } },
          'git add a.txt',
          'git commit -m "commit 2: important fix"',
          'git reset --hard HEAD~1',
          'git reset --hard HEAD@{1}',
        ],
        traps: [
          [{ write: { 'a.txt': 'v2 fixed\n' } }, 'git add a.txt', 'git commit -m "commit 2: important fix"', 'git reset --hard HEAD~1'],
          [
            { write: { 'a.txt': 'v2 fixed\n' } },
            'git add a.txt',
            'git commit -m "commit 2: important fix"',
            'git reset --hard HEAD~1',
            { write: { 'a.txt': 'v2 fixed\n' } },
            'git add a.txt',
            'git commit -m "redo"',
          ],
        ],
        cases: [
          { label: 'commit 2 is recovered (log has both commits again)', check: '(await log()).length === 2' },
          { label: 'the recovered content is correct', check: "(await file('a.txt')) === 'v2 fixed\\n'" },
          { label: 'HEAD is the literal original commit (reflog-recovered, not redone)', check: '(await head()) === (await reflog()).at(-1).oid' },
        ],
        walkthrough: 'Every commit and reset in this sandbox is logged to a simplified reflog, newest first. After the accidental reset, `git reflog` shows HEAD@{1} is exactly where you were right before it — the "important fix" commit, still intact as a real object even though no branch points at it anymore. `git reset --hard HEAD@{1}` moves main back to point at it directly — the SAME commit object, not a recreated one, which is why reflog recovery is safe even for complex commits you couldn’t easily redo by hand.',
      },
    },
    {
      id: 'git-force-with-lease',
      title: 'Force-pushing safely',
      blurb: '--force-with-lease rewrites the remote only if nobody else got there first.',
      kind: 'code',
      practice: {
        prompt: "You already pushed a WIP commit earlier. Now you want to rewrite it (amend with the finished content) and update origin to match — a plain push will be rejected since you rewrote already-shared history, but you've confirmed nobody else has pushed since, so it's safe. Use the safer --force-with-lease, not a blind --force.",
        seed: {
          remote: {
            commits: [
              { message: 'Initial commit', files: { 'a.txt': 'v1\n' } },
              { message: 'WIP commit', files: { 'b.txt': 'wip\n' } },
            ],
          },
          cloneFromRemote: { url: REPO },
        },
        starter: [],
        reference: [{ write: { 'b.txt': 'final\n' } }, 'git add b.txt', 'git commit --amend -m "Finished feature"', 'git push --force-with-lease'],
        traps: [
          [{ write: { 'b.txt': 'final\n' } }, 'git add b.txt', 'git commit --amend -m "Finished feature"', 'git push'],
          ['git push --force-with-lease'],
        ],
        cases: [
          { label: 'the remote has the final content', check: "(await remoteFileAt('main', 'b.txt')) === 'final\\n'" },
          { label: 'the remote still has exactly 2 commits (amend replaced, did not add)', check: '(await remoteLog()).length === 2' },
          { label: 'local is fully in sync with origin', check: '(await head()) === (await trackingHead())' },
        ],
        walkthrough: '`git commit --amend` rewrites your last commit into a new one with a different oid, so a plain push is correctly rejected — origin’s history and yours no longer share the same tip. `--force-with-lease` overrides that, but only because it first confirms the remote still matches what you last saw (nobody else pushed in the meantime) — unlike a blind `--force`, which would override regardless, even if a teammate’s work was sitting there.',
      },
    },
    {
      id: 'git-workshop-cleanup-ship',
      title: 'Workshop: clean up and ship',
      blurb: 'Squash a messy branch into one clean commit, then push it for the first time.',
      kind: 'code',
      practice: {
        prompt: 'Clean up this feature branch before opening a PR: squash the three messy WIP commits into one clean commit titled "Add notifications feature", then push the branch to origin for the first time.',
        seed: {
          remote: { commits: [{ message: 'Initial commit', files: { 'readme.txt': 'readme\n' } }] },
          cloneFromRemote: { url: REPO },
          branches: [
            {
              name: 'notifications',
              commits: [
                { message: 'wip', files: { 'notify.js': '// start\n' } },
                { message: 'wip more', files: { 'notify.js': '// start\n// more\n' } },
                { message: 'wip done', files: { 'notify.js': '// start\n// more\n// done\n' } },
              ],
            },
          ],
          checkout: 'notifications',
        },
        starter: [],
        reference: ['git reset --soft HEAD~3', 'git commit -m "Add notifications feature"', 'git push -u origin notifications'],
        traps: [
          ['git push -u origin notifications'],
          ['git reset --hard HEAD~3', 'git commit -m "Add notifications feature"', 'git push -u origin notifications'],
        ],
        cases: [
          { label: 'origin has the notifications branch', check: "(await remoteBranches()).includes('notifications')" },
          { label: 'exactly one new commit beyond the base', check: "(await remoteLog('notifications')).length === 2" },
          { label: 'the commit has the clean title', check: "(await remoteLog('notifications'))[0].message === 'Add notifications feature'" },
          { label: 'all the work survived (final notify.js content intact)', check: "(await remoteFileAt('notifications', 'notify.js')) === '// start\\n// more\\n// done\\n'" },
        ],
        walkthrough: '`git reset --soft HEAD~3` rewinds the branch pointer past all three WIP commits while keeping every file change staged, so one `git commit` combines them into a single clean commit. Since this branch has never been pushed before, `git push -u origin notifications` uploads it as brand new and sets up tracking in the same step — exactly the shape a real pre-PR cleanup takes.',
      },
    },
  ],
}
