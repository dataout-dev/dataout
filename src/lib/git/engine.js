// Fs-agnostic git operations, shared between the browser worker (LightningFS) and the
// Node checker script (real fs + a temp directory). Every function takes the same
// (fs, dir) pair isomorphic-git itself takes, so this module never cares which backend
// it's running against.
import git from 'isomorphic-git'

export const AUTHOR = { name: 'DataOut Learner', email: 'learner@dataout.dev' }

// A fixed simulated clock so seeded commits are reproducible across runs (real wall-clock
// timestamps would make two "identical" seed runs produce different commit oids, which
// would break structural comparisons in grading).
const SEED_EPOCH = 1700000000
const SIM_TZ_OFFSET = 0

function segments(filepath) {
  const parts = filepath.split('/').filter(Boolean)
  parts.pop()
  return parts
}

async function mkdirp(fs, absPath) {
  const parts = absPath.split('/').filter(Boolean)
  // A Windows drive letter ("C:") isn't `/`-rooted the way a POSIX/LightningFS virtual path
  // is — `/C:` is not a valid path on Windows. Only ever hit on the Node checker's real temp
  // dir (LightningFS's own paths are always POSIX-style), e.g. when seeding a Tier 3 lesson's
  // remote dir, which doesn't pre-exist the way mkdtempSync's own dir does.
  const isWindowsDrive = /^[A-Za-z]:$/.test(parts[0])
  let current = isWindowsDrive ? parts.shift() : ''
  for (const part of parts) {
    current = current ? `${current}/${part}` : `/${part}`
    try {
      await fs.promises.mkdir(current)
    } catch (err) {
      if (err?.code !== 'EEXIST') throw err
    }
  }
}

async function ensureDir(fs, dir, filepath) {
  let current = dir
  for (const part of segments(filepath)) {
    current = `${current}/${part}`
    try {
      await fs.promises.mkdir(current)
    } catch (err) {
      if (err?.code !== 'EEXIST') throw err
    }
  }
}

// isomorphic-git's status check skips re-hashing a file whose mtime+size look unchanged
// from what's recorded in the index, as a perf shortcut. Lesson seeding and grading both run
// far faster than filesystem mtime resolution, so two same-length writes to the same path can
// land in the same tick and go undetected as a real content change. A strictly-increasing
// virtual clock for every write sidesteps that regardless of how fast the real clock ticks.
let virtualClockMs = Date.now()
function nextMtime() {
  virtualClockMs += 1000
  return new Date(virtualClockMs)
}

export async function writeWorkingFile(fs, dir, filepath, content) {
  await ensureDir(fs, dir, filepath)
  const fullPath = `${dir}/${filepath}`
  await fs.promises.writeFile(fullPath, content)
  const when = nextMtime()
  await fs.promises.utimes(fullPath, when, when).catch(() => {})
}

export async function readWorkingFile(fs, dir, filepath) {
  try {
    const data = await fs.promises.readFile(`${dir}/${filepath}`, { encoding: 'utf8' })
    return data
  } catch (err) {
    if (err?.code === 'ENOENT') return null
    throw err
  }
}

export async function removeWorkingFile(fs, dir, filepath) {
  try {
    await fs.promises.unlink(`${dir}/${filepath}`)
  } catch (err) {
    if (err?.code !== 'ENOENT') throw err
  }
}

export async function listWorkingFiles(fs, dir, current = '', out = []) {
  let entries
  try {
    entries = await fs.promises.readdir(`${dir}/${current}`)
  } catch {
    return out
  }
  for (const name of entries) {
    if (name === '.git') continue
    const rel = current ? `${current}/${name}` : name
    const stat = await fs.promises.lstat(`${dir}/${rel}`)
    if (stat.isDirectory()) await listWorkingFiles(fs, dir, rel, out)
    else out.push(rel)
  }
  return out.sort()
}

// Only actually creates anything for a fresh virtual-fs session path (e.g. LightningFS's
// /s/<session>) that doesn't exist yet. A real OS temp directory (the Node checker's case)
// already exists, and its absolute path isn't `/`-segment-safe on Windows, so this must not
// fall through to mkdirp for it.
export async function ensureSessionDir(fs, dir) {
  try {
    await fs.promises.stat(dir)
    return
  } catch {
    /* doesn't exist yet, e.g. a brand new worker session */
  }
  await mkdirp(fs, dir)
}

export async function wipeDir(fs, dir) {
  let entries
  try {
    entries = await fs.promises.readdir(dir)
  } catch {
    entries = []
  }
  for (const name of entries) {
    const full = `${dir}/${name}`
    const stat = await fs.promises.lstat(full)
    if (stat.isDirectory()) {
      await wipeDir(fs, full)
      await fs.promises.rmdir(full)
    } else {
      await fs.promises.unlink(full)
    }
  }
}

export async function initRepo(fs, dir, { defaultBranch = 'main' } = {}) {
  await git.init({ fs, dir, defaultBranch })
  // Every commit/merge/etc. call elsewhere in this engine passes an explicit author, so this
  // was never needed until Tier 4's git.stash — it has no author param at all and reads
  // user.name/user.email from git config exclusively, throwing MissingNameError without it.
  await git.setConfig({ fs, dir, path: 'user.name', value: AUTHOR.name })
  await git.setConfig({ fs, dir, path: 'user.email', value: AUTHOR.email })
}

let seedCounter = 0
function seedAuthor(offsetSeconds, override) {
  return { ...AUTHOR, ...override, timestamp: SEED_EPOCH + offsetSeconds, timezoneOffset: SIM_TZ_OFFSET }
}

async function seedCommits(fs, dir, commits) {
  let lastOid = null
  for (const commit of commits ?? []) {
    for (const [filepath, content] of Object.entries(commit.files ?? {})) {
      if (content === null) {
        await removeWorkingFile(fs, dir, filepath)
        await git.remove({ fs, dir, filepath }).catch(() => {})
      } else {
        await writeWorkingFile(fs, dir, filepath, content)
        await git.add({ fs, dir, filepath })
      }
    }
    // commit.author?: { name, email } — overrides AUTHOR for just this one seeded commit
    // (Tier 4's "filter log by author" lesson needs more than one author in the history).
    const when = seedAuthor(seedCounter * 60, commit.author)
    seedCounter += 1
    lastOid = await git.commit({ fs, dir, message: commit.message, author: when, committer: when })
  }
  return lastOid
}

// spec: { defaultBranch, commits: [{ message, files: { path: content|null }, author? }],
//         branches: [{ name, from: ref|undefined (defaults to wherever HEAD is), commits: [...] }],
//         mergeAttempt: { into, from } — checks out `into` and attempts to merge `from`,
//         leaving a real mid-conflict repo state (conflict markers + MERGE_HEAD) if it conflicts,
//         checkout: branchName — which branch to leave checked out at the end,
//         stagedChanges: { path: content|null }, workingChanges: { path: content|null },
//         gitignore, uninitialized: true, files: { path: content },
//         remote: { defaultBranch, commits, branches } — seeds a second, separate repo at
//         remoteDirFor(dir) using this same commit/branch sub-schema, acting as this lesson's
//         simulated "origin." Seeded before the local side, and seeded regardless of
//         `uninitialized`/`cloneFromRemote`, so a clone lesson can seed ONLY the remote and
//         leave the local side empty for the student to `git clone` themselves.
//         cloneFromRemote: { remoteName?, url? } — puts the local repo into an "already
//         cloned" state (tracking refs + remote config + checkout) via cloneFrom(), for
//         lessons that start mid-workflow rather than teaching clone itself.
//         remoteAdvanceAfterClone: { commits } — only with cloneFromRemote: appends more
//         commits to the remote AFTER the local clone, so "origin moved on since you
//         cloned" shares real ancestry with what local already has.
//         fetchAfterClone: true — only with cloneFromRemote: syncs the tracking ref to the
//         remote's current state (as if the student already fetched) without touching main.
//         pullAttempt: { remoteName? } — like mergeAttempt, but via pullFromRemote; starts
//         the lesson already mid-pull-conflict.
//         rebaseConflictAttempt: { onto, branch? } — like mergeAttempt, but via rebaseOnto;
//         starts the lesson already mid-rebase-conflict. `branch` checks that out first,
//         since the `branches` loop above leaves the repo on whichever entry was seeded last.
//         stashed: [{ message, changes: { path: content|null } }] — seeds that many existing
//         stash entries (newest last), for lessons practicing stash addressing rather than
//         creating the stash(es) themselves. }
// uninitialized seeds a plain folder of files with no .git at all yet — used by the one
// lesson that teaches `git init` itself (and every `git clone` lesson); every other lesson
// seeds an already-init'd repo.
export async function seedRepo(fs, dir, spec = {}) {
  seedCounter = 0
  await ensureSessionDir(fs, dir)
  await wipeDir(fs, dir)

  if (spec.remote) {
    const remoteDir = remoteDirFor(dir)
    await ensureSessionDir(fs, remoteDir)
    await wipeDir(fs, remoteDir)
    await initRepo(fs, remoteDir, { defaultBranch: spec.remote.defaultBranch ?? 'main' })
    await seedCommits(fs, remoteDir, spec.remote.commits)
    for (const branch of spec.remote.branches ?? []) {
      if (branch.from) await git.checkout({ fs, dir: remoteDir, ref: branch.from })
      const existing = await git.listBranches({ fs, dir: remoteDir })
      if (existing.includes(branch.name)) await git.checkout({ fs, dir: remoteDir, ref: branch.name })
      else await git.branch({ fs, dir: remoteDir, ref: branch.name, checkout: true })
      await seedCommits(fs, remoteDir, branch.commits)
    }
  }

  if (spec.uninitialized) {
    for (const [filepath, content] of Object.entries(spec.files ?? {})) {
      await writeWorkingFile(fs, dir, filepath, content)
    }
    return
  }
  if (spec.cloneFromRemote) {
    await cloneFrom(fs, dir, remoteDirFor(dir), spec.cloneFromRemote)
    // Appends more commits to the remote's CURRENTLY CHECKED OUT branch after the local
    // clone already happened, so "the team pushed since you cloned" is a genuine extension
    // of the same history local already has (same oids) rather than an independently
    // re-created lookalike, which would be a different, unrelated commit with the same
    // content — realistic divergence depends on sharing real ancestry, not matching text.
    if (spec.remoteAdvanceAfterClone) {
      await seedCommits(fs, remoteDirFor(dir), spec.remoteAdvanceAfterClone.commits)
    }
    // For lessons that pick up right after a fetch (the fetch itself already taught, not
    // the point of this exercise): sync the tracking ref to the remote's current state
    // without touching local main, same as fetchFromRemote does live.
    if (spec.fetchAfterClone) {
      await fetchFromRemote(fs, dir, remoteDirFor(dir), spec.cloneFromRemote.remoteName ?? 'origin')
    }
  } else {
    await initRepo(fs, dir, { defaultBranch: spec.defaultBranch ?? 'main' })
  }
  if (spec.gitignore != null) await writeWorkingFile(fs, dir, '.gitignore', spec.gitignore)
  await seedCommits(fs, dir, spec.commits)

  for (const branch of spec.branches ?? []) {
    if (branch.from) await git.checkout({ fs, dir, ref: branch.from })
    // A branch entry naming an already-existing branch (e.g. the default branch itself)
    // just appends more commits to it, instead of trying to re-create it.
    const existing = await git.listBranches({ fs, dir })
    if (existing.includes(branch.name)) await git.checkout({ fs, dir, ref: branch.name })
    else await git.branch({ fs, dir, ref: branch.name, checkout: true })
    await seedCommits(fs, dir, branch.commits)
  }

  if (spec.mergeAttempt) {
    const { into, from } = spec.mergeAttempt
    await git.checkout({ fs, dir, ref: into })
    await mergeBranch(fs, dir, from)
  }

  // Same idea as mergeAttempt, but via pullFromRemote — for a lesson that needs to start
  // already mid-pull-conflict, since a scripted `reference` can never contain a live step
  // expected to fail (runSteps aborts the whole replay on the first ok:false step).
  if (spec.pullAttempt) {
    await pullFromRemote(fs, dir, remoteDirFor(dir), spec.pullAttempt.remoteName ?? 'origin')
  }

  // Same constraint again, this time for a lesson that needs to start already mid-rebase-
  // conflict: `{ onto, branch? }` triggers rebaseOnto() at seed time, leaving real conflict
  // markers and the REBASE_TODO/REBASE_CURRENT/etc. resume state in place. `branch` matters
  // because the `branches` loop above leaves the repo checked out on whichever entry was
  // seeded LAST, not necessarily the one meant to be rebased.
  if (spec.rebaseConflictAttempt) {
    const { onto, branch } = spec.rebaseConflictAttempt
    if (branch) await git.checkout({ fs, dir, ref: branch })
    await rebaseOnto(fs, dir, onto)
  }

  if (spec.checkout) await git.checkout({ fs, dir, ref: spec.checkout })

  for (const [filepath, content] of Object.entries(spec.stagedChanges ?? {})) {
    if (content === null) {
      await git.remove({ fs, dir, filepath })
    } else {
      await writeWorkingFile(fs, dir, filepath, content)
      await git.add({ fs, dir, filepath })
    }
  }
  for (const [filepath, content] of Object.entries(spec.workingChanges ?? {})) {
    if (content === null) await removeWorkingFile(fs, dir, filepath)
    else await writeWorkingFile(fs, dir, filepath, content)
  }

  // stashed: [{ message, changes: { path: content } }] — each entry writes its own working-
  // tree changes and stashes them, building up a multi-entry stash list for lessons that
  // practice addressing (list/apply/drop) rather than creating the stash(es) themselves.
  // Staged first: git.stash's default push ignores untracked files entirely, same as real
  // git without --include-untracked — an unstaged brand-new file would silently not stash.
  for (const entry of spec.stashed ?? []) {
    for (const [filepath, content] of Object.entries(entry.changes ?? {})) {
      if (content === null) {
        await git.remove({ fs, dir, filepath }).catch(() => {})
      } else {
        await writeWorkingFile(fs, dir, filepath, content)
        await git.add({ fs, dir, filepath })
      }
    }
    await stashPush(fs, dir, entry.message)
  }
}

// --- Inspection helpers used by both the terminal (for output text) and grading ---

export async function currentBranchName(fs, dir) {
  return (await git.currentBranch({ fs, dir, fullname: false })) ?? null
}

async function baseResolve(fs, dir, ref) {
  // HEAD@{n} — the nth-most-recent reflog entry (0 = current). Checked before the generic
  // HEAD case below since it's a distinct syntax, not a relative-ref modifier.
  const reflogMatch = /^HEAD@\{(\d+)\}$/.exec(ref)
  if (reflogMatch) {
    const entries = await reflogEntries(fs, dir)
    const entry = entries[Number(reflogMatch[1])]
    if (!entry) throw new Error(`fatal: log for 'HEAD' only has ${entries.length} entries`)
    return entry.oid
  }
  if (ref === 'HEAD' || ref.startsWith('refs/')) {
    return git.resolveRef({ fs, dir, ref })
  }
  if (/^[0-9a-f]{40}$/i.test(ref)) return ref
  if (/^[0-9a-f]{4,39}$/i.test(ref)) {
    try {
      return await git.expandOid({ fs, dir, oid: ref })
    } catch {
      /* not a valid (short) oid after all — fall through to branch/tag lookup */
    }
  }
  try {
    return await git.resolveRef({ fs, dir, ref: `refs/heads/${ref}` })
  } catch {
    /* not a branch */
  }
  try {
    return await git.resolveRef({ fs, dir, ref: `refs/tags/${ref}` })
  } catch {
    /* not a tag */
  }
  return git.resolveRef({ fs, dir, ref })
}

// isomorphic-git's resolveRef/log don't understand git's relative-ref syntax (HEAD~2,
// HEAD^, main^2, ...), so this app implements it once, here, on top of readCommit.
export async function expandRef(fs, dir, ref) {
  const match = /^([^~^]+)((?:~\d+|\^\d*)*)$/.exec(ref)
  if (!match) return baseResolve(fs, dir, ref)
  const [, base, modifiers] = match
  let oid = await baseResolve(fs, dir, base)
  const steps = modifiers.match(/~\d+|\^\d*/g) ?? []
  for (const step of steps) {
    if (step.startsWith('~')) {
      const n = parseInt(step.slice(1), 10) || 1
      for (let i = 0; i < n; i += 1) {
        const c = await git.readCommit({ fs, dir, oid })
        const parent = c.commit.parent[0]
        if (!parent) throw new Error(`${ref} does not have enough ancestors`)
        oid = parent
      }
    } else {
      const n = step.length > 1 ? parseInt(step.slice(1), 10) : 1
      const c = await git.readCommit({ fs, dir, oid })
      const parent = c.commit.parent[n - 1]
      if (!parent) throw new Error(`${ref} does not have parent #${n}`)
      oid = parent
    }
  }
  return oid
}

export async function headOid(fs, dir) {
  try {
    return await expandRef(fs, dir, 'HEAD')
  } catch {
    return null
  }
}

export async function repoLog(fs, dir, ref = 'HEAD') {
  try {
    const oid = await expandRef(fs, dir, ref)
    const commits = await git.log({ fs, dir, ref: oid })
    return commits.map((c) => ({
      oid: c.oid,
      message: c.commit.message.replace(/\n+$/, ''),
      parents: c.commit.parent,
      author: c.commit.author,
    }))
  } catch {
    return []
  }
}

export async function fileAtRef(fs, dir, ref, filepath) {
  try {
    const oid = await expandRef(fs, dir, ref)
    const commit = await git.readCommit({ fs, dir, oid })
    const { blob } = await git.readBlob({ fs, dir, oid: commit.commit.tree, filepath })
    return new TextDecoder('utf-8').decode(blob)
  } catch {
    return null
  }
}

export async function listFilesAtRef(fs, dir, ref) {
  try {
    const oid = await expandRef(fs, dir, ref)
    return await git.listFiles({ fs, dir, ref: oid })
  } catch {
    return []
  }
}

export async function listBranchNames(fs, dir) {
  return git.listBranches({ fs, dir })
}

export async function listTagNames(fs, dir) {
  return git.listTags({ fs, dir })
}

export async function tagTarget(fs, dir, name) {
  try {
    return await git.resolveRef({ fs, dir, ref: `refs/tags/${name}` })
  } catch {
    return null
  }
}

// [filepath, headStatus, workdirStatus, stageStatus] -> a small classification used both
// for `git status` text and for grading assertions like status().staged/unstaged.
function classifyRow([filepath, head, workdir, stage]) {
  const row = { filepath, staged: null, unstaged: null, untracked: false }
  if (head === 0 && workdir === 2 && stage === 0) {
    row.untracked = true
  } else if (head === 0 && stage >= 2) {
    row.staged = 'added'
    if (stage === 3) row.unstaged = 'modified'
  } else if (head === 1 && stage === 0) {
    row.staged = 'deleted'
  } else if (head === 1 && workdir === 0 && stage === 1) {
    row.unstaged = 'deleted'
  } else if (head === 1 && stage === 2 && workdir === 2) {
    row.staged = 'modified'
  } else if (head === 1 && stage === 3) {
    row.staged = 'modified'
    row.unstaged = 'modified'
  } else if (head === 1 && workdir === 2 && stage === 1) {
    row.unstaged = 'modified'
  }
  return row
}

export async function statusRows(fs, dir) {
  const matrix = await git.statusMatrix({ fs, dir })
  return matrix.map(classifyRow).filter((r) => r.staged || r.unstaged || r.untracked)
}

export async function isClean(fs, dir) {
  const rows = await statusRows(fs, dir)
  return rows.length === 0
}

export async function fileStatus(fs, dir, filepath) {
  const rows = await statusRows(fs, dir)
  return rows.find((r) => r.filepath === filepath) ?? { filepath, staged: null, unstaged: null, untracked: false }
}

// --- Mutating operations, used by the terminal command layer ---

export async function stageFile(fs, dir, filepath) {
  const exists = await readWorkingFile(fs, dir, filepath)
  if (exists === null) await git.remove({ fs, dir, filepath })
  else await git.add({ fs, dir, filepath })
}

export async function stageAll(fs, dir) {
  const rows = await statusRows(fs, dir)
  for (const row of rows) await stageFile(fs, dir, row.filepath)
}

export async function commit(fs, dir, message, { amend = false } = {}) {
  if (amend) {
    const head = await headOid(fs, dir)
    const prev = head ? await git.readCommit({ fs, dir, oid: head }) : null
    const oid = await git.commit({ fs, dir, message, author: AUTHOR, committer: AUTHOR, amend: true, parent: prev?.commit.parent })
    await appendReflog(fs, dir, oid, `commit (amend): ${message}`)
    return oid
  }
  // A paused merge (see mergeBranch/mergeInProgress below) needs its second parent recorded
  // explicitly — real git does this via .git/MERGE_HEAD the same way.
  if (await mergeInProgress(fs, dir)) {
    const theirsOid = await mergeHeadOid(fs, dir)
    const oursOid = await headOid(fs, dir)
    const oid = await git.commit({ fs, dir, message, author: AUTHOR, committer: AUTHOR, parent: [oursOid, theirsOid] })
    await clearMergeState(fs, dir)
    await appendReflog(fs, dir, oid, `commit (merge): ${message}`)
    return oid
  }
  const oid = await git.commit({ fs, dir, message, author: AUTHOR, committer: AUTHOR })
  // A resolved standalone cherry-pick (see cherryPickCommit below) is just a normal,
  // single-parent commit — no special parent bookkeeping like a merge needs, just the marker
  // cleared so status/grading stop reporting a cherry-pick still in progress.
  if (await cherryPickInProgress(fs, dir)) await fs.promises.unlink(cherryPickHeadPath(dir)).catch(() => {})
  await appendReflog(fs, dir, oid, `commit: ${message}`)
  return oid
}

export async function restoreWorking(fs, dir, filepath) {
  await git.checkout({ fs, dir, filepaths: [filepath], force: true })
}

export async function restoreStaged(fs, dir, filepath) {
  const head = await headOid(fs, dir)
  if (head) {
    const inTree = await listFilesAtRef(fs, dir, 'HEAD')
    if (inTree.includes(filepath)) {
      await git.resetIndex({ fs, dir, filepath, ref: 'HEAD' })
      return
    }
  }
  await git.remove({ fs, dir, filepath }).catch(() => {})
}

export async function resetTo(fs, dir, ref, mode = 'mixed') {
  const branch = await currentBranchName(fs, dir)
  const target = await expandRef(fs, dir, ref)
  if (mode === 'soft') {
    await git.writeRef({ fs, dir, ref: `refs/heads/${branch}`, value: target, force: true })
    await appendReflog(fs, dir, target, `reset: moving to ${ref}`)
    return
  }
  if (mode === 'hard') {
    await git.writeRef({ fs, dir, ref: `refs/heads/${branch}`, value: target, force: true })
    await git.checkout({ fs, dir, ref: branch, force: true })
    await appendReflog(fs, dir, target, `reset: moving to ${ref}`)
    return
  }
  // mixed: move the branch ref and reset the index, but leave the working tree untouched
  const targetFiles = new Set(await listFilesAtRef(fs, dir, target))
  const currentFiles = new Set(await git.listFiles({ fs, dir }))
  for (const filepath of new Set([...targetFiles, ...currentFiles])) {
    if (targetFiles.has(filepath)) await git.resetIndex({ fs, dir, filepath, ref: target })
    else await git.remove({ fs, dir, filepath }).catch(() => {})
  }
  await git.writeRef({ fs, dir, ref: `refs/heads/${branch}`, value: target, force: true })
  await appendReflog(fs, dir, target, `reset: moving to ${ref}`)
}

// Simplified revert: reapplies the inverse of `ref`'s changes on top of HEAD and commits.
// Only handles the common non-conflicting teaching case (no 3-way merge), matching the
// scope of the Foundations tier (branching/conflicts arrive in a later tier).
export async function revertCommit(fs, dir, ref) {
  const target = await expandRef(fs, dir, ref)
  const commitObj = await git.readCommit({ fs, dir, oid: target })
  const parentOid = commitObj.commit.parent[0]
  if (!parentOid) throw new Error("can't revert a commit with no parent")
  const changed = new Set([...(await listFilesAtRef(fs, dir, target)), ...(await listFilesAtRef(fs, dir, parentOid))])
  for (const filepath of changed) {
    const beforeContent = await fileAtRef(fs, dir, parentOid, filepath)
    const afterContent = await fileAtRef(fs, dir, target, filepath)
    if (beforeContent === afterContent) continue
    if (beforeContent === null) {
      await removeWorkingFile(fs, dir, filepath)
      await git.remove({ fs, dir, filepath }).catch(() => {})
    } else {
      await writeWorkingFile(fs, dir, filepath, beforeContent)
      await git.add({ fs, dir, filepath })
    }
  }
  const shortMsg = commitObj.commit.message.split('\n')[0]
  return git.commit({ fs, dir, message: `Revert "${shortMsg}"`, author: AUTHOR, committer: AUTHOR })
}

export async function createTag(fs, dir, name, ref = 'HEAD') {
  const oid = await expandRef(fs, dir, ref)
  await git.tag({ fs, dir, ref: name, object: oid, force: false })
}

// --- Branching & merging (Tier 2) ---

export async function createBranch(fs, dir, name, { checkout = false, startPoint } = {}) {
  const object = startPoint ? await expandRef(fs, dir, startPoint) : undefined
  await git.branch({ fs, dir, ref: name, object, checkout })
}

export async function switchBranch(fs, dir, name) {
  await git.checkout({ fs, dir, ref: name })
}

export async function renameBranchTo(fs, dir, oldName, newName) {
  await git.renameBranch({ fs, dir, ref: newName, oldref: oldName, checkout: true })
}

// Real git refuses a plain `-d` on a branch whose tip isn't reachable from the current
// branch (i.e. it has commits that were never merged anywhere); `-D` skips that check.
// isomorphic-git's deleteBranch does no such check itself, so it's hand-rolled here.
export async function isMergedInto(fs, dir, branchName, intoRef = 'HEAD') {
  const branchOid = await expandRef(fs, dir, branchName)
  const intoOid = await expandRef(fs, dir, intoRef)
  if (branchOid === intoOid) return true
  return git.isDescendent({ fs, dir, oid: intoOid, ancestor: branchOid })
}

export async function deleteBranchByName(fs, dir, name, { force = false } = {}) {
  if (!force) {
    const current = await currentBranchName(fs, dir)
    const merged = await isMergedInto(fs, dir, name, current ?? 'HEAD')
    if (!merged) {
      const err = new Error(
        `error: the branch '${name}' is not fully merged.\nIf you are sure you want to delete it, run 'git branch -D ${name}'.`
      )
      err.code = 'NOT_MERGED'
      throw err
    }
  }
  await git.deleteBranch({ fs, dir, ref: name })
}

// --- Merge state (mirrors real git's .git/MERGE_HEAD + MERGE_MSG) ---
// isomorphic-git has no concept of an in-progress merge: a conflicting `git.merge(...)`
// call just throws and leaves conflict markers on disk. These two small marker files are
// how this sandbox remembers "a merge is paused here, waiting on a commit" across separate
// terminal commands, exactly like real git does.

const mergeHeadPath = (dir) => `${dir}/.git/MERGE_HEAD`
const mergeMsgPath = (dir) => `${dir}/.git/MERGE_MSG`

async function readMarker(fs, path) {
  try {
    return await fs.promises.readFile(path, { encoding: 'utf8' })
  } catch {
    return null
  }
}

export async function mergeInProgress(fs, dir) {
  return (await readMarker(fs, mergeHeadPath(dir))) !== null
}

export async function mergeHeadOid(fs, dir) {
  const content = await readMarker(fs, mergeHeadPath(dir))
  return content ? content.trim() : null
}

export async function mergeMessage(fs, dir) {
  return readMarker(fs, mergeMsgPath(dir))
}

async function clearMergeState(fs, dir) {
  await fs.promises.unlink(mergeHeadPath(dir)).catch(() => {})
  await fs.promises.unlink(mergeMsgPath(dir)).catch(() => {})
}

// Attempts `theirs` into the current branch. Returns { conflict, fastForward, filepaths }.
// On conflict, isomorphic-git (with abortOnConflict: false) already writes conflict markers
// into the working tree and index for us — this just records which merge is paused, so a
// later plain `git commit` knows to create a real two-parent merge commit.
export async function mergeBranch(fs, dir, theirs, { noFastForward = false } = {}) {
  const ours = await currentBranchName(fs, dir)
  const theirsOid = await expandRef(fs, dir, theirs)
  try {
    const result = await git.merge({
      fs,
      dir,
      ours,
      theirs,
      fastForward: !noFastForward,
      abortOnConflict: false,
      author: AUTHOR,
      committer: AUTHOR,
    })
    // isomorphic-git's merge() only moves refs/writes the tree object; it never syncs the
    // working directory itself (true even for a plain fast-forward), so this does it explicitly.
    await git.checkout({ fs, dir, ref: ours, force: true })
    return { conflict: false, fastForward: Boolean(result.fastForward), filepaths: [] }
  } catch (err) {
    if (err?.code !== 'MergeConflictError') throw err
    await fs.promises.writeFile(mergeHeadPath(dir), theirsOid)
    await fs.promises.writeFile(mergeMsgPath(dir), `Merge branch '${theirs}' into ${ours}\n`)
    return { conflict: true, fastForward: false, filepaths: err.data?.filepaths ?? [] }
  }
}

export async function abortMergeState(fs, dir) {
  if (!(await mergeInProgress(fs, dir))) throw new Error('fatal: There is no merge to abort')
  await git.abortMerge({ fs, dir })
  await clearMergeState(fs, dir)
}

// A file still shows conflict markers until the learner resolves it by hand.
export async function hasConflictMarkers(fs, dir, filepath) {
  const content = await readWorkingFile(fs, dir, filepath)
  return content != null && content.includes('<<<<<<<')
}

// Simplified, non-conflicting rebase: replays each commit unique to the current branch
// (since it diverged from `onto`) on top of `onto`'s tip, one at a time, via cherry-pick.
// Real `git rebase` can pause for conflict resolution mid-replay; that case is out of scope
// here (this sandbox never seeds a rebase onto conflicting history), matching how revert
// and merge both stay in their non-conflicting/hand-resolved lanes elsewhere in this app.
// --- Remotes (Tier 3) ---
// isomorphic-git has no real network layer available in this sandbox (no actual server to
// push/pull against), so a "remote" here is just a second local repo living at a fixed
// sibling directory, which this app's clone/fetch/push/pull hand-roll on top of real
// object-copying + ref-writing — verified empirically against a real temp-dir Node script
// before any lesson was designed around it (same discipline Tier 2 used for merge/rebase).
// Every existing read-only helper above (repoLog, listBranchNames, fileAtRef, ...) already
// works unmodified against a remote dir too, since they're all generic over (fs, dir).

export const remoteDirFor = (dir) => `${dir}-remote`

// Copies every object reachable from `startOids` from one (fs, dir) into another, byte-for-
// byte (format 'content' round-trips the parsed form without needing to re-derive oids).
async function copyReachableObjects(srcFs, srcDir, dstFs, dstDir, startOids) {
  const seen = new Set()
  const queue = [...startOids]
  while (queue.length) {
    const oid = queue.pop()
    if (!oid || seen.has(oid)) continue
    seen.add(oid)
    const { type, object } = await git.readObject({ fs: srcFs, dir: srcDir, oid, format: 'content' })
    await git.writeObject({ fs: dstFs, dir: dstDir, oid, object, type, format: 'content' })
    if (type === 'commit') {
      const { commit } = await git.readCommit({ fs: srcFs, dir: srcDir, oid })
      queue.push(commit.tree, ...commit.parent)
    } else if (type === 'tree') {
      const { tree } = await git.readTree({ fs: srcFs, dir: srcDir, oid })
      for (const entry of tree) queue.push(entry.oid)
    }
  }
  return seen.size
}

export async function addRemoteConfig(fs, dir, name, url) {
  await git.addRemote({ fs, dir, remote: name, url, force: true })
}

export async function listRemoteConfigs(fs, dir) {
  return git.listRemotes({ fs, dir })
}

export async function removeRemoteConfig(fs, dir, name) {
  await git.deleteRemote({ fs, dir, remote: name })
}

// Wipes and reinitializes `dir` as a fresh clone of `remoteDir`: copies every branch's full
// history, sets up refs/remotes/<remoteName>/* tracking refs, records the remote's (cosmetic)
// url via real git config, and checks out a local branch tracking the remote's default branch.
export async function cloneFrom(fs, dir, remoteDir, { remoteName = 'origin', url } = {}) {
  await ensureSessionDir(fs, dir)
  await wipeDir(fs, dir)
  await initRepo(fs, dir, { defaultBranch: 'main' })
  const branches = await git.listBranches({ fs, dir: remoteDir })
  const oids = await Promise.all(branches.map((b) => git.resolveRef({ fs, dir: remoteDir, ref: `refs/heads/${b}` })))
  await copyReachableObjects(fs, remoteDir, fs, dir, oids)
  for (let i = 0; i < branches.length; i += 1) {
    await git.writeRef({ fs, dir, ref: `refs/remotes/${remoteName}/${branches[i]}`, value: oids[i], force: true })
  }
  await addRemoteConfig(fs, dir, remoteName, url ?? remoteDir)
  const defaultBranch = branches.includes('main') ? 'main' : branches[0]
  if (defaultBranch) {
    await git.branch({ fs, dir, ref: defaultBranch, object: `refs/remotes/${remoteName}/${defaultBranch}`, checkout: true })
    await git.checkout({ fs, dir, ref: defaultBranch, force: true })
  }
}

// Updates refs/remotes/<remoteName>/* from the remote dir, without touching any local
// branch — exactly like real `git fetch`. Returns the list of remote branch names seen.
export async function fetchFromRemote(fs, dir, remoteDir, remoteName = 'origin') {
  const branches = await git.listBranches({ fs, dir: remoteDir })
  const oids = await Promise.all(branches.map((b) => git.resolveRef({ fs, dir: remoteDir, ref: `refs/heads/${b}` })))
  await copyReachableObjects(fs, remoteDir, fs, dir, oids)
  for (let i = 0; i < branches.length; i += 1) {
    await git.writeRef({ fs, dir, ref: `refs/remotes/${remoteName}/${branches[i]}`, value: oids[i], force: true })
  }
  return branches
}

// fetch, then merge the current branch with its just-updated remote-tracking ref — reuses
// the exact same mergeBranch() Tier 2 built, so a pull that lands mid-conflict behaves
// identically to a conflicting `git merge` (real markers, MERGE_HEAD, etc.).
export async function pullFromRemote(fs, dir, remoteDir, remoteName = 'origin') {
  const branch = await currentBranchName(fs, dir)
  if (!branch) throw new Error('fatal: not currently on a branch')
  await fetchFromRemote(fs, dir, remoteDir, remoteName)
  return mergeBranch(fs, dir, `refs/remotes/${remoteName}/${branch}`)
}

// Pushes the current branch to the remote. Returns { rejected: true } instead of writing
// anything if the remote has moved since the local tracking ref last saw it (a real
// non-fast-forward rejection) — the learner needs to fetch/pull before pushing again.
export async function pushToRemote(fs, dir, remoteDir, remoteName = 'origin', { force = false, forceWithLease = false } = {}) {
  const branch = await currentBranchName(fs, dir)
  if (!branch) throw new Error('fatal: not currently on a branch')
  const localOid = await expandRef(fs, dir, branch)
  let remoteOid = null
  try {
    remoteOid = await git.resolveRef({ fs, dir: remoteDir, ref: `refs/heads/${branch}` })
  } catch {
    /* remote doesn't have this branch yet — first push of it, always allowed */
  }
  if (remoteOid && remoteOid !== localOid) {
    const ff = await git.isDescendent({ fs, dir, oid: localOid, ancestor: remoteOid })
    if (!ff) {
      if (force) {
        // unconditional override — real git would allow this regardless of what's on the remote
      } else if (forceWithLease) {
        // Only override if the remote still matches what WE last saw (our own tracking ref) —
        // the whole point of --force-with-lease over plain --force: it still refuses if
        // someone else pushed since our last sync, even though we're intentionally rewriting.
        let trackingOid = null
        try {
          trackingOid = await git.resolveRef({ fs, dir, ref: `refs/remotes/${remoteName}/${branch}` })
        } catch {
          /* never synced this branch at all — treat as a stale lease, same as real git */
        }
        if (trackingOid !== remoteOid) return { rejected: true, branch, staleLease: true }
      } else {
        return { rejected: true, branch }
      }
    }
  }
  await copyReachableObjects(fs, dir, fs, remoteDir, [localOid])
  await git.writeRef({ fs, dir: remoteDir, ref: `refs/heads/${branch}`, value: localOid, force: true })
  await git.writeRef({ fs, dir, ref: `refs/remotes/${remoteName}/${branch}`, value: localOid, force: true })
  return { rejected: false, branch, created: remoteOid === null }
}

// --- Rebase conflict state (Tier 4) ---
// Same hand-rolled-marker idea as merge's MERGE_HEAD: isomorphic-git's cherryPick (which
// rebaseOnto replays with) has no concept of a paused, resumable rebase — on conflict it
// just throws and leaves the working tree mid-conflict. These three marker files remember
// enough to resume: the remaining oids to replay, the oid *being* replayed when it paused
// (so `rebase --continue` can reuse its original commit message, like real git does unless
// you explicitly reword), and the branch's pre-rebase position (so `--abort` can fully
// restore it).

const rebaseTodoPath = (dir) => `${dir}/.git/REBASE_TODO`
const rebaseCurrentPath = (dir) => `${dir}/.git/REBASE_CURRENT`
const rebaseOrigPath = (dir) => `${dir}/.git/REBASE_ORIG_HEAD`
const rebaseBranchPath = (dir) => `${dir}/.git/REBASE_BRANCH`

export async function rebaseInProgress(fs, dir) {
  return (await readMarker(fs, rebaseTodoPath(dir))) !== null
}

async function clearRebaseState(fs, dir) {
  await fs.promises.unlink(rebaseTodoPath(dir)).catch(() => {})
  await fs.promises.unlink(rebaseCurrentPath(dir)).catch(() => {})
  await fs.promises.unlink(rebaseOrigPath(dir)).catch(() => {})
  await fs.promises.unlink(rebaseBranchPath(dir)).catch(() => {})
}

// Replays `queue` (oldest first) one commit at a time. On conflict, pauses and writes the
// resume markers; returns { conflict, filepaths } like mergeBranch does. On full success,
// clears any (now-stale) rebase markers and returns { conflict: false }.
async function replayQueue(fs, dir, branch, origHead, queue) {
  while (queue.length) {
    const oid = queue.shift()
    try {
      await git.cherryPick({ fs, dir, oid, committer: AUTHOR, abortOnConflict: false })
    } catch (err) {
      if (err?.code !== 'MergeConflictError') throw err
      await fs.promises.writeFile(rebaseTodoPath(dir), JSON.stringify(queue))
      await fs.promises.writeFile(rebaseCurrentPath(dir), oid)
      await fs.promises.writeFile(rebaseOrigPath(dir), origHead)
      await fs.promises.writeFile(rebaseBranchPath(dir), branch)
      return { conflict: true, filepaths: err.data?.filepaths ?? [] }
    }
  }
  await clearRebaseState(fs, dir)
  return { conflict: false }
}

export async function rebaseOnto(fs, dir, onto) {
  const branch = await currentBranchName(fs, dir)
  if (!branch) throw new Error('fatal: not currently on a branch')
  const origHead = await headOid(fs, dir)
  const ontoOid = await expandRef(fs, dir, onto)
  const [base] = await git.findMergeBase({ fs, dir, oids: [origHead, ontoOid] })
  const commits = await git.log({ fs, dir, ref: branch })
  const baseIndex = commits.findIndex((c) => c.oid === base)
  const sinceBase = baseIndex === -1 ? commits : commits.slice(0, baseIndex)
  const toReplay = sinceBase.map((c) => c.oid).reverse() // oldest first

  await git.checkout({ fs, dir, ref: onto })
  await git.deleteBranch({ fs, dir, ref: branch }).catch(() => {})
  await git.branch({ fs, dir, ref: branch, checkout: true })
  return replayQueue(fs, dir, branch, origHead, toReplay)
}

// `git add` the resolved file(s) yourself first, same as finishing a merge conflict — this
// just finalizes the CURRENT paused step (a normal single-parent commit, reusing the
// original commit's message, exactly like real `rebase --continue` does unless you reword)
// and resumes replaying whatever's left in the queue.
export async function rebaseContinueState(fs, dir) {
  if (!(await rebaseInProgress(fs, dir))) throw new Error('fatal: No rebase in progress')
  const currentOid = (await readMarker(fs, rebaseCurrentPath(dir))).trim()
  const { commit: original } = await git.readCommit({ fs, dir, oid: currentOid })
  await git.commit({ fs, dir, message: original.message, author: AUTHOR, committer: AUTHOR })

  const queue = JSON.parse(await readMarker(fs, rebaseTodoPath(dir)))
  const origHead = (await readMarker(fs, rebaseOrigPath(dir))).trim()
  const branch = (await readMarker(fs, rebaseBranchPath(dir))).trim()
  await fs.promises.unlink(rebaseCurrentPath(dir)).catch(() => {})
  return replayQueue(fs, dir, branch, origHead, queue)
}

export async function rebaseAbortState(fs, dir) {
  if (!(await rebaseInProgress(fs, dir))) throw new Error('fatal: No rebase in progress')
  const branch = (await readMarker(fs, rebaseBranchPath(dir))).trim()
  const origHead = (await readMarker(fs, rebaseOrigPath(dir))).trim()
  await git.writeRef({ fs, dir, ref: `refs/heads/${branch}`, value: origHead, force: true })
  await git.checkout({ fs, dir, ref: branch, force: true })
  await clearRebaseState(fs, dir)
}

// --- Standalone cherry-pick (Tier 4) ---
// Tier 2's rebaseOnto already used isomorphic-git's cherryPick internally; this exposes it
// as its own student-facing command. Real cherry-pick keeps the ORIGINAL commit's author
// (cherryPick has no author param at all, only committer — this is correct real-git
// behavior, not an oversight) and, once resolved, is a normal single-parent commit, not a
// merge — so unlike mergeBranch/rebaseOnto's conflict state, there's no special parent
// bookkeeping needed on commit(), just a marker to clear.

const cherryPickHeadPath = (dir) => `${dir}/.git/CHERRY_PICK_HEAD`

export async function cherryPickInProgress(fs, dir) {
  return (await readMarker(fs, cherryPickHeadPath(dir))) !== null
}

export async function cherryPickCommit(fs, dir, ref) {
  const oid = await expandRef(fs, dir, ref)
  try {
    await git.cherryPick({ fs, dir, oid, committer: AUTHOR, abortOnConflict: false })
    return { conflict: false }
  } catch (err) {
    if (err?.code !== 'MergeConflictError') throw err
    await fs.promises.writeFile(cherryPickHeadPath(dir), oid)
    return { conflict: true, filepaths: err.data?.filepaths ?? [] }
  }
}

export async function abortCherryPickState(fs, dir) {
  if (!(await cherryPickInProgress(fs, dir))) throw new Error('fatal: no cherry-pick in progress')
  await git.checkout({ fs, dir, filepaths: undefined, force: true, ref: await currentBranchName(fs, dir) })
  await fs.promises.unlink(cherryPickHeadPath(dir)).catch(() => {})
}

// --- Reflog (Tier 4) ---
// isomorphic-git has no reflog of its own. Hand-rolled and deliberately scoped to the one
// thing the lessons actually need it for — recovering a commit "lost" by a plain commit or
// reset — not a full reimplementation of every ref-moving git command's reflog entry.

const reflogPath = (dir) => `${dir}/.git/DATAOUT_REFLOG`

async function appendReflog(fs, dir, oid, message) {
  if (!oid) return
  let entries = []
  const existing = await readMarker(fs, reflogPath(dir))
  if (existing) {
    try {
      entries = JSON.parse(existing)
    } catch {
      entries = []
    }
  }
  entries.unshift({ oid, message }) // newest first, matching real `git reflog`
  await fs.promises.writeFile(reflogPath(dir), JSON.stringify(entries))
}

export async function reflogEntries(fs, dir) {
  const existing = await readMarker(fs, reflogPath(dir))
  if (!existing) return []
  try {
    return JSON.parse(existing)
  } catch {
    return []
  }
}

// --- Bisect (Tier 4) ---
// A guided binary search over a LINEAR slice of history between a known-good and known-bad
// commit — deliberately scoped to linear history (no merge commits in the searched range),
// same "stay in the simplified lane" approach as rebase/revert elsewhere in this engine.

const bisectStatePath = (dir) => `${dir}/.git/DATAOUT_BISECT`

export async function bisectInProgress(fs, dir) {
  return (await readMarker(fs, bisectStatePath(dir))) !== null
}

async function readBisectState(fs, dir) {
  const raw = await readMarker(fs, bisectStatePath(dir))
  if (!raw) throw new Error('fatal: no bisect in progress')
  return JSON.parse(raw)
}

async function writeBisectState(fs, dir, state) {
  await fs.promises.writeFile(bisectStatePath(dir), JSON.stringify(state))
}

export async function bisectStart(fs, dir) {
  const startBranch = await currentBranchName(fs, dir)
  await writeBisectState(fs, dir, { bad: null, good: null, startBranch })
}

// Narrows to the midpoint of whatever's still unclassified between good (exclusive) and bad
// (inclusive, but already known-bad so excluded from the candidates) and checks it out.
async function narrowBisect(fs, dir, state) {
  const sinceBad = await repoLog(fs, dir, state.bad) // newest first, starting at bad
  const goodIndex = sinceBad.findIndex((c) => c.oid === state.good)
  const range = goodIndex === -1 ? sinceBad : sinceBad.slice(0, goodIndex)
  const candidates = range.slice(1) // drop `bad` itself — already classified
  if (candidates.length === 0) return { done: true, culprit: state.bad }
  const mid = candidates[Math.floor(candidates.length / 2)]
  await git.checkout({ fs, dir, ref: mid.oid, force: true })
  return { done: false, checkedOut: mid.oid, remaining: candidates.length }
}

export async function bisectMark(fs, dir, kind, ref) {
  const state = await readBisectState(fs, dir)
  const oid = ref ? await expandRef(fs, dir, ref) : await headOid(fs, dir)
  state[kind] = oid
  await writeBisectState(fs, dir, state)
  if (state.good && state.bad) return narrowBisect(fs, dir, state)
  return { done: false, waitingFor: kind === 'bad' ? 'good' : 'bad' }
}

export async function bisectResetState(fs, dir) {
  const raw = await readMarker(fs, bisectStatePath(dir))
  if (raw) {
    const state = JSON.parse(raw)
    if (state.startBranch) await git.checkout({ fs, dir, ref: state.startBranch, force: true }).catch(() => {})
  }
  await fs.promises.unlink(bisectStatePath(dir)).catch(() => {})
}

// --- Stash (Tier 4) ---
// Thin wrappers around isomorphic-git's real git.stash — unlike every other mutating
// function in this engine, it takes no author param at all and reads user.name/user.email
// from git config exclusively (see initRepo's setConfig calls), and MissingNameError is
// thrown with no way to pass author/committer explicitly.

export async function stashPush(fs, dir, message) {
  await git.stash({ fs, dir, op: 'push', message: message ?? '' })
}

export async function stashPop(fs, dir) {
  await git.stash({ fs, dir, op: 'pop' })
}

export async function stashApply(fs, dir, refIdx = 0) {
  await git.stash({ fs, dir, op: 'apply', refIdx })
}

export async function stashDrop(fs, dir, refIdx = 0) {
  await git.stash({ fs, dir, op: 'drop', refIdx })
}

export async function stashList(fs, dir) {
  return git.stash({ fs, dir, op: 'list' })
}
