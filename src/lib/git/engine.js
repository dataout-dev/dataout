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
  let current = ''
  for (const part of absPath.split('/').filter(Boolean)) {
    current = `${current}/${part}`
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
}

let seedCounter = 0
function seedAuthor(offsetSeconds) {
  return { ...AUTHOR, timestamp: SEED_EPOCH + offsetSeconds, timezoneOffset: SIM_TZ_OFFSET }
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
    const when = seedAuthor(seedCounter * 60)
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
//         gitignore, uninitialized: true, files: { path: content } }
// uninitialized seeds a plain folder of files with no .git at all yet — used by the one
// lesson that teaches `git init` itself; every other lesson seeds an already-init'd repo.
export async function seedRepo(fs, dir, spec = {}) {
  seedCounter = 0
  await ensureSessionDir(fs, dir)
  await wipeDir(fs, dir)
  if (spec.uninitialized) {
    for (const [filepath, content] of Object.entries(spec.files ?? {})) {
      await writeWorkingFile(fs, dir, filepath, content)
    }
    return
  }
  await initRepo(fs, dir, { defaultBranch: spec.defaultBranch ?? 'main' })
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
}

// --- Inspection helpers used by both the terminal (for output text) and grading ---

export async function currentBranchName(fs, dir) {
  return (await git.currentBranch({ fs, dir, fullname: false })) ?? null
}

async function baseResolve(fs, dir, ref) {
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
    return git.commit({ fs, dir, message, author: AUTHOR, committer: AUTHOR, amend: true, parent: prev?.commit.parent })
  }
  // A paused merge (see mergeBranch/mergeInProgress below) needs its second parent recorded
  // explicitly — real git does this via .git/MERGE_HEAD the same way.
  if (await mergeInProgress(fs, dir)) {
    const theirsOid = await mergeHeadOid(fs, dir)
    const oursOid = await headOid(fs, dir)
    const oid = await git.commit({ fs, dir, message, author: AUTHOR, committer: AUTHOR, parent: [oursOid, theirsOid] })
    await clearMergeState(fs, dir)
    return oid
  }
  return git.commit({ fs, dir, message, author: AUTHOR, committer: AUTHOR })
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
    return
  }
  if (mode === 'hard') {
    await git.writeRef({ fs, dir, ref: `refs/heads/${branch}`, value: target, force: true })
    await git.checkout({ fs, dir, ref: branch, force: true })
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
export async function rebaseOnto(fs, dir, onto) {
  const branch = await currentBranchName(fs, dir)
  if (!branch) throw new Error('fatal: not currently on a branch')
  const ontoOid = await expandRef(fs, dir, onto)
  const [base] = await git.findMergeBase({ fs, dir, oids: [await headOid(fs, dir), ontoOid] })
  const commits = await git.log({ fs, dir, ref: branch })
  const baseIndex = commits.findIndex((c) => c.oid === base)
  const sinceBase = baseIndex === -1 ? commits : commits.slice(0, baseIndex)
  const toReplay = sinceBase.map((c) => c.oid).reverse() // oldest first

  await git.checkout({ fs, dir, ref: onto })
  await git.deleteBranch({ fs, dir, ref: branch }).catch(() => {})
  await git.branch({ fs, dir, ref: branch, checkout: true })
  for (const oid of toReplay) {
    await git.cherryPick({ fs, dir, oid, author: AUTHOR, committer: AUTHOR })
  }
}
