// A small, deliberately-constrained "terminal" that parses a typed command line and runs
// it against a live (fs, dir) repo via engine.js, producing git-CLI-like output text.
// This is the interactive layer learners type into; engine.js stays a plain function library.
import { structuredPatch } from 'diff'
import * as eng from './engine.js'

export function tokenize(line) {
  const tokens = []
  let current = ''
  let quote = null
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (quote) {
      if (ch === quote) quote = null
      else current += ch
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      continue
    }
    if (/\s/.test(ch)) {
      if (current) {
        tokens.push(current)
        current = ''
      }
      continue
    }
    current += ch
  }
  if (current) tokens.push(current)
  return tokens
}

// `-m` means "commit message" for `git commit` but "rename" for `git branch` — only
// commit's `-m` consumes the next token as a value; everywhere else it's a plain flag.
function parseFlags(args, { messageFlag = false } = {}) {
  const flags = new Set()
  const opts = {}
  const positional = []
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (messageFlag && (arg === '-m' || arg === '--message')) {
      opts.message = args[++i]
    } else if (messageFlag && arg.startsWith('--message=')) {
      opts.message = arg.slice('--message='.length)
    } else if (arg.startsWith('--') && arg.includes('=')) {
      // Generic "--key=value" (e.g. --author=Dana for log filtering), checked after the
      // commit-specific --message= special case above so that one still wins for commit.
      const eq = arg.indexOf('=')
      opts[arg.slice(2, eq)] = arg.slice(eq + 1)
    } else if (arg.startsWith('--')) {
      flags.add(arg.slice(2))
    } else if (arg.startsWith('-') && arg.length > 1) {
      for (const ch of arg.slice(1)) flags.add(ch)
    } else {
      positional.push(arg)
    }
  }
  return { flags, opts, positional }
}

function shortOid(oid) {
  return oid.slice(0, 7)
}

function formatDiff(filepath, before, after) {
  if (before === after) return ''
  const patch = structuredPatch(`a/${filepath}`, `b/${filepath}`, before ?? '', after ?? '', '', '')
  const lines = [`diff --git a/${filepath} b/${filepath}`]
  if (before === null) lines.push('new file mode 100644')
  if (after === null) lines.push('deleted file mode 100644')
  lines.push(`--- ${before === null ? '/dev/null' : `a/${filepath}`}`)
  lines.push(`+++ ${after === null ? '/dev/null' : `b/${filepath}`}`)
  for (const hunk of patch.hunks) {
    lines.push(`@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`)
    lines.push(...hunk.lines)
  }
  return lines.join('\n')
}

async function cmdInit(fs, dir) {
  await eng.initRepo(fs, dir, {})
  const branch = await eng.currentBranchName(fs, dir)
  return ok(`Initialized empty Git repository (branch ${branch})`)
}

async function cmdAdd(fs, dir, { positional }) {
  if (positional.length === 0) return err('Nothing specified, nothing added.')
  if (positional.includes('.') || positional.includes('-A')) {
    await eng.stageAll(fs, dir)
    return ok('')
  }
  for (const filepath of positional) await eng.stageFile(fs, dir, filepath)
  return ok('')
}

async function cmdCommit(fs, dir, { flags, opts }) {
  if (flags.has('amend')) {
    if (!opts.message) return err('error: switch `amend` requires a value for -m')
    const c = await eng.commit(fs, dir, opts.message, { amend: true })
    return ok(`[${await eng.currentBranchName(fs, dir)} ${shortOid(c)}] ${opts.message}`)
  }
  if (!opts.message) return err('error: commit message required: use -m "..."')
  const clean = await eng.isClean(fs, dir)
  const rows = await eng.statusRows(fs, dir)
  const staged = rows.filter((r) => r.staged)
  if (staged.length === 0) {
    if (clean) return err('nothing to commit, working tree clean')
    return err('no changes added to commit (use "git add")')
  }
  const oid = await eng.commit(fs, dir, opts.message)
  return ok(`[${await eng.currentBranchName(fs, dir)} ${shortOid(oid)}] ${opts.message}`)
}

async function cmdStatus(fs, dir, { flags }) {
  const branch = await eng.currentBranchName(fs, dir)
  const rows = await eng.statusRows(fs, dir)
  if (flags.has('s') || flags.has('short')) {
    if (rows.length === 0) return ok('')
    const codeFor = (r) => {
      const s = r.staged === 'added' ? 'A' : r.staged === 'modified' ? 'M' : r.staged === 'deleted' ? 'D' : ' '
      const w = r.untracked ? '?' : r.unstaged === 'modified' ? 'M' : r.unstaged === 'deleted' ? 'D' : ' '
      return r.untracked ? '??' : `${s}${w}`
    }
    return ok(rows.map((r) => `${codeFor(r)} ${r.filepath}`).join('\n'))
  }
  const staged = rows.filter((r) => r.staged)
  const unstaged = rows.filter((r) => r.unstaged)
  const untracked = rows.filter((r) => r.untracked)
  const lines = branch ? [`On branch ${branch}`] : [`HEAD detached at ${shortOid(await eng.headOid(fs, dir))}`]
  if (await eng.mergeInProgress(fs, dir)) {
    lines.push('You have unmerged paths.', '  (fix conflicts and run "git commit")', '  (use "git merge --abort" to abort the merge)', '')
  }
  if (await eng.rebaseInProgress(fs, dir)) {
    lines.push('You are currently rebasing.', '  (fix conflicts and run "git rebase --continue")', '  (use "git rebase --abort" to check out the original branch)', '')
  }
  if (await eng.cherryPickInProgress(fs, dir)) {
    lines.push('You are currently cherry-picking a commit.', '  (fix conflicts and run "git commit")', '')
  }
  if (staged.length) {
    lines.push('Changes to be committed:')
    for (const r of staged) lines.push(`\t${r.staged}:   ${r.filepath}`)
    lines.push('')
  }
  if (unstaged.length) {
    lines.push('Changes not staged for commit:')
    for (const r of unstaged) lines.push(`\t${r.unstaged}:   ${r.filepath}`)
    lines.push('')
  }
  if (untracked.length) {
    lines.push('Untracked files:')
    for (const r of untracked) lines.push(`\t${r.filepath}`)
    lines.push('')
  }
  if (!staged.length && !unstaged.length && !untracked.length) lines.push('nothing to commit, working tree clean')
  return ok(lines.join('\n').replace(/\n+$/, ''))
}

async function cmdDiff(fs, dir, { flags, positional }) {
  const staged = flags.has('staged') || flags.has('cached')
  if (positional.length === 2 && !staged) {
    const refDiff = await tryDiffTwoRefs(fs, dir, positional[0], positional[1])
    if (refDiff) return refDiff
  }
  const rows = await eng.statusRows(fs, dir)
  const targets = positional.length ? rows.filter((r) => positional.includes(r.filepath)) : rows
  const parts = []
  for (const row of targets) {
    if (staged) {
      if (!row.staged) continue
      const before = await eng.fileAtRef(fs, dir, 'HEAD', row.filepath)
      const after = row.staged === 'deleted' ? null : await readStagedContent(fs, dir, row.filepath)
      parts.push(formatDiff(row.filepath, before, after))
    } else {
      if (!row.unstaged && !row.untracked) continue
      const before = row.untracked ? null : await readIndexOrHeadContent(fs, dir, row.filepath)
      const after = row.unstaged === 'deleted' ? null : await eng.readWorkingFile(fs, dir, row.filepath)
      parts.push(formatDiff(row.filepath, before, after))
    }
  }
  return ok(parts.filter(Boolean).join('\n'))
}

// `git diff <refA> <refB>` — only used when both positionals resolve as real refs; otherwise
// cmdDiff falls back to treating them as working-tree file paths.
async function tryDiffTwoRefs(fs, dir, refA, refB) {
  try {
    const oidA = await eng.expandRef(fs, dir, refA)
    const oidB = await eng.expandRef(fs, dir, refB)
    const filesA = await eng.listFilesAtRef(fs, dir, oidA)
    const filesB = await eng.listFilesAtRef(fs, dir, oidB)
    const parts = []
    for (const filepath of new Set([...filesA, ...filesB])) {
      const before = await eng.fileAtRef(fs, dir, oidA, filepath)
      const after = await eng.fileAtRef(fs, dir, oidB, filepath)
      const d = formatDiff(filepath, before, after)
      if (d) parts.push(d)
    }
    return ok(parts.join('\n'))
  } catch {
    return null
  }
}

async function readStagedContent(fs, dir, filepath) {
  // The staged (index) blob content == current working file content once staged,
  // since this sandbox always stages the working copy verbatim.
  return eng.readWorkingFile(fs, dir, filepath)
}

async function readIndexOrHeadContent(fs, dir, filepath) {
  const staged = await readStagedContent(fs, dir, filepath)
  if (staged !== null) return staged
  return eng.fileAtRef(fs, dir, 'HEAD', filepath)
}

async function cmdLog(fs, dir, { flags, opts }) {
  let commits = await eng.repoLog(fs, dir)
  if (opts.author) {
    const needle = opts.author.toLowerCase()
    commits = commits.filter((c) => c.author.name.toLowerCase().includes(needle))
  }
  if (commits.length === 0) return ok('')
  if (flags.has('oneline')) {
    // --graph on a single linear line of history (the only case this sandbox ever shows) is
    // just a "* " per commit — real git's graph only gets more elaborate once branches
    // diverge within the same log view, which this simplified log never renders together.
    const bullet = flags.has('graph') ? '* ' : ''
    return ok(commits.map((c) => `${bullet}${shortOid(c.oid)} ${c.message.split('\n')[0]}`).join('\n'))
  }
  const blocks = commits.map((c) => {
    const date = new Date(c.author.timestamp * 1000).toUTCString()
    return `commit ${c.oid}\nAuthor: ${c.author.name} <${c.author.email}>\nDate:   ${date}\n\n    ${c.message.split('\n').join('\n    ')}\n`
  })
  return ok(blocks.join('\n'))
}

async function cmdRestore(fs, dir, { flags, positional }) {
  if (positional.length === 0) return err('error: you must specify a path')
  for (const filepath of positional) {
    if (flags.has('staged')) await eng.restoreStaged(fs, dir, filepath)
    else await eng.restoreWorking(fs, dir, filepath)
  }
  return ok('')
}

async function cmdCheckout(fs, dir, { flags, positional }) {
  const dashDash = positional.indexOf('--')
  if (dashDash !== -1) {
    for (const filepath of positional.slice(dashDash + 1)) await eng.restoreWorking(fs, dir, filepath)
    return ok('')
  }
  if (flags.has('b')) {
    if (positional.length === 0) return err('error: switch `b` requires a value')
    const [name, startPoint] = positional
    await eng.createBranch(fs, dir, name, { checkout: true, startPoint })
    return ok(`Switched to a new branch '${name}'`)
  }
  if (positional.length === 0) return err('error: you must specify a branch, commit or path')
  const target = positional[0]
  const branches = await eng.listBranchNames(fs, dir)
  if (branches.includes(target)) {
    await eng.switchBranch(fs, dir, target)
    return ok(`Switched to branch '${target}'`)
  }
  // Not a branch name — isomorphic-git's own checkout has no relative-ref support (same gap
  // expandRef already exists to paper over elsewhere in this engine), so resolve first and
  // check out the real oid rather than handing it the raw "HEAD~1"-style string directly.
  const oid = await eng.expandRef(fs, dir, target)
  await eng.switchBranch(fs, dir, oid)
  return ok(
    `Note: switching to '${target}'.\n\nYou are in 'detached HEAD' state. You can look around, make experimental\nchanges and commit them, and you can discard any commits you make in this\nstate by switching back to a branch.\n\nHEAD is now at ${shortOid(oid)}`
  )
}

async function cmdSwitch(fs, dir, { flags, positional }) {
  if (flags.has('c')) {
    if (positional.length === 0) return err('error: switch `c` requires a value')
    const [name, startPoint] = positional
    await eng.createBranch(fs, dir, name, { checkout: true, startPoint })
    return ok(`Switched to a new branch '${name}'`)
  }
  if (positional.length === 0) return err('error: you must specify a branch')
  await eng.switchBranch(fs, dir, positional[0])
  return ok(`Switched to branch '${positional[0]}'`)
}

async function cmdBranch(fs, dir, { flags, positional }) {
  if (flags.has('m')) {
    const current = await eng.currentBranchName(fs, dir)
    const [a, b] = positional
    const [oldName, newName] = positional.length >= 2 ? [a, b] : [current, a]
    if (!newName) return err('error: switch `m` requires a value')
    await eng.renameBranchTo(fs, dir, oldName, newName)
    return ok('')
  }
  if (flags.has('d') || flags.has('D')) {
    if (positional.length === 0) return err('error: branch name required')
    await eng.deleteBranchByName(fs, dir, positional[0], { force: flags.has('D') })
    return ok(`Deleted branch ${positional[0]}`)
  }
  if (positional.length === 0) {
    const [branches, current] = await Promise.all([eng.listBranchNames(fs, dir), eng.currentBranchName(fs, dir)])
    return ok(branches.map((b) => (b === current ? `* ${b}` : `  ${b}`)).join('\n'))
  }
  const [name, startPoint] = positional
  await eng.createBranch(fs, dir, name, { startPoint })
  return ok('')
}

async function cmdMerge(fs, dir, { flags, positional }) {
  if (flags.has('abort')) {
    await eng.abortMergeState(fs, dir)
    return ok('')
  }
  if (positional.length === 0) return err('error: you must specify a branch to merge')
  const result = await eng.mergeBranch(fs, dir, positional[0], { noFastForward: flags.has('no-ff') })
  if (result.conflict) {
    return err(
      `Auto-merging ${result.filepaths.join(', ')}\nCONFLICT (content): Merge conflict in ${result.filepaths.join(', ')}\nAutomatic merge failed; fix conflicts and then commit the result.`
    )
  }
  if (result.fastForward) return ok(`Updating\nFast-forward`)
  return ok(`Merge made by the 'ort' strategy.`)
}

function formatRebaseResult(result) {
  if (result.conflict) {
    return err(
      `CONFLICT (content): Merge conflict in ${result.filepaths.join(', ')}\nerror: could not apply commit\nhint: Resolve the conflict, then run "git add <file>" and "git rebase --continue".`
    )
  }
  return ok('Successfully rebased.')
}

async function cmdRebase(fs, dir, { flags, positional }) {
  if (flags.has('continue')) {
    const result = await eng.rebaseContinueState(fs, dir)
    return formatRebaseResult(result)
  }
  if (flags.has('abort')) {
    await eng.rebaseAbortState(fs, dir)
    return ok('')
  }
  if (positional.length === 0) return err('error: you must specify a branch to rebase onto')
  const result = await eng.rebaseOnto(fs, dir, positional[0])
  return formatRebaseResult(result)
}

async function cmdReset(fs, dir, { flags, positional }) {
  const mode = flags.has('hard') ? 'hard' : flags.has('soft') ? 'soft' : 'mixed'
  const ref = positional[0] ?? 'HEAD'
  await eng.resetTo(fs, dir, ref, mode)
  if (mode === 'hard') {
    const oid = await eng.headOid(fs, dir)
    return ok(`HEAD is now at ${shortOid(oid)}`)
  }
  return ok('')
}

async function cmdRevert(fs, dir, { positional }) {
  if (positional.length === 0) return err('error: you must specify a commit to revert')
  const oid = await eng.revertCommit(fs, dir, positional[0])
  return ok(`[${await eng.currentBranchName(fs, dir)} ${shortOid(oid)}] Revert`)
}

async function cmdShow(fs, dir, { positional }) {
  const arg = positional[0] ?? 'HEAD'
  const colon = arg.indexOf(':')
  if (colon !== -1) {
    const ref = arg.slice(0, colon) || 'HEAD'
    const filepath = arg.slice(colon + 1)
    const content = await eng.fileAtRef(fs, dir, ref, filepath)
    if (content === null) return err(`fatal: path '${filepath}' does not exist in '${ref}'`)
    return ok(content.replace(/\n$/, ''))
  }
  const ref = arg
  const commits = await eng.repoLog(fs, dir, ref)
  if (commits.length === 0) return err(`fatal: bad revision '${ref}'`)
  const [c] = commits
  const date = new Date(c.author.timestamp * 1000).toUTCString()
  const header = `commit ${c.oid}\nAuthor: ${c.author.name} <${c.author.email}>\nDate:   ${date}\n\n    ${c.message}\n`
  const parent = c.parents[0]
  const changed = new Set([...(await eng.listFilesAtRef(fs, dir, c.oid)), ...(parent ? await eng.listFilesAtRef(fs, dir, parent) : [])])
  const diffs = []
  for (const filepath of changed) {
    const before = parent ? await eng.fileAtRef(fs, dir, parent, filepath) : null
    const after = await eng.fileAtRef(fs, dir, c.oid, filepath)
    const d = formatDiff(filepath, before, after)
    if (d) diffs.push(d)
  }
  return ok([header, ...diffs].join('\n'))
}

async function cmdTag(fs, dir, { positional }) {
  if (positional.length === 0) {
    const tags = await eng.listTagNames(fs, dir)
    return ok(tags.join('\n'))
  }
  const [name, ref = 'HEAD'] = positional
  await eng.createTag(fs, dir, name, ref)
  return ok('')
}

// --- Remotes (Tier 3) ---
// The "remote" is always the fixed sibling directory eng.remoteDirFor(dir) — see engine.js's
// comment on why (no real network layer in this sandbox). Its internal path never appears
// in output text; only the cosmetic url the student cloned with / configured via
// `remote add` is shown, matching what real git would actually print.

async function remoteUrlFor(fs, dir, remoteName) {
  const remotes = await eng.listRemoteConfigs(fs, dir)
  return remotes.find((r) => r.remote === remoteName)?.url ?? remoteName
}

async function cmdClone(fs, dir, { positional }) {
  if (positional.length === 0) return err('fatal: You must specify a repository to clone.')
  const url = positional[0]
  await eng.cloneFrom(fs, dir, eng.remoteDirFor(dir), { remoteName: 'origin', url })
  const name = url.split('/').pop().replace(/\.git$/, '') || 'repository'
  return ok(`Cloning into '${name}'...\ndone.`)
}

async function cmdRemote(fs, dir, { flags, positional }) {
  if (flags.has('v') || flags.has('verbose')) {
    const remotes = await eng.listRemoteConfigs(fs, dir)
    return ok(remotes.flatMap((r) => [`${r.remote}\t${r.url} (fetch)`, `${r.remote}\t${r.url} (push)`]).join('\n'))
  }
  if (positional[0] === 'add') {
    const [, name, url] = positional
    if (!name || !url) return err('usage: git remote add <name> <url>')
    await eng.addRemoteConfig(fs, dir, name, url)
    return ok('')
  }
  if (positional[0] === 'remove' || positional[0] === 'rm') {
    const [, name] = positional
    if (!name) return err('usage: git remote remove <name>')
    await eng.removeRemoteConfig(fs, dir, name)
    return ok('')
  }
  const remotes = await eng.listRemoteConfigs(fs, dir)
  return ok(remotes.map((r) => r.remote).join('\n'))
}

async function cmdFetch(fs, dir, { positional }) {
  const remoteName = positional[0] ?? 'origin'
  const url = await remoteUrlFor(fs, dir, remoteName)
  const branches = await eng.fetchFromRemote(fs, dir, eng.remoteDirFor(dir), remoteName)
  const lines = branches.map((b) => ` * branch            ${b}         -> FETCH_HEAD`)
  return ok([`From ${url}`, ...lines].join('\n'))
}

async function cmdPull(fs, dir, { positional }) {
  const remoteName = positional[0] ?? 'origin'
  const result = await eng.pullFromRemote(fs, dir, eng.remoteDirFor(dir), remoteName)
  if (result.conflict) {
    return err(
      `Auto-merging ${result.filepaths.join(', ')}\nCONFLICT (content): Merge conflict in ${result.filepaths.join(', ')}\nAutomatic merge failed; fix conflicts and then commit the result.`
    )
  }
  if (result.fastForward) return ok('Updating\nFast-forward')
  return ok(`Merge made by the 'ort' strategy.`)
}

async function cmdPush(fs, dir, { flags, positional }) {
  const remoteName = positional[0] ?? 'origin'
  const force = flags.has('force') || flags.has('f')
  const forceWithLease = flags.has('force-with-lease')
  const result = await eng.pushToRemote(fs, dir, eng.remoteDirFor(dir), remoteName, { force, forceWithLease })
  if (result.rejected) {
    if (result.staleLease) {
      return err(
        `! [rejected]        ${result.branch} -> ${result.branch} (stale info)\nerror: failed to push some refs\nhint: Updates were rejected because the remote ref has moved since you last\nhint: fetched it. Fetch again before forcing.`
      )
    }
    return err(
      `! [rejected]        ${result.branch} -> ${result.branch} (fetch first)\nerror: failed to push some refs\nhint: Updates were rejected because the remote contains work that you do\nhint: not have locally. This is usually caused by another repository pushing\nhint: to the same ref. You may want to first integrate the remote changes\nhint: (e.g., 'git pull ...') before pushing again.`
    )
  }
  const url = await remoteUrlFor(fs, dir, remoteName)
  const marker = result.created ? '* [new branch]     ' : '  '
  const forceNote = force || forceWithLease ? ' (forced update)' : ''
  return ok(`To ${url}\n${marker} ${result.branch} -> ${result.branch}${forceNote}`)
}

// --- Stash, cherry-pick, reflog, bisect (Tier 4) ---

async function cmdStash(fs, dir, { positional }) {
  const sub = positional[0]
  if (!sub || sub === 'push') {
    await eng.stashPush(fs, dir, positional.slice(sub === 'push' ? 1 : 0).join(' '))
    return ok('Saved working directory and index state WIP')
  }
  if (sub === 'pop') {
    await eng.stashPop(fs, dir)
    return ok('Dropped stash@{0}')
  }
  if (sub === 'apply' || sub === 'drop') {
    const refIdx = parseStashIndex(positional[1])
    if (sub === 'apply') await eng.stashApply(fs, dir, refIdx)
    else await eng.stashDrop(fs, dir, refIdx)
    return ok('')
  }
  if (sub === 'list') {
    // isomorphic-git's own list entries already come pre-formatted as "stash@{N}: <message>:
    // <oid> <summary>" — join as-is rather than re-wrapping with another index prefix.
    const entries = await eng.stashList(fs, dir)
    return ok(entries.join('\n'))
  }
  return err(`git: stash '${sub}' is not supported in this sandbox`)
}

// Accepts a bare index ("1") or the real stash@{1} syntax, defaulting to the most recent.
function parseStashIndex(arg) {
  if (!arg) return 0
  const match = /^(?:stash@\{(\d+)\}|(\d+))$/.exec(arg)
  return match ? Number(match[1] ?? match[2]) : 0
}

async function cmdCherryPick(fs, dir, { positional }) {
  if (positional.length === 0) return err('error: you must specify a commit to cherry-pick')
  const result = await eng.cherryPickCommit(fs, dir, positional[0])
  if (result.conflict) {
    return err(
      `CONFLICT (content): Merge conflict in ${result.filepaths.join(', ')}\nerror: could not apply commit\nhint: Resolve the conflict, then run "git add <file>" and "git commit".`
    )
  }
  return ok(`[${await eng.currentBranchName(fs, dir)} ${shortOid(await eng.headOid(fs, dir))}] cherry-picked`)
}

async function cmdReflog(fs, dir) {
  const entries = await eng.reflogEntries(fs, dir)
  return ok(entries.map((e, i) => `${shortOid(e.oid)} HEAD@{${i}}: ${e.message}`).join('\n'))
}

function formatBisectResult(result) {
  if (result.waitingFor) return ok(`status: waiting for ${result.waitingFor} commit(s), bad commit known`)
  if (result.done) return ok(`${shortOid(result.culprit)} is the first bad commit`)
  return ok(`Bisecting: ${Math.max(0, result.remaining - 1)} revisions left to test after this\n[${shortOid(result.checkedOut)}] checked out`)
}

async function cmdBisect(fs, dir, { positional }) {
  const sub = positional[0]
  if (sub === 'start') {
    await eng.bisectStart(fs, dir)
    return ok('')
  }
  if (sub === 'bad' || sub === 'good') {
    const result = await eng.bisectMark(fs, dir, sub, positional[1])
    return formatBisectResult(result)
  }
  if (sub === 'reset') {
    await eng.bisectResetState(fs, dir)
    return ok('')
  }
  return err(`git: bisect '${sub}' is not supported in this sandbox`)
}

function ok(stdout) {
  return { ok: true, stdout, stderr: '' }
}

function err(message) {
  return { ok: false, stdout: '', stderr: message }
}

const HANDLERS = {
  init: cmdInit,
  add: cmdAdd,
  commit: cmdCommit,
  status: cmdStatus,
  diff: cmdDiff,
  log: cmdLog,
  restore: cmdRestore,
  checkout: cmdCheckout,
  switch: cmdSwitch,
  branch: cmdBranch,
  merge: cmdMerge,
  rebase: cmdRebase,
  reset: cmdReset,
  revert: cmdRevert,
  show: cmdShow,
  tag: cmdTag,
  clone: cmdClone,
  remote: cmdRemote,
  fetch: cmdFetch,
  pull: cmdPull,
  push: cmdPush,
  stash: cmdStash,
  'cherry-pick': cmdCherryPick,
  reflog: cmdReflog,
  bisect: cmdBisect,
}

export async function runCommand(fs, dir, line) {
  const args = tokenize(line.trim())
  if (args.length === 0) return ok('')
  if (args[0] !== 'git') return err(`${args[0]}: command not found (this sandbox only runs git commands)`)
  const [sub, ...rest] = args.slice(1)
  const handler = HANDLERS[sub]
  if (!handler) return err(`git: '${sub}' is not supported in this sandbox`)
  try {
    return await handler(fs, dir, parseFlags(rest, { messageFlag: sub === 'commit' }))
  } catch (e) {
    return err(e.message ?? String(e))
  }
}

// Replays a scripted sequence of steps used by reference solutions, traps and the
// walkthrough reveal: each step is either a command-line string, { write: { path: content } }
// or { rm: path }.
export async function runSteps(fs, dir, steps) {
  const log = []
  for (const step of steps) {
    if (typeof step === 'string') {
      const result = await runCommand(fs, dir, step)
      log.push({ step, ...result })
      if (!result.ok) return { ok: false, log }
    } else if (step.write) {
      for (const [filepath, content] of Object.entries(step.write)) await eng.writeWorkingFile(fs, dir, filepath, content)
      log.push({ step: 'write', ok: true })
    } else if (step.rm) {
      await eng.removeWorkingFile(fs, dir, step.rm)
      log.push({ step: 'rm', ok: true })
    }
  }
  return { ok: true, log }
}
